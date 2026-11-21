import test from 'node:test';
import assert from 'node:assert/strict';

// Test simulation of the combat stakes & rules engine
class CombatSimulation {
  constructor() {
    this.playerShield = 100;
    this.playerEnergy = 100;
    this.lockdownTimer = 0;
    this.gameTime = 0;
    this.isPaused = false;
    this.position = { x: 0, y: 1.6, z: 0 };
    this.log = [];
  }

  fireBlaster() {
    if (this.lockdownTimer > 0) {
      this.log.push('BLOCKED:LOCKDOWN');
      return false;
    }
    if (this.playerEnergy < 12) {
      this.log.push('BLOCKED:OVERHEAT');
      return false;
    }
    this.playerEnergy = Math.max(0, this.playerEnergy - 12);
    this.log.push('FIRED');
    return true;
  }

  applyDamage(amount, reason = 'CONTAINMENT FAILURE') {
    this.playerShield = Math.max(0, this.playerShield - amount);
    this.lockdownTimer = 3.5;
    this.isPaused = true;
    this.log.push(`DAMAGE:${amount}:${reason}`);

    if (this.playerShield <= 0) {
      this.log.push('REBOOT:TELEPORT_HUB');
      this.position = { x: 0, y: 1.6, z: 0 };
      this.playerShield = 100;
      this.playerEnergy = 100;
      this.lockdownTimer = 0;
      this.isPaused = false;
    }
  }

  update(dt) {
    this.gameTime += dt;

    // Energy recharge
    if (this.playerEnergy < 100) {
      this.playerEnergy = Math.min(100, this.playerEnergy + 24 * dt);
    }

    // Lockdown cooldown
    if (this.lockdownTimer > 0) {
      this.lockdownTimer = Math.max(0, this.lockdownTimer - dt);
      if (this.lockdownTimer === 0) {
        this.isPaused = false;
        this.log.push('LOCKDOWN:EXPIRED');
      }
    }
  }

  get4DTelemetry() {
    return `4D: X=${this.position.x.toFixed(1)} Y=${this.position.y.toFixed(1)} Z=${this.position.z.toFixed(1)} T=${this.gameTime.toFixed(1)}s`;
  }
}

test('Blaster combat drains 12% energy and enforces capacitor overheating', () => {
  const sim = new CombatSimulation();
  assert.strictEqual(sim.playerEnergy, 100);

  // Fire 8 shots: 100 - (8 * 12) = 4% energy remaining
  for (let i = 0; i < 8; i++) {
    const ok = sim.fireBlaster();
    assert.strictEqual(ok, true, `Shot ${i + 1} should succeed`);
  }
  assert.strictEqual(sim.playerEnergy, 4);

  // 9th shot should be blocked by capacitor overheat (< 12%)
  const blocked = sim.fireBlaster();
  assert.strictEqual(blocked, false, 'Shot should be blocked by overheat');
  assert.ok(sim.log.includes('BLOCKED:OVERHEAT'));

  // Advance time by 0.5s -> energy should recharge: 4 + (24 * 0.5) = 16%
  sim.update(0.5);
  assert.strictEqual(sim.playerEnergy >= 12, true, 'Energy should recharge above 12%');

  // Shot should now succeed
  assert.strictEqual(sim.fireBlaster(), true, 'Shot succeeds after cooling');
});

test('Player shield damage triggers 3.5s lockdown halt and penalizes movement', () => {
  const sim = new CombatSimulation();
  assert.strictEqual(sim.playerShield, 100);

  // Apply wrong answer / wrong target damage (-25%)
  sim.applyDamage(25, 'Unstable calibration pulse');
  assert.strictEqual(sim.playerShield, 75);
  assert.strictEqual(sim.lockdownTimer, 3.5);
  assert.strictEqual(sim.isPaused, true, 'Player motion should be paused');

  // Firing during lockdown must be blocked
  assert.strictEqual(sim.fireBlaster(), false);
  assert.ok(sim.log.includes('BLOCKED:LOCKDOWN'));

  // Advance time by 2.0s -> lockdown still active (1.5s remaining)
  sim.update(2.0);
  assert.strictEqual(sim.isPaused, true);

  // Advance time by another 1.6s -> lockdown expires
  sim.update(1.6);
  assert.strictEqual(sim.lockdownTimer, 0);
  assert.strictEqual(sim.isPaused, false, 'Locomotion restored after lockdown');
  assert.ok(sim.log.includes('LOCKDOWN:EXPIRED'));
});

test('Shield depletion to 0% triggers critical containment reboot and teleports to hub cradle', () => {
  const sim = new CombatSimulation();
  sim.position = { x: 38, y: 1.6, z: 12 }; // Far in science zone

  // Inflict 4 consecutive 25% damage penalties
  sim.applyDamage(25, 'Strike 1');
  sim.applyDamage(25, 'Strike 2');
  sim.applyDamage(25, 'Strike 3');
  assert.strictEqual(sim.playerShield, 25);

  sim.applyDamage(25, 'Strike 4 - Lethal breach');
  assert.ok(sim.log.includes('REBOOT:TELEPORT_HUB'));

  // Player must be teleported back to hub cradle (0, 1.6, 0)
  assert.deepStrictEqual(sim.position, { x: 0, y: 1.6, z: 0 });
  assert.strictEqual(sim.playerShield, 100, 'Shield rebooted to 100%');
  assert.strictEqual(sim.playerEnergy, 100, 'Energy rebooted to 100%');
});

test('4D Telemetry correctly formats spacetime coordinates', () => {
  const sim = new CombatSimulation();
  sim.position = { x: 14.5, y: 1.6, z: -8.2 };
  sim.update(4.25);

  const telemetry = sim.get4DTelemetry();
  assert.strictEqual(telemetry, '4D: X=14.5 Y=1.6 Z=-8.2 T=4.3s');
});
