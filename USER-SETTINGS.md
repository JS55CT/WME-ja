# WME Junction Angle Info — Settings Reference

This document describes each setting in the JAI sidebar panel.

---

## Selection modes

What you select in WME determines what JAI calculates and how many markers it draws.

| Selection                             | What JAI shows                                                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **1 segment (normal road)**           | Angles at both endpoint nodes — in Departure mode, exits from the selected segment; in Absolute mode, all wedges at each node      |
| **1 segment (roundabout entry road)** | All exits from that roundabout, classified as Normal or Non-Normal — see [Roundabout entry-exit view](#roundabout-entry-exit-view) |
| **1 segment (roundabout arc)**        | Same as selecting the entry road at that arc's start node — all exits from the roundabout                                          |
| **1 node**                            | All adjacent-pair angles at that node (Absolute mode behavior regardless of angle mode setting)                                    |
| **2 connected segments**              | A single turn-angle marker at the shared junction node, color-coded with the predicted routing instruction                         |
| **2 disconnected segments**           | Nothing — segments must share a node                                                                                               |
| **Mixed types or 3+ features**        | Nothing                                                                                                                            |

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

| Angle             | Classification      | Marker color                     |
| ----------------- | ------------------- | -------------------------------- |
| > 169.74°         | U-Turn              | Purple (`uTurnInstructionColor`) |
| 166.74° – 169.74° | Problem (gray zone) | Orange                           |

**How to see it:** Select any segment or node — departure markers appear on every exit, and any exit with a near-180° angle gets a purple U-turn marker. Or select two segments with that geometry to see a single marker for just that turn.

---

### Double-turn via short connector

A "double-turn" occurs when a driver crosses a short connector segment (the median) in a way that the combined heading change across both junctions is near 180°. The driver doesn't make one sharp U-turn — they make two separate turns across a short stub — but the net effect is a U-turn path.

JAI qualifies a segment as a potential median using the Waze U-turn spec:

| Connector length | Qualifies?                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| ≤ 30 m           | Always                                                                                         |
| 31 – 49 m        | Only if the **incoming segment** has lane guidance configured on its approach to the connector |
| ≥ 50 m           | Never                                                                                          |

The connector segment itself and both arms must meet the road-type threshold. Primary Street and above (Primary Street, Minor Highway, Major Highway, Ramp, Freeway) always qualify. Street, Parking Lot Road, and Private Road are excluded by default and can be individually enabled via the **U-Turn detection** settings.

**How to see it:**

1. Switch to **Departure mode**
2. Select **the connector segment itself** (not a node, not a longer road)

JAI then inspects every road connected at both ends of that connector. For each pair (road-in → connector → road-out) where the combined heading change is ~180° **and both turns are currently allowed**, it places a marker:

| Combined angle                     | Classification                                  | Marker color | Condition                                                     |
| ---------------------------------- | ----------------------------------------------- | ------------ | ------------------------------------------------------------- |
| 176.5° – 183.5°                    | **U-turn** — valid path; Waze would allow it    | Purple       | Waze restriction disabled, OR any of the 5 Waze criteria fail |
| 176.5° – 183.5°                    | **Disallowed** — Waze blocks this path          | Gray         | Waze restriction enabled AND all 5 Waze criteria met          |
| 173.5° – 176.5° or 183.5° – 186.5° | Problem (gray zone — near but not cleanly 180°) | Orange       | Angle is ambiguous; Waze criteria not met                     |

The **purple marker** indicates the driver could make a U-turn at this double-turn path — the geometry forms a U but there is no Waze algorithmic restriction preventing it.

> **Note:** This check only runs in Departure mode when a segment is selected (giving JAI both endpoint nodes to work with). Selecting just a node, or being in Absolute mode, will not trigger it.

---

## U-Turn detection settings

Controls which road types are eligible for **double-turn** detection. These settings have no effect on direct U-turns at a single node — those are always shown based on angle alone.

| Setting                                | Default | Effect when on                                                              |
| -------------------------------------- | ------- | --------------------------------------------------------------------------- |
| **Include Street roads**               | Off     | Street-class segments can act as the connector or arm in a double-turn path |
| **Include Parking Lot roads**          | Off     | Parking Lot Road segments can participate                                   |
| **Include Private roads**              | Off     | Private Road segments can participate                                       |
| **Disable for ≤15 m and ±5° parallel** | On      | Apply Waze's 15m & ±5° parallel criterion (see below)                       |

Primary Street and above always qualify regardless of the road-type settings.

### Waze double-turn restriction (≤15 m & ±5° parallel)

When **enabled**, this setting applies Waze's algorithmic restriction to double-turn paths. The restriction requires **all conditions**:

1. Three segments (A→B→C with B being the median)
2. Median B ≤ 15 meters
3. A and C within ±5° of parallel to each other
4. Both A and C pass road-type qualification: Primary Street and above always qualify; Street, Parking Lot Road, and Private Road only qualify if their respective toggle settings are enabled

When all criteria are met, the marker appears **gray** (`noTurnColor`), indicating the turn is **Waze-disallowed** due to the routing algorithm's penalty. If any condition fails, JAI falls back to the defult Double-turn via short connector (purple for valid U-turns, orange/yellow for ambiguous cases).

> **Why Street is off by default:** Street-class roads connecting across a median are common in dense areas and frequently produced false-positive U-turn warnings that were not actionable. Editors working in areas where Street-class medians are a genuine concern can enable the toggle.

---

## Junction Box (JB) support

A **Junction Box** (also called "BigJunction") is a complex intersection polygon in WME that contains multiple internal segments, nodes, and paths. JAI displays turn angles for both local turns at the first JB node and far-turn paths that cross through the entire JB.

> **Note:** Far-turn display for Junction Boxes is controlled by the **"Enable JAI for Junction Boxes"** experimental toggle in the settings. It is **disabled by default** — enable it in the Experimental card to see far-turn markers.

### Entry segment to Junction Box

When you select a **segment that crosses INTO a Junction Box** (one endpoint outside the JB, the other inside), JAI shows two things:

#### Local turn markers moved to JB boundary

The first node inside the JB has local turns (angles at that node connecting to segments that exit the JB). Instead of showing these markers at the local node (where WME used to place them), JAI now moves them to the **JB boundary crossing point** where the exit segment leaves the JB. This matches where WME has placed the turn arrows and TIO/VIO restrictions.

**Marker styling:**

- **Shape:** Square (not circle) — distinguishes boundary markers from regular local turns
- **Position:** Calculated using `turf.lineIntersect()` to find where the exit segment crosses the JB polygon, then placed at the closest intersection to the current node
- **Angle:** The local turn angle at the first JB node

**Example:** In an H-shaped JB with entry from the left:

- Entry segment: outside → enters JB at first node (left side of H)
- Local turns at that first node to exit segments: markers move to the right side of the H where those segments cross back out
- All markers appear as **squares** to indicate they are at boundary crossing points

#### Far-turn paths through JB

When the entry segment connects to paths that traverse the JB (multiple intermediate segments before exiting), JAI shows **far-turn markers** for each complete path:

- **Intermediate steps:** Circles placed at intermediate nodes along the path (breadcrumb trail)
- **Final exit:** Square placed at the JB boundary crossing point
- **Angle displayed:** See [U-turn paths](#u-turn-paths-through-jb) below
- **Restrictions:** JAI respects JB turn restrictions; restricted paths display as gray (`noTurnColor`)

### Median segments (100% inside JB)

When you select a **segment that is 100% contained inside a Junction Box** (both endpoints inside), JAI treats it as a normal local segment:

- No JB boundary logic is applied
- Local turns display as circles at the node (regular behavior)
- Markers are **not** moved to the boundary
- All existing local-turn and double-turn logic applies unchanged

This allows you to inspect a median segment's angles the same way you would any other segment.

### U-turn paths through JB

When a far-turn path through a JB has a **U-TURN instruction** set by the editor on the JB (via the turn instruction dropdown for that exit segment), JAI displays it with special handling (visible when **"Enable JAI for Junction Boxes"** is turned on):

**Angle calculation:**
The marker shows the **sum of all turn angles along the path** through the JB, not just the final connecting node's local angle. This is more robust for irregular or non-parallel junction geometries:

- Path: Entry → Node1 → Node2 → Node3 → Exit
- Angle displayed: `turn_at_Node1 + turn_at_Node2 + turn_at_Node3` = **accumulated total heading change**

For a true U-turn with ~180° path geometry, this displays approximately 180° regardless of how the intermediate path zigzags.

**Marker styling:**

- **Shape:** Square (placed at JB boundary crossing point where exit segment leaves the JB)
- **Color:** Purple (`uTurnInstructionColor`) — indicates explicit U-TURN instruction on the JB
- **Intermediate breadcrumbs:** Circles at intermediate nodes (for visibility of path structure)

**Suppression of local double-turn U-turns:**
When an entry segment crosses INTO a JB, the local double-turn detection for that segment is **suppressed**. This prevents duplicate U-turn markers (one from local logic, one from JB far-turn logic) appearing at the same location. The JB's turn instruction takes precedence.

- **Local double U-turns still work** for median segments (100% inside JB) and non-entry segments
- Only entry-crossing segments have local double U-turns suppressed

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

### Departure _(default)_

Shows the turn angle **from your selected segment to each possible exit**, with markers placed along each exit road.

- One marker per possible exit, placed along that exit road's own bearing
- The number is the **signed turn angle** between your incoming segment and the exit
- The selected segment itself is skipped (no marker for "straight back")
- Markers are placed at `ja_label_distance × 2` (further out) directly along the exit road
- When 2+ nodes are selected, also checks for **double-turn** connector segments (≤30 m always, or 31–49 m with lane guidance) that could trigger a U-turn or problem classification

**Use when:** You are routing through a junction and want to know what instruction each exit will produce.

---

## Angle display style

Controls **how the direction arrow is combined with the angle number** inside the circle marker.

Both styles use the same color coding, circle size, and routing instruction classification — the only difference is layout.

### Fancy _(default)_

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

| Position | Direction                  | Default |
| -------- | -------------------------- | ------- |
| 0        | Left (Turn)                | `⇐`     |
| 1        | Right (Turn)               | `⇒`     |
| 2        | Left-up (Keep/Exit left)   | `⇖`     |
| 3        | Right-up (Keep/Exit right) | `⇗`     |
| 4        | Up (Continue straight)     | `⇑`     |

Available sets:

| Option  | Characters                             |
| ------- | -------------------------------------- |
| `<><>`  | ASCII — plain `< >`                    |
| `⇦⇨⇦⇨⇧` | Outlined block arrows                  |
| `⇐⇒⇐⇒⇑` | Double-stroke arrows (left/right only) |
| `←→←→↑` | Simple thin arrows                     |
| `⇐⇒⇖⇗⇑` | Double-stroke + diagonal _(default)_   |
| `←→↖↗↑` | Thin + diagonal                        |

---

## Roundabout overlay display

Controls whether a circle is drawn over each roundabout on the map.

| Option                | Behavior                                                                               |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Never** _(default)_ | No overlay circles are drawn                                                           |
| **When selected**     | Circle appears only when a roundabout arc or entry road is selected                    |
| **Always**            | Circles are drawn on every roundabout visible in the viewport, regardless of selection |

The circle is sized to the **mean distance** from the roundabout center point to all of its junction nodes, so it approximates the physical footprint of the road ring.

Two color settings accompany this option:

**Roundabout overlay color** (default dark red `#aa0000`) — colors the **circle polygon** drawn around the roundabout ring. This setting only has any visual effect when "Show roundabout" is "When selected" or "Always". At the default **"Never"** it is never drawn and this color does nothing.

**Roundabout (non-normal) color** (default orange `#ff8000`) — colors two things independently:

- The **center-angle marker** placed at the roundabout center point — `colored orange (Non-Normal)` when the **specific path** you selected (entry node → center → exit node) is more than 15° off perpendicular. The same roundabout can show `white (Normal)` for one entry/exit pair and orange for another.
- The **`±N°` deviation markers** placed at individual exit nodes that are not perpendicular — colored orange at every exit whose angle is outside the 90° ± 15° range, regardless of the currently selected path.

When every exit in your selected path is within 15° of perpendicular, those markers render **white** (Normal).

---

## Roundabout entry-exit view

When you select a **roundabout entry road** or a **roundabout arc segment**, JAI shows a panoramic view of every valid exit from that entry point. This is the primary workflow for checking how a roundabout is classified and what instructions drivers will receive. JAI also respects turn restrictions set on exits — restricted exits display as NO_TURN (gray) markers and work correctly in both RHT and LHT roundabouts.

### What triggers it

| Selection                                                  | Entry point used                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------- |
| Entry road (external segment connecting to the roundabout) | The node where that road meets the roundabout ring                    |
| Arc segment (a segment inside the roundabout)              | The `fromNode` of that arc — the node where the driver enters the arc |

In both cases the view is identical: all exits visible from that entry point are shown.

### Normal vs Non-Normal classification

JAI applies the full three-criterion Waze rule to decide whether the roundabout is **Normal** or **Non-Normal** for this entry point:

| Criterion                 | Normal threshold                                                 |
| ------------------------- | ---------------------------------------------------------------- |
| All exit angles           | Within ±15° of a 90° multiple (i.e. `angle % 90 ≤ 15` or `≥ 75`) |
| Total junction node count | 2 – 4 nodes                                                      |
| Roundabout radius         | ≤ 25 m (max distance from center to any junction node)           |

All three must be met. If any fails, the entire roundabout is Non-Normal for that entry.

> Per Waze editor documentation: _"A roundabout can be both normal and non-normal at the same time depending on your entry node."_ The same physical roundabout may show Normal for one entry and Non-Normal for another if angles differ across entry points.

### Markers — Normal roundabout

When the roundabout qualifies as Normal, each exit receives a **direction-arrow marker** (same style as regular junction markers) colored by the instruction type:

| CCW angle from entry | Instruction            | Color      |
| -------------------- | ---------------------- | ---------- |
| < 45° or ≥ 315°      | U-Turn                 | Purple     |
| 45° – 135°           | Turn Right             | Blue/green |
| 135° – 225°          | Continue Straight (BC) | White      |
| 225° – 315°          | Turn Left              | Blue/green |

The **CCW angle** is measured at the roundabout center from the entry bearing to each exit bearing, going counterclockwise. In a standard right-hand-traffic roundabout (which runs counterclockwise), ~90° is the first exit to the right, ~180° is straight through, ~270° is left. Left-hand-traffic roundabouts (clockwise) use the same thresholds but exits are sorted in the opposite direction.

The **number** shown in the marker is the triangle angle (entry node → center → exit node). For a U-turn the triangle is degenerate (entry and exit are the same node), so JAI shows 180° — the actual heading reversal the driver makes.

### Markers — Non-Normal roundabout

When any criterion fails, exits are labeled with an **ordinal** ("1st", "2nd", "3rd" …) in orange (your **Roundabout Non-Normal Exit Color** setting), numbered in the order a driver encounters them going around the ring. The triangle angle is also shown alongside the ordinal:

| Angle display style | Label format                            |
| ------------------- | --------------------------------------- |
| Fancy               | `1st` on top line, `67°` on second line |
| Simple              | `1st 67°` on one line                   |

The triangle angle lets you compare each exit's geometry to the ±15° perpendicular threshold. Any exit more than 15° off a 90° multiple is the reason the roundabout is Non-Normal.

### Turn restrictions at roundabout exits

JAI detects local turn restrictions set on roundabout exits and displays them as **gray NO_TURN markers**:

- **Unrestricted exits:** Display with full instruction colors (purple for U-Turn, green for Turn, white for BC, etc.)
- **Restricted exits:** Display as gray (`noTurnColor`), indicating the turn is blocked
- **Works in both RHT and LHT:** The restriction detection uses the SDK's `Turn.isAllowed` property, which correctly handles direction calculations for both right-hand and left-hand traffic countries

When an exit has a local turn restriction set by an editor, JAI will override its normal marker color and display it as gray, making it visually distinct from unrestricted exits.

### Diameter marker (at the roundabout center)

A **Ø** marker is placed at the roundabout center showing the diameter in meters (max node-to-center distance × 2):

- **White** — diameter implies radius ≤ 25 m (radius criterion met)
- **Orange** — radius > 25 m (radius criterion is the reason this roundabout is Non-Normal)

This immediately flags whether the physical size of the roundabout is disqualifying it from Normal classification.

### Entry and exit leg lines

JAI draws thin lines from the entry node to the center, and from the center to each exit node, forming the spokes of the roundabout. These visualize which exits are being evaluated and make it easy to correlate each marker with its road.

---

---

## Path (FL2) support

A **Path** (also called "far-lane phase 2" or "FL2") is a Waze feature that provides improved lane guidance and turn instructions through complex intersections. Unlike Junction Boxes (which control routing), Paths are guidance-only and can now support turn restrictions.

### Entry segment to Path

When you select a **segment that is part of a Path**, JAI displays **far-turn markers** showing the complete angle trail through the Path:

- **Intermediate steps:** Circles placed at intermediate nodes along the Path (breadcrumb trail)
- **Final exit:** Square placed at the junction node where the Path exits
- **Colors:** Each marker is colored according to its local turn classification (Turn, Keep, Exit, U-Turn, etc.)

**Marker styling:**

- **Shape:** Circles for intermediate steps, square for final exit — matches Junction Box breadcrumb display
- **Position:** Intermediate circles at connecting nodes between median segments; final square at the exit node
- **Angles:** Each marker shows the local turn angle at its connecting node

### Deduplication across multiple Paths

When **multiple Paths traverse the same median segments**, JAI automatically deduplicates intermediate markers:

- Each unique (node, angle) pair is only drawn once
- The first Path to draw an intermediate marker "claims" it
- Subsequent Paths skip that marker to avoid visual clutter
- This allows complex intersections with overlapping Paths to remain clean and readable

**Example:** Two Paths (A→B and C→B) that both cross through the same median segment M will share the same intermediate marker at M's connecting node — it appears once, not twice.

### Path restrictions

Paths now support turn restrictions (new feature in WME). JAI respects these restrictions:

- **Unrestricted Path turns:** Display with full instruction colors (green for Turn, light green for Keep, light blue for Exit, purple for U-Turn, etc.)
- **Restricted Path turns:** Display as gray (`noTurnColor`), indicating the turn is disallowed
- **Restriction checking:** JAI checks the individual `turn.isAllowed` property for each Path turn

---

## Experimental features

Two new experimental features allow you to control whether JAI displays far-turn angle information. Both are **disabled by default** — enable them in the **Experimental** settings card if you want to use them.

### Enable JAI for Junction Boxes

Displays **far-turn breadcrumb trails through Junction Boxes**:

- When enabled: Selecting an entry segment shows circles at intermediate nodes and a square at the JB exit
- When disabled: Only local node turns are shown; far-turn information is hidden
- Use when: You need to trace complex paths through multi-node JBs to understand routing or identify missing turn restrictions

**Related settings:**

- Junction Box documentation is in the [Junction Box (JB) support](#junction-box-jb-support) section

### Enable JAI for Paths

Displays **far-turn breadcrumb trails through Paths**:

- When enabled: Selecting a segment part of a Path shows circles at intermediate nodes and a square at the exit
- When disabled: Only local node turns are shown; Path angle information is hidden
- Use when: You need to verify lane guidance angles along far-lane routes, check for missing restrictions, or understand the complete turn sequence

**Related settings:**

- Path documentation is in the [Path (FL2) support](#path-fl2-support) section

---

## Roundabout behavior — technical notes

### How roundabout detection works

When you select a segment or node, JAI inspects every connected node:

1. For each node, it checks whether any of its connected segments belongs to a WME junction (has a `junctionId`).
2. If a junction is found, JAI identifies the non-junction segment at that node as the entry road and the node itself as the entry point.
3. If both nodes of the selection touch the same junction, JAI records both as entry and exit — triggering the two-segment path mode instead of the entry-exit view.

### Overlay circle

When the overlay is enabled (`Show roundabout = "Always"` or `"When selected"`):

- **Radius** = mean distance from the roundabout's WME center point to all junction nodes
- **Shape** = 40-step polygon approximation
- The circle is an average — nodes that are unevenly spaced cause the circle to not align exactly with the road ring

---
