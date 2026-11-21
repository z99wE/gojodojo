/**
 * @fileoverview High-performance 8-bit racing physics, vehicle kinematics,
 * free lateral track steering, physical collisions, dynamic speed scaling,
 * early STEM checkpoints, and day-to-night environment tracking.
 */

export const GEAR_CONFIG = [
  { gear: 1, ratio: 3.6, maxSpeed: 95, minRpm: 1200 },
  { gear: 2, ratio: 2.6, maxSpeed: 155, minRpm: 2400 },
  { gear: 3, ratio: 1.9, maxSpeed: 215, minRpm: 2800 },
  { gear: 4, ratio: 1.4, maxSpeed: 285, minRpm: 3200 },
  { gear: 5, ratio: 1.05, maxSpeed: 345, minRpm: 3600 },
  { gear: 6, ratio: 0.80, maxSpeed: 410, minRpm: 4000 }
];

export const REV_ZONES = {
  IDLE: 1200,
  GREEN_MIN: 5800,
  GREEN_MAX: 7000,
  REDLINE: 7600,
  MAX_RPM: 9000
};

export const TRACK_CIRCUITS = {
  physics: {
    id: 'physics',
    name: { hi: 'भौतिकी वेग सर्किट', en: 'Physics Velocity Circuit' },
    subject: 'science',
    rivalName: 'Newton-GT',
    themeColor: '#00ffff',
    trackLength: 1200
  },
  chemistry: {
    id: 'chemistry',
    name: { hi: 'रसायन रिऐक्टर ग्रैंड प्रिक्स', en: 'Chemistry Reactor GP' },
    subject: 'science',
    rivalName: 'Curie-Turbo',
    themeColor: '#ff007f',
    trackLength: 1200
  },
  biology: {
    id: 'biology',
    name: { hi: 'बायो-स्प्रिंट साइबरवे', en: 'Biology Bio-Sprint' },
    subject: 'science',
    rivalName: 'Mendel-Apex',
    themeColor: '#00ff66',
    trackLength: 1200
  },
  maths: {
    id: 'maths',
    name: { hi: 'गणित मैट्रिक्स 500', en: 'Maths Matrix 500' },
    subject: 'maths',
    rivalName: 'Ramanujan-X',
    themeColor: '#ffbb00',
    trackLength: 1200
  }
};

export class RacingEngine {
  constructor(options = {}) {
    this.trackLength = options.trackLength || 1200;
    this.circuitId = options.circuitId || 'physics';
    this.grade = options.grade || 5;
    this.playerName = options.playerName || 'ARYABHATA';
    this.character = options.character || 'Velocity Ace';

    // Driving Inputs
    this.inputs = {
      throttle: false,
      brake: false,
      steerLeft: false,
      steerRight: false
    };

    this.screenShake = 0;
    this.crashEvent = null;

    this.reset();
  }

  setPlayerProfile(name, character) {
    if (name && name.trim().length > 0) {
      this.playerName = name.trim().toUpperCase();
    }
    if (character) {
      this.character = character;
    }
  }

  reset() {
    this.status = 'ready'; // ready, countdown, racing, finished
    this.countdownTime = 1.8; // Snappy countdown so racing begins fast
    this.elapsedTime = 0;
    this.timeScale = 1.0;

    // Player State
    this.player = {
      gear: 1,
      rpm: REV_ZONES.IDLE,
      speed: 0, // km/h
      distance: 0, // meters
      x: 0.0, // Continuous lateral: -1.0 (left) to +1.0 (right). >1.0 is off-road
      screenX: 130, // Dynamic forward surge with speed
      lane: 1, // Discrete fallback
      spinVelocity: 0,
      isOffRoad: false,
      isBraking: false,
      nitro: 60, // 0-100%
      isNitroActive: false,
      nitroTimeRemaining: 0,
      shield: 100, // 0-100%
      stallTimer: 0,
      overrevTimer: 0,
      shiftFeedback: { text: '', type: 'none', timer: 0 },
      perfectShifts: 0,
      score: 0,
      hasFinished: false,
      finishTime: 0,

      // Anxiety & Composure
      bpm: 78,
      focusActive: false,
      focusTimeRemaining: 0,
      focusCooldown: 0
    };

    // Rival AI State
    this.rival = {
      name: TRACK_CIRCUITS[this.circuitId]?.rivalName || 'Rival-GT',
      gear: 1,
      rpm: REV_ZONES.IDLE,
      speed: 0,
      distance: 0,
      x: -0.5,
      nitro: 40,
      isNitroActive: false,
      aiSkill: 0.88 + Math.min(0.12, (this.grade - 1) * 0.015),
      hasFinished: false,
      finishTime: 0
    };

    this.pickups = this.generateTrackItems();

    // Early & Frequent Checkpoints so students get engaged right away
    this.checkpoints = [
      { distance: 60, triggered: false },
      { distance: 220, triggered: false },
      { distance: 420, triggered: false },
      { distance: 650, triggered: false },
      { distance: 880, triggered: false },
      { distance: 1080, triggered: false }
    ];

    this.activeQuizCheckpoint = null;
  }

