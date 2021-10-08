/* globals foundry, math, canvas */

import { GEOM, COLORS } from "./constants.js";
import { orient2d, orient2dfast } from "./lib/orient2d.js";
import { orient3d, orient3dfast } from "./lib/orient3d.js";
import { almostEqual } from "./util.js";
import { GeomPoint } from "./Point.js";

/**
 * Vector defines a direction and magnitude (size, or length) in space
 * (Basically, an arrow pointing in a specific direction.)
 * Can have any number of dimensions but some methods only work with 2 or 3.
 * Vectors do not have a specific origin
 * Here, angle signifies direction, in radians.
 * Extended from Array so it can be used with math.js functions.
 * Follows affine + euclidean geometry rules
 * S • V --> V (scalar-vector multiplication)
 * V + V --> V (vector addition)
 * P + V --> P (point-vector addition)
 * V • V --> S (dot product)
 * V x V --> V (cross product)
 * For convenience, Vector subtraction and scalar-vector division is also defined.
 * For convenience, projection to the XY plane is also defined
 * @param {number[]}  p  Magnitudes
 */
export class GeomVector extends Array {
  
   constructor(...items) {
     super(...items);

    /**
     * @property {number} _magnitudeSquared  x^2 * y^2 * ...
     * @private
     */
     this._magnitudeSquared = undefined;
          
    /**
     * @property {number} _magnitude    sqrt(x^2 * y^2 * ...)
     * @private
     */
     this._magnitude = undefined;   
    
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
      this._magnitudeSquared = math.dot(this, this);
    }
    return this._magnitudeSquared;
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
  
  // -------------- FACTORY FUNCTIONS ------------- //
  
  
  // -------------- STATIC METHODS ----------- //

  
  // -------------- METHODS ----------- // 
  
 /**
  * Clear cached calculations
  * @private
  */
  _clearCached() {
    this._magnitudeSquared = undefined;
    this._magnitude = undefined;
  }


 /**
  * Is another vector equivalent to this one?
  * @param {GeomVector} v
  * @return {boolean} True if relative difference between the two vectors is smaller 
  *                   than the configured epsilon. See math.js:
  * https://mathjs.org/docs/reference/functions/equal.html
  */
  equivalent(v) { return math.equal(this, v); }

      
  // -------------- MATH.JS METHODS ----------------------- // 
   
 /**
  * Add another vector to this one: V + V = V
  * @param {GeomVector} v
  * @return {GeomVector}
  */
  add(v) { 
    if(v instanceof GeomPoint) return v.add(this);
    return new this(...math.add(this, v)); 
  }
  
 /**
  * Subtract another vector from this one: V + (-1)•V = V
  * @param {GeomVector} v
  * @return {GeomVector}
  */
  subtract(v) { return new this(...math.subtract(this, v)); } 
  
 /**
  * Multiply by a scalar: S • V = V
  * @param {number} scalar 
  * @return {GeomVector}  
  */
  multiplyScalar(scalar) { return new this(...math.dotMultiply(this, scalar)); } 
   
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
   return new this(...math.cross(this, v));
  } 
   
 /**
  * Normalize this vector to unit length 1
  * @return {GeomVector} New vector normalized to length 1
  */
  normalize() {
   if(this.magnitudeSquared === 0) return this; // probably a point or zero-vector?
   if(this.magnitudeSquared === 1) return this; // already normalized
 
   const invLen = 1 / this.magnitude;
   const out = new GeomVector(...this.multiplyScalar(invLen));
 
   out._magnitudeSquared = 1;
   out._magnitude = 1;
   return out;                          
  }
   
 /**
  * Angle between two nonzero vectors: cos Ø = (u • v)
  * @param {GeomVector} v
  * @return {number} (between 0 and π)
  */
  angle(v) { return math.acos(this.dot(v)); }   
  
  
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
