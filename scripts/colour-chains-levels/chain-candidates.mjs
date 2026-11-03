import { createChallenge } from "../../dist/colour-chains.js";
import {
  cell,
  GENERATION_REVISION,
  GRADING_VERSION,
  HEIGHT,
  hash,
  rng,
  SAMPLE_BUDGET,
  scoreFor,
  WIDTH,
} from "./core.mjs";
import {
  candidate,
  canonicalKey,
  hasInitialMatch,
  playPlacement,
  splitCandidate,
  stableColumns,
  withIds,
} from "./linear-boards.mjs";

function chainCandidate(serial) {
  const x = 2 + (serial % 2);
  const pattern = serial % 3;
  const reds = [
    [
      [x - 2, 11],
      [x - 1, 11],
      [x - 1, 10],
    ],
    [
      [x - 1, 11],
      [x - 1, 10],
      [x - 2, 10],
    ],
    [
      [x - 1, 11],
      [x - 2, 11],
      [x - 2, 10],
    ],
  ][pattern];
  const colours = Array(WIDTH * HEIGHT).fill(null);
  for (const [rx, ry] of reds) colours[cell(rx, ry)] = "red";
  for (const y of [9, 10, 11]) colours[cell(x, y)] = "blue";
  // Stable alternating supports below any elevated red stones.
  for (const [rx, ry] of reds)
    for (let y = ry + 1; y < HEIGHT; y++)
      if (!colours[cell(rx, y)]) colours[cell(rx, y)] = (y + rx + serial) % 2 ? "gold" : "green";
  // Decorate a distant column to create board-specific space constraints without an initial match.
  const farX = x === 2 ? 5 : 0;
  const stackHeight = serial % 5;
  for (let y = HEIGHT - stackHeight; y < HEIGHT; y++) colours[cell(farX, y)] = (y + serial) % 2 ? "green" : "gold";
  if (!stableColumns(colours) || hasInitialMatch(colours)) return null;
  const board = withIds(colours);
  const queue = [
    ["blue", "red"],
    ["green", "gold"],
  ];
  const goal = { kind: "minimum-chain", chain: 2 };
  const witness = { pivotX: x, orientation: "up" };
  const base = {
    id: `chain-${serial}`,
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: `${GENERATION_REVISION}:chain:${serial}`,
    board,
    queue,
    goal,
  };
  let start;
  try {
    start = createChallenge({ ...base, witness: [witness] });
  } catch {
    return null;
  }
  const legal = [];
  const wins = [];
  for (let pivotX = 0; pivotX < WIDTH; pivotX++)
    for (const orientation of ["up", "right", "down", "left"]) {
      const placement = { pivotX, orientation };
      const outcome = playPlacement(start, placement);
      if (!outcome) continue;
      legal.push(outcome);
      if (outcome.state.phase === "won") wins.push({ placement, outcome });
    }
  if (!wins.some((item) => item.placement.pivotX === x && item.placement.orientation === "up") || !legal.length)
    return null;
  const random = rng(`${GENERATION_REVISION}|chain-samples|${serial}`);
  let successes = 0;
  for (let i = 0; i < SAMPLE_BUDGET; i++)
    if (legal[Math.floor(random() * legal.length)]?.state.phase === "won") successes++;
  const metrics = {
    placementProbes: WIDTH * 4,
    legalPlacements: legal.length,
    goalPreservingPlacements: wins.length,
    forcedPlacementShare: wins.length === 1 ? 1 : 0,
    seededPlayoutSamples: SAMPLE_BUDGET,
    seededPlayoutQueueDepth: 1,
    seededPlayoutSuccesses: successes,
    seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)),
    setupPairsBeforePayoff: 0,
    requiredSetupPairs: 0,
    verifiedSetupDependencies: 0,
    requiredChainDepth: 2,
    requiredRotations: 0,
    requiredWallKicks: 0,
    splitLandingDependencies: 0,
    planningLength: 1,
  };
  const level = {
    id: `chains-${hash(JSON.stringify([colours, pattern, "chain"])).slice(0, 12)}`,
    number: 0,
    title: { en: `Two-wave chain: ${pattern + 1}`, ja: `2段連鎖：${pattern + 1}` },
    canonicalKeyHash: "",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: base.seed,
    board,
    queue,
    goal,
    witness: [witness],
    tags: ["two-wave-chain", "gravity-setup"],
    rawMetrics: metrics,
    score: scoreFor(metrics),
    marks: 1,
    gradingVersion: GRADING_VERSION,
    proofStatus: "engine-witness-verified",
    reviewStatus: "human-review-pending",
  };
  level.canonicalKeyHash = hash(canonicalKey(level));
  level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
