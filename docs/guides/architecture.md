---
title: Architecture and determinism
section: explanation
order: 11
description: Read the original complete source tree and engine design.
---

## Original architecture

```text
src/
├── colour-chains/
│   ├── challenge.ts
│   ├── content.data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine-actions.ts
│   ├── engine-board.ts
│   ├── engine.ts
│   ├── input.ts
│   ├── match.ts
│   ├── persistence.ts
│   ├── random.ts
│   ├── types.ts
│   └── validation.ts
├── colour-chains.ts
├── falling-triplets/
│   ├── content.data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine-codec.ts
│   ├── engine-play.ts
│   ├── engine-setup.ts
│   ├── engine-waves.ts
│   ├── engine.ts
│   ├── input.ts
│   ├── match.ts
│   ├── random.ts
│   └── types.ts
├── falling-triplets.ts
├── gem-swap/
│   ├── black-hole.ts
│   ├── board.ts
│   ├── content.data.ts
│   ├── content.ts
│   ├── engine-actions.ts
│   ├── engine-create.ts
│   ├── engine-setup.ts
│   ├── engine-ticks.ts
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
│   ├── content.data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine-core.ts
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
│   ├── content.data.ts
│   ├── content-types.ts
│   ├── content.ts
│   ├── engine-resolve.ts
│   ├── engine-setup.ts
│   ├── engine.ts
│   ├── persistence.ts
│   ├── types.ts
│   └── validation.ts
└── stone-collapse.ts
```

The [design pack](../design/README.md) specifies the rules, controls, materials, accessibility, level generation, grading, persistence and acceptance checks of every game; [level generation](../design/LEVEL-GENERATION.md) follows a deliberate complete count: generate and prove original boards, remove duplicates, grade the decisions a player faces, then sort and number from easy to hard.
