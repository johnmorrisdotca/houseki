import { describe, expect, it } from 'vitest';
import { advanceTicks, applyAction, campaignManifest, createGame, createLevel, createLesson, getLevel, getLesson, lessonManifest, levelManifest, tutorialManifest } from '../dist/magnetic-blocks.js';
import { generateContent } from '../scripts/magnetic-blocks-levels.mjs';

function runWitness(options, witness) {
  let state = createGame(options);
  for (const action of witness) {
    for (let guard = 0; state.phase !== 'falling' && guard < 10; guard++) {
      if (['won', 'lost', 'finished'].includes(state.phase)) break;
      state = advanceTicks(state, 60).state;
    }
    const result = applyAction(state, action);
    expect(result.accepted, `${action.kind} rejected in ${state.phase}: ${result.reason}`).toBe(true);
    state = result.state;
  }
  for (let guard = 0; !['won', 'lost', 'finished'].includes(state.phase) && guard < 10; guard++) state = advanceTicks(state, 60).state;
  return state;
}

describe('Magnetic Blocks authored campaign', () => {
  it('contains 50 canonically distinct levels with stable metadata and all five mechanic groups', () => {
    expect(levelManifest).toHaveLength(50);
    expect(campaignManifest.count).toBe(50);
    expect(new Set(levelManifest.map(level => level.id)).size).toBe(50);
    expect(new Set(levelManifest.map(level => level.canonicalKey)).size).toBe(50);
    expect(new Set(levelManifest.map(level => level.canonicalKeyHash)).size).toBe(50);
    expect(levelManifest.every(level => level.proofStatus === 'engine-witness-verified' && level.reviewStatus === 'human-review-pending')).toBe(true);
    for (const tag of ['calm-bonded', 'magnetic-split', 'floor-schedule', 'floor-switch', 'magnetic-impact']) {
      expect(levelManifest.filter(level => level.tags.includes(tag))).toHaveLength(10);
    }
    expect(levelManifest.filter(level => level.metrics.witnessPlacements > 1)).toHaveLength(10);
    expect(levelManifest.filter(level => level.metrics.witnessPlacements > 1).every(level => level.metrics.setupPlacementChoices > 0)).toBe(true);
    expect(levelManifest.filter(level => level.tags.includes('floor-switch')).every(level => level.metrics.witnessFloorDecisions === 1)).toBe(true);
    expect(levelManifest.filter(level => level.counterfactual)).toHaveLength(40);
    expect(levelManifest.filter(level => level.counterfactual).every(level => level.counterfactual.result !== 'won')).toBe(true);
    expect(levelManifest.filter(level => level.impactEvidence)).toHaveLength(10);
    expect(levelManifest.filter(level => level.impactEvidence).every(level => level.impactEvidence.removedSupportCount > 0)).toBe(true);
    expect(levelManifest.every(level => level.options.pieceLimit === level.options.queue.length)).toBe(true);
    expect(levelManifest.every(level => level.witness.some(action => action.kind === 'hard-drop'))).toBe(true);
    expect(levelManifest.every(level => level.options.goal?.kind === 'clear-targets' && level.metrics.legalPlacementChoices > 0)).toBe(true);
    expect(levelManifest.map(level => level.score)).toEqual([...levelManifest.map(level => level.score)].sort((a, b) => a - b));
    expect(levelManifest.every(level => level.marks === Math.min(5, 1 + Math.floor(level.score / 20)))).toBe(true);
  });

  it('executes every stored witness through the real engine to the first win', () => {
    for (const level of levelManifest) {
      const end = runWitness(level.options, level.witness);
      expect(end.phase, level.id).toBe('won');
      expect(end.placements, level.id).toBe(level.metrics.witnessPlacements);
      expect(createLevel(level.id).settings.seed).toBe(level.options.seed);
      expect(createLevel(level.number).settings.goal.targetIds).toEqual([...level.options.goal.targetIds].sort((a, b) => a - b));
      expect(getLevel(level.id)).toBe(level);
    }
  });

  it('replays the stored floor counterfactuals and confirms the alternate setup does not win', () => {
    for (const level of levelManifest.filter(item => item.counterfactual)) {
      const options = structuredClone(level.options);
      let witness = level.witness;
      if (level.counterfactual.kind === 'floor-switch') {
        options.floorSwitch = false;
        witness = witness.filter(action => action.kind !== 'set-floor-override');
      } else {
        options.schedule = { kind: 'fixed', floor: 'calm' };
      }
      expect(runWitness(options, witness).phase, level.id).not.toBe('won');
    }
  });

  it('confirms impact levels hit a real support and still win without the optional impact rule', () => {
    for (const level of levelManifest.filter(item => item.impactEvidence)) {
      const options = structuredClone(level.options);
      options.magneticImpact = false;
      const end = runWitness(options, level.witness);
      expect(end.phase, level.id).toBe('won');
      expect(end.impactRemovedIds).toHaveLength(0);
    }
  });

  it('reproduces the same pool, ordering, grades, and checksum from the generator', () => {
    expect(generateContent().campaign).toEqual(campaignManifest);
    expect(campaignManifest.difficultyFormula).toContain('winningChoicesAtFinalDecision');
    expect(campaignManifest.normalization).toContain('fifty levels');
    expect(campaignManifest.marksFormula).toBe('min(5, 1 + floor(score / 20))');
  });

  it('provides three bilingual, bounded lessons through both lesson names', () => {
    expect(tutorialManifest).toBe(lessonManifest);
    expect(lessonManifest).toHaveLength(3);
    expect(lessonManifest.every(lesson => lesson.title.en && lesson.title.ja && lesson.objective.en && lesson.objective.ja)).toBe(true);
    for (const lesson of lessonManifest) {
      expect(getLesson(lesson.id)).toBe(lesson);
      expect(createLesson(lesson.id).settings.seed).toBe(lesson.options.seed);
    }
  });
});
