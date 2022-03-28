/** Benchmark intersection methods **/
/* globals
game
*/


import { announceBenchGroup,
         spacer,
         QBenchmarkLoop,
         QBenchmarkLoopFn } from "./bench_api.js";

import { Intersections, IntersectionSetup } from "../scripts/Intersections.js";
import { IntersectionsSort } from "../scripts/IntersectionsSort.js";

import { IntersectionsWASM_f64,
         IntersectionsSortWASM_f64,
         IntersectionsWASM_i32,
         IntersectionsSortWASM_i32,
         IntersectionWASMFast_f64 } from "../scripts/IntersectionsWASM.js";

import { OrderedPolygonEdge } from "../scripts/OrderedPolygonEdge.js";

export function BenchRandomIntersections(N = 10, { include_wasm = true, max_coords = 5000, iter = 100 } = {}) {
  // setup

  const alt_brute = IntersectionSetup();
  const instance = game.modules.get(`libgeometry`).api.WASMLineInstance;

  const setup_single = ({n, max_coords}) => { return [OrderedPolygonEdge.randomEdges(n, max_coords)]; };
  const setup_double = ({n, max_coords}) => { return [OrderedPolygonEdge.randomEdges(n, max_coords), OrderedPolygonEdge.randomEdges(n, max_coords)]; };
  const setup_args = {n: N, max_coords: max_coords};

  return function run() {
    announceBenchGroup(`Intersections ${N} segments`);
    QBenchmarkLoop(iter, setup_single, Intersections, "single", setup_args);
    QBenchmarkLoop(iter, setup_double, Intersections, "double", setup_args);
    QBenchmarkLoopFn(iter, setup_single, alt_brute, "alt brute single", setup_args);

    spacer();
    QBenchmarkLoop(iter, setup_single, IntersectionsSort, "single", setup_args);
    QBenchmarkLoop(iter, setup_double, IntersectionsSort, "double", setup_args);

    if(include_wasm) {
      announceBenchGroup(`WASM versions`);
      QBenchmarkLoop(iter, setup_single, IntersectionsWASM_f64, "single", setup_args);
      QBenchmarkLoop(iter, setup_double, IntersectionsWASM_f64, "double", setup_args);

      spacer();
      QBenchmarkLoop(iter, setup_single, IntersectionWASMFast_f64, "single", setup_args, instance);

      spacer();
      QBenchmarkLoop(iter, setup_single, IntersectionsWASM_i32, "single", setup_args);
      QBenchmarkLoop(iter, setup_double, IntersectionsWASM_i32, "double", setup_args);

      spacer();
      QBenchmarkLoop(iter, setup_single, IntersectionsSortWASM_f64, "single", setup_args);
      QBenchmarkLoop(iter, setup_double, IntersectionsSortWASM_f64, "double", setup_args);

      spacer();
      QBenchmarkLoop(iter, setup_single, IntersectionsSortWASM_i32, "single", setup_args);
      QBenchmarkLoop(iter, setup_double, IntersectionsSortWASM_i32, "double", setup_args);

      announceBenchGroup(`WASM versions unordered`);
      QBenchmarkLoop(iter, setup_single, IntersectionsSortWASM_f64, "single", setup_args, { ordered: false });
      QBenchmarkLoop(iter, setup_double, IntersectionsSortWASM_f64, "double", setup_args, { ordered: false });

      spacer();
      QBenchmarkLoop(iter, setup_single, IntersectionsSortWASM_i32, "single", setup_args, { ordered: false });
      QBenchmarkLoop(iter, setup_double, IntersectionsSortWASM_i32, "double", setup_args, { ordered: false });

    }
  };
}

export async function BenchIntersectionsPlan() {
  announceBenchGroup("Random Segments x10");
  const b10 = BenchRandomIntersections(10);
  b10();

  announceBenchGroup("Random Segments x100");
  const b100 = BenchRandomIntersections(100);
  b100();

  announceBenchGroup("Random Segments x1000");
  const b1000 = BenchRandomIntersections(1000);
  b1000();
}