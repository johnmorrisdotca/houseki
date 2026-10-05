import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { applyAction, advanceTicks, campaignManifest, createChallenge, createLevel, getLevel, getTutorial, levelManifest, tutorialManifest } from '../dist/stone-collapse.js';
import { generateCampaign, tutorialDefinitions } from '../scripts/stone-collapse-levels.mjs';

function oracleGroup(board, width, height, mask, stoneId) {
  const start = board.findIndex(stone => stone?.id === stoneId); if (start < 0) return [];
  const colour = board[start].colour, seen = new Set([start]), pending = [start];
  while (pending.length) {
    const at = pending.pop(), x = at % width, y = Math.floor(at / width);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const next = ny * width + nx;
      if (mask[next] && !seen.has(next) && board[next]?.colour === colour) { seen.add(next); pending.push(next); }
    }
  }
  return [...seen].map(index => board[index].id).sort((a, b) => a - b);
}
function oracleGroups(board, width, height, mask) {
  const seen = new Set(), result = [];
  for (const stone of board) {
    if (!stone || seen.has(stone.id)) continue;
    const group = oracleGroup(board, width, height, mask, stone.id); for (const id of group) seen.add(id);
    if (group.length >= 2) result.push(group);
  }
  return result;
}
function oracleSettle(board, removeIds, width, height, mask = Array(board.length).fill(true)) {
  const remove = new Set(removeIds), cells = board.map(stone => stone && remove.has(stone.id) ? null : stone), gravity = [...cells];
  for (let x = 0; x < width; x++) {
    let y = 0;
    while (y < height) {
      while (y < height && !mask[y * width + x]) y++;
      const start = y; while (y < height && mask[y * width + x]) y++;
      const end = y, survivors = [];
      for (let row = start; row < end; row++) if (cells[row * width + x]) survivors.push(cells[row * width + x]);
      for (let row = start; row < end; row++) gravity[row * width + x] = row < end - survivors.length ? null : survivors[row - (end - survivors.length)];
    }
  }
  if (!mask.every(Boolean)) return gravity;
  const columns = [];
  for (let x = 0; x < width; x++) { const column = Array.from({ length: height }, (_, y) => gravity[y * width + x]); if (column.some(Boolean)) columns.push(column); }
  return Array.from({ length: width * height }, (_, index) => columns[index % width]?.[Math.floor(index / width)] ?? null);
}
function sameIds(a, b) { return a.length === b.length && a.every((id, index) => id === b[index]); }
function settleCommitted(state, expectedIds, width, height) {
  const before = state.board;
  assert.deepEqual(oracleGroup(before, width, height, state.settings.mask, expectedIds[0]), expectedIds, 'witness names the complete current connected component');
  const selected = applyAction(state, { kind: 'select', stoneId: expectedIds[0] });
  assert.equal(selected.accepted, true); assert.deepEqual([...selected.state.selectedIds].sort((a, b) => a - b), expectedIds);
  assert.equal(selected.state.previewScore, 5 * expectedIds.length * (expectedIds.length - 1));
  const confirmed = applyAction(selected.state, { kind: 'confirm' });
  assert.equal(confirmed.accepted, true); state = confirmed.state;
  assert.equal(state.phase, 'clear-mark'); assert.deepEqual([...state.pendingIds].sort((a, b) => a - b), expectedIds);
  assert.deepEqual(state.board, before, 'marked stones remain visible during the mark phase');
  const afterRemoval = before.map(stone => stone && expectedIds.includes(stone.id) ? null : stone);
  const expectedSettled = oracleSettle(before, expectedIds, width, height, state.settings.mask);
  assert.deepEqual(state.gravityBoard, expectedSettled, 'gravity destination follows an independent column-and-compression oracle');
  assert.equal(state.score, (confirmed.state.history.at(-1)?.score ?? 0) + 5 * expectedIds.length * (expectedIds.length - 1));
  state = advanceTicks(state, 7).state;
  assert.equal(state.phase, 'clear-remove'); assert.deepEqual(state.board, afterRemoval, 'removal exposes holes before gravity');
  state = advanceTicks(state, 6).state;
  assert.equal(state.phase, 'gravity'); assert.deepEqual(state.board, afterRemoval, 'gravity phase begins from the hole snapshot');
  state = advanceTicks(state, 9).state;
  assert.deepEqual(state.board, expectedSettled, 'gravity settles at the independent expected destination');
  return state;
}
function replay(start, witness) {
  let state = start;
  for (const group of witness) state = settleCommitted(state, group, state.settings.width, state.settings.height);
  return state;
}
function independentCanonical(level) {
  const variants = [];
  for (const mirror of [false, true]) {
    const labels = new Map(), label = colour => { if (!labels.has(colour)) labels.set(colour, labels.size); return labels.get(colour); };
    const board = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) {
      const x = mirror ? level.width - px - 1 : px, stone = level.board[y * level.width + x]; board.push(stone ? label(stone.colour) : null);
    }
    const mask = [];
    for (let y = 0; y < level.height; y++) for (let px = 0; px < level.width; px++) { const x = mirror ? level.width - px - 1 : px; mask.push(level.mask?.[y * level.width + x] ?? true); }
    variants.push(JSON.stringify([level.width, level.height, level.colourCount, level.goal, level.moveLimit, mask, board]));
  }
  return variants.sort()[0];
}

