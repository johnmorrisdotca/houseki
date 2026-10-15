---
title: チャレンジとレッスンを開く
section: how-to
order: 6
description: 固定のid、解答の手順、確認の状態を問題と一緒に保ちます。
---

## 固定のidで探す

```ts
import { levelManifest,getLevel,getTutorial,tutorialManifest,createLevel } from "@johnmorrisdotca/houseki/falling-triplets";
const level=levelManifest[0];
console.log(getLevel(level.id)?.number,getTutorial(tutorialManifest[0].id)?.title.en,createLevel(level.id).phase);
```

配列は0から、表示の番号は1からです。今後並び順が変わることがあるため、表示番号より固定のidを保存します。`getLevel`、`getTutorial`、`getLesson`は見つからないとundefinedです。作成の関数では、見つからない問題を拒否します。

## 解答の確認と人の確認を区別する

```ts
import { GEM_SWAP_CAMPAIGN,GEM_SWAP_LESSONS,validateChallengeWitness } from "@johnmorrisdotca/houseki/gem-swap";
const level=GEM_SWAP_CAMPAIGN[0];
console.log(level.proofStatus,level.reviewStatus,validateChallengeWitness(level.options,level.witness).valid,GEM_SWAP_LESSONS.length);
```

保存されたキャンペーン全体に、測定した684のチャレンジがあります。測定は範囲を決めた仕組みの探索を表し、印は人の難しさの共通の尺度ではありません。元の[収録範囲](../../COVERAGE.md)と[問題の作り方](../../design/CAMPAIGN-DESIGN-TEMPLATE.md)を読めます。固定のレッスンには、盤面や解答に加えて、明確な説明の手順があります。
