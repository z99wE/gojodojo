import * as THREE from 'three';

// =========================================================================
// Real 3D Interactive Physics & Chemistry Laboratory Apparatuses
// Authentic NCERT / ICSE Class 6-8 STEM Experiments in 3D Space
// =========================================================================

// 1. Optical Wave Dispersion Bench (Snell's Law & Prism Refraction)
// Formula: n1 * sin(theta1) = n2 * sin(theta2), Minimum Deviation Angle
export function makePrismLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Optical bench base plate
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x181622,
    metalness: 0.85,
    roughness: 0.2,
  });
  const base = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.25, 4.5), baseMat);
  base.position.y = 0.125;
  g.add(base);

  // Calibrated rotating turntable
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x2e2942, metalness: 0.6, roughness: 0.4 });
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.15, 32), dialMat);
  dial.position.y = 0.32;
  g.add(dial);

  // Equilateral Flint Glass Prism
  const prismGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.8, 3);
  const prismMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.9,
    opacity: 0.85,
    transparent: true,
    roughness: 0.05,
    ior: 1.62,
    metalness: 0.1,
  });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  prism.position.y = 1.3;
  g.add(prism);

  // Incident Laser Collimator Housing
  const laserMat = new THREE.MeshStandardMaterial({ color: 0x00f5d4, metalness: 0.8 });
  const collimator = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.2, 12), laserMat);
  collimator.rotation.z = Math.PI / 2;
  collimator.position.set(-2.8, 1.3, 0);
  g.add(collimator);

  // White Incident Beam Line
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const incidentBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 6), beamMat);
  incidentBeam.rotation.z = Math.PI / 2;
  incidentBeam.position.set(-1.8, 1.3, 0);
  g.add(incidentBeam);

  // 3 Refracted Spectral Rays (Red, Green, Violet)
  const spectralColors = [0xff2a4d, 0x00f59b, 0x9d4edd];
  const spectralRays = [];
  spectralColors.forEach((col, idx) => {
    const rayMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.1 });
    const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6, 6), rayMat);
    const angle = 0.2 + idx * 0.14;
    ray.rotation.z = -Math.PI / 2 + angle;
    ray.position.set(1.4, 1.3 + idx * 0.18, (idx - 1) * 0.3);
    g.add(ray);
    spectralRays.push(ray);
  });

  // Spectral Receptor Screen
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x221f2d, roughness: 0.5 });
  const receptor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 2.8), screenMat);
  receptor.position.set(2.8, 1.3, 0);
  g.add(receptor);

  // 3 Shootable Angular Calibration Mirrors/Nodes
  const targetNodes = [
    {
      id: 'optics-node-correct',
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
      label: 'THETA = 12 deg [ASTIGMATIC LOSS]',
      isCorrect: false,
      x: x + 1.8,
      y: y + 2.8,
      z: z - 1.8,
      color: 0xffa502,
      desc: 'Sub-refractive threshold: beam lost to surface scattering',
    },
  ];

  const nodeMeshes = [];
  targetNodes.forEach((node) => {
    const nGroup = new THREE.Group();
    nGroup.position.set(node.x - x, node.y - y, node.z - z);

    // Glowing target crystal
    const cMat = new THREE.MeshStandardMaterial({
      color: node.color,
      emissive: node.color,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), cMat);
    nGroup.add(crystal);

    // Outer reticle ring
    const ringMat = new THREE.MeshBasicMaterial({ color: node.color, wireframe: true });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.58, 16), ringMat);
    nGroup.add(ring);

    g.add(nGroup);
    nodeMeshes.push({ group: nGroup, ring, crystal, node });
  });

  let activated = false;

  return {
    type: 'optics',
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

// 2. Bohr Quantum Atom & Electron Transition Chamber (E = h * nu)
// Lyman Transition: n=1 -> n=2 (10.2 eV absorption)
export function makeBohrAtomLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Levitating containment base
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

  // Central Nucleus (Protons & Neutrons Cluster)
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

  // Valence Electron
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00f5d4,
    emissiveIntensity: 1.5,
  });
  const electron = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), electronMat);
  electron.position.set(1.2, 2.2, 0);
  g.add(electron);

  // 3 Shootable Photon Energy Packets
  const targetNodes = [
    {
      id: 'bohr-node-correct',
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
      label: 'PHOTON = 45.0 eV [UNCONTROLLED IONIZATION]',
      isCorrect: false,
      x: x + 1.8,
      y: y + 3.8,
      z: z,
      color: 0xff3b77,
      desc: 'Radiation overload! Spontaneous ionization shockwave breach',
    },
  ];

  const nodeMeshes = [];
  targetNodes.forEach((node) => {
    const nGroup = new THREE.Group();
    nGroup.position.set(node.x - x, node.y - y, node.z - z);
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
      new THREE.TorusGeometry(0.52, 0.03, 8, 20),
      new THREE.MeshBasicMaterial({ color: node.color, wireframe: true })
    );
    nGroup.add(crystal, ring);
    g.add(nGroup);
    nodeMeshes.push({ group: nGroup, crystal, ring, node });
  });

  let currentShell = 0; // 0 = n=1, 1 = n=2
  let activated = false;
  let electronAngle = 0;

  return {
    type: 'quantum',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      currentShell = 1; // Leap to n=2
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

// 3. Chemical Titration & Neutralization Reactor (H+ + OH- -> H2O)
// Acidic pH 2.0 (Red) -> Neutral pH 7.0 (Emerald Green)
export function makeTitrationLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Chemical reactor stand & support base
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1b29, metalness: 0.8, roughness: 0.3 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.3, 4.2), baseMat);
  base.position.y = 0.15;
  g.add(base);

  // Cylindrical Borosilicate Glass Vessel
  const glassGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 24, 1, true);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    opacity: 0.35,
    transparent: true,
    roughness: 0.05,
    ior: 1.5,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.y = 1.6;
  g.add(glass);

  // Fluid Mesh inside Reactor (Indicator Fluid)
  const fluidGeo = new THREE.CylinderGeometry(1.15, 1.15, 1.8, 20);
  const fluidMat = new THREE.MeshStandardMaterial({
    color: 0xff2a4d, // Initial Acidic Red pH 2.0
    emissive: 0xff2a4d,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85,
  });
  const fluid = new THREE.Mesh(fluidGeo, fluidMat);
  fluid.position.y = 1.15;
  g.add(fluid);

  // 12 Rising Effervescence Bubbles
  const bubbles = [];
  const bubMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
  for (let i = 0; i < 12; i++) {
    const bub = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), bubMat);
    bub.position.set(
      (Math.random() - 0.5) * 1.5,
      0.4 + Math.random() * 1.4,
      (Math.random() - 0.5) * 1.5
    );
    g.add(bub);
    bubbles.push(bub);
  }

  // 3 Shootable Chemical Ion Reagents
  const targetNodes = [
    {
      id: 'titration-node-correct',
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
      label: 'ADD +3 Cl- [SPECTATOR ION]',
      isCorrect: false,
      x: x,
      y: y + 3.8,
      z: z + 1.5,
      color: 0xffa502,
      desc: 'Inert chloride spectator has no effect on pH balance',
    },
  ];

  const nodeMeshes = [];
  targetNodes.forEach((node) => {
    const nGroup = new THREE.Group();
    nGroup.position.set(node.x - x, node.y - y, node.z - z);
    const crystal = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.35, 0),
      new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      })
    );
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.56, 16),
      new THREE.MeshBasicMaterial({ color: node.color, wireframe: true })
    );
    nGroup.add(crystal, ring);
    g.add(nGroup);
    nodeMeshes.push({ group: nGroup, crystal, ring, node });
  });

  let activated = false;

  return {
    type: 'chemistry',
    group: g,
    targetNodes,
    nodeMeshes,
    get activated() {
      return activated;
    },
    activate() {
      activated = true;
      // Shift fluid to Emerald Green pH 7.0
      fluid.material.color.setHex(0x00f59b);
      fluid.material.emissive.setHex(0x00f59b);
      fluid.material.emissiveIntensity = 0.55;
    },
    update(dt) {
      bubbles.forEach((bub) => {
        bub.position.y += dt * (activated ? 1.6 : 0.6);
        if (bub.position.y > 1.95) {
          bub.position.y = 0.4;
          bub.position.x = (Math.random() - 0.5) * 1.5;
          bub.position.z = (Math.random() - 0.5) * 1.5;
        }
      });
      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.z += dt * (1.3 + idx * 0.25);
        nm.crystal.rotation.x += dt * 1.4;
      });
    },
  };
}

