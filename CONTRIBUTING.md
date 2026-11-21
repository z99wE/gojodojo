# Contributing Guidelines

Thank you for your interest in contributing to Sankhya Strike. We welcome contributions that expand educational access for students learning in regional languages.

## Development Workflow
1. Clone this repository locally.
2. Install dependencies with `npm install`.
3. Launch the development server using `npm run dev`.
4. Run syntax and hygiene validation with `npm run lint`.
5. Run unit tests using `npm test`.

## Code Quality and Design Standards
- All user-facing UI must adhere to the pastel claymorphism design system.
- Zero external asset dependencies: all 3D geometries and audio effects must be synthesized procedurally in-engine.
- Security first: sanitize all dynamic DOM injections using `sanitizeHtml` to prevent XSS.
- All student data must remain purely on-device inside `localStorage` without collecting personally identifiable information.
