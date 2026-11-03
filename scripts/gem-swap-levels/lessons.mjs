import { createGame, legalActions, validateChallengeWitness } from "../../dist/gem-swap.js";
import { settle } from "./search.mjs";

export function generateLessons() {
  const lessons = [];
  const basicStart = createGame({ preset: "compact", seed: 8001 });
  const valid = legalActions(basicStart).find((action) => action.kind === "swap");
  const invalid = invalidNeighbor(basicStart);
  lessons.push({
    id: "gem-swap-lesson-basics",
    title: { en: "Make a match", ja: "マッチを作る" },
    initial: { preset: "compact", seed: 8001 },
    steps: [
      {
        kind: "action",
        id: "invalid-return",
        action: invalid,
        accepted: false,
        reason: "swap-makes-no-match",
        text: {
          en: "This pair makes no line of three, so it returns unchanged.",
          ja: "3つ並ばないため、この交換は元に戻ります。",
        },
      },
      {
        kind: "action",
        id: "first-match",
        action: valid,
        accepted: true,
        event: "match-marked",
        text: {
          en: "Swap neighbouring gems to make a line of three.",
          ja: "隣り合う宝石を交換して、3つ並べましょう。",
        },
      },
      {
        kind: "ticks",
        id: "watch-refill",
        count: 3600,
        text: {
          en: "Watch the cleared cells refill before the next turn.",
          ja: "次の手の前に、消えた場所が補充される様子を見ましょう。",
        },
      },
    ],
    witness: [
      { kind: "action", action: valid },
      { kind: "ticks", count: 3600 },
    ],
    reviewStatus: "human-review-pending",
  });
  lessons.push(findBeamLesson());
  lessons.push(findSealLesson());
  return lessons;
}
function invalidNeighbor(state) {
  const legal = new Set(
    legalActions(state)
      .filter((action) => action.kind === "swap")
      .map((action) => `${action.from}:${action.to}`),
  );
  const width = state.settings.width;
  for (let from = 0; from < state.board.length; from++)
    for (const to of [from + 1, from + width]) {
      if (
        to >= state.board.length ||
        (to === from + 1 && Math.floor(from / width) !== Math.floor(to / width)) ||
        !state.board[from] ||
        !state.board[to]
      )
        continue;
      if (!legal.has(`${from}:${to}`)) return { kind: "swap", from, to };
    }
  throw new Error("No invalid adjacent swap found for the first lesson");
}
function findBeamLesson() {
  for (let seed = 1; seed < 100_000; seed++) {
    const start = createGame({ preset: "compact", seed });
    for (const first of legalActions(start).filter((action) => action.kind === "swap")) {
      const result = settle(start, first);
      if (!result) continue;
      const created = result.events.find(
        (event) => event.type === "special-created" && (event.kind === "row-beam" || event.kind === "column-beam"),
      );
      if (!created || result.state.outcome) continue;
      const secondState = result.state;
      for (const second of legalActions(secondState).filter((action) => action.kind === "swap")) {
        const follow = settle(secondState, second);
        if (follow?.events.some((event) => event.type === "special-activated" && event.id === created.id)) {
          const title = { en: "Create and use a beam", ja: "ビームを作って使う" };
          const steps = [
            {
              kind: "action",
              id: "plan-beam",
              action: first,
              accepted: true,
              event: "special-planned",
              text: {
                en: "A line of four plans a beam at its marked anchor.",
                ja: "4つの列がそろうと、印の位置にビームが作られます。",
              },
            },
            {
              kind: "ticks",
              id: "create-beam",
              count: 3600,
              event: "special-created",
              text: {
                en: "Let the clear finish; the beam stays on the board.",
                ja: "消去が終わると、ビームが盤面に残ります。",
              },
            },
            {
              kind: "action",
              id: "activate-beam",
              action: second,
              accepted: true,
              event: "match-marked",
              text: {
                en: "Make a match that reaches the beam to clear its line.",
                ja: "ビームに届くマッチを作り、その列を消しましょう。",
              },
            },
            {
              kind: "ticks",
              id: "finish-beam",
              count: 3600,
              event: "special-activated",
              text: {
                en: "Watch the beam clear its line and the board refill.",
                ja: "ビームが列を消し、盤面が補充される様子を見ましょう。",
              },
            },
          ];
          return {
            id: "gem-swap-lesson-beam",
            title,
            initial: { preset: "compact", seed },
            steps,
            witness: [
              { kind: "action", action: first },
              { kind: "ticks", count: 3600 },
              { kind: "action", action: second },
              { kind: "ticks", count: 3600 },
            ],
            reviewStatus: "human-review-pending",
          };
        }
      }
    }
  }
  throw new Error("Could not find an original create-and-use-beam lesson witness");
}
function findSealLesson() {
  for (let seed = 1; seed < 100_000; seed++) {
    const start = createGame({ preset: "compact", seed });
    for (const first of legalActions(start).filter((action) => action.kind === "swap")) {
      const result = settle(start, first);
      if (!result) continue;
      const created = result.events.find(
        (event) => event.type === "special-created" && (event.kind === "row-beam" || event.kind === "column-beam"),
      );
      if (!created || result.state.outcome) continue;
      for (const second of legalActions(result.state).filter((action) => action.kind === "swap")) {
        const follow = settle(result.state, second);
        if (!follow) continue;
        if (!follow.events.some((event) => event.type === "special-activated" && event.id === created.id)) continue;
        const cleared = follow.events.filter((event) => event.type === "cells-removed").flatMap((event) => event.cells);
        const sealCell = cleared.find((cell) => cell !== created.cell);
        if (sealCell === undefined) continue;
        const initial = {
          mode: "challenge",
          preset: "compact",
          seed,
          challenge: { moveLimit: 2, seals: [{ cell: sealCell, layers: 1 }], goals: [{ kind: "seals" }] },
        };
        const witness = [
          { kind: "action", action: first },
          { kind: "ticks", count: 3600 },
          { kind: "action", action: second },
          { kind: "ticks", count: 3600 },
        ];
        const verified = validateChallengeWitness(initial, witness);
        if (!verified.valid) continue;
        return {
          id: "gem-swap-lesson-seal",
          title: { en: "A beam opens a seal", ja: "ビームで封印を解く" },
          initial,
          steps: [
            {
              kind: "action",
              id: "plan-beam",
              action: first,
              accepted: true,
              event: "special-planned",
              text: {
                en: "Build a beam, then plan a later match through it.",
                ja: "ビームを作り、次のマッチで使う準備をしましょう。",
              },
            },
            {
              kind: "ticks",
              id: "create-beam",
              count: 3600,
              event: "special-created",
              text: {
                en: "Let the clear finish; the beam stays on the board.",
                ja: "消去が終わると、ビームが盤面に残ります。",
              },
            },
            {
              kind: "action",
              id: "clear-seal",
              action: second,
              accepted: true,
              event: "match-marked",
              cell: sealCell,
              text: {
                en: "Activate the beam through the marked seal cell.",
                ja: "印の封印を通るようにビームを発動しましょう。",
              },
            },
            {
              kind: "ticks",
              id: "finish-seal",
              count: 3600,
              event: "special-activated",
              outcome: "won",
              cell: sealCell,
              text: {
                en: "The wave clears the seal and completes the lesson.",
                ja: "この連鎖で封印が消え、レッスンが完了します。",
              },
            },
          ],
          witness,
          reviewStatus: "human-review-pending",
        };
      }
    }
  }
  throw new Error("Could not find an original beam-and-seal lesson witness");
}
