import test from 'node:test';
import assert from 'node:assert/strict';

import { RacingEngine, REV_ZONES, GEAR_CONFIG, TRACK_CIRCUITS } from '../src/game/racing-engine.js';

test('RacingEngine initializes with default player and rival state', () => {
  const engine = new RacingEngine({ trackLength: 1000, circuitId: 'physics', grade: 5 });

  assert.strictEqual(engine.status, 'ready');
  assert.strictEqual(engine.player.gear, 1);
  assert.strictEqual(engine.player.rpm, REV_ZONES.IDLE);
  assert.strictEqual(engine.player.speed, 0);
  assert.strictEqual(engine.player.distance, 0);
  assert.strictEqual(engine.player.lane, 1);
  assert.strictEqual(engine.player.shield, 100);
  assert.strictEqual(engine.rival.gear, 1);
  assert.strictEqual(engine.rival.name, 'Newton-GT');
  assert.ok(engine.pickups.length > 5, 'Track should generate pickups and hazards');
});

test('Shift Up in Green Zone triggers Perfect Shift and awards Nitro', () => {
  const engine = new RacingEngine();
  engine.status = 'racing';
  engine.player.rpm = 6400; // Inside GREEN_MIN (5800) and GREEN_MAX (7000)

  const initialNitro = engine.player.nitro;
  const initialScore = engine.player.score;

  engine.shiftUp();

  assert.strictEqual(engine.player.gear, 2);
  assert.strictEqual(engine.player.shiftFeedback.type, 'perfect');
  assert.strictEqual(engine.player.shiftFeedback.text, 'PERFECT SHIFT!');
  assert.strictEqual(engine.player.perfectShifts, 1);
  assert.strictEqual(engine.player.score, initialScore + 250);
  assert.strictEqual(engine.player.nitro, Math.min(100, initialNitro + 25));
});

test('Shift Up in Yellow Zone bogs down the engine', () => {
  const engine = new RacingEngine();
  engine.status = 'racing';
  engine.player.rpm = 3000; // Well below GREEN_MIN (5800)
  engine.player.speed = 50;

  engine.shiftUp();

  assert.strictEqual(engine.player.gear, 2);
  assert.strictEqual(engine.player.shiftFeedback.type, 'early');
  assert.strictEqual(engine.player.shiftFeedback.text, 'BOGGED DOWN!');
  assert.ok(engine.player.speed < 50, 'Early shift reduces instantaneous torque and speed');
});

test('Shift Up beyond Redline triggers Late Shift feedback', () => {
  const engine = new RacingEngine();
  engine.status = 'racing';
  engine.player.rpm = 8200; // Above GREEN_MAX (7000)

  engine.shiftUp();

  assert.strictEqual(engine.player.gear, 2);
  assert.strictEqual(engine.player.shiftFeedback.type, 'late');
  assert.strictEqual(engine.player.shiftFeedback.text, 'LATE SHIFT!');
});

test('Downshifting rev-matches up and updates gear', () => {
  const engine = new RacingEngine();
  engine.status = 'racing';
  engine.player.gear = 3;
  engine.player.rpm = 3500;

  engine.shiftDown();

  assert.strictEqual(engine.player.gear, 2);
  assert.ok(engine.player.rpm > 3500, 'Downshifting rev-matches higher');
  assert.strictEqual(engine.player.shiftFeedback.type, 'down');
});

test('Nitro activation consumes 25% nitro and triggers overdrive', () => {
  const engine = new RacingEngine();
  engine.status = 'racing';
  engine.player.nitro = 50;

  const activated = engine.activateNitro();

  assert.strictEqual(activated, true);
  assert.strictEqual(engine.player.isNitroActive, true);
  assert.strictEqual(engine.player.nitro, 25);
  assert.ok(engine.player.nitroTimeRemaining > 0);

  // Second activation while active should be ignored
  const second = engine.activateNitro();
  assert.strictEqual(second, false);
});

test('Steering lane adjusts lane within 0 to 2 bounds', () => {
  const engine = new RacingEngine();
  engine.status = 'racing';
  assert.strictEqual(engine.player.lane, 1);

  engine.steerLane(-1); // Up to lane 0
  assert.strictEqual(engine.player.lane, 0);

  engine.steerLane(-1); // Clamp at 0
  assert.strictEqual(engine.player.lane, 0);

  engine.steerLane(1); // Down to lane 1
  assert.strictEqual(engine.player.lane, 1);

  engine.steerLane(1); // Down to lane 2
  assert.strictEqual(engine.player.lane, 2);

  engine.steerLane(1); // Clamp at 2
  assert.strictEqual(engine.player.lane, 2);
});

test('STEM Quiz answer callback applies high-stakes boost or penalty', () => {
  const engine = new RacingEngine();
  engine.status = 'racing';

  // 1. Correct Answer: Super Nitro recharge and score boost
  engine.player.nitro = 10;
  engine.onQuizAnswer(true);

  assert.strictEqual(engine.player.nitro, 100);
  assert.strictEqual(engine.player.isNitroActive, true);
  assert.strictEqual(engine.player.score, 1000);
  assert.strictEqual(engine.player.shiftFeedback.type, 'perfect');

  // 2. Incorrect Answer: -25% Shield, engine containment stall
  engine.player.shield = 100;
  engine.onQuizAnswer(false);

  assert.strictEqual(engine.player.shield, 75);
  assert.ok(engine.player.stallTimer > 0, 'Engine must stall on incorrect answer');
  assert.strictEqual(engine.player.shiftFeedback.type, 'stall');
});

