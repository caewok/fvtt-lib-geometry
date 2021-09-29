import { GeomLine } from "./Line.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GeomPixelVector } from "./PixelVetor.js";

/**
 * Represents a line with infinite length in either direction.
 * Defined by the parametric form of the equation for a line:
 *   A Vector and a point on the line.
 * @param {GeomPixelPoint}  p    Point on the line
 * @param {GeomPixelVector} v    Vector
 */
export class GeomPixelLine extends GeomLine {  
  constructor(p, v) {
    if(!(p instanceof GeomPixelPoint)) {
      p = new GeomPixelPoint(p.x, p.y, p.z);
    }
    
    if(!(v instanceof GeomPixelVector)) {
      v = new GeomPixelVector(p.x, p.y, p.z);
    }
  
    super(p, v);  
  }

 
  // -------------- GETTERS/SETTERS ------------- //
  
    
  
  // -------------- METHODS --------------------- // 


  
}
