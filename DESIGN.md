# WME Junction Angle Info — Design Reference

This document records the design decisions and rationale behind three major subsystems:

1. **Roundabout entry-exit view** (`ja_draw_roundabout_entry_exits` in `WME-Junction-Angle-Info.js`)
2. **Far-turn markers** (JB / Path turns in `WME-Junction-Angle-Info-FAR-TURNS.js`)
3. **Double-turn detection** (`ja_collect_double_turns` in both files)

It is the companion to `USER-SETTINGS.md` (which covers end-user options).

---

## Roundabout Entry-Exit View

### When it fires

`ja_draw_roundabout_entry_exits(junctionId, entryNodeId, label_distance)` is called from `ja_draw_roundabout_markers` in two situations:

| Trigger | Entry node used |
| --- | --- |
| Entry road selected (`out_n === null`) | The junction-side node of the entry road |
| Single roundabout arc selected (`_selfeat[0].junctionId !== null`) | The arc's `fromNode` (`in_n`) |

When a roundabout arc is selected, `ja_draw_node_markers` is suppressed (set to run on an empty node list) so that regular intersection-angle markers do not fire on the arc's endpoint nodes and conflict with the roundabout view.

### Normal / Non-Normal criteria

All three criteria must be true for the entry point to be classified Normal:

| Criterion | Implementation |
| --- | --- |
| All exit angles within ±15° of a 90° multiple | `angleMod = triAngle % 90; angleMod <= 15 \|\| angleMod >= 75` per exit, then `exits.every(...)` |
| Total junction node count 2–4 | Unique `toNodeId` values across all `junction.segmentIds` |
| Max radius ≤ 25 m | `turf.distance(center, exitNode) * 1000` for each junction node; take the max |

The radius is the **max**, not the mean, so a single far-flung node disqualifies the whole roundabout. The overlay circle uses the **mean** — the two values serve different purposes.

### CCW angle and the U-turn encoding

For each exit the CCW angle (0–360°) is computed at the roundabout center:

```js
ccwAngle = (bearingToEntry - bearingToExit + 360) % 360;
```

In a right-hand-traffic (counterclockwise) roundabout this maps naturally: ~90° = first exit right, ~180° = straight, ~270° = left. LHT roundabouts run clockwise — the geometry is identical, only the **sort direction** flips (descending CCW for LHT so exits are numbered in the order encountered).

**U-turn special case:** The arc that returns to the entry node has `toNodeId === entryNodeId`. Two problems arise from the general formula for this case:

1. `processedNodes` deduplication would skip it if the entry node is pre-seeded — so the entry node is **not** pre-seeded; the map starts empty and the U-turn arc is processed like any other.
2. `(bearingToEntry - bearingToEntry + 360) % 360 = 0` — which sorts first and hits the wrong classification bucket. Instead, `ccwAngle = 360` is assigned: it sorts last (ascending sort, after all real exits) and correctly falls in the `>= 315` U-turn bucket.

Similarly, `triAngle` for the U-turn uses **180°** rather than calling `ja_angle_between_points` (which returns 0° for a degenerate triangle with the same p0 and p2). 180° accurately represents the heading reversal.

### Normal instruction classification (CCW thresholds)

```text
ccwAngle < 45 || >= 315  →  U_TURN    (purple)
ccwAngle  45 – 135       →  TURN_RIGHT
ccwAngle 135 – 225       →  BC        (Continue Straight, white)
ccwAngle 225 – 315       →  TURN_LEFT
```

`ja_draw_marker` is called for Normal exits so they receive direction arrows and respect the `angleDisplay` (Simple/Fancy) setting — the same rendering path as regular junction markers.

### Non-Normal ordinal labels

For Non-Normal exits, `sdk.Map.addFeatureToLayer` is called directly with:

```text
Simple:  "1st 67°"
Fancy:   "1st\n67°"
```

The triangle angle alongside the ordinal allows the editor to immediately see which exits are close to perpendicular (angle near 90°) and which are the problem exits.

### Diameter marker

After computing `maxRadius`, a center-point marker is placed showing `Ø<diameter>m`:

- **White** (`ja_routing_type.BC`) — radius ≤ 25 m
- **Orange** (`ja_routing_type.ROUNDABOUT`) — radius > 25 m

This gives immediate visual feedback on whether size is the disqualifying criterion, using the same orange/white language as the exit markers.

### Two-node path (not replaced)

`ja_draw_roundabout_markers` still falls through to the original triangle rendering code when `out_n !== null` **and** more than one feature is selected (i.e. two external segments). `ja_is_roundabout_normal` is still called there to place ±N° deviation markers. These two code paths are complementary, not overlapping — the arc-redirect guard fires only for single-segment selections.

