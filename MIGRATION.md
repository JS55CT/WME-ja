# WME Junction Angle Info — v3.0.0 Migration Record

This document records all changes made between the last committed state (`7ab681a` — the
adopted milkboy/WME-ja codebase) and the current v3.0.0 working tree. The migration was
performed phases outlined below.

---

## Baseline: Pre-Migration State

The adopted codebase (`7ab681a`) was the original milkboy v3.0.0 shell — structurally
identical to the 2.x GreasyFork release but with a bumped version number and no functional
changes. Key characteristics:

| Area | Pre-migration |
| --- | --- |
| Entry point | `run_ja()` function called by WazeWrap bootstrap callback |
| Script injection | `GM_addElement` to inject Turf.js at runtime |
| Data model | `W.model.segments`, `W.model.nodes`, `W.model.junctions`, `W.model.streets` |
| Map/geometry | OpenLayers 2.x (`OL.Geometry.Point`, `OL.LonLat`, etc.) |
| Coordinate system | EPSG:900913 (Spherical Mercator) — meters, not degrees |
| Map layer | `W.map.addLayer(new OL.Layer.Vector(...))` |
| Feature rendering | `new OL.Feature.Vector(geometry, null, style)` |
| Events | `WazeWrap.Events.register(...)` |
| Sidebar | `WazeWrap.Interface.AddTabPane(...)` |
| Layer checkbox | `WazeWrap.Interface.AddLayerCheckbox(...)` |
| Left-hand traffic | `W.model.isLeftHand` |
| Imperial units | `W.prefs.get('isImperial')` |
| JSHint globals | `/*global I18n, $, W*/` |

---

## Phase 1 — Bootstrap & Script Loading

**Problem:** `GM_addElement` script injection is unreliable in modern Tampermonkey and
incompatible with the WME SDK initialization model. The SDK requires `await bootstrap()` to
be called before any SDK method is used.

**Changes:**
- Removed `GM_addElement` Turf.js injection; added `@require https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js` to userscript metadata
- Added `@require https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js`
- Added `@grant GM_xmlhttpRequest` and `@grant GM_info` (required by Bootstrap.js update monitor)
- Added `@connect greasyfork.org` (required for update check)
- Added `@exclude *://*.waze.com/editor/sdk/*` to prevent running on SDK doc pages
- Replaced `@match` URLs with wildcard form `*://*.waze.com/*editor*`
- Changed outer IIFE from named `run_ja()` function to `async (function () { ... })()`
- Added `var sdk;` declaration at top of IIFE
- Replaced WazeWrap bootstrap callback with:
  ```javascript
  sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl: '...' } });
  ```
- Updated `/*global*/` declaration to include `bootstrap, turf, getWmeSdk, SDK_INITIALIZED, GM_info, GM_xmlhttpRequest`
- Removed `/*jshint*/` directives (no longer used)

---

## Phase 2 — Events

**Problem:** `WazeWrap.Events.register()` is a legacy wrapper. The SDK exposes events
directly via `sdk.Events.on()` with renamed event strings.

**Changes:**

| Before | After |
| --- | --- |
| `WazeWrap.Events.register(W, 'afterlogin', ...)` | Replaced by SDK ready state via `bootstrap()` |
| `WazeWrap.Events.register(W, 'selectionchanged', ja_calculate)` | `sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: ja_calculate })` |
| `WazeWrap.Events.register(W, 'afterundoaction', ja_calculate)` | `sdk.Events.on({ eventName: 'wme-after-undo', eventHandler: ja_calculate })` |
| Map move event | `sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: ... })` |
| Map zoom event | `sdk.Events.on({ eventName: 'wme-map-zoom-changed', eventHandler: ja_calculate })` |

Segment/node data change tracking added using `sdk.Events.on` with
`wme-data-model-objects-changed` (trackDataModelEvents pattern) to trigger recalculation
when the map model updates.

---

## Phase 3 — Data Model

**Problem:** All `W.model.*` data access is removed from the SDK; data must be retrieved
via `sdk.DataModel.*` namespaced methods.

**Changes:**

| Before | After |
| --- | --- |
| `W.model.segments.getObjectById(id)` | `sdk.DataModel.Segments.getById({ segmentId: id })` |
| `W.model.nodes.getObjectById(id)` | `sdk.DataModel.Nodes.getById({ nodeId: id })` |
| `W.model.junctions.getObjectById(id)` | `sdk.DataModel.Junctions.getById({ junctionId: id })` |
| `W.model.streets.getObjectById(id)` | `sdk.DataModel.Streets.getById({ streetId: id })` |
| `W.model.isLeftHand` | `(sdk.DataModel.Countries.getAll()[0] \|\| {}).isLeftHandTraffic \|\| false` |
| `W.prefs.get('isImperial')` | `sdk.Settings.get('isImperial')` (equivalent) |
| Custom turn-restriction walk | `sdk.DataModel.Turns.getTurnsThroughNode({ nodeId })` — finds override instructions |
| `W.selectionManager.getSelectedFeatures()` | `sdk.Editing.getSelection()` — returns `{ type, ids }` |

