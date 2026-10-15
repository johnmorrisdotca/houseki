---
title: 磁石の床を使う
section: how-to
order: 4
description: 入力を変えずに、着地と重力を比べます。
---

## つながった四角を調べる

```ts
import { createGame,blockCells,blockBonds,landingY } from "@johnmorrisdotca/houseki/magnetic-blocks";
const state=createGame({seed:"floor-docs",schedule:{kind:"fixed",floor:"calm"}});
if(state.active){
  console.log(blockCells(state.active,state.settings.width).length,blockBonds(state.active).length);
  console.log(landingY(state.active,state.board,state.settings.width,state.settings.height,state.settings.mask));
}
```

ブロックは、固定のidを持つ4つの石を2×2の四角として回します。穏やかな重力はつながりを保ち、磁石の重力は標準の床の規則に従います。`floor`と`nextFloor`は別々に読みます。床の切り替えには残り回数と取り消し操作があり、固定の予定を全体で書き換える操作ではありません。

## 測定したチャレンジを開く

```ts
import { createLevel,getLevel } from "@johnmorrisdotca/houseki/magnetic-blocks";
console.log(getLevel(1)?.id,createLevel(1).settings.pieceLimit);
```

保存された128のチャレンジには元の設定と解答の手順があります。仕組みで勝利を確認しても、人の確認済みとはしません。デモで問題を選ぶと設定が固定されます。盤面を変えるには自由に遊ぶを選びます。
