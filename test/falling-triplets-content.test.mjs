import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAction, advanceTicks, campaignManifest, createChallenge, createLevel, getLevel, getTutorial, levelManifest, tutorialManifest } from '../dist/falling-triplets.js';
import { generateCampaign, tutorialDefinitions } from '../scripts/falling-triplets-levels.mjs';

function independentAxes(state) {
  if (state.phase !== 'clear-mark' || !state.pendingClear?.length) return [];
  const marked = new Set(state.pendingClear), axes = new Set(), width = state.settings.width;
  for (const index of marked) {
    const colour = state.board[index]?.colour;
    if (!colour) continue;
    const x = index % width, y = Math.floor(index / width);
    for (const [axis, [dx, dy]] of [[0, [1, 0]], [1, [0, 1]], [2, [1, 1]], [3, [1, -1]]]) {
      let count = 1;
      for (const sign of [-1, 1]) {
        let nx = x + dx * sign, ny = y + dy * sign;
        while (nx >= 0 && nx < width && ny >= 0 && ny < state.board.length / width && state.board[ny * width + nx]?.colour === colour) {
          count++;
          nx += dx * sign;
          ny += dy * sign;
        }
      }
      if (count >= 3) axes.add(axis);
    }
  }
  return [...axes];
}

function independentMatches(board, width, height) {
  const matches = new Set();
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const colour = board[y * width + x]?.colour;
    if (!colour) continue;
    for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
      const cells = [y * width + x, (y + dy) * width + x + dx, (y + 2 * dy) * width + x + 2 * dx];
      const endX = x + 2 * dx, endY = y + 2 * dy;
      if (endX < 0 || endX >= width || endY < 0 || endY >= height) continue;
      if (cells.every(index => board[index]?.colour === colour)) for (const index of cells) matches.add(index);
    }
  }
  return [...matches];
}

function assertStableMatchFree(level, board = level.board) {
  assert.deepEqual(independentMatches(board, level.width, level.height), [], `${level.id} starts with no preexisting match`);
  for (let x = 0; x < level.width; x++) {
    let encounteredGap = false;
    for (let y = level.height - 1; y >= 0; y--) {
      if (board[y * level.width + x]) assert.equal(encounteredGap, false, `${level.id} has a floating gem at (${x}, ${y})`);
      else encounteredGap = true;
    }
  }
}

function performWitnessStep(state, step, onMarked) {
  let next = state;
  while (next.active.x !== step.x) {
    const transition = applyAction(next, { kind: step.x < next.active.x ? 'left' : 'right' });
    assert.equal(transition.accepted, true, `witness horizontal move toward ${step.x}`);
    next = transition.state;
  }
  while (next.active.orientation !== step.orientation) {
    const transition = applyAction(next, { kind: 'cycle-forward' });
    assert.equal(transition.accepted, true, 'witness cycle');
    next = transition.state;
  }
  const placed = applyAction(next, { kind: 'hard-drop' });
  assert.equal(placed.accepted, true, 'witness hard drop');
  next = placed.state;
  if (next.phase === 'clear-mark') onMarked?.(next, independentAxes(next));
  let ticks = 0;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(next.phase) && ticks < 500) {
    next = advanceTicks(next, 1).state;
    if (next.phase === 'clear-mark') onMarked?.(next, independentAxes(next));
    ticks++;
  }
  assert.ok(ticks < 500, 'resolution should settle within the bounded tick budget');
  return next;
}

function independentGoal(state, goal) {
  if (goal.type === 'targets') return goal.targetIds.every(id => state.board.every(gem => gem?.id !== id));
  if (goal.type === 'chain') return state.maxChain >= goal.minimumChain;
  if (goal.type === 'empty') return state.board.every(gem => gem === null);
  return false;
}

function replay(witness, setup, onMarked) {
  let state = setup;
  for (const step of witness) {
    if (state.phase === 'won') break;
    state = performWitnessStep(state, step, onMarked);
  }
  return state;
}

