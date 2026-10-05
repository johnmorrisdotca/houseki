# Environmental modes and deep boards

Design status: proposed optional rulesets, not current demo features. Preserve ordinary play and the four existing engines' authored witnesses. Start with Gem Swap and Stone Collapse; Magnetic Blocks can reuse the concepts only after its own prototype gate.

## Earthquake

Provide separately named Fault, Jumble and Combined options. Event timing can be frequent, occasional, rare, one authored mid-level event or an explicitly seeded surprise schedule. Authored levels declare their exact event rules and seed. A brief tremor announces an event before it resolves at a safe placement/move boundary; an event never silently changes a target between preview and confirmation. Reduced motion substitutes an icon/label for shaking.

Fault opens a narrow jagged crack, using a bounded top-to-bottom path whose next row moves at most one column left or right. Keep the fault inside the board, leaving useful playable regions on both sides. Crack cells become non-playable and any stones swallowed by the crack are removed once with explicit events; this is a real change to collision, grouping and gravity. The original mask remains immutable; a separate authoritative fault mask represents the current board. Stones cannot match, fall or compress across the crack. Shaped and fractured boards keep their fixed columns and vertical segments instead of rectangle-wide column compression. Render the crack as a material gap, distinguish it from an ordinary empty cell, and update previews.

Jumble chooses a bounded connected patch, initially up to 3×3, and permutes the occupied eligible stones using the level's deterministic random stream. Preserve each gem's stable ID, colour and special kind; change positions. Exclude mask gaps, portal cells, fixed obstacles and any current controlled falling piece. A successful shuffle must change at least one stone's position; bounded retries either find a nontrivial permutation or explicitly emit an unchanged event. Do not create/destroy colours, duplicate identities or silently refill the patch. Existing bonds in a Magnetic Blocks patch need a separately tested bond-breaking rule; never move individual bonded gems while pretending their block stayed rigid.

The jumble can disrupt a future match or create a beneficial one. Resolve settling and new matches through ordinary observable phases. Combined performs Fault first, then chooses a Jumble patch from surviving eligible cells. Cap fault/shuffle/cascade work; one scheduled earthquake fires once, not repeatedly because its own clear creates another event. The quake does not award stored tools through its removals or resulting cascades. Use separate score events and score categories for environmental play.

## Lightning

A strike enters from the top and removes exposed top-layer stones, not an entire unseen column. The first proposal selects one to three declared/seeded columns and removes at most two exposed occupied stones per selected column, top to bottom. Mask gaps and non-gem portal/obstacle cells are respected. A brief bolt indicator identifies the chosen columns before removal. Do not damage off-board pieces or clear buried layers beyond the declared limit. Optional zigzag visuals must match actual struck cells; no cosmetic blast outside the engine effect.

Resolve ordinary settling afterward; existing special-gem activation policy must be explicit for this ruleset. The initial proposal swallows struck specials without firing, preserving a predictable limited top-layer attack. Lightning removal and resulting cascades cannot re-award themselves or stored tools. Authored objectives and witnesses include the strike schedule and damage limit. Reduced motion uses highlighted struck cells and a short fade rather than flashing.

## Deep boards

Start with a separate Stone Collapse deep-board option: for example 8×24 or 8×32 visible cells, rather than stretching the normal board. Gem Swap can follow after its deep refill/performance checks. The player intentionally scrolls vertically within the play area, while score, tool inventory, confirmation/cancel and level objective stay reachable. Provide a scroll-position strip or small board overview, plus top/bottom navigation. Keyboard arrows navigate cells and scroll the focused cell into view. Preserve phone-readable stone sizes; do not squeeze all deep rows into one screen.

Engine operations run across the whole actual board. Gravity, connected groups, cracks, strikes, targets and tool previews cannot stop at viewport edges. A target above/below the visible area has an offscreen affected-count indicator and an easy jump to the preview; confirmation describes total affected cells. Preserve viewport position during updates and restore it on resume. Onscreen effects should scroll only when the player requests it or a focused keyboard cell moves out of view.

Do not enable the option by bypassing existing bounds in the player. Define separate engine dimension/cell/queue/move-budget limits, generate original complete levels, grade their navigation and strategic demands, prove witnesses, and profile whole-board operations. Authoritative saves must remain within their documented resource budget; derive or compact undo history through canonical replay rather than serializing unbounded deep-board snapshots. A deliberate 50/100/200 or structured 128/256 count follows the shared level policy; longer boards alone do not establish higher difficulty.

## Bounded implementation and verification

Implement one effect at a time: deterministic patch shuffle, then fault mask and settling, then limited lightning, then deep-board dimensions/navigation. Each has its own pure engine oracle and full-state replay checks before player integration. Cover stable IDs, masks, edge clipping, changed previews, no reward loops, goal/end priority, target survival, combined-event order, tool/portal interactions and batched tick parity. The generator must replay the declared environment sequence and measure decisions under that ruleset. Surprise casual play can be optional; an authored puzzle is not claimed solvable under every arbitrary random quake.

Browser gates cover 390/1280 sizes, non-selectable stones, focus, explicit confirmation, keyboard scrolling, offscreen affected cells, reduced motion and a long session on a deep board. None of these future modes changes current Daily or published level rules implicitly.
