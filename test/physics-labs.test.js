import test from 'node:test';
import assert from 'node:assert/strict';
import {
  makePrismLab,
  makeMomentumLab,
  makeLorentzElectromagnetLab,
  makeBohrAtomLab,
  makeTitrationLab,
  makeMolecularLatticeLab,
  makeGalvanicCellLab,
  makeDnaHelixLab,
  makePlantCellLab,
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

test('Physics Lorentz Electromagnet Lab generates solenoid and flux induction', () => {
  const lab = makeLorentzElectromagnetLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /LENZ LAW/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Chemistry Bohr Atom Lab generates quantum orbital shells with Lyman transition', () => {
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

test('Chemistry Titration Lab generates neutralization reactor with OH- target', () => {
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

test('Chemistry Molecular Lattice Lab generates VSEPR tetrahedral geometry', () => {
  const lab = makeMolecularLatticeLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /109\.5 DEGREE/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Chemistry Galvanic Voltaic Cell generates redox beakers and salt bridge', () => {
  const lab = makeGalvanicCellLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /CATHODE REDUCTION/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Biology DNA Double Helix Lab generates Watson-Crick base-pair macromolecule', () => {
  const lab = makeDnaHelixLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /ADENINE.*THYMINE/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Biology Plant Cell & Mitochondria Lab generates cellular organelle model', () => {
  const lab = makePlantCellLab(0, 0, 0);
  assert.ok(lab.group);
  assert.equal(lab.targetNodes.length, 3);

  const correct = lab.targetNodes.find((n) => n.isCorrect);
  assert.ok(correct);
  assert.match(correct.label, /AEROBIC RESPIRATION/);

  assert.equal(lab.activated, false);
  lab.activate();
  assert.equal(lab.activated, true);
});

test('Sector Forcefield barrier blocks passages and disengages on command', () => {
  const gate = makeSectorForcefield('gate-maths', -14, 0, 6, 8, 0x00f5d4);
  assert.ok(gate.group);
  assert.equal(gate.id, 'gate-maths');
  assert.equal(gate.active, true);

  gate.disengage();
  assert.equal(gate.active, false);
  assert.equal(gate.mesh.visible, false);
});
