/** Benchmark basic WASM methods **/
/* globals
foundry

*/

import { announceBenchGroup,
         benchmarkLoopFn,
         benchmarkLoop,
         randomPoint } from "./bench_api.js";

import * as WASMLine from "../wasm_line/intersections_line.js";

function orientPoints(pts) {
  return pts.forEach(pt => foundry.utils.orient2dFast(pt.a, pt.b, pt.c));
}

function orientPointsWASM_i32(pts) {
  return pts.forEach(pt => WASMLine.orient2d_i32_js(pt.a.x, pt.a.y, pt.b.x, pt.b.y, pt.c.x, pt.c.y));
}

function orientPointsWASM_f64(pts) {
  return pts.forEach(pt => WASMLine.orient2d_f64_js(pt.a.x, pt.a.y, pt.b.x, pt.b.y, pt.c.x, pt.c.y));
}


export function BenchLine(N = 100, { include_wasm = true, max_coords = 5000 } = {}) {
  // setup
  const pts = [];
  for(let i = 0; i < N; i += 1) {
    pts.push({a: randomPoint(max_coords), b: randomPoint(max_coords), c: randomPoint(max_coords)});
  }

  return async function run() {
    announceBenchGroup("Line");
    await benchmarkLoopFn(N, orientPoints, "orient2d", pts);

    if(include_wasm) {
      announceBenchGroup("WASM");
      await benchmarkLoopFn(N, orientPointsWASM_i32, "orient2d_wasm_i32", pts);
      await benchmarkLoopFn(N, orientPointsWASM_f64, "orient2d_wasm_f64", pts);
    }
  };

}