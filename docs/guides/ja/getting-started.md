---
title: はじめに
section: tutorial
order: 1
description: 標準のゲームの仕組みを選び、再現できる操作の結果を調べます。
---

## シードを指定して始める

```ts
import { fallingTriplets } from "@johnmorrisdotca/houseki";
const state=fallingTriplets.createGame({seed:"small-example"});
const moved=fallingTriplets.applyAction(state,{kind:"left"});
console.log(state.phase,moved.accepted,moved.state.active?.x);
```

主な入口には6つの名前空間があります。5つは三つの宝石、色の連鎖、ストーンコラプス、ジェムスワップ、磁石ブロックです。`nature` は、磁石・跳ね返り・天候の共通の仕組みです。状態、操作、設定はゲームごとに異なり、交換して使えません。

## 1つの仕組みを import する

```ts
import { createGame,statusOf } from "@johnmorrisdotca/houseki/gem-swap";
console.log(statusOf(createGame({seed:"small-example"})).legalMoveCount);
```

元の7つの入口を保ちます。npm の別名は import の名前を変えますが、API は変えません。[落ちるゲーム](falling-games.md)、[盤面いっぱいのゲーム](full-board-games.md)、[表示の作り方](host-ui.md)へ進めます。これらの仕組みの import に DOM やブラウザーは必要ありません。
