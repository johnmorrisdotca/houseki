import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createChallenge } from "../dist/falling-triplets.js";
import { HEIGHT, MOTIFS, makeQueue, motifBoard, rng, WIDTH } from "./falling-triplets-levels/boards.mjs";
import {
  canonicalDuplicateKey,
  hashId,
  metricRaw,
  percentile,
  simulateWitness,
} from "./falling-triplets-levels/metrics.mjs";
import { tutorialDefinitions } from "./falling-triplets-levels/tutorials.mjs";

export { tutorialDefinitions } from "./falling-triplets-levels/tutorials.mjs";

export const GENERATION_REVISION = "houseki-triplets-campaign-1.4";
export const GRADING_VERSION = "triplets-choice-grade-2";
export const SAMPLE_BUDGET = 64;

export function generateCandidates(count = 100) {
  if (!Number.isInteger(count) || count < 1 || count > 200)
    throw new RangeError("Candidate selection count must be 1–200");
  const poolCount = count + Math.max(10, Math.ceil(count * 0.1));
  const selected = [];
  const keys = new Set();
  const counters = Object.fromEntries(MOTIFS.map((motif) => [motif, 0]));
  const familyCounts = Object.fromEntries(MOTIFS.map((motif) => [motif, 0]));
  const familyQuotas = Object.fromEntries(
    MOTIFS.map((motif, index) => [
      motif,
      Math.floor(poolCount / MOTIFS.length) + (index < poolCount % MOTIFS.length ? 1 : 0),
    ]),
  );
  let serial = 0;
  let attempts = 0;
  while (selected.length < poolCount && attempts < 10_000) {
    const motif = MOTIFS[serial % MOTIFS.length];
    const ordinal = counters[motif]++;
    serial++;
    attempts++;
    if (familyCounts[motif] >= familyQuotas[motif]) continue;
    const setup = motifBoard(motif, ordinal, 0);
    if (!setup) continue;
    const random = rng(`${motif}|queue|${ordinal}`);
    const queued = makeQueue(random, motif, setup, ordinal);
    if (!queued) continue;
    const { queue, witness } = queued;
    const goal =
      motif === "cascade" ? { type: "chain", minimumChain: 2 } : { type: "targets", targetIds: [setup.targetId] };
    const provisional = {
      id: `${motif}-${String(ordinal).padStart(3, "0")}`,
      seed: `campaign-${motif}-${ordinal}`,
      number: 0,
      width: WIDTH,
      height: HEIGHT,
      colourCount: 5,
      goal,
      board: setup.board,
      queue,
      witness,
      tags: [],
    };
    try {
      createChallenge({
        seed: provisional.seed,
        width: WIDTH,
        height: HEIGHT,
        colourCount: 5,
        board: provisional.board,
        queue,
        goal,
        witness,
      });
    } catch {
      continue;
    }
    if (motif === "cascade") {
      const run = simulateWitness(provisional, witness.length);
      if (
        run?.steps.length !== 2 ||
        run.steps[0].state.phase !== "falling" ||
        run.steps[0].state.maxChain !== 0 ||
        run.steps[0].waves.length !== 0 ||
        run.state.phase !== "won" ||
        run.state.maxChain < 2 ||
        run.state.waves.length < 2 ||
        run.state.waves[0].chain !== 1 ||
        run.state.waves[1].chain !== 2
      )
        continue;
    }
    if (motif === "crossing" && !simulateWitness(provisional, witness.length)?.targetCrossing) continue;
    const key = canonicalDuplicateKey(provisional);
    if (keys.has(key)) continue;
    keys.add(key);
    const id = `ft-${hashId(key)}`;
    const titleBase = {
      vertical: ["Vertical Steps", "縦の一歩"],
      horizontal: ["Side-by-Side", "横並び"],
      diagonal: ["Diagonal Thread", "斜めの糸"],
      crossing: ["Crossing Lines", "交差する線"],
      cascade: ["Cascade Starter", "連鎖の始まり"],
    }[motif];
    const tags = [motif === "cascade" ? "two-wave-chain" : `${motif}-clear`, "target-planning"];
    if (witness.some((step) => step.orientation !== 0)) tags.push("cycle-required");
    if (motif === "cascade") tags.push("2-wave-chain");
    if (queue.length > 2) tags.push("setup-sequence");
    if (setup.board.filter(Boolean).length >= 8) tags.push("space-management");
    selected.push({
      ...provisional,
      id,
      title: { en: `${titleBase[0]} ${ordinal + 1}`, ja: `${titleBase[1]} ${ordinal + 1}` },
      canonicalKeyHash: createHash("sha256").update(key).digest("hex"),
      key,
      tags,
    });
    familyCounts[motif]++;
  }
  if (selected.length !== poolCount)
    throw new Error(`Only generated ${selected.length} distinct witnessed candidates after ${attempts} attempts`);
  return selected;
}

