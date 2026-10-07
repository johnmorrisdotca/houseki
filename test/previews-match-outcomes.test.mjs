// A preview is a promise about the committed move, so these tests hold it to the move: over many played boards, the
// cells a preview names are compared with the board the real action leaves, never with another preview helper.
import { test } from 'vitest';
import assert from 'node:assert/strict';
import * as chains from '../dist/colour-chains.js';
import * as fall from '../dist/falling-triplets.js';
import * as blocks from '../dist/magnetic-blocks.js';

/** A small seeded generator, so a failure is the same failure on every machine. */
function random(seed) {
  let state = seed >>> 0 || 1;
  return () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32;
}
/** Plays `games` boards with `moves`, calling `visit` on every state that has a piece falling. */
function play(engine, options, moves, visit, games = 24) {
  for (let g = 0; g < games; g++) {
    const roll = random(g * 13 + 5);
    let state = engine.createGame({ ...options(g), seed: `preview-${g}` });
    for (let step = 0; step < 500 && !['lost', 'won', 'finished'].includes(state.phase); step++) {
      if (state.phase === 'falling' && state.active) {
        visit(state);
        state = engine.applyAction(state, { kind: moves[Math.floor(roll() * moves.length)] }).state;
      }
      state = engine.advanceTicks(state, Math.floor(roll() * 40) + 1).state;
    }
  }
}
const at = (board, width, hidden, ids) => board.flatMap((gem, index) => (gem && ids.has(gem.id) ? [[gem.id, index % width, Math.floor(index / width) - hidden]] : [])).sort((a, b) => a[0] - b[0]);

test('Colour Chains: the Shizen hard-drop preview names where the pair locks and where it comes to rest', () => {
  const seen = { checked: 0, rebounds: 0, falls: 0 };
  for (const weather of [undefined, 'frequent']) {
    play(chains, (g) => ({ mode: 'arcade', nature: true, preset: ['standard', 'wide', 'narrow'][g % 3], ...(weather ? { weather } : {}) }), ['left', 'right', 'rotate-clockwise', 'hard-drop', 'soft-drop'], (state) => {
      const preview = chains.powerDropPreview(state);
      if (!preview) return;
      const ids = new Set(state.active.gems.map((gem) => gem.id));
      const dropped = chains.applyAction(state, { kind: 'hard-drop' });
      assert.equal(dropped.accepted, true);
      const landed = dropped.events.find((event) => event.type === 'power-drop-landed');
      assert.deepEqual(preview.finalCells.map((cell) => [cell.id, cell.x, cell.y]).sort((a, b) => a[0] - b[0]), landed.cells.map((cell) => [cell.id, cell.x, cell.y]).sort((a, b) => a[0] - b[0]), 'finalCells are where the pair locks');
      const board = dropped.state.gravityBoard ?? dropped.state.board;
      assert.deepEqual(preview.settledCells.map((cell) => [cell.id, cell.x, cell.y]).sort((a, b) => a[0] - b[0]), at(board, state.settings.width, 3, ids), 'settledCells are the committed board');
      seen.checked++;
      if (preview.rebound) seen.rebounds++;
      if (JSON.stringify(preview.settledCells.map((cell) => [cell.x, cell.y])) !== JSON.stringify(preview.finalCells.map((cell) => [cell.x, cell.y]))) seen.falls++;
    });
  }
  assert.ok(seen.checked > 1000, `many boards were checked (${seen.checked})`);
  assert.ok(seen.rebounds > 100, 'rebounds were exercised');
  assert.ok(seen.falls > 100, 'stones that fall into a gap after the rebound were exercised');
});

test('Colour Chains: the gentle Place preview is the committed landing, and no power-drop preview is offered', () => {
  let checked = 0;
  play(chains, () => ({ mode: 'relaxed', nature: true }), ['left', 'right', 'rotate-clockwise'], (state) => {
    assert.equal(chains.powerDropPreview(state), null);
    const landing = chains.landingCells(state);
    const placed = chains.applyAction(state, { kind: 'place' });
    const ids = state.active.gems.map((gem) => gem.id);
    const board = placed.state.gravityBoard ?? placed.state.board;
    const actual = ids.map((id) => { const index = board.findIndex((gem) => gem?.id === id); return [index % state.settings.width, Math.floor(index / state.settings.width) - 3]; });
    assert.deepEqual(landing.map((cell) => [cell.x, cell.y]), actual);
    checked++;
  });
  assert.ok(checked > 500);
});

test('Falling Triplets: the landing row is where a hard drop leaves the triplet', () => {
  let checked = 0;
  play(fall, () => ({ mode: 'arcade' }), ['left', 'right', 'cycle-forward'], (state) => {
    const row = fall.landingY(state);
    const dropped = fall.applyAction(state, { kind: 'hard-drop' });
    const board = dropped.state.gravityBoard ?? dropped.state.board;
    const ids = state.active.gems.map((gem) => gem.id);
    const rows = ids.map((id) => Math.floor(board.findIndex((gem) => gem?.id === id) / state.settings.width) - 3);
    assert.deepEqual(rows, ids.map((_, index) => row + index));
    checked++;
  });
  assert.ok(checked > 1000);
});

test('Magnetic Blocks: campaigns use gentle placement; impact free play distinguishes land from hard drop', () => {
  let differ = 0;
  let checked = 0;
  for (const level of blocks.levelManifest) {
    const roll = random(level.number * 3 + 1);
    let state = blocks.createLevel(level.id);
    for (let step = 0; step < 60 && !['won', 'lost', 'finished'].includes(state.phase); step++) {
      if (state.phase === 'falling' && state.active) {
        const ids = (action) => JSON.stringify((action.state.gravityBoard ?? action.state.board).map((gem) => gem?.id ?? null));
        const land = blocks.applyAction(state, { kind: 'land' });
        const drop = blocks.applyAction(state, { kind: 'hard-drop' });
        assert.equal(land.accepted && drop.accepted, true);
        checked++;
        if (ids(land) !== ids(drop)) differ++;
        state = blocks.applyAction(state, { kind: ['left', 'right', 'rotate-clockwise', 'rotate-anticlockwise'][Math.floor(roll() * 4)] }).state;
        if (roll() < 0.35) state = blocks.applyAction(state, { kind: 'land' }).state;
      }
      state = blocks.advanceTicks(state, Math.floor(roll() * 200) + 1).state;
    }
  }
  assert.ok(checked >= 100);
  assert.equal(differ, 0, 'current campaigns do not enable impact');
  const initialBoard = Array(48).fill(null);
  initialBoard[38] = { id: 1, colour: 'blue' };
  initialBoard[39] = { id: 2, colour: 'green' };
  initialBoard[44] = { id: 3, colour: 'gold' };
  initialBoard[45] = { id: 4, colour: 'gold' };
  const impact = blocks.createGame({ width: 6, height: 8, initialBoard, magneticImpact: true,
    schedule: { kind: 'fixed', floor: 'magnetic' }, seed: 'impact-preview-review' });
  const land = blocks.applyAction(impact, { kind: 'land' });
  const drop = blocks.applyAction(impact, { kind: 'hard-drop' });
  assert.equal(land.accepted && drop.accepted, true);
  assert.notDeepEqual(land.state.gravityBoard ?? land.state.board, drop.state.gravityBoard ?? drop.state.board);
  assert.deepEqual(drop.state.impactRemovedIds, [1, 2]);
  assert.equal(new Set(blocks.levelManifest.map((level) => level.options.mode)).size, 1);
  assert.equal(blocks.levelManifest[0].options.mode, 'relaxed', 'campaign levels are played in the gentle mode, with Place');
});
