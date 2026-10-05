# Acceptance and release checklist

Revision 1.3 · Copy this checklist into a release record. Replace unchecked boxes only with recorded evidence. This file defines future gates; it is not a completed verification report.

## Rules and state: hard gates

- [ ] Every specified rule, tie-break, score and terminal priority has a named test that would fail if that rule were removed or reversed.
- [ ] The examples in `reference/rules-fixtures.json` produce the expected board, clear sets and score; tests include ordinary and boundary cases in each design.
- [ ] Independent checker does not import the engine matcher/gravity/scoring functions it is checking. It verifies legal actions, every wave, final board and score from the recorded inputs.
- [ ] Invalid actions leave board, score, moves, random state and active-piece timers unchanged except an explicitly documented UI selection change.
- [ ] States/settings are not mutated; stable gravity preserves order and masks/IDs remain valid.
- [ ] 500 reproducible seeds per released default mode run through bounded scripted play and independent invariants, with failures saved as minimal fixtures. This is bug coverage, not evidence of fun or measured difficulty.
- [ ] Both falling engines reproduce the same canonical input replay with presentation rates 30/60/120Hz, irregular frames and pause/resume. Background tabs never catch up by killing a restored run.
- [ ] Gem Swap covers every special combination in both selection orders, cascade creation and protected-anchor overlap. Stone Collapse never silently auto-clears a new group.
- [ ] Terminal bonus/penalty is applied once. Restart, save and decode cannot award it again.
- [ ] All challenges in the declared complete campaign count per released game independently replay to their stated goal under the shipped rules/sequence. No unwitnessed solvability, optimality or uniqueness claim.

## Interaction and accessible play: hard gates

- [ ] Mouse, keyboard and touch can complete all tutorials and finish at least one run/challenge without switching input methods.
- [ ] No action requires drag. Gem Swap dragging creates at most one adjacent swap and handles cancellation. Collapse requires the specified confirmation.
- [ ] Controls are >=44×44 CSS px; focus is visible, logical and never trapped. Direct board cells meet the shared size/viewport rules.
- [ ] At 320/390/768/1280px, portrait and landscape: no page overflow, clipped score/preview, covered bottom controls or inaccessible settings.
- [ ] Light/dark page themes, all materials and selected/disabled/paused/result states have readable text. Test felt status separately from ivory controls.
- [ ] Essential small text meets 4.5:1 contrast; large text and essential UI marks meet 3:1. Each colour has a permanent symbol; selected/ghost/special states are distinguishable without colour alone.
- [ ] Reduced motion is useful, preserves all rules/timing, and avoids full-screen flashes. Sound can be muted independently; page load plays no audio before explicit enablement.
- [ ] Screen-reader labels explain selected stones, group size, active/next pieces, goals and end reason. A dedicated live region announces a wave summary, not fifty cell changes.
- [ ] Falling play has an untimed relaxed alternative. Timed play's full spatial speed experience is not claimed equivalent to screen-reader play; document practical limitations candidly.
- [ ] Focus loss/visibility pause, held-input release, pointer cancel and Continue countdown work. There are no stuck move/drop buttons.

## Reliability and performance: measured gates

- [ ] Name the tested physical devices: at least one current iPhone/Safari and one midrange Android/Chrome, plus desktop Chromium/WebKit/Firefox. Browser emulation supplements physical tests.
- [ ] Record reference-device model, OS, browser, build, viewport, power mode and measurement method. Do not claim physical certification from emulation.
- [ ] In a ten-minute standard run, input-to-first-visible-feedback p95 <=50ms, measured from event timestamp to first rendered change. Test 30 rapid alternating moves/rotations as well as ordinary play.
- [ ] Target median rendered frame rate >=55fps on a 60Hz reference phone, p95 frame duration <=33ms during standard cascades. If this fails, profile and improve before release; a user-selectable reduced-effects mode is documented and measured separately.
- [ ] No >100ms main-thread task attributable to ordinary gameplay. Large replay/content verification runs in a worker or a yielding job. Engine resolution advances in bounded phases.
- [ ] Start/restart/destroy 50 times: no orphaned listeners, timers, audio voices, live regions or growing detached DOM. After collection, memory settles near baseline; record measured trend rather than an invented universal MB allowance.
- [ ] Save/resume active, resolving and terminal states; stale/corrupt/oversized/unsupported saves fail clearly without overwriting the previous valid save.
- [ ] Storage unavailable/full and audio unavailable leave the game playable. A detached mount cleans up entirely. No unrequested network requests/telemetry.

