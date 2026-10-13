---
title: ゲームを保存して再生する
section: how-to
order: 7
description: 標準の記録を保存し、再生できない場合を処理します。
---

## 標準の保存を往復する

```ts
import { createGame,applyAction,encodeGame,decodeGame,restartGame } from "@johnmorrisdotca/houseki/falling-triplets";
const state=applyAction(createGame({seed:"save-docs"}),{kind:"left"}).state;
const restored=decodeGame(encodeGame(state));
console.log(restored.score,restored.elapsedTicks,restartGame(restored).settings.seed);
```

保存には標準の設定、操作の記録、確認用の状態が含まれます。読み込みは範囲を決めて操作を再生し、結果を照合します。見える盤面だけを書き換えても、有効な保存になりません。保存したものと同じゲームの読み込み関数を使います。JSON の形式、未対応の規則、結果の不一致は保存の境界で処理します。

## 表示の好みは別に保つ

言語、布の色、音は表示の好みで、ゲームの操作ではありません。ゲームの記録とは別に保存します。毎日のシードや日付は、表示側で明確に選びます。[問題への対処](troubleshooting.md)で UTC の日付と固定の問題を説明します。再開始は元の設定を作り直し、元に戻す操作は対応するゲームの前の手に戻ります。別のゲームの保存への変換ではありません。
