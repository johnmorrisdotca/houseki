# Stored tools and tray

Gem Swap and Stone Collapse have an optional stored-tool mode. Tools are separate from special gems already on the board. Ordinary play remains available without the tray. This change does not add tools to either falling game.

## Inventory and earning

The host enables `tools: true` for casual play. The demo enables it by default for these two games. Inventory is run-local, deterministic, capped at three of each tool and reset on restart. No purchases, random awards, timers or cross-game currency.

- Gem Swap: Bomb, Row clear, Colour clear; start with one of each. Every 12 stones removed by ordinary swaps (including their cascades) grants one tool, cycling Bomb → Row clear → Colour clear → Bomb. Surplus carries to the next threshold. A full slot discards that award; the award cursor still advances.
- Stone Collapse: Bomb and Pick; start with one of each. Every 12 stones removed through ordinary group removals grants one tool, cycling Bomb → Pick → Bomb. The same cap and overflow rule apply.
- Tool-triggered removals and their cascades never earn tools. Selecting, retargeting, cancelling and invalid actions never consume inventory, moves, score, random draws or progress.
- Using a tool permanently marks that run assisted. Awarding a tool alone does not. Daily has no tools. Existing authored challenges have no implicit tools.

## Targeting and confirmation

Select a tray tool → select an occupied active board cell → see highlighted affected cells and count → Confirm or Cancel. Confirm is an explicit separate action, never a second accidental tap. Selecting another tool replaces the preview. Ordinary piece selection exits tool targeting. No native text selection or dragging on pieces, previews, labels or controls. Escape cancels targeting. Keyboard grid focus supports arrows and Enter/Space; tray controls are actual labelled buttons with 44-pixel minimum targets and visible focus.

The engine owns the selected tool/target and computes the preview; the player must not duplicate effect rules. Tool selection and targeting are accepted only on a stable ready board. Confirmation revalidates inventory and current target. Resolve through the existing observable 7/6/9-tick phases. One confirmed tool use consumes one move.

## Effects

- Bomb: occupied active cells in the target-centred 3×3 square. Clip at edges and mask holes.
- Row clear (Gem Swap): every occupied active cell in the target's row, including across mask gaps. This is distinct from a row-beam gem that falls with the board.
- Colour clear (Gem Swap): every occupied gem of the target's colour.
- Pick (Stone Collapse): remove exactly the chosen stone, including a singleton.

Gem Swap blasts activate existing special gems once by stable ID, using the same fixed-point effects as ordinary play. A tool blast does not itself create a new special gem; subsequent natural cascade matches can. Score actual uniquely removed gems using ordinary wave scoring. Stone Collapse tools score 10 points per removed stone, then normal settling and one-time end adjustments; they do not receive a group-size multiplier. A live tool can rescue a casual board with no ordinary legal moves; do not terminate until neither an ordinary move nor a tool use exists. Empty-board victory takes precedence.

## Persistence and level generation

All inventory, earning counters/cursor, assisted status and pending target/preview belong in authoritative state. Stone Collapse undo restores pre-move inventory and earning state but keeps assisted sticky. Saves replay initial tool configuration and tool actions; reject tampered inventory and previews. Preview actions must be bounded and replayable. Gem Swap persistence is a later existing milestone; its future replay contract includes these fields.

Existing tool-free campaign difficulty and witnesses remain valid. Future authored tool levels must explicitly declare initial inventory, earning policy, move budget and a complete witness including tool/target/confirm steps. Grade with the supplied tools, verify the witness through the engine and an independent effect oracle, and measure alternative choices. Do not retrofit free powers into an existing level or advertise supported tool challenges until the constructor, replay and grading gates pass. Tool-enabled casual scores remain visibly assisted.

## Player layout and verification

Place the tray beside the board near score on desktop, below the board on narrow screens. Show icon plus readable name plus remaining count, disabled empty slots, an earning meter, selected state, affected-cell highlights, Confirm and Cancel. English and Japanese use the same layout. Preserve selectable documentation and API prose.

Check exact bomb clipping, row/colour unions, special activation overlap, preview versus committed effects, no cost on cancel/invalid use, inventory cap/carry/cursor, no self-reward loops, sticky assistance, singleton rescue, last-use termination, ordinary play parity with tools disabled, undo/save/restart, masked boards and ticks batching. Browser-check both games at 390 and 1280 pixels, keyboard-only targeting, touch confirmation, cancellation, empty counts and non-selectable play surfaces. Root reviews each bounded mechanics milestone before player work proceeds.
