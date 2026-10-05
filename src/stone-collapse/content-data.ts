// Generated offline by scripts/stone-collapse-levels.mjs.
export const contentData = {
  "campaign": {
    "count": 100,
    "candidatePoolCount": 110,
    "generationRevision": "stone-collapse-campaign-1.0",
    "gradingVersion": "collapse-order-forgiveness-1",
    "category": "6×6 four-colour rectangles (36 cells) and fixed-column silhouettes (28 cells); percentiles within each shape category",
    "curationPolicy": "Generate 10 surplus boards with an 80/20 rectangle/silhouette balance; curate score quantiles within each category, then regrade, merge and number.",
    "orderingPolicy": "single-category/nondecreasing-measured-score/stable-id-tie-break",
    "grading": {
      "weights": {
        "lowSeededLegalPlaySuccess": 0.4,
        "sampledOrderFailureShare": 0.25,
        "forcedSafeGroupShare": 0.15,
        "legalGroupChoiceBreadth": 0.1,
        "witnessedPlanningLength": 0.1
      },
      "seededPlayouts": "64 uniform legal group-removal runs, each bounded by the witnessed move limit",
      "orderProbe": "6 deterministic completion samples for every legal group choice at each witnessed decision; witnessed route itself is counted as proven-safe",
      "search": "depth-first all-clear witness search bounded at 9000 states per candidate",
      "scoreRule": "round(100 × weighted empirical percentile blend within the same mask category); marks=min(5,1+floor(score/20))",
      "claims": "Scores are deterministic progression heuristics; no uniqueness, minimum-move or optimality claims."
    },
    "sampleBudget": 64,
    "checksum": "c1ad147d511faf0a51dedc2cf322e9c218086cdf5865a6a0dd7bdb432fbe4a39",
    "levels": [
      {
        "id": "stone-c29a3a27d11f",
        "number": 1,
        "title": {
          "en": "Clearing Route C29A",
          "ja": "石の道筋 C29A"
        },
        "canonicalKeyHash": "c29a3a27d11f89c4d1c80ef542a0475f267bdee4add8b814b540ee2e28399497",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:8",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            31,
            32
          ],
          [
            26,
            33
          ],
          [
            3,
            8,
            9,
            15,
            20,
            21,
            22,
            23,
            27
          ],
          [
            14,
            25
          ],
          [
            2,
            34
          ],
          [
            1,
            7,
            13
          ],
          [
            11,
            16,
            17,
            18,
            24,
            29,
            30,
            36
          ],
          [
            12,
            28,
            35
          ],
          [
            5,
            10
          ],
          [
            4,
            6,
            19
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 10,
          "seededPlayoutSuccessRate": 0.15625,
          "legalGroupChoices": 26,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.2692307692307692,
          "forcedSafeGroupShare": 0.4,
          "averageGroupChoices": 2.6,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 4,
        "marks": 1,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-6f162402c850",
        "number": 2,
        "title": {
          "en": "Clearing Route 6F16",
          "ja": "石の道筋 6F16"
        },
        "canonicalKeyHash": "6f162402c8507ed82436b6c5dec09f65f87b49f9f5d1f7a9bc61fceb7b6c9ae8",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:340",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "red"
          },
          null,
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            11,
            12,
            18
          ],
          [
            21,
            27,
            33,
            34
          ],
          [
            19,
            20,
            26
          ],
          [
            2,
            7,
            8,
            13,
            14
          ],
          [
            17,
            23,
            24
          ],
          [
            9,
            22
          ],
          [
            5,
            10
          ],
          [
            4,
            16,
            28,
            29
          ],
          [
            3,
            15
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 12,
          "seededPlayoutSuccessRate": 0.1875,
          "legalGroupChoices": 29,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.20689655172413793,
          "forcedSafeGroupShare": 0.2222222222222222,
          "averageGroupChoices": 3.2222222222222223,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 6,
        "marks": 1,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-eac292fa8651",
        "number": 3,
        "title": {
          "en": "Clearing Route EAC2",
          "ja": "石の道筋 EAC2"
        },
        "canonicalKeyHash": "eac292fa8651fec58b205a5c60a5fdc2ab3f31f14187f6c70eb07916e3f2e46c",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:81",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            19,
            25
          ],
          [
            7,
            20
          ],
          [
            1,
            13,
            21,
            26,
            27
          ],
          [
            9,
            14,
            15,
            16,
            17,
            18,
            22,
            24,
            28,
            29,
            33
          ],
          [
            4,
            11
          ],
          [
            5,
            12
          ],
          [
            3,
            10,
            23,
            30,
            34,
            36
          ],
          [
            32,
            35
          ],
          [
            8,
            31
          ],
          [
            2,
            6
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "legalGroupChoices": 22,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.3181818181818182,
          "forcedSafeGroupShare": 0.6,
          "averageGroupChoices": 2.2,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 10,
        "marks": 1,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-18e466b7ea9f",
        "number": 4,
        "title": {
          "en": "Clearing Route 18E4",
          "ja": "石の道筋 18E4"
        },
        "canonicalKeyHash": "18e466b7ea9fff3dff949bd25b4d0ecd66e2c1dbd5f5f983aeb1bd7f1470928b",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:47",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            24,
            29,
            30
          ],
          [
            1,
            2,
            3
          ],
          [
            10,
            16
          ],
          [
            4,
            22
          ],
          [
            5,
            6,
            11
          ],
          [
            12,
            17,
            18
          ],
          [
            7,
            8
          ],
          [
            14,
            15,
            21,
            27,
            28,
            33,
            34
          ],
          [
            9,
            32
          ],
          [
            13,
            19
          ],
          [
            26,
            31
          ],
          [
            20,
            35
          ],
          [
            23,
            25,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 12,
          "seededPlayoutSuccessRate": 0.1875,
          "legalGroupChoices": 49,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.3673469387755102,
          "forcedSafeGroupShare": 0.38461538461538464,
          "averageGroupChoices": 3.769230769230769,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 13,
        "marks": 1,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-bfc430fa7ac0",
        "number": 5,
        "title": {
          "en": "Clearing Route BFC4",
          "ja": "石の道筋 BFC4"
        },
        "canonicalKeyHash": "bfc430fa7ac01b5851595325cd59ef39f14fe63884b0d832c247ab9dff42934d",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:71",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            1,
            2
          ],
          [
            4,
            5
          ],
          [
            6,
            12,
            18,
            24
          ],
          [
            9,
            15,
            21
          ],
          [
            28,
            33,
            34,
            35
          ],
          [
            19,
            25,
            26
          ],
          [
            3,
            22,
            27,
            31,
            32
          ],
          [
            17,
            23
          ],
          [
            10,
            14
          ],
          [
            11,
            29,
            30
          ],
          [
            8,
            20
          ],
          [
            13,
            16
          ],
          [
            7,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 6,
          "seededPlayoutSuccessRate": 0.09375,
          "legalGroupChoices": 50,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.34,
          "forcedSafeGroupShare": 0.3076923076923077,
          "averageGroupChoices": 3.8461538461538463,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 16,
        "marks": 1,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-8331f1ec9091",
        "number": 6,
        "title": {
          "en": "Clearing Route 8331",
          "ja": "石の道筋 8331"
        },
        "canonicalKeyHash": "8331f1ec909195dde9a6809e07537518e6ef70ebafd8ff4487fd30fbebd7f0c6",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:615",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            18,
            24
          ],
          [
            7,
            13
          ],
          [
            17,
            23
          ],
          [
            11,
            12
          ],
          [
            27,
            33
          ],
          [
            9,
            14,
            15,
            20,
            28
          ],
          [
            8,
            19
          ],
          [
            2,
            26
          ],
          [
            22,
            29
          ],
          [
            3,
            21
          ],
          [
            16,
            34
          ],
          [
            4,
            5,
            10
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 11,
          "seededPlayoutSuccessRate": 0.171875,
          "legalGroupChoices": 37,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.40540540540540543,
          "forcedSafeGroupShare": 0.5,
          "averageGroupChoices": 3.0833333333333335,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 19,
        "marks": 1,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-48c30c651b90",
        "number": 7,
        "title": {
          "en": "Clearing Route 48C3",
          "ja": "石の道筋 48C3"
        },
        "canonicalKeyHash": "48c30c651b90b8270d6b870680d953003c4ca56b0b3f250886f4730309476413",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:3",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            20,
            26
          ],
          [
            8,
            13,
            14,
            19,
            21,
            22,
            25,
            28,
            32,
            34,
            35
          ],
          [
            2,
            31
          ],
          [
            4,
            16,
            17,
            23,
            29,
            36
          ],
          [
            5,
            18,
            24,
            30
          ],
          [
            7,
            27,
            33
          ],
          [
            1,
            15
          ],
          [
            9,
            10
          ],
          [
            6,
            12
          ],
          [
            3,
            11
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 34,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.4411764705882353,
          "forcedSafeGroupShare": 0.3,
          "averageGroupChoices": 3.4,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 20,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-ea8b0b3b3cf2",
        "number": 8,
        "title": {
          "en": "Clearing Route EA8B",
          "ja": "石の道筋 EA8B"
        },
        "canonicalKeyHash": "ea8b0b3b3cf23880f6a6f8a82e1295d42c11f9569ceb6a9b5333a555ce39f8fd",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:61",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            7,
            8,
            13,
            19,
            25
          ],
          [
            32,
            33
          ],
          [
            3,
            9,
            16,
            22
          ],
          [
            34,
            35
          ],
          [
            29,
            36
          ],
          [
            1,
            20,
            31
          ],
          [
            5,
            12,
            18,
            24
          ],
          [
            14,
            21,
            26
          ],
          [
            6,
            23,
            30
          ],
          [
            4,
            10,
            17,
            28
          ],
          [
            2,
            11,
            15,
            27
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 47,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.5319148936170213,
          "forcedSafeGroupShare": 0.36363636363636365,
          "averageGroupChoices": 4.2727272727272725,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 22,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-ff4479fe7813",
        "number": 9,
        "title": {
          "en": "Clearing Route FF44",
          "ja": "石の道筋 FF44"
        },
        "canonicalKeyHash": "ff4479fe7813213b058688f9c2290ddefd4dc6c2433e1783f71395c2136c98e2",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:72",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            27,
            28
          ],
          [
            2,
            7,
            8,
            13,
            19,
            25
          ],
          [
            17,
            18
          ],
          [
            9,
            15,
            20
          ],
          [
            33,
            34
          ],
          [
            1,
            3,
            10,
            14,
            16,
            21,
            22,
            26,
            32
          ],
          [
            4,
            29,
            35,
            36
          ],
          [
            5,
            12
          ],
          [
            23,
            24,
            30,
            31
          ],
          [
            6,
            11
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 4,
          "seededPlayoutSuccessRate": 0.0625,
          "legalGroupChoices": 40,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.6,
          "forcedSafeGroupShare": 0.7,
          "averageGroupChoices": 4,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 22,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-3586d1d08242",
        "number": 10,
        "title": {
          "en": "Clearing Route 3586",
          "ja": "石の道筋 3586"
        },
        "canonicalKeyHash": "3586d1d082422bd77e77642062c42b6da93322acd411f5426e92973a18b35587",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:102",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            13,
            14,
            19
          ],
          [
            2,
            8,
            15
          ],
          [
            26,
            31,
            32,
            33
          ],
          [
            30,
            36
          ],
          [
            12,
            16,
            17,
            18,
            23
          ],
          [
            6,
            24
          ],
          [
            28,
            34,
            35
          ],
          [
            3,
            9,
            21
          ],
          [
            4,
            5
          ],
          [
            20,
            25,
            27
          ],
          [
            1,
            10
          ],
          [
            22,
            29
          ],
          [
            7,
            11
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 7,
          "seededPlayoutSuccessRate": 0.109375,
          "legalGroupChoices": 54,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.5370370370370371,
          "forcedSafeGroupShare": 0.6153846153846154,
          "averageGroupChoices": 4.153846153846154,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 23,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-50f6dd84aa2f",
        "number": 11,
        "title": {
          "en": "Clearing Route 50F6",
          "ja": "石の道筋 50F6"
        },
        "canonicalKeyHash": "50f6dd84aa2fa271ed097babfcf997d14ae0b0e0ce3ef1bead4b65963a58a00c",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:42",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            19,
            20
          ],
          [
            1,
            7,
            8,
            13
          ],
          [
            22,
            28
          ],
          [
            3,
            9
          ],
          [
            10,
            16,
            34
          ],
          [
            14,
            26
          ],
          [
            31,
            32
          ],
          [
            5,
            11,
            17,
            23
          ],
          [
            18,
            24
          ],
          [
            12,
            30
          ],
          [
            4,
            33
          ],
          [
            6,
            21,
            29,
            36
          ],
          [
            27,
            35
          ],
          [
            2,
            15,
            25
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 8,
          "seededPlayoutSuccessRate": 0.125,
          "legalGroupChoices": 65,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.5384615384615384,
          "forcedSafeGroupShare": 0.35714285714285715,
          "averageGroupChoices": 4.642857142857143,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 23,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-763acc5ea35e",
        "number": 12,
        "title": {
          "en": "Clearing Route 763A",
          "ja": "石の道筋 763A"
        },
        "canonicalKeyHash": "763acc5ea35e1098b1984a7c9c58d4e21bac4b1708ed163e6c3e45fa1d540aa4",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:93",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            25,
            26,
            27,
            31
          ],
          [
            2,
            3
          ],
          [
            14,
            15,
            16,
            17,
            18,
            22
          ],
          [
            7,
            8,
            20,
            21,
            33
          ],
          [
            28,
            29,
            35,
            36
          ],
          [
            11,
            23,
            30,
            34
          ],
          [
            9,
            13,
            19,
            32
          ],
          [
            5,
            24
          ],
          [
            6,
            10,
            12
          ],
          [
            1,
            4
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 38,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.4473684210526316,
          "forcedSafeGroupShare": 0.4,
          "averageGroupChoices": 3.8,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 23,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-908dbcc6fd89",
        "number": 13,
        "title": {
          "en": "Clearing Route 908D",
          "ja": "石の道筋 908D"
        },
        "canonicalKeyHash": "908dbcc6fd89e1fb6ceaeefa75cb1dc2333de5ed09bda3b8b3ea79a9d840278e",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:251",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "green"
          },
          null,
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 8,
        "witness": [
          [
            28,
            29
          ],
          [
            11,
            18
          ],
          [
            22,
            27,
            33
          ],
          [
            8,
            14
          ],
          [
            9,
            15
          ],
          [
            17,
            24
          ],
          [
            2,
            7,
            13
          ],
          [
            3,
            4,
            5,
            10,
            12,
            16,
            19,
            20,
            21,
            23,
            26,
            34
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 34,
          "witnessedDecisionCount": 8,
          "sampledOrderFailureShare": 0.4411764705882353,
          "forcedSafeGroupShare": 0.375,
          "averageGroupChoices": 4.25,
          "witnessMoves": 8,
          "moveBudgetSlack": 0
        },
        "score": 23,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-bfb29445f062",
        "number": 14,
        "title": {
          "en": "Clearing Route BFB2",
          "ja": "石の道筋 BFB2"
        },
        "canonicalKeyHash": "bfb29445f062a3607311bd8cb1633306204315c14c4a9b4395653d31cd4e4b6c",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:86",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            15,
            16
          ],
          [
            14,
            19,
            20,
            25,
            31
          ],
          [
            2,
            4,
            9,
            10,
            21,
            22
          ],
          [
            26,
            27,
            28,
            32
          ],
          [
            8,
            13,
            33
          ],
          [
            3,
            34
          ],
          [
            7,
            35
          ],
          [
            5,
            12,
            18,
            24
          ],
          [
            23,
            29
          ],
          [
            1,
            17,
            36
          ],
          [
            6,
            11,
            30
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 28,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.5357142857142857,
          "forcedSafeGroupShare": 0.8181818181818182,
          "averageGroupChoices": 2.5454545454545454,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 23,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-0e6aee84734c",
        "number": 15,
        "title": {
          "en": "Clearing Route 0E6A",
          "ja": "石の道筋 0E6A"
        },
        "canonicalKeyHash": "0e6aee84734c5b334053679d1ff0d047f49cf55a2672e45d34efcb8a7451a669",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:167",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 8,
        "witness": [
          [
            33,
            34
          ],
          [
            10,
            17,
            18,
            23,
            24
          ],
          [
            11,
            16
          ],
          [
            3,
            8
          ],
          [
            2,
            7,
            9,
            13,
            14
          ],
          [
            5,
            12,
            29
          ],
          [
            19,
            20,
            21,
            22,
            26,
            27
          ],
          [
            4,
            15,
            28
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 27,
          "witnessedDecisionCount": 8,
          "sampledOrderFailureShare": 0.48148148148148145,
          "forcedSafeGroupShare": 0.5,
          "averageGroupChoices": 3.375,
          "witnessMoves": 8,
          "moveBudgetSlack": 0
        },
        "score": 25,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-5b6e93725352",
        "number": 16,
        "title": {
          "en": "Clearing Route 5B6E",
          "ja": "石の道筋 5B6E"
        },
        "canonicalKeyHash": "5b6e937253522ae6a908a4d286482337b2a62cd5e70cde33bf4e3c1fe9522eca",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:64",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            10,
            11
          ],
          [
            1,
            7,
            13
          ],
          [
            18,
            24
          ],
          [
            14,
            20,
            26,
            27
          ],
          [
            8,
            19,
            25,
            31
          ],
          [
            15,
            16,
            22
          ],
          [
            23,
            28,
            29,
            35
          ],
          [
            30,
            36
          ],
          [
            12,
            17
          ],
          [
            9,
            21
          ],
          [
            3,
            32,
            33
          ],
          [
            5,
            6,
            34
          ],
          [
            2,
            4
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 58,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.5,
          "forcedSafeGroupShare": 0.15384615384615385,
          "averageGroupChoices": 4.461538461538462,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 25,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-91434fd56d0d",
        "number": 17,
        "title": {
          "en": "Clearing Route 9143",
          "ja": "石の道筋 9143"
        },
        "canonicalKeyHash": "91434fd56d0d0b09ec834b334adf732e92fc3c5d1f058e939946019709175d2c",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:46",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            19,
            20,
            26
          ],
          [
            3,
            9
          ],
          [
            1,
            7
          ],
          [
            16,
            17,
            18,
            24
          ],
          [
            27,
            28,
            33
          ],
          [
            4,
            10
          ],
          [
            14,
            25
          ],
          [
            5,
            6,
            11
          ],
          [
            2,
            8,
            15,
            21,
            32
          ],
          [
            30,
            35,
            36
          ],
          [
            22,
            29,
            31,
            34
          ],
          [
            12,
            13,
            23
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "legalGroupChoices": 69,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.5652173913043478,
          "forcedSafeGroupShare": 0.25,
          "averageGroupChoices": 5.75,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 25,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-2a97986846cc",
        "number": 18,
        "title": {
          "en": "Clearing Route 2A97",
          "ja": "石の道筋 2A97"
        },
        "canonicalKeyHash": "2a97986846ccb6a821d6fc1471d3a753233c76c2c7ba4c01bc434e00393e7167",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:772",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "red"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            3,
            4,
            10
          ],
          [
            13,
            14,
            15,
            19
          ],
          [
            22,
            23
          ],
          [
            33,
            34
          ],
          [
            17,
            24,
            29
          ],
          [
            7,
            8,
            9,
            20
          ],
          [
            5,
            11,
            12,
            16,
            18,
            28
          ],
          [
            2,
            26
          ],
          [
            21,
            27
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 38,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.4473684210526316,
          "forcedSafeGroupShare": 0.2222222222222222,
          "averageGroupChoices": 4.222222222222222,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 26,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-aa11505d2c61",
        "number": 19,
        "title": {
          "en": "Clearing Route AA11",
          "ja": "石の道筋 AA11"
        },
        "canonicalKeyHash": "aa11505d2c61b0d5dc857494a7a1abcb277d95b5bca73af470b94f9eb86d3d2d",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:53",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            32,
            33
          ],
          [
            16,
            17,
            18
          ],
          [
            25,
            31
          ],
          [
            35,
            36
          ],
          [
            5,
            9,
            10,
            13,
            20,
            21,
            22,
            27,
            28
          ],
          [
            11,
            12,
            24
          ],
          [
            4,
            15,
            19,
            23,
            26,
            34
          ],
          [
            3,
            7,
            8,
            14
          ],
          [
            1,
            2,
            29
          ],
          [
            6,
            30
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 40,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.55,
          "forcedSafeGroupShare": 0.4,
          "averageGroupChoices": 4,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 28,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-e9445d77868b",
        "number": 20,
        "title": {
          "en": "Clearing Route E944",
          "ja": "石の道筋 E944"
        },
        "canonicalKeyHash": "e9445d77868bdebdad145c726794891d29cd06508b4182d310d5b26df1799077",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:21",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            25,
            26
          ],
          [
            17,
            18,
            23,
            24,
            29
          ],
          [
            12,
            30
          ],
          [
            19,
            20,
            31
          ],
          [
            3,
            9
          ],
          [
            5,
            6,
            11,
            28,
            34
          ],
          [
            1,
            8,
            14
          ],
          [
            2,
            7,
            22,
            27,
            32,
            33
          ],
          [
            10,
            16,
            21
          ],
          [
            4,
            15,
            35
          ],
          [
            13,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 47,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.6170212765957447,
          "forcedSafeGroupShare": 0.45454545454545453,
          "averageGroupChoices": 4.2727272727272725,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 29,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-451d9394fa5a",
        "number": 21,
        "title": {
          "en": "Clearing Route 451D",
          "ja": "石の道筋 451D"
        },
        "canonicalKeyHash": "451d9394fa5aea6053ba8615b8ef1334b6ad7ed94f6099efbc4f1375102f6a0f",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:74",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            7,
            13,
            14
          ],
          [
            17,
            18
          ],
          [
            25,
            31
          ],
          [
            2,
            9
          ],
          [
            21,
            26,
            27,
            33
          ],
          [
            5,
            6,
            11
          ],
          [
            1,
            8,
            15,
            20,
            32,
            34
          ],
          [
            28,
            35
          ],
          [
            10,
            16,
            22,
            23,
            29
          ],
          [
            4,
            36
          ],
          [
            3,
            30
          ],
          [
            12,
            19,
            24
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "legalGroupChoices": 42,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6428571428571429,
          "forcedSafeGroupShare": 0.75,
          "averageGroupChoices": 3.5,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 30,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-d0217abdcc9d",
        "number": 22,
        "title": {
          "en": "Clearing Route D021",
          "ja": "石の道筋 D021"
        },
        "canonicalKeyHash": "d0217abdcc9d0ad73a2e183737781460efe77dce9be78eba1bc377a5e29422ba",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:20",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            8,
            13,
            14
          ],
          [
            17,
            23,
            24
          ],
          [
            28,
            29,
            34,
            35
          ],
          [
            11,
            36
          ],
          [
            10,
            16,
            22,
            27,
            33
          ],
          [
            4,
            5
          ],
          [
            7,
            19,
            20,
            25,
            31
          ],
          [
            15,
            18
          ],
          [
            12,
            30
          ],
          [
            9,
            26
          ],
          [
            6,
            21
          ],
          [
            2,
            32
          ],
          [
            1,
            3
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 39,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.5384615384615384,
          "forcedSafeGroupShare": 0.6153846153846154,
          "averageGroupChoices": 3,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 31,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-43c941214d54",
        "number": 23,
        "title": {
          "en": "Clearing Route 43C9",
          "ja": "石の道筋 43C9"
        },
        "canonicalKeyHash": "43c941214d54efcb31f64925d90c4d6f6f166fdf18bca73468e9a099529fcef4",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:186",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          null,
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            20,
            26
          ],
          [
            9,
            10
          ],
          [
            12,
            18
          ],
          [
            3,
            15
          ],
          [
            13,
            19
          ],
          [
            7,
            8
          ],
          [
            2,
            21
          ],
          [
            14,
            22,
            23,
            27,
            28,
            34
          ],
          [
            4,
            5,
            11,
            16,
            17,
            24,
            29,
            33
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 4,
          "seededPlayoutSuccessRate": 0.0625,
          "legalGroupChoices": 32,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.625,
          "forcedSafeGroupShare": 0.6666666666666666,
          "averageGroupChoices": 3.5555555555555554,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 34,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-07a3839609cb",
        "number": 24,
        "title": {
          "en": "Clearing Route 07A3",
          "ja": "石の道筋 07A3"
        },
        "canonicalKeyHash": "07a3839609cbc27a28f68e543ab785fb632c2099cd3d94f2b2d2068255fe031a",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:52",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            1,
            2
          ],
          [
            17,
            23
          ],
          [
            6,
            12
          ],
          [
            18,
            24,
            29,
            30
          ],
          [
            5,
            11,
            35
          ],
          [
            14,
            20,
            21,
            22
          ],
          [
            8,
            9,
            10,
            15
          ],
          [
            31,
            32
          ],
          [
            26,
            27,
            33
          ],
          [
            3,
            34
          ],
          [
            16,
            19
          ],
          [
            28,
            36
          ],
          [
            13,
            25
          ],
          [
            4,
            7
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 57,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.5263157894736842,
          "forcedSafeGroupShare": 0.5714285714285714,
          "averageGroupChoices": 4.071428571428571,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 35,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-62bd646795b8",
        "number": 25,
        "title": {
          "en": "Clearing Route 62BD",
          "ja": "石の道筋 62BD"
        },
        "canonicalKeyHash": "62bd646795b89e5d4254aad5de27e0ab1c98e279f778aa3e58f372b389366207",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:77",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 15,
        "witness": [
          [
            17,
            18
          ],
          [
            24,
            30
          ],
          [
            28,
            34
          ],
          [
            6,
            12
          ],
          [
            1,
            2
          ],
          [
            5,
            11
          ],
          [
            25,
            26,
            27,
            31
          ],
          [
            7,
            14
          ],
          [
            8,
            15
          ],
          [
            13,
            20,
            21
          ],
          [
            9,
            16,
            33
          ],
          [
            4,
            10,
            29
          ],
          [
            3,
            22,
            32
          ],
          [
            19,
            35
          ],
          [
            23,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 8,
          "seededPlayoutSuccessRate": 0.125,
          "legalGroupChoices": 58,
          "witnessedDecisionCount": 15,
          "sampledOrderFailureShare": 0.6551724137931034,
          "forcedSafeGroupShare": 0.7333333333333333,
          "averageGroupChoices": 3.8666666666666667,
          "witnessMoves": 15,
          "moveBudgetSlack": 0
        },
        "score": 35,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-a6961558761e",
        "number": 26,
        "title": {
          "en": "Clearing Route A696",
          "ja": "石の道筋 A696"
        },
        "canonicalKeyHash": "a6961558761e9bddea605a9b96506b8c39f66d80cb54f14eb6a7323967c04127",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:79",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            10,
            11,
            12
          ],
          [
            16,
            22
          ],
          [
            4,
            21,
            27,
            28
          ],
          [
            23,
            24,
            29,
            30,
            35
          ],
          [
            33,
            34
          ],
          [
            18,
            36
          ],
          [
            15,
            32
          ],
          [
            6,
            17
          ],
          [
            20,
            26,
            31
          ],
          [
            2,
            13
          ],
          [
            7,
            19
          ],
          [
            8,
            9,
            14,
            25
          ],
          [
            1,
            3,
            5
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 46,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.6086956521739131,
          "forcedSafeGroupShare": 0.6153846153846154,
          "averageGroupChoices": 3.5384615384615383,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 36,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-11b520dbf60f",
        "number": 27,
        "title": {
          "en": "Clearing Route 11B5",
          "ja": "石の道筋 11B5"
        },
        "canonicalKeyHash": "11b520dbf60fc6cb0838a9dea464198851bc9ee0c28630dc3b1e5c3534c0c2e1",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:26",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            17,
            23
          ],
          [
            27,
            33
          ],
          [
            3,
            8,
            14
          ],
          [
            30,
            36
          ],
          [
            15,
            21,
            28,
            34
          ],
          [
            9,
            10,
            16,
            22,
            29
          ],
          [
            11,
            18,
            35
          ],
          [
            4,
            26,
            32
          ],
          [
            2,
            20,
            25
          ],
          [
            19,
            31
          ],
          [
            5,
            13
          ],
          [
            7,
            12,
            24
          ],
          [
            1,
            6
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 46,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.6521739130434783,
          "forcedSafeGroupShare": 0.7692307692307693,
          "averageGroupChoices": 3.5384615384615383,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 37,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-3bc721b8fc64",
        "number": 28,
        "title": {
          "en": "Clearing Route 3BC7",
          "ja": "石の道筋 3BC7"
        },
        "canonicalKeyHash": "3bc721b8fc64cc0212dc7d8d8bdb48d5737bda590b457a9eba12538bb4588548",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:40",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            28,
            34,
            35
          ],
          [
            31,
            32
          ],
          [
            1,
            2
          ],
          [
            19,
            20,
            26
          ],
          [
            24,
            30
          ],
          [
            4,
            11
          ],
          [
            13,
            25
          ],
          [
            5,
            6
          ],
          [
            7,
            14,
            22,
            27,
            29,
            33
          ],
          [
            23,
            36
          ],
          [
            10,
            15
          ],
          [
            9,
            16,
            21
          ],
          [
            3,
            17
          ],
          [
            8,
            12,
            18
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 52,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.6346153846153846,
          "forcedSafeGroupShare": 0.7142857142857143,
          "averageGroupChoices": 3.7142857142857144,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 37,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-3f1ec35efcda",
        "number": 29,
        "title": {
          "en": "Clearing Route 3F1E",
          "ja": "石の道筋 3F1E"
        },
        "canonicalKeyHash": "3f1ec35efcda189bbc77c9750a84f35d2d1dc87f434f062d5a3750704a7c7077",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:38",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            20,
            21,
            27
          ],
          [
            5,
            6
          ],
          [
            17,
            18,
            23,
            24
          ],
          [
            15,
            33
          ],
          [
            29,
            30
          ],
          [
            10,
            16,
            22
          ],
          [
            31,
            32
          ],
          [
            2,
            8,
            9,
            14,
            19,
            26
          ],
          [
            3,
            34,
            35
          ],
          [
            11,
            36
          ],
          [
            4,
            13
          ],
          [
            7,
            25,
            28
          ],
          [
            1,
            12
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 48,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.625,
          "forcedSafeGroupShare": 0.6153846153846154,
          "averageGroupChoices": 3.6923076923076925,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 38,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-647647d330b7",
        "number": 30,
        "title": {
          "en": "Clearing Route 6476",
          "ja": "石の道筋 6476"
        },
        "canonicalKeyHash": "647647d330b74047f1d6c9f3670a00ef5f415248c6a3818d86e8ac5a3b08e8db",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:13",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            1,
            7
          ],
          [
            23,
            29,
            30
          ],
          [
            26,
            27
          ],
          [
            15,
            22
          ],
          [
            19,
            25
          ],
          [
            13,
            31
          ],
          [
            24,
            36
          ],
          [
            17,
            18,
            35
          ],
          [
            5,
            28
          ],
          [
            20,
            32,
            33
          ],
          [
            11,
            12
          ],
          [
            2,
            3
          ],
          [
            6,
            9,
            10,
            14,
            16,
            21,
            34
          ],
          [
            4,
            8
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 4,
          "seededPlayoutSuccessRate": 0.0625,
          "legalGroupChoices": 65,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.676923076923077,
          "forcedSafeGroupShare": 0.5714285714285714,
          "averageGroupChoices": 4.642857142857143,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 38,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-70e57c217c2f",
        "number": 31,
        "title": {
          "en": "Clearing Route 70E5",
          "ja": "石の道筋 70E5"
        },
        "canonicalKeyHash": "70e57c217c2f06b3c3bfac86c3319ff7e6f730bf352813a304df8681f79bf9d1",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:16",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            1,
            7
          ],
          [
            10,
            11
          ],
          [
            2,
            3,
            8
          ],
          [
            13,
            14,
            19,
            20
          ],
          [
            21,
            22,
            28
          ],
          [
            5,
            12,
            17
          ],
          [
            4,
            23
          ],
          [
            16,
            24,
            29,
            30,
            33,
            34,
            35
          ],
          [
            27,
            31,
            32
          ],
          [
            9,
            18
          ],
          [
            15,
            26
          ],
          [
            6,
            25,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 49,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6326530612244898,
          "forcedSafeGroupShare": 0.5833333333333334,
          "averageGroupChoices": 4.083333333333333,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 38,
        "marks": 2,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-eff47c9b8fd7",
        "number": 32,
        "title": {
          "en": "Clearing Route EFF4",
          "ja": "石の道筋 EFF4"
        },
        "canonicalKeyHash": "eff47c9b8fd76de7e2a94ddc9d6096131c6ca036c908a276d18757641c805757",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:66",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            29,
            30
          ],
          [
            23,
            24
          ],
          [
            35,
            36
          ],
          [
            11,
            28
          ],
          [
            12,
            17,
            18,
            22,
            34
          ],
          [
            19,
            20,
            21,
            26
          ],
          [
            2,
            7
          ],
          [
            14,
            31,
            32,
            33
          ],
          [
            1,
            13
          ],
          [
            3,
            9,
            10,
            15
          ],
          [
            4,
            16
          ],
          [
            5,
            8,
            27
          ],
          [
            6,
            25
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 45,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.6666666666666666,
          "forcedSafeGroupShare": 0.8461538461538461,
          "averageGroupChoices": 3.4615384615384617,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 41,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-12fd4a128450",
        "number": 33,
        "title": {
          "en": "Clearing Route 12FD",
          "ja": "石の道筋 12FD"
        },
        "canonicalKeyHash": "12fd4a128450cfd14a9e29369314789572e2cf5178f97f14613a04d1858e7f02",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:523",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "green"
          },
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          null,
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            7,
            13
          ],
          [
            20,
            26
          ],
          [
            2,
            15
          ],
          [
            23,
            24,
            29
          ],
          [
            17,
            28
          ],
          [
            8,
            9,
            14,
            19,
            21,
            22,
            27
          ],
          [
            3,
            16,
            34
          ],
          [
            5,
            12,
            18
          ],
          [
            4,
            11
          ],
          [
            10,
            33
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 31,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.6129032258064516,
          "forcedSafeGroupShare": 0.8,
          "averageGroupChoices": 3.1,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 42,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-9d6275e8c24e",
        "number": 34,
        "title": {
          "en": "Clearing Route 9D62",
          "ja": "石の道筋 9D62"
        },
        "canonicalKeyHash": "9d6275e8c24e0bd8a3da8bda31913f41aa8ea9e982789ea33a2af94127c02738",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:94",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            1,
            2,
            7
          ],
          [
            26,
            32
          ],
          [
            8,
            19
          ],
          [
            14,
            20,
            21,
            27,
            31
          ],
          [
            13,
            25,
            33
          ],
          [
            15,
            34
          ],
          [
            4,
            11
          ],
          [
            5,
            10,
            12,
            17,
            23,
            24,
            30,
            36
          ],
          [
            3,
            22
          ],
          [
            16,
            29
          ],
          [
            6,
            9,
            18,
            28,
            35
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 32,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.5625,
          "forcedSafeGroupShare": 0.7272727272727273,
          "averageGroupChoices": 2.909090909090909,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 43,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-61811db9096e",
        "number": 35,
        "title": {
          "en": "Clearing Route 6181",
          "ja": "石の道筋 6181"
        },
        "canonicalKeyHash": "61811db9096e358643ef6e70231f5b2d8e6fde5bbddc40fd40c31acf549f36d8",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:89",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            1,
            7,
            8,
            9,
            15
          ],
          [
            5,
            6,
            12,
            17,
            18,
            23,
            24
          ],
          [
            3,
            14
          ],
          [
            11,
            22,
            28,
            29,
            35
          ],
          [
            16,
            30
          ],
          [
            34,
            36
          ],
          [
            10,
            33
          ],
          [
            21,
            26
          ],
          [
            2,
            20,
            25
          ],
          [
            27,
            32
          ],
          [
            19,
            31
          ],
          [
            4,
            13
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 27,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.48148148148148145,
          "forcedSafeGroupShare": 0.8333333333333334,
          "averageGroupChoices": 2.25,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-8f0aa1ef5915",
        "number": 36,
        "title": {
          "en": "Clearing Route 8F0A",
          "ja": "石の道筋 8F0A"
        },
        "canonicalKeyHash": "8f0aa1ef5915da5d91f78bdc29874f2e8254bd05bd05603d69db5aa9f215c780",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:35",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            9,
            10,
            16,
            22,
            23,
            24
          ],
          [
            11,
            12
          ],
          [
            1,
            2,
            8,
            13,
            14,
            20
          ],
          [
            26,
            32
          ],
          [
            31,
            33
          ],
          [
            25,
            27
          ],
          [
            21,
            34
          ],
          [
            15,
            28
          ],
          [
            4,
            35
          ],
          [
            3,
            29,
            36
          ],
          [
            5,
            7
          ],
          [
            17,
            18,
            30
          ],
          [
            6,
            19
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 38,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.631578947368421,
          "forcedSafeGroupShare": 0.9230769230769231,
          "averageGroupChoices": 2.923076923076923,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-eefd8172d9cf",
        "number": 37,
        "title": {
          "en": "Clearing Route EEFD",
          "ja": "石の道筋 EEFD"
        },
        "canonicalKeyHash": "eefd8172d9cfb147bfa1e0a782f0a697ca119d3f34333cca1eb9b89ad6458c7e",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:100",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            1,
            7,
            13,
            19
          ],
          [
            29,
            30,
            35
          ],
          [
            12,
            17,
            18,
            24,
            28,
            33,
            34
          ],
          [
            9,
            15
          ],
          [
            14,
            20
          ],
          [
            6,
            8,
            11,
            22,
            23,
            26,
            27,
            31,
            32
          ],
          [
            5,
            16
          ],
          [
            10,
            21
          ],
          [
            2,
            3,
            4,
            25,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 35,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.6,
          "forcedSafeGroupShare": 0.5555555555555556,
          "averageGroupChoices": 3.888888888888889,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-24e8a725ce68",
        "number": 38,
        "title": {
          "en": "Clearing Route 24E8",
          "ja": "石の道筋 24E8"
        },
        "canonicalKeyHash": "24e8a725ce68b577bfbf10d16ba2ac0659f5f6ddbb272b33cd95798a502dbc2b",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:36",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            16,
            22,
            23
          ],
          [
            5,
            11,
            12,
            18
          ],
          [
            30,
            36
          ],
          [
            32,
            33
          ],
          [
            19,
            25
          ],
          [
            6,
            24,
            28,
            34,
            35
          ],
          [
            4,
            20,
            21
          ],
          [
            1,
            2,
            7,
            13,
            14
          ],
          [
            10,
            26,
            27
          ],
          [
            3,
            9,
            15,
            17
          ],
          [
            8,
            29,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 4,
          "seededPlayoutSuccessRate": 0.0625,
          "legalGroupChoices": 55,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.7454545454545455,
          "forcedSafeGroupShare": 0.8181818181818182,
          "averageGroupChoices": 5,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-53d40b8fb951",
        "number": 39,
        "title": {
          "en": "Clearing Route 53D4",
          "ja": "石の道筋 53D4"
        },
        "canonicalKeyHash": "53d40b8fb951a54d08854e586c8bcef8e19c28bf52de9316bea993637154827d",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:78",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            31,
            32
          ],
          [
            5,
            9,
            10,
            11
          ],
          [
            18,
            24
          ],
          [
            6,
            12
          ],
          [
            20,
            21,
            26,
            27,
            28
          ],
          [
            15,
            16,
            17,
            22,
            23
          ],
          [
            14,
            25,
            33
          ],
          [
            2,
            3,
            8,
            13
          ],
          [
            4,
            19,
            34
          ],
          [
            7,
            35
          ],
          [
            29,
            36
          ],
          [
            1,
            30
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 37,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.5675675675675675,
          "forcedSafeGroupShare": 0.6666666666666666,
          "averageGroupChoices": 3.0833333333333335,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-5beefbc67301",
        "number": 40,
        "title": {
          "en": "Clearing Route 5BEE",
          "ja": "石の道筋 5BEE"
        },
        "canonicalKeyHash": "5beefbc673018a978354fc6602e5ff64a50722a825d823c0770609b585c10f92",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:58",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            31,
            32,
            33
          ],
          [
            17,
            23,
            28,
            29
          ],
          [
            7,
            8
          ],
          [
            2,
            9
          ],
          [
            13,
            19,
            25
          ],
          [
            11,
            30,
            35,
            36
          ],
          [
            14,
            20
          ],
          [
            5,
            24
          ],
          [
            12,
            16,
            22
          ],
          [
            3,
            15
          ],
          [
            18,
            34
          ],
          [
            6,
            10,
            27
          ],
          [
            21,
            26
          ],
          [
            1,
            4
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 52,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.6538461538461539,
          "forcedSafeGroupShare": 0.7142857142857143,
          "averageGroupChoices": 3.7142857142857144,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-ffb6aedfb50a",
        "number": 41,
        "title": {
          "en": "Clearing Route FFB6",
          "ja": "石の道筋 FFB6"
        },
        "canonicalKeyHash": "ffb6aedfb50abf73489cc25716a913f09d9b008551f4dc012685b87b93be5b87",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:496",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "green"
          },
          null,
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "green"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 7,
        "witness": [
          [
            10,
            11
          ],
          [
            28,
            33,
            34
          ],
          [
            5,
            17,
            18,
            24
          ],
          [
            2,
            7,
            8,
            12,
            14,
            15,
            16,
            20,
            21,
            23,
            29
          ],
          [
            4,
            9,
            26
          ],
          [
            3,
            22,
            27
          ],
          [
            13,
            19
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 25,
          "witnessedDecisionCount": 7,
          "sampledOrderFailureShare": 0.56,
          "forcedSafeGroupShare": 0.42857142857142855,
          "averageGroupChoices": 3.5714285714285716,
          "witnessMoves": 7,
          "moveBudgetSlack": 0
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-a63b6bd7f4a2",
        "number": 42,
        "title": {
          "en": "Clearing Route A63B",
          "ja": "石の道筋 A63B"
        },
        "canonicalKeyHash": "a63b6bd7f4a2a9c73bcd23696ef63f8894e756907a997564b55b9415ca5357da",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:15",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            24,
            30
          ],
          [
            18,
            29,
            35,
            36
          ],
          [
            6,
            12,
            23
          ],
          [
            22,
            27,
            28
          ],
          [
            21,
            26
          ],
          [
            5,
            10
          ],
          [
            3,
            8,
            13,
            14,
            19
          ],
          [
            2,
            9,
            15,
            16,
            33
          ],
          [
            4,
            20
          ],
          [
            32,
            34
          ],
          [
            11,
            25
          ],
          [
            7,
            31
          ],
          [
            1,
            17
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 33,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.5151515151515151,
          "forcedSafeGroupShare": 0.7692307692307693,
          "averageGroupChoices": 2.5384615384615383,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 46,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-6ca53a4cfeb4",
        "number": 43,
        "title": {
          "en": "Clearing Route 6CA5",
          "ja": "石の道筋 6CA5"
        },
        "canonicalKeyHash": "6ca53a4cfeb444419aee6aec5f46b014899dae478a688afcb1d35b28864eb5af",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:376",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "red"
          },
          null,
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            10,
            11,
            12
          ],
          [
            18,
            24
          ],
          [
            5,
            17
          ],
          [
            13,
            14,
            15
          ],
          [
            7,
            19
          ],
          [
            8,
            16,
            20,
            21,
            22
          ],
          [
            26,
            27
          ],
          [
            2,
            9
          ],
          [
            3,
            33
          ],
          [
            4,
            23
          ],
          [
            28,
            29,
            34
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 43,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.6046511627906976,
          "forcedSafeGroupShare": 0.45454545454545453,
          "averageGroupChoices": 3.909090909090909,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 47,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-586587aad18f",
        "number": 44,
        "title": {
          "en": "Clearing Route 5865",
          "ja": "石の道筋 5865"
        },
        "canonicalKeyHash": "586587aad18f4d76f11d7ea4e895f4f7ea179e2e91c0abc9e12325cf91f1815c",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:68",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            2,
            3
          ],
          [
            4,
            5
          ],
          [
            7,
            8,
            9,
            13,
            15,
            19,
            25,
            31
          ],
          [
            22,
            23,
            27,
            28,
            33
          ],
          [
            10,
            17
          ],
          [
            21,
            32,
            34
          ],
          [
            1,
            26
          ],
          [
            16,
            20
          ],
          [
            11,
            24,
            29,
            30
          ],
          [
            12,
            18,
            36
          ],
          [
            6,
            14,
            35
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 37,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.6216216216216216,
          "forcedSafeGroupShare": 0.7272727272727273,
          "averageGroupChoices": 3.3636363636363638,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 48,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-f6c06c8a25a2",
        "number": 45,
        "title": {
          "en": "Clearing Route F6C0",
          "ja": "石の道筋 F6C0"
        },
        "canonicalKeyHash": "f6c06c8a25a2f64e2e8761185be654b000ba36a5cd161cce2cffa639e2381b0e",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:32",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            8,
            14,
            19,
            20,
            21
          ],
          [
            7,
            13
          ],
          [
            17,
            18
          ],
          [
            11,
            23
          ],
          [
            29,
            35,
            36
          ],
          [
            5,
            34
          ],
          [
            12,
            16,
            24
          ],
          [
            25,
            31
          ],
          [
            2,
            15,
            26,
            27,
            28,
            33
          ],
          [
            9,
            10,
            22,
            30,
            32
          ],
          [
            3,
            4
          ],
          [
            1,
            6
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 46,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6086956521739131,
          "forcedSafeGroupShare": 0.5833333333333334,
          "averageGroupChoices": 3.8333333333333335,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 49,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-0d017cab58e5",
        "number": 46,
        "title": {
          "en": "Clearing Route 0D01",
          "ja": "石の道筋 0D01"
        },
        "canonicalKeyHash": "0d017cab58e5be9894c24f44035a0e4837b191d3dbce605f4e4e384a52e766b6",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:83",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            25,
            31
          ],
          [
            23,
            24,
            30
          ],
          [
            26,
            27
          ],
          [
            17,
            22
          ],
          [
            19,
            32
          ],
          [
            5,
            11,
            12,
            16
          ],
          [
            9,
            10,
            14,
            15,
            21,
            28,
            29,
            34
          ],
          [
            4,
            33
          ],
          [
            3,
            20
          ],
          [
            2,
            7
          ],
          [
            8,
            18,
            35,
            36
          ],
          [
            1,
            6,
            13
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 53,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.7358490566037735,
          "forcedSafeGroupShare": 0.8333333333333334,
          "averageGroupChoices": 4.416666666666667,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 50,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-1c3fce95dd8b",
        "number": 47,
        "title": {
          "en": "Clearing Route 1C3F",
          "ja": "石の道筋 1C3F"
        },
        "canonicalKeyHash": "1c3fce95dd8b03b5b562777785f522cacf662dff31321ad8caa087ee112008b5",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:101",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            23,
            24
          ],
          [
            19,
            25,
            31,
            32,
            33
          ],
          [
            20,
            21,
            27
          ],
          [
            3,
            16,
            17,
            22,
            29
          ],
          [
            6,
            12
          ],
          [
            7,
            8,
            9,
            14
          ],
          [
            4,
            5,
            10,
            11
          ],
          [
            1,
            13,
            15,
            26
          ],
          [
            2,
            34
          ],
          [
            18,
            28,
            30,
            35,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 41,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.6097560975609756,
          "forcedSafeGroupShare": 0.7,
          "averageGroupChoices": 4.1,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 50,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-66de6f171547",
        "number": 48,
        "title": {
          "en": "Clearing Route 66DE",
          "ja": "石の道筋 66DE"
        },
        "canonicalKeyHash": "66de6f171547072e9abd2cb099f5ed0df33bba0f9ad5a9a4773b04c84c40d4d4",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:414",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            22,
            26,
            27,
            28,
            33,
            34
          ],
          [
            4,
            9,
            10,
            14,
            23
          ],
          [
            3,
            8,
            19,
            20
          ],
          [
            17,
            24
          ],
          [
            2,
            15
          ],
          [
            7,
            13
          ],
          [
            16,
            21
          ],
          [
            5,
            12
          ],
          [
            11,
            18,
            29
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 35,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.5142857142857142,
          "forcedSafeGroupShare": 0.4444444444444444,
          "averageGroupChoices": 3.888888888888889,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 50,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-f647ceba5a9e",
        "number": 49,
        "title": {
          "en": "Clearing Route F647",
          "ja": "石の道筋 F647"
        },
        "canonicalKeyHash": "f647ceba5a9e40e662101a780610512e59864b5d7d5f3109471d617b02da1db9",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:49",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            23,
            27,
            28,
            29
          ],
          [
            6,
            12
          ],
          [
            15,
            21
          ],
          [
            11,
            24
          ],
          [
            5,
            16,
            18
          ],
          [
            3,
            10
          ],
          [
            4,
            9,
            17,
            22,
            26,
            30,
            33
          ],
          [
            2,
            8,
            13
          ],
          [
            20,
            25
          ],
          [
            19,
            31
          ],
          [
            32,
            34
          ],
          [
            7,
            14,
            35
          ],
          [
            1,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 38,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.5789473684210527,
          "forcedSafeGroupShare": 0.7692307692307693,
          "averageGroupChoices": 2.923076923076923,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 50,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-2432accf0923",
        "number": 50,
        "title": {
          "en": "Clearing Route 2432",
          "ja": "石の道筋 2432"
        },
        "canonicalKeyHash": "2432accf0923008157b45f71f8456a96b9529b0bc77fe7bf2c00ecf7302c4872",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:964",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          null,
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            17,
            18,
            24
          ],
          [
            11,
            22,
            23,
            27,
            28
          ],
          [
            2,
            7,
            8
          ],
          [
            5,
            10,
            12,
            29
          ],
          [
            13,
            14,
            19
          ],
          [
            4,
            15
          ],
          [
            9,
            20
          ],
          [
            21,
            26,
            33,
            34
          ],
          [
            3,
            16
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 27,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.6296296296296297,
          "forcedSafeGroupShare": 0.8888888888888888,
          "averageGroupChoices": 3,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 51,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-9f311008f1ff",
        "number": 51,
        "title": {
          "en": "Clearing Route 9F31",
          "ja": "石の道筋 9F31"
        },
        "canonicalKeyHash": "9f311008f1ffd5e58f375a8adc587b42763c345659ad34751d2576f965fe508e",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:6",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            19,
            20,
            25,
            26,
            27,
            28,
            31,
            34
          ],
          [
            7,
            13
          ],
          [
            2,
            3,
            8,
            9
          ],
          [
            22,
            35
          ],
          [
            16,
            23,
            24,
            29,
            30,
            33
          ],
          [
            11,
            17,
            36
          ],
          [
            1,
            5,
            10,
            18,
            21,
            32
          ],
          [
            4,
            12
          ],
          [
            6,
            14,
            15
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 32,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.71875,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 3.5555555555555554,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 51,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-a8b62b286f04",
        "number": 52,
        "title": {
          "en": "Clearing Route A8B6",
          "ja": "石の道筋 A8B6"
        },
        "canonicalKeyHash": "a8b62b286f0418e5cc83dd6299b328e73bd92555b09585b3c16ed9cf8c0fdc67",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:28",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            7,
            13
          ],
          [
            3,
            9
          ],
          [
            24,
            30
          ],
          [
            1,
            14
          ],
          [
            27,
            28
          ],
          [
            18,
            29,
            36
          ],
          [
            4,
            5,
            10
          ],
          [
            12,
            35
          ],
          [
            11,
            16
          ],
          [
            21,
            22,
            31,
            32,
            33
          ],
          [
            15,
            26,
            34
          ],
          [
            8,
            19
          ],
          [
            2,
            20
          ],
          [
            6,
            17,
            23,
            25
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "legalGroupChoices": 63,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.7301587301587301,
          "forcedSafeGroupShare": 0.8571428571428571,
          "averageGroupChoices": 4.5,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 52,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-0389d3b5e5b6",
        "number": 53,
        "title": {
          "en": "Clearing Route 0389",
          "ja": "石の道筋 0389"
        },
        "canonicalKeyHash": "0389d3b5e5b65582c53bff6540c59ce49a634f0af714d19a014a85fe94bd27a2",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:29",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            23,
            28,
            29,
            34,
            35
          ],
          [
            10,
            16,
            21
          ],
          [
            15,
            27,
            33
          ],
          [
            19,
            25
          ],
          [
            14,
            20
          ],
          [
            4,
            9,
            11,
            22,
            32
          ],
          [
            2,
            7
          ],
          [
            3,
            8,
            13,
            26
          ],
          [
            1,
            5,
            12,
            17,
            18,
            24,
            30,
            36
          ],
          [
            6,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 36,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.6388888888888888,
          "forcedSafeGroupShare": 0.8,
          "averageGroupChoices": 3.6,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 53,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-24188e768b83",
        "number": 54,
        "title": {
          "en": "Clearing Route 2418",
          "ja": "石の道筋 2418"
        },
        "canonicalKeyHash": "24188e768b83d00201ed7acac5c1a5be85eeaee29ce802061c61c4cb592a7938",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:5",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            2,
            3,
            7,
            8,
            9,
            13,
            19
          ],
          [
            24,
            29,
            30,
            36
          ],
          [
            15,
            17,
            20,
            21,
            22,
            27
          ],
          [
            26,
            32
          ],
          [
            14,
            33
          ],
          [
            31,
            34
          ],
          [
            6,
            10,
            11
          ],
          [
            28,
            35
          ],
          [
            16,
            18,
            23
          ],
          [
            4,
            25
          ],
          [
            1,
            5,
            12
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 28,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.6071428571428571,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 2.5454545454545454,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 53,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-80533d5f6e56",
        "number": 55,
        "title": {
          "en": "Clearing Route 8053",
          "ja": "石の道筋 8053"
        },
        "canonicalKeyHash": "80533d5f6e56d267d138ff6482ae2ee1141d82df4e99353aaf8ed9bd48fe2cd7",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:45",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            18,
            23,
            24
          ],
          [
            13,
            14
          ],
          [
            11,
            17,
            22
          ],
          [
            10,
            15,
            20,
            21,
            26
          ],
          [
            16,
            28
          ],
          [
            4,
            27,
            29
          ],
          [
            1,
            7
          ],
          [
            35,
            36
          ],
          [
            5,
            34
          ],
          [
            8,
            9,
            19,
            25,
            30,
            33
          ],
          [
            3,
            12
          ],
          [
            6,
            32
          ],
          [
            2,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 53,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.7169811320754716,
          "forcedSafeGroupShare": 0.8461538461538461,
          "averageGroupChoices": 4.076923076923077,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 55,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-9b2e29d4b5fc",
        "number": 56,
        "title": {
          "en": "Clearing Route 9B2E",
          "ja": "石の道筋 9B2E"
        },
        "canonicalKeyHash": "9b2e29d4b5fc9757a1fe4f3da69927760317279cb5d2acb4209dc0eed2ae33a7",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:59",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            10,
            11
          ],
          [
            26,
            32
          ],
          [
            19,
            25
          ],
          [
            15,
            16,
            22,
            23
          ],
          [
            14,
            20,
            21,
            27,
            31
          ],
          [
            4,
            17,
            29
          ],
          [
            12,
            18
          ],
          [
            5,
            30,
            35
          ],
          [
            2,
            9,
            24,
            28,
            33
          ],
          [
            3,
            8,
            13
          ],
          [
            7,
            34,
            36
          ],
          [
            1,
            6
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 41,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6341463414634146,
          "forcedSafeGroupShare": 0.8333333333333334,
          "averageGroupChoices": 3.4166666666666665,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 55,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-c3a4b384efcc",
        "number": 57,
        "title": {
          "en": "Clearing Route C3A4",
          "ja": "石の道筋 C3A4"
        },
        "canonicalKeyHash": "c3a4b384efcc63d8d69afd6835d4ffb9ef4119d5dbe0d3b2dc52cf13e3279685",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:75",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            22,
            23
          ],
          [
            5,
            11,
            12,
            17
          ],
          [
            7,
            13,
            19
          ],
          [
            1,
            25
          ],
          [
            32,
            33
          ],
          [
            26,
            27,
            31,
            34
          ],
          [
            10,
            16,
            21,
            28
          ],
          [
            3,
            8
          ],
          [
            4,
            35
          ],
          [
            29,
            36
          ],
          [
            9,
            15
          ],
          [
            14,
            20,
            30
          ],
          [
            2,
            6,
            18,
            24
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 65,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.7538461538461538,
          "forcedSafeGroupShare": 0.7692307692307693,
          "averageGroupChoices": 5,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 55,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-6d92f34069d0",
        "number": 58,
        "title": {
          "en": "Clearing Route 6D92",
          "ja": "石の道筋 6D92"
        },
        "canonicalKeyHash": "6d92f34069d0ec78165f176432f70a4783d84a6c224163cfe67f0e6aef6c4ce8",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:50",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 15,
        "witness": [
          [
            6,
            12
          ],
          [
            3,
            4
          ],
          [
            1,
            2
          ],
          [
            7,
            13,
            14
          ],
          [
            8,
            15
          ],
          [
            9,
            16,
            21
          ],
          [
            19,
            20,
            26
          ],
          [
            27,
            33
          ],
          [
            32,
            34
          ],
          [
            22,
            25
          ],
          [
            28,
            35
          ],
          [
            10,
            29,
            36
          ],
          [
            23,
            30,
            31
          ],
          [
            11,
            18
          ],
          [
            5,
            17,
            24
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 42,
          "witnessedDecisionCount": 15,
          "sampledOrderFailureShare": 0.5952380952380952,
          "forcedSafeGroupShare": 0.8666666666666667,
          "averageGroupChoices": 2.8,
          "witnessMoves": 15,
          "moveBudgetSlack": 0
        },
        "score": 56,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-8ad14c9224f6",
        "number": 59,
        "title": {
          "en": "Clearing Route 8AD1",
          "ja": "石の道筋 8AD1"
        },
        "canonicalKeyHash": "8ad14c9224f6ef7b55c357979fa60117e9cb70558ad1024e5a357e3be77933f5",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:994",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          null,
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 8,
        "witness": [
          [
            10,
            11,
            17,
            18,
            23
          ],
          [
            13,
            14
          ],
          [
            28,
            29
          ],
          [
            8,
            20,
            26,
            27
          ],
          [
            7,
            19
          ],
          [
            2,
            5,
            9,
            15,
            21,
            22,
            33,
            34
          ],
          [
            12,
            24
          ],
          [
            3,
            4,
            16
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 37,
          "witnessedDecisionCount": 8,
          "sampledOrderFailureShare": 0.5945945945945946,
          "forcedSafeGroupShare": 0.5,
          "averageGroupChoices": 4.625,
          "witnessMoves": 8,
          "moveBudgetSlack": 0
        },
        "score": 56,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-59ea415ce1e0",
        "number": 60,
        "title": {
          "en": "Clearing Route 59EA",
          "ja": "石の道筋 59EA"
        },
        "canonicalKeyHash": "59ea415ce1e0c3c85c18e8aaba91475898752ce0560177599ece84e7f5591350",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:657",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            14,
            15,
            16
          ],
          [
            2,
            3
          ],
          [
            22,
            28
          ],
          [
            11,
            17,
            18,
            24
          ],
          [
            10,
            29
          ],
          [
            5,
            12,
            23
          ],
          [
            20,
            21
          ],
          [
            13,
            19
          ],
          [
            7,
            8,
            9
          ],
          [
            4,
            26,
            27,
            33,
            34
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 2,
          "seededPlayoutSuccessRate": 0.03125,
          "legalGroupChoices": 48,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.7083333333333334,
          "forcedSafeGroupShare": 0.6,
          "averageGroupChoices": 4.8,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-713baae87fa4",
        "number": 61,
        "title": {
          "en": "Clearing Route 713B",
          "ja": "石の道筋 713B"
        },
        "canonicalKeyHash": "713baae87fa4af1bf07ccb540c399decf16de5a6cd2035c767e9f2a9458ea696",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:63",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            28,
            29
          ],
          [
            16,
            17,
            21,
            24
          ],
          [
            3,
            8,
            9,
            14
          ],
          [
            22,
            27,
            34,
            35
          ],
          [
            7,
            13
          ],
          [
            15,
            20,
            25,
            26
          ],
          [
            10,
            23
          ],
          [
            4,
            11
          ],
          [
            6,
            12
          ],
          [
            2,
            5,
            31,
            32,
            33
          ],
          [
            1,
            18,
            30
          ],
          [
            19,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 60,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.65,
          "forcedSafeGroupShare": 0.4166666666666667,
          "averageGroupChoices": 5,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-9f0017cf2e7a",
        "number": 62,
        "title": {
          "en": "Clearing Route 9F00",
          "ja": "石の道筋 9F00"
        },
        "canonicalKeyHash": "9f0017cf2e7a3e8c2b1efba25b08d4753b15d46018bd3fbe05dcfd14f4b94c5e",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:76",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            17,
            22,
            23
          ],
          [
            31,
            32
          ],
          [
            16,
            28,
            29,
            35,
            36
          ],
          [
            8,
            15,
            21
          ],
          [
            18,
            24
          ],
          [
            11,
            30
          ],
          [
            19,
            20
          ],
          [
            4,
            9,
            13,
            25,
            26,
            27,
            33
          ],
          [
            3,
            5,
            10,
            34
          ],
          [
            2,
            6
          ],
          [
            7,
            14
          ],
          [
            1,
            12
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 44,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6590909090909091,
          "forcedSafeGroupShare": 0.75,
          "averageGroupChoices": 3.6666666666666665,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-2b75858c6fc5",
        "number": 63,
        "title": {
          "en": "Clearing Route 2B75",
          "ja": "石の道筋 2B75"
        },
        "canonicalKeyHash": "2b75858c6fc5a4e63a55852585207c5fda9448c85ada746f9d1af390095d1452",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:70",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            30,
            36
          ],
          [
            13,
            14,
            15,
            16,
            17
          ],
          [
            3,
            4
          ],
          [
            7,
            19
          ],
          [
            9,
            10
          ],
          [
            28,
            34,
            35
          ],
          [
            21,
            22,
            27,
            33
          ],
          [
            23,
            29,
            32
          ],
          [
            5,
            11,
            24
          ],
          [
            1,
            6,
            8,
            20
          ],
          [
            2,
            18,
            26
          ],
          [
            12,
            25,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 65,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.7384615384615385,
          "forcedSafeGroupShare": 0.8333333333333334,
          "averageGroupChoices": 5.416666666666667,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 59,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-8bea9936aa6f",
        "number": 64,
        "title": {
          "en": "Clearing Route 8BEA",
          "ja": "石の道筋 8BEA"
        },
        "canonicalKeyHash": "8bea9936aa6f09927d50244e6fc4318725773daba548f2df925660087f546303",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:10",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            6,
            12
          ],
          [
            34,
            35
          ],
          [
            30,
            36
          ],
          [
            13,
            14,
            19,
            20,
            25,
            31,
            32
          ],
          [
            8,
            16,
            17,
            18,
            22,
            23,
            24,
            27
          ],
          [
            7,
            26
          ],
          [
            2,
            33
          ],
          [
            21,
            28
          ],
          [
            4,
            10,
            29
          ],
          [
            5,
            9,
            15
          ],
          [
            1,
            3,
            11
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 37,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.6756756756756757,
          "forcedSafeGroupShare": 0.9090909090909091,
          "averageGroupChoices": 3.3636363636363638,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 59,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-f3dc16d93071",
        "number": 65,
        "title": {
          "en": "Clearing Route F3DC",
          "ja": "石の道筋 F3DC"
        },
        "canonicalKeyHash": "f3dc16d9307184f4751fd514cd0497c8b2a67f63284b620bf04b08da27c56638",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:9",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            13,
            19,
            25
          ],
          [
            12,
            17,
            18
          ],
          [
            22,
            23
          ],
          [
            5,
            10
          ],
          [
            29,
            30,
            35,
            36
          ],
          [
            2,
            3,
            7,
            9,
            11,
            14,
            15,
            20,
            26,
            27,
            28,
            31,
            33,
            34
          ],
          [
            6,
            16,
            24
          ],
          [
            4,
            21,
            32
          ],
          [
            1,
            8
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 27,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.6666666666666666,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 3,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 59,
        "marks": 3,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-60f343f35d2b",
        "number": 66,
        "title": {
          "en": "Clearing Route 60F3",
          "ja": "石の道筋 60F3"
        },
        "canonicalKeyHash": "60f343f35d2bd8829bc96079a1bca5e4009c8c129640935817d8a2ef9415dad1",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:37",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            31,
            32,
            33
          ],
          [
            6,
            11,
            12,
            17
          ],
          [
            27,
            34
          ],
          [
            16,
            23
          ],
          [
            1,
            7
          ],
          [
            9,
            14
          ],
          [
            19,
            21,
            25,
            26
          ],
          [
            3,
            15,
            28
          ],
          [
            10,
            29
          ],
          [
            5,
            30,
            35
          ],
          [
            4,
            8,
            13,
            20,
            22,
            24,
            36
          ],
          [
            2,
            18
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 39,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6666666666666666,
          "forcedSafeGroupShare": 0.9166666666666666,
          "averageGroupChoices": 3.25,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 60,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-716891e91fa4",
        "number": 67,
        "title": {
          "en": "Clearing Route 7168",
          "ja": "石の道筋 7168"
        },
        "canonicalKeyHash": "716891e91fa4353d185ea20613bfd23373befae2074ab9719004ef058b219878",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:98",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            25,
            31
          ],
          [
            13,
            19,
            32,
            33
          ],
          [
            22,
            26,
            27,
            28,
            34
          ],
          [
            10,
            15
          ],
          [
            2,
            8,
            14
          ],
          [
            5,
            6
          ],
          [
            29,
            35,
            36
          ],
          [
            23,
            30
          ],
          [
            4,
            11
          ],
          [
            16,
            21
          ],
          [
            9,
            17,
            24
          ],
          [
            3,
            20
          ],
          [
            1,
            12
          ],
          [
            7,
            18
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 44,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.6363636363636364,
          "forcedSafeGroupShare": 0.8571428571428571,
          "averageGroupChoices": 3.142857142857143,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 60,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-fde9760b29ed",
        "number": 68,
        "title": {
          "en": "Clearing Route FDE9",
          "ja": "石の道筋 FDE9"
        },
        "canonicalKeyHash": "fde9760b29eddeac415114ad9bc6bac6480146284a3557c660d6f0a9e0269ca5",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:7",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            11,
            12
          ],
          [
            6,
            17,
            18
          ],
          [
            34,
            35
          ],
          [
            5,
            24
          ],
          [
            32,
            33
          ],
          [
            2,
            3,
            8,
            9,
            15
          ],
          [
            20,
            21,
            27
          ],
          [
            14,
            26,
            28
          ],
          [
            4,
            7,
            13,
            19
          ],
          [
            1,
            25
          ],
          [
            22,
            29
          ],
          [
            16,
            23,
            36
          ],
          [
            10,
            30,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 44,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.6590909090909091,
          "forcedSafeGroupShare": 0.8461538461538461,
          "averageGroupChoices": 3.3846153846153846,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 61,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-e8edbf3d042d",
        "number": 69,
        "title": {
          "en": "Clearing Route E8ED",
          "ja": "石の道筋 E8ED"
        },
        "canonicalKeyHash": "e8edbf3d042df542a2544ed2fa0821d27fd2e88f24284ade958d939f43cc5bf3",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:19",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            25,
            31
          ],
          [
            21,
            27
          ],
          [
            16,
            22,
            28
          ],
          [
            11,
            12,
            17
          ],
          [
            6,
            18
          ],
          [
            10,
            29
          ],
          [
            5,
            23,
            33,
            34,
            35
          ],
          [
            4,
            36
          ],
          [
            15,
            30
          ],
          [
            1,
            8,
            13,
            14,
            19,
            20,
            26
          ],
          [
            2,
            3,
            9
          ],
          [
            7,
            24,
            32
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 48,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6875,
          "forcedSafeGroupShare": 0.75,
          "averageGroupChoices": 4,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 62,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-ed6befb41972",
        "number": 70,
        "title": {
          "en": "Clearing Route ED6B",
          "ja": "石の道筋 ED6B"
        },
        "canonicalKeyHash": "ed6befb41972c1149f856dab56e222a033c6a085dbf5ca80f15cbfa74644fba3",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:2",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            27,
            28
          ],
          [
            4,
            10
          ],
          [
            19,
            21,
            25,
            31,
            32,
            33,
            34,
            35
          ],
          [
            16,
            17,
            22,
            23,
            29
          ],
          [
            7,
            13
          ],
          [
            9,
            11,
            15,
            36
          ],
          [
            3,
            5,
            30
          ],
          [
            6,
            8
          ],
          [
            1,
            12,
            14,
            18,
            20,
            26
          ],
          [
            2,
            24
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 38,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.7105263157894737,
          "forcedSafeGroupShare": 0.9,
          "averageGroupChoices": 3.8,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 62,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-67f4b85a92ed",
        "number": 71,
        "title": {
          "en": "Clearing Route 67F4",
          "ja": "石の道筋 67F4"
        },
        "canonicalKeyHash": "67f4b85a92ed8c870a4dfd49a7d2190cebe220c762769a89828b86641a0419a6",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:82",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            10,
            11,
            16,
            17,
            23
          ],
          [
            34,
            35
          ],
          [
            1,
            7
          ],
          [
            19,
            20,
            26
          ],
          [
            4,
            21,
            22,
            27,
            28,
            29
          ],
          [
            8,
            13
          ],
          [
            5,
            36
          ],
          [
            30,
            33
          ],
          [
            15,
            32
          ],
          [
            2,
            3,
            9,
            25
          ],
          [
            12,
            14,
            18,
            24
          ],
          [
            6,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 43,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.6976744186046512,
          "forcedSafeGroupShare": 0.9166666666666666,
          "averageGroupChoices": 3.5833333333333335,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-de16221a1479",
        "number": 72,
        "title": {
          "en": "Clearing Route DE16",
          "ja": "石の道筋 DE16"
        },
        "canonicalKeyHash": "de16221a1479a5d1672caf81d422e7da1a4fe17ddce2a7fd96d628c9db942558",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:60",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 10,
        "witness": [
          [
            29,
            30,
            35,
            36
          ],
          [
            6,
            12
          ],
          [
            20,
            26
          ],
          [
            23,
            34
          ],
          [
            22,
            27
          ],
          [
            3,
            5,
            8,
            9,
            11,
            15,
            16,
            19,
            21,
            33
          ],
          [
            13,
            14,
            25
          ],
          [
            2,
            7,
            32
          ],
          [
            10,
            17,
            24,
            28,
            31
          ],
          [
            1,
            4,
            18
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 35,
          "witnessedDecisionCount": 10,
          "sampledOrderFailureShare": 0.7142857142857143,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 3.5,
          "witnessMoves": 10,
          "moveBudgetSlack": 0
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-378af475b0f7",
        "number": 73,
        "title": {
          "en": "Clearing Route 378A",
          "ja": "石の道筋 378A"
        },
        "canonicalKeyHash": "378af475b0f7055551e67eed0420459a9139295a33f044b577a69dfa55882997",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:1005",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "green"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            12,
            18
          ],
          [
            5,
            9,
            10,
            11,
            17
          ],
          [
            22,
            23,
            24,
            29
          ],
          [
            13,
            19,
            20
          ],
          [
            2,
            3
          ],
          [
            16,
            27,
            28
          ],
          [
            4,
            34
          ],
          [
            7,
            14,
            26
          ],
          [
            8,
            15,
            21,
            33
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 34,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.6470588235294118,
          "forcedSafeGroupShare": 0.6666666666666666,
          "averageGroupChoices": 3.7777777777777777,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 65,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-56b198fc88e6",
        "number": 74,
        "title": {
          "en": "Clearing Route 56B1",
          "ja": "石の道筋 56B1"
        },
        "canonicalKeyHash": "56b198fc88e693ff6467211d48dcaccaafd25db9e72144ad93ba621dfa8ec766",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:22",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 17,
        "witness": [
          [
            30,
            36
          ],
          [
            29,
            34,
            35
          ],
          [
            23,
            28
          ],
          [
            26,
            32
          ],
          [
            17,
            22
          ],
          [
            15,
            21
          ],
          [
            11,
            16
          ],
          [
            9,
            27
          ],
          [
            2,
            8
          ],
          [
            3,
            14
          ],
          [
            10,
            33
          ],
          [
            4,
            20
          ],
          [
            5,
            31
          ],
          [
            6,
            7
          ],
          [
            12,
            18,
            24
          ],
          [
            1,
            13
          ],
          [
            19,
            25
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 76,
          "witnessedDecisionCount": 17,
          "sampledOrderFailureShare": 0.7368421052631579,
          "forcedSafeGroupShare": 0.8823529411764706,
          "averageGroupChoices": 4.470588235294118,
          "witnessMoves": 17,
          "moveBudgetSlack": 0
        },
        "score": 65,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-869f0622edf9",
        "number": 75,
        "title": {
          "en": "Clearing Route 869F",
          "ja": "石の道筋 869F"
        },
        "canonicalKeyHash": "869f0622edf99005bf454bf9a224585ecfa11afefc6eb55286e5b37ca494b8e2",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:41",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            29,
            30,
            35
          ],
          [
            5,
            12
          ],
          [
            8,
            9,
            15
          ],
          [
            2,
            7
          ],
          [
            18,
            24,
            36
          ],
          [
            20,
            26
          ],
          [
            14,
            27,
            32
          ],
          [
            21,
            31,
            33
          ],
          [
            3,
            34
          ],
          [
            1,
            10
          ],
          [
            4,
            16,
            17,
            19,
            22
          ],
          [
            13,
            25
          ],
          [
            6,
            11,
            23,
            28
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 44,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.6818181818181818,
          "forcedSafeGroupShare": 0.9230769230769231,
          "averageGroupChoices": 3.3846153846153846,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 66,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-b754de33547f",
        "number": 76,
        "title": {
          "en": "Clearing Route B754",
          "ja": "石の道筋 B754"
        },
        "canonicalKeyHash": "b754de33547fd7f79b6413018e436342de1cae8525ab95d88cbfe1ea85b39b17",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:12",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            30,
            36
          ],
          [
            3,
            4,
            10,
            11
          ],
          [
            18,
            29,
            34,
            35
          ],
          [
            8,
            14
          ],
          [
            5,
            6,
            12,
            16,
            17,
            23
          ],
          [
            24,
            28,
            33
          ],
          [
            27,
            32
          ],
          [
            20,
            25
          ],
          [
            2,
            15
          ],
          [
            19,
            26,
            31
          ],
          [
            1,
            7,
            9
          ],
          [
            13,
            21,
            22
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 49,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.7142857142857143,
          "forcedSafeGroupShare": 0.8333333333333334,
          "averageGroupChoices": 4.083333333333333,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 66,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-5c54c2a54f15",
        "number": 77,
        "title": {
          "en": "Clearing Route 5C54",
          "ja": "石の道筋 5C54"
        },
        "canonicalKeyHash": "5c54c2a54f150a4e4feae675f4a1018360ba07c29b1cf0427b91c816417d0aa7",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:55",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            10,
            11
          ],
          [
            23,
            29
          ],
          [
            24,
            30,
            36
          ],
          [
            13,
            19
          ],
          [
            31,
            32
          ],
          [
            4,
            16
          ],
          [
            21,
            27
          ],
          [
            15,
            33,
            34,
            35
          ],
          [
            3,
            9,
            22
          ],
          [
            25,
            26
          ],
          [
            5,
            17,
            20,
            28
          ],
          [
            2,
            7,
            8,
            12,
            14
          ],
          [
            1,
            6,
            18
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 64,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.78125,
          "forcedSafeGroupShare": 0.9230769230769231,
          "averageGroupChoices": 4.923076923076923,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 67,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-85e6bca117d2",
        "number": 78,
        "title": {
          "en": "Clearing Route 85E6",
          "ja": "石の道筋 85E6"
        },
        "canonicalKeyHash": "85e6bca117d25a9332a9d37d599f0ba92a792ca45e5f929f477782301ce8fd94",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:67",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 15,
        "witness": [
          [
            15,
            20,
            21
          ],
          [
            25,
            31
          ],
          [
            22,
            28
          ],
          [
            18,
            24
          ],
          [
            13,
            26,
            27,
            32
          ],
          [
            9,
            16,
            29
          ],
          [
            34,
            35
          ],
          [
            4,
            10,
            23
          ],
          [
            3,
            11
          ],
          [
            5,
            17
          ],
          [
            1,
            7
          ],
          [
            33,
            36
          ],
          [
            8,
            12
          ],
          [
            2,
            14,
            19
          ],
          [
            6,
            30
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 67,
          "witnessedDecisionCount": 15,
          "sampledOrderFailureShare": 0.6865671641791045,
          "forcedSafeGroupShare": 0.6666666666666666,
          "averageGroupChoices": 4.466666666666667,
          "witnessMoves": 15,
          "moveBudgetSlack": 0
        },
        "score": 67,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-9656fc164816",
        "number": 79,
        "title": {
          "en": "Clearing Route 9656",
          "ja": "石の道筋 9656"
        },
        "canonicalKeyHash": "9656fc16481693343d696309f28e121fcd0dd6576012e98f7937baab7ccf54f0",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:0",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            29,
            35
          ],
          [
            23,
            34
          ],
          [
            5,
            24
          ],
          [
            17,
            28,
            33
          ],
          [
            18,
            30
          ],
          [
            11,
            21,
            22,
            26,
            27,
            32
          ],
          [
            2,
            13
          ],
          [
            3,
            8
          ],
          [
            4,
            9,
            10,
            14,
            15,
            16,
            25
          ],
          [
            20,
            36
          ],
          [
            7,
            19,
            31
          ],
          [
            1,
            6,
            12
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 46,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.717391304347826,
          "forcedSafeGroupShare": 0.9166666666666666,
          "averageGroupChoices": 3.8333333333333335,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 67,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-f1ea68bd6249",
        "number": 80,
        "title": {
          "en": "Clearing Route F1EA",
          "ja": "石の道筋 F1EA"
        },
        "canonicalKeyHash": "f1ea68bd6249e4a91e7872d747545d9c1f343f88fc75c1916f45ea19536a5e45",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:877",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            7,
            13
          ],
          [
            15,
            20,
            21
          ],
          [
            8,
            14,
            19,
            26
          ],
          [
            16,
            17
          ],
          [
            28,
            34
          ],
          [
            2,
            9,
            10,
            27
          ],
          [
            3,
            4,
            29
          ],
          [
            22,
            33
          ],
          [
            5,
            18
          ],
          [
            11,
            23
          ],
          [
            12,
            24
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 1,
          "seededPlayoutSuccessRate": 0.015625,
          "legalGroupChoices": 44,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.7045454545454546,
          "forcedSafeGroupShare": 0.8181818181818182,
          "averageGroupChoices": 4,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 67,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-7db69741d1dd",
        "number": 81,
        "title": {
          "en": "Clearing Route 7DB6",
          "ja": "石の道筋 7DB6"
        },
        "canonicalKeyHash": "7db69741d1dd04a65fbae9988743199834f6f8cb94385353acc52e291873f8dc",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:62",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            18,
            24,
            30
          ],
          [
            25,
            31
          ],
          [
            6,
            12,
            29
          ],
          [
            34,
            35
          ],
          [
            1,
            14,
            15
          ],
          [
            9,
            10
          ],
          [
            8,
            20,
            21
          ],
          [
            22,
            27
          ],
          [
            3,
            16,
            26,
            33
          ],
          [
            2,
            13,
            32
          ],
          [
            4,
            7,
            17
          ],
          [
            11,
            23,
            28,
            36
          ],
          [
            5,
            19
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 46,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.717391304347826,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 3.5384615384615383,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 71,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-3264380f3ea0",
        "number": 82,
        "title": {
          "en": "Clearing Route 3264",
          "ja": "石の道筋 3264"
        },
        "canonicalKeyHash": "3264380f3ea0b9c850744e39f46280d553e37cab26153e6c7ca0de549e2e1635",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:92",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            20,
            26,
            27,
            32
          ],
          [
            14,
            33
          ],
          [
            8,
            21
          ],
          [
            4,
            5
          ],
          [
            10,
            11,
            17,
            18
          ],
          [
            12,
            23,
            24,
            28,
            29
          ],
          [
            9,
            22
          ],
          [
            16,
            34
          ],
          [
            15,
            35
          ],
          [
            2,
            3
          ],
          [
            6,
            19,
            25,
            31
          ],
          [
            1,
            7,
            30
          ],
          [
            13,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 50,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.72,
          "forcedSafeGroupShare": 0.9230769230769231,
          "averageGroupChoices": 3.8461538461538463,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 72,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-fe60112f9c12",
        "number": 83,
        "title": {
          "en": "Clearing Route FE60",
          "ja": "石の道筋 FE60"
        },
        "canonicalKeyHash": "fe60112f9c127febd628de247f9ca9c9ad2d9fdb67b70fc6f09516a1d9bb4781",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:51",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            4,
            9,
            10,
            16
          ],
          [
            18,
            24
          ],
          [
            3,
            8,
            15
          ],
          [
            17,
            23
          ],
          [
            21,
            22
          ],
          [
            26,
            27,
            33,
            34,
            35
          ],
          [
            2,
            13
          ],
          [
            20,
            28,
            32
          ],
          [
            14,
            25,
            29,
            31
          ],
          [
            5,
            30
          ],
          [
            12,
            36
          ],
          [
            11,
            19
          ],
          [
            1,
            6,
            7
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 50,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.72,
          "forcedSafeGroupShare": 0.9230769230769231,
          "averageGroupChoices": 3.8461538461538463,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 72,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-85e0f56cadfb",
        "number": 84,
        "title": {
          "en": "Clearing Route 85E0",
          "ja": "石の道筋 85E0"
        },
        "canonicalKeyHash": "85e0f56cadfb4a5cb96aa7cbdd0817f0a32133160dcdcedabde9fb1fc202d558",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:583",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "green"
          },
          null,
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          null,
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            8,
            9
          ],
          [
            17,
            18
          ],
          [
            12,
            24
          ],
          [
            13,
            14,
            19
          ],
          [
            20,
            21
          ],
          [
            3,
            16
          ],
          [
            5,
            11
          ],
          [
            2,
            7
          ],
          [
            15,
            26,
            27,
            28,
            33,
            34
          ],
          [
            4,
            23,
            29
          ],
          [
            10,
            22
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 52,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.6538461538461539,
          "forcedSafeGroupShare": 0.5454545454545454,
          "averageGroupChoices": 4.7272727272727275,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 73,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-564add38cb9f",
        "number": 85,
        "title": {
          "en": "Clearing Route 564A",
          "ja": "石の道筋 564A"
        },
        "canonicalKeyHash": "564add38cb9facf9ebc8abd84e16015b418c999d95c3afcafdf06e575fc796b5",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:99",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 13,
        "witness": [
          [
            1,
            2
          ],
          [
            28,
            29,
            30
          ],
          [
            6,
            12
          ],
          [
            35,
            36
          ],
          [
            16,
            21
          ],
          [
            27,
            33
          ],
          [
            15,
            22,
            32,
            34
          ],
          [
            9,
            10,
            17,
            23,
            24
          ],
          [
            5,
            11,
            18
          ],
          [
            14,
            19
          ],
          [
            13,
            25
          ],
          [
            20,
            26
          ],
          [
            3,
            4,
            7,
            8,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 80,
          "witnessedDecisionCount": 13,
          "sampledOrderFailureShare": 0.775,
          "forcedSafeGroupShare": 0.6923076923076923,
          "averageGroupChoices": 6.153846153846154,
          "witnessMoves": 13,
          "moveBudgetSlack": 0
        },
        "score": 74,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-7df842afaa74",
        "number": 86,
        "title": {
          "en": "Clearing Route 7DF8",
          "ja": "石の道筋 7DF8"
        },
        "canonicalKeyHash": "7df842afaa7470646d70ae918d0fc11bf604a1eef0605a65c716996ace4401a2",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:14",
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 16,
        "witness": [
          [
            32,
            33
          ],
          [
            26,
            27
          ],
          [
            17,
            18
          ],
          [
            9,
            15,
            21
          ],
          [
            7,
            13
          ],
          [
            11,
            12,
            23
          ],
          [
            3,
            20
          ],
          [
            14,
            34,
            35
          ],
          [
            6,
            24
          ],
          [
            8,
            28
          ],
          [
            2,
            22
          ],
          [
            5,
            10
          ],
          [
            4,
            16
          ],
          [
            29,
            31
          ],
          [
            25,
            36
          ],
          [
            1,
            19,
            30
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 64,
          "witnessedDecisionCount": 16,
          "sampledOrderFailureShare": 0.71875,
          "forcedSafeGroupShare": 0.875,
          "averageGroupChoices": 4,
          "witnessMoves": 16,
          "moveBudgetSlack": 0
        },
        "score": 74,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-9620f8566b12",
        "number": 87,
        "title": {
          "en": "Clearing Route 9620",
          "ja": "石の道筋 9620"
        },
        "canonicalKeyHash": "9620f8566b12319bee1e31e4c8efa06ff6cfa6910a52f4be57f9296957cb8668",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:244",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "gold"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          null,
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "gold"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "red"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            28,
            29
          ],
          [
            19,
            20
          ],
          [
            12,
            18
          ],
          [
            14,
            16,
            21
          ],
          [
            22,
            23
          ],
          [
            5,
            11,
            24
          ],
          [
            2,
            7,
            13
          ],
          [
            8,
            15,
            26
          ],
          [
            10,
            27
          ],
          [
            4,
            17,
            34
          ],
          [
            3,
            9,
            33
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 49,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.6938775510204082,
          "forcedSafeGroupShare": 0.6363636363636364,
          "averageGroupChoices": 4.454545454545454,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 75,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-fe4eccf59722",
        "number": 88,
        "title": {
          "en": "Clearing Route FE4E",
          "ja": "石の道筋 FE4E"
        },
        "canonicalKeyHash": "fe4eccf5972291ecc77aa789862856248246a78c0aee70bb3c688cc0c98f7068",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:33",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "gold"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "red"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            24,
            30
          ],
          [
            26,
            32
          ],
          [
            16,
            17
          ],
          [
            8,
            15,
            21,
            27,
            33
          ],
          [
            3,
            9,
            14
          ],
          [
            10,
            11,
            22
          ],
          [
            20,
            34
          ],
          [
            2,
            28,
            31
          ],
          [
            4,
            18,
            25,
            35,
            36
          ],
          [
            6,
            13,
            23
          ],
          [
            1,
            7,
            19
          ],
          [
            5,
            12,
            29
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 52,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.75,
          "forcedSafeGroupShare": 0.9166666666666666,
          "averageGroupChoices": 4.333333333333333,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 75,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-af75037320b5",
        "number": 89,
        "title": {
          "en": "Clearing Route AF75",
          "ja": "石の道筋 AF75"
        },
        "canonicalKeyHash": "af75037320b5e1f087d62e2ec3ce6d6bd44630c3ba782e8e11f6b6ee4cef5845",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:30",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "green"
          },
          {
            "id": 30,
            "colour": "red"
          },
          {
            "id": 31,
            "colour": "gold"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            5,
            9,
            10,
            11,
            12
          ],
          [
            34,
            35
          ],
          [
            30,
            36
          ],
          [
            6,
            17
          ],
          [
            22,
            23
          ],
          [
            4,
            21
          ],
          [
            27,
            28,
            29,
            32,
            33
          ],
          [
            3,
            15,
            16
          ],
          [
            24,
            26
          ],
          [
            2,
            13
          ],
          [
            25,
            31
          ],
          [
            7,
            14
          ],
          [
            1,
            19,
            20
          ],
          [
            8,
            18
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 52,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.7307692307692307,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 3.7142857142857144,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 76,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-209eb6c88c95",
        "number": 90,
        "title": {
          "en": "Clearing Route 209E",
          "ja": "石の道筋 209E"
        },
        "canonicalKeyHash": "209eb6c88c95719a0ca0163699a4ea885681b9b57e563cac6708945fdfbb9125",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:247",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "red"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "red"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          null,
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "red"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 8,
        "witness": [
          [
            12,
            18,
            23,
            24
          ],
          [
            3,
            4
          ],
          [
            7,
            13,
            14,
            20,
            26,
            27
          ],
          [
            2,
            8,
            15,
            19
          ],
          [
            17,
            29
          ],
          [
            9,
            22
          ],
          [
            11,
            28,
            33,
            34
          ],
          [
            5,
            10,
            16,
            21
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 31,
          "witnessedDecisionCount": 8,
          "sampledOrderFailureShare": 0.7419354838709677,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 3.875,
          "witnessMoves": 8,
          "moveBudgetSlack": 0
        },
        "score": 77,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-422fa35dfc6c",
        "number": 91,
        "title": {
          "en": "Clearing Route 422F",
          "ja": "石の道筋 422F"
        },
        "canonicalKeyHash": "422fa35dfc6c1b1c7250b956a1a7d4b5406e91f38392ab57bc283199eb3ab20a",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:24",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            4,
            5,
            6
          ],
          [
            8,
            9
          ],
          [
            26,
            31,
            32
          ],
          [
            13,
            19
          ],
          [
            10,
            11,
            15,
            16
          ],
          [
            17,
            23,
            24,
            30,
            36
          ],
          [
            2,
            7,
            14,
            21
          ],
          [
            3,
            22,
            27
          ],
          [
            28,
            29,
            34
          ],
          [
            18,
            33,
            35
          ],
          [
            1,
            12,
            20,
            25
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 48,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.7708333333333334,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 4.363636363636363,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 77,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-eb5acf448894",
        "number": 92,
        "title": {
          "en": "Clearing Route EB5A",
          "ja": "石の道筋 EB5A"
        },
        "canonicalKeyHash": "eb5acf448894cc5eb518b8e724383f7bf66ca099e5641e6501e5061309671ebb",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:97",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "green"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "red"
          },
          {
            "id": 23,
            "colour": "green"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 14,
        "witness": [
          [
            3,
            9
          ],
          [
            6,
            11,
            12,
            17
          ],
          [
            5,
            18,
            23
          ],
          [
            4,
            10
          ],
          [
            14,
            15
          ],
          [
            1,
            7
          ],
          [
            21,
            22,
            27,
            33
          ],
          [
            19,
            20,
            26,
            28
          ],
          [
            16,
            34
          ],
          [
            8,
            29
          ],
          [
            32,
            35
          ],
          [
            2,
            36
          ],
          [
            24,
            25,
            30
          ],
          [
            13,
            31
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 56,
          "witnessedDecisionCount": 14,
          "sampledOrderFailureShare": 0.7321428571428571,
          "forcedSafeGroupShare": 0.9285714285714286,
          "averageGroupChoices": 4,
          "witnessMoves": 14,
          "moveBudgetSlack": 0
        },
        "score": 77,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-70d8b5183269",
        "number": 93,
        "title": {
          "en": "Clearing Route 70D8",
          "ja": "石の道筋 70D8"
        },
        "canonicalKeyHash": "70d8b51832694a4556efbca4f681f38262eeb07241fc821e67db73ad950edab1",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:91",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "blue"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "blue"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 15,
        "witness": [
          [
            1,
            2
          ],
          [
            34,
            35
          ],
          [
            25,
            31
          ],
          [
            7,
            13
          ],
          [
            19,
            32
          ],
          [
            30,
            36
          ],
          [
            15,
            21,
            27
          ],
          [
            12,
            18,
            24,
            29
          ],
          [
            11,
            16
          ],
          [
            17,
            22
          ],
          [
            9,
            28,
            33
          ],
          [
            3,
            26
          ],
          [
            8,
            10,
            14,
            20
          ],
          [
            5,
            23
          ],
          [
            4,
            6
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 71,
          "witnessedDecisionCount": 15,
          "sampledOrderFailureShare": 0.7464788732394366,
          "forcedSafeGroupShare": 0.8,
          "averageGroupChoices": 4.733333333333333,
          "witnessMoves": 15,
          "moveBudgetSlack": 0
        },
        "score": 78,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-d9eb044992c7",
        "number": 94,
        "title": {
          "en": "Clearing Route D9EB",
          "ja": "石の道筋 D9EB"
        },
        "canonicalKeyHash": "d9eb044992c71d6c479be25c98ee79a5ee489c86412f51591934fcc4fcf4e355",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:25",
        "board": [
          {
            "id": 1,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "gold"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "blue"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "green"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 16,
        "witness": [
          [
            32,
            33
          ],
          [
            15,
            22
          ],
          [
            1,
            7
          ],
          [
            34,
            35
          ],
          [
            6,
            12
          ],
          [
            26,
            27
          ],
          [
            20,
            31
          ],
          [
            2,
            3,
            13
          ],
          [
            9,
            21
          ],
          [
            8,
            14,
            28
          ],
          [
            17,
            23
          ],
          [
            11,
            30
          ],
          [
            5,
            24,
            29
          ],
          [
            16,
            36
          ],
          [
            10,
            18,
            25
          ],
          [
            4,
            19
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 64,
          "witnessedDecisionCount": 16,
          "sampledOrderFailureShare": 0.734375,
          "forcedSafeGroupShare": 0.9375,
          "averageGroupChoices": 4,
          "witnessMoves": 16,
          "moveBudgetSlack": 0
        },
        "score": 79,
        "marks": 4,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-06c9a814d006",
        "number": 95,
        "title": {
          "en": "Clearing Route 06C9",
          "ja": "石の道筋 06C9"
        },
        "canonicalKeyHash": "06c9a814d00691ca06c13918577bef36103e8269e87594015be967786df21b5c",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:597",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "blue"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "red"
          },
          null,
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 9,
        "witness": [
          [
            12,
            17,
            18,
            24
          ],
          [
            23,
            28,
            29
          ],
          [
            7,
            13,
            14
          ],
          [
            16,
            21
          ],
          [
            33,
            34
          ],
          [
            9,
            15,
            26
          ],
          [
            2,
            8,
            19
          ],
          [
            3,
            10,
            20,
            27
          ],
          [
            4,
            5,
            11,
            22
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 37,
          "witnessedDecisionCount": 9,
          "sampledOrderFailureShare": 0.7297297297297297,
          "forcedSafeGroupShare": 0.8888888888888888,
          "averageGroupChoices": 4.111111111111111,
          "witnessMoves": 9,
          "moveBudgetSlack": 0
        },
        "score": 80,
        "marks": 5,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-78afa989819b",
        "number": 96,
        "title": {
          "en": "Clearing Route 78AF",
          "ja": "石の道筋 78AF"
        },
        "canonicalKeyHash": "78afa989819bac8f9d0cd8b25d07f5d1f4d49bc4a52efeb39170b146d954cd05",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:31",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "red"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "green"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "blue"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "blue"
          },
          {
            "id": 32,
            "colour": "blue"
          },
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "red"
          },
          {
            "id": 35,
            "colour": "green"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            31,
            32,
            33
          ],
          [
            2,
            3,
            4,
            8,
            9,
            10,
            16
          ],
          [
            19,
            20,
            25
          ],
          [
            14,
            21,
            28,
            29
          ],
          [
            35,
            36
          ],
          [
            26,
            27
          ],
          [
            23,
            30
          ],
          [
            13,
            15
          ],
          [
            5,
            6,
            11,
            12,
            22
          ],
          [
            7,
            17,
            34
          ],
          [
            1,
            18,
            24
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 54,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.7962962962962963,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 4.909090909090909,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 80,
        "marks": 5,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-10abed443ae2",
        "number": 97,
        "title": {
          "en": "Clearing Route 10AB",
          "ja": "石の道筋 10AB"
        },
        "canonicalKeyHash": "10abed443ae2c6dca173af138707c84fbaae3c568c6b8735190471706277090f",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:334",
        "mask": [
          false,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          true,
          true,
          false,
          false
        ],
        "board": [
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "green"
          },
          null,
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "blue"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "blue"
          },
          null,
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 33,
            "colour": "blue"
          },
          {
            "id": 34,
            "colour": "red"
          },
          null,
          null
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 11,
        "witness": [
          [
            21,
            27,
            33
          ],
          [
            3,
            20
          ],
          [
            4,
            5
          ],
          [
            8,
            13
          ],
          [
            9,
            15,
            26
          ],
          [
            2,
            7,
            14,
            19
          ],
          [
            10,
            11
          ],
          [
            12,
            18
          ],
          [
            23,
            24
          ],
          [
            17,
            22
          ],
          [
            16,
            28,
            29,
            34
          ]
        ],
        "tags": [
          "clear-all",
          "fixed-columns",
          "silhouette",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 54,
          "witnessedDecisionCount": 11,
          "sampledOrderFailureShare": 0.7037037037037037,
          "forcedSafeGroupShare": 0.7272727272727273,
          "averageGroupChoices": 4.909090909090909,
          "witnessMoves": 11,
          "moveBudgetSlack": 0
        },
        "score": 81,
        "marks": 5,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-270d1d5a4287",
        "number": 98,
        "title": {
          "en": "Clearing Route 270D",
          "ja": "石の道筋 270D"
        },
        "canonicalKeyHash": "270d1d5a42871e14f43cbae6410649f6bee19ced2f3c40beebd22ed36594a321",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:48",
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "red"
          },
          {
            "id": 18,
            "colour": "green"
          },
          {
            "id": 19,
            "colour": "red"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "green"
          },
          {
            "id": 23,
            "colour": "blue"
          },
          {
            "id": 24,
            "colour": "red"
          },
          {
            "id": 25,
            "colour": "gold"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "blue"
          },
          {
            "id": 28,
            "colour": "blue"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "gold"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "green"
          },
          {
            "id": 33,
            "colour": "gold"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "green"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 15,
        "witness": [
          [
            4,
            5,
            11
          ],
          [
            27,
            28
          ],
          [
            15,
            20
          ],
          [
            2,
            8
          ],
          [
            12,
            18
          ],
          [
            33,
            34
          ],
          [
            3,
            9,
            10,
            21
          ],
          [
            16,
            25,
            26
          ],
          [
            22,
            32
          ],
          [
            14,
            35
          ],
          [
            17,
            24
          ],
          [
            6,
            30
          ],
          [
            19,
            29,
            31
          ],
          [
            13,
            23
          ],
          [
            1,
            7,
            36
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 63,
          "witnessedDecisionCount": 15,
          "sampledOrderFailureShare": 0.746031746031746,
          "forcedSafeGroupShare": 0.9333333333333333,
          "averageGroupChoices": 4.2,
          "witnessMoves": 15,
          "moveBudgetSlack": 0
        },
        "score": 81,
        "marks": 5,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-43d66e53fc48",
        "number": 99,
        "title": {
          "en": "Clearing Route 43D6",
          "ja": "石の道筋 43D6"
        },
        "canonicalKeyHash": "43d66e53fc48cf6c438b3af4a0f04e32f6990c9cf07e6cceca784e8e78459fa8",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:85",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "gold"
          },
          {
            "id": 17,
            "colour": "blue"
          },
          {
            "id": 18,
            "colour": "red"
          },
          {
            "id": 19,
            "colour": "gold"
          },
          {
            "id": 20,
            "colour": "green"
          },
          {
            "id": 21,
            "colour": "red"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "red"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "green"
          },
          {
            "id": 26,
            "colour": "red"
          },
          {
            "id": 27,
            "colour": "red"
          },
          {
            "id": 28,
            "colour": "gold"
          },
          {
            "id": 29,
            "colour": "red"
          },
          {
            "id": 30,
            "colour": "blue"
          },
          {
            "id": 31,
            "colour": "green"
          },
          {
            "id": 32,
            "colour": "red"
          },
          {
            "id": 33,
            "colour": "green"
          },
          {
            "id": 34,
            "colour": "green"
          },
          {
            "id": 35,
            "colour": "blue"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            4,
            9,
            10
          ],
          [
            23,
            29
          ],
          [
            25,
            31
          ],
          [
            33,
            34
          ],
          [
            13,
            21,
            26,
            27,
            32
          ],
          [
            16,
            22,
            28
          ],
          [
            3,
            5,
            11,
            15,
            17,
            30,
            35
          ],
          [
            2,
            12
          ],
          [
            1,
            8
          ],
          [
            14,
            20,
            24
          ],
          [
            18,
            36
          ],
          [
            6,
            7,
            19
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 56,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.7857142857142857,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 4.666666666666667,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 81,
        "marks": 5,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "stone-5e6cbd907e83",
        "number": 100,
        "title": {
          "en": "Clearing Route 5E6C",
          "ja": "石の道筋 5E6C"
        },
        "canonicalKeyHash": "5e6cbd907e83b39a5f20ca8b1451192b72ea66dac083250db066c9dd8321e893",
        "width": 6,
        "height": 6,
        "colourCount": 4,
        "seed": "stone-collapse-campaign-1.0:23",
        "board": [
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "red"
          },
          {
            "id": 17,
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "green"
          },
          {
            "id": 22,
            "colour": "gold"
          },
          {
            "id": 23,
            "colour": "gold"
          },
          {
            "id": 24,
            "colour": "green"
          },
          {
            "id": 25,
            "colour": "red"
          },
          {
            "id": 26,
            "colour": "gold"
          },
          {
            "id": 27,
            "colour": "green"
          },
          {
            "id": 28,
            "colour": "red"
          },
          {
            "id": 29,
            "colour": "gold"
          },
          {
            "id": 30,
            "colour": "green"
          },
          {
            "id": 31,
            "colour": "red"
          },
          {
            "id": 32,
            "colour": "gold"
          },
          {
            "id": 33,
            "colour": "red"
          },
          {
            "id": 34,
            "colour": "gold"
          },
          {
            "id": 35,
            "colour": "gold"
          },
          {
            "id": 36,
            "colour": "red"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 12,
        "witness": [
          [
            24,
            30
          ],
          [
            19,
            20
          ],
          [
            25,
            31
          ],
          [
            4,
            5
          ],
          [
            26,
            32
          ],
          [
            1,
            2,
            7
          ],
          [
            8,
            14,
            33
          ],
          [
            10,
            11,
            15,
            17,
            22,
            23,
            29,
            34,
            35
          ],
          [
            16,
            28,
            36
          ],
          [
            13,
            21,
            27
          ],
          [
            3,
            9,
            12
          ],
          [
            6,
            18
          ]
        ],
        "tags": [
          "clear-all",
          "removal-order",
          "pair-choice"
        ],
        "rawMetrics": {
          "seededPlayoutSamples": 64,
          "seededPlayoutSuccesses": 0,
          "seededPlayoutSuccessRate": 0,
          "legalGroupChoices": 57,
          "witnessedDecisionCount": 12,
          "sampledOrderFailureShare": 0.7894736842105263,
          "forcedSafeGroupShare": 1,
          "averageGroupChoices": 4.75,
          "witnessMoves": 12,
          "moveBudgetSlack": 0
        },
        "score": 81,
        "marks": 5,
        "gradingVersion": "collapse-order-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      }
    ]
  },
  "tutorials": [
    {
      "id": "identify-a-group",
      "title": {
        "en": "Find a Connected Group",
        "ja": "つながったグループを見つける"
      },
      "objective": {
        "en": "Select and clear the marked pair.",
        "ja": "印のペアを選び、消しましょう。"
      },
      "setup": {
        "width": 4,
        "height": 4,
        "colourCount": 4,
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2
          ]
        },
        "witness": [
          [
            1,
            2
          ]
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Select either red stone. Both connected stones should be previewed.",
            "ja": "赤い石のどちらかを選びます。つながった2つがプレビューされます。"
          },
          "action": "select"
        },
        {
          "instruction": {
            "en": "Confirm the selected group to clear it.",
            "ja": "選んだグループを確認して消します。"
          },
          "action": "confirm"
        }
      ],
      "tags": [
        "group-selection",
        "confirmation"
      ]
    },
    {
      "id": "follow-gravity-and-compression",
      "title": {
        "en": "Follow Gravity and Compression",
        "ja": "重力と列の圧縮を見る"
      },
      "objective": {
        "en": "Clear the blue pair and watch the empty column close.",
        "ja": "青いペアを消し、空いた列が詰まる様子を見ます。"
      },
      "setup": {
        "width": 4,
        "height": 4,
        "colourCount": 4,
        "board": [
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "gold"
          }
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            2,
            6,
            10,
            14,
            15
          ]
        },
        "witness": [
          [
            2,
            6,
            10,
            14,
            15
          ]
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Choose either blue stone to preview the complete pair.",
            "ja": "青い石を選び、ペア全体をプレビューします。"
          },
          "action": "select"
        },
        {
          "instruction": {
            "en": "Confirm. Stones above fall first; on this rectangle, the empty column then shifts away.",
            "ja": "確認します。石が先に下へ落ち、この長方形では空いた列が左へ詰まります。"
          },
          "action": "confirm"
        }
      ],
      "tags": [
        "gravity",
        "column-compression"
      ]
    },
    {
      "id": "plan-the-removal-order",
      "title": {
        "en": "Plan the Removal Order",
        "ja": "消す順番を考える"
      },
      "objective": {
        "en": "Clear the whole board without stranding the remaining stones.",
        "ja": "石を取り残さないように盤面をすべて消します。"
      },
      "setup": {
        "width": 4,
        "height": 4,
        "colourCount": 4,
        "board": [
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "red"
          },
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          },
          {
            "id": 16,
            "colour": "blue"
          }
        ],
        "goal": {
          "kind": "clear-all"
        },
        "moveLimit": 6,
        "witness": [
          [
            2,
            3
          ],
          [
            5,
            6,
            7
          ],
          [
            11,
            14,
            15
          ],
          [
            10,
            16
          ],
          [
            1,
            8,
            9
          ],
          [
            4,
            12,
            13
          ]
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Clear the blue pair first, then the red group. This opens the lower groups.",
            "ja": "先に青いペアを消し、次に赤いグループを消して下の道を開きます。"
          },
          "action": "select; confirm"
        },
        {
          "instruction": {
            "en": "The green group is tempting, but taking it first leaves only single stones. Follow the marked route.",
            "ja": "緑のグループを先に消すと、1つずつの石が残ってしまいます。印の順番で進めます。"
          },
          "action": "plan; clear-all"
        }
      ],
      "tags": [
        "removal-order",
        "singleton-risk"
      ]
    }
  ]
} as const;
