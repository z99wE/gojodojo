import * as THREE from 'three';

// South Korean Pastel RPG 3D Props & GTA Style Visual Elements

// Fluffy Korean Sakura (Cherry Blossom) Tree
export function makeSakuraTree() {
  const g = new THREE.Group();
  // Soft pastel trunk
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.26, 1.4, 7),
    new THREE.MeshStandardMaterial({ color: 0x9b7e72, roughness: 0.8, flatShading: true })
  );
  trunk.position.y = 0.7;

  // Bubbly pastel pink cloud canopy (2 stacked rounded spheres/dodecahedrons)
  const canopyBottom = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.1, 1),
    new THREE.MeshStandardMaterial({ color: 0xffb7b2, roughness: 0.5, flatShading: true })
  );
  canopyBottom.position.y = 2.1;
  canopyBottom.scale.set(1.1, 0.9, 1.1);

  const canopyTop = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.85, 1),
    new THREE.MeshStandardMaterial({ color: 0xffccd5, roughness: 0.4, flatShading: true })
  );
  canopyTop.position.set(0, 2.7, 0);

  g.add(trunk, canopyBottom, canopyTop);
  return g;
}

// Fluffy Matcha Tree
export function makeTree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.24, 1.3, 6),
    new THREE.MeshStandardMaterial({ color: 0x8a7060, roughness: 0.8, flatShading: true })
  );
  trunk.position.y = 0.65;

  const canopy = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.2, 1),
    new THREE.MeshStandardMaterial({ color: 0xa8e6cf, roughness: 0.5, flatShading: true })
  );
  canopy.position.y = 2.1;
  canopy.scale.set(1.05, 0.95, 1.05);

  g.add(trunk, canopy);
  return g;
}

// Bubbly pastel crystal cluster
export function makeCrystal(color) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.1,
    flatShading: true,
  });

  const main = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), mat);
  main.scale.set(0.65, 2.0, 0.65);
  main.position.y = 1.7;

  // Two smaller companion crystals
  const side1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), mat);
  side1.scale.set(0.5, 1.3, 0.5);
  side1.position.set(0.4, 1.0, 0.2);
  side1.rotation.z = -0.25;

  const side2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), mat);
  side2.scale.set(0.5, 1.1, 0.5);
  side2.position.set(-0.35, 0.9, -0.2);
  side2.rotation.z = 0.3;

  g.add(main, side1, side2);
  return g;
}

// Cute street lantern with warm pastel glowing globe
export function makeLamp() {
  const g = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 2.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4d6b, roughness: 0.6, flatShading: true })
  );
  post.position.y = 1.1;

  // Glowing peach globe
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 10, 8),
    new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffd166,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    })
  );
  bulb.position.y = 2.3;

  // Cute roof cap
  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 0.22, 6),
    new THREE.MeshStandardMaterial({ color: 0x7d5fff, flatShading: true })
  );
  cap.position.y = 2.65;

  g.add(post, bulb, cap);
  return g;
}

// Pastel wooden bridge segment
export function makeBridgeSegment(length) {
  const g = new THREE.Group();

  // Deck
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.35, 3.8),
    new THREE.MeshStandardMaterial({ color: 0xeed6c4, roughness: 0.7, flatShading: true })
  );
  deck.position.y = -0.17;
  g.add(deck);

  // Soft side railings
  const railMat = new THREE.MeshStandardMaterial({ color: 0xffb7b2, roughness: 0.5, flatShading: true });
  const railGeo = new THREE.BoxGeometry(length, 0.18, 0.15);

  const leftRail = new THREE.Mesh(railGeo, railMat);
  leftRail.position.set(0, 0.45, -1.8);

  const rightRail = new THREE.Mesh(railGeo, railMat);
  rightRail.position.set(0, 0.45, 1.8);

  g.add(leftRail, rightRail);
  return g;
}

// Soft pebble rock
export function makeRock(seed) {
  const rnd = (k) => {
    const v = Math.sin(seed * 91.7 + k * 17.3) * 43758.5453;
    return v - Math.floor(v);
  };
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.55, 1),
    new THREE.MeshStandardMaterial({ color: 0xc8b6d6, roughness: 0.8, flatShading: true })
  );
  mesh.scale.set(0.9 + rnd(1) * 0.5, 0.6 + rnd(2) * 0.4, 0.9 + rnd(3) * 0.5);
  mesh.rotation.set(rnd(4) * Math.PI, rnd(5) * Math.PI, 0);
  return mesh;
}

// Multi-tier layered pastel cake-slice island base
export function makeIslandBase(radius, thickness, color) {
  const g = new THREE.Group();

  // Top tier (pastel surface)
  const topMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.96, thickness * 0.6, 24),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5, flatShading: true })
  );
  topMesh.position.y = -thickness * 0.3;

  // Bottom tier (soft biscuit layer)
  const bottomMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.96, radius * 0.82, thickness * 0.4, 20),
    new THREE.MeshStandardMaterial({ color: 0xd6c2b4, roughness: 0.9, flatShading: true })
  );
  bottomMesh.position.y = -thickness * 0.8;

  g.add(topMesh, bottomMesh);
  return g;
}

// GTA Vice City Style Vertical Light Waypoint Beacon
// Shoots from stone high into the sky so the player can see objectives across the map
export function makeBeaconPillar(color) {
  const g = new THREE.Group();

  // Tall translucent light cylinder
  const beamMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const beamGeo = new THREE.CylinderGeometry(0.45, 0.85, 36, 12, 1, true);
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = 18;

  // Inner concentrated beam
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const innerGeo = new THREE.CylinderGeometry(0.15, 0.25, 36, 8, 1, true);
  const inner = new THREE.Mesh(innerGeo, innerMat);
  inner.position.y = 18;

  // Floating pulsing ring near the bottom
  const ringMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  const ringGeo = new THREE.RingGeometry(0.7, 0.9, 16);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.0;

  g.add(beam, inner, ring);
  return { group: g, ring, beam };
}

// 3D Collectible Star Coin (Vice City / RPG reward pickup)
export function makeCollectibleCoin() {
  const g = new THREE.Group();
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffb703,
    emissiveIntensity: 0.5,
    metalness: 0.65,
    roughness: 0.25,
  });

  // Coin body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.09, 16), coinMat);
  body.rotation.x = Math.PI / 2;

  // Star relief on coin face
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfffae0,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
  });
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), starMat);
  star.scale.set(1.2, 1.2, 0.3);

  g.add(body, star);
  g.position.y = 1.1;
  return g;
}

// Welcoming Pastel Gateway Arch (Torii / Archway)
export function makeToriiArch(color = 0xffb7b2) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, flatShading: true });

  const leftPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8), mat);
  leftPillar.position.set(-2.0, 2.1, 0);

  const rightPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8), mat);
  rightPillar.position.set(2.0, 2.1, 0);

  // Top crossbeam
  const beam = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.35, 0.45), mat);
  beam.position.set(0, 4.0, 0);

  // Sub beam
  const subBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 0.3), mat);
  subBeam.position.set(0, 3.4, 0);

  g.add(leftPillar, rightPillar, beam, subBeam);
  return g;
}
