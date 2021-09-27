import { almostEqual, COLORS } from "./util.js";
import { COLORS } from "./constants.js";
import { GeomVector } from "./Vector.js";

export class GeomPoint extends GeomVector {
  /**
   * Represents a point in 3-D Euclidean space.
   * Technically equivalent to a vector, but conceptually different
   */   

  // -------------- GETTERS/SETTERS ------------- //
  
  // -------------- FACTORY FUNCTIONS ----------- //
 /**
  * @param {Array} arr
  * @return {GeomPoint}
  */
  static fromArray(arr) { return new GeomPoint(...arr); }
  
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


