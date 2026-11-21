import * as THREE from 'three';

// =========================================================================
// South Korean Pastel Cyberpunk & GTA Vice City 3D Procedural Assets
// =========================================================================

// 1. First-Person 3D Viewmodel Hand / Cyber Gauntlet
export function makeViewmodelHand() {
  const g = new THREE.Group();

  // Forearm & sleeve (pastel lavender suit cuff)
  const armMat = new THREE.MeshStandardMaterial({
    color: 0x7d5fff,
    roughness: 0.6,
    flatShading: true,
  });
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.45, 8), armMat);
  arm.rotation.x = Math.PI / 3;
  arm.position.set(0.28, -0.28, -0.45);

  // Cyber gauntlet glove (pastel pink & white)
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0xff758c,
    roughness: 0.4,
    flatShading: true,
  });
  const glove = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.18), gloveMat);
  glove.position.set(0.32, -0.16, -0.58);
  glove.rotation.set(0.1, -0.2, 0.15);

  // Glowing knuckles / energy crystal
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x70e3db,
    emissive: 0x70e3db,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  const knuckleCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), crystalMat);
  knuckleCrystal.position.set(0.32, -0.11, -0.62);

  // Fingers
  const fingerMat = new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.5 });
  const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.12), fingerMat);
  fingers.position.set(0.32, -0.14, -0.66);

  g.add(arm, glove, knuckleCrystal, fingers);
  return { group: g, knuckleCrystal };
}

// 2. GTA Vice City Style Pastel Sports Car
export function makeViceCityCar(color = 0xff758c) {
  const g = new THREE.Group();

  // Main Car Body
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.25,
    metalness: 0.35,
    flatShading: true,
  });
  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.5, 4.2), bodyMat);
  lowerBody.position.y = 0.5;

  // Cabin & Windshield (tinted glass)
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x2d2438,
    roughness: 0.1,
    metalness: 0.8,
  });
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.48, 2.1), cabinMat);
  cabin.position.set(0, 0.92, -0.2);

  // Rear Spoiler
  const spoilerBar = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.3), bodyMat);
  spoilerBar.position.set(0, 1.05, 1.7);
  const leftMount = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.1), bodyMat);
  leftMount.position.set(-0.7, 0.85, 1.7);
  const rightMount = leftMount.clone();
  rightMount.position.x = 0.7;

  // Front Headlights
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xfffae0,
    emissive: 0xfffae0,
    emissiveIntensity: 1.0,
  });
  const leftLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.1), lightMat);
  leftLight.position.set(-0.75, 0.52, -2.1);
  const rightLight = leftLight.clone();
  rightLight.position.x = 0.75;

  // Tail lights
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xff0055,
    emissive: 0xff0055,
    emissiveIntensity: 1.2,
  });
  const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.1), tailMat);
  tailBar.position.set(0, 0.52, 2.1);

  // 4 Wheels
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1f1f24, roughness: 0.8 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xd8b4f8, metalness: 0.8, roughness: 0.2 });
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 12);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.05, 0.38, -1.3],
    [1.05, 0.38, -1.3],
    [-1.05, 0.38, 1.3],
    [1.05, 0.38, 1.3],
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const tire = new THREE.Mesh(wheelGeo, tireMat);
    tire.position.set(wx, wy, wz);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.32, 8), rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, wy, wz);
    g.add(tire, rim);
  });

  // Neon Underglow Plane
  const neonMat = new THREE.MeshBasicMaterial({
    color: 0x70e3db,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  });
  const neonGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.6), neonMat);
  neonGlow.rotation.x = -Math.PI / 2;
  neonGlow.position.y = 0.05;

  g.add(lowerBody, cabin, spoilerBar, leftMount, rightMount, leftLight, rightLight, tailBar, neonGlow);
  return g;
}

