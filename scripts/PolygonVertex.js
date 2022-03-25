/** Additions to the Polygon Vertex Class **/

import { COLORS } from "./constants.js";

Object.defineProperty(PolygonVertex.prototype, "draw", {
  value: function({color = COLORS.red, alpha = 1, radius = 5} = {}) {
		canvas.controls.debug
				.beginFill(color, alpha)
				.drawCircle(self.x, self.y, radius)
				.endFill();
  },
  writable: true,
  configurable: true
});

Object.defineProperty(PolygonVertex.prototype, "drawLabel", {
  value: function(text) {
		if ( !canvas.controls.debug.polygonText ) {
				canvas.controls.debug.polygonText = canvas.controls.addChild(new PIXI.Container());
		}
		polygonText = canvas.controls.debug.polygonText;

		// update existing label if it exists at or very near Poly endpoint
		let idx = polygonText.children.findIndex(c => self.x.almostEqual(c.position.x) && self.y.almostEqual(c.position.y));
		if(idx !== -1) { canvas.controls.debug.polygonText.removeChildAt(idx); }

		t = polygonText.addChild(new PIXI.Text(String(text), CONFIG.canvasTextStyle));
		t.position.set(self.x, self.y);
  },
  writable: true,
  configurable: true
});


