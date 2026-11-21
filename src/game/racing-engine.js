/**
 * @fileoverview High-performance 8-bit racing physics, real vehicle kinematics,
 * free lateral track steering, off-road surface friction, rival collision physics,
 * and physiological exam anxiety / composure management.
 */

export const GEAR_CONFIG = [
  { gear: 1, ratio: 3.6, maxSpeed: 65, minRpm: 1000 },
  { gear: 2, ratio: 2.5, maxSpeed: 115, minRpm: 2200 },
  { gear: 3, ratio: 1.8, maxSpeed: 175, minRpm: 2600 },
  { gear: 4, ratio: 1.3, maxSpeed: 245, minRpm: 3000 },
  { gear: 5, ratio: 0.95, maxSpeed: 325, minRpm: 3400 },
  { gear: 6, ratio: 0.75, maxSpeed: 385, minRpm: 3800 }
];

export const REV_ZONES = {
  IDLE: 1000,
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

    // Driving Inputs
    this.inputs = {
      throttle: false,
      brake: false,
      steerLeft: false,
      steerRight: false
    };

    // Impact / Screen Shake State
    this.screenShake = 0; // seconds remaining
    this.crashEvent = null; // { type: 'rival' | 'hazard' | 'offroad', intensity: 1.0 }

    this.reset();
  }

  reset() {
    this.status = 'ready'; // ready, countdown, racing, finished
    this.countdownTime = 3.0;
    this.elapsedTime = 0;
    this.timeScale = 1.0;

    // Player State
    this.player = {
      gear: 1,
      rpm: REV_ZONES.IDLE,
      speed: 0, // km/h
      distance: 0, // meters
      x: 0.0, // Continuous lateral position: -1.0 (Left edge) to +1.0 (Right edge). >1.0 is off-road!
      lane: 1, // Discrete fallback for backward compatibility
      spinVelocity: 0, // Lateral skid on oil slicks
      isOffRoad: false,
      isBraking: false,
      nitro: 50, // 0-100%
      isNitroActive: false,
      nitroTimeRemaining: 0,
      shield: 100, // 0-100%
      stallTimer: 0, // seconds
      overrevTimer: 0,
      shiftFeedback: { text: '', type: 'none', timer: 0 },
      perfectShifts: 0,
      score: 0,
      hasFinished: false,
      finishTime: 0,

      // Anxiety & Composure Model
      bpm: 78, // Heart rate: baseline 75, rises to 170 with speed/pressure
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
      x: -0.5, // Continuous lateral position
      nitro: 40,
      isNitroActive: false,
      aiSkill: 0.85 + Math.min(0.12, (this.grade - 1) * 0.015),
      hasFinished: false,
      finishTime: 0
    };

    this.pickups = this.generateTrackItems();

    this.checkpoints = [
      { distance: 250, triggered: false },
      { distance: 550, triggered: false },
      { distance: 850, triggered: false }
    ];

    this.activeQuizCheckpoint = null;
  }

  generateTrackItems() {
    const items = [];
    const step = 85;
    const count = Math.floor(this.trackLength / step);

    for (let i = 1; i < count; i++) {
      const d = i * step + ((i * 19) % 25);
      // Continuous x positions corresponding to left, center, right lanes
      const laneIndex = (i * 2 + 1) % 3;
      const xMap = [-0.6, 0.0, 0.6];
      const posX = xMap[laneIndex];
      const r = (i * 37) % 100;
      let type = 'battery';

      if (r < 40) type = 'battery'; // +Nitro
      else if (r < 65) type = 'chip'; // +Points STEM
      else if (r < 80) type = 'booster'; // Kinetic booster
      else type = 'slick'; // Hazard oil slick

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
    this.countdownTime = 3.0;
  }

  startRace() {
    this.status = 'racing';
  }

  // --- Manual Driving Controls ---

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

  updateLaneFallback() {
    if (this.player.x < -0.3) this.player.lane = 0;
    else if (this.player.x > 0.3) this.player.lane = 2;
    else this.player.lane = 1;
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
      this.player.speed += 12; // Instant torque thrust
      this.player.bpm = Math.max(70, this.player.bpm - 8); // Satisfaction calms anxiety
    } else if (currentRpm > REV_ZONES.GREEN_MAX) {
      // Late Shift / Redline
      feedback = { text: 'LATE SHIFT!', type: 'late', timer: 1.0 };
      this.player.score += 50;
      this.player.bpm = Math.min(170, this.player.bpm + 10);
    } else {
      // Early Shift / Engine Bogs Down
      feedback = { text: 'BOGGED DOWN!', type: 'early', timer: 1.2 };
      this.player.speed = Math.max(10, this.player.speed * 0.88);
      this.player.bpm = Math.min(170, this.player.bpm + 12);
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
    this.player.nitroTimeRemaining = 3.5;
    this.player.nitro = Math.max(0, this.player.nitro - 25);
    this.player.score += 100;
    this.player.bpm = Math.min(160, this.player.bpm + 15);
    return true;
  }

  /**
   * Activates Pranayama / Zen Focus Breath:
   * Cools anxiety, slows simulation time to bullet-time, and steadies car handling.
   */
  activateFocus() {
    if (this.status !== 'racing') return false;
    if (this.player.focusCooldown > 0) return false;

    this.player.focusActive = true;
    this.player.focusTimeRemaining = 3.5;
    this.player.focusCooldown = 12.0;
    this.timeScale = 0.55; // 55% bullet-time slow motion!
    this.player.bpm = 72; // Vagus nerve reset
    this.player.score += 300;
    this.player.shiftFeedback = {
      text: 'ZEN BREATH: VAGUS RESET (+300 PTS)',
      type: 'perfect',
      timer: 2.0
    };
    return true;
  }

  // --- STEM Quiz Callbacks ---

  onQuizAnswer(isCorrect) {
    if (isCorrect) {
      this.player.score += 1000;
      this.player.nitro = 100; // Full Super Nitro recharge!
      this.player.isNitroActive = true;
      this.player.nitroTimeRemaining = 5.0;
      this.player.stallTimer = 0;
      this.player.speed = Math.min(GEAR_CONFIG[this.player.gear - 1].maxSpeed + 45, this.player.speed + 35);
      this.player.bpm = Math.max(72, this.player.bpm - 20); // Confidence surge
      this.player.shiftFeedback = { text: 'STEM SUPER NITRO ENGAGED!', type: 'perfect', timer: 2.2 };
    } else {
      // Penalty: EMP discharge, lose 25% shield, stall engine
      this.player.shield = Math.max(0, this.player.shield - 25);
      this.player.nitro = Math.max(0, this.player.nitro - 50);
      this.player.stallTimer = 2.0;
      this.player.speed = Math.max(15, this.player.speed * 0.60);
      this.player.bpm = Math.min(165, this.player.bpm + 25);
      this.triggerCrash('hazard', 0.8);
      this.player.shiftFeedback = { text: 'CONTAINMENT STALL: -25% SHIELD', type: 'stall', timer: 2.2 };
    }
  }

  triggerCrash(type = 'hazard', intensity = 1.0) {
    this.screenShake = 0.35 * intensity;
    this.crashEvent = { type, intensity, time: 0.4 };
  }

  // --- Main Physics Simulation Step ---

  update(rawDt) {
    if (this.status === 'countdown') {
      this.countdownTime -= rawDt;
      if (this.countdownTime <= 0) {
        this.status = 'racing';
      }
      return;
    }

    if (this.status !== 'racing') return;

    // Apply Focus / Bullet-time timescale
    const dt = rawDt * this.timeScale;
    this.elapsedTime += rawDt;

    // 1. Update Focus / Zen Breath State
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

    // 2. Update Screen Shake & Impact Decays
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - rawDt);
    }
    if (this.crashEvent) {
      this.crashEvent.time -= rawDt;
      if (this.crashEvent.time <= 0) this.crashEvent = null;
    }

    // 3. Update Feedback Timer
    if (this.player.shiftFeedback.timer > 0) {
      this.player.shiftFeedback.timer -= dt;
      if (this.player.shiftFeedback.timer <= 0) {
        this.player.shiftFeedback.text = '';
        this.player.shiftFeedback.type = 'none';
      }
    }

    // 4. Update Nitro & Stalls
    if (this.player.stallTimer > 0) {
      this.player.stallTimer -= dt;
      this.player.speed = Math.max(10, this.player.speed - 35 * dt);
      this.player.rpm = Math.max(REV_ZONES.IDLE, this.player.rpm - 2600 * dt);
    } else {
      if (this.player.isNitroActive) {
        this.player.nitroTimeRemaining -= dt;
        if (this.player.nitroTimeRemaining <= 0) {
          this.player.isNitroActive = false;
        }
      }

      // --- Vehicle Throttle, Braking & Speed Kinematics ---
      const gearCfg = GEAR_CONFIG[this.player.gear - 1];
      let maxSpeedForGear = gearCfg.maxSpeed;
      let accelFactor = gearCfg.ratio * 15.0;

      if (this.player.isNitroActive) {
        maxSpeedForGear += 55;
        accelFactor *= 2.3;
      }

      // Off-road penalty: driving outside asphalt (-1.0 to 1.0)
      this.player.isOffRoad = Math.abs(this.player.x) > 1.0;
      if (this.player.isOffRoad) {
        maxSpeedForGear = Math.min(maxSpeedForGear, 42); // Harsh off-road friction
        accelFactor *= 0.25;
        this.player.bpm = Math.min(160, this.player.bpm + 10 * dt);
      }

      // Input Check: Manual Throttle vs Coasting vs Braking
      const isThrottling = this.inputs.throttle || (!this.inputs.brake && this.player.speed < 20); // Auto roll start
      if (this.inputs.brake) {
        // Active Braking
        this.player.speed = Math.max(0, this.player.speed - 85 * dt);
        this.player.rpm = Math.max(REV_ZONES.IDLE, this.player.rpm - 3500 * dt);
      } else if (isThrottling) {
        // Active Acceleration
        if (this.player.rpm >= REV_ZONES.REDLINE) {
          this.player.overrevTimer += dt;
          this.player.rpm = REV_ZONES.REDLINE + Math.sin(this.elapsedTime * 45) * 130;
          accelFactor *= 0.12;
        } else {
          const rpmGain = (REV_ZONES.REDLINE - this.player.rpm) * dt * (this.player.isNitroActive ? 2.5 : 1.4);
          this.player.rpm = Math.min(REV_ZONES.REDLINE, this.player.rpm + rpmGain);
        }

        if (this.player.speed < maxSpeedForGear) {
          this.player.speed = Math.min(maxSpeedForGear, this.player.speed + accelFactor * dt);
        } else if (this.player.speed > maxSpeedForGear) {
          // Friction drag down to gear cap
          this.player.speed = Math.max(maxSpeedForGear, this.player.speed - 15 * dt);
        }
      } else {
        // Coasting / Engine Braking
        this.player.speed = Math.max(0, this.player.speed - 22 * dt);
        this.player.rpm = Math.max(gearCfg.minRpm, this.player.rpm - 1800 * dt);
      }
    }

    // --- Free Lateral Steering & Skid Simulation ---
    let steerVelocity = 0;
    if (this.inputs.steerLeft) steerVelocity -= 1.8;
    if (this.inputs.steerRight) steerVelocity += 1.8;

    // Apply spin velocity from oil slicks
    if (Math.abs(this.player.spinVelocity) > 0.05) {
      this.player.x += this.player.spinVelocity * dt;
      this.player.spinVelocity *= Math.pow(0.1, dt); // Quick decay
    }

    // Steering effectiveness scales with vehicle speed
    const steerSpeedScale = Math.min(1.0, Math.max(0.2, this.player.speed / 50));
    this.player.x += steerVelocity * steerSpeedScale * dt;

    // Clamp extreme boundaries
    this.player.x = Math.max(-1.85, Math.min(1.85, this.player.x));
    this.updateLaneFallback();

    // Roadside Guardrail / Barrier Crash check
    if (Math.abs(this.player.x) > 1.45) {
      this.player.shield = Math.max(0, this.player.shield - 20 * dt);
      this.player.speed = Math.max(15, this.player.speed - 65 * dt);
      this.player.bpm = Math.min(170, this.player.bpm + 20);
      this.triggerCrash('barrier', 0.6);
      // Rebound inward
      this.player.x = Math.sign(this.player.x) * 1.40;
    }

    // --- Advance Track Distance ---
    const speedMps = (this.player.speed * 1000) / 3600;
    this.player.distance += speedMps * dt;

    // --- Update Physiological Anxiety (Pulse BPM) ---
    let targetBpm = 75;
    if (this.player.speed > 220) targetBpm += 40;
    else if (this.player.speed > 130) targetBpm += 20;

    if (this.player.shield < 35) targetBpm += 35;
    if (this.player.isOffRoad) targetBpm += 25;

    // Rival proximity tension
    const rivalDelta = Math.abs(this.player.distance - this.rival.distance);
    if (rivalDelta < 15) targetBpm += 20;

    if (!this.player.focusActive) {
      this.player.bpm += (targetBpm - this.player.bpm) * dt * 0.4;
    }

    // --- Checkpoint Triggers ---
    for (const cp of this.checkpoints) {
      if (!cp.triggered && this.player.distance >= cp.distance) {
        cp.triggered = true;
        this.activeQuizCheckpoint = cp;
        this.player.bpm = Math.min(165, this.player.bpm + 18); // Checkpoint spike
        break;
      }
    }

    // --- Check Pickups & Hazards Collisions ---
    this.checkCollisions();

    // --- Update Rival AI & Vehicle Collisions ---
    this.updateRivalAi(dt);
    this.checkRivalCollision(dt);

    // --- Finish Line Check ---
    if (!this.player.hasFinished && this.player.distance >= this.trackLength) {
      this.player.hasFinished = true;
      this.player.finishTime = this.elapsedTime;
      this.player.score += Math.max(0, Math.floor(10000 - this.elapsedTime * 80));
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
    let accel = rivalCfg.ratio * 13.5 * this.rival.aiSkill;

    // AI Shift logic
    if (this.rival.rpm >= REV_ZONES.GREEN_MIN + 300) {
      if (this.rival.gear < GEAR_CONFIG.length) {
        this.rival.gear++;
        this.rival.rpm = Math.max(GEAR_CONFIG[this.rival.gear - 1].minRpm, Math.floor(this.rival.rpm * 0.65));
        this.rival.speed += 6;
      }
    } else {
      this.rival.rpm += (REV_ZONES.REDLINE - this.rival.rpm) * dt * 0.95;
    }

    // AI Nitro Usage
    if (!this.rival.isNitroActive && this.rival.distance < this.player.distance - 20 && this.rival.nitro >= 25) {
      this.rival.isNitroActive = true;
      this.rival.nitro -= 25;
      this.rivalNitroTime = 3.0;
    }

    if (this.rival.isNitroActive) {
      maxSpeed += 40;
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

    // Rival AI lateral weave / defensive racing line
    this.rival.x = Math.sin(this.elapsedTime * 0.8) * 0.65;
  }

  checkRivalCollision(dt) {
    // Distance delta and lateral overlap check
    const distDelta = Math.abs(this.player.distance - this.rival.distance);
    const lateralDelta = Math.abs(this.player.x - this.rival.x);

    if (distDelta < 4.2 && lateralDelta < 0.38) {
      // Impact! Both cars bounce away laterally
      const pushDir = this.player.x >= this.rival.x ? 1 : -1;
      this.player.x = Math.max(-1.5, Math.min(1.5, this.player.x + pushDir * 0.28));
      this.rival.x = Math.max(-1.5, Math.min(1.5, this.rival.x - pushDir * 0.28));

      // Mutual speed loss and shield crunch
      this.player.speed = Math.max(10, this.player.speed - 25);
      this.rival.speed = Math.max(10, this.rival.speed - 20);
      this.player.shield = Math.max(0, this.player.shield - 15);
      this.player.bpm = Math.min(170, this.player.bpm + 24);

      this.triggerCrash('rival', 1.0);
      this.player.shiftFeedback = { text: 'VEHICLE COLLISION! -15% SHIELD', type: 'stall', timer: 1.5 };
    }
  }

  checkCollisions() {
    for (const item of this.pickups) {
      if (item.collected) continue;

      const distDelta = Math.abs(this.player.distance - item.distance);
      const lateralDelta = Math.abs(this.player.x - item.x);

      // Hit range: within 5 meters of track distance and within 0.35 lateral offset
      if (distDelta < 5.0 && lateralDelta < 0.38) {
        item.collected = true;
        this.applyItemEffect(item.type);
      }
    }
  }

  applyItemEffect(type) {
    switch (type) {
      case 'battery':
        this.player.nitro = Math.min(100, this.player.nitro + 30);
        this.player.score += 150;
        this.player.shiftFeedback = { text: '+30% NITRO CELL', type: 'pickup', timer: 1.0 };
        break;
      case 'chip':
        this.player.score += 500;
        this.player.nitro = Math.min(100, this.player.nitro + 15);
        this.player.shiftFeedback = { text: '+500 STEM FORMULA CHIP', type: 'pickup', timer: 1.0 };
        break;
      case 'booster':
        this.player.speed = Math.min(360, this.player.speed + 35);
        this.player.score += 250;
        this.player.shiftFeedback = { text: 'KINETIC ACCELERATOR!', type: 'perfect', timer: 1.2 };
        break;
      case 'slick':
        this.player.speed = Math.max(20, this.player.speed * 0.70);
        this.player.shield = Math.max(0, this.player.shield - 12);
        this.player.spinVelocity = (Math.random() > 0.5 ? 1 : -1) * 2.8;
        this.player.bpm = Math.min(170, this.player.bpm + 22);
        this.triggerCrash('hazard', 0.75);
        this.player.shiftFeedback = { text: 'OIL SLICK SKID! -12% SHIELD', type: 'stall', timer: 1.4 };
        break;
    }
  }

  getTelemetry() {
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
      time: this.elapsedTime.toFixed(2),
      rivalDist: Math.round(this.rival.distance),
      rivalSpeed: Math.round(this.rival.speed),
      leadDelta: Math.round(this.player.distance - this.rival.distance)
    };
  }
}
