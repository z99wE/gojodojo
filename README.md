# Sankhya Turbo: 8-Bit Grand Prix (संख्या टर्बो)

An authentic 8-bit retro arcade drag racing and Grand Prix STEM motorsport game for Grades 1 through 8 in Hindi and English. Inspired by classic 8-bit racers like 8bit-peter/Racing-Game.

Live on Cloudflare: https://sankhya-strike.pages.dev

GitHub Repository: https://github.com/z99wE/sankhya-strike

---

## Game Overview & New Physics Laws

Sankhya Turbo combines authentic arcade vehicle kinematics, comprehensive STEM education (Physics, Chemistry, Biology, Mathematics), and neuroscience-backed test anxiety regulation:

- Real Vehicle Kinematics & Continuous Lateral Steering:
  - Free lateral maneuvering across the entire asphalt track and grass shoulders.
  - Manual Throttle (Gas) and Active Braking (Brake) controls with illuminated rear brake lights.
  - Off-road surface friction: driving off the asphalt onto the grass/dirt shoulder increases rolling resistance, caps vehicle speed at 40 km/h, rumbles the chassis, and kicks up grass/dirt particles.
- Physical Collisions & Consequential Damage:
  - Rival vehicle impacts: Overlapping with rival cars triggers physical bounce rebounds, metal crunch sound effects, spark cascades, screen shake, and -15% shield loss.
  - Roadside barrier and guardrail crashes: Hitting track barriers at high lateral speed causes high-intensity screen shake, crash sparks, heavy deceleration, and -20% shield damage.
  - Track hazards (Oil slicks): Causes immediate lateral skids with tire squeals, speed drops, and shield damage.
- Integrated Exam Anxiety & Composure Management:
  - Physiological Pulse BPM Gauge (70 - 170 BPM): Tracks student stress levels under high speed, rival proximity, low shield, and checkpoint timers.
  - Auditory and visual anxiety cues: Rhythmic procedural heartbeat pulse (lub-dub) and soft red vignette border when pulse exceeds 125 BPM.
  - Pranayama Zen Breath Mechanic (B key / Zen touch button): Deep vagus nerve reset that slows simulation time by 50% (bullet-time calm focus for 3.5 seconds), drops pulse back to resting 72 BPM, steadies handling, and awards +300 Calm Clarity points.
- Study Angle & Custom Topic Selector:
  - "What do you want to study today?" (आज आप क्या सीखना चाहते हैं?): Students can select grade curriculum topics OR type/speak any custom chapter (e.g. "Newton's laws of motion", "Friction", "Photosynthesis", "Fractions", "Acids and Bases").
  - The AI engine dynamically structures customized checkpoint quizzes around the chosen topic.
- Crystal-Clear Devanagari & Latin Typography:
  - Native Devanagari complex script rendering using Mukta and Noto Sans Devanagari at 16px - 18px font size with high-contrast text and full line heights, eliminating illegible pixel-font clipping.
- Speech Recognition Voice Input:
  - Working SpeechRecognition supporting Hindi (hi-IN) and English (en-IN).
  - Speak custom study topics into the microphone or answer quiz options by speaking "one", "two", "three", "four", "ek", "do", "teen", "char", "A", "B", "C", "D".
- Bundled Screen Reader TTS:
  - Clean Web Speech Synthesis helper reading questions, hints, and explanations on demand.
- In-Browser AI STEM Pit Crew (Guru Bot):
  - Accessible via T key or Tutor button.
  - Answers any student doubt with intuitive real-life analogies, formulas, and cognitive anxiety reframing tips.

---

## Controls

### Desktop Keyboard
- Accelerate / Throttle: W key or UP ARROW
- Active Brake: S key or DOWN ARROW
- Steer Left / Right: A / D keys or LEFT / RIGHT ARROWS
- Shift Up: SPACEBAR (Target the green zone on the tachometer)
- Shift Down: X key or SHIFT
- Activate Nitro: N key
- Pranayama Zen Breath: B key (Bullet-time calm focus)
- AI STEM Tutor / Doubt Solver: T key
- Answer STEM Checkpoints: Keys 1, 2, 3, 4 (or Speak into microphone)

### Mobile Touch Controls
- Dedicated on-screen arcade buttons for STEER L, STEER R, GAS [W], BRAKE [S], SHIFT [SPACE], NITRO [N], ZEN [B], and TUTOR [T].

---

## Tech Stack & Architecture

- Engine: Custom vanilla JavaScript ES modules (0 external runtime dependencies)
- Bundler: Vite 5
- Audio: Web Audio API procedural chiptune & heartbeat synthesizer
- Speech: Web Speech Recognition & SpeechSynthesis APIs
- Storage: Zero-PII offline local persistence (localStorage)
- Hosting: Cloudflare Pages with edge global CDN distribution
- CI/CD: GitHub Actions automated lint, typecheck, unit tests, and build pipeline