  generateTrackItems() {
    const items = [];
    const step = 70;
    const count = Math.floor(this.trackLength / step);

    for (let i = 1; i < count; i++) {
      const d = i * step + ((i * 19) % 25);
      const laneIndex = (i * 2 + 1) % 3;
      const xMap = [-0.6, 0.0, 0.6];
      const posX = xMap[laneIndex];
      const r = (i * 37) % 100;
      let type = 'battery';

      if (r < 40) type = 'battery';
      else if (r < 65) type = 'chip';
      else if (r < 80) type = 'booster';
      else type = 'slick';

      items.push({
        id: `item-${i}`,
        distance: d,
        x: posX,
        lane: laneIndex,
        type,
        collected: false
      });
    }
    return items;
  }

  startCountdown() {
    this.status = 'countdown';
    this.countdownTime = 1.8;
  }

  startRace() {
    this.status = 'racing';
  }

  // --- Driving Controls ---

  setThrottle(pressed) {
    this.inputs.throttle = Boolean(pressed);
  }

  setBrake(pressed) {
    this.inputs.brake = Boolean(pressed);
    this.player.isBraking = Boolean(pressed);
  }

  setSteerLeft(pressed) {
    this.inputs.steerLeft = Boolean(pressed);
  }

  setSteerRight(pressed) {
    this.inputs.steerRight = Boolean(pressed);
  }

  steerLane(direction) {
    if (this.status !== 'racing') return;
    const target = Math.max(0, Math.min(2, this.player.lane + direction));
    this.player.lane = target;
    const xMap = [-0.6, 0.0, 0.6];
    this.player.x = xMap[target];
  }

  shiftUp() {
    if (this.status !== 'racing') return;
    if (this.player.stallTimer > 0) return;
    if (this.player.gear >= GEAR_CONFIG.length) return;

    const currentRpm = this.player.rpm;
    let feedback = { text: '', type: 'none', timer: 1.2 };

    if (currentRpm >= REV_ZONES.GREEN_MIN && currentRpm <= REV_ZONES.GREEN_MAX) {
      // Perfect Shift in Green Sweet Spot!
      feedback = { text: 'PERFECT SHIFT!', type: 'perfect', timer: 1.4 };
      this.player.perfectShifts++;
      this.player.score += 250;
      this.player.nitro = Math.min(100, this.player.nitro + 25);
      this.player.speed += 18; // Strong forward impulse
      this.player.bpm = Math.max(70, this.player.bpm - 8);
    } else if (currentRpm > REV_ZONES.GREEN_MAX) {
      feedback = { text: 'LATE SHIFT!', type: 'late', timer: 1.0 };
      this.player.score += 50;
    } else {
      feedback = { text: 'BOGGED DOWN!', type: 'early', timer: 1.2 };
      this.player.speed = Math.max(15, this.player.speed * 0.90);
    }

    this.player.gear++;
    const cfg = GEAR_CONFIG[this.player.gear - 1];
    this.player.rpm = Math.max(cfg.minRpm, Math.floor(currentRpm * 0.65));
    this.player.shiftFeedback = feedback;
  }

  shiftDown() {
    if (this.status !== 'racing') return;
    if (this.player.gear <= 1) return;

    this.player.gear--;
    this.player.rpm = Math.min(REV_ZONES.MAX_RPM - 200, Math.floor(this.player.rpm * 1.35));
    this.player.shiftFeedback = { text: 'DOWNSHIFT (ENGINE BRAKE)', type: 'down', timer: 0.8 };
  }

