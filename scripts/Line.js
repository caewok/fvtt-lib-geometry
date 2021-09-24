import { GeomPoint } from "./Point.js";
import { GEOM_CONSTANTS } from "./constants.js";
import { orient2d } from "./lib/orient2d.min.js";

export class GeomLine {  
  /**
   * Represents a line with infinite length in either direction.
   * Defined by the parametric form of the equation for a line:
   *   A Vector and a point on the line.
   * @property {GeomPoint}  p    Point on the line
   * @property {GeomVector} v    Vector (analog of slope)
   * @constructor
   */

  constructor(p, v) {
    this.p = p;
    this.v = v;
    
    /*
     * @property {number} _x_intercept
     * @private
     */
     this._x_intercept = undefined;
    
    /*
     * @property {number} _y_intercept
     * @private
     */
     this._y_intercept = undefined; 
    
    /*
     * @property {number} _z_intercept
     * @private
     */
     this._z_intercept = undefined; 
     
    /*
     * @property {number} angleXY   In radians
     * @private
     */
     this._angleXY = undefined; 
     
    /*
     * @property {number} angleYZ   In radians
     * @private
     */
     this._angleYZ = undefined; 
     
    /*
     * @property {number} angleXZ   In radians
     * @private
     */
     this._angleXZ = undefined;   
  }
  
  // -------------- GETTERS/SETTERS ------------- //
  
  /**
   * @type {number}
   */
   get x_intercept() {
     if(this._x_intercept === undefined) {
       const t = almostEqual(v.y, 0) ? -p.z / v.z : -p.y / v.y;
       this._x_intercept = p.x + t * v.x;
     }
     return this._x_intercept;
   }
   
  /**
   * @type {number}
   */
   get y_intercept() { 
     if(this._y_intercept === undefined) {
       const t = almostEqual(v.x, 0) ? -p.z / v.z : -p.x / v.x;
       this._y_intercept = p.y + t * v.y;
     }
     return this._y_intercept;
   } 
   
  /**
   * @type {number}
   */
   get z_intercept() {
     if(this._z_intercept === undefined) {
       const t = almostEqual(v.y, 0) ? -p.x / v.x : -p.y / v.y;
       this._z_intercept = p.z + t * v.z;
     }
     return this._z_intercept;
   } 
    
  /**
   * @type {number}
   */
   get angleXY() {
     if(this._angleXY === undefined) {
       this._angleXY = Math.atan2(this.v.x, this.v.y);
     }
     return this._angleXY;
   }
   
  /**
   * @type {number}
   */
   get angleYZ() {
     if(this._angleYZ === undefined) {
       this._angleYZ = Math.atan2(this.v.y, this.v.z);
     }
     return this._angleYZ;
   }
   
  /**
   * @type {number}
   */
   get angleXZ() {
     if(this._angleXZ === undefined) {
       this._angleXZ = Math.atan2(this.v.x, this.v.z);
     }
     return this._angleXZ;
   }  
   
  
  // -------------- FACTORY FUNCTIONS ----------- // 
  /**
   * Construct a line given two points
   * @param {GeomPoint} A  First point
   * @param {GeomPoint} B  Second point.
   * @return {GeomLine} 
   */
  static lineFrom(A, B) {
    return new GeomLine(A, A.subtract(B));
  }
  
  
  // -------------- METHODS --------------------- // 
  /**
   * Get arbitrary point on the line
   * 
   */
  point(t) {
    return new GeomPoint(this.p.x + t * this.v.x,
                         this.p.y + t * this.v.y,
                         this.p.z + t * this.v.z);
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
    return orient2d(this.p[dim1], this.p[dim2],
                    t1[dim1], t1[dim2],
                    p[dim1], p[dim2]);
    
  }
  
  /**
   * Orientation on XY relative to a point
   * See comparable functions for XZ and YZ planes
   * @param {GeomPoint} p   
   * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
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
   * Determine whether the line contains a point, measured in terms of collinearity
   * @param {GeomPoint} p
   * @return {boolean} True if contains point
   */
//    contains(p) {
//      return this.ccw2D(p) === GEOM_CONSTANTS.COLLINEAR;
//    }
   
   /**
    * Helper function to determine intersection of two lines on a plane
    * @param {GeomLine} l
    * @param {"XY"|"XZ"|"YZ"} plane
    * @return {boolean} True if it intersects
    * @private
    */
   _intersects2D(l, plane) {
     const pl0 = l.p;
     const pl1 = l.point(1);
     const p0 = this.p;
     const p1 = this.p(1);
   
     return this._ccw(pl0, plane) !== this.ccw(pl1, plane) && 
            l.ccw(p0, plane)  !== l.ccw(p1, plane);
   }
   
   /**
    * Determine whether this line intersects another in XY plane
    * See comparable functions for XZ and YZ planes.
    * @param {GeomLine} l
    * @return {boolean} True if it intersects
    */
   intersectsXY(l) { this._intersects2D(l, "XY"); }
   intersectsYZ(l) { this._intersects2D(l, "YZ"); }
   intersectsXZ(l) { this._intersects2D(l, "XZ"); }
   
