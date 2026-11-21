# Feature Flag Rollout Strategy

This document describes the rollout lifecycle and progressive activation gates for experimental features in Sankhya Strike.

## Active Flags
1. `viceCityMode`: Enables 3D retro sports cars, neon street lamps, and first-person camera movement.
2. `koreanPastelTheme`: Activates South Korean pastel claymorphism styles, candy pills, and emotional avatar states.
3. `offlineVoiceTts`: Toggles client-side speech synthesis and microphone voice-recognition for doubt resolution.
4. `radarMinimap`: Enables the circular GTA-style radar HUD on the bottom-left corner of the display.

## Canary Rollout Stages
- Stage 0 (Internal Testing): 0% public rollout. Verified via automated unit tests and headless syntax verification.
- Stage 1 (Beta Cohort): 25% rollout targeted at test classes and volunteer review sessions.
- Stage 2 (General Availability): 100% rollout when error rates stay beneath 0.01% and frame rates sustain 60 FPS on mobile GPUs.