## Human feel review: mandatory, separate from correctness

Review each game after its first slice and before release. Use at least three reviewers, including one new to that mechanic and one experienced with it; the owner can be one reviewer. At least one review is on a real phone. Record issues and repeat the affected review after fixes.

| Criterion | Score 1 | Score 3 | Score 5 |
| --- | --- | --- | --- |
| Controls | Repeated wrong/missed actions | Usable with noticeable friction | Predictable, responsive, easy to recover |
| Readability | Cannot follow results | Understands after explanation | Understands placement, clears and cascade order immediately |
| Satisfaction | Flat/confusing feedback | Pleasant but inconsistent | Clear anticipation, impact, falling and payoff |
| Depth and pacing | Repetitive or arbitrary | Some interesting decisions | Repeated meaningful decisions and a reason to replay |
| Learning | Needs constant help | Completes with some guidance | Learns through the lessons and applies the deeper mechanic |

Release target: average >=4 in every criterion, no individual score below 3, no unresolved repeated accidental-input complaint. These are operational acceptance targets, not a mathematical guarantee of commercial success. Owner explicitly accepts the finished feel; record that acceptance rather than assuming silence means approval.

New users must finish the core lesson unaided within five minutes and explain the match condition in their own words. Experienced users must intentionally achieve a two-wave Triplets cascade, a three-wave Colour Chains cascade, a planned Collapse clear and a Gem Swap special combination. Do not substitute autoplay for these tasks.

For level budgets, record completion and retry observations across reviewers. Easy/medium/hard names need human evidence. A challenge witness proves possibility, not difficulty. Tune sound, animation cadence, speed and content after these observations. Compare controls/readability to genre references without reproducing their branding/assets.

## Documentation and package presentation: hard gates

