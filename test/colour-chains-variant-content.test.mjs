import { test } from 'vitest';
import assert from 'node:assert/strict';
import {
  applyAction, advanceTicks, arashiCampaignManifest, arashiLevelManifest,
  createArashiLevel, createChallenge, createShizenLevel, decodeGame, encodeGame,
  restartGame, shizenCampaignManifest, shizenLevelManifest
} from '../dist/colour-chains.js';
import { initialChallengeState } from '../dist/colour-chains/engine.js';

const turns = { up: 0, right: 1, down: 2, left: 3 };
function canonical(level) {
  const candidates = [];
  for (const mirror of [false, true]) {
    const labels = new Map(); const label = colour => { if (!labels.has(colour)) labels.set(colour, labels.size); return labels.get(colour); };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const x = mirror ? level.width - 1 - px : px; const gem = level.board[y * level.width + x];
      board.push(gem ? [label(gem.colour), gem.magnetic === true, level.goal.kind === 'clear-targets' && level.goal.targetIds.includes(gem.id)] : null);
    }
    const queue = level.queue.map((pair, index) => [pair.map(label), ...(level.magneticQueue?.[index] ?? [false, false])]);
    const targetCells = level.goal.kind === 'clear-targets' ? level.goal.targetIds.map(id => {
      const at = level.board.findIndex(gem => gem?.id === id), x = at % level.width; return Math.floor(at / level.width) * level.width + (mirror ? level.width - 1 - x : x);
    }).sort((a, b) => a - b) : level.goal;
    candidates.push(JSON.stringify([level.width, level.height, level.colourCount, level.weather ?? '', targetCells, board, queue]));
  }
  return candidates.sort()[0];
}
function play(level, campaign, disable = undefined) {
  let state;
  if (disable) {
    const settings = {
      mode: 'challenge', width: level.width, height: level.height,
      colourCount: level.colourCount, seed: level.seed, challengeId: `counterfactual-${level.id}`,
      goal: level.goal, initialBoard: level.board, queue: level.queue, witness: level.witness,
      ...(disable === 'weather' ? { nature: true } : {})
    };
    state = initialChallengeState(settings, level.board, level.queue);
  } else state = campaign === 'shizen' ? createShizenLevel(level.id) : createArashiLevel(level.id);
  const events = [];
  for (const step of level.witness) {
    while (state.active.pivot.x !== step.pivotX) {
      const move = applyAction(state, { kind: state.active.pivot.x < step.pivotX ? 'right' : 'left' });
      assert.equal(move.accepted, true); state = move.state; events.push(...move.events);
    }
    for (let turn = 0; turn < turns[step.orientation]; turn++) { const rotated = applyAction(state, { kind: 'rotate-clockwise' }); assert.equal(rotated.accepted, true); state = rotated.state; events.push(...rotated.events); }
    const drop = applyAction(state, { kind: 'hard-drop' }); assert.equal(drop.accepted, true); state = drop.state; events.push(...drop.events);
    let work = 0;
    while (['clear-mark', 'clear-remove', 'gravity'].includes(state.phase) && work < 100_000) { const resolved = advanceTicks(state, 3600); state = resolved.state; events.push(...resolved.events); work += 3600; }
    if (state.phase !== 'falling') break;
  }
  return { state, events };
}
function expectedScore(metrics) {
  const raw = 35 * (1 - metrics.seededPlayoutSuccessRate) + 10 * metrics.forcedPlacementShare
    + 10 * Math.min(1, Math.max(0, (metrics.requiredChainDepth - 1) / 2))
    + 10 * Math.min(1, metrics.splitLandingDependencies) + 8 * Math.min(1, metrics.requiredRotations)
    + 12 * Math.min(1, metrics.requiredSetupPairs / 2) + 5 * Math.min(1, Math.max(0, (metrics.planningLength - 1) / 2));
  return Math.round(Math.max(0, Math.min(100, raw)) * 100) / 100;
}

