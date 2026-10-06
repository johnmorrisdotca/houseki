import { test } from 'vitest';
import assert from 'node:assert/strict';
import { applyEarthquake, applyLightning, createNatureState, isEnvironmentTurnScheduled, NatureOptionsError, previewEarthquake, previewFault, previewJumble, previewLightning } from '../dist/nature.js';

const stone = (id, colour = 'jade', props = {}) => ({ id, kind: 'stone', colour, ...props });
const obstacle = id => ({ id, kind: 'obstacle' });
function board(width, height, placements, options = {}) {
  const cells = Array(width * height).fill(null);
  for (const [x, y, entity] of placements) cells[y * width + x] = entity;
  return createNatureState({ width, height, cells, seed: options.seed ?? 'nature-env', ...(options.activeCells ? { activeCells: options.activeCells } : {}) });
}

test('fault follows a bounded jagged row-by-row path, fractures those cells and consumes their stable IDs once', () => {
  const state = board(6, 5, [[1, 0, stone(11)], [1, 1, stone(12)], [0, 4, stone(30)]], { seed: 'fault-fixture' });
  const preview = previewFault(state);
  assert.deepEqual(preview.path, [1, 7, 14, 19, 26]);
  assert.ok(preview.path.every((index, y) => Math.floor(index / 6) === y && index % 6 >= 1 && index % 6 <= 4));
  assert.ok(preview.path.slice(1).every((index, y) => Math.abs(index % 6 - preview.path[y] % 6) <= 1));
  assert.ok(Array.from({ length: 5 }, (_, y) => preview.activeCells[y * 6] && preview.activeCells[y * 6 + 5]).every(Boolean));
  assert.deepEqual(preview.fracturedCells, preview.path);
  assert.deepEqual(preview.removedIds, [11, 12]);
  assert.deepEqual(preview.path.map(index => preview.activeCells[index]), [false, false, false, false, false]);
  assert.equal(preview.cells[24]?.id, 30);
  assert.equal(state.activeCells.every(Boolean), true);
  const committed = applyEarthquake(state, { kind: 'fault' });
  assert.deepEqual(committed.events.map(event => event.type), ['fault-opened']);
  assert.deepEqual(committed.events[0].removedIds, [11, 12]);
  assert.equal(committed.state.cells[24]?.id, 30);
});

test('jumble selects a connected patch no larger than 3×3, makes a nontrivial seeded permutation, and preserves IDs and colours', () => {
  const state = board(3, 3, [
    [0, 0, stone(1, 'red')], [1, 0, stone(2, 'blue')], [2, 0, stone(3, 'green')],
    [0, 1, stone(4, 'gold')], [1, 1, stone(5, 'purple')], [2, 1, stone(6, 'teal')],
  ], { seed: 'jumble-fixture' });
  const first = previewJumble(state), second = previewJumble(state);
  assert.deepEqual(first, second);
  assert.deepEqual(first.patchCells, [2, 5, 8]);
  assert.deepEqual(first.moves.map(move => [move.id, move.from.x, move.from.y, move.to.x, move.to.y]), [[3, 2, 0, 2, 1], [6, 2, 1, 2, 0]]);
  assert.equal(first.changed, true);
  const before = new Map(state.cells.filter(Boolean).map(entity => [entity.id, entity.colour]));
  const after = new Map(first.cells.filter(Boolean).map(entity => [entity.id, entity.colour]));
  assert.deepEqual(after, before);
  assert.deepEqual(state.cells.map(entity => entity?.id ?? null), [1, 2, 3, 4, 5, 6, null, null, null]);
  const committed = applyEarthquake(state, { kind: 'jumble' });
  assert.deepEqual(committed.events.map(event => event.type), ['jumble-completed']);
  assert.deepEqual(committed.state.cells, first.cells);
});

test('jumble does not move obstacles or anchored stones and records an explicit no-op when no patch is eligible', () => {
  const state = board(3, 3, [
    [0, 0, stone(1, 'red')], [1, 0, stone(2, 'blue')], [2, 0, stone(3, 'green')],
    [0, 1, stone(4, 'gold', { magnetic: true, anchored: true })], [1, 1, obstacle(5)], [2, 1, stone(6, 'teal')],
  ], { seed: 'blocked-jumble' });
  const preview = previewJumble(state);
  assert.equal(preview.changed, true);
  assert.ok(preview.moves.every(move => move.id !== 4 && move.id !== 5));
  assert.equal(preview.cells[3]?.id, 4);
  assert.equal(preview.cells[4]?.id, 5);
  const noPatch = board(2, 2, [[0, 0, stone(1)], [1, 0, obstacle(2)], [0, 1, obstacle(3)], [1, 1, stone(4)]], { seed: 'no-jumble-patch' });
  const unchanged = applyEarthquake(noPatch, { kind: 'jumble' });
  assert.equal(unchanged.state, noPatch);
  assert.equal(unchanged.state.cells[0]?.id, 1);
  assert.equal(unchanged.state.randomState, noPatch.randomState);
  assert.deepEqual(unchanged.events, [{ type: 'jumble-completed', changed: false, reason: 'no-eligible-patch', patchCells: [], moves: [] }]);
});

