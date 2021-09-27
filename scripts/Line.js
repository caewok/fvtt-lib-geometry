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
     
     return new GeomPoint(intersection_xy.x, intersection_xy.y, intersection_xz.z);
   }
   
   /**
    * Helper function to determine intersection of line with this one along a plane.
    * As if the line were projected onto the 2-D plane.
    * @param {GeomLine}       l
    * @param {boolean}      in2D  If true, get the intersection only for the indicated 
    *                             dim1 and dim2
    * @param {"XY"|"XZ"|"YZ"} plane   Only used if in 2D is true
    * @return {boolean|GeomPoint|GeomLine} 
    */ 
   _intersection(l, { in2D = false, plane = "XY" } = {}) {
     // l0 = this
     // l1 = l
     // l0 = (x0 y0) + a (u0 v0)
     // l1 = (x1 y1) + b (u1 v1)
     // [ u0 -u1 ]     [ t0 ] = [ x1 - x0 ]
     // [ v0 -v1 ] dot [ t1 ] = [ y1 - y0 ]
     
     // Use Cramer's rule
     // Ax = b, then xi = det(Ai) / det(A)
     let l0 = this;
     let l1 = l;
     if(in2D) {
       l0 = GeomVector.projectToPlane(this, plane);
       l1 = GeomVector.projectToPlane(l, plane);
     }
     
     const nzd = this._nonZeroDeterminant(this, l, { in2D: in2D, plane: plane });
     if(!nzd) return false;
          
     const A0 = [
       [ nzd.b[0], nzd.A[0][1] ],
       [ nzd.b[1], nzd.A[1][1] ]
     ];
     
     const A1 = [
       [ nzd.A[0][0], nzd.b[0] ],
       [ nzd.A[1][0], nzd.b[1] ]
     ];
     
     const t0 = math.det(A0) / nzd.detA;
     const t1 = math.det(A1) / nzd.detA;
          
     const i0 = l0.point(t0);
     const i1 = l1.point(t1);
     
     const intersections_match = in2D ? 
             i0.equivalent2D(i1, plane) : i0.equivalent(i1)
             
     return intersections_match ? i0 : false;                  
   }
   
  /**
   * Helper function to get a non-zero determinant matrix for _intersection
   * @param {GeomLine}    l0  First line to use
   * @param {GeomLine}    l1  Second line to use
   * @param {"x"|"y"|"z"}  dim1  First dimension of the plane
   * @param {"x"|"y"|"z"}  dim2  Second dimension of the plane
   * @param {boolean}      in2D  If true, test only in 2D 
   * @return {Array|boolean} The valid array or false if determinant is zero
   * @private
   */
   _nonZeroDeterminant(l0, l1, {in2D = false, plane = "XY"} = {}) {
     // If 2D, test the A matrix for the given two dimensions
     // If 3D, test all combinations (could the others be different?)
     let dim1 = ["x", "x", "y"];
     let dim2 = ["y", "z", "z"];
     
     if(in2D) {
       dim1 = (plane === "YZ") ? "y" : "x";
       dim2 = (plane === "XY") ? "y" : "z";
     }
     
     const ln = dim1.length;     
     for(i = 0; i < ln; i += 1) {
       const d1 = dim1[i];
       const d2 = dim2[i];
     
       const p0 = [l0.p[d1], l0.p[d2]];
       const v0 = [l0.v[d1], l0.v[d2]];
       
       const p1 = [l1.p[d1], l1.p[d2]];
       const v1 = [l1.v[d1], l1.v[d2]];
       
       // math.matrixFromColumns does not exist. Do it by hand
       const A = [[v0[0], -v1[0]], [v0[1], -v1[1]]];
       const detA = math.det(A);
       
       if(!almostEqual(detA, 0)) { return { A: A, b: math.subtract(p1, p0), detA: detA }; }
     }
     
     return false;
   }
   
   /**
    * Intersection of another line with this one on a plane.
    * @param {GeomLine}       l         Other line to test for intersection
    * @param {"XY"|"XZ"|"YZ"} plane   
    * @param {boolean}        as_point  If true, return a GeomPoint with z set to 0. 
    *                                   If false, return a GeomLine.
    * @return {GeomPoint|GeomLine}
    */
    intersection2D(l, plane, as_point = true) {
      const l0 = GeomVector.projectToPlane(this, plane);
      const l1 = GeomVector.projectToPlane(l, plane);
      if(!intersection) return false;
      return as_point ? 
               intersection :
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
