import { GeomSegment } from "./Segment.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GeomPixelVector } from "./PixelVector.js";

/**
 * An line from one point to a second point
 * Represented by the parametric form of the equation for a line,
 *   p + t*v
 * t is constrained to be only between 0 and 1, where 0 gives p and 1 gives the endpoint.
 * v magnitude gives the end point.
 * This version uses GeomPixel classes for p and v.
 * @param {GeomPixelPoint}  p  Origination point for the ray.
 * @param {GeomPixelVector} v  Direction vector of the ray.
 */ 
export class GeomPixelSegment extends GeomSegment {
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


}