for (const [name, manifest, levels, create] of [
  ['Shizen', shizenCampaignManifest, shizenLevelManifest, createShizenLevel],
  ['Arashi', arashiCampaignManifest, arashiLevelManifest, createArashiLevel]
]) {
  test(`${name} has fifty unique, ordered, bilingual engine-verified levels`, () => {
    assert.equal(manifest.count, 50); assert.equal(levels.length, 50);
    assert.equal(manifest.candidatePoolCount, 50); assert.match(manifest.checksum, /^[a-f0-9]{64}$/);
    assert.equal(new Set(levels.map(level => level.id)).size, 50);
    assert.equal(new Set(levels.map(canonical)).size, 50, 'colour renaming or mirroring cannot create a duplicate');
    assert.equal(new Set(levels.map(level => level.canonicalKeyHash)).size, 50);
    assert.deepEqual(levels.map(level => level.number), Array.from({ length: 50 }, (_, index) => index + 1));
    assert.deepEqual(levels.map(level => level.score), [...levels].map(level => level.score).sort((a, b) => a - b));
    for (const level of levels) {
      assert.ok(level.title.en && level.title.ja && level.objective.en && level.objective.ja);
      assert.equal(level.proofStatus, 'engine-witness-verified');
      assert.equal(level.score, expectedScore(level.rawMetrics));
      assert.equal(level.marks, Math.min(5, 1 + Math.floor(level.score / 20)));
      assert.ok(level.rawMetrics.seededPlayoutSamples > 0 && level.rawMetrics.legalPlacements > 0);
      if (level.nature) {
        assert.equal(level.rawMetrics.seededPlayoutVariablePrefixLength, 1);
        assert.equal(level.rawMetrics.seededPlayoutFixedSuffixLength, level.witness.length - 1);
        assert.ok(level.rawMetrics.requiredSetupPairs <= level.rawMetrics.verifiedSetupDependencies);
        assert.ok(level.rawMetrics.verifiedSetupDependencies <= level.rawMetrics.setupDependencyProbeSteps);
      }
      assert.deepEqual(create(level.id).settings, create(level.number).settings);
    }
  });
}

test('Shizen wins require the marked pair rebound and fail under the nature-off counterfactual', () => {
  assert.ok(shizenLevelManifest.filter(level => level.witness.length === 1).length >= 20);
  assert.ok(shizenLevelManifest.filter(level => level.witness.length === 2).length >= 15);
  assert.ok(shizenLevelManifest.filter(level => level.witness.length >= 3).length >= 8);
  for (const level of shizenLevelManifest) {
    const result = play(level, 'shizen');
    assert.equal(result.state.phase, 'won', level.id);
    assert.ok(result.events.some(event => event.type === 'power-drop-landed' && event.rebound), level.id);
    if (level.witness.length > 1) {
      assert.ok(result.events.some(event => event.type === 'magnetic-pulse' && event.moves?.length), level.id);
      assert.ok(level.tags.includes('setup-dependency') && level.tags.includes('magnetic-attraction'), level.id);
    }
    assert.notEqual(play(level, 'shizen', 'nature').state.phase, 'won', `${level.id} nature-off counterfactual`);
    assert.equal(result.state.completedPairs, level.witness.length);
    assert.throws(() => createChallenge({ id: `${level.id}-without-nature`, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal, witness: level.witness }), /challenge gem|witness/i);
  }
});

test('Arashi witnesses trigger changed jumble and target-removing lightning before winning', () => {
  assert.ok(arashiLevelManifest.every(level => level.witness.length === 4 && level.weather === 'frequent'));
  for (const level of arashiLevelManifest) {
    const result = play(level, 'arashi');
    assert.equal(result.state.phase, 'won', level.id);
    assert.deepEqual(result.events.filter(event => event.type === 'weather-triggered').map(event => [event.kind, event.turn]), [['jumble', 2], ['lightning', 4]]);
    assert.ok(result.events.some(event => event.type === 'jumble-completed' && event.changed === true), level.id);
    const removed = result.events.find(event => event.type === 'lightning-struck');
    assert.ok(removed?.removedIds?.some(id => level.goal.targetIds.includes(id)), level.id);
    assert.equal(result.state.completedPairs, 4);
    assert.notEqual(play(level, 'arashi', 'weather').state.phase, 'won', `${level.id} weather-off counterfactual`);
    assert.throws(() => createChallenge({ id: `${level.id}-weather-off`, seed: level.seed, width: level.width, height: level.height, colourCount: level.colourCount, board: level.board, queue: level.queue, goal: level.goal, witness: level.witness, nature: true }), /witness/i);
  }
});

test('nature challenge settings, magnetic queue, pause state and action replay survive recovery', () => {
  for (const [campaign, level] of [['shizen', shizenLevelManifest[20]], ['arashi', arashiLevelManifest[20]]]) {
    let state = campaign === 'shizen' ? createShizenLevel(level.id) : createArashiLevel(level.id);
    state = applyAction(state, { kind: 'left' }).state;
    const encoded = encodeGame(state); const recovered = decodeGame(encoded);
    assert.deepEqual(recovered, state);
    assert.deepEqual(restartGame(state).settings, state.settings);
    assert.deepEqual(decodeGame(encodeGame(recovered)), recovered);
    assert.equal(recovered.settings.mode, 'challenge'); assert.equal(recovered.settings.nature, true);
    if (campaign === 'shizen') assert.deepEqual(recovered.settings.magneticQueue, level.magneticQueue);
    else assert.equal(recovered.settings.weather, 'frequent');
  }
});