  /**
   * Get the intersection point of this line with another
   * @param {GeomLine} l
   * @return {GeomPoint}
   */
   intersection3D(l) {
     // l1 = this
     // l2 = l
     // l1 = (x1 y1 z1) + a (u1 v1 w1)
     // l2 = (x2 y2 z2) + b (u2 v2 w2)
     // [ u1 -u2 ]     [ a ] = [ x2 - x1 ]
     // [ v1 -v2 ] dot [ b ] = [ y2 - y1 ] or
     
     // [ w1 -w2 ]     [ b ] = [ z2 - z1 ]
     
     // Use Cramer's rule
     // Ax = b, then xi = det(Ai) / det(A)
     
     
   }
   
   /**
    * Helper function to determine intersection of line with this one along a plane.
    * As if the line were projected onto the 2-D plane.
    * @param {GeomLine} l
    * @param {"XY"|"XZ"|"YZ"} plane
    * @return {boolean|GeomPoint|GeomLine} 
    */ 
   _intersection2d(l, dim1 = "x", dim2 = "y") {
     // l1 = this
     // l2 = l
     // l1 = (x1 y1) + a (u1 v1)
     // l2 = (x2 y2) + b (u2 v2)
     // [ u1 -u2 ]     [ t0 ] = [ x2 - x1 ]
     // [ v1 -v2 ] dot [ t1 ] = [ y2 - y1 ]
     
     // Use Cramer's rule
     // Ax = b, then xi = det(Ai) / det(A)
     const A = [
       [ this.v[dim1], -l.v[dim1] ],
       [ this.v[dim2], -l.v[dim2] ]
     ];
     
     const detA = math.det(A);
     if(detA === 0) return false;
     
     const b = [ 
       l.p[dim1] - this.p[dim1], 
       l.p[dim2] - this.p[dim2] 
     ];
     
     const A0 = [
       [ b[0], A[0][1] ],
       [ b[1], A[1][1] ]
     ];
     
     const A1 = [
       [ A[0][0], b[0] ],
       [ A[1][0], b[1] ]
     ];
     
     const t0 = det(A0) / detA;
     const t1 = det(A1) / detA;
     
     const intersection1 = 5;
     
     this.v.multiply(t0);
     p.v.multiply(t1);
     
     
   }
   
   /**
    * Intersection of another line with this one in XY dimension.
    * @param {GeomLine} l       Other line to test for intersection
    * @param {boolean} as_point If true, return a GeomPoint with z set to 0. 
    *                           If false, return a GeomLine.
    * @return {GeomPoint|GeomLine}
    */
   intersectionXY(l, as_point = true) {
        // p0 + t0 * v0 = p1 + t1 * v1
//         t0 = (p1 + t1 * v1 - p0) / v0
   
   
//      this.p.x + t0 * this.v.x = l.p.x + t1 * l.v.x // (1)
//      this.p.y + t0 * this.v.y = l.p.y + t1 * l.v.y // (2)
     
//      t0 = (l.p.x + t1 * l.v.x - this.p.x) / this.v.x // (1)
//      t0 = (l.p.y + t1 * l.v.y - this.p.y) / this.v.y // (2)
//      (l.p.x + t1 * l.v.x - this.p.x) / this.v.x = (l.p.y + t1 * l.v.y - this.p.y) / this.v.y
//      (l.p.x + t1 * l.v.x - this.p.x) * this.v.y = (l.p.y + t1 * l.v.y - this.p.y) * this.v.x
//      this.v.y * l.p.x + t1 * l.v.x * this.v.y - this.p.x * this.v.y = this.v.x * l.p.y + t1 * l.v.y * this.v.x - this.p.y * this.v.x
//      t1 * l.v.x * this.v.y - t1 * l.v.y * this.v.x = this.v.x * l.p.y - this.p.y * this.v.x - this.v.y * l.p.x + this.p.x * this.v.y
//      t1(l.v.x * this.v.y - l.v.y * this.v.x) = this.v.x * (l.p.y - this.p.y) + this.v.y * (this.p.x - l.p.x)
//      const t1 = this.v.x * (l.p.y - this.p.y) + this.v.y * (this.p.x - l.p.x) / (l.v.x * this.v.y - l.v.y * this.v.x)
     
     // const t1_denom = (l.v.x * this.v.y - l.v.y * this.v.x);
//      if(almostEqual(t1_denom, 0)) return [];
     
//      t1 = (this.p.x + t0 * this.v.x - l.p.x) / l.v.x // (1)
//      t1 = (this.p.y + t0 * this.v.y - l.p.y) / l.v.y // (2)
//      (this.p.x + t0 * this.v.x - l.p.x) / l.v.x = (this.p.y + t0 * this.v.y - l.p.y) / l.v.y
//      (this.p.x + t0 * this.v.x - l.p.x) * l.v.y = (this.p.y + t0 * this.v.y - l.p.y) * l.v.x
//      this.p.x * l.v.y + t0 * this.v.x * l.v.y - l.p.x * l.v.y = this.p.y * l.v.x + t0 * this.v.y * l.v.x - l.p.y * l.v.x
//      t0 * this.v.x * l.v.y - t0 * this.v.y * l.v.x = this.p.y * l.v.x - l.p.y * l.v.x - this.p.x * l.v.y + l.p.x * l.v.y
//      t0(this.v.x * l.v.y - this.v.y * l.v.x) = l.v.x * (this.p.y - l.p.y) + l.v.y * (l.p.x - this.p.x)
//      const t0 = l.v.x * (this.p.y - l.p.y) + l.v.y * (l.p.x - this.p.x) / (this.v.x * l.v.y - this.v.y * l.v.x)
     
     // const t0_denom  = (this.v.x * l.v.y - this.v.y * l.v.x);
//      if(almostEqual(t0_denom, 0)) return [];
//      
//      const t1 = this.v.x * (l.p.y - this.p.y) + this.v.y * (this.p.x - l.p.x) / t1_denom;
//      const t0 = l.v.x * (this.p.y - l.p.y) + l.v.y * (l.p.x - this.p.x) / t0_denom;
//      
//      const intersect_x0 = this.p.x + t0 * this.v.x;
//      const intersect_y0 = this.p.y + t0 * this.v.y;
//      
//      const intersect_x1 = l.p.x + t1 * l.v.x;
//      const intersect_y1 = l.p.y + t1 * l.v.y;
//      
//      if(!almostEqual(intersect_x0, intersect_x1) || !almostEqual(intersect_y0, intersect_y1)) return [];
     const intersection = this._intersection2D(this.p.x, this.p.y, this.v.x, this.v.y,
                                               l.p.x, l.p.y, l.v.x, l.v.y);
     if(!intersection) return false;   
     return as_point ? intersection :
                       GeomLine.lineFrom(intersection,
                                         new GeomPoint(intersection.x, intersection.y, 1));
   }
   
