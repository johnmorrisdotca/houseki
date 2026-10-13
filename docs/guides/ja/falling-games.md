---
title: 落ちる宝石を操作する
section: how-to
order: 2
description: 入力と固定の時間刻みを順番に処理します。
---

## 操作してから時間を進める

```ts
import { createGame,applyAction,advanceTicks,landingY } from "@johnmorrisdotca/houseki/falling-triplets";
const state=createGame({seed:"triplets-docs",mode:"relaxed"});
const result=applyAction(state,{kind:"cycle-forward"});
console.log(result.accepted,landingY(result.state));
console.log(advanceTicks(result.state,1).state.phase);
```

三つの宝石では、縦の3つの石の色を回します。色の連鎖では軸と隣の石を回し、着地後は別々に落ち着きます。どちらも論理上は毎秒60刻みです。画面のフレーム数を規則の時計にしません。じっくり考えるモードと固定のチャレンジは、時間で落ちる操作を強制しません。消去と重力が終わってから、次の操作を受け付けます。

## 押し続ける入力を処理する

```ts
import { createGame,createInputScheduler,setHeldInput,processInputTick,applyAction,advanceTicks } from "@johnmorrisdotca/houseki/colour-chains";
const game=createGame({seed:"pair-docs"});
const input=setHeldInput(createInputScheduler(),"left",true);
const [next,rest,transitions]=processInputTick(game,input,applyAction,advanceTicks);
console.log(next.phase,Object.keys(rest),transitions.length);
```

フォーカスを失ったとき、ポインターを取り消したとき、一時停止したときは入力を解除します。標準の入力処理を使い、横移動・回転・落下を決まった順番にします。動く石がないと `landingY` と `landingCells` は null です。着地予告は乱数の状態を進めません。
