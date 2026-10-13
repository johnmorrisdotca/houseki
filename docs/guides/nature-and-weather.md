---
title: Preview nature and weather
section: how-to
order: 5
description: Use pure previews before committing magnetic, rebound and weather changes.
---

## Preview before applying

```ts
import { createNatureState,previewLightning,applyLightning,isEnvironmentTurnScheduled } from "@johnmorrisdotca/houseki/nature";
const state=createNatureState({width:4,height:4,seed:"weather-docs"});
const preview=previewLightning(state,{columns:[0]});
const result=applyLightning(state,{columns:[0]});
console.log(preview.columns,result.accepted,isEnvironmentTurnScheduled(2,{kind:"authored",turns:[2,4]}));
```

Nature owns the passable-cell mask, stone/obstacle ids and random state. Obstacles collide and block attraction, but cannot attract or move. Magnetic previews, power-drop previews and weather previews retain the input. Apply the corresponding transition to commit its state and events. A power-drop request names a pivot id contained in its piece; arbitrary overlapping cells are invalid.

## Use the native campaigns

```ts
import { shizenLevelManifest,arashiLevelManifest,createShizenLevel } from "@johnmorrisdotca/houseki/colour-chains";
console.log(shizenLevelManifest.length,arashiLevelManifest.length,createShizenLevel(1).settings.nature);
```

Shizen and Arashi are separate Colour Chains campaigns. Keep their nature/weather settings and magnetic queue. `powerDropPreview` can be null when it does not apply; its `finalCells` are the lock positions, while `settledCells` include the committed drop’s gravity result.
