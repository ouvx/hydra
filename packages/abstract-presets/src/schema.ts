import {
  PRESET_FORMAT,
  PRESET_FORMAT_VERSION,
  type AbstractParams,
  type AbstractPreset,
} from './types.js';

const PARAM_KEYS: (keyof AbstractParams)[] = [
  'noise',
  'distortion',
  'feedback',
  'contrast',
  'threshold',
  'pixelation',
  'speed',
  'audioReactivity',
  'brightness',
  'opacity',
];

export const DEFAULT_PARAMS: AbstractParams = {
  noise: 0,
  distortion: 0,
  feedback: 0,
  contrast: 1,
  threshold: 0,
  pixelation: 0,
  speed: 1,
  audioReactivity: 0,
  brightness: 1,
  opacity: 1,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid preset: ${label} must be a non-empty string`);
  }
  return value;
}

function assertNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid preset: ${label} must be a finite number`);
  }
  return value;
}

/** Validate and normalize a preset object. Throws on structural errors. */
export function parsePreset(raw: unknown): AbstractPreset {
  if (!isRecord(raw)) throw new Error('Invalid preset: expected an object');
  if (raw.format !== PRESET_FORMAT) {
    throw new Error(`Invalid preset: format must be "${PRESET_FORMAT}"`);
  }
  if (raw.formatVersion !== PRESET_FORMAT_VERSION) {
    throw new Error(`Invalid preset: formatVersion must be ${PRESET_FORMAT_VERSION}`);
  }

  const sketchRaw = raw.sketch;
  if (!isRecord(sketchRaw) || sketchRaw.language !== 'hydra') {
    throw new Error('Invalid preset: sketch.language must be "hydra"');
  }

  const defaultsRaw = raw.defaults;
  if (!isRecord(defaultsRaw)) throw new Error('Invalid preset: defaults must be an object');
  const defaults = { ...DEFAULT_PARAMS };
  for (const key of PARAM_KEYS) {
    if (key in defaultsRaw) defaults[key] = assertNumber(defaultsRaw[key], `defaults.${key}`);
  }

  const macrosRaw = isRecord(raw.macros) ? raw.macros : {};
  const macros: AbstractPreset['macros'] = {};
  for (const [key, spec] of Object.entries(macrosRaw)) {
    if (!PARAM_KEYS.includes(key as keyof AbstractParams)) continue;
    if (!isRecord(spec)) continue;
    macros[key as keyof AbstractParams] = {
      min: assertNumber(spec.min, `macros.${key}.min`),
      max: assertNumber(spec.max, `macros.${key}.max`),
      mapsTo: assertString(spec.mapsTo, `macros.${key}.mapsTo`),
    };
  }

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === 'string')
    : [];
  const credits = Array.isArray(raw.credits)
    ? raw.credits.filter((c): c is string => typeof c === 'string')
    : [];

  return {
    format: PRESET_FORMAT,
    formatVersion: PRESET_FORMAT_VERSION,
    id: assertString(raw.id, 'id'),
    name: assertString(raw.name, 'name'),
    category: assertString(raw.category, 'category'),
    tags,
    license: assertString(raw.license, 'license'),
    author: assertString(raw.author, 'author'),
    credits,
    sketch: {
      language: 'hydra',
      code: assertString(sketchRaw.code, 'sketch.code'),
    },
    defaults,
    macros,
  };
}

export function mergeParams(
  defaults: AbstractParams,
  overrides: Partial<AbstractParams> = {},
): AbstractParams {
  const next = { ...defaults };
  for (const key of PARAM_KEYS) {
    if (overrides[key] !== undefined) next[key] = overrides[key]!;
  }
  return next;
}

export function clampToMacro(
  preset: AbstractPreset,
  params: AbstractParams,
): AbstractParams {
  const next = { ...params };
  for (const key of PARAM_KEYS) {
    const macro = preset.macros[key];
    if (!macro) continue;
    const lo = Math.min(macro.min, macro.max);
    const hi = Math.max(macro.min, macro.max);
    next[key] = Math.min(hi, Math.max(lo, next[key]));
  }
  return next;
}
