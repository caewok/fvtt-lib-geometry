import { GEOM_CONSTANTS } from "./constants.js";
import { orient2d } from "./lib/orient2d.min.js";
import { COLORS, almostEqual } from "./util.js";

export class GeomVector extends Array {
  /**
   * Vector defines a direction and magnitude (size, or length) in 3D space.
   * (Basically, an arrow pointing in a specific direction.)
   * Represented by three numbers, referenced here as x, y, and z.
   * Two vectors with the same magnitude and direction are the same vector. 
   * Here, angle signifies direction, in radians.
   * @property {number} x   Magnitude in the x direction
   * @property {number} y   Magnitude in the y direction  
   * @property {number} z   Magnitude in the z direction
   */
   constructor(...items) {
     if(items.length < 2) console.warn(`GeomVector: constructor passed less than 2 coordinates.`);
     if(items.length > 3) console.warn(`GeomVector: constructor passed more than 3 coordinates.`);
     if(items[2] === undefined) items[2] = 0;
     super(...items);

    /**
     * @property {number} _magnitudeSquared  x^2 * y^2 * z^2
     * @private
     */
     this._magnitudeSquared = undefined;
     
    /**
     * @property {number} _magnitudeSquaredXY  x^2 * y^2
     * @private
     */ 
     this._magnitudeSquaredXY = undefined;
     this._magnitudeSquaredXZ = undefined;
     this._magnitudeSquaredYZ = undefined;
     
    /**
     * @property {number} _magnitude    sqrt(x^2 * y^2 * z^2)
     * @private
     */
     this._magnitude = undefined;
     
    /**
     * @property {number} _magnitudeXY    sqrt(x^2 * y^2)
     * @private
     */
     this._magnitudeXY = undefined;
     this._magnitudeXZ = undefined;
     this._magnitudeYZ = undefined;
     
    /**
     * @property {number} _angleXY
     * @private
     */
     this._angleXY = undefined;
     this._angleXZ = undefined;
     this._angleYZ = undefined;
    
    /**
     * @property {string} _id
     * @private
     */
     this._id = undefined;
   }
  
  // -------------- GETTERS/SETTERS ------------- //
 /**
  * @type {number}
  */
  get x() { return this[0]; }
  get y() { return this[1]; } 
  get z() { return this[2]; } 
  
 /**
  * @type {number}
  */
  set x(value) { 
    this[0] = value; 
    this._clearCached();
  }
  
 /**
  * @type {number}
  */
  set y(value) { 
    this[1] = value; 
    this._clearCached();
  }
  
 /**
  * @type {number}
  */
  set z(value) { 
    this[2] = value; 
    this._clearCached();
  }
 
 /**
   * Unique id for this point
   * @type {string}
   */
   get id() {
     if(!this._id) { this._id = foundry.utils.randomID(); }
     return this._id;
   }
   
  /**
   * Set id to specific value
   * @param {string} value
   */
   set id(value) { this._id = value; }
 
 /**
  * Magnitude squared, used for comparisons.
  * @type {number}
  */ 
  get magnitudeSquared() {
    if(this._magnitudeSquared === undefined) { 
      this._magnitudeSquared = this.x * this.x + 
                               this.y * this.y +
                               this.z * this.z; 
    }
    return this._magnitudeSquared;
  }
    
 /**
  * Magnitude squared of the {x, y} dimensions, used for comparisons
  * @type {number}
  */
  get magnitudeSquaredXY() {
    if(this._magnitudeSquared2D === undefined) { 
       this._magnitudeSquaredXY = this.x * this.x + this.y * this.y; 
    }
    return this._magnitudeSquaredXY;
  }
  
 /**
  * Magnitude squared of the {x, z} dimensions, used for comparisons
  * @type {number}
  */
  get magnitudeSquaredXZ() {
    if(this._magnitudeSquaredXZ === undefined) { 
       this._magnitudeSquaredXZ = this.x * this.x + this.z * this.z; 
    }
    return this._magnitudeSquaredXZ;
  }
  
