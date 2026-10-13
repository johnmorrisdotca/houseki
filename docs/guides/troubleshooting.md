---
title: Troubleshooting and FAQ
section: troubleshooting
order: 9
description: Interpret absent values, setup errors and saved-game failures.
---

## Understand absent values

An empty or masked board cell is null. Active falling pieces are null during phases where no piece exists. A selected tool, target, pending floor override, Black Hole portal or final outcome can be null until applicable. An unknown content lookup is undefined. A missing optional field is not a promise that a zero or false value was selected. Check these values before drawing a ghost or showing a tool preview.

## Handle validated setup

```ts
import { createGame,GemSwapOptionsError } from "@johnmorrisdotca/houseki/gem-swap";
try { createGame({mode:"daily"}); }
catch(error){console.log(error instanceof GemSwapOptionsError ? error.code : String(error));}
```

Gem Swap and Stone Collapse require a host-supplied Daily UTC date. Colour Chains accepts `dailyDate`; Falling Triplets uses its seed for a daily setup. A shaped/custom board needs matching width, height and mask lengths. Colour Chains authored boards contain visible cells, while its live state includes hidden rows; do not copy the whole live board into `createChallenge` without accounting for this. Falling Triplets challenges need 2–12 queued triplets.

## Diagnose a rejected operation

An action during clear or gravity may be rejected; inspect phase, legalActions and reason. A missing level id throws on creation. A bad save throws rather than accepting an edited checkpoint. A native typed error exposes code and message; keep the original diagnostic when presenting a recovery choice. Choose Free play to change a fixed authored setup. A witness confirms one winning plan, not every possible action sequence.
