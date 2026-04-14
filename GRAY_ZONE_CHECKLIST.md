# Continuous Problem Detection - Gray Zone Checklist

## Overview
The continuous problem scanner detects turns in two gray zone ranges where Best Continuation (BC) matching fails, making routing instruction classifications unreliable. When BC matching is ambiguous (bc_count ≠ 1) within these zones, angles are flagged as PROBLEM. All flagged turns display with the "Angle to avoid" (red) color.

---

## Gray Zone 1: KEEP/TURN Boundary
**Display Angle Range:** 44° - 47°  
**Raw Angle Range:** 133° - 136°  
**Routing Types:** KEEP_LEFT, KEEP_RIGHT, TURN_LEFT, TURN_RIGHT  
**Issue:** Best Continuation filtering may classify as KEEP when geometrically closer to TURN

- [ ] Test: Find junction with 44.5° angle
- [ ] Verify: Marker displays as red (PROBLEM type)
- [ ] Verify: Angle label shows as 44° (not raw 136°)
- [ ] Verify: Only one marker (not bidirectional duplicate)
- [ ] Verify: Marker placed at correct bearing from node

---

## Gray Zone 2: U-Turn Gray Zone
**Display Angle Range:** 10° - 14°  
**Raw Angle Range:** 166° - 170°  
**Routing Types:** PROBLEM (explicitly flagged by ja_classify_turn_angle)  
**Issue:** Unpredictable routing; could be U-turn or regular turn depending on median length, restrictions

- [ ] Test: Find junction with 169° angle (node 7464024 from previous test)
- [ ] Verify: Marker displays as red (PROBLEM type)
- [ ] Verify: Angle label shows as ~11° (180 - 169)
- [ ] Verify: Only one marker (not bidirectional duplicate)
- [ ] Verify: Marker placed at correct bearing from node

---

## Cache Performance Tests

- [ ] Test: Pan away and back to same area - markers should appear instantly (cache hit)
- [ ] Verify: Debug log shows "cache hit: PROBLEM"
- [ ] Test: Edit a segment at a cached node - verify cache is invalidated
- [ ] Verify: Debug log shows cache recalculation after edit
- [ ] Test: Zoom in/out at same location - markers should persist (cache still valid)

---

## Performance & Rendering

- [ ] Test: Pan across area with 20+ problem nodes - no lag or stuttering
- [ ] Test: High zoom (22) - markers visible and well-positioned
- [ ] Test: Medium zoom (17-20) - markers visible with appropriate offset
- [ ] Test: Low zoom (13-16) - markers still visible (zoom filtering by viewport)
- [ ] Test: Toggle "Highlight problem angles" checkbox - layer appears/disappears

---

## Deduplication Tests

- [ ] Test: 4-way junction with problem angle - only ONE marker drawn (not 2)
- [ ] Test: 6-way junction with multiple problems - correct count (not doubled)
- [ ] Verify: On-demand JAI mode doesn't duplicate either (independent check)

---

## Layer & Styling

- [ ] Test: Problem markers use user-configured "Angle to avoid" color
- [ ] Test: Marker size consistent across viewport (no size variation from collision)
- [ ] Test: Marker z-index correct (appears above base map, below selection layer)
- [ ] Test: Layer toggle in Layer Switcher works
- [ ] Verify: Layer name is "problem_angles_continuous"

---

## Edge Cases

- [ ] Test: Node with only 2 segments - no markers (skipped correctly)
- [ ] Test: Node with 10+ segments - handles correctly without performance drop
- [ ] Test: Roundabout nodes - markers appear correctly
- [ ] Test: Junction Box nodes - markers appear correctly
- [ ] Test: Private Road junctions - markers appear if road type included in settings

---

## Documentation

- [ ] [ ] USER-SETTINGS.md updated with "Highlight problem angles" description
- [ ] [ ] Explain what each gray zone means
- [ ] [ ] Explain why these angles are problematic
- [ ] [ ] Provide examples of how to fix each type

---

## Final Integration Test

- [ ] All 2 gray zones have been located and verified in actual map data (44-47° and 166-170°)
- [ ] Continuous scanner correctly identifies same problems as on-demand JAI
- [ ] Performance is acceptable at all zoom levels
- [ ] Markers display correctly with user's color preferences
- [ ] Documentation is complete and accurate
