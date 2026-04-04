// ==UserScript==
// @name          WME Junction Angle Info
// @description   Show the angle between two connected (or selected) segments — experimental branch adding Junction Box and Path (far turn) support
// @namespace     https://greasyfork.org/en/users/166843-wazedev
// @match         *://*.waze.com/*editor*
// @exclude       *://*.waze.com/user/editor*
// @exclude       *://*.waze.com/editor/sdk/*
// @version       3.1.4
// @grant         GM_xmlhttpRequest
// @grant         GM_info
// @connect       greasyfork.org
// @namespace     https://greasyfork.org/scripts/35547-wme-junction-angle-info/
// @require       https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require       https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @require       https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @author        WazeDev / JS55CT
// @copyright     2026 JS55CT, 2018 seb-d59, 2016 Michael Wikberg <waze@wikberg.fi>
// @license       CC-BY-NC-SA
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA6pSURBVFhHrZkJcBNnlscbgjEZmHAYsHVZUrek7pbUuo9W674l65Z8WzbGxoAxhzNgcweMDeY0GLDHwYBhGCABTEwIOSaTZBIyye6mcjBJFTs7O5Xazc4ks7NbU7vJzjKVrc0+RVqwhWEC5NW/VFKr3//79fe+fv3JRrp2bjs00NfW3gqqSldojCqFVk4q8LK4z+a2kEosVRVIVnrL60KMU602SfnaohIaQR0zb/72428eNr7+n6/r14bBh2+ahaJCDMOcWk9ndOuFFdeQlrbF4USZ0aqlNDJKS8YrovXNNSa7PlEVSTdVK3REMGIDcbEiuU5c3hDhmgvA6PV3X8p5P2x89ecv6XIRWCX94bFVP//l+l9lhYikpTB8MOauW1y1pqN13ab26oZkrCLo9JuBZj77CYfH0LysJt1UXtdcqXALwOJHu5bkXB8tRl85C26Mj3xm5eU7QLWN5TB8RV0MXpPVYbVRNuOJqVoT5fAx9c1V3bs2Ny2pYSxqX9AWSvlYpqkc87RPP/tNzvKRo6Y9AEzratrvAD25rrW+sYKQCUQ4F17Ti8pXrlmytLUhFHVX1kTLIq7mltrautSuPTsa1qQgubEznjP7PuKtv3sVPGkPfgeomD1bSqHA1La6OVUZikFJYx54raiOdGxYtXvf9i1b1h3q37dpc6cmiELyqdHBnNn3Ef/+pz9aKgkeM/3UinM5oOp0tLy6rLYh7g9Z043Jhqby9nVLgePg4d4Nm9vXrV99fHhw6OmjiUSshJ4CQGCRM5ssvri+SVeIIPVjuY9jy4UzkUJO6MQn2QOTRNv2NNj2NvbmgKJJD3DU1MfWrm/t3Lh6X1/34NN9q59cfnxk8NrLzw2f/PGh/v1LW5pNNgOk6ROCnM0k8dX7R30LkMLCO0CvrZqr3Hnjq18fNBc2X/v2yCSx//h2cG6vbhtte2VjfBuycduT+/p3Dp8e6N6zdf/h3U+PDJw+f2LkpyeODPXv6O3auHlDV1fXzu5doZQf0sItTM7m7rh1Yw9DrXrx59tlDwY0cmkAnAk9B7oRiqJI74Fth4f2n3n2xPnRM8dODe7p6926Y/OmbRuf6t7avbtn995eiKOHjyRqM32sYpUnZ3PPGKtHJinZ0I1b2SN3xzMvjICzxFxSWV0bjsWRsRcvDB4/1LmlfV9/b++B7u7dXb37d/YdOTBw7GjXzq66dK1erwNwIcGBtNgya87mnjEB6LvET54bAmeucjZBEC6vC9nc1bH3UM/A8MHdfT19R/cOHDuyrfupqtoqlVoFHBKRJGKKd5XvOb70NKTRKSxnc894YKCDJ7vBOdrkunDtwtU3riKwaAaG+3fu69q0bX2yIiGn5MCBi/GkpbK36uArT/4yu/jf6vwQ0kDQ8nNOk8cDA0HfB9vOvauA5tyVc8ja9e2hSJCUksAhxWVVtvT+2oHX1v5tlmO8QiEaMs9dPZFzmjweDOjL//pPV1oJtn0ndw+eGjRbzQhwUISi3tl0uH74zY738yBA729+++aOK5/tOdbTnFnX7T2Lc2bfR7z2zovgaamWXn3jeZihTMmGGk9f7/wwD+Kd9Tfe33L91zsu/8ueoc/3Hfl0108+3vbK6JpRSObbZvzh3z7P+T1yZLti88aqLM2lly8heRwfbHnzH7ov/m7vIHD8dufZG0+9+u6GO7h18QTkb+lbk/N7tHjpzTHUOVMV4WzcvW7V2lXegBfH8QzQOxs++mjr67/peeb3e4+C4A18hIO3OUDnV17e33RgUbyGRU+BB/5HN9/LuT5swB7N36iDy0M1C3GSwHCCLUAFuBT5x56fAgRMCUwMTE8ex9m2i0srFslsJZA5XvLgwt//4bOc90NF9ubi0oWJdHm0psIdCetsdlSuQG52jX6w5S0o1ngO0KXVL3h9ptsEQh/X0JK2rml3djyFBTKPfUet/KEX08GRTO+Bzacn5YzVJi1+pycW8kQjGKVA3uqYsKKh3wwuGrHbjFCaTI51pn3thvTJD1de++a2lo3+SRwi4Ft1lPugO+tbf/nv7EJmmaaYI/pITSxYERLIMEIrswXdhEaNvNnxwdvrf/XGuvf608fSjkY5LseM8yEBZGpdsuTZz8ej3BYcl1dY4BzUOWvf8HYYJjfgfeNnb1+FeYUsLlMQaQgualvsjnkT9SkOzlsgLFZbdErGgOyp7q+y1WmU2mgi2rml05POLDSubVZ8/8U8iDy1Xf2aaVueRafKSqAK99raQnO/9NKZ5ApH9uRS80yRBtPaDI6wy+y32kN2voxfjBWjCpFISSKta1r7j/Vfee0KtAHoB5DAdxXl1eg+qh66np2qrNz1qjXdjT0DG2DaQLBy4ecOtK7cCcapXNUC2mVRM/qFghI+KXSF3dVNNeUNFaGKsMaiK8F4yPOv51rkU/0dkMNmpsEYeaP+VaUOXaWXNfJduVrfpSks3ePF0rlskUBEybUmo9FqVurVEjmB4pjD6zTQRpKSU1q1wmjIAV1+dVQRYkFyZNdI3mDfXVDE2mPvRnefUdR4wIplKOBQbLaUwxGjbFQkJGU8iZiHYXyxmI+hLB53IZsF0uoMBCljc3gcvkAEt312elZ2LQYLdX3Z8sv/kTfM3Qq54Pn5bbjG8r7KavHZT6VJIxhyKTZPTHAwCQDxxDhLiLH4fI5QCFilIhFKECSlWMAqQSViMSmFj6hUnpsh3DsX8mHm86wn19bME/0+QCCYaTBk62cKSbmAkPFxKRsVA5ZATEjkclKpxCkKXuUajRAXYyRezOPNYcGqkiK7+naFqjMzTCZ0rVf+nOc7ibI090bJquXiv4qCYhb9mEAuwaQqTKYQyZWYjIKiiCmlgCSKBfx5HHYRl0MZtNaAh3bDvYYvEPIRq91qDEoBCLpwnukk+m40WUEbA1sOVSLAKZRUimTq7GwJCClXLCoWCtgYypdKZhUXKRiDJeDBDeo5fC5SUZcUWed8p3o9CA0otvc82LJUs3kiOV8iZ6F4CSriiPFSguSTBF9GElqlykIrbUa1w6SwGnReq7s8ijQtTWMAZETqT97Ic5yoTxjhA9CAqgbeyABpZgJQKa4oFohLhBIA4pEkWyJaIOQtREtZhLBUKSYsaqlNixooFiVCevdu5zM/YDPToep5jo+o+pGPAahYOx1oUJmGK5bO4wkXCjGBQsGTk0UojyPFFHa9yscovbS9IiCiKVPEhfzi0knYA7BN09te+N88x0dU09lPMzNkmM6TyIq4wgUCEUdCsAlioRhlERimk5OMCjcrxWaFPmK3lfs1AbOrMoS8fPm0yPoEi57afP53eY6PqPTJjwCIrX9crFQLZVQJJhbIKKGKEmrkhEmp8tBqn5F0qCiv3lEdsKTcujKrMeRABgYPiMxzAKh2+L08R1Dr8Bl0NoII99RmPx4dQktmwsp+bKYYXXmjFQ6eHZPDkQKOYM0n4xNBlUczf2qZT01nYSKBVM4SSeajaClFqJwmfdBKubQyh1IT1Dtr/eZKNx2zE3al1KZB1q5dhluLSoxT4vsuTHS81di1am5B4WMFt4H+3iJGENaK8NM3wyEMQZyOU9/EI3PnN9xYduwgq6A5MiH9m1DPMADxdPPkBiOh0Qopiq+QkbTa4LeaonZj2GSvckZaYp76AO6m6JgVZssUcSJeH62ycuH5Z2ptGW+38toXIRdV2vo3XtttoH92awoRVkdq9KtUCkMKEv5n7wekb64BIKGGI1Yq5nE5M+bPWyDil+CCH/KL5ojnEzaSSTK2Spuz1oOaJZaU0xBikksqkeqacGW1FzJLnUXwdBzv+K2+vdtvlyxbwUxgVM8XmRNulyxbwf/X8ue+ZJsL4TrlBqXKbIQGKFZTKjutchgwPS5mcHPCEmj0+Ro8AKQJ6U1xizluT7VUIen6WCziKKUhedJH/XigWzUtTAGyoMQeLZqBPK4Zqhkbf+YEeTf1Zi7S+EOZnlKZtZiC0NpohVmjsGkNPhMdovUBnc6v1pVpPbVeX11A7zdawvZoXQKprCwL+s0aa+bPq7IU3XTunyZajwN69gy8ndeQ6Z+teztmIYX41lsTT84pfeIDUZkYtlZiIweVCwVSvsai5pOljrCjvLHcVmbBdZjWofQk7I6o1eDRWwIW2DqqGI2IIhCTSUnBwxjnsHXTgAm29BPdxwGNjeEFSKHxWNWpm+XLooVIoXT7+DPvSN9cDVaYZZ7aoqBoqcxA0G69vcwSSHltQbPZR8dqy6I1QbPPYHCqMQoVK0USSoKRYqFYhNC0QqFAlUrMaCdZpql3FW7CGmrq+VHJ7Mxtj8wQoouvN9057Y6yxWKbphl9SpgGkNpGGT3ayuYk7dU5IpZ4fdgeNpt8ekuQphiS1BJCmYCDctgCbikqzMyQTkeYzAq336RyZH5wsZjH/uoO/16CWx3S4cIIhqf3qKVGicpG6V1qg0drcGvcCQeQaRxKwJIzpEgt8KVcRqdBqiMFuICLlgpEGMJY1EaT3O7U+cosZqeWsOZ+pLo6t+cNdn/BHZrdb4BkLoGUxpUOhUDBk5pJ2qc3+PVMwFiq5MFxeK91qpxJR6gmoLDIlGYlAOEKHKdIQi5DnB6T1a5x+ehUTShS4QsmPQoPxmEy/9DQLIrH9+d1y0m04vm/hHeNZPfRHGaGyi8O1AXooJGJMKhWKLfL4b3ao4ZXX43PGDCo3Kr44liyJanzagkTTupxAFLTaqPVpDHoEaffbHVqHR6D0aq2+xlHwGrymmQWMZvOMIHU9WFYVS0X/5jHAWo+/1nZjh/f/hnEYx5Xe2Wxplh0ScyWsDqrXDKb1BA2OssdCo8yvCjkrw8kWxKhxWFr3GKvcNiTNpyWSA0EocEVeoWOMSi1GiReWRZJuGMpL+PQ+WMud8ihcxikeopDlPINJRxmenYwFjNNEpGr4NKXNYKoKoeoLPO/nNy3xqliMwvXYzILCSjQ9OQuiombKbcC2gzw0VET0AQXlbmq3fCtrdwOQJak1ZFyiFQoV8LhYlyUEKES8f8BmIA7Ka4NUW4AAAAASUVORK5CYII=
// ==/UserScript==

/**
 * Copyright 2016 Michael Wikberg <waze@wikberg.fi>
 * WME Junction Angle Info extension is licensed under a Creative Commons
 * Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * See README.md for full contributor history.
 *
 * Original author:
 *  2013–2019 Michael Wikberg "milkboy" <waze@wikberg.fi>
 *            Core logic, architecture, Swedish & Finnish translations
 *
 * Contributions by:
 *  2014 Paweł Pyrczak "tkr85"       WME update compatibility fixes
 *  2014 "AlanOfTheBerg"             WME update compatibility fixes
 *  2014 "berestovskyy"              WME update compatibility fixes
 *  2015 "FZ69617"                   Best-continuation (BC) logic fixes
 *  2015 "wlodek76"                  Contributions
 *  2016 Sergey Kuznetsov "WazeRus"  Russian translation
 *  2016 "MajkiiTelini"              Czech translation
 *  2016 "witoco"                    Latin-American Spanish translation
 *  2017 "seb-d59"                   French translation; override instruction detection
 *  2019 "Sapozhnik"                 Ukrainian translation
 *       "ccclxv"                    British English (UK) translation
 *  2024 "g1220k"                    Contributions
 *  2026 "JS55CT"                    Current maintainer; SDK migration, RoundAbout support, JB and Paths
 */

/*global I18n, $, bootstrap, turf, getWmeSdk, SDK_INITIALIZED, GM_info, GM_xmlhttpRequest*/

