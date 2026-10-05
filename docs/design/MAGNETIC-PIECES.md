# Magnetic Pieces: proposed special-stone mode

Design status: proposed physics variant, not a current demo feature. Keep it distinct from Magnetic Blocks' floor and Floor Switch. Combining either mechanic requires an explicit interaction gate, not an assumption that all environmental options compose safely.

## Pieces and distribution

A magnetic stone keeps its stable ID and ordinary colour, plus an explicit magnetic property. Identify it by metallic surface, a clear magnet glyph and an accessible label; colour alone is insufficient. Optional anchored magnets need a separate fixed/anchor marking so players can distinguish a stone that moves from one that supplies a fixed attraction point.

Falling variants can include magnetic stones in the seeded piece queue. Their marking is visible in the next-piece previews and ghost. Full-board games can have them in a fixed or seeded starting layout; Gem Swap can optionally draw rare magnetic replacements during refill. Frequency is explicit per ruleset/level, initially rare, with bounded deterministic generation. Casual runs may vary seeds and positions; authored levels fix the layout and full queue or replayable generation seed and prove the resulting path. Do not add invisible magnetic flags after previewing a piece or silently change normal queue draws.

## Attraction and collision prototype

Magnetic stones attract along the same row or column only when the intervening cells are active and empty. They cannot pass through stones, obstacles, crack/mask gaps or portals. Horizontal free pairs move toward one another, one grid step at a time, until adjacent. They never occupy the same square or merge identities. For an odd remaining gap where both would target the same square, move the lower stable-ID stone first; the partner remains and they become adjacent. If only one partner is movable, it moves toward the fixed/anchored partner.

Choose eligible partners deterministically: shortest empty gap, then the sorted stable-ID pair. Select disjoint pairs for each attraction pulse, so a stone is not simultaneously pulled toward two targets. Preview the actual selected partners, movement and midpoint; never draw two different promised destinations for one stone. A pulse is bounded by the board dimensions and stops on adjacency or a new collision.

Vertical attraction uses the same unobstructed-column rule. Downward movement can pull a stone into a hole; upward movement can pull a movable stone toward an anchored magnet. An anchored magnet has genuine engine support and cannot fall; it is not merely a cosmetic marker. For unanchored vertical pairs, both can move toward the midpoint during a magnetic pulse, but ordinary gravity still applies afterward. Check newly formed matches before gravity so a useful upward alignment can matter. Each magnetic stone participates at most once per committed move, preventing repeated up/down cycles between attraction and gravity.

The first implementation prototype should keep adjacency without permanent bonds. Magnetic bonding, suspended clusters or pole repulsion would be separate later rulesets with their own component/support model. Do not quietly reuse floor-related block bonds or leave stones levitating without a declared support rule.

## Resolution and proof

On a committed move: ordinary initial clear/removal → one magnetic attraction pulse → new match check/removal → normal gravity/settling/refill → remaining ordinary cascades. Existing special activation follows the owning engine's declared policy; magnetic motion itself grants no score or inventory. Newly refilled magnetic stones wait until the next committed move's pulse. A moved target stays the same ID for objectives and witness tracing. Preview and save state include eligibility, partners, destinations, pulse-used flags, anchor status and actual events.

Implement grid attraction alone first with independent collision/partner oracles. Then add queue/layout generation, visible previews, matches and deterministic replay. Verify centre meeting with odd/even gaps, blocked lines, multiple partners, edge/masks, anchored upward pull, stable IDs, one-pulse limits, no repeated gravity loops, targets moving without being cleared, and batched tick parity. Authored levels grade decisions under the exact magnetic distribution and frequency; validate all witnesses before sorting a deliberate complete campaign count.

UI uses the family's materials, non-selectable glyphs, explicit keyboard/phone controls and reduced motion. Animation follows actual intermediate engine positions; magnetic shine does not replace the magnet symbol. No playable-support claim before engine, replay, generation and browser gates pass.
