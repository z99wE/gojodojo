/**
 * @fileoverview Pure 8-bit Retro Canvas Renderer with continuous lateral track positioning,
 * real off-road physics feedback, rival car collision sparks, screen shake,
 * physiological anxiety heartbeat pulse, and crystal-clear Devanagari / Latin typography.
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

    // Center of asphalt track is Y=230, width between edges is ~110px
    this.trackCenterY = 230;
    this.trackHalfWidth = 55;

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
      { text: 'F = m·a (Newton)', x: 300 },
      { text: 'E = m·c² (Einstein)', x: 700 },
      { text: 'v = Δx/Δt (Velocity)', x: 1100 },
      { text: 'H₂O + CO₂ (Photosynthesis)', x: 1500 },
      { text: 'NaCl UNIT CELL (Chemistry)', x: 1900 },
      { text: 'WATSON-CRICK DNA', x: 2300 }
    ];

    this.wheelRotation = 0;
    this.sparkParticles = [];
    this.dustParticles = [];
  }

  resize(viewportWidth, viewportHeight) {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  render(engine, quizController, activeLanguage = 'hi') {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // 0. Screen Shake on Collisions / Crashes
    if (engine.screenShake > 0) {
      const shakeMag = (engine.screenShake / 0.35) * 8;
      const offsetX = (Math.random() - 0.5) * shakeMag;
      const offsetY = (Math.random() - 0.5) * shakeMag;
      ctx.translate(offsetX, offsetY);
    }

    // 1. Clear background & Draw Sky
    this.drawSky(engine);

    // 2. Draw Distant Parallax Skyline
    this.drawSkyline(engine);

    // 3. Draw STEM Billboards
    this.drawBillboards(engine);

    // 4. Draw Road, Grass Shoulders & Guardrails
    this.drawRoad(engine);

    // 5. Draw Track Pickups & Obstacles
    this.drawTrackItems(engine);

    // 6. Draw Vehicles (Rival & Player) & Particles
    this.drawVehicles(engine);

    // 7. Draw Cockpit Dashboard & Tachometer
    this.drawCockpitGauge(engine);

    // 8. Draw Top HUD (Minimap, Nitro, Shield, Heartbeat BPM, Telemetry)
    this.drawHud(engine, activeLanguage);

    // 9. Draw Anxiety Red Vignette or Zen Focus Aura
    this.drawAnxietyAndFocusEffects(engine);

    // 10. Draw Countdown if in countdown state
    if (engine.status === 'countdown') {
      this.drawCountdown(engine.countdownTime);
    } else if (engine.status === 'finished') {
      this.drawFinishBanner(engine, activeLanguage);
    }

    ctx.restore();
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

    // Twinkling stars
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

    // Retro 8-bit glowing Sun
    ctx.fillStyle = '#ffdf6d';
    ctx.fillRect(520, 20, 32, 32);
    ctx.fillStyle = '#ffe99a';
    ctx.fillRect(524, 24, 24, 24);
  }

  drawSkyline(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;
    const offset = (playerDist * 0.2) % 320;

    ctx.fillStyle = '#1c0c32';
    for (let i = -1; i < 5; i++) {
      const bx = i * 160 - offset;
      ctx.fillRect(bx, 60, 48, 80);
      ctx.fillRect(bx + 40, 40, 52, 100);
      ctx.fillRect(bx + 85, 75, 45, 65);
      ctx.fillRect(bx + 125, 30, 35, 110);

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
      if (screenX > -140 && screenX < this.width + 140) {
        ctx.fillStyle = '#222233';
        ctx.fillRect(screenX, 85, 130, 40);
        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX + 3, 88, 124, 34);

        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX + 3, 88, 124, 34);

        ctx.fillStyle = '#fffa65';
        ctx.font = '11px "Share Tech Mono", "Mukta", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b.text, screenX + 65, 109);

        ctx.fillStyle = '#555566';
        ctx.fillRect(screenX + 25, 125, 4, 25);
        ctx.fillRect(screenX + 100, 125, 4, 25);
      }
    }
    ctx.textAlign = 'left';
  }

  drawRoad(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    // 1. Top and Bottom Grass / Dirt Shoulders
    ctx.fillStyle = '#183818'; // Dark green grass
    ctx.fillRect(0, 140, this.width, 172);

    // 2. Asphalt Road Tarmac (from Y=165 to Y=295)
    ctx.fillStyle = '#22222e';
    ctx.fillRect(0, 168, this.width, 124);

    // 3. Red & White Checkered Curbstones at road boundaries
    const curbScroll = Math.floor(playerDist * 1.5) % 32;
    for (let x = -32; x < this.width + 32; x += 32) {
      const isRed = Math.floor((x + curbScroll) / 32) % 2 === 0;
      ctx.fillStyle = isRed ? '#e71d36' : '#ffffff';
      // Upper curb at Y=164
      ctx.fillRect(x - curbScroll, 164, 32, 5);
      // Lower curb at Y=292
      ctx.fillRect(x - curbScroll, 292, 32, 5);
    }

    // 4. White Dashed Lane Dividers (3 lanes)
    ctx.fillStyle = '#f8f9fa';
    const dashScroll = Math.floor(playerDist * 2.2) % 40;

    for (let x = -40; x < this.width + 40; x += 40) {
      // Top Lane divider (Y=208)
      ctx.fillRect(x - dashScroll, 208, 20, 2);
      // Bottom Lane divider (Y=252)
      ctx.fillRect(x - dashScroll, 252, 20, 2);
    }

    // 5. Roadside Crash Guardrails at Y=144 and Y=308
    ctx.fillStyle = '#555566';
    ctx.fillRect(0, 145, this.width, 5);
    ctx.fillRect(0, 308, this.width, 5);
    ctx.fillStyle = '#888899';
    ctx.fillRect(0, 146, this.width, 2);
    ctx.fillRect(0, 309, this.width, 2);
  }

  drawTrackItems(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    for (const item of engine.pickups) {
      if (item.collected) continue;

      const relDist = item.distance - playerDist;
      const screenX = 140 + relDist * 4.0;

      if (screenX > -30 && screenX < this.width + 30) {
        // Map lateral x to screen Y
        const itemY = this.trackCenterY + item.x * this.trackHalfWidth - 6;

        if (item.type === 'battery') {
          // Quantum Battery (+Nitro)
          ctx.fillStyle = '#00ffcc';
          ctx.fillRect(screenX, itemY, 14, 10);
          ctx.fillStyle = '#000000';
          ctx.fillRect(screenX + 2, itemY + 2, 10, 6);
          ctx.fillStyle = '#fffa65';
          ctx.fillRect(screenX + 6, itemY + 3, 3, 2);
          ctx.fillRect(screenX + 5, itemY + 5, 4, 2);
        } else if (item.type === 'chip') {
          // Formula Chip (+Score)
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(screenX, itemY, 12, 12);
          ctx.fillStyle = '#073b4c';
          ctx.fillRect(screenX + 2, itemY + 2, 8, 8);
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
          ctx.fillRect(screenX + 3, itemY + 3, 4, 4);
          ctx.fillRect(screenX + 7, itemY + 3, 4, 4);
        } else if (item.type === 'slick') {
          // Oil Slick (Hazard)
          ctx.fillStyle = '#111116';
          ctx.fillRect(screenX, itemY + 4, 20, 8);
          ctx.fillStyle = '#3a2255';
          ctx.fillRect(screenX + 3, itemY + 2, 14, 6);
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
    const rivalY = this.trackCenterY + engine.rival.x * this.trackHalfWidth;

    if (rivalScreenX > -90 && rivalScreenX < this.width + 90) {
      this.drawCarSprite(
        rivalScreenX,
        rivalY,
        '#e63946',
        '#1d3557',
        false,
        engine.rival.isNitroActive,
        engine.rival.name
      );
    }

    // 2. Draw Player Car with continuous Y mapped from player.x
    const playerY = this.trackCenterY + engine.player.x * this.trackHalfWidth;

    // Spawn dust particles if off-road
    if (engine.player.isOffRoad && engine.player.speed > 10) {
      this.dustParticles.push({
        x: 135,
        y: playerY + 5 + (Math.random() - 0.5) * 8,
        vx: -Math.random() * 4 - 2,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 3 + 2,
        color: '#4a6b32',
        life: 0.35
      });
    }

    // Spawn sparks if crash event active
    if (engine.crashEvent) {
      for (let i = 0; i < 4; i++) {
        this.sparkParticles.push({
          x: 155 + (Math.random() - 0.5) * 20,
          y: playerY + (Math.random() - 0.5) * 15,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '#fffa65' : '#ff5964',
          life: 0.25
        });
      }
    }

    // Update and draw particles
    this.updateAndDrawParticles(ctx);

    // Draw Player Car Sprite
    this.drawCarSprite(
      140,
      playerY,
      '#06d6a0',
      '#118ab2',
      true,
      engine.player.isNitroActive,
      'PLAYER',
      engine.player.stallTimer > 0,
      engine.player.isBraking
    );
  }

  updateAndDrawParticles(ctx) {
    // Dust Particles
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      if (p.life <= 0) {
        this.dustParticles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 0.35;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    // Spark Particles
    for (let i = this.sparkParticles.length - 1; i >= 0; i--) {
      const p = this.sparkParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) {
        this.sparkParticles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 0.25;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1.0;
  }

  drawCarSprite(x, y, primaryColor, secondaryColor, isPlayer, isNitro, label, isStalled = false, isBraking = false) {
    const ctx = this.ctx;
    const bob = isStalled ? (Math.random() > 0.5 ? 1 : -1) : Math.sin(this.wheelRotation) > 0.7 ? 1 : 0;
    const cy = y - 12 + bob;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x + 2, y + 6, 44, 6);

    // Nitro Jet Flames
    if (isNitro) {
      const flameLen = 14 + Math.floor(Math.random() * 12);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(x - flameLen, cy + 4, flameLen, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - flameLen + 4, cy + 5, flameLen - 6, 2);
    }

    // Chassis Base
    ctx.fillStyle = primaryColor;
    ctx.fillRect(x + 4, cy + 4, 38, 8);

    // Aerodynamic Cockpit & Hood
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x + 12, cy, 20, 5);

    // Tinted Windshield
    ctx.fillStyle = '#a8dadc';
    ctx.fillRect(x + 18, cy + 1, 10, 3);

    // Front Nose Wedge
    ctx.fillStyle = primaryColor;
    ctx.fillRect(x + 42, cy + 6, 4, 5);

    // Rear Spoiler
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x + 2, cy - 2, 4, 6);
    ctx.fillRect(x + 1, cy - 3, 6, 2);

    // Rotating Wheels
    ctx.fillStyle = '#111116';
    ctx.fillRect(x + 8, cy + 10, 8, 5);
    ctx.fillRect(x + 32, cy + 10, 8, 5);
    // Silver Hubcaps
    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(x + 11, cy + 11, 2, 3);
    ctx.fillRect(x + 35, cy + 11, 2, 3);

    // Brake Lights (Bright red glow when braking)
    if (isBraking) {
      ctx.fillStyle = '#ff0033';
      ctx.fillRect(x - 2, cy + 3, 4, 4);
      ctx.fillStyle = 'rgba(255, 0, 50, 0.4)';
      ctx.fillRect(x - 8, cy + 1, 10, 8);
    } else {
      ctx.fillStyle = '#d90429';
      ctx.fillRect(x + 2, cy + 4, 2, 3);
    }

    // Headlights
    ctx.fillStyle = '#fff3b0';
    ctx.fillRect(x + 45, cy + 7, 2, 3);
  }

  drawCockpitGauge(engine) {
    const ctx = this.ctx;
    const rpm = engine.player.rpm;
    const gear = engine.player.gear;

    // Semi-transparent tachometer console
    const x = this.width / 2;
    const y = this.height - 42;

    ctx.fillStyle = '#0e0e1a';
    ctx.fillRect(x - 140, y - 24, 280, 38);
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 140, y - 24, 280, 38);

    // Current Gear Box
    ctx.fillStyle = '#1c1c28';
    ctx.fillRect(x - 134, y - 20, 34, 30);
    ctx.strokeStyle = '#00ffcc';
    ctx.strokeRect(x - 134, y - 20, 34, 30);

    ctx.fillStyle = '#00ffcc';
    ctx.font = 'bold 16px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`G${gear}`, x - 117, y);

    // Linear Tachometer Rev Bar
    const barX = x - 92;
    const barY = y - 18;
    const barW = 224;
    const barH = 12;

    ctx.fillStyle = '#111118';
    ctx.fillRect(barX, barY, barW, barH);

    // Green Sweet Spot Zone (5800 - 7000 RPM)
    const greenStartX = barX + Math.floor((REV_ZONES.GREEN_MIN / REV_ZONES.MAX_RPM) * barW);
    const greenW = Math.floor(((REV_ZONES.GREEN_MAX - REV_ZONES.GREEN_MIN) / REV_ZONES.MAX_RPM) * barW);
    ctx.fillStyle = 'rgba(6, 214, 160, 0.35)';
    ctx.fillRect(greenStartX, barY, greenW, barH);

    // Redline Zone (> 7600 RPM)
    const redStartX = barX + Math.floor((REV_ZONES.REDLINE / REV_ZONES.MAX_RPM) * barW);
    ctx.fillStyle = 'rgba(231, 29, 54, 0.4)';
    ctx.fillRect(redStartX, barY, barW - (redStartX - barX), barH);

    // Active RPM Fill Needle
    const rpmFrac = Math.min(1.0, Math.max(0, rpm / REV_ZONES.MAX_RPM));
    const fillW = Math.floor(rpmFrac * barW);

    let rpmColor = '#00f0ff';
    if (rpm >= REV_ZONES.GREEN_MIN && rpm <= REV_ZONES.GREEN_MAX) rpmColor = '#06d6a0';
    else if (rpm > REV_ZONES.REDLINE) rpmColor = '#e71d36';
    else if (rpm > REV_ZONES.GREEN_MAX) rpmColor = '#ffd166';

    ctx.fillStyle = rpmColor;
    ctx.fillRect(barX, barY, fillW, barH);

    // Shift Helper Advice Banner
    let bannerText = 'ACCELERATE [W / UP]';
    let bannerColor = '#8888aa';

    if (engine.player.shiftFeedback.text) {
      bannerText = engine.player.shiftFeedback.text;
      bannerColor = engine.player.shiftFeedback.type === 'perfect' ? '#06d6a0' : '#ffd166';
    } else if (rpm >= REV_ZONES.GREEN_MIN && rpm <= REV_ZONES.GREEN_MAX) {
      bannerText = 'SHIFT NOW! [SPACEBAR]';
      bannerColor = Math.sin(Date.now() * 0.02) > 0 ? '#06d6a0' : '#ffffff';
    } else if (rpm > REV_ZONES.REDLINE) {
      bannerText = 'OVERREV! REDLINE';
      bannerColor = '#e71d36';
    }

    ctx.font = 'bold 12px "Mukta", "Share Tech Mono", sans-serif';
    ctx.fillStyle = bannerColor;
    ctx.fillText(bannerText, x + 20, y + 6);
    ctx.textAlign = 'left';
  }

  drawHud(engine, activeLanguage) {
    const ctx = this.ctx;
    const t = engine.getTelemetry();

    // Top Status Bar
    ctx.fillStyle = '#080812';
    ctx.fillRect(0, 0, this.width, 32);
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(0, 31, this.width, 1);

    ctx.font = 'bold 13px "Share Tech Mono", "Mukta", monospace';

    // 1. Speedometer
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`${t.speed} KM/H`, 12, 14);

    // 2. RPM
    ctx.fillStyle = '#ffd166';
    ctx.fillText(`${t.rpm} RPM`, 12, 27);

    // 3. Mini Track Progress Bar (Center)
    const trackBarW = 180;
    const trackBarX = this.width / 2 - trackBarW / 2;
    ctx.fillStyle = '#1c1c28';
    ctx.fillRect(trackBarX, 10, trackBarW, 12);
    ctx.strokeStyle = '#444455';
    ctx.strokeRect(trackBarX, 10, trackBarW, 12);

    const pFrac = Math.min(1.0, engine.player.distance / engine.trackLength);
    ctx.fillStyle = '#06d6a0';
    ctx.fillRect(trackBarX + pFrac * (trackBarW - 6), 11, 6, 10);

    const rFrac = Math.min(1.0, engine.rival.distance / engine.trackLength);
    ctx.fillStyle = '#e71d36';
    ctx.fillRect(trackBarX + rFrac * (trackBarW - 4), 13, 4, 6);

    // 4. Anxiety BPM Heartbeat Gauge
    const bpmColor = t.bpm > 130 ? '#ff3366' : t.bpm > 95 ? '#ffd166' : '#06d6a0';
    ctx.fillStyle = bpmColor;
    ctx.fillText(`PULSE: ${t.bpm} BPM`, 270, 28);

    // 5. Nitro Bar
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NITRO', 440, 14);
    ctx.fillStyle = '#222';
    ctx.fillRect(495, 6, 60, 10);
    ctx.fillStyle = '#0df';
    ctx.fillRect(497, 8, Math.floor((t.nitro / 100) * 56), 6);

    // 6. Shield Bar
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SHIELD', 440, 27);
    ctx.fillStyle = '#222';
    ctx.fillRect(495, 19, 60, 10);
    ctx.fillStyle = t.shield > 25 ? '#06d6a0' : '#e71d36';
    ctx.fillRect(497, 21, Math.floor((t.shield / 100) * 56), 6);

    // 7. Distance Telemetry
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(8, this.height - 22, 170, 18);
    ctx.strokeStyle = '#00f0ff';
    ctx.strokeRect(8, this.height - 22, 170, 18);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillText(`DIST: ${t.distance}m / ${engine.trackLength}m`, 14, this.height - 9);

    // 8. Score
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(this.width - 150, this.height - 22, 142, 18);
    ctx.strokeStyle = '#ffd166';
    ctx.strokeRect(this.width - 150, this.height - 22, 142, 18);

    ctx.fillStyle = '#ffd166';
    ctx.fillText(`SCORE: ${t.score}`, this.width - 142, this.height - 9);
  }

  drawAnxietyAndFocusEffects(engine) {
    const ctx = this.ctx;

    // 1. High Anxiety Vignette (when BPM >= 130)
    if (engine.player.bpm >= 125) {
      const pulse = 0.25 + Math.sin(Date.now() * 0.015) * 0.15;
      const grad = ctx.createRadialGradient(
        this.width / 2, this.height / 2, 100,
        this.width / 2, this.height / 2, this.width / 1.7
      );
      grad.addColorStop(0, 'rgba(255, 0, 50, 0)');
      grad.addColorStop(1, `rgba(255, 0, 50, ${pulse})`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // 2. Zen Focus / Bullet-Time Calm Aura
    if (engine.player.focusActive) {
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.fillStyle = '#00ffcc';
      ctx.font = 'bold 15px "Mukta", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRANAYAMA CALM FOCUS: TIME SLOWED (BULLET-TIME)', this.width / 2, 55);
      ctx.textAlign = 'left';
    }
  }

  drawCountdown(timer) {
    const ctx = this.ctx;
    const num = Math.ceil(timer);
    const text = num > 0 ? `${num}` : 'GO!';

    ctx.fillStyle = 'rgba(8, 8, 16, 0.7)';
    ctx.fillRect(this.width / 2 - 80, this.height / 2 - 50, 160, 100);
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(this.width / 2 - 80, this.height / 2 - 50, 160, 100);

    ctx.fillStyle = num > 0 ? '#ffd166' : '#06d6a0';
    ctx.font = 'bold 48px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, this.width / 2, this.height / 2 + 18);
    ctx.textAlign = 'left';
  }

  drawFinishBanner(engine, activeLanguage) {
    const ctx = this.ctx;
    const isWinner = engine.player.distance >= engine.rival.distance;

    ctx.fillStyle = 'rgba(8, 8, 16, 0.9)';
    ctx.fillRect(100, 70, 440, 200);
    ctx.strokeStyle = isWinner ? '#06d6a0' : '#e71d36';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 70, 440, 200);

    ctx.fillStyle = isWinner ? '#06d6a0' : '#e71d36';
    ctx.font = 'bold 24px "Mukta", sans-serif';
    ctx.textAlign = 'center';

    const title = isWinner
      ? (activeLanguage === 'hi' ? 'विजयी! GRAND PRIX CHAMPION!' : 'VICTORY! GRAND PRIX CHAMPION!')
      : (activeLanguage === 'hi' ? 'दौड़ समाप्त! EXCELLENT EFFORT!' : 'RACE FINISHED! GREAT EFFORT!');
    ctx.fillText(title, this.width / 2, 115);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Mukta", sans-serif';
    ctx.fillText(`TIME: ${engine.elapsedTime.toFixed(2)}s | SCORE: ${engine.player.score}`, this.width / 2, 150);
    ctx.fillText(`PERFECT SHIFTS: ${engine.player.perfectShifts} | AVG PULSE: ${Math.round(engine.player.bpm)} BPM`, this.width / 2, 180);

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 15px "Mukta", sans-serif';
    ctx.fillText(activeLanguage === 'hi' ? 'फिर से खेलने के लिए SPACE दबाएं' : 'PRESS SPACEBAR TO RACE AGAIN', this.width / 2, 230);
    ctx.textAlign = 'left';
  }
}
