/**
 * @fileoverview Pure 8-bit Retro Canvas Renderer.
 * Procedurally draws parallax horizons, 3-lane highway, pixel supercars, and analog tachometer.
 */

import { REV_ZONES, GEAR_CONFIG } from './racing-engine.js';

export class PixelRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Virtual 8-bit retro resolution
    this.width = 640;
    this.height = 360;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Track lane vertical coordinates
    this.lanesY = [190, 230, 270];

    // Starfield for parallax sky
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * 120,
        size: Math.random() > 0.8 ? 2 : 1,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    // STEM Billboards
    this.billboards = [
      { text: 'F = m·a', x: 300 },
      { text: 'E = m·c²', x: 700 },
      { text: 'v = Δx/Δt', x: 1100 },
      { text: 'H₂O + CO₂', x: 1500 },
      { text: 'NaCl UNIT CELL', x: 1900 },
      { text: 'WATSON-CRICK DNA', x: 2300 }
    ];

    this.wheelRotation = 0;
  }

  resize(viewportWidth, viewportHeight) {
    // Keep internal canvas resolution at 640x360 for crisp 8-bit pixelation
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  render(engine, quizController, activeLanguage = 'hi') {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // 1. Clear background & Draw Sky
    this.drawSky(engine);

    // 2. Draw Distant Parallax Skyline
    this.drawSkyline(engine);

    // 3. Draw STEM Billboards
    this.drawBillboards(engine);

    // 4. Draw Road & Lanes
    this.drawRoad(engine);

    // 5. Draw Track Pickups & Obstacles
    this.drawTrackItems(engine);

    // 6. Draw Vehicles (Rival & Player)
    this.drawVehicles(engine);

    // 7. Draw Cockpit Dashboard & Tachometer
    this.drawCockpitGauge(engine);

    // 8. Draw Top HUD (Minimap, Nitro, Shield, Telemetry)
    this.drawHud(engine, activeLanguage);

    // 9. Draw STEM Radio Intercom if active
    if (quizController && quizController.isActive) {
      this.drawQuizConsole(quizController, activeLanguage);
    }

    // 10. Draw Countdown if in countdown state
    if (engine.status === 'countdown') {
      this.drawCountdown(engine.countdownTime);
    } else if (engine.status === 'finished') {
      this.drawFinishBanner(engine, activeLanguage);
    }
  }

  drawSky(engine) {
    const ctx = this.ctx;

    // Retro twilight sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 140);
    skyGrad.addColorStop(0, '#0a0520');
    skyGrad.addColorStop(0.6, '#180a3a');
    skyGrad.addColorStop(1, '#3b145a');

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, 140);

    // Twinkling 8-bit stars
    ctx.fillStyle = '#ffffff';
    const playerDist = engine.player.distance;

    for (const star of this.stars) {
      const sx = (star.x - playerDist * 0.05) % this.width;
      const drawX = sx < 0 ? sx + this.width : sx;
      star.twinkle += 0.05;
      const alpha = 0.5 + Math.sin(star.twinkle) * 0.5;

      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.floor(drawX), Math.floor(star.y), star.size, star.size);
    }
    ctx.globalAlpha = 1.0;

    // Retro 8-bit glowing Moon / Sun
    ctx.fillStyle = '#ffdf6d';
    ctx.fillRect(520, 20, 32, 32);
    ctx.fillStyle = '#ffe99a';
    ctx.fillRect(524, 24, 24, 24);
  }

  drawSkyline(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;
    const offset = (playerDist * 0.2) % 320;

    // Silhouette of cyber buildings with pixel windows
    ctx.fillStyle = '#1c0c32';
    for (let i = -1; i < 5; i++) {
      const bx = i * 160 - offset;
      ctx.fillRect(bx, 60, 48, 80);
      ctx.fillRect(bx + 40, 40, 52, 100);
      ctx.fillRect(bx + 85, 75, 45, 65);
      ctx.fillRect(bx + 125, 30, 35, 110);

      // Glowing cyan & yellow windows
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(bx + 8, 70, 4, 4);
      ctx.fillRect(bx + 20, 85, 4, 4);
      ctx.fillRect(bx + 52, 50, 4, 4);
      ctx.fillRect(bx + 68, 90, 4, 4);
      ctx.fillRect(bx + 132, 45, 4, 4);

      ctx.fillStyle = '#ff0077';
      ctx.fillRect(bx + 8, 95, 4, 4);
      ctx.fillRect(bx + 52, 110, 4, 4);
      ctx.fillRect(bx + 100, 85, 4, 4);

      ctx.fillStyle = '#1c0c32';
    }
  }

  drawBillboards(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    for (const b of this.billboards) {
      const screenX = (b.x - playerDist * 0.6) % (this.width * 2);
      if (screenX > -120 && screenX < this.width + 120) {
        // Frame
        ctx.fillStyle = '#222233';
        ctx.fillRect(screenX, 85, 110, 40);
        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX + 3, 88, 104, 34);

        // Neon Border
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX + 3, 88, 104, 34);

        // Text
        ctx.fillStyle = '#fffa65';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b.text, screenX + 55, 109);

        // Legs
        ctx.fillStyle = '#555566';
        ctx.fillRect(screenX + 20, 125, 4, 25);
        ctx.fillRect(screenX + 85, 125, 4, 25);
      }
    }
    ctx.textAlign = 'left';
  }

  drawRoad(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    // Roadbed asphalt (Dark tarmac)
    ctx.fillStyle = '#22222e';
    ctx.fillRect(0, 150, this.width, 150);

    // Upper and Lower curbstones (Red & White checkered stripes)
    const curbScroll = Math.floor(playerDist * 1.5) % 32;
    for (let x = -32; x < this.width + 32; x += 32) {
      const isRed = Math.floor((x + curbScroll) / 32) % 2 === 0;
      ctx.fillStyle = isRed ? '#e71d36' : '#ffffff';
      // Upper curb
      ctx.fillRect(x - curbScroll, 146, 32, 6);
      // Lower curb
      ctx.fillRect(x - curbScroll, 298, 32, 6);
    }

    // Dashed Lane dividers (White dashed lines)
    ctx.fillStyle = '#f8f9fa';
    const dashScroll = Math.floor(playerDist * 2.0) % 40;

    for (let x = -40; x < this.width + 40; x += 40) {
      // Divider between lane 0 and 1
      ctx.fillRect(x - dashScroll, 205, 20, 3);
      // Divider between lane 1 and 2
      ctx.fillRect(x - dashScroll, 250, 20, 3);
    }

    // Guardrail barriers
    ctx.fillStyle = '#444455';
    ctx.fillRect(0, 142, this.width, 4);
    ctx.fillRect(0, 304, this.width, 4);
  }

  drawTrackItems(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    for (const item of engine.pickups) {
      if (item.collected) continue;

      // Calculate screen X relative to player (player car is fixed horizontally at x=140)
      const relDist = item.distance - playerDist;
      const screenX = 140 + relDist * 4.0;

      if (screenX > -30 && screenX < this.width + 30) {
        const itemY = this.lanesY[item.lane] - 4;

        if (item.type === 'battery') {
          // Quantum Battery (+Nitro)
          ctx.fillStyle = '#00ffcc';
          ctx.fillRect(screenX, itemY, 14, 10);
          ctx.fillStyle = '#000000';
          ctx.fillRect(screenX + 2, itemY + 2, 10, 6);
          ctx.fillStyle = '#00ffcc';
          ctx.fillRect(screenX + 14, itemY + 3, 2, 4);
          // Lightning bolt
          ctx.fillStyle = '#fffa65';
          ctx.fillRect(screenX + 6, itemY + 3, 3, 2);
          ctx.fillRect(screenX + 5, itemY + 5, 4, 2);
        } else if (item.type === 'chip') {
          // Formula Chip (+Score)
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(screenX, itemY, 12, 12);
          ctx.fillStyle = '#073b4c';
          ctx.fillRect(screenX + 2, itemY + 2, 8, 8);
          // Chip pins
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(screenX - 2, itemY + 2, 2, 2);
          ctx.fillRect(screenX - 2, itemY + 8, 2, 2);
          ctx.fillRect(screenX + 12, itemY + 2, 2, 2);
          ctx.fillRect(screenX + 12, itemY + 8, 2, 2);
        } else if (item.type === 'booster') {
          // Kinetic Booster (+Speed)
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(screenX, itemY + 1, 14, 8);
          ctx.fillStyle = '#ffffff';
          // Chevron
          ctx.fillRect(screenX + 3, itemY + 3, 4, 4);
          ctx.fillRect(screenX + 7, itemY + 3, 4, 4);
        } else if (item.type === 'slick') {
          // Oil Slick (Hazard)
          ctx.fillStyle = '#111116';
          ctx.fillRect(screenX, itemY + 4, 18, 6);
          ctx.fillStyle = '#332244';
          ctx.fillRect(screenX + 3, itemY + 2, 12, 4);
        }
      }
    }
  }

  drawVehicles(engine) {
    const ctx = this.ctx;
    this.wheelRotation += engine.player.speed * 0.05;

    // 1. Draw Rival Car
    const distDelta = engine.rival.distance - engine.player.distance;
    const rivalScreenX = 140 + distDelta * 4.0;
    const rivalY = this.lanesY[engine.rival.lane];

    if (rivalScreenX > -80 && rivalScreenX < this.width + 80) {
      this.drawCarSprite(rivalScreenX, rivalY, '#e63946', '#1d3557', false, engine.rival.isNitroActive, 'RIVAL');
    }

    // 2. Draw Player Car (Stationed horizontally at x=140)
    const playerY = this.lanesY[engine.player.lane];
    this.drawCarSprite(
      140,
      playerY,
      '#06d6a0',
      '#118ab2',
      true,
      engine.player.isNitroActive,
      'PLAYER',
      engine.player.stallTimer > 0
    );
  }

  drawCarSprite(x, y, primaryColor, secondaryColor, isPlayer, isNitro, label, isStalled = false) {
    const ctx = this.ctx;
    const bob = isStalled ? (Math.random() > 0.5 ? 1 : -1) : Math.sin(this.wheelRotation) > 0.7 ? 1 : 0;
    const cy = y - 12 + bob;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x + 2, y + 6, 42, 6);

    // Car Body (Wedge Shape)
    ctx.fillStyle = primaryColor;
    ctx.fillRect(x + 4, cy + 4, 36, 10);
    ctx.fillRect(x + 12, cy, 22, 6);

    // Cockpit / Windshield
    ctx.fillStyle = '#0df';
    ctx.fillRect(x + 18, cy + 1, 12, 4);

    // Rear Spoiler
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x, cy + 1, 4, 7);
    ctx.fillRect(x - 2, cy - 1, 8, 2);

    // Front Bumper / Splitter
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x + 38, cy + 8, 6, 5);

    // Animated Wheels (Pixel Black & Silver)
    const wheelFrame = Math.floor(this.wheelRotation) % 2;
    ctx.fillStyle = '#111';
    ctx.fillRect(x + 8, cy + 11, 7, 7);
    ctx.fillRect(x + 30, cy + 11, 7, 7);

    // Rim spoke sparkle
    ctx.fillStyle = wheelFrame === 0 ? '#eee' : '#888';
    ctx.fillRect(x + 10, cy + 13, 3, 3);
    ctx.fillRect(x + 32, cy + 13, 3, 3);

    // Headlight Beam
    if (isPlayer) {
      ctx.fillStyle = 'rgba(255, 255, 180, 0.2)';
      ctx.beginPath();
      ctx.moveTo(x + 44, cy + 7);
      ctx.lineTo(x + 140, cy - 10);
      ctx.lineTo(x + 140, cy + 24);
      ctx.closePath();
      ctx.fill();
    }

    // Exhaust Fire
    if (isNitro) {
      // Super Nitro Cyan Plasma Jet
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(x - 16, cy + 8, 14, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 10, cy + 9, 8, 2);
    } else if (!isStalled && Math.random() > 0.4) {
      // Normal Exhaust Flame
      ctx.fillStyle = '#ff7b00';
      ctx.fillRect(x - 8, cy + 8, 6, 3);
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(x - 4, cy + 9, 3, 1);
    }
  }

  // --- 8-BIT TACHOMETER & SPEEDOMETER GAUGE ---

  drawCockpitGauge(engine) {
    const ctx = this.ctx;
    const gx = this.width / 2;
    const gy = 310;
    const radius = 42;

    // Outer Gauge Chrome Bezel
    ctx.fillStyle = '#1b1b22';
    ctx.beginPath();
    ctx.arc(gx, gy, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#555566';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Gauge Face
    ctx.fillStyle = '#0a0a0f';
    ctx.beginPath();
    ctx.arc(gx, gy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Arc Zones (-135 deg to +135 deg, total 270 deg)
    // 0 to 5800 RPM: Yellow
    // 5800 to 7000 RPM: Green (Sweet Spot!)
    // 7000 to 9000 RPM: Red (Redline)
    const startAngle = Math.PI * 0.75;
    const totalSweep = Math.PI * 1.5;

    const yellowFraction = REV_ZONES.GREEN_MIN / REV_ZONES.MAX_RPM;
    const greenFraction = REV_ZONES.GREEN_MAX / REV_ZONES.MAX_RPM;

    const yellowEndAngle = startAngle + totalSweep * yellowFraction;
    const greenEndAngle = startAngle + totalSweep * greenFraction;
    const redEndAngle = startAngle + totalSweep;

    // Yellow Arc
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(gx, gy, radius - 6, startAngle, yellowEndAngle);
    ctx.stroke();

    // Green Arc (Sweet Shift Zone)
    ctx.strokeStyle = '#06d6a0';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(gx, gy, radius - 6, yellowEndAngle, greenEndAngle);
    ctx.stroke();

    // Red Arc (Overrev)
    ctx.strokeStyle = '#e71d36';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(gx, gy, radius - 6, greenEndAngle, redEndAngle);
    ctx.stroke();

    // Sweeping Needle
    const currentRpm = Math.max(0, Math.min(REV_ZONES.MAX_RPM, engine.player.rpm));
    const needleFraction = currentRpm / REV_ZONES.MAX_RPM;
    const needleAngle = startAngle + totalSweep * needleFraction;

    const nx = gx + Math.cos(needleAngle) * (radius - 10);
    const ny = gy + Math.sin(needleAngle) * (radius - 10);

    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    // Center Pivot Cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(gx, gy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Shift Light Banner & Gear Box
    this.drawShiftBanner(engine, gx, gy - radius - 16);
  }

  drawShiftBanner(engine, x, y) {
    const ctx = this.ctx;
    const rpm = engine.player.rpm;
    const feedback = engine.player.shiftFeedback;

    let bannerText = '[ GEAR ' + engine.player.gear + ' ]';
    let bannerColor = '#ffffff';

    if (feedback.text && feedback.timer > 0) {
      bannerText = feedback.text;
      bannerColor =
        feedback.type === 'perfect'
          ? '#06d6a0'
          : feedback.type === 'stall'
            ? '#e71d36'
            : feedback.type === 'pickup'
              ? '#ffd166'
              : '#f77f00';
    } else if (rpm >= REV_ZONES.GREEN_MIN && rpm <= REV_ZONES.GREEN_MAX) {
      bannerText = 'SHIFT NOW! [SPACE]';
      bannerColor = Math.sin(Date.now() * 0.02) > 0 ? '#06d6a0' : '#ffffff';
    } else if (rpm > REV_ZONES.REDLINE) {
      bannerText = 'OVERREV! REDLINE';
      bannerColor = '#e71d36';
    }

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(x - 90, y - 10, 180, 16);
    ctx.strokeStyle = bannerColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 90, y - 10, 180, 16);

    ctx.fillStyle = bannerColor;
    ctx.fillText(bannerText, x, y + 2);
    ctx.textAlign = 'left';
  }

  drawHud(engine, activeLanguage) {
    const ctx = this.ctx;
    const t = engine.getTelemetry();

    // --- Top Black Status Bar ---
    ctx.fillStyle = '#080810';
    ctx.fillRect(0, 0, this.width, 32);
    ctx.fillStyle = '#333344';
    ctx.fillRect(0, 31, this.width, 1);

    ctx.font = '8px "Press Start 2P", monospace';

    // 1. Digital Speedometer
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`${t.speed} KM/H`, 12, 14);

    // 2. RPM Readout
    ctx.fillStyle = '#ffd166';
    ctx.fillText(`${t.rpm} RPM`, 12, 26);

    // 3. Mini Track Progress Bar (Center)
    const trackBarW = 200;
    const trackBarX = this.width / 2 - trackBarW / 2;
    ctx.fillStyle = '#1c1c28';
    ctx.fillRect(trackBarX, 10, trackBarW, 12);
    ctx.strokeStyle = '#444455';
    ctx.strokeRect(trackBarX, 10, trackBarW, 12);

    // Player Pin
    const pFrac = Math.min(1.0, engine.player.distance / engine.trackLength);
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(trackBarX + pFrac * (trackBarW - 6), 11, 6, 10);

    // Rival Pin
    const rFrac = Math.min(1.0, engine.rival.distance / engine.trackLength);
    ctx.fillStyle = '#e71d36';
    ctx.fillRect(trackBarX + rFrac * (trackBarW - 4), 13, 4, 6);

    // 4. Nitro Bar (Right)
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NITRO', 440, 14);
    ctx.fillStyle = '#222';
    ctx.fillRect(495, 6, 60, 10);
    ctx.fillStyle = '#0df';
    ctx.fillRect(497, 8, Math.floor((t.nitro / 100) * 56), 6);

    // 5. Shield Bar
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SHIELD', 440, 26);
    ctx.fillStyle = '#222';
    ctx.fillRect(495, 18, 60, 10);
    ctx.fillStyle = t.shield > 25 ? '#06d6a0' : '#e71d36';
    ctx.fillRect(497, 20, Math.floor((t.shield / 100) * 56), 6);

    // 6. 4D Telemetry Banner (Bottom Left/Right)
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(8, this.height - 24, 180, 18);
    ctx.strokeStyle = '#00f0ff';
    ctx.strokeRect(8, this.height - 24, 180, 18);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText(`DIST: ${t.distance}m / ${engine.trackLength}m`, 14, this.height - 12);

    // Score on right
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(this.width - 150, this.height - 24, 142, 18);
    ctx.strokeStyle = '#ffd166';
    ctx.strokeRect(this.width - 150, this.height - 24, 142, 18);

    ctx.fillStyle = '#ffd166';
    ctx.fillText(`SCORE: ${t.score}`, this.width - 142, this.height - 12);
  }

  drawQuizConsole(quiz, activeLanguage) {
    const ctx = this.ctx;
    const q = quiz.currentQuestion;
    if (!q) return;

    // Semi-transparent 8-bit cockpit terminal overlay
    ctx.fillStyle = 'rgba(8, 8, 16, 0.94)';
    ctx.fillRect(60, 45, 520, 175);
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(60, 45, 520, 175);

    // Header Tag
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(64, 48, 180, 14);
    ctx.fillStyle = '#000000';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText('[ STEM RADIO INTERCOM ]', 70, 58);

    // Question Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    this.wrapText(ctx, q.text, 80, 78, 480, 14);

    // 4 Options Grid (2x2)
    const optY = 110;
    for (let i = 0; i < q.options.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const bx = 80 + col * 240;
      const by = optY + row * 38;

      ctx.fillStyle = '#181826';
      ctx.fillRect(bx, by, 225, 30);
      ctx.strokeStyle = '#555577';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, 225, 30);

      ctx.fillStyle = '#ffd166';
      ctx.fillText(`[${i + 1}]`, bx + 8, by + 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = '7px "Press Start 2P", monospace';
      const label = q.options[i];
      ctx.fillText(label.length > 24 ? label.slice(0, 22) + '...' : label, bx + 36, by + 18);
      ctx.font = '8px "Press Start 2P", monospace';
    }

    // Hint banner at bottom
    ctx.fillStyle = '#8888aa';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('PRESS 1, 2, 3, OR 4 ON KEYBOARD OR TAP BUTTON', 80, 205);
  }

  drawCountdown(timer) {
    const ctx = this.ctx;
    const count = Math.ceil(timer);
    const text = count > 0 ? String(count) : 'GO!';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = count === 0 ? '#06d6a0' : '#ffd166';
    ctx.fillText(text, this.width / 2, this.height / 2 + 10);
    ctx.textAlign = 'left';
  }

  drawFinishBanner(engine, activeLanguage) {
    const ctx = this.ctx;
    const playerWon = engine.player.finishTime <= engine.rival.finishTime;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = '20px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    if (playerWon) {
      ctx.fillStyle = '#06d6a0';
      ctx.fillText('GRAND PRIX VICTORY!', this.width / 2, 130);
    } else {
      ctx.fillStyle = '#e71d36';
      ctx.fillText('RIVAL TOOK THE CUP!', this.width / 2, 130);
    }

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`PLAYER TIME: ${engine.player.finishTime.toFixed(2)}s`, this.width / 2, 170);
    ctx.fillText(`RIVAL TIME:  ${engine.rival.finishTime.toFixed(2)}s`, this.width / 2, 195);
    ctx.fillText(`FINAL SCORE: ${engine.player.score}`, this.width / 2, 220);

    ctx.fillStyle = '#ffd166';
    ctx.fillText('PRESS [SPACE] OR CLICK TO RESTART', this.width / 2, 260);
    ctx.textAlign = 'left';
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  }
}
