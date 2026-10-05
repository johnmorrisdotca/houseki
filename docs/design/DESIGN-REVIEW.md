# Design review and revision history

Revision 1.3 · 2026-10-05 · Falling Triplets early playable slice

The original fixture checker passes all 15 reference examples. The static visual reference passes Chromium checks at 320, 390 and 1280 pixels, light/dark themes, with four cards, usable control dimensions and no page errors. These results validate reference artifacts, not a playable game or commercial readiness.

## First playable slice evidence

The isolated implementation has movement, forward/reverse cycling, a rigid landing preview, placement, simultaneous matching, cascades, score, a three-piece preview and same-seed restart. The implementation owner reports four tests, build and site generation passing. A separate reviewer ran the actual generated player in Chromium through local file routing, without a listening server, and inspected the source. The full game remains in progress.

The reviewer also independently ran the four package tests, all passing, and checked 500 generated boards against a separate triple-window matching oracle. Match unions, stable column order, survivor identity and input immutability all passed. These checks support the matcher/gravity foundation; they do not validate complete game timing, saves or player interaction.

| Finding | Existing requirement | Requirement improvement in revision 1.1 |
| --- | --- | --- |
| Phone boards and previews clip; hidden overflow masks the error | Responsive boards and no overflow | Assert actual essential element bounds for every preset; actual-width cell calculation; relocate preview and retain reachable controls |
| Cascades return final board immediately | Observable 7/6/9 tick stages | Require intermediate board snapshots and phase-specific input rejection tests |
| Cycling always resets the lock timer; grounded detection uses nonzero elapsed time | Eight resets and airborne recontact semantics | Specify initial zero-time contact, ninth reset, exhausted airborne/recontact and blocked movement fixtures |
| Blocked moves appear in legal actions | Legal action API and rejected-action identity | Require every listed action to succeed on that exact state |
| Public bounds differ from the design | Configurable size bounds | Require boundary/rejection tests before random consumption; distinguish kernel fixtures from public options |
| Keyboard handler captures form controls and omits documented keys | Keyboard parity and focus behaviour | Enumerate keys and focus exclusions as explicit browser assertions |
| Saves trust shallow checkpoint JSON | Validated replay and checkpoint verification | Require reconstructed recording, structural bounds and adversarial save tests |

These findings include implementation mistakes against already stated rules. The documentation improvement is making the rules difficult to misinterpret and their completion easy to verify; it does not redefine every defect as a missing requirement.

## Layout evidence and follow-up captures

At 320 pixels, the standard well starts at x=-0.5 and its preview reaches x=329.5. The wide well starts at x=-38.5 and its preview reaches x=367.5. At 390 pixels, the wide well starts at x=-30 and the preview reaches x=429. Body overflow is hidden, so document width alone reports a false pass. There were no page script errors in these six viewport/preset cases.

The linked screenshots are refreshed review captures, not archived images of the original defect. Current horizontal bounds pass at 320, 390 and 1280 pixels with visible overflow; phone board/control vertical reachability remains a separate UI correction.

- [320-pixel wide slice](review/slice-320-wide.png)
- [390-pixel standard slice](review/slice-390-standard.png)
- [Desktop standard slice](review/slice-1280-standard.png)

## Remaining review before the second game

Verify corrected source and UI, full Arcade and Daily clocks, challenge content and lessons, real phase playback, input scheduler, authoritative saves/replays, strict validation, packed consumer imports, API documentation and presentation. Run the tests independently when results are missing or failures occur. Update this file with exact completed checks and unresolved defects. Physical phone playtesting, fluent Japanese review and human feel approval remain separate pending evidence; browser emulation cannot fulfil them.

The owner authorized all four implementations on 2026-10-05, using bounded milestones. After the first rules/timing corrections pass independent review, the second implementation starts with the revised designs. Later first-game features continue through their own gates. Its initial deliverable is Stone Collapse's real selection/confirmation, compression, mask gravity and honest ending, with independent fixtures and responsive controls.

## Milestone process correction

The first assignment included a small slice followed by permission to continue the full game autonomously. That weakened the gate: later work could proceed before review findings were resolved. Revision 1.3 changes every design and reusable brief to one bounded milestone, a stop/report, independent review and an explicit next assignment. All four games are authorized for implementation, but commercial readiness still requires the separately identified human/device evidence.

### Rules/timing follow-up review

Eleven package tests pass independently. Two public-API probes nevertheless reproduce an unreplayable checkpoint after the unrecorded gravity-skip option and acceptance of a 10×20 Daily board. Source review also finds gravity applied at removal instead of a separate intermediate holes snapshot, and wall-clock access inside game creation. These are correction tasks before the foundation gate passes. All four designs and the reusable template now require public timing-option round trips, host-supplied daily dates, canonical daily settings and board snapshots that substantiate phase names.

### Rules/timing gate approved

The corrected Falling Triplets foundation passes 14 package tests and TypeScript checking independently. A separate public-API sweep passes 1,200 transition/save round trips across 30 seeds in Relaxed and Arcade play; the 500-board independent matching/gravity audit remains green. Source inspection verifies host-supplied Daily dates, canonical category bounds, removal holes before gravity, exhausted lock allowance and omission of the unrecorded gravity-skip option. This approves the rules/timing foundation for reuse, not the full game or phone experience. The next bounded assignment is modes/challenge setup and authoritative recordings; content and UI follow later review gates. Stone Collapse and Colour Chains have separate core-rules assignments against revision 1.2.

### Campaign policy correction

The owner clarified that campaigns need intentional complete counts, including existing 200/256 patterns, rather than a mandatory 100. The initial 30-board specification was chosen without examining the existing grader. Revision 1.3 now documents original generation, independent witnesses, deduplication, player-facing measures, deterministic grading before numbering, stable IDs and tested easy-to-hard order. Existing Tsunagi and Mahjong patterns were read directly from the active site's source without modifying it.
