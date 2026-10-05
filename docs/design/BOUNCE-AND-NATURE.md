# Bounce and nature modes

Status: proposed optional rules, not implemented or released. Owner: John Morris. Updated 2026-10-05.

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

## Naming options

| Name | Japanese | Meaning | Fit |
| --- | --- | --- | --- |
| Shizen | 自然 | Nature | Recommended umbrella for magnets, earthquakes, weather and bouncing materials |
| Tenki | 天気 | Weather | Clear fit for rain, lightning and storm modes |
| Arashi | 嵐 | Storm | Energetic name for disruptive challenge modes |

Houseki remains the approved gem collection name. Shizen could name its nature-mode collection now, with a separate package considered only if the mechanics grow beyond gem games. These are naming suggestions; no repository or registry availability is claimed. Renaming display text must preserve stable game IDs and existing saves.
