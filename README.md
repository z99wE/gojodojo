# Sankhya Turbo: 8-Bit Grand Prix (संख्या टर्बो)

An authentic 8-bit retro arcade drag racing and Grand Prix STEM motorsport game for Grades 1 through 8 in Hindi and English. Inspired by classic 8-bit racers like 8bit-peter/Racing-Game.

Live on Cloudflare: https://sankhya-strike.pages.dev

GitHub Repository: https://github.com/z99wE/sankhya-strike

---

## Game Overview

Sankhya Turbo transforms STEM education (Physics, Chemistry, Biology, and Mathematics) into an exhilarating 8-bit drag racing and circuit championship:

- Pure 8-Bit Pixel Renderer: Custom HTML5 Canvas retro renderer running at 320x240 internal resolution with authentic CRT scanline overlays, procedural road perspectives, roadside pylons, and animated 8-bit dragsters.
- Procedural Chiptune Audio Synthesizer: Pure Web Audio API procedural sound engine generating 8-bit pulse/square engine revs, downshift engine braking, tire screech noise bursts, nitro overdrive warbles, and 8-bit fanfare melodies.
- Manual Gear Shifting & Drag Physics: Realistic acceleration torque curves across 4 manual gears. Hit the green RPM sweet spot (5800 - 7000 RPM) on the tachometer to achieve a "PERFECT SHIFT" and earn Nitro refill bonuses. Shifting too early bogs down the engine; shifting beyond 8000 RPM hits the rev limiter.
- 3-Lane Track Navigation: Dodge oil slicks and hazards while collecting Nitro canisters across 3 lanes.
- STEM Radio Pitstop Intercom: Pitstop questions delivered directly to the cockpit during the race. Answering correctly unleashes a 100% Super Nitro overdrive boost and awards +1000 championship points. Incorrect answers trigger an engine containment stall penalty and -25% shield loss.

---

## Circuits and Curriculum (Grades 1 to 8)

Four Grand Prix circuits aligned with State Board and NCERT STEM standards:

1. Physics Velocity: Kinematics, forces, work and energy, optics, electromagnetism, and orbital gravitation.
2. Chemistry Reactor: Chemical reactions, acids and bases, periodic trends, stoichiometry, atomic structures, and organic bonding.
3. Biology Bio-Sprint: Cell structures, photosynthesis, genetics, human anatomy, circulatory systems, and ecological networks.
4. Maths Matrix 500: Arithmetic, algebraic formulas, geometric theorems, coordinate systems, trigonometry, and probability.

Language Toggle: Seamless instant switching between Hindi and English at any point in the race.

---

## Controls

### Desktop Keyboard
- Shift Up: SPACEBAR (Target the green zone on the tachometer)
- Shift Down: DOWN ARROW or S key
- Steer Lanes: UP ARROW (Lane Up) / DOWN ARROW (Lane Down) or W / S keys
- Activate Nitro: N key
- Answer STEM Intercom: Keys 1, 2, 3, 4

### Mobile Touch Controls
- Dedicated on-screen arcade buttons for UP LANE, DOWN LANE, GEAR -, SHIFT, and NITRO.
- Instant touch options for STEM quiz answers.

---

## Tech Stack & Architecture

- Engine: Custom vanilla JavaScript ES modules (0 external runtime dependencies)
- Bundler: Vite 5
- Audio: Web Audio API procedural chiptune synthesizer
- Storage: Zero-PII offline local persistence (localStorage)
- Hosting: Cloudflare Pages with edge global CDN distribution
- CI/CD: GitHub Actions automated lint, typecheck, unit tests, and build pipeline

---

## Development and Testing

Install dependencies:
```bash
npm install
```

Start local development server:
```bash
npm run dev
```

Build production bundle:
```bash
npm run build
```

Run unit test suite:
```bash
npm test
```

Run headless browser end-to-end verification:
```bash
npm run test:e2e
```

Deploy to Cloudflare Pages:
```bash
npm run deploy
```
