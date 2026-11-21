import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Automated E2E verification test using Chrome Headless & CDP WebSocket for 8-Bit Racing Game
async function run() {
  console.log('[START] Starting Vite Preview Server on port 4173...');
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
  console.log('[CHROME] Launching Google Chrome in headless mode with debugging port ' + port + '...');
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
      if (msg.params.type === 'error') {
        uncaughtErrors.push(text);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
      uncaughtErrors.push(desc);
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

  // 1. Click Start Race Button
  console.log('Testing Start Race Button Click...');
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

  await new Promise((resolve) => setTimeout(resolve, 800));

  // 2. Check 8-Bit Canvas & Engine State
  const gameStateCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.getElementById('game-canvas');
        const startModal = document.getElementById('start');
        const app = window.__SANKHYA__;
        const engine = app?.engine;
        const quiz = app?.quiz;
        return {
          hasCanvas: !!canvas,
          startHidden: startModal ? startModal.classList.contains('hidden') : true,
          canvasWidth: canvas?.width,
          canvasHeight: canvas?.height,
          engineStatus: engine?.status,
          initialGear: engine?.player?.gear,
          initialRpm: engine?.player?.rpm,
          trackLength: engine?.trackLength,
          rivalName: engine?.rival?.name
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Game State Check:', gameStateCheck.result.value);

  const state = gameStateCheck.result.value;
  if (!state.hasCanvas || !state.startHidden) {
    uncaughtErrors.push('8-bit canvas or Start overlay not in expected state');
  }
  if (!state.engineStatus || state.initialGear !== 1) {
    uncaughtErrors.push('Engine state invalid after race start');
  }

  // 3. Test Tachometer Gear Shifting in Green Zone
  console.log('Testing Gear Shifting (Perfect Shift in Sweet Spot)...');
  const shiftCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const engine = window.__SANKHYA__?.engine;
        engine.status = 'racing';
        engine.player.rpm = 6400; // Inside green sweet spot (5800-7000)
        engine.shiftUp();
        return {
          gear: engine.player.gear,
          feedbackText: engine.player.shiftFeedback.text,
          feedbackType: engine.player.shiftFeedback.type,
          perfectCount: engine.player.perfectShifts,
          nitro: engine.player.nitro
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Shift Result:', shiftCheck.result.value);

  if (shiftCheck.result.value?.gear !== 2 || shiftCheck.result.value?.feedbackType !== 'perfect') {
    uncaughtErrors.push('Perfect Shift failed to advance gear or award bonus');
  }

  // 4. Test Lane Steering
  console.log('Testing Lane Steering (Lane 1 -> Lane 2)...');
  const steerCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const engine = window.__SANKHYA__?.engine;
        engine.steerLane(1);
        return { lane: engine.player.lane };
      })()
    `,
    returnByValue: true,
  });
  console.log('Steer Result:', steerCheck.result.value);
  if (steerCheck.result.value?.lane !== 2) {
    uncaughtErrors.push('Lane steering failed to change lane');
  }

  // 5. Test Super Nitro Activation
  console.log('Testing Nitro Overdrive Activation...');
  const nitroCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const engine = window.__SANKHYA__?.engine;
        engine.player.nitro = 60;
        const activated = engine.activateNitro();
        return {
          activated,
          isNitroActive: engine.player.isNitroActive,
          remainingNitro: engine.player.nitro
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Nitro Result:', nitroCheck.result.value);
  if (!nitroCheck.result.value?.isNitroActive) {
    uncaughtErrors.push('Nitro activation failed');
  }

  // 6. Test STEM Radio Checkpoint Question
  console.log('Testing STEM Pitstop Intercom Question Answering...');
  const quizCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const app = window.__SANKHYA__;
        const q = app.quiz.nextQuestion();
        const correctIndex = q.correctIndex;
        // Submit correct answer
        app.handleQuizSubmit(correctIndex);
        return {
          questionText: q.text,
          correctIndex,
          score: app.engine.player.score,
          nitro: app.engine.player.nitro,
          streak: app.quiz.streak
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('STEM Quiz Result:', quizCheck.result.value);
  if (quizCheck.result.value?.streak !== 1 || quizCheck.result.value?.score < 1000) {
    uncaughtErrors.push('STEM Quiz failed to process correct answer and award score');
  }

  // Wait 1.2s for race loop and rendering
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // 7. Verify Car Distance Progress
  const distanceCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const engine = window.__SANKHYA__?.engine;
        return {
          playerDist: engine.player.distance,
          rivalDist: engine.rival.distance,
          speed: engine.player.speed,
          rpm: engine.player.rpm
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Distance Check:', distanceCheck.result.value);
  if (distanceCheck.result.value?.playerDist <= 0) {
    uncaughtErrors.push('Player vehicle failed to advance distance down the track');
  }

  // 8. Capture Screenshot
  const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
  const screenshotPath = path.resolve(process.cwd(), 'screenshot-8bit-racing.png');
  fs.writeFileSync(screenshotPath, Buffer.from(screenshotData.data, 'base64'));
  console.log('[SCREENSHOT] Saved verification screenshot to:', screenshotPath);

  // Clean shutdown
  ws.close();
  chrome.kill();
  server.kill();

  console.log('Browser Console Messages:', consoleMessages);
  if (uncaughtErrors.length > 0) {
    console.error('[ERROR] Found uncaught errors during browser execution:');
    uncaughtErrors.forEach((e) => console.error('  -', e));
    process.exit(1);
  }

  console.log('[SUCCESS] 8-Bit Racing Browser Verification Succeeded with 0 uncaught errors!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