---

## Far-Turn Design Reference

---

## Terminology

| Term | Meaning |
| --- | --- |
| **Far turn** | Any turn whose entry and exit segments are NOT directly adjacent — they connect via one or more intermediate segments (`segmentPath[]`) |
| **JB turn** | `isJunctionBoxTurn: true` — the path runs through a BigJunction polygon |
| **Path turn** | `isPathTurn: true` — the path is a Waze "Path" / Far Lanes Phase 2 object |
| **Entry node** | Node shared by `fromSeg` and `segmentPath[0]` — where the driver enters the JB/path |
| **Connecting node** | Node shared by `segmentPath[last]` and `toSeg` — where the path hands off to the exit segment |
| **`entryAngle`** | Departure bearing of `fromSeg` at entry node |
| **`firstExitAngle`** | Departure bearing of `segmentPath[0]` at entry node |
| **`lastPathAngle`** | Departure bearing of `segmentPath[last]` at connecting node |
| **`exitAngle`** | Departure bearing of `toSeg` at connecting node |

---

## Waze Routing Behavior (Ground Truth)

### Junction Box (JB)

| Aspect | Behavior |
| --- | --- |
| Instruction fires at | **First junction node** of the path (entry node) |
| What angle Waze uses | The overall entry→exit relationship |
| Override mechanism | JB exit arrow carries its own `instructionOpCode` (per-path, not per-node) |
| Restriction source | JB exit arrows (per-path). Local `isTurnAllowed=false` on internal nodes also blocks routing. |
| Internal nodes | Have underlying `isTurnAllowed=false` restrictions to **force** routing through the JB framework — these are NOT real user restrictions |

### Path (Far Turn / FL2)

| Aspect | Behavior |
| --- | --- |
| Instruction fires at | **First node** of the path (entry node) — but Waze decides instruction TYPE from the connecting-node local turn |
| What angle Waze uses | **Local instruction at the connecting node** (`lastPathSeg → toSeg`), unless the Path carries an override |
| Override mechanism | Path object carries its own `instructionOpCode` (per-path) |
| Restriction source | Paths cannot carry restrictions — restriction-free by design |
| Internal nodes | Regular road nodes — `ja_is_turn_allowed` works correctly there |

---

## The N-Step Instruction Algorithm

This is how Waze selects which node's instruction fires for JB/Path turns, and how JAI
mirrors that selection for display angle and type classification:

```text
Walk every node in pathSegs from entry to connecting:
    for each adjacent pair (pathSegs[i], pathSegs[i+1]):
        stepAngle = angle at their shared node

        if |stepAngle| >= TURN_ANGLE - GRAY_ZONE (~44°):
            → use stepAngle as display angle  [instruction fires at this node]
            BREAK

if no node cleared the threshold:
    → use connecting-node angle (step2) as display angle  [BC instruction]
```

| Case | Which node fires | Example |
| --- | --- | --- |
| **A** — entry node ≥ 44° | Entry node (walk breaks at i=0) | Hard left entering the JB |
| **B** — connecting node ≥ 44° | Connecting node (walk reaches last step) | Straight through JB, turn at exit |
| **C** — intermediate node ≥ 44° | Middle node (walk breaks at i=1..N-2) | At-grade connector: BC entry → LT middle → BC exit |
| **fallback** — all nodes < 44° | Connecting node angle, BC instruction | Fully straight-through path |

### Why the threshold is ~44°

An earlier version used 10°. This caused every exit sharing the same `segmentPath[0]` to
use the entry-node angle (step1), which is **identical** for all of them — producing
duplicate markers at the same angle. Using `TURN_ANGLE - GRAY_ZONE (~44°)` means a node
is only chosen when it represents a real TURN, so the BC fallback (connecting node, unique
per exit) applies for all near-straight entries.

### Confirmed with real JB (node 7538663 / 50472157)

| Route | entry node | connecting node | JAI displays | Case |
| --- | --- | --- | --- | --- |
| `67702190 → 9157462` | +81.67° ≥ 44° | −4.44° (BC) | +81.67° | A |
| `67702190 → 533496729` | (restricted) | — | No marker | JB restriction |
| `68437612 → 533496729` | ~7.67° < 44° | meaningful LEFT | step2 angle | B |
| `68437612 → 9157462` | ~BC | ~BC | step2 (BC) | fallback |

---

## Display Angle

Display angle and type classification always use the **same** selected `turnAngle` so that
the shown number matches the marker color.

