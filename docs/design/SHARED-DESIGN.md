# Shared design contract

Revision 1.3 · Applies to all four games. Game-specific rules take precedence where they explicitly differ. Package invariants are in [PACKAGE-ARCHITECTURE.md](PACKAGE-ARCHITECTURE.md).

## Player experience

Every game opens with one clear Play action, the selected mode and a short description of its goal. Defaults work immediately. Board and material settings belong beside the board on a desktop and in a labelled expandable panel on a phone. Advanced settings never block the first game. Keep the game readable during motion and make cascades feel earned.

Modes use plain names: **Relaxed**, **Arcade**, **Daily**, **Challenges** where supported. The game designs define their exact differences. Do not use one universal mode switch when the games have different meanings.

| Game | Japanese title | Short English introduction | Draft Japanese introduction |
| --- | --- | --- | --- |
| Falling Triplets | 三つの宝石 | Cycle the colours. Line up three. Let them fall again. | 色の順番を変えて、三つ並べましょう。消えたあとは、宝石が落ちます。 |
| Stone Collapse | 石くずし | Clear groups of stones. Plan what falls next. | つながった石を消しましょう。次に落ちる石も考えます。 |
| Colour Chains | 色の連鎖 | Join four colours. Build the next chain. | 同じ色を四つつなげて、連鎖を作りましょう。 |
| Gem Swap | 宝石ならべ | Swap neighbours. Make matches and special gems. | 隣り合う宝石を入れ替えて、三つ並べましょう。 |

Japanese titles and prose are working copy. Require fluent review before declaring the translation reviewed. During development use the family's visible translation-review note. All controls, status messages, rules, error recovery, labels and tutorials have English/Japanese entries; changing language preserves the run.

## Visual reference and identity

Open [the reference](reference/visual-reference.html). It establishes layout, board proportions, material treatment, status placement, gem symbols and controls. It is proposed, not yet approved. The implementer captures the real playable slice alongside this reference for the first review.

Use unchanged canonical `family.css` and `family-template.mjs` in the demo. Package styling is a separate stylesheet. Add a new family member through the canonical coordinated family update; do not rewrite the shared header/footer independently. The host site's own layout stays the host's responsibility.

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f4efe4` | `#141614` |
| Ink | `#1f2320` | `#ece8dc` |
| Surface | `#fbf8f1` | `#1d201e` |
| Muted text | `#6b6f68` | `#a09d93` |
| Rule | `#ddd6c6` | `#3a3d38` |
| Felt | `#2f5d4a` | `#214337` |
| Felt text | `#f3efe4` | `#f3efe4` |
| Accent | `#b5452c` | same |
| Brass frame, package token | `#a98954` | same |

Use the family system font and its code font. Status over felt uses felt text; controls on ivory use ink. Never inherit page ink into a felt status or vice versa. No tiny score counters over busy gems.

Pieces default to polished stones, with optional faceted glass and wood. The three skins preserve the exact same IDs, symbols, geometry, hit targets and rules. Original SVG paths, shallow highlights, no external textures. The board default is ivory in all page themes; slate and wood are optional materials. Colour is on the pieces, not an entire rainbow page.

| Colour ID | Default fill | Permanent inset symbol |
| --- | --- | --- |
| `red` | `#b5452c` | circle |
| `blue` | `#366f91` | diamond |
| `green` | `#3e7957` | triangle |
| `gold` | `#9c7117` | square |
| `purple` | `#765785` | plus |
| `teal`, optional sixth | `#287b7b` | crescent |

Use ivory symbols, minimum 10px at the smallest supported cell size, and dark outer edges. Permanent symbols stay visible under selection and flashes. Special-gem markings are added around them, rather than replacing the colour symbol. Alternative accessible palettes may change fills while preserving symbol mapping. Verify contrast, not just the sample values.

## Layout and boards

Desktop: board/player area plus a compact settings column; score, goal and next piece stay close to the board. On phones the board comes before optional settings; falling-game controls remain directly under it. Keep the next-piece preview visible while playing. The family header appears above the game, not inside the board.

