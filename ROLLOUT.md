# Feature Flag Rollout Strategy

This document describes the rollout lifecycle and progressive activation gates for features in GojoDojo 8-Bit Grand Prix by Codebenders.

## Active Flags
1. `retro8BitMode`: Enables the 8-bit retro arcade drag racing engine, custom canvas pixel renderer, and CRT scanlines.
2. `chiptuneAudio`: Activates Web Audio API procedural square and noise wave sound synthesis.
3. `stemRadioQuiz`: Enables in-race cockpit STEM pitstop questions for Super Nitro rewards.
4. `touchControls`: Enables on-screen arcade touch controls for mobile devices.

## Canary Rollout Stages
- Stage 0 (Internal Testing): 0% public rollout. Verified via automated unit tests and browser CDP verification.
- Stage 1 (Beta Cohort): 25% rollout targeted at test classes and volunteer review sessions.
- Stage 2 (General Availability): 100% rollout when error rates stay beneath 0.01% and frame rates sustain 60 FPS across low-end mobile devices.
