import test from 'node:test';
import assert from 'node:assert/strict';
import {
  makePrismLab,
  makeBohrAtomLab,
  makeTitrationLab,
  makeMomentumLab,
  makeSectorForcefield,
} from '../src/world/physics-labs.js';

test('Physics Prism Lab generates Snell refraction bench with correct calibration target', () => {
  const lab = makePrismLab(0, 0, 0);
  assert.ok(lab.group, 'Lab group exists');
  assert.equal(typeof lab.update, 'function');
  assert.equal(typeof lab.activate, 'function');
  assert.equal(lab.targetNodes.length, 3, 'Contains 3 calibration targets');

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct, 'Has correct calibration target');
  assert.match(correct.label, /45 deg/);
  assert.equal(correct.isCorrect, true);

  // Trigger activation and verify state changes
  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Bohr Quantum Atom Lab generates orbital shells with Lyman transition target', () => {
  const lab = makeBohrAtomLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /10\.2 eV/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Chemical Titration Lab generates neutralization reactor with OH- target', () => {
  const lab = makeTitrationLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /OH-/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Newtonian Momentum Lab generates collision spheres with elastic impulse', () => {
  const lab = makeMomentumLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /ELASTIC MATCH/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Sector Forcefield barrier blocks passages and disengages on command', () => {
  const gate = makeSectorForcefield('gate-west', -24, 0, 6, 8, 0x00f5d4);
  assert.ok(gate.group);
  assert.equal(gate.id, 'gate-west');
  assert.equal(gate.active, true);

  gate.disengage();
  assert.equal(gate.active, false);
  assert.equal(gate.mesh.visible, false);
});