  activateNitro() {
    if (this.status !== 'racing') return false;
    if (this.player.isNitroActive) return false;
    if (this.player.nitro < 25) return false;
    if (this.player.stallTimer > 0) return false;

    this.player.isNitroActive = true;
    this.player.nitroTimeRemaining = 4.0;
    this.player.nitro = Math.max(0, this.player.nitro - 25);
    this.player.score += 150;
    this.player.speed = Math.min(430, this.player.speed + 40);
    this.player.bpm = Math.min(160, this.player.bpm + 15);
    return true;
  }

  activateFocus() {
    if (this.status !== 'racing') return false;
    if (this.player.focusCooldown > 0) return false;

    this.player.focusActive = true;
    this.player.focusTimeRemaining = 3.5;
    this.player.focusCooldown = 12.0;
    this.timeScale = 0.50; // 50% bullet-time calm focus
    this.player.bpm = 72; // Vagus nerve reset
    this.player.score += 300;
    this.player.shiftFeedback = {
      text: 'PRANAYAMA CALM FOCUS (+300 PTS)',
      type: 'perfect',
      timer: 2.0
    };
    return true;
  }

  // --- STEM Quiz Callbacks: High-Stakes Speed Surges & Identification ---

  onQuizAnswer(isCorrect, answerData = null) {
    if (isCorrect) {
      // RIGHT ANSWER: Mega Turbo Overdrive, speed surge, shield repair
      this.player.score += 1000;
      this.player.nitro = 100;
      this.player.isNitroActive = true;
      this.player.nitroTimeRemaining = 5.5;
      this.player.stallTimer = 0;
      this.player.shield = Math.min(100, this.player.shield + 25);
      // Surge speed by +65 km/h!
      this.player.speed = Math.min(420, this.player.speed + 65);
      this.player.bpm = Math.max(72, this.player.bpm - 20);
      this.player.shiftFeedback = {
        text: 'CORRECT! HYPER TURBO BOOST ENGAGED (+1000 PTS)',
        type: 'perfect',
        timer: 2.5
      };
    } else {
      // WRONG ANSWER: Clearly identify mistake, drop speed, cause containment stall
      const explainSummary = answerData ? `CORRECT ANSWER: ${answerData.correctText}` : 'ENGINE STALL';
      this.player.shield = Math.max(0, this.player.shield - 25);
      this.player.nitro = Math.max(0, this.player.nitro - 40);
      this.player.stallTimer = 1.8;
      this.player.speed = Math.max(25, this.player.speed - 35);
      this.player.bpm = Math.min(170, this.player.bpm + 25);
      this.triggerCrash('hazard', 0.8);
      this.player.shiftFeedback = {
        text: `INCORRECT! ${explainSummary}`,
        type: 'stall',
        timer: 2.8
      };
    }
  }

  triggerCrash(type = 'hazard', intensity = 1.0) {
    this.screenShake = 0.35 * intensity;
    this.crashEvent = { type, intensity, time: 0.4 };
  }

  // --- Dynamic Day to Night Scene Calculation ---

  getScene() {
    const dist = this.player.distance;
    const time = this.elapsedTime;

    if (dist < 300 || time < 15) {
      return {
        id: 'dawn',
        name: { hi: 'सुनहरा प्रभात (Golden Dawn)', en: 'Golden Dawn' },
        skyTop: '#14082e',
        skyMid: '#3a124a',
        skyBot: '#7a2245',
        sunColor: '#ffbb44',
        curbLight: '#ffdd77',
        curbDark: '#c9184a',
        ambientLight: 0.9
      };
    } else if (dist < 650 || time < 35) {
      return {
        id: 'noon',
        name: { hi: 'दोपहर साइबरवे (High Noon Cyberway)', en: 'High Noon Cyberway' },
        skyTop: '#081845',
        skyMid: '#0a3b68',
        skyBot: '#116688',
        sunColor: '#fff5b0',
        curbLight: '#ffffff',
        curbDark: '#00b4d8',
        ambientLight: 1.0
      };
    } else if (dist < 950 || time < 55) {
      return {
        id: 'sunset',
        name: { hi: 'संध्या गोधूलि (Synthwave Sunset)', en: 'Synthwave Sunset' },
        skyTop: '#2b0938',
        skyMid: '#70104e',
        skyBot: '#c43835',
        sunColor: '#ff7744',
        curbLight: '#ffd166',
        curbDark: '#d90429',
        ambientLight: 0.85
      };
    } else {
      return {
        id: 'midnight',
        name: { hi: 'मध्यरात्रि एक्सप्रेसवे (Midnight Neon Expressway)', en: 'Midnight Neon Expressway' },
        skyTop: '#03010c',
        skyMid: '#08041c',
        skyBot: '#150838',
        sunColor: '#a8dadc', // Moon
        curbLight: '#00f0ff',
        curbDark: '#ff0077',
        ambientLight: 0.75
      };
    }
  }