| Turn type | `turnAngle` | Why |
| --- | --- | --- |
| Path | `ja_angle_diff(lastPathAngle, exitAngle)` | Connecting-node local turn — what Waze uses; unique per exit |
| Path fallback (`lastPathAngle == null`) | `ja_angle_diff(entryAngle, exitAngle)` | Connecting seg not yet loaded in model |
| JB Cases A/B/C | n-step walk result (first node ≥ 44°) | Mirrors which node Waze fires the instruction at |
| JB fallback (all nodes < 44°) | `ja_angle_diff(lastPathAngle, exitAngle)` | All straight/BC — instruction is BC at connecting node |

---

## Type / Color Classification

```text
Override check (turn.instructionOpCode) — tried first for BOTH types
        │
        ├─ opcode set → OverrideXxx type → orange outline
        │
        └─ opcode null ─┬─ isPathTurn
                        │     ja_guess_routing_instruction(connectingNode, lastPathSegId, toSegId, connectingAngles)
                        │     Connecting node is a regular road junction → full BC/KEEP/EXIT/TURN
                        │
                        └─ isJunctionBoxTurn
                              ja_guess_routing_instruction(connectingNode, lastPathSegId, toSegId, jbConnAngles)
                              Path validity walk already confirmed this turn is allowed at the connecting node.
                              │
                              ├─ result != NO_TURN AND NOT (result==BC AND |turnAngle|≥44°)
                              │     → use result (BC / KEEP / EXIT / TURN / U_TURN)
                              │
                              ├─ result == BC AND |turnAngle| >= TURN_ANGLE - GRAY_ZONE  [Case C override]
                              │     → connecting node is BC but instruction fired at intermediate node
                              │     → fall through to angle-based
                              │
                              └─ result == NO_TURN → fall through to angle-based
                                   |turnAngle| > U_TURN_ANGLE + GRAY_ZONE  → U_TURN
                                   |turnAngle| > U_TURN_ANGLE - GRAY_ZONE  → PROBLEM
                                   |turnAngle| >= TURN_ANGLE - GRAY_ZONE   → TURN
                                   else                                    → BC
```

All thresholds (`TURN_ANGLE`, `U_TURN_ANGLE`, `GRAY_ZONE`) are the same constants used
for regular local turn classification.

### Why JB uses `ja_guess_routing_instruction` (not angle-only)

Early implementation used angle-only thresholds for JB because `ja_guess_routing_instruction`
calls `ja_is_turn_allowed`, which returns `NO_TURN` for JB internal node restrictions —
wrongly classifying every JB exit as "disallowed turn" (gray).

The fix: the **path validity walk** (see Restriction Filtering below) runs before type
classification and skips any path where a node turn is blocked. Any turn that reaches the
classifier has already been confirmed allowed at every step — including at the connecting node.
So `ja_guess_routing_instruction` at the connecting node is safe, and gives full
BC/KEEP/EXIT/TURN resolution (including EXIT, which angle-only cannot detect).

`NO_TURN` from `ja_guess` at this point means a JB-forced internal restriction at the
connecting node specifically — a different mechanism than the path-level restriction filtered
above. The angle-based fallback handles those cases.

### Why not angle-only for JB

Angle-only thresholds have only four buckets: U_TURN, PROBLEM, TURN, BC. They cannot
distinguish EXIT or KEEP, which depend on road type context (e.g. a freeway ramp exit).
`ja_guess_routing_instruction` provides that context via the connecting node's segment types.

### Null filter on `connectingAngles`

Both Path and JB branches filter `ja_getAngle()` null returns before building the angles
array passed to `ja_guess_routing_instruction`. `ja_getAngle` returns null when a segment
is not yet loaded in the model. Without the filter, `parseFloat(null) = 0` creates spurious
0° angles that corrupt BC/KEEP/EXIT/TURN classification.

---

## Override Detection

Both JB and Path read `turn.instructionOpCode` directly from the `Turn` object returned by
`getTurnsFromSegment`.

**Why not `getTurnsThroughNode`:**
- JB overrides live on the BigJunction path, not on the underlying node turn.
- `getTurnsThroughNode` at a JB internal node will not find JB-level overrides.
- The `Turn` object from `getTurnsFromSegment` carries `instructionOpCode` directly.

`ja_guess_routing_instruction` has its own override check via `getTurnsThroughNode` for
regular node turns. For far turns, `turn.instructionOpCode` is checked before
`ja_guess_routing_instruction` is ever called — the two systems do not conflict.

---

## Restriction Filtering

**JB only** — Path turns cannot carry restrictions by design.

Full path validity walk in `ja_draw_far_turn_markers`:

