/* globals
Hooks,
game
*/

/*
api = game.modules.get(`libgeometry`).api

To test:
testing = game.modules.get(`libgeometry`).testing
testing.TestIntersections()
testing.TestIntersectionsWASM()


*/

'use strict';
export const MODULE_ID = 'libgeometry';

import { Intersections } from "./Intersections.js";
import { IntersectionsSort } from "./IntersectionsSort.js";
import { IntersectionsWASM_f64,
         IntersectionsSortWASM_f64,
         IntersectionsWASM_i32,
         IntersectionsSortWASM_i32 } from "./IntersectionsWASM.js";

import { OrderedPolygonEdge } from "./OrderedPolygonEdge.js";

import { TestIntersections, TestIntersectionsWASM } from "../tests/Intersections.test.js";

// WASM code
import initWASMLine from "../wasm_line/intersections_line.js";
import * as WASMLine from "../wasm_line/intersections_line.js";


Hooks.once('init', async function() {
	initWASMLine();

  game.modules.get(MODULE_ID).api = {
    Intersections: Intersections,
    IntersectionsSort: IntersectionsSort,
    OrderedPolygonEdge: OrderedPolygonEdge,

    // WASM functions
    WASMLine: WASMLine,
    IntersectionsWASM_f64: IntersectionsWASM_f64,
    IntersectionsSortWASM_f64: IntersectionsSortWASM_f64,
    IntersectionsWASM_i32: IntersectionsWASM_i32,
    IntersectionsSortWASM_i32: IntersectionsSortWASM_i32,
  };

  game.modules.get(MODULE_ID).testing = {
		TestIntersections: TestIntersections,
		TestIntersectionsWASM: TestIntersectionsWASM,
  };

  game.modules.get(MODULE_ID).benchmarking = {

  };
});