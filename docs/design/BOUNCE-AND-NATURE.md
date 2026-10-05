# Bounce and nature modes

Status: optional Shizen rebound is implemented in Colour Chains; ordinary landing animation is shared across the four primary players. Owner: John Morris. Updated 2026-10-05.

## Player promise

Gentle placement is controlled. A power drop can produce a small, readable rebound when the piece contacts settled tiles or the floor. The result can help or hinder a planned match. Introduce this first as an optional falling-game variant, leaving the familiar placement rules available.

## First playable slice

Use the existing logical grid and fixed clock. A power drop lands, then receives at most one rebound attempt. Preview the final landing before confirmation. The rebound chooses a one-column left or right displacement and an optional quarter-turn only when every destination cell is valid and empty. If neither displacement fits, remain at the normal landing. After the attempt, apply that game's normal bond breaking, gravity, matching and ending rules. No repeated hopping or sideways movement during a clearing cascade.

The default is deterministic: prefer the direction of the last deliberate horizontal input; with no such input, alternate direction by committed placement number. An optional seeded variation can choose direction, but must expose the result in the landing preview and preserve it in saves and replay. Gentle Place and soft-drop locking have no displacement. A small visual squash or rotation must never imply a different logical cell.

Start with Colour Chains pairs. Keep the pair together during the rebound, then split and settle using its ordinary independent gravity. Falling Triplets needs a separate design for orientation-changing bundles; do not silently change its vertical-column identity. Magnetic Blocks may later rebound as a bonded 2×2 block before the magnetic floor splits it. Full-board games need a separately specified projectile tool rather than applying falling controls to every stone.

## Feel and configurable materials

A brief rise, fall, squash and slight spin can evoke raindrops or balls. Reduced motion shows the final cells with a short highlight. Piece size or material can later vary rebound strength, but the first version uses one shared one-cell bound. Do not add continuous physics, arbitrary collision geometry or uncontrolled randomness to this first slice. A later physics sandbox can have broader motion without changing puzzle campaign rules.

## Interaction with other nature effects

Resolve input and impact first, rebound second, landing/bond breaking third, attraction/gravity fourth, then matches. A consumed piece cannot bounce. Portal and fracture cells are forbidden destinations. Magnetic Impact removes its contact layer once; rebound must not repeat the attack. Keep these combinations disabled until their separate fixtures are implemented. Introduce bounce on selected authored levels before considering frequent or rare arcade schedules.

## Verification and delivery

Verify both directions, walls, occupied cells, rotation bounds, gentle versus slammed placement, deterministic replay, immutable IDs, disabled-mode parity and reduced motion. Add a small playable checkpoint before expanding materials or combinations. Commit compilable, tested increments with honest development status; visual tuning and human difficulty review can follow without holding back working progress.

## Approved naming

| Name | Japanese | Meaning | Fit |
| --- | --- | --- | --- |
| Shizen | 自然 | Nature | Approved umbrella for nature mechanics, including magnetic attraction, bounce and floor conditions |
| Tenki | 天気 | Weather | Clear fit for rain, lightning and storm modes |
| Arashi | 嵐 | Storm | Approved intense storm mode: earthquakes, lightning and more frequent disruptions |

Owner-approved on 2026-10-05: Houseki remains the package and gem collection name. Shizen names the broader nature-mode collection; Arashi names its more intense storm mode. Tenki remains an unused alternative. These display names do not create another package or imply implemented support. Preserve stable game IDs and existing saves.


## Material settling for ordinary play

Owner-requested presentation requirement, 2026-10-05: all four games use material-settling animation, enabled by default and configurable Off through the shared Animation setting. All falling and gravity-settling pieces should convey a small amount of weight when animation is enabled, even with Shizen and Arashi disabled. This is presentation polish, separate from the optional gameplay rebound.

Animate displacement from the last observed cell to the next observed cell. Use gentle acceleration on descent, then a short deceleration/compression on contact. Start tuning with a 100–180 ms ordinary settlement and a 40–70 ms recovery, within the existing logical resolution window; scale travel duration within a cap rather than making tall drops wait indefinitely. A tiny rebound of approximately 1–2 px, capped at 4% of cell size, and subtle vertical squash are sufficient. Do not add sideways drift or rotation to ordinary settling. Hard drops can use a stronger contact accent while remaining immediate and responsive to input.

Logical positions, collisions, match timing, lock timing, score and replay remain authoritative and unchanged. The rendering layer must not delay a new input or a logical phase to finish an effect. Reconcile interrupted animations to the current state; avoid queued animations lagging behind rapid play. Keep indicators and target previews stable. Animate transforms rather than changing cell layout, and preserve existing gem identity across movement.

Reduced motion uses the final cell directly with a brief contact highlight, without bounce or squash. Verify gentle placement, hard drop, single-cell descent, long gravity falls, cascades, rapid repeated input, resizing and pause/resume. Confirm ordinary settling does not enable the Shizen gameplay rebound. Status: specified; implementation and visual tuning pending.
