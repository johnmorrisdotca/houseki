import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { applyAction, advanceTicks, createGame, validateChallengeWitness, CAMPAIGN_CHECKSUM, CAMPAIGN_COUNT, GENERATION_REVISION, GEM_SWAP_CAMPAIGN, GEM_SWAP_LESSONS, GRADING_VERSION, GRADING_WEIGHTS, SAMPLE_BUDGET } from '../dist/gem-swap.js';
import { generateContent } from '../scripts/gem-swap-levels.mjs';

const stable = value => Array.isArray(value) ? `[${value.map(stable).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}` : JSON.stringify(value);

test('campaign has its deliberate complete count, varied objectives, stable IDs and measured increasing order', () => {
  assert.equal(CAMPAIGN_COUNT, 50); assert.equal(GEM_SWAP_CAMPAIGN.length, 50);
  assert.deepEqual(GEM_SWAP_CAMPAIGN.map(level => level.number), Array.from({ length: 50 }, (_, index) => index + 1));
  assert.equal(new Set(GEM_SWAP_CAMPAIGN.map(level => level.id)).size, 50);
  assert.equal(new Set(GEM_SWAP_CAMPAIGN.map(level => level.canonicalKeyHash)).size, 50);
  assert.deepEqual(Object.fromEntries(['score', 'collect', 'chain', 'seals', 'combined'].map(kind => [kind, GEM_SWAP_CAMPAIGN.filter(level => level.tags.includes(kind)).length])), { score: 10, collect: 10, chain: 10, seals: 10, combined: 10 });
  assert.ok(GEM_SWAP_CAMPAIGN.every((level, index) => index === 0 || GEM_SWAP_CAMPAIGN[index - 1].difficultyScore <= level.difficultyScore));
  assert.ok(GEM_SWAP_CAMPAIGN.at(-1).difficultyScore > GEM_SWAP_CAMPAIGN[0].difficultyScore);
  assert.ok(GEM_SWAP_CAMPAIGN.slice(-10).filter(level => level.challenge.moveLimit >= 2 && (level.challenge.goals.some(goal => goal.kind === 'chain') || level.challenge.goals.some(goal => goal.kind === 'seals') || level.challenge.goals.length > 1)).length >= 8);
  assert.ok(GEM_SWAP_CAMPAIGN.slice(-10).filter(level => level.challenge.moveLimit >= 4).length >= 8);
  assert.ok(GEM_SWAP_CAMPAIGN.filter(level => level.rawMetrics.specialCombinations > 0).length >= 2);
  for (const level of GEM_SWAP_CAMPAIGN) {
    assert.equal(level.gradingVersion, GRADING_VERSION); assert.equal(level.proofStatus, 'engine-witness-verified'); assert.equal(level.reviewStatus, 'human-review-pending');
    assert.equal(level.difficultyMarks, Math.min(5, 1 + Math.floor(level.difficultyScore / 20)));
    assert.equal(level.rawMetrics.seededPlayoutSamples, SAMPLE_BUDGET);
    assert.ok(level.rawMetrics.legalSwapCount > 0); assert.ok(level.rawMetrics.seededPlayoutSuccessRate >= 0 && level.rawMetrics.seededPlayoutSuccessRate <= 1);
    assert.equal(level.witness.filter(operation => operation.kind === 'action' && operation.action.kind === 'swap').length, level.challenge.moveLimit);
  }
});

test('every selected witness wins through public replay and an independent action runner', () => {
  for (const level of GEM_SWAP_CAMPAIGN) {
    assert.equal(validateChallengeWitness(level.options, level.witness).valid, true, level.id);
    let state = createGame(level.options);
    for (const operation of level.witness) {
      if (operation.kind === 'action') {
        const result = applyAction(state, operation.action); assert.equal(result.accepted, true, `${level.id}: ${result.reason}`); state = result.state;
      } else if (operation.kind === 'ticks') state = advanceTicks(state, operation.count).state;
    }
    assert.equal(state.outcome, 'won', level.id);
    assert.ok(state.swapCount <= level.challenge.moveLimit, level.id);
  }
});

test('three bilingual lessons are playable action and settling sequences with verified events', () => {
  assert.equal(GEM_SWAP_LESSONS.length, 3);
  assert.deepEqual(GEM_SWAP_LESSONS.map(lesson => lesson.id), ['gem-swap-lesson-basics', 'gem-swap-lesson-beam', 'gem-swap-lesson-seal']);
  for (const lesson of GEM_SWAP_LESSONS) {
    assert.ok(lesson.title.en && lesson.title.ja); assert.equal(lesson.reviewStatus, 'human-review-pending');
    let state = createGame(lesson.initial);
    for (const step of lesson.steps) {
      let events = [];
      if (step.kind === 'action') {
        const result = applyAction(state, step.action); assert.equal(result.accepted, step.accepted, `${lesson.id}/${step.id}`);
        if (!step.accepted) assert.equal(result.reason, step.reason, `${lesson.id}/${step.id}`);
        else { state = result.state; events = result.events; }
      } else {
        const result = advanceTicks(state, step.count); state = result.state; events = result.events;
      }
      if (step.event) assert.ok(events.some(event => event.type === step.event), `${lesson.id}/${step.id} expected ${step.event}`);
      if (step.cell !== undefined && step.kind === 'ticks') assert.ok(events.some(event => event.type === 'cells-removed' && event.cells.includes(step.cell)), `${lesson.id}/${step.id} did not clear the seal cell`);
      assert.ok(step.text.en && step.text.ja);
    }
    if (lesson.id === 'gem-swap-lesson-seal') assert.equal(state.outcome, 'won');
    if (lesson.id === 'gem-swap-lesson-seal') assert.equal(validateChallengeWitness(lesson.initial, lesson.witness).valid, true);
  }
});

test('generated data is deeply immutable and its manifest checksum is reproducible', () => {
  assert.ok(Object.isFrozen(GEM_SWAP_CAMPAIGN)); assert.ok(Object.isFrozen(GEM_SWAP_CAMPAIGN[0].options.challenge.goals));
  assert.ok(Object.isFrozen(GEM_SWAP_LESSONS[0].steps));
  assert.equal(Object.values(GRADING_WEIGHTS).reduce((sum, value) => sum + value, 0), 100);
  const source = stable({ campaign: GEM_SWAP_CAMPAIGN, lessons: GEM_SWAP_LESSONS, generationRevision: GENERATION_REVISION, gradingVersion: GRADING_VERSION, sampleBudget: SAMPLE_BUDGET, gradingWeights: GRADING_WEIGHTS });
  assert.equal(createHash('sha256').update(source).digest('hex'), CAMPAIGN_CHECKSUM);
});

test('offline generation and grading regenerate the checked-in campaign exactly', () => {
  const regenerated = generateContent();
  assert.equal(regenerated.checksum, CAMPAIGN_CHECKSUM);
  assert.deepEqual(regenerated.campaign, GEM_SWAP_CAMPAIGN);
  assert.deepEqual(regenerated.lessons, GEM_SWAP_LESSONS);
});
