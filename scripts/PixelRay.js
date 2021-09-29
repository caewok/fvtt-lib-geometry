import { GeomRay } from "./Ray.js";

/**
 * An infinite line in one direction from a point
 * Represented by the parametric form of the equation for a line,
 *   p + t*v
 * t is constrained to be only positive. 
 * In this version, the ray is further constrained to begin on a pixel point.
 * @param {GeomPoint}  p  Origination point for the ray.
 * @param {GeomVector} v  Direction vector of the ray.
 */ 
export class GeomPixelRay extends GeomRay {
  constructor(p, v) {
    if(!(p instanceof GeomPixelPoint)) {
      p = new GeomPixelPoint(p.x, p.y, p.z);
    }
    
    if(!(v instanceof GeomPixelVector)) {
      v = new GeomPixelVector(p.x, p.y, p.z);
    }
  
    super(p, v);  
  }
  
  // -------------- METHODS --------------------- // 
  /**
   * Get arbitrary pixel point on the line.
   * Note: Point will be rounded to nearest pixel and thus may fall slightly outside the line.
   * @param {number} t	Portion of the vector to move along the line, from p.
   * @return {GeomPixelPoint} Pixel nearest to the point on the line.
   */
  pixelPoint(t) {
    // return new GeomPixelPoint(this.p.x + t * this.v.x,
//                               this.p.y + t * this.v.y,
//                               this.p.z + t * this.v.z);
    return new GeomPixelPoint(math.add(this.p, math.dotMultiply(this.v, t)));
  }
}