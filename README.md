<h1 align="center">Houseki <sub>宝石</sub></h1>

<p align="center"><strong>Five original gem and stone puzzle games for JavaScript and TypeScript.</strong><br>
Falling Triplets, Colour Chains, Stone Collapse and Gem Swap: each an immutable, seeded rules engine that runs anywhere, with graded challenges and lessons, saves that replay to the same board, and a keyboard, keypad and touch player in the demo. Magnetic Blocks adds bonded squares, a magnetic floor and its own campaign. Shizen and Arashi each add a separate Colour Chains campaign. In English and Japanese. No dependencies.</p>

<p align="center">
  <a href="https://github.com/johnmorrisdotca/houseki/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/johnmorrisdotca/houseki/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@johnmorrisdotca/houseki"><img alt="npm" src="https://img.shields.io/npm/v/@johnmorrisdotca/houseki?color=2f5d4a"></a>
  <a href="./LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-2f5d4a"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-0-2f5d4a">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-2f5d4a">
</p>

<table align="center">
<tr>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/hero-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/hero-desk-light.webp" alt="The demo on a desk, in English: the page header with its language chooser, the API reference link, five cloth patches and the Help switch, the page chooser (Falling Triplets, Colour Chains, Gem Swap and Stone Collapse chosen, Magnetic Blocks), the settings column, and Gem Swap on green felt: an eight by eight board of red, blue, green, gold and purple gems with a permanent symbol on each, and the tool tray beside it with Bomb, Row clear and Colour clear" width="600">
</picture>
<br><em>The demo on a desk: Gem Swap with its tool tray.</em>
</td>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/hero-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/hero-phone-light.webp" alt="The demo on a phone, in Japanese: the Gem Swap board of gems with their symbols, and under it the tool tray, 道具箱, with the bomb, row and colour tools, the confirm and cancel buttons, and the hint and reshuffle buttons" width="190">
</picture>
<br><em>On a phone, in Japanese, in the device's light or dark.</em>
</td>
</tr>
</table>


Houseki is a set of match-style puzzle games made to be dropped into a page or a server. Every game is a set of plain functions on plain data: a state in, a new state out, nothing read from the page, the clock or the network. The demo's players draw those states, and a person can play them with the keyboard, a keypad or a finger.

## In 30 seconds

```sh
npm install @johnmorrisdotca/houseki
```

```ts
import { createGame, applyAction, advanceTicks } from "@johnmorrisdotca/houseki/falling-triplets";

let game = createGame({ mode: "relaxed", seed: "first-game" });
game = applyAction(game, { kind: "cycle-forward" }).state;
game = applyAction(game, { kind: "place" }).state;
game = advanceTicks(game, 22).state;
```

Every engine is a path of its own, and the main entry groups them by game:

```ts
import { colourChains } from "@johnmorrisdotca/houseki";

const firstChallenge = colourChains.createLevel(1);
const goal = firstChallenge.settings.goal;
```

Or straight from a page, with nothing to build:

```html
<script type="module">
  import { createGame } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/houseki@0/dist/gem-swap.js";
  const game = createGame({ seed: "hello" });
</script>
```

## Who it is for

- **Game and puzzle sites** that want match games with the rules already right: challenges everybody plays alike, a win that is witnessed, and saves that cannot drift.
- **Anyone who needs the rules without a screen**: a server that checks a finished game, a test that plays a campaign, a bot, a solver. Every engine is deterministic from its seed.
- **Teachers and parents**: nothing is timed against you in Relaxed play, every colour has its own permanent symbol, and every word is plain.

## Features

- **Five games**, each its own engine and its own entry point: [Falling Triplets](docs/design/01-FALLING-TRIPLETS.md), [Stone Collapse](docs/design/02-STONE-COLLAPSE.md), [Colour Chains](docs/design/03-COLOUR-CHAINS.md) [Gem Swap](docs/design/04-GEM-SWAP.md) and [Magnetic Blocks](docs/design/CAMPAIGN-EXTENSIONS.md).
- **Graded campaigns and lessons**: 100 Falling Triplets, 50 Colour Chains, 100 Stone Collapse, 50 Gem Swap, 128 Magnetic Blocks, 128 Shizen and 128 Arashi challenges (684 total), ordered by measured difficulty, each with a recorded winning play that the tests replay, and three guided lessons for each game. The boards are original, regenerated from a script, and a challenge keeps its identity if the order changes.
- **Three modes**: Relaxed (no clock, plan each move), Arcade (a timer drops the pieces) and Daily (the same board for everyone on a date).
- **Seeded and replayable**: a state is made from a seed and a list of actions, so a save is that list, and it decodes to exactly the board it came from.
- **Configurable boards**: presets from compact to extra wide and deep, custom sizes within stated limits, up to six colours, and shaped boards (heart, star, hexagon) for the full-board games.
- **Stored tools** for Gem Swap (Bomb, Row clear, Colour clear) and Stone Collapse (Bomb, Pick): select a tool and a stone, look at the highlighted effect, then confirm or cancel. A run that uses a tool is marked assisted. An optional earned Black Hole shrinks as it consumes nearby gems.
- **Nature, optional**: Shizen magnetic stones with one bounded rebound, and Arashi weather, a rare or frequent earthquake that jumbles stones and lightning that removes exposed ones, on a seeded schedule.
- **Magnetic Blocks**: bonded 2×2 squares, a floor that turns magnetic on a schedule, a one-use Floor Switch and impact drops. Its 128 challenges progress from forgiving landings to coupled support clearings and a necessary Floor Switch. Impact remains configurable in free play.
- **Accessible**: permanent colour symbols, keyboard and keypad control, an Animation setting that is on by default and a reduced-motion choice that is respected.
- **Light and dark** that follow the device, in the demo's family look.
- **English and Japanese** words for every lesson, challenge, button and line of the demo.
- **Zero dependencies**, for the package and for the demo.

