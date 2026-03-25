# WME Junction Angle Info — Settings Reference

This document describes each setting in the JAI sidebar panel.

---

## Selection modes

What you select in WME determines what JAI calculates and how many markers it draws.

| Selection | What JAI shows |
| --- | --- |
| **1 segment** | Angles at both endpoint nodes — in Departure mode, exits from the selected segment; in Absolute mode, all wedges at each node |
| **1 node** | All adjacent-pair angles at that node (Absolute mode behavior regardless of angle mode setting) |
| **2 connected segments** | A single turn-angle marker at the shared junction node, color-coded with the predicted routing instruction |
| **2 disconnected segments** | Nothing — segments must share a node |
| **Mixed types or 3+ features** | Nothing |

### Two-segment mode

Selecting exactly two segments that share a node is the classic JAI workflow for inspecting a single turn:

1. Click the incoming segment.
2. Ctrl+click (or Shift+click) the exit segment.
3. JAI draws **one marker** at their shared junction, showing the turn angle and the predicted Waze instruction (Turn Left, Keep Right, BC, U-Turn, etc.).

This is equivalent to reading the marker that Departure mode would place on the exit segment — but with two segments selected you get a clean, uncluttered view of just that one turn, with no markers from the other exits at the node.

The angle mode setting (**Absolute** / **Departure**) has no effect in two-segment mode — the output is always the signed turn angle between the two selected segments, classified with the full routing-instruction prediction logic.

---

## U-turn detection

JAI detects two distinct U-turn scenarios, each requiring a different selection to trigger.

### Direct U-turn (single junction)

When the turn angle between two roads at a node is near 180°, JAI classifies it using these thresholds:

| Angle | Classification | Marker color |
| --- | --- | --- |
| > 169.74° | U-Turn | Purple (`uTurnInstructionColor`) |
| 166.74° – 169.74° | Problem (gray zone) | Orange |

**How to see it:** Select any segment or node — departure markers appear on every exit, and any exit with a near-180° angle gets a purple U-turn marker. Or select two segments with that geometry to see a single marker for just that turn.

---

### Double-turn via short connector

A "double-turn" occurs when a driver crosses a short connector segment (the median) in a way that the combined heading change across both junctions is near 180°. The driver doesn't make one sharp U-turn — they make two separate turns across a short stub — but the net effect is a U-turn path.

JAI qualifies a segment as a potential median using the Waze U-turn spec:

| Connector length | Qualifies? |
| --- | --- |
| ≤ 30 m | Always |
| 31 – 49 m | Only if the **incoming segment** has lane guidance configured on its approach to the connector |
| ≥ 50 m | Never |

The incoming and outgoing arms of the path must also be Street class or above (Street, Primary Street, Minor Highway, Major Highway, Ramp, or Freeway).

**How to see it:**

1. Switch to **Departure mode**
2. Select **the connector segment itself** (not a node, not a longer road)

JAI then inspects every road connected at both ends of that connector. For each pair (road-in → connector → road-out) where the combined heading change is ~180° **and both turns are currently allowed**, it places a warning marker:

| Combined angle | Classification | Marker color |
| --- | --- | --- |
| 176.5° – 183.5° | **U-turn** — the path forms a U-turn and there is no restriction to prevent it | Purple |
| 173.5° – 176.5° or 183.5° – 186.5° | Problem (gray zone — near but not cleanly 180°) | Orange |

The purple marker here means the same thing as a direct U-turn marker in color, but the cause is different: the driver is not making one sharp U-turn — they are making two separate turns across a short connector that together add up to a ~180° heading change. The script is telling you that a U-turn is likely and there is no restriction in place to prevent it.

> **Note:** This check only runs in Departure mode when a segment is selected (giving JAI both endpoint nodes to work with). Selecting just a node, or being in Absolute mode, will not trigger it.

---

## Angle mode

Controls **what angle value is calculated and where markers are placed**.

### Absolute

Shows the angular gap between each adjacent pair of roads at the junction, placed in the space between them.

- One marker per adjacent segment pair — at a 4-way junction you get 4 markers, one in each "wedge"
- The number is **how wide that wedge is** (always 0–360°)
- Marker is placed at the midpoint of the gap, at distance `ja_label_distance × 1.25` from the node
- When a single segment is selected at a 2-segment node, the reflex angle (>180°) is suppressed — only the acute side is shown

**Use when:** You want to understand the geometry of the junction itself, independent of direction of travel.

### Departure *(default)*

