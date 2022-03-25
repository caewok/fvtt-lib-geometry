/** Extend the PolygonEdge class to order the walls **/

/* globals
PolygonEdge,
CONST,
*/
'use strict';

import { compareXY } from "./util.js";
import { randomPoint } from "../benchmarks/bench_api.js";

/**
 * The Wall class is only really useful if you intend to build a wall—--it is overkill
 * otherwise. This extension provides for ordered A and B by northwest to southeast, as
 * does the Wall class.
 *
 * Note that changing A or B after construction may result in incorrect _nw and _se values.
 * To avoid this, one would have to either:
 * a. Track any changes to the underlying A and B vertices, even if implicitly done by
 *    getting the vertex and then changing the referenced coordinates; or
 * b. Forcing _nw and _se to be calculated every time, not cached.
 *
 * See https://jsbench.me/5ml157u7e8/2 for performance tradeoffs and Wall.js for details.
 *
 */
export class OrderedPolygonEdge extends PolygonEdge {
	constructor(a, b, type=CONST.WALL_SENSE_TYPES.NORMAL, wall) {
		super(a, b, type, wall);

		// Used to orient the A and B points by northwest versus southeast.
		this._nw = undefined;
		this._se = undefined;
	}

 /**
  * Add getter methods to retrieve the northwest and southeast endpoint from the segment.
  * Assists with testing for intersections between walls, or between walls and other
  * segment-like objects.
  */
	get nw() {
		return this._nw || (() => {
			const is_nw = compareXY(this.A, this.B) < 0;
			this._nw = is_nw ? this.A : this.B;
			this._se = is_nw ? this.B : this.A;
			return this._nw;
		})();
	}

	get se() {
		return this._se || (() => {
			const is_nw = compareXY(this.A, this.B) < 0;
			this._nw = is_nw ? this.A : this.B;
			this._se = is_nw ? this.B : this.A;
			return this._se;
		})();
	}

 /**
  * Construct a single random edge
  * @param {number} max_coord			Maximum x,y coordinate value. Min will be 0.
  * @return {OrderedPolygonEdge}
  */
  static random(max_coord = 5000) {
  	return new this(randomPoint(max_coord), randomPoint(max_coord));
  }

 /**
  * Construct a specified number of random OrderedPolygonEdges.
  * Primarily for testing and benchmarking.
  * @param {number} n								Number of edges to create
  * @param {number} max_coord				Maximum x,y coordinate value. Min will be 0.
  * @return {OrderedPolygonEdge[]}	Array of edges, length n.
  */
	static randomEdges(n = 100, max_coord = 5000) {
	  const arr = [];
		for(let i = 0; i < n; i += 1) {
			arr.push(this.random(max_coord));
		}
		return arr;
	}
}