### The games

| Game | Entry | You | A match is | Challenges |
| --- | --- | --- | --- | --- |
| Falling Triplets | `falling-triplets` | cycle a falling vertical triplet and place it | a line of three, across, down or diagonal | 100 |
| Stone Collapse | `stone-collapse` | select a connected group and confirm | two or more touching stones of one colour | 100 |
| Colour Chains | `colour-chains` | rotate a falling pair | a group of four or more | 50 |
| Gem Swap | `gem-swap` | swap two neighbours | a run of three or more, which can make special gems | 50 |
| Magnetic Blocks | `magnetic-blocks` | rotate a falling 2×2 block | four connected gems, with Calm/Pull settling | 128 |
| Shizen | `colour-chains` | anticipate marked stones and rebound | four connected gems after attraction | 128 |
| Arashi | `colour-chains` | plan around earthquakes and lightning | four connected gems after weather | 128 |


### What's in it

Each picture is the real game, drawn by the demo's player from the package's engine and taken with `pnpm screenshots:readme`, in light and dark. The board is the same seed every time, so the pictures are the same each run.

<table>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/falling-triplets-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/falling-triplets-desk-light.webp" alt="Falling Triplets on a desk after six placed triplets: a tall pale well in a wooden frame with a heap of gems at the bottom, each with a permanent symbol, the Next column of three triplets beside it, the line Place the triplet and the buttons for the arrows, Reverse cycle, Cycle, Place and Pause under it" width="360">
</picture>
<br><em><strong>Falling Triplets.</strong> Cycle the colours of a falling vertical triplet and place it; three in a line, across, down or diagonal, clear.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/colour-chains-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/colour-chains-desk-light.webp" alt="Colour Chains on a desk after six placed pairs: a tall pale well with a heap of gems at the bottom and a pair of gems at the top, the Next pair beside it, and the buttons for the arrows, Rotate left, Rotate right, Place and Pause under it" width="360">
</picture>
<br><em><strong>Colour Chains.</strong> Rotate a falling pair; four or more of a colour connected clear, and the stones above fall and may clear again.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/gem-swap-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/gem-swap-desk-light.webp" alt="Gem Swap on a desk: an eight by eight board of gems in a wooden frame with the top-left gem selected, and the Tool tray beside it with Bomb × 1, Row clear × 1 and Colour clear × 1, the counter 0/12 ordinary clears toward the next tool, and the Confirm, Cancel, Hint and Reshuffle buttons" width="400">
</picture>
<br><em><strong>Gem Swap.</strong> Swap two neighbours to make a run of three or more; stored tools are previewed, then confirmed or cancelled.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/stone-collapse-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/stone-collapse-desk-light.webp" alt="Stone Collapse on a desk: a board of gems in a wooden frame, ten rows of eight, and the Tool tray beside it with Bomb × 1 and Pick × 1, the counter 0/12 ordinary clears toward the next tool, and the Confirm and Cancel buttons, with the line Choose a group or a tool" width="400">
</picture>
<br><em><strong>Stone Collapse.</strong> Select a connected group of two or more stones of one colour, read the preview, and confirm.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/magnetic-blocks-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/magnetic-blocks-desk-light.webp" alt="Magnetic Blocks, challenge 1, on a desk: a well with bonded two-by-two blocks of gems along the floor, a falling block at the top, the Next floor and Current floor chips showing Calm, the objective Marked gem 0/3, the Floor Switch panel with Calm, Pull and Cancel buttons, and the buttons for the arrows, Rotate left, Rotate right, Hard drop, Place and Pause" width="360">
</picture>
<br><em><strong>Magnetic Blocks.</strong> Bonded 2×2 squares, a floor that turns magnetic on a schedule, and a one-use Floor Switch.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/shizen-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/shizen-desk-light.webp" alt="Shizen challenge 1 on a desk: a Colour Chains well with a few gems at the bottom and a pair at the top, the objective Target gems cleared 0 / 3 with a progress bar, Pieces left: 3, and the Next pair beside it" width="360">
</picture>
<br><em><strong>Shizen.</strong> Colour Chains with magnetic stones and one bounded rebound: a finite queue, a goal and a count of pieces left.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/arashi-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/arashi-desk-light.webp" alt="Arashi challenge 1 on a desk: a Colour Chains well with a few gems at the bottom and a pair at the top, the objective Target gems cleared 0 / 1 with a progress bar, Pieces left: 4, and the Next pair beside it" width="360">
</picture>
<br><em><strong>Arashi.</strong> Colour Chains with weather: plan around earthquakes that jumble stones and lightning that removes exposed ones.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/tool-tray-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/tool-tray-phone-light.webp" alt="The Gem Swap board and its tool tray on a phone: an eight by eight board of gems with their symbols, and under it the Tool tray with the Bomb × 1, Row clear × 1 and Colour clear × 1 buttons, the counter 0/12 ordinary clears toward the next tool, the Confirm, Cancel, Hint and Reshuffle buttons and the line Choose a gem or a tool" width="240">
</picture>
<br><em><strong>On a phone.</strong> The tool tray sits under the board, and every button is at least 44 pixels high.</em>
</td>
</tr>
</table>