Test widths 320, 390, 768 and 1280 CSS px, portrait and landscape. No horizontal page scrolling. Buttons are at least 44×44px. Matching cells are at least 32px where space allows; a 320px-wide 8-column board may use 32px cells. Falling wells have no per-cell tap requirement. A custom board that would make directly selectable cells smaller than 28px gets an explicit zoom/pan board viewport and keyboard access; it does not shrink until unusable.

Default boards are rectangular. Stone Collapse and Gem Swap support tested masks. Falling wells support narrow, standard, wide and tall rectangles; decorative hearts and stars are not supported wells in v1 because obstructed falls change the game. Settings menus only offer validated boards for their game.

## Controls and focus

Falling games: left/right buttons, cycle or rotate buttons, soft drop and a labelled Place button. Touch holds repeat through the same input scheduler as keys. Swipe left/right by one cell is an optional equivalent; vertical scrolling must still work outside the board. Downward swipe is soft drop, never an accidental hard drop. Place is the only touch hard-drop gesture in v1.

Keyboard: Left/Right move; Down soft drop; Space hard drop; Escape pause. Triplets use Up/X to cycle forward, Z to cycle backward. Pairs use Up/X clockwise and Z anticlockwise. Key repeat comes from the game's own scheduler, not the operating system. Ignore repeat keydown events. Prevent browser defaults only while game controls are focused. Releasing focus or a held pointer releases every held action.

Turn-based games: tap a piece/group, then tap the target/selection to confirm as described per game. Mouse uses the same sequence. Gem Swap also accepts a single-cell drag. Keyboard arrows move a visible focus cursor; Enter/Space selects and confirms; Escape clears selection. No action requires dragging. UI buttons and game actions are separate controls.

Input arbitration: a pointer owns at most one held action. Simultaneous opposite directions cancel. Rotation/cycle is a single edge event, never auto-repeated. Per tick, resolve the final lateral action, then cycle/rotation, then hard drop, then soft/gravity drop, then grounded lock timing. Hard drop ends processing for that piece. Canonical input recording is defined in the architecture document.

## Animation and sound

The engine emits positions and events; rendering never decides a match or changes a score. Target a reliable 60Hz presentation on the reference phone, while simulation is fixed at 60 logical ticks/second. Render interpolation can run at any display rate. Clearing effects cannot obscure destinations or previews.

| Effect | Initial presentation target |
| --- | --- |
| Lateral move / rotation / cycling | Immediate logical change, 50–80ms visual interpolation |
| Hard drop | 80–120ms trail; next piece waits for resolution |
| Clear mark | 120ms highlight with symbols visible |
| Clear removal | 90ms fade/shrink |
| Gravity | 120–200ms distance-sensitive drop; no bounce that hides final cells |
| Chain announcement | Non-blocking `Chain 2`, `Chain 3`; 500ms dwell |
| Invalid move | 100ms return and clear status explanation; never a violent shake |

Engine resolution windows: clear-mark 7 ticks, removal 6 ticks, gravity 9 ticks. These constants are part of a rules version once released. Visual durations can be shorter without changing rules or accepting an extra action. Each animation phase has a skip-to-end presentation path; reduced motion shows simple fades and the same events. Turn-based moves remain gated until the engine returns `ready`; a held falling action is released during resolution, not carried into the next piece.

Optional sounds: move, rotate/cycle, place, clear, ascending chain cue, special activation, win and loss. Default sound is off until deliberately enabled. Mute, volume and reduced motion are separate preferences. Use original synthesized tones or source-verified CC0/public-domain assets; keep an asset ledger. Do not require music for playing or scoring. Avoid overlapping fifty clear sounds: one cue per wave and one bounded special cue.

## Practice, saving and daily play