test('Combined earthquakes fracture first and then jumble only surviving cells', () => {
  const placements = [];
  let id = 1;
  for (let y = 0; y < 5; y++) for (let x = 0; x < 6; x++) placements.push([x, y, stone(id++, `c${x % 3}`)]);
  const state = board(6, 5, placements, { seed: 'combined-fixture' });
  const preview = previewEarthquake(state, { kind: 'combined' });
  assert.deepEqual(preview.fault.path, [2, 9, 14, 21, 27]);
  assert.equal(preview.jumble.changed, true);
  assert.deepEqual(preview.jumble.patchCells.some(index => preview.fault.fracturedCells.includes(index)), false);
  const committed = applyEarthquake(state, { kind: 'combined' });
  assert.deepEqual(committed.events.map(event => event.type), ['fault-opened', 'jumble-completed']);
  assert.deepEqual(committed.state, applyEarthquake(state, { kind: 'combined' }).state);
  const survivors = committed.state.cells.filter(Boolean).map(entity => entity.id);
  assert.ok(survivors.every(id => !preview.fault.removedIds.includes(id)));
  assert.equal(new Set(survivors).size, survivors.length);
});

test('lightning removes at most two exposed stones per chosen column and stops at obstacles or mask gaps', () => {
  const mask = Array(30).fill(true); mask[2 * 6 + 2] = false;
  const state = board(6, 5, [
    [0, 0, stone(10)], [0, 1, stone(15)], [0, 3, stone(16)],
    [1, 1, stone(11)], [1, 4, stone(17)],
    [2, 1, stone(12)], [2, 3, stone(18)],
    [3, 0, stone(13)], [4, 0, obstacle(14)], [4, 2, stone(19)],
  ], { seed: 'lightning-fixture', activeCells: mask });
  const preview = previewLightning(state, { columns: [2, 0, 1] });
  assert.deepEqual(preview.columns, [0, 1, 2]);
  assert.deepEqual(preview.removedCells, [0, 6, 7, 25, 8]);
  assert.deepEqual(preview.removedIds, [10, 15, 11, 17, 12]);
  assert.equal(preview.cells[18]?.id, 16);
  assert.equal(preview.cells[20]?.id, 18);
  assert.equal(preview.cells[16]?.id, 19);
  assert.equal(preview.cells[3]?.id, 13);
  assert.equal(preview.cells[4]?.id, 14);
  const blockedColumn = previewLightning(state, { columns: [4] });
  assert.deepEqual(blockedColumn.removedIds, []);
  assert.equal(blockedColumn.cells[16]?.id, 19);
  const committed = applyLightning(state, { columns: [0, 1, 2] });
  assert.deepEqual(committed.events[0].removedIds, preview.removedIds);
  assert.equal(committed.state.cells[18]?.id, 16);
});

test('seeded lightning selection is replayable, and disabled operations preserve exact state parity', () => {
  const state = board(8, 4, [[0, 0, stone(1)], [1, 0, stone(2)], [2, 0, stone(3)], [3, 0, stone(4)], [4, 0, stone(5)], [5, 0, stone(6)], [6, 0, stone(7)], [7, 0, stone(8)]], { seed: 'seeded-lightning' });
  const previewA = previewLightning(state), previewB = previewLightning(state);
  assert.deepEqual(previewA, previewB);
  assert.ok(previewA.columns.length >= 1 && previewA.columns.length <= 3);
  assert.equal(new Set(previewA.columns).size, previewA.columns.length);
  assert.deepEqual(applyLightning(state, {}).state, applyLightning(state, {}).state);
  const quake = applyEarthquake(state, { kind: 'combined', enabled: false });
  const lightning = applyLightning(state, { enabled: false, columns: [0] });
  assert.equal(quake.state, state); assert.deepEqual(quake.events, []);
  assert.equal(lightning.state, state); assert.deepEqual(lightning.events, []);
  assert.throws(() => previewLightning(state, { enabled: false, columns: [8] }), NatureOptionsError);
});

test('turn schedules are pure, one-based and validate authored placement lists', () => {
  assert.equal(isEnvironmentTurnScheduled(4, { kind: 'frequent' }), true);
  assert.equal(isEnvironmentTurnScheduled(3, { kind: 'frequent' }), false);
  assert.equal(isEnvironmentTurnScheduled(8, { kind: 'rare' }), true);
  assert.equal(isEnvironmentTurnScheduled(7, { kind: 'rare' }), false);
  assert.equal(isEnvironmentTurnScheduled(5, { kind: 'midlevel', turn: 5 }), true);
  assert.deepEqual([1, 3, 7].map(turn => isEnvironmentTurnScheduled(turn, { kind: 'authored', turns: [1, 3, 7] })), [true, true, true]);
  assert.equal(isEnvironmentTurnScheduled(4, { kind: 'authored', turns: [1, 3, 7] }), false);
  assert.throws(() => isEnvironmentTurnScheduled(0, { kind: 'rare' }), NatureOptionsError);
  assert.throws(() => isEnvironmentTurnScheduled(1, { kind: 'authored', turns: [2, 2] }), NatureOptionsError);
});


test('jumble makes a visible colour or magnetic change, and uniform patches are explicit no-ops',()=>{
 const uniform=createNatureState({width:3,height:3,cells:Array.from({length:9},(_,i)=>({id:i+1,kind:'stone',colour:'red'}))});
 assert.equal(previewJumble(uniform).changed,false);
 for(let seed=0;seed<50;seed++){
  const mixed=createNatureState({width:3,height:3,seed:String(seed),cells:Array.from({length:9},(_,i)=>({id:i+1,kind:'stone',colour:i===8?'blue':'red'}))});
  const preview=previewJumble(mixed);assert.equal(preview.changed,true);assert.notDeepEqual(preview.cells.map(gem=>gem?.colour),mixed.cells.map(gem=>gem?.colour));
 }
});
