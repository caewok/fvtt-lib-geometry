import { GeomPoint } from "./Point.js";
import { GeomVector } from "./Vector.js";
import { GEOM_CONSTANTS } from "./constants.js";
import { orient2d } from "./lib/orient2d.min.js";
import { COLORS, almostEqual } from "./util.js";

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
   get angleXY() { return v.angleXY; }
   
  /**
   * @type {number}
   */
   get angleYZ() { return v.angleYZ; }
   
  /**
   * @type {number}
   */
   get angleXZ() { return v.angleXZ; }
  
  // -------------- FACTORY FUNCTIONS ----------- // 
  /**
   * Construct a line given two points
   * @param {GeomPoint} A  First point
   * @param {GeomPoint} B  Second point.
   * @return {GeomLine} 
   */
  static fromPoints(A, B) {
    return new GeomLine(A, B.subtract(A));
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
   * Get a point on the line
   * t = 0 is this.p.
   * Each increment of t by 1 is equal to adding the line vector magnitude to the line point.
   * So if this.p = {0, 0, 0} and this.v = {10, 20, -10}, this.point(2) returns {20, 40, -20}
   * @param {number} t  Increment, from line formula p + t•v
   * @return {GeomPoint} Point on the line
   */
   point(t) {
     return GeomPoint.fromArray(math.add(this.p, math.dotMultiply(this.v, t)));
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
    * Is this line parallel to another in 3D? 
    * Vectors of infinite length are parallel if A•B = |A|x|B| where |A| is magnitude
    * @param {GeomLine} l
    * @return {boolean} True if parallel
    */
    parallel(l) {
     const dot = this.v.dot(l.v);
     return almostEqual(dot * dot, this.v.magnitudeSquared * l.v.magnitudeSquared);
    }
    
   /**
    * Does this line intersects another in 3D? 
    * Simply the opposite of parallel.
    * @param {GeomLine} l
    * @return {boolean} True if they intersect
    */
    intersects(l) { !this.parallel(l); }
      
   /**
    * Are these two lines perpendicular to one another in 3D?
    * Perpendicular if A•B === 0
    * @param {GeomLine} l
    * @return {boolean} True if perpendicular
    */
    perpendicular(l) {
     almostEqual(this.v.dot(l.v), 0);
    }
     
   /**
    * Is this line parallel to another on the specified plane?
    * @param {GeomLine} l
    * @param {"XY"|"XZ"|"YZ"} plane
    * @return {boolean} True if parallel
    */
    parallel2D(l, plane) {
      const l0 = new GeomLine(this.p, GeomVector.projectToPlane(this.v, plane));
      const l1 = new GeomLine(l.p, GeomVector.projectToPlane(l.v, plane));
      return l0.parallel(l1);
    }
    
   /**
    * Does this line intersect another on the specified plane?
    * @param {GeomLine} l
    * @param {"XY"|"XZ"|"YZ"} plane
    * @return {boolean} True if parallel
    */
    intersects2D(l, plane) { return !this.parallel2D(l, plane); }

   /**
    * Is this line perpendicular to another on the specified plane?
    * @param {GeomLine} l
    * @param {"XY"|"XZ"|"YZ"} plane
    * @return {boolean} True if parallel
    */
    perpendicular2D(l, plane) {
      const l0 = new GeomLine(this.p, GeomVector.projectToPlane(this.v, plane));
      const l1 = new GeomLine(l.p, GeomVector.projectToPlane(l.v, plane));
      return l0.perpendicular(l1);
    }
   
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

     // math.matrixFromColumns does not exist. Do it by hand
     const A = [[v0[0], -v1[0]], [v0[1], -v1[1]]];

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
     const intersection1 = l.point(t1);
     
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
      if(!intersection) return false;
      
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
      if(!intersection) return false;
      
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
      if(!intersection) return false;
      
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
    //const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, "XY") );
    const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, "XY"));
    let intersections = canvas_edges.map(e => this.intersectionXY(e) );

    // find the two intersections that are within the canvas
    intersections = intersections.filter(i => {
      const x_in = (i.x > 0 && i.x < canvas.dimensions.width) || 
                   almostEqual(i.x, 0) || 
                   almostEqual(i.x, canvas.dimensions.width);
      
      if(!x_in) return false;
      
      return (i.y > 0 && i.y < canvas.dimensions.height) || 
             almostEqual(i.y, 0) || 
             almostEqual(i.y, canvas.dimensions.height);
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