test('Physics simulation advances player and rival distances over time', () => {
  const engine = new RacingEngine({ trackLength: 800 });
  engine.startRace();

  engine.player.speed = 100; // km/h
  engine.rival.speed = 90;

  engine.update(0.1); // 100ms dt

  assert.ok(engine.player.distance > 0, 'Player distance must advance');
  assert.ok(engine.rival.distance > 0, 'Rival distance must advance');
  assert.ok(engine.player.distance > engine.rival.distance, 'Faster car leads');

  const telemetry = engine.getTelemetry();
  assert.ok(typeof telemetry.speed === 'number');
  assert.ok(typeof telemetry.rpm === 'number');
  assert.ok(typeof telemetry.distance === 'number');
  assert.ok(typeof telemetry.bpm === 'number');
});

test('Manual throttle accelerates and active brake decelerates the vehicle', () => {
  const engine = new RacingEngine();
  engine.startRace();

  engine.setThrottle(true);
  engine.update(0.5);
  const speedAfterGas = engine.player.speed;
  assert.ok(speedAfterGas > 0, 'Car must accelerate when throttle is held');

  engine.setThrottle(false);
  engine.setBrake(true);
  engine.update(0.2);
  assert.ok(engine.player.speed < speedAfterGas, 'Car must decelerate when brake is applied');
  assert.strictEqual(engine.player.isBraking, true);
});

test('Rival vehicle collision causes shield damage and screen impact crunch', () => {
  const engine = new RacingEngine();
  engine.startRace();

  engine.player.shield = 100;
  engine.player.distance = 100;
  engine.player.x = 0.0;

  engine.rival.distance = 101; // Overlapping distance
  engine.rival.x = 0.05; // Overlapping lateral position

  engine.checkRivalCollision(0.1);

  assert.ok(engine.player.shield < 100, 'Collision must reduce shield');
  assert.ok(engine.screenShake > 0, 'Collision must trigger screen shake');
  assert.ok(engine.crashEvent !== null, 'Collision event must be recorded');
});

test('Anxiety BPM model increases under stress and calms with Zen breath', () => {
  const engine = new RacingEngine();
  engine.startRace();

  // Low shield and high speed stress the player
  engine.player.shield = 20;
  engine.player.speed = 240;
  engine.update(1.0);

  const highBpm = engine.player.bpm;
  assert.ok(highBpm > 90, 'Heart rate must rise under high stress/speed');

  // Activate Pranayama Zen Breath
  const zenActivated = engine.activateFocus();
  assert.strictEqual(zenActivated, true);
  assert.strictEqual(engine.player.focusActive, true);
  assert.strictEqual(engine.player.bpm, 72, 'Zen breath resets vagus nerve back to resting 72 BPM');
  assert.ok(engine.timeScale < 1.0, 'Focus breath slows down simulation time');
});

test('Player profile and dynamic day-to-night scene transitions', () => {
  const engine = new RacingEngine();
  engine.setPlayerProfile('Kalpana', 'Quantum Racer');
  assert.strictEqual(engine.playerName, 'KALPANA');
  assert.strictEqual(engine.character, 'Quantum Racer');

  // Initial stage is dawn
  engine.player.distance = 50;
  engine.elapsedTime = 5;
  assert.strictEqual(engine.getScene().id, 'dawn');

  // Noon stage
  engine.player.distance = 450;
  engine.elapsedTime = 20;
  assert.strictEqual(engine.getScene().id, 'noon');

  // Sunset stage
  engine.player.distance = 750;
  engine.elapsedTime = 35;
  assert.strictEqual(engine.getScene().id, 'sunset');

  // Midnight neon stage
  engine.player.distance = 1100;
  engine.elapsedTime = 55;
  assert.strictEqual(engine.getScene().id, 'midnight');
});

test('Pitstop pause freezes racing engine and resumes cleanly', () => {
  const engine = new RacingEngine();
  engine.startRace();
  assert.strictEqual(engine.status, 'racing');
  assert.strictEqual(engine.isPaused, false);

  engine.pauseForPitstop();
  assert.strictEqual(engine.status, 'pitstop');
  assert.strictEqual(engine.isPaused, true);

  // During pitstop, distance does not advance
  const initialDist = engine.player.distance;
  engine.update(1.0);
  assert.strictEqual(engine.player.distance, initialDist);

  engine.resumeFromPitstop();
  assert.strictEqual(engine.status, 'racing');
  assert.strictEqual(engine.isPaused, false);
});

test('Steering lane up and down responds immediately and smoothly', () => {
  const engine = new RacingEngine();
  engine.startRace();
  assert.strictEqual(engine.player.lane, 1);

  engine.steerLaneUp(); // Lane 1 -> 0 (top lane)
  assert.strictEqual(engine.player.lane, 0);
  assert.strictEqual(engine.player.x, -0.6);

  engine.steerLaneDown(); // Lane 0 -> 1 (center lane)
  assert.strictEqual(engine.player.lane, 1);
  assert.strictEqual(engine.player.x, 0.0);

  engine.steerLaneDown(); // Lane 1 -> 2 (bottom lane)
  assert.strictEqual(engine.player.lane, 2);
  assert.strictEqual(engine.player.x, 0.6);
});

test('Car color customization updates primary and secondary hues', () => {
  const engine = new RacingEngine();
  engine.setCarColor('#ffe600');
  assert.strictEqual(engine.player.carColor, '#ffe600');
  assert.strictEqual(engine.player.carSecondaryColor, '#5c5200');
});

test('Emergency pit repair prevents premature crash during 30+ min endurance GP', () => {
  const engine = new RacingEngine();
  engine.startRace();
  engine.player.shield = 0;
  engine.update(0.1);

  assert.ok(engine.player.shield >= 50, 'Emergency pit repair restores shield so session continues');
  assert.strictEqual(engine.player.stallTimer > 0, true);
});


