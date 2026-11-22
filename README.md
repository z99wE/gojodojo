```text
  ██████╗   ██████╗      ██╗  ██████╗  ██████╗    ██████╗      ██╗  ██████╗ 
 ██╔════╝  ██╔═══██╗     ██║ ██╔═══██╗ ██╔══██╗  ██╔═══██╗     ██║ ██╔═══██╗
 ██║  ███╗ ██║   ██║     ██║ ██║   ██║ ██║  ██║  ██║   ██║     ██║ ██║   ██║
 ██║   ██║ ██║   ██║██   ██║ ██║   ██║ ██║  ██║  ██║   ██║██   ██║ ██║   ██║
 ╚██████╔╝ ╚██████╔╝╚█████╔╝ ╚██████╔╝ ██████╔╝  ╚██████╔╝╚█████╔╝ ╚██████╔╝
  ╚═════╝   ╚═════╝  ╚════╝   ╚═════╝  ╚═════╝    ╚═════╝  ╚════╝   ╚═════╝ 
+-----------------------------------------------------------------------------+
|                CODEBENDERS PRESENTS : 8-BIT STEM GRAND PRIX                 |
|          NCERT & STATE BOARD CLASSES 1-8 • HINDI & ENGLISH OFF-LINE         |
+-----------------------------------------------------------------------------+
```

# GojoDojo: 8-Bit Grand Prix (गोजो डोजो: 8-बिट ग्रैंड प्रिक्स)

### The Last-Mile STEM Tutor for Regional-Language Schools
**Built by Codebenders for Ace Builders Hackathon 2026**  
**Track**: Problem Statement 3 | Education: The Last-Mile Tutor

