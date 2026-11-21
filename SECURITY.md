# Security Policy

## Supported Versions
Only the latest release branch of Sankhya Strike receives active security patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting Vulnerabilities
If you discover a security issue or unexpected data exposure, please open a private report or contact the maintainers directly. Do not file public issue tickets for sensitive disclosures.

## Security Practices
- Strict SAST validation against unsanitized HTML injections and prototype pollution.
- No remote telemetry or minor profiling: zero cookies, zero external tracking scripts.
- Web Audio and Web Speech are executed client-side without streaming student microphone data to third-party endpoints.