## Use it in your project

### Install

```sh
npm install @johnmorrisdotca/houseki
# or: pnpm add @johnmorrisdotca/houseki
# or: yarn add @johnmorrisdotca/houseki
```

It is ES modules only, with its types included, and needs Node 22 or later outside a browser. A page with no bundler imports an engine from a CDN (`@0` is the major version): see the first example under [Examples](#examples).


Import a game directly from `@johnmorrisdotca/houseki/falling-triplets`, `@johnmorrisdotca/houseki/stone-collapse`, `@johnmorrisdotca/houseki/colour-chains`, `@johnmorrisdotca/houseki/gem-swap` or `@johnmorrisdotca/houseki/magnetic-blocks`, and the deterministic attraction, rebound and environment utilities from `@johnmorrisdotca/houseki/nature`. The main entry, `@johnmorrisdotca/houseki`, groups the same names as the namespaces `fallingTriplets`, `stoneCollapse`, `colourChains`, `gemSwap`, `nature` and `magneticBlocks`. The engines do not touch the DOM, storage or the network.

Every engine works the same way:

```ts
import { createGame, createLevel, applyAction, advanceTicks, legalActions, encodeGame, decodeGame } from "@johnmorrisdotca/houseki/colour-chains";

const level = createLevel(1);                       // a graded challenge; createGame({ seed }) is a free game
const move = applyAction(level, { kind: "rotate-clockwise" });
move.accepted;                                      // false when the action is not allowed
move.events;                                        // what happened, in order, for a screen to animate
const later = advanceTicks(move.state, 30).state;   // time is a count of ticks, never the clock
const saved = encodeGame(later);                    // a string; decodeGame(saved) is the same game again
```

Every function returns a new state and leaves the one it was given untouched. `legalActions(state)` lists what may be done now, so a bot or a test needs no knowledge of the rules. The two full-board games, Gem Swap and Stone Collapse, also have an undo and a hint (`undoGame` and `hintGame` in Gem Swap, `undo` and `requestHint` in Stone Collapse) and a restart; their stored tools are actions of their own.

To run the whole demo, `pnpm install && pnpm site`, then serve `site/` with any static server. A page of the demo takes `?seed=anything` in its address to start the same board again, and `?lang=ja` for Japanese.

### Additional campaigns


```ts
import { createShizenLevel, createArashiLevel } from "@johnmorrisdotca/houseki/colour-chains";
import { createLevel } from "@johnmorrisdotca/houseki/magnetic-blocks";

const magneticStones = createShizenLevel(1);
const weather = createArashiLevel(1);
const bondedSquares = createLevel(1);
```

Each of these three campaigns has 128 fixed puzzles: 32 entry-level, 32 easy, 32 intermediate, 24 hard and 8 expert. All selected puzzles are regraded from measured evidence on an integer 1–100 scale, then ordered within those bands. Use its manifest for stable IDs, bilingual titles, objectives, difficulty marks and verified winning plans. Select Shizen or Arashi in the Colour Chains demo, or a challenge in Magnetic Blocks. A campaign uses a finite queue with no falling clock; the goal and progress appear beside the board. Fixed rules stay visible, and the result offers replay or the next challenge. See the [campaign contract](docs/design/CAMPAIGN-EXTENSIONS.md). The [review workflow](docs/design/CAMPAIGN-REVIEW-WORKFLOW.md) and [design worksheet](docs/design/CAMPAIGN-DESIGN-TEMPLATE.md) explain how to measure, review and improve future campaigns.

### In a framework

The engines are plain functions with no framework code, so each framework holds a state and replaces it with what `applyAction` returns. Each of these is a Gem Swap board of buttons; the engine does the rules, and `advanceTicks` lets a swap settle.

#### React

```jsx
import { useState } from "react";
import { advanceTicks, applyAction, createGame, legalActions } from "@johnmorrisdotca/houseki/gem-swap";

export function Board() {
  const [game, setGame] = useState(() => createGame({ seed: "hello" }));
  const [chosen, setChosen] = useState(null);
  const press = (index) => {
    const swap = legalActions(game).find((a) => a.kind === "swap" && a.from === chosen && a.to === index);
    if (swap) setGame(advanceTicks(applyAction(game, swap).state, 200).state);
    setChosen(swap ? null : index);
  };
  return <div role="group" aria-label="Gem board" style={{ display: "grid", gridTemplateColumns: "repeat(8, 44px)" }}>
    {game.board.map((gem, index) => <button key={gem.id} aria-pressed={chosen === index} onClick={() => press(index)}>{gem.colour}</button>)}
  </div>;
}
```

#### Vue

```vue
<script setup>
import { ref, shallowRef } from "vue";
import { advanceTicks, applyAction, createGame, legalActions } from "@johnmorrisdotca/houseki/gem-swap";

const game = shallowRef(createGame({ seed: "hello" }));
const chosen = ref(null);
function press(index) {
  const swap = legalActions(game.value).find((a) => a.kind === "swap" && a.from === chosen.value && a.to === index);
  if (swap) game.value = advanceTicks(applyAction(game.value, swap).state, 200).state;
  chosen.value = swap ? null : index;
}
</script>

<template>
  <div role="group" aria-label="Gem board" style="display: grid; grid-template-columns: repeat(8, 44px)">
    <button v-for="(gem, index) in game.board" :key="gem.id" :aria-pressed="chosen === index" @click="press(index)">{{ gem.colour }}</button>
  </div>
</template>
```

#### Svelte

```svelte
<script>
  import { advanceTicks, applyAction, createGame, legalActions } from "@johnmorrisdotca/houseki/gem-swap";

  let game = createGame({ seed: "hello" });
  let chosen = null;
  function press(index) {
    const swap = legalActions(game).find((a) => a.kind === "swap" && a.from === chosen && a.to === index);
    if (swap) game = advanceTicks(applyAction(game, swap).state, 200).state;
    chosen = swap ? null : index;
  }
</script>

<div role="group" aria-label="Gem board" style="display: grid; grid-template-columns: repeat(8, 44px)">
  {#each game.board as gem, index (gem.id)}
    <button aria-pressed={chosen === index} on:click={() => press(index)}>{gem.colour}</button>
  {/each}
</div>
```

#### Angular

```ts no-check
import { Component, signal } from "@angular/core";
import { advanceTicks, applyAction, createGame, legalActions } from "@johnmorrisdotca/houseki/gem-swap";

@Component({
  selector: "app-board",
  standalone: true,
  template: `<div role="group" aria-label="Gem board" style="display: grid; grid-template-columns: repeat(8, 44px)">
    @for (gem of game().board; track gem.id; let index = $index) {
      <button [attr.aria-pressed]="chosen() === index" (click)="press(index)">{{ gem.colour }}</button>
    }
  </div>`,
})
export class BoardComponent {
  game = signal(createGame({ seed: "hello" }));
  chosen = signal<number | null>(null);
  press(index: number) {
    const swap = legalActions(this.game()).find((a) => a.kind === "swap" && a.from === this.chosen() && a.to === index);
    if (swap) this.game.set(advanceTicks(applyAction(this.game(), swap).state, 200).state);
    this.chosen.set(swap ? null : index);
  }
}
```

## Examples

Each example is a whole recipe: copy it and it works. The ones in TypeScript are run in CI against the built package (`pnpm test:readme`), so none of them is a guess, and the output shown is what they print.

### A Gem Swap board in a page, with no bundler

The engine draws nothing, so a page draws the state. Save this as a file and serve it: an eight-by-eight board of buttons, press one gem and then the one beside it, and the swap is made if the rules allow it. The module comes from a CDN, and `@0` is the major version.

```html
<!doctype html>
<meta charset="utf-8">
<title>Gem Swap</title>
<style>
  #board { display: grid; grid-template-columns: repeat(8, 44px); gap: 4px; }
  #board button { width: 44px; height: 44px; border-radius: 22px; border: 2px solid #333; }
  #board button[aria-pressed="true"] { outline: 3px solid black; }
</style>
<p id="score" role="status"></p>
<div id="board"></div>
<script type="module">
  import { advanceTicks, applyAction, createGame, legalActions } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/houseki@0/dist/gem-swap.js";

  const FILL = { red: "#c8372d", blue: "#2a5ea8", green: "#2f8a4f", gold: "#dfa11b", purple: "#7b4fa3", teal: "#1f9a9a" };
  let game = createGame({ seed: "hello" });
  let chosen = null;

  function draw() {
    document.getElementById("score").textContent = `Score ${game.score}, moves ${game.moves}`;
    document.getElementById("board").replaceChildren(...game.board.map((gem, index) => {
      const button = document.createElement("button");
      button.style.background = FILL[gem.colour];
      button.setAttribute("aria-label", gem.colour);          // a colour is also a word
      button.setAttribute("aria-pressed", String(chosen === index));
      button.onclick = () => {
        const swap = legalActions(game).find((action) => action.kind === "swap" && ((action.from === chosen && action.to === index) || (action.from === index && action.to === chosen)));
        if (chosen !== null && swap) game = advanceTicks(applyAction(game, swap).state, 200).state;   // time is a count of ticks
        chosen = chosen === null || swap ? null : index;
        draw();
      };
      return button;
    }));
  }
  draw();
</script>
```

### A challenge won by its recorded play

Every graded challenge ships a winning play, and the tests replay all 684. A server can do the same to check that a client really won, with no screen: start the level, make the recorded moves, and read the phase.

```ts
import { advanceTicks, applyAction, createLevel, levelManifest, statusOf } from "@johnmorrisdotca/houseki/falling-triplets";

const challenge = levelManifest[0]!;
console.log(challenge.number, challenge.title.en, "/", challenge.title.ja, `(${challenge.marks} of 5 marks)`);

let state = createLevel(1);
for (const move of challenge.witness) {
  while (state.active!.x < move.x) state = applyAction(state, { kind: "right" }).state;
  while (state.active!.x > move.x) state = applyAction(state, { kind: "left" }).state;
  state = applyAction(state, { kind: "hard-drop" }).state;
  state = advanceTicks(state, 200).state;                 // let it land and clear
}
console.log(statusOf(state));
```

```text
1 Diagonal Thread 7 / 斜めの糸 7 (1 of 5 marks)
{ phase: 'won', score: 72, maxChain: 1 }
```

### A bot that plays a free game

An engine lists what may be done now (`legalActions`), so a bot needs no knowledge of the rules. This one moves and cycles at random from a seeded stream and places every triplet, on the compact board, until the well is full.

```ts
import { advanceTicks, applyAction, createGame } from "@johnmorrisdotca/houseki/falling-triplets";

function stream(seed: number) {                            // a small seeded generator: the same game every run
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = stream(5);
let game = createGame({ mode: "relaxed", seed: "bot", preset: "compact" });
let pieces = 0;
while (game.phase === "falling" && pieces < 300) {
  for (let step = Math.floor(random() * 5); step > 0; step -= 1) game = applyAction(game, { kind: random() < 0.5 ? "left" : "right" }).state;
  if (random() < 0.5) game = applyAction(game, { kind: "cycle-forward" }).state;
  game = advanceTicks(applyAction(game, { kind: "place" }).state, 100).state;
  pieces += 1;
}
console.log(pieces, "triplets;", game.phase, "with score", game.score);
```

```text
11 triplets; lost with score 30
```

### Gem Swap: moves, hints and tools

A swap is `{ kind: "swap", from, to }` by cell number, a hint is an action of its own, and a game that has used one is marked assisted. Stored tools are actions too.

```ts
import { advanceTicks, applyAction, createGame, hintGame, legalActions, statusOf } from "@johnmorrisdotca/houseki/gem-swap";

const game = createGame({ seed: "x" });
console.log(legalActions(game).length, "swaps; the first is", legalActions(game)[0]);
const moved = advanceTicks(applyAction(game, { kind: "swap", from: 0, to: 1 }).state, 200).state;
console.log("score", moved.score, "after", moved.moves, "move; phase", moved.phase);

const hinted = hintGame(game).state;
console.log("hint used, so the game is marked assisted:", statusOf(hinted).assisted);

const withTools = createGame({ seed: "x", tools: true });
console.log(withTools.inventory, legalActions(withTools).filter((action) => action.kind === "select-tool").length, "tools to choose");
```

```text
17 swaps; the first is { kind: 'swap', from: 0, to: 1 }
score 90 after 1 move; phase ready
hint used, so the game is marked assisted: true
{ bomb: 1, 'row-clear': 1, 'colour-clear': 1 } 3 tools to choose
```

### Stone Collapse: choose a group, look, then confirm

Stone Collapse is chosen by group: select a stone, read the score of the preview in `statusOf`, then `confirm` or `cancel`. Nothing is spent until it is confirmed.

```ts
import { applyAction, createGame, legalActions, statusOf } from "@johnmorrisdotca/houseki/stone-collapse";

let game = createGame({ seed: "x" });
const firstGroup = legalActions(game)[0]!;                  // select the first stone that has a group
console.log(firstGroup);
game = applyAction(game, firstGroup).state;
console.log("preview", statusOf(game).previewScore, "points; actions now:", legalActions(game).slice(-2));
const confirmed = applyAction(game, { kind: "confirm" });
console.log(confirmed.accepted, "score", statusOf(confirmed.state).score);
```

```text
{ kind: 'select', stoneId: 3 }
preview 10 points; actions now: [ { kind: 'confirm' }, { kind: 'cancel' } ]
true score 10
```

### Save a game and read it back

A game is its settings and the actions taken, so a save is that list as text, and reading it plays the actions again. A save that does not match its own record, or is not a save, is refused: `decodeGame` throws, so a server can catch it and say the save is bad.

```ts
import { advanceTicks, applyAction, createGame, decodeGame, encodeGame } from "@johnmorrisdotca/houseki/falling-triplets";

let game = createGame({ mode: "relaxed", seed: "first-game" });
game = applyAction(game, { kind: "cycle-forward" }).state;
game = advanceTicks(applyAction(game, { kind: "place" }).state, 22).state;

const saved = encodeGame(game);
console.log(saved.length > 1000, decodeGame(saved)?.score === game.score);
for (const bad of ["not a save", saved.replace("first-game", "another")]) {
  try {
    decodeGame(bad);
  } catch (error) {
    console.log("refused:", (error as Error).message);
  }
}
```

```text
true true
refused: Unexpected token 'o', "not a save" is not valid JSON
refused: Save checkpoint does not match its action recording
```

### Daily: the same board for everyone on a date

A Daily game takes the date from the host, in UTC, as its seed, and the queue of pieces comes from the date alone.

```ts
import { createGame } from "@johnmorrisdotca/houseki/falling-triplets";

const today = createGame({ mode: "daily", seed: "2026-10-06" });
const again = createGame({ mode: "daily", seed: "2026-10-06" });
const tomorrow = createGame({ mode: "daily", seed: "2026-10-07" });
console.log(JSON.stringify(today.next) === JSON.stringify(again.next), JSON.stringify(today.next) === JSON.stringify(tomorrow.next));
```

```text
true false
```

### The three campaigns that came after

Magnetic Blocks, Shizen and Arashi each have 128 fixed puzzles ordered from easy to hard, with stable IDs, titles in both languages, an objective and a verified winning plan. A campaign has a finite queue and no falling clock.

```ts
import { createArashiLevel, createShizenLevel, arashiLevelManifest, shizenLevelManifest } from "@johnmorrisdotca/houseki/colour-chains";
import { createLevel, levelManifest } from "@johnmorrisdotca/houseki/magnetic-blocks";

console.log(levelManifest.length, shizenLevelManifest.length, arashiLevelManifest.length);
console.log(levelManifest[0]!.title.en, "|", shizenLevelManifest[0]!.title.ja, "|", arashiLevelManifest[0]!.title.en);
console.log(createLevel(1).phase, createShizenLevel(1).settings.goal, createArashiLevel(1).settings.weather);
```

```text
128 128 128
Open landing 001 | 青いガイドでリバウンド | Leave space above the target
falling { kind: 'clear-targets', targetIds: [ 1, 2, 3 ] } frequent
```

### A page that plays a level with the keyboard

The demo's players are the worked example of drawing the states: `demo/chains.js`, `demo/blocks.js`, `demo/tools.js` and `demo/demo.js` are plain DOM, with the keyboard and keypad scheduled through `createInputScheduler`, which turns held keys into actions on a count of ticks.

```ts no-run
import { actionsForTick, advanceTicks, applyAction, createInputScheduler, createLevel, queueInputEdge } from "@johnmorrisdotca/houseki/falling-triplets";

let game = createLevel(1);
let input = createInputScheduler();
addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") input = queueInputEdge(input, { kind: "left" });
  if (event.key === "ArrowRight") input = queueInputEdge(input, { kind: "right" });
  if (event.key === " ") input = queueInputEdge(input, { kind: "hard-drop" });
});
setInterval(() => {                                  // the page owns the clock; the engine counts ticks
  const [actions, next] = actionsForTick(input);
  input = next;
  for (const action of actions) game = applyAction(game, action).state;
  game = advanceTicks(game, 1).state;
}, 50);
```

## API

Every export of every entry point is in the [API reference](https://johnmorrisdotca.github.io/houseki/api.html), made from the source when the demo is built, with each signature and doc comment. A test fails when a public export has no doc comment.

### Entry points

| Import | What it holds |
| --- | --- |
| `@johnmorrisdotca/houseki` | Every engine, grouped by game as `fallingTriplets`, `stoneCollapse`, `colourChains`, `gemSwap`, `nature` and `magneticBlocks` |
| `@johnmorrisdotca/houseki/falling-triplets` | Falling Triplets: 100 challenges, three lessons, saves |
| `@johnmorrisdotca/houseki/colour-chains` | Colour Chains: 50 challenges, three lessons, and the Shizen and Arashi campaigns |
| `@johnmorrisdotca/houseki/stone-collapse` | Stone Collapse: 100 challenges, three lessons, hints, undo and stored tools |
| `@johnmorrisdotca/houseki/gem-swap` | Gem Swap: 50 challenges, three lessons, hints, undo, stored tools and the Black Hole |
| `@johnmorrisdotca/houseki/magnetic-blocks` | Magnetic Blocks: bonded squares, the magnetic floor and its 128 challenges |
| `@johnmorrisdotca/houseki/nature` | The deterministic attraction, rebound and environment utilities |

### The calls to learn first

| Call | What it does |
| --- | --- |
| `createGame(options)` and `createLevel(number)` | A free game from a seed, and a graded challenge |
| `applyAction(state, action)` | `{ state, events, accepted }`: the new state, what happened, and whether the action was allowed |
| `advanceTicks(state, n)` | Time passing, as a count of ticks and never the clock |
| `legalActions(state)` | Every action that may be taken now |
| `encodeGame(state)` and `decodeGame(text)` | A save as text, and back; a save that does not check is refused with an error |
| `statusOf(state)` | The phase, score and what a screen needs to say |

## Theming

The engines draw nothing. The demo's players take their colours from the family's stylesheet, `demo/family.css`: custom properties for the page, ink, accent and the felt the board sits on, which follow `prefers-color-scheme`, and five table cloths (green, blue, red, black and wood) chosen in the header. The boards add their own `--board`, `--frame` and `--gem-edge` in `demo/houseki.css`, and a Board material choice (ivory, slate or wood). Gems are told apart by their symbol as well as their colour, so no choice of cloth hides a colour.

## Limits

| What | Limit |
| --- | --- |
| Colours | 4 to 6 |
| Colour Chains | 5 to 16 columns and 12 to 32 visible rows |
| Magnetic Blocks | 4 to 16 columns and 4 to 32 rows; at most 200 pieces in the demo |
| Stone Collapse | presets from 6×8 to 16×10 and 8×32 deep; shaped boards by mask |
| Daily mode | the standard board and colour count only, from a date |
| Saves | a replay of the actions taken, checked when it is decoded; a save that does not match its own record is refused |
| Tools | capped inventory, earned by ordinary clears, and not offered in Daily or in authored challenges |

## Accessibility

The engines draw nothing, so what they can do is give a player the facts it needs; what a person hears and presses is the player's. The demo's players are the worked example, and what follows is what they do and what they do not yet.

- **Colour is never alone.** Every colour has its own permanent symbol on the gem (circle, square, triangle, diamond, cross and a sixth), kept under selection and flashes, so no choice of cloth or board material hides a colour. Special gems add their marks around the symbol and do not replace it.
- **The keyboard and the keypad play every game.** Falling games: ← → move, ↑ rotate, Z and X reverse and cycle, ↓ soft drop, Space place or drop, Escape pause, and the keypad's 4, 6, 7, 9, 5 and 2 for the same. The full-board games are a `grid` with one tab stop: Tab reaches it, the arrow keys move between gems, and Enter or Space chooses one. Every on-screen button is also at least 44 pixels high.
- **A status line that is spoken.** What to do next and what happened ("Place the triplet", "Choose a gem or a tool.", the result of a challenge) is in an `aria-live="polite"` line, and the goal's progress is a labelled `progress` element with its minimum, maximum and value, so a screen reader hears meaningful thresholds and the result and not every animation frame.
- **Reduced motion is respected.** An Animation setting is on by default, a Reduce motion choice turns every movement off, and the system's `prefers-reduced-motion` stills them even when Animation is on: the final cells are drawn at once and nothing about timing or the rules changes.
- **Nothing is timed against you in Relaxed play**, and a challenge has no falling clock.
- **Light and dark** follow the device, and every word of the demo is in English and Japanese.
- **Not yet.** In the falling games the well is drawn as one image named "Gem board", so a screen reader does not read out which gem is where; the full-board games' grid does name each cell. The colour pairs have not been measured against WCAG contrast ratios, and the design pack asks for that to be done. The Japanese has not been read by a native reader (see [Languages](#languages)).

## Browser support

The engines run wherever JavaScript does: Node 22 or later, and current Chrome, Edge, Firefox and Safari. The demo's tests run in Chromium and WebKit, at a phone's width and a desk's.

## Languages

The demo is in English and Japanese: every lesson and challenge title, button, status line and the family's header and footer. The Japanese has not yet been read by a native reader: corrections are welcome as a *Fix a translation* issue.

## Roadmap

Physical-device feel testing, a fluent Japanese review and human difficulty review of the campaigns are next, and new techniques for later campaigns. [docs/COVERAGE.md](docs/COVERAGE.md) says what is verified by tests and what is not. Nothing here is promised for a date.

## Architecture

```text
src/
├── colour-chains/
│   ├── challenge.ts
│   ├── content-data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine.ts
│   ├── input.ts
│   ├── match.ts
│   ├── persistence.ts
│   ├── random.ts
│   ├── types.ts
│   └── validation.ts
├── colour-chains.ts
├── falling-triplets/
│   ├── content-data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine.ts
│   ├── input.ts
│   ├── match.ts
│   ├── random.ts
│   └── types.ts
├── falling-triplets.ts
├── gem-swap/
│   ├── black-hole.ts
│   ├── board.ts
│   ├── content.ts
│   ├── engine.ts
│   ├── persistence.ts
│   ├── practice.ts
│   ├── random.ts
│   ├── specials.ts
│   ├── tools.ts
│   └── types.ts
├── gem-swap.ts
├── index.ts
├── magnetic-blocks/
│   ├── content-data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine.ts
│   ├── persistence.ts
│   ├── physics.ts
│   ├── random.ts
│   ├── types.ts
│   └── validation.ts
├── magnetic-blocks.ts
├── nature/
│   ├── attraction.ts
│   ├── environment.ts
│   ├── marking.ts
│   ├── random.ts
│   ├── rebound.ts
│   ├── state.ts
│   ├── types.ts
│   └── validation.ts
├── nature.ts
├── stone-collapse/
│   ├── content-data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine.ts
│   ├── persistence.ts
│   ├── types.ts
│   └── validation.ts
└── stone-collapse.ts
```

The [design pack](docs/design/README.md) specifies the rules, controls, materials, accessibility, level generation, grading, persistence and acceptance checks of every game; [level generation](docs/design/LEVEL-GENERATION.md) follows a deliberate complete count: generate and prove original boards, remove duplicates, grade the decisions a player faces, then sort and number from easy to hard.

## The name

Houseki (宝石) is Japanese for a gem or precious stone: the pieces of these games are cut and polished, and the games are small.

## Where it comes from

Match games are an old family and their rules are common property. These five are original: the rules are written out in the design pack in our own words, every board is generated and checked by the repository's own scripts, and the pictures are drawn in code. No art, sound or level comes from another game.

### Used by

Using Houseki in something? Open an *Add my project* issue and we will add you.

### The family

<!-- family:start (made by scripts/family-readme.mjs from scripts/family-template.mjs; change those, not this) -->
Houseki is one of twenty-four packages, each made for the same site, each at
[github.com/johnmorrisdotca](https://github.com/johnmorrisdotca). The code of every one is MIT.

- [Korokoro](https://github.com/johnmorrisdotca/korokoro) (コロコロ): dice, with notation, exact odds, real sounds and the dice of many games. [Demo](https://johnmorrisdotca.github.io/korokoro/).
- [Kyuubu](https://github.com/johnmorrisdotca/kyuubu) (キューブ): a turning cube for the browser, 2×2 to 7×7, with record solves to replay. [Demo](https://johnmorrisdotca.github.io/kyuubu/).
- [Hitotsu](https://github.com/johnmorrisdotca/hitotsu) (一つ): a colour-card shedding game for two to eight, with the house rules people play. [Demo](https://johnmorrisdotca.github.io/hitotsu/).
- [Toranpu](https://github.com/johnmorrisdotca/toranpu) (トランプ): a deck of playing cards, card games with computer players, and solitaires. [Demo](https://johnmorrisdotca.github.io/toranpu/).
- [Tane](https://github.com/johnmorrisdotca/tane) (種): seeded random numbers and daily seeds, the same in every browser and on every server. [Demo](https://johnmorrisdotca.github.io/tane/).
- [Narabe](https://github.com/johnmorrisdotca/narabe) (並べ): one rules engine for abstract board games, from gomoku and Reversi to Go and checkers. [Demo](https://johnmorrisdotca.github.io/narabe/).
- [Tenka](https://github.com/johnmorrisdotca/tenka) (天下): world conquest for two to six, on a map of the real world. [Demo](https://johnmorrisdotca.github.io/tenka/).
- [Kumimoji](https://github.com/johnmorrisdotca/kumimoji) (組み文字): a crossword tile race, in English and Japanese kana. [Demo](https://johnmorrisdotca.github.io/kumimoji/).
- [Tsunagi](https://github.com/johnmorrisdotca/tsunagi) (繋ぎ): a line-joining logic puzzle whose every level has exactly one answer. [Demo](https://johnmorrisdotca.github.io/tsunagi/).
- [Jarajara](https://github.com/johnmorrisdotca/jarajara) (ジャラジャラ): mahjong tiles drawn as SVG, stacked layouts, and the matching solitaire Awase. [Demo](https://johnmorrisdotca.github.io/jarajara/).
- [Suido](https://github.com/johnmorrisdotca/suido) (水道): a pipe puzzle: turn the pieces until the water reaches every drain. [Demo](https://johnmorrisdotca.github.io/suido/).
- [Domino](https://github.com/johnmorrisdotca/domino) (ドミノ): dominoes and Mexican Train. [Demo](https://johnmorrisdotca.github.io/domino/).
- [Kotoba](https://github.com/johnmorrisdotca/kotoba) (言葉): word lists and word-game rules in English, French, German and Japanese. [Demo](https://johnmorrisdotca.github.io/kotoba/).
- [Sugoroku](https://github.com/johnmorrisdotca/sugoroku) (双六): backgammon and its variants, with the doubling cube and match play. [Demo](https://johnmorrisdotca.github.io/sugoroku/).
- [Kazu](https://github.com/johnmorrisdotca/kazu) (数): grid number puzzles: Sudoku and its variants, Futoshiki and Skyscrapers. [Demo](https://johnmorrisdotca.github.io/kazu/).
- [Meikyuu](https://github.com/johnmorrisdotca/meikyuu) (迷宮): mazes on squares, hexagons, triangles and circles, made from a seed and drawn through with a finger or the mouse. [Demo](https://johnmorrisdotca.github.io/meikyuu/).
- [Hikidashi](https://github.com/johnmorrisdotca/hikidashi) (引き出し): a drawer of small Japanese text tools: era dates, kanji numerals, readings and sentence difficulty. [Demo](https://johnmorrisdotca.github.io/hikidashi/).
- [Chizu](https://github.com/johnmorrisdotca/chizu) (地図): maps of the world and of countries' regions, in English and Japanese, with a quiz and callouts. [Demo](https://johnmorrisdotca.github.io/chizu/).
- [Bushu](https://github.com/johnmorrisdotca/bushu) (部首): find a kanji by the parts it is made of. [Demo](https://johnmorrisdotca.github.io/bushu/).
- [Tobiishi](https://github.com/johnmorrisdotca/tobiishi) (飛び石): peg solitaire with nine boards and seeded solvable challenges. [Demo](https://johnmorrisdotca.github.io/tobiishi/).
- [Jirai](https://github.com/johnmorrisdotca/jirai) (地雷): minesweeper on shaped grids with verified no-guess boards. [Demo](https://johnmorrisdotca.github.io/jirai/).
- [Gunjin](https://github.com/johnmorrisdotca/gunjin) (軍人): five hidden-rank strategy games with pass-the-device play. [Demo](https://johnmorrisdotca.github.io/gunjin/).
- [Karakuri](https://github.com/johnmorrisdotca/karakuri) (からくり): eight hyper-casual puzzle games, some of them physics: draw a shield, pull pins, cut ropes, slide blocks, pour tubes. [Demo](https://johnmorrisdotca.github.io/karakuri/).
- [Houseki](https://github.com/johnmorrisdotca/houseki) (宝石): gem and stone matching puzzles: falling triplets, stone collapse, colour chains and gem swap. [Demo](https://johnmorrisdotca.github.io/houseki/).

**This package is Houseki.** The demos of all twenty-four share one header and footer, so each links the rest.
<!-- family:end -->

## Development

```sh
pnpm install
pnpm check              # lint, types and tests: every game's rules, every campaign's recorded wins
pnpm test:package       # pack it as npm does, install it in an empty project, import every entry
pnpm test:demo          # build the demo and play it in a real browser, at a phone's width and a desk's
pnpm site               # build the demo and the API reference into site/
pnpm test:readme        # run every example in this README against the built package
pnpm screenshots:readme # take the README's pictures from the built demo, in light and dark
```

## Contributing

Ideas, bug reports and pull requests are welcome in the [issues](https://github.com/johnmorrisdotca/houseki/issues). See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Changes

Every release is written up in [CHANGELOG.md](./CHANGELOG.md). The latest release, 0.3.0, makes Magnetic Blocks show a level's fixed rules as soon as the level is chosen and give free play its own choices back, makes Space do what the ghost showed, lets a big board be scrolled from the keyboard on all three falling players, and adds `settledCells` to the Shizen hard-drop preview.

## Licence

[MIT](./LICENSE) © John Morris. The code, the boards and the words are all the package's own. Report vulnerabilities through [SECURITY.md](./SECURITY.md).

