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
  
  
   
  
  // -------------- FACTORY FUNCTIONS ----------- // 
  /**
   * Construct a line given two points
   * @param {GeomPixelPoint} A  First point
   * @param {GeomPixelPoint} B  Second point.
   * @return {GeomPixelLine} 
   */}
  static lineFrom(A, B) {
    return new GeomPixelLine(A, A.subtract(B));
  }
  
  
  // -------------- METHODS --------------------- // 
  /**
   * Get arbitrary point on the line
   * 
   */
  point(t) {
    t = round(t);
  
    return new GeomPixelPoint(this.p.x + t * this.v.x,
                              this.p.y + t * this.v.y,
                              this.p.z + t * this.v.z);
  }
  

  
}