  // --- Physics Step ---

  update(rawDt) {
    if (this.status === 'countdown') {
      this.countdownTime -= rawDt;
      if (this.countdownTime <= 0) {
        this.status = 'racing';
      }
      return;
    }

    if (this.status !== 'racing') return;

    const dt = rawDt * this.timeScale;
    this.elapsedTime += rawDt;

    // 1. Focus / Zen Breath State
    if (this.player.focusCooldown > 0) {
      this.player.focusCooldown -= rawDt;
    }
    if (this.player.focusActive) {
      this.player.focusTimeRemaining -= rawDt;
      if (this.player.focusTimeRemaining <= 0) {
        this.player.focusActive = false;
        this.timeScale = 1.0;
      }
    }

    // 2. Screen Shake Decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - rawDt);
    }
    if (this.crashEvent) {
      this.crashEvent.time -= rawDt;
      if (this.crashEvent.time <= 0) this.crashEvent = null;
    }

    // 3. Shift Feedback Timer
    if (this.player.shiftFeedback.timer > 0) {
      this.player.shiftFeedback.timer -= dt;
      if (this.player.shiftFeedback.timer <= 0) {
        this.player.shiftFeedback.text = '';
        this.player.shiftFeedback.type = 'none';
      }
    }

    // 4. Nitro & Engine Stalls
    if (this.player.stallTimer > 0) {
      this.player.stallTimer -= dt;
      this.player.speed = Math.max(15, this.player.speed - 30 * dt);
      this.player.rpm = Math.max(REV_ZONES.IDLE, this.player.rpm - 2800 * dt);
    } else {
      if (this.player.isNitroActive) {
        this.player.nitroTimeRemaining -= dt;
        if (this.player.nitroTimeRemaining <= 0) {
          this.player.isNitroActive = false;
        }
      }

      const gearCfg = GEAR_CONFIG[this.player.gear - 1];
      let maxSpeedForGear = gearCfg.maxSpeed;
      let accelFactor = gearCfg.ratio * 22.0; // Responsive, punchy acceleration

      if (this.player.isNitroActive) {
        maxSpeedForGear += 70;
        accelFactor *= 2.4;
      }

      this.player.isOffRoad = Math.abs(this.player.x) > 1.0;
      if (this.player.isOffRoad) {
        maxSpeedForGear = Math.min(maxSpeedForGear, 45);
        accelFactor *= 0.25;
        this.player.bpm = Math.min(160, this.player.bpm + 12 * dt);
      }

      // Auto-Shift Transmission Assist: If holding throttle and at redline for 0.4s, auto upshift!
      if (this.inputs.throttle && this.player.rpm >= REV_ZONES.GREEN_MAX && this.player.gear < GEAR_CONFIG.length) {
        this.player.overrevTimer += dt;
        if (this.player.overrevTimer > 0.4) {
          this.player.overrevTimer = 0;
          this.player.gear++;
          this.player.rpm = Math.max(GEAR_CONFIG[this.player.gear - 1].minRpm, Math.floor(this.player.rpm * 0.68));
          this.player.shiftFeedback = { text: 'AUTO-SHIFT UP', type: 'normal', timer: 0.8 };
        }
      } else {
        this.player.overrevTimer = 0;
      }

      // Input Check
      const isThrottling = this.inputs.throttle || (!this.inputs.brake && this.player.speed < 25);
      if (this.inputs.brake) {
        this.player.speed = Math.max(0, this.player.speed - 95 * dt);
        this.player.rpm = Math.max(REV_ZONES.IDLE, this.player.rpm - 4000 * dt);
      } else if (isThrottling) {
        const rpmGain = (REV_ZONES.REDLINE - this.player.rpm) * dt * (this.player.isNitroActive ? 3.0 : 2.0);
        this.player.rpm = Math.min(REV_ZONES.REDLINE, this.player.rpm + rpmGain);

        if (this.player.speed < maxSpeedForGear) {
          this.player.speed = Math.min(maxSpeedForGear, this.player.speed + accelFactor * dt);
        } else if (this.player.speed > maxSpeedForGear) {
          this.player.speed = Math.max(maxSpeedForGear, this.player.speed - 18 * dt);
        }
      } else {
        this.player.speed = Math.max(0, this.player.speed - 24 * dt);
        this.player.rpm = Math.max(gearCfg.minRpm, this.player.rpm - 2000 * dt);
      }
    }