// 3. Korean Pastel Storefront / Cyber Cafe Building
export function makeKoreanStoreBuilding(titleText = '수학 빵집', themeColor = 0xffb7b2) {
  const g = new THREE.Group();

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    flatShading: true,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.8, 4.2, 3.8), wallMat);
  body.position.y = 2.1;

  const facadeMat = new THREE.MeshStandardMaterial({
    color: themeColor,
    roughness: 0.4,
    flatShading: true,
  });
  const facade = new THREE.Mesh(new THREE.BoxGeometry(4.9, 1.6, 0.3), facadeMat);
  facade.position.set(0, 3.4, 1.95);

  const awningMat = new THREE.MeshStandardMaterial({
    color: 0xff758c,
    roughness: 0.3,
    flatShading: true,
  });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 1.2), awningMat);
  awning.rotation.x = 0.25;
  awning.position.set(0, 2.5, 2.4);

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xd8b4f8,
    emissive: 0xf7f1ff,
    emissiveIntensity: 0.4,
    roughness: 0.1,
  });
  const shopWindow = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 0.1), windowMat);
  shopWindow.position.set(0, 1.2, 1.95);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2d2438';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 112);
  ctx.fillStyle = '#ff758c';
  ctx.font = 'bold 50px "Fredoka", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleText, 256, 64);

  const signTex = new THREE.CanvasTexture(canvas);
  const signMat = new THREE.MeshStandardMaterial({
    map: signTex,
    emissive: 0xffffff,
    emissiveMap: signTex,
    emissiveIntensity: 0.6,
  });
  const signMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 0.15), signMat);
  signMesh.position.set(0, 3.4, 2.15);

  const ventMat = new THREE.MeshStandardMaterial({ color: 0x9586a5, roughness: 0.6 });
  const vent = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), ventMat);
  vent.position.set(1.4, 4.6, 0.4);

  g.add(body, facade, awning, shopWindow, signMesh, vent);
  return g;
}

// 4. Cute Korean Pastel Beverage Vending Machine
export function makeVendingMachine() {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x7d5fff,
    roughness: 0.35,
    flatShading: true,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.9), bodyMat);
  body.position.y = 1.1;

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xfffae0,
    emissive: 0xfffae0,
    emissiveIntensity: 0.8,
  });
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.1), glassMat);
  glass.position.set(0, 1.35, 0.46);

  const canColors = [0xff758c, 0x2ed573, 0xffa502, 0x70e3db];
  canColors.forEach((cc, idx) => {
    const can = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.16, 8),
      new THREE.MeshStandardMaterial({ color: cc })
    );
    can.position.set(-0.3 + idx * 0.2, 1.35, 0.48);
    g.add(can);
  });

  const slotMat = new THREE.MeshStandardMaterial({ color: 0x2d2438 });
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.08), slotMat);
  slot.position.set(0, 0.4, 0.46);

  g.add(body, glass, slot);
  return g;
}

// 5. Vice City Style Tropical Palm Tree
export function makePalmTree() {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x9b7e72,
    roughness: 0.8,
    flatShading: true,
  });

  for (let i = 0; i < 7; i++) {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.18 - i * 0.012, 0.2 - i * 0.012, 0.65, 6), trunkMat);
    seg.position.set(Math.sin(i * 0.15) * 0.3, i * 0.6 + 0.3, 0);
    seg.rotation.z = -i * 0.05;
    g.add(seg);
  }

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x2ed573,
    roughness: 0.4,
    side: THREE.DoubleSide,
    flatShading: true,
  });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.45), leafMat);
    leaf.position.set(Math.sin(angle) * 0.8 + 0.3, 4.3, Math.cos(angle) * 0.8);
    leaf.rotation.set(Math.cos(angle) * 0.35, angle, -Math.sin(angle) * 0.35);
    g.add(leaf);
  }

  return g;
}

// 6. Giant 3D Holographic Atomic Model (Above Science Island)
export function makeHoloAtom() {
  const g = new THREE.Group();

  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0xffa502,
    emissive: 0xffa502,
    emissiveIntensity: 1.2,
    roughness: 0.1,
  });
  const nucleus = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), nucleusMat);
  g.add(nucleus);

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x70e3db,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
  });
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x70e3db,
    emissiveIntensity: 1.5,
  });

  const rings = [];
  const angles = [0, Math.PI / 3, -Math.PI / 3];

  angles.forEach((rotZ) => {
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.08, 12, 48), ringMat);
    ringMesh.rotation.set(Math.PI / 4, 0, rotZ);
    g.add(ringMesh);

    const electron = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), electronMat);
    g.add(electron);
    rings.push({ ringMesh, electron, speed: 1.5 + Math.random() * 0.8 });
  });

  g.position.y = 12;
  return { group: g, rings, nucleus };
}

// 7. Giant 3D Holographic Math Symbols (Above Maths Island)
export function makeHoloMathSymbols() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xb39ddb,
    emissive: 0x7d5fff,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.3,
  });

  const infinity = new THREE.Mesh(new THREE.TorusKnotGeometry(1.6, 0.35, 64, 8, 2, 3), mat);
  infinity.position.set(0, 0, 0);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.1, 16, 40), mat);
  ring1.rotation.x = Math.PI / 2;

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.08, 16, 40), mat);
  ring2.rotation.y = Math.PI / 3;

  g.add(infinity, ring1, ring2);
  g.position.y = 12;
  return { group: g, infinity, ring1, ring2 };
}

