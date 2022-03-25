/** Benchmark intersection methods **/
import { announceBenchGroup,
				 benchmarkLoopFn,
				 benchmarkLoop } from "./bench_api.js";

import { Intersections, IntersectionSetup } from "../scripts/Intersections.js";
import { IntersectionsSort } from "../scripts/IntersectionsSort.js";

import { IntersectionsWASM_f64,
         IntersectionsSortWASM_f64,
         IntersectionsWASM_i32,
         IntersectionsSortWASM_i32 } from "../scripts/IntersectionsWASM.js";

import { OrderedPolygonEdge } from "../scripts/OrderedPolygonEdge.js";

export function BenchRandomIntersections(N = 10, { include_wasm = true, max_coords = 5000 } = {}) {
  // setup
	const segments1 = OrderedPolygonEdge.randomEdges(N, max_coords);
	const segments2 = OrderedPolygonEdge.randomEdges(N, max_coords);

	const alt_brute = IntersectionSetup();

  return async function run() {
		announceBenchGroup("Intersections");
		await benchmarkLoop(N, Intersections, "single", segments1);
		await benchmarkLoop(N, Intersections, "double", segments1, segments2);
		await benchmarkLoopFn(N, alt_brute, "alt brute single", segments1);

		announceBenchGroup("Intersections Sort");
		await benchmarkLoop(N, IntersectionsSort, "single", segments1);
		await benchmarkLoop(N, IntersectionsSort, "double", segments1, segments2);

		if(include_wasm) {
			announceBenchGroup("Intersections WASM f64");
			await benchmarkLoop(N, IntersectionsWASM_f64, "single", segments1);
			await benchmarkLoop(N, IntersectionsWASM_f64, "double", segments1, segments2);

			announceBenchGroup("Intersections Sort WASM f64");
			await benchmarkLoop(N, IntersectionsSortWASM_f64, "single", segments1);
			await benchmarkLoop(N, IntersectionsSortWASM_f64, "double", segments1, segments2);

			announceBenchGroup("Intersections WASM i32");
			await benchmarkLoop(N, IntersectionsWASM_i32, "single", segments1);
			await benchmarkLoop(N, IntersectionsWASM_i32, "double", segments1, segments2);

			announceBenchGroup("Intersections Sort WASM i32");
			await benchmarkLoop(N, IntersectionsSortWASM_i32, "single", segments1);
			await benchmarkLoop(N, IntersectionsSortWASM_i32, "double", segments1, segments2);
		}
  }
}

export function BenchIntersectionsPlan() {
	announceBenchGroup("Random Segments x10")
	const b10 = BenchRandomIntersections(10);
	b10();

	announceBenchGroup("Random Segments x100")
	const b100 = BenchRandomIntersections(100);
	b100();

	announceBenchGroup("Random Segments x1000")
	const b1000 = BenchRandomIntersections(1000);
	b1000();
}