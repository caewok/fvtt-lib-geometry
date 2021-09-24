import { GEOM_CONSTANTS } from "./constants.js";
import { orient2d } from "./lib/orient2d.min.js";
import { GeomPoint } from "./Point.js";

export class GeomVector extends GeomPoint {
  /**
   * A vector is determined by two coordinates, just like a point--
   * one for its magnitude in the x direction, and one for its magnitude 
   * in the y direction. A vector has length and direction, that is all. 
   * Two vectors with the same length and direction are the same vector. 
   * They may have origins at different points, but they are still equal. 
   * Here, angle signifies direction, in radians.
   * @property {number} x   Magnitude in the x direction
   * @property {number} y   Magnitude in the y direction  
   * @property {number} z   Magnitude in the z direction
   */
   constructor(x, y, z = 0) {
     super(x, y, z);
     
    /**
     * @property {number} _magnitudeSquared  x^2 * y^2 * z^2
     * @private
     */
     this._magnitudeSquared = undefined;
     
    /**
     * @property {number} _magnitudeSquared2D  x^2 * y^2
     * @private
     */ 
     this._magnitudeSquared2D = undefined;
     
    /**
     * @property {number} _magnitude    sqrt(x^2 * y^2 * z^2)
     * @private
     */
     this._magnitude = undefined;
     
    /**
     * @property {number} _magnitude2D    sqrt(x^2 * y^2)
     * @private
     */
     this._magnitude2D = undefined;
     
    /**
     * @property {number} _angleXY
     * @private
     */
     this._angleXY = undefined;
     
    /**
     * @property {number} _angleXZ
     * @private
     */
     this._angleXZ = undefined;
     
    /**
     * @property {number} _angleYZ
     * @private
     */
     this._angleYZ = undefined;
   }
  
  // -------------- GETTERS/SETTERS ------------- //
 /**
  * Magnitude squared, used for comparisons.
  * @type {number}
  */ 
  get magnitudeSquared() {
    if(this._magnitudeSquared === undefined) { this._magnitudeSquared = x*x + y*y + z*z; }
    return this._magnitudeSquared;
  }
  
 /**
  * Magnitude squared of the {x, y} dimensions, used for comparisons
  * @type {number}
  */
  get magnitudeSquared2D() {
    if(this._magnitudeSquared2D === undefined) { this._magnitudeSquared2D = x*x + y*y; }
    return this._magnitudeSquared2D;
  }
 
 /**
  * Magnitude (length)
  * @type {number}
  */ 
  get magnitude() {
    if(this._magnitude === undefined) { 
      this._magnitude = Math.sqrt(this.magnitudeSquared); 
    }
    return this._magnitude;
  }

 /**
  * Magnitude (length) of the {x, y } coordinates
  * @type {number}
  */
  get magnitude2D() {
    if(this._magnitude2D === undefined) { 
      this._magnitude2D = Math.sqrt(this.magnitudeSquared2D); 
    }
    return this._magnitude2D;
  }
 
 /**
  * Angle (direction) in the {x, y} plane.
  * @type {number}
  */ 
  get angleXY() {
    if(this._angleXY === undefined) this._angleXY = Math.atan(this.x, this.y);
    return this._angleXY;
  }
  
 /**
  * Angle (direction) in the {x, z} plane.
  * @type {number}
  */ 
  get angleXZ() {
    if(this._angleXZ === undefined) this._angleXZ = Math.atan(this.x, this.z);
    return this._angleXZ;
  }

 /**
  * Angle (direction) in the {y, z} plane.
  * @type {number}
  */ 
  get angleYZ() {
    if(this._angleYZ === undefined) this._angleYZ = Math.atan(this.y, this.z);
    return this._angleYZ;
  }
  
  // -------------- METHODS ----------- // 
      
 /**
  * Test for orientation in 2 dimensions against another vector
  * Orientation is with regard to the canvas origin
  * @param {GeomPoint} v   Vector or point to test against
  * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
  * Approximation of twice the signed area of the triangle defined by the three points
  */
  orientation2D(v) {
    return orient2d(GEOM_CONSTANTS.ORIGIN.x,
                    GEOM_CONSTANTS.ORIGIN.y,
                    this.x,
                    this.y,
                    v.x,
                    v.y);
  }
  
  /**
   * Test if orientation is counterclockwise, clockwise, or collinear.
   * See orientation2d.
   * @param {GeomPoint} v   Vector or point to test against
   * @return {GEOM_CONSTANTS.CLOCKWISE |
              GEOM_CONSTANTS.COLLINEAR | 
              GEOM_CONSTANTS.COUNTERCLOCKWISE}
   */
   ccw2D(v) {
     const res = this.orientation2D(v):
     return res < 0 ? GEOM_CONSTANTS.CLOCKWISE :
            res > 0 ? GEOM_CONSTANTS.COUNTERCLOCKWISE :
            GEOM_CONSTANTS.COLLINEAR;
   }  
   
  /*
   * Add a vector to this one
   * @param {GeomVector} v    Vector to sum
   * @return {GeomVector} New vector
   */
   add(v) {
     return new GeomVector(this.x + v.x, this.y + v.y);
   }
   
  /*
   * Subtract a vector from this one
   * @param {GeomVector} v    Vector to sum
   * @return {GeomVector} New vector
   */
   subtract(v) {
     return new GeomVector(this.x - v.x, this.y -  v.y);
   }
   
  /*
   * Multiply this vector by a scalar
   * @param {number} scalar   Number by which to multiply this vector
   * @return {GeomVector} New vector
   */
   multiply(scalar) {
     return new GeomVector(this.x * scalar, this.y * scalar);
   } 
   
  /*
   * Divide this vector by a scalar
   * @param {number} scalar   Number by which to divide this vector
   * @return {GeomVector} New vector
   */  
   divide(scalar) {
     return new GeomVector(this.x / scalar, this.y / scalar);
   }
   
  /*
   * Equivalence for a vector is length and direction
   * @param {GeomVector} v    Vector to compare
   * @return {boolean} True if equivalent in two dimensions
   */
   equivalent2D(v) {
     return almostEqual(this.magnitudeSquared2D, v.magnitudeSquared2D) && 
              this.ccw2D(v) === GEOM_CONSTANTS.COLLINEAR;
   }
   
  /**
   * Find the vector perpendicular to this an another vector.
   * Determined by calculating the cross product
   * @param {GeomVector} v   Vector to cross
   * @param {GeomVector} New perpendicular vector
   */
   perpendicular(v) {
     const res = GeomVector.crossProduct(this, v);
     return new GeomVector(res.x, res.y, res.z);
   } 
   
  /**
   * Calculate cross product
   * @param {x: number, y: number, z: number} p1   First point
   * @param {x: number, y: number, z: number} p2   Second point
   */
   static crossProduct(p1, p2) {
     const x = (p1.y * p2.z - p2.y * p1.z);
     const y = (p1.x * p2.z - p2.x * p1.z);
     const z = (p1.x * p2.y - p2.x * p1.y);
     return { x: x, y: y, z: z }
   }
   
      
}