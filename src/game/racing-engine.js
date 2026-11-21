/**
 * @fileoverview High-performance 8-bit racing physics and transmission simulation.
 * Inspired by classic arcade drag racers (tachometer gear shifting, rev zones, rival AI).
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

    this.reset();
  }

  reset() {
    this.status = 'ready'; // ready, countdown, racing, finished
    this.countdownTime = 3.0; // 3, 2, 1, GO
    this.elapsedTime = 0;

    // Player State
    this.player = {
      gear: 1,
      rpm: REV_ZONES.IDLE,
      speed: 0, // km/h
      distance: 0, // meters
      lane: 1, // 0: Top, 1: Middle, 2: Bottom
      targetLane: 1,
      laneProgress: 1.0,
      nitro: 50, // 0-100%
      isNitroActive: false,
      nitroTimeRemaining: 0,
      shield: 100, // 0-100%
      stallTimer: 0, // seconds
      overrevTimer: 0, // seconds
      shiftFeedback: { text: '', type: 'none', timer: 0 },
      perfectShifts: 0,
      score: 0,
      hasFinished: false,
      finishTime: 0
    };

    // Rival AI State
    this.rival = {
      name: TRACK_CIRCUITS[this.circuitId]?.rivalName || 'Rival-GT',
      gear: 1,
      rpm: REV_ZONES.IDLE,
      speed: 0,
      distance: 0,
      lane: 0,
      nitro: 40,
      isNitroActive: false,
      aiSkill: 0.85 + Math.min(0.12, (this.grade - 1) * 0.015),
      hasFinished: false,
      finishTime: 0
    };

    // Track Pickups and Obstacles
    this.pickups = this.generateTrackItems();

    // STEM Pitstop Checkpoint Triggers
    this.checkpoints = [
      { distance: 250, triggered: false },
      { distance: 550, triggered: false },
      { distance: 850, triggered: false }
    ];

    this.activeQuizCheckpoint = null;
  }

  generateTrackItems() {
    const items = [];
    const step = 90;
    const count = Math.floor(this.trackLength / step);

    for (let i = 1; i < count; i++) {
      const d = i * step + ((i * 17) % 30);
      const lane = (i * 2 + 1) % 3;
      const r = (i * 37) % 100;
      let type = 'battery';

      if (r < 40) type = 'battery'; // +Nitro
      else if (r < 70) type = 'chip'; // +Points & STEM Formula
      else if (r < 85) type = 'booster'; // Instant Speed burst
      else type = 'slick'; // Hazard

      items.push({
        id: `item-${i}`,
        distance: d,
        lane,
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

  // --- Controls ---

  shiftUp() {
    if (this.status !== 'racing') return;
    if (this.player.stallTimer > 0) return;
    if (this.player.gear >= GEAR_CONFIG.length) return;

    const currentRpm = this.player.rpm;
    let feedback = { text: '', type: 'none', timer: 1.2 };

    if (currentRpm >= REV_ZONES.GREEN_MIN && currentRpm <= REV_ZONES.GREEN_MAX) {
      // Perfect Shift!
      feedback = { text: 'PERFECT SHIFT!', type: 'perfect', timer: 1.4 };
      this.player.perfectShifts++;
      this.player.score += 250;
      this.player.nitro = Math.min(100, this.player.nitro + 25);
      // Immediate torque impulse
      this.player.speed += 8;
    } else if (currentRpm > REV_ZONES.GREEN_MAX) {
      // Late Shift / Redline
      feedback = { text: 'LATE SHIFT!', type: 'late', timer: 1.0 };
      this.player.score += 50;
    } else {
      // Early Shift / Engine Bogs Down
      feedback = { text: 'BOGGED DOWN!', type: 'early', timer: 1.2 };
      this.player.speed = Math.max(10, this.player.speed * 0.92);
    }

    this.player.gear++;
    const cfg = GEAR_CONFIG[this.player.gear - 1];
    // Lower RPM based on gear ratio step
    this.player.rpm = Math.max(cfg.minRpm, Math.floor(currentRpm * 0.65));
    this.player.shiftFeedback = feedback;
  }

  shiftDown() {
    if (this.status !== 'racing') return;
    if (this.player.gear <= 1) return;

    this.player.gear--;
    // Rev matches up
    this.player.rpm = Math.min(REV_ZONES.MAX_RPM - 200, Math.floor(this.player.rpm * 1.35));
    this.player.shiftFeedback = { text: 'DOWNSHIFT', type: 'down', timer: 0.8 };
  }

  steerLane(direction) {
    // direction: -1 (up/lane-), +1 (down/lane+)
    if (this.status !== 'racing') return;
    const target = Math.max(0, Math.min(2, this.player.lane + direction));
    if (target !== this.player.lane) {
      this.player.lane = target;
      this.player.targetLane = target;
    }
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
    return true;
  }

  // --- STEM Quiz Callbacks ---

  onQuizAnswer(isCorrect) {
    if (isCorrect) {
      this.player.score += 1000;
      this.player.nitro = 100; // Full Super Nitro recharge!
      this.player.isNitroActive = true;
      this.player.nitroTimeRemaining = 5.0; // Extended Super Nitro
      this.player.stallTimer = 0;
      this.player.speed = Math.min(GEAR_CONFIG[this.player.gear - 1].maxSpeed + 40, this.player.speed + 35);
      this.player.shiftFeedback = { text: 'STEM OVERDRIVE ACTIVATED!', type: 'perfect', timer: 2.0 };
    } else {
      // Penalty: EMP discharge, lose 25% shield, stall engine for 2 seconds
      this.player.shield = Math.max(0, this.player.shield - 25);
      this.player.nitro = Math.max(0, this.player.nitro - 50);
      this.player.stallTimer = 2.0;
      this.player.speed = Math.max(15, this.player.speed * 0.65);
      this.player.shiftFeedback = { text: 'CONTAINMENT STALL: -25% SHIELD', type: 'stall', timer: 2.0 };
    }
  }

  // --- Physics & Simulation Step ---

  update(dt) {
    if (this.status === 'countdown') {
      this.countdownTime -= dt;
      if (this.countdownTime <= 0) {
        this.status = 'racing';
      }
      return;
    }

    if (this.status !== 'racing') return;

    this.elapsedTime += dt;

    // 1. Update Player Shift Feedback Timer
    if (this.player.shiftFeedback.timer > 0) {
      this.player.shiftFeedback.timer -= dt;
      if (this.player.shiftFeedback.timer <= 0) {
        this.player.shiftFeedback.text = '';
        this.player.shiftFeedback.type = 'none';
      }
    }

    // 2. Update Nitro & Stalls
    if (this.player.stallTimer > 0) {
      this.player.stallTimer -= dt;
      this.player.speed = Math.max(10, this.player.speed - 30 * dt);
      this.player.rpm = Math.max(REV_ZONES.IDLE, this.player.rpm - 2500 * dt);
    } else {
      if (this.player.isNitroActive) {
        this.player.nitroTimeRemaining -= dt;
        if (this.player.nitroTimeRemaining <= 0) {
          this.player.isNitroActive = false;
        }
      }

      // 3. Player Acceleration & RPM Curves
      const gearCfg = GEAR_CONFIG[this.player.gear - 1];
      let maxSpeedForGear = gearCfg.maxSpeed;
      let accelFactor = gearCfg.ratio * 14.0;

      if (this.player.isNitroActive) {
        maxSpeedForGear += 50;
        accelFactor *= 2.2;
      }

      // Check Redline Limiter
      if (this.player.rpm >= REV_ZONES.REDLINE) {
        this.player.overrevTimer += dt;
        // Engine sputter at redline
        this.player.rpm = REV_ZONES.REDLINE + Math.sin(this.elapsedTime * 40) * 120;
        accelFactor *= 0.15; // Drastically reduced acceleration
      } else {
        this.player.overrevTimer = 0;
        // Natural RPM climbing with speed
        const targetRpm = Math.min(
          REV_ZONES.MAX_RPM,
          gearCfg.minRpm + (this.player.speed / gearCfg.maxSpeed) * (REV_ZONES.REDLINE - gearCfg.minRpm) + 600
        );
        this.player.rpm += (targetRpm - this.player.rpm) * Math.min(1.0, dt * 5.0);
      }

      if (this.player.speed < maxSpeedForGear) {
        this.player.speed = Math.min(maxSpeedForGear, this.player.speed + accelFactor * dt);
      } else if (this.player.speed > maxSpeedForGear && !this.player.isNitroActive) {
        this.player.speed = Math.max(maxSpeedForGear, this.player.speed - 20 * dt);
      }
    }

    // Advance Player Distance (km/h -> m/s)
    const playerSpeedMps = (this.player.speed * 1000) / 3600;
    this.player.distance += playerSpeedMps * dt;

    // 4. Update Rival AI Driver
    this.updateRivalAi(dt);

    // 5. Track Item Collisions
    this.checkCollisions();

    // 6. Check STEM Checkpoints
    for (const cp of this.checkpoints) {
      if (!cp.triggered && this.player.distance >= cp.distance) {
        cp.triggered = true;
        this.activeQuizCheckpoint = cp;
        break;
      }
    }

    // 7. Check Finish Line
    if (!this.player.hasFinished && this.player.distance >= this.trackLength) {
      this.player.hasFinished = true;
      this.player.finishTime = this.elapsedTime;
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
    let accel = rivalCfg.ratio * 13.0 * this.rival.aiSkill;

    // AI Shift logic
    if (this.rival.rpm >= REV_ZONES.GREEN_MIN + 300) {
      if (this.rival.gear < GEAR_CONFIG.length) {
        this.rival.gear++;
        this.rival.rpm = Math.max(GEAR_CONFIG[this.rival.gear - 1].minRpm, Math.floor(this.rival.rpm * 0.65));
        // Bonus acceleration for clean AI shift
        this.rival.speed += 5;
      }
    } else {
      this.rival.rpm += (REV_ZONES.REDLINE - this.rival.rpm) * dt * 0.9;
    }

    // AI Nitro Usage: Trigger when falling behind player
    if (!this.rival.isNitroActive && this.rival.distance < this.player.distance - 25 && this.rival.nitro >= 30) {
      this.rival.isNitroActive = true;
      this.rival.nitro -= 30;
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
  }

  checkCollisions() {
    for (const item of this.pickups) {
      if (item.collected) continue;

      // Hit range: player is within 4 meters of item distance and same lane
      const distDelta = Math.abs(this.player.distance - item.distance);
      if (distDelta < 5.0 && this.player.lane === item.lane) {
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
        this.player.speed = Math.max(20, this.player.speed * 0.72);
        this.player.shield = Math.max(0, this.player.shield - 10);
        this.player.shiftFeedback = { text: 'OIL SLICK SKID! -10% SHIELD', type: 'stall', timer: 1.2 };
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
      score: this.player.score,
      time: this.elapsedTime.toFixed(2),
      rivalDist: Math.round(this.rival.distance),
      rivalSpeed: Math.round(this.rival.speed),
      leadDelta: Math.round(this.player.distance - this.rival.distance)
    };
  }
}
