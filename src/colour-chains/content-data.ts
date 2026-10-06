import type { ChainContentData } from './content-types.js';

export const contentData: ChainContentData = {
  "campaign": {
    "count": 50,
    "candidatePoolCount": 64,
    "generationRevision": "colour-chains-campaign-1.3.1",
    "gradingVersion": "chains-placement-forgiveness-1",
    "category": "linear",
    "curationPolicy": "Select fifty canonically unique stable boards with 20 one-placement links, 10 two-wave chains, 10 split landings and 10 coupled multi-pair plans; validate required setup placements by perturbing each setup step and retaining only dependencies that break the finish path.",
    "orderingPolicy": "Sort by stored player-facing placement-forgiveness score ascending, then stable content ID; number only after ordering.",
    "grading": {
      "formula": "35*(1-seededPlayoutSuccessRate)+10*forcedPlacementShare+10*min(1,(requiredChainDepth-1)/2)+10*min(1,splitLandingDependencies)+8*min(1,requiredRotations)+12*min(1,requiredSetupPairs/2)+5*min(1,(planningLength-1)/2)",
      "sampleBudget": 64,
      "planningLength": "committed pair placements in the witnessed winning plan; horizontal input distance is not counted",
      "seededPlayoutScope": "64 seeded samples vary the first placement and replay the remaining witnessed suffix unchanged",
      "setupDependencyScope": "For each pre-payoff placement, enumerate all other legal single-step placements, replaying the unchanged witnessed suffix; a step counts only when every tested alternative fails."
    },
    "sampleBudget": 64,
    "checksum": "57992c0e037a80ed68939e8750760e002ff9376c40d4dbc64c68633d4117dff2",
    "levels": [
      {
        "id": "chains-64c3d1d92e2f",
        "number": 1,
        "title": {
          "en": "Linked stones: horizontal-link",
          "ja": "つながる石：横のつながり"
        },
        "canonicalKeyHash": "0c3790506ae8d380ed5ee1c8317a40a7e474f0b191455bbb5713a6ad16db9bc2",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:20",
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
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "red"
          },
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
            "colour": "green"
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
            "red"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            5,
            6,
            7
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "horizontal-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 17,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 52,
          "seededPlayoutSuccessRate": 0.8125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 6.56,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-832a2d15f69c",
        "number": 2,
        "title": {
          "en": "Linked stones: corner-link",
          "ja": "つながる石：角のつながり"
        },
        "canonicalKeyHash": "4967ab0c2db8508737159784b80437dcd653663dbc99538bce57445747c30e82",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:36",
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
            "colour": "blue"
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
            "colour": "blue"
          },
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
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            2,
            5,
            6
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "corner-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 17,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 40,
          "seededPlayoutSuccessRate": 0.625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 13.13,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-6d9dc158db89",
        "number": 3,
        "title": {
          "en": "Linked stones: vertical-link",
          "ja": "つながる石：縦のつながり"
        },
        "canonicalKeyHash": "9428b882cecb17fe985934798000093afeada74e4c3ee88d43eaa131d96a42ca",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:17",
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
          {
            "id": 2,
            "colour": "red"
          },
          null,
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
            "colour": "red"
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
          null,
          {
            "id": 8,
            "colour": "red"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            2,
            5,
            8
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "vertical-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 39,
          "seededPlayoutSuccessRate": 0.609375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 13.67,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-2785ec3c55aa",
        "number": 4,
        "title": {
          "en": "Linked stones: horizontal-link",
          "ja": "つながる石：横のつながり"
        },
        "canonicalKeyHash": "39df70942a49e11ff49a9e9fff61ca188f36cfa260473f6c71c115533aef58d9",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:5",
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
            "colour": "gold"
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
          null,
          {
            "id": 7,
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            4,
            5,
            6
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "horizontal-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 37,
          "seededPlayoutSuccessRate": 0.578125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 14.77,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-8a1d7fe997a7",
        "number": 5,
        "title": {
          "en": "Linked stones: corner-link",
          "ja": "つながる石：角のつながり"
        },
        "canonicalKeyHash": "0ae22be24662700d652197476499226e6ea39309cdf43b30c1ae664aa66f9bdd",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:16",
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
            "colour": "blue"
          },
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
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "gold",
            "red"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            2,
            4,
            5
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "corner-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 37,
          "seededPlayoutSuccessRate": 0.578125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 14.77,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-9fec3ae2851b",
        "number": 6,
        "title": {
          "en": "Linked stones: horizontal-link",
          "ja": "つながる石：横のつながり"
        },
        "canonicalKeyHash": "5ddbdf69aa3a11e9e0fca5ed429137a01a6ec2b3bf317aafde6cc143c378cfe3",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:25",
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
          {
            "id": 2,
            "colour": "blue"
          },
          {
            "id": 3,
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "horizontal-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 16,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 33,
          "seededPlayoutSuccessRate": 0.515625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 16.95,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-878aaa662dee",
        "number": 7,
        "title": {
          "en": "Linked stones: horizontal-link",
          "ja": "つながる石：横のつながり"
        },
        "canonicalKeyHash": "4fee288e8cd7c0589ca94224eea8ed0f053ef2a1bf879009efa1e695e8d47802",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:30",
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
          {
            "id": 3,
            "colour": "red"
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
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
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
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          {
            "id": 12,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            9,
            10,
            11
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "horizontal-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 32,
          "seededPlayoutSuccessRate": 0.5,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 17.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-1bef5a29ea87",
        "number": 8,
        "title": {
          "en": "Linked stones: horizontal-link",
          "ja": "つながる石：横のつながり"
        },
        "canonicalKeyHash": "79b5af915fd501758a0e732eaceea1b27850ba180b2caa1837b0aa2e02be4f90",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:15",
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
          {
            "id": 1,
            "colour": "green"
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
          null,
          null,
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
          null,
          null,
          null,
          null,
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
            "colour": "gold"
          },
          {
            "id": 12,
            "colour": "gold"
          },
          null,
          {
            "id": 13,
            "colour": "red"
          },
          {
            "id": 14,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "gold",
            "red"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            10,
            11,
            12
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "horizontal-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 30,
          "seededPlayoutSuccessRate": 0.46875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 18.59,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-43f28bfcd5db",
        "number": 9,
        "title": {
          "en": "Linked stones: vertical-link",
          "ja": "つながる石：縦のつながり"
        },
        "canonicalKeyHash": "3bf946d367d2d6745cca55a4acd90b8afd8693269d221ba2533b3f78315b61b8",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:32",
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
          {
            "id": 1,
            "colour": "green"
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
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "red"
          },
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          {
            "id": 8,
            "colour": "green"
          },
          null,
          {
            "id": 9,
            "colour": "gold"
          },
          null,
          {
            "id": 10,
            "colour": "blue"
          },
          null,
          {
            "id": 11,
            "colour": "red"
          },
          null,
          {
            "id": 12,
            "colour": "gold"
          },
          null,
          {
            "id": 13,
            "colour": "red"
          },
          null,
          {
            "id": 14,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "gold",
            "red"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            6,
            9,
            12
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "vertical-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 30,
          "seededPlayoutSuccessRate": 0.46875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 18.59,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-75fac9d398f8",
        "number": 10,
        "title": {
          "en": "Linked stones: corner-link",
          "ja": "つながる石：角のつながり"
        },
        "canonicalKeyHash": "3363f4923c5117bc172d5547d8a196108beb051772ae47dc8f754c681f993c94",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:1",
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
          {
            "id": 1,
            "colour": "green"
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
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 6,
            "colour": "red"
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
          null,
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
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            6,
            10,
            11
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "corner-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 28,
          "seededPlayoutSuccessRate": 0.4375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 19.69,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-9cecee1ccedc",
        "number": 11,
        "title": {
          "en": "Linked stones: vertical-link",
          "ja": "つながる石：縦のつながり"
        },
        "canonicalKeyHash": "afea407c7b53b38c0ec915ac840cebe52342ddf4439ea0631edfa6830bda416f",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:27",
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
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
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
            "id": 6,
            "colour": "green"
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
          null,
          {
            "id": 10,
            "colour": "green"
          },
          null,
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
          null,
          {
            "id": 14,
            "colour": "green"
          },
          null,
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
          }
        ],
        "queue": [
          [
            "green",
            "red"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            6,
            10,
            14
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "vertical-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 28,
          "seededPlayoutSuccessRate": 0.4375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 19.69,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-4a0dbe44c414",
        "number": 12,
        "title": {
          "en": "Linked stones: vertical-link",
          "ja": "つながる石：縦のつながり"
        },
        "canonicalKeyHash": "18f99fd2697dcb14ed521eaffcf78ec1e41308f6eb853d9a5af7aeadfb9dba77",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:22",
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
            "colour": "gold"
          },
          null,
          {
            "id": 6,
            "colour": "red"
          },
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 9,
            "colour": "red"
          },
          null,
          {
            "id": 10,
            "colour": "blue"
          },
          null,
          {
            "id": 11,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            3,
            6,
            9
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "vertical-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 26,
          "seededPlayoutSuccessRate": 0.40625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 20.78,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-a00a03cd360a",
        "number": 13,
        "title": {
          "en": "Linked stones: corner-link",
          "ja": "つながる石：角のつながり"
        },
        "canonicalKeyHash": "e6c1ae0dbc9e20ff0b75e4288ed3dda5cf590178a1137c3e81ecd56da5ace2b9",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:21",
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
          {
            "id": 1,
            "colour": "gold"
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
          null,
          null,
          {
            "id": 4,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "red"
          },
          null,
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
          null,
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
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          {
            "id": 14,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "green",
            "red"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            8,
            11,
            12
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "corner-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 24,
          "seededPlayoutSuccessRate": 0.375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 21.88,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-169546e807b3",
        "number": 14,
        "title": {
          "en": "Linked stones: vertical-link",
          "ja": "つながる石：縦のつながり"
        },
        "canonicalKeyHash": "5adba79b7e059c50c66a84ebcfeb04020b91dc9edb2a8aae7fcc2df6b457d331",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:7",
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
            "colour": "green"
          },
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
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          {
            "id": 8,
            "colour": "red"
          },
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            4,
            7,
            10
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "vertical-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 7,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 22,
          "seededPlayoutSuccessRate": 0.34375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 22.97,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-2ba8dd016cf5",
        "number": 15,
        "title": {
          "en": "Linked stones: vertical-link",
          "ja": "つながる石：縦のつながり"
        },
        "canonicalKeyHash": "29f52f9e6722f7a097cab2bf404c5c5119ebcdb0421ddf4e1cc6b0c67b03793f",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:37",
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
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          null,
          null,
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
          null,
          null,
          null,
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
            "gold",
            "red"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            4,
            7
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "vertical-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 7,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 22,
          "seededPlayoutSuccessRate": 0.34375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 22.97,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-a6c045b2fc9a",
        "number": 16,
        "title": {
          "en": "Linked stones: split-link",
          "ja": "つながる石：段差のつながり"
        },
        "canonicalKeyHash": "55d801c957971612f94c16906c7ccade547d238c712acfc848b6fe24157ba6b1",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:3",
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
            "colour": "red"
          },
          {
            "id": 2,
            "colour": "red"
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
            "colour": "gold"
          },
          null,
          {
            "id": 6,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "split-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 16,
          "seededPlayoutSuccessRate": 0.25,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 26.25,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-477e7679f0a2",
        "number": 17,
        "title": {
          "en": "Two-wave chain: 1",
          "ja": "2段連鎖：1"
        },
        "canonicalKeyHash": "e67256b0d6e88dfc942c7ff500319b55d56ba1a929c85315c77a8e9c6e349c7e",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:9",
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
            "colour": "green"
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
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          {
            "id": 5,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 23,
          "seededPlayoutSuccessRate": 0.359375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 27.42,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-162b1901a512",
        "number": 18,
        "title": {
          "en": "Linked stones: stepped-link",
          "ja": "つながる石：階段のつながり"
        },
        "canonicalKeyHash": "c89535158f5ad94597d76994a144dacd90486d658a52e4b25b6caeb7e038a954",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:4",
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
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 2,
            "colour": "red"
          },
          null,
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
            "colour": "green"
          },
          null,
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "gold"
          },
          null,
          {
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            3,
            6
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "stepped-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 13,
          "seededPlayoutSuccessRate": 0.203125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 27.89,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-26fbb28884b8",
        "number": 19,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "0052a3806742f97b791e4df9d9783eb72f1470f7216eab089cf4900c4577bddd",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:3",
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
          null,
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
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "gold"
          },
          null,
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
            "colour": "gold"
          },
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 17,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 45,
          "seededPlayoutSuccessRate": 0.703125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 28.39,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-5390352b462c",
        "number": 20,
        "title": {
          "en": "Two-wave chain: 2",
          "ja": "2段連鎖：2"
        },
        "canonicalKeyHash": "98ccf42ac15a74da278c80330e027f6d3857119c1946bbd77f15e4472d2f1dbb",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:1",
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
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
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
          null,
          null,
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
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 21,
          "seededPlayoutSuccessRate": 0.328125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 28.52,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-56d8930f23ed",
        "number": 21,
        "title": {
          "en": "Linked stones: stepped-link",
          "ja": "つながる石：階段のつながり"
        },
        "canonicalKeyHash": "aeb460dcf85877823a733363ee2ffae101ef5e793dc7e2fb648ee6cf096d3c9c",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:19",
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
          {
            "id": 1,
            "colour": "gold"
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
            "colour": "gold"
          },
          null,
          null,
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
            "colour": "green"
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
            "gold",
            "red"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            3,
            5
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "stepped-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 11,
          "seededPlayoutSuccessRate": 0.171875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 28.98,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-cde2be8e1f8c",
        "number": 22,
        "title": {
          "en": "Linked stones: split-link",
          "ja": "つながる石：段差のつながり"
        },
        "canonicalKeyHash": "267327945660046574080ba8b71f6465217fb6babc1d5cb6595dba11c1b4eb55",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:13",
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
          {
            "id": 2,
            "colour": "green"
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
            "colour": "gold"
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
            "red"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "split-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 11,
          "seededPlayoutSuccessRate": 0.171875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 28.98,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-e5c7df4243d8",
        "number": 23,
        "title": {
          "en": "Linked stones: split-link",
          "ja": "つながる石：段差のつながり"
        },
        "canonicalKeyHash": "8c4faeb2dee334d35bc0e8961f66af09fb9384eb2dc6942147956c8ef4aa7911",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:18",
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
            "colour": "red"
          },
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
            "colour": "red"
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
            "colour": "gold"
          },
          null,
          {
            "id": 8,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            2,
            3,
            5
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "split-link"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 10,
          "seededPlayoutSuccessRate": 0.15625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 29.53,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-7d135f245712",
        "number": 24,
        "title": {
          "en": "Two-wave chain: 2",
          "ja": "2段連鎖：2"
        },
        "canonicalKeyHash": "0ca16e619a6b45d8ccd9159c29cbccfd30524d21902134e581a35b8fd99603a9",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:7",
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
          null,
          null,
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
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 18,
          "seededPlayoutSuccessRate": 0.28125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 30.16,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-76796a50e6a2",
        "number": 25,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "5786973ab6e5c2f7d9808bde801e2e93bca0cdc90d6ba9d8b41d577154763210",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:14",
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
          null,
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
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          null,
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 40,
          "seededPlayoutSuccessRate": 0.625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 31.13,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-1c8f9f5656ac",
        "number": 26,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "0cca5dd492974538b69fabaf6a48790bea4027a742fb89fbe247b7672467f67c",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:15",
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
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
            "colour": "green"
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
            "colour": "gold"
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 39,
          "seededPlayoutSuccessRate": 0.609375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 31.67,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-e5cf7abaefc6",
        "number": 27,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "31aaeeb26427e54f20f5ec3bbff25c801520e6637af5c920b3d668b145c450f3",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:11",
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
          {
            "id": 6,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          null,
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
            "colour": "gold"
          },
          null,
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
            "colour": "gold"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          null,
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
            "colour": "gold"
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
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 39,
          "seededPlayoutSuccessRate": 0.609375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 31.67,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-f939cb4890e9",
        "number": 28,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "e5ed1495eb4273ed1b02e77c59349855964941b72983f2d32deda80023537795",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:13",
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
          null,
          null,
          null,
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
          null,
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
            "colour": "green"
          },
          {
            "id": 18,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 39,
          "seededPlayoutSuccessRate": 0.609375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 31.67,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-2240b4860d1b",
        "number": 29,
        "title": {
          "en": "Two-wave chain: 1",
          "ja": "2段連鎖：1"
        },
        "canonicalKeyHash": "518abdd798df27b425e27d3c0155d640532ecc91c8f49c714e1e072e0ac79005",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:6",
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
          {
            "id": 1,
            "colour": "blue"
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
          null,
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
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 5,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 31.8,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-e633bb5e58b9",
        "number": 30,
        "title": {
          "en": "Two-wave chain: 2",
          "ja": "2段連鎖：2"
        },
        "canonicalKeyHash": "59772d24d34fe04596b7d385010865b42c355b19fc2f34ef3c4e9042921bcfea",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:10",
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
          {
            "id": 1,
            "colour": "blue"
          },
          null,
          null,
          null,
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
          null,
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
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 5,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 31.8,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-ebcd6819b160",
        "number": 31,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "5120f14e7245517b1ec32b24aa34ce6a6da0e6c73f8f8ea104d862f78c65ee59",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:17",
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
          null,
          null,
          null,
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
          null,
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
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          null,
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
            "colour": "gold"
          },
          {
            "id": 22,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 38,
          "seededPlayoutSuccessRate": 0.59375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 32.22,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-b7860a3b7b8e",
        "number": 32,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "8dd08b73ef3348a6e19e4f43237033bc32db0d8f437b7184f88ba40f3054d91f",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:1",
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
          null,
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
            "colour": "gold"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          null,
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
            "colour": "blue"
          },
          {
            "id": 11,
            "colour": "green"
          },
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 37,
          "seededPlayoutSuccessRate": 0.578125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 32.77,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-6699a59850f2",
        "number": 33,
        "title": {
          "en": "Two-wave chain: 1",
          "ja": "2段連鎖：1"
        },
        "canonicalKeyHash": "805f629a9a3eb9d99d7444267fa2bab2f48055e4f919f407c3b05d32610054e2",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:3",
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
            "colour": "gold"
          },
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
            "colour": "green"
          },
          null,
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
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 13,
          "seededPlayoutSuccessRate": 0.203125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 32.89,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-a30f4065fe89",
        "number": 34,
        "title": {
          "en": "Two-wave chain: 2",
          "ja": "2段連鎖：2"
        },
        "canonicalKeyHash": "219421169021ff3c4b7b88a1f9f896dfb7d331ad8b14e0450afff62f81d30fdd",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:4",
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
            "colour": "gold"
          },
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
            "colour": "green"
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
            "colour": "blue"
          },
          null,
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 5,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 12,
          "seededPlayoutSuccessRate": 0.1875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 33.44,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-b22568a2ea1f",
        "number": 35,
        "title": {
          "en": "Two-wave chain: 3",
          "ja": "2段連鎖：3"
        },
        "canonicalKeyHash": "6a7707e02236b5de3d324a405a7eab44a6e2605579f105d2978942db5d01e95f",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:5",
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
          {
            "id": 1,
            "colour": "blue"
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
            "colour": "blue"
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
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 5,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 12,
          "seededPlayoutSuccessRate": 0.1875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 33.44,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-32c1841679b2",
        "number": 36,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "abeab76873a642bebadee97d31dcfc5de248ca906c87bec741162961b2bf2d2a",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:4",
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
          null,
          null,
          null,
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
          null,
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
          null
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 35,
          "seededPlayoutSuccessRate": 0.546875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 33.86,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-93c224b76a52",
        "number": 37,
        "title": {
          "en": "Two-wave chain: 3",
          "ja": "2段連鎖：3"
        },
        "canonicalKeyHash": "a8c6d82896cb863630cb2e9b9fba529365988e0911c4878c843761cfd61cb442",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:8",
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
          {
            "id": 8,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 11,
          "seededPlayoutSuccessRate": 0.171875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 33.98,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-ba176ed2bf8d",
        "number": 38,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "f9b14aa2f9ac2741df8a527419c404069b9d27047eafe95e464e9df6968c0eaa",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:16",
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
          null,
          null,
          null,
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
          null,
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
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          null,
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
            "colour": "green"
          },
          null,
          null,
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
            "colour": "blue"
          },
          null,
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
            "colour": "green"
          },
          null
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 34,
          "seededPlayoutSuccessRate": 0.53125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 34.41,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-5299b05bdacc",
        "number": 39,
        "title": {
          "en": "Split landing: close the row",
          "ja": "段差着地：横一列を完成"
        },
        "canonicalKeyHash": "7f17a2e05475d74359170b72746c45ffe3e09c0633d01d0e4f9aeb1ffb0f66e5",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:split:12",
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
          null,
          null,
          null,
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
          null,
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
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          null,
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
            "colour": "green"
          },
          null,
          null,
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
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "right"
          }
        ],
        "tags": [
          "split-landing",
          "rotation"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 33,
          "seededPlayoutSuccessRate": 0.515625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 1,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 1,
          "planningLength": 1
        },
        "score": 34.95,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-5d0156d37c1c",
        "number": 40,
        "title": {
          "en": "Two-wave chain: 3",
          "ja": "2段連鎖：3"
        },
        "canonicalKeyHash": "84dd0f46d99ab68d456a283acd9bdcb5c85460712edf487feda27ce071bd4204",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:chain:2",
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
          {
            "id": 1,
            "colour": "blue"
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
            "colour": "blue"
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 8,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "two-wave-chain",
          "gravity-setup"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutSuccesses": 9,
          "seededPlayoutSuccessRate": 0.140625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "requiredChainDepth": 2,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 35.08,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-3523fc33eb4e",
        "number": 41,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "969a10a0e279b4bbdeda1668433a3d8384bf8e003e0e48da9514c102bd579c1d",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:4",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 16,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 17,
          "seededPlayoutSuccessRate": 0.265625,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 42.7,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-b110b40d48ca",
        "number": 42,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "cd54ca26ff8e8e3d4fec3fd349a101d1f78b5ab613a9ad2f0896852ebd7d2a68",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:1",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          {
            "id": 20,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 17,
          "seededPlayoutSuccessRate": 0.265625,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 42.7,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-4a9fb3f22817",
        "number": 43,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "8b6bd770166cbffd3a5b9f33ba6c292323de4ae2b348514a407f0f69f51f901d",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:11",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
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
            "colour": "blue"
          },
          null,
          null,
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
            "colour": "green"
          },
          {
            "id": 17,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 18,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 16,
          "seededPlayoutSuccessRate": 0.25,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 43.25,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-008fb029c76d",
        "number": 44,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "b8a3a8629880bc7989e4980fd59f34e1cbca10006aec2e0f940ca6fe9e1b6f1a",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:2",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
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
          null,
          null,
          {
            "id": 17,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 43.8,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-199764f08454",
        "number": 45,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "4709a57afb43f0711a5d8374824cd242bbf031d932c9a009f4ea2ce5efa6f91b",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:6",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          {
            "id": 16,
            "colour": "green"
          },
          null,
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
            "colour": "blue"
          },
          {
            "id": 21,
            "colour": "gold"
          },
          null,
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
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 43.8,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-19b2963cdd20",
        "number": 46,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "ce5aabf2c57741e2875de8921bfabfa69d832a3579b0cc83ec45c535fb5dba2b",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:7",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          {
            "id": 10,
            "colour": "green"
          },
          null,
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
          null,
          {
            "id": 14,
            "colour": "gold"
          },
          null,
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
          null,
          {
            "id": 18,
            "colour": "blue"
          },
          null,
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
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 43.8,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-84ed768fbae6",
        "number": 47,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "91be1ac1468f60cd5f2c0e98f825e2504053d6391c62fc694339976b2394a9d8",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:16",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 43.8,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-89fcc0d915d3",
        "number": 48,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "8e5266c5aef98a25e701cad53304e3619cd7c309c17565c66f6ec069d6888520",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:8",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 43.8,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-5906d417bbb9",
        "number": 49,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "72e7d50dda25f841723607514e9ba3ee38e163f035f6e5bc3e3d4b86ceb6f5ef",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:10",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
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
            "colour": "blue"
          },
          {
            "id": 20,
            "colour": "green"
          },
          null,
          {
            "id": 21,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 14,
          "seededPlayoutSuccessRate": 0.21875,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 44.34,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      },
      {
        "id": "chains-60a800f51c82",
        "number": 50,
        "title": {
          "en": "Build the missing column",
          "ja": "足りない列を積み上げる"
        },
        "canonicalKeyHash": "a954260a6ab7af60821be626f4446ddc45480beccc4d482fb26f1a021d8bc4aa",
        "width": 6,
        "height": 12,
        "colourCount": 4,
        "seed": "colour-chains-campaign-1.3.1:setup:9",
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
          null,
          null,
          null,
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
            "colour": "gold"
          },
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
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
          null,
          {
            "id": 24,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "blue"
          ],
          [
            "red",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "setup-dependency",
          "three-placement-plan"
        ],
        "rawMetrics": {
          "placementProbes": 72,
          "legalPlacements": 72,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 3,
          "seededPlayoutSuccesses": 13,
          "seededPlayoutSuccessRate": 0.203125,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 2,
          "verifiedSetupDependencies": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 44.89,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending"
      }
    ]
  },
  "tutorials": [
    {
      "id": "rotate-to-link",
      "title": {
        "en": "Rotate to connect",
        "ja": "回転してつなげる"
      },
      "objective": {
        "en": "Turn the pair sideways so its red stone closes the three-stone link. The first practice uses a wall kick.",
        "ja": "ペアを横向きにし、赤い石で3つの石の列を完成させましょう。最初の練習では壁際のキックも使います。"
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
          null,
          null,
          null
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "gold",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "right"
          }
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Move left to the wall, then rotate anticlockwise. The pair kicks one column inward.",
            "ja": "壁まで左へ動かしてから反時計回りに回転します。ペアが1列内側へキックします。"
          },
          "action": "left; left; rotate-anticlockwise"
        },
        {
          "instruction": {
            "en": "Move to the open end, turn right, and place the pair.",
            "ja": "空いている端へ動き、右向きにしてペアを置きます。"
          },
          "action": "right; right; rotate-clockwise; rotate-clockwise; hard-drop"
        }
      ],
      "tags": [
        "rotation",
        "wall-kick"
      ]
    },
    {
      "id": "split-landing",
      "title": {
        "en": "Land at two heights",
        "ja": "異なる高さに着地"
      },
      "objective": {
        "en": "A sideways pair settles each stone independently. Watch how the red pivot joins the target link while its blue partner lands lower.",
        "ja": "横向きのペアは石ごとに着地します。赤いピボットが目標の列につながり、青い相方は低い位置に着地します。"
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
            "colour": "red"
          },
          null,
          null,
          null,
          null,
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
          null,
          null,
          null,
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
          null,
          null,
          null,
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
            "colour": "green"
          },
          null,
          null,
          null,
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
            "colour": "green"
          },
          null,
          null
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "gold",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "right"
          }
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Rotate clockwise so the pair spans the uneven columns.",
            "ja": "時計回りに回転し、段差のある列にペアを渡します。"
          },
          "action": "rotate-clockwise"
        },
        {
          "instruction": {
            "en": "Drop the pair; the two stones settle at different heights.",
            "ja": "ペアを落とすと、2つの石が別々の高さに着地します。"
          },
          "action": "hard-drop"
        }
      ],
      "tags": [
        "split-landing",
        "gravity"
      ]
    },
    {
      "id": "build-a-two-wave-chain",
      "title": {
        "en": "Set up a two-wave chain",
        "ja": "2段の連鎖をつくる"
      },
      "objective": {
        "en": "Clear the blue group first. The red stone above it falls onto the red link for a second wave.",
        "ja": "先に青いグループを消します。その上の赤い石が落ちて赤い列につながり、2段目の連鎖が起こります。"
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
          {
            "id": 1,
            "colour": "blue"
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
          null,
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
            "colour": "blue"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "red"
          ],
          [
            "gold",
            "green"
          ]
        ],
        "goal": {
          "kind": "minimum-chain",
          "chain": 2
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ]
      },
      "steps": [
        {
          "instruction": {
            "en": "Keep the blue pivot below its red satellite.",
            "ja": "青いピボットを赤いサテライトの下に保ちます。"
          },
          "action": "keep-up"
        },
        {
          "instruction": {
            "en": "Drop the pair above the blue stack and watch both waves resolve.",
            "ja": "青い積み重ねの上にペアを落とし、2段の消去を見届けます。"
          },
          "action": "hard-drop"
        }
      ],
      "tags": [
        "chain",
        "two-wave"
      ]
    }
  ],
  "shizen": {
    "count": 50,
    "candidatePoolCount": 50,
    "generationRevision": "colour-chains-nature-campaign-1.0.0",
    "gradingVersion": "chains-placement-forgiveness-1",
    "category": "shizen",
    "curationPolicy": "Every witness uses an observed magnetic pulse and rebound or a rebound-only introduction; 26 setup levels use exact two- or three-pair plans and fail their Shizen-off counterfactual. Remaining levels teach one-pair rebound. Canonical uniqueness ignores seed and witness.",
    "orderingPolicy": "Sort measured placement-forgiveness score ascending, then stable canonical ID.",
    "grading": {
      "formula": "measured placement-forgiveness score from engine-probed legal placements and seeded full-plan playouts",
      "sampleBudget": 64
    },
    "sampleBudget": 64,
    "checksum": "9df94128ee9f8be30c9caa5336b02c53203d8ee97199387334a76da78892b448",
    "levels": [
      {
        "id": "shizen-07d7128bc203",
        "number": 1,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "07d7128bc2039bc2223dce6ed281b2688ada565ba767c4a7ab1491fc16957dfb",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-b191e5fe6bfb:0:62:65",
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
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "blue",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 8,
            "colour": "blue",
            "magnetic": true
          },
          {
            "id": 13,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-1d87dab96c60",
        "number": 2,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "1d87dab96c60e6f388c424d6472da69194f157f6b181c1717af229a9dca43e26",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-8e63c7e3baad:0:62:65",
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
          {
            "id": 12,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "blue",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 8,
            "colour": "blue",
            "magnetic": true
          },
          {
            "id": 15,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-1df6befb9322",
        "number": 3,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "1df6befb93227ce55098c4107cd5e512ba180e9243da8d204ec6450711acc211",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-18a9d47ef9bd:0:44:47",
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
          {
            "id": 18,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 17,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 16,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 14,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 12,
            "colour": "teal"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 11,
            "colour": "purple"
          },
          {
            "id": 21,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-43fa234cde05",
        "number": 4,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "43fa234cde05c8c5430a5a19fa13e482851e0438fe640a9c80fde8ff6baa325b",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:0:56:59",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal",
            "magnetic": true
          },
          {
            "id": 16,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          {
            "id": 17,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-492e2cd65867",
        "number": 5,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "492e2cd65867af4d2254aa3a9df9334767a290fe56c3f935b972c509a1d83c64",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-18a9d47ef9bd:0:50:53",
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
          {
            "id": 18,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 17,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 16,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 14,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 13,
            "colour": "blue",
            "magnetic": true
          },
          {
            "id": 19,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 12,
            "colour": "teal"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 11,
            "colour": "purple"
          },
          {
            "id": 21,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-733c0292e7a6",
        "number": 6,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "733c0292e7a6a84a6663cadde086a0a6e13ed7a7d6c86740227d1f80fc3d8fa5",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:0:44:47",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          {
            "id": 17,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-75f5c724fc9d",
        "number": 7,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "75f5c724fc9da4fddbb64be086df05487491e7be4317d9d7781f9b671d754bea",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-b191e5fe6bfb:0:56:59",
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
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green",
            "magnetic": true
          },
          {
            "id": 12,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-b915c831c08a",
        "number": 8,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "b915c831c08a9e3832dd38242c6bd9e1295fb0bab8156c5d69b9461de638fa98",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-8e63c7e3baad:0:56:59",
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
          {
            "id": 12,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "gold"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green",
            "magnetic": true
          },
          {
            "id": 14,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-e247d97b71f5",
        "number": 9,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "e247d97b71f55020e95a2623a77873dc8230138657308a41e410f9e57aa48a1a",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-18a9d47ef9bd:0:57:59",
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
          {
            "id": 18,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 17,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 16,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 14,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple",
            "magnetic": true
          },
          null,
          {
            "id": 12,
            "colour": "teal",
            "magnetic": true
          },
          {
            "id": 20,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 11,
            "colour": "purple"
          },
          {
            "id": 21,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-ec798da51ed8",
        "number": 10,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "ec798da51ed83326acc12eb46a59f7a01409e6c570e834ca9d570ac6ca567354",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:0:62:65",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple",
            "magnetic": true
          },
          {
            "id": 17,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-f0525eb72f17",
        "number": 11,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "f0525eb72f17744f84b23cd9e38cb9011093492aca8e407b43a50b528b5ab7da",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-18a9d47ef9bd:0:63:65",
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
          {
            "id": 18,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 17,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 16,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 14,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 19,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 12,
            "colour": "teal"
          },
          {
            "id": 20,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold",
            "magnetic": true
          },
          null,
          {
            "id": 11,
            "colour": "purple",
            "magnetic": true
          },
          {
            "id": 21,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-fac86fe3b289",
        "number": 12,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "fac86fe3b2892388e54b91d1f3cff1b8681b9d5d120ceeec55873c04a943c3bb",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:0:50:53",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue",
            "magnetic": true
          },
          {
            "id": 15,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          {
            "id": 16,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          {
            "id": 17,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 24,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 64,
          "seededPlayoutSuccessRate": 1,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 2.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-8a7227f033ff",
        "number": 13,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "8a7227f033ff8d5627ede6238380fa7e62e83a81efebb2bfac3ac10d24276778",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-b191e5fe6bfb:0:50:53",
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
          {
            "id": 6,
            "colour": "gold",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 10,
            "colour": "gold",
            "magnetic": true
          },
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 22,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 59,
          "seededPlayoutSuccessRate": 0.921875,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 5.23,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-f35d7d686d86",
        "number": 14,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "f35d7d686d8621d9d4503d3c3cdcb2d2901995a43a133698850bc930787bc48d",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-8e63c7e3baad:0:50:53",
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
          {
            "id": 12,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "gold",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 10,
            "colour": "gold",
            "magnetic": true
          },
          {
            "id": 13,
            "colour": "blue"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 8,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 22,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 58,
          "seededPlayoutSuccessRate": 0.90625,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 5.78,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-cac58bc8dde7",
        "number": 15,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "cac58bc8dde746230da78c5ba90fc00712c8e39db46f5086eede639739740eff",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:3",
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
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 8,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 45,
          "seededPlayoutSuccessRate": 0.703125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 10.39,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-f61610e014d6",
        "number": 16,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "f61610e014d60076d37bb4943edcd44c6d763c3f2bba4c7c814ed352b7bf943b",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:19",
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
          {
            "id": 18,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 17,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 16,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 14,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 13,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 12,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 11,
            "colour": "purple"
          },
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 43,
          "seededPlayoutSuccessRate": 0.671875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 11.48,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-a6554afb83ed",
        "number": 17,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "a6554afb83ed1e2fd007cc0bf49d9605760b8032809af6645f27194d2b436c02",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:2",
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
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 8,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "gold"
          },
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
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "gold",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 42,
          "seededPlayoutSuccessRate": 0.65625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 12.03,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-3b9d0655f166",
        "number": 18,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "3b9d0655f16647f174893aff24b44e03fbf8774c4fb6810ee52e8e28fdd5bcb7",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:1",
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
            "id": 4,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "teal"
          },
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
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 40,
          "seededPlayoutSuccessRate": 0.625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 13.13,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-265f42a80676",
        "number": 19,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "265f42a806768fbfa7e2919219475fa311d02f187fc9aa3f29b163a58a5573a9",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-7bdec9632aa0:0:1:55:59",
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
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "gold",
            "magnetic": true
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "green",
            "green"
          ],
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 17,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 48,
          "seededPlayoutSuccessRate": 0.75,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 13.75,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      },
      {
        "id": "shizen-01fdd0468f1d",
        "number": 20,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "01fdd0468f1db1351042cbeb6136cea609e006781ab03bf6669dd3654c385c4d",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:5",
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
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
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
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 38,
          "seededPlayoutSuccessRate": 0.59375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 14.22,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-255310c320d1",
        "number": 21,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "255310c320d136fa4ef697e226944e1cb9063f676a07a21b054cbadb4390ade8",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:4",
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
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 38,
          "seededPlayoutSuccessRate": 0.59375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 14.22,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-2efa58eee9ed",
        "number": 22,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "2efa58eee9ed4c1c88390d538f56a03c442fb0593c8031c4dc39856a8967f7ea",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-d93339c45bb6:0:1:55:59",
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
          {
            "id": 11,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 10,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "gold",
            "magnetic": true
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "green"
          },
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "green",
            "green"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 17,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 47,
          "seededPlayoutSuccessRate": 0.734375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 14.3,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      },
      {
        "id": "shizen-9b2d48ce88f2",
        "number": 23,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "9b2d48ce88f2a032edf863828299dda9265f38402d07c3c505cc4c4c6dad0e9f",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:1:56:59",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal",
            "magnetic": true
          },
          null,
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 20,
            "colour": "blue"
          },
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
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 42,
          "seededPlayoutSuccessRate": 0.65625,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 14.53,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-8e2a89f1e2f3",
        "number": 24,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "8e2a89f1e2f388286056ae99cf84ca754d23ea3d440cf0b350a50e1f48ea78c3",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:8",
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
          {
            "id": 16,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 14,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 12,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 9,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 36,
          "seededPlayoutSuccessRate": 0.5625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 15.31,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-a760e8c7a526",
        "number": 25,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "a760e8c7a5261ef28d40465ec0883b60d128e3824aed8a703e39ff4786949534",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:6",
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
          {
            "id": 11,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 10,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 9,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "teal"
          },
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
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 36,
          "seededPlayoutSuccessRate": 0.5625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 15.31,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-e4f3eae8c00f",
        "number": 26,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "e4f3eae8c00f35cbb30423819fd1099556248e2586122fda064c7d651a59a972",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-d9646dc42922:0:1:55:59",
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
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "blue"
          },
          {
            "id": 12,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "blue",
            "magnetic": true
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "teal"
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
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
            "id": 5,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "green",
            "green"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 45,
          "seededPlayoutSuccessRate": 0.703125,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 15.39,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      },
      {
        "id": "shizen-e32b5921dc44",
        "number": 27,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "e32b5921dc44fc20bf0a22e4e92e80d9343662eebc2d28fd83eb3a534ea5e62f",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:18",
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
          {
            "id": 16,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 14,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 11,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 10,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 35,
          "seededPlayoutSuccessRate": 0.546875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 15.86,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-33bf3ac42c85",
        "number": 28,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "33bf3ac42c858b3104adee7a62eccd7653e7286d7de024558b3870c8efcc5ffa",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:16",
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
          {
            "id": 12,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 10,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          {
            "id": 8,
            "colour": "teal"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 33,
          "seededPlayoutSuccessRate": 0.515625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 16.95,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-b32ddf010cc3",
        "number": 29,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "b32ddf010cc389787bab81ff02053304547bdb61ceae25a4c6e8803d32c2ef38",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:15",
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
            "id": 10,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
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
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 33,
          "seededPlayoutSuccessRate": 0.515625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 16.95,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-cc9d657fcf0d",
        "number": 30,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "cc9d657fcf0dc31f5568982f204f8ebeb6c25c0e08380cbda7e8ea7a5ebb1578",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:12",
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
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          {
            "id": 8,
            "colour": "gold"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "gold",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 33,
          "seededPlayoutSuccessRate": 0.515625,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 16.95,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-e9e2c9431f88",
        "number": 31,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "e9e2c9431f881f87d9f2b98bc3ff72655f61738f189d8bad2c387bb5f57a8760",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-7bdec9632aa0:0:1:55:59",
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
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 13,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "gold",
            "magnetic": true
          },
          {
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "green",
            "green"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 17,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 42,
          "seededPlayoutSuccessRate": 0.65625,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 17.03,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      },
      {
        "id": "shizen-7cd08e30d897",
        "number": 32,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "7cd08e30d8971e62e140648018bac2a56341cb405c2964cd7a298009126ff50f",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:9",
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
          {
            "id": 18,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 17,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 16,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 14,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 13,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 10,
            "colour": "purple"
          },
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
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 32,
          "seededPlayoutSuccessRate": 0.5,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 17.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-864bed7a1d7e",
        "number": 33,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "864bed7a1d7e484e80807937946200e3baa0984e54d1930dad6f5ab0f6b48f17",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:13",
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
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 9,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 32,
          "seededPlayoutSuccessRate": 0.5,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 17.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-d4b37e160d0a",
        "number": 34,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "d4b37e160d0ad867607bbe2035f6ab009140e2799a9ba06bc31a80aec2ecb6bc",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:22",
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
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 6,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 9,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "gold",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 32,
          "seededPlayoutSuccessRate": 0.5,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 17.5,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-593b58054ef7",
        "number": 35,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "593b58054ef7b50b89b7d158943c2e98d84c57648a3c97d3046539e7feafe07b",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:23",
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
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
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
            "id": 8,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 11,
            "colour": "blue"
          },
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "purple",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 31,
          "seededPlayoutSuccessRate": 0.484375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 18.05,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-a458fbff42bc",
        "number": 36,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "a458fbff42bcbd4ddf9420805f673e2b47e5af37d38b8aa64aa3fe7f2f044055",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:14",
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
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 13,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 12,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 11,
            "colour": "purple"
          },
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
            "colour": "red"
          },
          {
            "id": 10,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 31,
          "seededPlayoutSuccessRate": 0.484375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 18.05,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-153754f74442",
        "number": 37,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "153754f74442dbd7d2b47669cdf8f5399e527ce8ce7d046098ba9100236ccaec",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:20",
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
          {
            "id": 15,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 7,
            "colour": "green"
          },
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
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 30,
          "seededPlayoutSuccessRate": 0.46875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 18.59,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-faab75dcd8e0",
        "number": 38,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "faab75dcd8e0dda839717912ffe13d5cfec0c3791e0fe80080d653cae7c380da",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:1:50:53",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue",
            "magnetic": true
          },
          null,
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          null,
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 20,
            "colour": "blue"
          },
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
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 34,
          "seededPlayoutSuccessRate": 0.53125,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 18.91,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-28398164c738",
        "number": 39,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "28398164c738bc81e8ae3be8aaf251ca3aacd168dc634c37ec28a544ab16c9b7",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:24",
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
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          {
            "id": 10,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 13,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 12,
            "colour": "purple"
          },
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
            "colour": "red"
          },
          {
            "id": 11,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 29,
          "seededPlayoutSuccessRate": 0.453125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 19.14,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-a1fe4eb2def5",
        "number": 40,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "a1fe4eb2def511ee9c38ee3bb111a304911cce258e54ce7dcc7af92b5eff87a1",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:7",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          {
            "id": 8,
            "colour": "gold"
          },
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
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "gold",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 29,
          "seededPlayoutSuccessRate": 0.453125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 19.14,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-4841b3954b1d",
        "number": 41,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "4841b3954b1d24f58f0582159de18e3f30e2e4891320bb01a738ccc22e429ce4",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:1:44:47",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          null,
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 20,
            "colour": "blue"
          },
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
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 33,
          "seededPlayoutSuccessRate": 0.515625,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 19.45,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-081883c9b4fe",
        "number": 42,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "081883c9b4fe675f6f0c015d45775609cd5aac874794c2f0d0760ae2cd801ddd",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:10",
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
          {
            "id": 15,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 14,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 12,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 10,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 9,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 6,
            "colour": "green"
          },
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
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "blue",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 27,
          "seededPlayoutSuccessRate": 0.421875,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 20.23,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-a2fdfaf344a3",
        "number": 43,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "a2fdfaf344a3aca6fb68c2ea658de3680269ddfdd066ab3a63a46c166b99f3eb",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-d9646dc42922:0:1:55:59",
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
            "id": 8,
            "colour": "green"
          },
          {
            "id": 9,
            "colour": "green"
          },
          {
            "id": 12,
            "colour": "blue",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "blue",
            "magnetic": true
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "teal"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue"
          },
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
            "id": 5,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "green",
            "green"
          ],
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 36,
          "seededPlayoutSuccessRate": 0.5625,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 20.31,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      },
      {
        "id": "shizen-3bd05d377c96",
        "number": 44,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "3bd05d377c960fe5982d5e872220202e788a969e120b3b323f3a2565b9a40de0",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-7bdec9632aa0:0:1:61:65",
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
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 10,
            "colour": "green"
          },
          {
            "id": 13,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          {
            "id": 11,
            "colour": "green"
          },
          {
            "id": 14,
            "colour": "blue",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green",
            "magnetic": true
          },
          {
            "id": 12,
            "colour": "green"
          },
          {
            "id": 15,
            "colour": "blue"
          },
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "green",
            "green"
          ],
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 34,
          "seededPlayoutSuccessRate": 0.53125,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 21.41,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      },
      {
        "id": "shizen-0fc0d3770de7",
        "number": 45,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "0fc0d3770de77a9e0e7e1356ff04c37d3d604f86060abb5cc5a31cbb712b977e",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:11",
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
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "teal"
          },
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
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 24,
          "seededPlayoutSuccessRate": 0.375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 21.88,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-a0774659965c",
        "number": 46,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "a0774659965c54a42dd77ca0a996f4224bed948c4b7a4eb9ef06099cc42bcdec",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:17",
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
          {
            "id": 14,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 12,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 11,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 10,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          {
            "id": 9,
            "colour": "gold"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "gold",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 23,
          "seededPlayoutSuccessRate": 0.359375,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 22.42,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-4a1eb2f7417b",
        "number": 47,
        "title": {
          "en": "Rebound the red link",
          "ja": "赤い列へリバウンド"
        },
        "objective": {
          "en": "Guide the marked red pivot into the open end of the link. Its rebound must complete the target match.",
          "ja": "磁石付きの赤いピボットを列の空きへ導きましょう。リバウンドで目標の組が完成します。"
        },
        "canonicalKeyHash": "4a1eb2f7417b7df753770f9b15f89ee091ed43f04a02c9502145069d8a2fef08",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "shizen:colour-chains-nature-campaign-1.0.0:21",
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
          {
            "id": 18,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 17,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 16,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 15,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 14,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 12,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 11,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          {
            "id": 10,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          {
            "id": 9,
            "colour": "teal"
          },
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
            "colour": "red"
          },
          {
            "id": 8,
            "colour": "purple"
          }
        ],
        "queue": [
          [
            "red",
            "blue"
          ],
          [
            "green",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 0,
          "seededPlayoutSuccesses": 21,
          "seededPlayoutSuccessRate": 0.328125,
          "setupPairsBeforePayoff": 0,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 0,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 1
        },
        "score": 23.52,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-9ff8044cc6a7",
        "number": 48,
        "title": {
          "en": "Pulse, then rebound",
          "ja": "磁力の後にリバウンド"
        },
        "objective": {
          "en": "Clear the blue setup stack first. The magnetic pulse pulls the gap closed; then place the marked red pair for the rebound finish.",
          "ja": "先に青い準備の列を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "9ff8044cc6a71a22028a6a5e931329dee2298e379c85d2437c4d36b65aff6896",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe:shizen-976bfa03aca6:1:62:65",
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
          {
            "id": 14,
            "colour": "purple"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 13,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 12,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 11,
            "colour": "blue"
          },
          null,
          {
            "id": 18,
            "colour": "blue"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 10,
            "colour": "teal"
          },
          null,
          {
            "id": 19,
            "colour": "blue"
          },
          {
            "id": 4,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          {
            "id": 9,
            "colour": "purple",
            "magnetic": true
          },
          null,
          {
            "id": 20,
            "colour": "blue"
          },
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
            "id": 8,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "red",
            "blue"
          ],
          [
            "teal",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 12,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 1,
          "seededPlayoutSuccesses": 25,
          "seededPlayoutSuccessRate": 0.390625,
          "setupPairsBeforePayoff": 1,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 1,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 2
        },
        "score": 23.83,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            true,
            false
          ],
          [
            false,
            false
          ]
        ]
      },
      {
        "id": "shizen-2472d3ff1382",
        "number": 49,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "2472d3ff1382dd0e0421a78c1cb6471c2d5f357cd94f3e67da3650da54d183a2",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-7bdec9632aa0:0:1:61:65",
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
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 10,
            "colour": "blue"
          },
          {
            "id": 13,
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
            "id": 11,
            "colour": "blue"
          },
          {
            "id": 14,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green",
            "magnetic": true
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 15,
            "colour": "green"
          },
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "green",
            "green"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 28,
          "seededPlayoutSuccessRate": 0.4375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 24.69,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      },
      {
        "id": "shizen-25ec1ad056df",
        "number": 50,
        "title": {
          "en": "Build two clearings",
          "ja": "2つの連鎖を準備"
        },
        "objective": {
          "en": "Clear both setup colours first. Watch the magnetic pulse pull the gap closed, then place the marked red pair for the rebound finish.",
          "ja": "先に2色の準備を消しましょう。磁力の移動で隙間が埋まったら、磁石付きの赤いペアを置いてリバウンドで仕上げます。"
        },
        "canonicalKeyHash": "25ec1ad056df2f6042041ff0c4ffe558ec4fb15dfaeb242c27b4ddec81a5dada",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "probe3:shizen-d93339c45bb6:0:1:61:65",
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
          {
            "id": 11,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 10,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 9,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          null,
          {
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 12,
            "colour": "blue"
          },
          {
            "id": 15,
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
            "id": 13,
            "colour": "blue"
          },
          {
            "id": 16,
            "colour": "green",
            "magnetic": true
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "green",
            "magnetic": true
          },
          {
            "id": 14,
            "colour": "blue"
          },
          {
            "id": 17,
            "colour": "green"
          },
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
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "blue",
            "blue"
          ],
          [
            "green",
            "green"
          ],
          [
            "red",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1,
            2,
            3
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "magnetic-attraction",
          "setup-dependency",
          "magnetic-attraction",
          "rebound-dependency",
          "counterfactual-fail-without-nature"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 2,
          "seededPlayoutSuccesses": 23,
          "seededPlayoutSuccessRate": 0.359375,
          "setupPairsBeforePayoff": 2,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 2,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 3
        },
        "score": 27.42,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "magneticQueue": [
          [
            false,
            false
          ],
          [
            false,
            false
          ],
          [
            true,
            false
          ]
        ]
      }
    ]
  },
  "arashi": {
    "count": 50,
    "candidatePoolCount": 50,
    "generationRevision": "colour-chains-nature-campaign-1.0.0",
    "gradingVersion": "chains-placement-forgiveness-1",
    "category": "arashi",
    "curationPolicy": "Every four-pair witness records a changed jumble on turn two and lightning removal of its target on turn four; placement alternatives and deterministic full-plan samples grade the route.",
    "orderingPolicy": "Sort measured placement-forgiveness score ascending, then stable canonical ID.",
    "grading": {
      "formula": "measured placement-forgiveness score from engine-probed legal placements and seeded full-plan playouts",
      "sampleBudget": 64
    },
    "sampleBudget": 64,
    "checksum": "5ee82c0127edabd43cf5da4280cf3f05b28071ddd527ef2550f4fd10ae02ce30",
    "levels": [
      {
        "id": "arashi-2750bf69166d",
        "number": 1,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "2750bf69166dfd70b3a6139eee401a572a034c43256ac5021a08f32d83567c8e",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:758",
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
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 15,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 42,
          "seededPlayoutSuccessRate": 0.65625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 17.03,
        "marks": 1,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-4abe9f89d4eb",
        "number": 2,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "4abe9f89d4eb9f706a42ecbb0dc89e8a9125660b36f8fdc50583b9d202d1f6f1",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:572",
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
            "id": 2,
            "colour": "green"
          },
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
            "id": 4,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 35,
          "seededPlayoutSuccessRate": 0.546875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 20.86,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-718c22796c4e",
        "number": 3,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "718c22796c4e615b425de1f4f59fcc979264431a93c85c215adab14f03a6fc3a",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:107",
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
            "id": 6,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
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
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 7,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 1,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 13,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 34,
          "seededPlayoutSuccessRate": 0.53125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 21.41,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-095f9747d5e6",
        "number": 4,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "095f9747d5e6624ed10696eb530fd5725ebb2b3502a8a0bf424978a5da97ef5d",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:187",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "gold"
          }
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 33,
          "seededPlayoutSuccessRate": 0.515625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 21.95,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-5af7c28d981e",
        "number": 5,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "5af7c28d981e2015a13fff490150101644ced92e5bcde1f1745160995151b134",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:20",
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
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "teal"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 31,
          "seededPlayoutSuccessRate": 0.484375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 23.05,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-42cbcfe44e28",
        "number": 6,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "42cbcfe44e28d53be3f4153c0a88ea5f96f752003cd5d57c67a3cb2ae1c139f4",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:189",
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
            "id": 2,
            "colour": "green"
          },
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
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 30,
          "seededPlayoutSuccessRate": 0.46875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 23.59,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-c4e25ae95207",
        "number": 7,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "c4e25ae95207155363b43678d6d20a9c9e0a809a511e75e7cf6c1f96f92123c3",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:184",
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
            "id": 3,
            "colour": "gold"
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
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          }
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 30,
          "seededPlayoutSuccessRate": 0.46875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 23.59,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-11c1a1dfca7a",
        "number": 8,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "11c1a1dfca7a675fc11b027c82697f466ab4cf73952e4ed87daf44392d74e386",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:642",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 27,
          "seededPlayoutSuccessRate": 0.421875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 25.23,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-896cae440391",
        "number": 9,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "896cae440391ec7b1fc6fab777559f007f164ffa31b754815258852577ccd2dd",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:608",
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
            "id": 2,
            "colour": "green"
          },
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
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 5,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 10,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 26,
          "seededPlayoutSuccessRate": 0.40625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 25.78,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-f7aabac26943",
        "number": 10,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "f7aabac26943ee5c4f6fb9ce5e105270b592a36b8576c51be57a240206243adc",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:244",
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
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
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
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 11,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 26,
          "seededPlayoutSuccessRate": 0.40625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 25.78,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-497307aafe6c",
        "number": 11,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "497307aafe6c8bfab9ff38385d74ef2e854e685739b1c304bb4c2d94487e34ab",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:386",
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
            "id": 2,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "teal"
          },
          {
            "id": 7,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          null
        ],
        "queue": [
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 8,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 25,
          "seededPlayoutSuccessRate": 0.390625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 26.33,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-f514587af6a2",
        "number": 12,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "f514587af6a2e081182f63ab88ab42945a0b95b266993ae0a19c2e6ee2b27011",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:51",
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
            "id": 2,
            "colour": "green"
          },
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
          null
        ],
        "queue": [
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 25,
          "seededPlayoutSuccessRate": 0.390625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 26.33,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-0dbfd153b821",
        "number": 13,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "0dbfd153b82191d47e1aecade46e4c63c3d50a04310497f1e7707575109607bd",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:44",
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
            "id": 2,
            "colour": "green"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 24,
          "seededPlayoutSuccessRate": 0.375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 26.88,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-b79a63b5d444",
        "number": 14,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "b79a63b5d4440e07f14952bc46d2be2cf77750e4ebadf1cb8c73858c248fdb4a",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:208",
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
            "id": 3,
            "colour": "gold"
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
            "id": 2,
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
            "id": 1,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 9,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 24,
          "seededPlayoutSuccessRate": 0.375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 26.88,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-7e220f899df4",
        "number": 15,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "7e220f899df44ba2e9c7904c51ec47df298209b16934655783f51d0216d2e902",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:468",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 8,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 22,
          "seededPlayoutSuccessRate": 0.34375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 27.97,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-0c1d16021e48",
        "number": 16,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "0c1d16021e4808b26d6ef6a14bbe851a07dcd06402805f271519236fe24720a0",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:478",
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
            "id": 3,
            "colour": "gold"
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
            "id": 4,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 8,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 21,
          "seededPlayoutSuccessRate": 0.328125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 28.52,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-22f83eea17e5",
        "number": 17,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "22f83eea17e5e60ae41a793e6f9e066bf571c437e9f63bb9bcd256fdc28561b1",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:85",
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
            "id": 3,
            "colour": "gold"
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
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 18,
          "seededPlayoutSuccessRate": 0.28125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 30.16,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-b2a38e045419",
        "number": 18,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "b2a38e0454196d0024f6b4a90ced1946ce787b629da79b642883deffd883669f",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:79",
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
            "id": 3,
            "colour": "gold"
          },
          null,
          {
            "id": 6,
            "colour": "teal"
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          null,
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 7,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 18,
          "seededPlayoutSuccessRate": 0.28125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 30.16,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-c4f8dd01c93f",
        "number": 19,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "c4f8dd01c93f604b42cbfc89b490568bebb0fc9bb6e3c8060cd8c9e22711bbfb",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:602",
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
            "id": 6,
            "colour": "blue"
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
            "id": 5,
            "colour": "purple"
          },
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 7,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 18,
          "seededPlayoutSuccessRate": 0.28125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 30.16,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-0ef3f2ac565e",
        "number": 20,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "0ef3f2ac565e846eda99f91f28d602a7bd3d786103fa7526675c64b9f7b3847c",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:117",
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
            "id": 2,
            "colour": "green"
          },
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
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 7,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 17,
          "seededPlayoutSuccessRate": 0.265625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 30.7,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-723731f4b2db",
        "number": 21,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "723731f4b2dbfaf5c696b96fd46cca524202a8d01adf948ca7ccece9f67e3f1d",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:340",
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
            "id": 3,
            "colour": "gold"
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
            "id": 5,
            "colour": "teal"
          },
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 17,
          "seededPlayoutSuccessRate": 0.265625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 30.7,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-133f2c6656e5",
        "number": 22,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "133f2c6656e59a7c9e430e25c5a47fc72d0b1ee546fb0e9de75a76a309e35898",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:990",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 5,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 16,
          "seededPlayoutSuccessRate": 0.25,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 31.25,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-3619195a522f",
        "number": 23,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "3619195a522ffeefe3e508c65c1695d3cc4c05ffde827ac2dbd5207dfdb98be6",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:49",
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
            "id": 3,
            "colour": "gold"
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
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 16,
          "seededPlayoutSuccessRate": 0.25,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 31.25,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-83d254e3bb59",
        "number": 24,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "83d254e3bb5930260b0f2be45d73e124185e3a62a9e4cdf9652fe30aa0c41c15",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:271",
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
            "id": 3,
            "colour": "gold"
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
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null
        ],
        "queue": [
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 16,
          "seededPlayoutSuccessRate": 0.25,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 31.25,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-933c862279c0",
        "number": 25,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "933c862279c0cc9e856939f2868b80feeba328dd00a57f5060cb569eb8abe4d9",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:830",
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
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "blue"
          },
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 16,
          "seededPlayoutSuccessRate": 0.25,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 31.25,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-006e17116c97",
        "number": 26,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "006e17116c97f0ea344f9e349178e9980b5dc7a7da55357bc1fee71d59bde3be",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:457",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 7,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 31.8,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-5daa71326eaa",
        "number": 27,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "5daa71326eaa5768fc0438850f352780c1c57ab588acbb1b327e580d1b0b2c7a",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:965",
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
            "id": 9,
            "colour": "blue"
          },
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          {
            "id": 7,
            "colour": "gold"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 6,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 15,
          "seededPlayoutSuccessRate": 0.234375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 31.8,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-a92d57b0b2f3",
        "number": 28,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "a92d57b0b2f3f268b1823dd113a9c25d71d83b44df03d957048866fa3cf7e2b1",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:216",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null,
          null,
          null
        ],
        "queue": [
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 14,
          "seededPlayoutSuccessRate": 0.21875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 32.34,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-b96167a82747",
        "number": 29,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "b96167a82747e361892ef522792f38f57d68d5adcc4b63d89b1f8aec4bb5e547",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:524",
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
            "id": 6,
            "colour": "purple"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "teal"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "blue"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "green"
          },
          null,
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 5,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 14,
          "seededPlayoutSuccessRate": 0.21875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 32.34,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-8e7aaedbb414",
        "number": 30,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "8e7aaedbb414e1668b56d96402442e7f8c3fabd2eb435f7c1e8f1333282f582b",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:50",
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
            "id": 2,
            "colour": "green"
          },
          {
            "id": 5,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 6,
            "colour": "gold"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 13,
          "seededPlayoutSuccessRate": 0.203125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 32.89,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-f2e5434c67b1",
        "number": 31,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "f2e5434c67b16ba0e9e6386fa1552bbe7211730643f101f64ff0593ea8ccef2f",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:866",
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
          {
            "id": 3,
            "colour": "gold"
          },
          {
            "id": 9,
            "colour": "purple"
          },
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 8,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 7,
            "colour": "teal"
          },
          null,
          {
            "id": 4,
            "colour": "teal"
          }
        ],
        "queue": [
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 11,
          "seededPlayoutSuccessRate": 0.171875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 33.98,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-dc0231243a6e",
        "number": 32,
        "title": {
          "en": "Keep the target exposed",
          "ja": "目標を露出させる"
        },
        "objective": {
          "en": "Leave the target clear through the jumble, then let turn-four lightning remove it.",
          "ja": "目標の列を地震の後まで空けておき、4手目の雷で消しましょう。"
        },
        "canonicalKeyHash": "dc0231243a6e011e8597a351df22359940d193f6ebe4bdead55c8654d7d38e2b",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:105",
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
            "id": 2,
            "colour": "green"
          },
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
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 10,
          "seededPlayoutSuccessRate": 0.15625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 34.53,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-e47faa5888c0",
        "number": 33,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "e47faa5888c02e176a8c8eb3bf5e2ee5529ed6d182bba4d3316862764d28efd2",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:175",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 10,
          "seededPlayoutSuccessRate": 0.15625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 34.53,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-8e50d6b898df",
        "number": 34,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "8e50d6b898dfb37221859b145f409afd1018673a890869ef1efdd5c9a02ad9e0",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:716",
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
            "id": 6,
            "colour": "green"
          },
          {
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          {
            "id": 1,
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
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 3,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 9,
          "seededPlayoutSuccessRate": 0.140625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 35.08,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-9df3359f920b",
        "number": 35,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "9df3359f920bd2504fdc32e76f39c6d8ce1fda74e77df1dba28a0313f72389b7",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:217",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 3,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 9,
          "seededPlayoutSuccessRate": 0.140625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 35.08,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-bbc590452775",
        "number": 36,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "bbc590452775ecf554af336a8f77e42002d9030caeca0c7083e516a8c311ae11",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:914",
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
            "id": 2,
            "colour": "green"
          },
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
            "id": 5,
            "colour": "gold"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 9,
          "seededPlayoutSuccessRate": 0.140625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 35.08,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-fd655455cec5",
        "number": 37,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "fd655455cec5b3a4ed45f218c3121967f5b9aea1a2d0a1b6be770c8f700399c4",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:691",
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
            "id": 3,
            "colour": "gold"
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
            "id": 1,
            "colour": "red"
          },
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 9,
          "seededPlayoutSuccessRate": 0.140625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 35.08,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-a088e18161c8",
        "number": 38,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "a088e18161c87fb1bd0f5d961ed0a7890ad619e8234bb4ec552b81f7bd0dbff6",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:446",
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
            "id": 2,
            "colour": "green"
          },
          null,
          {
            "id": 6,
            "colour": "blue"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 5,
            "colour": "gold"
          },
          null
        ],
        "queue": [
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 8,
          "seededPlayoutSuccessRate": 0.125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 35.63,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-d3586b6809f6",
        "number": 39,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "d3586b6809f6956d70f5a53dd21659b08463ec39d2609121b0f295fb83698031",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:80",
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
            "id": 2,
            "colour": "green"
          },
          {
            "id": 7,
            "colour": "purple"
          },
          null,
          {
            "id": 5,
            "colour": "green"
          },
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          {
            "id": 6,
            "colour": "green"
          },
          null,
          {
            "id": 4,
            "colour": "green"
          }
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 3,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 8,
          "seededPlayoutSuccessRate": 0.125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 35.63,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-5e308b3654db",
        "number": 40,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "5e308b3654db91a01f27c37187b4612681a263db440eaea1f0193e9793addb2a",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:13",
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
            "id": 3,
            "colour": "gold"
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
            "id": 5,
            "colour": "blue"
          },
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          null
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 2,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 7,
          "seededPlayoutSuccessRate": 0.109375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 36.17,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-a7f18ac523c2",
        "number": 41,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "a7f18ac523c287e060df688fdc886091c995de8ee3e9b1fe56d8c41613e51943",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:322",
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
            "id": 3,
            "colour": "gold"
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
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 7,
          "seededPlayoutSuccessRate": 0.109375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 36.17,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-9740c12f9cd2",
        "number": 42,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "9740c12f9cd24628102dd781b54574836e36d46454a3936e230916ae61a262bc",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:124",
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
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 5,
            "colour": "teal"
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
            "id": 4,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 2,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 6,
          "seededPlayoutSuccessRate": 0.09375,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 36.72,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-56d081d9a9d5",
        "number": 43,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "56d081d9a9d5381723953e189c5b46e9a10096ab0ae491dd1a453a9c12412380",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:568",
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
          {
            "id": 6,
            "colour": "blue"
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
            "id": 5,
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
            "id": 4,
            "colour": "gold"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 5,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 4,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 5,
          "seededPlayoutSuccessRate": 0.078125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 37.27,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-b21b08c7fcfa",
        "number": 44,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "b21b08c7fcfa4c38f49316a343ac6dfff659c26c76f63b5f03e053c7926ef7e3",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:272",
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
            "id": 8,
            "colour": "teal"
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
            "id": 7,
            "colour": "purple"
          },
          {
            "id": 5,
            "colour": "teal"
          },
          {
            "id": 2,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "teal"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          {
            "id": 1,
            "colour": "red"
          },
          null,
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 3,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 5,
          "seededPlayoutSuccessRate": 0.078125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 37.27,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-bd53214de4a5",
        "number": 45,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "bd53214de4a57212782ef439cc503a4f2c381fa6e6972211d99b2bc195064784",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:670",
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
            "id": 3,
            "colour": "gold"
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
          {
            "id": 4,
            "colour": "purple"
          },
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null
        ],
        "queue": [
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 2,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 5,
          "seededPlayoutSuccessRate": 0.078125,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 37.27,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-54b7ce5fefb3",
        "number": 46,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "54b7ce5fefb3348f5b579c4fbbc33b5cca0192623590f7811cc9a4c3af07a241",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:923",
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
            "id": 3,
            "colour": "gold"
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
            "id": 5,
            "colour": "teal"
          },
          null,
          null,
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          {
            "id": 1,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ],
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 2,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 38.36,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-85edd1eb69d9",
        "number": 47,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "85edd1eb69d953b6087d386a89693b40932af3554447458f19716966e421c286",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:397",
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
            "id": 3,
            "colour": "gold"
          },
          null,
          {
            "id": 6,
            "colour": "gold"
          },
          null,
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          null,
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "teal"
          },
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 2,
          "forcedPlacementShare": 0,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 0,
          "verifiedSetupDependencies": 0,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 38.36,
        "marks": 2,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-b09daa879658",
        "number": 48,
        "title": {
          "en": "After the jumble",
          "ja": "地震の後に"
        },
        "objective": {
          "en": "The board will jumble on turn two. Keep the marked target alive until the turn-four lightning strike.",
          "ja": "2手目に盤面が入れ替わります。磁石付きの目標を4手目の雷まで残しましょう。"
        },
        "canonicalKeyHash": "b09daa879658fb05776a223f3a66c5c69825f3b58021e721951b227fcf76c1c1",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:517",
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
            "id": 3,
            "colour": "gold"
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
            "id": 5,
            "colour": "purple"
          },
          null,
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          },
          null,
          {
            "id": 4,
            "colour": "blue"
          },
          null,
          null
        ],
        "queue": [
          [
            "gold",
            "purple"
          ],
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 2,
            "orientation": "up"
          },
          {
            "pivotX": 3,
            "orientation": "up"
          },
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 5,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 1,
          "forcedPlacementShare": 1,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 4,
          "seededPlayoutSuccessRate": 0.0625,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 1,
          "verifiedSetupDependencies": 1,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 53.81,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-3a9f659d8a38",
        "number": 49,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "3a9f659d8a38f7e672f48568503777c022ecbcbbfbda5a21fb945609c2c468f1",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:1049",
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
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          null,
          null,
          {
            "id": 6,
            "colour": "teal"
          },
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "green"
          },
          null,
          null,
          null,
          {
            "id": 5,
            "colour": "purple"
          },
          {
            "id": 1,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 1,
          "forcedPlacementShare": 1,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 1,
          "verifiedSetupDependencies": 1,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 54.36,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      },
      {
        "id": "arashi-d901d88cb1dd",
        "number": 50,
        "title": {
          "en": "Save a path for lightning",
          "ja": "雷への道を残す"
        },
        "objective": {
          "en": "Place the setup pairs away from the marked target so lightning can reach it on turn four.",
          "ja": "準備のペアを目標から離して置き、4手目の雷が届くようにしましょう。"
        },
        "canonicalKeyHash": "d901d88cb1dd4bd5fcb496c767c2638904a038f4be17cdab510d9ffbe988e1f9",
        "width": 6,
        "height": 12,
        "colourCount": 6,
        "seed": "arashi:colour-chains-nature-campaign-1.0.0:209",
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
            "id": 3,
            "colour": "gold"
          },
          null,
          null,
          {
            "id": 6,
            "colour": "purple"
          },
          null,
          null,
          {
            "id": 2,
            "colour": "green"
          },
          {
            "id": 4,
            "colour": "gold"
          },
          null,
          {
            "id": 5,
            "colour": "teal"
          },
          null,
          null,
          {
            "id": 1,
            "colour": "red"
          }
        ],
        "queue": [
          [
            "teal",
            "blue"
          ],
          [
            "green",
            "gold"
          ],
          [
            "purple",
            "teal"
          ],
          [
            "blue",
            "green"
          ]
        ],
        "goal": {
          "kind": "clear-targets",
          "targetIds": [
            1
          ]
        },
        "witness": [
          {
            "pivotX": 4,
            "orientation": "up"
          },
          {
            "pivotX": 0,
            "orientation": "up"
          },
          {
            "pivotX": 1,
            "orientation": "up"
          },
          {
            "pivotX": 2,
            "orientation": "up"
          }
        ],
        "tags": [
          "rebound",
          "jumble",
          "lightning"
        ],
        "rawMetrics": {
          "placementProbes": 24,
          "legalPlacements": 24,
          "goalPreservingPlacements": 1,
          "forcedPlacementShare": 1,
          "seededPlayoutSamples": 64,
          "seededPlayoutQueueDepth": 1,
          "seededPlayoutVariablePrefixLength": 1,
          "seededPlayoutFixedSuffixLength": 3,
          "seededPlayoutSuccesses": 3,
          "seededPlayoutSuccessRate": 0.046875,
          "setupPairsBeforePayoff": 3,
          "requiredSetupPairs": 1,
          "verifiedSetupDependencies": 1,
          "setupDependencyProbeSteps": 3,
          "requiredChainDepth": 1,
          "requiredRotations": 0,
          "requiredWallKicks": 0,
          "splitLandingDependencies": 0,
          "planningLength": 4
        },
        "score": 54.36,
        "marks": 3,
        "gradingVersion": "chains-placement-forgiveness-1",
        "proofStatus": "engine-witness-verified",
        "reviewStatus": "human-review-pending",
        "nature": true,
        "weather": "frequent"
      }
    ]
  }
};
