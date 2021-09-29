import { GEOM, COLORS } from "./constants.js";
import { orient2d, orient2dfast, orient3d, orient3dfast } from "./lib/predicates.min.js";
import { almostEqual } from "./util.js";

/**
 * Vector defines a direction and magnitude (size, or length) in 3D space.
 * (Basically, an arrow pointing in a specific direction.)
 * Represented by three numbers, referenced here as x, y, and z.
 * Two vectors with the same magnitude and direction are the same vector. 
 * Here, angle signifies direction, in radians.
 * Extended from Array so it can be used with math.js functions.
 * @param {number[]}  p  x, y, z magnitudes
 */
export class GeomVector extends Array {
  
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
  static fromArray(arr) { return new this(...arr); }
  
 /**
  * Strip one dimension from a vector
  * @param {GeomVector}     v       Vector to project onto a plane
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane   Plane to use
  * @return {GeomVector} New vector with third dimension zeroed out
  */
  static projectToPlane(v, plane) {
    let v_new;
    switch(plane) {
      case GEOM.XY:
        v_new = new this(v.x, v.y, 0);
        v_new._magnitudeSquaredXY = v._magnitudeSquaredXY;
        v_new._magnitudeXY = v._magnitudeXY;
        v_new._angleXY = v._angleXY;
        return v_new;
      case GEOM.XZ:
        v_new = new this(v.x, 0, v.z);
        v_new._magnitudeSquaredXZ = v._magnitudeSquaredXZ;
        v_new._magnitudeXZ = v._magnitudeXZ;
        v_new._angleXZ = v._angleXZ;
        return v_new;
      case GEOM.YZ:
        v_new = new this(0, v.y, v.z);
        v_new._magnitudeSquaredYZ = v._magnitudeSquaredYZ;
        v_new._magnitudeYZ = v._magnitudeYZ;
        v_new._angleYZ = v._angleYZ;
    }
  }
  
  // -------------- STATIC METHODS ----------- //
 /**
  * orientation of four points or vectors in 3D
  * p1 --> p2 --> p3 are CCW as viewed from p4
  * @param {GeomPoint}                p1
  * @param {GeomPoint}                p2
  * @param {GeomPoint}                p3
  * @param {GeomPoint}                p4
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane  
  * @param {boolean}                  use_robust 
  * @return {number}
  */
  static orient3D(p1, p2, p3, p4, { use_robust = true } = {}) {
    const fn = use_robust ? orient3d : orient3dfast;
    
    return fn(p1.x, p1.y, p1.z,
              p2.x, p2.y, p2.z,
              p3.x, p3.y, p3.z,
              p4.x, p4.y, p4.z);   
  }
 
 /**
  * orientation of three points or vectors on a plane
  * p1 --> p2 --> p3
  * @param {GeomPoint}                p1
  * @param {GeomPoint}                p2
  * @param {GeomPoint}                p3
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane  
  * @param {boolean}                  use_robust 
  * @return {number}
  */
  static orient2D(p1, p2, p3, { plane = GEOM.XY, use_robust = true } = {}) {
    const dim1 = (plane === GEOM.YZ) ? "y" : "x";
    const dim2 = (plane === GEOM.XY) ? "y" : "z";
    const fn = use_robust ? orient2d : orient2dfast;
    
    return fn(p1[dim1], p1[dim2],
              p2[dim1], p2[dim2],
              p3[dim1], p3[dim2]); 
  }
  
 /**
  * CCW for four points or vectors in 3D. 
  * @param {GeomPoint} p1
  * @param {GeomPoint} p2
  * @param {GeomPoint} p3
  * @param {boolean}   use_robust   Use robust or use non-robust, faster orient test.
  * @return {GEOM.UP|GEOM.DOWN|GEOM.COPLANAR} 
  */
  static ccw3D(p1, p2, p3, p4, {use_robust = true} = {}) {
    const res = this.orient3D(p1, p2, p3, p4, { use_robust });
    return res < 0 ? GEOM.UP :
           res > 0 ? GEOM.DOWN :
           GEOM.COPLANAR;
  }
  