export function multiPairCandidate(serial) {
  const row = 5 + (serial % 3);
  const shift = Math.floor(serial / 3) % 3;
  const gapX = shift + 3;
  const colours = Array(WIDTH * HEIGHT).fill(null);
  const targetPositions = [];
  for (let x = shift; x < shift + 3; x++) {
    const at = cell(x, row);
    colours[at] = "red";
    targetPositions.push(at);
  }
  // Rows below the target form settled supports, but the missing target column starts short.
  const supportColour = new Map();
  let previous = null;
  const initialSupportCount = HEIGHT - row - 1 - 4;
  const setupColours = new Map([
    [11 - initialSupportCount, "blue"],
    [10 - initialSupportCount, "green"],
    [9 - initialSupportCount, "gold"],
    [8 - initialSupportCount, "blue"],
  ]);
  for (let y = HEIGHT - 1; y > row; y--) {
    const pairColour = setupColours.get(y);
    let support = ["blue", "green", "gold"].find((colour) => colour !== pairColour && colour !== previous);
    if (!support) support = ["blue", "green", "gold"].find((colour) => colour !== pairColour) ?? "blue";
    supportColour.set(y, support);
    previous = support;
    for (let x = shift; x < shift + 3; x++) colours[cell(x, y)] = support;
  }
  for (let i = 0; i < initialSupportCount; i++) {
    const y = HEIGHT - 1 - i;
    const forbidden = supportColour.get(y);
    colours[cell(gapX, y)] = ["blue", "green", "gold"].find(
      (colour) => colour !== forbidden && colour !== (i ? colours[cell(gapX, y + 1)] : null),
    );
  }
  // Sparse side stacks vary the position problem while preserving an open setup column.
  const farX = gapX < 4 ? 5 : 0;
  const height = serial % 4;
  for (let y = HEIGHT - height; y < HEIGHT; y++) colours[cell(farX, y)] = ["blue", "green", "gold"][(y + serial) % 3];
  if (!stableColumns(colours) || hasInitialMatch(colours)) return null;
  const board = withIds(colours);
  const targetIds = targetPositions.map((at) => board[at].id);
  const queue = [
    ["blue", "green"],
    ["gold", "blue"],
    ["red", "green"],
  ];
  const goal = { kind: "clear-targets", targetIds };
  const witness = [
    { pivotX: gapX, orientation: "up" },
    { pivotX: gapX, orientation: "up" },
    { pivotX: gapX, orientation: "up" },
  ];
  const base = {
    id: `setup-${serial}`,
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: `${GENERATION_REVISION}:setup:${serial}`,
    board,
    queue,
    goal,
  };
  let initial;
  try {
    initial = createChallenge({ ...base, witness });
  } catch {
    return null;
  }
  let proofState = initial;
  const stateAtDecision = [];
  for (const step of witness) {
    stateAtDecision.push(proofState);
    const result = playPlacement(proofState, step);
    if (!result || result.state.phase === "lost") return null;
    proofState = result.state;
  }
  if (proofState.phase !== "won") return null;
  const dependencyIndices = [];
  for (let i = 0; i < 2; i++) {
    let invalidatingChange = false;
    for (let pivotX = 0; pivotX < WIDTH && !invalidatingChange; pivotX++)
      for (const orientation of ["up", "right", "down", "left"]) {
        if (pivotX === witness[i].pivotX && orientation === witness[i].orientation) continue;
        const changed = witness.map((step) => ({ ...step }));
        changed[i] = { pivotX, orientation };
        try {
          createChallenge({ ...base, witness: changed });
        } catch {
          invalidatingChange = true;
          break;
        }
      }
    if (invalidatingChange) dependencyIndices.push(i);
  }
  if (dependencyIndices.length !== 2) return null;
  let placementProbes = 0;
  let legalPlacements = 0;
  let finalWinningChoices = 0;
  for (const [stepIndex, start] of stateAtDecision.entries()) {
    for (let pivotX = 0; pivotX < WIDTH; pivotX++)
      for (const orientation of ["up", "right", "down", "left"]) {
        placementProbes++;
        const outcome = playPlacement(start, { pivotX, orientation });
        if (outcome) {
          legalPlacements++;
          if (stepIndex === witness.length - 1 && outcome.state.phase === "won") finalWinningChoices++;
        }
      }
  }
  const randomPlayout = rng(`${GENERATION_REVISION}|multi-samples|${serial}`);
  let successes = 0;
  for (let sample = 0; sample < SAMPLE_BUDGET; sample++) {
    let state = initial;
    let failed = false;
    for (let pairIndex = 0; pairIndex < queue.length; pairIndex++) {
      const options = [];
      for (let pivotX = 0; pivotX < WIDTH; pivotX++)
        for (const orientation of ["up", "right", "down", "left"]) {
          const result = playPlacement(state, { pivotX, orientation });
          if (result) options.push(result);
        }
      if (!options.length) {
        failed = true;
        break;
      }
      state = options[Math.floor(randomPlayout() * options.length)].state;
      if (state.phase === "won") break;
      if (state.phase !== "falling" || !state.active) {
        failed = true;
        break;
      }
    }
    if (!failed && state.phase === "won") successes++;
  }
  const metrics = {
    placementProbes,
    legalPlacements,
    goalPreservingPlacements: finalWinningChoices,
    forcedPlacementShare: finalWinningChoices === 1 ? 1 : 0,
    seededPlayoutSamples: SAMPLE_BUDGET,
    seededPlayoutQueueDepth: 3,
    seededPlayoutSuccesses: successes,
    seededPlayoutSuccessRate: Number((successes / SAMPLE_BUDGET).toFixed(6)),
    setupPairsBeforePayoff: 2,
    requiredSetupPairs: 2,
    verifiedSetupDependencies: dependencyIndices.length,
    requiredChainDepth: 1,
    requiredRotations: 0,
    requiredWallKicks: 0,
    splitLandingDependencies: 0,
    planningLength: 3,
  };
  const level = {
    id: `chains-${hash(JSON.stringify([colours, targetPositions, "three-placement"])).slice(0, 12)}`,
    number: 0,
    title: { en: "Build the missing column", ja: "足りない列を積み上げる" },
    canonicalKeyHash: "",
    width: WIDTH,
    height: HEIGHT,
    colourCount: 4,
    seed: base.seed,
    board,
    queue,
    goal,
    witness,
    tags: ["setup-dependency", "three-placement-plan"],
    rawMetrics: metrics,
    score: scoreFor(metrics),
    marks: 1,
    gradingVersion: GRADING_VERSION,
    proofStatus: "engine-witness-verified",
    reviewStatus: "human-review-pending",
  };
  level.canonicalKeyHash = hash(canonicalKey(level));
  level.marks = Math.min(5, 1 + Math.floor(level.score / 20));
  return { level, key: canonicalKey(level) };
}
export function tutorials() {
  const makeBoard = () => Array(WIDTH * HEIGHT).fill(null);
  const lessonRotation = makeBoard();
  [
    [0, 11],
    [1, 11],
    [2, 11],
  ].forEach(([x, y], i) => {
    lessonRotation[cell(x, y)] = { id: i + 1, colour: "red" };
  });
  const rotationQueue = [
    ["red", "blue"],
    ["gold", "green"],
  ];
  const rotationBoard = withIds(lessonRotation.map((gem) => gem?.colour ?? null));
  const rotation = {
    id: "rotate-to-link",
    title: { en: "Rotate to connect", ja: "回転してつなげる" },
    objective: {
      en: "Turn the pair sideways so its red stone closes the three-stone link. The first practice uses a wall kick.",
      ja: "ペアを横向きにし、赤い石で3つの石の列を完成させましょう。最初の練習では壁際のキックも使います。",
    },
    setup: {
      board: rotationBoard,
      queue: rotationQueue,
      goal: { kind: "clear-targets", targetIds: [1, 2, 3] },
      witness: [{ pivotX: 3, orientation: "right" }],
    },
    steps: [
      {
        instruction: {
          en: "Move left to the wall, then rotate anticlockwise. The pair kicks one column inward.",
          ja: "壁まで左へ動かしてから反時計回りに回転します。ペアが1列内側へキックします。",
        },
        action: "left; left; rotate-anticlockwise",
      },
      {
        instruction: {
          en: "Move to the open end, turn right, and place the pair.",
          ja: "空いている端へ動き、右向きにしてペアを置きます。",
        },
        action: "right; right; rotate-clockwise; rotate-clockwise; hard-drop",
      },
    ],
    tags: ["rotation", "wall-kick"],
  };

  const splitBoard = makeBoard();
  let id = 1;
  for (let y = 8; y <= 11; y++) splitBoard[cell(2, y)] = { id: id++, colour: y % 2 ? "gold" : "green" };
  splitBoard[cell(3, 11)] = { id: id++, colour: "green" };
  // Three reds form an L beside the pivot landing. Every starting column is settled.
  for (let y = 8; y <= 11; y++) splitBoard[cell(0, y)] = { id: id++, colour: y % 2 ? "gold" : "blue" };
  for (let y = 8; y <= 11; y++) splitBoard[cell(1, y)] = { id: id++, colour: y % 2 ? "green" : "gold" };
  for (const [x, y] of [
    [0, 6],
    [0, 7],
    [1, 7],
  ])
    splitBoard[cell(x, y)] = { id: id++, colour: "red" };
  const splitBoardIds = withIds(splitBoard.map((gem) => gem?.colour ?? null));
  const targetSplit = splitBoardIds.filter((gem) => gem?.colour === "red").map((gem) => gem.id);
  const split = {
    id: "split-landing",
    title: { en: "Land at two heights", ja: "異なる高さに着地" },
    objective: {
      en: "A sideways pair settles each stone independently. Watch how the red pivot joins the target link while its blue partner lands lower.",
      ja: "横向きのペアは石ごとに着地します。赤いピボットが目標の列につながり、青い相方は低い位置に着地します。",
    },
    setup: {
      board: splitBoardIds,
      queue: [
        ["red", "blue"],
        ["gold", "green"],
      ],
      goal: { kind: "clear-targets", targetIds: targetSplit },
      witness: [{ pivotX: 2, orientation: "right" }],
    },
    steps: [
      {
        instruction: {
          en: "Rotate clockwise so the pair spans the uneven columns.",
          ja: "時計回りに回転し、段差のある列にペアを渡します。",
        },
        action: "rotate-clockwise",
      },
      {
        instruction: {
          en: "Drop the pair; the two stones settle at different heights.",
          ja: "ペアを落とすと、2つの石が別々の高さに着地します。",
        },
        action: "hard-drop",
      },
    ],
    tags: ["split-landing", "gravity"],
  };

  const chainBoard = makeBoard();
  id = 1;
  for (const [x, y] of [
    [0, 11],
    [1, 11],
    [1, 10],
  ])
    chainBoard[cell(x, y)] = { id: id++, colour: "red" };
  for (const y of [9, 10, 11]) chainBoard[cell(2, y)] = { id: id++, colour: "blue" };
  const chainBoardIds = withIds(chainBoard.map((gem) => gem?.colour ?? null));
  const chain = {
    id: "build-a-two-wave-chain",
    title: { en: "Set up a two-wave chain", ja: "2段の連鎖をつくる" },
    objective: {
      en: "Clear the blue group first. The red stone above it falls onto the red link for a second wave.",
      ja: "先に青いグループを消します。その上の赤い石が落ちて赤い列につながり、2段目の連鎖が起こります。",
    },
    setup: {
      board: chainBoardIds,
      queue: [
        ["blue", "red"],
        ["gold", "green"],
      ],
      goal: { kind: "minimum-chain", chain: 2 },
      witness: [{ pivotX: 2, orientation: "up" }],
    },
    steps: [
      {
        instruction: {
          en: "Keep the blue pivot below its red satellite.",
          ja: "青いピボットを赤いサテライトの下に保ちます。",
        },
        action: "keep-up",
      },
      {
        instruction: {
          en: "Drop the pair above the blue stack and watch both waves resolve.",
          ja: "青い積み重ねの上にペアを落とし、2段の消去を見届けます。",
        },
        action: "hard-drop",
      },
    ],
    tags: ["chain", "two-wave"],
  };
  return [rotation, split, chain];
}

