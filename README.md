# Houseki · 宝石

[![Checks](https://github.com/johnmorrisdotca/houseki/actions/workflows/check.yml/badge.svg)](https://github.com/johnmorrisdotca/houseki/actions/workflows/check.yml) [![MIT licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)

Original gem and stone puzzle games with immutable TypeScript rules and a shared English/Japanese player.

**Initial release:** four playable games with tested rules, campaigns and demos. Physical-device feel, fluent Japanese copy and human difficulty review remain ongoing. Magnetic Blocks and nature variants are experimental. Website integration is maintained separately.

| Game | Distinctive mechanic |
| --- | --- |
| Falling Triplets | Cycle a falling vertical triplet; clear horizontal, vertical and diagonal lines |
| Stone Collapse | Select connected groups; plan removal order and column compression |
| Colour Chains | Rotate falling pairs; build connected groups and cascading chains |
| Gem Swap | Swap neighbours; create and combine specials to complete objectives |

An optional experimental `magnetic-blocks` entry point provides bonded 2×2 squares, magnetic floor schedules, a one-use Floor Switch and impact drops. [Play its demo](https://johnmorrisdotca.github.io/houseki/blocks.html). It has no graded campaign yet. The `nature` entry point exposes deterministic attraction, rebound and environment utilities.

![Falling Triplets demo](https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/falling-triplets-desktop.png)

![Colour Chains demo](https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/colour-chains-desktop.png)

![Gem Swap demo](https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/gem-swap-desktop.png)

![Stone Collapse demo](https://raw.githubusercontent.com/johnmorrisdotca/houseki/main/docs/images/stone-collapse-desktop.png)

[API reference](https://johnmorrisdotca.github.io/houseki/api.html) is generated locally by `pnpm site`; the hosted page is available alongside the demos. [Implementation PR](https://github.com/johnmorrisdotca/houseki/pull/1).

## Design and progression

The [design pack](https://github.com/johnmorrisdotca/houseki/blob/main/docs/design/README.md) specifies rules, controls, materials, accessibility, generation, grading, persistence and acceptance checks. [Level generation](https://github.com/johnmorrisdotca/houseki/blob/main/docs/design/LEVEL-GENERATION.md) follows a deliberate complete count and measured progression: generate and prove original boards, remove duplicates, grade player-facing decisions, then sort and number from easy to hard. Stable content IDs preserve saved progress across future ordering changes.

The shared player uses the family's ivory, brass and felt palette, permanent colour symbols and configurable boards. Each set of three interactive lessons is separate from the graded campaign. Physical-device feel testing and fluent Japanese copy review are recorded independently from automated checks.

## Local development

Requires Node.js 22 or newer and pnpm.

```sh
pnpm install
pnpm build
pnpm test
pnpm demo
```

The local demo instructions print its address. The first page plays Falling Triplets; `chains.html` plays Colour Chains; `tools.html` plays Gem Swap and Stone Collapse with optional stored-tool trays. The campaigns contain 100 Falling Triplets, 50 Colour Chains, 100 Stone Collapse and 50 Gem Swap challenges, ordered by measured difficulty. Finite goals show progress and remaining pieces or moves. All players share the family’s five board-cloth colours, persistent piece appearance, a default-on Animation setting and reduced-motion support. Finished runs show an outcome and final score with replay or next-level actions. Fixed campaign and Daily settings display their actual board dimensions. See [CONTRIBUTING.md](https://github.com/johnmorrisdotca/houseki/blob/main/CONTRIBUTING.md) for contribution conventions and [the implementation plan](https://github.com/johnmorrisdotca/houseki/blob/main/docs/design/IMPLEMENTATION-PLAN.md) for bounded review milestones.

## Engine example

The currently reviewed Falling Triplets entry point is independent of DOM, storage and network access:

```ts
import { createGame, applyAction, advanceTicks } from '@johnmorrisdotca/houseki/falling-triplets';

let game = createGame({ mode: 'relaxed', seed: 'first-game' });
game = applyAction(game, { kind: 'cycle-forward' }).state;
game = applyAction(game, { kind: 'place' }).state;
game = advanceTicks(game, 22).state;
```

The package exposes an entry point for each game. The generated API reference lists every exported function, type and setting.

## Licence

[MIT](LICENSE), copyright John Morris. Original game content and presentation are maintained in this repository. Shared family files preserve their existing copyright notices. Report vulnerabilities through [SECURITY.md](https://github.com/johnmorrisdotca/houseki/blob/main/SECURITY.md).

## Stored tools

[Stored-tool rules](https://github.com/johnmorrisdotca/houseki/blob/main/docs/design/STORED-TOOLS.md) distinguish inventory from special gems on the board. Gem Swap offers Bomb, Row clear and Colour clear; Stone Collapse offers Bomb and Pick. Select a tool and an occupied square, inspect the highlighted effect, then confirm or cancel. Ordinary clears earn capped inventory; using tools marks the run assisted. Daily and existing authored challenges keep their declared tool-free rules. Gem Swap also offers an optional earned [Black Hole](https://github.com/johnmorrisdotca/houseki/blob/main/docs/design/BLACK-HOLE.md): consume nearby gems with a visibly shrinking capacity and bounded lifetime. Enable it before starting a casual board.

## Package entry points

Import a game directly from `@johnmorrisdotca/houseki/falling-triplets`, `/stone-collapse`, `/colour-chains` or `/gem-swap`. The root entry groups the same APIs as `fallingTriplets`, `stoneCollapse`, `colourChains` and `gemSwap` namespaces. Engines do not depend on the DOM or external services.

```ts
import { colourChains } from '@johnmorrisdotca/houseki';
const firstChallenge = colourChains.createLevel(1);
const objective = firstChallenge.settings.goal;
```

Run `npm run check:package` to build, pack and install the actual tarball into a temporary consumer and check every game entry point. `npm run test:browser` verifies desktop and phone player controls, witnessed campaign wins, progress, tool use, persistence of animation preferences and reduced motion.

## The name

Houseki (宝石) is Japanese for gemstones.