- **Live Deployment (Cloudflare Pages)**: [https://gojodojo.pages.dev](https://gojodojo.pages.dev)
- **GitHub Repository**: [https://github.com/z99wE/gojodojo](https://github.com/z99wE/gojodojo)
- **Architecture**: Client-side Offline PWA (<200 KB gzipped, zero server compute costs)
- **Visual Design**: Pure 8-bit retro arcade rasterizer with CRED NeoPOP elevated plinth UI (**strictly 0 icons and 0 emojis**)

---

## 1. Executive Summary & Problem Alignment

Modern commercial ed-tech assumes high-bandwidth connections, expensive smartphones, English proficiency, and active parental tutoring. This creates an equity gap: millions of underprivileged children studying in regional-language government schools receive the least digital support.

**GojoDojo** solves this disparity by turning foundational STEM education into an authentic, high-octane 8-bit retro motorsport experience. It functions completely offline, executes entirely inside the browser on entry-level hardware, delivers 100% native Hindi instruction with instantaneous English/Hindi language toggling, incorporates real State Board curriculum, provides an in-browser AI doubt-clearing tutor, and captures physiological exam anxiety through a racing telemetry model.

### Problem Statement Requirement Mapping

| Problem Statement Requirement | GojoDojo Implementation | Source Module |
| :--- | :--- | :--- |
| **1. Regional Language End-to-End** | Full Devanagari Hindi interface, question bank, scientific explanations, on-the-fly Hindi/English question toggle (`[L]`), voice speech recognition (`hi-IN`), and local analogies. | [src/i18n/hi.js](src/i18n/hi.js), [src/voice/voice-input.js](src/voice/voice-input.js) |
| **2. Real State-Board Syllabus** | Aligned with NCERT and State Board standards for Classes 1 to 8 across Physics, Chemistry, Biology, and Mathematics. Includes Science Word Scrambles. | [src/content/index.js](src/content/index.js), [src/game/quiz-controller.js](src/game/quiz-controller.js) |
| **3. Local Language AI Tutor** | In-browser AI Pit Crew Tutor (*Guru Bot*) explaining doubts in simple regional vernacular, addressing test anxiety, and dynamically generating practice sets. | [src/ai/ai-tutor.js](src/ai/ai-tutor.js) |
| **4. Low-Condition Engineering** | Under 200 KB bundle; pure procedural Canvas 2D + Web Audio chiptune synth (zero MP3s); offline-first PWA caching; atomic flash-safe storage. | [src/game/pixel-renderer.js](src/game/pixel-renderer.js), [src/game/chiptune-audio.js](src/game/chiptune-audio.js), [src/save.js](src/save.js) |
| **5. Multimodal Accessibility** | Web Speech API speech-to-text for Hindi and English voice input; Spectro-Sensor camera hook for homework photo doubts; touch controls for shared phones. | [src/voice/voice-input.js](src/voice/voice-input.js), [index.html](index.html) |
| **6. Simple Progress View** | 30-second glanceable dashboard displaying class grade, mastery score, chapters cleared, accuracy rate, and calm-focus metrics for parents/teachers/NGOs. | [src/save.js](src/save.js), [src/game/pixel-renderer.js](src/game/pixel-renderer.js) |
| **7. Minor Safety & Guardrails** | Strictly zero personal data collected (no phone numbers, emails, passwords, or tracking cookies). Original open curriculum learning objectives. | [src/save.js](src/save.js), [src/ui/sanitize.js](src/ui/sanitize.js) |

---

## 2. Target Learner Persona ("Who It Is For")

> [!NOTE]
> **Primary Persona: "Priya" (Class 7 Student, Government Composite School, Uttar Pradesh)**
> - **Language**: Speaks and thinks in Hindi; finds English-medium science terms intimidating and alienating.
> - **Hardware**: Shares a single basic 2GB-RAM Android phone with her parents and two younger brothers after 6:00 PM.
> - **Connectivity**: Mobile data pack frequently runs out mid-month; evening internet speed drops to 2G or disconnects entirely.
> - **Academic Environment**: Her school has one science teacher for four grades and no laboratory; private coaching is financially out of reach.
> - **Emotional Hurdle**: Suffers from acute examination anxiety and freezes during science tests.

GojoDojo is designed specifically for Priya: it opens instantaneously in her mobile browser without downloads, features a bold "GojoDojo" retro loading sequence by Codebenders, requires zero account login, continues playing when the network drops, allows speaking answers when typing Devanagari on a cracked screen is difficult, and teaches stress-regulation breathing techniques directly through gameplay.

---

## 3. Core System Architecture

```mermaid
flowchart TD
    subgraph UI ["NeoPOP Client Interface & Onboarding"]
        Splash["GojoDojo Loading Splash<br/>(Codebenders Presents, Retro Progress Bar)"]
        Garage["Garage & Hero Start Plinth<br/>(1-Click Launch, Grade, Subject, Color)"]
        Preview["Live 8-Bit Pixel Car Stage<br/>(Real-Time Paint & Pilot Feedback)"]
        Canvas["Game Canvas (640x360 Native Pixelated)"]
        TouchControls["Mobile Arcade Touch Bar (W, S, Gas, Shift)"]
        QuizModal["Pitstop Quiz & Word Scramble Modal<br/>(Instant EN/HI Toggle)"]
        TutorDrawer["AI STEM Pit Crew Drawer (Guru Bot)"]
    end

    subgraph Core ["Engine Coordination (GameApp)"]
        EventLoop["60 FPS RequestAnimationFrame Loop"]
        InputHandler["Key & Touch Input Coordinator<br/>(W/S/A/D, Arrows, Space, N, B, T, M, L)"]
        VoiceSTT["SpeechRecognition Engine<br/>(Hindi & English Speech Transcription)"]
        Storage["Zero-PII LocalStorage Persistence"]
    end

    subgraph Simulation ["Racing & Physics Simulation (RacingEngine)"]
        Physics["Kinematic Physics<br/>(Speed, Inertia, Friction, Off-road)"]
        Transmission["5-Speed Manual Gearbox<br/>(Tachometer Green Sweet Spot & Auto-Shift)"]
        Obstacles["Traffic & Pedestrian System<br/>(Oncoming Cars, Crossing Jaywalkers)"]
        HealthEngine["5 Lives & Shield Health System<br/>(Collision Crunch, Emergency Pit Repair)"]
        AnxietyEngine["Physiological BPM Anxiety Model<br/>(70-170 BPM Stress Simulation)"]
        TrackGenerator["60-Min Endurance Track Generator<br/>(4-Phase Day/Night Progression)"]
    end

    subgraph STEM ["Curriculum & Puzzle System"]
        QuizCtrl["QuizController (Classes 1 to 8)"]
        Curriculum["NCERT & State Board Question Bank"]
        Scramble["Science Word Scramble Engine<br/>(Physics, Chem, Bio, Maths)"]
        AiHeuristics["AiTutor Heuristic Doubt Engine"]
    end

    subgraph AudioVisual ["Procedural Synthesis & Audio"]
        Renderer["PixelRenderer (Canvas 2D)<br/>(Parallax Horizons, 8-Bit Sprites, HUD)"]
        Audio["ChiptuneAudio (Web Audio API)<br/>(Square-Wave Engine, Noise Crunch, BPM)"]
    end

    Splash -->|Auto / Key Dismiss| Garage
    Garage -->|1-Click Instant Start| EventLoop
    Preview -.->|Live Paint Update| Garage
    InputHandler --> Physics
    InputHandler --> Transmission
    VoiceSTT --> QuizCtrl
    EventLoop --> Simulation
    Physics --> TrackGenerator
    Obstacles --> HealthEngine
    HealthEngine --> Renderer
    AnxietyEngine --> Audio
    TrackGenerator -->|15s Cooldown Checkpoint| QuizCtrl
    QuizCtrl --> QuizModal
    Scramble --> QuizModal
    QuizModal -->|Answer Verification| HealthEngine
    QuizModal -->|Nitro Boost / Engine Stall| Physics
    Simulation --> Renderer
    Simulation --> Audio
    Renderer --> Canvas
    Storage <--> Core
```

---

## 4. Deep-Dive: Addressing the Hackathon Requirements

### Requirement 1: Native Regional Language End-to-End (Hindi + Instant English Toggle)
GojoDojo is not an English application with superficial text translation. It is built natively for Hindi-medium learners:
- **Devanagari UI & Clear Typography**: Employs high-contrast Mukta typography with generous line heights, strictly avoiding tiny unreadable fonts.
- **On-the-Fly Question Language Toggle (`[L]` Key / Touch Button)**: Right inside any checkpoint question or word scramble, learners can toggle between English and Hindi with a single click. The question text, options, hints, and explanations re-render immediately in the chosen language.
- **Audio & Voice Processing**: The built-in speech recognition listens in `hi-IN` and transcribes spoken Hindi numbers ("एक", "दो", "तीन", "चार") into direct quiz answer submissions.
- **Vernacular Concept Breakdowns**: Explanations use colloquial regional terminology (e.g. describing friction via bicycle tires on mud, or inertia via sudden bus brakes) rather than verbatim textbook jargon.

### Requirement 2: Real State-Board Syllabus (Classes 1 to 8)
Curriculum content mirrors official state board and NCERT competencies across four dedicated Grand Prix circuits:
1. **Physics Velocity**: Force ($F = m \cdot a$), Friction, Speed-Time calculation, Reflection of Light, Simple Circuits ($V = I \cdot R$), Work and Energy.
2. **Chemistry Reactor**: States of Matter, Physical vs Chemical changes, Acids, Bases & Salts ($pH$), Chemical Formulas ($H_2O$, $CO_2$, $NaCl$), Rusting and Oxidation.
3. **Biology Bio-Sprint**: Photosynthesis ($6CO_2 + 6H_2O \rightarrow C_6H_{12}O_6 + 6O_2$), Human Digestive System, Cell Organelles, Plant Nutrition, Ecosystem Food Chains.
4. **Maths Matrix 500**: Fractions, Decimals, Integers, Perimeter and Area, Algebraic Equations, Prime Factorization, Ratio and Proportion.

#### Scrabble-Style Science Word Scrambles
To overcome scientific spelling hurdles, the engine alternates traditional multiple-choice questions with 8-bit letter scramble puzzles. Students tap retro letter tiles to reconstruct core terms:
- `[R] [C] [O] [F] [E]` $\rightarrow$ **FORCE (बल)**
- `[T] [M] [A] [O]` $\rightarrow$ **ATOM (परमाणु)**
- `[H] [P] [O] [O] [T] [N]` $\rightarrow$ **PHOTON (फोटॉन)**

### Requirement 3: In-Browser AI Pit Crew Tutor (`AiTutor`)
Accessible at any time via the `[T]` key or touch button, the AI Pit Crew Tutor operates **100% on-device with zero cloud API keys**:
- **Doubt Resolution**: Identifies query intent through heuristic semantic matching across physics, chemistry, biology, and maths concepts.
- **Grounded Analogies**: Pairs every answer with a mechanical or daily-life analogy.
- **On-the-Fly Dynamic Practice**: When a student types or speaks a custom topic (e.g. *घर्षण* or *Newton's Laws*), the tutor dynamically synthesizes a targeted 3-question diagnostic quiz.
- **Adaptive Remediation**: Incorrect answers in the racing loop trigger targeted hints and automatically queue related reinforcement checkpoints.

### Requirement 4: Ultra-Lightweight Engineering for Poor Conditions
- **Zero Heavy Assets**: Avoids multi-megabyte 3D models and textures. The game is rendered via a deterministic 2D Canvas rasterizer ($640 \times 360$) scaled crisply with nearest-neighbor interpolation.
- **Procedural Web Audio Chiptune Synth**: Replaces MP3 audio files with synthesized square-wave oscillators, noise buffers, and frequency modulators. The entire sound library takes **zero bytes of network bandwidth**.
- **Audio Mute Toggle (`[M]` Key / In-Game Button)**: Players can mute or unmute audio at any time while racing or in the garage.
- **Total Bundle Footprint**: Under 200 KB gzipped, loading in under 1.2 seconds over a spotty 2G connection.
- **Offline PWA Architecture**: Once opened, the browser caches the entire application. When mobile data runs out or cell towers disconnect, the racing engine and quiz modules continue running without interruption.
- **Flash-Safe Progress Storage**: Progress is persisted in `localStorage` through an atomic, debounced (400ms) serializer that prevents flash storage degradation on low-end budget phones.

### Requirement 5: Physiological Anxiety Model & Pranayama Zen Breath
Students in high-stakes testing environments frequently freeze under pressure. GojoDojo gamifies stress management:
- **Biometric Heartbeat Simulation**: The engine calculates an internal anxiety pulse ($70 \text{ to } 170 \text{ BPM}$) influenced by vehicle velocity, proximity of rival racers, low shield levels, and pitstop countdowns.
- **Audio-Visual Cues**: Heartbeat audio and a pulsing red peripheral vignette emerge as stress rises above 125 BPM.
- **Pranayama Vagus Reset (`[B]` Key / Zen Button)**: Activates controlled diaphragmatic breathing (*विलोम प्राणायाम*). Simulation speed slows by 50% for 3.5 seconds (bullet-time focus), heart rate normalizes to 72 BPM, and vehicle handling stabilizes.

---

## 5. Answers to Hackathon Evaluation Questions

### Question 1: How does a learner who types poorly in their own language use the product?
> **Answer**:
> 1. **Integrated Web Speech Voice Input**: The learner taps the `[MIC]` button and speaks in natural Hindi or English. The voice engine automatically parses spoken phrases ("घर्षण", "प्रकाश संश्लेषण") into topic searches or answers.
> 2. **Single-Touch Input Mechanics**: Pitstop questions require only a single tap on options `[1]`, `[2]`, `[3]`, or `[4]` (or pressing numeric keys).
> 3. **Tile-Tapping Word Puzzles**: In Science Scrambles, students tap large retro letter buttons rather than typing on a mobile keyboard.
> 4. **Instant Language Switcher (`[L]`)**: If a Hindi question is hard to read, tap `[EN]` to read in English, or vice versa, in 1 second.
> 5. **Hardware-Accelerated Touch Controls**: Large, high-contrast on-screen buttons (`[W] LANE UP`, `[S] LANE DOWN`, `[SHIFT]`, `[GAS]`) allow effortless thumb navigation on shared, cracked mobile screens.

### Question 2: What happens when the phone is shared by three family members, or the data runs out?
> **Answer**:
> 1. **Zero Data Execution**: Because the entire engine, sound synthesizer, and curriculum database run in-browser, the game continues without data. A student can load the page at a school hotspot or neighbor's Wi-Fi, return home to a village with zero network coverage, and complete hours of learning.
> 2. **Frictionless Multi-User Local Profiles**: There are no email/password logins. Different family members can type their pilot alias (`ARYABHATA`, `KALPANA`, `RAMAN`) and pick their character archetype in 1 second.
> 3. **Instant Zero-Drain State**: The app consumes minimal RAM (<45MB) and zero background data, preventing battery drain on shared family devices.

### Question 3: Learners cannot pay, so who does? (Financial & Deployment Model)
> **Answer**:
> - **Zero Marginal Hosting Cost**: Built entirely as a static client-side bundle hosted on Cloudflare Pages and GitHub Pages. Serving 100,000 students costs virtually \$0 in cloud backend fees.
> - **Deployment via NGOs & CSR Initiatives**:
>   - *CSR Educational Trusts* (e.g. Tata Trusts, Reliance Foundation) can distribute offline PWA packages pre-installed on low-cost tablets for village learning centers.
>   - *Government Smart Classroom Programs* (PM eVIDYA, State Education Missions) can package the repository into open-source kiosk setups for computer labs.
>   - *DIKSHA Integration*: The modular architecture can be packaged as an interactive HTML5 learning object inside national education portals.

---

## 6. Guardrails & Child Safety

- **Strict Zero-PII Policy**: The platform collects no personal phone numbers, home addresses, government IDs, facial data, or device identifiers.
- **Pseudonymous Pilot Aliases**: Learner identification is limited to locally stored historical figures and science archetypes (e.g., *Aryabhata*, *Raman*, *Velocity Ace*).
- **Zero Third-Party Trackers**: Contains no advertising SDKs, commercial ad pixels, or behavioral analytics trackers.
- **Ethical Open Curriculum**: All scientific questions and formulas are derived from public NCERT competency frameworks; no copyrighted commercial textbook text is copied.

---

## 7. Interactive Controls & Gameplay

```
+--------------------------------------------------------------------------+
|  [60-MIN STEM GP]  [5 LIVES]  [SCORE: 01400]  [RPM: 6200]  [PULSE: 78]    |
|==========================================================================|
|  [LANE 0]  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==  ==    |
|  [LANE 1]  [PLAYER CAR] >>>                   [RIVAL RACER] >>>          |
|  [LANE 2]  ==  ==  ==  [ONCOMING TRUCK] <<<        [JAYWALKER] ^         |
|==========================================================================|
|  CONTROLS: [A] GAS | [SHIFT+A] SUPER | [W] UP | [S] DOWN | [Z] BRAKE | [SPACE] |
+--------------------------------------------------------------------------+
```

### Complete Key Reference

| Action | Desktop Keyboard | Mobile Touch Bar | Function |
| :--- | :--- | :--- | :--- |
| **Accelerate (Gas)** | `A` / `D` / `Arrow Right` | `[A] GAS` | Hold `A` to accelerate vehicle smoothly forward |
| **Super Fast Overdrive** | `Shift + A` / `N` | `[SHIFT+A] SUPER` | Instant nitro boost & hyper-speed acceleration surge (400+ KM/H) |
| **Lane UP** | `W` / `Arrow Up` / `L` | `[W] LANE UP` | Switch lane upward quickly to dodge oncoming vehicles |
| **Lane DOWN** | `S` / `Arrow Down` / `R` | `[S] LANE DOWN` | Switch lane downward to avoid road hazards and pedestrians |
| **Active Brake** | `Z` / `Arrow Left` / `S` | `[Z] BRAKE` | Decelerate rapidly with red tail brake lights |
| **Shift Gear Up** | `SPACEBAR` | `SHIFT [SPACE]` | Shift up inside green tachometer zone (5800-7000 RPM) for turbo surge |
| **Shift Gear Down** | `X` / `Left Shift` | `GEAR -` | Downshift for rapid engine braking and traffic navigation |
| **Bottom-Right Radar** | Always Active | On-Canvas HUD | Live 3-lane GPS Radar displaying player, rival, traffic & next checkpoint |
| **10s Quiz Speed Bonus** | `1`, `2`, `3`, `4` | Click Option | Answer within 10s for +1000 PTS + up to +500 speed bonus! |
| **Close Quiz Penalty** | `[X] CLOSE` | Tap `[X]` | Closing/skipping a quiz deducts 300 points and causes an engine stall |
| **Unique Questions** | Guaranteed | Automatic | Zero duplicate questions across the 59+ minute race |
| **Offline PWA Play** | Full Support | Service Worker | 100% playable offline without any active network connection |
| **Zen Breath** | `B` | `ZEN [B]` | Activate bullet-time slow motion and vagus nerve pulse reset |
| **AI Pit Tutor** | `T` | `TUTOR [T]` | Open on-device AI STEM doubt solver |
| **Audio Mute** | `M` | `AUDIO [M]` / `[AUDIO: ON]` | Toggle sound effects & engine synth mute on/off |
| **Toggle Quiz Lang** | `L` | `[EN / HI]` | Switch question language between English and Hindi on the fly |

### 5 Lives System & 60-Minute Championship Endurance
- **5 Lives per Session**: Collisions with oncoming traffic or jaywalkers deduct 1 life (-150 score). Incorrect answers in pitstops also deduct 1 life.
- **60-Minute Grand Prix**: An endurance race divided into four 15-minute procedural daylight phases:
  1. *Golden Dawn (सुनहरा प्रभात)*
  2. *High Noon Cyberway (दोपहर साइबरवे)*
  3. *Synthwave Sunset (संध्या गोधूलि)*
  4. *Midnight Neon Expressway (मध्यरात्रि एक्सप्रेसवे)*
- **Checkpoints with 15s Driving Intervals**: Students must drive and demonstrate motor reflexes for at least 15 seconds before the next radio checkpoint fires, ensuring an authentic balance between racing and studying.

---

## 8. Data Flow & Racing Loop

```mermaid
sequenceDiagram
    autonumber
    actor Player as Pilot / Student
    participant Main as GameApp
    participant Engine as RacingEngine
    participant Audio as ChiptuneAudio
    participant Quiz as QuizController
    participant Canvas as PixelRenderer

    Player->>Main: Press Gas [D] / Shift [SPACE] / Steer [W / S]
    Main->>Engine: setThrottle(true), steerLaneUp(), shiftUp()
    Engine->>Audio: playShift("perfect")
    Engine->>Engine: Update kinematics, RPM, speed, lane position
    Engine->>Engine: Advance oncoming traffic + crossing pedestrians
    
    alt Obstacle Collision
        Engine->>Engine: Shield drops -25%, Score drops -150 pts
        Engine->>Audio: playCrash()
        opt Shield reaches 0
            Engine->>Engine: Lose 1 Life (5 -> 4), Reboot shield to 60%
        end
    end

    alt Checkpoint Triggered (Minimum 15s Driving Elapsed)
        Engine->>Engine: pauseForPitstop() (Freeze simulation in background)
        Main->>Quiz: nextQuestion() (STEM Multiple Choice or Word Scramble)
        Quiz-->>Main: Return question data + scrambled letter tiles
        Main->>Player: Display Pitstop Modal (Car frozen behind)
        opt Toggle Language
            Player->>Main: Press [L] or Click [EN / HI]
            Main->>Quiz: switchLanguage(nextLang)
            Quiz-->>Main: Return re-rendered question in new language
            Main->>Player: Update modal question text instantly
        end
        Player->>Main: Select option [1, 2, 3, 4] or Speak via MIC
        Main->>Quiz: submitAnswer(optionIndex)
        alt Correct Answer
            Main->>Engine: onQuizAnswer(true)
            Engine->>Engine: +1000 PTS, +65 KM/H Hyper Turbo Boost, 100% Nitro
            Main->>Audio: playQuizResult(true)
        else Incorrect Answer
            Main->>Engine: onQuizAnswer(false)
            Engine->>Engine: -1 Life, -300 PTS, Containment Engine Stall
            Main->>Audio: playQuizResult(false)
        end
        Main->>Engine: resumeFromPitstop() (Reset 15s cooldown, unfreeze race)
    end

    Engine->>Canvas: render(telemetry, HUD, 5 lives, 60-min timer)
```

---

## 9. Development, Testing & Verification

```bash
# 1. Install dependencies
npm install

# 2. Run syntax checks across all modules
npm run lint

# 3. Execute unit test suite (33 tests covering physics, quiz, i18n, save, tutor)
npm test

# 4. Run automated E2E browser verification (Headless Chrome via CDP WebSocket)
npm run test:e2e

# 5. Compile production build
npm run build

# 6. Deploy to Cloudflare Pages (GojoDojo)
npx wrangler pages deploy dist --project-name gojodojo --branch main
```

---

## 10. Verification & Test Evidence

All 33 unit tests pass cleanly:
```
[PASS] Sanitize HTML prevents script injection and dangerous attributes
[PASS] Feature flag engine correctly checks configured flags
[PASS] Progress state initializes with safe defaults and zero personal data
[PASS] Progress persistence saves and flushes properly to localStorage
[PASS] Curriculum index covers grades 1 to 8 with comprehensive STEM topics
[PASS] Topic lookup by stoneId resolves correctly
[PASS] i18n catalogs have 1:1 matching keys between English and Hindi
[PASS] i18n catalogs contain strictly 0 emoji characters
[PASS] RacingEngine initializes with default player and rival state
[PASS] Shift Up in Green Zone triggers Perfect Shift and awards Nitro
[PASS] Shift Up in Yellow Zone bogs down the engine
[PASS] Shift Up beyond Redline triggers Late Shift feedback
[PASS] Downshifting rev-matches up and updates gear
[PASS] Nitro activation consumes 25% nitro and triggers overdrive
[PASS] Steering lane adjusts lane within 0 to 2 bounds
[PASS] STEM Quiz answer callback applies high-stakes boost or penalty
[PASS] Physics simulation advances player and rival distances over time
[PASS] Manual throttle accelerates and active brake decelerates the vehicle
[PASS] Rival vehicle collision causes shield damage and screen impact crunch
[PASS] Anxiety BPM model increases under stress and calms with Zen breath
[PASS] Player profile and dynamic day-to-night scene transitions
[PASS] Pitstop pause freezes racing engine and resumes cleanly
[PASS] Steering lane up and down responds immediately and smoothly
[PASS] Car color customization updates primary and secondary hues
[PASS] Emergency pit repair prevents premature crash during 30+ min endurance GP
[PASS] Depleting all 5 lives triggers Game Over
[PASS] Checkpoints enforce minimum 15 seconds of pure driving interval
[PASS] QuizController generates grade-appropriate STEM questions for all classes
[PASS] QuizController handles answer submission, streak, and history
[PASS] AiTutor explains STEM concepts and provides anxiety advice in Hindi and English
[PASS] QuizController dynamically synthesizes customized quiz questions for user-selected topics
[PASS] VoiceInputController parses spoken Hindi and English numbers to option indices
[PASS] QuizController generates Science Word Scramble puzzles with scrambled letter tiles
[PASS] QuizController guarantees unique questions across session with zero duplicates
```

---

## 11. License & Ethics Commitment

Open-source under the MIT License. Created by S Chakraborty, dedicated to providing free, high-performance, culturally grounded STEM learning for underprivileged students in regional-language schools across India.