function canonicalKey(level) {
  const forms = [];
  for (const mirror of [false, true]) {
    const colors = new Map();
    const label = colour => {
      if (!colors.has(colour)) colors.set(colour, colors.size);
      return colors.get(colour);
    };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const x = mirror ? level.width - px - 1 : px;
      const gem = level.board[y * level.width + x];
      board.push(gem ? [label(gem.colour), Boolean(gem.target)] : null);
    }
    const queue = level.queue.map(piece => piece.map(label));
    const goal = level.goal.type === 'targets' ? ['targets', level.goal.targetIds.length] : level.goal.type === 'chain' ? ['chain', level.goal.minimumChain] : ['empty'];
    forms.push(JSON.stringify([level.width, level.height, level.colourCount, goal, board, queue]));
  }
  return forms.sort()[0];
}

test('campaign generation is reproducible and the frozen manifest has a complete difficulty order', () => {
  const rebuilt = generateCampaign(100);
  assert.equal(rebuilt.count, 100);
  assert.equal(rebuilt.candidatePoolCount, 110);
  assert.equal(rebuilt.checksum, campaignManifest.checksum);
  assert.deepEqual(rebuilt.levels, levelManifest);
  assert.deepEqual(levelManifest.map(level => level.number), Array.from({ length: 100 }, (_, i) => i + 1));
  assert.equal(new Set(levelManifest.map(level => level.id)).size, 100);
  assert.equal(new Set(levelManifest.map(level => level.canonicalKeyHash)).size, 100);
  assert.equal(new Set(levelManifest.map(canonicalKey)).size, 100, 'IDs, colour renaming, and horizontal mirror do not create new patterns');
  assert.ok(levelManifest.every(level => level.id.startsWith('ft-') && level.title.en && level.title.ja));
  assert.ok(levelManifest.every(level => level.proofStatus === 'engine-witness-verified' && level.reviewStatus === 'human-review-pending'));
  assert.ok(levelManifest.every((level, i) => i === 0 || level.score >= levelManifest[i - 1].score));
  assert.ok(levelManifest.every(level => level.marks === Math.min(5, 1 + Math.floor(level.score / 20))));
  assert.ok(Math.max(...levelManifest.slice(0, 10).map(level => level.score)) < Math.min(...levelManifest.slice(-10).map(level => level.score)));
  const average = entries => entries.reduce((sum, level) => sum + level.rawMetrics.seededGoalSuccessRate, 0) / entries.length;
  assert.ok(average(levelManifest.slice(0, 10)) > average(levelManifest.slice(-10)), 'opening band is more forgiving under the seeded legal-play measure');
  assert.equal(levelManifest[0].marks, 1, 'the opening includes a genuinely easy one-mark puzzle');
  assert.equal(levelManifest.at(-1).score, Math.max(...levelManifest.map(level => level.score)), 'the final puzzle has the highest measured campaign score');
  assert.ok(Object.isFrozen(campaignManifest) && Object.isFrozen(levelManifest[0].board) && Object.isFrozen(levelManifest[0].title));
});

test('all 100 original campaign witnesses solve their goal through the shipped engine', () => {
  for (const level of levelManifest) {
    assertStableMatchFree(level);
    const state = createLevel(level.id);
    assert.deepEqual(getLevel(level.number), level);
    assert.deepEqual(createLevel(level.number), state);
    const markedWaves = [];
    const final = replay(level.witness, state, (marked, axes) => markedWaves.push({ target: level.goal.type === 'targets' && level.goal.targetIds.some(id => marked.pendingClear.some(index => marked.board[index]?.id === id)), axes }));
    assert.equal(final.phase, 'won', `${level.id} witness should finish in the won phase`);
    assert.equal(independentGoal(final, level.goal), true, `${level.id} should pass an independent goal check`);
    assert.ok(final.completedPieces >= 1 && final.completedPieces <= level.witness.length, `${level.id} consumes only its finite witness queue`);
    if (level.tags[0] === 'vertical-clear' || level.tags[0] === 'horizontal-clear' || level.tags[0] === 'diagonal-clear' || level.tags[0] === 'crossing-clear') {
      const targetWave = markedWaves.find(wave => wave.target);
      assert.ok(targetWave, `${level.id} exposes a wave that clears its marked target`);
      if (level.tags[0] === 'vertical-clear') assert.ok(targetWave.axes.includes(1), `${level.id} target clear is vertically aligned`);
      if (level.tags[0] === 'horizontal-clear') assert.ok(targetWave.axes.includes(0), `${level.id} target clear is horizontally aligned`);
      if (level.tags[0] === 'diagonal-clear') assert.ok(targetWave.axes.some(axis => axis === 2 || axis === 3), `${level.id} target clear is diagonal`);
      if (level.tags[0] === 'crossing-clear') assert.ok(targetWave.axes.length >= 2, `${level.id} target clear crosses multiple lines`);
    }
    assert.equal(final.settings.seed, level.seed);
  }
  assert.equal(getLevel('missing-level'), undefined);
  assert.equal(getLevel(1.5), undefined);
  assert.throws(() => createLevel('missing-level'), /Unknown Falling Triplets level/);
});

