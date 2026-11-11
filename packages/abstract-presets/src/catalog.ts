import { parsePreset } from './schema.js';
import { SAMPLE_SOFT_FIELD } from './presets/sample-soft-field.js';
import type { AbstractPreset } from './types.js';

/** Bundled presets shipped with this package (whitelist for Ghost Arcade). */
const BUNDLED: AbstractPreset[] = [parsePreset(SAMPLE_SOFT_FIELD)];

export function bundledPresets(): readonly AbstractPreset[] {
  return BUNDLED;
}