    // 5. Lateral Steering
    let steerVelocity = 0;
    if (this.inputs.steerLeft) steerVelocity -= 2.2;
    if (this.inputs.steerRight) steerVelocity += 2.2;

    if (Math.abs(this.player.spinVelocity) > 0.05) {
      this.player.x += this.player.spinVelocity * dt;
      this.player.spinVelocity *= Math.pow(0.1, dt);
    }

    const steerScale = Math.min(1.0, Math.max(0.3, this.player.speed / 40));
    this.player.x += steerVelocity * steerScale * dt;
    this.player.x = Math.max(-1.85, Math.min(1.85, this.player.x));

    // Roadside Guardrail Hit
    if (Math.abs(this.player.x) > 1.45) {
      this.player.shield = Math.max(0, this.player.shield - 20 * dt);
      this.player.speed = Math.max(20, this.player.speed - 70 * dt);
      this.player.bpm = Math.min(170, this.player.bpm + 20);
      this.triggerCrash('barrier', 0.6);
      this.player.x = Math.sign(this.player.x) * 1.40;
    }

    // 6. Dynamic Screen Position (Car surges forward on screen with speed)
    const targetScreenX = 110 + (this.player.speed / 380) * 140 + (this.player.isNitroActive ? 40 : 0);
    this.player.screenX += (targetScreenX - this.player.screenX) * dt * 4.0;

    // 7. Advance Track Distance
    const speedMps = (this.player.speed * 1000) / 3600;
    this.player.distance += speedMps * dt;

    // 8. Physiological Anxiety BPM
    let targetBpm = 75;
    if (this.player.speed > 240) targetBpm += 45;
    else if (this.player.speed > 150) targetBpm += 25;

    if (this.player.shield < 35) targetBpm += 35;
    if (this.player.isOffRoad) targetBpm += 25;

    const rivalDelta = Math.abs(this.player.distance - this.rival.distance);
    if (rivalDelta < 15) targetBpm += 20;

    if (!this.player.focusActive) {
      this.player.bpm += (targetBpm - this.player.bpm) * dt * 0.5;
    }

    // 9. Checkpoint Triggers
    for (const cp of this.checkpoints) {
      if (!cp.triggered && this.player.distance >= cp.distance) {
        cp.triggered = true;
        this.activeQuizCheckpoint = cp;
        this.player.bpm = Math.min(165, this.player.bpm + 18);
        break;
      }
    }

    // 10. Pickups & Rival AI
    this.checkCollisions();
    this.updateRivalAi(dt);
    this.checkRivalCollision(dt);

    // 11. Finish Line
    if (!this.player.hasFinished && this.player.distance >= this.trackLength) {
      this.player.hasFinished = true;
      this.player.finishTime = this.elapsedTime;
      this.player.score += Math.max(0, Math.floor(10000 - this.elapsedTime * 70));
    }

    if (!this.rival.hasFinished && this.rival.distance >= this.trackLength) {
      this.rival.hasFinished = true;
      this.rival.finishTime = this.elapsedTime;
    }