test('campaign generation is reproducible and the frozen 100-level ordering is measured', () => {
  const regenerated = generateCampaign(100);
  assert.deepEqual(regenerated, campaignManifest);
  assert.equal(campaignManifest.count, 100); assert.equal(campaignManifest.candidatePoolCount, 110);
  assert.deepEqual(levelManifest.map(level => level.number), Array.from({ length: 100 }, (_, index) => index + 1));
  assert.equal(new Set(levelManifest.map(level => level.id)).size, 100);
  assert.equal(new Set(levelManifest.map(independentCanonical)).size, 100, 'color renaming and horizontal reflection do not create new boards');
  assert.equal(levelManifest.filter(level => level.mask).length, 20, 'one fifth of the campaign teaches fixed-column silhouettes');
  assert.deepEqual(levelManifest.map(level => level.score), [...levelManifest].map(level => level.score).sort((a, b) => a - b));
  assert.ok(levelManifest.slice(0, 3).every(level => level.marks === 1 && level.rawMetrics.seededPlayoutSuccessRate > 0));
  assert.ok(levelManifest.at(-1).score > levelManifest[0].score);
  assert.ok(levelManifest.slice(-10).every(level => level.rawMetrics.witnessMoves >= 5 && level.rawMetrics.sampledOrderFailureShare >= 0.65), 'hard section combines multi-move routes with measured order risk');
  assert.ok(levelManifest.every(level => level.goal.kind === 'clear-all' && level.moveLimit === level.witness.length));
  assert.ok(levelManifest.every(level => level.proofStatus === 'engine-witness-verified' && level.reviewStatus === 'human-review-pending'));
  assert.ok(Object.isFrozen(campaignManifest) && Object.isFrozen(levelManifest[0]) && Object.isFrozen(levelManifest[0].board));
  for (const level of levelManifest) {
    assert.ok(level.title.en && level.title.ja);
    assert.equal(level.marks, Math.min(5, 1 + Math.floor(level.score / 20)));
    assert.equal(level.canonicalKeyHash, createHash('sha256').update(independentCanonical(level)).digest('hex'));
  }
});

