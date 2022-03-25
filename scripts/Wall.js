/** Add to Wall a getter for nw and se **/
/* globals
Wall
*/

'use strict';

import compareXY from "./util.js";

/*
The Wall class caches a value identifying the northwest (_nw) and southeast (_se)
endpoints. This is done in WallsLayer.identifyWallIntersections(). This value is used
for sorting and then comparing pairs of walls.

To provide a consistent interface with objects here, getters for nw and se are added
to the Wall class. This is consistent with how cached values are often accessed in JS,
and allows for a check to calculate those values if necessary (if somehow
identifyWallIntersections has not been called for that wall).

Note that changing A or B after construction may result in incorrect _nw and _se values.
To avoid this, one would have to either:
  a. Track any changes to the underlying A and B vertices, even if implicitly done by
     getting the vertex and then changing the referenced coordinates; or
  b. Forcing _nw and _se to be calculated every time, not cached.

Performance here is tricky. https://jsbench.me/5ml157u7e8/2
Assuming eventual access of nw and se, the fastest is to calculate at creation. But that
risks getting out-of-sync with endpoint changes. The simplest, but slowest, is re-calc
every time. Caching the data is not ideal from either perspective but may be the best
middle ground, particularly for walls where nw and se are already calculated elsewhere.
*/

/**
 * Add getter methods to retrieve the northwest and southeast endpoint from the wall.
 * Assists with testing for intersections between walls, or between walls and other
 * segment-like objects.
 *
 * Note: It would probably be faster to just calculate the se and nw values up front
 */
Object.defineProperty(Wall.prototype, "nw", {
	get() {
		if(!this._nw) {
			const is_nw = compareXY(this.A, this.B) < 0;
			this._nw = is_nw ? this.A : this.B;
			this._se = is_nw ? this.B : this.A;
		}
		return this._nw;
	}
});

Object.defineProperty(Wall.prototype, "se", {
	get() {
		if(!this._se) {
			const is_nw = compareXY(this.A, this.B) < 0;
			this._nw = is_nw ? this.A : this.B;
			this._se = is_nw ? this.B : this.A;
		}
		return this._se;
	}
});