 /**
  * CCW for three points or vectors on a plane. 
  * @param {GeomPoint}                p1
  * @param {GeomPoint}                p2
  * @param {GeomPoint}                p3
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane  
  * @param {boolean}                  use_robust Use robust or use non-robust, 
  *                                              faster orient test.
  * @return {GEOM.CLOCKWISE|GEOM.COLLINEAR|GEOM.COUNTERCLOCKWISE}
  */ 
  static ccw2D(p1, p2, p3, {use_robust = true} = {}) {
    const res = this.orient2D(p1, p2, p3, { use_robust });
    return res < 0 ? GEOM.CLOCKWISE :
           res > 0 ? GEOM.COUNTERCLOCKWISE :
           GEOM.COLLINEAR;
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
  * In 3D, this tests whether the second vector is counterclockwise or 
  *   clockwise or collinear to the first on the plane running through both
  *   vectors.
  * @param {GeomVector} v   Vector or point to test against
  * @param {boolean}                  robust  Whether to use a robust or a 
  *                                           faster, non-robust orientation function
  * @return {number} Returns a positive value if the point d of a vector perpendicular to
  *   the first two lies above the plane passing through a, b, and c, 
  *   meaning that a, b, and c appear in counterclockwise order when viewed from d.
  *   The result is also an approximation of six times the signed volume 
  *   of the tetrahedron defined by the four points.
  */
  orientation(v, {use_robust = true} = {}) {
    const fn = use_robust ? orient3d : orient3dfast;
    const cross = this.cross(v);
  
    return fn(GEOM.ORIGIN.x, GEOM.ORIGIN.y, GEOM.ORIGIN.z,
              this.x, this.y, this.z,
              v.x, v.y, v.z,
              cross.x, cross.y, cross.z); 
  }
  
 /**
  * Test for orientation against another vector. 
  * Orientation is with regard to the canvas origin
  * In 2D, this tests whether the other vector is counterclockwise, 
  *   clockwise, or collinear
  * (Two vectors are always co-planar given they share an origin)
  * @param {GeomVector} v             Vector or point to test against
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane
  * @param {boolean}                  robust  Whether to use a robust or a 
  *                                           faster, non-robust orientation function
  * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
  *   Approximation of twice the signed area of the triangle defined by the three points
  */
  orientation2D(v, {plane = GEOM.XY, use_robust = true} = {}) {
    const dim1 = (plane === GEOM.YZ) ? "y" : "x";
    const dim2 = (plane === GEOM.XY) ? "y" : "z";
    const fn = use_robust ? orient2d : orient2dfast;
    
    return fn(GEOM.ORIGIN[dim1], GEOM.ORIGIN[dim2],
              this[dim1], this[dim2],
              v[dim1], v[dim2]); 
  }
   
 /**
  * CCW respect to another vector.
  *   See {@link orientation}
  * @param {GeomVector}     v
  * @param {boolean}        use_robust  If false, use a fast, non-robust orient function
  * @return { GEOM.UP|
  *           GEOM.COPLANAR|
  *           GEOM.DOWN }
  */
  ccw(v, { use_robust = true } = {}) {  
    const res = this.orientation(v, { use_robust });
    return res < 0 ? GEOM.UP :
           res > 0 ? GEOM.DOWN :
           GEOM.COPLANAR;
  }
  
    
 /**
  * CCW respect to another vector.
  *   See {@link orientation}
  * @param {GeomVector}     v
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @param {boolean}        use_robust  If false, use a fast, non-robust orient function
  * @return { GEOM.CLOCKWISE | 
  *           GEOM.COLLINEAR | 
  *           GEOM.COUNTERCLOCKWISE}
  */
  ccw2D(v, { plane = GEOM.XY, use_robust = true } = {}) {  
    const res = this.orientation2D(v, { plane, use_robust });
    return res < 0 ? GEOM.CLOCKWISE :
           res > 0 ? GEOM.COUNTERCLOCKWISE :
           GEOM.COLLINEAR;
  }
  
 /**
  * Is another vector equivalent to this one?
  * @param {GeomVector} v
  * @return {boolean} True if equivalent in two dimensions
  */ 
  equivalent(v) {
    return almostEqual(this.x, v.x) &&
           almostEqual(this.y, v.y) &&
           almostEqual(this.z, v.z);
  }
  
 /**
  * 2D equivalence
  * @param {GeomVector} v
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @return {boolean} True if equivalent in two dimensions
  */
  equivalent2D(v, { plane = GEOM.XY } = {}) {
    const dim1 = (plane === GEOM.YZ) ? "y" : "x";
    const dim2 = (plane === GEOM.XY) ? "y" : "z";
  
    return almostEqual(this[dim1], v[dim1]) &&
           almostEqual(this[dim2], v[dim2]); 
  }
    
   
  // -------------- MATH.JS METHODS ----------------------- // 
   
  /**
   * Add another vector to this one.
   * @param {GeomVector} v
   * @return {GeomVector}
   */
  add(v) { return this.fromArray(math.add(this, v)); }
  
  /**
   * Subtract another vector to this one
   * @param {GeomVector} v
   * @return {GeomVector}
   */
  subtract(v) { return this.fromArray(math.subtract(this, v)); } 
  
  /**
   * Multiply by a scalar
   * @param {number} scalar 
   * @return {GeomVector}  
   */
   multiplyScalar(scalar) { 
     return this.fromArray(math.dotMultiply(this, scalar));
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
     return this.fromArray(math.cross(this, v));
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
