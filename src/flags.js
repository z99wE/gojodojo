/**
 * Sankhya Strike - Feature Flag Engine
 * Controls gradual rollouts for Vice City 3D elements, pastel shaders, and voice accessibility.
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
  VICE_CITY_MODE: 'viceCityMode',
  KOREAN_PASTEL_THEME: 'koreanPastelTheme',
  OFFLINE_VOICE_TTS: 'offlineVoiceTts',
  RADAR_MINIMAP: 'radarMinimap'
};
