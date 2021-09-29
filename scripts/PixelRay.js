import { GeomRay } from "./Ray.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GeomPixelVector } from "./PixelVector.js";

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

}