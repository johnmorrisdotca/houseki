---
title: Use magnetic floors
section: how-to
order: 4
description: Compare native landing and gravity without mutating the input.
---

## Inspect a bonded square

```ts
import { createGame,blockCells,blockBonds,landingY } from "@johnmorrisdotca/houseki/magnetic-blocks";
const state=createGame({seed:"floor-docs",schedule:{kind:"fixed",floor:"calm"}});
if(state.active){
  console.log(blockCells(state.active,state.settings.width).length,blockBonds(state.active).length);
  console.log(landingY(state.active,state.board,state.settings.width,state.settings.height,state.settings.mask));
}
```

A block holds four stable-id gems in a rotating 2×2 square. Calm gravity preserves native bond constraints; magnetic gravity follows the native floor rule. Read `floor` and `nextFloor` separately. Floor Switch is a charged override with its own selection/cancellation actions; it is not a global rewrite of the authored schedule.

## Open a measured challenge

```ts
import { createLevel,getLevel } from "@johnmorrisdotca/houseki/magnetic-blocks";
console.log(getLevel(1)?.id,createLevel(1).settings.pieceLimit);
```

The 128 stored challenges include their original settings and witnesses. Do not relabel an engine-proved win as human review. The demo’s level selector fixes authored settings; free play is the route to choosing a custom board.