test('all campaign witnesses replay through independent group, score, gravity, and ending checks', () => {
  for (const level of levelManifest) {
    let state = createLevel(level.id); assert.equal(getLevel(level.number), level);
    assert.equal(state.phase, 'ready'); assert.equal(state.challenge.id, level.id); assert.equal(state.settings.tools, false);
    assert.equal(state.board.length, level.width * level.height);
    for (let at = 0; at < state.board.length; at++) assert.equal(Boolean(state.board[at]), state.settings.mask[at], `${level.id} occupancy follows its mask`);
    for (let x = 0; x < level.width; x++) {
      let gap = false;
      for (let y = level.height - 1; y >= 0; y--) { const at = y * level.width + x; if (!state.settings.mask[at]) gap = false; else if (!state.board[at]) gap = true; else assert.equal(gap, false, `${level.id} begins gravity-stable`); }
    }
    const choices = [];
    for (const group of level.witness) { choices.push(oracleGroups(state.board, level.width, level.height, state.settings.mask).length); state = settleCommitted(state, group, level.width, level.height); }
    assert.equal(state.phase, 'won', `${level.id} reaches clear-all`);
    assert.ok(state.board.every(stone => stone === null));
    assert.equal(state.moves, level.witness.length); assert.ok(state.moves <= level.moveLimit);
    assert.equal(state.score, level.witness.reduce((sum, group) => sum + 5 * group.length * (group.length - 1), 1000));
    assert.equal(state.finishAdjustmentApplied, true);
    assert.equal(level.rawMetrics.legalGroupChoices, choices.reduce((sum, count) => sum + count, 0));
    assert.equal(level.rawMetrics.witnessedDecisionCount, level.witness.length);
  }
  assert.equal(getLevel('missing'), undefined); assert.equal(getLevel(1.25), undefined);
  assert.throws(() => createLevel('missing'), /Unknown Stone Collapse level/);
});

test('three bilingual lessons prove group selection, gravity/compression, and removal-order planning', () => {
  assert.deepEqual(tutorialManifest, tutorialDefinitions()); assert.equal(tutorialManifest.length, 3);
  for (const lesson of tutorialManifest) {
    assert.equal(getTutorial(lesson.id), lesson); assert.ok(lesson.title.en && lesson.title.ja && lesson.objective.en && lesson.objective.ja);
    assert.ok(lesson.steps.length && lesson.steps.every(step => step.instruction.en && step.instruction.ja));
    const setup = lesson.setup;
    let state = createChallenge({ id: lesson.id, width: setup.width, height: setup.height, colourCount: setup.colourCount, initialBoard: setup.board, goal: setup.goal, ...(setup.moveLimit ? { moveLimit: setup.moveLimit } : {}), witness: setup.witness });
    const before = state.board;
    state = replay(state, setup.witness);
    assert.equal(state.phase, 'won', `${lesson.id} witness completes`);
    if (lesson.id === 'follow-gravity-and-compression') {
      assert.ok(setup.goal.targetIds.every(id => !state.board.some(stone => stone?.id === id)));
      assert.notDeepEqual(oracleSettle(before, setup.witness[0], setup.width, setup.height), before, 'lesson move visibly changes both column population and stone destinations');
      assert.equal(state.board[1 * setup.width + 1]?.id, 3, 'a stone above the cleared group falls, then its emptied column shifts left');
      assert.ok(Array.from({ length: setup.height }, (_, y) => state.board[y * setup.width + 3]).every(stone => stone === null), 'the rightmost column becomes empty after compression');
    }
    if (lesson.id === 'plan-the-removal-order') {
      const wrong = createChallenge({ id: 'lesson-order-wrong-choice', width: setup.width, height: setup.height, colourCount: setup.colourCount, initialBoard: setup.board, goal: setup.goal, moveLimit: setup.moveLimit, witness: setup.witness });
      const decoy = oracleGroup(wrong.board, setup.width, setup.height, wrong.settings.mask, 11);
      assert.deepEqual(decoy, [11, 14, 15], 'the tempting green group is a real legal choice');
      let failed = applyAction(wrong, { kind: 'select', stoneId: decoy[0] }).state;
      failed = applyAction(failed, { kind: 'confirm' }).state;
      failed = advanceTicks(failed, 22).state;
      assert.equal(failed.phase, 'lost'); assert.ok(failed.board.some(Boolean), 'wrong first removal strands stones and cannot clear the board');
      assert.equal(oracleGroups(failed.board, setup.width, setup.height, failed.settings.mask).length, 0);
    }
  }
});
