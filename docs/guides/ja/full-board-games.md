---
title: 盤面いっぱいのゲームで遊ぶ
section: how-to
order: 3
description: 合法な操作、拒否の理由、道具の予告を調べます。
---

## ジェムスワップの操作を調べる

```ts
import { createGame,legalActions,applyAction,advanceTicks } from "@johnmorrisdotca/houseki/gem-swap";
const state=createGame({seed:8001,preset:"compact"});
const choices=legalActions(state);
const result=applyAction(state,{kind:"swap",from:0,to:1});
console.log(choices.length,result.accepted,result.reason);
console.log(advanceTicks(result.state,1).state.phase);
```

隣の石との交換は、標準の規則を満たす必要があります。無効な交換は入力の状態をそのまま返します。消去と補充の前に特殊な石を作る計画が決まることがあります。一時的な空きマスと、盤面の外のマスを区別します。固定の穴は`settings.mask`で分かります。道具には選択、対象の予告、確定、取り消しがあり、予告だけでは消費しません。

## ストーンコラプスのヒントを使う

```ts
import { createLevel,requestHint,statusOf } from "@johnmorrisdotca/houseki/stone-collapse";
const state=createLevel(1);
const hinted=requestHint(state);
console.log(hinted.accepted,statusOf(hinted.state).assisted);
```

石の固定のidを選び、つながるグループを確認してから確定します。落下で列や位置が変わるため、解答の手順ではidを位置で置き換えません。ヒントと元に戻す操作は、標準の補助操作です。[保存](saving-replays.md)では、見える盤面だけでなく、この情報も保ちます。
