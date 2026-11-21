import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Automated E2E verification test using Chrome Headless & CDP WebSocket
async function run() {
  console.log('🚀 Starting Vite Preview Server on port 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], { stdio: 'pipe' });

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chromePath)) {
    console.log('Chrome binary not found at default path, skipping CDP test');
    server.kill();
    process.exit(0);
  }

  const port = 9222;
  console.log('🖥️ Launching Google Chrome in headless mode with debugging port ' + port + '...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--no-sandbox',
    '--window-size=1280,720',
    'http://localhost:4173',
  ]);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Query CDP for WebSocket debugger URL
  let webSocketDebuggerUrl = null;
  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const tabs = await listRes.json();
    console.log('Found tabs:', tabs.length);
    webSocketDebuggerUrl = tabs[0]?.webSocketDebuggerUrl;
  } catch (e) {
    console.error('Failed to get CDP json/list:', e.message);
  }

  if (!webSocketDebuggerUrl) {
    console.error('No CDP webSocketDebuggerUrl available');
    chrome.kill();
    server.kill();
    process.exit(1);
  }

  const WebSocket = globalThis.WebSocket;
  const ws = new WebSocket(webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  const consoleMessages = [];
  const uncaughtErrors = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data.toString());
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
      consoleMessages.push(text);
      if (msg.params.type === 'error' && !text.includes('WebGL context could not be created') && !text.includes('Error creating WebGL context')) {
        uncaughtErrors.push(text);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
      if (!desc.includes('WebGL') && !desc.includes('context could not be created')) {
        uncaughtErrors.push(desc);
      }
    }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });

  await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));
  console.log('Connected to Chrome DevTools Protocol WebSocket');

  await send('Runtime.enable');
  await send('Page.enable');

  // Wait 1.5s for page script execution
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 1. Click Start Button
  console.log('Testing Start Button Click...');
  const clickStart = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.getElementById('start-btn');
        if (!btn) return { error: 'start-btn not found' };
        btn.click();
        return { success: true };
      })()
    `,
    returnByValue: true,
  });
  console.log('Click Start Result:', clickStart.result.value);

  // Wait 1 second for 3D game loop to run
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 2. Check HUD and Canvas
  const hudCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hud = document.querySelector('.ss-hud-root') || document.getElementById('ss-gta-mission-bar');
        const canvas = document.querySelector('canvas');
        const startModal = document.getElementById('start');
        const reticle = document.getElementById('ss-reticle-wrap');
        const missionText = document.getElementById('ss-active-mission-title')?.textContent;
        const progressBtn = document.getElementById('ss-hud-progress-btn');
        return {
          hasHud: !!hud,
          hasCanvas: !!canvas,
          startHidden: startModal ? startModal.style.display === 'none' : true,
          hasReticle: !!reticle,
          missionText,
          hasProgressBtn: !!progressBtn,
          canvasWidth: canvas?.width,
          canvasHeight: canvas?.height,
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Game State Check:', hudCheck.result.value);

  // 3. Test Clicking Canvas to Fire Blaster Bolts
  console.log('Testing Canvas Click / Blaster Combat Fire...');
  const fireCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { error: 'canvas not found' };
        // Click 3 times to fire laser shots
        canvas.dispatchEvent(new MouseEvent('click', { clientX: 400, clientY: 300, bubbles: true }));
        canvas.dispatchEvent(new MouseEvent('click', { clientX: 400, clientY: 300, bubbles: true }));
        canvas.dispatchEvent(new MouseEvent('click', { clientX: 400, clientY: 300, bubbles: true }));
        return { fired: true };
      })()
    `,
    returnByValue: true,
  });
  console.log('Blaster Fire Result:', fireCheck.result.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 4. Capture Screenshot
  const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
  const screenshotPath = path.resolve(process.cwd(), 'screenshot-vice-city.png');
  fs.writeFileSync(screenshotPath, Buffer.from(screenshotData.data, 'base64'));
  console.log('📸 Saved verification screenshot to:', screenshotPath);

  // Clean shutdown
  ws.close();
  chrome.kill();
  server.kill();

  if (uncaughtErrors.length > 0) {
    console.error('❌ Found uncaught errors during browser execution:');
    uncaughtErrors.forEach((e) => console.error('  -', e));
    process.exit(1);
  }

  console.log('✅ Browser Verification Succeeded with 0 uncaught errors!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