export function gradeAndOrder(candidates) {
  const enriched = candidates.map((candidate) => ({ ...candidate, rawMetrics: metricRaw(candidate) }));
  const values = {
    success: enriched.map((item) => item.rawMetrics.seededGoalSuccessRate),
    forced: enriched.map((item) => item.rawMetrics.forcedChoiceShare),
    forgiveness: enriched.map((item) => item.rawMetrics.goalPreservingChoiceShare),
    dependency: enriched.map(
      (item) =>
        item.rawMetrics.setupPiecesBeforePayoff + item.rawMetrics.requiredChainDepth + item.rawMetrics.payoffDirections,
    ),
    length: enriched.map((item) => item.rawMetrics.witnessPlanningLength),
  };
  const scored = enriched.map((item) => {
    const m = item.rawMetrics;
    const lowSuccess = 1 - percentile(values.success, m.seededGoalSuccessRate);
    const choiceDemand =
      0.5 * percentile(values.forced, m.forcedChoiceShare) +
      0.5 * (1 - percentile(values.forgiveness, m.goalPreservingChoiceShare));
    const dependencies = percentile(
      values.dependency,
      m.setupPiecesBeforePayoff + m.requiredChainDepth + m.payoffDirections,
    );
    const planning = percentile(values.length, m.witnessPlanningLength);
    const score = Math.round(100 * (0.45 * lowSuccess + 0.25 * choiceDemand + 0.2 * dependencies + 0.1 * planning));
    return {
      ...item,
      score,
      marks: Math.min(5, 1 + Math.floor(score / 20)),
      gradingVersion: GRADING_VERSION,
      proofStatus: "engine-witness-verified",
      reviewStatus: "human-review-pending",
      rawMetrics: m,
    };
  });
  return scored
    .sort((a, b) => a.score - b.score || a.id.localeCompare(b.id))
    .map((item, index) => ({ ...item, number: index + 1 }));
}

export function generateCampaign(count = 100) {
  const pool = gradeAndOrder(generateCandidates(count));
  const motifs = ["vertical-clear", "horizontal-clear", "diagonal-clear", "crossing-clear", "two-wave-chain"];
  const curated = motifs.flatMap((tag) => {
    const ranked = pool.filter((level) => level.tags[0] === tag);
    const quota = Math.floor(count / motifs.length) + (motifs.indexOf(tag) < count % motifs.length ? 1 : 0);
    return Array.from(
      { length: quota },
      (_, index) => ranked[Math.round((index * (ranked.length - 1)) / Math.max(1, quota - 1))],
    );
  });
  const levels = gradeAndOrder(curated).map(({ key: _canonicalKey, ...level }) => level);
  const checksum = createHash("sha256").update(JSON.stringify(levels)).digest("hex");
  return {
    count,
    candidatePoolCount: pool.length,
    generationRevision: GENERATION_REVISION,
    gradingVersion: GRADING_VERSION,
    category: "6×13 visible well / 5 colours",
    curationPolicy: `Generate 10% surplus; retain score-quantile coverage within each of five mechanic families; then regrade and order the selected ${count}.`,
    orderingPolicy: "single-category/nondecreasing-measured-score/stable-id-tie-break",
    grading: {
      weights: {
        lowSeededSuccessPercentile: 0.45,
        goalPreservingChoiceAndForcedChoicePercentile: 0.25,
        setupChainAndDirectionDemandPercentile: 0.2,
        witnessLengthPercentile: 0.1,
      },
      seededPlayouts: "64 independent fixed-seed legal placement runs per candidate",
      choiceProbe:
        "Enumerate legal column/orientation choices at each witnessed setup state and replay the remaining witness suffix; low goal-preserving choice share and high forced-choice share increase measured demand.",
      percentileScope:
        "within the declared 6×13/five-colour category; higher raw difficulty percentile increases score",
      scoreRule: "round(100 × weighted percentile blend); marks=min(5,1+floor(score/20))",
    },
    sampleBudget: SAMPLE_BUDGET,
    checksum,
    levels,
  };
}

export function independentGoalReached(state, goal) {
  if (goal.type === "targets") return goal.targetIds.every((id) => !state.board.some((gem) => gem?.id === id));
  if (goal.type === "chain") return state.maxChain >= goal.minimumChain;
  return state.board.every((gem) => gem === null);
}

export async function writeCampaign(path = resolve("src/falling-triplets/content.data.ts")) {
  const campaign = generateCampaign(100);
  const tutorials = tutorialDefinitions();
  const literal = JSON.stringify({ campaign, tutorials }, null, 2);
  await writeFile(
    path,
    `// Generated offline by scripts/falling-triplets-levels.mjs.\nexport const contentData = ${literal} as const;\n`,
    "utf8",
  );
  return campaign;
}
if (process.argv[1] && resolve(process.argv[1]) === resolve("scripts/falling-triplets-levels.mjs")) {
  const campaign = await writeCampaign();
  process.stdout.write(
    `Generated ${campaign.count} distinct levels (${campaign.levels[0].score}–${campaign.levels.at(-1).score}); ${campaign.levels[0].id} → ${campaign.levels.at(-1).id}\n`,
  );
}
