import { createHash } from 'node:crypto';
import { test } from 'vitest';
import assert from 'node:assert/strict';
import {
  applyAction, advanceTicks, arashiCampaignManifest, arashiLevelManifest,
  createArashiLevel, createChallenge, createShizenLevel, decodeGame, encodeGame,
  restartGame, shizenCampaignManifest, shizenLevelManifest
} from '../dist/colour-chains.js';

const turns = { up: 0, right: 1, down: 2, left: 3 };
const bands = [['entry', 32, 1, 20], ['easy', 32, 21, 40], ['intermediate', 32, 41, 60], ['hard', 24, 61, 80], ['expert', 8, 81, 100]];

function canonical(level) {
  const forms = [];
  for (const mirror of [false, true]) {
    const labels = new Map();
    const label = colour => { if (!labels.has(colour)) labels.set(colour, labels.size); return labels.get(colour); };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const x = mirror ? level.width - 1 - px : px, gem = level.board[y * level.width + x];
      board.push(gem ? [label(gem.colour), gem.magnetic === true, level.goal.kind === 'clear-targets' && level.goal.targetIds.includes(gem.id)] : null);
    }
    const queue = level.queue.map(pair => pair.map(label));
    const goal = level.goal.kind === 'clear-targets' ? level.goal.targetIds.map(id => {
      const at = level.board.findIndex(gem => gem?.id === id), x = at % level.width;
      return Math.floor(at / level.width) * level.width + (mirror ? level.width - 1 - x : x);
    }).sort((a, b) => a - b) : level.goal;
    forms.push(JSON.stringify([level.width, level.height, level.colourCount, level.weather ?? '', goal, board, queue, level.magneticQueue ?? []]));
  }
  return forms.sort()[0];
}

function resolve(state) {
  let ticks = 0; const events = [];
  while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase) && ticks < 100_000) {
    const tick = advanceTicks(state, 3600); state = tick.state; events.push(...tick.events); ticks += 3600;
  }
  assert.ok(!['clear-mark', 'clear-remove', 'gravity'].includes(state.phase));
  return { state, events };
}

function replay(level, initial) {
  let state = initial;
  const events = [];
  for (const [index, step] of level.witness.entries()) {
    assert.equal(state.phase, 'falling', `${level.id} proof stops at its first win`);
    for (let guard = 0; state.active.pivot.x !== step.pivotX && guard < 40; guard++) {
      const move = applyAction(state, { kind: state.active.pivot.x < step.pivotX ? 'right' : 'left' });
      assert.equal(move.accepted, true, level.id); state = move.state; events.push(...move.events);
    }
    assert.equal(state.active.pivot.x, step.pivotX, level.id);
    for (let i = 0; i < turns[step.orientation]; i++) {
      const rotate = applyAction(state, { kind: 'rotate-clockwise' });
      assert.equal(rotate.accepted, true, level.id); state = rotate.state; events.push(...rotate.events);
    }
    assert.equal(state.active.orientation, step.orientation, level.id);
    const drop = applyAction(state, { kind: 'hard-drop' });
    assert.equal(drop.accepted, true, level.id); const settled = resolve(drop.state); state = settled.state; events.push(...drop.events, ...settled.events);
    if (state.phase === 'won') assert.equal(index, level.witness.length - 1, `${level.id} witness has extra steps`);
  }
  return { state, events };
}

function disabledNature(level) {
  return createChallenge({
    id: `off-${level.id}`, seed: level.seed, width: level.width, height: level.height,
    colourCount: level.colourCount, board: level.board.map(gem => gem ? { id: gem.id, colour: gem.colour } : null),
    queue: level.queue, goal: level.goal, witness: level.witness
  });
}
function disabledWeather(level) {
  return createChallenge({
    id: `off-${level.id}`, seed: level.seed, width: level.width, height: level.height,
    colourCount: level.colourCount, board: level.board, queue: level.queue,
    goal: level.goal, witness: level.witness, nature: true,
    ...(level.magneticQueue ? { magneticQueue: level.magneticQueue } : {})
  });
}

function expectedScore(metrics) {
  const raw = 0.18 * (1 - metrics.fullPlanSuccessRate)
    + 0.28 * metrics.consequentialDecisionShare
    + 0.30 * metrics.setupDeviationLossShare
    + 0.12 * metrics.goalCoordinationShare
    + 0.06 * metrics.cascadeShare
    + 0.06 * metrics.weatherDependency;
  return Math.max(1, Math.min(100, 1 + Math.round(raw * 99)));
}

function expectedGoalCoordination(level) {
  if (level.goal.kind === 'minimum-chain') return Math.min(1, Math.max(0, (level.goal.chain - 1) / 3));
  if (!level.weather) {
    const colours = new Set(level.goal.targetIds.map(id => level.board.find(gem => gem?.id === id)?.colour).filter(Boolean));
    return Math.min(1, Math.max(0, (colours.size - 1) / 2));
  }
  const remaining = new Set(level.goal.targetIds.map(id => level.board.findIndex(gem => gem?.id === id)).filter(index => index >= 0));
  let components = 0;
  while (remaining.size) {
    components++; const first = remaining.values().next().value, colour = level.board[first]?.colour;
    const queue = [first]; remaining.delete(first);
    while (queue.length) {
      const at = queue.pop(), x = at % level.width, y = Math.floor(at / level.width);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || nx >= level.width || ny < 0 || ny >= level.height) continue;
        const next = ny * level.width + nx;
        if (remaining.has(next) && level.board[next]?.colour === colour) { remaining.delete(next); queue.push(next); }
      }
    }
  }
  return Math.min(1, Math.max(0, (components - 1) / 2));
}

