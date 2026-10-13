---
title: Open campaigns and lessons
section: how-to
order: 6
description: Keep stable ids, witnessed plans and review status with authored content.
---

## Find content by stable id

```ts
import { levelManifest,getLevel,getTutorial,tutorialManifest,createLevel } from "@johnmorrisdotca/houseki/falling-triplets";
const level=levelManifest[0];
console.log(getLevel(level.id)?.number,getTutorial(tutorialManifest[0].id)?.title.en,createLevel(level.id).phase);
```

Array indices start at zero; display numbers start at one. Persist the stable id rather than a display number because campaign ordering may change in a future release. `getLevel`, `getTutorial` and `getLesson` return undefined for absent ids; creation functions reject missing content.

## Preserve proof and review separately

```ts
import { GEM_SWAP_CAMPAIGN,GEM_SWAP_LESSONS,validateChallengeWitness } from "@johnmorrisdotca/houseki/gem-swap";
const level=GEM_SWAP_CAMPAIGN[0];
console.log(level.proofStatus,level.reviewStatus,validateChallengeWitness(level.options,level.witness).valid,GEM_SWAP_LESSONS.length);
```

There are 684 measured challenges across all stored campaigns. Measurements describe bounded engine probes; marks are not a universal estimate of human difficulty. Read the original [coverage](../COVERAGE.md) and [campaign methodology](../design/CAMPAIGN-DESIGN-TEMPLATE.md). Authored lessons add explicit instructions to their setup and witness, not just a random starting board.
