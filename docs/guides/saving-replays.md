---
title: Save and replay a game
section: how-to
order: 7
description: Store native recordings and handle replay rejection explicitly.
---

## Round-trip an engine save

```ts
import { createGame,applyAction,encodeGame,decodeGame,restartGame } from "@johnmorrisdotca/houseki/falling-triplets";
const state=applyAction(createGame({seed:"save-docs"}),{kind:"left"}).state;
const restored=decodeGame(encodeGame(state));
console.log(restored.score,restored.elapsedTicks,restartGame(restored).settings.seed);
```

The save contains native settings, recording and a checkpoint. Decoding replays bounded operations and checks the derived checkpoint; editing only the visible board does not make a valid save. Use the decoder from the same game entry that encoded it. Catch malformed JSON, unsupported rules and checkpoint disagreement at your storage boundary.

## Preserve host preferences separately

Language, cloth and sound are host preferences, not engine actions. Save them separately from gameplay. Daily seeds/dates must be chosen explicitly by the host; [troubleshooting](troubleshooting.md) covers UTC dates and fixed content. Restart reconstructs the initial native setup; undo restores a prior move where that engine provides it. Neither operation is a cross-game save converter.
