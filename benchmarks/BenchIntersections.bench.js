/** Benchmark intersection methods **/
import { announceBenchGroup,
				 benchmarkLoopFn,
				 benchmarkLoop } from "./bench_api.js";

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
	const segments1 = OrderedPolygonEdge.randomEdges(N, max_coords);
	const segments2 = OrderedPolygonEdge.randomEdges(N, max_coords);

	const alt_brute = IntersectionSetup();
  const instance = game.modules.get(`libgeometry`).api.WASMLineInstance;


  return async function run() {
		announceBenchGroup(`Intersections ${N} segments`);
		await benchmarkLoop(iter, Intersections, "single", segments1);
		await benchmarkLoop(iter, Intersections, "double", segments1, segments2);
		await benchmarkLoopFn(iter, alt_brute, "alt brute single", segments1);

		announceBenchGroup(`Intersections Sort ${N} segments`);
		await benchmarkLoop(iter, IntersectionsSort, "single", segments1);
		await benchmarkLoop(iter, IntersectionsSort, "double", segments1, segments2);

		if(include_wasm) {
			announceBenchGroup(`Intersections WASM f64 ${N} segments`);
			await benchmarkLoop(iter, IntersectionsWASM_f64, "single", segments1);
			await benchmarkLoop(iter, IntersectionsWASM_f64, "double", segments1, segments2);

			announceBenchGroup(`Intersections WASM f64 ${N} segments`);
			await benchmarkLoop(iter, IntersectionWASMFast_f64, "single", segments1, instance);
// 			await benchmarkLoop(iter, IntersectionsWASM_f64, "double", segments1, segments2);

			announceBenchGroup(`Intersections Sort WASM f64 ${N} segments`);
			await benchmarkLoop(iter, IntersectionsSortWASM_f64, "single", segments1);
			await benchmarkLoop(iter, IntersectionsSortWASM_f64, "double", segments1, segments2);

			announceBenchGroup(`Intersections Sort WASM f64 ${N} segments (unordered)`);
			await benchmarkLoop(iter, IntersectionsSortWASM_f64, "single", segments1, { ordered: false });
			await benchmarkLoop(iter, IntersectionsSortWASM_f64, "double", segments1, segments2, { ordered: false });

			announceBenchGroup(`Intersections WASM i32 ${N} segments`);
			await benchmarkLoop(iter, IntersectionsWASM_i32, "single", segments1);
			await benchmarkLoop(iter, IntersectionsWASM_i32, "double", segments1, segments2);

			announceBenchGroup(`Intersections Sort WASM i32 ${N} segments`);
			await benchmarkLoop(iter, IntersectionsSortWASM_i32, "single", segments1);
			await benchmarkLoop(iter, IntersectionsSortWASM_i32, "double", segments1, segments2);

			announceBenchGroup(`Intersections Sort WASM i32 ${N} segments (unordered)`);
			await benchmarkLoop(iter, IntersectionsSortWASM_i32, "single", segments1, { ordered: false });
			await benchmarkLoop(iter, IntersectionsSortWASM_i32, "double", segments1, segments2, { ordered: false });


		}
  }
}

export async function BenchIntersectionsPlan() {
	announceBenchGroup("Random Segments x10")
	const b10 = BenchRandomIntersections(10);
	await b10();

	announceBenchGroup("Random Segments x100")
	const b100 = BenchRandomIntersections(100);
	await b100();

	announceBenchGroup("Random Segments x1000")
	const b1000 = BenchRandomIntersections(1000);
	await b1000();
}