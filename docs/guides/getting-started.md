---
title: Getting started
section: tutorial
order: 1
description: Choose one native engine and inspect a deterministic transition.
---

## Start a seeded run

```ts
import { fallingTriplets } from "@johnmorrisdotca/houseki";
const state=fallingTriplets.createGame({seed:"small-example"});
const moved=fallingTriplets.applyAction(state,{kind:"left"});
console.log(state.phase,moved.accepted,moved.state.active?.x);
```

The main entry exposes six namespaces. Five are games: Falling Triplets, Colour Chains, Stone Collapse, Gem Swap and Magnetic Blocks. `nature` is their reusable magnetic/rebound/weather core. Each game keeps its own native state, actions and settings; they are not interchangeable.

## Import one engine

```ts
import { createGame,statusOf } from "@johnmorrisdotca/houseki/gem-swap";
console.log(statusOf(createGame({seed:"small-example"})).legalMoveCount);
```

The seven original entry points stay intact. An npm alias changes the name in your import, not the engine API. Continue with [falling games](falling-games.md), [full boards](full-board-games.md) or [a host UI](host-ui.md). No DOM or browser is required by these engine imports.
