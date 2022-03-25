/** Intersection class: methods to intersect multiple segments or other objects **/
/* globals
foundry
*/

'use strict';

import { Intersections } from "./Intersections.js";
import * as WASMLine from "../wasm_line/intersections_line.js";

class IntersectionsWASM extends Intersections {

 /**
  * Construct a comparable report to what would be expected for JS versions.
  * From the returned WASM array, extract the components.
  * @param {Array} wasm_ixs 			Fixed array containing [ix.x, ix.y, i, j]
  * @param {Segment[]} segments1 	Array of segments used in the sort.
  * @param {Segment[]} segments2	Array of segments used in the sort.
  * @return {Object[]} Array of reporting objects from this.reportIntersection
  */
	static _reportWASMSegments(wasm_ixs, segments1, segments2) {
		const report = [];
		const ln = wasm_ixs.length;
		for(let i = 0; i < ln; i += 4) {
			const ix = { x: wasm_ixs[i], y: wasm_ixs[i + 1] };
			const idx_i = wasm_ixs[i + 2];
			const idx_j = wasm_ixs[i + 3];
			report.push(this.reportIntersection(ix, idx_i, idx_j, segments1[idx_i], segments2[idx_j]));
		}
		return report;
	}

 /**
  * WASM methods use specific test for intersection that, at the moment, cannot
  * be overridden using Javascript functions.
  * TO-DO: Provide some optional flags that allow for common scenarios, like ignoring
  * endpoints.
  */
  static testForIntersection(s1, s2) {
  	console.warn("testForIntersection not implemented for WASM intersections.")
  }
}

export class IntersectionsWASM_f64 extends IntersectionsWASM {
 /**
  * Brute method that tests every segment in an array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static single(segments) {
    const wasm_segments = new Float64Array(segments.length * 4);
    segments.forEach((s, idx) => wasm_segments.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));
    const wasm_ixs = WASMLine.brute_f64(wasm_segments);
    return this._reportWASMSegments(wasm_ixs, segments, segments);
  }

 /**
  * Brute method that tests every segment in an array against every segment in a second
  * array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static double(segments1, segments2) {
    const wasm_segments1 = new Float64Array(segments1.length * 4);
    const wasm_segments2 = new Float64Array(segments2.length * 4);
    segments1.forEach((s, idx) => wasm_segments1.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));
    segments2.forEach((s, idx) => wasm_segments2.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));

    const wasm_ixs = WASMLine.brute_double_f64(wasm_segments1, wasm_segments2);
    return this._reportWASMSegments(wasm_ixs, segments1, segments2);
  }
}

export class IntersectionsSortWASM_f64 extends IntersectionsWASM {
 /**
  * Brute method that tests every segment in an array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static single(segments) {
    const wasm_segments = new Float64Array(segments.length * 4);
    segments.forEach((s, idx) => wasm_segments.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));
    const wasm_ixs = WASMLine.sort_f64(wasm_segments, true, false); // ordered, sorted
    return this._reportWASMSegments(wasm_ixs, segments, segments);
  }

 /**
  * Brute method that tests every segment in an array against every segment in a second
  * array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static double(segments1, segments2) {
    const wasm_segments1 = new Float64Array(segments1.length * 4);
    const wasm_segments2 = new Float64Array(segments2.length * 4);
    segments1.forEach((s, idx) => wasm_segments1.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));
    segments2.forEach((s, idx) => wasm_segments2.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));

    const wasm_ixs = WASMLine.sort_double_f64(wasm_segments1, wasm_segments2, true, false);
    return this._reportWASMSegments(wasm_ixs, segments1, segments2);
  }
}

export class IntersectionsWASM_i32 extends IntersectionsWASM {
 /**
  * Brute method that tests every segment in an array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static single(segments) {
    const wasm_segments = new Int32Array(segments.length * 4);
    segments.forEach((s, idx) => wasm_segments.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));
    const wasm_ixs = WASMLine.brute_i32(wasm_segments);
    return this._reportWASMSegments(wasm_ixs, segments, segments);
  }

 /**
  * Brute method that tests every segment in an array against every segment in a second
  * array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static double(segments1, segments2) {
    const wasm_segments1 = new Int32Array(segments1.length * 4);
    const wasm_segments2 = new Int32Array(segments2.length * 4);
    segments1.forEach((s, idx) => wasm_segments1.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));
    segments2.forEach((s, idx) => wasm_segments2.set([s.A.x, s.A.y, s.B.x, s.B.y], idx * 4));

    const wasm_ixs = WASMLine.brute_double_i32(wasm_segments1, wasm_segments2);
    return this._reportWASMSegments(wasm_ixs, segments1, segments2);
  }
}

export class IntersectionsSortWASM_i32 extends IntersectionsWASM {
 /**
  * Brute method that tests every segment in an array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static single(segments) {
    const wasm_segments = new Int32Array(segments.length * 4);
    segments.forEach((s, idx) => wasm_segments.set([s.nw.x, s.nw.y, s.se.x, s.se.y], idx * 4));
    const wasm_ixs = WASMLine.sort_i32(wasm_segments, true, false);
    return this._reportWASMSegments(wasm_ixs, segments, segments);
  }

 /**
  * Brute method that tests every segment in an array against every segment in a second
  * array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static double(segments1, segments2) {
    const wasm_segments1 = new Int32Array(segments1.length * 4);
    const wasm_segments2 = new Int32Array(segments2.length * 4);
    segments1.forEach((s, idx) => wasm_segments1.set([s.nw.x, s.nw.y, s.se.x, s.se.y], idx * 4));
    segments2.forEach((s, idx) => wasm_segments2.set([s.nw.x, s.nw.y, s.se.x, s.se.y], idx * 4));

    const wasm_ixs = WASMLine.sort_double_i32(wasm_segments1, wasm_segments2, true, false);
    return this._reportWASMSegments(wasm_ixs, segments1, segments2);
  }
}




