import { GeomVector } from "./Vector.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GEOM_CONSTANTS } from "./constants.js";

export class GeomPixelVector extends GeomVector {
  /**
   * Vector where the magnitudes are integers.
   */
   constructor(x, y, z = 0) {
     x = Math.round(x);
     y = Math.round(y);
     z = Math.round(x);
    
     super(x, y, z);
    
     this.location_key = this.x | (this.y << 16);
   }
   
   // -------------- METHODS ----------- // 
  /**
   * Test for equivalence using location_key
   * @override
   */
   equivalent(v, EPSILON) {
     if(p instanceof GeomPixelPoint) { 
       return this.equivalentLocation(p, EPSILON) && this.z === p.z;
     }
      
     return GeomVector.prototype.equivalent.call(this, v, EPSILON);
   }

  /**
   * Equivalence for a vector is length and direction
   * @param {GeomVector} v    Vector to compare
   * @return {boolean} True if equivalent in two dimensions
   */
   equivalent2D(v) {
     const mag_equal = (v instanceof GeomPixelVector) ? 
                         this.magnitudeSquared2D == v.magnitudeSquared2D :
                         almostEqual(this.magnitudeSquared2D, v.magnitudeSquared2D);
    
     return mag_equal && this.ccw2D(v) === GEOM_CONSTANTS.COLLINEAR;
   }
   
  /**
   * Find the vector perpendicular to this an another vector.
   * @override
   */
   perpendicular(v) {
     if(!(v instanceof GeomPixelVector)) return GeomVector.prototype.perpendicular.call(this, v); ;
   
     const res = GeomVector.crossProduct(this, v);
     return new GeomPixelVector(res.x, res.y, res.z);
   }  
}