- [ ] README matches the established family: centred identity/subtitle, CI/npm/MIT/dependency/TypeScript badges, Play and API links, audiences, real desktop/phone screenshots, working installation/quickstart, modes, settings, materials, limits and family links.
- [ ] Complete source-derived API page covers every manifest export with signature and useful doc comment. Every entry has a purpose in README; browser-only registration is identified.
- [ ] No machine-specific filesystem paths appear in public signatures or examples. Documentation links/images return successfully on the deployed site and npm README, not just in a local checkout.
- [ ] Source-adjacent tests and README examples are actually run. Claimed framework integrations have real packaged-consumer/browser checks.
- [ ] `package.json`: MIT, owner, description, repository, homepage, bugs URL, relevant broad/game-specific keywords, supported Node range, declarations, exports, side-effect metadata and zero runtime dependencies.
- [ ] `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, changelog and asset ledger exist. Shared community text is byte-identical to the canonical owner copies, with drift tests.
- [ ] Demo family CSS/template are shared canonical files with pinned hashes. New family registration is coordinated rather than a divergent header/footer. Theme and language changes preserve the game.
- [ ] Presentation gate runs in standard `check` and release CI; deliberately omitting an API description/image/license field fails it. Ensure CI badge points to a real active workflow.
- [ ] Source, comments, tests, docs, demo, commits and release metadata use owner authorship without provider/tool/session acknowledgements. Preserve legitimate third-party asset/shared-file copyright notices.

## Release procedure

1. Freeze reviewed rules IDs and pin random/save/replay fixtures. Record the release's approved content and known limitations.
2. Run local and hosted checks: unit/types/lint/build/presentation, browser flows, content witnesses, packed consumer checks. Node 22/24 and packaged imports on Linux/macOS/Windows.
3. Pack and install the exact tarball in a clean consumer. Verify ESM and require for DOM-safe entries, declarations and browser-only registration; run a real game witness from the installed package. No secret/dependency/cache folder in the archive.
4. Generate real screenshots from that release; inspect them. Build/deploy the demo/API and verify public game flows and assets.
5. Update version, exported version constant, changelog, README options and release notes together. Commit under the owner's established identity, push, and tag the exact reviewed revision.
6. Publish through the established release workflow with provenance when configured. Fresh account authentication is supplied by the maintainer. A prepared tarball or successful build is not a published version.
7. Verify the exact npm version installs after registry propagation, and inspect its visible README, screenshots, API link, keywords and MIT metadata. Update the release record with evidence.
8. Provide the library handoff to the site maintainer; site integration remains separate.

## Release record template

```text
Package/version:
Commit/tag:
Released game IDs and rules versions:
Random-vector/save-fixture revision:
Content counts and witness check:
Unit/package/browser/hosted checks:
Physical devices and performance evidence:
Human review scores and owner acceptance:
Live demo/API/npm URLs and public image check:
Asset/copyright review:
Known limitations and deferred features:
```

## First slice review requirements

Revision 1.3 incorporates the [first implementation findings](DESIGN-REVIEW.md). Apply the completion contract appended to each game design: element-bound layout checks across every preset, observable phase snapshots, accurate legal actions, strict public validation, focus-safe keyboard controls and replay-authoritative saves. These supplement existing requirements and must be reflected in the coverage manifest.

## Revision 1.3 — Bounded implementation and review gates

The implementation assignment covers exactly one milestone at a time. After completing that milestone, stop and deliver the tested source revision, coverage table, actual player evidence when applicable, and remaining defects. The reviewer independently checks the work, assigns a bounded correction task for failures, updates this design when wording or examples were insufficient, and explicitly assigns the next milestone only after the gate passes. Do not interpret the full design as permission to continue through unreviewed later milestones.

1. **Core:** board/state validation, deterministic randomness, gravity and the game's basic input/preview. Prove identity and immutability.
2. **Rules:** exact matching/groups, resolution phase snapshots, score and ending order. Prove decisive independent fixtures.
3. **Timing and controls:** any falling clock/locking, held controls, focus/pause, keyboard and pointer parity. Prove boundaries and actual viewport element bounds.
4. **Modes and persistence:** all specified modes, objectives, canonical saves/replays, assistance and hostile input validation.
5. **Content and feel:** three interactive lessons, an intentionally sized, graded and ordered original challenge campaign (target 100; see LEVEL-GENERATION.md), both languages, original opt-in audio, materials and reduced motion. Human translation/device/feel approval is tracked separately and cannot be fabricated.
6. **Package and documentation:** source-derived API reference, README real images, MIT/community metadata, checked installed tarball, browser integration and complete coverage report.

A correction assignment contains the concrete defect, expected behaviour and regression check. Keep shared infrastructure under one owner and game modules under separate owners; no concurrent edits of the same files. Each later game begins from the revised requirements and reviewed shared contracts, with its own bounded milestone. All four games are authorized; site integration and npm publishing remain outside this implementation batch.

## Campaign generation and ordering policy

Follow [LEVEL-GENERATION.md](LEVEL-GENERATION.md): deliberate complete counts such as 100/200 or structured 128/256, not arbitrary unfinished totals; independently witnessed original boards; deterministic player-facing grading before numbering; simple openings and hardest endings; stable content IDs; deduplication and reproducible progression tests. Houseki targets 100 per game, with a reviewed smaller or larger complete count allowed when justified. Three separate tutorials do not pad the campaign count.

### Portable verification gate

Keep every required test fixture inside the repository. Verify an archive of the committed revision, not only the development workspace: tests, type checking and site generation must succeed without sibling projects, personal paths or uncommitted files. The installed tarball check separately verifies all declared entry points. A local pass that depends on external fixture files is incomplete.

### Play surface interaction

Pieces, glyphs, pebbles, board labels, previews and game controls must disable text selection (including Safari) and native dragging. Documentation and API prose remain selectable. Verify pointer dragging cannot highlight symbols or labels. Falling games support one-hand arrows (Up cycles/rotates clockwise) and physical keypad codes: 4/6 move, 7/9 reverse/forward rotation, 5 soft drop, 2 hard drop or Relaxed placement. Keypad controls work with Num Lock on or off; form fields retain native keyboard behavior. New/restarted games focus the play surface without scrolling. Native key repeat cannot multiply rotation or hard-drop actions.