(async function () {
  'use strict';

  // **************************************************************************************************************
  // IMPORTANT: Update this when releasing a new version of script
  // **************************************************************************************************************
  const SHOW_UPDATE_MESSAGE = true;
  const SCRIPT_VERSION_CHANGES = [
    'Version 3.1.4',
    'More robust marker overlap prevention system',
    'Version 3.1.3',
    'Roundabout turn restriction detection — exits with local restrictions display as NO_TURN (gray), works for RHT and LHT countries',
    'version 3.1.1',
    'Experimental: Far-turn angle display for Junction Boxes — breadcrumb trail through complex intersections (disabled by default)',
    'Experimental: Far-turn angle display for Paths — complete angle annotations along Path routes (disabled by default)',
  ];
  const SCRIPT_VERSION = GM_info.script.version.toString();
  const DOWNLOAD_URL = 'https://update.greasyfork.org/scripts/35547/WME%20Junction%20Angle%20Info.user.js';

  // ── Debug & execution state ───────────────────────────────────────────────
  // Runtime flags and counters used across the module.
  var junctionangle_debug = 1; // 0=off, 1=errors+warnings, 2=key decisions (function outcomes), 3=per-segment detail, 4=object dumps+internals — lower to 1 before release
  var ja_last_restart = 0; // epoch ms timestamp — throttles auto-restart on stale data errors
  var sdk; // WME SDK instance, assigned by bootstrap()

  // ── Settings storage ──────────────────────────────────────────────────────
  // ja_options holds all persisted user preferences (read/written via localStorage).
  // ja_getOption() / ja_setOption() are the only safe accessors — they apply defaults
  // and validate values against the ja_settings schema.
  var ja_options = {};

  // ── Cached data model properties ──────────────────────────────────────────
  // Cached values from SDK to avoid redundant queries during module execution.
  var ja_is_left_hand_traffic = false; // Cached from Countries.getAll()[0].isLeftHandTraffic (set during bootstrap)

  // ── Map layer state ───────────────────────────────────────────────────────
  // Shared state for the 'junction_angles' SDK map layer.
  var ja_layer_created = false; // true once sdk.Map.addLayer() has returned
  var ja_layer_visible = true; // mirrors the current Layer Switcher checkbox state
  var ja_roundabout_points = []; // GeoJSON Points of RA markers placed this pass (collision detection)
  var ja_current_features = []; // all features placed this render pass (overlap avoidance)
  var ja_feature_counter = 0; // monotonic counter; features are named 'ja_' + (++ja_feature_counter)

  // ── Marker position tracking (for local/far-turn overlap prevention) ─────────────────────────
  // Maps to track marker positions during a render pass so local and far-turn markers can coordinate.
  // Structure: map<nodeId, array<{bearing, distance}>>
  // Reset each render pass at start of testSelectedItem().
  var ja_local_markers_by_node = {}; // Local turn markers indexed by node, with bearings and distances
  var ja_far_turn_bearings_by_node = {}; // Far-turn markers indexed by node, with bearings and distances

  // ── UI state ──────────────────────────────────────────────────────────────
  var ja_sidebar_tabPane = null; // SDK tab pane element — retained so setupHtml() can re-render it

  // ── Angle classification thresholds ──────────────────────────────────────
  // Waze routing instruction boundaries derived from map experiments and the Waze wiki.
  var TURN_ANGLE = 45.5; // degrees — boundary between a Keep and a Turn instruction (wiki: 45.04°)
  var U_TURN_ANGLE = 168.24; // degrees — boundary above which a turn is classified as a U-Turn
  var GRAY_ZONE = 1.5; // degrees — margin around TURN_ANGLE to absorb measurement noise
  var OVERLAPPING_ANGLE = 0.666; // degrees — two segments closer than this are treated as collinear
  var MIN_ZOOM_LEVEL = 17; // hide all markers when zoomed out past this level
  var PERPENDICULAR_TOLERANCE = 15; // degrees — tolerance for ±15° of perpendicular (90° multiple) in roundabouts and angle classification
  var WAZE_PARALLELISM_TOLERANCE = 5; // degrees — parallelism threshold for A and C segments
  var WAZE_MEDIAN_LENGTH_DEFAULT = 30; // meters — default median segment length for Waze U-turn qualification
  var WAZE_MEDIAN_LENGTH_EXTENDED = 50; // meters — extended threshold with lane guidance on incoming segment
  var WAZE_MEDIAN_LENGTH_THRESHOLD = 15; // meters — strict median threshold for optional Waze restriction (when setting is ON)
  // Roundabout instruction thresholds (CCW angle ranges for normal roundabouts in right-hand traffic)
  var ROUNDABOUT_INSTRUCTION_UTURN_THRESHOLD = 45; // < 45° or ≥ 315° → U-Turn
  var ROUNDABOUT_INSTRUCTION_TURN_RIGHT_THRESHOLD = 135; // 45° – 135° → Turn Right (45 + 90)
  var ROUNDABOUT_INSTRUCTION_CONTINUE_THRESHOLD = 225; // 135° – 225° → Continue (135 + 90)
  var ROUNDABOUT_INSTRUCTION_TURN_LEFT_THRESHOLD = 315; // 225° – 315° → Turn Left (225 + 90)

  // ── Routing instruction type enum ────────────────────────────────────────
  // String keys stored in GeoJSON feature properties and matched by SDK styleRules predicates.
  // BC = "best continuation" — Waze gives no spoken instruction for this turn.
  // Override* variants are used when a turn has a manually set instruction opcode.
  var ja_routing_type = {
    BC: 'junction_none',
    KEEP: 'junction_keep',
    KEEP_LEFT: 'junction_keep_left',
    KEEP_RIGHT: 'junction_keep_right',
    TURN: 'junction_turn',
    TURN_LEFT: 'junction_turn_left',
    TURN_RIGHT: 'junction_turn_right',
    EXIT: 'junction_exit',
    EXIT_LEFT: 'junction_exit_left',
    EXIT_RIGHT: 'junction_exit_right',
    U_TURN: 'junction_u_turn',
    PROBLEM: 'junction_problem',
    NO_TURN: 'junction_no_turn',
    NO_U_TURN: 'junction_no_u_turn',
    ROUNDABOUT: 'junction_roundabout',
    ROUNDABOUT_EXIT: 'junction_roundabout_exit',

    OverrideBC: 'Override_none',
    OverrideCONTINUE: 'Override_continue',
    OverrideKEEP_LEFT: 'Override_keep_left',
    OverrideKEEP_RIGHT: 'Override_keep_right',
    OverrideTURN_LEFT: 'Override_turn_left',
    OverrideTURN_RIGHT: 'Override_turn_right',
    OverrideEXIT: 'Override_exit',
    OverrideEXIT_LEFT: 'Override_exit_left',
    OverrideEXIT_RIGHT: 'Override_exit_right',
    OverrideU_TURN: 'Override_u_turn',

    // ── Far turn types (experimental) ─────────────────────────────────────
    // Far turns (isPathTurn or isJunctionBoxTurn) now use the same ja_routing_type values
    // as regular node turns (BC, TURN, KEEP, etc.) — classified by ja_guess_routing_instruction
    // using the instruction-firing angle (entry segment → first intermediate segment at entry node).
    //
    // The distinction between Path turns and JB turns is communicated via:
    //   • ja_is_far_turn: true on the GeoJSON feature properties → purple outline ring
    //
    // No separate PATH_TURN or JB_TURN type constants are needed. The two SDK flags are
    // still used to identify far turns during processing in ja_draw_far_turn_markers():
    //   turn.isPathTurn === true       → Path (FL2) far turn
    //   turn.isJunctionBoxTurn === true → Junction Box far turn
    // Note: these two flags are mutually exclusive.
  };

  // ── Road type enum ────────────────────────────────────────────────────────
  // Numeric road-type IDs matching WME data model values.
  // Used by ja_is_primary_road(), ja_is_ramp(), and routing instruction prediction.
  var ja_road_type = {
    //Streets
    NARROW_STREET: 22,
    STREET: 1,
    PRIMARY_STREET: 2,
    //Highways
    RAMP: 4,
    FREEWAY: 3,
    MAJOR_HIGHWAY: 6,
    MINOR_HIGHWAY: 7,
    //Other drivable
    DIRT_ROAD: 8,
    FERRY: 14,
    PRIVATE_ROAD: 17,
    PARKING_LOT_ROAD: 20,
    //Non-drivable
    WALKING_TRAIL: 5,
    PEDESTRIAN_BOARDWALK: 10,
    STAIRWAY: 16,
    RAILROAD: 18,
    RUNWAY: 19,
  };

  // ── Settings schema ───────────────────────────────────────────────────────
  // Each entry describes one user-configurable option: the UI element type/id and
  // the default value applied when no stored value exists or the stored value is invalid.
  // Settings with a 'group' key are visually disabled when their parent checkbox is unchecked.
  // ja_getOption() / ja_setOption() are the only safe accessors — never read ja_options directly.
  var ja_settings = {
    angleMode: { elementType: 'select', elementId: '_jaSelAngleMode', defaultValue: 'aDeparture', options: ['aAbsolute', 'aDeparture'] },
    angleDisplay: { elementType: 'select', elementId: '_jaSelAngleDisplay', defaultValue: 'displayFancy', options: ['displayFancy', 'displaySimple'] },
    angleDisplayArrows: { elementType: 'select', elementId: '_jaSelAngleDisplayArrows', defaultValue: '⇐⇒⇖⇗⇑', options: ['<><>', '⇦⇨⇦⇨⇧', '⇐⇒⇐⇒⇑', '←→←→↑', '⇐⇒⇖⇗⇑', '←→↖↗↑'] },
    override: { elementType: 'checkbox', elementId: '_jaCbOverride', defaultValue: true, group: 'guess' },
    overrideAngles: { elementType: 'checkbox', elementId: '_jaCboverrideAngles', defaultValue: false, group: 'override' },
    guess: { elementType: 'checkbox', elementId: '_jaCbGuessRouting', defaultValue: true },
    noInstructionColor: { elementType: 'color', elementId: '_jaTbNoInstructionColor', defaultValue: '#ffffff', group: 'guess' },
    continueInstructionColor: { elementType: 'color', elementId: '_jaTbContinueInstructionColor', defaultValue: '#ffffff', group: 'guess' },
    keepInstructionColor: { elementType: 'color', elementId: '_jaTbKeepInstructionColor', defaultValue: '#cbff84', group: 'guess' },
    exitInstructionColor: { elementType: 'color', elementId: '_jaTbExitInstructionColor', defaultValue: '#6cb5ff', group: 'guess' },
    turnInstructionColor: { elementType: 'color', elementId: '_jaTbTurnInstructionColor', defaultValue: '#4cc600', group: 'guess' },
    uTurnInstructionColor: { elementType: 'color', elementId: '_jaTbUTurnInstructionColor', defaultValue: '#b66cff', group: 'guess' },
    noTurnColor: { elementType: 'color', elementId: '_jaTbNoTurnColor', defaultValue: '#a0a0a0', group: 'guess' },
    problemColor: { elementType: 'color', elementId: '_jaTbProblemColor', defaultValue: '#feed40', group: 'guess' },
    roundaboutOverlayDisplay: { elementType: 'select', elementId: '_jaSelRoundaboutOverlayDisplay', defaultValue: 'rOverNever', options: ['rOverNever', 'rOverSelected', 'rOverAlways'] },
    roundaboutOverlayColor: { elementType: 'color', elementId: '_jaTbRoundaboutOverlayColor', defaultValue: '#aa0000', group: 'roundaboutOverlayDisplay' },
    roundaboutColor: { elementType: 'color', elementId: '_jaTbRoundaboutColor', defaultValue: '#ff8000', group: 'roundaboutOverlayDisplay' },
    uTurnIncludeStreet: { elementType: 'checkbox', elementId: '_jaCbUTurnIncludeStreet', defaultValue: false },
    uTurnIncludeParkingLot: { elementType: 'checkbox', elementId: '_jaCbUTurnIncludeParkingLot', defaultValue: false },
    uTurnIncludePrivateRoad: { elementType: 'checkbox', elementId: '_jaCbUTurnIncludePrivateRoad', defaultValue: false },
    wazeDoubleUTurnRestriction: { elementType: 'checkbox', elementId: '_jaCbWazeDoubleUTurnRestriction', defaultValue: true },
    enableFarTurnJB: { elementType: 'checkbox', elementId: '_jaCbEnableFarTurnJB', defaultValue: false, group: 'experimental' },
    enableFarTurnPath: { elementType: 'checkbox', elementId: '_jaCbEnableFarTurnPath', defaultValue: false, group: 'experimental' },
    decimals: { elementType: 'number', elementId: '_jaTbDecimals', defaultValue: 2, min: 0, max: 2 },
    pointSize: { elementType: 'number', elementId: '_jaTbPointSize', defaultValue: 12, min: 6, max: 20 },
  };

  // ── Direction arrow character sets ────────────────────────────────────────
  // Provides named accessors for the currently selected arrow character set.
  // The actual character set string is stored in ja_options.angleDisplayArrows.
  var ja_arrow = {
    get: function (at) {
      var arrows = ja_getOption('angleDisplayArrows');
      return arrows[at % arrows.length];
    },
    left: function () {
      return this.get(0);
    },
    right: function () {
      return this.get(1);
    },
    left_up: function () {
      return this.get(2);
    },
    right_up: function () {
      return this.get(3);
    },
    up: function () {
      return this.get(4);
    },
  };

  /**
   * Returns the current WME editor selection as a flat array of feature descriptors.
   *
   * Wraps sdk.Editing.getSelection() and maps each selected item to a plain object
   * with { id, type } so callers do not need to interact with the SDK selection model
   * directly. Returns an empty array when nothing is selected.
   *
   * @returns {Array<{id: number, type: string}>} Selected features, or [] if none.
   */
  function getselfeat() {
    var sel = sdk.Editing.getSelection();
    if (!sel) {
      return [];
    }
    return sel.ids.map(function (id) {
      return { type: sel.objectType, id: id };
    });
  }

  /**
   * Returns true if anything is currently selected in the editor.
   *
   * @returns {boolean} True if the selection is non-empty.
   */
  function hasSelection() {
    return getselfeat().length > 0;
  }

  /**
   * Returns true if the given segment ID is currently selected in the editor.
   *
   * Uses getselfeat() to read the live selection state. Called during angle
   * calculation to distinguish the incoming (selected) segment from other segments
   * at a node so the correct departure angle can be identified.
   *
   * @param {number} segmentId - The segment ID to test.
   * @returns {boolean} True if the segment is part of the current selection.
   */
  function ja_is_segment_selected(segmentId) {
    var sel = sdk.Editing.getSelection();
    return sel != null && sel.objectType === 'segment' && sel.ids.indexOf(segmentId) !== -1;
  }

  /**
   * Computes the base marker offset distance in meters for the current zoom level.
   *
   * The distance is looked up from a hard-coded table keyed by WME zoom level
   * (13–22), then scaled by the configured decimal-places setting so that wider
   * labels receive more spacing. Returns undefined at unsupported zoom levels and
   * logs a warning.
   *
   * @returns {number} Base label distance in meters.
   */
  function ja_compute_label_distance() {
    var ja_label_distance;
    switch (sdk.Map.getZoomLevel()) {
      case 22:
        ja_label_distance = 1.2;
        break;
      case 21:
        ja_label_distance = 2.2;
        break;
      case 20:
        ja_label_distance = 4.5;
        break;
      case 19:
        ja_label_distance = 8;
        break;
      case 18:
        ja_label_distance = 16;
        break;
      case 17:
        ja_label_distance = 32;
        break;
      case 16:
        ja_label_distance = 45;
        break;
      case 15:
        ja_label_distance = 50;
        break;
      case 14:
        ja_label_distance = 100;
        break;
      case 13:
        ja_label_distance = 300;
        break;
      default:
        ja_log('Unsupported zoom level: ' + sdk.Map.getZoomLevel() + '!', 1);
    }
    ja_label_distance *= 1 + 0.2 * parseInt(ja_getOption('decimals'));
    ja_log('zoom: ' + sdk.Map.getZoomLevel() + ' -> distance: ' + ja_label_distance, 3);
    return ja_label_distance;
  }

  /**
   * Scans the given node list for roundabout (junction) membership and builds an
   * entry/exit map.
   *
   * For each node, inspects connected segments for a non-null junctionId. When a
   * junction is found, records the non-junction segment and node as the entry side
   * (in_s / in_n). If the same junctionId is encountered a second time (second
   * selected node on the same RA), the second node is recorded as the exit side
   * (out_s / out_n). Also stores the junction geometry center point (p).
   *
   * @param {number[]} ja_nodes - Array of node IDs from the current selection.
   * @returns {Object} Map of junctionId → { in_s, in_n, out_s, out_n, p }.
   */
  function ja_find_roundabouts(ja_nodes) {
    var ja_selected_roundabouts = {};
    ja_nodes.forEach(function (node) {
      var nodeObj = sdk.DataModel.Nodes.getById({ nodeId: node });
      ja_log(nodeObj, 3);

      var tmp_s = null,
        tmp_n = null,
        tmp_junctionID = null;
      if (nodeObj == null || typeof nodeObj.connectedSegmentIds === 'undefined') {
        return;
      }
      nodeObj.connectedSegmentIds.forEach(function (segment) {
        ja_log(segment, 3);

        var segObj = sdk.DataModel.Segments.getById({ segmentId: segment });
        if (segObj != null && segObj.junctionId != null) {
          ja_log('Roundabout detected: ' + segObj.junctionId, 3);
          tmp_junctionID = segObj.junctionId;
        } else {
          tmp_s = segment;
          tmp_n = node;
        }
        ja_log('tmp_s: ' + (tmp_s === null ? 'null' : tmp_s), 3);
      });
      ja_log('final tmp_s: ' + (tmp_s === null ? 'null' : tmp_s), 3);
      if (tmp_junctionID === null) {
        return;
      }
      if (ja_selected_roundabouts.hasOwnProperty(tmp_junctionID)) {
        ja_selected_roundabouts[tmp_junctionID].out_s = tmp_s;
        ja_selected_roundabouts[tmp_junctionID].out_n = node;
      } else {
        var tmp_junction = sdk.DataModel.Junctions.getById({ junctionId: tmp_junctionID });
        ja_selected_roundabouts[tmp_junctionID] = {
          in_s: tmp_s,
          in_n: tmp_n,
          out_s: null,
          out_n: null,
          p: tmp_junction ? tmp_junction.geometry : undefined,
        };
      }
    });
    return ja_selected_roundabouts;
  }

  /**
   * Draws center-angle and ±N° deviation markers for all detected roundabouts.
   *
   * For each roundabout in the selection map: draws an optional circle overlay
   * (rOverSelected mode), renders the triangle legs (in_n → center → out_n) as a
   * LineString feature, calls ja_is_roundabout_normal() for its side effect of
   * placing ±N° deviation markers at oblique exits, then places the center-angle
   * marker colored per the specific entry→exit path angle (white = within ±PERPENDICULAR_TOLERANCE° of
   * perpendicular; orange = non-normal).
   *
   * @param {Object} ja_selected_roundabouts - Map from ja_find_roundabouts().
   * @param {number} ja_label_distance - Base marker offset distance in meters.
   */
  function ja_draw_roundabout_markers(ja_selected_roundabouts, ja_label_distance) {
    //Do some fancy painting for the roundabouts...
    for (var tmp_roundabout in ja_selected_roundabouts) {
      if (ja_selected_roundabouts.hasOwnProperty(tmp_roundabout)) {
        // for...in always yields string keys; SDK requires a number type
        var tmp_roundabout_id = parseInt(tmp_roundabout, 10);
        ja_log(tmp_roundabout_id, 3);
        ja_log(ja_selected_roundabouts[tmp_roundabout], 3);

        //New roundabouts don't have coordinates yet..
        if (typeof ja_selected_roundabouts[tmp_roundabout].p === 'undefined') {
          continue;
        }
        // Entry-only selection (no exit node in selection): show all exits relative to entry
        if (ja_selected_roundabouts[tmp_roundabout].out_n === null) {
          ja_draw_roundabout_entry_exits(tmp_roundabout_id, ja_selected_roundabouts[tmp_roundabout].in_n, ja_label_distance);
          continue;
        }

        // Roundabout arc selected: use the segment's entry node based on direction of travel.
        // Show all exits from that entry — same view as selecting an entry segment connected at that node.
        var _selfeat = getselfeat();
        if (_selfeat.length === 1 && _selfeat[0].type === 'segment') {
          var _selSeg = sdk.DataModel.Segments.getById({ segmentId: _selfeat[0].id });
          if (_selSeg && _selSeg.junctionId !== null) {
            // Determine entry node based on direction of travel (not geometric direction)
            // isAtoB means traffic flows from fromNodeId to toNodeId; isBtoA means toNodeId to fromNodeId
            var entryNodeForRA = _selSeg.isAtoB ? _selSeg.fromNodeId : _selSeg.toNodeId;
            ja_log('[RA] Selected RA arc: isAtoB=' + _selSeg.isAtoB + ', isBtoA=' + _selSeg.isBtoA + ', entry node=' + entryNodeForRA, 2);
            ja_draw_roundabout_entry_exits(tmp_roundabout_id, entryNodeForRA, ja_label_distance);
            continue;
          }
        }

        //Draw circle overlay for this roundabout
        if (ja_getOption('roundaboutOverlayDisplay') === 'rOverSelected') {
          ja_draw_roundabout_overlay(tmp_roundabout_id);
        }

        //Transform LonLat to actual layer projection
        var tmp_roundabout_center = ja_coordinates_to_point(ja_selected_roundabouts[tmp_roundabout].p.coordinates);
        var tmp_in_geom = sdk.DataModel.Nodes.getById({ nodeId: ja_selected_roundabouts[tmp_roundabout].in_n }).geometry;
        var tmp_out_geom = sdk.DataModel.Nodes.getById({ nodeId: ja_selected_roundabouts[tmp_roundabout].out_n }).geometry;
        var angle = ja_angle_between_points(tmp_in_geom, tmp_roundabout_center, tmp_out_geom);

        //Draw the two legs of the triangle (in_n → center → out_n)
        ja_add_feature({ type: 'LineString', coordinates: [tmp_in_geom.coordinates, tmp_roundabout_center.coordinates, tmp_out_geom.coordinates] }, { ja_type: 'arrow_line' });
        // Call ja_is_roundabout_normal for its side effect: places ±N° deviation markers
        // at any exit node that is more than 15° off perpendicular.
        ja_is_roundabout_normal(tmp_roundabout_id, ja_selected_roundabouts[tmp_roundabout].in_n, ja_label_distance);
        // Color the center marker based on THIS specific path's angle only.
        // Per Waze: a roundabout can be normal for one entry and non-normal for another.
        var ra_path_is_normal = ja_is_angle_normal(angle);
        ja_add_feature(tmp_roundabout_center, {
          angle: ja_round(angle) + '°',
          ja_type: ra_path_is_normal ? ja_routing_type.BC : ja_routing_type.ROUNDABOUT,
        });
      }
    }
  }

  /**
   * Identifies short connector segments (≤30m, or ≤50m with lane guidance) that create
   * double-turn or U-turn paths and returns an accumulator object for use during marker drawing.
   *
   * A double-turn occurs when a driver enters a short connector segment from one
   * road and exits onto another road such that the combined heading change is near
   * 180°. Waze may misclassify such paths; this function flags them as NO_U_TURN
   * or PROBLEM so ja_draw_node_markers can render warning markers.
   *
   * Optional stricter Waze restriction: when the "Disable for <15m and ±5° parallel"
   * setting is enabled, paths with median ≤15m and parallel arms are blocked.
   *
   * Only active in Departure angle mode when more than one node is selected.
   *
   * @param {number[]} ja_nodes - Array of selected node IDs.
   * @returns {{data: Object, collect: Function, forEachItem: Function}} Accumulator.
   */
  function ja_collect_double_turns(ja_nodes, allBigJunctions) {
    /**
     * Collect double-turn (inc. U-turn) segments info
     */
    var doubleTurns = {
      data: {}, //Structure: map<s_id, map<s_out_id, list<{s_in_id, angle, turn_type}>>>
      farExitMarkers: [], //Markers to draw at the median's far exit node when an arm is selected

      collect: function (s_id, s_in_id, s_out_id, angle, turn_type) {
        ja_log('Collecting double-turn path from ' + s_in_id + ' to ' + s_out_id + ' via ' + s_id + ' with angle ' + angle + ' type: ' + turn_type, 2);
        var info = this.data[s_id];
        if (info === undefined) {
          info = this.data[s_id] = {};
        }
        var list = info[s_out_id];
        if (list === undefined) {
          list = info[s_out_id] = [];
        }
        list.push({ s_in_id: s_in_id, angle: angle, turn_type: turn_type });
      },

      forEachItem: function (s_id, s_out_id, fn) {
        var info = this.data[s_id];
        if (info !== undefined) {
          var list = info[s_out_id];
          if (list !== undefined) {
            list.forEach(function (item, i) {
              fn(item, i);
            });
          }
        }
      },
    };

    //Loop through segments <=30 m (always qualifies) or 31-49 m with lane guidance on the incoming segment
    if (ja_getOption('angleMode') === 'aDeparture' && ja_nodes.length > 1) {
      getselfeat().forEach(function (selectedSegment) {
        var segmentId = selectedSegment.id;
        var segment = sdk.DataModel.Segments.getById({ segmentId: segmentId });
        ja_log('Checking ' + segmentId + ' for double turns ...', 3);

        var len = ja_segment_length(segment);
        ja_log('Segment ' + segmentId + ' length: ' + len, 3);
        if (!ja_is_uturn_qualifying_road(segment)) return;

        // SUPPRESS LOCAL DOUBLE U-TURNS FOR ENTRY SEGMENTS CROSSING INTO JB
        // When a segment crosses INTO a JB (one endpoint outside, one inside),
        // JB far-turn logic (with U-TURN instructions) takes over. Local double-turn
        // markers would duplicate the JB U-TURN marker.
        var bjCrossing = ja_segment_crosses_bj_boundary(segment, allBigJunctions);
        if (bjCrossing.crosses) {
          ja_log('Skipping double turns for ' + segmentId + ' — crosses INTO JB boundary (JB far-turns take precedence)', 2);
          return; // Skip double-turn collection for this entry-to-JB segment
        }

        var fromNode = sdk.DataModel.Nodes.getById({ nodeId: segment.fromNodeId });
        var toNode = sdk.DataModel.Nodes.getById({ nodeId: segment.toNodeId });

        var lenRounded = Math.round(len);
        if (lenRounded <= 49) {
          var a_from = ja_getAngleMidleSeg(segment.fromNodeId, segment);
          var a_to = ja_getAngleMidleSeg(segment.toNodeId, segment);

          fromNode.connectedSegmentIds.forEach(function (fromSegmentId) {
            if (fromSegmentId === segmentId) return;
            var fromSegment = sdk.DataModel.Segments.getById({ segmentId: fromSegmentId });
            if (!ja_is_uturn_qualifying_road(fromSegment)) return;
            var from_a = ja_getAngle(segment.fromNodeId, fromSegment);
            var from_angle = ja_angle_diff(from_a, a_from, false);
            ja_log('Segment from ' + fromSegmentId + ' angle: ' + from_a + ', turn angle: ' + from_angle, 3);

            toNode.connectedSegmentIds.forEach(function (toSegmentId) {
              if (toSegmentId === segmentId) return;
              var toSegment = sdk.DataModel.Segments.getById({ segmentId: toSegmentId });
              if (!ja_is_uturn_qualifying_road(toSegment)) return;
              var to_a = ja_getAngle(segment.toNodeId, toSegment);
              var to_angle = ja_angle_diff(to_a, a_to, false);
              ja_log('Segment to ' + toSegmentId + ' angle: ' + to_a + ', turn angle: ' + to_angle, 3);

              var angle = Math.abs(to_angle - from_angle);
              ja_log('Angle from ' + fromSegmentId + ' to ' + toSegmentId + ' is: ' + angle, 3);

              // Path 1: fromSegment → segment → toSegment (A → B → C)
              var hasLGFromToMedian = ja_segment_has_lane_guidance(fromSegmentId, fromNode.id, segmentId);
              var turn_type_path1 = ja_classify_uturn_angle(angle, lenRounded, fromSegment, toSegment, fromNode.id, toNode.id, hasLGFromToMedian);

              if (turn_type_path1 !== null) {
                var useWazeRestriction = turn_type_path1 === ja_routing_type.NO_U_TURN;

                // Collect if turns are allowed (same logic for both paths)
                if (ja_is_turn_allowed(fromSegment, fromNode, segment) && ja_is_turn_allowed(segment, toNode, toSegment)) {
                  // When Waze restriction applies, always collect; otherwise check length/lane guidance
                  if (useWazeRestriction || lenRounded <= 30 || hasLGFromToMedian) {
                    doubleTurns.collect(segmentId, fromSegmentId, toSegmentId, angle, turn_type_path1);
                  }
                }
              }

              // Path 2: toSegment → segment → fromSegment (C → B → A)
              var hasLGToToMedian = ja_segment_has_lane_guidance(toSegmentId, toNode.id, segmentId);
              var turn_type_path2 = ja_classify_uturn_angle(angle, lenRounded, toSegment, fromSegment, toNode.id, fromNode.id, hasLGToToMedian);

              if (turn_type_path2 !== null) {
                useWazeRestriction = turn_type_path2 === ja_routing_type.NO_U_TURN;

                if (ja_is_turn_allowed(toSegment, toNode, segment) && ja_is_turn_allowed(segment, fromNode, fromSegment)) {
                  // When Waze restriction applies, always collect; otherwise check length/lane guidance
                  if (useWazeRestriction || lenRounded <= 30 || hasLGToToMedian) {
                    doubleTurns.collect(segmentId, toSegmentId, fromSegmentId, angle, turn_type_path2);
                  }
                }
              }
            });
          });
        }
      });

      // Second pass: trigger double-turn detection when an entry/exit arm is selected.
      // For each selected segment, look at its endpoint nodes for qualifying median neighbors.
      // Skips any neighbor that is itself a selected segment (already handled by first loop).
      var selectedIds = {};
      getselfeat().forEach(function (s) {
        selectedIds[s.id] = true;
      });

      getselfeat().forEach(function (selectedSegment) {
        var armId = selectedSegment.id;
        var armSeg = sdk.DataModel.Segments.getById({ segmentId: armId });
        if (!ja_is_uturn_qualifying_road(armSeg)) return;

        // SUPPRESS LOCAL DOUBLE U-TURNS FOR ARM SEGMENTS CROSSING INTO JB
        var armBjCrossing = ja_segment_crosses_bj_boundary(armSeg, allBigJunctions);
        if (armBjCrossing.crosses) {
          ja_log('Skipping arm double turns for ' + armId + ' — crosses INTO JB boundary (JB far-turns take precedence)', 2);
          return;
        }

        [armSeg.fromNodeId, armSeg.toNodeId].forEach(function (armNodeId) {
          var armNode = sdk.DataModel.Nodes.getById({ nodeId: armNodeId });

          armNode.connectedSegmentIds.forEach(function (neighborId) {
            if (neighborId === armId) return;
            if (selectedIds[neighborId]) return; // already handled as direct median selection

            var neighbor = sdk.DataModel.Segments.getById({ segmentId: neighborId });
            if (!ja_is_uturn_qualifying_road(neighbor)) return;
            var nLen = Math.round(ja_segment_length(neighbor));
            if (nLen > 49) return;
            if (nLen > 30 && !ja_segment_has_lane_guidance(armId, armNodeId, neighborId)) return;
            if (!ja_is_turn_allowed(armSeg, armNode, neighbor)) return;

            var a_arm_side = ja_getAngleMidleSeg(armNodeId, neighbor);
            var medianFarNodeId = neighbor.fromNodeId === armNodeId ? neighbor.toNodeId : neighbor.fromNodeId;
            var a_exit_side = ja_getAngleMidleSeg(medianFarNodeId, neighbor);
            var medianFarNode = sdk.DataModel.Nodes.getById({ nodeId: medianFarNodeId });

            var arm_a = ja_getAngle(armNodeId, armSeg);
            var arm_angle = ja_angle_diff(arm_a, a_arm_side, false);

            medianFarNode.connectedSegmentIds.forEach(function (exitId) {
              if (exitId === neighborId) return;
              var exitSeg = sdk.DataModel.Segments.getById({ segmentId: exitId });
              if (!ja_is_uturn_qualifying_road(exitSeg)) return;
              if (!ja_is_turn_allowed(neighbor, medianFarNode, exitSeg)) return;

              var exit_a = ja_getAngle(medianFarNodeId, exitSeg);
              var exit_angle = ja_angle_diff(exit_a, a_exit_side, false);
              var combined_angle = Math.abs(exit_angle - arm_angle);
              ja_log('Entry-arm trigger: ' + armId + ' -> ' + neighborId + ' -> ' + exitId + ' angle: ' + combined_angle, 3);

              var turn_type = ja_classify_uturn_angle(combined_angle, nLen, armSeg, exitSeg, armNodeId, medianFarNodeId);
              if (turn_type !== null) {
                doubleTurns.farExitMarkers.push({
                  farNodeId: medianFarNodeId,
                  exitBearing: exit_a,
                  angle: combined_angle,
                  turn_type: turn_type,
                });
              }
            });
          });
        });
      });
    }

    ja_log('Collected double-turn segments:', 2);
    ja_log(doubleTurns.data, 4);
    return doubleTurns;
  }

  /**
   * Iterates selected nodes and draws angle markers for all connected segment pairs.
   *
   * For each node: computes the bearing of every connected segment, determines
   * which segments are selected (incoming), then applies either Departure mode
   * (one marker per exit, placed along that exit's bearing) or Absolute mode (one
   * marker per adjacent pair, placed in the gap between them). Calls
   * ja_guess_routing_instruction() to classify each turn and ja_draw_marker() to
   * place the feature. Also draws double-turn markers for short connector paths.
   *
   * @param {number[]} ja_nodes - Array of node IDs to process.
   * @param {number} ja_label_distance - Base marker offset distance in meters.
   * @param {{data: Object, collect: Function, forEachItem: Function}} doubleTurns - From ja_collect_double_turns().
   * @param {boolean} ja_selected_has_median - True if any selected segment is contained inside a
   *   BigJunction. When true, far-turn markers are suppressed: the regular node-pair logic handles
   *   internal JB segments, and showing far-turn exit markers would be misleading/incorrect.
   * @param {number[]} ja_selected_seg_ids - IDs of the user-selected segments. Passed through to
   *   ja_draw_far_turn_markers so it only draws far turns from the selected entry segment(s).
   *   Empty when a node (not a segment) is selected — in that case all entries are shown.
   * @param {boolean} ja_is_pure_node_selection - True if a node is directly selected (not via segment).
   *   When true, far-turn (Path/JB) markers are suppressed — show only the node's absolute angles.
   * @returns {boolean} True if a data error occurred and the calculation must be retried.
   */
  function ja_draw_node_markers(ja_nodes, ja_label_distance, doubleTurns, ja_selected_has_median, ja_selected_seg_ids, allBigJunctions, ja_is_pure_node_selection) {
    var restart = false;
    //Start looping through selected nodes
    for (var i = 0; i < ja_nodes.length; i++) {
      var node = sdk.DataModel.Nodes.getById({ nodeId: ja_nodes[i] });
      var angles = [];
      var ja_selected_segments_count = 0;
      var ja_selected_angles = [];
      var a;

      if (node == null) {
        //Oh oh.. should not happen? We want to use a node that does not exist
        ja_log('[draw_node_markers] Null node at index ' + i + ' — should not happen', 1);
        continue;
      }
      //check connected segments
      var ja_current_node_segments = node.connectedSegmentIds;
      // EPSG:3857 projected units = cos(lat) × true meters; correct so turf distances match OL originals
      var ja_ld = ja_corrected_ld(ja_label_distance, node.geometry.coordinates);
      ja_log(node, 4);

      //ignore of we have less than 2 segments
      if (ja_current_node_segments.length <= 1) {
        ja_log('Found only ' + ja_current_node_segments.length + ' connected segments at ' + ja_nodes[i] + ', not calculating anything...', 3);
        continue;
      }

      ja_log('Calculating angles for ' + ja_current_node_segments.length + ' segments', 2);
      ja_log(ja_current_node_segments, 4);

      ja_current_node_segments.forEach(function (nodeSegment, j) {
        var s = sdk.DataModel.Segments.getById({ segmentId: nodeSegment });
        if (typeof s === 'undefined') {
          //Meh. Something went wrong, and we lost track of the segment. This needs a proper fix, but for now
          // it should be sufficient to just restart the calculation
          ja_log('Failed to read segment data from model. Restarting calculations.', 1);
          if (ja_last_restart === 0) {
            ja_last_restart = new Date().getTime();
            setTimeout(function () {
              ja_calculate();
            }, 500);
          }
          restart = true;
        }
        a = ja_getAngle(ja_nodes[i], s);
        ja_log('Segment ' + nodeSegment + ' angle is ' + a, 3);
        angles[j] = [a, nodeSegment, s == null ? false : ja_is_segment_selected(nodeSegment)];
        if (s == null ? false : ja_is_segment_selected(nodeSegment)) {
          ja_selected_segments_count++;
        }
      });

      if (restart) {
        return true;
      }

      //make sure we have the selected angles in correct order
      ja_log(ja_current_node_segments, 3);
      getselfeat().forEach(function (selectedSegment) {
        var selectedSegmentId = selectedSegment.id;
        ja_log('Checking if ' + selectedSegmentId + ' is in current node', 3);
        if (ja_current_node_segments.indexOf(selectedSegmentId) >= 0) {
          ja_log('It is!', 3);
          //find the angle
          for (var j = 0; j < angles.length; j++) {
            if (angles[j][1] === selectedSegmentId) {
              ja_selected_angles.push(angles[j]);
              break;
            }
          }
        } else {
          ja_log("It's not..", 3);
        }
      });

      ja_log(angles, 3);

      var ha, point;
      //if we have two connected segments selected, do some magic to get the turn angle only =)
      if (ja_selected_segments_count === 2) {
        a = ja_angle_diff(ja_selected_angles[0][0], ja_selected_angles[1][0], false);

        ha = (parseFloat(ja_selected_angles[0][0]) + parseFloat(ja_selected_angles[1][0])) / 2;
        if (
          Math.abs(ja_selected_angles[0][0]) + Math.abs(ja_selected_angles[1][0]) > 180 &&
          ((ja_selected_angles[0][0] < 0 && ja_selected_angles[1][0] > 0) || (ja_selected_angles[0][0] > 0 && ja_selected_angles[1][0] < 0))
        ) {
          ha += 180;
        }

        var ja_extra_space_multiplier = ja_compute_extra_space(a, ha);

        ja_log('Angle between ' + ja_selected_angles[0][1] + ' and ' + ja_selected_angles[1][1] + ' is ' + a + ' and position for label should be at ' + ha, 3);

        //Guess some routing instructions based on segment types, angles etc
        var ja_junction_type = ja_routing_type.TURN; //Default to old behavior

        if (ja_getOption('guess')) {
          ja_log(ja_selected_angles, 4);
          ja_log(angles, 4);
          ja_junction_type = ja_guess_routing_instruction(node, ja_selected_angles[0][1], ja_selected_angles[1][1], angles);
          ja_log('Type is: ' + ja_junction_type, 2);
        }
        //get the initial marker point
        point = turf.destination(turf.point(node.geometry.coordinates), (ja_extra_space_multiplier * ja_ld) / 1000, ja_math_to_compass(ha)).geometry;
        ja_draw_marker(point, node, ja_ld, a, ha, true, ja_junction_type);

        // Record this local marker for far-turn conflict detection
        // (Far-turn markers drawn later will check this data and adjust their distance if needed)
        if (!ja_local_markers_by_node[node.id]) {
          ja_local_markers_by_node[node.id] = [];
        }
        ja_local_markers_by_node[node.id].push({ bearing: ha, distance: ja_extra_space_multiplier * ja_ld });

        //draw double turn markers
        // If there are double-turn markers at this node+bearing, offset them farther out
        var doubleTurnMultiplier = ja_extra_space_multiplier;
        doubleTurns.forEachItem(ja_selected_angles[0][1], ja_selected_angles[1][1], function (item) {
          if (doubleTurnMultiplier === ja_extra_space_multiplier) {
            // First double-turn found: use larger distance to separate from local marker
            doubleTurnMultiplier = ja_extra_space_multiplier * 1.4;
            ja_log('[DOUBLE-TURN] Offset double-turn markers at node ' + node.id + ' by 1.4x', 2);
          }
          var doubleTurnPoint = turf.destination(turf.point(node.geometry.coordinates), (doubleTurnMultiplier * ja_ld) / 1000, ja_math_to_compass(ha)).geometry;
          ja_draw_marker(doubleTurnPoint, node, ja_ld, item.angle, ha, true, item.turn_type);
        });
      } else {
        //sort angle data (ascending)
        angles.sort(function (a, b) {
          return a[0] - b[0];
        });
        ja_log(angles, 4);
        ja_log(ja_selected_segments_count, 4);

        //get all segment angles
        angles.forEach(function (angle, j) {
          a = (360 + (angles[(j + 1) % angles.length][0] - angle[0])) % 360;
          ha = (360 + (a / 2 + angle[0])) % 360;
          var a_in = angles.filter(function (a) {
            return !!a[2];
          })[0];

          //Show only one angle for nodes with only 2 connected segments and a single selected segment
          // (not on both sides). Skipping the one > 180
          if (ja_selected_segments_count === 1 && angles.length === 2 && a >= 180 && ja_getOption('angleMode') !== 'aDeparture') {
            ja_log('Skipping marker, as we need only one of them', 3);
            return;
          }
          if (ja_getOption('angleMode') === 'aDeparture' && ja_selected_segments_count > 0) {
            if (a_in[1] === angle[1]) {
              ja_log('in == out. skipping.', 3);
              return;
            }
            ja_log('Angle in:', 3);
            ja_log(a_in, 4);
            ja_log(ja_guess_routing_instruction(node, a_in[1], angle[1], angles), 3);
            //FIXME: we might want to try to keep the marker on the segment, instead of just
            //in the direction of the first part
            ha = angle[0];
            a = ja_angle_diff(a_in[0], angles[j][0], false);
            point = turf.destination(turf.point(node.geometry.coordinates), (ja_ld * 2) / 1000, ja_math_to_compass(ha)).geometry;

            // CHECK FOR ENTRY SEGMENT CROSSING INTO JB
            // If entry is outside JB and exit crosses out of JB boundary, move marker to boundary
            var markerAnchor = node;
            var isSquareMarker = false;
            var entryIsInJB = sdk.DataModel.Segments.isContainedInBigJunction({ segmentId: a_in[1] });

            // Only check for boundary crossing if entry is outside JB
            if (!entryIsInJB) {
              var exitSegment = sdk.DataModel.Segments.getById({ segmentId: angle[1] });
              if (exitSegment) {
                // Search for JB that the exit segment crosses OUT of
                for (var bji = 0; bji < allBigJunctions.length; bji++) {
                  var bjPolygon = turf.polygon(allBigJunctions[bji].geometry.coordinates);

                  // Check if current node is inside this JB
                  var nodeIsInside = turf.booleanPointInPolygon(turf.point(node.geometry.coordinates), bjPolygon);

                  if (nodeIsInside) {
                    // Get the far endpoint of exit segment (node that's NOT the current node)
                    var exitCoords = exitSegment.geometry.coordinates;
                    var farEndpoint =
                      Math.abs(exitCoords[0][0] - node.geometry.coordinates[0]) < 0.0001 && Math.abs(exitCoords[0][1] - node.geometry.coordinates[1]) < 0.0001 ? exitCoords[1] : exitCoords[0];

                    var farIsInside = turf.booleanPointInPolygon(turf.point(farEndpoint), bjPolygon);

                    // If node is inside and far endpoint is outside, this exit crosses out of JB
                    if (!farIsInside) {
                      var closestPt = ja_find_closest_bj_intersection(exitSegment, bjPolygon, node);
                      if (closestPt !== null) {
                        markerAnchor = { geometry: closestPt.geometry };
                        isSquareMarker = true;
                        // Recalculate point from boundary anchor
                        // Use larger distance (3.5x) to avoid overlapping with WME's turn restriction arrows at the boundary
                        var boundaryLd = ja_corrected_ld(ja_label_distance, markerAnchor.geometry.coordinates);
                        point = turf.destination(turf.point(markerAnchor.geometry.coordinates), (boundaryLd * 3.5) / 1000, ja_math_to_compass(ha)).geometry;
                        ja_log('[JAI] Entry-to-JB crossing: moving marker to boundary (3.5x distance to avoid WME turn arrow overlap)', 2);
                        break;
                      }
                    }
                  }
                }
              }
            }

            ja_draw_marker(
              point,
              markerAnchor,
              ja_ld,
              a,
              ha,
              true,
              ja_getOption('guess') ? ja_guess_routing_instruction(node, a_in[1], angle[1], angles) : ja_routing_type.TURN,
              false,
              isSquareMarker,
            );

            // Record this local marker for far-turn conflict detection
            // (Far-turn markers drawn later will check this data and adjust their distance if needed)
            if (!ja_local_markers_by_node[node.id]) {
              ja_local_markers_by_node[node.id] = [];
            }
            ja_local_markers_by_node[node.id].push({ bearing: ha, distance: 2 * ja_ld });

            //draw double turn markers
            // If there are double-turn markers at this node+bearing, offset them farther out
            // Use larger offset if at JB boundary to avoid WME turn restriction arrows
            var doubleTurnDepartureMult = isSquareMarker ? 4.2 : 2.7;
            doubleTurns.forEachItem(a_in[1], angle[1], function (item) {
              if ((isSquareMarker && doubleTurnDepartureMult === 4.2) || (!isSquareMarker && doubleTurnDepartureMult === 2.7)) {
                // First double-turn found at this anchor (boundary or node)
                doubleTurnDepartureMult = isSquareMarker ? 4.9 : 3.3;
                var boundarySuffix = isSquareMarker ? ' (at JB boundary)' : '';
                ja_log('[DOUBLE-TURN] Offset double-turn markers at node ' + node.id + ' by ' + doubleTurnDepartureMult.toFixed(1) + 'x (departure mode)' + boundarySuffix, 2);
              }
              var doubleTurnDeparturePoint = turf.destination(turf.point(markerAnchor.geometry.coordinates), (doubleTurnDepartureMult * ja_ld) / 1000, ja_math_to_compass(ha)).geometry;
              ja_draw_marker(doubleTurnDeparturePoint, markerAnchor, ja_ld, item.angle, ha, true, item.turn_type, false, isSquareMarker);
            });
          } else {
            ja_log('Angle between ' + angle[1] + ' and ' + angles[(j + 1) % angles.length][1] + ' is ' + a + ' and position for label should be at ' + ha, 3);
            point = turf.destination(turf.point(node.geometry.coordinates), (ja_ld * 1.25) / 1000, ja_math_to_compass(ha)).geometry;
            ja_draw_marker(point, node, ja_ld, a, ha);

            // Record this local marker for far-turn conflict detection
            // (Far-turn markers drawn later will check this data and adjust their distance if needed)
            if (!ja_local_markers_by_node[node.id]) {
              ja_local_markers_by_node[node.id] = [];
            }
            ja_local_markers_by_node[node.id].push({ bearing: ha, distance: 1.25 * ja_ld });
          }
        });
      }

      // ── Far turn markers (experimental) ─────────────────────────────────
      // Draw angle markers for all far turns (Path turns and Junction Box turns)
      // that originate from THIS node. Placed inside the per-node loop so it runs
      // once per node with the correct `node` and `ja_ld` values in scope.
      //
      // These are turns whose entry and exit segments are NOT directly adjacent —
      // they cross intermediate segments via segmentPath[].
      //
      // Placed after the regular segment-pair markers so far turn markers render
      // on top without interfering with the standard angle annotations.
      //
      // DEPARTURE MODE ONLY: Far turns (Paths and JB turns) only make sense in
      // Departure mode where you select an entry segment and see where it goes.
      // In Absolute mode, we only show geometric gaps between adjacent pairs,
      // independent of direction of travel, so far turns should not appear.
      //
      // Far-turn display is controlled by experimental settings:
      // - "Enable JAI for Junction Boxes" (enableFarTurnJB)
      // - "Enable JAI for Paths" (enableFarTurnPath)
      // Both are disabled by default. Actual filtering happens inside ja_draw_far_turn_markers().
      //
      // Suppressed when any selected segment is a JB median: internal segments are handled
      // by the regular node-pair loop above; far-turn exit markers would be misleading.
      // Also suppressed when a pure node is selected: show only absolute angles at that node.
      if (ja_getOption('angleMode') === 'aDeparture' && !ja_selected_has_median && !ja_is_pure_node_selection) {
        ja_draw_far_turn_markers(node, ja_label_distance, ja_selected_seg_ids, allBigJunctions);
      }
    }

    // Draw far-exit double-turn markers triggered by arm selection.
    // Placed at the median's far node along the exit arm's bearing — matching the
    // visual position produced when the median itself is selected directly.
    doubleTurns.farExitMarkers.forEach(function (item) {
      var farNode = sdk.DataModel.Nodes.getById({ nodeId: item.farNodeId });
      if (!farNode) return;
      var farLd = ja_corrected_ld(ja_label_distance, farNode.geometry.coordinates);

      // CHECK FOR LOCAL TURN MARKER CONFLICT AT FAR NODE
      // If a local turn at this far node targets the same direction, move this far-exit marker out farther
      var hasFarNodeConflict = ja_local_markers_by_node[item.farNodeId] &&
                               ja_local_markers_by_node[item.farNodeId].some(function(ltMarker) {
                                 return ja_markers_target_same_direction(item.exitBearing, ltMarker.bearing, 30);
                               });
      var farExitDist = hasFarNodeConflict ? 3.2 : 2.0;
      if (hasFarNodeConflict) {
        ja_log('[MARKER-OVERLAP] Far-exit double-turn conflict at node ' + item.farNodeId + ' bearing ' + item.exitBearing + ' — using 3.2x distance', 2);
      }

      var pt = turf.destination(turf.point(farNode.geometry.coordinates), (farExitDist * farLd) / 1000, ja_math_to_compass(item.exitBearing)).geometry;
      ja_draw_marker(pt, farNode, farLd, item.angle, item.exitBearing, true, item.turn_type);
    });

    return false;
  }

  /**
   * Main entry point for junction angle calculation and marker rendering.
   *
   * Triggered by every selection-change, zoom, or map-move event. Clears the
   * junction_angles layer, collects the selected nodes, computes label distances,
   * identifies roundabouts, draws roundabout markers, identifies double-turn
   * connector segments, then draws per-node angle markers.
   *
   * Selection handling:
   * - 1 feature (segment or node): standard single-selection mode — all connected angles shown.
   * - Exactly 2 segments that share a node: two-segment mode — one turn-angle marker is drawn
   *   at the shared junction node, color-coded with routing instruction prediction.
   * - 2 segments with no shared node, 2 mixed types, or 3+ features: no markers drawn.
   *
   * Exits early if the data model returns stale data that requires a deferred retry.
   */
  function testSelectedItem() {
    // Always clear the layer first to stay in sync with selection state
    sdk.Map.removeAllFeaturesFromLayer({ layerName: 'junction_angles' });
    ja_roundabout_points = [];
    ja_current_features = [];
    ja_feature_counter = 0;

    // Clear marker position tracking maps so local/far-turn conflict detection starts fresh
    ja_local_markers_by_node = {};
    ja_far_turn_bearings_by_node = {};

    // Cache traffic handedness for this render pass (used in ja_guess_routing_instruction and ja_draw_roundabout_entry_exits)
    ja_is_left_hand_traffic = (sdk.DataModel.Countries.getAll()[0] || {}).isLeftHandTraffic || false;

    // Early exit if nothing is selected (after cleanup)
    var ja_selfeat = getselfeat();
    if (ja_selfeat.length === 0 || ja_selfeat.length > 2) {
      return;
    }

    if (sdk.Map.getZoomLevel() < MIN_ZOOM_LEVEL) {
      return;
    }
    if (ja_getOption('roundaboutOverlayDisplay') === 'rOverAlways') {
      ja_draw_roundabout_overlay();
    }

    var ja_start_time = Date.now();
    var ja_nodes = [];

    if (ja_selfeat.length === 2) {
      // Two-segment mode: only supported when both selected features are segments
      if (ja_selfeat[0].type !== 'segment' || ja_selfeat[1].type !== 'segment') {
        return;
      }
      var seg0 = sdk.DataModel.Segments.getById({ segmentId: ja_selfeat[0].id });
      var seg1 = sdk.DataModel.Segments.getById({ segmentId: ja_selfeat[1].id });
      if (!seg0 || !seg1) {
        return;
      }
      // Find the node shared by both segments — this is the junction to measure
      var seg0Nodes = [seg0.fromNodeId, seg0.toNodeId];
      var seg1Nodes = [seg1.fromNodeId, seg1.toNodeId];
      var sharedNodeId = seg0Nodes.filter(function (id) {
        return seg1Nodes.indexOf(id) >= 0;
      })[0];
      if (sharedNodeId == null) {
        return;
      } // segments not connected — nothing to show
      ja_nodes.push(sharedNodeId);
    } else {
      // Single feature — extract endpoint nodes from segment, or push node id directly
      ja_selfeat.forEach(function (element) {
        switch (element.type) {
          case 'node':
            ja_nodes.push(element.id);
            break;
          case 'segment':
            var seg = sdk.DataModel.Segments.getById({ segmentId: element.id });
            if (seg && seg.fromNodeId != null && ja_nodes.indexOf(seg.fromNodeId) === -1) {
              ja_nodes.push(seg.fromNodeId);
            }
            if (seg && seg.toNodeId != null && ja_nodes.indexOf(seg.toNodeId) === -1) {
              ja_nodes.push(seg.toNodeId);
            }
            break;
          case 'venue':
            break;
          default:
            ja_log('Found unknown item type: ' + element.type, 1);
            break;
        }
        ja_log(ja_nodes, 4);
      });
    }

    var ja_label_distance = ja_compute_label_distance();
    // Cache BigJunctions for the entire render pass — eliminates 5 separate .getAll() calls
    var allBigJunctions = sdk.DataModel.BigJunctions.getAll();

    // When a node is directly selected (not via segment selection), suppress roundabout/path/junction
    // markers — show only the node's absolute angle markers (angles at that specific node).
    var ja_is_pure_node_selection = ja_selfeat.length === 1 && ja_selfeat[0].type === 'node';

    // Only draw roundabout and path/junction markers if NOT a pure node selection
    if (!ja_is_pure_node_selection) {
      var ja_selected_roundabouts = ja_find_roundabouts(ja_nodes);
      ja_draw_roundabout_markers(ja_selected_roundabouts, ja_label_distance);
    }

    // When a single roundabout arc is selected, ja_draw_roundabout_entry_exits already shows
    // all exit info relative to the arc's fromNode. Suppress ja_draw_node_markers so the
    // regular intersection-style angles don't fire on the roundabout's own nodes.
    var ja_marker_nodes = ja_nodes;
    if (ja_selfeat.length === 1 && ja_selfeat[0].type === 'segment') {
      var _arcSeg = sdk.DataModel.Segments.getById({ segmentId: ja_selfeat[0].id });
      if (_arcSeg && _arcSeg.junctionId !== null) {
        ja_marker_nodes = [];
      }
    }

    var doubleTurns = ja_collect_double_turns(ja_marker_nodes, allBigJunctions);

    // True if any selected segment is contained inside a BigJunction (a median/intermediate
    // segment). In that case ja_draw_node_markers suppresses far-turn markers: the regular
    // node-pair loop handles internal angles, and far-turn exit markers would be misleading.
    var ja_selected_has_median = ja_selfeat.some(function (feat) {
      return feat.type === 'segment' && sdk.DataModel.Segments.isContainedInBigJunction({ segmentId: feat.id });
    });

    // IDs of the segments explicitly selected by the user. Used to restrict far-turn marker
    // drawing to only the selected entry segment(s), matching how regular departure-mode
    // markers work (angles shown FROM the selected segment, not FROM all segments at the node).
    //
    // When a node is selected directly (no segment in ja_selfeat), this array is empty — in
    // that case ja_draw_far_turn_markers shows far turns from ALL connected non-median segments.
    var ja_selected_seg_ids = ja_selfeat
      .filter(function (feat) {
        return feat.type === 'segment';
      })
      .map(function (feat) {
        return feat.id;
      });

    if (ja_draw_node_markers(ja_marker_nodes, ja_label_distance, doubleTurns, ja_selected_has_median, ja_selected_seg_ids, allBigJunctions, ja_is_pure_node_selection)) {
      return;
    }

    ja_last_restart = 0;
    var ja_end_time = Date.now();
    ja_log('Calculation took ' + String(ja_end_time - ja_start_time) + ' ms', 3);
  }

  /**
   * Alias for testSelectedItem used by deferred callers (ja_apply, ja_calculation_timer).
   *
   * Some paths need to schedule a recalculation after an async delay (e.g. after
   * settings change). They call ja_calculate_real() by reference captured before
   * the alias is established. Both names refer to the same function.
   */
  // Alias so ja_calculate_real() calls (from timer/ja_apply) work
  var ja_calculate_real = testSelectedItem;

  /*
   * Drawing functions
   */

  /**
   * Predicts the Waze routing instruction for a turn from one segment to another.
   *
   * Implements a multi-step decision tree:
   * 1. Checks for a manually overridden turn instruction (instructionOpCode).
   * 2. Classifies by angle: BC (best continuation / no instruction), Keep Left/Right,
   *    Turn Left/Right, U-Turn, or gray-zone PROBLEM.
   * 3. Refines Keep vs BC using street name continuity, road type hierarchy, and
   *    segment count to determine which exit is the "straight-through" road.
   * 4. Handles ramp and exit-road special cases.
   *
   * @param {Object} node - SDK Node object at the junction.
   * @param {number} s_in_id - Segment ID of the incoming road.
   * @param {number} s_out_id - Segment ID of the candidate exit.
   * @param {Array} angles - All bearing/segmentId/isSelected triples at this node.
   * @returns {string} A ja_routing_type value string.
   */
  function ja_guess_routing_instruction(node, s_in_a, s_out_a, angles) {
    var s_n = {},
      s_in = null,
      s_out = {},
      street_n = {},
      street_in = null,
      angle;
    var s_in_id = s_in_a;
    var s_out_id = s_out_a;

    ja_log('Guessing routing instructions from ' + s_in_a + ' via node ' + node.id + ' to ' + s_out_a, 2);

    s_in_a = angles.filter(function (element) {
      return element[1] === s_in_a;
    });
    s_out_a = angles.filter(function (element) {
      return element[1] === s_out_a;
    });

    node.connectedSegmentIds.forEach(function (element) {
      if (element === s_in_id) {
        s_in = sdk.DataModel.Segments.getById({ segmentId: element });
        street_in = ja_get_streets(element);
        if (street_in.primary == null) {
          street_in.primary = { name: '' };
        } else if (street_in.primary.name == null) {
          street_in.primary.name = '';
        }
      } else {
        if (element === s_out_id) {
          s_out[element] = sdk.DataModel.Segments.getById({ segmentId: element });
          if (typeof s_out[element].primary === 'undefined') {
            s_out[element].primary = { name: '' };
          }
        }
        s_n[element] = sdk.DataModel.Segments.getById({ segmentId: element });
        street_n[element] = ja_get_streets(element);
        if (street_n[element].primary == null) {
          street_n[element].primary = { name: '' };
        }
      }
    });

    if (s_in === null || street_in === null) {
      return ja_routing_type.PROBLEM;
    }

    angle = ja_angle_diff(s_in_a[0], s_out_a[0], false);
    ja_log('turn angle is: ' + angle, 3);

    if (!ja_is_turn_allowed(s_in, node, s_out[s_out_id])) {
      ja_log('Turn is disallowed!', 2);
      return ja_routing_type.NO_TURN;
    }

    //seb-d59: Check override instruction
    if (ja_getOption('override')) {
      var turns = sdk.DataModel.Turns.getTurnsThroughNode({ nodeId: node.id });
      var overrideTurn = turns.find(function (t) {
        return t.fromSegmentId === s_in_id && t.toSegmentId === s_out_id;
      });
      var opcode = overrideTurn ? overrideTurn.instructionOpCode : null;
      if (opcode !== null) {
        var opcodeType = ja_opcode_to_routing_type(opcode, true);
        if (opcodeType !== null) {
          return opcodeType;
        }
      }
    }

    //Roundabout - no true instruction guessing here!
    if (s_in.junctionId) {
      if (s_out[s_out_id].junctionId) {
        ja_log('Roundabout continuation - no instruction', 2);
        return ja_routing_type.BC;
      } else {
        ja_log('Roundabout exit', 2);
        return ja_routing_type.ROUNDABOUT_EXIT;
      }
    } else if (s_out[s_out_id].junctionId) {
      ja_log('Roundabout entry - no instruction', 2);
      return ja_routing_type.BC;
    }

    if (Math.abs(angle) > U_TURN_ANGLE + GRAY_ZONE) {
      ja_log('Angle is >= 170 - U-Turn', 2);
      return ja_routing_type.U_TURN;
    } else if (Math.abs(angle) > U_TURN_ANGLE - GRAY_ZONE) {
      ja_log('Angle is in gray zone 169-171', 3);
      return ja_routing_type.PROBLEM;
    }

    if (node.connectedSegmentIds.length <= 2) {
      ja_log('Only one possible turn - no instruction', 2);
      return ja_routing_type.BC;
    }

    if (Math.abs(angle) < TURN_ANGLE - GRAY_ZONE) {
      ja_log('Turn is <= 44', 3);

      angles = angles.filter(function (a) {
        if (s_out_id === a[1] || (typeof s_n[a[1]] !== 'undefined' && ja_is_turn_allowed(s_in, node, s_n[a[1]]) && Math.abs(ja_angle_diff(s_in_a, a[0], false)) < TURN_ANGLE)) {
          return true;
        } else {
          if (street_n[a[1]]) {
            delete s_n[a[1]];
            delete street_n[a[1]];
          }
          return false;
        }
      });

      if (angles.length <= 1) {
        return ja_routing_type.BC;
      }

      var bc_matches = {},
        bc_prio = 0,
        bc_count = 0;
      /**
       * Accumulates a BC candidate into `bc_matches` using a priority-wins strategy.
       *
       * If `prio` is higher than the current best priority, the candidate set is reset and
       * only this candidate is kept.  Candidates at the same priority are added alongside
       * existing ones.  Lower-priority candidates are silently ignored.  The final `bc_matches`
       * map contains only the highest-priority candidates, used to decide whether to assign a
       * BC instruction or fall through to Keep/Turn classification.
       *
       * @param {Array} a - Candidate angle tuple (format: `[angle, segmentId, ...]`).
       * @param {number} prio - Priority level; higher values win (e.g. name-match > road-type).
       */
      var bc_collect = function (a, prio) {
        if (prio > bc_prio) {
          bc_matches = {};
          bc_prio = prio;
          bc_count = 0;
        }
        if (prio === bc_prio) {
          bc_matches[a[1]] = a;
          bc_count++;
        }
      };

      for (var k = 0; k < angles.length; k++) {
        var a = angles[k];
        var tmp_s_out = {};
        tmp_s_out[a[1]] = s_n[a[1]];
        var tmp_street_out = {};
        tmp_street_out[a[1]] = street_n[a[1]];
        var name_match = ja_primary_name_match(street_in, tmp_street_out) || ja_alt_name_match(street_in, tmp_street_out) || ja_cross_name_match(street_in, tmp_street_out);
        if (name_match && ja_segment_type_match(s_in, tmp_s_out)) {
          bc_collect(a, 3);
        } else if (name_match) {
          bc_collect(a, 2);
        } else if (ja_segment_type_match(s_in, tmp_s_out)) {
          bc_collect(a, 1);
        }
      }

      if (bc_matches[s_out_id] !== undefined && bc_count === 1) {
        ja_log('"straight": no instruction', 2);
        return ja_routing_type.BC;
      }

      angles.sort(function (a, b) {
        return ja_angle_dist(a[0], s_in_a[0][0]) - ja_angle_dist(b[0], s_in_a[0][0]);
      });

      if (!ja_is_left_hand_traffic) {
        //RHT
        if (angles[0][1] === s_out_id && !ja_overlapping_angles(angles[0][0], angles[1][0])) {
          ja_log('Left most <45 segment: keep left', 2);
          return ja_routing_type.KEEP_LEFT;
        }
      } else {
        //LHT
        if (angles[angles.length - 1][1] === s_out_id && !ja_overlapping_angles(angles[angles.length - 1][0], angles[angles.length - 2][0])) {
          ja_log('Right most <45 segment: keep right', 2);
          return ja_routing_type.KEEP_RIGHT;
        }
      }

      var overlap_i = 1;
      while (overlap_i < angles.length && ja_overlapping_angles(angles[0][0], angles[overlap_i][0])) {
        ++overlap_i;
      }
      if (overlap_i > 1 && overlap_i === angles.length) {
        return ja_routing_type.BC;
      }

      if (ja_is_primary_road(s_in) && !ja_is_primary_road(s_out[s_out_id])) {
        ja_log('Primary to non-primary = exit', 2);
        return ja_is_left_hand_traffic ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
      }
      if (ja_is_ramp(s_in) && !ja_is_primary_road(s_out[s_out_id]) && !ja_is_ramp(s_out[s_out_id])) {
        ja_log('Ramp to non-primary and non-ramp = exit', 2);
        return ja_is_left_hand_traffic ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
      }

      return ja_is_left_hand_traffic ? ja_routing_type.KEEP_LEFT : ja_routing_type.KEEP_RIGHT;
    } else {
      // Use centralized angle classification for consistency
      return ja_classify_turn_angle(angle);
    }
  }
  /**
   * Places a single angle marker feature on the junction_angles layer.
   *
   * Handles label text formatting for both Fancy (arrow on own line) and Simple
   * (arrow inline) display styles, then checks for overlap with already-placed
   * markers (ja_current_features). If the candidate point overlaps an existing
   * marker, nudges it outward in the direction of ha until clear. Adds the feature
   * via sdk.Map.addFeatureToLayer with properties that drive the styleRules.
   *
   * @param {GeoJSON.Point} point - Initial candidate geometry for the marker.
   * @param {Object} node - SDK Node object at the junction.
   * @param {number} ja_label_distance - Base offset distance in meters.
   * @param {number} a - Signed turn angle in degrees to display.
   * @param {number} ha - Bearing from the node to the marker (for nudge direction).
   * @param {boolean} [withRouting=false] - True: include routing instruction type and arrow.
   * @param {string} [ja_junction_type] - ja_routing_type value; required when withRouting is true.
   * @param {boolean} [isFarTurn=false] - True for far-turn markers (path/JB breadcrumbs).
   * @param {boolean} [isSquareMarker=false] - True to render as square; false for round (intermediate breadcrumb).
   */
  function ja_draw_marker(point, node, ja_label_distance, a, ha, withRouting, ja_junction_type, isFarTurn, isSquareMarker) {
    //Try to estimate of the point is "too close" to another point
    //(or maybe something else in the future; like turn restriction arrows or something)
    //FZ69617: Exctract initial label distance from point
    var ja_tmp_distance = turf.distance(turf.point(node.geometry.coordinates), turf.point(point.coordinates)) * 1000; // meters
    ja_log('Starting distance estimation', 3);
    while (
      ja_current_features.some(function (feat) {
        if (feat.ja_type !== 'roundaboutOverlay') {
          var dist = turf.distance(turf.point(feat.coordinates), turf.point(point.coordinates)) * 1000;
          if (ja_label_distance / 1.4 > dist) {
            ja_log(ja_label_distance / 1.5 > dist + ' is kinda close..', 3);
            return true;
          }
        }
        return false;
      })
    ) {
      //add 1/4 of the original distance and hope for the best =)
      ja_tmp_distance += ja_label_distance / 4;
      ja_log('setting distance to ' + ja_tmp_distance, 3);
      point = turf.destination(turf.point(node.geometry.coordinates), ja_tmp_distance / 1000, ja_math_to_compass(ha)).geometry;
    }
    ja_log('Distance estimation done', 3);

    var angleString = ja_round(Math.abs(a)) + '°';

    //FZ69617: Add direction arrows for turn instructions only
    if (ja_getOption('angleDisplay') === 'displaySimple') {
      switch (ja_junction_type) {
        case ja_routing_type.TURN:
          angleString = a > 0 ? ja_arrow.left() + angleString : angleString + ja_arrow.right();
          break;
        case ja_routing_type.TURN_LEFT:
          angleString = ja_arrow.left() + angleString;
          break;
        case ja_routing_type.TURN_RIGHT:
          angleString = angleString + ja_arrow.right();
          break;
        case ja_routing_type.EXIT:
        case ja_routing_type.KEEP:
          angleString = a > 0 ? ja_arrow.left_up() + angleString : angleString + ja_arrow.right_up();
          break;
        case ja_routing_type.EXIT_LEFT:
        case ja_routing_type.KEEP_LEFT:
          angleString = ja_arrow.left_up() + angleString;
          break;
        case ja_routing_type.EXIT_RIGHT:
        case ja_routing_type.KEEP_RIGHT:
          angleString += ja_arrow.right_up();
          break;
        //Override
        case ja_routing_type.OverrideBC:
          angleString = ja_getOption('overrideAngles') ? angleString : '';
          break;
        case ja_routing_type.OverrideCONTINUE:
          angleString = ja_arrow.up() + (ja_getOption('overrideAngles') ? angleString : '');
          break;
        case ja_routing_type.OverrideTURN_LEFT:
          angleString = ja_arrow.left() + (ja_getOption('overrideAngles') ? angleString : '');
          break;
        case ja_routing_type.OverrideTURN_RIGHT:
          angleString = (ja_getOption('overrideAngles') ? angleString : '') + ja_arrow.right();
          break;
        case ja_routing_type.OverrideEXIT_LEFT:
        case ja_routing_type.OverrideKEEP_LEFT:
          angleString = ja_arrow.left_up() + (ja_getOption('overrideAngles') ? angleString : '');
          break;
        case ja_routing_type.OverrideEXIT_RIGHT:
        case ja_routing_type.OverrideKEEP_RIGHT:
          angleString = (ja_getOption('overrideAngles') ? angleString : '') + ja_arrow.right_up();
        default:
          ja_log('No extra format for junction type: ' + ja_junction_type, 3);
      }
    } else {
      switch (ja_junction_type) {
        case ja_routing_type.TURN:
          angleString = (a > 0 ? ja_arrow.left() : ja_arrow.right()) + '\n' + angleString;
          break;
        case ja_routing_type.TURN_LEFT:
          angleString = ja_arrow.left() + '\n' + angleString;
          break;
        case ja_routing_type.TURN_RIGHT:
          angleString = ja_arrow.right() + '\n' + angleString;
          break;
        case ja_routing_type.EXIT:
        case ja_routing_type.KEEP:
          angleString = (a > 0 ? ja_arrow.left_up() : ja_arrow.right_up()) + '\n' + angleString;
          break;
        case ja_routing_type.EXIT_LEFT:
        case ja_routing_type.KEEP_LEFT:
          angleString = ja_arrow.left_up() + '\n' + angleString;
          break;
        case ja_routing_type.EXIT_RIGHT:
        case ja_routing_type.KEEP_RIGHT:
          angleString = ja_arrow.right_up() + '\n' + angleString;
          break;
        case ja_routing_type.PROBLEM:
          angleString = '?\n' + angleString;
          break;
        //Override
        case ja_routing_type.OverrideBC:
          angleString = ja_getOption('overrideAngles') ? angleString : '';
          break;
        case ja_routing_type.OverrideCONTINUE:
          angleString = ja_arrow.up() + (ja_getOption('overrideAngles') ? '\n' + angleString : '');
          break;
        case ja_routing_type.OverrideTURN_LEFT:
          angleString = ja_arrow.left() + (ja_getOption('overrideAngles') ? '\n' + angleString : '');
          break;
        case ja_routing_type.OverrideTURN_RIGHT:
          angleString = ja_arrow.right() + (ja_getOption('overrideAngles') ? '\n' + angleString : '');
          break;
        case ja_routing_type.OverrideEXIT_LEFT:
        case ja_routing_type.OverrideKEEP_LEFT:
          angleString = ja_arrow.left_up() + (ja_getOption('overrideAngles') ? '\n' + angleString : '');
          break;
        case ja_routing_type.OverrideEXIT_RIGHT:
        case ja_routing_type.OverrideKEEP_RIGHT:
          angleString = ja_arrow.right_up() + (ja_getOption('overrideAngles') ? '\n' + angleString : '');
          break;
        default:
          ja_log('No extra format for junction type: ' + ja_junction_type, 3);
      }
    }

    var angleProps = withRouting
      ? { angle: angleString, ja_type: ja_junction_type, ja_is_far_turn: !!isFarTurn, ja_is_square_marker: !!isSquareMarker }
      : { angle: ja_round(a) + '°', ja_type: 'generic', ja_is_square_marker: !!isSquareMarker };
    ja_log(angleProps, 4);

    //Don't paint points inside an overlaid roundabout
    if (
      ja_roundabout_points.some(function (roundaboutPolygon) {
        return turf.booleanPointInPolygon(turf.point(point.coordinates), roundaboutPolygon);
      })
    ) {
      return;
    }

    //Draw a line to the point
    ja_add_feature({ type: 'LineString', coordinates: [node.geometry.coordinates, point.coordinates] }, { ja_type: 'arrow_line' });

    //push the angle point
    ja_current_features.push({ coordinates: point.coordinates, ja_type: angleProps.ja_type });
    ja_add_feature(point, angleProps);
  }

  /**
   * Draws a circle polygon overlay on the junction_angles layer for one or all roundabouts.
   *
   * When called with a junctionId, draws a single circle for that junction.
   * When called without arguments, draws circles for every junction in the data model
   * (used for the 'rOverAlways' display mode).
   *
   * The circle radius is the mean distance from the WME junction center point to all
   * of its arc nodes, giving an approximate fit to the physical road ring. Drawn as a
   * 40-step Turf.js polygon feature styled by the roundaboutOverlayColor setting.
   *
   * @param {number} [junctionId] - Optional. If provided, draws only this junction's circle.
   */
  function ja_draw_roundabout_overlay(junctionId) {
    (junctionId === undefined
      ? sdk.DataModel.Junctions.getAll()
      : (function (junction) {
          return junction === undefined ? [] : [junction];
        })(sdk.DataModel.Junctions.getById({ junctionId: junctionId }))
    ).forEach(function (element) {
      ja_log(element, 3);
      var nodes = {};
      element.segmentIds.forEach(function (s) {
        var seg = sdk.DataModel.Segments.getById({ segmentId: s });
        ja_log(seg, 3);
        // Guard against null node IDs (can happen with unsaved segments)
        if (seg.fromNodeId) nodes[seg.fromNodeId] = sdk.DataModel.Nodes.getById({ nodeId: seg.fromNodeId });
        if (seg.toNodeId) nodes[seg.toNodeId] = sdk.DataModel.Nodes.getById({ nodeId: seg.toNodeId });
      });

      ja_log(nodes, 3);
      var center = element.geometry; // GeoJSON Point
      ja_log(center, 3);
      var distances = [];
      Object.getOwnPropertyNames(nodes).forEach(function (name) {
        ja_log('Checking ' + name + ' distance', 3);
        // Skip if node is null or doesn't have geometry (unsaved segments can cause this)
        if (nodes[name] && nodes[name].geometry) {
          var dist = turf.distance(turf.point(nodes[name].geometry.coordinates), turf.point(center.coordinates)) * 1000;
          distances.push(dist);
        }
      });
      ja_log(distances, 3);
      // Skip circle drawing if no valid nodes (all were null due to unsaved segments)
      if (distances.length === 0) {
        ja_log('No valid nodes for roundabout overlay (unsaved segments?)', 2);
        return;
      }
      var meanDistM =
        distances.reduce(function (a, b) {
          return a + b;
        }) / distances.length;
      ja_log('Mean distance is ' + meanDistM, 3);

      var circleGeom = turf.circle(turf.point(center.coordinates), meanDistM / 1000, { steps: 40 }).geometry;
      ja_roundabout_points.push(circleGeom);
      ja_add_feature(circleGeom, { ja_type: 'roundaboutOverlay' });
    });
  }

  /*
   * Segment and routing helpers
   */

  /**
   * Returns true if the road type of segment_in matches any road type in the segments array.
   *
   * Used by ja_guess_routing_instruction() to compare incoming and outgoing road type
   * hierarchies when deciding between Keep and BC (best continuation) instructions.
   *
   * @param {Object} segment_in - SDK Segment object whose road type to test.
   * @param {Object[]} segments - Array of SDK Segment objects to match against.
   * @returns {boolean} True if any segment in the array shares segment_in's road type.
   */
  function ja_segment_type_match(segment_in, segments) {
    ja_log(segment_in, 4);
    ja_log(segments, 4);

    return Object.getOwnPropertyNames(segments).some(function (segment_n_id, index) {
      var segment_n = segments[segment_n_id];
      ja_log('[segment_type_match] Checking element ' + index, 3);
      ja_log(segment_n, 4);
      if (segment_n.id === segment_in.id) {
        return false;
      }
      ja_log('[segment_type_match] roadType ' + segment_n.roadType + ' vs ' + segment_in.roadType, 3);
      return segment_n.roadType === segment_in.roadType;
    });
  }

  /**
   * Returns true if the segment is a primary street or major/minor highway.
   *
   * @param {Object} seg - SDK Segment object.
   * @returns {boolean}
   */
  function ja_is_primary_road(seg) {
    var t = seg.roadType;
    return t === ja_road_type.FREEWAY || t === ja_road_type.MAJOR_HIGHWAY || t === ja_road_type.MINOR_HIGHWAY;
  }

  /**
   * Returns true if the segment qualifies for double U-turn detection.
   * Primary Street and above are always included. Street, Parking Lot Road, and
   * Private Road are opt-in via the U-Turn detection settings.
   * @param {Object} seg - SDK Segment object.
   * @returns {boolean}
   */
  function ja_is_uturn_qualifying_road(seg) {
    var t = seg.roadType;
    if (t === ja_road_type.FREEWAY || t === ja_road_type.RAMP || t === ja_road_type.MAJOR_HIGHWAY || t === ja_road_type.MINOR_HIGHWAY || t === ja_road_type.PRIMARY_STREET) return true;
    if (t === ja_road_type.STREET && ja_getOption('uTurnIncludeStreet')) return true;
    if (t === ja_road_type.PARKING_LOT_ROAD && ja_getOption('uTurnIncludeParkingLot')) return true;
    if (t === ja_road_type.PRIVATE_ROAD && ja_getOption('uTurnIncludePrivateRoad')) return true;
    return false;
  }

  /**
   * Returns true if the segment is classified as a ramp.
   *
   * @param {Object} seg - SDK Segment object.
   * @returns {boolean}
   */
  function ja_is_ramp(seg) {
    var t = seg.roadType;
    return t === ja_road_type.RAMP;
  }

  /**
   * Returns true if the turn from segmentId at nodeId toward toSegmentId has
   * lane guidance configured (turn.lanes !== null).
   *
   * Per the Waze U-turn spec, a median 31–49 m long qualifies for double-turn
   * detection only when the incoming segment has lane guidance set up on its
   * approach to the median junction node.
   *
   * @param {number} segmentId - ID of the incoming segment.
   * @param {number} nodeId - ID of the junction node shared with the median.
   * @param {number} toSegmentId - ID of the median segment.
   * @returns {boolean}
   */
  function ja_segment_has_lane_guidance(segmentId, nodeId, toSegmentId) {
    var turns = sdk.DataModel.Turns.getTurnsFromSegment({ segmentId: segmentId, nodeId: nodeId });
    if (!turns) return false;
    for (var i = 0; i < turns.length; i++) {
      if (turns[i].toSegmentId === toSegmentId && turns[i].lanes !== null) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if two segments (A and C) are within a specified parallelism tolerance.
   *
   * Computes the bearing of segment A at its exit node and the bearing of segment C
   * at its entry node, then calculates the absolute angular difference. Returns true
   * if the difference is within the specified tolerance.
   *
   * @param {Object} segA - SDK Segment object for the incoming segment (A).
   * @param {Object} segC - SDK Segment object for the outgoing segment (C).
   * @param {number} nodeA_exit - Node ID at the exit of segment A (where A connects to B).
   * @param {number} nodeC_entry - Node ID at the entry of segment C (where B connects to C).
   * @param {number} toleranceDegrees - Maximum angular difference in degrees to consider parallel.
   * @returns {boolean} True if segments are within tolerance; false otherwise.
   */
  function ja_is_segments_parallel(segA, segC, nodeA_exit, nodeC_entry, toleranceDegrees) {
    var bearingA = ja_getAngle(nodeA_exit, segA);
    var bearingC = ja_getAngle(nodeC_entry, segC);
    if (bearingA === null || bearingC === null) {
      return false;
    }
    var diff = Math.abs(ja_angle_diff(bearingA, bearingC, true));
    ja_log('Parallelism check: A=' + ja_round(bearingA) + '° C=' + ja_round(bearingC) + '° diff=' + ja_round(diff) + '° tolerance=' + toleranceDegrees + '°', 3);
    return diff <= toleranceDegrees;
  }

  /**
   * Adds a GeoJSON feature to the junction_angles layer with an auto-incremented ID.
   * @param {Object} geometry - GeoJSON geometry object.
   * @param {Object} properties - Feature properties (must include ja_type).
   */
  function ja_add_feature(geometry, properties) {
    sdk.Map.addFeatureToLayer({
      layerName: 'junction_angles',
      feature: {
        id: 'ja_' + ++ja_feature_counter,
        type: 'Feature',
        geometry: geometry,
        properties: properties,
      },
    });
  }

  /**
   * Checks if a roundabout angle is "normal" per Waze normality criterion.
   * An angle is normal if it's within ±PERPENDICULAR_TOLERANCE° of a 90° multiple (0°, 90°, 180°, 270°).
   *
   * @param {number} angle - Triangle angle in degrees (0–180°).
   * @returns {boolean}
   */
  function ja_is_angle_normal(angle) {
    var mod = Math.abs(angle % 90);
    return mod <= PERPENDICULAR_TOLERANCE || mod >= 90 - PERPENDICULAR_TOLERANCE;
  }

  /**
   * Corrects a base label distance for EPSG:3857 latitude distortion.
   * EPSG:3857 projected units equal true meters only at the equator; at latitude φ
   * they are stretched by 1/cos(φ). Multiplying by cos(φ) converts back to true meters
   * so that turf.destination offsets match the original OpenLayers distances.
   * @param {number} labelDistance - Base label offset in meters.
   * @param {number[]} coordinates - GeoJSON [lon, lat] coordinate pair.
   * @returns {number} Latitude-corrected label distance in meters.
   */
  function ja_corrected_ld(labelDistance, coordinates) {
    return labelDistance * Math.cos((coordinates[1] * Math.PI) / 180);
  }

  /**
   * Checks if a segment crosses any BigJunction boundary (one endpoint inside, one outside).
   *
   * Centralizes the duplicated boundary-crossing detection logic that appears in:
   * - ja_collect_double_turns() (2 passes for median & arm segments)
   * - ja_draw_node_markers() (exit marker relocation)
   * - ja_draw_far_turn_markers() (fallback JB detection)
   *
   * @param {Object} seg - SDK Segment object to check.
   * @param {Array} allBigJunctions - Array from sdk.DataModel.BigJunctions.getAll().
   * @returns {Object|null} If segment crosses a boundary, returns
   *   `{ crosses: true, insideNodeId: number, outsideNodeId: number, bjPolygon: object }`.
   *   If no crossing, returns `{ crosses: false, insideNodeId: null, outsideNodeId: null, bjPolygon: null }`.
   */
  function ja_segment_crosses_bj_boundary(seg, allBigJunctions) {
    if (!seg || !allBigJunctions || allBigJunctions.length === 0) {
      return { crosses: false, insideNodeId: null, outsideNodeId: null, bjPolygon: null };
    }

    var fromCoords = { id: seg.fromNodeId, coordinates: seg.geometry.coordinates[0] };
    var toCoords = { id: seg.toNodeId, coordinates: seg.geometry.coordinates[seg.geometry.coordinates.length - 1] };

    for (var bji = 0; bji < allBigJunctions.length; bji++) {
      var bjPolygon = turf.polygon(allBigJunctions[bji].geometry.coordinates);
      var fromInside = turf.booleanPointInPolygon(turf.point(fromCoords.coordinates), bjPolygon);
      var toInside = turf.booleanPointInPolygon(turf.point(toCoords.coordinates), bjPolygon);

      // If one endpoint inside and one outside, segment crosses JB boundary
      if ((fromInside && !toInside) || (!fromInside && toInside)) {
        return {
          crosses: true,
          insideNodeId: fromInside ? seg.fromNodeId : seg.toNodeId,
          outsideNodeId: toInside ? seg.fromNodeId : seg.toNodeId,
          bjPolygon: bjPolygon,
        };
      }
    }

    return { crosses: false, insideNodeId: null, outsideNodeId: null, bjPolygon: null };
  }

  /**
   * Returns true if a legal turn exists from s_from through via_node onto s_to.
   *
   * Delegates to sdk.DataModel.Turns.isTurnAllowed() for the base restriction check,
   * then applies additional filtering for time- and vehicle-restricted turns (date
   * ranges, vehicle type bitmasks) to reflect real-world drivability rather than
   * just the static restriction flag.
   *
   * @param {Object} s_from - SDK Segment object for the incoming road.
   * @param {Object} via_node - SDK Node object at the junction.
   * @param {Object} s_to - SDK Segment object for the outgoing road.
   * @returns {boolean} True if the turn is allowed for a typical passenger vehicle.
   */
  function ja_is_turn_allowed(s_from, via_node, s_to) {
    ja_log('Allow from ' + s_from.id + ' to ' + s_to.id + ' via ' + via_node.id, 2);

    if (!sdk.DataModel.Turns.isTurnAllowedBySegmentDirections({ fromSegmentId: s_from.id, nodeId: via_node.id, toSegmentId: s_to.id })) {
      ja_log('Driving direction restriction applies', 3);
      return false;
    }

    var allowed = sdk.DataModel.Turns.isTurnAllowed({ fromSegmentId: s_from.id, nodeId: via_node.id, toSegmentId: s_to.id });
    ja_log('Turn allowed: ' + allowed, 2);
    return allowed;
  }

  /**
   * From wiki:
   * A Cross-match is when the primary name of one segment is identical to the alternate name of an adjacent segment.
   * It had the same priory as a Primary name match. In order for a Cross match to work there must be at least one
   * alt name on both involved segments (even though they don't necessarily match each other). It will work even if
   * the are no Primary names on those segments. It will not work if all three segments at a split have a matching
   * Primary name or a matching Alternate name.
   * @param street_in
   * @param streets
   * @returns {boolean}
   */
  function ja_cross_name_match(street_in, streets) {
    ja_log('[cross_name_match] checking exit streets', 3);
    ja_log(street_in, 4);
    ja_log(streets, 4);
    return Object.getOwnPropertyNames(streets).some(function (street_n_id, index) {
      var street_n_element = streets[street_n_id];
      ja_log('[cross_name_match] Checking element ' + index, 3);
      ja_log(street_n_element, 4);
      return (
        street_in.secondary.some(function (street_in_secondary) {
          ja_log('CN2a: checking n.p: ' + street_n_element.primary.name + ' vs in.s: ' + street_in_secondary.name, 3);

          //wlodek76: CROSS-MATCH works when two compared segments contain at least one ALT NAME
          //when alt name is empty cross-match does not work
          //FZ69617: This no longer seems to be needed
          //if (street_n_element.secondary.length === 0) { return false; }

          return street_n_element.primary.name === street_in_secondary.name;
        }) ||
        street_n_element.secondary.some(function (street_n_secondary) {
          ja_log('CN2b: checking in.p: ' + street_in.primary.name + ' vs n.s: ' + street_n_secondary.name, 3);

          //wlodek76: CROSS-MATCH works when two compared segments contain at least one ALT NAME
          //when alt name is empty cross-match does not work
          //FZ69617: This no longer seems to be needed
          //if (street_in.secondary.length === 0) { return false; }

          //wlodek76: missing return from checking primary name with alternate names
          return street_in.primary.name === street_n_secondary.name;
        })
      );
    });
  }

  /**
   * Returns true if any segment in `streets` shares at least one alternate (secondary) name
   * with `street_in`.
   *
   * Both sides must have at least one alternate name — if either is empty the check short-circuits
   * to false, matching the WME routing behaviour (cross-match only works when both sides carry an
   * alt name).
   *
   * @param {{ primary: object, secondary: Array }} street_in - Street info of the inbound segment.
   * @param {Object.<string, { primary: object, secondary: Array }>} streets - Street info keyed by
   *   segment id for all candidate exit segments at the junction.
   * @returns {boolean} True if an alt-name match is found.
   */
  function ja_alt_name_match(street_in, streets) {
    return Object.getOwnPropertyNames(streets).some(function (street_n_id, index) {
      var street_n_element = streets[street_n_id];
      ja_log('[alt_name_match] Checking element ' + index, 3);
      ja_log(street_n_element, 4);

      if (street_in.secondary.length === 0) {
        return false;
      }
      if (street_n_element.secondary.length === 0) {
        return false;
      }

      return street_in.secondary.some(function (street_in_secondary, index2) {
        ja_log('[alt_name_match] Nested check element ' + index2, 3);
        ja_log(street_in_secondary, 4);
        return street_n_element.secondary.some(function (street_n_secondary_element, index3) {
          ja_log('[alt_name_match] in.secondary: ' + street_in_secondary.name + ' vs n.secondary[' + index3 + ']: ' + street_n_secondary_element.name, 3);
          return street_in_secondary.name === street_n_secondary_element.name;
        });
      });
    });
  }

  /**
   * Returns true if any segment in `streets` has the same primary name as `street_in`.
   *
   * Used as the first-pass name check in BC (best-continuation) routing logic: if the
   * incoming road name continues on an exit, that exit is a strong BC candidate.
   *
   * @param {{ primary: { name: string }, secondary: Array }} street_in - Street info of the
   *   inbound segment.
   * @param {Object.<string, { primary: { name: string }, secondary: Array }>} streets - Street
   *   info keyed by segment id for all candidate exit segments at the junction.
   * @returns {boolean} True if a primary-name match is found.
   */
  function ja_primary_name_match(street_in, streets) {
    ja_log('[primary_name_match] checking candidates', 3);
    ja_log(street_in, 4);
    ja_log(streets, 4);
    return Object.getOwnPropertyNames(streets).some(function (id, index, array) {
      var element = streets[id];
      ja_log('[primary_name_match] Checking element ' + index + ' of ' + array.length, 3);
      ja_log(element, 4);
      return element.primary.name === street_in.primary.name;
    });
  }

  /**
   * Returns the primary and alternate street names for a segment.
   *
   * Looks up the segment's `primaryStreetId` and `alternateStreetIds` via the SDK Streets model
   * and returns them in a shape that `ja_primary_name_match`, `ja_cross_name_match`, and
   * `ja_alt_name_match` can consume directly.
   *
   * @param {number} segmentId - WME segment id.
   * @returns {{ primary: object|undefined, secondary: Array }} Object with `primary` set to the
   *   SDK Street object (or undefined if none) and `secondary` as an array of SDK Street objects
   *   for each alternate street.
   */
  function ja_get_streets(segmentId) {
    var segment = sdk.DataModel.Segments.getById({ segmentId: segmentId });
    var primary = segment && segment.primaryStreetId != null ? sdk.DataModel.Streets.getById({ streetId: segment.primaryStreetId }) : undefined;
    var secondary = [];
    if (segment) {
      segment.alternateStreetIds.forEach(function (element) {
        var street = sdk.DataModel.Streets.getById({ streetId: element });
        if (street != null) {
          secondary.push(street);
        }
      });
    }
    ja_log(primary, 3);
    ja_log(secondary, 3);
    return { primary: primary, secondary: secondary };
  }

  /**
   * Computes segment's length in meters
   * @param segment Segment to compute the length of
   * @returns {number}
   */
  function ja_segment_length(segment) {
    ja_log('segment: ' + segment.id + ' len: ' + segment.length, 3);
    return segment.length;
  }

  /**
   * Checks whether the two segments (connected at the same node) overlap each other.
   * @param a1 Angle of the 1st segment
   * @param a2 Angle of the 2nd segment
   */
  function ja_overlapping_angles(a1, a2) {
    // If two angles are close < 2 degree they are overlapped.
    // Method of recognizing overlapped segment by server is unknown for me yet, I took this from WME Validator
    // information about this.
    // TODO: verify overlapping check on the side of routing server.
    return Math.abs(ja_angle_diff(a1, a2, true)) < OVERLAPPING_ANGLE;
  }

  /*
   * Misc math and map element functions
   */

  /**
   *
   * @param p0 From point
   * @param p1 Center point
   * @param p2 To point
   * @returns {number}
   */
  function ja_angle_between_points(p0, p1, p2) {
    ja_log('p0 ' + p0, 3);
    ja_log('p1 ' + p1, 3);
    ja_log('p2 ' + p2, 3);
    // Uses turf.distance for accurate WGS84 distances (inputs are GeoJSON Point geometries)
    var a2 = Math.pow(turf.distance(turf.point(p1.coordinates), turf.point(p0.coordinates)) * 1000, 2);
    var b2 = Math.pow(turf.distance(turf.point(p1.coordinates), turf.point(p2.coordinates)) * 1000, 2);
    var cc2 = Math.pow(turf.distance(turf.point(p2.coordinates), turf.point(p0.coordinates)) * 1000, 2);
    var angle = Math.acos((a2 + b2 - cc2) / Math.sqrt(4 * a2 * b2)) / (Math.PI / 180);
    ja_log('angle is ' + angle, 3);
    return angle;
  }

  /**
   * get absolute (or turn) angle between 2 inputs.
   * 0,90,true	-> 90	0,90,false	-> -90
   * 0,170,true	-> 170	0,170,false	-> -10
   * @param aIn absolute s_in angle (from node)
   * @param aOut absolute s_out angle (from node)
   * @param absolute return absolute or turn angle?
   * @returns {number}
   */
  function ja_angle_diff(aIn, aOut, absolute) {
    var a = parseFloat(aOut) - parseFloat(aIn);
    if (a > 180) {
      a -= 360;
    }
    if (a < -180) {
      a += 360;
    }
    return absolute ? a : a > 0 ? a - 180 : a + 180;
  }

  /**
   * Returns the clockwise angular distance from `a` to `s_in_angle` (0–360°).
   *
   * Used to sort exit segments by how far they are from the incoming road's direction.
   * Wraps negative differences by adding 360 so the result is always non-negative.
   *
   * @param {number} a - The outbound segment angle (math degrees, 0=East CCW).
   * @param {number} s_in_angle - The inbound segment angle (math degrees, 0=East CCW).
   * @returns {number} Clockwise distance in degrees [0, 360).
   */
  function ja_angle_dist(a, s_in_angle) {
    ja_log('Computing out-angle ' + a + ' distance to in-angle ' + s_in_angle, 4);
    var diff = ja_angle_diff(a, s_in_angle, true);
    ja_log('Diff is ' + diff + ', returning: ' + (diff < 0 ? diff + 360 : diff), 4);
    return diff < 0 ? diff + 360 : diff;
  }

  /**
   * Checks whether every exit of a roundabout is within ±PERPENDICULAR_TOLERANCE° of perpendicular (i.e. "normal").
   *
   * For each valid exit node (a `toNodeId` of a junction arc that has at least one drivable
   * outbound non-junction segment), the triangle angle `n_in → roundabout-center → exit-node`
   * is computed.  An exit is non-normal when `angle % 90` falls outside the [0°, PERPENDICULAR_TOLERANCE°] and
   * [90-PERPENDICULAR_TOLERANCE°, 90°] bands.  For every non-normal exit a `±N°` deviation marker is placed just
   * outside the roundabout ring at that node.
   *
   * Side-effect: adds GeoJSON Point features to the `junction_angles` layer for each non-normal
   * exit.
   *
   * @param {number} junctionID - WME Junction id.
   * @param {number} n_in - Node id of the roundabout entry node (excluded from comparison so
   *   the entry road is not mistaken for an exit).
   * @param {number} label_distance - Current label-distance in meters (used to offset the
   *   deviation marker beyond the ring node).
   * @returns {boolean} True if all exits are within ±PERPENDICULAR_TOLERANCE° of perpendicular; false otherwise.
   */
  function ja_is_roundabout_normal(junctionID, n_in, label_distance) {
    ja_log('Check normal roundabout', 3);
    var junction = sdk.DataModel.Junctions.getById({ junctionId: junctionID });
    var nodes = {};
    var numValidExits = 0;
    junction.segmentIds.forEach(function (element, index) {
      var s = sdk.DataModel.Segments.getById({ segmentId: element });
      ja_log('index: ' + index, 3);
      //ja_log(s, 3);
      if (!nodes.hasOwnProperty(s.toNodeId)) {
        ja_log('Adding node id: ' + s.toNodeId, 3);
        //Check if node has allowed exits
        var allowed = false;
        var currNode = sdk.DataModel.Nodes.getById({ nodeId: s.toNodeId });
        ja_log(currNode, 3);
        currNode.connectedSegmentIds.forEach(function (element2) {
          var s_exit = sdk.DataModel.Segments.getById({ segmentId: element2 });
          ja_log(s_exit, 3);
          if (s_exit.junctionId === null) {
            ja_log('Checking: ' + s_exit.id, 3);
            if (sdk.DataModel.Turns.isTurnAllowedBySegmentDirections({ fromSegmentId: s.id, nodeId: currNode.id, toSegmentId: s_exit.id })) {
              //Exit possibly allowed
              ja_log('Exit allowed', 3);
              allowed = true;
            } else {
              ja_log('Exit not allowed', 3);
            }
          } else {
            //part of the junction.. Ignoring
            ja_log(s_exit.id + ' is in the roundabout. ignoring', 3);
          }
        });
        if (allowed) {
          numValidExits++;
          nodes[s.toNodeId] = sdk.DataModel.Nodes.getById({ nodeId: s.toNodeId });
        }
      }
    });

    var is_normal = true;
    ja_log(n_in, 3);
    ja_log(junction, 3);
    ja_log(nodes, 3);

    for (var n in nodes) {
      if (nodes.hasOwnProperty(n)) {
        // for...in always yields string keys; SDK requires a number type
        var n_id = parseInt(n, 10);
        ja_log('Checking ' + n_id, 3);
        if (String(n) === String(n_in)) {
          ja_log('Not comparing to n_in ;)', 3);
        } else {
          var angle = ja_angle_between_points(
            sdk.DataModel.Nodes.getById({ nodeId: n_in }).geometry,
            ja_coordinates_to_point(junction.geometry.coordinates),
            sdk.DataModel.Nodes.getById({ nodeId: n_id }).geometry,
          );
          ja_log('Angle is: ' + angle, 3);
          ja_log('Normalized angle is: ' + (angle % 90), 3);
          ja_log('Angle is: ' + angle, 3);
          // 90 +/- 15 is considered "normal"
          if (ja_is_angle_normal(angle)) {
            ja_log('turn is normal', 3);
          } else {
            ja_log('turn is NOT normal', 3);
            is_normal = false;
            //Push a marker outside the ring to show which exit is "not normal".
            //Offset 1× label_distance beyond the node along the radial (center→node) bearing.
            //Departure markers on the same exit road sit at 2× label_distance from the node,
            //so this leaves a full label_distance gap between the two markers.
            var n_geom = nodes[n].geometry;
            var center_coord = junction.geometry.coordinates;
            var bearing_out = turf.bearing(turf.point(center_coord), turf.point(n_geom.coordinates));
            var ring_radius_km = turf.distance(turf.point(center_coord), turf.point(n_geom.coordinates));
            var ja_ld = ja_corrected_ld(label_distance, n_geom.coordinates);
            var angleMod = Math.abs(angle % 90);
            var marker_geom = turf.destination(turf.point(center_coord), ring_radius_km + ja_ld / 1000, bearing_out).geometry;
            ja_add_feature(marker_geom, {
              angle: '±' + ja_round(Math.min(angleMod, 90 - angleMod)),
              ja_type: ja_routing_type.ROUNDABOUT,
            });
          }
        }
      }
    }
    return is_normal;
  }

  /**
   * Draws exit-angle markers for all valid exits of a roundabout when only the entry segment
   * is selected (no specific exit node in the selection).
   *
   * Applies the full Waze Normal / Non-Normal roundabout instruction rules:
   *
   * Normal (all three criteria must be met for this entry):
   *   1. All exit angles within ±PERPENDICULAR_TOLERANCE° of a multiple of 90° (perpendicular exits)
   *   2. Total junction node count is 2–4
   *   3. Roundabout radius ≤ 25 m
   *   → Each exit is classified as Turn Right / Continue Straight / Turn Left / U-Turn
   *     based on the counterclockwise angle from the entry bearing to the exit bearing
   *     (measured at the roundabout center).  Colors use the matching ja_routing_type.
   *
   * Non-Normal (any criterion fails):
   *   → All exits are labeled "1st", "2nd", "3rd" … in the order they are encountered
   *     when travelling counterclockwise from the entry, using ja_routing_type.ROUNDABOUT (the
   *     "Non-Normal Exit Color" setting — roundaboutColor).
   *
   * CCW angle (degrees, 0–360) from entry to exit, measured at center:
   *   ~90°  → Turn Right (first exit encountered going CCW in right-hand traffic)
   *   ~180° → Continue Straight
   *   ~270° → Turn Left
   *   ~0°/360° → U-Turn
   *
   * Also draws triangle-leg LineStrings (entry→center and center→each exit) for context.
   *
   * @param {number} junctionId     - WME Junction id.
   * @param {number} entryNodeId    - Node id where the selected entry segment meets the roundabout.
   * @param {number} label_distance - Current label-distance in meters (used to offset markers).
   */
  function ja_draw_roundabout_entry_exits(junctionId, entryNodeId, label_distance) {
    ja_log('[RA-ENTRY] Called with junctionId=' + junctionId + ', entryNodeId=' + entryNodeId, 2);
    var junction = sdk.DataModel.Junctions.getById({ junctionId: junctionId });
    if (!junction) {
      ja_log('[RA-ENTRY] Junction not found!', 2);
      return;
    }
    // Skip if entry node ID is null (can happen with unsaved segments)
    if (!entryNodeId) {
      ja_log('[RA-ENTRY] Entry node ID is null (unsaved segment?)', 2);
      return;
    }
    var entryNode = sdk.DataModel.Nodes.getById({ nodeId: entryNodeId });
    if (!entryNode) {
      ja_log('[RA-ENTRY] Entry node not found!', 2);
      return;
    }
    var center = ja_coordinates_to_point(junction.geometry.coordinates);
    var centerPt = turf.point(center.coordinates);
    var entryPt = turf.point(entryNode.geometry.coordinates);

    // In LHT countries roundabouts flow clockwise (CW); RHT countries flow CCW.
    // This affects the order exits are encountered (and therefore ordinal numbering)
    // but NOT the instruction classification, which is purely geometric.

    // Compass bearing from roundabout center to the entry node.
    // Used to compute the CCW angle from entry to each exit.
    var bearingToEntry = turf.bearing(centerPt, entryPt);

    // Helper: English ordinal suffix for exit numbering ("1st", "2nd", "3rd", …)
    function ordinal(n) {
      var s = ['th', 'st', 'nd', 'rd'];
      var v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    // Draw circle overlay if configured
    if (ja_getOption('roundaboutOverlayDisplay') === 'rOverSelected') {
      ja_draw_roundabout_overlay(junctionId);
    }

    // Draw entry-leg: entry node → roundabout center
    ja_add_feature({ type: 'LineString', coordinates: [entryNode.geometry.coordinates, center.coordinates] }, { ja_type: 'arrow_line' });

    // ── Step 1: Collect all valid exits ──────────────────────────────────────
    var processedNodes = {};
    var exits = [];

    ja_log('[RA-ENTRY] Roundabout has ' + junction.segmentIds.length + ' segments', 2);
    junction.segmentIds.forEach(function (segId) {
      ja_log('[RA-ENTRY] Processing segment ' + segId, 3);
      var juncSeg = sdk.DataModel.Segments.getById({ segmentId: segId });
      if (!juncSeg) return;

      var exitNodeId = juncSeg.toNodeId;
      // Skip segments with null node IDs (can happen with unsaved segments)
      if (!exitNodeId) return;

      // Allow the entry node once (U-turn arc) but deduplicate everything else.
      // We track with a count so a second arc returning to the same node is still skipped.
      if (processedNodes.hasOwnProperty(String(exitNodeId))) return;
      processedNodes[String(exitNodeId)] = true;

      var exitNode = sdk.DataModel.Nodes.getById({ nodeId: exitNodeId });
      if (!exitNode) return;

      // Find the first exit segment at this node (not part of THIS roundabout, but may be part of another junction).
      // Validate that traffic can actually LEAVE the roundabout node (not one-way INTO it).
      var exitSeg = null;
      exitNode.connectedSegmentIds.forEach(function (connSegId) {
        if (exitSeg) return;
        var s = sdk.DataModel.Segments.getById({ segmentId: connSegId });
        if (!s) return;
        // Skip segments that are part of THIS roundabout. Allow segments in other junctions or standalone.
        if (s.junctionId === junctionId) {
          ja_log('[RA-ENTRY]   Skipping ' + connSegId + ' (part of this RA)', 3);
          return;
        }
        // Accept exit if it can leave this node. Reject only if it's explicitly one-way INTO the node.
        // Two-way segments (isAtoB !== isBtoA is false, meaning both true or both false) are always valid.
        // One-way FROM this node: (isAtoB && fromNodeId=this) OR (isBtoA && toNodeId=this)
        // One-way INTO this node (reject): (isAtoB && toNodeId=this) OR (isBtoA && fromNodeId=this)
        var isOneWayInto = (s.isAtoB && s.toNodeId === exitNodeId && !s.isBtoA) || (s.isBtoA && s.fromNodeId === exitNodeId && !s.isAtoB);
        if (isOneWayInto) {
          ja_log('[RA-ENTRY]   Skipping ' + connSegId + ' (one-way INTO roundabout only)', 2);
          return;
        }

        // Check for locally-set turn restrictions at this exit.
        // Query all turns ending at the exit segment — if any are marked as not allowed, mark the exit as restricted.
        var arcPath = ja_get_roundabout_arc_path(junctionId, entryNodeId, exitNodeId);
        var isRestricted = false;
        if (arcPath) {
          isRestricted = ja_check_roundabout_arc_restricted(arcPath, s);
        }

        if (isRestricted) {
          ja_log('[RA-ENTRY]   Exit ' + connSegId + ' has turn restriction, will display as NO_TURN', 2);
          s._isRestricted = true;
        }

        ja_log('[RA-ENTRY]   Accepting exit ' + connSegId + (isRestricted ? ' (RESTRICTED)' : ''), 3);
        exitSeg = s;
      });
      if (!exitSeg) {
        var debugSegs = 'connected segs: ';
        exitNode.connectedSegmentIds.forEach(function (cid) {
          var cs = sdk.DataModel.Segments.getById({ segmentId: cid });
          if (cs) {
            debugSegs += cid + '(jID=' + (cs.junctionId || 'null') + ') ';
          }
        });
        ja_log('[RA-ENTRY] Node ' + exitNodeId + ' has no valid exit. ' + debugSegs, 2);
        return;
      }

      // CCW angle (0–360°) from entry to this exit, measured at the roundabout center.
      // In right-hand traffic (CCW roundabout): ~90° = Turn Right, ~180° = Straight, ~270° = Turn Left.
      // U-turn arc returns to the entry node — assign 360 so it sorts last and falls in the ≥315 U-turn bucket.
      var ccwAngle;
      if (exitNodeId === entryNodeId) {
        ccwAngle = 360;
      } else {
        var bearingToExit = turf.bearing(centerPt, turf.point(exitNode.geometry.coordinates));
        ccwAngle = (bearingToEntry - bearingToExit + 360) % 360;
        ja_log(
          '[RA-DEBUG] exitNodeId=' +
            exitNodeId +
            ', bearingToEntry=' +
            ja_round(bearingToEntry) +
            '°, bearingToExit=' +
            ja_round(bearingToExit) +
            '°, ccwAngle=' +
            ja_round(ccwAngle) +
            '° (LHT=' +
            ja_is_left_hand_traffic +
            ')',
          2,
        );
      }

      // Triangle angle at center: entry_node → center → exit_node (always 0–180°).
      // U-turn arc: entry and exit are the same node so the triangle is degenerate (0°).
      // Use 180° instead — the driver exits back along the same road in the opposite direction.
      var triAngle = exitNodeId === entryNodeId ? 180 : ja_angle_between_points(entryNode.geometry, center, exitNode.geometry);
      var isExitAngleNormal = ja_is_angle_normal(triAngle);

      // Skip exits with invalid angles (can happen with unsaved segments)
      if (isNaN(ccwAngle) || isNaN(triAngle)) {
        ja_log('[RA-ENTRY] Skipping exit with NaN angle: ccwAngle=' + ccwAngle + ', triAngle=' + triAngle, 2);
        return;
      }

      exits.push({
        exitNodeId: exitNodeId,
        exitNode: exitNode,
        exitSeg: exitSeg,
        juncSeg: juncSeg,
        ccwAngle: ccwAngle,
        triAngle: triAngle,
        isExitAngleNormal: isExitAngleNormal,
      });
    });

    ja_log('[RA-ENTRY] Collected ' + exits.length + ' exits', 2);
    if (exits.length === 0) {
      ja_log('[RA-ENTRY] No exits found, returning', 2);
      return;
    }

    // ── Step 2: Determine overall roundabout normality for this entry ─────────

    // Criterion 1 – All exits within ±PERPENDICULAR_TOLERANCE° of a 90° multiple
    var allAnglesNormal = exits.every(function (e) {
      return e.isExitAngleNormal;
    });

    // Criterion 2 – Total junction node count 2–4
    var junctionNodeSet = {};
    junction.segmentIds.forEach(function (segId) {
      var s = sdk.DataModel.Segments.getById({ segmentId: segId });
      // Skip segments with null node IDs (unsaved segments)
      if (s && s.toNodeId) junctionNodeSet[String(s.toNodeId)] = true;
    });
    var totalJunctionNodes = Object.keys(junctionNodeSet).length;
    var isNodeCountNormal = totalJunctionNodes >= 2 && totalJunctionNodes <= 4;

    // Criterion 3 – Maximum distance from center to any junction node ≤ 25 m
    var maxRadius = 0;
    Object.keys(junctionNodeSet).forEach(function (nid) {
      var n = sdk.DataModel.Nodes.getById({ nodeId: parseInt(nid, 10) });
      if (!n) return;
      var r = turf.distance(centerPt, turf.point(n.geometry.coordinates)) * 1000; // km→m
      if (r > maxRadius) maxRadius = r;
    });
    var isRadiusNormal = maxRadius <= 25;

    var isRoundaboutNormal = allAnglesNormal && isNodeCountNormal && isRadiusNormal;
    ja_log('Roundabout normal: ' + isRoundaboutNormal + ' (angles:' + allAnglesNormal + ' nodes:' + totalJunctionNodes + ' radius:' + ja_round(maxRadius) + 'm)', 2);
    ja_log('[RA-DEBUG] All exits before sorting:', 4);
    exits.forEach(function (e, idx) {
      ja_log('[RA-DEBUG] Exit ' + idx + ': nodeId=' + e.exitNodeId + ', ccwAngle=' + ja_round(e.ccwAngle) + '°, triAngle=' + ja_round(e.triAngle) + '°', 2);
    });

    // ── Center diameter marker ─────────────────────────────────────────────────
    // Shows the roundabout's diameter (maxRadius × 2) at the center point.
    // White = radius ≤ 25 m (Normal criterion met); Orange = radius > 25 m (Non-Normal).
    var diameterM = ja_round(maxRadius * 2);
    var diameterLabel = ja_getOption('angleDisplay') === 'displaySimple' ? '\u00d8' + diameterM + 'm' : '\u00d8\n' + diameterM + 'm';
    ja_add_feature(center, {
      angle: diameterLabel,
      ja_type: isRadiusNormal ? ja_routing_type.BC : ja_routing_type.ROUNDABOUT,
    });

    // ── Step 3: Sort exits by CCW angle (order encountered going CCW from entry) ──
    // RHT (CCW roundabout): first exit encountered has smallest ccwAngle → sort ascending.
    // LHT (CW roundabout):  first exit encountered has largest ccwAngle  → sort descending.
    exits.sort(
      ja_is_left_hand_traffic
        ? function (a, b) {
            return b.ccwAngle - a.ccwAngle;
          }
        : function (a, b) {
            return a.ccwAngle - b.ccwAngle;
          },
    );

    // For LHT, after descending sort, the U-turn (ccwAngle=360) sorts first but should be last.
    // Move it to the end if it's at index 0.
    if (ja_is_left_hand_traffic && exits.length > 0 && exits[0].ccwAngle === 360) {
      var uTurnExit = exits.shift(); // Remove from front
      exits.push(uTurnExit); // Add to back
      ja_log('[RA-DEBUG] Moved U-turn from index 0 to end (LHT handling)', 2);
    }

    ja_log('[RA-DEBUG] After sort (LHT=' + ja_is_left_hand_traffic + '):', 2);
    exits.forEach(function (e, idx) {
      ja_log('[RA-DEBUG] Exit ' + idx + ': nodeId=' + e.exitNodeId + ', ccwAngle=' + ja_round(e.ccwAngle) + '°', 2);
    });

    // ── Step 4: Draw exit legs and markers ───────────────────────────────────
    var validExitOrdinal = 0; // Counter for non-normal roundabouts (skips restricted exits)
    exits.forEach(function (exit, index) {
      // Draw exit leg: roundabout center → exit node
      ja_add_feature({ type: 'LineString', coordinates: [center.coordinates, exit.exitNode.geometry.coordinates] }, { ja_type: 'arrow_line' });

      var exitBearing = ja_getAngle(exit.exitNodeId, exit.exitSeg);
      var exitLd = ja_corrected_ld(label_distance, exit.exitNode.geometry.coordinates);
      var point = turf.destination(turf.point(exit.exitNode.geometry.coordinates), (exitLd * 2) / 1000, ja_math_to_compass(exitBearing)).geometry;

      // Check if this exit has a turn restriction
      var isRestricted = exit.exitSeg._isRestricted === true;

      var markerType;
      if (isRestricted) {
        // Restricted exit: always display as NO_TURN (gray)
        markerType = ja_routing_type.NO_TURN;
        ja_log('[RA-DEBUG] Drawing restricted exit ' + index + ': nodeId=' + exit.exitNodeId + ', markerType=NO_TURN', 2);
        ja_draw_marker(point, exit.exitNode, exitLd, exit.triAngle, exitBearing, true, markerType);
      } else if (isRoundaboutNormal) {
        // Normal roundabout with allowed exit: classify by CCW angle from entry
        //   ~90°  → Turn Right   (first exit going CCW)
        //   ~180° → Continue Straight
        //   ~270° → Turn Left    (last exit before U-turn)
        //   ~0°/360° → U-Turn
        var ccw = exit.ccwAngle;
        if (ccw < ROUNDABOUT_INSTRUCTION_UTURN_THRESHOLD || ccw >= ROUNDABOUT_INSTRUCTION_TURN_LEFT_THRESHOLD) {
          markerType = ja_routing_type.U_TURN;
        } else if (ccw < ROUNDABOUT_INSTRUCTION_TURN_RIGHT_THRESHOLD) {
          markerType = ja_routing_type.TURN_RIGHT;
        } else if (ccw < ROUNDABOUT_INSTRUCTION_CONTINUE_THRESHOLD) {
          markerType = ja_routing_type.BC; // Continue Straight
        } else {
          markerType = ja_routing_type.TURN_LEFT;
        }
        ja_log('[RA-DEBUG] Drawing exit ' + index + ': nodeId=' + exit.exitNodeId + ', ccw=' + ja_round(ccw) + '°, markerType=' + markerType, 2);
        // ja_draw_marker handles arrow characters and display-mode formatting,
        // exactly as it does for regular turn markers at intersections.
        ja_draw_marker(point, exit.exitNode, exitLd, exit.triAngle, exitBearing, true, markerType);
      } else {
        // Non-normal roundabout: ordinal exit numbers in encounter order (skipping restricted exits)
        // Only increment counter for allowed exits; restricted exits get NO_TURN marker
        validExitOrdinal++;
        ja_log('[RA-DEBUG] Drawing non-normal exit ' + index + ': nodeId=' + exit.exitNodeId + ', ordinal=' + validExitOrdinal, 2);
        // Direct feature add — ordinal string can't pass through ja_draw_marker's numeric 'a'.
        ja_add_feature(point, {
          angle: ja_getOption('angleDisplay') === 'displaySimple' ? ordinal(validExitOrdinal) + ' ' + ja_round(exit.triAngle) + '°' : ordinal(validExitOrdinal) + '\n' + ja_round(exit.triAngle) + '°',
          ja_type: ja_routing_type.ROUNDABOUT, // "Non-Normal Exit Color" (roundaboutColor) setting
        });
      }
    });
  }

  /**
   * Constructs the sequence of roundabout arc segments from entry node to exit node.
   *
   * Walks through the junction's arc segments starting at entryNodeId and following
   * connected nodes until reaching exitNodeId. Returns the ordered list of segments
   * that comprise the arc path (used for path traversal restriction checking).
   *
   * @param {number} junctionId - WME Junction ID (roundabout).
   * @param {number} entryNodeId - Starting node ID.
   * @param {number} exitNodeId - Ending node ID.
   * @returns {Object[]|null} Array of SDK Segment objects forming the path, or null if path cannot be constructed.
   */
  function ja_get_roundabout_arc_path(junctionId, entryNodeId, exitNodeId) {
    var junction = sdk.DataModel.Junctions.getById({ junctionId: junctionId });
    if (!junction) return null;

    var path = [];
    var currentNodeId = entryNodeId;
    var visited = {};
    var maxSteps = junction.segmentIds.length + 1; // Prevent infinite loops

    for (var step = 0; step < maxSteps && currentNodeId !== exitNodeId; step++) {
      var nextSeg = null;

      // Find the next unvisited segment connected to currentNodeId
      for (var i = 0; i < junction.segmentIds.length; i++) {
        var segId = junction.segmentIds[i];
        if (visited[String(segId)]) continue;

        var seg = sdk.DataModel.Segments.getById({ segmentId: segId });
        if (!seg) continue;

        if (seg.fromNodeId === currentNodeId) {
          nextSeg = seg;
          currentNodeId = seg.toNodeId;
          break;
        } else if (seg.toNodeId === currentNodeId) {
          nextSeg = seg;
          currentNodeId = seg.fromNodeId;
          break;
        }
      }

      if (!nextSeg) break;

      visited[String(nextSeg.id)] = true;
      path.push(nextSeg);
    }

    return currentNodeId === exitNodeId ? path : null;
  }

  /**
   * Checks for explicit local turn restrictions at a junction node.
   *
   * For roundabout arc segments, we check ONLY for explicit turn restrictions
   * without performing direction calculation (which has LHT quirks for arc segments).
   * This checks the Turn object's restrictions array to see if an editor set a local TR.
   *
   * @param {Object} s_from - SDK Segment object for the incoming road.
   * @param {Object} via_node - SDK Node object at the junction.
   * @param {Object} s_to - SDK Segment object for the outgoing road.
   * @returns {boolean} True if a turn restriction explicitly blocks this turn.
   */
  function ja_is_turn_restricted(s_to) {
    try {
      // Query all turns ending at the exit segment and check if ANY are restricted.
      // This avoids depending on exact arc path construction — we just need to know
      // if there's a restricted turn to this exit from ANY arc segment.
      var turnsTo = sdk.DataModel.Turns.getTurnsToSegment({ segmentId: s_to.id });

      if (turnsTo && turnsTo.length > 0) {
        for (var j = 0; j < turnsTo.length; j++) {
          var turn = turnsTo[j];
          // If ANY turn to this exit is restricted (isAllowed=false or has restrictions), mark the whole exit as restricted
          if (!turn.isAllowed || (turn.restrictions && turn.restrictions.length > 0)) {
            ja_log('[RA-PATH-RESTRICT] Exit ' + s_to.id + ' is restricted (turn ' + turn.id + ')', 3);
            return true;
          }
        }
      }

      return false; // No restricted turns found
    } catch (e) {
      ja_log('[RA-PATH-RESTRICT] Error checking exit ' + s_to.id + ': ' + e.message, 2);
      return false;
    }
  }

  /**
   * Validates turn restrictions along a roundabout arc path by checking each intermediate node.
   *
   * Replicates the far-turn path validation pattern: walks through arc segments and validates
   * that a turn is allowed at each connecting node. If ANY intermediate turn is restricted,
   * the entire arc path is marked as restricted.
   *
   * @param {Object[]} arcPath - Array of arc segments (from ja_get_roundabout_arc_path).
   * @param {Object} exitSegment - The exit segment (where traffic leaves the roundabout).
   * @returns {boolean} true if ANY step in the path is restricted, false if all steps allowed.
   */
  function ja_check_roundabout_arc_restricted(arcPath, exitSegment) {
    if (!arcPath || arcPath.length === 0 || !exitSegment) {
      ja_log('[RA-PATH-CHECK] Invalid input: arcPath=' + (arcPath ? arcPath.length : 'null') + ', exitSeg=' + (exitSegment ? 'yes' : 'null'), 2);
      return false;
    }

    // Build the full sequence: [arcSeg1, ..., arcSegN, exitSeg]
    var fullPath = arcPath.concat([exitSegment]);

    // For roundabout arcs, we only check the FINAL step (arc→exit) for restrictions.
    // Intermediate arc→arc turns are structural and don't have explicit restrictions that affect traffic flow.
    // The only place an editor would set a local restriction is at the exit point.

    var finalStepIndex = fullPath.length - 2;
    if (finalStepIndex >= 0) {
      var stepFrom = fullPath[finalStepIndex];
      var stepTo = fullPath[finalStepIndex + 1];

      // Find the connecting node between these two segments
      var stepConnectingNodeId = ja_get_connecting_node(stepFrom, stepTo);
      if (stepConnectingNodeId === null) {
        return true; // Segments not adjacent
      }

      // Fetch the node (defensive check)
      var stepConnectingNode = sdk.DataModel.Nodes.getById({ nodeId: stepConnectingNodeId });
      if (!stepConnectingNode) {
        return true; // Node not found
      }

      // Check for explicit turn restrictions at this exit
      return ja_is_turn_restricted(stepTo);
    }

    return false;
  }

  /**
   * Wraps a raw `[lon, lat]` coordinate pair into a minimal GeoJSON Point geometry object.
   *
   * The WME Junction geometry stores coordinates as a plain array, but Turf.js helper functions
   * like `turf.distance()` and `turf.bearing()` require GeoJSON geometry objects.  This avoids
   * the overhead of `turf.point()` when only the geometry (not the full Feature wrapper) is
   * needed.
   *
   * @param {number[]} coordinates - `[longitude, latitude]` pair (WGS84).
   * @returns {{ type: 'Point', coordinates: number[] }} GeoJSON Point geometry.
   */
  function ja_coordinates_to_point(coordinates) {
    return { type: 'Point', coordinates: [coordinates[0], coordinates[1]] };
  }

  /**
   * Returns the first `[lon, lat]` coordinate of a segment's GeoJSON LineString geometry.
   * Used with `ja_get_second_point` to compute the bearing at the segment's start end.
   * @param {object} segment - SDK Segment object with a GeoJSON `geometry` property.
   * @returns {number[]} `[longitude, latitude]` WGS84 pair.
   */
  function ja_get_first_point(segment) {
    return segment.geometry.coordinates[0];
  }

  /**
   * Returns the last `[lon, lat]` coordinate of a segment's GeoJSON LineString geometry.
   * Used with `ja_get_next_to_last_point` to compute the bearing at the segment's end end.
   * @param {object} segment - SDK Segment object with a GeoJSON `geometry` property.
   * @returns {number[]} `[longitude, latitude]` WGS84 pair.
   */
  function ja_get_last_point(segment) {
    return segment.geometry.coordinates[segment.geometry.coordinates.length - 1];
  }

  /**
   * Returns the second `[lon, lat]` coordinate of a segment's GeoJSON LineString geometry.
   * Used together with `ja_get_first_point` to get the initial bearing leaving the start node.
   * @param {object} segment - SDK Segment object with a GeoJSON `geometry` property.
   * @returns {number[]} `[longitude, latitude]` WGS84 pair.
   */
  function ja_get_second_point(segment) {
    return segment.geometry.coordinates[1];
  }

  /**
   * Returns the second-to-last `[lon, lat]` coordinate of a segment's GeoJSON LineString.
   * Used together with `ja_get_last_point` to get the final bearing arriving at the end node.
   * @param {object} segment - SDK Segment object with a GeoJSON `geometry` property.
   * @returns {number[]} `[longitude, latitude]` WGS84 pair.
   */
  function ja_get_next_to_last_point(segment) {
    return segment.geometry.coordinates[segment.geometry.coordinates.length - 2];
  }

  /**
   * Returns the absolute departure angle for a segment end connected at a given node.
   *
   * Picks the first two coordinates (from-end) or last two (to-end) depending on which node
   * is the query node, then converts the Turf.js compass bearing (0=N, clockwise) into the
   * math-convention angle (0=East, counter-clockwise) used throughout this script.
   *
   * Uses the first/second or next-to-last/last vertex pair so the angle reflects the immediate
   * direction of the road as it leaves the node rather than the straight-line segment direction.
   *
   * @param {number|null} ja_node - WME Node id of the junction being measured.
   * @param {object|null} ja_segment - SDK Segment object whose departure bearing is needed.
   * @returns {number|null} Angle in math degrees (0=East CCW), or null if either argument is
   *   null.
   */
  function ja_getAngle(ja_node, ja_segment) {
    ja_log('[getAngle] node: ' + ja_node, 3);
    ja_log('[getAngle] segment: ' + ja_segment, 3);
    if (ja_node == null || ja_segment == null) {
      return null;
    }
    var p1, p2;
    if (ja_segment.fromNodeId === ja_node) {
      p1 = ja_get_first_point(ja_segment);
      p2 = ja_get_second_point(ja_segment);
    } else {
      p1 = ja_get_last_point(ja_segment);
      p2 = ja_get_next_to_last_point(ja_segment);
    }
    // turf.bearing returns compass bearing (0=N, CW); convert to math angle (0=E, CCW)
    var bearing = turf.bearing(turf.point(p1), turf.point(p2));
    return (90 - bearing + 360) % 360;
  }

  /**
   * Returns the overall bearing of a segment (first vertex → last vertex) as a math angle.
   *
   * Unlike `ja_getAngle` which uses the immediate endpoint-adjacent vertex pair,
   * `ja_getAngleMidleSeg` uses the full start-to-end chord.  This prevents false-positive
   * overlapping-angle matches on curved segments whose start bearing closely parallels an
   * adjacent segment even though the roads diverge over their full length.
   *
   * @param {number|null} ja_node - WME Node id used to determine direction of travel (from-end
   *   or to-end).
   * @param {object|null} ja_segment - SDK Segment object.
   * @returns {number|null} Angle in math degrees (0=East CCW), or null if either argument is
   *   null.
   */
  function ja_getAngleMidleSeg(ja_node, ja_segment) {
    ja_log('[getAngleMidleSeg] node: ' + ja_node, 3);
    ja_log('[getAngleMidleSeg] segment: ' + ja_segment, 3);
    if (ja_node == null || ja_segment == null) {
      return null;
    }
    var p1, p2;
    if (ja_segment.fromNodeId === ja_node) {
      p1 = ja_get_first_point(ja_segment);
      p2 = ja_get_last_point(ja_segment);
    } else {
      p1 = ja_get_last_point(ja_segment);
      p2 = ja_get_first_point(ja_segment);
    }
    // turf.bearing returns compass bearing (0=N, CW); convert to math angle (0=E, CCW)
    var bearing = turf.bearing(turf.point(p1), turf.point(p2));
    return (90 - bearing + 360) % 360;
  }

  // ── Far turn support (experimental) ──────────────────────────────────────────────────────────
  //
  // The two functions below add support for "far turns" — turns that cross one or more
  // intermediate segments rather than connecting directly across a single junction node.
  //
  // Waze exposes far turns on the SDK Turn interface via:
  //   turn.isPathTurn        — true when created with the Paths (FL2) tool
  //   turn.isJunctionBoxTurn — true when inside a Junction Box (BigJunction)
  //   turn.segmentPath[]     — array of intermediate segment IDs (excludes entry & exit segments)
  //
  // The two types are mutually exclusive: a segment cannot be part of both a Junction Box
  // and a Path simultaneously.

  /**
   * Finds the junction node shared between two adjacent segments.
   *
   * This helper is needed specifically for far turn angle calculation: the exit segment
   * of a far turn is NOT directly connected to the entry node. Instead the path runs:
   *
   *   entrySegment → [segmentPath[0] ... segmentPath[N]] → exitSegment
   *
   * To get the correct departure bearing of exitSegment we need the node where the last
   * intermediate segment (segmentPath[N]) hands off to exitSegment. That node is the
   * shared endpoint between those two segments — which is what this function finds.
   *
   * Usage:
   *   var lastPathSeg    = sdk.DataModel.Segments.getById({ segmentId: turn.segmentPath[turn.segmentPath.length - 1] });
   *   var connectingNode = ja_get_connecting_node(lastPathSeg, exitSeg);
   *   var exitAngle      = ja_getAngle(connectingNode, exitSeg);
   *
   * If the two segments do not share a node (e.g. bad data or disconnected path), returns null.
   * ja_getAngle() safely handles null and returns null in that case too.
   *
   * @param {object} segA - SDK Segment object (the last intermediate segment in segmentPath[]).
   * @param {object} segB - SDK Segment object (the exit segment of the far turn).
   * @returns {number|null} The shared node ID, or null if no shared node exists.
   */
  function ja_get_connecting_node(segA, segB) {
    if (segA == null || segB == null) return null;
    // Each segment has exactly two endpoint nodes (fromNodeId, toNodeId).
    // One of segA's endpoints must equal one of segB's endpoints where they connect.
    if (segA.fromNodeId === segB.fromNodeId || segA.fromNodeId === segB.toNodeId) return segA.fromNodeId;
    if (segA.toNodeId === segB.fromNodeId || segA.toNodeId === segB.toNodeId) return segA.toNodeId;
    return null; // segments are not adjacent — should not happen with valid SDK data
  }

  /**
   * Maps a turn.instructionOpCode to a ja_routing_type Override* value.
   * Returns null if the opcode is unrecognised — callers fall through to angle-based classification.
   *
   * @param {string} opcode - The turn.instructionOpCode value (e.g., 'TURN_LEFT', 'NONE', 'UTURN').
   * @param {boolean} logOpcode - If true, log the recognized opcode (default: true).
   * @returns {string|null} The mapped ja_routing_type value (OverrideTURN_LEFT, OverrideBC, etc.) or null if unrecognised.
   */
  function ja_opcode_to_routing_type(opcode, logOpcode) {
    if (typeof logOpcode === 'undefined') logOpcode = true;

    switch (opcode) {
      case 'NONE':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideBC;
      case 'CONTINUE':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideCONTINUE;
      case 'TURN_LEFT':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideTURN_LEFT;
      case 'TURN_RIGHT':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideTURN_RIGHT;
      case 'KEEP_LEFT':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideKEEP_LEFT;
      case 'KEEP_RIGHT':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideKEEP_RIGHT;
      case 'EXIT_LEFT':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideEXIT_LEFT;
      case 'EXIT_RIGHT':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideEXIT_RIGHT;
      case 'UTURN':
        if (logOpcode) ja_log('turn opcode override is: ' + opcode, 2);
        return ja_routing_type.OverrideU_TURN;
      default:
        if (logOpcode) ja_log('no turn opcode override', 3);
        return null;
    }
  }

  /**
   * Classifies a potential U-turn angle, applying Waze double-turn restrictions.
   * Used in ja_collect_double_turns to identify U-turns with or without Waze restrictions.
   *
   * Checks conditions in order:
   * 1. DEFAULT: Median qualifies (≤30m OR 31-50m with lane guidance) AND segments are parallel (±5°)
   * 2. OPTIONAL STRICTER: If setting is ON and median ≤15m, blocks the turn
   *
   * If angle is NOT in U-turn range (175 ± 1.5°), returns null (not a U-turn).
   *
   * @param {number} angle - The turn angle in degrees.
   * @param {number} medianLen - The length of the median segment (meters).
   * @param {object} segA - First connecting segment (SDK Segment).
   * @param {object} segC - Second connecting segment (SDK Segment).
   * @param {number} nodeA_id - Node ID at start of median.
   * @param {number} nodeC_id - Node ID at end of median.
   * @param {boolean} hasLaneGuidanceOnA - True if incoming segment A has lane guidance toward the median.
   * @returns {string|null} ja_routing_type.NO_U_TURN, ja_routing_type.U_TURN, or ja_routing_type.PROBLEM; null if not in U-turn range or doesn't qualify.
   */
  function ja_classify_uturn_angle(angle, medianLen, segA, segC, nodeA_id, nodeC_id, hasLaneGuidanceOnA) {
    // Check if angle is in U-turn range (175 ± 1.5°)
    if (angle < 175 - GRAY_ZONE || angle > 185 + GRAY_ZONE) {
      return null; // Not a U-turn angle
    }

    // Check if median qualifies by length (default or extended with lane guidance)
    var medianQualifies = medianLen <= WAZE_MEDIAN_LENGTH_DEFAULT || (medianLen <= WAZE_MEDIAN_LENGTH_EXTENDED && hasLaneGuidanceOnA);

    if (!medianQualifies) {
      return null; // Median too long to qualify as U-turn
    }

    // Check if segments A and C are parallel (±5°)
    var segmentsParallel = ja_is_segments_parallel(segA, segC, nodeA_id, nodeC_id, WAZE_PARALLELISM_TOLERANCE);

    if (!segmentsParallel) {
      return null; // Not parallel; doesn't qualify as U-turn
    }

    var turn_type;

    // Apply optional stricter Waze restriction (≤15m threshold; parallelism already verified above)
    if (ja_getOption('wazeDoubleUTurnRestriction') && medianLen <= WAZE_MEDIAN_LENGTH_THRESHOLD) {
      turn_type = ja_routing_type.NO_U_TURN;
      ja_log('Waze restriction: median ≤' + WAZE_MEDIAN_LENGTH_THRESHOLD + 'm and parallel within ' + WAZE_PARALLELISM_TOLERANCE + '°, flagged as NO_U_TURN', 2);
    } else {
      // Qualifies as U-turn by default rules (≤30m or 31-50m with LG, and parallel); angle determines the exact type
      turn_type = angle >= 175 + GRAY_ZONE && angle <= 185 - GRAY_ZONE ? ja_routing_type.U_TURN : ja_routing_type.PROBLEM;
    }

    return turn_type;
  }

  /**
   * Finds the intersection point between a segment and a BigJunction polygon boundary,
   * returning the point closest to a reference node.
   * Used in ja_draw_node_markers and ja_draw_far_turn_markers to reposition markers
   * when an exit segment crosses a JB boundary.
   *
   * @param {object} segment - The SDK Segment object (has geometry.coordinates).
   * @param {object} bjPolygon - The BigJunction polygon GeoJSON object.
   * @param {object|number[]} refPoint - Reference point (SDK Node with .geometry.coordinates or raw coordinates array [lon, lat]).
   * @returns {object|null} GeoJSON Point feature of the closest intersection, or null if no intersection found.
   */
  function ja_find_closest_bj_intersection(segment, bjPolygon, refPoint) {
    var exitLine = turf.lineString(segment.geometry.coordinates);
    var intersections = turf.lineIntersect(exitLine, bjPolygon);

    if (intersections.features.length === 0) {
      return null;
    }

    // Determine reference coordinates
    var refCoords;
    if (refPoint.geometry && refPoint.geometry.coordinates) {
      // refPoint is a Node object
      refCoords = refPoint.geometry.coordinates;
    } else if (Array.isArray(refPoint)) {
      // refPoint is raw [lon, lat] array
      refCoords = refPoint;
    } else {
      // refPoint is assumed to have coordinates
      refCoords = refPoint.coordinates || refPoint;
    }

    var referencePt = turf.point(refCoords);
    var closestPt = intersections.features.reduce(function (best, candidate) {
      return turf.distance(candidate, referencePt) < turf.distance(best, referencePt) ? candidate : best;
    });

    return closestPt;
  }

  /**
   * Determines if two compass bearings point in similar directions within a tolerance.
   *
   * Used to detect when local turn markers and far-turn markers target the same direction
   * at a node, allowing the positioning system to layer them (local closer, far-turn farther).
   *
   * Accounts for 360° wraparound: e.g., 10° vs 350° differ by 20°, not 340°.
   *
   * @param {number} bearing1 - First compass bearing (0–360°, 0=North, CW).
   * @param {number} bearing2 - Second compass bearing (0–360°).
   * @param {number} tolerance - Maximum angle difference in degrees (suggested: 30–45°).
   * @returns {boolean} True if bearings are within tolerance of each other.
   */
  function ja_markers_target_same_direction(bearing1, bearing2, tolerance) {
    var diff = Math.abs(bearing1 - bearing2);
    if (diff > 180) {
      diff = 360 - diff; // Account for 360° wraparound
    }
    return diff <= tolerance;
  }

  /**
   * Converts a math angle (0=East, CCW) to a compass bearing (0=North, CW) for use with Turf.js.
   * Turf functions like turf.destination() expect compass bearings, not math angles.
   * Used in marker positioning throughout ja_draw_node_markers and ja_draw_far_turn_markers.
   *
   * @param {number} angle - The math angle in degrees (0=East, increases CCW).
   * @returns {number} Compass bearing in degrees (0=North, increases CW).
   */
  function ja_math_to_compass(angle) {
    return (90 - angle + 360) % 360;
  }

  /**
   * Computes the extra-space multiplier for marker visibility based on angle and bearing.
   * Returns 2 (double distance) when angle is sharp (>120°) or bearing points upward (40-120°).
   * Used in marker positioning to avoid overlap with bridge/bridge icons.
   *
   * @param {number} angle - The angle measurement (turn angle or step angle in degrees).
   * @param {number} bearing - The compass or reference bearing for visibility (degrees).
   * @returns {number} Multiplier: 1 (normal spacing) or 2 (double spacing for visibility).
   */
  function ja_compute_extra_space(angle, bearing) {
    // Double spacing if angle is sharp (>120°)
    if (Math.abs(angle) > 120) {
      return 2;
    }
    // Double spacing if bearing points upward (40-120°) to avoid bridge icon
    if (bearing > 40 && bearing < 120) {
      return 2;
    }
    return 1;
  }

  /**
   * Classifies a turn angle into a routing instruction type using angle-based thresholds.
   * Does NOT apply TIO/VIO overrides — used for intermediate step classification where
   * local node angles determine turn type.
   *
   * @param {number} angle - The turn angle in degrees (can be negative or >360).
   * @returns {string} A ja_routing_type value (BC, TURN, U_TURN, PROBLEM).
   */
  function ja_classify_turn_angle(angle) {
    if (angle == null) return ja_routing_type.TURN;
    var absAngle = Math.abs(angle);
    if (absAngle > U_TURN_ANGLE + GRAY_ZONE) {
      return ja_routing_type.U_TURN;
    } else if (absAngle > U_TURN_ANGLE - GRAY_ZONE) {
      return ja_routing_type.PROBLEM;
    } else if (absAngle >= TURN_ANGLE - GRAY_ZONE) {
      return ja_routing_type.TURN;
    } else {
      return ja_routing_type.BC;
    }
  }

  /**
   * Determines the routing instruction type for the FINAL step of a far turn (JB or Path).
   * Applies turn.instructionOpCode override (if present), checks exit restriction, and
   * falls back to angle-based classification.
   *
   * Used only for the final marker in a breadcrumb trail for both Junction Box and Path turns;
   * intermediate steps use ja_classify_turn_angle() directly without override.
   *
   * @param {object} turn - The SDK Turn object (contains instructionOpCode, fromSegmentId, toSegmentId).
   * @param {object} connectingNode - The SDK Node where lastPathSeg hands off to exitSeg.
   * @param {number} lastPathSegId - ID of the last intermediate segment.
   * @param {object} lastPathSeg - The SDK Segment object for lastPathSegId.
   * @param {object} exitSeg - The SDK Segment object for the exit segment (turn.toSegmentId).
   * @param {number} localStepAngle - The angle at the connecting node (fallback if guess fails).
   * @returns {string} A ja_routing_type value for styling/display.
   */
  function ja_get_final_step_type(turn, connectingNode, lastPathSegId, lastPathSeg, exitSeg, localStepAngle) {
    // Step 1: Check for TIO/VIO override (turn.instructionOpCode)
    var opcode = turn.instructionOpCode || null;
    if (opcode) {
      var opcodeType = ja_opcode_to_routing_type(opcode, false);
      if (opcodeType !== null) {
        return opcodeType;
      }
    }

    // Step 2: Check if exit is restricted (local node turn restriction)
    if (!ja_is_turn_allowed(lastPathSeg, connectingNode, exitSeg)) {
      ja_log('[FAR-TURNS] Final step blocked by turn restriction', 2);
      return ja_routing_type.NO_TURN;
    }

    // Step 3: Use ja_guess_routing_instruction at connecting node (full classification)
    if (connectingNode) {
      // Build angles array for ja_guess_routing_instruction
      var guessAngles = [];
      connectingNode.connectedSegmentIds.forEach(function (cSegId) {
        var cSeg = sdk.DataModel.Segments.getById({ segmentId: cSegId });
        var cAngle = ja_getAngle(connectingNode.id, cSeg);
        if (cAngle != null) {
          guessAngles.push([cAngle, cSegId, false]);
        }
      });
      var guessed = ja_guess_routing_instruction(connectingNode, lastPathSegId, exitSeg.id, guessAngles);
      if (guessed !== ja_routing_type.NO_TURN) {
        return guessed;
      }
    }

    // Step 4: Fallback to angle-based classification
    return ja_classify_turn_angle(localStepAngle);
  }

  /**
   * Draws angle markers for "far turns" — turns that cross multiple segments rather than
   * connecting directly at a single junction node.
   *
   * This function handles two Waze feature types that both appear as far turns in the SDK:
   *
   *   PATH TURNS (turn.isPathTurn === true)
   *   ──────────────────────────────────────
   *   Created by editors using the Paths tool (also known as "far lanes phase 2" / FL2).
   *   Paths exist solely to provide better lane guidance and turn instructions to drivers.
   *   They CANNOT affect routing — the routing server ignores them entirely.
   *   They CAN be restricted (new feature in WME). Restricted Path turns display as gray (NO_TURN).
   *   Controlled by: enableFarTurnPath experimental setting (disabled by default).
   *
   *   JUNCTION BOX TURNS (turn.isJunctionBoxTurn === true)
   *   ─────────────────────────────────────────────────────
   *   Created when a Junction Box (BigJunction polygon) is drawn over a complex intersection.
   *   Junction Box turns CAN be restricted (red/yellow arrows in WME editor).
   *   They DO affect routing and collect per-path speed data.
   *   This function checks turn.isAllowed and displays restricted JB paths as gray (NO_TURN).
   *   Controlled by: enableFarTurnJB experimental setting (disabled by default).
   *
   * ANGLE CALCULATION APPROACH
   * ──────────────────────────
   * The angle shown is the INSTRUCTION-FIRING angle — the local heading change at the first
   * node along the path where the turn is NOT Best Continuation (straight).
   *
   * Algorithm (see "INSTRUCTION-FIRING ANGLE SEARCH" block inside the forEach below):
   *
   *   Step 1: Compute angle at entry node   (fromSeg → segmentPath[0])
   *   Step 2: Compute angle at connecting node (lastPathSeg → toSeg)
   *   • Use step 1 if |step1| > BC_THRESHOLD (10°)  — instruction fires at entry node
   *   • Else use step 2 if |step2| > BC_THRESHOLD   — instruction fires at connecting node
   *   • Fall back to step 1 if both are below threshold (both straight)
   *
   * Why not the net entry→exit angle?
   * The net angle across the entire path is geometrically correct but is NOT what Waze uses for the
   * voice prompt. Waze fires at the first meaningful turn node, which typically produces a clearer,
   * more actionable turn angle.
   *
   * Why not always use the entry node?
   * When the entry segment continues STRAIGHT onto the first intermediate segment (straight geometry,
   * ~0-5°), the instruction fires further along at the connecting node where the real heading change
   * occurs. This produces more accurate turn angles than using the entry node alone.
   *
   * LABEL PLACEMENT
   * ───────────────
   * Marker placement (the ★ boundary point and ha direction) always uses the connecting node
   * and the exit segment's departure bearing — this is unchanged regardless of which node
   * the instruction fires at. The angle VALUE changes; the position does not.
   *
   * @param {object} node             - The SDK Node object at which far turns originate.
   *                                    We query turns from each segment connected to this
   *                                    node and filter to those whose fromSegment touches it.
   * @param {number} ja_label_distance - Label placement distance in metres, computed by
   *                                    ja_compute_label_distance() based on zoom level.
   * @param {number[]} ja_selected_seg_ids - IDs of the currently selected segments. Far turns
   *                                    are only drawn for entry segments in this list. When
   *                                    empty (node selection), all entry segments are shown.
   * @param {Array}    angles           - The angles array from ja_draw_node_markers() for this node.
   *                                    Format: [[bearing, segmentId, isSelected], ...] for all
   *                                    segments connected to node. Passed to
   *                                    ja_guess_routing_instruction() so far-turn classification
   *                                    uses the same KEEP/EXIT/TURN thresholds as regular turns.
   */
  function ja_draw_far_turn_markers(node, ja_label_distance, ja_selected_seg_ids, allBigJunctions) {
    ja_log('[FAR-TURNS] ─── CALLED FOR NODE ' + node.id + ' ───', 3);

    // WHY getTurnsFromSegment instead of getTurnsThroughNode:
    // getTurnsThroughNode only returns turns where BOTH the entry and exit segment connect
    // at the same node — i.e., standard direct turns. Far turns (JB turns, path turns) have
    // an exit segment that is NOT directly connected to the entry node, so they are not
    // returned by getTurnsThroughNode.
    //
    // Instead we query getTurnsFromSegment for every segment connected to this node, which
    // returns ALL turns (including far turns) that originate from that segment. We then filter
    // to only far turns whose fromSegment actually touches our node (to avoid processing the
    // same far turn again when we reach the node at the other end of the segment).
    var seenTurnIds = {}; // deduplicate in case two connected segments share a far turn
    var drawnIntermediateSteps = {}; // key: "nodeId_angleRounded", prevents duplicate intermediate-step markers when multiple paths share the same median segment

    node.connectedSegmentIds.forEach(function (segId) {
      ja_log('[FAR-TURNS]   Processing segId ' + segId + ' from node ' + node.id, 3);

      // Only draw far turns FROM the user-selected entry segment(s).
      //
      // When a segment is selected, regular departure-mode markers show angles FROM that
      // segment only — not from every other segment at the same node. Far turns follow the
      // same principle: we only want to see "if I came in on THIS segment, what are my JB/
      // path exits and at what angle?"
      //
      // Without this filter, every entry segment at the node produces its own set of far-turn
      // markers. When two different entries share the same exit segment, their markers land at
      // the same boundary point — producing visually duplicate circles at the exit arrow.
      //
      // When ja_selected_seg_ids is empty (user selected a node, not a segment) we skip this
      // filter and show far turns from all connected non-median segments, since there is no
      // single "incoming" segment to anchor the perspective.
      if (ja_selected_seg_ids.length > 0 && ja_selected_seg_ids.indexOf(segId) === -1) {
        ja_log('[FAR-TURNS] Skipping segId ' + segId + ' — not a selected segment', 3);
        return;
      }

      // Skip segments that are contained within a BigJunction (median/intermediate segments).
      if (sdk.DataModel.Segments.isContainedInBigJunction({ segmentId: segId })) {
        ja_log('[FAR-TURNS] Skipping segId ' + segId + ' — isContainedInBigJunction (median segment)', 3);
        return;
      }

      // Get direct turns from this segment
      var turnsFromSeg = sdk.DataModel.Turns.getTurnsFromSegment({ segmentId: segId });
      if (!turnsFromSeg || turnsFromSeg.length === 0) return;

      // Check if this segment has far turns (JB or Path) via the normal method
      var jbFarTurnsCount = turnsFromSeg.filter(function (t) {
        return t.isJunctionBoxTurn || t.isPathTurn;
      }).length;

      // FALLBACK: If no far turns (JB or Path) found, try getAllPossibleTurns() as alternative
      if (jbFarTurnsCount === 0) {
        // Check if this segment crosses into a BigJunction and if we're at the correct entry node
        var seg = sdk.DataModel.Segments.getById({ segmentId: segId });
        if (seg) {
          var fromNode = sdk.DataModel.Nodes.getById({ nodeId: seg.fromNodeId });
          var toNode = sdk.DataModel.Nodes.getById({ nodeId: seg.toNodeId });

          if (fromNode && toNode) {
            var isJBSegment = false;
            var entryNodeForTurns = null;

            // Determine if segment crosses JB boundary and which node is the entry node
            for (var bji = 0; bji < allBigJunctions.length; bji++) {
              var bj = allBigJunctions[bji];
              var bjPolygon = turf.polygon(bj.geometry.coordinates);
              var fromInside = turf.booleanPointInPolygon(turf.point(fromNode.geometry.coordinates), bjPolygon);
              var toInside = turf.booleanPointInPolygon(turf.point(toNode.geometry.coordinates), bjPolygon);

              // Check if segment crosses JB boundary (entry: outside→inside, exit: inside→outside)
              if ((!fromInside && toInside) || (fromInside && !toInside)) {
                isJBSegment = true;
                // The entry node is where the turn originates (inside the JB)
                entryNodeForTurns = toInside ? seg.toNodeId : seg.fromNodeId;
                break; // Only check the first matching JB
              }
            }

            // Only query getAllPossibleTurns when we're at the correct entry node
            if (isJBSegment && entryNodeForTurns === node.id) {
              ja_log('[FAR-TURNS] segId ' + segId + ' has 0 JB far turns via getTurnsFromSegment() — trying getAllPossibleTurns()...', 1);

              try {
                var allTurns = sdk.DataModel.BigJunctions.getAllPossibleTurns({ bigJunctionId: bj.id });
                ja_log('[FAR-TURNS] getAllPossibleTurns(' + bj.id + ') returned ' + allTurns.length + ' total turns', 2);

                // Filter for turns from this entry segment that have intermediate segments (far turns through JB)
                // CRITICAL: getAllPossibleTurns() returns ALL path combinations through a JB, including
                // traversals of median segments in BOTH directions. We must reject nonsensical paths.
                var fallbackTurns = allTurns.filter(function (t) {
                  if (!(t.fromSegmentId === segId && t.segmentPath && t.segmentPath.length > 0)) {
                    return false;
                  }

                  // REJECT: paths that traverse the same segment multiple times
                  // These are backtrack/loop paths and geometrically invalid
                  var pathSegIds = t.segmentPath;
                  for (var psi = 0; psi < pathSegIds.length - 1; psi++) {
                    if (pathSegIds[psi] === pathSegIds[psi + 1]) {
                      ja_log('[FAR-TURNS] Rejecting turn ' + t.id + ' — same segment ' + pathSegIds[psi] + ' appears consecutively in path', 3);
                      return false;
                    }
                  }

                  var tFromSeg = sdk.DataModel.Segments.getById({ segmentId: t.fromSegmentId });
                  var tFirstPathSeg = sdk.DataModel.Segments.getById({ segmentId: t.segmentPath[0] });
                  if (tFromSeg == null || tFirstPathSeg == null) return false;

                  var tEntryNode = ja_get_connecting_node(tFromSeg, tFirstPathSeg);
                  if (tEntryNode !== entryNodeForTurns) return false;

                  // Determine which node of firstPathSeg is the "exit" (not the entry)
                  var firstPathExitNode = null;
                  if (tFirstPathSeg.fromNodeId === entryNodeForTurns) {
                    firstPathExitNode = tFirstPathSeg.toNodeId; // traverse toward toNodeId
                  } else if (tFirstPathSeg.toNodeId === entryNodeForTurns) {
                    firstPathExitNode = tFirstPathSeg.fromNodeId; // traverse toward fromNodeId
                  } else {
                    return false; // doesn't touch entry node
                  }

                  // Now check: if there's a second segment in the path, it should connect
                  // from firstPathExitNode. If it doesn't, this traversal direction is wrong.
                  if (t.segmentPath.length > 1) {
                    var tSecondPathSeg = sdk.DataModel.Segments.getById({ segmentId: t.segmentPath[1] });
                    if (tSecondPathSeg == null) return false;

                    // Check if secondPathSeg connects to firstPathExitNode
                    if (tSecondPathSeg.fromNodeId !== firstPathExitNode && tSecondPathSeg.toNodeId !== firstPathExitNode) {
                      // Second segment doesn't connect to exit of first segment
                      // This indicates wrong traversal direction through first segment
                      ja_log('[FAR-TURNS] Rejecting turn ' + t.id + ' — path breaks at first→second segment connection', 3);
                      return false;
                    }
                  }

                  return true;
                });

                ja_log('[FAR-TURNS] Filtered to ' + fallbackTurns.length + ' far turns FROM entry segment ' + segId, 2);

                if (fallbackTurns.length > 0) {
                  turnsFromSeg = fallbackTurns;
                  ja_log('[FAR-TURNS] Using getAllPossibleTurns() results as fallback', 3);
                }
              } catch (e) {
                ja_log('[FAR-TURNS] getAllPossibleTurns(' + bj.id + ') threw error: ' + e.message, 1);
              }
            } else if (isJBSegment && entryNodeForTurns !== node.id) {
              ja_log('[FAR-TURNS] Segment ' + segId + ' is a JB segment, but entry node is ' + entryNodeForTurns + ', not current node ' + node.id + ' — skipping', 3);
              return; // Skip this segment at this node
            }
          }
        }
      }

      turnsFromSeg.forEach(function (turn) {
        ja_log('[FAR-TURNS] Turn ' + turn.id + ': isPathTurn=' + turn.isPathTurn + ', isJunctionBoxTurn=' + turn.isJunctionBoxTurn, 3);

        // Only process far turns (Path turns or Junction Box turns).
        // Regular turns (isPathTurn=false, isJunctionBoxTurn=false) are already handled
        // by the existing ja_draw_node_markers() loop and should not be duplicated here.
        // Also accept turns with intermediate segments (from getAllPossibleTurns fallback)
        // even if they don't have the isJunctionBoxTurn flag set.
        var isFarTurn = turn.isPathTurn || turn.isJunctionBoxTurn || (turn.segmentPath && turn.segmentPath.length > 0);
        if (!isFarTurn) {
          ja_log('[FAR-TURNS] Skipping turn ' + turn.id + ' — not a far turn', 3);
          return;
        }

        // segmentPath[] contains the IDs of the intermediate segments connecting
        // fromSegmentId to toSegmentId. It excludes the entry and exit segments themselves.
        // For a valid far turn segmentPath should always have at least one entry — if it is
        // somehow empty we cannot determine the entry node, so skip.
        if (!turn.segmentPath || turn.segmentPath.length === 0) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — segmentPath is empty', 1);
          return;
        }

        // Fetch the entry segment for this far turn.
        var fromSeg = sdk.DataModel.Segments.getById({ segmentId: turn.fromSegmentId });
        if (fromSeg == null) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — fromSegment not found', 1);
          return;
        }

        // For fallback turns from getAllPossibleTurns(): verify path orientation.
        // getAllPossibleTurns() returns paths using median segments in both forward and
        // reverse directions. We must skip paths that traverse median segments backward.
        var isFallbackTurn = !turn.isJunctionBoxTurn && turn.segmentPath && turn.segmentPath.length > 0;
        if (isFallbackTurn) {
          var firstPathSegId = turn.segmentPath[0];
          var firstPathSeg = sdk.DataModel.Segments.getById({ segmentId: firstPathSegId });
          if (firstPathSeg == null) {
            ja_log('[FAR-TURNS] Skipping fallback turn ' + turn.id + ' — firstPathSeg not found', 1);
            return;
          }
          // Check if fromSeg actually connects to firstPathSeg. If no connection exists,
          // it means the path uses a segment in the wrong (backward) orientation.
          var testConnectNode = ja_get_connecting_node(fromSeg, firstPathSeg);
          if (testConnectNode == null) {
            ja_log('[FAR-TURNS] Skipping fallback turn ' + turn.id + ' — cannot connect to first path segment (wrong orientation)', 3);
            return;
          }
        }

        // CRITICAL: Verify the current node is the actual JB/path entry node.
        //
        // Problem: getTurnsFromSegment returns the same far turn when called from EITHER
        // endpoint of the fromSegment. A selected segment A→B only enters the JB at B,
        // but we process both node A and node B. Without this check, markers appear at A too.
        //
        // For fallback turns from getAllPossibleTurns(), they are indexed to a specific
        // entry node. We must validate before marking as seen, otherwise the turn won't
        // be processed when we reach the correct node.
        //
        // Fix: The true entry node is the node shared between fromSegment and the FIRST
        // segment in segmentPath[]. That is the point where the segment physically hands off
        // into the JB or path. If the current node is not that shared node, skip this turn.
        var firstPathSeg = sdk.DataModel.Segments.getById({ segmentId: turn.segmentPath[0] });
        if (firstPathSeg == null) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — firstPathSeg not found', 1);
          return;
        }
        var entryNodeId = ja_get_connecting_node(fromSeg, firstPathSeg);
        if (entryNodeId !== node.id) {
          // This node is not the JB/path entry — the far turn belongs to the other end.
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' at node ' + node.id + ' — entry is at node ' + entryNodeId, 3);
          return;
        }

        // Deduplicate: a far turn may appear in results for multiple connected segments.
        // Only draw it once per node visit. This is checked AFTER node validation so that
        // fallback turns (which are node-specific) can be processed from their correct node
        // even if they were encountered and skipped from a different node first.
        if (seenTurnIds[turn.id]) return;
        seenTurnIds[turn.id] = true;

        // Check if this turn type is enabled via experimental settings
        if (turn.isJunctionBoxTurn && !ja_getOption('enableFarTurnJB')) {
          ja_log('[FAR-TURNS] Skipping JB turn ' + turn.id + ' — enableFarTurnJB is disabled', 3);
          return;
        }
        if (turn.isPathTurn && !ja_getOption('enableFarTurnPath')) {
          ja_log('[FAR-TURNS] Skipping Path turn ' + turn.id + ' — enableFarTurnPath is disabled', 3);
          return;
        }

        // Fetch the exit segment (NOT connected to this node — it is at the far end of the path).
        var toSeg = sdk.DataModel.Segments.getById({ segmentId: turn.toSegmentId });
        if (toSeg == null) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — toSegment not found', 1);
          return;
        }

        // Skip JB turns whose exit segment is itself contained inside a BigJunction.
        //
        // In a multi-segment JB path (E → M1 → M2 → Exit), the JB model can emit
        // separate turns for sub-routes where a median segment (M1 or M2) appears as
        // the toSegmentId. These represent internal routing steps, not the full path to
        // the real outside-exit segment. Drawing a marker for one of them would:
        //   1. Place the marker inside the JB polygon (at an internal node).
        //   2. Produce a duplicate alongside the correct marker at the real exit.
        //
        // Only turns where toSeg is a genuine external exit segment should generate markers.
        //
        // Note: this check is only applied to JB turns (isJunctionBoxTurn) because Path
        // turns (isPathTurn) do not use BigJunctions and their exit segments are always
        // external by definition.
        if (turn.isJunctionBoxTurn && sdk.DataModel.Segments.isContainedInBigJunction({ segmentId: turn.toSegmentId })) {
          ja_log('[FAR-TURNS] Skipping JB turn ' + turn.id + ' — toSegment ' + turn.toSegmentId + ' is a median (isContainedInBigJunction)', 1);
          return;
        }

        // To get the correct departure bearing of the exit segment we need to know which
        // of its two endpoint nodes connects to the path. That is the node shared between
        // the last intermediate segment (segmentPath[last]) and the exit segment.
        var lastPathSegId = turn.segmentPath[turn.segmentPath.length - 1];
        var lastPathSeg = sdk.DataModel.Segments.getById({ segmentId: lastPathSegId });
        if (lastPathSeg == null) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — lastPathSeg not found', 1);
          return;
        }

        // The connecting node is where the path "hands off" to the exit segment.
        // ja_getAngle() uses this to know which end of the exit segment faces the path.
        var connectingNodeId = ja_get_connecting_node(lastPathSeg, toSeg);
        if (connectingNodeId == null) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — could not find connecting node between lastPathSeg and toSeg', 1);
          return;
        }

        // BUILD PATH SEGMENTS ARRAY
        // ──────────────────────────────────────────────────────────────────
        // pathSegs = [fromSeg, segmentPath[0], ..., segmentPath[last], toSeg]
        var pathSegs = [fromSeg];
        var pathSegFetchOk = true;
        for (var pi = 0; pi < turn.segmentPath.length; pi++) {
          var pSeg = sdk.DataModel.Segments.getById({ segmentId: turn.segmentPath[pi] });
          if (pSeg == null) {
            pathSegFetchOk = false;
            break;
          }
          pathSegs.push(pSeg);
        }
        pathSegs.push(toSeg);

        if (!pathSegFetchOk) {
          ja_log('[FAR-TURNS] Skipping turn ' + turn.id + ' — could not fetch all path segments', 1);
          return;
        }

        // BREADCRUMB TRAIL: Draw a marker for each step in the path
        // ───────────────────────────────────────────────────────────────────
        // For both JB and Path turns: show round markers for intermediate steps, square for final exit
        // Deduplication prevents duplicate intermediate markers when multiple paths share median segments
        // Each marker shows the LOCAL turn angle at its connecting node.

        // Check restriction state: can be blocked at turn level (JB/Path) or at intermediate nodes
        // Track this so we can display gray marker instead of skipping entirely (for consistency with local turns)
        var isPathRestricted = false;
        var isFallbackJBTurn = !turn.isJunctionBoxTurn && !turn.isPathTurn && turn.segmentPath && turn.segmentPath.length > 0;

        // First check: Turn restriction set directly on the turn (JB or Path turns)
        // Both turn types now support restrictions
        if (turn.isJunctionBoxTurn && !turn.isAllowed) {
          ja_log('[FAR-TURNS] JB turn ' + turn.id + ' restricted: turn.isAllowed=false', 3);
          isPathRestricted = true;
        }
        if (turn.isPathTurn && !turn.isAllowed) {
          ja_log('[FAR-TURNS] Path turn ' + turn.id + ' restricted: turn.isAllowed=false', 3);
          isPathRestricted = true;
        }
        // For fallback JB turns (from getAllPossibleTurns): treat as restricted if not explicitly allowed
        // This is because JB turns are controlled by JB logic, and a missing "allowed" indicator likely means restriction
        if (isFallbackJBTurn) {
          // Show as restricted unless it clearly has an explicit "allowed" status from SDK
          // Since getAllPossibleTurns may not fully reflect WME-set restrictions, be conservative
          ja_log('[FAR-TURNS] Fallback JB turn ' + turn.id + ' marked as restricted (JB-controlled path)', 3);
          isPathRestricted = true;
        }

        // Build blockedSteps map for JB turns and fallback JB turns (check local node restrictions)
        var blockedSteps = {};
        var pathHasBlockedStep = false; // Track if ANY step is blocked
        if (turn.isJunctionBoxTurn || isFallbackJBTurn) {
          for (var si = 0; si < pathSegs.length - 1; si++) {
            var stepFrom = pathSegs[si];
            var stepTo = pathSegs[si + 1];
            var stepNodeId = ja_get_connecting_node(stepFrom, stepTo);
            if (stepNodeId == null) {
              blockedSteps[si] = true;
              pathHasBlockedStep = true;
              ja_log('[FAR-TURNS] Step ' + si + ' blocked: no connecting node', 3);
              continue;
            }
            var stepNode = sdk.DataModel.Nodes.getById({ nodeId: stepNodeId });
            if (stepNode == null) {
              blockedSteps[si] = true;
              pathHasBlockedStep = true;
              ja_log('[FAR-TURNS] Step ' + si + ' blocked: stepNode is null', 3);
            } else {
              var isAllowed = ja_is_turn_allowed(stepFrom, stepNode, stepTo);
              if (!isAllowed) {
                blockedSteps[si] = true;
                pathHasBlockedStep = true;
                ja_log('[FAR-TURNS] Step ' + si + ' blocked: turn restriction', 3);
              }

              // For fallback turns on final step: check JB turn instructions at entry node
              // JB turn instructions are stored at the first node inside the JB (toNodeId of entry segment)
              var isFinalStep = si === pathSegs.length - 2;
              if (isFallbackJBTurn && isFinalStep) {
                // Entry node is toNodeId of the entry segment (where it crosses INTO JB)
                var entryNodeId = fromSeg.toNodeId;
                var jbTurnsAtEntry = sdk.DataModel.Turns.getTurnsThroughNode({ nodeId: entryNodeId });
                var hasJBRestriction = jbTurnsAtEntry.some(function (t) {
                  // Check if this turn matches our path AND has a restriction
                  return t.fromSegmentId === turn.fromSegmentId && t.toSegmentId === turn.toSegmentId && (!t.isAllowed || t.instructionOpCode !== null);
                });
                if (hasJBRestriction) {
                  ja_log('[FAR-TURNS] Step ' + si + ' blocked by JB turn instruction at node ' + entryNodeId, 1);
                  blockedSteps[si] = true;
                  pathHasBlockedStep = true;
                }
              }
            }
          }
          // If ANY intermediate step is blocked, mark path as restricted but continue to draw gray marker
          if (pathHasBlockedStep) {
            var turnTypeStr = turn.isJunctionBoxTurn ? 'JB' : 'fallback JB';
            ja_log('[FAR-TURNS] ' + turnTypeStr + ' turn ' + turn.id + ' restricted: internal node restriction blocks this path', 3);
            isPathRestricted = true;
          }
        }

        // U-TURN TOTAL ANGLE ACCUMULATION
        // ────────────────────────────────
        // For U-TURN paths (instructionOpCode='UTURN'), accumulate all turn angles
        // through the path. The final marker will display the total heading change
        // (sum of all intermediate turns), not just the final step's local angle.
        // This is more robust for non-parallel/irregular geometries.
        var isUTurnPath = turn.instructionOpCode === 'UTURN';
        var uTurnAccumulatedAngle = 0;

        // Loop through each step and draw markers
        for (var stepIndex = 0; stepIndex < pathSegs.length - 1; stepIndex++) {
          var stepFrom = pathSegs[stepIndex];
          var stepTo = pathSegs[stepIndex + 1];
          var isFinalStep = stepIndex === pathSegs.length - 2;

          // Skip blocked steps (JB only)
          if (blockedSteps[stepIndex]) {
            ja_log('[FAR-TURNS] Skipping step ' + stepIndex + ' — local restriction', 3);
            continue;
          }

          // Get connecting node for this step
          var stepConnectingNodeId = ja_get_connecting_node(stepFrom, stepTo);
          if (stepConnectingNodeId == null) {
            ja_log('[FAR-TURNS] Step ' + stepIndex + ': no connecting node', 3);
            continue;
          }
          var stepConnectingNode = sdk.DataModel.Nodes.getById({ nodeId: stepConnectingNodeId });
          if (stepConnectingNode == null) {
            ja_log('[FAR-TURNS] Step ' + stepIndex + ': connecting node not found', 3);
            continue;
          }

          // Calculate angle at this step's connecting node
          var stepInAngle = ja_getAngle(stepConnectingNodeId, stepFrom);
          var stepOutAngle = ja_getAngle(stepConnectingNodeId, stepTo);
          if (stepInAngle == null || stepOutAngle == null) {
            ja_log('[FAR-TURNS] Step ' + stepIndex + ': could not compute angles', 3);
            continue;
          }

          var stepAngle = ja_angle_diff(stepInAngle, stepOutAngle, false);

          // Accumulate for U-TURN total (regardless of whether this step is drawn)
          if (isUTurnPath) {
            uTurnAccumulatedAngle += stepAngle;
          }

          // DEDUPLICATION: For intermediate steps, skip if already drawn
          if (!isFinalStep) {
            // Skip stepIndex 0 (entry node angle): already drawn by ja_draw_node_markers()
            // ja_draw_node_markers processes this node and draws all connected segment angles,
            // including entry→firstMedianSegment. Drawing it again here as the first breadcrumb
            // would create a duplicate marker.
            if (stepIndex === 0) {
              ja_log('[FAR-TURNS] Skipping step 0 — already drawn by ja_draw_node_markers()', 3);
              continue;
            }

            // Skip if another path already drew this node+angle pair
            // Multiple paths may traverse the same median segment pair (e.g., A→M1→B and C→M1→B).
            // We only need to show the marker once.
            var stepKey = stepConnectingNodeId + '_' + ja_round(Math.abs(stepAngle));
            if (drawnIntermediateSteps[stepKey]) {
              ja_log('[FAR-TURNS] Skipping step ' + stepIndex + ' — already drawn at node ' + stepConnectingNodeId + ' with angle ' + ja_round(Math.abs(stepAngle)) + '°', 3);
              continue;
            }
            drawnIntermediateSteps[stepKey] = true;
          }

          // Determine marker type
          var stepMarkerType;
          if (isFinalStep) {
            // FINAL STEP: apply turn.instructionOpCode override and check exit restriction
            stepMarkerType = ja_getOption('guess') ? ja_get_final_step_type(turn, stepConnectingNode, lastPathSegId, lastPathSeg, toSeg, stepAngle) : ja_routing_type.TURN;
          } else {
            // INTERMEDIATE STEP: use local angle classification, no override
            stepMarkerType = ja_getOption('guess') ? ja_classify_turn_angle(stepAngle) : ja_routing_type.TURN;
          }

          // If path is restricted (JB turn level or intermediate node), override to NO_TURN (gray marker)
          // This applies to both final and intermediate steps so the entire path appears gray
          if (isPathRestricted) {
            stepMarkerType = ja_routing_type.NO_TURN;
          }

          // Determine marker placement anchor
          var stepMarkerAnchor = stepConnectingNode;
          var stepExitBearing = stepOutAngle;

          // For final step, place at JB boundary crossing (not at node) if it's a JB or fallback JB turn
          // This applies to:
          // A) Turns with isJunctionBoxTurn flag (normal SDK behavior)
          // B) Fallback turns from getAllPossibleTurns() that cross JB boundaries
          //    (these have segmentPath but not the JB flag set)
          var shouldRepositionToBoundary = isFinalStep && (turn.isJunctionBoxTurn || isFallbackJBTurn);

          if (shouldRepositionToBoundary) {
            var bigJunction = null;
            var firstPathSegId = turn.segmentPath[0];

            // Find the BigJunction containing the first path segment (median segment)
            for (var bji = 0; bji < allBigJunctions.length; bji++) {
              if (allBigJunctions[bji].segmentIds.indexOf(firstPathSegId) !== -1) {
                bigJunction = allBigJunctions[bji];
                break;
              }
            }

            if (bigJunction != null) {
              var bjPolygon = turf.polygon(bigJunction.geometry.coordinates);
              var closestPt = ja_find_closest_bj_intersection(toSeg, bjPolygon, stepConnectingNode);
              if (closestPt !== null) {
                stepMarkerAnchor = { geometry: closestPt.geometry };
                ja_log('[FAR-TURNS] Step ' + stepIndex + ': repositioned to JB boundary (isFallback=' + isFallbackJBTurn + ')', 2);
              }
            }
          }

          // Compute label distance corrected for latitude
          var stepJaLd = ja_corrected_ld(ja_label_distance, stepMarkerAnchor.geometry.coordinates);

          // Apply extra-space multiplier for visibility
          var stepExtraSpace = ja_compute_extra_space(stepAngle, stepExitBearing);

          // CHECK FOR LOCAL TURN MARKER CONFLICT
          // If a local turn at this node targets the same direction, move this far-turn marker farther out
          var hasLocalConflict = ja_local_markers_by_node[stepConnectingNodeId] &&
                                 ja_local_markers_by_node[stepConnectingNodeId].some(function(ltMarker) {
                                   return ja_markers_target_same_direction(stepExitBearing, ltMarker.bearing, 30);
                                 });

          // Check if we repositioned to JB boundary (stepMarkerAnchor !== stepConnectingNode)
          var isAtBoundary = stepMarkerAnchor !== stepConnectingNode;

          // Determine distance multiplier: prioritize boundary distance, then local conflict distance
          var stepDistanceMultiplier = stepExtraSpace;
          if (isAtBoundary) {
            // At JB boundary: use larger distance to avoid overlapping with WME turn restriction arrows
            stepDistanceMultiplier = 2.5;
            if (hasLocalConflict) {
              ja_log('[MARKER-OVERLAP] Far-turn at JB boundary + local conflict at node ' + stepConnectingNodeId + ' — using 2.5x boundary distance (takes precedence)', 2);
            } else {
              ja_log('[MARKER-OVERLAP] Far-turn at JB boundary for node ' + stepConnectingNodeId + ' — using 2.5x boundary distance', 2);
            }
          } else if (hasLocalConflict) {
            stepDistanceMultiplier = 1.5;
            ja_log('[MARKER-OVERLAP] Far-turn conflict at node ' + stepConnectingNodeId + ' bearing ' + stepExitBearing + ' — using 1.5x distance', 2);
          }

          // Calculate marker position
          var stepPoint = turf.destination(turf.point(stepMarkerAnchor.geometry.coordinates), (stepDistanceMultiplier * stepJaLd) / 1000, ja_math_to_compass(stepExitBearing)).geometry;

          // Determine marker shape: round for intermediate, square for final
          var stepIsSquareMarker = isFinalStep;

          // For U-TURN paths on final step, use accumulated total angle instead of local step angle
          var angleToDisplay = stepAngle;
          if (isUTurnPath && isFinalStep) {
            angleToDisplay = uTurnAccumulatedAngle;
            ja_log('[FAR-TURNS] U-TURN final step: using accumulated angle ' + uTurnAccumulatedAngle.toFixed(2) + '° instead of local angle ' + stepAngle.toFixed(2) + '°', 2);
          }

          ja_log('[FAR-TURNS] Drawing step ' + stepIndex + ' (final=' + isFinalStep + ', angle=' + angleToDisplay.toFixed(2) + '°, type=' + stepMarkerType + ')', 2);

          // Draw the marker (isFarTurn=true, isSquareMarker=stepIsSquareMarker)
          ja_draw_marker(stepPoint, stepMarkerAnchor, stepJaLd, angleToDisplay, stepExitBearing, true, stepMarkerType, true, stepIsSquareMarker);

          // Record this far-turn marker for local turn conflict detection
          if (!ja_far_turn_bearings_by_node[stepConnectingNodeId]) {
            ja_far_turn_bearings_by_node[stepConnectingNodeId] = [];
          }
          ja_far_turn_bearings_by_node[stepConnectingNodeId].push({ bearing: stepExitBearing, distance: stepDistanceMultiplier * stepJaLd });
        }
      });
    });
  }

  // ── End far turn support ──────────────────────────────────────────────────────────────────────

  /**
   * Decimal adjustment of a number. Borrowed (with some modifications) from
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
   * ja_round(55.55); with 1 decimal // 55.6
   * ja_round(55.549); with 1 decimal // 55.5
   * ja_round(55); with -1 decimals // 60
   * ja_round(54.9); with -1 decimals // 50
   *
   * @param	{Number}	value	The number.
   * @returns	{Number}			The adjusted value.
   */
  function ja_round(value) {
    var ja_rounding = -parseInt(ja_getOption('decimals'));
    var valueArray;
    if (typeof ja_rounding === 'undefined' || +ja_rounding === 0) {
      return Math.round(value);
    }
    value = +value;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof ja_rounding === 'number' && ja_rounding % 1 === 0)) {
      return NaN;
    }
    // Shift
    valueArray = value.toString().split('e');
    value = Math.round(+(valueArray[0] + 'e' + (valueArray[1] ? +valueArray[1] - ja_rounding : -ja_rounding)));
    // Shift back
    valueArray = value.toString().split('e');
    return +(valueArray[0] + 'e' + (valueArray[1] ? +valueArray[1] + ja_rounding : ja_rounding));
  }

  // ── Settings I/O ──────────────────────────────────────────────────────────────

  /**
   * Returns the current value of a user setting, falling back to its default if missing or
   * invalid.
   *
   * **Important:** `name` must be a key that exists in `ja_settings`.  Calling this with an
   * arbitrary key (e.g. `'lastVersion'`) will throw because `ja_settings[name]` is undefined.
   * For bookkeeping values not in the settings schema, read `ja_options[key]` directly.
   *
   * Validation rules per element type:
   * - `select` — value must appear in `ja_settings[name].options`
   * - `color` — value must match `/#[0-9a-f]{6}/`
   * - `number` — value must be within `[min, max]` and not NaN
   * - `checkbox` — value must be a boolean
   *
   * @param {string} name - Key from the `ja_settings` schema.
   * @returns {*} The stored (or default) setting value.
   */
  function ja_getOption(name) {
    ja_log('Loading option: ' + name, 3);
    if (!ja_options.hasOwnProperty(name) || typeof ja_options[name] === 'undefined') {
      ja_options[name] = ja_settings[name].defaultValue;
    }
    //Check for invalid values
    //Select values
    if (ja_settings[name].elementType === 'select' && ja_settings[name].options.lastIndexOf(ja_options[name]) < 0) {
      ja_log(ja_settings[name].options, 4);
      ja_log('Found invalid value for setting ' + name + ': ' + ja_options[name] + '. Using default.', 3);
      ja_options[name] = ja_settings[name].defaultValue;
    }
    //Color values
    else if (ja_settings[name].elementType === 'color' && String(ja_options[name]).match(/#[0-9a-f]{6}/) == null) {
      ja_log('Found invalid value for setting ' + name + ': "' + ja_options[name] + '". Using default.', 3);
      ja_options[name] = ja_settings[name].defaultValue;
    }
    //Numeric values
    else if (ja_settings[name].elementType === 'number') {
      var minValue = typeof ja_settings[name].min === 'undefined' ? Number.MIN_VALUE : ja_settings[name].min;
      var maxValue = typeof ja_settings[name].max === 'undefined' ? Number.MAX_VALUE : ja_settings[name].max;
      if (isNaN(ja_options[name]) || ja_options[name] < minValue || ja_options[name] > maxValue) {
        ja_log('Found invalid value for setting ' + name + ': "' + ja_options[name] + '". Using default.', 3);
        ja_options[name] = ja_settings[name].defaultValue;
      }
    }
    //Checkboxes
    else if (ja_settings[name].elementType === 'checkbox' && ja_options[name] !== true && ja_options[name] !== false) {
      ja_log('Found invalid value for setting ' + name + ': "' + ja_options[name] + '". Using default.', 3);
      ja_options[name] = ja_settings[name].defaultValue;
    }

    ja_log('Got value: ' + ja_options[name], 3);
    return ja_options[name];
  }

  /**
   * Persists a single setting value to `ja_options` and immediately writes the entire options
   * object to `localStorage` under the key `wme_ja_options`.
   *
   * @param {string} name - Key from the `ja_settings` schema (or a raw `ja_options` key for
   *   bookkeeping values like `lastVersion`).
   * @param {*} val - New value to store.
   */
  function ja_setOption(name, val) {
    ja_options[name] = val;
    if (localStorage) {
      localStorage.setItem('wme_ja_options', JSON.stringify(ja_options));
    }
    ja_log(ja_options, 3);
  }

  /**
   * `onchange` handler attached to every settings control in the sidebar form.
   *
   * Checks whether the new control value actually differs from the stored value; if so it
   * sets `applyPending = true` and schedules `ja_save()` after a 500 ms debounce.
   *
   * Also handles enabling/disabling dependent controls:
   * - `override` checkbox — enables/disables the override sub-group
   * - `guess` checkbox — enables/disables the guess group and, transitively, the override
   *   sub-group
   * - `roundaboutOverlayDisplay` select — enables/disables the overlay color pickers
   *
   * Contains the inner helper `disable_input(element, disable)` which toggles `element.disabled`
   * and adds/removes the `disabled` CSS class on the parent node so the CSS overlay covers the
   * control visually.
   *
   * @param {HTMLInputElement|HTMLSelectElement} e - The DOM element that fired the `change`
   *   event (passed as `this` from the inline `onchange` handler in `setupHtml`).
   */
  var ja_onchange = function (e) {
    var applyPending = false;
    var settingName = Object.getOwnPropertyNames(ja_settings).filter(function (a) {
      ja_log(ja_settings[a], 4);
      return ja_settings[a].elementId === e.id;
    })[0];
    ja_log(e, 4);
    ja_log(settingName, 4);
    switch (ja_settings[settingName].elementType) {
      case 'checkbox':
        ja_log('Checkbox setting ' + e.id + ': stored value is: ' + ja_options[settingName] + ', new value: ' + e.checked, 3);
        if (ja_options[settingName] !== e.checked) {
          applyPending = true;
        }
        break;
      case 'select':
      case 'color':
      case 'number':
        ja_log('Setting ' + e.id + ': stored value is: ' + ja_options[settingName] + ', new value: ' + e.value, 3);
        if (String(ja_options[settingName]) !== String(e.value)) {
          applyPending = true;
        }
        break;
      default:
        ja_log('Unknown setting ' + e.id + ': stored value is: ' + ja_options[settingName] + ', new value: ' + e.value, 3);
    }

    /**
     * Toggles the disabled state of a settings control and its parent container's `disabled`
     * CSS class, which triggers the translucent overlay defined in the sidebar stylesheet.
     *
     * @param {HTMLElement} element - The input or select element to enable/disable.
     * @param {boolean} disable - True to disable and show the overlay; false to enable.
     */
    function disable_input(element, disable) {
      element.disabled = disable;
      var row = element.closest('.ja-row');
      if (row) {
        if (disable) {
          row.classList.add('disabled');
        } else {
          row.classList.remove('disabled');
        }
      }
    }

    //Enable|disable certain dependent settings
    switch (e.id) {
      case ja_settings.override.elementId:
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
          var setting = ja_settings[a];
          if (setting.group && setting.group === 'override') {
            ja_log(a + ': ' + !e.checked, 3);
            disable_input(document.getElementById(setting.elementId), !e.checked || e.disabled);
          }
        });
        break;
      case ja_settings.guess.elementId:
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
          var setting = ja_settings[a];
          if (setting.group && (setting.group === 'guess' || setting.group === 'override')) {
            ja_log(a + ': ' + !e.checked, 3);
            var overrideCb = document.getElementById(ja_settings.override.elementId);
            var shouldDisable = !e.checked || (setting.group === 'override' && (!overrideCb.checked || overrideCb.disabled));
            disable_input(document.getElementById(setting.elementId), shouldDisable);
          }
        });
        break;
      case ja_settings.roundaboutOverlayDisplay.elementId:
        Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
          var setting = ja_settings[a];
          if (setting.group && setting.group === 'roundaboutOverlayDisplay') {
            ja_log(a + ': ' + e.value, 3);
            disable_input(document.getElementById(setting.elementId), e.value === 'rOverNever');
          }
        });
        break;
      default:
        ja_log('Nothing to do for ' + e.id, 3);
    }

    ja_log('Apply pending configuration changes? ' + applyPending, 3);
    if (applyPending) {
      ja_log('Applying new settings now', 3);
      setTimeout(function () {
        ja_save();
      }, 500);
    } else {
      ja_log('No new settings to apply', 3);
    }
  };

  /**
   * Loads saved settings from `localStorage` into `ja_options` at startup.
   *
   * If `localStorage` is unavailable or the stored JSON is malformed, falls back to
   * `ja_reset()` which clears `ja_options` and calls `ja_apply()` with all defaults.
   * On a successful load, schedules `ja_apply()` after 500 ms to let the sidebar DOM
   * finish rendering before populating form controls.
   */
  var ja_load = function loadJAOptions() {
    ja_log('Should load settings now.', 3);
    if (localStorage != null) {
      ja_log('We have local storage! =)', 3);
      try {
        ja_options = JSON.parse(localStorage.getItem('wme_ja_options'));
      } catch (e) {
        ja_log('Loading settings failed.. ' + e.message, 1);
        ja_options = null;
      }
    }
    if (ja_options == null) {
      ja_reset();
    } else {
      ja_log(ja_options, 4);
      setTimeout(function () {
        ja_apply();
      }, 500);
    }
  };

  /**
   * Reads every settings control from the sidebar DOM and writes the values to `ja_options`
   * via `ja_setOption` (which also persists to `localStorage`).
   *
   * Color inputs with invalid hex are silently reverted to the schema default.  Number inputs
   * outside their `[min, max]` range are similarly reverted.  After saving, calls `ja_apply()`
   * to push the new values back into the style context and redraw markers.
   *
   * @returns {boolean} Always returns false (used as the form `onsubmit` handler to prevent
   *   page reload).
   */
  var ja_save = function saveJAOptions() {
    ja_log('Saving settings', 2);
    Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
      var setting = ja_settings[a];
      ja_log(setting, 4);
      switch (setting.elementType) {
        case 'checkbox':
          ja_setOption(a, document.getElementById(setting.elementId).checked);
          break;
        case 'color':
          var re = /^#[0-9a-f]{6}$/;
          if (re.test(document.getElementById(setting.elementId).value)) {
            ja_setOption(a, document.getElementById(setting.elementId).value);
          } else {
            ja_setOption(a, ja_settings[a]['default']);
          }
          break;
        case 'number':
          var val = parseInt(document.getElementById(setting.elementId).value);
          if (!isNaN(val) && val === parseInt(val) && setting.min <= val && val <= setting.max) {
            ja_setOption(a, document.getElementById(setting.elementId).value);
          } else {
            ja_setOption(a, ja_settings[a]['default']);
          }
          break;
        case 'text':
        case 'select':
          ja_setOption(a, document.getElementById(setting.elementId).value);
          break;
        default:
          ja_log('Unknown setting type ' + setting.elementType, 1);
      }
    });
    ja_apply();
    return false;
  };

  /**
   * Pushes all stored settings back into the sidebar DOM controls and triggers a map redraw.
   *
   * If the SDK layer isn't ready yet (`ja_layer_created === false`) the function reschedules
   * itself after 400 ms and returns early.  Similarly, if the `#sidepanel-ja` element doesn't
   * exist yet, the DOM-population step is skipped (the settings will be applied on the next
   * call once the sidebar has rendered).
   *
   * After populating controls it calls `ja_calculate_real()` to refresh angle markers using
   * the updated style context — this is the mechanism by which color-setting changes take
   * effect immediately without a page reload.
   */
  var ja_apply = function applyJAOptions() {
    ja_log('Applying stored (or default) settings', 2);
    if (!ja_layer_created) {
      ja_log('Layer not ready yet, trying again in 400 ms', 3);
      setTimeout(function () {
        ja_apply();
      }, 400);
      return;
    }
    if (document.getElementById('sidepanel-ja') == null) {
      ja_log('WME not ready (no settings tab)', 3);
    } else {
      ja_log(Object.getOwnPropertyNames(ja_settings), 4);
      Object.getOwnPropertyNames(ja_settings).forEach(function (a) {
        var setting = ja_settings[a];
        ja_log(a, 4);
        ja_log(setting, 4);
        ja_log(document.getElementById(setting.elementId), 4);
        switch (setting.elementType) {
          case 'checkbox':
            document.getElementById(setting.elementId).checked = ja_getOption(a);
            document.getElementById(setting.elementId).onchange(null);
            break;
          case 'color':
          case 'number':
          case 'text':
            document.getElementById(setting.elementId).value = ja_getOption(a);
            break;
          case 'select':
            document.getElementById(setting.elementId).value = ja_getOption(a);
            document.getElementById(setting.elementId).onchange(null);
            break;
          default:
            ja_log('Unknown setting type ' + setting.elementType, 1);
        }
      });
    }
    // Style driven by ja_build_style_context() closures — recalculate refreshes colors.
    ja_calculate_real();
    ja_log(ja_options, 4);
  };

  /**
   * Clears all saved settings and redraws markers with default values.
   *
   * Removes the `wme_ja_options` key from `localStorage` entirely, empties `ja_options`, then
   * calls `ja_apply()` which will fall back to schema defaults for every setting via
   * `ja_getOption`.
   *
   * @returns {boolean} Always returns false (used as the Reset button's `onclick` handler).
   */
  var ja_reset = function resetJAOptions() {
    ja_log('Resetting settings', 2);
    if (localStorage != null) {
      localStorage.removeItem('wme_ja_options');
    }
    ja_options = {};
    ja_apply();
    return false;
  };

  /**
   * Creates a `<li>` element containing an anchor that opens an external URL in a new tab.
   *
   * The anchor's text is retrieved via `ja_getMessage(text)` so the link label participates in
   * the i18n translation system.  Used in `setupHtml` to populate the "Version info & links"
   * list at the bottom of the sidebar panel.
   *
   * @param {string} url - Fully-qualified URL for the link's `href`.
   * @param {string} text - I18n message key (looked up via `ja_getMessage`).
   * @returns {HTMLLIElement} The newly created list item element.
   */
  function ja_helpLink(url, text) {
    var elem = document.createElement('li');
    var l = document.createElement('a');
    l.href = url;
    l.target = '_blank';
    l.appendChild(document.createTextNode(ja_getMessage(text)));
    elem.appendChild(l);
    return elem;
  }

  // ── Calculation debounce timer ────────────────────────────────────────────────
  //
  // Debounces calls to `ja_calculate_real()` so that rapid successive WME events
  // (e.g. map-move + selection-changed firing together) only trigger one redraw.
  // `ja_calculate()` always goes through this object; never call `ja_calculate_real()`
  // directly from event handlers except where an immediate synchronous redraw is required
  // (e.g. inside `ja_apply`).
  var ja_calculation_timer = {
    start: function () {
      ja_log('Starting timer', 3);
      this.cancel();
      var ja_calculation_timer_self = this;
      this.timeoutID = setTimeout(function () {
        ja_calculation_timer_self.calculate();
      }, 200);
    },

    calculate: function () {
      ja_calculate_real();
      delete this.timeoutID;
    },

    cancel: function () {
      if (typeof this.timeoutID === 'number') {
        clearTimeout(this.timeoutID);
        ja_log('Cleared timeout ID : ' + this.timeoutID, 3);
        delete this.timeoutID;
      }
    },
  };

  /**
   * Public entry point for triggering a map redraw.
   *
   * All WME event handlers call this function rather than `ja_calculate_real()` directly.
   * It delegates to `ja_calculation_timer.start()` which applies a 200 ms debounce so that
   * clusters of rapid events (e.g. selection change + data model update) only produce one
   * redraw.
   */
  function ja_calculate() {
    ja_calculation_timer.start();
  }

  /**
   * Returns `'black'` or `'white'` for use as a text color that contrasts against the given
   * background.
   *
   * Uses the YIQ luminance formula (`(R*299 + G*587 + B*114) / 1000`) — a perceptual
   * weighting that approximates human sensitivity to each colour channel.  Values ≥ 128
   * are considered light backgrounds (black text); < 128 are dark (white text).
   *
   * @param {string} hex_color - Six-digit hex color string (e.g. `'#aa0000'`).
   * @returns {'black'|'white'} High-contrast text color.
   */
  function ja_get_contrast_color(hex_color) {
    ja_log('Parsing YIQ-based contrast color for: ' + hex_color + ' ...', 3);
    var r = parseInt(hex_color.substring(1, 3), 16);
    var g = parseInt(hex_color.substring(3, 5), 16);
    var b = parseInt(hex_color.substring(5, 7), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  /**
   * Returns the user-configured fill color for a given routing-instruction type.
   *
   * Centralises the mapping from `ja_routing_type` constants to the corresponding color option
   * key so that both `ja_build_style_context()` and any future callers have a single source of
   * truth.  Override instruction types map to the same color buckets as their non-override
   * equivalents (e.g. `OverrideTURN_LEFT` → `turnInstructionColor`).
   *
   * Returns the generic fallback `'#ffcc88'` for any type not explicitly listed — this acts as
   * a visible sentinel to catch unhandled new routing types during development.
   *
   * @param {string} ja_type - A value from the `ja_routing_type` enum.
   * @returns {string} Six-digit hex color string (e.g. `'#00bd00'`).
   */
  function ja_fill_color_for_type(ja_type) {
    if (ja_type === ja_routing_type.TURN || ja_type === ja_routing_type.TURN_LEFT || ja_type === ja_routing_type.TURN_RIGHT) return ja_getOption('turnInstructionColor');
    if (ja_type === ja_routing_type.BC) return ja_getOption('noInstructionColor');
    if (ja_type === ja_routing_type.KEEP || ja_type === ja_routing_type.KEEP_LEFT || ja_type === ja_routing_type.KEEP_RIGHT) return ja_getOption('keepInstructionColor');
    if (ja_type === ja_routing_type.EXIT || ja_type === ja_routing_type.EXIT_LEFT || ja_type === ja_routing_type.EXIT_RIGHT) return ja_getOption('exitInstructionColor');
    if (ja_type === ja_routing_type.U_TURN) return ja_getOption('uTurnInstructionColor');
    if (ja_type === ja_routing_type.NO_TURN || ja_type === ja_routing_type.NO_U_TURN) return ja_getOption('noTurnColor');
    if (ja_type === ja_routing_type.PROBLEM) return ja_getOption('problemColor');
    if (ja_type === ja_routing_type.ROUNDABOUT) return ja_getOption('roundaboutColor');
    if (ja_type === ja_routing_type.ROUNDABOUT_EXIT) return ja_getOption('exitInstructionColor');
    if (ja_type === ja_routing_type.OverrideTURN_LEFT || ja_type === ja_routing_type.OverrideTURN_RIGHT) return ja_getOption('turnInstructionColor');
    if (ja_type === ja_routing_type.OverrideBC) return ja_getOption('noInstructionColor');
    if (ja_type === ja_routing_type.OverrideCONTINUE) return ja_getOption('continueInstructionColor');
    if (ja_type === ja_routing_type.OverrideKEEP_LEFT || ja_type === ja_routing_type.OverrideKEEP_RIGHT) return ja_getOption('keepInstructionColor');
    if (ja_type === ja_routing_type.OverrideEXIT || ja_type === ja_routing_type.OverrideEXIT_LEFT || ja_type === ja_routing_type.OverrideEXIT_RIGHT) return ja_getOption('exitInstructionColor');
    if (ja_type === ja_routing_type.OverrideU_TURN) return ja_getOption('uTurnInstructionColor');

    return '#ffcc88'; // default/generic — visible sentinel for unhandled types
  }

  /**
   * Builds the SDK `styleContext` object for the `junction_angles` map layer.
   *
   * Each property is a function that receives an `{feature}` context object and returns the
   * value for the corresponding style attribute at render time.  Because the functions close
   * over `ja_getOption`, changes to color settings take effect immediately on the next redraw
   * without needing to recreate the layer.
   *
   * Style context properties:
   * - `ja_fillColor` — circle background; transparent for `arrow_line` and `roundaboutOverlay`
   * - `ja_fontColor` — auto-contrasted against fill; transparent for non-text features
   * - `ja_strokeColor` — dark green default; salmon for `arrow_line`; orange for Override types
   *                      (Override color applies equally to regular and far-turn Override markers)
   * - `ja_strokeWidth` — thicker border for Override types to aid visual distinction
   * - `ja_graphicName` — 'square' for far-turn markers (JB/Path); 'circle' for regular turns
   * - `ja_strokeOpacity` — semi-transparent for `arrow_line` features
   * - `ja_fillOpacity` — 10 % for `roundaboutOverlay` polygon; 0 for `arrow_line`
   * - `ja_pointRadius` — grows with decimal-count setting; extra width in Simple display mode
   * - `ja_fontSize` — larger for Override types; 0 for non-label features
   * - `ja_label` — the `angle` property string of the feature, or `''`
   *
   * @returns {Object} styleContext object suitable for `sdk.Map.addLayer({ styleContext })`.
   */
  function ja_build_style_context() {
    return {
      ja_fillColor: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        if (!props || props.ja_type === 'arrow_line') return 'transparent';
        if (props.ja_type === 'roundaboutOverlay') return ja_getOption('roundaboutOverlayColor');
        return ja_fill_color_for_type(props.ja_type);
      },
      ja_fontColor: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        if (!props || props.ja_type === 'arrow_line' || props.ja_type === 'roundaboutOverlay') return 'transparent';
        return ja_get_contrast_color(ja_fill_color_for_type(props.ja_type));
      },
      ja_strokeColor: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        if (!props) return '#183800';
        if (props.ja_type === 'arrow_line') return '#ff9966';
        if (props.ja_type === 'roundaboutOverlay') return ja_getOption('roundaboutOverlayColor');
        if (props.ja_type && props.ja_type.indexOf('Override') === 0) return '#F68F23';
        return '#183800';
      },
      ja_strokeWidth: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        if (!props) return 2;
        if (props.ja_type === 'arrow_line') return 1.2;
        if (props.ja_type && props.ja_type.indexOf('Override') === 0) return 5;
        return 2;
      },
      ja_strokeOpacity: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        return props && props.ja_type === 'arrow_line' ? 0.6 : 1;
      },
      ja_fillOpacity: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        if (!props) return 1;
        if (props.ja_type === 'arrow_line') return 0;
        if (props.ja_type === 'roundaboutOverlay') return 0.1;
        return 1;
      },
      ja_pointRadius: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        var baseRadius = parseInt(ja_getOption('pointSize'), 10) + (parseInt(ja_getOption('decimals')) > 0 ? 4 * parseInt(ja_getOption('decimals')) : 0);
        if (!props || props.ja_type === 'arrow_line') return 0;
        // In Simple display mode the arrow sits on the same line as the number.
        // Detect this: label has no newline but contains a non-digit/non-degree char (the arrow).
        var labelStr = props.angle != null ? String(props.angle) : '';
        if (labelStr.indexOf('\n') === -1 && /[^\d°.\s]/.test(labelStr)) {
          baseRadius += 4;
        }
        if (props.ja_type && props.ja_type.indexOf('Override') === 0) return 2 + baseRadius;
        return 3 + baseRadius;
      },
      ja_fontSize: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        if (!props || props.ja_type === 'arrow_line' || props.ja_type === 'roundaboutOverlay') return '0px';
        if (props.ja_type && props.ja_type.indexOf('Override') === 0) {
          return parseInt(ja_getOption('pointSize')) + (ja_getOption('overrideAngles') ? -1 : 8) + 'px';
        }
        return parseInt(ja_getOption('pointSize')) - 1 + 'px';
      },
      ja_label: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        return props && props.angle != null ? String(props.angle) : '';
      },
      ja_graphicName: function (ctx) {
        var props = ctx.feature && ctx.feature.properties;
        // Shape determined by marker type and far-turn breadcrumb role:
        // - Regular turns: always circle
        // - Far-turn intermediate breadcrumbs: circle (ja_is_far_turn=true, ja_is_square_marker=false)
        // - Far-turn final exits: square (ja_is_far_turn=true, ja_is_square_marker=true)
        if (!props || props.ja_type === 'arrow_line' || props.ja_type === 'roundaboutOverlay') {
          return 'circle';
        }
        // If marked as square far-turn marker (final exit), use square; else circle
        return props.ja_is_square_marker ? 'square' : 'circle';
      },
    };
  }

  /**
   * Builds the SDK `styleRules` array for the `junction_angles` map layer.
   *
   * Returns a single catch-all rule that applies the dynamic style context expressions to
   * every feature on the layer.  All visual variation (color, size, label, opacity) is
   * driven by the `styleContext` functions rather than by multiple rules with filter
   * predicates — this keeps the rule list simple and avoids SDK predicate evaluation overhead
   * on every render cycle.
   *
   * @returns {Array<{style: Object}>} styleRules array for `sdk.Map.addLayer({ styleRules })`.
   */
  function ja_build_style_rules() {
    return [
      {
        style: {
          fillColor: '${ja_fillColor}',
          fillOpacity: '${ja_fillOpacity}',
          strokeColor: '${ja_strokeColor}',
          strokeWidth: '${ja_strokeWidth}',
          strokeOpacity: '${ja_strokeOpacity}',
          fontColor: '${ja_fontColor}',
          pointRadius: '${ja_pointRadius}',
          fontSize: '${ja_fontSize}',
          label: '${ja_label}',
          graphicName: '${ja_graphicName}',
          fontWeight: 'bold',
          labelOutlineWidth: 0,
        },
      },
    ];
  }

  /**
   * Returns the localised string for an I18n key in the `ja.*` namespace.
   *
   * If no translation is registered for the current locale, the raw `key` string is returned
   * unchanged.  This mirrors WME's own pattern for graceful degradation when a translation is
   * missing — the key itself is usually a readable English fallback.
   *
   * @param {string} key - I18n key within the `ja` namespace (e.g. `'settingsTitle'`).
   * @returns {string} Translated string, or `key` if no translation exists.
   */
  function ja_getMessage(key) {
    var tr = I18n.translate('ja.' + key),
      no_tr = I18n.missingTranslation('ja.' + key);
    return tr === no_tr ? key : tr;
  }

  /**
   * Registers all supported translations into the WME I18n system under the `ja` namespace.
   *
   * Inspects `I18n.locale` and calls the inner `set_trans(def)` helper to assign the
   * appropriate translation object.  The `default` case installs English, which also serves as
   * the fallback for any unrecognised locale.
   *
   * Called once during `junctionangle_init` and again whenever a `wme-user-settings-changed`
   * event fires (e.g. when the user switches WME's interface language at runtime).
   *
   * Supported locales: `cs`, `fi`, `pl`, `ru`, `sv`, `fr`, `es-419`, `uk`, and English default.
   */
  function ja_loadTranslations() {
    /**
     * Registers a translation definition object under `I18n.translations[locale].ja`.
     *
     * The assignment expression is intentional — it both stores the object and returns it
     * (the `jshint -W093` directive suppresses the "assignment in return" lint warning).
     *
     * @param {Object} def - Key/value map of i18n strings for the `ja` namespace.
     * @returns {Object} The same `def` object that was just stored.
     */
    var set_trans = function (def) {
      /*jshint -W093*/
      return (I18n.translations[I18n.locale].ja = def);
    };

    ja_log('Loading translations', 2);

    //Apply
    switch (I18n.locale) {
      default:
        //Default language (English)
        set_trans({
          name: 'Junction Angle Info',
          settingsTitle: 'Junction Angle Info settings',
          resetToDefault: 'Reset to default',
          aAbsolute: 'Absolute',
          aDeparture: 'Departure',
          angleMode: 'Angle mode',
          angleDisplay: 'Angle display style',
          angleDisplayArrows: 'Direction arrows',
          displayFancy: 'Fancy',
          displaySimple: 'Simple',
          override: 'Check "override instruction"',
          overrideAngles: 'Show angles of "override instruction"',
          guess: 'Estimate routing instructions',
          noInstructionColor: 'Best continuation',
          continueInstructionColor: 'Continue straight',
          keepInstructionColor: 'Keep',
          exitInstructionColor: 'Exit',
          turnInstructionColor: 'Turn',
          uTurnInstructionColor: 'U-turn',
          noTurnColor: 'Disallowed turn',
          problemColor: 'Angle to avoid',
          roundaboutColor: 'Non-Normal Exit',
          roundaboutOverlayColor: 'Overlay',
          roundaboutOverlayDisplay: 'Show roundabout',
          rOverNever: 'Never',
          rOverSelected: 'When selected',
          rOverAlways: 'Always',
          uTurnIncludeStreet: 'Include Street Type',
          uTurnIncludeParkingLot: 'Include Parking Lot roads',
          uTurnIncludePrivateRoad: 'Include Private roads',
          wazeDoubleUTurnRestriction: 'Disable for <15m and ±5° parallel',
          enableFarTurnJB: 'Enable JAI for Junction Boxes',
          enableFarTurnPath: 'Enable JAI for Paths',
          decimals: 'Number of decimals',
          pointSize: 'Base point size',
          settingsguide: 'Settings & User Guide',
          roundaboutnav: 'WIKI: Roundabouts',
          ghissues: 'JAI issue tracker',
        });
        break;

      //Czech (čeština)
      case 'cs':
        set_trans({
          name: 'Junction Angle Info',
          settingsTitle: 'Nastavení JAI',
          resetToDefault: 'Výchozí nastavení',
          aAbsolute: 'Absolutní',
          aDeparture: 'Odjezdový',
          angleMode: 'Styl zobrazení úhlů',
          angleDisplay: 'Styl výpisu úhlů',
          angleDisplayArrows: 'Směrové šipky',
          displayFancy: 'Zdobný',
          displaySimple: 'Jednoduchý',
          override: 'Zvýraznit vynucené hlasové pokyny',
          overrideAngles: 'Zobrazit úhly vynucených pokynů',
          guess: 'Odhadovat navigační hlášky',
          noInstructionColor: 'Bez hlášení',
          continueInstructionColor: 'Rovně',
          keepInstructionColor: 'Držte se',
          exitInstructionColor: 'Sjeďte',
          turnInstructionColor: 'Odbočte',
          uTurnInstructionColor: 'Otočte se',
          noTurnColor: 'Nepovolené směry',
          problemColor: 'Nejasné úhly',
          roundaboutColor: 'Rozbité kruháče',
          roundaboutOverlayColor: 'Kruháče',
          roundaboutOverlayDisplay: 'ukazovat kruháče',
          rOverNever: 'Ne-',
          rOverSelected: 'Při výběru',
          rOverAlways: 'Vždy',
          uTurnIncludeStreet: 'Zahrnout ulice',
          uTurnIncludeParkingLot: 'Zahrnout parkoviště',
          uTurnIncludePrivateRoad: 'Zahrnout soukromé cesty',
          wazeDoubleUTurnRestriction: 'Zakázat pro <15m a ±5° paralelně',
          enableFarTurnJB: 'Povolit JAI pro silniční křižovatky',
          enableFarTurnPath: 'Povolit JAI pro cesty',
          decimals: 'Počet des. míst',
          pointSize: 'Velikost písma',
          settingsguide: 'Nastavení a Uživatelská příručka',
          roundaboutnav: 'US WIKI: Kruhové objezdy',
          ghissues: 'Hlášení problémů JAI',
        });
        break;

      //Finnish (Suomen kieli)
      case 'fi':
        set_trans({
          name: 'Risteyskulmat',
          settingsTitle: 'Rysteyskulmien asetukset',
          resetToDefault: 'Palauta',
          aAbsolute: 'Absoluuttinen',
          aDeparture: 'Käännös',
          angleMode: 'Kulmien näyttö',
          angleDisplay: 'Näyttötyyli',
          angleDisplayArrows: 'Suuntanuolet',
          displayFancy: 'Nätti',
          displaySimple: 'Yksinkertainen',
          override: 'Check "override instruction"',
          overrideAngles: 'Show angles of "override instruction"',
          guess: 'Arvioi reititysohjeet',
          noInstructionColor: 'ohjeeton "Suora"-väri',
          continueInstructionColor: 'Continue straight',
          keepInstructionColor: '"Pysy vasemmalla/oikealla"-ohjeen väri',
          exitInstructionColor: '"Poistu"-ohjeen väri',
          turnInstructionColor: '"Käänny"-ohjeen väri',
          uTurnInstructionColor: '"Käänny ympäri"-ohjeen väri',
          noTurnColor: 'Kielletyn käännöksen väri',
          problemColor: 'Vältettävien kulmien väri',
          roundaboutColor: 'Liikenneympyrän (jolla ei-suoria kulmia) ohjeen väri',
          roundaboutOverlayColor: 'Liikenneympyrän korostusväri',
          roundaboutOverlayDisplay: 'Korosta liikenneympyrä',
          rOverNever: 'Ei ikinä',
          rOverSelected: 'Kun valittu',
          rOverAlways: 'Aina',
          uTurnIncludeStreet: 'Sisällytä kadut',
          uTurnIncludeParkingLot: 'Sisällytä parkkialueen tiet',
          uTurnIncludePrivateRoad: 'Sisällytä yksityistiet',
          wazeDoubleUTurnRestriction: 'Poista käytöstä <15m ja ±5° rinnakkaisille',
          enableFarTurnJB: 'Ota JAI käyttöön risteyksissä',
          enableFarTurnPath: 'Ota JAI käyttöön poluilla',
          decimals: 'Desimaalien määrä',
          pointSize: 'Ympyrän peruskoko',
        });
        break;

      //Polish (język polski)
      case 'pl':
        set_trans({
          settingsTitle: 'Ustawienia',
          resetToDefault: 'Przywróć domyślne',
          aAbsolute: 'Absolutne',
          aDeparture: 'Rozjazdy',
          angleMode: 'Tryb wyświetlania kątów',
          angleDisplay: 'Styl kierunków',
          displayFancy: 'Dwuliniowy',
          displaySimple: 'Prosty',
          angleDisplayArrows: 'Strzałki kierunków',
          override: 'Check "override instruction"',
          overrideAngles: 'Show angles of "override instruction"',
          guess: 'Szacuj komunikaty trasy',
          noInstructionColor: 'Kolor najlepszej kontynuacji',
          continueInstructionColor: 'Continue straight',
          keepInstructionColor: 'Kolor dla "kieruj się"',
          exitInstructionColor: 'Kolor dla "zjedź"',
          turnInstructionColor: 'Kolor dla "skręć"',
          uTurnInstructionColor: 'Kolor dla "zawróć"',
          noTurnColor: 'Kolor niedozwolonych manewrów',
          problemColor: 'Kolor problematycznych kątów',
          roundaboutColor: 'Kolor rond niestandardowych',
          roundaboutOverlayColor: 'Kolor znacznika rond',
          roundaboutOverlayDisplay: 'Pokazuj ronda',
          rOverNever: 'Nigdy',
          rOverSelected: 'Gdy zaznaczone',
          rOverAlways: 'Zawsze',
          uTurnIncludeStreet: 'Uwzględnij ulice',
          uTurnIncludeParkingLot: 'Uwzględnij drogi parkingowe',
          uTurnIncludePrivateRoad: 'Uwzględnij drogi prywatne',
          wazeDoubleUTurnRestriction: 'Wyłącz dla <15m i ±5° równoległy',
          enableFarTurnJB: 'Włącz JAI dla skrzyżowań',
          enableFarTurnPath: 'Włącz JAI dla ścieżek',
          decimals: 'Ilość cyfr po przecinku',
          pointSize: 'Rozmiar punktów pomiaru',
        });
        break;

      //Russian (русский)
      case 'ru':
        set_trans({
          name: 'Углы поворотов',
          settingsTitle: 'Настройки Junction Angle Info',
          resetToDefault: 'Сбросить настройки',
          aAbsolute: 'Абсолютные',
          aDeparture: 'Повороты',
          angleMode: '- режим углов',
          angleDisplay: '- стиль отображения',
          angleDisplayArrows: '- стрелки направлений',
          displayFancy: 'Модный',
          displaySimple: 'Простой',
          override: 'Визуализировать изменённые подсказки',
          overrideAngles: 'Показывать углы изменённых подсказок',
          guess: 'Ожидаемые подсказки',
          noInstructionColor: 'Нет подсказки',
          continueInstructionColor: 'Прямо',
          keepInstructionColor: 'Держитесь',
          exitInstructionColor: 'Съезд',
          turnInstructionColor: 'Поверните',
          uTurnInstructionColor: 'Развернитесь',
          noTurnColor: 'Запрещённый манёвр',
          problemColor: 'Избегать',
          roundaboutColor: 'Некорректный выезд',
          roundaboutOverlayColor: 'Кольцо',
          roundaboutOverlayDisplay: '- показ колец',
          rOverNever: 'Никогда',
          rOverSelected: 'Если выбрано',
          rOverAlways: 'Всегда',
          uTurnIncludeStreet: '- включить улицы',
          uTurnIncludeParkingLot: '- включить парковки',
          uTurnIncludePrivateRoad: '- включить частные дороги',
          wazeDoubleUTurnRestriction: 'Отключить для <16м и ±5° параллель',
          enableFarTurnJB: 'Включить JAI для перекрёстков',
          enableFarTurnPath: 'Включить JAI для путей',
          decimals: '- знаков после запятой',
          pointSize: '- размер кружка',
          settingsguide: 'Настройки и руководство пользователя',
          roundaboutnav: 'Вики: круговые перекрестки',
          ghissues: 'Сообщить об ошибке',
        });
        break;

      //Swedish (svenska)
      case 'sv':
        set_trans({
          name: 'Korsningsvinklar',
          settingsTitle: 'Inställningar för korsningsvinklar',
          resetToDefault: 'Återställ',
          aAbsolute: 'Absolut',
          aDeparture: 'Sväng',
          angleMode: 'Vinkelvisning',
          angleDisplay: 'Vinkelstil',
          angleDisplayArrows: 'Riktningspilar',
          displayFancy: 'Grafisk',
          displaySimple: 'Simpel',
          override: 'Check "override instruction"',
          overrideAngles: 'Show angles of "override instruction"',
          guess: 'Gissa navigeringsinstruktioner',
          noInstructionColor: 'Färg för "ingen instruktion"',
          continueInstructionColor: 'Continue straight',
          keepInstructionColor: 'Färg för "håll höger/vänster"-instruktion',
          exitInstructionColor: 'Färg för "ta av"-instruktion',
          turnInstructionColor: 'Färg för "sväng"-instruktion',
          uTurnInstructionColor: 'Färg för "U-sväng"-instruktion',
          noTurnColor: 'Färg förbjuden sväng',
          problemColor: 'Färg för vinklar att undvika',
          roundaboutColor: 'Färg för rondell (med icke-räta vinklar)',
          roundaboutOverlayColor: 'Färg för rondellcirkel',
          roundaboutOverlayDisplay: 'Visa cirkel på rondell',
          rOverNever: 'Aldrig',
          rOverSelected: 'När vald',
          rOverAlways: 'Alltid',
          uTurnIncludeStreet: 'Inkludera gator',
          uTurnIncludeParkingLot: 'Inkludera parkeringsvägar',
          uTurnIncludePrivateRoad: 'Inkludera enskilda vägar',
          wazeDoubleUTurnRestriction: 'Inaktivera för <15m och ±5° parallell',
          enableFarTurnJB: 'Aktivera JAI för korsningar',
          enableFarTurnPath: 'Aktivera JAI för vägar',
          decimals: 'Decimaler',
          pointSize: 'Cirkelns basstorlek',
        });
        break;

      //French (Francais)
      case 'fr':
        set_trans({
          name: 'Junction Angle Info',
          settingsTitle: 'Paramètres de Junction Angle Info',
          angleMode: 'Mode Angle',
          aAbsolute: 'Absolu',
          aDeparture: 'Départ',
          angleDisplay: "Style d'affichage d'Angles",
          angleDisplayArrows: 'Flèches de Direction',
          displayFancy: 'Fancy',
          displaySimple: 'Simple',
          override: 'Contrôler les "overrides instruction"',
          overrideAngles: 'Afficher les angles des "overrides" actives',
          guess: 'Estimer les instructions routage',
          noInstructionColor: 'Sans instruction',
          continueInstructionColor: 'Tout droit',
          keepInstructionColor: 'Serrez',
          exitInstructionColor: 'Sortez',
          turnInstructionColor: 'Tournez',
          uTurnInstructionColor: 'Demi-tour',
          noTurnColor: 'Virage interdit',
          problemColor: 'Angle à éviter',
          roundaboutOverlayDisplay: 'Surligner les rond-point',
          rOverNever: 'Jamais',
          rOverSelected: 'Sélectionné',
          rOverAlways: 'Toujours',
          roundaboutOverlayColor: 'Surlignage',
          roundaboutColor: 'Sortie anormale',
          uTurnIncludeStreet: 'Inclure les rues',
          uTurnIncludeParkingLot: 'Inclure les voies de parking',
          uTurnIncludePrivateRoad: 'Inclure les voies privées',
          wazeDoubleUTurnRestriction: 'Désactiver pour <15m et ±5° parallèle',
          enableFarTurnJB: 'Activer JAI pour les carrefours',
          enableFarTurnPath: 'Activer JAI pour les chemins',
          decimals: 'Nombre de decimales',
          pointSize: 'Taille des bulles',
          resetToDefault: 'Réinitialiser par défaut',
          settingsguide: 'Paramètres et Guide utilisateur',
          roundaboutnav: 'WIKI: Rond-point (en)',
          ghissues: 'JAI Reporter un problème',
        });
        break;
      //Latin-American Spanish (español latinoamericano)
      case 'es-419':
        set_trans({
          name: 'Información en Ángulos de Intersección (JAI)',
          settingsTitle: 'Configuración de Información en Ángulos',
          resetToDefault: 'Limpiar configuración',
          aAbsolute: 'Absoluto',
          aDeparture: 'Salida',
          angleMode: 'Modo de ángulos',
          angleDisplay: 'Estilo para mostrar',
          angleDisplayArrows: 'Flechas de dirección',
          displayFancy: 'Lujoso',
          displaySimple: 'Simple',
          override: 'Revisar "instrucciones forzadas"',
          overrideAngles: 'Ver ángulos en "instrucciones forzadas"',
          guess: 'Estimar instrucciones de giro',
          noInstructionColor: 'Sin instrucción',
          continueInstructionColor: '"Sigue derecho"',
          keepInstructionColor: '"Mantente"',
          exitInstructionColor: '"Sale"',
          turnInstructionColor: '"Gira"',
          uTurnInstructionColor: '"Gira en U"',
          noTurnColor: 'Giros deshabilitados',
          problemColor: 'Ángulos a evitar',
          roundaboutColor: 'Rotondas anormales',
          roundaboutOverlayColor: 'Rotondas',
          roundaboutOverlayDisplay: 'Mostrar rotondas',
          rOverNever: 'Nunca',
          rOverSelected: 'Seleccionadas',
          rOverAlways: 'Siempre',
          uTurnIncludeStreet: 'Incluir calles',
          uTurnIncludeParkingLot: 'Incluir vías de estacionamiento',
          uTurnIncludePrivateRoad: 'Incluir caminos privados',
          wazeDoubleUTurnRestriction: 'Desactivar para <15m y ±5° paralelo',
          enableFarTurnJB: 'Habilitar JAI para intersecciones',
          enableFarTurnPath: 'Habilitar JAI para caminos',
          decimals: 'Decimales',
          pointSize: 'Tamaño del texto',
          settingsguide: 'Configuración y Guía del usuario',
          roundaboutnav: 'WIKI: Rotondas',
          ghissues: 'Seguimiento de problemas',
        });
        break;
      //Ukrainian (український)
      case 'uk':
        set_trans({
          name: 'Junction Angle Info',
          settingsTitle: 'Налаштування Junction Angle Info',
          resetToDefault: 'Скинути налаштування',
          aAbsolute: 'Абсолютні',
          aDeparture: 'Повороти',
          angleMode: '- режим кутів',
          angleDisplay: '- стиль відображення',
          angleDisplayArrows: '- стрілки напрямків',
          displayFancy: 'Модний',
          displaySimple: 'Простий',
          override: 'Візуалізувати "змінені підказки"',
          overrideAngles: 'Показувати кути для "змінених підказок"',
          guess: 'Очікувані підказки:',
          noInstructionColor: 'Немає підказки',
          continueInstructionColor: 'Прямо',
          keepInstructionColor: 'Тримайтеся',
          exitInstructionColor: "З'їзд",
          turnInstructionColor: 'Поверніть',
          uTurnInstructionColor: 'Розверніться',
          noTurnColor: 'Заборонений маневр',
          problemColor: 'Уникати',
          roundaboutColor: 'Некоректний виїзд',
          roundaboutOverlayColor: 'Кільце',
          roundaboutOverlayDisplay: '- показ кілець',
          rOverNever: 'Ніколи',
          rOverSelected: 'Якщо вибрано',
          rOverAlways: 'Завжди',
          uTurnIncludeStreet: '- включати вулиці',
          uTurnIncludeParkingLot: '- включати парковки',
          uTurnIncludePrivateRoad: '- включати приватні дороги',
          wazeDoubleUTurnRestriction: 'Вимкнути для <15м і ±5° паралельно',
          enableFarTurnJB: 'Увімкнути JAI для перехресть',
          enableFarTurnPath: 'Увімкнути JAI для шляхів',
          decimals: '- знаків після коми',
          pointSize: '- розмір шрифту',
          settingsguide: 'Налаштування та посібник користувача',
          roundaboutnav: 'WIKI: кругові перехрестя(en)',
          ghissues: 'JAI - Повідомити про помилку',
        });
        break;
    }
  }

  /*
   * Bootstrapping and logging
   */

  /**
   * Displays the WazeWrap "script updated" notification banner when the script version changes.
   *
   * Compares `SCRIPT_VERSION` against the `lastVersion` value stored in `ja_options`.  If they
   * differ (and `SHOW_UPDATE_MESSAGE` is true) it calls `WazeWrap.Interface.ShowScriptUpdate`
   * with the current release notes built from `SCRIPT_VERSION_CHANGES`, then updates
   * `ja_options['lastVersion']` and persists it to `localStorage` so the banner is not shown
   * again on the next page load.
   *
   * Note: `lastVersion` is stored directly in `ja_options` and must never be accessed via
   * `ja_getOption`/`ja_setOption` because it is not declared in the `ja_settings` schema.
   */
  function showScriptInfoAlert() {
    /* Check version and alert on update */
    if (SHOW_UPDATE_MESSAGE && SCRIPT_VERSION !== ja_options['lastVersion']) {
      let releaseNotes = '';
      releaseNotes += "<p>What's New:</p>";
      if (SCRIPT_VERSION_CHANGES.length > 0) {
        releaseNotes += '<ul>';
        for (let idx = 0; idx < SCRIPT_VERSION_CHANGES.length; idx++) releaseNotes += `<li>${SCRIPT_VERSION_CHANGES[idx]}`;
        releaseNotes += '</ul>';
      } else {
        releaseNotes += '<ul><li>Nothing major.</ul>';
      }
      WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, SCRIPT_VERSION, releaseNotes, DOWNLOAD_URL);
      ja_options['lastVersion'] = SCRIPT_VERSION;
      if (localStorage) {
        localStorage.setItem('wme_ja_options', JSON.stringify(ja_options));
      }
    }
  }

  /**
   * Conditional console logger gated by `junctionangle_debug`.
   *
   * Messages are only printed when `ja_log_level <= junctionangle_debug`, so verbosity can be
   * tuned without touching call sites:
   * - Level 0 — silent
   * - Level 1 — important warnings / start-up messages (default release setting)
   * - Level 2 — setting changes, calculation entry/exit
   * - Level 3 — per-segment / per-node detail
   * - Level 4 — insane (angle math step-by-step)
   *
   * Object arguments are passed directly to `console.log` (no string coercion) so the browser
   * DevTools inspector can expand them interactively.
   *
   * @param {*} ja_log_msg - Message string or object to log.
   * @param {number} [ja_log_level=1] - Minimum debug level required to print this message.
   */
  function ja_log(ja_log_msg, ja_log_level) {
    if (typeof ja_log_level === 'undefined') {
      ja_log_level = 1;
    }
    if (ja_log_level <= junctionangle_debug) {
      if (typeof ja_log_msg === 'object') {
        console.log(ja_log_msg);
      } else {
        console.log('WME JAI: ' + ja_log_msg);
      }
    }
  }

  sdk = await bootstrap(
    /** @type {BootstrapArgs} */ ({
      scriptUpdateMonitor: { downloadUrl: DOWNLOAD_URL },
    }),
  );

  /**
   * Renders (or re-renders) the entire JAI settings panel inside the SDK sidebar tab pane.
   *
   * Clears `jaTabPane` and rebuilds its contents from scratch — safe to call more than once
   * (e.g. on `wme-user-settings-changed`) to pick up a new locale without stale DOM nodes.
   *
   * Structure: scoped `<style>`, a script header, four setting cards (Display, Routing
   * instructions, Instruction colors, Roundabout), and a footer with a Reset button and links.
   * CSS is scoped to `.wme-ja-panel` (added to `jaTabPane` by `junctionangle_init`).
   * Checkboxes use custom toggle-switch markup; all element IDs are unchanged from `ja_settings`
   * so `ja_save`, `ja_apply`, and `ja_onchange` work without modification.
   *
   * @param {HTMLElement} jaTabPane - The SDK sidebar tab pane element returned by
   *   `sdk.Sidebar.registerScriptTab()`.
   */
  function setupHtml(jaTabPane) {
    jaTabPane.innerHTML = '';
    ja_log('---------- Creating settings HTML ----------', 2);

    // ── CSS (scoped to .wme-ja-panel) ─────────────────────────────────
    var style = document.createElement('style');
    style.textContent = [
      '.wme-ja-panel { padding: 8px; box-sizing: border-box; }',
      '.wme-ja-panel .ja-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px 10px; background: linear-gradient(135deg, #0066cc, #0052a3); color: #fff; border-radius: 8px; }',
      '.wme-ja-panel .ja-header-left { display: flex; align-items: center; gap: 6px; }',
      '.wme-ja-panel .ja-header-icon { color: #fff; font-size: 1.2em; }',
      '.wme-ja-panel .ja-header-name { font-weight: 700; font-size: 13px; color: #fff; }',
      '.wme-ja-panel .ja-header-version { font-size: 10px; opacity: 0.8; color: #fff; }',
      '.wme-ja-panel .ja-card { border: 1px solid var(--hairline, #ddd); border-radius: 8px; margin-bottom: 8px; overflow: hidden; }',
      '.wme-ja-panel .ja-card-header { display: flex; align-items: center; gap: 7px; padding: 7px 10px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid var(--hairline, #ddd); background: linear-gradient(135deg, #f8f9fa, #f0f1f3); color: #333; }',
      '.wme-ja-panel .ja-card-header:hover { background: linear-gradient(135deg, #f0f1f3, #e8eaed); }',
      '.wme-ja-panel .ja-card-header i { color: #0066cc; font-size: 11px; width: 14px; text-align: center; }',
      '.wme-ja-panel .ja-card-body { padding: 2px 0; }',
      '.wme-ja-panel .ja-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; min-height: 32px; box-sizing: border-box; }',
      '.wme-ja-panel .ja-sub-row { padding-left: 22px; }',
      '.wme-ja-panel .ja-sub-sub-row { padding-left: 34px; }',
      '.wme-ja-panel .ja-row-label { flex: 1; font-size: 12px; padding-right: 8px; line-height: 1.3; }',
      '.wme-ja-panel .ja-row.disabled { opacity: 0.4; pointer-events: none; }',
      '.wme-ja-panel select { font-size: 12px; border: 1px solid var(--hairline, #ccc); border-radius: 4px; padding: 3px 5px; width: 130px; max-width: 130px; box-sizing: border-box; background: var(--background_default, #fff); color: var(--content_default, #333); }',
      '.wme-ja-panel input[type="number"] { font-size: 12px; border: 1px solid var(--hairline, #ccc); border-radius: 4px; padding: 3px 5px; width: 52px; text-align: right; box-sizing: border-box; background: var(--background_default, #fff); color: var(--content_default, #333); }',
      '.wme-ja-panel input[type="color"] { width: 30px; height: 22px; padding: 1px 2px; border: 1px solid var(--hairline, #ccc); border-radius: 3px; cursor: pointer; flex-shrink: 0; }',
      '@supports (-webkit-appearance:none) { .wme-ja-panel input[type="color"] { padding: 0 2px; } }',
      '.wme-ja-panel .ja-toggle { position: relative; display: inline-block; width: 34px; height: 18px; flex-shrink: 0; }',
      '.wme-ja-panel .ja-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }',
      '.wme-ja-panel .ja-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border-radius: 18px; transition: background-color 0.2s; }',
      '.wme-ja-panel .ja-toggle-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: transform 0.2s; }',
      '.wme-ja-panel .ja-toggle input:checked + .ja-toggle-slider { background-color: #00bd00; }',
      '.wme-ja-panel .ja-toggle input:checked + .ja-toggle-slider:before { transform: translateX(16px); }',
      '.wme-ja-panel .ja-colors-grid { display: grid; grid-template-columns: 1fr 1fr; }',
      '.wme-ja-panel .ja-colors-grid .ja-row { padding: 4px 8px; }',
      '.wme-ja-panel .ja-colors-grid .ja-row-label { font-size: 11px; }',
      '.wme-ja-panel .ja-footer { margin-top: 4px; }',
      '.wme-ja-panel .ja-footer .btn { width: 100%; margin-bottom: 6px; font-size: 12px; }',
      '.wme-ja-panel .ja-footer ul { margin: 0; padding: 0; font-size: 11px; }',
      '.wme-ja-panel .ja-footer ul li { margin-bottom: 2px; }',
      '.wme-ja-panel .ja-footer ul li a { opacity: 0.7; }',
      '.wme-ja-panel .ja-footer ul li a:hover { opacity: 1; }',
      '[wz-theme="dark"] .wme-ja-panel .ja-header { background: linear-gradient(135deg, #0052a3, #003d7a); }',
      '[wz-theme="dark"] .wme-ja-panel .ja-card-header { background: linear-gradient(135deg, #2a2c30, #202124); color: #e8eaed; }',
      '[wz-theme="dark"] .wme-ja-panel .ja-card-header:hover { background: linear-gradient(135deg, #333538, #2a2c30); }',
      '[wz-theme="dark"] .wme-ja-panel .ja-card-header i { color: #33ccff; }',
    ].join('\n');
    jaTabPane.appendChild(style);

    // ── Inner helpers ─────────────────────────────────────────────────

    /** Creates a card div with an icon header and returns { card, body }. */
    function makeCard(iconClass, title) {
      var card = document.createElement('div');
      card.className = 'ja-card';
      var cardHeader = document.createElement('div');
      cardHeader.className = 'ja-card-header';
      var icon = document.createElement('i');
      icon.className = 'fa ' + iconClass;
      var titleSpan = document.createElement('span');
      titleSpan.textContent = title;
      cardHeader.appendChild(icon);
      cardHeader.appendChild(titleSpan);
      card.appendChild(cardHeader);
      var body = document.createElement('div');
      body.className = 'ja-card-body';
      card.appendChild(body);
      return { card: card, body: body };
    }

    /** Creates a flex row with a label and a trailing control element. */
    function makeRow(labelText, control, extraClass) {
      var row = document.createElement('div');
      row.className = 'ja-row' + (extraClass ? ' ' + extraClass : '');
      var labelEl = document.createElement('span');
      labelEl.className = 'ja-row-label';
      labelEl.textContent = labelText;
      row.appendChild(labelEl);
      row.appendChild(control);
      return row;
    }

    /** Creates a <select> wired to ja_onchange for the given settings key. */
    function makeSelect(settingKey) {
      var setting = ja_settings[settingKey];
      var select = document.createElement('select');
      select.id = setting.elementId;
      for (var i = 0; i < setting.options.length; i++) {
        var opt = document.createElement('option');
        opt.value = setting.options[i];
        opt.textContent = ja_getMessage(setting.options[i]);
        select.appendChild(opt);
      }
      select.onchange = function () {
        ja_onchange(this);
      };
      return select;
    }

    /** Creates a toggle-switch <label> wrapping a checkbox for the given settings key. */
    function makeToggle(settingKey) {
      var setting = ja_settings[settingKey];
      var toggleLabel = document.createElement('label');
      toggleLabel.className = 'ja-toggle';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.id = setting.elementId;
      input.onchange = function () {
        ja_onchange(this);
      };
      var slider = document.createElement('span');
      slider.className = 'ja-toggle-slider';
      toggleLabel.appendChild(input);
      toggleLabel.appendChild(slider);
      return toggleLabel;
    }

    /** Creates a number <input> wired to ja_onchange for the given settings key. */
    function makeNumber(settingKey) {
      var setting = ja_settings[settingKey];
      var input = document.createElement('input');
      input.type = 'number';
      input.id = setting.elementId;
      input.min = setting.min;
      input.max = setting.max;
      input.onchange = function () {
        ja_onchange(this);
      };
      return input;
    }

    /** Creates a color <input> wired to ja_onchange for the given settings key. */
    function makeColor(settingKey) {
      var setting = ja_settings[settingKey];
      var input = document.createElement('input');
      input.type = 'color';
      input.id = setting.elementId;
      input.onchange = function () {
        ja_onchange(this);
      };
      return input;
    }

    // ── Script header ──────────────────────────────────────────────────
    var header = document.createElement('div');
    header.className = 'ja-header';
    var headerLeft = document.createElement('div');
    headerLeft.className = 'ja-header-left';
    var headerIcon = document.createElement('i');
    headerIcon.className = 'fa fa-code-fork ja-header-icon';
    var headerName = document.createElement('span');
    headerName.className = 'ja-header-name';
    headerName.textContent = ja_getMessage('name');
    headerLeft.appendChild(headerIcon);
    headerLeft.appendChild(headerName);
    var headerVersion = document.createElement('span');
    headerVersion.className = 'ja-header-version';
    headerVersion.textContent = 'v' + SCRIPT_VERSION;
    header.appendChild(headerLeft);
    header.appendChild(headerVersion);
    jaTabPane.appendChild(header);

    // ── Display card ───────────────────────────────────────────────────
    var displayCard = makeCard('fa-cog', 'Display');
    displayCard.body.appendChild(makeRow(ja_getMessage('angleMode'), makeSelect('angleMode')));
    displayCard.body.appendChild(makeRow(ja_getMessage('angleDisplay'), makeSelect('angleDisplay')));
    displayCard.body.appendChild(makeRow(ja_getMessage('angleDisplayArrows'), makeSelect('angleDisplayArrows')));
    displayCard.body.appendChild(makeRow(ja_getMessage('decimals'), makeNumber('decimals')));
    displayCard.body.appendChild(makeRow(ja_getMessage('pointSize'), makeNumber('pointSize')));
    jaTabPane.appendChild(displayCard.card);

    // ── Routing instructions card ──────────────────────────────────────
    var routingCard = makeCard('fa-road', 'Routing instructions');
    routingCard.body.appendChild(makeRow(ja_getMessage('guess'), makeToggle('guess')));
    routingCard.body.appendChild(makeRow(ja_getMessage('override'), makeToggle('override'), 'ja-sub-row'));
    routingCard.body.appendChild(makeRow(ja_getMessage('overrideAngles'), makeToggle('overrideAngles'), 'ja-sub-row ja-sub-sub-row'));
    jaTabPane.appendChild(routingCard.card);

    // ── Instruction colors card ────────────────────────────────────────
    var colorsCard = makeCard('fa-paint-brush', 'Instruction colors');
    colorsCard.body.className += ' ja-colors-grid';
    ['noInstructionColor', 'continueInstructionColor', 'keepInstructionColor', 'exitInstructionColor', 'turnInstructionColor', 'uTurnInstructionColor', 'noTurnColor', 'problemColor'].forEach(
      function (key) {
        colorsCard.body.appendChild(makeRow(ja_getMessage(key), makeColor(key)));
      },
    );
    jaTabPane.appendChild(colorsCard.card);

    // ── Roundabout card ────────────────────────────────────────────────
    var roundaboutCard = makeCard('fa-circle-o', 'Roundabout');
    roundaboutCard.body.appendChild(makeRow(ja_getMessage('roundaboutOverlayDisplay'), makeSelect('roundaboutOverlayDisplay')));
    roundaboutCard.body.appendChild(makeRow(ja_getMessage('roundaboutOverlayColor'), makeColor('roundaboutOverlayColor'), 'ja-sub-row'));
    roundaboutCard.body.appendChild(makeRow(ja_getMessage('roundaboutColor'), makeColor('roundaboutColor'), 'ja-sub-row'));
    jaTabPane.appendChild(roundaboutCard.card);

    // ── U-Turn detection card ──────────────────────────────────────────
    var uturnsCard = makeCard('fa-undo', 'U-Turn detection road types');
    uturnsCard.body.appendChild(makeRow(ja_getMessage('uTurnIncludeStreet'), makeToggle('uTurnIncludeStreet')));
    uturnsCard.body.appendChild(makeRow(ja_getMessage('uTurnIncludeParkingLot'), makeToggle('uTurnIncludeParkingLot')));
    uturnsCard.body.appendChild(makeRow(ja_getMessage('uTurnIncludePrivateRoad'), makeToggle('uTurnIncludePrivateRoad')));
    uturnsCard.body.appendChild(makeRow(ja_getMessage('wazeDoubleUTurnRestriction'), makeToggle('wazeDoubleUTurnRestriction')));
    jaTabPane.appendChild(uturnsCard.card);

    // ── Experimental card ──────────────────────────────────────────────
    var experimentalCard = makeCard('fa-flask', 'Experimental');
    experimentalCard.body.appendChild(makeRow(ja_getMessage('enableFarTurnJB'), makeToggle('enableFarTurnJB')));
    experimentalCard.body.appendChild(makeRow(ja_getMessage('enableFarTurnPath'), makeToggle('enableFarTurnPath')));
    jaTabPane.appendChild(experimentalCard.card);

    // ── Footer: reset button + info links ──────────────────────────────
    var footer = document.createElement('div');
    footer.className = 'ja-footer';

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-default';
    resetBtn.addEventListener('click', ja_reset, true);
    resetBtn.textContent = ja_getMessage('resetToDefault');
    footer.appendChild(resetBtn);

    var infoList = document.createElement('ul');
    infoList.className = 'list-unstyled';
    infoList.appendChild(ja_helpLink('https://github.com/WazeDev/WME-JAI/blob/development/USER-SETTINGS.md', 'settingsguide'));
    infoList.appendChild(ja_helpLink('https://www.waze.com/discuss/t/roundabout/377970', 'roundaboutnav'));
    infoList.appendChild(ja_helpLink('https://www.waze.com/discuss/t/script-wme-junction-angle-info/52238', 'ghissues'));
    footer.appendChild(infoList);

    jaTabPane.appendChild(footer);
  }

  /**
   * Entry point called once after the WME SDK bootstrap resolves.
   *
   * Responsibilities (in order):
   * 1. **Event registration** — wires SDK events for selection changes, segment/node data model
   *    changes, map zoom/move, and user settings changes to their respective handlers.
   * 2. **Settings & translations** — calls `ja_load()` to restore saved options from
   *    `localStorage`, `ja_loadTranslations()` to install the i18n strings, and
   *    `showScriptInfoAlert()` to display a WazeWrap update banner if the version changed.
   * 3. **Map layer** — creates the `junction_angles` SDK layer with the style context and rules
   *    built by `ja_build_style_context()` / `ja_build_style_rules()`, then sets
   *    `ja_layer_created = true` so `ja_apply()` can proceed.
   * 4. **Sidebar** — registers the script tab with the SDK, injects the power button into the
   *    tab label, sets up `setupHtml()`, and binds `ja_setLayerEnabled()` to both the Map
   *    Layers checkbox event and the power button click.
   * 5. **Initial render** — calls `ja_apply()` and `ja_calculate()` to populate controls and
   *    draw angle markers for whatever is currently selected in WME.
   */
  async function junctionangle_init() {
    // ── Event registration ────────────────────────────────────────────
    sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: testSelectedItem });

    sdk.Events.trackDataModelEvents({ dataModelName: 'segments' });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-changed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'segments' && hasSelection()) {
          ja_calculate();
        }
      },
    });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-removed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'segments' && hasSelection()) {
          ja_calculate();
        }
      },
    });

    sdk.Events.trackDataModelEvents({ dataModelName: 'nodes' });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-changed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'nodes' && hasSelection()) {
          ja_calculate();
        }
      },
    });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-removed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'nodes' && hasSelection()) {
          ja_calculate();
        }
      },
    });

    // ── BigJunction (Junction Box) change tracking (experimental) ─────────
    // Junction Box data lives in the BigJunctions data model, separate from segments
    // and nodes. Without this tracking, adding, editing, or deleting a Junction Box
    // while a segment is selected would not refresh the far turn markers — the user
    // would have to deselect and reselect to see the updated state.
    //
    // We mirror the same pattern used for 'segments' and 'nodes' above: track the
    // data model and re-run ja_calculate() on change or removal events.
    sdk.Events.trackDataModelEvents({ dataModelName: 'bigJunctions' });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-changed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'bigJunctions' && hasSelection()) {
          ja_calculate();
        }
      },
    });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-removed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'bigJunctions' && hasSelection()) {
          ja_calculate();
        }
      },
    });

    sdk.Events.on({
      eventName: 'wme-map-zoom-changed',
      eventHandler: function () {
        if (hasSelection()) {
          ja_calculate();
        }
      },
    });
    sdk.Events.on({
      eventName: 'wme-map-move-end',
      eventHandler: function () {
        // Guards: only run if roundabout overlay is set to "Always" and something is selected
        if (ja_options.roundaboutOverlayDisplay !== 'rOverAlways' || !hasSelection()) {
          return;
        }
        if (sdk.Map.getZoomLevel() >= MIN_ZOOM_LEVEL) {
          ja_calculate();
        }
      },
    });

    sdk.Events.on({
      eventName: 'wme-user-settings-changed',
      eventHandler: function () {
        ja_loadTranslations();
        if (ja_sidebar_tabPane) {
          setupHtml(ja_sidebar_tabPane);
        }
        ja_apply();
      },
    });

    // ── Translations & sidebar HTML ───────────────────────────────────
    ja_load();
    ja_loadTranslations();

    showScriptInfoAlert();

    // ── SDK map layer ─────────────────────────────────────────────────
    sdk.Map.addLayer({
      layerName: 'junction_angles',
      styleContext: ja_build_style_context(),
      styleRules: ja_build_style_rules(),
    });
    ja_layer_created = true;

    // ── SDK Sidebar ───────────────────────────────────────────────────
    const { tabLabel: jaTabLabel, tabPane: jaTabPane } = await sdk.Sidebar.registerScriptTab();

    // ── Tab label with power button ───────────────────────────────────
    jaTabLabel.innerHTML =
      '<span id="ja-power-btn" class="fa fa-power-off"' +
      ' style="margin-right:5px;cursor:pointer;color:#00bd00;font-size:13px;"' +
      ' title="Toggle Junction Angles"></span>' +
      '<span title="Junction Angle Info">JAI</span>';
    jaTabPane.id = 'sidepanel-ja';
    jaTabPane.classList.add('wme-ja-panel');
    ja_sidebar_tabPane = jaTabPane;
    setupHtml(jaTabPane);
    ja_apply();

    // ── Shared toggle — called by both the power button and the layer checkbox ──
    /**
     * Single source of truth for enabling/disabling the junction_angles map layer.
     *
     * Updates `ja_layer_visible`, sets SDK layer visibility, syncs the Map Layers checkbox
     * (without firing `wme-layer-checkbox-toggled` — that event only fires on user interaction),
     * and updates the power button colour in the sidebar tab label.
     *
     * Both the power button click handler and the `wme-layer-checkbox-toggled` event handler
     * call this function to avoid circular update loops.
     *
     * @param {boolean} enabled - True to show the layer; false to hide it.
     */
    function ja_setLayerEnabled(enabled) {
      ja_layer_visible = enabled;
      // Persist layer visibility state to localStorage
      if (localStorage) {
        localStorage.setItem('wme_ja_layer_visible', ja_layer_visible ? 'true' : 'false');
      }
      sdk.Map.setLayerVisibility({ layerName: 'junction_angles', visibility: ja_layer_visible });
      sdk.LayerSwitcher.setLayerCheckboxChecked({ name: 'Junction Angle Info', isChecked: ja_layer_visible });
      var btn = jaTabLabel.querySelector('#ja-power-btn');
      if (btn) {
        btn.style.color = ja_layer_visible ? '#00bd00' : '#ccc';
      }
    }

    // ── Layer visibility checkbox ─────────────────────────────────────
    // Restore layer visibility state from localStorage (default to true if not saved)
    if (localStorage) {
      var savedVisibility = localStorage.getItem('wme_ja_layer_visible');
      ja_layer_visible = savedVisibility === 'false' ? false : true;
    }
    sdk.LayerSwitcher.addLayerCheckbox({ name: 'Junction Angle Info', isChecked: ja_layer_visible });
    sdk.Events.on({
      eventName: 'wme-layer-checkbox-toggled',
      eventHandler: function (evt) {
        if (evt.name === 'Junction Angle Info') {
          ja_setLayerEnabled(evt.checked);
        }
      },
    });

    // ── Auto-refresh on turn instruction/restriction changes ──────────────
    // When a user edits a turn (changes instruction, adds/removes restrictions, etc.),
    // automatically recalculate JAI markers if a segment or node is currently selected.
    // This prevents stale markers when turn data changes in-place.
    sdk.Events.on({
      eventName: 'wme-after-edit',
      eventHandler: function () {
        // Check if we have a current selection (segment, node, or multiple items)
        var currentSel = sdk.Editing.getSelection();
        if (currentSel && currentSel.ids && currentSel.ids.length > 0) {
          // Recalculate markers for the currently selected items
          ja_calculate();
        }
      },
    });

    // ── Power button click ────────────────────────────────────────────
    jaTabLabel.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'ja-power-btn') {
        ja_setLayerEnabled(!ja_layer_visible);
        e.stopPropagation();
      }
    });

    // ── Apply saved visibility state to layer ─────────────────────────
    if (!ja_layer_visible) {
      // If saved state is off, hide the layer immediately
      sdk.Map.setLayerVisibility({ layerName: 'junction_angles', visibility: false });
      var btn = jaTabLabel.querySelector('#ja-power-btn');
      if (btn) {
        btn.style.color = '#ccc';
      }
    }

    ja_apply();
    ja_calculate();
  }

  junctionangle_init();
})();