   /**
    * Intersection of another line with this one in XZ dimension.
    * @param {GeomLine} l       Other line to test for intersection
    * @param {boolean} as_point If true, return a GeomPoint with y set to 0. 
    *                           If false, return a GeomLine.
    * @return {GeomPoint|GeomLine}
    */
   intersectionXZ(l, as_point = true) {
     const intersection = this._intersection2D(this.p.x, this.p.z, this.v.x, this.v.z,
                                               l.p.x, l.p.z, l.v.x, l.v.z);
     if(!intersection) return false;   
     return as_point ? intersection :
                       GeomLine.lineFrom(new GeomPoint(intersection.x, 0, intersection.y),
                                         new GeomPoint(intersection.x, 1, intersection.y));
   }
   
   /**
    * Intersection of another line with this one in YZ dimension.
    * @param {GeomLine} l       Other line to test for intersection
    * @param {boolean} as_point If true, return a GeomPoint with x set to 0. 
    *                           If false, return a GeomLine.
    * @return {GeomPoint|GeomLine}
    */
   intersectionYZ(l, as_point = true) {
     const intersection = this._intersection2D(this.p.y, this.p.z, this.v.y, this.v.z,
                                               l.p.y, l.p.z, l.v.y, l.v.z);
     if(!intersection) return false;   
     return as_point ? intersection :
                       GeomLine.lineFrom(new GeomPoint(0, intersection.x, intersection.y),
                                         new GeomPoint(1, intersection.x, intersection.y));
   }
   
   
   /**
    * Calculate an intersection point in two dimensions
    * X,Y can stand in for any two dimensions
    * @param {number} p0_x    X-coordinate on the first line
    * @param {number} p0_y    Y-coordinate on the first line
    * @param {number} v0_x    X magnitude of the first line
    * @param {number} v0_y    Y magnitude of the first line
    * @param {number} p1_x    X-coordinate on the second line
    * @param {number} p1_y    Y-coordinate on the second line
    * @param {number} v1_x    X magnitude of the second line
    * @param {number} v1_y    Y magnitude of the second line
    * @return {boolean|GeomPoint} False if no intersection; otherwise the intersection point.
    * @private
    */
   _intersection2D(p0_x, p0_y, v0_x, v0_y, p1_x, p1_y, v1_x, v1_y) {
     const t0_denom  = (v0_x * v1_y - v0_y * v1_x);
     if(almostEqual(t0_denom, 0)) return false;
     
     const t1_denom = (v1_x * v0_y - v1_y * v0_x);
     if(almostEqual(t1_denom, 0)) return false;
   
     const t0 = v1_x * (p0_y - p1_y) + v1_y * (p1_x - p0_x) / t0_denom;
     const t1 = v0_x * (p1_y - p0_y) + v0_y * (p0_x - p1_x) / t1_denom;
     
     const i0 = new GeomPoint(p0_x + t0 * v0_x,
                              p0_y + t0 * v0_y);
                              
     const i1 = new GeomPoint(p1_x + t1 * v1_x,
                              p1_y + t1 * v1_y);
                              
     if(!i0.equivalent(i1)) return false;                         
     return i0;
   }
   
   
   
  

  
}
