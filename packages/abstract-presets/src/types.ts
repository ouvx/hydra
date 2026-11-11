/**
 * Shared ABSTRACT preset format (`ouvx-abstract-preset`).
 * Consumed by Ghost Arcade via git dependency on this package.
 */

export const PRESET_FORMAT = 'ouvx-abstract-preset' as const;
export const PRESET_FORMAT_VERSION = 1 as const;

export type AbstractParamKey =
  | 'noise'
  | 'distortion'
  | 'feedback'
  | 'contrast'
  | 'threshold'
  | 'pixelation'
  | 'speed'
  | 'audioReactivity'
  | 'brightness'
  | 'opacity';

export interface AbstractParams {
  noise: number;
  distortion: number;
  feedback: number;
  contrast: number;
  threshold: number;
  pixelation: number;
  speed: number;
  audioReactivity: number;
  brightness: number;
  opacity: number;
}

export interface AbstractMacroSpec {
  min: number;
  max: number;
  /** Where the knob goes: hydra runtime field or a future uniform name. */
  mapsTo: string;
}

export interface AbstractPresetSketch {
  language: 'hydra';
  code: string;
}

export interface AbstractPreset {
  format: typeof PRESET_FORMAT;
  formatVersion: typeof PRESET_FORMAT_VERSION;
  id: string;
  name: string;
  category: string;
  tags: string[];
  license: string;
  author: string;
  credits: string[];
  sketch: AbstractPresetSketch;
  defaults: AbstractParams;
  macros: Partial<Record<AbstractParamKey, AbstractMacroSpec>>;
}

export interface ListPresetsFilter {
  category?: string;
  tag?: string;
}

export interface ApplyParamsResult {
  sketchCode: string;
  sketchName: string;
  /** Resolved knob values after merging defaults + overrides. */
  params: AbstractParams;
  /**
   * Skeleton: values the host may feed into hydra (`speed`) or later uniforms.
   * Phase 1 hosts may ignore this and only use sketchCode.
   */
  uniforms: Record<string, number>;
}
