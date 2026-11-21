/**
 * @fileoverview Pure 8-bit Retro Canvas Renderer with Dynamic Day-to-Night Scene Transitions,
 * Cyber Neon Overhead Gantries, Floating Player Character Nametags with Live Score,
 * High-Speed Motion Lines, Screen Shake, and Legible Typography.
 */

import { REV_ZONES, GEAR_CONFIG } from './racing-engine.js';

export class PixelRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.width = 640;
    this.height = 360;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.trackCenterY = 230;
    this.trackHalfWidth = 55;

    // Starfield for parallax sky
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * 125,
        size: Math.random() > 0.8 ? 2 : 1,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    this.wheelRotation = 0;
    this.sparkParticles = [];
    this.dustParticles = [];
    this.speedLines = [];
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

    const scene = engine.getScene();

    // 1. Draw Sky (Day to Night scene transitions)
    this.drawSky(engine, scene);

    // 2. Draw Distant Parallax Skyline
    this.drawSkyline(engine, scene);

    // 3. Draw Road, Grass Shoulders, Curbstones & Guardrails
    this.drawRoad(engine, scene);

    // 4. Draw Cyber Neon Overhead Gates & Gantries
    this.drawOverheadGantries(engine, activeLanguage);

    // 5. Draw Track Pickups & Obstacles
    this.drawTrackItems(engine);

    // 6. Draw Vehicles (Rival & Player with Floating Nametag)
    this.drawVehicles(engine);

    // 7. Draw High-Speed Motion Lines
    if (engine.player.speed > 160) {
      this.drawSpeedLines(engine);
    }

    // 8. Draw Cockpit Dashboard & Tachometer
    this.drawCockpitGauge(engine);

    // 9. Draw Top HUD (Character Name, Score, Minimap, Heartbeat)
    this.drawHud(engine, scene, activeLanguage);

    // 10. Draw Anxiety Red Vignette or Zen Focus Aura
    this.drawAnxietyAndFocusEffects(engine);

    // 11. Draw Countdown or Finish Banner or Pitstop Pause Indicator
    if (engine.status === 'countdown') {
      this.drawCountdown(engine.countdownTime);
    } else if (engine.status === 'pitstop' || engine.isPaused) {
      ctx.fillStyle = 'rgba(6, 4, 15, 0.45)';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#ffe600';
      ctx.font = 'bold 10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ PITSTOP CHECKPOINT - RACE PAUSED ]', this.width / 2, 40);
      ctx.textAlign = 'left';
    } else if (engine.status === 'finished') {
      this.drawFinishBanner(engine, activeLanguage);
    }

    ctx.restore();
  }

  drawSky(engine, scene) {
    const ctx = this.ctx;

    // Multi-stop sky gradient based on scene (Dawn -> Noon -> Sunset -> Midnight)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 145);
    skyGrad.addColorStop(0, scene.skyTop);
    skyGrad.addColorStop(0.55, scene.skyMid);
    skyGrad.addColorStop(1, scene.skyBot);

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, 145);

    // Stars visible at Dawn and Midnight
    if (scene.id === 'midnight' || scene.id === 'dawn') {
      ctx.fillStyle = '#ffffff';
      const playerDist = engine.player.distance;

      for (const star of this.stars) {
        const sx = (star.x - playerDist * 0.04) % this.width;
        const drawX = sx < 0 ? sx + this.width : sx;
        star.twinkle += 0.05;
        const alpha = (scene.id === 'midnight' ? 0.8 : 0.4) + Math.sin(star.twinkle) * 0.2;

        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.fillRect(Math.floor(drawX), Math.floor(star.y), star.size, star.size);
      }
      ctx.globalAlpha = 1.0;
    }

    // Glowing Celestial Body (Sun in Day/Dawn/Sunset, Moon in Midnight)
    ctx.save();
    ctx.shadowColor = scene.sunColor;
    ctx.shadowBlur = scene.id === 'noon' ? 24 : 14;
    ctx.fillStyle = scene.sunColor;

    if (scene.id === 'midnight') {
      // Crescent Moon
      ctx.fillRect(520, 22, 26, 26);
      ctx.fillStyle = scene.skyTop;
      ctx.shadowBlur = 0;
      ctx.fillRect(528, 22, 22, 26);
    } else {
      // Radiant Sun
      ctx.fillRect(510, 24, 34, 34);
    }
    ctx.restore();
  }

  drawSkyline(engine, scene) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;
    const offset = (playerDist * 0.18) % 320;

    const skylineColor = scene.id === 'noon' ? '#102844' : '#140826';
    ctx.fillStyle = skylineColor;

    for (let i = -1; i < 5; i++) {
      const bx = i * 160 - offset;
      ctx.fillRect(bx, 65, 48, 80);
      ctx.fillRect(bx + 40, 42, 52, 103);
      ctx.fillRect(bx + 85, 78, 45, 67);
      ctx.fillRect(bx + 125, 32, 35, 113);

      // Glowing Neon Windows
      ctx.fillStyle = scene.id === 'midnight' ? '#00f0ff' : '#ffd166';
      ctx.fillRect(bx + 8, 72, 4, 4);
      ctx.fillRect(bx + 20, 88, 4, 4);
      ctx.fillRect(bx + 52, 52, 4, 4);
      ctx.fillRect(bx + 68, 92, 4, 4);
      ctx.fillRect(bx + 132, 46, 4, 4);

      ctx.fillStyle = scene.id === 'midnight' ? '#ff0077' : '#06d6a0';
      ctx.fillRect(bx + 8, 96, 4, 4);
      ctx.fillRect(bx + 52, 112, 4, 4);

      ctx.fillStyle = skylineColor;
    }
  }

  drawRoad(engine, scene) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    // Grass Shoulders (Color adapts to ambient light)
    ctx.fillStyle = scene.id === 'midnight' ? '#0d1f14' : '#1a3d20';
    ctx.fillRect(0, 142, this.width, 172);

    // Asphalt Road Tarmac (Y=168 to Y=292)
    ctx.fillStyle = '#20202c';
    ctx.fillRect(0, 168, this.width, 124);

    // Curbs with Checkered Colors adapting to the scene
    const curbScroll = Math.floor(playerDist * 1.6) % 32;
    for (let x = -32; x < this.width + 32; x += 32) {
      const isAlt = Math.floor((x + curbScroll) / 32) % 2 === 0;
      ctx.fillStyle = isAlt ? scene.curbDark : scene.curbLight;

      ctx.fillRect(x - curbScroll, 164, 32, 5);
      ctx.fillRect(x - curbScroll, 292, 32, 5);
    }

    // Dashed White Lane Dividers (Speed scales scroll rate)
    ctx.fillStyle = '#f8f9fa';
    const dashScroll = Math.floor(playerDist * 2.4) % 40;

    for (let x = -40; x < this.width + 40; x += 40) {
      ctx.fillRect(x - dashScroll, 208, 20, 2);
      ctx.fillRect(x - dashScroll, 252, 20, 2);
    }

    // Roadside Guardrails
    ctx.fillStyle = '#444455';
    ctx.fillRect(0, 145, this.width, 5);
    ctx.fillRect(0, 308, this.width, 5);
  }

  // --- Cyber Neon Overhead Gantries & Gateways ---

  drawOverheadGantries(engine, activeLanguage) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    // Accurate scientific formulas per subject
    const gantryGates = [
      { dist: 120, label: 'VELOCITY APEX: v = d / t', hi: 'वेग नियम: v = दूरी / समय', color: '#00f0ff' },
      { dist: 320, label: 'NEWTON 2ND LAW: F = m · a', hi: 'बल का नियम: F = m · a', color: '#ffd166' },
      { dist: 520, label: 'KINETIC ENERGY: KE = 0.5 mv²', hi: 'गतिज ऊर्जा: KE = 1/2 mv²', color: '#06d6a0' },
      { dist: 750, label: 'MOMENTUM OVERDRIVE: p = m · v', hi: 'संवेग संरक्षण: p = m · v', color: '#ff007f' },
      { dist: 980, label: 'POWER SPEED: P = W / t = F · v', hi: 'शक्ति समीकरण: P = F · v', color: '#00f0ff' }
    ];

    for (const g of gantryGates) {
      const relDist = g.dist - playerDist;
      const screenX = 140 + relDist * 4.0;

      if (screenX > -180 && screenX < this.width + 180) {
        ctx.save();

        // 1. Steel Support Pylons on Left and Right of Road
        ctx.fillStyle = '#3a3a4e';
        ctx.fillRect(screenX - 8, 142, 6, 172);
        ctx.fillRect(screenX + 8, 142, 6, 172);

        // 2. Overhead Truss Bridge
        ctx.fillStyle = '#222234';
        ctx.fillRect(screenX - 100, 134, 200, 18);
        ctx.strokeStyle = '#555577';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX - 100, 134, 200, 18);

        // 3. Neon LED Banner
        const displayText = activeLanguage === 'hi' ? g.hi : g.label;
        ctx.font = 'bold 12px "Mukta", "Share Tech Mono", sans-serif';
        const textWidth = ctx.measureText(displayText).width;
        const bannerW = Math.max(160, textWidth + 24);
        const bannerX = screenX - bannerW / 2;

        ctx.shadowColor = g.color;
        ctx.shadowBlur = 14;

        ctx.fillStyle = '#080814';
        ctx.fillRect(bannerX, 102, bannerW, 30);
        ctx.strokeStyle = g.color;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(bannerX, 102, bannerW, 30);

        // Glowing Neon Text
        ctx.fillStyle = g.color;
        ctx.textAlign = 'center';
        ctx.fillText(displayText, screenX, 122);

        ctx.restore();
      }
    }
  }

  drawTrackItems(engine) {
    const ctx = this.ctx;
    const playerDist = engine.player.distance;

    for (const item of engine.pickups) {
      if (item.collected) continue;

      const relDist = item.distance - playerDist;
      const screenX = 140 + relDist * 4.0;

      if (screenX > -30 && screenX < this.width + 30) {
        const itemY = this.trackCenterY + item.x * this.trackHalfWidth - 6;

        if (item.type === 'battery') {
          ctx.fillStyle = '#00ffcc';
          ctx.fillRect(screenX, itemY, 14, 10);
          ctx.fillStyle = '#000000';
          ctx.fillRect(screenX + 2, itemY + 2, 10, 6);
          ctx.fillStyle = '#fffa65';
          ctx.fillRect(screenX + 6, itemY + 3, 3, 2);
          ctx.fillRect(screenX + 5, itemY + 5, 4, 2);
        } else if (item.type === 'chip') {
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(screenX, itemY, 12, 12);
          ctx.fillStyle = '#073b4c';
          ctx.fillRect(screenX + 2, itemY + 2, 8, 8);
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(screenX - 2, itemY + 2, 2, 2);
          ctx.fillRect(screenX - 2, itemY + 8, 2, 2);
          ctx.fillRect(screenX + 12, itemY + 2, 2, 2);
          ctx.fillRect(screenX + 12, itemY + 8, 2, 2);
        } else if (item.type === 'repair') {
          ctx.fillStyle = '#00ff66';
          ctx.fillRect(screenX, itemY, 14, 10);
          ctx.fillStyle = '#000000';
          ctx.fillRect(screenX + 2, itemY + 2, 10, 6);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(screenX + 6, itemY + 3, 2, 4);
          ctx.fillRect(screenX + 5, itemY + 4, 4, 2);
        } else if (item.type === 'booster') {
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(screenX, itemY + 1, 14, 8);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(screenX + 3, itemY + 3, 4, 4);
          ctx.fillRect(screenX + 7, itemY + 3, 4, 4);
        } else if (item.type === 'slick') {
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
    const rivalScreenX = engine.player.screenX + distDelta * 4.0;
    const rivalY = this.trackCenterY + engine.rival.x * this.trackHalfWidth;

    if (rivalScreenX > -90 && rivalScreenX < this.width + 90) {
      this.drawCarSprite(
        rivalScreenX,
        rivalY,
        '#e63946',
        '#1d3557',
        false,
        engine.rival.isNitroActive,
        engine.rival.name,
        false,
        false
      );

      // Rival floating tag (discrete)
      ctx.fillStyle = 'rgba(230, 57, 70, 0.7)';
      ctx.font = '9px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`RIVAL: ${engine.rival.name}`, rivalScreenX + 24, rivalY - 18);
      ctx.textAlign = 'left';
    }

    // 2. Draw Oncoming Traffic Vehicles (Retro 8-bit Traffic)
    if (engine.traffic && engine.traffic.length > 0) {
      for (const v of engine.traffic) {
        const relDist = v.distance - engine.player.distance;
        const vScreenX = engine.player.screenX + relDist * 4.0;
        const vY = this.trackCenterY + v.x * this.trackHalfWidth;

        if (vScreenX > -90 && vScreenX < this.width + 120) {
          this.drawOncomingCar(ctx, vScreenX, vY, v);
        }
      }
    }

    // 3. Draw Jaywalkers / Pedestrians Crossing Road
    if (engine.jaywalkers && engine.jaywalkers.length > 0) {
      for (const w of engine.jaywalkers) {
        const relDist = w.distance - engine.player.distance;
        const wScreenX = engine.player.screenX + relDist * 4.0;
        const wY = this.trackCenterY + w.x * this.trackHalfWidth;

        if (wScreenX > -40 && wScreenX < this.width + 40) {
          this.drawJaywalker(ctx, wScreenX, wY, w);
        }
      }
    }

    // 4. Draw Player Car (Screen X dynamically surges with speed)
    const playerScreenX = Math.round(engine.player.screenX);
    const playerY = this.trackCenterY + engine.player.x * this.trackHalfWidth;

    // Dust particles when off-road
    if (engine.player.isOffRoad && engine.player.speed > 10) {
      this.dustParticles.push({
        x: playerScreenX - 5,
        y: playerY + 5 + (Math.random() - 0.5) * 8,
        vx: -Math.random() * 4 - 2,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 3 + 2,
        color: '#4a6b32',
        life: 0.35
      });
    }

    // Crash spark particles
    if (engine.crashEvent) {
      for (let i = 0; i < 4; i++) {
        this.sparkParticles.push({
          x: playerScreenX + 20 + (Math.random() - 0.5) * 20,
          y: playerY + (Math.random() - 0.5) * 15,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '#fffa65' : '#ff5964',
          life: 0.25
        });
      }
    }

    this.updateAndDrawParticles(ctx);

    // Draw Player Car Sprite with Chosen Custom Color!
    this.drawCarSprite(
      playerScreenX,
      playerY,
      engine.player.carColor || '#00f0ff',
      engine.player.carSecondaryColor || '#00485c',
      true,
      engine.player.isNitroActive,
      engine.playerName,
      engine.player.stallTimer > 0,
      engine.player.isBraking
    );

    // 5. Inconspicuous Floating Player Nametag & Score (Low Opacity, Small 9px, Non-Distracting)
    ctx.save();
    const tagText = `${engine.playerName} | ${engine.player.score}`;
    ctx.font = '9px "Share Tech Mono", monospace';
    const tagWidth = ctx.measureText(tagText).width + 8;
    const tagX = playerScreenX + 24 - tagWidth / 2;
    const tagY = playerY - 18;

    ctx.fillStyle = 'rgba(6, 4, 15, 0.35)';
    ctx.fillRect(tagX, tagY, tagWidth, 11);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(tagX, tagY, tagWidth, 11);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'center';
    ctx.fillText(tagText, playerScreenX + 24, tagY + 9);
    ctx.restore();
  }

  // Draw Oncoming Retro Traffic Car Facing Towards Player
  drawOncomingCar(ctx, x, y, vehicle) {
    const cy = y - 12;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x - 2, y + 6, 44, 6);

    // Headlight Beams illuminating towards player (Leftwards)
    ctx.fillStyle = 'rgba(255, 240, 180, 0.18)';
    ctx.beginPath();
    ctx.moveTo(x - 2, cy + 7);
    ctx.lineTo(x - 30, cy + 2);
    ctx.lineTo(x - 30, cy + 14);
    ctx.closePath();
    ctx.fill();

    // Chassis
    ctx.fillStyle = vehicle.color || '#ff2a55';
    ctx.fillRect(x + 2, cy + 4, 38, 8);

    // Cabin / Cockpit
    ctx.fillStyle = '#11111e';
    ctx.fillRect(x + 10, cy, 20, 5);

    // Front Windshield (Facing Left)
    ctx.fillStyle = '#a8dadc';
    ctx.fillRect(x + 12, cy + 1, 8, 3);

    // Headlights (Facing Left towards player)
    ctx.fillStyle = '#ffff99';
    ctx.fillRect(x + 2, cy + 7, 3, 3);

    // Taillights (Facing Right)
    ctx.fillStyle = '#ff0033';
    ctx.fillRect(x + 38, cy + 6, 2, 3);

    // Wheels
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(x + 6, cy + 10, 8, 5);
    ctx.fillRect(x + 28, cy + 10, 8, 5);
  }

  // Draw 8-Bit Jaywalker / Pedestrian Crossing Highway
  drawJaywalker(ctx, x, y, walker) {
    const legPhase = Math.sin(this.wheelRotation * 1.6);
    const cy = y - 8;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x - 3, y + 6, 8, 3);

    // Head
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(x - 2, cy - 8, 5, 5);

    // Shirt / Torso
    ctx.fillStyle = walker.color || '#00f0ff';
    ctx.fillRect(x - 3, cy - 3, 7, 6);

    // Animated Walking Legs
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(x - 2 + legPhase * 2, cy + 3, 2, 5);
    ctx.fillRect(x + 1 - legPhase * 2, cy + 3, 2, 5);
  }

  drawSpeedLines(engine) {
    const ctx = this.ctx;
    const speedRatio = Math.min(1.0, (engine.player.speed - 160) / 200);
    const count = Math.floor(speedRatio * 12);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;

    for (let i = 0; i < count; i++) {
      const lineX = Math.random() * this.width;
      const lineY = 145 + Math.random() * 165;
      const len = 30 + Math.random() * 50;

      ctx.beginPath();
      ctx.moveTo(lineX, lineY);
      ctx.lineTo(lineX - len, lineY);
      ctx.stroke();
    }
  }

  updateAndDrawParticles(ctx) {
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

    // Nitro Flames
    if (isNitro) {
      const flameLen = 16 + Math.floor(Math.random() * 14);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(x - flameLen, cy + 4, flameLen, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - flameLen + 4, cy + 5, flameLen - 6, 2);
    }

    // Chassis
    ctx.fillStyle = primaryColor;
    ctx.fillRect(x + 4, cy + 4, 38, 8);

    // Cockpit
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x + 12, cy, 20, 5);

    // Windshield
    ctx.fillStyle = '#a8dadc';
    ctx.fillRect(x + 18, cy + 1, 10, 3);

    // Front Wedge
    ctx.fillStyle = primaryColor;
    ctx.fillRect(x + 42, cy + 6, 4, 5);

    // Spoiler
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x + 2, cy - 2, 4, 6);
    ctx.fillRect(x + 1, cy - 3, 6, 2);

    // Wheels
    ctx.fillStyle = '#111116';
    ctx.fillRect(x + 8, cy + 10, 8, 5);
    ctx.fillRect(x + 32, cy + 10, 8, 5);
    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(x + 11, cy + 11, 2, 3);
    ctx.fillRect(x + 35, cy + 11, 2, 3);

    // Brake Lights
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

    // Linear Tachometer Bar
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

    // Active RPM Fill
    const rpmFrac = Math.min(1.0, Math.max(0, rpm / REV_ZONES.MAX_RPM));
    const fillW = Math.floor(rpmFrac * barW);

    let rpmColor = '#00f0ff';
    if (rpm >= REV_ZONES.GREEN_MIN && rpm <= REV_ZONES.GREEN_MAX) rpmColor = '#06d6a0';
    else if (rpm > REV_ZONES.REDLINE) rpmColor = '#e71d36';
    else if (rpm > REV_ZONES.GREEN_MAX) rpmColor = '#ffd166';

    ctx.fillStyle = rpmColor;
    ctx.fillRect(barX, barY, fillW, barH);

    // Guidance Banner
    let bannerText = 'ACCELERATE [HOLD W / UP]';
    let bannerColor = '#8888aa';

    if (engine.player.shiftFeedback.text) {
      bannerText = engine.player.shiftFeedback.text;
      bannerColor = engine.player.shiftFeedback.type === 'perfect' ? '#06d6a0' : '#ffd166';
    } else if (rpm >= REV_ZONES.GREEN_MIN && rpm <= REV_ZONES.GREEN_MAX) {
      bannerText = 'SHIFT NOW! [SPACEBAR]';
      bannerColor = Math.sin(Date.now() * 0.02) > 0 ? '#06d6a0' : '#ffffff';
    } else if (rpm > REV_ZONES.REDLINE) {
      bannerText = 'REDLINE! SHIFT UP';
      bannerColor = '#e71d36';
    }

    ctx.font = 'bold 12px "Mukta", "Share Tech Mono", sans-serif';
    ctx.fillStyle = bannerColor;
    ctx.fillText(bannerText, x + 20, y + 6);
    ctx.textAlign = 'left';
  }

  drawHud(engine, scene, activeLanguage) {
    const ctx = this.ctx;
    const t = engine.getTelemetry();

    // Top Status Bar
    ctx.fillStyle = '#080812';
    ctx.fillRect(0, 0, this.width, 32);
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(0, 31, this.width, 1);

    ctx.font = 'bold 13px "Mukta", "Share Tech Mono", sans-serif';

    // 1. Character Name & Live Score (Prominently displayed)
    ctx.fillStyle = '#ffd166';
    ctx.fillText(`PILOT: ${t.playerName} (${t.score} PTS)`, 12, 14);

    // 2. Speedometer & RPM
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`${t.speed} KM/H | G${t.gear}`, 12, 27);

    // 3. Mini Track Progress Bar (Center)
    const trackBarW = 160;
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

    // 4. Scene Name
    const sName = activeLanguage === 'hi' ? t.sceneName.hi : t.sceneName.en;
    ctx.fillStyle = '#8899aa';
    ctx.font = '11px "Mukta", sans-serif';
    ctx.fillText(`SCENE: ${sName}`, 240, 27);

    // 5. Anxiety Pulse BPM
    ctx.font = 'bold 12px "Share Tech Mono", monospace';
    const bpmColor = t.bpm > 130 ? '#ff3366' : t.bpm > 95 ? '#ffd166' : '#06d6a0';
    ctx.fillStyle = bpmColor;
    ctx.fillText(`PULSE: ${t.bpm} BPM`, 390, 14);

    // 6. Nitro & Shield Bars
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NITRO', 485, 14);
    ctx.fillStyle = '#222';
    ctx.fillRect(525, 6, 45, 9);
    ctx.fillStyle = '#0df';
    ctx.fillRect(526, 7, Math.floor((t.nitro / 100) * 43), 7);

    ctx.fillStyle = '#ffffff';
    ctx.fillText('SHIELD', 485, 26);
    ctx.fillStyle = '#222';
    ctx.fillRect(525, 18, 45, 9);
    ctx.fillStyle = t.shield > 25 ? '#06d6a0' : '#e71d36';
    ctx.fillRect(526, 19, Math.floor((t.shield / 100) * 43), 7);

    // 7. Distance Telemetry
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(8, this.height - 22, 170, 18);
    ctx.strokeStyle = '#00f0ff';
    ctx.strokeRect(8, this.height - 22, 170, 18);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillText(`DIST: ${t.distance}m / ${engine.trackLength}m`, 14, this.height - 9);

    // 8. Rival Delta
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(this.width - 150, this.height - 22, 142, 18);
    ctx.strokeStyle = t.leadDelta >= 0 ? '#06d6a0' : '#e71d36';
    ctx.strokeRect(this.width - 150, this.height - 22, 142, 18);

    ctx.fillStyle = t.leadDelta >= 0 ? '#06d6a0' : '#e71d36';
    ctx.fillText(t.leadDelta >= 0 ? `LEAD: +${t.leadDelta}m` : `BEHIND: ${t.leadDelta}m`, this.width - 142, this.height - 9);
  }

  drawAnxietyAndFocusEffects(engine) {
    const ctx = this.ctx;

    // High Anxiety Red Vignette
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

    // Zen Focus Aura
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

    ctx.fillStyle = 'rgba(8, 8, 16, 0.75)';
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

    ctx.fillStyle = 'rgba(8, 8, 16, 0.94)';
    ctx.fillRect(80, 65, 480, 210);
    ctx.strokeStyle = isWinner ? '#06d6a0' : '#e71d36';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 65, 480, 210);

    ctx.fillStyle = isWinner ? '#06d6a0' : '#e71d36';
    ctx.font = 'bold 24px "Mukta", sans-serif';
    ctx.textAlign = 'center';

    const title = isWinner
      ? (activeLanguage === 'hi' ? `विजयी! ${engine.playerName} ग्रैंड प्रिक्स चैंपियन!` : `VICTORY! ${engine.playerName} GP CHAMPION!`)
      : (activeLanguage === 'hi' ? 'दौड़ समाप्त! शानदार प्रयास!' : 'RACE FINISHED! GREAT EFFORT!');
    ctx.fillText(title, this.width / 2, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '15px "Mukta", sans-serif';
    ctx.fillText(`TIME: ${engine.elapsedTime.toFixed(2)}s | SCORE: ${engine.player.score} PTS`, this.width / 2, 145);
    ctx.fillText(`PERFECT SHIFTS: ${engine.player.perfectShifts} | AVG PULSE: ${Math.round(engine.player.bpm)} BPM`, this.width / 2, 175);

    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 16px "Mukta", sans-serif';
    ctx.fillText(activeLanguage === 'hi' ? 'फिर से खेलने के लिए SPACE दबाएं' : 'PRESS SPACEBAR TO RACE AGAIN', this.width / 2, 235);
    ctx.textAlign = 'left';
  }
}
