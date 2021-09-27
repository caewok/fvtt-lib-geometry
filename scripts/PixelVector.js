import { GeomVector } from "./Vector.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GEOM_CONSTANTS } from "./constants.js";

export class GeomPixelVector extends GeomVector {
  /**
   * Vector where the magnitudes are integers.
   */
   constructor(...items) {   
     super(...items);
     
     this[0] = Math.round(this[0]);
     this[1] = Math.round(this[1]);
     this[2] = Math.round(this[2]);
    
     this.location_key = this.x | (this.y << 16);
   }
   
   // -------------- FACTORY FUNCTIONS ------------- //
 /**
  * @param {Array} arr
  * @return {GeomPixelVector}
  */
  static fromArray(arr) { return new GeomPixelVector(...arr); }
   
   // -------------- METHODS ----------- // 
  /**
   * Test for equivalence using location_key
   */ 
   
 /**
  * Is another vector the same as this one?
  * @override
  */ 
  equivalent(v) {
    if(v instanceof GeomPixelVector) {
      return this.equivalentXY(v) && this.z === v.z;
    }
    return GeomPixel.prototype.equivalent.call(this, v);
  }
  
 /**
  * Helper function: Is another vector the same as this one in 2D?
  * @override
  */ 
  _equivalent2D(v, dim1, dim2) {
    if(v instanceof GeomPixelVector) {
      return this[dim1] === v[dim1] && this[dim2] === v[dim2];
    }
    return GeomPixel.prototype._equivalent2D.call(this, v, dim1, dim2);
  }
 
 /**
  * Is another vector the same as this one in XY?
  * @override
  */
  equivalentXY(v) { return this.location_key === v.location_key; }  
  
 /**
  * @override
  */
  add(v) { 
    const res = math.add(this, v);
    if(v instanceof GeomPixelVector) return GeomPixelVector.fromArray(res);  
    return GeomVector.fromArray(res);
  }
  
  /**
   * Subtract another vector to this one
   * @param {GeomVector} v
   * @return {GeomVector}
   */
  subtract(v) { 
    const res = math.subtract(this, v);
    if(v instanceof GeomPixelVector) return GeomPixelVector.fromArray(res);  
    return GeomVector.fromArray(res); 
  } 
  
  /**
   * Cross product of this vector with another.
   * Resulting vector is perpendicular to the first two.
   * @param {GeomVector} v   Vector to cross
   * @param {GeomVector} New vector, perpendicular to this vector and v.
   */
   cross(v) {
     const res = math.cross(this, v);
     if(v instanceof GeomPixelVector) return GeomPixelVector.fromArray(res);
     return GeomVector.fromArray(res);
   }
  
}
