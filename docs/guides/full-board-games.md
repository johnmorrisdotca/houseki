---
title: Play full-board games
section: how-to
order: 3
description: Inspect legal actions, rejection and tool previews on native full boards.
---

## Inspect Gem Swap choices

```ts
import { createGame,legalActions,applyAction,advanceTicks } from "@johnmorrisdotca/houseki/gem-swap";
const state=createGame({seed:8001,preset:"compact"});
const choices=legalActions(state);
const result=applyAction(state,{kind:"swap",from:0,to:1});
console.log(choices.length,result.accepted,result.reason);
console.log(advanceTicks(result.state,1).state.phase);
```

A neighbouring swap must satisfy the native rules. An invalid swap leaves state identity unchanged. Matches can plan a special before clear/refill finishes. Do not read a transient empty cell as a removed board square: `settings.mask` distinguishes permanent gaps. Stored tools have selection, target preview, confirmation and cancellation actions; previewing is not spending a tool.

## Ask Stone Collapse for a hint

```ts
import { createLevel,requestHint,statusOf } from "@johnmorrisdotca/houseki/stone-collapse";
const state=createLevel(1);
const hinted=requestHint(state);
console.log(hinted.accepted,statusOf(hinted.state).assisted);
```

Select a stone’s stable id, inspect the selected group, then confirm. Columns and cells may change as stones fall, so cell positions cannot replace ids in a witness. Hints and undo are native assisted actions. Follow [saves](saving-replays.md) to retain this information rather than just storing the visible board.