    if (this.player.hasFinished && this.rival.hasFinished) {
      this.status = 'finished';
    }
  }

  updateRivalAi(dt) {
    if (this.rival.hasFinished) return;

    const rivalCfg = GEAR_CONFIG[this.rival.gear - 1];
    let maxSpeed = rivalCfg.maxSpeed * this.rival.aiSkill;
    let accel = rivalCfg.ratio * 15.0 * this.rival.aiSkill;

    if (this.rival.rpm >= REV_ZONES.GREEN_MIN + 300) {
      if (this.rival.gear < GEAR_CONFIG.length) {
        this.rival.gear++;
        this.rival.rpm = Math.max(GEAR_CONFIG[this.rival.gear - 1].minRpm, Math.floor(this.rival.rpm * 0.65));
        this.rival.speed += 8;
      }
    } else {
      this.rival.rpm += (REV_ZONES.REDLINE - this.rival.rpm) * dt * 1.1;
    }

    if (!this.rival.isNitroActive && this.rival.distance < this.player.distance - 20 && this.rival.nitro >= 25) {
      this.rival.isNitroActive = true;
      this.rival.nitro -= 25;
      this.rivalNitroTime = 3.0;
    }

    if (this.rival.isNitroActive) {
      maxSpeed += 50;
      accel *= 1.8;
      this.rivalNitroTime -= dt;
      if (this.rivalNitroTime <= 0) {
        this.rival.isNitroActive = false;
      }
    }

    if (this.rival.speed < maxSpeed) {
      this.rival.speed = Math.min(maxSpeed, this.rival.speed + accel * dt);
    }

    const rivalSpeedMps = (this.rival.speed * 1000) / 3600;
    this.rival.distance += rivalSpeedMps * dt;
    this.rival.x = Math.sin(this.elapsedTime * 0.8) * 0.65;
  }

  checkRivalCollision(dt) {
    const distDelta = Math.abs(this.player.distance - this.rival.distance);
    const lateralDelta = Math.abs(this.player.x - this.rival.x);

    if (distDelta < 4.5 && lateralDelta < 0.38) {
      const pushDir = this.player.x >= this.rival.x ? 1 : -1;
      this.player.x = Math.max(-1.5, Math.min(1.5, this.player.x + pushDir * 0.28));
      this.rival.x = Math.max(-1.5, Math.min(1.5, this.rival.x - pushDir * 0.28));

      this.player.speed = Math.max(15, this.player.speed - 25);
      this.rival.speed = Math.max(15, this.rival.speed - 20);
      this.player.shield = Math.max(0, this.player.shield - 15);
      this.player.bpm = Math.min(170, this.player.bpm + 24);

      this.triggerCrash('rival', 1.0);
      this.player.shiftFeedback = { text: 'VEHICLE IMPACT! -15% SHIELD', type: 'stall', timer: 1.5 };
    }
  }

  checkCollisions() {
    for (const item of this.pickups) {
      if (item.collected) continue;

      const distDelta = Math.abs(this.player.distance - item.distance);
      const lateralDelta = Math.abs(this.player.x - item.x);

      if (distDelta < 5.0 && lateralDelta < 0.38) {
        item.collected = true;
        this.applyItemEffect(item.type);
      }
    }
  }

  applyItemEffect(type) {
    switch (type) {
      case 'battery':
        this.player.nitro = Math.min(100, this.player.nitro + 35);
        this.player.score += 200;
        this.player.shiftFeedback = { text: '+35% NITRO CELL', type: 'pickup', timer: 1.0 };
        break;
      case 'chip':
        this.player.score += 600;
        this.player.nitro = Math.min(100, this.player.nitro + 20);
        this.player.shiftFeedback = { text: '+600 STEM FORMULA CHIP', type: 'pickup', timer: 1.0 };
        break;
      case 'booster':
        this.player.speed = Math.min(420, this.player.speed + 45);
        this.player.score += 300;
        this.player.shiftFeedback = { text: 'KINETIC TURBO ACCELERATOR!', type: 'perfect', timer: 1.2 };
        break;
      case 'slick':
        this.player.speed = Math.max(25, this.player.speed * 0.70);
        this.player.shield = Math.max(0, this.player.shield - 12);
        this.player.spinVelocity = (Math.random() > 0.5 ? 1 : -1) * 2.8;
        this.player.bpm = Math.min(170, this.player.bpm + 22);
        this.triggerCrash('hazard', 0.75);
        this.player.shiftFeedback = { text: 'OIL SLICK SKID! -12% SHIELD', type: 'stall', timer: 1.4 };
        break;
    }
  }

  getTelemetry() {
    const scene = this.getScene();
    return {
      gear: this.player.gear,
      rpm: Math.round(this.player.rpm),
      speed: Math.round(this.player.speed),
      distance: Math.round(this.player.distance),
      nitro: Math.round(this.player.nitro),
      shield: Math.round(this.player.shield),
      bpm: Math.round(this.player.bpm),
      focusActive: this.player.focusActive,
      isOffRoad: this.player.isOffRoad,
      isBraking: this.player.isBraking,
      score: this.player.score,
      playerName: this.playerName,
      character: this.character,
      sceneId: scene.id,
      sceneName: scene.name,
      time: this.elapsedTime.toFixed(2),
      rivalDist: Math.round(this.rival.distance),
      rivalSpeed: Math.round(this.rival.speed),
      leadDelta: Math.round(this.player.distance - this.rival.distance)
    };
  }
}
