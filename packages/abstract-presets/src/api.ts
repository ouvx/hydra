import { bundledPresets } from './catalog.js';
import { clampToMacro, mergeParams } from './schema.js';
import type {
  AbstractParams,
  AbstractPreset,
  ApplyParamsResult,
  ListPresetsFilter,
} from './types.js';

export function listPresets(filter: ListPresetsFilter = {}): AbstractPreset[] {
  return bundledPresets().filter((preset) => {
    if (filter.category && preset.category !== filter.category) return false;
    if (filter.tag && !preset.tags.includes(filter.tag)) return false;
    return true;
  });
}

export function getPreset(id: string): AbstractPreset | null {
  const wanted = String(id ?? '').trim();
  if (!wanted) return null;
  return bundledPresets().find((p) => p.id === wanted) ?? null;
}

export function getDefaultPreset(): AbstractPreset {
  const all = bundledPresets();
  if (all.length === 0) {
    throw new Error('@ouvx/abstract-presets has no bundled presets');
  }
  return all[0];
}

/**
 * Ghost Arcade PR #2 compatible gate: only bundled sketch code may run.
 * Exact code match wins; otherwise fall back to the bundled preset of the
 * same display name. Returns null when nothing safe matches (host should
 * then load getDefaultPreset()).
 */
export function resolveBundledSketch(
  code: string | null | undefined,
  name?: string | null,
): string | null {
  const presets = bundledPresets();
  const wanted = typeof code === 'string' ? code.trim() : '';
  if (wanted) {
    const exact = presets.find((p) => p.sketch.code.trim() === wanted);
    if (exact) return exact.sketch.code;
  }
  const byName = name ? presets.find((p) => p.name === name) : undefined;
  return byName ? byName.sketch.code : null;
}

/**
 * Merge knob overrides onto a preset. Skeleton behaviour: sketch code is
 * unchanged; resolved numbers are returned as uniforms for the host.
 * Later PRs may rewrite sketch fragments from these knobs.
 */
export function applyParams(
  preset: AbstractPreset,
  overrides: Partial<AbstractParams> = {},
): ApplyParamsResult {
  const params = clampToMacro(preset, mergeParams(preset.defaults, overrides));
  const uniforms: Record<string, number> = { ...params };
  for (const [key, macro] of Object.entries(preset.macros)) {
    if (!macro) continue;
    const value = params[key as keyof AbstractParams];
    uniforms[macro.mapsTo] = value;
  }
  return {
    sketchCode: preset.sketch.code,
    sketchName: preset.name,
    params,
    uniforms,
  };
}
