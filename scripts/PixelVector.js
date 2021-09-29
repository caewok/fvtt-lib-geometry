import { GeomVector } from "./Vector.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GEOM_CONSTANTS } from "./constants.js";


/**
 * Vector defines a direction and magnitude (size, or length) in 3D space.
 * (Basically, an arrow pointing in a specific direction.)
 * Represented by three numbers, referenced here as x, y, and z.
 * For GeomPixelVector, the coordinates are integer pixel locations.
 * Two vectors with the same magnitude and direction are the same vector. 
 * Here, angle signifies direction, in radians.
 * Extended from Array so it can be used with math.js functions.
 * @param {number[]}  p  x, y, z magnitudes
 */
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
   
   
   // -------------- METHODS ----------- // 
 
 /**
  * Is another vector the same as this one?
  * Test for equivalence using location_key
  * @override
  */ 
  equivalent(v) {
    if(v instanceof GeomPixelVector) {
      return this.location_key === v.location_key && this.z === v.z;
    }
    return GeomVector.prototype.equivalent.call(this, v);
  }
  
 /**
  * 2D equivalence
  * @override
  */
  equivalent2D(v, { plane = GEOM.XY } = {}) {
    if(plane === GEOM.XY && v instanceof GeomPixelVector) {
      return this.location_key === v.location_key;
    }
    return GeomVector.prototype.equivalent2D.call(this, v, { plane });
  }
  
 /**
  * Test for orientation against another vector
  * @override
  */
  orientation(v, { use_robust = true } = {}) {
    if(v instanceof GeomPixelVector) { use_robust = false; }
    return GeomVector.prototype.orientation.call(this, v, { use_robust });
  }    
  
 /**
  * Orientation on 2D plane with respect to another vector.
  * (Assumes both vectors use the same origin point)
  * @override
  */
  orientation2D(v, {plane = GEOM.XY, use_robust = true} = {}) {
    if(v instanceof GeomPixelVector) use_robust = false;
    return GeomVector.prototype.orientation2D.call(this, v, { plane, use_robust });
  }
  
 /**
  * CCW respect to another vector.
  * @override
  */
  ccw(v, { use_robust = true } = {}) {
    if(v instanceof GeomPixelVector) use_robust = false;
    return GeomVector.prototype.ccw.call(this, v, { use_robust }); 
  } 

 /**
  * CCW on 2D plane with respect to another vector
  * @override
  */
  ccw2D(v, plane, {use_robust = true} = {}) {
    if(v instanceof GeomPixelVector) use_robust = false;
    return GeomVector.prototype.ccw2D.call(this, v, plane, 
                                           {use_robust: use_robust});
  }

}
