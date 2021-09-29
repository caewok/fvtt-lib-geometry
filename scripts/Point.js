/* globals canvas */

import { COLORS } from "./constants.js";
import { GeomVector } from "./Vector.js";

/**
 * Represents a point in 3-D Euclidean space.
 * Technically equivalent to a vector, but conceptually different.
 * @param {number[]}  p  x, y, z coordinates
 */ 
export class GeomPoint extends GeomVector {

  // -------------- METHODS --------------------- // 
  
 /**
  * Draw a circular point of given radius.
  * Only drawn in x,y dimensions.
  * @param {number} color
  * @param {number} alpha
  * @param {number} radius
  */
  draw(color = COLORS.gray, alpha = 1, radius = 5) {
   canvas.controls.debug
         .beginFill(color, alpha)
         .drawCircle(this.x, this.y, radius)
         .endFill();
  }
}


