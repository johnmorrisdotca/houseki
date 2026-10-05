import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { applyAction, advanceTicks, campaignManifest, createChallenge, createLevel, getLevel, getTutorial, levelManifest, tutorialManifest } from '../dist/colour-chains.js';

const WIDTH = 6, HEIGHT = 12;
function goalReached(state, goal) {
  if (goal.kind === 'clear-targets') return goal.targetIds.every(id => !state.board.some(gem => gem?.id === id));
  if (goal.kind === 'minimum-chain') return state.maxChain >= goal.chain;
  return state.board.every(gem => gem === null);
}
function expectedScore(metrics) {
  const value = 35 * (1 - metrics.seededPlayoutSuccessRate)
    + 10 * metrics.forcedPlacementShare
    + 10 * Math.min(1, Math.max(0, (metrics.requiredChainDepth - 1) / 2))
    + 10 * Math.min(1, metrics.splitLandingDependencies)
    + 8 * Math.min(1, metrics.requiredRotations)
    + 12 * Math.min(1, metrics.requiredSetupPairs / 2)
    + 5 * Math.min(1, Math.max(0, (metrics.planningLength - 1) / 2));
  return Math.round(Math.max(0, Math.min(100, value)) * 100) / 100;
}
function oracleGroups(board, width, height) {
  const seen = new Set(); let count = 0;
  for (let index = 0; index < board.length; index++) {
    if (!board[index] || seen.has(index)) continue;
    const colour = board[index].colour, pending = [index]; seen.add(index); let size = 0;
    while (pending.length) {
      const at = pending.pop(); size++;
      const x = at % width, y = Math.floor(at / width);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = ny * width + nx;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !seen.has(next) && board[next]?.colour === colour) { seen.add(next); pending.push(next); }
      }
    }
    if (size >= 4) count++;
  }
  return count;
}
function executePlacement(state, step) {
  const events = [];
  const act = kind => { const result = applyAction(state, { kind }); assert.equal(result.accepted, true, `${kind} must be accepted`); state = result.state; events.push(...result.events); };
  while (state.active.pivot.x !== step.pivotX) act(state.active.pivot.x < step.pivotX ? 'right' : 'left');
  const turns = { up: 0, right: 1, down: 2, left: 3 }[step.orientation];
  for (let i = 0; i < turns; i++) act('rotate-clockwise');
  act('hard-drop');
  let budget = 0;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase) && budget < 100_000) {
    const tick = advanceTicks(state, 3600); state = tick.state; events.push(...tick.events); budget += 3600;
  }
  return { state, events };
}
function independentCanonical(level) {
  const cell = (x, y) => y * level.width + y * 0 + x;
  const keys = [];
  for (const mirror of [false, true]) {
    const labels = new Map(); const label = colour => { if (!labels.has(colour)) labels.set(colour, labels.size); return labels.get(colour); };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const gem = level.board[cell(mirror ? level.width - 1 - px : px, y)];
      board.push(gem ? [label(gem.colour), level.goal.kind === 'clear-targets' && level.goal.targetIds.includes(gem.id)] : null);
    }
    const queue = level.queue.map(pair => pair.map(label));
    const goal = level.goal.kind === 'clear-targets' ? { kind: 'clear-targets', targets: level.goal.targetIds.map(id => {
      const at = level.board.findIndex(gem => gem?.id === id), x = at % level.width, y = Math.floor(at / level.width);
      return y * level.width + (mirror ? level.width - 1 - x : x);
    }).sort((a, b) => a - b) } : level.goal;
    keys.push(JSON.stringify([level.width, level.height, level.colourCount, goal, board, queue]));
  }
  return keys.sort()[0];
}