// 8. Low-Poly Floating Fluffy Cloud Clusters
export function makeFloatingClouds() {
  const g = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffeef4,
    emissiveIntensity: 0.25,
    roughness: 0.6,
    flatShading: true,
  });

  const cloudPuffs = [
    { x: 0, y: 0, z: 0, s: 2.2 },
    { x: 1.6, y: -0.3, z: 0.4, s: 1.6 },
    { x: -1.6, y: -0.2, z: -0.3, s: 1.7 },
    { x: 0.8, y: 0.5, z: -0.2, s: 1.5 },
  ];

  cloudPuffs.forEach((p) => {
    const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(p.s, 1), cloudMat);
    puff.position.set(p.x, p.y, p.z);
    g.add(puff);
  });

  return g;
}

// 9. Shimmering Pastel Ocean Plane
export function makeWaterPlane() {
  const geo = new THREE.PlaneGeometry(350, 350, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xb5e2fa,
    emissive: 0x8ecae6,
    emissiveIntensity: 0.25,
    roughness: 0.2,
    metalness: 0.3,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -1.2;
  return { mesh, geo };
}

// 10. Fluffy Korean Sakura Tree
export function makeSakuraTree() {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.26, 1.4, 7),
    new THREE.MeshStandardMaterial({ color: 0x9b7e72, roughness: 0.8, flatShading: true })
  );
  trunk.position.y = 0.7;

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

// 11. Fluffy Matcha Tree
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

// 12. Bubbly Pastel Crystal Cluster
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

// 13. Street Lantern
export function makeLamp() {
  const g = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 2.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4d6b, roughness: 0.6, flatShading: true })
  );
  post.position.y = 1.1;

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

  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 0.22, 6),
    new THREE.MeshStandardMaterial({ color: 0x7d5fff, flatShading: true })
  );
  cap.position.y = 2.65;

  g.add(post, bulb, cap);
  return g;
}

// 14. Bridge Segment
export function makeBridgeSegment(length) {
  const g = new THREE.Group();
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(length, 0.35, 3.8),
    new THREE.MeshStandardMaterial({ color: 0xeed6c4, roughness: 0.7, flatShading: true })
  );
  deck.position.y = -0.17;
  g.add(deck);

  const railMat = new THREE.MeshStandardMaterial({ color: 0xffb7b2, roughness: 0.5, flatShading: true });
  const railGeo = new THREE.BoxGeometry(length, 0.18, 0.15);

  const leftRail = new THREE.Mesh(railGeo, railMat);
  leftRail.position.set(0, 0.45, -1.8);

  const rightRail = new THREE.Mesh(railGeo, railMat);
  rightRail.position.set(0, 0.45, 1.8);

  g.add(leftRail, rightRail);
  return g;
}

// 15. Rock
export function makeRock(seed) {
  const rnd = (k) => {
    const v = Math.sin(seed * 91.7 + k * 17.3) * 43758.5;
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

// 16. Island Base
export function makeIslandBase(radius, thickness, color) {
  const g = new THREE.Group();
  const topMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 0.96, thickness * 0.6, 24),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5, flatShading: true })
  );
  topMesh.position.y = -thickness * 0.3;

  const bottomMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.96, radius * 0.82, thickness * 0.4, 20),
    new THREE.MeshStandardMaterial({ color: 0xd6c2b4, roughness: 0.9, flatShading: true })
  );
  bottomMesh.position.y = -thickness * 0.8;

  g.add(topMesh, bottomMesh);
  return g;
}

// 17. GTA Waypoint Beacon Pillar
export function makeBeaconPillar(color) {
  const g = new THREE.Group();

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

// 18. Collectible Coin
export function makeCollectibleCoin() {
  const g = new THREE.Group();
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffb703,
    emissiveIntensity: 0.5,
    metalness: 0.65,
    roughness: 0.25,
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.09, 16), coinMat);
  body.rotation.x = Math.PI / 2;

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

// 19. Gateway Arch
export function makeToriiArch(color = 0xffb7b2) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, flatShading: true });

  const leftPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8), mat);
  leftPillar.position.set(-2.0, 2.1, 0);

  const rightPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.2, 8), mat);
  rightPillar.position.set(2.0, 2.1, 0);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.35, 0.45), mat);
  beam.position.set(0, 4.0, 0);

  const subBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 0.3), mat);
  subBeam.position.set(0, 3.4, 0);

  g.add(leftPillar, rightPillar, beam, subBeam);
  return g;
}
