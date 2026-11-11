import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  PRESET_FORMAT,
  PRESET_FORMAT_VERSION,
  applyParams,
  getDefaultPreset,
  getPreset,
  listPresets,
  parsePreset,
  resolveBundledSketch,
} from '../dist/index.js';

describe('@ouvx/abstract-presets skeleton', () => {
  it('ships exactly one sample preset for now', () => {
    const all = listPresets();
    assert.equal(all.length, 1);
    assert.equal(all[0].id, 'sample-soft-field');
    assert.equal(all[0].format, PRESET_FORMAT);
    assert.equal(all[0].formatVersion, PRESET_FORMAT_VERSION);
  });

  it('listPresets filters by category and tag', () => {
    assert.equal(listPresets({ category: 'sample' }).length, 1);
    assert.equal(listPresets({ category: 'mono' }).length, 0);
    assert.equal(listPresets({ tag: 'sample' }).length, 1);
    assert.equal(listPresets({ tag: 'missing' }).length, 0);
  });

  it('getPreset / getDefaultPreset', () => {
    assert.equal(getPreset('nope'), null);
    assert.equal(getPreset('sample-soft-field')?.name, 'Sample Soft Field');
    assert.equal(getDefaultPreset().id, 'sample-soft-field');
  });

  it('resolveBundledSketch accepts only bundled code', () => {
    const sample = getDefaultPreset();
    assert.equal(resolveBundledSketch(sample.sketch.code), sample.sketch.code);
    assert.equal(resolveBundledSketch(`  ${sample.sketch.code}\n`), sample.sketch.code);
    assert.equal(resolveBundledSketch('', sample.name), sample.sketch.code);

    const hostile = "fetch('https://example.invalid'); osc().out()";
    assert.equal(resolveBundledSketch(hostile, 'Unknown'), null);
    // Known name retunes to the bundled code of that name.
    assert.equal(resolveBundledSketch(hostile, sample.name), sample.sketch.code);
  });

  it('applyParams merges knobs and clamps to macros', () => {
    const preset = getDefaultPreset();
    const result = applyParams(preset, { speed: 99, brightness: 0.5 });
    assert.equal(result.sketchCode, preset.sketch.code);
    assert.equal(result.sketchName, preset.name);
    assert.equal(result.params.speed, 3); // clamped to macro max
    assert.equal(result.params.brightness, 0.5);
    assert.equal(result.uniforms['hydra:speed'], 3);
    assert.equal(result.uniforms['uniform:uBrightness'], 0.5);
  });

  it('parsePreset rejects wrong format', () => {
    assert.throws(() => parsePreset({ format: 'nope' }), /format must be/);
  });
});
