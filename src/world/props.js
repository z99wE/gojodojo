import * as THREE from 'three';

// Low-poly building blocks shared by the world builder.

// Group: child 0 is the trunk, child 1 is the canopy (world.js relies on this order).
export function makeTree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 1.2, 5),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b, flatShading: true }),
  );
  trunk.position.y = 0.6;
  const canopy = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 2, 6),
    new THREE.MeshStandardMaterial({ color: 0x3f8f5a, flatShading: true }),
  );
  canopy.position.y = 2.2;
  g.add(trunk, canopy);
  return g;
}

// Floating crystal pillar, base near y = 0.
export function makeCrystal(color) {
  const mesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.8, 0),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, flatShading: true }),
  );
  mesh.scale.set(0.7, 2.2, 0.7);
  mesh.position.y = 1.8;
  const g = new THREE.Group();
  g.add(mesh);
  return g;
}

// Post lamp with an amber bulb on top.
export function makeLamp() {
  const g = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 2, 5),
    new THREE.MeshStandardMaterial({ color: 0x4a4a52, flatShading: true }),
  );
  post.position.y = 1;
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xf2b35a, emissive: 0xf2b35a, emissiveIntensity: 1 }),
  );
  bulb.position.y = 2.15;
  g.add(post, bulb);
  return g;
}

// Wooden deck segment along x, centred on the origin, top surface at y = 0.
export function makeBridgeSegment(length) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.3, 3.5),
    new THREE.MeshStandardMaterial({ color: 0xc9a66b, flatShading: true }),
  );
  mesh.position.y = -0.15;
  return mesh;
}

// Deterministic pseudo-random rock; the same seed always gives the same shape.
export function makeRock(seed) {
  const rnd = (k) => {
    const v = Math.sin(seed * 91.7 + k * 17.3) * 43758.5453;
    return v - Math.floor(v);
  };
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 5, 4),
    new THREE.MeshStandardMaterial({ color: 0x9a9088, flatShading: true }),
  );
  mesh.scale.set(0.8 + rnd(1) * 0.6, 0.5 + rnd(2) * 0.4, 0.8 + rnd(3) * 0.6);
  mesh.rotation.y = rnd(4) * Math.PI * 2;
  return mesh;
}

// Flat cylindrical island slab, top surface at y = 0.
export function makeIslandBase(radius, thickness, color) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.85, thickness, 12),
    new THREE.MeshStandardMaterial({ color, flatShading: true }),
  );
  mesh.position.y = -thickness / 2;
  return mesh;
}