`getselfeat()` helper rewritten to use `sdk.Editing.getSelection()` and map IDs to plain
objects with `{ id, type }` shape.

Segment geometry: `segment.geometry` is now a GeoJSON `LineString` with WGS84 coordinates
— no coordinate projection conversion needed.

Node geometry: `node.geometry` is now a GeoJSON `Point` with WGS84 coordinates.

---

## Phase 4 — Geometry

**Problem:** All geometry was computed using OpenLayers 2.x objects in EPSG:900913
(Spherical Mercator, meters). The SDK exposes WGS84 GeoJSON throughout, and Turf.js
replaces OL geometry math.

**Changes:**

| Before (OL / Mercator) | After (Turf.js / WGS84) |
| --- | --- |
| `new OL.LonLat(lon, lat).transform(...)` | Native WGS84 `[lon, lat]` from SDK |
| `new OL.Geometry.Point(x, y)` | `turf.point([lon, lat])` |
| `pt1.distanceTo(pt2)` in meters | `turf.distance(pt1, pt2, { units: 'kilometers' }) * 1000` |
| Manual bearing math (atan2 in Mercator) | `turf.bearing(from, to)` |
| Manual offset point calculation | `turf.destination(origin, distKm, bearing)` |
| Custom circle polygon | `turf.circle(center, radiusKm, { steps: 40 })` |

All internal coordinate arrays are now `[longitude, latitude]` (GeoJSON convention).

`ja_getAngle()` and `ja_getAngleMidleSeg()` rewritten to read `geometry.coordinates`
directly from SDK segment/node objects and call `turf.bearing()`.

`ja_segment_length()` rewritten using `turf.distance()` on segment endpoint coordinates.

---

## Phase 5 — Map Layer & Rendering

**Problem:** OpenLayers vector layers and feature objects are not available in the SDK.
The SDK provides a named-layer system with GeoJSON features and a style-rule/context model.

**Changes:**

| Before | After |
| --- | --- |
| `new OL.Layer.Vector('Junction Angles', { styleMap })` | `sdk.Map.addLayer({ layerName: 'junction_angles', styleContext, styleRules })` |
| `ja_mapLayer.addFeatures([new OL.Feature.Vector(geom, null, style)])` | `sdk.Map.addFeatureToLayer({ layerName, feature: geoJsonFeature })` |
| `ja_mapLayer.removeAllFeatures()` | `sdk.Map.removeAllFeaturesFromLayer({ layerName: 'junction_angles' })` |
| `W.map.addLayer(ja_mapLayer)` | Called once inside `ja_setLayerEnabled()` on first enable |
| `ja_mapLayer.features` array for overlap detection | `ja_current_features[]` array maintained manually |
| Style via `new OL.Style({ ... })` per feature | Style driven by `ja_build_style_context()` closures and `ja_build_style_rules()` predicates |
| `W.map.getZoom()` | `sdk.Map.getZoomLevel()` |

**Style system design:** `ja_build_style_context()` returns an object of named functions
(closures over `ja_getOption()`) that the SDK calls per feature to resolve dynamic style
values. `ja_build_style_rules()` returns a single rule referencing all context keys via
`${key}` template syntax. This allows color changes from settings to take effect on
recalculate without re-registering the layer.

`ja_feature_counter` introduced as a monotonic ID generator: features are named
`'ja_' + (++ja_feature_counter)` to give each GeoJSON feature a unique ID required by the
SDK.

Layer checkbox registration:
```javascript
// Before
WazeWrap.Interface.AddLayerCheckbox('display', 'Junction Angle Info', true, ja_setLayerEnabled);

// After
sdk.LayerSwitcher.addLayerCheckbox({ name: 'Junction Angle Info', isChecked: true });
sdk.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: function (e) {
    if (e.name === 'Junction Angle Info') ja_setLayerEnabled(e.checked);
}});
```

---

## Phase 6 — Sidebar UI

**Problem:** `WazeWrap.Interface.AddTabPane()` is a legacy helper. The SDK provides a
first-class sidebar registration API.

**Changes:**

| Before | After |
| --- | --- |
| `WazeWrap.Interface.AddTabPane('ja', 'JAI', ...)` | `sdk.Sidebar.registerScriptTab()` → returns `{ tabLabel, tabPane }` |
| Inline HTML string injection | `setupHtml(tabPane)` function builds DOM into the SDK-provided pane element |
| `$('#sidepanel-ja')` jQuery selector | `ja_sidebar_tabPane` variable holds the tab pane reference |
| CSS injected via WazeWrap | CSS built as array-join string, injected via `<style>` element |

`ja_sidebar_tabPane` retained as a module-level variable so `setupHtml()` can re-render
the settings panel when the user changes a setting that affects layout.

---