Shows the turn angle **from your selected segment to each possible exit**, with markers placed along each exit road.

- One marker per possible exit, placed along that exit road's own bearing
- The number is the **signed turn angle** between your incoming segment and the exit
- The selected segment itself is skipped (no marker for "straight back")
- Markers are placed at `ja_label_distance × 2` (further out) directly along the exit road
- When 2+ nodes are selected, also checks for **double-turn** connector segments (≤30 m always, or 31–49 m with lane guidance) that could trigger a U-turn or problem classification

**Use when:** You are routing through a junction and want to know what instruction each exit will produce.

### Comparison

| | Absolute | Departure |
| --- | --- | --- |
| Question answered | "How wide is the gap between these roads?" | "How many degrees do I turn onto this road?" |
| Marker position | Midpoint of the gap between segments | Along the exit segment's own bearing |
| Marker count | One per adjacent pair (all gaps) | One per possible exit (excluding selected) |
| Segment selection required | No | Only meaningful when ≥1 segment is selected (has no effect in two-segment mode) |
| Marker distance from node | `× 1.25` | `× 2` |

---

## Angle display style

Controls **how the direction arrow is combined with the angle number** inside the circle marker.

Both styles use the same color coding, circle size, and routing instruction classification — the only difference is layout.

### Fancy *(default)*

The direction arrow is placed on its **own line above** the angle number:

```text
⇒
45°
```

- Every routing type uses `arrow + "\n" + number` — the circle renders as two lines (taller)
- `PROBLEM` type adds `"?\n"` above the number
- Override types show only the arrow when "Show angles of override instruction" is off, or `arrow + "\n" + number` when it is on

### Simple

The direction arrow sits **on the same line** as the angle number:

```text
⇒45°    or    45°⇐
```

- Left/keep-left/exit-left: arrow prepended — `⇒45°`
- Right/keep-right/exit-right: arrow appended — `45°⇐`
- No separate `PROBLEM` case — falls through to bare number with no arrow
- Override types: same logic as Fancy but no newline separator

---

## Direction arrows

Selects the **character set** used for direction arrows in both display styles.

The setting stores a 5-character string. Each position maps to a direction:

| Position | Direction | Default |
| --- | --- | --- |
| 0 | Left (Turn) | `⇐` |
| 1 | Right (Turn) | `⇒` |
| 2 | Left-up (Keep/Exit left) | `⇖` |
| 3 | Right-up (Keep/Exit right) | `⇗` |
| 4 | Up (Continue straight) | `⇑` |

Available sets:

| Option | Characters |
| --- | --- |
| `<><>` | ASCII — plain `< >` |
| `⇦⇨⇦⇨⇧` | Outlined block arrows |
| `⇐⇒⇐⇒⇑` | Double-stroke arrows (left/right only) |
| `←→←→↑` | Simple thin arrows |
| `⇐⇒⇖⇗⇑` | Double-stroke + diagonal *(default)* |
| `←→↖↗↑` | Thin + diagonal |

---

## Roundabout overlay display

Controls whether a circle is drawn over each roundabout on the map.

| Option | Behavior |
| --- | --- |
| **Never** *(default)* | No overlay circles are drawn |
| **When selected** | Circle appears only when a roundabout arc or entry road is selected |
| **Always** | Circles are drawn on every roundabout visible in the viewport, regardless of selection |

The circle is sized to the **mean distance** from the roundabout center point to all of its junction nodes, so it approximates the physical footprint of the road ring.

Two color settings accompany this option:

**Roundabout overlay color** (default dark red `#aa0000`) — colors the **circle polygon** drawn around the roundabout ring. This setting only has any visual effect when "Show roundabout" is "When selected" or "Always". At the default **"Never"** it is never drawn and this color does nothing.

**Roundabout (non-normal) color** (default orange `#ff8000`) — colors two things independently:

- The **center-angle marker** placed at the roundabout center point — `colored orange (Non-Normal)` when the **specific path** you selected (entry node → center → exit node) is more than 15° off perpendicular. The same roundabout can show `white (Normal)` for one entry/exit pair and orange for another.
- The **`±N°` deviation markers** placed at individual exit nodes that are not perpendicular — colored orange at every exit whose angle is outside the 90° ± 15° range, regardless of the currently selected path.

When every exit in your selected path is within 15° of perpendicular, those markers render **white** (Normal).

---

## Roundabout behavior and what the markers mean

JAI has special handling whenever a selected segment or node touches a **WME junction** (roundabout). Understanding this behavior helps diagnose roundabout geometry problems.