// 4. Newtonian Momentum & Kinetic Impulse Collider (p = m * v)
// Momentum Transfer: m1 * v1 = m2 * v2
export function makeMomentumLab(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Linear collision rail structure
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f1d2b, metalness: 0.9, roughness: 0.2 });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.2, 0.8), frameMat);
  rail.position.set(0, 0.2, 0);
  g.add(rail);

  // Suspended Newton collision spheres (3 spheres)
  const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xd8b4f8,
    metalness: 0.9,
    roughness: 0.15,
  });

  const spheres = [];
  [-0.7, 0, 0.7].forEach((sx) => {
    const s = new THREE.Mesh(sphereGeo, sphereMat);
    s.position.set(sx, 1.2, 0);
    g.add(s);
    spheres.push(s);
  });

  // 3 Shootable Impulse Velocity Nodes
  const targetNodes = [
    {
      id: 'momentum-node-correct',
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
      label: 'v = 30.0 m/s [MECHANICAL RECOIL RUPTURE]',
      isCorrect: false,
      x: x,
      y: y + 3.8,
      z: z + 1.4,
      color: 0xff3b77,
      desc: 'Excess kinetic shock shatters rail bearings! Heavy recoil blowback',
    },
  ];

  const nodeMeshes = [];
  targetNodes.forEach((node) => {
    const nGroup = new THREE.Group();
    nGroup.position.set(node.x - x, node.y - y, node.z - z);
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      })
    );
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.56, 16),
      new THREE.MeshBasicMaterial({ color: node.color, wireframe: true })
    );
    nGroup.add(crystal, ring);
    g.add(nGroup);
    nodeMeshes.push({ group: nGroup, crystal, ring, node });
  });

  let activated = false;
  let swingTime = 0;

  return {
    type: 'momentum',
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
        swingTime += dt * 4.0;
        // Elastic Newton's Cradle impulse animation
        const swing = Math.sin(swingTime);
        if (swing > 0) {
          spheres[0].position.x = -0.7 - swing * 0.45;
          spheres[2].position.x = 0.7;
        } else {
          spheres[0].position.x = -0.7;
          spheres[2].position.x = 0.7 - swing * 0.45;
        }
      }
      nodeMeshes.forEach((nm, idx) => {
        nm.ring.rotation.z += dt * (1.2 + idx * 0.3);
        nm.crystal.rotation.y += dt * 1.5;
      });
    },
  };
}

// 5. Sector Energy Forcefield Security Gate
// Transparent hexagonal barrier that physically blocks access to sectors until unlocked
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
