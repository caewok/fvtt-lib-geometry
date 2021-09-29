import { GeomLine } from "./Line.js";
import { GeomPixelPoint } from "./PixelPoint.js";

export class GeomPixelLine extends GeomLine {  
  /**
   * Represents a line with infinite length in either direction.
   * Defined by the parametric form of the equation for a line:
   *   A Vector and a point on the line.
   * @property {GeomPixelPoint}  p    Point on the line
   * @property {GeomPixelVector} v    Vector (analog of slope)
   * @constructor
   */

  // -------------- GETTERS/SETTERS ------------- //
  
    
  
  // -------------- METHODS --------------------- // 
  /**
   * Get arbitrary pixel point on the line.
   * Note: Point will be rounded to nearest pixel and thus may fall slightly outside the line.
   * @param {number} t	Portion of the vector to move along the line, from p.
   * @return {GeomPixelPoint} Pixel nearest to the point on the line.
   */
  pixelPoint(t) {
    return new GeomPixelPoint(this.p.x + t * this.v.x,
                              this.p.y + t * this.v.y,
                              this.p.z + t * this.v.z);
  }
  

  
}
