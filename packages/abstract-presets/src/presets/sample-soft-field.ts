import type { AbstractPreset } from '../types.js';
import { PRESET_FORMAT, PRESET_FORMAT_VERSION } from '../types.js';

/**
 * Single sample preset for wiring checks.
 * The real ABSTRACT set of 12 lands in a later Hydra PR — do not treat this
 * as a production look.
 */
export const SAMPLE_SOFT_FIELD: AbstractPreset = {
  format: PRESET_FORMAT,
  formatVersion: PRESET_FORMAT_VERSION,
  id: 'sample-soft-field',
  name: 'Sample Soft Field',
  category: 'sample',
  tags: ['sample', 'mono', 'noise'],
  license: 'AGPL-3.0-or-later',
  author: 'ouvx',
  credits: [],
  sketch: {
    language: 'hydra',
    // Quiet monochrome noise — safe default for smoke tests.
    code: 'noise(2, 0.05).color(1, 1, 1).contrast(1.2).out()',
  },
  defaults: {
    noise: 0.4,
    distortion: 0.1,
    feedback: 0,
    contrast: 1.2,
    threshold: 0,
    pixelation: 0,
    speed: 1,
    audioReactivity: 0.2,
    brightness: 0.85,
    opacity: 1,
  },
  macros: {
    noise: { min: 0, max: 1, mapsTo: 'uniform:uNoise' },
    contrast: { min: 0.5, max: 2, mapsTo: 'uniform:uContrast' },
    speed: { min: 0.1, max: 3, mapsTo: 'hydra:speed' },
    audioReactivity: { min: 0, max: 1, mapsTo: 'uniform:uAudio' },
    brightness: { min: 0, max: 1, mapsTo: 'uniform:uBrightness' },
    opacity: { min: 0, max: 1, mapsTo: 'uniform:uOpacity' },
  },
};
