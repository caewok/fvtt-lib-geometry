import { GeomPoint } from "./Point.js";
import { GeomVector } from "./Vector.js";
import { GEOM_CONSTANTS } from "./constants.js";
import { orient2d } from "./lib/orient2d.min.js";

export class GeomLine extends GeomVector {  
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
  static fromPoints(A, B) {
    return new GeomLine(A, A.subtract(B));
  }
  
  /**
   * Get the canvas borders as lines
   * @return {GeomLine[]} The four canvas borders as infinite lines
   */
  static canvasEdges() {
    // clockwise from 0,0
    let canvas_pts = [{ x: 0, y: 0 }, 
                      { x: canvas.dimensions.width, y: 0 },
                      { x: canvas.dimensions.width, y: canvas.dimensions.height },
                      { x: 0, y: canvas.dimensions.height }];
  
   canvas_pts = canvas_pts.map(pt => new GeomPoint(pt.x, pt.y));
  
   const canvas_edges = [
       GeomLine.fromPoints(canvas_pts[0], canvas_pts[1]),
       GeomLine.fromPoints(canvas_pts[1], canvas_pts[2]),
       GeomLine.fromPoints(canvas_pts[2], canvas_pts[3]),
       GeomLine.fromPoints(canvas_pts[3], canvas_pts[0]),
     ];
   
   return canvas_edges;  
  }
  
  
  // -------------- METHODS --------------------- // 
  /**
   * Get arbitrary point on the line
   * 
   */
  point(t) {
    return new GeomPoint.fromArray(math.add(this.p, math.dotMultiply(this.v, t)));
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
   * @param {boolean} as_point If true, return a GeomPoint with z set to 0. 
   *                           If false, return a GeomLine.
   * @return {GeomPoint}
   */
   intersection3D(l) {
     // get the x,y intersection then the x,z intersection
     const intersection_xy = this._intersection2D(l, "x", "y");
     if(!intersection_xy) return false;
     
     const intersection_xz = this._intersection2D(l, "x", "z");
     if(!intersection_xz) return false;
     
     return intersection_xy;
   }
   
   /**
    * Helper function to determine intersection of line with this one along a plane.
    * As if the line were projected onto the 2-D plane.
    * @param {GeomLine} l
    * @param {"XY"|"XZ"|"YZ"} plane
    * @return {boolean|GeomPoint|GeomLine} 
    */ 
   _intersection2D(l, dim1 = "x", dim2 = "y") {
     // l0 = this
     // l1 = l
     // l0 = (x0 y0) + a (u0 v0)
     // l1 = (x1 y1) + b (u1 v1)
     // [ u0 -u1 ]     [ t0 ] = [ x1 - x0 ]
     // [ v0 -v1 ] dot [ t1 ] = [ y1 - y0 ]
     
     // Use Cramer's rule
     // Ax = b, then xi = det(Ai) / det(A)
     const p0 = [this.p[dim1], this.p[dim2]];
     const v0 = [this.v[dim1], this.v[dim2]];
     
     const p1 = [l.p[dim1], l.p[dim2]];
     const v1 = [l.v[dim1], l.v[dim2]];
     
     const A = math.matrixFromColumns(v0, math.unaryMinus(v1));
     const detA = math.det(A);
     if(detA === 0) return false;
     
     const b = math.subtract(p1, p0);
          
     const A0 = [
       [ b[0], A[0][1] ],
       [ b[1], A[1][1] ]
     ];
     
     const A1 = [
       [ A[0][0], b[0] ],
       [ A[1][0], b[1] ]
     ];
     
     const t0 = math.det(A0) / detA;
     const t1 = math.det(A1) / detA;
     
     const intersection0 = this.point(t0);
     const intersection1 = this.point(t1);
     
     if(!intersection0._equivalent2D(intersection1, dim1, dim2)) return false;
     
     return intersection0;
   }
   
   /**
    * Intersection of another line with this one in XY dimension.
    * @param {GeomLine} l       Other line to test for intersection
    * @param {boolean} as_point If true, return a GeomPoint with z set to 0. 
    *                           If false, return a GeomLine.
    * @return {GeomPoint|GeomLine}
    */
    intersectionXY(l, as_point = true) {
      const intersection = this._intersection2D(l, "x", "y");
      if(!res) return false;
      
      intersection.z = 0;
      return as_point ? intersection :
                       GeomLine.lineFrom(intersection,
                                         new GeomVector(intersection.x, intersection.y, 1));
    } 
    
   /**
    * Intersection of another line with this one in XZ dimension.
    * @param {GeomLine} l       Other line to test for intersection
    * @param {boolean} as_point If true, return a GeomPoint with y set to 0. 
    *                           If false, return a GeomLine.
    * @return {GeomPoint|GeomLine}
    */
    intersectionXZ(l, as_point = true) {
      const intersection = this._intersection2D(l, "x", "z");
      if(!res) return false;
      
      intersection.y = 0;
      return as_point ? intersection :
                       GeomLine.lineFrom(intersection,
                                         new GeomVector(intersection.x, 1, intersection.z));
    } 
    
   /**
    * Intersection of another line with this one in YZ dimension.
    * @param {GeomLine} l       Other line to test for intersection
    * @param {boolean} as_point If true, return a GeomPoint with x set to 0. 
    *                           If false, return a GeomLine.
    * @return {GeomPoint|GeomLine}
    */
    intersectionYZ(l, as_point = true) {
      const intersection = this._intersection2D(l, "y", "z");
      if(!res) return false;
      
      intersection.x = 0;
      return as_point ? intersection :
                       GeomLine.lineFrom(intersection,
                                         new GeomVector(1, intersection.y, intersection.z));
    } 
    
  
   
   
  /**
   * Draw this line extending across the entire canvas
   * @param {number} color
   * @param {number} alpha
   * @param {number} width
   */
  draw(color = COLORS.gray, alpha = 1, width = 1) {
    // draw from one canvas edge all the way to the other
    // to do so, locate the intersections of this line with the canvas
    const canvas_edges = GeomLine.canvasEdges().filter(e => {
      this.intersectsXY(e);
    });
    const intersections = canvas_edges.map(e => {
      this.intersetionsXY(e);
    });
    
    if(intersections.length === 0) {
      // could be simply vertical in the z direction. 
      ui.notifications.warn("No intersections with canvas edge found for line.");
      this.point(0).draw(color, alpha);
      return;
    }
    
    if(intersections.length === 1) {
      // should not happen
      ui.notifications.error("Only one intersection with canvas edge found for line.");
      return;
    }
    
    canvas.controls.debug
      .lineStyle(width, color, alpha)
      .moveTo(intersections[0].x, intersections[0].y)
      .lineTo(intersections[1].x, intersections[1].y);      
  }
   
}