test('campaign content covers the required distinct line and chain mechanics', () => {
  const tags = new Set(levelManifest.flatMap(level => level.tags));
  for (const tag of ['vertical-clear', 'horizontal-clear', 'diagonal-clear', 'crossing-clear', 'two-wave-chain', 'cycle-required', 'target-planning', 'setup-sequence', 'space-management']) assert.ok(tags.has(tag), `missing ${tag}`);
  assert.ok(tags.has('2-wave-chain'), 'missing 2-wave-chain');
  assert.ok(levelManifest.some(level => level.rawMetrics.payoffDirections >= 2), 'at least one witness demonstrates a crossing clear');
  for (const tag of ['vertical-clear', 'horizontal-clear', 'diagonal-clear', 'crossing-clear', 'two-wave-chain']) assert.equal(levelManifest.filter(level => level.tags[0] === tag).length, 20);
  for (const level of levelManifest.filter(item => item.tags[0] === 'two-wave-chain')) {
    let state = createLevel(level.id);
    const first = level.witness[0];
    state = performWitnessStep(state, first, () => assert.fail(`${level.id} first harmless placement must not start a clear`));
    assert.equal(state.phase, 'falling', `${level.id} first placement leaves the board in play`);
    assert.equal(state.maxChain, 0, `${level.id} first placement does not earn a chain`);
    const second = level.witness[1];
    const waves = [];
    state = performWitnessStep(state, second, (marked) => waves.push(marked.resolutionChain));
    assert.equal(state.phase, 'won', `${level.id} cascade witness wins`);
    assert.ok(waves.filter(chain => chain === 1).length >= 1 && waves.filter(chain => chain === 2).length >= 1, `${level.id} shows two distinct resolution waves`);
    assert.deepEqual(state.waves.map(wave => wave.chain), [1, 2], `${level.id} records precisely two real waves`);
    assert.ok(independentGoal(state, level.goal));
  }
});

test('three bilingual interactive lesson definitions each carry a solving witness', () => {
  assert.deepEqual(tutorialManifest, tutorialDefinitions());
  assert.equal(tutorialManifest.length, 3);
  assert.equal(new Set(tutorialManifest.map(tutorial => tutorial.id)).size, 3);
  for (const tutorial of tutorialManifest) {
    assert.equal(getTutorial(tutorial.id), tutorial);
    assert.ok(tutorial.title.en && tutorial.title.ja && tutorial.objective.en && tutorial.objective.ja);
    assert.ok(tutorial.steps.length > 0 && tutorial.steps.every(step => step.instruction.en && step.instruction.ja));
    assertStableMatchFree({ ...tutorial.setup, id: tutorial.id, width: 6, height: 13 });
    const start = createChallenge({ seed: tutorial.id, width: 6, height: 13, colourCount: 5, ...tutorial.setup });
    const final = replay(tutorial.setup.witness, start);
    assert.equal(final.phase, 'won', `${tutorial.id} witness should solve`);
    assert.equal(independentGoal(final, tutorial.setup.goal), true);
  }
});
