/** Additions to the Polygon Edge Class **/

/* globals
PolygonEdge,
canvas
*/

import { COLORS } from "./constants.js";

Object.defineProperty(PolygonEdge.prototype, "draw", {
  value: function({color = COLORS.blue, alpha = 1, width = 1} = {}) {
		canvas.controls.debug.lineStyle(width, color, alpha).
				moveTo(self.A.x, self.A.y).
				lineTo(self.B.x, self.B.y);
  },
  writable: true,
  configurable: true
});