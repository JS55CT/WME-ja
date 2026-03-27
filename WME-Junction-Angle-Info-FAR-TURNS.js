// ==UserScript==
// @name          WME Junction Angle Info (FAR-TURNS)
// @description   Show the angle between two connected (or selected) segments — experimental branch adding Junction Box and Path (far turn) support
// @namespace     https://greasyfork.org/en/users/166843-wazedev
// @match         *://*.waze.com/*editor*
// @exclude       *://*.waze.com/user/editor*
// @exclude       *://*.waze.com/editor/sdk/*
// @version       3.0.3
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
 *  2026 "JS55CT"                    Current maintainer; SDK migration
 */

/*global I18n, $, bootstrap, turf, getWmeSdk, SDK_INITIALIZED, GM_info, GM_xmlhttpRequest*/

(async function () {
  'use strict';

  // **************************************************************************************************************
  // IMPORTANT: Update this when releasing a new version of script
  // **************************************************************************************************************
  const SHOW_UPDATE_MESSAGE = true;
  const SCRIPT_VERSION_CHANGES = [
    'Rewritten from the ground up for the WME JavaScript SDK (replaces legacy W/OpenLayers API)',
    'New: double U-turn detection at H and # intersections — flags ~180° paths across short connector segments (≤30 m, or ≤50 m with incoming lane guidance)',
    'New U-Turn detection settings: opt-in Street, Parking Lot Road, and Private Road connectors (all off by default)',
    'Roundabout center now shows a Ø diameter marker (white = radius ≤ 25 m / orange = oversized) to flag the radius Non-Normal criterion at a glance',
    '±N° deviation markers now appear at every oblique exit regardless of roundabout size',
    'Departure-mode and ±N° markers are now zoom-aware and no longer overlap',
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

  // ── Map layer state ───────────────────────────────────────────────────────
  // Shared state for the 'junction_angles' SDK map layer.
  var ja_layer_created = false; // true once sdk.Map.addLayer() has returned
  var ja_layer_visible = true; // mirrors the current Layer Switcher checkbox state
  var ja_roundabout_points = []; // GeoJSON Points of RA markers placed this pass (collision detection)
  var ja_current_features = []; // all features placed this render pass (overlap avoidance)
  var ja_feature_counter = 0; // monotonic counter; features are named 'ja_' + (++ja_feature_counter)

  // ── UI state ──────────────────────────────────────────────────────────────
  var ja_sidebar_tabPane = null; // SDK tab pane element — retained so setupHtml() can re-render it

  // ── Angle classification thresholds ──────────────────────────────────────
  // Waze routing instruction boundaries derived from map experiments and the Waze wiki.
  var TURN_ANGLE = 45.5; // degrees — boundary between a Keep and a Turn instruction (wiki: 45.04°)
  var U_TURN_ANGLE = 168.24; // degrees — boundary above which a turn is classified as a U-Turn
  var GRAY_ZONE = 1.5; // degrees — margin around TURN_ANGLE to absorb measurement noise
  var OVERLAPPING_ANGLE = 0.666; // degrees — two segments closer than this are treated as collinear
  var MIN_ZOOM_LEVEL = 16; // hide all markers when zoomed out past this level

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
        ja_label_distance = 1.5;
        break;
      case 21:
        ja_label_distance = 3;
        break;
      case 20:
        ja_label_distance = 7;
        break;
      case 19:
        ja_label_distance = 10;
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
      ja_log(sdk.DataModel.Nodes.getById({ nodeId: node }), 3);

      var tmp_s = null,
        tmp_n = null,
        tmp_junctionID = null;
      if (sdk.DataModel.Nodes.getById({ nodeId: node }) == null || typeof sdk.DataModel.Nodes.getById({ nodeId: node }).connectedSegmentIds === 'undefined') {
        return;
      }
      sdk.DataModel.Nodes.getById({ nodeId: node }).connectedSegmentIds.forEach(function (segment) {
        ja_log(segment, 3);

        if (sdk.DataModel.Segments.getById({ segmentId: segment }) != null && sdk.DataModel.Segments.getById({ segmentId: segment }).junctionId != null) {
          ja_log('Roundabout detected: ' + sdk.DataModel.Segments.getById({ segmentId: segment }).junctionId, 3);
          tmp_junctionID = sdk.DataModel.Segments.getById({ segmentId: segment }).junctionId;
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
   * marker colored per the specific entry→exit path angle (white = within 15° of
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

        // Roundabout arc selected: treat fromNode (in_n) as the entry point and show all
        // exits — same view as selecting an entry segment connected at that same node.
        var _selfeat = getselfeat();
        if (_selfeat.length === 1 && _selfeat[0].type === 'segment') {
          var _selSeg = sdk.DataModel.Segments.getById({ segmentId: _selfeat[0].id });
          if (_selSeg && _selSeg.junctionId !== null) {
            ja_draw_roundabout_entry_exits(tmp_roundabout_id, ja_selected_roundabouts[tmp_roundabout].in_n, ja_label_distance);
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
        sdk.Map.addFeatureToLayer({
          layerName: 'junction_angles',
          feature: {
            id: 'ja_' + ++ja_feature_counter,
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [tmp_in_geom.coordinates, tmp_roundabout_center.coordinates, tmp_out_geom.coordinates] },
            properties: { ja_type: 'arrow_line' },
          },
        });
        // Call ja_is_roundabout_normal for its side effect: places ±N° deviation markers
        // at any exit node that is more than 15° off perpendicular.
        ja_is_roundabout_normal(tmp_roundabout_id, ja_selected_roundabouts[tmp_roundabout].in_n, ja_label_distance);
        // Color the center marker based on THIS specific path's angle only.
        // Per Waze: a roundabout can be normal for one entry and non-normal for another.
        var ra_angle_mod = Math.abs(angle % 90);
        var ra_path_is_normal = ra_angle_mod <= 15 || ra_angle_mod >= 75;
        sdk.Map.addFeatureToLayer({
          layerName: 'junction_angles',
          feature: {
            id: 'ja_' + ++ja_feature_counter,
            type: 'Feature',
            geometry: tmp_roundabout_center,
            properties: {
              angle: ja_round(angle) + '°',
              ja_type: ra_path_is_normal ? ja_routing_type.BC : ja_routing_type.ROUNDABOUT,
            },
          },
        });
      }
    }
  }

  /**
   * Identifies short connector segments (≤15 m) that create double-turn or U-turn
   * paths and returns an accumulator object for use during marker drawing.
   *
   * A double-turn occurs when a driver enters a short connector segment from one
   * road and exits onto another road such that the combined heading change is near
   * 180°. Waze may misclassify such paths; this function flags them as NO_U_TURN
   * or PROBLEM so ja_draw_node_markers can render warning markers.
   *
   * Only active in Departure angle mode when more than one node is selected.
   *
   * @param {number[]} ja_nodes - Array of selected node IDs.
   * @returns {{data: Object, collect: Function, forEachItem: Function}} Accumulator.
   */
  function ja_collect_double_turns(ja_nodes) {
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

        var lenRounded = Math.round(len);
        if (lenRounded <= 49) {
          var fromNode = sdk.DataModel.Nodes.getById({ nodeId: segment.fromNodeId });
          var toNode = sdk.DataModel.Nodes.getById({ nodeId: segment.toNodeId });
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

              //Determine whether a turn is disallowed
              if (angle >= 175 - GRAY_ZONE && angle <= 185 + GRAY_ZONE) {
                var turn_type = angle >= 175 + GRAY_ZONE && angle <= 185 - GRAY_ZONE ? ja_routing_type.NO_U_TURN : ja_routing_type.PROBLEM;

                if (ja_is_turn_allowed(fromSegment, fromNode, segment) && ja_is_turn_allowed(segment, toNode, toSegment) &&
                    (lenRounded <= 30 || ja_segment_has_lane_guidance(fromSegmentId, fromNode.id, segmentId))) {
                  doubleTurns.collect(segmentId, fromSegmentId, toSegmentId, angle, turn_type);
                }
                if (ja_is_turn_allowed(toSegment, toNode, segment) && ja_is_turn_allowed(segment, fromNode, fromSegment) &&
                    (lenRounded <= 30 || ja_segment_has_lane_guidance(toSegmentId, toNode.id, segmentId))) {
                  doubleTurns.collect(segmentId, toSegmentId, fromSegmentId, angle, turn_type);
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
      getselfeat().forEach(function (s) { selectedIds[s.id] = true; });

      getselfeat().forEach(function (selectedSegment) {
        var armId = selectedSegment.id;
        var armSeg = sdk.DataModel.Segments.getById({ segmentId: armId });
        if (!ja_is_uturn_qualifying_road(armSeg)) return;

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

              if (combined_angle >= 175 - GRAY_ZONE && combined_angle <= 185 + GRAY_ZONE) {
                var turn_type = combined_angle >= 175 + GRAY_ZONE && combined_angle <= 185 - GRAY_ZONE
                  ? ja_routing_type.NO_U_TURN : ja_routing_type.PROBLEM;
                doubleTurns.farExitMarkers.push({
                  farNodeId: medianFarNodeId,
                  exitBearing: exit_a,
                  angle: combined_angle,
                  turn_type: turn_type
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
   * @returns {boolean} True if a data error occurred and the calculation must be retried.
   */
  function ja_draw_node_markers(ja_nodes, ja_label_distance, doubleTurns, ja_selected_has_median, ja_selected_seg_ids) {
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
      var ja_ld = ja_label_distance * Math.cos((node.geometry.coordinates[1] * Math.PI) / 180);
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
          ja_log('It is!', 4);
          //find the angle
          for (var j = 0; j < angles.length; j++) {
            if (angles[j][1] === selectedSegmentId) {
              ja_selected_angles.push(angles[j]);
              break;
            }
          }
        } else {
          ja_log("It's not..", 4);
        }
      });

      ja_log(angles, 3);

      var ha, point;
      //if we have two connected segments selected, do some magic to get the turn angle only =)
      if (ja_selected_segments_count === 2) {
        var ja_extra_space_multiplier = 1;

        a = ja_angle_diff(ja_selected_angles[0][0], ja_selected_angles[1][0], false);

        ha = (parseFloat(ja_selected_angles[0][0]) + parseFloat(ja_selected_angles[1][0])) / 2;
        if (
          Math.abs(ja_selected_angles[0][0]) + Math.abs(ja_selected_angles[1][0]) > 180 &&
          ((ja_selected_angles[0][0] < 0 && ja_selected_angles[1][0] > 0) || (ja_selected_angles[0][0] > 0 && ja_selected_angles[1][0] < 0))
        ) {
          ha += 180;
        }

        if (Math.abs(a) > 120) {
          ja_log('Sharp angle', 3);
          ja_extra_space_multiplier = 2;
        }

        //Move point a bit if it's on the top (Bridge icon will obscure it otherwise)
        if (ha > 40 && ha < 120) {
          ja_extra_space_multiplier = 2;
        }

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
        point = turf.destination(turf.point(node.geometry.coordinates), (ja_extra_space_multiplier * ja_ld) / 1000, (90 - ha + 360) % 360).geometry;
        ja_draw_marker(point, node, ja_ld, a, ha, true, ja_junction_type);

        //draw double turn markers
        doubleTurns.forEachItem(ja_selected_angles[0][1], ja_selected_angles[1][1], function (item) {
          ja_draw_marker(point, node, ja_ld, item.angle, ha, true, item.turn_type);
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
            point = turf.destination(turf.point(node.geometry.coordinates), (ja_ld * 2) / 1000, (90 - ha + 360) % 360).geometry;
            ja_draw_marker(point, node, ja_ld, a, ha, true, ja_getOption('guess') ? ja_guess_routing_instruction(node, a_in[1], angle[1], angles) : ja_routing_type.TURN);

            //draw double turn markers
            doubleTurns.forEachItem(a_in[1], angle[1], function (item) {
              ja_draw_marker(point, node, ja_ld, item.angle, ha, true, item.turn_type);
            });
          } else {
            ja_log('Angle between ' + angle[1] + ' and ' + angles[(j + 1) % angles.length][1] + ' is ' + a + ' and position for label should be at ' + ha, 3);
            point = turf.destination(turf.point(node.geometry.coordinates), (ja_ld * 1.25) / 1000, (90 - ha + 360) % 360).geometry;
            ja_draw_marker(point, node, ja_ld, a, ha);
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
      // To disable far turn display without removing the code, comment out this line.
      // Suppressed when any selected segment is a JB median: internal segments are handled
      // by the regular node-pair loop above; far-turn exit markers would be misleading.
      if (!ja_selected_has_median) {
        ja_draw_far_turn_markers(node, ja_label_distance, ja_selected_seg_ids);
      }
    }

    // Draw far-exit double-turn markers triggered by arm selection.
    // Placed at the median's far node along the exit arm's bearing — matching the
    // visual position produced when the median itself is selected directly.
    doubleTurns.farExitMarkers.forEach(function (item) {
      var farNode = sdk.DataModel.Nodes.getById({ nodeId: item.farNodeId });
      if (!farNode) return;
      var farLd = ja_label_distance * Math.cos((farNode.geometry.coordinates[1] * Math.PI) / 180);
      var pt = turf.destination(
        turf.point(farNode.geometry.coordinates),
        (farLd * 2) / 1000,
        (90 - item.exitBearing + 360) % 360
      ).geometry;
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
    sdk.Map.removeAllFeaturesFromLayer({ layerName: 'junction_angles' });
    ja_roundabout_points = [];
    ja_current_features = [];
    ja_feature_counter = 0;
    if (sdk.Map.getZoomLevel() < MIN_ZOOM_LEVEL) {
      return;
    }
    if (ja_getOption('roundaboutOverlayDisplay') === 'rOverAlways') {
      ja_draw_roundabout_overlay();
    }

    var ja_selfeat = getselfeat();
    if (ja_selfeat.length > 2) {
      return;
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
    var ja_selected_roundabouts = ja_find_roundabouts(ja_nodes);
    ja_draw_roundabout_markers(ja_selected_roundabouts, ja_label_distance);

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

    var doubleTurns = ja_collect_double_turns(ja_marker_nodes);

    // True if any selected segment is contained inside a BigJunction (a median/intermediate
    // segment). In that case ja_draw_node_markers suppresses far-turn markers: the regular
    // node-pair loop handles internal angles, and far-turn exit markers would be misleading.
    var ja_selected_has_median = ja_selfeat.some(function (feat) {
      return feat.type === 'segment' &&
        sdk.DataModel.Segments.isContainedInBigJunction({ segmentId: feat.id });
    });

    // IDs of the segments explicitly selected by the user. Used to restrict far-turn marker
    // drawing to only the selected entry segment(s), matching how regular departure-mode
    // markers work (angles shown FROM the selected segment, not FROM all segments at the node).
    //
    // When a node is selected directly (no segment in ja_selfeat), this array is empty — in
    // that case ja_draw_far_turn_markers shows far turns from ALL connected non-median segments.
    var ja_selected_seg_ids = ja_selfeat
      .filter(function (feat) { return feat.type === 'segment'; })
      .map(function (feat) { return feat.id; });

    if (ja_draw_node_markers(ja_marker_nodes, ja_label_distance, doubleTurns, ja_selected_has_median, ja_selected_seg_ids)) {
      return;
    }

    ja_last_restart = 0;
    var ja_end_time = Date.now();
    ja_log('Calculation took ' + String(ja_end_time - ja_start_time) + ' ms', 2);
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
        switch (opcode) {
          case 'NONE':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideBC;
          case 'CONTINUE':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideCONTINUE;
          case 'TURN_LEFT':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideTURN_LEFT;
          case 'TURN_RIGHT':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideTURN_RIGHT;
          case 'KEEP_LEFT':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideKEEP_LEFT;
          case 'KEEP_RIGHT':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideKEEP_RIGHT;
          case 'EXIT_LEFT':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideEXIT_LEFT;
          case 'EXIT_RIGHT':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideEXIT_RIGHT;
          case 'UTURN':
            ja_log('turn opcode override is: ' + opcode, 2);
            return ja_routing_type.OverrideU_TURN;
          default:
            ja_log('no turn opcode override', 3);
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

    var isLeftHand = (sdk.DataModel.Countries.getAll()[0] || {}).isLeftHandTraffic || false;

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

      if (!isLeftHand) {
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
        return isLeftHand ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
      }
      if (ja_is_ramp(s_in) && !ja_is_primary_road(s_out[s_out_id]) && !ja_is_ramp(s_out[s_out_id])) {
        ja_log('Ramp to non-primary and non-ramp = exit', 2);
        return isLeftHand ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
      }

      return isLeftHand ? ja_routing_type.KEEP_LEFT : ja_routing_type.KEEP_RIGHT;
    } else if (Math.abs(angle) < TURN_ANGLE + GRAY_ZONE) {
      ja_log('Angle is in gray zone 44-46', 3);
      return ja_routing_type.PROBLEM;
    } else {
      ja_log('Normal turn', 2);
      return ja_routing_type.TURN;
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
   */
  function ja_draw_marker(point, node, ja_label_distance, a, ha, withRouting, ja_junction_type, isFarTurn) {
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
      point = turf.destination(turf.point(node.geometry.coordinates), ja_tmp_distance / 1000, (90 - ha + 360) % 360).geometry;
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
      ? { angle: angleString, ja_type: ja_junction_type, ja_is_far_turn: !!isFarTurn }
      : { angle: ja_round(a) + '°', ja_type: 'generic' };
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
    sdk.Map.addFeatureToLayer({
      layerName: 'junction_angles',
      feature: {
        id: 'ja_' + ++ja_feature_counter,
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [node.geometry.coordinates, point.coordinates] },
        properties: { ja_type: 'arrow_line' },
      },
    });

    //push the angle point
    ja_current_features.push({ coordinates: point.coordinates, ja_type: angleProps.ja_type });
    sdk.Map.addFeatureToLayer({
      layerName: 'junction_angles',
      feature: {
        id: 'ja_' + ++ja_feature_counter,
        type: 'Feature',
        geometry: point,
        properties: angleProps,
      },
    });
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
        nodes[seg.fromNodeId] = sdk.DataModel.Nodes.getById({ nodeId: seg.fromNodeId });
        nodes[seg.toNodeId] = sdk.DataModel.Nodes.getById({ nodeId: seg.toNodeId });
      });

      ja_log(nodes, 3);
      var center = element.geometry; // GeoJSON Point
      ja_log(center, 3);
      var distances = [];
      Object.getOwnPropertyNames(nodes).forEach(function (name) {
        ja_log('Checking ' + name + ' distance', 3);
        var dist = turf.distance(turf.point(nodes[name].geometry.coordinates), turf.point(center.coordinates)) * 1000;
        distances.push(dist);
      });
      ja_log(distances, 3);
      var meanDistM =
        distances.reduce(function (a, b) {
          return a + b;
        }) / distances.length;
      ja_log('Mean distance is ' + meanDistM, 3);

      var circleGeom = turf.circle(turf.point(center.coordinates), meanDistM / 1000, { steps: 40 }).geometry;
      ja_roundabout_points.push(circleGeom);
      sdk.Map.addFeatureToLayer({
        layerName: 'junction_angles',
        feature: {
          id: 'ja_' + ++ja_feature_counter,
          type: 'Feature',
          geometry: circleGeom,
          properties: { ja_type: 'roundaboutOverlay' },
        },
      });
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
      ja_log('[segment_type_match] roadType ' + segment_n.roadType + ' vs ' + segment_in.roadType, 4);
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
    if (t === ja_road_type.FREEWAY || t === ja_road_type.RAMP ||
        t === ja_road_type.MAJOR_HIGHWAY || t === ja_road_type.MINOR_HIGHWAY ||
        t === ja_road_type.PRIMARY_STREET) return true;
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
          ja_log('CN2a: checking n.p: ' + street_n_element.primary.name + ' vs in.s: ' + street_in_secondary.name, 4);

          //wlodek76: CROSS-MATCH works when two compared segments contain at least one ALT NAME
          //when alt name is empty cross-match does not work
          //FZ69617: This no longer seems to be needed
          //if (street_n_element.secondary.length === 0) { return false; }

          return street_n_element.primary.name === street_in_secondary.name;
        }) ||
        street_n_element.secondary.some(function (street_n_secondary) {
          ja_log('CN2b: checking in.p: ' + street_in.primary.name + ' vs n.s: ' + street_n_secondary.name, 4);

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
          ja_log('[alt_name_match] in.secondary: ' + street_in_secondary.name + ' vs n.secondary[' + index3 + ']: ' + street_n_secondary_element.name, 4);
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
   * Checks whether every exit of a roundabout is within 15° of perpendicular (i.e. "normal").
   *
   * For each valid exit node (a `toNodeId` of a junction arc that has at least one drivable
   * outbound non-junction segment), the triangle angle `n_in → roundabout-center → exit-node`
   * is computed.  An exit is non-normal when `angle % 90` falls outside the [0°, 15°] and
   * [75°, 90°] bands.  For every non-normal exit a `±N°` deviation marker is placed just
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
   * @returns {boolean} True if all exits are within 15° of perpendicular; false otherwise.
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
          //angle = Math.abs((angle%90 - 90))
          angle = Math.abs(angle % 90);
          ja_log('Angle is: ' + angle, 3);
          // 90 +/- 15 is considered "normal"
          if (angle <= 15 || 90 - angle <= 15) {
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
            var ja_ld = label_distance * Math.cos((n_geom.coordinates[1] * Math.PI) / 180);
            var marker_geom = turf.destination(turf.point(center_coord), ring_radius_km + ja_ld / 1000, bearing_out).geometry;
            sdk.Map.addFeatureToLayer({
              layerName: 'junction_angles',
              feature: {
                id: 'ja_' + ++ja_feature_counter,
                type: 'Feature',
                geometry: marker_geom,
                properties: {
                  angle: '±' + ja_round(Math.min(angle, 90 - angle)),
                  ja_type: ja_routing_type.ROUNDABOUT,
                },
              },
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
   *   1. All exit angles within ±15° of a multiple of 90° (perpendicular exits)
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
    var junction = sdk.DataModel.Junctions.getById({ junctionId: junctionId });
    if (!junction) return;
    var entryNode = sdk.DataModel.Nodes.getById({ nodeId: entryNodeId });
    if (!entryNode) return;
    var center = ja_coordinates_to_point(junction.geometry.coordinates);
    var centerPt = turf.point(center.coordinates);
    var entryPt = turf.point(entryNode.geometry.coordinates);

    // In LHT countries roundabouts flow clockwise (CW); RHT countries flow CCW.
    // This affects the order exits are encountered (and therefore ordinal numbering)
    // but NOT the instruction classification, which is purely geometric.
    var isLeftHand = (sdk.DataModel.Countries.getAll()[0] || {}).isLeftHandTraffic || false;

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
    sdk.Map.addFeatureToLayer({
      layerName: 'junction_angles',
      feature: {
        id: 'ja_' + ++ja_feature_counter,
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [entryNode.geometry.coordinates, center.coordinates] },
        properties: { ja_type: 'arrow_line' },
      },
    });

    // ── Step 1: Collect all valid exits ──────────────────────────────────────
    var processedNodes = {};
    var exits = [];

    junction.segmentIds.forEach(function (segId) {
      var juncSeg = sdk.DataModel.Segments.getById({ segmentId: segId });
      if (!juncSeg) return;

      var exitNodeId = juncSeg.toNodeId;
      // Allow the entry node once (U-turn arc) but deduplicate everything else.
      // We track with a count so a second arc returning to the same node is still skipped.
      if (processedNodes.hasOwnProperty(String(exitNodeId))) return;
      processedNodes[String(exitNodeId)] = true;

      var exitNode = sdk.DataModel.Nodes.getById({ nodeId: exitNodeId });
      if (!exitNode) return;

      // Find the first drivable non-junction exit segment at this node
      var exitSeg = null;
      exitNode.connectedSegmentIds.forEach(function (connSegId) {
        if (exitSeg) return;
        var s = sdk.DataModel.Segments.getById({ segmentId: connSegId });
        if (!s || s.junctionId !== null) return;
        if (sdk.DataModel.Turns.isTurnAllowedBySegmentDirections({ fromSegmentId: juncSeg.id, nodeId: exitNodeId, toSegmentId: s.id })) {
          exitSeg = s;
        }
      });
      if (!exitSeg) return;

      // CCW angle (0–360°) from entry to this exit, measured at the roundabout center.
      // In right-hand traffic (CCW roundabout): ~90° = Turn Right, ~180° = Straight, ~270° = Turn Left.
      // U-turn arc returns to the entry node — assign 360 so it sorts last and falls in the ≥315 U-turn bucket.
      var ccwAngle;
      if (exitNodeId === entryNodeId) {
        ccwAngle = 360;
      } else {
        var bearingToExit = turf.bearing(centerPt, turf.point(exitNode.geometry.coordinates));
        ccwAngle = (bearingToEntry - bearingToExit + 360) % 360;
      }

      // Triangle angle at center: entry_node → center → exit_node (always 0–180°).
      // U-turn arc: entry and exit are the same node so the triangle is degenerate (0°).
      // Use 180° instead — the driver exits back along the same road in the opposite direction.
      var triAngle = (exitNodeId === entryNodeId)
        ? 180
        : ja_angle_between_points(entryNode.geometry, center, exitNode.geometry);
      var angleMod = Math.abs(triAngle % 90);
      var isExitAngleNormal = angleMod <= 15 || angleMod >= 75;

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

    if (exits.length === 0) return;

    // ── Step 2: Determine overall roundabout normality for this entry ─────────

    // Criterion 1 – All exits within ±15° of a 90° multiple
    var allAnglesNormal = exits.every(function (e) { return e.isExitAngleNormal; });

    // Criterion 2 – Total junction node count 2–4
    var junctionNodeSet = {};
    junction.segmentIds.forEach(function (segId) {
      var s = sdk.DataModel.Segments.getById({ segmentId: segId });
      if (s) junctionNodeSet[String(s.toNodeId)] = true;
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

    // ── Center diameter marker ─────────────────────────────────────────────────
    // Shows the roundabout's diameter (maxRadius × 2) at the center point.
    // White = radius ≤ 25 m (Normal criterion met); Orange = radius > 25 m (Non-Normal).
    var diameterM = ja_round(maxRadius * 2);
    var diameterLabel = ja_getOption('angleDisplay') === 'displaySimple'
      ? '\u00d8' + diameterM + 'm'
      : '\u00d8\n' + diameterM + 'm';
    sdk.Map.addFeatureToLayer({
      layerName: 'junction_angles',
      feature: {
        id: 'ja_' + ++ja_feature_counter,
        type: 'Feature',
        geometry: center,
        properties: {
          angle: diameterLabel,
          ja_type: isRadiusNormal ? ja_routing_type.BC : ja_routing_type.ROUNDABOUT,
        },
      },
    });

    // ── Step 3: Sort exits by CCW angle (order encountered going CCW from entry) ──
    // RHT (CCW roundabout): first exit encountered has smallest ccwAngle → sort ascending.
    // LHT (CW roundabout):  first exit encountered has largest ccwAngle  → sort descending.
    exits.sort(isLeftHand ? function (a, b) { return b.ccwAngle - a.ccwAngle; } : function (a, b) { return a.ccwAngle - b.ccwAngle; });

    // ── Step 4: Draw exit legs and markers ───────────────────────────────────
    exits.forEach(function (exit, index) {
      // Draw exit leg: roundabout center → exit node
      sdk.Map.addFeatureToLayer({
        layerName: 'junction_angles',
        feature: {
          id: 'ja_' + ++ja_feature_counter,
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [center.coordinates, exit.exitNode.geometry.coordinates] },
          properties: { ja_type: 'arrow_line' },
        },
      });

      var exitBearing = ja_getAngle(exit.exitNodeId, exit.exitSeg);
      var exitLd = label_distance * Math.cos((exit.exitNode.geometry.coordinates[1] * Math.PI) / 180);
      var point = turf.destination(turf.point(exit.exitNode.geometry.coordinates), (exitLd * 2) / 1000, (90 - exitBearing + 360) % 360).geometry;

      var markerType;
      if (isRoundaboutNormal) {
        // Classify by CCW angle from entry (right-hand/CCW traffic convention):
        //   ~90°  → Turn Right   (first exit going CCW)
        //   ~180° → Continue Straight
        //   ~270° → Turn Left    (last exit before U-turn)
        //   ~0°/360° → U-Turn
        var ccw = exit.ccwAngle;
        if (ccw < 45 || ccw >= 315) {
          markerType = ja_routing_type.U_TURN;
        } else if (ccw < 135) {
          markerType = ja_routing_type.TURN_RIGHT;
        } else if (ccw < 225) {
          markerType = ja_routing_type.BC; // Continue Straight
        } else {
          markerType = ja_routing_type.TURN_LEFT;
        }
        // ja_draw_marker handles arrow characters and display-mode formatting,
        // exactly as it does for regular turn markers at intersections.
        ja_draw_marker(point, exit.exitNode, exitLd, exit.triAngle, exitBearing, true, markerType);
      } else {
        // Non-normal: ordinal exit numbers in encounter order; no arrow needed.
        // Direct feature add — ordinal string can't pass through ja_draw_marker's numeric 'a'.
        sdk.Map.addFeatureToLayer({
          layerName: 'junction_angles',
          feature: {
            id: 'ja_' + ++ja_feature_counter,
            type: 'Feature',
            geometry: point,
            properties: {
              angle: ja_getOption('angleDisplay') === 'displaySimple'
                ? ordinal(index + 1) + ' ' + ja_round(exit.triAngle) + '°'
                : ordinal(index + 1) + '\n' + ja_round(exit.triAngle) + '°',
              ja_type: ja_routing_type.ROUNDABOUT, // "Non-Normal Exit Color" (roundaboutColor) setting
            },
          },
        });
      }
    });
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
    ja_log('[getAngle] node: ' + ja_node, 4);
    ja_log('[getAngle] segment: ' + ja_segment, 4);
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
    ja_log('[getAngleMidleSeg] node: ' + ja_node, 4);
    ja_log('[getAngleMidleSeg] segment: ' + ja_segment, 4);
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
    if (segA.toNodeId   === segB.fromNodeId || segA.toNodeId   === segB.toNodeId) return segA.toNodeId;
    return null; // segments are not adjacent — should not happen with valid SDK data
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
   *   They CANNOT be restricted (no red arrows).
   *   Because of this, path turns are always displayable; we do NOT check isTurnAllowed.
   *
   *   JUNCTION BOX TURNS (turn.isJunctionBoxTurn === true)
   *   ─────────────────────────────────────────────────────
   *   Created when a Junction Box (BigJunction polygon) is drawn over a complex intersection.
   *   Junction Box turns CAN be restricted (red/yellow arrows in WME editor).
   *   They DO affect routing and collect per-path speed data.
   *   Currently this function displays all JB turns regardless of restriction state —
   *   a future refinement could check turn.isAllowed and use a different style for
   *   restricted JB paths (similar to how NO_TURN is used for blocked node turns).
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
   * The net angle (+77.23° for 67702190→9157462) is geometrically correct across the whole path
   * but is NOT what Waze uses for the voice prompt. Waze fires at the first meaningful turn node.
   *
   * Why not always use the entry node?
   * When the entry segment continues STRAIGHT onto the first intermediate segment (e.g. 68437612
   * heading W onto 57796037 also heading W, ~7.67°), the instruction fires further along at the
   * connecting node where the real heading change occurs (57796037→533496729 = LEFT turn at
   * node 50472157).
   *
   * Two live examples from the test JB:
   *   Case A  67702190 → 9157462:   step1 = +81.67° (>10°) → use entry node → show +81.67°
   *   Case B  68437612 → 533496729: step1 =  +7.67° (≤10°) → check step2 → meaningful LEFT → use connecting node
   *
   * LABEL PLACEMENT
   * ───────────────
   * Marker placement (the ★ boundary point and ha direction) always uses the connecting node
   * and the exit segment's departure bearing — this is unchanged regardless of which node
   * the instruction fires at. The angle VALUE changes; the position does not.
   *
   * CANONICAL TEST CASE (confirmed topology — use to validate far-turn behavior)
   * ─────────────────────────────────────────────────────────────────────────────
   * The JB used to develop and debug this function is wider than its two internal junction nodes —
   * it bisects segment 9157462 (west) and segment 68437612 (east).
   *
   *                 ┌──────────────────────────────────────────────┐
   *   W ──9157462──★┤[50472157]══════57796037(MEDIAN)══════[7538663]├★──68437612──→ E
   *                 │                                              │
   *                 └──────────┬───────────────────────┬──────────┘
   *                            │                       │
   *                       533496729                67702190
   *                       ↓ one-way S              ↑ one-way N
   *                       (Allow: No ✗)            (test entry)
   *
   *   ★ = JB polygon boundary — where turf.lineIntersect places far-turn markers.
   *   Node 50472157: 9157462 (W), 57796037 (median→E), 533496729 (S, restricted)
   *   Node 7538663:  68437612 (E), 57796037 (median→W), 67702190 (N)
   *
   *   Select 67702190 — expected far-turn markers:
   *     67702190 → 9157462   : +81.67° LEFT  (Case A — step1 >10°, instruction at entry node 7538663)
   *     67702190 → 533496729 : no marker      (JB per-path restriction)
   *
   *   Select 68437612 — expected far-turn markers:
   *     68437612 → 9157462   : ~BC            (step1 ~straight, step2 ~straight — both E↔W at both nodes)
   *     68437612 → 533496729 : meaningful LEFT (Case B — step1 ~7.67° ≤10°, step2 meaningful at node 50472157)
   *
   *   Direct node turns at 7538663 (not far turns, handled by regular logic):
   *     67702190 → 68437612  : −90.66° RIGHT
   *
   *   JB restriction note: 67702190→533496729 cannot use a node restriction at 50472157 because
   *   both 67702190 and 68437612 arrive there via 57796037 — a node restriction would block the
   *   valid 68437612→533496729 turn too. The JB per-path restriction targets only 67702190→533496729.
   *
   *   Memory: jb_test_case_topology.md
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
  function ja_draw_far_turn_markers(node, ja_label_distance, ja_selected_seg_ids) {
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

    node.connectedSegmentIds.forEach(function (segId) {
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
      //
      // Segments inside a JB are the internal connector roads that make up the JB's interior.
      // They are NOT entry or exit segments — they are the in-between segments that form the
      // physical path through the junction. When a user selects one of these, the regular
      // ja_draw_node_markers() logic handles angle display for internal node-to-node transitions.
      //
      // Drawing far-turn markers for them here would be incorrect because:
      //   1. The "far turn" angle (entry→exit of the whole JB path) does not originate here.
      //   2. getTurnsFromSegment on a median segment may still surface the JB turn,
      //      causing duplicate or misplaced markers.
      //
      // sdk.DataModel.Segments.isContainedInBigJunction({ segmentId }) returns true when
      // the segment appears in any BigJunction.segmentIds[]. It's a method on the Segments
      // collection class, not a property on the segment object itself.
      if (sdk.DataModel.Segments.isContainedInBigJunction({ segmentId: segId })) {
        ja_log('[FAR-TURNS] Skipping segId ' + segId + ' — isContainedInBigJunction (median segment)', 3);
        return;
      }

      var turnsFromSeg = sdk.DataModel.Turns.getTurnsFromSegment({ segmentId: segId });
      if (!turnsFromSeg || turnsFromSeg.length === 0) return;

      turnsFromSeg.forEach(function (turn) {
        // Only process far turns (Path turns or Junction Box turns).
        // Regular turns (isPathTurn=false, isJunctionBoxTurn=false) are already handled
        // by the existing ja_draw_node_markers() loop and should not be duplicated here.
        if (!turn.isPathTurn && !turn.isJunctionBoxTurn) return;

        // Deduplicate: a far turn may appear in results for multiple connected segments.
        // Only draw it once per node visit.
        if (seenTurnIds[turn.id]) return;
        seenTurnIds[turn.id] = true;

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

        // CRITICAL: Verify the current node is the actual JB/path entry node.
        //
        // Problem: getTurnsFromSegment returns the same far turn when called from EITHER
        // endpoint of the fromSegment. A selected segment A→B only enters the JB at B,
        // but we process both node A and node B. Without this check, markers appear at A too.
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
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' at node ' + node.id + ' — entry is at node ' + entryNodeId, 2);
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
        if (turn.isJunctionBoxTurn &&
            sdk.DataModel.Segments.isContainedInBigJunction({ segmentId: turn.toSegmentId })) {
          ja_log('[FAR-TURNS] Skipping JB turn ' + turn.id + ' — toSegment ' + turn.toSegmentId + ' is a median (isContainedInBigJunction)', 1);
          return;
        }

        // To get the correct departure bearing of the exit segment we need to know which
        // of its two endpoint nodes connects to the path. That is the node shared between
        // the last intermediate segment (segmentPath[last]) and the exit segment.
        var lastPathSegId = turn.segmentPath[turn.segmentPath.length - 1];
        var lastPathSeg   = sdk.DataModel.Segments.getById({ segmentId: lastPathSegId });
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

        // JB PATH VALIDITY — check all internal node turn restrictions
        // ─────────────────────────────────────────────────────────────────────
        // A local turn restriction on any median segment node also blocks the JB
        // route (the Waze routing server respects internal node restrictions even
        // inside a JB). Skip this turn if any step along the path is disallowed.
        //
        // Walk: fromSeg → segmentPath[0] → … → segmentPath[last] → toSeg
        // The node at each handoff is the shared node between adjacent segments.
        //
        // Note: only applied to JB turns. Path turns (isPathTurn) cannot carry
        // restrictions by design, so the check is unnecessary there.
        if (turn.isJunctionBoxTurn) {
          var pathSegs = [fromSeg];
          var pathSegFetchOk = true;
          for (var pi = 0; pi < turn.segmentPath.length; pi++) {
            var pSeg = sdk.DataModel.Segments.getById({ segmentId: turn.segmentPath[pi] });
            if (pSeg == null) { pathSegFetchOk = false; break; }
            pathSegs.push(pSeg);
          }
          pathSegs.push(toSeg);

          if (!pathSegFetchOk) {
            ja_log('[FAR-TURNS] Skipping JB turn ' + turn.id + ' — could not fetch all path segments for restriction check', 1);
            return;
          }

          var pathBlocked = false;
          for (var si = 0; si < pathSegs.length - 1; si++) {
            var stepFrom = pathSegs[si];
            var stepTo   = pathSegs[si + 1];
            var stepNodeId = ja_get_connecting_node(stepFrom, stepTo);
            if (stepNodeId == null) { pathBlocked = true; break; }
            var stepNode = sdk.DataModel.Nodes.getById({ nodeId: stepNodeId });
            if (stepNode == null || !ja_is_turn_allowed(stepFrom, stepNode, stepTo)) {
              pathBlocked = true;
              break;
            }
          }

          if (pathBlocked) {
            ja_log('[FAR-TURNS] Skipping JB turn ' + turn.id + ' — internal node restriction blocks this path', 2);
            return;
          }
        }

        // Calculate bearing of the entry segment as it departs this node.
        var entryAngle     = ja_getAngle(node.id, fromSeg);
        // Departure bearing of firstPathSeg at the entry node (used for JB display angle).
        var firstExitAngle = ja_getAngle(node.id, firstPathSeg);
        // Departure bearing of lastPathSeg at connectingNode (used for Path display angle).
        var lastPathAngle  = ja_getAngle(connectingNodeId, lastPathSeg);
        // Departure bearing of the exit seg at connectingNode (display angle + ha direction).
        var exitAngle      = ja_getAngle(connectingNodeId, toSeg);

        if (entryAngle == null || firstExitAngle == null || exitAngle == null) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — could not compute angles', 1);
          return;
        }

        // DISPLAY ANGLE & TYPE CLASSIFICATION
        // ─────────────────────────────────────────────────────────────────────
        //
        // Both JB and Path far-turns share the same structure:
        //   1. Override check (turn.instructionOpCode) — tried first for both types.
        //   2. Display angle selection (turnAngle).
        //   3. Type/color classification via ja_guess_routing_instruction where possible.
        //
        // PATH TURNS (isPathTurn)
        //   Waze uses the LOCAL turn at the connecting node (lastPathSeg → toSeg) as the
        //   instruction for the path exit — same as a regular node turn at that point —
        //   unless the Path itself carries an instructionOpCode override.
        //   Display angle = lastPathAngle → exitAngle (local connecting-node angle).
        //   Type = ja_guess_routing_instruction at the connecting node (regular road junction;
        //   no JB restriction interference, so full BC/KEEP/EXIT/TURN classification works).
        //
        // JUNCTION BOX TURNS (isJunctionBoxTurn)
        //   DISPLAY ANGLE — n-step walk (mirrors Waze instruction selection):
        //   Walk every node in pathSegs from entry to connecting. Use the first node
        //   where |angle| ≥ TURN_ANGLE threshold (~44°) — that is the node where Waze
        //   fires the routing instruction. Fall back to the connecting-node angle (step2)
        //   if no node clears the threshold (all straight/BC → instruction is BC).
        //
        //   Case A: entry node angle ≥ 44° → use it (walk breaks at i=0)
        //   Case B: connecting node angle ≥ 44° → use it (walk reaches last i)
        //   Case C: intermediate node angle ≥ 44° → use it (walk breaks at i=1..N-2)
        //           e.g. at-grade connector entering a JB: BC entry → LT middle → BC exit
        //   Fallback: all nodes < 44° → step2 (connecting node, BC instruction)
        //
        //   Display angle and type always use the same selected turnAngle.
        //
        //   TYPE CLASSIFICATION — ja_guess_routing_instruction at the connecting node (first),
        //   falling back to angle-based thresholds only when it returns NO_TURN:
        //   • The path validity walk (above) already confirmed lastPathSeg→toSeg is allowed at
        //     the connecting node, so ja_guess_routing_instruction gives a valid classification.
        //   • NO_TURN from ja_guess indicates a JB-forced internal restriction at that node.
        //     Angle-based thresholds (U_TURN / PROBLEM / TURN / BC) give the best fallback.
        //
        // Override check (turn.instructionOpCode) is tried first for both types.

        var turnAngle;
        if (turn.isPathTurn) {
          // Local connecting-node angle — what Waze uses for the path exit instruction.
          // Always unique per exit because each exit segment has a different departure bearing.
          turnAngle = (lastPathAngle != null)
            ? ja_angle_diff(lastPathAngle, exitAngle, false)
            : ja_angle_diff(entryAngle, exitAngle, false); // fallback if lastPathAngle unavailable
        } else {
          // JB: n-step walk — scan every node in the path from entry to connecting.
          // Use the first node where |angle| >= TURN_ANGLE threshold (~44°), which is
          // the node where Waze fires the routing instruction. Fall back to the connecting
          // node angle (step2) if no node clears the threshold.
          //
          // This generalises the old 2-step (entry / connecting) to handle paths with
          // intermediate turns — e.g. a 3-node JB where the real left/right turn is at
          // the middle node while both the entry and connecting nodes are straight (BC).
          //
          // pathSegs = [fromSeg, segmentPath[0], …, segmentPath[last], toSeg]
          // — already built and validated by the restriction walk above.
          //
          // Default to step2 (connecting node); overwritten below if an earlier node
          // produces a non-BC angle.
          turnAngle = (lastPathAngle != null)
            ? ja_angle_diff(lastPathAngle, exitAngle, false)
            : ja_angle_diff(entryAngle, firstExitAngle, false); // last-resort if connecting segs unloaded
          for (var ni = 0; ni < pathSegs.length - 1; ni++) {
            var niNodeId  = ja_get_connecting_node(pathSegs[ni], pathSegs[ni + 1]);
            if (niNodeId == null) continue;
            var niInAngle  = ja_getAngle(niNodeId, pathSegs[ni]);
            var niOutAngle = ja_getAngle(niNodeId, pathSegs[ni + 1]);
            if (niInAngle == null || niOutAngle == null) continue;
            var niAngle = ja_angle_diff(niInAngle, niOutAngle, false);
            if (Math.abs(niAngle) >= TURN_ANGLE - GRAY_ZONE) {
              turnAngle = niAngle;
              break;
            }
          }
        }

        var farTurnType;
        if (ja_getOption('guess')) {
          var opcode = turn.instructionOpCode || null;
          if (opcode) {
            switch (opcode) {
              case 'NONE':       farTurnType = ja_routing_type.OverrideBC;         break;
              case 'CONTINUE':   farTurnType = ja_routing_type.OverrideCONTINUE;   break;
              case 'TURN_LEFT':  farTurnType = ja_routing_type.OverrideTURN_LEFT;  break;
              case 'TURN_RIGHT': farTurnType = ja_routing_type.OverrideTURN_RIGHT; break;
              case 'KEEP_LEFT':  farTurnType = ja_routing_type.OverrideKEEP_LEFT;  break;
              case 'KEEP_RIGHT': farTurnType = ja_routing_type.OverrideKEEP_RIGHT; break;
              case 'EXIT_LEFT':  farTurnType = ja_routing_type.OverrideEXIT_LEFT;  break;
              case 'EXIT_RIGHT': farTurnType = ja_routing_type.OverrideEXIT_RIGHT; break;
              case 'UTURN':      farTurnType = ja_routing_type.OverrideU_TURN;     break;
              default:           opcode = null; break; // unrecognised — fall through
            }
          }
          if (!opcode) {
            if (turn.isPathTurn) {
              // Path: use ja_guess_routing_instruction at the connecting node.
              // Both lastPathSeg and toSeg connect there; ja_is_turn_allowed works on
              // regular road nodes (no JB restriction interference).
              var connectingNode_obj = sdk.DataModel.Nodes.getById({ nodeId: connectingNodeId });
              var connectingAngles = [];
              if (connectingNode_obj) {
                connectingNode_obj.connectedSegmentIds.forEach(function (cSegId) {
                  var cSeg = sdk.DataModel.Segments.getById({ segmentId: cSegId });
                  var cAngle = ja_getAngle(connectingNodeId, cSeg);
                  if (cAngle != null) { // skip segments not yet loaded in model
                    connectingAngles.push([cAngle, cSegId, false]);
                  }
                });
              }
              farTurnType = connectingNode_obj
                ? ja_guess_routing_instruction(connectingNode_obj, lastPathSegId, turn.toSegmentId, connectingAngles)
                : ja_routing_type.TURN;
            } else {
              // JB: try ja_guess_routing_instruction at the connecting node first.
              // The path validity walk already confirmed lastPathSeg→toSeg is allowed
              // at this node, so ja_is_turn_allowed returns true and the full
              // BC/KEEP/EXIT/TURN classification runs correctly.
              // Fall back to angle-based only when the result is NO_TURN — which
              // indicates the connecting node has a JB internal restriction on that
              // turn pair (forced blocking to route traffic through the JB framework).
              var jbConnNode_obj = sdk.DataModel.Nodes.getById({ nodeId: connectingNodeId });
              var jbConnAngles = [];
              if (jbConnNode_obj) {
                jbConnNode_obj.connectedSegmentIds.forEach(function (cSegId) {
                  var cSeg = sdk.DataModel.Segments.getById({ segmentId: cSegId });
                  var cAngle = ja_getAngle(connectingNodeId, cSeg);
                  if (cAngle != null) {
                    jbConnAngles.push([cAngle, cSegId, false]);
                  }
                });
                var jbGuessed = ja_guess_routing_instruction(jbConnNode_obj, lastPathSegId, turn.toSegmentId, jbConnAngles);
                // Use the ja_guess result UNLESS it says BC while the display angle is a
                // real turn. This catches Case C (intermediate-node turn): the connecting
                // node turn is genuinely BC (allowed, but straight), so ja_guess correctly
                // returns BC — but the instruction fires at an earlier node with a large
                // angle. Trusting BC here would produce a white marker for a left/right turn.
                var jbGuessBcConflict = jbGuessed === ja_routing_type.BC
                  && Math.abs(turnAngle) >= TURN_ANGLE - GRAY_ZONE;
                if (jbGuessed !== ja_routing_type.NO_TURN && !jbGuessBcConflict) {
                  farTurnType = jbGuessed;
                }
              }
              // Angle-based fallback: used when ja_guess returns NO_TURN (JB internal
              // restriction at connecting node), when the BC-conflict override fires
              // (Case C intermediate turn), or when connectingNode is not loaded.
              if (!farTurnType) {
                var absAngle = Math.abs(turnAngle);
                if (absAngle > U_TURN_ANGLE + GRAY_ZONE) {
                  farTurnType = ja_routing_type.U_TURN;
                } else if (absAngle > U_TURN_ANGLE - GRAY_ZONE) {
                  farTurnType = ja_routing_type.PROBLEM;
                } else if (absAngle >= TURN_ANGLE - GRAY_ZONE) {
                  farTurnType = ja_routing_type.TURN;
                } else {
                  farTurnType = ja_routing_type.BC;
                }
              }
            }
          }
        } else {
          farTurnType = ja_routing_type.TURN;
        }

        ja_log('[FAR-TURNS] Drawing far turn ' + turn.id
          + ' type=' + farTurnType
          + ' instructionAngle=' + turnAngle
          + ' opcode=' + (turn.instructionOpCode || 'none')
          + ' from=' + turn.fromSegmentId
          + ' to=' + turn.toSegmentId
          + ' exitNode=' + connectingNodeId, 2);

        // PLACEMENT: anchor the label where the exit segment crosses the JB polygon boundary
        // (for JB turns) or at the connecting node (for path turns / fallback).
        //
        // Why the boundary crossing? WME shows the exit turn arrow exactly where the exit
        // segment leaves the junction box polygon — that is the visual cue editors use.
        // Placing JAI's angle label at the same point keeps it spatially consistent.
        //
        // ha = the exit segment's departure bearing, used to push the label outward along
        // the road away from the boundary — same convention as regular node markers.

        var connectingNode = sdk.DataModel.Nodes.getById({ nodeId: connectingNodeId });
        if (connectingNode == null) {
          ja_log('[FAR-TURNS] Skipping far turn ' + turn.id + ' — connectingNode not found', 1);
          return;
        }

        // markerAnchor is the geometry object passed to ja_draw_marker() as the "node".
        // It provides coordinates for the arrow line origin and collision avoidance.
        // Default to connectingNode; overridden to the JB boundary crossing for JB turns.
        var markerAnchor = connectingNode;

        if (turn.isJunctionBoxTurn) {
          // Find the BigJunction whose segmentIds includes the first intermediate segment.
          // All segmentPath entries belong to the same BigJunction, so checking [0] is enough.
          var bigJunction = null;
          var allBigJunctions = sdk.DataModel.BigJunctions.getAll();
          for (var bji = 0; bji < allBigJunctions.length; bji++) {
            if (allBigJunctions[bji].segmentIds.indexOf(turn.segmentPath[0]) !== -1) {
              bigJunction = allBigJunctions[bji];
              break;
            }
          }

          if (bigJunction != null) {
            // Find where the exit segment crosses the JB polygon boundary.
            // turf.lineIntersect returns a FeatureCollection of Point features at each crossing.
            var exitLine = turf.lineString(toSeg.geometry.coordinates);
            var intersections = turf.lineIntersect(exitLine, turf.polygon(bigJunction.geometry.coordinates));

            if (intersections.features.length > 0) {
              // There may be multiple crossings if the exit segment re-enters the polygon.
              // Use the crossing closest to the connecting node (inside → outside transition).
              var connectingPt = turf.point(connectingNode.geometry.coordinates);
              var closestPt = intersections.features.reduce(function (best, candidate) {
                return turf.distance(candidate, connectingPt) < turf.distance(best, connectingPt)
                  ? candidate : best;
              });

              // Wrap the crossing point as a synthetic anchor object for ja_draw_marker().
              // ja_draw_marker only reads .geometry.coordinates from the node arg — it does
              // not need a real SDK Node object.
              markerAnchor = { geometry: closestPt.geometry };
              ja_log('[FAR-TURNS] Using JB boundary crossing for far turn ' + turn.id
                + ' at ' + JSON.stringify(closestPt.geometry.coordinates), 2);
            } else {
              ja_log('[FAR-TURNS] No JB boundary crossing found for far turn ' + turn.id + ' — falling back to connectingNode', 2);
            }
          } else {
            ja_log('[FAR-TURNS] BigJunction not found for far turn ' + turn.id + ' — falling back to connectingNode', 2);
          }
        }

        // Compute label distance corrected for latitude at the anchor point.
        // ja_label_distance is the raw (uncorrected) value from ja_compute_label_distance().
        // We apply cos(lat) once here using the anchor's latitude — more accurate than using
        // the entry node's latitude since the marker is placed at the JB boundary or connecting node.
        var anchorLat = markerAnchor.geometry.coordinates[1];
        var exitJaLd = ja_label_distance * Math.cos((anchorLat * Math.PI) / 180);

        var ha = exitAngle; // offset outward along the exit segment's departure direction

        // Apply the same extra-space multiplier used for regular node markers so that
        // far turn labels don't land on top of the WME turn arrows.
        //   • Sharp angles (|turnAngle| > 120°): marker would sit inside a tight arc — push out.
        //   • ha in 40°–120° quadrant: upper-right bearing where display is visually compressed.
        // Either condition doubles the offset; they do not stack beyond 2×.
        // To adjust: change the threshold or multiplier values here and in the equivalent
        // block in ja_draw_node_markers() (lines ~642–661) to keep them in sync.
        var ja_extra_space_multiplier = 1;
        if (Math.abs(turnAngle) > 120) {
          ja_extra_space_multiplier = 2;
        }
        if (ha > 40 && ha < 120) {
          ja_extra_space_multiplier = 2;
        }

        var point = turf.destination(
          turf.point(markerAnchor.geometry.coordinates),
          (ja_extra_space_multiplier * exitJaLd) / 1000,
          (90 - ha + 360) % 360
        ).geometry;

        ja_draw_marker(point, markerAnchor, exitJaLd, turnAngle, ha, true, farTurnType, true);
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
    if (ja_type === ja_routing_type.U_TURN || ja_type === ja_routing_type.NO_U_TURN) return ja_getOption('uTurnInstructionColor');
    if (ja_type === ja_routing_type.NO_TURN) return ja_getOption('noTurnColor');
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
        // Square shape for far-turn markers (JB/Path turns) — distinguishes them from
        // regular node-turn circles without interfering with outline color.
        // circle = regular turn, square = far turn (exit is not at this node)
        if (!props || props.ja_type === 'arrow_line' || props.ja_type === 'roundaboutOverlay') {
          return 'circle';
        }
        return props.ja_is_far_turn ? 'square' : 'circle';
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
    jaTabPane.appendChild(uturnsCard.card);

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
        if (payload.dataModelName === 'segments') {
          ja_calculate();
        }
      },
    });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-removed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'segments') {
          ja_calculate();
        }
      },
    });

    sdk.Events.trackDataModelEvents({ dataModelName: 'nodes' });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-changed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'nodes') {
          ja_calculate();
        }
      },
    });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-removed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'nodes') {
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
    //
    // Note: Path turns (isPathTurn) are stored as part of the Turns data model, not
    // as a separate BigJunctions-style model. Path edits will trigger a re-render
    // naturally when the user reselects — adding 'turns' tracking here would work too
    // but may fire too broadly. Revisit if live path-edit updates are needed.
    sdk.Events.trackDataModelEvents({ dataModelName: 'bigJunctions' });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-changed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'bigJunctions') {
          ja_calculate();
        }
      },
    });
    sdk.Events.on({
      eventName: 'wme-data-model-objects-removed',
      eventHandler: function (payload) {
        if (payload.dataModelName === 'bigJunctions') {
          ja_calculate();
        }
      },
    });

    sdk.Events.on({ eventName: 'wme-map-zoom-changed', eventHandler: ja_calculate });
    sdk.Events.on({
      eventName: 'wme-map-move-end',
      eventHandler: function () {
        if (sdk.Map.getZoomLevel() >= MIN_ZOOM_LEVEL && ja_getOption('roundaboutOverlayDisplay') === 'rOverAlways') {
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
      sdk.Map.setLayerVisibility({ layerName: 'junction_angles', visibility: ja_layer_visible });
      sdk.LayerSwitcher.setLayerCheckboxChecked({ name: 'Junction Angle Info', isChecked: ja_layer_visible });
      var btn = jaTabLabel.querySelector('#ja-power-btn');
      if (btn) {
        btn.style.color = ja_layer_visible ? '#00bd00' : '#ccc';
      }
    }

    // ── Layer visibility checkbox ─────────────────────────────────────
    sdk.LayerSwitcher.addLayerCheckbox({ name: 'Junction Angle Info', isChecked: true });
    sdk.Events.on({
      eventName: 'wme-layer-checkbox-toggled',
      eventHandler: function (evt) {
        if (evt.name === 'Junction Angle Info') {
          ja_setLayerEnabled(evt.checked);
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

    ja_apply();
    ja_calculate();
  }

  junctionangle_init();
})();
