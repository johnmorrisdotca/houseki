---
title: 自然と天候を予告する
section: how-to
order: 5
description: 磁石・跳ね返り・天候を確定する前に、変更しない予告を使います。
---

## 確定する前に予告する

```ts
import { createNatureState,previewLightning,applyLightning,isEnvironmentTurnScheduled } from "@johnmorrisdotca/houseki/nature";
const state=createNatureState({width:4,height:4,seed:"weather-docs"});
const preview=previewLightning(state,{columns:[0]});
const result=applyLightning(state,{columns:[0]});
console.log(preview.columns,result.accepted,isEnvironmentTurnScheduled(2,{kind:"authored",turns:[2,4]}));
```

自然の仕組みは、使えるマス、石と障害物のid、乱数の状態を持ちます。障害物は衝突し、引き寄せを妨げますが、自分は動いたり引き寄せたりしません。磁石、強い落下、天候の予告は入力を変えません。対応する操作の結果を使って、状態とイベントを確定します。強い落下の要求では、石に含まれる軸のidを指定します。重なる位置は無効です。

## 標準のキャンペーンを使う

```ts
import { shizenLevelManifest,arashiLevelManifest,createShizenLevel } from "@johnmorrisdotca/houseki/colour-chains";
console.log(shizenLevelManifest.length,arashiLevelManifest.length,createShizenLevel(1).settings.nature);
```

自然と嵐は色の連鎖の別々のキャンペーンです。自然・天候の設定と磁石の順番を保ちます。`powerDropPreview`は適用できないとnullです。`finalCells`は固定する位置で、`settledCells`は確定した落下の重力後の位置です。