```text
pathSegs = [fromSeg, segmentPath[0], …, segmentPath[last], toSeg]

For each adjacent pair (stepFrom, stepTo):
    stepNodeId = ja_get_connecting_node(stepFrom, stepTo)
    stepNode   = DataModel.Nodes.getById(stepNodeId)
    if !ja_is_turn_allowed(stepFrom, stepNode, stepTo) → pathBlocked = true; break
```

This catches JB per-path restrictions set on the exit arrow (which materialize as
`isTurnAllowed=false` on the internal node for that specific turn pair).

Because this walk passes for any turn that reaches the type classifier, the connecting
node's `lastPathSeg → toSeg` turn is confirmed allowed — making `ja_guess_routing_instruction`
safe to call there for JB turns.

---

## Marker Placement

| Turn type | Anchor point |
| --- | --- |
| JB turn | `turf.lineIntersect(toSeg, bigJunction.polygon)` → boundary crossing closest to connecting node |
| Path turn | `connectingNode.geometry` — no JB polygon to intersect |
| Fallback (no intersection) | `connectingNode.geometry` |

The JB boundary crossing matches where WME shows the exit turn arrow, keeping JAI's label
spatially consistent with the editor UI.

Label offset direction: `ha = exitAngle` — label pushed outward along the exit segment's
departure bearing, same convention as regular node markers.

---

## Shape / Visual Encoding

| Feature property | `graphicName` | Meaning |
| --- | --- | --- |
| `ja_is_far_turn: true` | `square` | Exit is not at this node — it's a JB/Path exit |
| `ja_is_far_turn: false/absent` | `circle` | Regular node turn |
| `ja_type === 'arrow_line'` | `circle` | Direction arrow line |
| `ja_type === 'roundaboutOverlay'` | `circle` | Roundabout ring |

Outline color: `#183800` dark green (standard); `#F68F23` orange (instructionOpCode override).
Shape alone distinguishes far-turn markers from regular node markers — no separate color needed.

---

## Key Function Reference

All far-turn logic is in `WME-Junction-Angle-Info-FAR-TURNS.js`:

| Function | Purpose |
| --- | --- |
| `ja_draw_far_turn_markers` | Main far-turn loop — entry point called from `testSelectedItem` |
| `ja_get_connecting_node` | Returns the shared node ID between two adjacent segments |
| `ja_is_turn_allowed` | Checks if a turn at a node is permitted (respects time restrictions) |
| `ja_guess_routing_instruction` | Full BC/KEEP/EXIT/TURN/U_TURN classifier using road type + angle |
| `ja_getAngle` | Returns departure bearing of a segment from a given node |
| `ja_angle_diff` | Signed angle difference between two bearings (−180 to +180) |

---

## Double-Turn Detection Design Reference

---

## Scope

Double-turn detection lives in `ja_collect_double_turns` in both:

- `WME-Junction-Angle-Info.js`
- `WME-Junction-Angle-Info-FAR-TURNS.js`

It is **not** involved in direct/local U-turn classification. Direct U-turns (same node, angle > `U_TURN_ANGLE`) are detected purely by angle inside `ja_guess_routing_instruction` with no road-type gate.

---

## Road-Type Gating — `ja_is_uturn_qualifying_road`

All three participants in a double-turn path (connector segment, incoming arm, outgoing arm) must pass `ja_is_uturn_qualifying_road(seg)` before the path is evaluated.

### Two-tier design

| Tier | Road types | Always included? |
| --- | --- | --- |
| **Always** | Freeway, Ramp, Major Highway, Minor Highway, Primary Street | Yes |
| **Opt-in** | Street, Parking Lot Road, Private Road | Only when the corresponding setting is `true` |

The opt-in tier is controlled by three user settings (`uTurnIncludeStreet`, `uTurnIncludeParkingLot`, `uTurnIncludePrivateRoad`), all defaulting to `false`.

### Why Street moved to opt-in

The previous function (`ja_is_up_to_primary_road`) included Street unconditionally. This produced frequent false-positive warnings in dense urban grids where Street-class connectors between parallel roads are common but carry no meaningful U-turn risk. Moving Street to opt-in eliminates the noise by default while preserving the ability to re-enable it for editors who need it.

### Why a separate function rather than modifying `ja_is_up_to_primary_road`

`ja_is_up_to_primary_road` is a pure road-tier predicate used in routing classification contexts (exit/keep detection) where the user setting should have no effect. `ja_is_uturn_qualifying_road` adds the settings layer on top without coupling those two concerns.

---

## Median Segment Check

The connector/median segment itself is checked against `ja_is_uturn_qualifying_road` in addition to both arms. Previously only the arms were checked, which allowed service roads and parking-lot connectors to silently qualify as medians. The check is applied:

- **First pass** (median selected directly): before entering the length check
- **Second pass** (arm selected): immediately after fetching the neighboring segment