 /**
  * Magnitude squared of the {y, z} dimensions, used for comparisons
  * @type {number}
  */
  get magnitudeSquaredYZ() {
    if(this._magnitudeSquaredYZ === undefined) { 
       this._magnitudeSquaredYZ = this.y * this.y + this.z * this.z; 
    }
    return this._magnitudeSquaredYZ;
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
  * Magnitude (length) of the {x, y} coordinates
  * @type {number}
  */
  get magnitudeXY() {
    if(this._magnitudeXY === undefined) { 
      this._magnitudeXY = Math.sqrt(this.magnitudeSquaredXY); 
    }
    return this._magnitudeXY;
  }
 
 /**
  * Magnitude (length) of the {x, z} coordinates
  * @type {number}
  */
  get magnitudeXZ() {
    if(this._magnitudeXZ === undefined) { 
      this._magnitudeXZ = Math.sqrt(this.magnitudeSquaredXZ); 
    }
    return this._magnitudeXZ;
  }
  
 /**
  * Magnitude (length) of the {y, z} coordinates
  * @type {number}
  */
  get magnitudeYZ() {
    if(this._magnitudeYZ === undefined) { 
      this._magnitudeYZ = Math.sqrt(this.magnitudeSquaredYZ); 
    }
    return this._magnitudeYZ;
  }
 
 /**
  * Angle (direction) in the {x, y} plane.
  * @type {number}
  */ 
  get angleXY() {
    if(this._angleXY === undefined) this._angleXY = math.atan2(this.x, this.y);
    return this._angleXY;
  }
  
 /**
  * Angle (direction) in the {x, z} plane.
  * @type {number}
  */ 
  get angleXZ() {
    if(this._angleXZ === undefined) this._angleXZ = math.atan2(this.x, this.z);
    return this._angleXZ;
  }

 /**
  * Angle (direction) in the {y, z} plane.
  * @type {number}
  */ 
  get angleYZ() {
    if(this._angleYZ === undefined) this._angleYZ = math.atan2(this.y, this.z);
    return this._angleYZ;
  }
  
  // -------------- FACTORY FUNCTIONS ------------- //
 /**
  * @param {Array} arr
  * @return {GeomVector}
  */
  static fromArray(arr) { return new GeomVector(...arr); }
  
 /**
  * Strip one dimension from a vector
  * @param {GeomVector}     v       Vector to project onto a plane
  * @param {"XY"|"XZ"|"YZ"} plane   String indicating plane to use
  * @return {GeomVector} New vector with third dimension zeroed out
  */
  static projectToPlane(v, plane) {
    switch(plane) {
      case "XY":
        return new GeomVector(v.x, v.y, 0);
      case "XZ":
        return new GeomVector(v.x, 0, v.z);
      case "YZ":
        return new GeomVector(0, v.y, v.z);
    }
  }
  
  // -------------- METHODS ----------- // 
  
 /**
  * Clear cached calculations
  * @private
  */
  _clearCached() {
    this._magnitudeSquared = undefined;
    this._magnitudeSquaredXY = undefined;
    this._magnitudeSquaredXZ = undefined;
    this._magnitudeSquaredYZ = undefined;
    
    this._magnitude = undefined;
    this._magnitudeXY = undefined;
    this._magnitudeXZ = undefined;
    this._magnitudeYZ = undefined;
    
    this._angleXY = undefined;
    this._angleXZ = undefined;
    this._angleYZ = undefined;
  }

 /**
  * Test for orientation against another vector
  * Orientation is with regard to the canvas origin
  * @param {GeomVector} v   Vector or point to test against
  * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
  * Approximation of twice the signed area of the triangle defined by the three points
  */
  orientation(v) {
    return orient2d(GEOM_CONSTANTS.ORIGIN.x,
                    GEOM_CONSTANTS.ORIGIN.y,
                    this.x,
                    this.y,
                    v.x,
                    v.y);
  }
  
  
 /**
   * Helper function to get orientation on 2-D plane.
   * @param {GeomPoint} p 
   * @param {"XY"|"XZ"|"YZ"} plane
   * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
   * @private
   */
  _orientation2D(p, dim1 = "x", dim2 = "y") {
    const t1 = this.point(1);
    return orient2d(GEOM_CONSTANTS.ORIGIN[dim1],
                    GEOM_CONSTANTS.ORIGIN[dim2],
                    this[dim1], 
                    this[dim2],
                    p[dim1],
                    p[dim2]);
  }
  
 /**
  * Orientation on XY relative to a point
  * See comparable functions for XZ and YZ planes
  * Orientation is with regard to the canvas origin
  * @param {GeomPoint} p Point to test against
  * @return number  Positive value if CCW, negative if CW, 0 if collinear.
  * Approximation of twice the signed area of the triangle defined by the three points
  */
  orientationXY(p) { return this._orientation2D(p, "x", "y"); }
  orientationXZ(p) { return this._orientation2D(p, "x", "z"); }
  orientationYZ(p) { return this._orientation2D(p, "y", "z"); }
  
  /**
   * Helper function to get ccw on 2-D plane
   * @param {GeomPoint} p
   * @param {"XY"|"XZ"|"YZ"} plane
   * @return {GEOM_CONSTANTS.CLOCKWISE |
              GEOM_CONSTANTS.COLLINEAR | 
              GEOM_CONSTANTS.COUNTERCLOCKWISE}
   * @private
   */
   _ccw2D(p, plane) {
     const res = this["orientation" + plane](p);
     return res < 0 ? GEOM_CONSTANTS.CLOCKWISE :
            res > 0 ? GEOM_CONSTANTS.COUNTERCLOCKWISE :
            GEOM_CONSTANTS.COLLINEAR;
   }
  
  /**
   * Determine whether point is counter-clockwise to this line on XY plane.
   * See comparable functions for XZ and YZ planes
   * @param {GeomPoint} p
   * @return {GEOM_CONSTANTS.CLOCKWISE |
              GEOM_CONSTANTS.COLLINEAR | 
              GEOM_CONSTANTS.COUNTERCLOCKWISE}
   */
   ccwXY(p) { return this._ccw2D(p, "XY"); }
   ccwXZ(p) { return this._ccw2D(p, "XZ"); }
   ccwYZ(p) { return this._ccw2D(p, "YZ"); }
 
 /**
  * Is another vector equivalent to this one in magnitude and direction?
  */ 
  equivalent(v) {
    return almostEqual(this.x, v.x) &&
           almostEqual(this.y, v.y) &&
           almostEqual(this.z, v.z);
  }
  
 /**
  * Helper function for 2-D equivalence
  */
  _equivalent2D(v, dim1, dim2) {
    return almostEqual(this[dim1], v[dim1]) &&
           almostEqual(this[dim2], v[dim2]);
  }
  
 /**
  * Is another vector equivalent to this one along two dimensions?
  * @param {GeomVector} v    Vector to compare
  * @return {boolean} True if equivalent in two dimensions
  */
  equivalentXY(v) { return this._equivalent2D(v, "x", "y"); }
  equivalentXZ(v) { return this._equivalent2D(v, "x", "z"); }
  equivalentYZ(v) { return this._equivalent2D(v, "y", "z"); }
   
   
  // -------------- MATH.JS METHODS ----------------------- // 
   
  /**
   * Add another vector to this one.
   * @param {GeomVector} v
   * @return {GeomVector}
   */
  add(v) { return GeomVector.fromArray(math.add(this, v)); }
  
  /**
   * Subtract another vector to this one
   * @param {GeomVector} v
   * @return {GeomVector}
   */
  subtract(v) { return GeomVector.fromArray(math.subtract(this, v)); } 
  
  /**
   * Multiply by a scalar
   * @param {number} scalar 
   * @return {GeomVector}  
   */
   multiplyScalar(scalar) { 
     return GeomVector.fromArray(math.dotMultiply(this, scalar));
   }
   
  /**
   * Dot product of this vector with another.
   * Result is a scalar.
   * - Project of one vector onto the other
   * - If B is a unit vector, then A • B = ||A||cos(Ø), magnitude of the projection of
   *   A in the direction of B.
   * - If both are normalized, then the arc cosine of the dot product is the 
   *   angle Ø between the two vectors.
   * - 0: Two vectors are perpendicular
   * - 1: Two vectors point in the same direction
   * - -1: Two vectors point in the opposite direction. 
   * @param {GeomVector} v
   * @return {number}
   */
   dot(v) {
     return math.dot(this, v);
   }
   
  /**
   * Cross product of this vector with another.
   * Resulting vector is perpendicular to the first two.
   * @param {GeomVector} v   Vector to cross
   * @param {GeomVector} New vector, perpendicular to this vector and v.
   */
   cross(v) {
     return GeomVector.fromArray(math.cross(this, v));
   } 
   
  /**
   * Normalize this vector to unit length 1
   * @return {GeomVector} New vector normalized to length 1
   */
   normalize() {
     if(this.magnitudeSquared === 0) return this; // probably a point?
     if(this.magnitudeSquared === 1) return this; // already normalized
     
     const invLen = 1 / this.magnitude;
     const out = new GeomVector(this.x * invLen,
                                this.y * invLen,
                                this.z * invLen);
     out._magnitudeSquared = 1;
     out._magnitude = 1;
     return out;                          
   }
   
  /**
   * Draw this vector from a given origin point. (for debugging)
   * @param {number} color
   * @param {number} alpha
   * @param {number} width
   */
  draw(origin, color = COLORS.gray, alpha = 1, width = 1) {
    origin = new GeomPoint(origin.x, origin.y, origin?.z);
    const end_point = origin.add(this);
  
    canvas.controls.debug
      .lineStyle(width, color, alpha)
      .moveTo(origin.x, origin.y)
      .lineTo(end_point.x, end_point.y);
      
    // TO-DO: Add arrow at end      
  }
   
      
}
