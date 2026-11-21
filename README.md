# संख्या स्ट्राइक (Sankhya Strike)
### The Last-Mile Tutor | Problem Statement 3: Education

> **An ed-tech 3D learning world and adaptive regional-language AI tutor built for underprivileged students on basic shared phones with low data connectivity.**

---

## 🎯 The Problem & Our Mission
Millions of students across India and developing regions study in regional-language government schools with severe teacher shortages, no access to expensive private tutoring, and sporadic internet connectivity. Mainstream ed-tech products are heavily skewed toward English, rely on high-bandwidth video streams, assume personal high-end smartphones, and require parental guidance.

**Sankhya Strike (संख्या स्ट्राइक)** is purpose-built to break this barrier:
- **One Regional Language End-to-End**: Fully immersed in Hindi (हिंदी) with instant bilingual toggle (English). All questions, options, hints, explanations, voice prompts, and teacher reports are native to the learner.
- **Real State-Board Syllabus**: Designed around Class 8 (and Grades 1–8) State Board / NCERT Mathematics and Science curricula (e.g. Ratio and Percentage, Algebraic Expressions, Mensuration, Linear Equations, Force and Pressure, Acids and Bases, Light, Cell Structure).
- **Adaptive AI Tutor (गुरु)**: Breaks down doubts into conversational, jargon-free local language, delivers step-by-step hints, analyzes learner misconceptions, and adapts future practice.
- **Designed for Poor Conditions**:
  - **Zero Heavy Assets**: 100% procedural low-poly 3D world (Three.js) and synthetic Web Audio chimes without external media downloads.
  - **100% Offline-First**: All progress automatically persists in guarded local storage; zero data loss when connectivity drops.
  - **Voice & Photo Doubt Assistance**: Voice read-aloud (TTS) for low-literacy learners, speech-to-text voice doubt input, and simulated textbook photo problem scanning for students who struggle to type in regional scripts.
- **Tri-Perspective Progress Views**:
  - 🎒 **शिक्षार्थी (Learner)**: Badges, stars, mastery percentages, and revision focus areas.
  - 👨‍👩‍👧 **अभिभावक (Parent)**: Non-technical summary with one-click **"आवाज़ में सुनें" (Spoken Voiceover)** in Hindi so parents with limited education can understand their child's daily growth.
  - 👩‍🏫 **शिक्षक / स्वयंसेवक (Teacher / Volunteer)**: State-board competency checklist, diagnostic error analysis, and 1-click WhatsApp/SMS text report generator with zero data cost.

---

## 🕹️ Controls & Navigation

| Action | Desktop Keyboard | Mobile / Touch |
| :--- | :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` / Arrows | Left Touch Joystick |
| **Look Around** | Mouse | Right Touch Swipe |
| **Interact (Stone/Board)** | `E` key | On-Screen **(E)** Action Button |
| **Progress Panel** | `P` key | Top HUD **[📊 प्रगति]** Button |
| **Language Toggle** | Top HUD Button | Top HUD **[🌐 English/हिंदी]** Button |
| **Grade Selector** | Top HUD Badge | Top HUD **[🏫 कक्षा 8]** Badge |

---

## 🏗️ Architecture

```
sankhya-strike/
├── src/
│   ├── content/          # Grade 1-8 NCERT / State Board curriculum & Hub Board
│   │   ├── grade-1.js .. grade-8.js
│   │   ├── board.js      # Hub Learning Board text
│   │   └── index.js      # Curriculum helpers & progress keys
│   ├── engine/           # Lightweight Three.js engine & input handling
│   │   ├── controller.js # First-person island controller & collision
│   │   ├── renderer.js   # Adaptive dynamic resolution renderer
│   │   ├── input.js      # Keyboard, mouse pointer-lock, and dual touch joysticks
│   │   └── events.js     # Event bus
│   ├── world/            # Procedural low-poly 3D islands & glowing knowledge stones
│   │   ├── world.js      # Hub Island, Ganit Dweep (Maths), Vigyan Vatika (Science)
│   │   ├── props.js      # Procedural trees, crystals, bridges, and stones
│   │   └── zones.js      # Zone palettes and identities
│   ├── i18n/             # Complete bilingual localization
│   │   ├── hi.js         # Hindi strings (primary)
│   │   ├── en.js         # English strings
│   │   └── index.js      # Translation helpers & storage
│   ├── ui/               # Modular accessible user interface
│   │   ├── quiz.js       # Quiz modal with AI tutor, hints, voice & photo doubts
│   │   ├── progress.js   # Learner, Parent (voice summary), Teacher (WhatsApp share)
│   │   ├── board-modal.js# Learning board modal (गुरु पटल)
│   │   ├── hud.js        # Minimalist responsive game HUD
│   │   ├── audio.js      # Web Audio synthesizers + Web Speech TTS / STT
│   │   └── styles.css    # High-contrast, mobile-first responsive CSS
│   ├── save.js           # Guarded offline persistence (localStorage)
│   └── main.js           # Application entry point & modal wiring
├── public/               # Web manifest & caching headers
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
The optimized static bundle is output to `dist/` ready for offline PWA hosting or edge deployment.

---

## 🔒 Guardrails & Privacy
- **Zero Personal Data**: We do not collect names, phone numbers, or emails of minor students.
- **Safe Learner Profiles**: Progress is tied to anonymous device storage.
- **Open Curriculum**: Based on publicly accessible state board competencies without infringing on textbook copyrights.
