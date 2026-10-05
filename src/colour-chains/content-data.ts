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
      "planningLength": "committed pair placements in the witnessed winning plan; horizontal input distance is not counted"
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
  ]
};