### How roundabout detection works

When you select a segment or node, JAI inspects every connected node:

1. For each node, it checks whether any of its connected segments belongs to a WME junction (has a `junctionId`).
2. If a junction is found, that junction is treated as a roundabout for the purposes of this calculation.
3. JAI identifies two key roads for each detected roundabout:
   - **`in_s` / `in_n`** — the non-junction segment and node at the entry side (the road approaching the roundabout, or the arc segment's own entry node)
   - **`out_s` / `out_n`** — the non-junction segment and node at the exit side

### Markers placed for roundabout selections

#### Center-angle marker (at the roundabout center)

When both an entry node (`in_n`) and an exit node (`out_n`) are identified, JAI draws a **single angle marker at the center point of the roundabout** and two thin lines forming the legs of the triangle (entry node → center → exit node).

The color is determined **per path** — based solely on this specific entry/exit angle, not on whether other exits are perpendicular:

- **White (normal)** — the path angle is within 15° of perpendicular (90° ± 15°). Waze gives normal roundabout instructions fro the movment.
- **Orange (non-normal)** — the path angle is more than 15° off perpendicular. This entry/exit combination Waze will give non-normal roundabout instructions for this moment.

>Per Waze editor documentation: *"A roundabout can be both normal and non-normal at the same time depending on your entry node."* This is why the same roundabout can show white for one selected arc and orange for another. See the [Roundabout Wazo Page for more](https://www.waze.com/discuss/t/roundabout/377970).

The number shown is the **raw triangle angle** (entry node → center → exit node), not the deviation from perpendicular. A perfectly perpendicular exit produces a center angle of exactly 90°. An exit that is 42.92° off perpendicular produces a center angle of 47.08° (because 47.08° + 42.92° = 90°). The corresponding `±N°` deviation marker at that exit node will always show the complement: `90° − center_angle` (or `center_angle` itself if the path is less than 45°).

#### Exit-road departure markers (Departure mode)

The normal departure-mode calculation still runs for the entry road. Each drivable exit from the roundabout's junction nodes receives a departure-angle marker along the exit road, color-coded by routing instruction:

| Routing type | What it means |
| --- | --- |
| **Normal** (white) | Entering or continuing inside the roundabout — Waze normal roundabout spoken instructions |
| **ROUNDABOUT_EXIT** (Exit Color defaults to Blue) | Exiting the roundabout onto a non-junction road — Waze gives the approperate Normal or non-normal exit instruction |

The color-coding makes it immediately visible which arcs are continuations and which exits will generate a spoken instruction.

### `ja_is_roundabout_normal()` — what "normal" means

This function runs whenever a roundabout is selected. It checks every exit node and places a `±N°` deviation marker at any exit that is not within 15° of perpendicular. The check works like this:

1. For every junction arc segment, the node at its **`toNodeId`** end is examined.
2. A node qualifies as a valid exit if at least one of its non-junction connected segments is drivable outward (checked with `isTurnAllowedBySegmentDirections`).
3. For every valid exit node (excluding the entry node `n_in`), the angle formed by the triangle **entry node → roundabout center → exit node** is computed. The angle is then normalized to the nearest 90° boundary: `angle % 90`.
4. If the normalized angle is outside `[0°, 15°]` and `[75°, 90°]` — i.e., the exit is not within 15° of perpendicular — a `±` deviation marker is placed at that exit node in `Roundabout Non-Normal Exit Color` defult is Orange.

**What the `±N°` marker means:** The exit road at that node is `X°` away from a right angle. It is computed as `Math.min(angle % 90, 90 − angle % 90)` — the minimum distance to the nearest 90° boundary — so it always reads between 0° and 45°.

**Relationship to the center-angle marker:** Both values come from the same triangle angle. The center marker shows the raw angle (e.g. 47.08°); the `±N°` marker at the corresponding exit shows how far that angle is from the nearest perpendicular (e.g. ±42.92°, because 90° − 47.08° = 42.92°). The two numbers are different by design — they answer different questions about the same geometry.

### Overlay circle

When the overlay is enabled, `Show roundabout = "Always" or "When Selected"` draws a circle for each relevant junction:

- **Radius** = mean distance (in meters) from the roundabout's WME center point to all of its junction nodes, converted to kilometers for Turf.js
- **Shape** = 40-step polygon (smooth approximation)
- The circle is not a perfect fit — it is an average, so nodes that are unevenly spaced will cause the circle to not align exactly with the road ring

---
