import { GeomPoint } from "./Point.js";
import { GeomPixelVector } from "./PixelVector.js";
import { COLORS } from "./constants.js";

/**
 * Represents a point in 3-D Euclidean space.
 * Technically equivalent to a vector, but conceptually different.
 * This version uses only integer coordinates, representing pixel locations.
 * @param {number[]}  p  x, y, z coordinates
 */ 
export class GeomPixelPoint extends GeomPixelVector {

  // -------------- GETTERS/SETTERS ------------- //
  
  
  // -------------- METHODS --------------------- //    
  
 /**
  * Draw a filled circular point of given radius. Only drawn in x,y dimensions
  * @param {number} color
  * @param {number} alpha
  * @param {number} radius
  */
  draw(color = COLORS.gray, alpha = 1, radius = 5) {
   GeomPoint.prototype.draw.call(this, color, alpha, radius);
  }
}
