import * as THREE from 'three';

// =========================================================================
// Real 3D Interactive STEM Laboratories: Physics, Chemistry & Biology
// Authentic NCERT / ICSE Class 6-8 Curriculum Experiments in 3D Space
// =========================================================================

// Helper to create glowing shootable target node meshes
function createTargetNodeMeshes(targetNodes, parentGroup, labOrigin) {
  const nodeMeshes = [];
  targetNodes.forEach((node) => {
    const nGroup = new THREE.Group();
    nGroup.position.set(node.x - labOrigin.x, node.y - labOrigin.y, node.z - labOrigin.z);

    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.36, 0),
      new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.95,
        roughness: 0.2,
      })
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.03, 8, 24),
      new THREE.MeshBasicMaterial({ color: node.color, wireframe: true })
    );
    nGroup.add(crystal, ring);
    parentGroup.add(nGroup);
    nodeMeshes.push({ group: nGroup, ring, crystal, node });
  });
  return nodeMeshes;
}

// -------------------------------------------------------------------------
// 1. PHYSICS: Optical Wave Dispersion Bench (Snell's Law & Prism Refraction)
// Formula: n1 * sin(theta1) = n2 * sin(theta2)
// -------------------------------------------------------------------------
export function makePrismLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Optical bench base plate with precision vernier markings
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x181622, metalness: 0.85, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.25, 4.5), baseMat);
  base.position.y = 0.125;
  g.add(base);

  // Calibrated rotating turntable with degree graduations
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x2e2942, metalness: 0.6, roughness: 0.4 });
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.15, 32), dialMat);
  dial.position.y = 0.32;
  g.add(dial);

  // Equilateral Flint Glass Prism (n = 1.62)
  const prismGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.8, 3);
  const prismMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    opacity: 0.85,
    transparent: true,
    roughness: 0.04,
    ior: 1.62,
    metalness: 0.1,
  });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  prism.position.y = 1.3;
  g.add(prism);

  // Incident Laser Collimator Housing
  const laserMat = new THREE.MeshStandardMaterial({ color: 0x00f5d4, metalness: 0.8 });
  const collimator = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.2, 16), laserMat);
  collimator.rotation.z = Math.PI / 2;
  collimator.position.set(-2.8, 1.3, 0);
  g.add(collimator);

  // Incident Monochromatic White Laser Beam
  const incBeamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
  const incBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 8), incBeamMat);
  incBeam.rotation.z = Math.PI / 2;
  incBeam.position.set(-1.4, 1.3, 0);
  g.add(incBeam);

  // Continuous Refracted Spectral Rays (Red, Orange, Yellow, Green, Blue, Violet)
  const spectralColors = [0xff2a4d, 0xff7b00, 0xffd166, 0x00f59b, 0x00b4d8, 0x9d4edd];
  const spectralRays = [];
  spectralColors.forEach((col, idx) => {
    const rayMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2 });
    const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.8, 6), rayMat);
    const angle = 0.14 + idx * 0.08;
    ray.rotation.z = -Math.PI / 2 + angle;
    ray.position.set(1.4, 1.3 + (idx - 2.5) * 0.12, (idx - 2.5) * 0.22);
    g.add(ray);
    spectralRays.push(ray);
  });

  // Spectral Receptor Screen with lux meter readout
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x221f2d, roughness: 0.5 });
  const receptor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 3.2), screenMat);
  receptor.position.set(2.8, 1.3, 0);
  g.add(receptor);

  // 3 Shootable Angular Calibration Targets
  const targetNodes = [
    {
      id: 'optics-node-correct',
      labId: 'prism',
      label: 'THETA = 45 deg [SNELL MIN DEVIATION]',
      isCorrect: true,
      x: x - 1.8,
      y: y + 2.8,
      z: z - 1.8,
      color: 0x00f5d4,
      desc: 'Optimal 45 deg incident angle generates crisp Snell dispersion',
    },
    {
      id: 'optics-node-wrong1',
      labId: 'prism',
      label: 'THETA = 82 deg [TOTAL REFLECTION]',
      isCorrect: false,
      x: x + 0.0,
      y: y + 3.1,
      z: z - 2.0,
      color: 0xff3b77,
      desc: 'Critical angle exceeded: Total internal backscatter pulse!',
    },
    {
      id: 'optics-node-wrong2',
      labId: 'prism',
      label: 'THETA = 12 deg [ASTIGMATIC LOSS]',
      isCorrect: false,
      x: x + 1.8,
      y: y + 2.8,
      z: z - 1.8,
      color: 0xffa502,
      desc: 'Sub-refractive angle: light scatters with zero dispersion',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;

  return {
    id: 'prism',
    type: 'physics',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      prism.rotation.y = Math.PI / 6;
      spectralRays.forEach((ray) => {
        ray.material.opacity = 1.0;
      });
    },
    update(dt) {
      if (!activated) {
        prism.rotation.y += dt * 0.4;
      }
      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.z += dt * (1.2 + idx * 0.3);
        nm.crystal.rotation.y += dt * 1.5;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 2. PHYSICS: Newtonian Momentum & Kinetic Air Track Collider (p = m * v)
// -------------------------------------------------------------------------
export function makeMomentumLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Linear collision rail with precision photogate posts
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f1d2b, metalness: 0.9, roughness: 0.2 });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.25, 0.9), frameMat);
  rail.position.set(0, 0.2, 0);
  g.add(rail);

  // Digital Infrared Photogates at endpoints
  for (const px of [-2.4, 2.4]) {
    const gateU = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 1.4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x00f5d4, metalness: 0.8 })
    );
    gateU.position.set(px, 0.9, 0);
    g.add(gateU);
  }

  // Suspended Newton collision spheres (3 spheres on steel filaments)
  const sphereGeo = new THREE.SphereGeometry(0.36, 20, 20);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.1,
  });

  const spheres = [];
  [-0.72, 0, 0.72].forEach((sx) => {
    const s = new THREE.Mesh(sphereGeo, sphereMat);
    s.position.set(sx, 1.25, 0);
    g.add(s);
    spheres.push(s);
  });

  const targetNodes = [
    {
      id: 'momentum-node-correct',
      labId: 'momentum',
      label: 'm = 2.0 kg, v = 5.0 m/s [p = 10 kg*m/s ELASTIC MATCH]',
      isCorrect: true,
      x: x - 1.8,
      y: y + 3.2,
      z: z - 1.2,
      color: 0x00f5d4,
      desc: 'Momentum p = 10 kg*m/s matches energy dynamo coupling threshold',
    },
    {
      id: 'momentum-node-wrong1',
      labId: 'momentum',
      label: 'v = 0.5 m/s [INSUFFICIENT KINETIC ENERGY]',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.2,
      z: z - 1.2,
      color: 0xffa502,
      desc: 'Sub-threshold impulse: spheres stall before tripping sector dynamo',
    },
    {
      id: 'momentum-node-wrong2',
      labId: 'momentum',
      label: 'v = 30.0 m/s [MECHANICAL RECOIL RUPTURE]',
      isCorrect: false,
      x: x,
      y: y + 3.8,
      z: z + 1.4,
      color: 0xff3b77,
      desc: 'Excess kinetic shock shatters rail bearings! Heavy recoil blowback',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;
  let swingTime = 0;

  return {
    id: 'momentum',
    type: 'physics',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
    },
    update(dt) {
      if (activated) {
        swingTime += dt * 4.5;
        const swing = Math.sin(swingTime);
        if (swing > 0) {
          spheres[0].position.x = -0.72 - swing * 0.5;
          spheres[2].position.x = 0.72;
        } else {
          spheres[0].position.x = -0.72;
          spheres[2].position.x = 0.72 - swing * 0.5;
        }
      }
      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.z += dt * (1.2 + idx * 0.25);
        nm.crystal.rotation.x += dt * 1.4;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 3. PHYSICS: Electromagnetic Solenoid & Lorentz Magnetic Flux Lab (F = q(E + v x B))
// Faraday-Lenz Law: E = -N * (dPhi/dt)
// -------------------------------------------------------------------------
export function makeLorentzElectromagnetLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Heavy laboratory isolation bench
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x140e26, metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.4, 0.35, 24), baseMat);
  base.position.y = 0.175;
  g.add(base);

  // Iron Core Cylinder
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 16), coreMat);
  core.position.y = 1.8;
  g.add(core);

  // 14 Helical Copper Solenoid Rings
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    metalness: 0.95,
    roughness: 0.25,
  });
  const coilRings = [];
  for (let i = 0; i < 14; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 8, 20), copperMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.8 + i * 0.15;
    g.add(ring);
    coilRings.push(ring);
  }

  // Horseshoe Permanent Magnet (North Pole = Red, South Pole = Blue)
  const magnetGroup = new THREE.Group();
  magnetGroup.position.set(0, 3.4, 0);

  const northPole = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 1.2, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xff3b77, metalness: 0.7 })
  );
  northPole.position.x = -0.7;

  const southPole = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 1.2, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.7 })
  );
  southPole.position.x = 0.7;

  const yoke = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.45, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 })
  );
  yoke.position.y = 0.6;
  magnetGroup.add(northPole, southPole, yoke);
  g.add(magnetGroup);

  // 3D Magnetic Flux Loop Lines (Cyan glowing vectors)
  const fluxLoops = [];
  for (let i = 0; i < 3; i++) {
    const loopGeo = new THREE.TorusGeometry(1.4 + i * 0.3, 0.02, 6, 24);
    const loopMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.25 });
    const flux = new THREE.Mesh(loopGeo, loopMat);
    flux.rotation.y = (i * Math.PI) / 3;
    flux.position.y = 1.8;
    g.add(flux);
    fluxLoops.push(flux);
  }

  const targetNodes = [
    {
      id: 'lorentz-node-correct',
      labId: 'lorentz',
      label: 'LENZ LAW: EMF OPPOSES dPhi/dt [E = -N*dPhi/dt]',
      isCorrect: true,
      x: x - 1.8,
      y: y + 3.2,
      z: z - 1.2,
      color: 0x00f5d4,
      desc: 'Induced magnetic field correctly counters flux change to drive dynamo',
    },
    {
      id: 'lorentz-node-wrong1',
      labId: 'lorentz',
      label: 'MONOPOLE ATTEMPT: div B != 0 [GAUSS LAW ERROR]',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.2,
      z: z - 1.2,
      color: 0xff3b77,
      desc: 'Magnetic monopoles cannot exist: flux diverged with zero induction',
    },
    {
      id: 'lorentz-node-wrong2',
      labId: 'lorentz',
      label: 'ZERO IMPEDANCE SURGE: INFINITE CURRENT',
      isCorrect: false,
      x: x,
      y: y + 3.8,
      z: z + 1.5,
      color: 0xffa502,
      desc: 'Thermal runaway: unquenched resistance shatters copper windings',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;
  let plungeTime = 0;

  return {
    id: 'lorentz',
    type: 'physics',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      fluxLoops.forEach((f) => {
        f.material.opacity = 0.85;
      });
    },
    update(dt) {
      if (activated) {
        plungeTime += dt * 3.5;
        magnetGroup.position.y = 2.4 + Math.sin(plungeTime) * 0.9;
        fluxLoops.forEach((f, idx) => {
          f.rotation.z += dt * (1.5 + idx * 0.4);
        });
      }
      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.x += dt * (1.2 + idx * 0.3);
        nm.crystal.rotation.y += dt * 1.5;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 4. CHEMISTRY: Quantum Bohr Atom & Electron Energy Transition (E = h * nu)
// -------------------------------------------------------------------------
export function makeBohrAtomLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x140e26, metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 0.4, 24), baseMat);
  base.position.y = 0.2;
  g.add(base);

  // Magnetic Pylons
  for (let i = 0; i < 4; i++) {
    const pylon = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 3.8, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x7d5fff, metalness: 0.7 })
    );
    const ang = (i * Math.PI) / 2;
    pylon.position.set(Math.cos(ang) * 2.6, 1.9, Math.sin(ang) * 2.6);
    g.add(pylon);
  }

  // Nucleus Cluster (Protons & Neutrons)
  const nucleusGroup = new THREE.Group();
  nucleusGroup.position.y = 2.2;
  for (let i = 0; i < 6; i++) {
    const isProton = i % 2 === 0;
    const nucMat = new THREE.MeshStandardMaterial({
      color: isProton ? 0xff3b77 : 0x00f5d4,
      emissive: isProton ? 0xff3b77 : 0x00f5d4,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), nucMat);
    const ang = (i * Math.PI * 2) / 6;
    sphere.position.set(Math.cos(ang) * 0.22, Math.sin(i * 1.2) * 0.18, Math.sin(ang) * 0.22);
    nucleusGroup.add(sphere);
  }
  g.add(nucleusGroup);

  // Quantum Orbital Rings: n=1 (r=1.2), n=2 (r=2.0), n=3 (r=2.8)
  const orbitalRadii = [1.2, 2.0, 2.8];
  const orbitRings = [];
  orbitalRadii.forEach((r, idx) => {
    const ringMat = new THREE.MeshBasicMaterial({
      color: idx === 1 ? 0x00f5d4 : 0x7d5fff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.03, r + 0.03, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.2;
    g.add(ring);
    orbitRings.push(ring);
  });

  const electronMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00f5d4,
    emissiveIntensity: 1.5,
  });
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), electronMat);
  electron.position.set(1.2, 2.2, 0);
  g.add(electron);

  const targetNodes = [
    {
      id: 'bohr-node-correct',
      labId: 'bohr',
      label: 'PHOTON = 10.2 eV [n=1 -> n=2 LYMAN JUMP]',
      isCorrect: true,
      x: x - 1.8,
      y: y + 3.8,
      z: z,
      color: 0x00f5d4,
      desc: 'Exact energy gap Delta E = 10.2 eV promotes electron to n=2 shell',
    },
    {
      id: 'bohr-node-wrong1',
      labId: 'bohr',
      label: 'PHOTON = 1.8 eV [SUB-QUANTUM DEFICIT]',
      isCorrect: false,
      x: x,
      y: y + 4.2,
      z: z - 1.6,
      color: 0xffa502,
      desc: 'Energy too low: Photon passes through with zero excitation',
    },
    {
      id: 'bohr-node-wrong2',
      labId: 'bohr',
      label: 'PHOTON = 45.0 eV [UNCONTROLLED IONIZATION]',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.8,
      z: z,
      color: 0xff3b77,
      desc: 'Radiation overload! Spontaneous ionization shockwave breach',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let currentShell = 0;
  let activated = false;
  let electronAngle = 0;

  return {
    id: 'bohr',
    type: 'chemistry',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      currentShell = 1;
      orbitRings[1].material.color.setHex(0x00f5d4);
      orbitRings[1].material.opacity = 0.9;
    },
    update(dt) {
      nucleusGroup.rotation.y += dt * 0.8;
      nucleusGroup.rotation.x += dt * 0.5;

      const targetRadius = orbitalRadii[currentShell];
      electronAngle += dt * (currentShell === 0 ? 3.5 : 2.2);
      electron.position.set(
        Math.cos(electronAngle) * targetRadius,
        2.2 + Math.sin(electronAngle * 2) * 0.1,
        Math.sin(electronAngle) * targetRadius
      );

      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.x += dt * (1.1 + idx * 0.2);
        nm.crystal.rotation.y += dt * 1.6;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 5. CHEMISTRY: Acid-Base Titration & Neutralization Reactor (H+ + OH- -> H2O)
// -------------------------------------------------------------------------
export function makeTitrationLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1b29, metalness: 0.8, roughness: 0.3 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 4.2), baseMat);
  base.position.y = 0.15;
  g.add(base);

  // Volumetric Glass Burette Dropper Stand
  const standMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
  const standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.0, 12), standMat);
  standRod.position.set(-1.4, 2.0, -1.0);
  const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.2), standMat);
  clamp.position.set(-0.95, 3.4, -1.0);
  const buretteTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 2.0, 16),
    new THREE.MeshPhysicalMaterial({ transmission: 0.9, transparent: true, opacity: 0.4 })
  );
  buretteTube.position.set(-0.5, 2.8, -1.0);
  g.add(standRod, clamp, buretteTube);

  // Borosilicate Glass Conical Reaction Vessel
  const glassGeo = new THREE.CylinderGeometry(0.8, 1.4, 2.4, 24, 1, true);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    opacity: 0.35,
    transparent: true,
    roughness: 0.05,
    ior: 1.5,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 1.4, 0);
  g.add(glass);

  // Fluid Mesh inside Reactor (Indicator shifts pH 2 -> pH 7)
  const fluidGeo = new THREE.CylinderGeometry(0.75, 1.35, 1.6, 20);
  const fluidMat = new THREE.MeshStandardMaterial({
    color: 0xff2a4d,
    emissive: 0xff2a4d,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85,
  });
  const fluid = new THREE.Mesh(fluidGeo, fluidMat);
  fluid.position.set(0, 1.05, 0);
  g.add(fluid);

  // 14 Rising Effervescence Bubbles
  const bubbles = [];
  const bubMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
  for (let i = 0; i < 14; i++) {
    const bub = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), bubMat);
    bub.position.set((Math.random() - 0.5) * 1.4, 0.4 + Math.random() * 1.4, (Math.random() - 0.5) * 1.4);
    g.add(bub);
    bubbles.push(bub);
  }

  const targetNodes = [
    {
      id: 'titration-node-correct',
      labId: 'titration',
      label: 'ADD +2 OH- [NEUTRALIZE ACID TO pH 7.0]',
      isCorrect: true,
      x: x - 1.6,
      y: y + 3.4,
      z: z - 1.2,
      color: 0x00f5d4,
      desc: 'H+ + OH- -> H2O neutralization balances reactor to stable pH 7.00',
    },
    {
      id: 'titration-node-wrong1',
      labId: 'titration',
      label: 'ADD +4 H+ [HYPER-ACIDIFICATION]',
      isCorrect: false,
      x: x + 1.6,
      y: y + 3.4,
      z: z - 1.2,
      color: 0xff3b77,
      desc: 'Corrosive runaway: pH plunges to 0.8, triggering acid vapor surge!',
    },
    {
      id: 'titration-node-wrong2',
      labId: 'titration',
      label: 'ADD +3 Cl- [SPECTATOR ION]',
      isCorrect: false,
      x: x,
      y: y + 3.8,
      z: z + 1.5,
      color: 0xffa502,
      desc: 'Inert chloride spectator has no effect on pH balance',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;

  return {
    id: 'titration',
    type: 'chemistry',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      fluid.material.color.setHex(0x00f59b);
      fluid.material.emissive.setHex(0x00f59b);
      fluid.material.emissiveIntensity = 0.55;
    },
    update(dt) {
      bubbles.forEach((bub) => {
        bub.position.y += dt * (activated ? 1.8 : 0.6);
        if (bub.position.y > 1.95) {
          bub.position.y = 0.4;
          bub.position.x = (Math.random() - 0.5) * 1.4;
          bub.position.z = (Math.random() - 0.5) * 1.4;
        }
      });
      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.z += dt * (1.3 + idx * 0.25);
        nm.crystal.rotation.x += dt * 1.4;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 6. CHEMISTRY: 3D VSEPR Molecular Geometry & Crystal Lattice
// Methane CH4 (Tetrahedral 109.5 deg) & NaCl Rock Salt Unit Cell
// -------------------------------------------------------------------------
export function makeMolecularLatticeLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x181622, metalness: 0.85, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 5.2), baseMat);
  base.position.y = 0.15;
  g.add(base);

  // Rotating Central Molecule Group (sp3 Tetrahedral Methane CH4)
  const molGroup = new THREE.Group();
  molGroup.position.set(0, 2.0, 0);

  // Central Carbon Atom
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    emissive: 0x1e293b,
    emissiveIntensity: 0.4,
    roughness: 0.2,
  });
  const carbon = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), carbonMat);
  molGroup.add(carbon);

  // 4 Tetrahedral Hydrogens (bond angle 109.5 deg)
  const hMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00f5d4,
    emissiveIntensity: 0.6,
    roughness: 0.15,
  });
  const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });

  const tetVertices = [
    new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(1.2),
    new THREE.Vector3(-1, -1, 1).normalize().multiplyScalar(1.2),
    new THREE.Vector3(-1, 1, -1).normalize().multiplyScalar(1.2),
    new THREE.Vector3(1, -1, -1).normalize().multiplyScalar(1.2),
  ];

  tetVertices.forEach((v) => {
    const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), hMat);
    hAtom.position.copy(v);
    molGroup.add(hAtom);

    // Covalent Bond Cylinder connecting C and H
    const dist = v.length();
    const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, dist, 8), bondMat);
    bond.position.copy(v.clone().multiplyScalar(0.5));
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
    molGroup.add(bond);
  });
  g.add(molGroup);

  // Surrounding NaCl Cubic Unit Cell Wireframe Cage
  const cageMat = new THREE.MeshBasicMaterial({ color: 0x7d5fff, wireframe: true, transparent: true, opacity: 0.35 });
  const cage = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.6, 3.6), cageMat);
  cage.position.set(0, 2.0, 0);
  g.add(cage);

  const targetNodes = [
    {
      id: 'molecule-node-correct',
      labId: 'molecule',
      label: 'sp3 TETRAHEDRAL: 109.5 DEGREE VSEPR HYBRIDIZATION',
      isCorrect: true,
      x: x - 1.8,
      y: y + 3.4,
      z: z - 1.2,
      color: 0x00f5d4,
      desc: 'Optimal 109.5 deg tetrahedral angle minimizes electron-pair repulsion',
    },
    {
      id: 'molecule-node-wrong1',
      labId: 'molecule',
      label: 'OCTAHEDRAL STRAIN: 90 DEGREE SQUARE PLANAR',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.4,
      z: z - 1.2,
      color: 0xff3b77,
      desc: 'Severe steric clash! Electronic repulsion collapses molecular symmetry',
    },
    {
      id: 'molecule-node-wrong2',
      labId: 'molecule',
      label: 'PENTAVALENT CARBON: NON-OCTET FREE RADICAL',
      isCorrect: false,
      x: x,
      y: y + 4.0,
      z: z + 1.5,
      color: 0xffa502,
      desc: 'Octet violation! Unstable hypervalent radical decomposes instantly',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;

  return {
    id: 'molecule',
    type: 'chemistry',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      cageMat.opacity = 0.85;
      cageMat.color.setHex(0x00f5d4);
    },
    update(dt) {
      molGroup.rotation.x += dt * 0.7;
      molGroup.rotation.y += dt * 0.9;
      cage.rotation.y -= dt * 0.3;

      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.z += dt * (1.2 + idx * 0.3);
        nm.crystal.rotation.y += dt * 1.5;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 7. CHEMISTRY: 3D Galvanic Voltaic Cell & Salt Bridge Electrolysis Lab
// Zn + Cu2+ -> Zn2+ + Cu (E0 = +1.10 V)
// -------------------------------------------------------------------------
export function makeGalvanicCellLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1f1d2b, metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 3.4), baseMat);
  base.position.y = 0.125;
  g.add(base);

  // Left Beaker: Zinc Anode & ZnSO4 solution
  const glassMat = new THREE.MeshPhysicalMaterial({ transmission: 0.92, transparent: true, opacity: 0.4 });
  const leftGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.6, 20, 1, true), glassMat);
  leftGlass.position.set(-1.4, 0.95, 0);
  const leftLiquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 1.2, 16),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.5 })
  );
  leftLiquid.position.set(-1.4, 0.8, 0);
  const znElectrode = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.8, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
  );
  znElectrode.position.set(-1.4, 1.1, 0);
  g.add(leftGlass, leftLiquid, znElectrode);

  // Right Beaker: Copper Cathode & Deep Blue CuSO4 solution
  const rightGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.6, 20, 1, true), glassMat);
  rightGlass.position.set(1.4, 0.95, 0);
  const rightLiquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 1.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8 })
  );
  rightLiquid.position.set(1.4, 0.8, 0);
  const cuElectrode = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.8, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 })
  );
  cuElectrode.position.set(1.4, 1.1, 0);
  g.add(rightGlass, rightLiquid, cuElectrode);

  // Inverted U-Shaped Agar Salt Bridge (KNO3)
  const bridgeTube = new THREE.Mesh(
    new THREE.TorusGeometry(1.4, 0.08, 8, 24, Math.PI),
    new THREE.MeshPhysicalMaterial({ transmission: 0.9, transparent: true, opacity: 0.6, color: 0x7d5fff })
  );
  bridgeTube.position.set(0, 1.4, 0);
  g.add(bridgeTube);

  // Analog Voltmeter with Galvanometer Needle
  const meterMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
  const meter = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.25, 24), meterMat);
  meter.rotation.x = Math.PI / 2;
  meter.position.set(0, 2.6, 0);
  const needle = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.48, 0.02),
    new THREE.MeshBasicMaterial({ color: 0xff3b77 })
  );
  needle.position.set(0, 2.6, 0.14);
  g.add(meter, needle);

  const targetNodes = [
    {
      id: 'galvanic-node-correct',
      labId: 'galvanic',
      label: 'CATHODE REDUCTION: Cu2+ + 2e- -> Cu [E0 = +1.10 V]',
      isCorrect: true,
      x: x - 1.8,
      y: y + 3.2,
      z: z - 1.2,
      color: 0x00f5d4,
      desc: 'Spontaneous redox reaction generates stable +1.10V electromotive force',
    },
    {
      id: 'galvanic-node-wrong1',
      labId: 'galvanic',
      label: 'POLARITY INVERSION: REVERSE ELECTROLYTIC BREAKDOWN',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.2,
      z: z - 1.2,
      color: 0xff3b77,
      desc: 'Short-circuit voltage surge destroys electrochemical electrode coating',
    },
    {
      id: 'galvanic-node-wrong2',
      labId: 'galvanic',
      label: 'SALT BRIDGE DISCONNECT: OPEN CIRCUIT VOLTAGE DROP',
      isCorrect: false,
      x: x,
      y: y + 3.8,
      z: z + 1.4,
      color: 0xffa502,
      desc: 'Ion exchange ceases: circuit drops to 0.00 V with zero current flow',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;

  return {
    id: 'galvanic',
    type: 'chemistry',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      needle.rotation.z = -0.55; // Deflect to +1.10 V
      rightLiquid.material.color.setHex(0x00f5d4);
    },
    update(dt) {
      if (!activated) {
        needle.rotation.z = Math.sin(Date.now() * 0.003) * 0.05;
      }
      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.y += dt * (1.2 + idx * 0.3);
        nm.crystal.rotation.x += dt * 1.5;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 8. BIOLOGY: Watson-Crick DNA Double Helix Macromolecule (A-T & G-C)
// Antiparallel double strands with nucleotide base-pairing rungs
// -------------------------------------------------------------------------
export function makeDnaHelixLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Biological sequencer laboratory pedestal
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x140e26, metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 0.35, 28), baseMat);
  base.position.y = 0.175;
  g.add(base);

  // Rotating Double Helix Group
  const helixGroup = new THREE.Group();
  helixGroup.position.set(0, 0.4, 0);

  // 24 Base Pairs across two full helical turns (720 deg)
  const numPairs = 24;
  const helixRadius = 1.1;
  const helixHeight = 4.2;

  const aMat = new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 0.5 }); // Adenine
  const tMat = new THREE.MeshStandardMaterial({ color: 0xff3b77, emissive: 0xff3b77, emissiveIntensity: 0.5 }); // Thymine
  const gMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.5 }); // Guanine
  const cMat = new THREE.MeshStandardMaterial({ color: 0x2ed573, emissive: 0x2ed573, emissiveIntensity: 0.5 }); // Cytosine
  const bbMat = new THREE.MeshStandardMaterial({ color: 0x7d5fff, metalness: 0.7, roughness: 0.2 }); // Sugar-phosphate backbone

  const pairSpheres = [];

  for (let i = 0; i < numPairs; i++) {
    const tRatio = i / numPairs;
    const angle = tRatio * Math.PI * 4;
    const py = tRatio * helixHeight;

    const x1 = Math.cos(angle) * helixRadius;
    const z1 = Math.sin(angle) * helixRadius;
    const x2 = -x1;
    const z2 = -z1;

    // Sugar-phosphate backbone spheres
    const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), bbMat);
    s1.position.set(x1, py, z1);
    const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), bbMat);
    s2.position.set(x2, py, z2);
    helixGroup.add(s1, s2);

    // Nitrogenous Base Rung
    const isAT = i % 2 === 0;
    const m1 = isAT ? aMat : gMat;
    const m2 = isAT ? tMat : cMat;

    // Half-rung 1
    const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, helixRadius, 8), m1);
    r1.position.set(x1 * 0.5, py, z1 * 0.5);
    r1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x1, 0, z1).normalize());
    r1.rotateX(Math.PI / 2);

    // Half-rung 2
    const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, helixRadius, 8), m2);
    r2.position.set(x2 * 0.5, py, z2 * 0.5);
    r2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x2, 0, z2).normalize());
    r2.rotateX(Math.PI / 2);

    helixGroup.add(r1, r2);
    pairSpheres.push(r1, r2);
  }
  g.add(helixGroup);

  // Optical Laser Scanning Ring traversing vertically
  const scanRingMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true });
  const scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.04, 8, 24), scanRingMat);
  scanRing.rotation.x = Math.PI / 2;
  scanRing.position.y = 2.0;
  g.add(scanRing);

  const targetNodes = [
    {
      id: 'dna-node-correct',
      labId: 'dna',
      label: 'COMPLEMENTARY MATCH: ADENINE (A) <-> THYMINE (T) [2-H BONDS]',
      isCorrect: true,
      x: x - 1.8,
      y: y + 3.4,
      z: z - 1.2,
      color: 0x00f5d4,
      desc: 'Watson-Crick base pairing preserves double helix replication fidelity',
    },
    {
      id: 'dna-node-wrong1',
      labId: 'dna',
      label: 'PURINE MISPAIR: GUANINE (G) MISMATCHED WITH ADENINE (A)',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.4,
      z: z - 1.2,
      color: 0xff3b77,
      desc: 'Point mutation detected! Bulky purine-purine distortion distorts DNA backbone',
    },
    {
      id: 'dna-node-wrong2',
      labId: 'dna',
      label: 'FRAME-SHIFT DELETION: NONSENSE TRUNCATION FAILURE',
      isCorrect: false,
      x: x,
      y: y + 4.0,
      z: z + 1.4,
      color: 0xffa502,
      desc: 'Reading frame shifted: protein translation aborts with catastrophic failure',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;
  let scanTime = 0;

  return {
    id: 'dna',
    type: 'biology',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      scanRingMat.color.setHex(0x2ed573);
    },
    update(dt) {
      scanTime += dt * (activated ? 3.0 : 1.2);
      helixGroup.rotation.y += dt * (activated ? 1.6 : 0.6);
      scanRing.position.y = 1.0 + Math.sin(scanTime) * 1.4;

      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.x += dt * (1.2 + idx * 0.3);
        nm.crystal.rotation.y += dt * 1.5;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 9. BIOLOGY: 3D Plant Cell, Mitochondria & Chloroplast Organelle Lab
// Cellular Respiration: C6H12O6 + 6O2 -> 6CO2 + 6H2O + 38 ATP
// -------------------------------------------------------------------------
export function makePlantCellLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x140e26, metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.4, 0.35, 24), baseMat);
  base.position.y = 0.175;
  g.add(base);

  // Outer Cellulose Cell Wall (Hexagonal prism in emerald green)
  const wallMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    transmission: 0.85,
    opacity: 0.45,
    transparent: true,
    roughness: 0.15,
  });
  const cellWall = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 2.6, 6), wallMat);
  cellWall.position.y = 1.6;
  g.add(cellWall);

  // Central Nucleus with Chromatin Sphere
  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.5,
    roughness: 0.2,
  });
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), nucleusMat);
  nucleus.position.set(0, 1.6, 0);
  g.add(nucleus);

  // 2 Chloroplasts (Oval photosynthetic organelles with thylakoid discs)
  const chloroMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x16a34a,
    emissiveIntensity: 0.6,
  });
  const chloro1 = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), chloroMat);
  chloro1.scale.set(1.4, 0.7, 0.7);
  chloro1.position.set(-1.1, 1.4, -0.6);

  const chloro2 = chloro1.clone();
  chloro2.position.set(1.1, 1.8, 0.6);
  g.add(chloro1, chloro2);

  // Mitochondrion ("Powerhouse of the Cell") with Sliced Cristae Folds
  const mitoMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.7,
  });
  const mito = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.1, 14), mitoMat);
  mito.rotation.z = Math.PI / 3;
  mito.position.set(0.7, 1.3, -0.8);
  g.add(mito);

  // 8 ATP Energy Synthase Packets (Floating golden crystals)
  const atpMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffd166,
    emissiveIntensity: 0.9,
  });
  const atpPackets = [];
  for (let i = 0; i < 8; i++) {
    const atp = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), atpMat);
    atp.position.set((Math.random() - 0.5) * 2.2, 0.8 + Math.random() * 1.6, (Math.random() - 0.5) * 2.2);
    g.add(atp);
    atpPackets.push(atp);
  }

  const targetNodes = [
    {
      id: 'cell-node-correct',
      labId: 'cell',
      label: 'MITOCHONDRIA AEROBIC RESPIRATION: C6H12O6 + 6O2 -> 38 ATP',
      isCorrect: true,
      x: x - 1.8,
      y: y + 3.4,
      z: z - 1.2,
      color: 0x00f5d4,
      desc: 'ATP synthase motor couples electron transport to power cellular metabolism',
    },
    {
      id: 'cell-node-wrong1',
      labId: 'cell',
      label: 'SEVERE PLASMOLYSIS: OSMOTIC WATER EVACUATION',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.4,
      z: z - 1.2,
      color: 0xff3b77,
      desc: 'Turgor pressure plummets to 0: cell membrane tears from cell wall',
    },
    {
      id: 'cell-node-wrong2',
      labId: 'cell',
      label: 'LYSOSOME MEMBRANE RUPTURE: ACID HYDROLASE SPILL',
      isCorrect: false,
      x: x,
      y: y + 4.0,
      z: z + 1.4,
      color: 0xffa502,
      desc: 'Cytoplasmic self-digestion triggered: cellular structural collapse',
    },
  ];

  const nodeMeshes = createTargetNodeMeshes(targetNodes, g, { x, y, z });
  let activated = false;

  return {
    id: 'cell',
    type: 'biology',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      wallMat.color.setHex(0x00f5d4);
      atpMat.emissiveIntensity = 1.8;
    },
    update(dt) {
      nucleus.rotation.y += dt * 0.4;
      atpPackets.forEach((atp, i) => {
        atp.rotation.x += dt * 1.5;
        atp.rotation.y += dt * 1.8;
        atp.position.y += Math.sin(Date.now() * 0.003 + i) * 0.005;
      });

      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.z += dt * (1.2 + idx * 0.3);
        nm.crystal.rotation.x += dt * 1.5;
      });
    },
  };
}

