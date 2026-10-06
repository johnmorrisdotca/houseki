import { describe, expect, it } from 'vitest';
import { advanceTicks, applyAction, campaignManifest, archivedLevelManifest, createGame, createLevel, createLesson, getLevel, getLesson, lessonManifest, levelManifest, tutorialManifest } from '../dist/magnetic-blocks.js';
import { generateContent, hasCausalTargetDependencies } from '../scripts/magnetic-blocks-levels.mjs';

function resolve(state) {
  for (let guard = 0; guard < 12 && ['gravity', 'clear-mark', 'clear-remove'].includes(state.phase); guard++) state = advanceTicks(state, 60).state;
  return state;
}
function runWitness(options, witness) {
  let state = createGame(options);
  for (const [index, action] of witness.entries()) {
    expect(state.phase, `witness continued after terminal state at action ${index}`).toBe('falling');
    const result = applyAction(state, action);
    expect(result.accepted, `${action.kind} rejected: ${result.reason}`).toBe(true);
    state = resolve(result.state);
    if (state.phase === 'won') expect(index).toBe(witness.length - 1);
  }
  return state;
}

describe('Magnetic Blocks measured campaign', () => {
  it('contains the exact 128-level band plan with stable canonical IDs and scores in fixed ranges', () => {
    expect(levelManifest).toHaveLength(128);
    expect(campaignManifest.count).toBe(128);
    expect(new Set(levelManifest.map(level => level.id)).size).toBe(128);
    expect(new Set(levelManifest.map(level => level.canonicalKeyHash)).size).toBe(128);
    expect(levelManifest.map(level => level.number)).toEqual(Array.from({ length: 128 }, (_, i) => i + 1));
    const expected = [['entry', 32, 1, 20], ['easy', 32, 21, 40], ['intermediate', 32, 41, 60], ['hard', 24, 61, 80], ['expert', 8, 81, 100]];
    let start = 0;
    for (const [band, count, min, max] of expected) {
      const group = levelManifest.slice(start, start + count);
      expect(group).toHaveLength(count);
      expect(group.every(level => level.band === band && level.score >= min && level.score <= max)).toBe(true);
      start += count;
    }
    expect(levelManifest.map(level => level.score)).toEqual([...levelManifest.map(level => level.score)].sort((a, b) => a - b));
    expect(levelManifest.every(level => level.proofStatus === 'engine-witness-verified' && level.reviewStatus === 'human-review-pending')).toBe(true);
    expect(levelManifest.every(level => level.marks === Math.min(5, 1 + Math.floor((level.score - 1) / 20)))).toBe(true);
    expect(levelManifest.every(level => level.options.pieceLimit === level.options.queue.length)).toBe(true);
    expect(new Set(levelManifest.map(level => level.options.seed)).size).toBe(128);
    expect(levelManifest.every(level => !archivedLevelManifest.some(old => old.options.seed === level.options.seed))).toBe(true);
    expect(levelManifest.filter(level => level.band === 'intermediate').every(level => level.tags.includes('two-target-groups') && level.options.goal.targetIds.length === 6 && level.witness.filter(action => action.kind === 'hard-drop').length === 1)).toBe(true);
    expect(levelManifest.filter(level => level.band === 'intermediate').every(level => level.counterfactual?.result !== 'won' && level.metrics.necessaryFloorDecisionShare === 1)).toBe(true);
    expect(campaignManifest.bands.map(band => [band.id, band.count])).toEqual(expected.map(([id, count]) => [id, count]));
  });

  it('reaches the first win with every stored action and clears every marked target', () => {
    for (const level of levelManifest) {
      const end = runWitness(level.options, level.witness);
      expect(end.phase, level.id).toBe('won');
      expect(end.placements, level.id).toBe(level.metrics.witnessPlacements);
      expect(level.options.goal.targetIds.every(id => !end.board.some(gem => gem?.id === id)), level.id).toBe(true);
      expect(createLevel(level.id).settings.seed).toBe(level.options.seed);
      expect(getLevel(level.id)).toBe(level);
      expect(Boolean(level.title.en && level.title.ja && level.objective.en && level.objective.ja)).toBe(true);
      const m = level.metrics;
      const raw = .35 * (1 - m.fullPlanSuccessRate) + .25 * (1 - m.winningPlacementChoices / m.legalPlacementChoices)
        + .15 * m.setupDecisionPressure + .15 * Math.min(1, m.interactingDependencyDepth / 2) + .10 * m.necessaryFloorDecisionShare;
      expect(level.score).toBe(Math.max(1, Math.min(100, 1 + Math.round(99 * raw))));
    }
  });

  it('marks incomplete minimum-plan search honestly and verifies layered floor counterfactuals', () => {
    const layered = levelManifest.filter(level => level.metrics.witnessPlacements > 1);
    expect(layered.length).toBe(32);
    expect(layered.filter(level => level.band === 'expert')).toHaveLength(8);
    expect(layered.filter(level => level.band === 'expert').every(level => level.metrics.interactingDependencyDepth === 2 && level.metrics.necessaryFloorDecisionShare === 1)).toBe(true);
    expect(layered.every(level => level.metrics.targetIdsRemainingAfterPlacement.at(-1) === 0
      && level.metrics.targetIdsClearedByPlacement.filter(count => count > 0).length >= 2)).toBe(true);
    expect(layered.filter(level => level.band === 'hard').every(level => level.metrics.targetIdsMovedByPlacement.slice(0, -1).some(count => count > 0))).toBe(true);
    expect(layered.filter(level => level.band === 'expert').every(level => level.metrics.targetIdsMovedByPlacement.slice(0, -1).filter(count => count > 0).length >= 2)).toBe(true);
    expect(layered.every(level => Math.abs(level.metrics.setupDecisionPressure
      - level.metrics.setupDecisionEvidence.reduce((sum, step) => sum + step.pressure, 0) / level.metrics.setupDecisionEvidence.length) < 1e-12)).toBe(true);
    expect(layered.every(level => level.metrics.minimumPlanSearch.status === 'unknown' && level.metrics.minimumPlanSearch.nodeBudget === 0
      && level.metrics.minimumPlanSearch.nodesVisited === 0 && level.metrics.minimumPlanSearch.upperBound === level.metrics.witnessPlacements)).toBe(true);
    for (const level of levelManifest.filter(level => level.band === 'intermediate' || level.band === 'expert')) {
      const options = structuredClone(level.options);
      options.schedule = { kind: 'fixed', floor: 'calm' };
      options.floorSwitch = false;
      const witness = level.witness.filter(action => action.kind !== 'set-floor-override');
      expect(runWitness(options, witness).phase, level.id).not.toBe('won');
    }
  });

  it('rejects repeated independent clears as a layered dependency', () => {
    const independentGroups = { layerEvidence: true, targetIdsClearedByPlacement: [3, 3, 3], targetIdsRemainingAfterPlacement: [6, 3, 0], targetIdsMovedByPlacement: [0, 0, 0] };
    expect(hasCausalTargetDependencies(independentGroups, 1)).toBe(false);
    expect(hasCausalTargetDependencies(independentGroups, 2)).toBe(false);
  });

  it('keeps the original 50 IDs available as archive records and playable levels', () => {
    expect(archivedLevelManifest).toHaveLength(50);
    for (const level of archivedLevelManifest) {
      expect(getLevel(level.id)).toBe(level);
      expect(createLevel(level.id).settings.seed).toBe(level.options.seed);
    }
  });

  it('regenerates byte-for-byte equivalent campaign data and preserves the three lessons', () => {
    expect(generateContent().campaign).toEqual(campaignManifest);
    expect(campaignManifest.difficultyFormula).toContain('completePlanWinRate');
    expect(campaignManifest.normalization).toContain('Absolute score');
    expect(tutorialManifest).toBe(lessonManifest);
    expect(lessonManifest).toHaveLength(3);
    for (const lesson of lessonManifest) {
      expect(getLesson(lesson.id)).toBe(lesson);
      expect(createLesson(lesson.id).settings.seed).toBe(lesson.options.seed);
      expect(Boolean(lesson.title.en && lesson.title.ja && lesson.objective.en && lesson.objective.ja)).toBe(true);
    }
  });
});
