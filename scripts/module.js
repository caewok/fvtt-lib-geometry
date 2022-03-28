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

To bench:
benchmarking = game.modules.get(`libgeometry`).benchmarking;
await benchmarking.BenchIntersectionsPlan();

Or:
benchmarking = game.modules.get(`libgeometry`).benchmarking;
b1000 = benchmarking.BenchRandomIntersections(1000);
b1000()

orient1000 = benchmarking.BenchLine(1000)
await orient1000()

*/

'use strict';
export const MODULE_ID = 'libgeometry';

import { Intersections, IntersectionSetup } from "./Intersections.js";
import { IntersectionsSort } from "./IntersectionsSort.js";
import { IntersectionsWASM_f64,
         IntersectionsSortWASM_f64,
         IntersectionsWASM_i32,
         IntersectionsSortWASM_i32,
         IntersectionWASMFast_f64 } from "./IntersectionsWASM.js";

import { OrderedPolygonEdge } from "./OrderedPolygonEdge.js";

import { TestIntersections, TestIntersectionsWASM } from "../tests/Intersections.test.js";

import { BenchRandomIntersections, BenchIntersectionsPlan } from "../benchmarks/BenchIntersections.bench.js";
import { BenchLine } from "../benchmarks/BenchWASMLine.bench.js";

// WASM code
import initWASMLine from "../wasm_line/intersections_line.js";
import * as WASMLine from "../wasm_line/intersections_line.js";




Hooks.once('init', async function() {
	initWASMLine();

  game.modules.get(MODULE_ID).api = {


    Intersections: Intersections,
    IntersectionSetup: IntersectionSetup,
    IntersectionsSort: IntersectionsSort,
    OrderedPolygonEdge: OrderedPolygonEdge,

    // WASM functions
    WASMLine: WASMLine,
    IntersectionsWASM_f64: IntersectionsWASM_f64,
    IntersectionsSortWASM_f64: IntersectionsSortWASM_f64,
    IntersectionsWASM_i32: IntersectionsWASM_i32,
    IntersectionsSortWASM_i32: IntersectionsSortWASM_i32,
    IntersectionWASMFast_f64: IntersectionWASMFast_f64,

    // WASM instance
    WASMLineInstance: await WASMLine.default(),
  };

  game.modules.get(MODULE_ID).testing = {
		TestIntersections: TestIntersections,
		TestIntersectionsWASM: TestIntersectionsWASM,
  };

  game.modules.get(MODULE_ID).benchmarking = {
		BenchRandomIntersections: BenchRandomIntersections,
		BenchIntersectionsPlan: BenchIntersectionsPlan,
		BenchLine: BenchLine,
  };
});