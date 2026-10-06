import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createGame, createChallenge, applyAction, advanceTicks, encodeGame, decodeGame, restartGame, StoneChainsOptionsError } from '../dist/colour-chains.js';

function finishPair(state) {
  const target = state.completedPairs + 1;
  const transition = applyAction(state, { kind: 'hard-drop' });
  assert.equal(transition.accepted, true);
  let current = transition.state; const events = [...transition.events]; let guard = 0;
  while ((current.completedPairs < target || current.phase !== 'falling' || !current.active) && !['lost', 'finished'].includes(current.phase)) {
    assert.ok(guard++ < 2000, 'pair resolution remains bounded');
    const tick = advanceTicks(current, 1); current = tick.state; events.push(...tick.events);
  }
  return { state: current, events };
}
function indexEvents(events, type) { return events.findIndex(event => event.type === type); }

test('weather is opt-in, requires Shizen, and remains excluded from Daily and Challenges', () => {
  const base = createGame({ mode: 'arcade', seed: 'weather-options', nature: true });
  assert.deepEqual(createGame({ mode: 'arcade', seed: 'weather-options', nature: true, weather: undefined }), base);
  assert.throws(() => createGame({ weather: 'frequent' }), StoneChainsOptionsError);
  assert.throws(() => createGame({ nature: true, weather: 'always' }), StoneChainsOptionsError);
  assert.throws(() => createGame({ mode: 'daily', dailyDate: '2026-10-05', nature: true, weather: 'rare' }), StoneChainsOptionsError);
  assert.throws(() => createChallenge({ id: 'no-weather', board: [], queue: [], goal: { kind: 'empty-board' }, witness: [], weather: 'rare' }), StoneChainsOptionsError);
  for (const weather of ['frequent', 'rare']) {
    const initial = createGame({ mode: 'arcade', seed: `weather-${weather}`, nature: true, weather });
    assert.deepEqual(decodeGame(encodeGame(initial)), initial);
    assert.equal(restartGame(initial).settings.weather, weather);
  }
});

test('frequent schedule alternates a visible jumble at pair 2 and lightning at pair 4 after settlement', () => {
  let weather = createGame({ mode: 'arcade', seed: 'weather-0', nature: true, weather: 'frequent' });
  let control = createGame({ mode: 'arcade', seed: 'weather-0', nature: true });
  let turn2Colours; let finalEvents = [];
  for (let turn = 1; turn <= 4; turn++) {
    if (turn === 2) {
      turn2Colours = new Map([...weather.board.filter(Boolean), ...weather.active.gems].map(gem => [gem.id, gem.colour]));
    }
    const weatherTurn = finishPair(weather); const controlTurn = finishPair(control);
    weather = weatherTurn.state; control = controlTurn.state; finalEvents = weatherTurn.events;
    assert.equal(weather.completedPairs, turn);
    assert.equal(weather.randomState, control.randomState);
    assert.deepEqual(weather.next, control.next);
    assert.deepEqual(weather.bag, control.bag);
    assert.deepEqual(weather.active.gems.map(gem => [gem.id, gem.colour, gem.magnetic]), control.active.gems.map(gem => [gem.id, gem.colour, gem.magnetic]));
    assert.equal(weather.score, control.score, 'weather awards no points without an ordinary clear');
    if (turn === 1 || turn === 3) assert.equal(weatherTurn.events.some(event => event.type === 'weather-triggered'), false);
    if (turn === 2) {
      const trigger = weatherTurn.events.find(event => event.type === 'weather-triggered');
      const jumble = weatherTurn.events.find(event => event.type === 'jumble-completed');
      assert.deepEqual([trigger.kind, trigger.turn], ['jumble', 2]);
      assert.equal(jumble.changed, true);
      assert.ok(jumble.moves.length > 0);
      assert.ok(indexEvents(weatherTurn.events, 'pair-locked') < indexEvents(weatherTurn.events, 'weather-triggered'));
      assert.ok(indexEvents(weatherTurn.events, 'weather-triggered') < indexEvents(weatherTurn.events, 'pair-spawned'));
      const afterById = new Map(weather.board.flatMap((gem, index) => gem ? [[gem.id, { gem, x: index % 6, y: Math.floor(index / 6) - 3 }]] : []));
      for (const move of jumble.moves) {
        assert.equal(afterById.get(move.id).gem.colour, turn2Colours.get(move.id));
        assert.deepEqual([afterById.get(move.id).x, afterById.get(move.id).y], [move.to.x, move.to.y]);
      }
      assert.equal(weather.weatherResolvedPairs, 2);
    }
    if (turn === 4) {
      const trigger = weatherTurn.events.find(event => event.type === 'weather-triggered');
      const lightning = weatherTurn.events.find(event => event.type === 'lightning-struck');
      assert.deepEqual([trigger.kind, trigger.turn], ['lightning', 4]);
      assert.ok(lightning.removedIds.length > 0);
      const remaining = new Set(weather.board.flatMap(gem => gem ? [gem.id] : []));
      for (const id of lightning.removedIds) assert.equal(remaining.has(id), false);
      assert.equal(weather.weatherResolvedPairs, 4);
    }
  }
  assert.deepEqual(decodeGame(encodeGame(weather)), weather);
  assert.equal(restartGame(weather).settings.weather, 'frequent');
  assert.ok(finalEvents.some(event => event.type === 'lightning-struck'));
});

test('rare weather waits until the eighth completed pair', () => {
  let state = createGame({ mode: 'arcade', seed: 'rare-0', nature: true, weather: 'rare' });
  for (let turn = 1; turn <= 8; turn++) {
    const result = finishPair(state); state = result.state;
    const triggers = result.events.filter(event => event.type === 'weather-triggered');
    if (turn < 8) assert.equal(triggers.length, 0);
    else assert.deepEqual(triggers.map(event => [event.kind, event.turn]), [['jumble', 8]]);
  }
  assert.equal(state.weatherResolvedPairs, 8);
});
