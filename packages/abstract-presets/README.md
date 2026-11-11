# `@ouvx/abstract-presets`

共有の ABSTRACT プリセットとパラメーター API です。  
[ouvx/hydra](https://github.com/ouvx/hydra) の中に置き、[ouvx/ghost-arcade](https://github.com/ouvx/ghost-arcade) から **git 依存**で取り込みます。

このパッケージは **プリセットデータと API だけ**を持ちます。Hydra Web エディター本体や `hydra-synth` の描画エンジンは含みません（エンジンは Ghost Arcade 側の `hydra-synth` をそのまま使います）。

## ライセンス

**GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**

- このディレクトリの `LICENSE`（リポジトリルートと同じ AGPL v3 本文）を参照してください。
- 改変してネットワークサービスとして提供する場合は、利用者にソースを提供する義務があります。
- Ghost Arcade / Hydra / hydra-synth も AGPL 系です。組み合わせた成果物も AGPL で配布する前提です。

Copyright notices of upstream Hydra / hydra-synth authors remain in force. Do not remove them.

## 形式

プリセットは `format: "ouvx-abstract-preset"` / `formatVersion: 1` です。  
`sketch.code` は hydra-synth でそのまま動く文字列です。

## API（雛形）

```ts
import {
  listPresets,
  getPreset,
  getDefaultPreset,
  resolveBundledSketch,
  applyParams,
} from '@ouvx/abstract-presets';

listPresets({ category: 'sample' });
resolveBundledSketch(codeFromProject, sketchName); // 同梱以外は null
applyParams(preset, { speed: 1.2, brightness: 0.8 });
```

- `resolveBundledSketch` … Ghost Arcade PR #2 の同梱ガードと同じ考え方
- `applyParams` … いまはノブ値を `uniforms` にまとめ、スケッチ本文はまだ書き換えません（後続 PR）

## 現状の中身

動作確認用サンプル **1 つだけ**（`Sample Soft Field`）が入っています。  
仕様書の抽象プリセット 12 種は **まだ入れていません**（別 PR）。

## 開発

```bash
cd packages/abstract-presets
npm install
npm test
```

ルートの Hydra Web エディター（`npm run dev` / `npm run build`）とは独立しています。このパッケージを触ってもエディターの挙動は変わりません。

## Ghost Arcade からの参照（予定）

```json
{
  "dependencies": {
    "@ouvx/abstract-presets": "github:ouvx/hydra#<commit-sha>"
  }
}
```

コミット SHA 固定を推奨します。公開 npm への publish や `v*` タグは、運用方針が決まるまで行いません。
