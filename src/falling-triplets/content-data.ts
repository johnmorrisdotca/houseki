// Generated offline by scripts/falling-triplets-levels.mjs.
export const contentData = {
  "campaign": {
    "count": 100,
    "candidatePoolCount": 110,
    "generationRevision": "houseki-triplets-campaign-1.4",
    "gradingVersion": "triplets-choice-grade-2",
    "category": "6×13 visible well / 5 colours",
    "curationPolicy": "Generate 10% surplus; retain score-quantile coverage within each of five mechanic families; then regrade and order the selected 100.",
    "orderingPolicy": "single-category/nondecreasing-measured-score/stable-id-tie-break",
    "grading": {
      "weights": {
        "lowSeededSuccessPercentile": 0.45,
        "goalPreservingChoiceAndForcedChoicePercentile": 0.25,
        "setupChainAndDirectionDemandPercentile": 0.2,
        "witnessLengthPercentile": 0.1
      },
      "seededPlayouts": "64 independent fixed-seed legal placement runs per candidate",
      "choiceProbe": "Enumerate legal column/orientation choices at each witnessed setup state and replay the remaining witness suffix; low goal-preserving choice share and high forced-choice share increase measured demand.",
      "percentileScope": "within the declared 6×13/five-colour category; higher raw difficulty percentile increases score",
      "scoreRule": "round(100 × weighted percentile blend); marks=min(5,1+floor(score/20))"
    },
    "sampleBudget": 64,
    "checksum": "5ca8d260008cb6f6b6f6428e91c7cee4c6f8a8e0e949c21bc910977436e4c570",
    "levels": [
      {
        "id": "ft-0a143ccaf6ca",
        "seed": "campaign-diagonal-6",
        "number": 1,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "purple"
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
          null,
          {
            "id": 10,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "green",
            "purple"
          ],
          [
            "green",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 4,
            "orientation": 0
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 7",
          "ja": "斜めの糸 7"
        },
        "canonicalKeyHash": "0a143ccaf6ca58c83add152190c8cb3dbcec35824ad02b198b164ce64b9a7137",
        "rawMetrics": {
          "seededGoalSuccesses": 9,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.140625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 17,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4722222222222222,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 16,
        "marks": 1,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-2bb1597055fd",
        "seed": "campaign-crossing-9",
        "number": 2,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red",
            "target": true
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
            "colour": "green"
          }
        ],
        "queue": [
          [
            "gold",
            "purple",
            "green"
          ],
          [
            "blue",
            "purple",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 10",
          "ja": "交差する線 10"
        },
        "canonicalKeyHash": "2bb1597055fd34c38450f2575a2856a352a25501d33e059744e110a8f78c1804",
        "rawMetrics": {
          "seededGoalSuccesses": 16,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.25,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 18,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.5,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 2
        },
        "score": 19,
        "marks": 1,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-97dd9c4328e7",
        "seed": "campaign-crossing-15",
        "number": 3,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            7
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
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
            "colour": "green",
            "target": true
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
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
            "colour": "purple"
          },
          {
            "id": 14,
            "colour": "red"
          },
          {
            "id": 15,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "gold",
            "purple",
            "blue"
          ],
          [
            "red",
            "gold",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 16",
          "ja": "交差する線 16"
        },
        "canonicalKeyHash": "97dd9c4328e7b78afbbca8543b642a7fb7de4b3ada26d373419d9a8c371d271d",
        "rawMetrics": {
          "seededGoalSuccesses": 9,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.140625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 18,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.5,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 2
        },
        "score": 21,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-0425a5079ff8",
        "seed": "campaign-crossing-12",
        "number": 4,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            7
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 6,
            "colour": "purple"
          },
          {
            "id": 7,
            "colour": "gold",
            "target": true
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "green"
          },
          null,
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
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "green",
            "red",
            "purple"
          ],
          [
            "purple",
            "blue",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 13",
          "ja": "交差する線 13"
        },
        "canonicalKeyHash": "0425a5079ff88d476b9e6ecbe8fe916de99d5e4b459514f6271e517fb5ed2bb4",
        "rawMetrics": {
          "seededGoalSuccesses": 9,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.140625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 17,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4722222222222222,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 2
        },
        "score": 22,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-7fad47d63585",
        "seed": "campaign-diagonal-9",
        "number": 5,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "gold",
            "red",
            "green"
          ],
          [
            "red",
            "green",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 4,
            "orientation": 0
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Diagonal Thread 10",
          "ja": "斜めの糸 10"
        },
        "canonicalKeyHash": "7fad47d635855ad272a361c3edb8362415169b680ea6ca5dd2d51d2a9fd91a77",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 17,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4722222222222222,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 23,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-ee24afcaad9b",
        "seed": "campaign-crossing-0",
        "number": 6,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold",
            "target": true
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
          null,
          null,
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
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "purple",
            "red",
            "purple"
          ],
          [
            "blue",
            "blue",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 1",
          "ja": "交差する線 1"
        },
        "canonicalKeyHash": "ee24afcaad9b3e5c72b96d7b07d75a6d55844153498f474b316d6295ae85e6a8",
        "rawMetrics": {
          "seededGoalSuccesses": 8,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 17,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4722222222222222,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 2
        },
        "score": 24,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-20f310ec9938",
        "seed": "campaign-crossing-7",
        "number": 7,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            6
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          {
            "id": 3,
            "colour": "purple"
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
            "colour": "gold",
            "target": true
          },
          {
            "id": 7,
            "colour": "red"
          },
          null,
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
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "purple"
          },
          null
        ],
        "queue": [
          [
            "red",
            "blue",
            "red"
          ],
          [
            "red",
            "blue",
            "red"
          ],
          [
            "purple",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 8",
          "ja": "交差する線 8"
        },
        "canonicalKeyHash": "20f310ec9938804e34f168a67ed3fa42e36e22ba23c08f0c65d1e0f88ab3ef3a",
        "rawMetrics": {
          "seededGoalSuccesses": 12,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.1875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 33,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.6111111111111112,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 26,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-e18fcd7a6caa",
        "seed": "campaign-crossing-5",
        "number": 8,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "purple",
            "target": true
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
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
            "colour": "purple"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          null,
          {
            "id": 10,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "green",
            "gold"
          ],
          [
            "green",
            "blue",
            "gold"
          ],
          [
            "red",
            "gold",
            "green"
          ],
          [
            "purple",
            "red",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 6",
          "ja": "交差する線 6"
        },
        "canonicalKeyHash": "e18fcd7a6caa78db0c6ef933d0d74f2ef4dcff1084aa2bcc19bc7b75dd380987",
        "rawMetrics": {
          "seededGoalSuccesses": 11,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.171875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 47,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6527777777777778,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 30,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-66a6f221924b",
        "seed": "campaign-horizontal-3",
        "number": 9,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "gold",
            "target": true
          },
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "green",
            "purple"
          ],
          [
            "blue",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Side-by-Side 4",
          "ja": "横並び 4"
        },
        "canonicalKeyHash": "66a6f221924b014918385873ded79aa6ad6422236edf27aa038efb46cb832e26",
        "rawMetrics": {
          "seededGoalSuccesses": 7,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.109375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 31,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-a96265b29ff2",
        "seed": "campaign-crossing-4",
        "number": 10,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            5
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "purple",
            "target": true
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
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
            "colour": "purple"
          },
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "green",
            "blue",
            "gold"
          ],
          [
            "gold",
            "red",
            "blue"
          ],
          [
            "green",
            "purple",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 5",
          "ja": "交差する線 5"
        },
        "canonicalKeyHash": "a96265b29ff27fd21e2f03849c11aa87f36fc360de0a0cda2bee6125be2f4abe",
        "rawMetrics": {
          "seededGoalSuccesses": 8,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 32,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5925925925925926,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 31,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-11e43180f758",
        "seed": "campaign-diagonal-7",
        "number": 11,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red",
            "target": true
          },
          null,
          null,
          null,
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
            "colour": "red"
          },
          null,
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
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "green"
          },
          null,
          {
            "id": 10,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "gold",
            "blue"
          ],
          [
            "blue",
            "green",
            "blue"
          ],
          [
            "green",
            "red",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 4,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 8",
          "ja": "斜めの糸 8"
        },
        "canonicalKeyHash": "11e43180f758d9ddcb743cef68475ad4f8fbda4f57707e18208bf368180c1101",
        "rawMetrics": {
          "seededGoalSuccesses": 9,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.140625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 30,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5555555555555556,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 32,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-3901460e0b35",
        "seed": "campaign-crossing-14",
        "number": 12,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            6
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          {
            "id": 3,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "red",
            "target": true
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
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "purple"
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
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "gold",
            "blue"
          ],
          [
            "green",
            "gold",
            "green"
          ],
          [
            "green",
            "gold",
            "green"
          ],
          [
            "red",
            "purple",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 15",
          "ja": "交差する線 15"
        },
        "canonicalKeyHash": "3901460e0b350b53433790f8067824ff9a709509d0cc08c1e485d14143200663",
        "rawMetrics": {
          "seededGoalSuccesses": 9,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.140625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 47,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6527777777777778,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 32,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-ad134389a9f3",
        "seed": "campaign-diagonal-17",
        "number": 13,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold",
            "target": true
          },
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          null,
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
            "colour": "purple"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          null,
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "purple",
            "blue",
            "red"
          ],
          [
            "purple",
            "green",
            "red"
          ],
          [
            "blue",
            "red",
            "green"
          ],
          [
            "gold",
            "green",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 18",
          "ja": "斜めの糸 18"
        },
        "canonicalKeyHash": "ad134389a9f3a0511de643c88442b3a093f15c4510f104b62c04aeeb8229dd03",
        "rawMetrics": {
          "seededGoalSuccesses": 9,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.140625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 32,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-1a8ffa1ac700",
        "seed": "campaign-diagonal-3",
        "number": 14,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          {
            "id": 3,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "purple"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red",
            "purple"
          ],
          [
            "blue",
            "gold",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 4,
            "orientation": 0
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Diagonal Thread 4",
          "ja": "斜めの糸 4"
        },
        "canonicalKeyHash": "1a8ffa1ac7002d47309415806d84388e77b7beb62a75c3da7ed5269f41facfed",
        "rawMetrics": {
          "seededGoalSuccesses": 7,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.109375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 15,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4166666666666667,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 33,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-67c41014516f",
        "seed": "campaign-crossing-3",
        "number": 15,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            6
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green",
            "target": true
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
            "colour": "purple"
          },
          {
            "id": 14,
            "colour": "gold"
          },
          {
            "id": 15,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "purple",
            "gold"
          ],
          [
            "gold",
            "gold",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 4",
          "ja": "交差する線 4"
        },
        "canonicalKeyHash": "67c41014516fa89839ae7583448927a275d326e0c2bf88806c62890c600dd291",
        "rawMetrics": {
          "seededGoalSuccesses": 9,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.140625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 2
        },
        "score": 33,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-fc949717a336",
        "seed": "campaign-crossing-21",
        "number": 16,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "purple",
            "target": true
          },
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "purple"
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
          }
        ],
        "queue": [
          [
            "green",
            "gold",
            "green"
          ],
          [
            "blue",
            "red",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 22",
          "ja": "交差する線 22"
        },
        "canonicalKeyHash": "fc949717a336cd6d37fd4df31f2bb737aa449dde58f70e72d6ea7db32d7f7dee",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 18,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.5,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 2
        },
        "score": 33,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-80979a22947e",
        "seed": "campaign-horizontal-9",
        "number": 17,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "gold",
            "target": true
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "blue",
            "red",
            "green"
          ],
          [
            "purple",
            "red",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Side-by-Side 10",
          "ja": "横並び 10"
        },
        "canonicalKeyHash": "80979a22947e834d7da8ce46d81652be716a0575d78943f7e25a96927c19ab0f",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 34,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-d69e3bc574a6",
        "seed": "campaign-vertical-0",
        "number": 18,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null
        ],
        "queue": [
          [
            "red",
            "purple",
            "red"
          ],
          [
            "green",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning"
        ],
        "title": {
          "en": "Vertical Steps 1",
          "ja": "縦の一歩 1"
        },
        "canonicalKeyHash": "d69e3bc574a669588d79d62666453d94e48b68f0cdf34fa52f6e6738029222f7",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 34,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-6a7714c4313c",
        "seed": "campaign-crossing-13",
        "number": 19,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            6
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
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
            "colour": "red"
          },
          null,
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green",
            "target": true
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
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "blue",
            "gold",
            "red"
          ],
          [
            "red",
            "gold",
            "purple"
          ],
          [
            "blue",
            "green",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 14",
          "ja": "交差する線 14"
        },
        "canonicalKeyHash": "6a7714c4313cd5b3a143d169f1fccaf45195fb7b33042f66fb1d9d165e54c114",
        "rawMetrics": {
          "seededGoalSuccesses": 7,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.109375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 33,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.6111111111111112,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 36,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-d532d0ca17da",
        "seed": "campaign-crossing-17",
        "number": 20,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green",
            "target": true
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          {
            "id": 7,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "purple"
          },
          {
            "id": 9,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "red",
            "gold"
          ],
          [
            "blue",
            "purple",
            "gold"
          ],
          [
            "blue",
            "red",
            "purple"
          ],
          [
            "green",
            "blue",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 18",
          "ja": "交差する線 18"
        },
        "canonicalKeyHash": "d532d0ca17dadc9cfa84278ba4738bd609a3cb745cd6d8007fd859fd7b95643c",
        "rawMetrics": {
          "seededGoalSuccesses": 7,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.109375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 48,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6666666666666666,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 36,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-b104d18245ca",
        "seed": "campaign-diagonal-10",
        "number": 21,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "purple"
          },
          {
            "id": 7,
            "colour": "purple"
          },
          null,
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "purple",
            "red",
            "gold"
          ],
          [
            "red",
            "purple",
            "gold"
          ],
          [
            "gold",
            "green",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 11",
          "ja": "斜めの糸 11"
        },
        "canonicalKeyHash": "b104d18245cabae75ebe74adcf899abe0de6ae9b10a93fdf0f2e9c2d3c02f763",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 29,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5370370370370371,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 37,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-dd9801e91108",
        "seed": "campaign-cascade-11",
        "number": 22,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "blue",
            "red"
          ],
          [
            "red",
            "green",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 12",
          "ja": "連鎖の始まり 12"
        },
        "canonicalKeyHash": "dd9801e911087549c4ecc59fc3e66afc561f365cadc85d81e17420c10d180462",
        "rawMetrics": {
          "seededGoalSuccesses": 7,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.109375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 37,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-00edb31ee427",
        "seed": "campaign-crossing-20",
        "number": 23,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red",
            "target": true
          },
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          null,
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
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "purple",
            "gold"
          ],
          [
            "purple",
            "blue",
            "green"
          ],
          [
            "purple",
            "blue",
            "gold"
          ],
          [
            "red",
            "gold",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 21",
          "ja": "交差する線 21"
        },
        "canonicalKeyHash": "00edb31ee427a927c01271b847565c4315adbc2e6f97738989dcee1b0aa21648",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 47,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6527777777777778,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 39,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-54f630c2f914",
        "seed": "campaign-diagonal-22",
        "number": 24,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 5,
            "colour": "red"
          },
          null,
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
          null,
          {
            "id": 9,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "green",
            "red"
          ],
          [
            "red",
            "blue",
            "green"
          ],
          [
            "green",
            "purple",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 4,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 23",
          "ja": "斜めの糸 23"
        },
        "canonicalKeyHash": "54f630c2f914373c781a847f3c49cf66cd88859b2cb36abd2a7a1b805aec7d34",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 32,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5925925925925926,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 39,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-86ad922b66fd",
        "seed": "campaign-vertical-2",
        "number": 25,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "green",
            "gold"
          ],
          [
            "blue",
            "purple",
            "green"
          ],
          [
            "green",
            "purple",
            "gold"
          ],
          [
            "red",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 3",
          "ja": "縦の一歩 3"
        },
        "canonicalKeyHash": "86ad922b66fdf4517f19e1b3331e4618444a34888ff94427382e589ff759c5c9",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 39,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-9e011d93bc34",
        "seed": "campaign-vertical-15",
        "number": 26,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          null,
          {
            "id": 2,
            "colour": "purple",
            "target": true
          },
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "green",
            "red"
          ],
          [
            "blue",
            "red",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning"
        ],
        "title": {
          "en": "Vertical Steps 16",
          "ja": "縦の一歩 16"
        },
        "canonicalKeyHash": "9e011d93bc34776e0084f82e6aff58415a2d2d81a51f923232c36b6bf7f110fa",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 39,
        "marks": 2,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-3405cbb65c76",
        "seed": "campaign-cascade-19",
        "number": 27,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "purple",
            "green"
          ],
          [
            "purple",
            "gold",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 20",
          "ja": "連鎖の始まり 20"
        },
        "canonicalKeyHash": "3405cbb65c769c06202071d7df47d75fecd4ad6518a674204703ac04a15a55b7",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 40,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-5cb0e0ef0c3f",
        "seed": "campaign-horizontal-40",
        "number": 28,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 3,
            "colour": "red",
            "target": true
          },
          null,
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "purple"
          },
          null
        ],
        "queue": [
          [
            "purple",
            "green",
            "blue"
          ],
          [
            "green",
            "purple",
            "blue"
          ],
          [
            "green",
            "red",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 41",
          "ja": "横並び 41"
        },
        "canonicalKeyHash": "5cb0e0ef0c3f41757025e849ffaa8b98bb4fa07c38601ad351c3a0d999dcaddd",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 40,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-7c27041e05c6",
        "seed": "campaign-cascade-2",
        "number": 29,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "red"
          },
          null,
          {
            "id": 6,
            "colour": "blue"
          },
          null,
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
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "gold",
            "blue",
            "purple"
          ],
          [
            "gold",
            "green",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 3",
          "ja": "連鎖の始まり 3"
        },
        "canonicalKeyHash": "7c27041e05c673fd10ccd0fa9e285624c35ab5928dc925ac395c975f91fcf030",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 40,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-909536d6fa94",
        "seed": "campaign-cascade-7",
        "number": 30,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
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
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "purple",
            "green"
          ],
          [
            "green",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 8",
          "ja": "連鎖の始まり 8"
        },
        "canonicalKeyHash": "909536d6fa94f8ce0432a43bcf0da52018d299f94142a96b83cad0653f116449",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 40,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-e2be0d1ebae8",
        "seed": "campaign-horizontal-34",
        "number": 31,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          {
            "id": 3,
            "colour": "green",
            "target": true
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "purple",
            "blue",
            "red"
          ],
          [
            "gold",
            "red",
            "purple"
          ],
          [
            "gold",
            "green",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 35",
          "ja": "横並び 35"
        },
        "canonicalKeyHash": "e2be0d1ebae8f2be1413e7eb3eb58208d4ab040dc9b95a488bb40e8cc00b1102",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 40,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-c5d758b1c28a",
        "seed": "campaign-diagonal-4",
        "number": 32,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 6,
            "colour": "purple"
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
            "colour": "gold"
          },
          null,
          {
            "id": 11,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "purple",
            "red",
            "green"
          ],
          [
            "red",
            "green",
            "purple"
          ],
          [
            "purple",
            "blue",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 4,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 5",
          "ja": "斜めの糸 5"
        },
        "canonicalKeyHash": "c5d758b1c28aedbd1855d81739e8b4d40c26acc7b1aee24380ffa7bd734a4903",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 32,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5925925925925926,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 41,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-e44694159555",
        "seed": "campaign-crossing-16",
        "number": 33,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue",
            "target": true
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
          null,
          null,
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
          null,
          null
        ],
        "queue": [
          [
            "purple",
            "red",
            "gold"
          ],
          [
            "green",
            "gold",
            "red"
          ],
          [
            "red",
            "blue",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 17",
          "ja": "交差する線 17"
        },
        "canonicalKeyHash": "e44694159555f9b312804f43079b7aa62554e01a993a01e28e81e90d469dc2a7",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 32,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5925925925925926,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 41,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-0cdc797177cd",
        "seed": "campaign-crossing-8",
        "number": 34,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "red",
            "target": true
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 8,
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          },
          null,
          null
        ],
        "queue": [
          [
            "green",
            "gold",
            "purple"
          ],
          [
            "blue",
            "gold",
            "green"
          ],
          [
            "gold",
            "purple",
            "green"
          ],
          [
            "red",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 9",
          "ja": "交差する線 9"
        },
        "canonicalKeyHash": "0cdc797177cdc59b721a743fe32a3f6302de8b9455847d73f544e5b76e378912",
        "rawMetrics": {
          "seededGoalSuccesses": 6,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.09375,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-2a2b773c9c38",
        "seed": "campaign-diagonal-18",
        "number": 35,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
          null
        ],
        "queue": [
          [
            "green",
            "blue",
            "red"
          ],
          [
            "gold",
            "blue",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 4,
            "orientation": 0
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Diagonal Thread 19",
          "ja": "斜めの糸 19"
        },
        "canonicalKeyHash": "2a2b773c9c382b1246ea06e5d37d1194fc092bddbd7d9e83610a7b325ead3ec4",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-8d15f4058abf",
        "seed": "campaign-diagonal-24",
        "number": 36,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
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
            "colour": "purple"
          },
          null,
          null,
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
          null,
          null,
          {
            "id": 10,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "gold",
            "blue",
            "green"
          ],
          [
            "gold",
            "red",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 25",
          "ja": "斜めの糸 25"
        },
        "canonicalKeyHash": "8d15f4058abf59493d58f240144aab70ddbd51511d71563e90bc33954738baf8",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-9014c0608f48",
        "seed": "campaign-horizontal-0",
        "number": 37,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            6
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          null,
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
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "gold",
            "target": true
          },
          null,
          {
            "id": 7,
            "colour": "gold"
          },
          {
            "id": 8,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "green",
            "red"
          ],
          [
            "green",
            "green",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Side-by-Side 1",
          "ja": "横並び 1"
        },
        "canonicalKeyHash": "9014c0608f48590c02057c78cc27de55d566938d4fcf00fea5cdeba5f754fe0b",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-d049ee9fcce9",
        "seed": "campaign-vertical-3",
        "number": 38,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple",
            "green"
          ],
          [
            "green",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning"
        ],
        "title": {
          "en": "Vertical Steps 4",
          "ja": "縦の一歩 4"
        },
        "canonicalKeyHash": "d049ee9fcce9fe78a99430b0916079a712ae14c2890759df30d3d632eddaf1ac",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 44,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-44fd8702a87c",
        "seed": "campaign-cascade-8",
        "number": 39,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          {
            "id": 10,
            "colour": "green"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "red",
            "green"
          ],
          [
            "blue",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 9",
          "ja": "連鎖の始まり 9"
        },
        "canonicalKeyHash": "44fd8702a87c02690e3496bab30458ad6c9c4540dd1e00e6945407cd94ce7e15",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-64e2a7ab2166",
        "seed": "campaign-diagonal-11",
        "number": 40,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "purple"
          },
          {
            "id": 7,
            "colour": "purple"
          },
          null,
          {
            "id": 8,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "green",
            "gold",
            "purple"
          ],
          [
            "purple",
            "red",
            "green"
          ],
          [
            "purple",
            "red",
            "green"
          ],
          [
            "blue",
            "green",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 4,
            "orientation": 2
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 12",
          "ja": "斜めの糸 12"
        },
        "canonicalKeyHash": "64e2a7ab2166d68ff71423ee1e739d12b950ef65333e4f8ca598fa19cac880f0",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 45,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.625,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-8922ec4fbc28",
        "seed": "campaign-diagonal-0",
        "number": 41,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green",
            "target": true
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null,
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          null,
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "purple",
            "red",
            "purple"
          ],
          [
            "gold",
            "blue",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 1",
          "ja": "斜めの糸 1"
        },
        "canonicalKeyHash": "8922ec4fbc28eaeda4eb06d58ddfcb746d11f703f8191b7448790bab3454bfa2",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-9f83c130c917",
        "seed": "campaign-cascade-13",
        "number": 42,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          {
            "id": 3,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
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
          null
        ],
        "queue": [
          [
            "green",
            "purple",
            "gold"
          ],
          [
            "purple",
            "blue",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 14",
          "ja": "連鎖の始まり 14"
        },
        "canonicalKeyHash": "9f83c130c917a0d25cdde44da5cf29efb67bc34e2c9fdb6c07184bce2fe8c5de",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-a20a645855e0",
        "seed": "campaign-cascade-12",
        "number": 43,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null
        ],
        "queue": [
          [
            "red",
            "blue",
            "green"
          ],
          [
            "blue",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 13",
          "ja": "連鎖の始まり 13"
        },
        "canonicalKeyHash": "a20a645855e01c6d973879c5dac357b83fe045ee67a54f32212c5966330f0b03",
        "rawMetrics": {
          "seededGoalSuccesses": 5,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.078125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 45,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-f4adb6ed9149",
        "seed": "campaign-diagonal-1",
        "number": 44,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "gold",
            "target": true
          },
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
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
            "colour": "purple"
          },
          {
            "id": 9,
            "colour": "red"
          },
          null,
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "purple",
            "blue",
            "red"
          ],
          [
            "blue",
            "purple",
            "green"
          ],
          [
            "purple",
            "gold",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 2",
          "ja": "斜めの糸 2"
        },
        "canonicalKeyHash": "f4adb6ed9149f002da55e2574fd292fcc0d0cac7ad4180df088a078a7eac56b2",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 46,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-df6793c819e4",
        "seed": "campaign-diagonal-25",
        "number": 45,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          null,
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
          null,
          {
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "green",
            "blue",
            "gold"
          ],
          [
            "green",
            "gold",
            "blue"
          ],
          [
            "gold",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 4,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 26",
          "ja": "斜めの糸 26"
        },
        "canonicalKeyHash": "df6793c819e4467684d3726022ab0ef97d36490663af21c464045a4f334904e2",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 47,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-61a8a4e8498c",
        "seed": "campaign-crossing-10",
        "number": 46,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            7
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          null,
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
            "colour": "purple"
          },
          {
            "id": 7,
            "colour": "blue",
            "target": true
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
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
            "colour": "purple"
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
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "green",
            "purple",
            "red"
          ],
          [
            "gold",
            "red",
            "purple"
          ],
          [
            "green",
            "blue",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 11",
          "ja": "交差する線 11"
        },
        "canonicalKeyHash": "61a8a4e8498cf1ee2ae0517ad7167488a4a29e58f7be3fc6597927dff0036476",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 32,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5925925925925926,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 49,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-efc8b1834cc4",
        "seed": "campaign-diagonal-20",
        "number": 47,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          null,
          null,
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
          null,
          null,
          {
            "id": 7,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "red",
            "blue",
            "gold"
          ],
          [
            "red",
            "green",
            "blue"
          ],
          [
            "gold",
            "red",
            "green"
          ],
          [
            "purple",
            "blue",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Diagonal Thread 21",
          "ja": "斜めの糸 21"
        },
        "canonicalKeyHash": "efc8b1834cc496fda0e652065f11b6c6089c27337fa28f65fe9ea8aaacc86177",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 49,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-6410dbd1d9a6",
        "seed": "campaign-cascade-26",
        "number": 48,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          null,
          null,
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
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "green"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red",
            "gold"
          ],
          [
            "blue",
            "green",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 27",
          "ja": "連鎖の始まり 27"
        },
        "canonicalKeyHash": "6410dbd1d9a685287562434e30235e2453ea091923831a9ba96cd1053cfd5940",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 50,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-9cf06fc7790f",
        "seed": "campaign-cascade-4",
        "number": 49,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
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
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "red",
            "green"
          ],
          [
            "green",
            "blue",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 5",
          "ja": "連鎖の始まり 5"
        },
        "canonicalKeyHash": "9cf06fc7790f82eefd32368947aa5a28dbb41fdcdaf7a6b8a928d555c0de1123",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 50,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-92b874f3b675",
        "seed": "campaign-vertical-6",
        "number": 50,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green",
            "target": true
          },
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "red"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red",
            "purple"
          ],
          [
            "blue",
            "blue",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning"
        ],
        "title": {
          "en": "Vertical Steps 7",
          "ja": "縦の一歩 7"
        },
        "canonicalKeyHash": "92b874f3b67523e46188de7cb569d945e5dbe6e2965bc64505244b7d44f99eca",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 51,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-9fe25a73a374",
        "seed": "campaign-horizontal-39",
        "number": 51,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue",
            "target": true
          },
          null,
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
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "gold",
            "green"
          ],
          [
            "gold",
            "green",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Side-by-Side 40",
          "ja": "横並び 40"
        },
        "canonicalKeyHash": "9fe25a73a374e1d69259b79697a6fd0e8c09ddd41055e5e509e5bade7a6e53d9",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 51,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-c58fc5f26a9d",
        "seed": "campaign-horizontal-42",
        "number": 52,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red",
            "blue"
          ],
          [
            "blue",
            "blue",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Side-by-Side 43",
          "ja": "横並び 43"
        },
        "canonicalKeyHash": "c58fc5f26a9ddd1f230d185c2e05128dba8e422e0445cd29821b0c1f0d73a868",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 51,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-599ec75c4b47",
        "seed": "campaign-crossing-19",
        "number": 53,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            7
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "red"
          },
          null,
          null,
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
            "colour": "red",
            "target": true
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "purple",
            "gold",
            "blue"
          ],
          [
            "gold",
            "green",
            "purple"
          ],
          [
            "gold",
            "red",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 20",
          "ja": "交差する線 20"
        },
        "canonicalKeyHash": "599ec75c4b478806a426de50788b3b70ef8339171a8e3ead681b38077f673017",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 52,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-8fabd27a22f8",
        "seed": "campaign-vertical-4",
        "number": 54,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "green",
            "blue",
            "red"
          ],
          [
            "green",
            "red",
            "gold"
          ],
          [
            "gold",
            "purple",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 5",
          "ja": "縦の一歩 5"
        },
        "canonicalKeyHash": "8fabd27a22f898a5268ddb562b3a38e8d3c3e1af24791d5ad2dc98038660ad73",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 52,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-90c81b48de5f",
        "seed": "campaign-horizontal-1",
        "number": 55,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          {
            "id": 2,
            "colour": "green",
            "target": true
          },
          null,
          {
            "id": 3,
            "colour": "green"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "red",
            "blue"
          ],
          [
            "blue",
            "purple",
            "red"
          ],
          [
            "red",
            "green",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 2",
          "ja": "横並び 2"
        },
        "canonicalKeyHash": "90c81b48de5fd57dfdc3b95179323cf083f8bacd255f21f0a57361d28dbeb1a3",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 52,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-b4681ec30fa2",
        "seed": "campaign-vertical-19",
        "number": 56,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red",
            "target": true
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          null,
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
            "colour": "blue"
          },
          {
            "id": 8,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "green",
            "blue",
            "gold"
          ],
          [
            "purple",
            "green",
            "blue"
          ],
          [
            "blue",
            "red",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Vertical Steps 20",
          "ja": "縦の一歩 20"
        },
        "canonicalKeyHash": "b4681ec30fa28c8e7386cff6fc4e050de646797ec495fc83b087113774e079ab",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 52,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-1f339c8fdae3",
        "seed": "campaign-horizontal-35",
        "number": 57,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          {
            "id": 3,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "green",
            "red"
          ],
          [
            "gold",
            "purple",
            "gold"
          ],
          [
            "gold",
            "purple",
            "gold"
          ],
          [
            "blue",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 36",
          "ja": "横並び 36"
        },
        "canonicalKeyHash": "1f339c8fdae3a77ed67abff0e1af48a00fc44a0458c2e151dab6931dd4d615cd",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 56,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-856a50861dd3",
        "seed": "campaign-vertical-5",
        "number": 58,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "gold",
            "purple"
          ],
          [
            "red",
            "blue",
            "purple"
          ],
          [
            "gold",
            "blue",
            "red"
          ],
          [
            "green",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 6",
          "ja": "縦の一歩 6"
        },
        "canonicalKeyHash": "856a50861dd3bca70acb4098a5f43a36ea71c2fd44764b4c75fe17f7e812dafa",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 56,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-9a92215ae742",
        "seed": "campaign-crossing-1",
        "number": 59,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold",
            "target": true
          },
          {
            "id": 5,
            "colour": "purple"
          },
          null,
          null,
          null,
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "green",
            "purple",
            "red"
          ],
          [
            "purple",
            "blue",
            "red"
          ],
          [
            "purple",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 2",
          "ja": "交差する線 2"
        },
        "canonicalKeyHash": "9a92215ae74243aab3fe8c569d98eb72ad2e16319a0e21c6106756c10e5d4b98",
        "rawMetrics": {
          "seededGoalSuccesses": 4,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.0625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 2
        },
        "score": 56,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-a5c1f85ba052",
        "seed": "campaign-horizontal-14",
        "number": 60,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          {
            "id": 3,
            "colour": "gold",
            "target": true
          },
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "red",
            "purple",
            "red"
          ],
          [
            "red",
            "purple",
            "red"
          ],
          [
            "green",
            "red",
            "green"
          ],
          [
            "gold",
            "purple",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 15",
          "ja": "横並び 15"
        },
        "canonicalKeyHash": "a5c1f85ba052efe83c7de01628dd85cf7035973b3c280239c0de56926764d310",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 56,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-a8d73b822fe5",
        "seed": "campaign-vertical-8",
        "number": 61,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 2,
            "colour": "red",
            "target": true
          },
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "red"
          },
          null,
          {
            "id": 7,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "green",
            "gold",
            "blue"
          ],
          [
            "gold",
            "green",
            "purple"
          ],
          [
            "blue",
            "gold",
            "purple"
          ],
          [
            "red",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 9",
          "ja": "縦の一歩 9"
        },
        "canonicalKeyHash": "a8d73b822fe554eba536a3877108d19bd57fa5471a0966370c2f823ed4f1a1d5",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 56,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-27ed2a69e285",
        "seed": "campaign-cascade-15",
        "number": 62,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "red"
          },
          null,
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
            "colour": "green"
          },
          {
            "id": 10,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "purple",
            "red"
          ],
          [
            "purple",
            "green",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 16",
          "ja": "連鎖の始まり 16"
        },
        "canonicalKeyHash": "27ed2a69e28577610c342e806b02462984ce95eb8caeabd8ad1f8cf96562d6c8",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-97ef0026ba1d",
        "seed": "campaign-cascade-27",
        "number": 63,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
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
            "colour": "green"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "purple",
            "red"
          ],
          [
            "red",
            "green",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 28",
          "ja": "連鎖の始まり 28"
        },
        "canonicalKeyHash": "97ef0026ba1dbb0c10d7d52f439be8328acca9d65caf6491c740775759ae2347",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-d59ce325f0c6",
        "seed": "campaign-cascade-9",
        "number": 64,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          null,
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
          null
        ],
        "queue": [
          [
            "gold",
            "purple",
            "red"
          ],
          [
            "purple",
            "blue",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 10",
          "ja": "連鎖の始まり 10"
        },
        "canonicalKeyHash": "d59ce325f0c6b1661f9305b37f68a9d4ab126d5f3ebd9b1eae8c5943d75d39bc",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-d7fabb9571c0",
        "seed": "campaign-cascade-10",
        "number": 65,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
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
            "colour": "red"
          },
          null,
          null
        ],
        "queue": [
          [
            "purple",
            "green",
            "gold"
          ],
          [
            "gold",
            "red",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 11",
          "ja": "連鎖の始まり 11"
        },
        "canonicalKeyHash": "d7fabb9571c0d496b51c2ae9045b43a82123eca7e0fcb5b6bf27edf1fe6a2aaa",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-fb57c9f349a5",
        "seed": "campaign-cascade-17",
        "number": 66,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "purple"
          },
          null,
          null
        ],
        "queue": [
          [
            "green",
            "blue",
            "red"
          ],
          [
            "red",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 18",
          "ja": "連鎖の始まり 18"
        },
        "canonicalKeyHash": "fb57c9f349a5756c1ca58dec3ad214a98fac88d8eb807bde0b47c394a481cf60",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 57,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-73a1247e33db",
        "seed": "campaign-horizontal-21",
        "number": 67,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
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
            "colour": "purple",
            "target": true
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "gold",
            "blue",
            "gold"
          ],
          [
            "green",
            "gold",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Side-by-Side 22",
          "ja": "横並び 22"
        },
        "canonicalKeyHash": "73a1247e33db104e2e42750697db9cf8656369eff8ea367a58894fcdda695388",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 58,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-8f5bb9064ee8",
        "seed": "campaign-horizontal-28",
        "number": 68,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          {
            "id": 2,
            "colour": "red",
            "target": true
          },
          null,
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "purple",
            "gold"
          ],
          [
            "purple",
            "green",
            "purple"
          ],
          [
            "blue",
            "red",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 29",
          "ja": "横並び 29"
        },
        "canonicalKeyHash": "8f5bb9064ee80960e36293a9d93fccd968ddfde4423b965edd3249b25d676b6e",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 59,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-b4f97af43d8c",
        "seed": "campaign-diagonal-19",
        "number": 69,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "red",
            "target": true
          },
          null,
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          null,
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
            "colour": "red"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 8,
            "colour": "purple"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "purple"
          },
          null,
          {
            "id": 11,
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "gold",
            "green",
            "purple"
          ],
          [
            "gold",
            "blue",
            "green"
          ],
          [
            "green",
            "red",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 20",
          "ja": "斜めの糸 20"
        },
        "canonicalKeyHash": "b4f97af43d8cd829350a3a40344963aa98c24b04268ff9f196a5e0db70814646",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 59,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-bd8416e33275",
        "seed": "campaign-vertical-7",
        "number": 70,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold",
            "target": true
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "purple",
            "blue"
          ],
          [
            "blue",
            "red",
            "blue"
          ],
          [
            "red",
            "gold",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 8",
          "ja": "縦の一歩 8"
        },
        "canonicalKeyHash": "bd8416e33275ef458287e83225e698de5a0fc765f488e1d0fd5629a41c1f11c6",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 59,
        "marks": 3,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-fea0e59c5570",
        "seed": "campaign-diagonal-23",
        "number": 71,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "red",
            "purple",
            "gold"
          ],
          [
            "green",
            "gold",
            "red"
          ],
          [
            "purple",
            "red",
            "gold"
          ],
          [
            "blue",
            "purple",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Diagonal Thread 24",
          "ja": "斜めの糸 24"
        },
        "canonicalKeyHash": "fea0e59c5570a13f124bf1fcabca32dfc2982ae02acb0e872d901404ad8f8f6f",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 61,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-5f0ea97d57ed",
        "seed": "campaign-diagonal-8",
        "number": 72,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          null,
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
            "colour": "red"
          },
          null,
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "gold",
            "blue"
          ],
          [
            "blue",
            "red",
            "gold"
          ],
          [
            "gold",
            "purple",
            "red"
          ],
          [
            "green",
            "red",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 9",
          "ja": "斜めの糸 9"
        },
        "canonicalKeyHash": "5f0ea97d57edec8b43629b5df666fc92c19033c03b046fe4d008172b4155ad44",
        "rawMetrics": {
          "seededGoalSuccesses": 3,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.046875,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 45,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.625,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 3,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 62,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-6a6c5de17bba",
        "seed": "campaign-horizontal-20",
        "number": 73,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            5
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "gold",
            "target": true
          },
          null,
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
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "purple",
            "red"
          ],
          [
            "purple",
            "red",
            "green"
          ],
          [
            "purple",
            "red",
            "blue"
          ],
          [
            "gold",
            "green",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Side-by-Side 21",
          "ja": "横並び 21"
        },
        "canonicalKeyHash": "6a6c5de17bbaefad39b1f6cd79f7e6707562f3c9ea29b6bf8e78baeb751a223c",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 63,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-884ae3b3bb4e",
        "seed": "campaign-crossing-2",
        "number": 74,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold",
            "target": true
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
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
            "colour": "purple"
          },
          null
        ],
        "queue": [
          [
            "green",
            "blue",
            "purple"
          ],
          [
            "blue",
            "purple",
            "red"
          ],
          [
            "green",
            "purple",
            "blue"
          ],
          [
            "gold",
            "blue",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 3",
          "ja": "交差する線 3"
        },
        "canonicalKeyHash": "884ae3b3bb4e0060de82d7d07ba7ecd8897f4e4df06ed8349365d410dd03f819",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 47,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6527777777777778,
          "forcedChoiceShare": 0,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 63,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-fed624bf2822",
        "seed": "campaign-horizontal-29",
        "number": 75,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold",
            "target": true
          },
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          {
            "id": 3,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "red",
            "green"
          ],
          [
            "blue",
            "green",
            "purple"
          ],
          [
            "purple",
            "red",
            "blue"
          ],
          [
            "gold",
            "blue",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 30",
          "ja": "横並び 30"
        },
        "canonicalKeyHash": "fed624bf2822ddc560d447eaee5dea625e78bcdef231a462e988a5ecbdb461e9",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 63,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-026ff24422f9",
        "seed": "campaign-cascade-1",
        "number": 76,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 6,
            "colour": "purple"
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
            "colour": "blue"
          },
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "purple",
            "green"
          ],
          [
            "purple",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 2",
          "ja": "連鎖の始まり 2"
        },
        "canonicalKeyHash": "026ff24422f9ea20718cedf6aa6f3d63407ee6a06e45dab0087afbadb52ff4e4",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-0a8332ba4fc4",
        "seed": "campaign-horizontal-24",
        "number": 77,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red",
            "target": true
          },
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null
        ],
        "queue": [
          [
            "purple",
            "blue",
            "gold"
          ],
          [
            "gold",
            "purple",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning"
        ],
        "title": {
          "en": "Side-by-Side 25",
          "ja": "横並び 25"
        },
        "canonicalKeyHash": "0a8332ba4fc43477c7cd80fc208917258668433cf70919d7d50e67225056404b",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-8cb24c4aef6a",
        "seed": "campaign-vertical-21",
        "number": 78,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null
        ],
        "queue": [
          [
            "red",
            "blue",
            "red"
          ],
          [
            "blue",
            "green",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning"
        ],
        "title": {
          "en": "Vertical Steps 22",
          "ja": "縦の一歩 22"
        },
        "canonicalKeyHash": "8cb24c4aef6a8cf6641b1e6893660a8b13cc23933c0c844c63bb1062024eb88e",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-9165c46e5800",
        "seed": "campaign-vertical-12",
        "number": 79,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red",
            "green"
          ],
          [
            "blue",
            "green",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning"
        ],
        "title": {
          "en": "Vertical Steps 13",
          "ja": "縦の一歩 13"
        },
        "canonicalKeyHash": "9165c46e58004d169197ce59e58f79401c27ddacf748389cc9ef9ef922d36b8e",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-f1ac5edddd68",
        "seed": "campaign-cascade-22",
        "number": 80,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 6,
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
            "colour": "gold"
          },
          {
            "id": 10,
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "purple",
            "blue",
            "green"
          ],
          [
            "blue",
            "red",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 23",
          "ja": "連鎖の始まり 23"
        },
        "canonicalKeyHash": "f1ac5edddd6888ac5efa37b8e913fb07621ccf21925c88c65c2f38ef7faf1d59",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-fc85a8243d6a",
        "seed": "campaign-cascade-20",
        "number": 81,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          {
            "id": 4,
            "colour": "red"
          },
          null,
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
            "colour": "purple"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "red",
            "green"
          ],
          [
            "red",
            "gold",
            "purple"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 21",
          "ja": "連鎖の始まり 21"
        },
        "canonicalKeyHash": "fc85a8243d6a31392238cb26640653944f799bb2e0caa48cc0c4884f497d8626",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 64,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-bc7a8d6afc92",
        "seed": "campaign-vertical-1",
        "number": 82,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          null,
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
            "colour": "purple"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "purple",
            "red"
          ],
          [
            "green",
            "purple",
            "gold"
          ],
          [
            "purple",
            "blue",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 2",
          "ja": "縦の一歩 2"
        },
        "canonicalKeyHash": "bc7a8d6afc928e611924fff3b8aabe433ac8df018e0ff0aab6f7cac8e7f6a74d",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 65,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-cb0d9eb208e0",
        "seed": "campaign-vertical-16",
        "number": 83,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "purple"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "blue",
            "red"
          ],
          [
            "green",
            "red",
            "gold"
          ],
          [
            "red",
            "purple",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 17",
          "ja": "縦の一歩 17"
        },
        "canonicalKeyHash": "cb0d9eb208e04f30b463523f55f6ef99563bff471ab3daf213c10cf331adbce9",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 65,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-fc19a5175bab",
        "seed": "campaign-horizontal-25",
        "number": 84,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
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
            "colour": "purple",
            "target": true
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "green",
            "gold",
            "blue"
          ],
          [
            "gold",
            "blue",
            "green"
          ],
          [
            "blue",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 26",
          "ja": "横並び 26"
        },
        "canonicalKeyHash": "fc19a5175bab757dd9c0fcb35aaaa446e54cd975a5718dfd5cd2cb9949a24110",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 65,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-ff75515b67b7",
        "seed": "campaign-diagonal-16",
        "number": 85,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
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
            "colour": "purple"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
          null,
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
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "green",
            "red"
          ],
          [
            "green",
            "red",
            "gold"
          ],
          [
            "gold",
            "purple",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 17",
          "ja": "斜めの糸 17"
        },
        "canonicalKeyHash": "ff75515b67b796d726cae9273a91e1fec15afccd9fd0442d14a8439e5913d9b7",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 66,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-6727394819dd",
        "seed": "campaign-crossing-11",
        "number": 86,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            7
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          null,
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
            "colour": "purple",
            "target": true
          },
          {
            "id": 8,
            "colour": "green"
          },
          null,
          null,
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
            "colour": "purple"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "green",
            "red",
            "gold"
          ],
          [
            "blue",
            "red",
            "green"
          ],
          [
            "blue",
            "green",
            "red"
          ],
          [
            "purple",
            "green",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "crossing-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Crossing Lines 12",
          "ja": "交差する線 12"
        },
        "canonicalKeyHash": "6727394819dda15c5b2fb7a7fe260cc7846ffcfad928e3ab9cc3d63fd56df6c5",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 67,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-e8738200b3ba",
        "seed": "campaign-diagonal-26",
        "number": 87,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
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
            "colour": "purple"
          },
          null,
          {
            "id": 8,
            "colour": "green"
          },
          null,
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
          null,
          {
            "id": 12,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "gold",
            "red",
            "green"
          ],
          [
            "green",
            "red",
            "blue"
          ],
          [
            "gold",
            "blue",
            "red"
          ],
          [
            "purple",
            "blue",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 4,
            "orientation": 2
          }
        ],
        "tags": [
          "diagonal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Diagonal Thread 27",
          "ja": "斜めの糸 27"
        },
        "canonicalKeyHash": "e8738200b3baee96de94b94f510f23cbc3f714eabedf25c234058c5b18489b1d",
        "rawMetrics": {
          "seededGoalSuccesses": 2,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.03125,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 2
        },
        "score": 67,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-256a97e11dac",
        "seed": "campaign-vertical-18",
        "number": 88,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "red",
            "gold",
            "green"
          ],
          [
            "green",
            "purple",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning"
        ],
        "title": {
          "en": "Vertical Steps 19",
          "ja": "縦の一歩 19"
        },
        "canonicalKeyHash": "256a97e11dac9ae2237d39650b8a0a0201eadf4e08d0e13e6ca478ce9438321f",
        "rawMetrics": {
          "seededGoalSuccesses": 0,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 68,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-0ab9d65a061e",
        "seed": "campaign-horizontal-19",
        "number": 89,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            4
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          {
            "id": 4,
            "colour": "purple",
            "target": true
          },
          null,
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue",
            "green"
          ],
          [
            "green",
            "red",
            "blue"
          ],
          [
            "blue",
            "purple",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 20",
          "ja": "横並び 20"
        },
        "canonicalKeyHash": "0ab9d65a061e5ca03d024ed88f47485342d8d816b0cb5bbb9d3724b3ea1d4f09",
        "rawMetrics": {
          "seededGoalSuccesses": 0,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 69,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-525ccdf94a3f",
        "seed": "campaign-horizontal-37",
        "number": 90,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 2,
            "colour": "green",
            "target": true
          },
          null,
          {
            "id": 3,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "red",
            "purple"
          ],
          [
            "purple",
            "red",
            "gold"
          ],
          [
            "red",
            "green",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 3,
            "orientation": 1
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 38",
          "ja": "横並び 38"
        },
        "canonicalKeyHash": "525ccdf94a3ff65eee74e6dcb45a9c623bbf2ec11bdd30247e1100ce984aa9c6",
        "rawMetrics": {
          "seededGoalSuccesses": 0,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 69,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-6376b58e9f2c",
        "seed": "campaign-vertical-17",
        "number": 91,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 3,
            "colour": "gold",
            "target": true
          },
          null,
          null,
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
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red",
            "purple"
          ],
          [
            "purple",
            "red",
            "green"
          ],
          [
            "blue",
            "purple",
            "green"
          ],
          [
            "gold",
            "purple",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 18",
          "ja": "縦の一歩 18"
        },
        "canonicalKeyHash": "6376b58e9f2c6ba93217b21ebded83403a1b0ed73cdfe1f469f86864f0cdff1b",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 69,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-7b32c9c3978c",
        "seed": "campaign-vertical-20",
        "number": 92,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple"
          },
          {
            "id": 2,
            "colour": "blue",
            "target": true
          },
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "purple"
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
          null,
          null
        ],
        "queue": [
          [
            "green",
            "gold",
            "red"
          ],
          [
            "gold",
            "red",
            "purple"
          ],
          [
            "green",
            "red",
            "purple"
          ],
          [
            "blue",
            "green",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 21",
          "ja": "縦の一歩 21"
        },
        "canonicalKeyHash": "7b32c9c3978c10db3d0cc912b1f6c70924198a1014aaf2245966bb9395c61750",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 69,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-932da8d05552",
        "seed": "campaign-vertical-11",
        "number": 93,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "green",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "purple",
            "gold",
            "blue"
          ],
          [
            "blue",
            "red",
            "purple"
          ],
          [
            "red",
            "gold",
            "blue"
          ],
          [
            "green",
            "purple",
            "gold"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 12",
          "ja": "縦の一歩 12"
        },
        "canonicalKeyHash": "932da8d05552499b71c1d7a989b790b4e22c4c54cdb74c3b23ca9a5b02176643",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 69,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-84633bc27d00",
        "seed": "campaign-cascade-14",
        "number": 94,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          {
            "id": 3,
            "colour": "purple"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "green",
            "red",
            "gold"
          ],
          [
            "red",
            "purple",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 15",
          "ja": "連鎖の始まり 15"
        },
        "canonicalKeyHash": "84633bc27d001a4d0e58f9e11a9cb418fbc7271a51b818ba1d6b8175b11a5781",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 70,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-71c7753e6b7b",
        "seed": "campaign-vertical-13",
        "number": 95,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "purple",
            "target": true
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
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
          {
            "id": 6,
            "colour": "purple"
          },
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
            "colour": "red"
          }
        ],
        "queue": [
          [
            "red",
            "green",
            "gold"
          ],
          [
            "blue",
            "red",
            "gold"
          ],
          [
            "blue",
            "purple",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence",
          "space-management"
        ],
        "title": {
          "en": "Vertical Steps 14",
          "ja": "縦の一歩 14"
        },
        "canonicalKeyHash": "71c7753e6b7b14a14d78545a3d861062a8f02158ca5780aac1a794acfd584f48",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 72,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-bbaa7e4b9c46",
        "seed": "campaign-vertical-10",
        "number": 96,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            2
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "purple",
            "target": true
          },
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "red",
            "gold",
            "green"
          ],
          [
            "gold",
            "green",
            "red"
          ],
          [
            "gold",
            "purple",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 1
          },
          {
            "x": 5,
            "orientation": 1
          },
          {
            "x": 2,
            "orientation": 1
          }
        ],
        "tags": [
          "vertical-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Vertical Steps 11",
          "ja": "縦の一歩 11"
        },
        "canonicalKeyHash": "bbaa7e4b9c46a0d869997fcf061bc2761fe0b863a257b47c012c1cda53f91164",
        "rawMetrics": {
          "seededGoalSuccesses": 1,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0.015625,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 31,
          "probedChoices": 54,
          "goalPreservingChoiceShare": 0.5740740740740741,
          "forcedChoiceShare": 0.3333333333333333,
          "setupPiecesBeforePayoff": 2,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 3,
          "payoffDirections": 1
        },
        "score": 72,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-2b58a1831548",
        "seed": "campaign-horizontal-41",
        "number": 97,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          null,
          {
            "id": 3,
            "colour": "red",
            "target": true
          },
          null,
          {
            "id": 4,
            "colour": "red"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "gold",
            "green",
            "purple"
          ],
          [
            "gold",
            "blue",
            "green"
          ],
          [
            "green",
            "blue",
            "gold"
          ],
          [
            "red",
            "gold",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 2,
            "orientation": 2
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 42",
          "ja": "横並び 42"
        },
        "canonicalKeyHash": "2b58a1831548527737b0942872994708b32bcb19724b8b5c65d1da613e0a88a2",
        "rawMetrics": {
          "seededGoalSuccesses": 0,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 73,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-381513e5ec3b",
        "seed": "campaign-horizontal-26",
        "number": 98,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "targets",
          "targetIds": [
            3
          ]
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 3,
            "colour": "green",
            "target": true
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "gold",
            "blue"
          ],
          [
            "purple",
            "red",
            "blue"
          ],
          [
            "red",
            "purple",
            "blue"
          ],
          [
            "green",
            "red",
            "blue"
          ]
        ],
        "witness": [
          {
            "x": 0,
            "orientation": 2
          },
          {
            "x": 5,
            "orientation": 2
          },
          {
            "x": 1,
            "orientation": 2
          },
          {
            "x": 3,
            "orientation": 2
          }
        ],
        "tags": [
          "horizontal-clear",
          "target-planning",
          "cycle-required",
          "setup-sequence"
        ],
        "title": {
          "en": "Side-by-Side 27",
          "ja": "横並び 27"
        },
        "canonicalKeyHash": "381513e5ec3b9eb3425fe7b49efcb8677790d14daa17c444b18a4399223fdbd3",
        "rawMetrics": {
          "seededGoalSuccesses": 0,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 46,
          "probedChoices": 72,
          "goalPreservingChoiceShare": 0.6388888888888888,
          "forcedChoiceShare": 0.25,
          "setupPiecesBeforePayoff": 3,
          "requiredChainDepth": 1,
          "witnessPlanningLength": 4,
          "payoffDirections": 1
        },
        "score": 73,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-3f6ea588a1fc",
        "seed": "campaign-cascade-24",
        "number": 99,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "purple"
          },
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "green",
            "gold"
          ],
          [
            "blue",
            "purple",
            "red"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain"
        ],
        "title": {
          "en": "Cascade Starter 25",
          "ja": "連鎖の始まり 25"
        },
        "canonicalKeyHash": "3f6ea588a1fc4be33edc2261e107ab7c7f00085573b92756e0a4aba531531e3d",
        "rawMetrics": {
          "seededGoalSuccesses": 0,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 74,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "ft-e13073da67bd",
        "seed": "campaign-cascade-5",
        "number": 100,
        "width": 6,
        "height": 13,
        "colourCount": 5,
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          {
            "id": 2,
            "colour": "gold"
          },
          null,
          {
            "id": 3,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
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
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          },
          null
        ],
        "queue": [
          [
            "purple",
            "gold",
            "blue"
          ],
          [
            "purple",
            "red",
            "green"
          ]
        ],
        "witness": [
          {
            "x": 5,
            "orientation": 0
          },
          {
            "x": 2,
            "orientation": 0
          }
        ],
        "tags": [
          "two-wave-chain",
          "target-planning",
          "2-wave-chain",
          "space-management"
        ],
        "title": {
          "en": "Cascade Starter 6",
          "ja": "連鎖の始まり 6"
        },
        "canonicalKeyHash": "e13073da67bde633a0afe32faad90a5572747e96d5ba8146c252b91aa278ce91",
        "rawMetrics": {
          "seededGoalSuccesses": 0,
          "seededGoalSamples": 64,
          "seededGoalSuccessRate": 0,
          "legalChoiceBreadth": 18,
          "goalPreservingChoices": 16,
          "probedChoices": 36,
          "goalPreservingChoiceShare": 0.4444444444444444,
          "forcedChoiceShare": 0.5,
          "setupPiecesBeforePayoff": 1,
          "requiredChainDepth": 2,
          "witnessPlanningLength": 2,
          "payoffDirections": 1
        },
        "score": 74,
        "marks": 4,
        "gradingVersion": "triplets-choice-grade-2",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      }
    ]
  },
  "tutorials": [
    {
      "id": "lesson-cycle-and-land",
      "title": {
        "en": "Cycle and Land",
        "ja": "回して着地"
      },
      "objective": {
        "en": "Place the red gem above the marked pair.",
        "ja": "赤いジェムを印の上に置きます。"
      },
      "setup": {
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "red",
            "blue",
            "green"
          ],
          [
            "gold",
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "x": 2,
            "orientation": 2
          }
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Cycle forward to move red to the bottom.",
            "ja": "前へ回して赤を一番下にします。"
          },
          "action": "cycle-forward"
        },
        {
          "instruction": {
            "en": "Cycle once more, then place the triplet over the target column.",
            "ja": "もう一度回して、印の列に置きます。"
          },
          "action": "cycle-forward"
        }
      ],
      "tags": [
        "cycling",
        "vertical-clear"
      ]
    },
    {
      "id": "lesson-diagonal-clear",
      "title": {
        "en": "Diagonal Thread",
        "ja": "斜めの糸"
      },
      "objective": {
        "en": "Complete the rising diagonal through the marked gem.",
        "ja": "印のジェムを通る斜めの列を完成させます。"
      },
      "setup": {
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red",
            "target": true
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "purple"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "gold",
            "red"
          ],
          [
            "green",
            "purple",
            "gold"
          ]
        ],
        "goal": {
          "type": "targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "x": 3,
            "orientation": 0
          }
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Keep the red gem at the bottom and land in the open right column.",
            "ja": "赤を一番下にして、右の空いた列に着地します。"
          },
          "action": "hard-drop"
        }
      ],
      "tags": [
        "diagonal-clear",
        "target-planning"
      ]
    },
    {
      "id": "lesson-two-wave-cascade",
      "title": {
        "en": "Two-Wave Cascade",
        "ja": "二段の連鎖"
      },
      "objective": {
        "en": "Set up a clear, then trigger two waves with one placement.",
        "ja": "準備をして、一回の着地で二段の消去を起こします。"
      },
      "setup": {
        "board": [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "gold"
          },
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
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
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "red",
            "gold",
            "purple"
          ],
          [
            "gold",
            "blue",
            "green"
          ]
        ],
        "goal": {
          "type": "chain",
          "minimumChain": 2
        },
        "witness": [
          {
            "x": 0,
            "orientation": 0
          },
          {
            "x": 3,
            "orientation": 0
          }
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Place the first triplet in the open side column without making a match.",
            "ja": "最初のトリプレットを端の空いた列に置き、マッチを作らないようにします。"
          },
          "action": "hard-drop"
        },
        {
          "instruction": {
            "en": "Place the matching-colour gem at the bottom above its pair to start the first wave.",
            "ja": "同じ色のジェムが一番下になるように回し、ペアの上に置いて最初の波を始めます。"
          },
          "action": "hard-drop"
        },
        {
          "instruction": {
            "en": "Watch gravity reveal the second wave.",
            "ja": "重力で二段目が現れるのを見ます。"
          },
          "action": "wait"
        }
      ],
      "tags": [
        "two-wave-chain",
        "gravity"
      ]
    }
  ]
} as const;
