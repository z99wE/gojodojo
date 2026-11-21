import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

// Headless canvas mock for Node.js test environment
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement: (tag) => {
      if (tag === 'canvas') {
        return {
          width: 512,
          height: 512,
          getContext: () => ({
            fillStyle: '',
            fillRect: () => {},
            clearRect: () => {},
            strokeStyle: '',
            lineWidth: 1,
            strokeRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            closePath: () => {},
            arc: () => {},
            fill: () => {},
            stroke: () => {},
            fillText: () => {},
            createLinearGradient: () => ({ addColorStop: () => {} }),
            createRadialGradient: () => ({ addColorStop: () => {} }),
          }),
        };
      }
      return {};
    },
  };
}

import {
  makeArtDecoHotel,
  makeLifeguardTower,
  makeTrafficLightGantry,
  makeViceCityStreetLamp,
  makeViceCitySpeedboat,
  makeBeachLoungers,
  makeViceCityCar,
  makeAsphaltBoulevard,
  makeTargetDrone,
} from '../src/world/props.js';
import { createWorld } from '../src/world/world.js';

test('Vice City Art Deco Hotel generator builds authentic 3-story hotel with neon sign', () => {
  const hotel = makeArtDecoHotel('OCEAN VIEW HOTEL', 0xffedf2, 0xff3b77);
  assert.ok(hotel, 'Hotel group generated');
  assert.ok(hotel.children.length >= 8, 'Has multi-story architectural components');

  // Check children for neon sign, portico, balconies
  const hasSign = hotel.children.some((c) => c.geometry instanceof THREE.BoxGeometry && c.position.y > 10);
  assert.ok(hasSign, 'Has elevated roofline sign mesh');
});

test('Vice City Lifeguard Tower generates wooden cabin on stilts', () => {
  const tower = makeLifeguardTower(0x00f5d4, 0xff3b77);
  assert.ok(tower);
  assert.ok(tower.children.length >= 4, 'Has stilts, deck, cabin, and roof');
});

test('Vice City Traffic Light Gantry spans highway with signal boxes', () => {
  const gantry = makeTrafficLightGantry(6.0);
  assert.ok(gantry);
  assert.ok(gantry.children.length >= 3, 'Has post, crossbar, and signal boxes');
});

test('Vice City Street Lamp generates cast-iron dual lanterns', () => {
  const lamp = makeViceCityStreetLamp();
  assert.ok(lamp);
  assert.ok(lamp.children.length >= 3, 'Has post, crossarm, and dual bulbs');
});

test('Miami Vice Speedboat generates V-hull powerboat with dual outboards', () => {
  const boat = makeViceCitySpeedboat(0xffffff, 0xff3b77);
  assert.ok(boat);
  assert.ok(boat.children.length >= 4, 'Has hull, trim, windshield, and dual motors');
});

test('Beach Loungers generator builds striped umbrella and sun lounger pair', () => {
  const loungers = makeBeachLoungers(0xff3b77);
  assert.ok(loungers);
  assert.ok(loungers.children.length >= 3, 'Has umbrella pole, canopy, and loungers');
});

test('createWorld instantiates Grand Ocean Drive metropolis with 4 cruising AI cars', () => {
  const scene = new THREE.Scene();
  const world = createWorld(scene);

  assert.ok(world.stones.length >= 9, 'Contains knowledge stones and central hub');
  assert.ok(world.cars.length >= 4, 'Contains 4 GTA Vice City cruising sports cars');

  // Verify all cars have cruising AI parameters
  for (const car of world.cars) {
    assert.ok(car.id, 'Car has id');
    assert.ok(car.name, 'Car has Vice City name');
    assert.strictEqual(car.isCruising, true, 'Car is flagged for cruising AI');
    assert.ok(typeof car.speed === 'number' && Math.abs(car.speed) > 0, 'Car has non-zero speed');
    assert.strictEqual(car.minX, -48);
    assert.strictEqual(car.maxX, 48);
  }

  // Verify 9 STEM Laboratories are registered
  assert.ok(world.labs.length >= 9, 'All 9 STEM labs instantiated in world');
  assert.ok(world.labMap.prism, 'Prism Optics Lab registered');
  assert.ok(world.labMap.momentum, 'Momentum Collider Lab registered');
  assert.ok(world.labMap.lorentz, 'Lorentz Electromagnet Lab registered');
  assert.ok(world.labMap.bohr, 'Bohr Quantum Atom Lab registered');
  assert.ok(world.labMap.titration, 'Chemical Titration Lab registered');
  assert.ok(world.labMap.molecule, 'Molecular Lattice Lab registered');
  assert.ok(world.labMap.galvanic, 'Galvanic Voltaic Battery Lab registered');
  assert.ok(world.labMap.dna, 'DNA Double Helix Lab registered');
  assert.ok(world.labMap.cell, 'Plant Cell Mitochondria Lab registered');

  // Verify colliders for Ocean Drive hotels, bridges and gates
  assert.ok(world.colliders.length >= 10, 'Colliders protect urban buildings and bridges');

  // Test simulation update moves the cruising cars
  const car0 = world.cars[0];
  const initialX = car0.position.x;
  world.update(0.5, new THREE.Vector3(0, 1.6, 0));
  assert.notStrictEqual(car0.position.x, initialX, 'Cruising car position must advance over time');
});
