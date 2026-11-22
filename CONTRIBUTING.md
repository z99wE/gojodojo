# Contributing Guidelines for GojoDojo

Thank you for your interest in contributing to **GojoDojo** by **Codebenders**. We welcome contributions that expand educational equity and STEM literacy for underprivileged students learning in regional languages.

---

## 1. Development Workflow

```bash
# 1. Clone the repository
git clone https://github.com/z99wE/gojodojo.git
cd gojodojo

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev

# 4. Run static syntax hygiene
npm run lint

# 5. Run automated unit test suite
npm test

# 6. Run headless Chrome browser CDP e2e test
npm run test:e2e

# 7. Compile production bundle
npm run build
```

---

## 2. Engineering & Design Contracts

- **Visual Architecture**: Pure 8-bit retro arcade rasterizer on HTML5 2D Canvas combined with CRED NeoPOP elevated plinth UI tokens.
- **Strict Visual Discipline**: **Strictly 0 icons and 0 emojis** anywhere in the code, UI, or documentation.
- **Zero External Network Dependencies**: All sound is synthesized procedurally in Web Audio API (square/noise oscillators, zero external MP3s); all visuals are rendered programmatically (zero external PNG/SVG downloads).
- **Legible Regional Typography**: High-contrast Mukta and Noto Sans Devanagari font families for Hindi and Share Tech Mono for telemetry.
- **Security & Minor Protection**: Sanitize all dynamic DOM injections using `sanitizeHtml` to eliminate XSS.
- **Zero PII & Offline Resilience**: Student progress, lives, and telemetry persist purely in local device storage (`localStorage`) without collecting names, phone numbers, or emails.
- **Offline PWA Playability**: All new assets or routes must be registered with `/sw.js` for 100% offline gameplay.

---

## 3. Pull Request Guidelines

1. Ensure all unit tests (`npm test`) and e2e browser checks (`npm run test:e2e`) pass with zero errors.
2. Maintain high test coverage for any new physics, scoring, or curriculum modules.
3. Write clear, imperative commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