test('campaign is a frozen, stable 50-level manifest with bilingual text and measured ordering', () => {
  assert.equal(campaignManifest.count, 50); assert.equal(levelManifest.length, 50);
  assert.equal(campaignManifest.candidatePoolCount >= campaignManifest.count, true);
  assert.equal(new Set(levelManifest.map(level => level.id)).size, 50);
  assert.equal(new Set(levelManifest.map(independentCanonical)).size, 50);
  assert.deepEqual(levelManifest.map(level => level.number), Array.from({ length: 50 }, (_, i) => i + 1));
  assert.deepEqual(levelManifest.map(level => level.score), [...levelManifest].map(level => level.score).sort((a, b) => a - b));
  assert.match(campaignManifest.checksum, /^[a-f0-9]{64}$/);
  assert.equal(campaignManifest.candidatePoolCount, 64);
  assert.ok(levelManifest.filter(level => level.tags.includes('two-wave-chain')).length >= 10);
  assert.ok(levelManifest.filter(level => level.tags.includes('split-landing')).length >= 10);
  assert.equal(levelManifest.slice(-10).every(level => level.rawMetrics.planningLength >= 3 && level.rawMetrics.setupPairsBeforePayoff >= 2 && level.rawMetrics.verifiedSetupDependencies >= 2), true);
  assert.ok(levelManifest.slice(0, 3).every(level => level.marks === 1 && level.rawMetrics.planningLength === 1 && level.rawMetrics.setupPairsBeforePayoff === 0));
  assert.ok(levelManifest.at(-1).score > levelManifest[0].score);
  assert.ok(Object.isFrozen(campaignManifest) && Object.isFrozen(levelManifest[0]) && Object.isFrozen(levelManifest[0].board));
  for (const level of levelManifest) {
    assert.ok(level.title.en && level.title.ja); assert.equal(level.proofStatus, 'engine-witness-verified');
    assert.equal(level.reviewStatus, 'human-review-pending'); assert.ok(level.rawMetrics.placementProbes >= 24);
    assert.ok(level.rawMetrics.seededPlayoutSamples > 0);
    assert.equal(level.score, expectedScore(level.rawMetrics));
    assert.equal(level.marks, Math.min(5, 1 + Math.floor(level.score / 20)));
    assert.equal(level.canonicalKeyHash, createHash('sha256').update(independentCanonical(level)).digest('hex'));
  }
});

test('every campaign witness is independently replayed from a settled no-match board to its goal', () => {
  for (const level of levelManifest) {
    const state = createLevel(level.id); const settings = state.settings;
    assert.equal(state.board.length, WIDTH * (HEIGHT + 3));
    assert.equal(oracleGroups(state.board, settings.width, settings.height + 3), 0, `${level.id} starts without a match`);
    for (let x = 0; x < settings.width; x++) {
      let gap = false;
      for (let y = settings.height - 1; y >= 0; y--) {
        if (!state.board[(y + 3) * settings.width + x]) gap = true;
        else assert.equal(gap, false, `${level.id} column ${x} is settled`);
      }
    }
    let current = state;
    for (const step of level.witness) current = executePlacement(current, step).state;
    assert.equal(current.phase, 'won', `${level.id} witness wins`);
    assert.equal(goalReached(current, level.goal), true, `${level.id} independent goal oracle`);
  }
});

test('last ten challenges require coupled setup placements and measured full-queue playouts', () => {
  for (const level of levelManifest.slice(-10)) {
    assert.equal(level.witness.length, 3);
    assert.equal(level.rawMetrics.setupPairsBeforePayoff, 2);
    assert.equal(level.rawMetrics.requiredSetupPairs, 2);
    assert.equal(level.rawMetrics.verifiedSetupDependencies, 2);
    assert.equal(level.rawMetrics.planningLength, 3);
    assert.equal(level.rawMetrics.seededPlayoutQueueDepth, 3);
    assert.ok(level.rawMetrics.placementProbes >= 72);
    assert.equal(level.rawMetrics.seededPlayoutSamples, 64);
    assert.equal(level.rawMetrics.seededPlayoutSuccessRate, level.rawMetrics.seededPlayoutSuccesses / 64);
    for (let index = 0; index < 2; index++) {
      let invalidates = false;
      for (let pivotX = 0; pivotX < level.width && !invalidates; pivotX++) for (const orientation of ['up', 'right', 'down', 'left']) {
        if (pivotX === level.witness[index].pivotX && orientation === level.witness[index].orientation) continue;
        const changed = level.witness.map(step => ({ ...step })); changed[index] = { pivotX, orientation };
        try { createChallenge({ id: `${level.id}-changed-${index}-${pivotX}-${orientation}`, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal, witness: changed }); }
        catch { invalidates = true; }
      }
      assert.equal(invalidates, true, `${level.id} setup pair ${index + 1} is structurally necessary`);
    }
  }
});

