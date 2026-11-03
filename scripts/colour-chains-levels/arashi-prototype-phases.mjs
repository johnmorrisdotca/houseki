import {
  arashiCausalPrototype,
  arashiGuardGatePrototypes,
  arashiTallTowerPrototypes,
  arashiThreeTargetPrototype,
  arashiWideGuardPrototypes,
} from "../nature-campaign-levels.mjs";
import { authoredLevel } from "./nature-metrics.mjs";
import { playAuthored, playAuthoredRaw, playCounterfactual } from "./shizen-candidates.mjs";

export function addPrototypeCandidates(candidates) {
  const width = 6;
  const height = 12;
  const colourCount = 6;
  const causalSource = {
    id: "arashi-causal-jumble-lightning",
    width,
    height,
    colourCount,
    board: arashiCausalPrototype.board,
    queue: arashiCausalPrototype.queue,
    goal: arashiCausalPrototype.goal,
    tags: [],
  };
  const causalOptions = {
    seed: arashiCausalPrototype.seed,
    board: causalSource.board,
    nature: true,
    weather: "frequent",
    title: { en: "Expose both targets to lightning", ja: "2つの目標を雷にさらす" },
    objective: {
      en: "Keep both marked stones in the selected patch. The turn-two jumble exposes them, and turn-four lightning must reach both columns.",
      ja: "2つの目標を選ばれる区画に保ちましょう。2手目の地震で露出させ、4手目の雷を両方の列に届かせます。",
    },
  };
  const causalProof = playAuthored(causalOptions, causalSource, arashiCausalPrototype.witness);
  if (
    causalProof?.state.phase === "won" &&
    causalProof.events.some(
      (event) => event.type === "jumble-completed" && event.changed && event.moves?.some((move) => move.id === 9001),
    ) &&
    causalProof.events.some(
      (event) => event.type === "lightning-struck" && [9001, 9002].every((id) => event.removedIds?.includes(id)),
    ) &&
    playCounterfactual(causalOptions, causalSource, arashiCausalPrototype.witness, "weather")?.state.phase !== "won"
  ) {
    const authored = authoredLevel(
      causalSource,
      "arashi",
      0,
      causalOptions,
      arashiCausalPrototype.witness,
      causalProof.events,
    );
    authored.level.tags.push("jumble-dependency", "lightning-coordination", "counterfactual-fail-without-weather");
    candidates.set(authored.key, authored.level);
  }
  const coordinatedSource = {
    id: "arashi-three-target-coordination",
    width,
    height,
    colourCount,
    board: arashiThreeTargetPrototype.board,
    queue: arashiThreeTargetPrototype.queue,
    goal: arashiThreeTargetPrototype.goal,
    tags: [],
  };
  const coordinatedOptions = {
    seed: arashiThreeTargetPrototype.seed,
    board: coordinatedSource.board,
    nature: true,
    weather: "frequent",
    title: { en: "Shuffle three targets into range", ja: "3つの目標を雷の範囲へ" },
    objective: {
      en: "The turn-two jumble must move all three marked stones into the exposed row. Turn-four lightning must select each of their columns.",
      ja: "2手目の地震で3つの目標を露出させ、4手目の雷がすべての列を選ぶようにします。",
    },
  };
  const coordinatedProof = playAuthored(coordinatedOptions, coordinatedSource, arashiThreeTargetPrototype.witness);
  if (
    coordinatedProof?.state.phase === "won" &&
    coordinatedProof.events.some(
      (event) =>
        event.type === "jumble-completed" &&
        event.changed &&
        event.moves?.some((move) => arashiThreeTargetPrototype.goal.targetIds.includes(move.id)),
    ) &&
    coordinatedProof.events.some(
      (event) =>
        event.type === "lightning-struck" &&
        arashiThreeTargetPrototype.goal.targetIds.every((id) => event.removedIds?.includes(id)),
    ) &&
    playCounterfactual(coordinatedOptions, coordinatedSource, arashiThreeTargetPrototype.witness, "weather")?.state
      .phase !== "won"
  ) {
    const authored = authoredLevel(
      coordinatedSource,
      "arashi",
      0,
      coordinatedOptions,
      arashiThreeTargetPrototype.witness,
      coordinatedProof.events,
    );
    authored.level.tags.push(
      "jumble-dependency",
      "lightning-coordination",
      "three-target-coordination",
      "counterfactual-fail-without-weather",
    );
    candidates.set(authored.key, authored.level);
  }
  for (const prototype of arashiTallTowerPrototypes) {
    const source = {
      id: `arashi-${prototype.geometry}`,
      width,
      height: prototype.height,
      colourCount,
      board: prototype.board,
      queue: prototype.queue,
      goal: prototype.goal,
      tags: ["jumble-dependency", "lightning-coordination", "three-target-coordination", "tower-profile"],
    };
    const options = { seed: prototype.seed, board: prototype.board, nature: true, weather: prototype.weather };
    const proof = playAuthored(options, source, prototype.witness);
    if (proof?.state.phase !== "won") continue;
    const targets = new Set(source.goal.targetIds);
    const jumble = proof.events.find((event) => event.type === "jumble-completed" && event.changed);
    const strike = proof.events.find((event) => event.type === "lightning-struck");
    if (
      !jumble?.moves?.some((move) => targets.has(move.id)) ||
      !source.goal.targetIds.every((id) => strike?.removedIds?.includes(id))
    )
      continue;
    if (playCounterfactual(options, source, prototype.witness, "weather")?.state.phase === "won") continue;
    const authored = authoredLevel(
      source,
      "arashi",
      0,
      {
        ...options,
        title: { en: "Route three targets through the shuffle", ja: "3つの目標を入れ替えに通す" },
        objective: {
          en: `The changed turn-two jumble must expose all three marked stones; turn-four lightning must then remove all three. Tower height is ${prototype.height}.`,
          ja: `2手目の入れ替えで3つの目標を露出させ、4手目の雷ですべて消します。塔の高さは${prototype.height}段です。`,
        },
      },
      prototype.witness,
      proof.events,
    );
    authored.level.tags.push(
      "jumble-dependency",
      "lightning-coordination",
      "three-target-coordination",
      "tower-profile",
      "counterfactual-fail-without-weather",
    );
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
  for (const prototype of arashiGuardGatePrototypes) {
    const source = {
      id: prototype.geometry,
      width: 6,
      height: prototype.height,
      colourCount,
      board: prototype.board,
      queue: prototype.queue,
      goal: prototype.goal,
      tags: ["guard-gate", "jumble-dependency", "lightning-coordination"],
    };
    const options = {
      seed: prototype.seed,
      board: prototype.board,
      nature: true,
      weather: "frequent",
      title: { en: "Clear the teal guard before lightning", ja: "雷の前に青緑のガードを消す" },
      objective: {
        en: "The turn-two jumble moves a target and the teal guard. Use the third teal pair to clear all three guard stones, then let turn-four lightning remove all three marked targets.",
        ja: "2手目の入れ替えで目標と青緑のガードが動きます。3組目のペアでガード3個を消し、4手目の雷ですべての目標を消しましょう。",
      },
    };
    const witness = prototype.witness;
    const proof = playAuthored(options, source, witness);
    if (proof?.state.phase !== "won") continue;
    const targetIds = new Set(source.goal.targetIds);
    const guardIds = new Set([8001, 8002, 8003]);
    const jumble = proof.events.find((event) => event.type === "jumble-completed" && event.changed);
    const match = proof.events.find(
      (event) => event.type === "match-marked" && [...guardIds].every((id) => event.ids?.includes(id)),
    );
    const strike = proof.events.find((event) => event.type === "lightning-struck");
    if (
      !jumble?.moves?.some((move) => targetIds.has(move.id)) ||
      !jumble.moves.some((move) => guardIds.has(move.id)) ||
      !match ||
      !source.goal.targetIds.every((id) => strike?.removedIds?.includes(id))
    )
      continue;
    if (playCounterfactual(options, source, witness, "weather")?.state.phase === "won") continue;
    const wrongThird = witness.map((step) => ({ ...step }));
    wrongThird[2] = { pivotX: 0, orientation: "up" };
    const wrong = playAuthoredRaw(options, source, wrongThird);
    const wrongStrike = wrong?.events.find((event) => event.type === "lightning-struck");
    if (
      !wrongStrike ||
      wrong?.state.phase === "won" ||
      source.goal.targetIds.every((id) => wrongStrike.removedIds?.includes(id))
    )
      continue;
    const authored = authoredLevel(source, "arashi", 0, options, witness, proof.events);
    authored.level.tags.push(
      "jumble-dependency",
      "lightning-coordination",
      "three-target-coordination",
      "guard-gate",
      "counterfactual-fail-without-weather",
      "counterfactual-fail-wrong-guard-lane",
    );
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
  for (const prototype of arashiWideGuardPrototypes) {
    const source = {
      id: prototype.geometry,
      width: prototype.width,
      height: prototype.height,
      colourCount: prototype.colourCount,
      board: prototype.board,
      queue: prototype.queue,
      goal: prototype.goal,
      tags: ["wide-guard-gate", "jumble-dependency", "lightning-coordination"],
    };
    const options = {
      seed: prototype.seed,
      board: prototype.board,
      nature: true,
      weather: prototype.weather,
      title: { en: "Clear the guard from the wide lane", ja: "広い列でガードを消す" },
      objective: {
        en: "The second-turn jumble moves a marked target and the teal guard. Place the third pair in the guard lane to clear all three guard stones; turn-four lightning must then reach every target.",
        ja: "2手目の入れ替えで目標と青緑のガードが動きます。3組目をガード列へ置いて3個すべてを消し、4手目の雷ですべての目標を狙います。",
      },
    };
    const witness = prototype.witness;
    const proof = playAuthored(options, source, witness);
    if (proof?.state.phase !== "won") continue;
    const targetIds = new Set(source.goal.targetIds);
    const guardIds = new Set([8001, 8002, 8003]);
    const jumble = proof.events.find((event) => event.type === "jumble-completed" && event.changed);
    const match = proof.events.find(
      (event) => event.type === "match-marked" && [...guardIds].every((id) => event.ids?.includes(id)),
    );
    const strike = proof.events.find((event) => event.type === "lightning-struck");
    if (
      !jumble?.moves?.some((move) => targetIds.has(move.id)) ||
      !jumble.moves.some((move) => guardIds.has(move.id)) ||
      !match ||
      !source.goal.targetIds.every((id) => strike?.removedIds?.includes(id))
    )
      continue;
    if (playCounterfactual(options, source, witness, "weather")?.state.phase === "won") continue;
    const wrongThird = witness.map((step) => ({ ...step }));
    wrongThird[2] = { pivotX: prototype.wrongThirdLane, orientation: witness[2].orientation };
    const wrong = playAuthoredRaw(options, source, wrongThird);
    const wrongStrike = wrong?.events.find((event) => event.type === "lightning-struck");
    if (
      !wrongStrike ||
      wrong?.state.phase === "won" ||
      source.goal.targetIds.every((id) => wrongStrike.removedIds?.includes(id))
    )
      continue;
    const authored = authoredLevel(source, "arashi", 0, options, witness, proof.events);
    authored.level.tags.push(
      "jumble-dependency",
      "lightning-coordination",
      "three-target-coordination",
      "guard-gate",
      "wide-workspace",
      "counterfactual-fail-without-weather",
      "counterfactual-fail-wrong-guard-lane",
    );
    if (!candidates.has(authored.key)) candidates.set(authored.key, authored.level);
  }
}
