/** Add to Ray a getter for nw and se **/
/* globals
Ray
*/

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
Object.defineProperty(Ray.prototype, "nw", {
  get() {
    const is_nw = compareXY(this.A, this.B) < 0;
    return is_nw ? this.A : this.B;
  }
});

Object.defineProperty(Ray.prototype, "se", {
  get() {
    const is_nw = compareXY(this.A, this.B) < 0;
    return is_nw ? this.A : this.B;
  }
});

Object.defineProperty(Ray.prototype, "draw", {
  value: function({color = COLORS.blue, alpha = 1, width = 1} = {}) {
		canvas.controls.debug.lineStyle(width, color, alpha).
				moveTo(self.A.x, self.A.y).
				lineTo(self.B.x, self.B.y);
  },
  writable: true,
  configurable: true
});