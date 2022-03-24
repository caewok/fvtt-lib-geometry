/** Add to Ray a getter for nw and se **/
'use strict';

import compareXY from "./util.js";

// See discussion in Wall.js of the tradeoffs between caching/not caching.
/**
 * Add getter methods to retrieve the northwest and southeast endpoint from the ray.
 * Calculates the values each time they are requested, which ensures accuracy
 * in case of modification of A or B but may be slower if repeatedly accessed.
 *
 *
 */
Object.defineProperty(Ray.prototype, "nw") {
	get() {
	  const is_nw = compareXY(this.A, this.B) < 0;
		return is_nw ? this.A : this.B;
	}
}

Object.defineProperty(Ray.prototype, "se") {
	get() {
	  const is_nw = compareXY(this.A, this.B) < 0;
		return is_nw ? this.A : this.B;
	}
}