export function generatedLevelPool() {
  const pools = { easy: new Map(), chain: new Map(), split: new Map(), multi: new Map() };
  for (let serial = 1; serial <= 5000 && pools.easy.size < 25; serial++) {
    const item = candidate(serial);
    if (item && !pools.easy.has(item.key)) pools.easy.set(item.key, item.level);
  }
  for (let serial = 1; serial <= 2000 && pools.chain.size < 12; serial++) {
    const item = chainCandidate(serial);
    if (item && !pools.chain.has(item.key)) pools.chain.set(item.key, item.level);
  }
  for (let serial = 1; serial <= 2000 && pools.split.size < 15; serial++) {
    const item = splitCandidate(serial);
    if (item && !pools.split.has(item.key)) pools.split.set(item.key, item.level);
  }
  for (let serial = 1; serial <= 2000 && pools.multi.size < 12; serial++) {
    const item = multiPairCandidate(serial);
    if (item && !pools.multi.has(item.key)) pools.multi.set(item.key, item.level);
  }
  if (pools.easy.size < 20 || pools.chain.size < 10 || pools.split.size < 10 || pools.multi.size < 10)
    throw new Error(
      `Insufficient variety: ${pools.easy.size} easy, ${pools.chain.size} chain, ${pools.split.size} split, ${pools.multi.size} multi-pair candidates`,
    );
  return pools;
}