for (const [name, manifest, levels, create] of [
  ['Shizen', shizenCampaignManifest, shizenLevelManifest, createShizenLevel],
  ['Arashi', arashiCampaignManifest, arashiLevelManifest, createArashiLevel]
]) {
  test(`${name}: 128 measured levels meet all score bands and canonical uniqueness`, () => {
    assert.equal(manifest.count, 128); assert.equal(levels.length, 128);
    assert.ok(manifest.candidatePoolCount >= 128);
    assert.match(manifest.checksum, /^[a-f0-9]{64}$/);
    assert.equal(createHash('sha256').update(JSON.stringify(levels)).digest('hex'), manifest.checksum);
    assert.equal(new Set(levels.map(level => level.id)).size, 128);
    assert.equal(new Set(levels.map(canonical)).size, 128, 'colour renaming or mirroring cannot create a duplicate');
    assert.equal(new Set(levels.map(level => level.canonicalKeyHash)).size, 128);
    assert.deepEqual(levels.map(level => level.number), Array.from({ length: 128 }, (_, index) => index + 1));
    assert.deepEqual(levels.map(level => level.score), [...levels].map(level => level.score).sort((a, b) => a - b));
    let offset = 0;
    for (const [band, count, minimum, maximum] of bands) {
      const group = levels.slice(offset, offset + count);
      assert.equal(group.length, count); assert.ok(group.every(level => level.band === band));
      assert.ok(group.every(level => level.score >= minimum && level.score <= maximum)); offset += count;
    }
    for (const level of levels) {
      assert.ok(level.title.en && level.title.ja && level.objective.en && level.objective.ja);
      assert.equal(level.proofStatus, 'engine-witness-verified');
      assert.equal(level.score, expectedScore(level.rawMetrics));
      assert.equal(level.rawMetrics.goalCoordinationShare, expectedGoalCoordination(level), `${level.id} coordination evidence`);
      assert.equal(level.marks, Math.min(5, 1 + Math.floor((level.score - 1) / 20)));
      const metrics = level.rawMetrics;
      assert.equal(metrics.seededPlayoutSamples, level.score >= 81 ? 256 : 64);
      assert.equal(metrics.seededPlayoutVariablePrefixLength, level.rawMetrics.seededPlayoutQueueDepth);
      assert.equal(metrics.seededPlayoutFixedSuffixLength, 0);
      assert.equal(metrics.seededPlayoutSuccessRate, metrics.seededPlayoutSuccesses / metrics.seededPlayoutSamples);
      assert.ok(metrics.placementProbes > 0 && metrics.legalPlacements > 0);
      assert.ok(metrics.requiredSetupPairs <= metrics.verifiedSetupDependencies);
      assert.ok(metrics.verifiedSetupDependencies <= metrics.setupDependencyProbeSteps);
      assert.equal(metrics.occupiedCells, level.board.filter(Boolean).length);
      assert.equal(metrics.usableCells, level.width * level.height);
      assert.equal(metrics.boardCoverage, Number((metrics.occupiedCells / metrics.usableCells).toFixed(6)));
      assert.deepEqual(create(level.id).settings, create(level.number).settings);
    }
  });
}

test('Shizen proofs use a real rebound or magnetic pulse and fail without nature', () => {
  for (const level of shizenLevelManifest) {
    const state = createShizenLevel(level.id), result = replay(level, state);
    assert.equal(result.state.phase, 'won', level.id);
    assert.ok(result.events.some(event => event.type === 'power-drop-landed' && event.rebound || event.type === 'magnetic-pulse' && event.moves?.length), level.id);
    assert.throws(() => disabledNature(level), /witness/i, `${level.id} must depend on nature`);
    assert.equal(result.state.completedPairs, level.witness.length);
  }
});

test('Arashi schedules jumble and lightning before winning; weather is necessary', () => {
  for (const level of arashiLevelManifest) {
    assert.equal(level.witness.length, 4, level.id); assert.equal(level.weather, 'frequent', level.id);
    const result = replay(level, createArashiLevel(level.id));
    assert.equal(result.state.phase, 'won', level.id);
    assert.deepEqual(result.events.filter(event => event.type === 'weather-triggered').map(event => [event.kind, event.turn]), [['jumble', 2], ['lightning', 4]]);
    const strike = result.events.find(event => event.type === 'lightning-struck');
    assert.ok(strike?.removedIds?.some(id => level.goal.kind === 'clear-targets' && level.goal.targetIds.includes(id)), level.id);
    assert.throws(() => disabledWeather(level), /witness/i, `${level.id} must depend on scheduled weather`);
    if (level.tags.includes('jumble-dependency')) assert.ok(result.events.some(event => event.type === 'jumble-completed' && event.changed && event.moves?.some(move => level.goal.targetIds.includes(move.id))), level.id);
  }
});

test('nature campaign settings and action replay survive save and restart', () => {
  for (const [campaign, level] of [['shizen', shizenLevelManifest[20]], ['arashi', arashiLevelManifest[20]]]) {
    let state = campaign === 'shizen' ? createShizenLevel(level.id) : createArashiLevel(level.id);
    state = applyAction(state, { kind: 'left' }).state;
    const encoded = encodeGame(state), recovered = decodeGame(encoded);
    assert.deepEqual(recovered, state); assert.deepEqual(restartGame(state).settings, state.settings);
    assert.deepEqual(decodeGame(encodeGame(recovered)), recovered);
    assert.equal(recovered.settings.mode, 'challenge'); assert.equal(recovered.settings.nature, true);
    if (campaign === 'shizen') assert.deepEqual(recovered.settings.magneticQueue, level.magneticQueue);
    else assert.equal(recovered.settings.weather, 'frequent');
  }
});

// The native-process regeneration comparison in colour-chains-content.test.mjs
// verifies both complete catalogues. Keep the independent evidence checks above here.
