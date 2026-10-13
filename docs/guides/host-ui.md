---
title: Build a host UI
section: how-to
order: 8
description: Render native state and route accessible input without changing the engine API.
---

## Keep the state boundary explicit

```ts
import { createGame,legalActions,statusOf } from "@johnmorrisdotca/houseki/stone-collapse";
const state=createGame({seed:"host-docs",preset:"compact"});
console.log(state.settings.width,state.settings.height,legalActions(state).length,statusOf(state).remaining);
```

Render from state; send native actions back to the engine and replace state with the returned state. Use accepted/reason to announce invalid input without inventing a second rules implementation. Show masks, stable ids, selected groups and tool targets separately. Keep a visible focus target, keyboard controls and touch buttons; motion and sound are optional feedback.

## Use the shipped demo

The four demo pages share language and cloth choices, while each game has its own controls and saved progress. Docs links follow the current English/Japanese selection on every page. The API index retains old anchors and links to individual export pages. Houseki’s native embedding work remains deferred; this rollout adds documentation and does not introduce an iframe builder or a public mount API. See the existing [theming](../../README.md#theming) and [accessibility](../../README.md#accessibility) guidance for the shipped player.