test('level lookup and fresh challenge construction keep stable IDs separate from display numbers', () => {
  for (const level of [levelManifest[0], levelManifest.at(-1)]) {
    assert.equal(getLevel(level.id)?.number, level.number);
    assert.equal(getLevel(level.number)?.id, level.id);
    assert.notEqual(createLevel(level.id), createLevel(level.number));
  }
  assert.equal(getLevel('not-a-level'), undefined); assert.equal(getLevel(1.5), undefined);
  assert.throws(() => createLevel('not-a-level'), RangeError);
});

test('three bilingual tutorials prove rotation with a wall kick, split landing and a two-wave chain', () => {
  assert.equal(tutorialManifest.length, 3);
  const ids = ['rotate-to-link', 'split-landing', 'build-a-two-wave-chain'];
  for (const id of ids) {
    const tutorial = getTutorial(id); assert.ok(tutorial); assert.ok(tutorial.title.en && tutorial.title.ja);
    const state = createChallenge({ id: `lesson-${id}`, width: WIDTH, height: HEIGHT, colourCount: 4, board: tutorial.setup.board, queue: tutorial.setup.queue, goal: tutorial.setup.goal, witness: tutorial.setup.witness });
    assert.equal(oracleGroups(state.board, WIDTH, HEIGHT + 3), 0, `${id} starts without a match`);
    let solved = state; let events = [];
    for (const step of tutorial.setup.witness) { const result = executePlacement(solved, step); solved = result.state; events.push(...result.events); }
    assert.equal(solved.phase, 'won', `${id} witness wins`);
    assert.equal(goalReached(solved, tutorial.setup.goal), true);
    if (id === 'split-landing') {
      const locked = events.find(event => event.type === 'pair-locked');
      const positions = locked.ids.map(gemId => solved.board.findIndex(gem => gem?.id === gemId)).map(at => Math.floor(at / WIDTH) - 3);
      assert.notEqual(positions[0], positions[1], 'pair stones finish at different heights');
    }
    if (id === 'build-a-two-wave-chain') assert.equal(solved.maxChain, 2);
  }
  const rotation = getTutorial('rotate-to-link'); let state = createChallenge({ id: 'lesson-wall-kick', board: rotation.setup.board, queue: rotation.setup.queue, goal: rotation.setup.goal, witness: rotation.setup.witness });
  for (const action of ['left', 'left', 'rotate-anticlockwise']) { const step = applyAction(state, { kind: action }); assert.equal(step.accepted, true); state = step.state; if (action.startsWith('rotate')) assert.deepEqual(step.events[0].kick, { x: 1, y: 0 }); }
  for (const action of ['right', 'right', 'rotate-clockwise', 'rotate-clockwise', 'hard-drop']) { const step = applyAction(state, { kind: action }); assert.equal(step.accepted, true); state = step.state; }
  let ticks = 0;
  while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase) && ticks < 100_000) { state = advanceTicks(state, 3600).state; ticks += 3600; }
  assert.equal(state.phase, 'won'); assert.equal(goalReached(state, rotation.setup.goal), true);
});

test('generation script reproduces the immutable manifest checksum', () => {
  const result = spawnSync(process.execPath, ['scripts/colour-chains-levels.mjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, new RegExp(campaignManifest.checksum));
});
