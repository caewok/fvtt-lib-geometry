import { almostEqual } from "./util.js";

export class GeomPoint {
  /**
   * Represents a point in 3-D Euclidean space.
   * @property {number} x
   * @property {number} y
   * @property {number} z    Elevation off the canvas. Default 0.
   * @constructor
   */   
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    
   /**
    * @property {string} _id
    * @private
    */
    this._id = undefined; 
     
  }
  
  // -------------- GETTERS/SETTERS ------------- //
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
  
  // -------------- METHODS --------------------- // 

  /**
   * Determine if another point is almost equivalent to this one.
   * @param {GeomPoint} p     Other point to test
   * @param {number} EPSILON  Error within which the numbers will be considered equal
   * @return {boolean} True if almost equal
   */
   equivalent(p, EPSILON) {   
     return this.equivalent2D(p, EPSILON) && almostEqual(this.z, p.z, EPSILON);
   }
   
  /**
   * Determine if another point shares approximately the same 2-D space as this one.
   * @param { GeomPoint } p   Other point to test
   * @param {number} EPSILON  Error within which the numbers will be considered equal
   * @return {boolean} True if almost equal in x and y coordinates.
   */
   equivalent2D(p, EPSILON)  {
     return almostEqual(this.x, p.x, EPSILON) && 
            almostEqual(this.y, p.y, EPSILON);
   }
      
  /**
   * Subtract a point to from this one to create a Vector
   * @param {GeomPoint} p   Other point to add
   * @return {GeomVector}   The vector describing the sum of the two points
   */
   subtract(p) {
     return new GeomVector(p.x - this.p.x, p.y - this.p.y, p.z - this.p.z);
   }
   
  /**
   * Given two other points, determine their orientation
   * @param {GeomPoint} p1
   * @param {GeomPoint} p2
   * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
   */
   orientation2D(p1, p2) {
     return orient2d(this.x, this.y, p1.x, p1.y, p2.x, p2.y);
   }
   
  /**
   * Given two other points, return whether they are CCW, COLLINEAR, or CW.
   * @param {GeomPoint} p1
   * @param {GeomPoint} p2
   * @return {GEOM_CONSTANTS.CLOCKWISE |
              GEOM_CONSTANTS.COLLINEAR | 
              GEOM_CONSTANTS.COUNTERCLOCKWISE}
   */
   ccw2D(p1, p2) {
     const res = this.orientation2D(p1, p2):
     return res < 0 ? GEOM_CONSTANTS.CLOCKWISE :
            res > 0 ? GEOM_CONSTANTS.COUNTERCLOCKWISE :
            GEOM_CONSTANTS.COLLINEAR; 
   }
}