// -------------------------------------------------------------------------
// 10. Sector Energy Forcefield Security Gate
// Transparent hexagonal barrier that physically blocks access to sectors until unlocked
// -------------------------------------------------------------------------
export function makeSectorForcefield(id, x, z, width = 6.5, height = 5.0, color = 0x00f5d4) {
  const g = new THREE.Group();
  g.position.set(x, height * 0.5, z);

  const barrierMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    wireframe: true,
    side: THREE.DoubleSide,
  });
  const barrierGeo = new THREE.PlaneGeometry(width, height, 12, 8);
  const mesh = new THREE.Mesh(barrierGeo, barrierMat);
  g.add(mesh);

  // Left & Right Pylons
  const pylonMat = new THREE.MeshStandardMaterial({ color: 0x140e26, metalness: 0.9, roughness: 0.2 });
  const pylonGeo = new THREE.CylinderGeometry(0.25, 0.35, height, 12);
  const leftPylon = new THREE.Mesh(pylonGeo, pylonMat);
  leftPylon.position.x = -width * 0.5;
  const rightPylon = leftPylon.clone();
  rightPylon.position.x = width * 0.5;
  g.add(leftPylon, rightPylon);

  let active = true;

  return {
    id,
    group: g,
    mesh,
    x,
    z,
    width,
    get active() {
      return active;
    },
    disengage() {
      active = false;
      barrierMat.opacity = 0.05;
      mesh.visible = false;
    },
    update(dt, elapsed) {
      if (active) {
        barrierMat.opacity = 0.4 + Math.sin(elapsed * 4.0) * 0.15;
      }
    },
  };
}
