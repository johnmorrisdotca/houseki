---
title: 表示を作る
section: how-to
order: 8
description: 標準の状態を表示し、操作しやすい入力を渡します。
---

## 状態の境界を明確にする

```ts
import { createGame,legalActions,statusOf } from "@johnmorrisdotca/houseki/stone-collapse";
const state=createGame({seed:"host-docs",preset:"compact"});
console.log(state.settings.width,state.settings.height,legalActions(state).length,statusOf(state).remaining);
```

状態から表示し、標準の操作を仕組みに渡して、返された状態に置き換えます。acceptedとreasonで無効な入力を伝え、規則を別に作り直しません。マスク、固定のid、選択したグループ、道具の対象を分けて示します。フォーカス、キーボード、タッチのボタンを使えるようにします。動きと音は任意の反応です。

## 付属のデモを使う

4つのデモのページは言語と布の選択を共有し、ゲームごとに操作と保存した進み具合があります。すべてのページでドキュメントへのリンクは今の言語に従います。APIの索引は元のアンカーを保ち、それぞれの説明へ進めます。Housekiの埋め込みの作業は後回しのままで、この変更はiframeの作成画面や公開の表示APIを追加しません。付属の表示については、元の[テーマ](../../../README.md#theming)と[操作のしやすさ](../../../README.md#accessibility)を読めます。