## Phase 7 — Settings Persistence

Settings were already stored in WME's `localStorage`-backed preferences via
`W.prefs.attributes` in the legacy code. This mechanism survived the SDK migration
unchanged because it is a WME application concern, not an SDK concern.

Minor cleanup: removed `W.prefs.get('isImperial')` call and replaced with
`sdk.Settings.get('isImperial')` for consistency with the SDK pattern.

---

## Post-Migration Improvements

These changes were made after the 7-phase SDK migration was complete.

### MIN_ZOOM_LEVEL guard

**Why:** At zoom levels below 16, WME does not load full segment data into the model.
`ja_get_streets()` returns null streets, and markers are too spread out to be useful.

**Change:** Added `var MIN_ZOOM_LEVEL = 16` constant near the other angle thresholds.
Added early-return guard in `testSelectedItem()` after `removeAllFeaturesFromLayer` and
counter resets but before any drawing logic:

```javascript
if (sdk.Map.getZoomLevel() < MIN_ZOOM_LEVEL) {
    return;
}
```

The layer is not toggled off — it stays registered but empty. Stale markers are always
cleared on zoom-out; `wme-map-zoom-changed` fires `ja_calculate()` on zoom-in, which
redraws normally once zoom ≥ 16.

### `wme-map-move-end` optimization

**Why:** Map pan events do not change the selected segments or zoom level. Recalculating
on every pan was unnecessary work in the common case (segment selected, roundabout overlay
off).

**Change:** The `wme-map-move-end` handler now gates on both conditions before calling
`ja_calculate()`:

```javascript
sdk.Events.on({
    eventName: 'wme-map-move-end',
    eventHandler: function () {
        if (sdk.Map.getZoomLevel() >= MIN_ZOOM_LEVEL &&
            ja_getOption('roundaboutOverlayDisplay') === 'rOverAlways') {
            ja_calculate();
        }
    }
});
```

`wme-map-zoom-changed` is left ungated because `ja_compute_label_distance()` returns
different meter values per zoom level — a full recalculate (not just a redraw) is required
on every zoom step.

### Instruction color label cleanup

**Why:** The "Instruction colors" card gained a section header in the UI redesign,
making the `"Color for X"` prefix on every label redundant and verbose.

**English labels shortened:**

| Before | After |
| --- | --- |
| `Color for best continuation` | `Best continuation` |
| `Color for continue straight` | `Continue straight` |
| `Color for keep` | `Keep` |
| `Color for exit` | `Exit` |
| `Color for turn` | `Turn` |
| `Color for U-turn` | `U-turn` |
| `Color for disallowed turn` | `Disallowed turn` |
| `Color for angle to avoid` | `Angle to avoid` |
| `Color for non-normal roundabout` | `Non-Normal Exit` |
| `Color for roundabout overlay` | `Overlay` |

**Non-English locale fixes:**

| Locale | Issue fixed |
| --- | --- |
| Finnish (`fi`) | `'Color for continue straight'` English fallback → `'Continue straight'` |
| Polish (`pl`) | Same English fallback fixed |
| Swedish (`sv`) | Same English fallback fixed |
| Czech (`cs`) | Surrounding quote marks removed from all instruction labels |
| Russian (`ru`) | `- ` dash prefix removed from all labels; extremely long `continueInstructionColor` string shortened; roundabout labels updated |
| French (`fr`) | `Couleur pour/de` prefix stripped from all labels |
| Ukrainian (`uk`) | `- ` dash prefix removed; roundabout labels updated to match English `Non-Normal Exit` intent |

### Copyright & attribution update

**Why:** CC BY-NC-SA requires attribution for adapted works. The prior block predated
JS55CT's maintainership and was missing two contributors.

**Changes:**
- Added `// @author JS55CT` to userscript metadata
- Updated `@copyright` line to prepend `2025 JS55CT`
- Rewrote JSDoc contributor block with full contributor table (aligned columns, added
  JS55CT and g1220k, corrected milkboy year range to 2013–2019)

### README.md update

- Added **Actively maintained** notice at top
- Added JS55CT and ccclxv to contributor and translation tables
- Updated changelog section for 3.0.0 in-progress status

### USER-SETTINGS.md created

New reference document covering:
- Selection modes and two-segment mode behaviour
- U-turn detection (both direct and double-turn via ≤15m connector)
- Angle mode (Absolute vs Departure) with comparison table
- Angle display style (Fancy vs Simple)
- Direction arrow character sets
- Roundabout overlay display options
- Roundabout behavior, marker meanings, and `ja_is_roundabout_normal()` logic

---

## Files Changed

| File | Nature of change |
| --- | --- |
| `WME-Junction-Angle-Info.js` | Full SDK migration + post-migration improvements (~3200 net additions) |
| `README.md` | Updated maintainer info, contributor table, changelog |
| `SETTINGS.md` | New — comprehensive settings and behavior reference |
| `MIGRATION.md` | New — this document |
