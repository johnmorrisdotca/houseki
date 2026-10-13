---
title: Drive falling gems
section: how-to
order: 2
description: Keep player actions and fixed-tick simulation in order.
---

## Move, then simulate

```ts
import { createGame,applyAction,advanceTicks,landingY } from "@johnmorrisdotca/houseki/falling-triplets";
const state=createGame({seed:"triplets-docs",mode:"relaxed"});
const result=applyAction(state,{kind:"cycle-forward"});
console.log(result.accepted,landingY(result.state));
console.log(advanceTicks(result.state,1).state.phase);
```

Falling Triplets cycles a rigid vertical triplet. Colour Chains rotates a pivot and satellite, then allows independently settled stones. Both advance at 60 logical ticks per second; a host’s frame rate is not the rules clock. Relaxed play and authored challenges avoid a forced falling clock. Resolve clears and gravity before interpreting the next playable phase.

## Schedule held input

```ts
import { createGame,createInputScheduler,setHeldInput,processInputTick,applyAction,advanceTicks } from "@johnmorrisdotca/houseki/colour-chains";
const game=createGame({seed:"pair-docs"});
const input=setHeldInput(createInputScheduler(),"left",true);
const [next,rest,transitions]=processInputTick(game,input,applyAction,advanceTicks);
console.log(next.phase,Object.keys(rest),transitions.length);
```

Release held controls on blur, pointer cancellation or pause. Use the native scheduler so simultaneous lateral, rotation and drop inputs follow its canonical order. `landingY` and `landingCells` return null when no active piece exists; a ghost preview never consumes the random source.
