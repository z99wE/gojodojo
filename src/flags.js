/**
 * GojoDojo - Feature Flag Engine by Codebenders
 * Controls gradual rollouts for 8-bit racing mechanics, chiptune audio, and STEM quizzes.
 */

import flagsData from '../flags.json' with { type: 'json' };

/**
 * Checks whether a feature flag is currently active.
 * @param {string} flagName Name of the feature flag to inspect
 * @returns {boolean} True if enabled, false otherwise
 */
export function isFeatureEnabled(flagName) {
  if (!flagsData || !flagsData.flags) return true;
  const flag = flagsData.flags[flagName];
  if (!flag) return true;
  return Boolean(flag.enabled);
}

/**
 * All registered system feature flags.
 */
export const FEATURES = {
  RETRO_8BIT_MODE: 'retro8BitMode',
  CHIPTUNE_AUDIO: 'chiptuneAudio',
  STEM_RADIO_QUIZ: 'stemRadioQuiz',
  TOUCH_CONTROLS: 'touchControls'
};