Daily seed is `YYYY-MM-DD` in UTC plus game ID and daily-rules version. It defines a starting board/piece sequence, not necessarily a proven puzzle. Every player gets the same start and rules; distinct play can consume refill values differently. Share game ID, seed, rules version, settings and input replay, not a client-declared score alone.

Challenges have a fixed start, fixed piece/refill sequence if applicable, goal and optional move limit. Every shipped challenge has a replayable witness proving the stated goal attainable. A witness is not a unique-solution or optimum claim. Daily games without such a witness are labelled score challenges.

Save at stable states and serialize active/resolving state when leaving a falling game. Pause before encoding. A resume cover requires explicit Continue, then a three-second countdown for falling games. Restart reproduces the original seed and settings; New game chooses a new seed. Neither changes material, language or accessibility preferences.

Undo is available only where the game design allows it. Using a hint or undo marks a run assisted permanently; restarting creates a fresh unassisted run. Sound, language, board material and reduced motion never mark assistance. A timed run that is paused becomes practice for score comparison. The standalone demo has local scores; it makes no claim of trusted global ranking.

## Tutorial and content

Each game ships three short interactive lessons: core action, its matching rule, and its defining deeper mechanic. The player performs the action; text alone is not a tutorial. Each lesson resets and can be skipped/replayed. Keyboard and touch paths both complete it.

Each game ships an intentionally sized, independently witnessed and graded campaign. Houseki targets 100 challenges per game; 50, 200 or a structured 128/256 are also valid deliberate counts when justified by variety and progression. See [LEVEL-GENERATION.md](LEVEL-GENERATION.md). A renamed seed is not a new designed challenge. Level names, expected learning outcome, witness, rules version and tested difficulty are in the content manifest. Difficulty labels remain provisional until human playtests.

## Exclusions and follow-up

No Itsutsu integration in this work. No accounts, network play, paid boosters, energy/lives economy, advertisements or external telemetry in the package. Competitive modes, larger level campaigns and a level editor are later work after the four solo games meet their individual gates. Offline operation covers packaged/local assets once loaded; do not promise installable offline web-app behaviour without separately implementing it.

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

### Play surface interaction

Pieces, glyphs, pebbles, board labels, previews and game controls must disable text selection (including Safari) and native dragging. Documentation and API prose remain selectable. Verify pointer dragging cannot highlight symbols or labels. Falling games support one-hand arrows (Up cycles/rotates clockwise) and physical keypad codes: 4/6 move, 7/9 reverse/forward rotation, 5 soft drop, 2 hard drop or Relaxed placement. Keypad controls work with Num Lock on or off; form fields retain native keyboard behavior. New/restarted games focus the play surface without scrolling. Native key repeat cannot multiply rotation or hard-drop actions.


## Material settling requirement

Ordinary falling and gravity resolution should use subtle accelerating descent and a tiny contact recovery, without changing logical rules or delaying input. Follow the material-settling section of [Bounce and nature modes](BOUNCE-AND-NATURE.md), including reduced-motion behaviour. This polish applies independently of optional nature modes.


## Shared animation setting

Owner-approved requirement, 2026-10-05: material settling applies to all four games—Falling Triplets, Stone Collapse, Colour Chains and Gem Swap. Enable it by default and expose a shared player-facing Animation On/Off control. For full-board games, apply it to gravity and refill movement; for falling games, also apply it to falling and landing movement.

Use one presentation option, `animations: boolean`, default `true`, shared by the demo adapters. Persist the user's preference locally across games and reloads. It is not an engine rule, campaign difficulty parameter, replay action or assistance flag. Explicit Off renders authoritative final cells immediately and removes movement, bounce, squash and decorative transition effects without changing input or resolution timing. Respect system reduced-motion preferences even when the setting is On; render final positions with a brief static contact indicator. Provide equivalent English/Japanese labels and keyboard-accessible controls.

Verify default On, explicit Off, cross-game preference persistence, reload, reduced-motion suppression and identical engine outcomes in both settings. This is an implementation requirement; documented support must not be described as shipped until the actual players expose and honour the control.
