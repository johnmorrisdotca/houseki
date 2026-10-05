# Black Hole: advanced Gem Swap power

Design status: proposed advanced mechanic, not part of the current playable tray. Implement only after the ordinary tray review gate; do not advertise it as shipped.

## Intended experience

A rare stored power places a fixed dark portal on the board. Gems that touch it disappear as the board settles. Players choose where to open it, then use later swaps to feed it. A visible charge ring and move counter explain how much power remains. This belongs first in Gem Swap; the falling games and Stone Collapse retain their distinct rules.

## Limits and reward

Enable only through an explicit advanced-tools ruleset or an authored later level. Inventory cap is one. Casual advanced play earns one charge after 48 ordinary cleared gems, independently of the ordinary tool award cycle; capped awards are discarded and progress carries. Tool-origin clears and their cascades cannot earn this reward. Daily and existing tool-free levels have no implicit portal power.

The portal consumes at most eight gems and lasts for at most three committed moves, including its placement move. Selection, targeting, cancellation, rejected actions, animation ticks and pause do not reduce duration. Only one portal may be active; placement while another is active is unavailable. The portal closes immediately on its eighth consumed gem or after the third move settles. The player sees both remaining capacity and remaining moves.

## Placement and contact contract

Use the same tray flow: select Black Hole, select an occupied active square, inspect the initial effect, then explicitly confirm. Placement consumes that square's gem as the first of eight charges and consumes one move. The fixed portal stays at that cell; it does not fall, shift columns, refill as a gem, or become a colour-match participant.

Contact means sharing an orthogonal edge with the portal; diagonal gems are untouched. Existing neighbours can be consumed immediately. New neighbours are checked after each settling/refill stage. Consumption is deterministic in row-major order when the remaining capacity cannot consume every neighbour. Every gem ID is consumed at most once. A swallowed special gem disappears without firing its beam/bomb/burst, so the portal remains its own mechanic and a predictable tactical sink.

An open portal cell is a temporary barrier to gravity and refill. Original board masks remain immutable; settling treats the portal square as an occupied non-gem tile and each side of its column as a separate gravity segment. Consumption opens nearby spaces and induces further ordinary settling; it never teleports gems through the portal. When it closes, its cell becomes an ordinary empty active cell and the board settles/refills normally. Mask gaps remain gaps. Portal-origin removal and resulting cascades do not earn stored tools.

## Scoring and presentation

Consume actual stones, scoring 10 points per consumed gem with no new combo multiplier. Normal matches still use ordinary wave scoring. Portal use marks assistance. It must not satisfy an authored objective through ambiguous hidden score or a cosmetic-only animation. The engine owns capacity, duration, consumed IDs, effective collision mask, removal origin, preview and events.

The player renders a high-contrast dark disc with a bright ring, an icon distinct from black/grey stones and a textual label. The ring loses segments as gems are consumed. Respect reduced motion: use a short fade rather than spinning or pulling animations. Show remaining capacity and moves next to the tool tray. Initial preview shows placement and first deterministic contact wave; label later contacts as dependent on subsequent moves, never promise an uncomputed complete chain.

## Required gate before implementation approval

A bounded engine milestone must prove deterministic placement/initial contact, edge/mask clipping, diagonal exclusion, exact eighth-gem closure, third-move expiry, no decrement on UI actions or ticks, special swallowing without activation, barrier gravity/refill, closure/refill, no earning loop, one-portal limit, undo/restart and mid-resolution replay. Compare batched and sequential ticks and an independent contact/capacity oracle. Authored portal levels require explicit inventory/rules, complete solving witnesses and difficulty measured with the portal available. Follow with desktop/phone, keyboard, focus and reduced-motion browser checks. No release or level claims before these gates pass.
