import { GeomPoint } from "./Point.js";
import { GeomVector } from "./Vector.js";
import { GEOM_CONSTANTS, COLORS } from "./constants.js";
import { orient2d, orient3d } from "./lib/predicates.min.js";
import { almostEqual } from "./util.js";

/**
 * An infinite line in either direction.
 * Represented by the parametric form of the equation for a line,
 *   p + t*v
 * @param {GeomPoint}  p  Point through which the line passes.
 * @param {GeomVector} v  Direction vector of the line.
 */ 
export class GeomLine {  
  constructor(p, v) {
    this.p = p;
    this.v = v;

    /*
     * @type {number} _x_intercept
     * @private
     */
     this._x_intercept = undefined;
    
    /*
     * @type {number} _y_intercept
     * @private
     */
     this._y_intercept = undefined; 
    
    /*
     * @type {number} _z_intercept
     * @private
     */
     this._z_intercept = undefined; 
     
    /*
     * @type {number} angleXY   In radians
     * @private
     */
     this._angleXY = undefined; 
     
    /*
     * @type {number} angleYZ   In radians
     * @private
     */
     this._angleYZ = undefined; 
     
    /*
     * @type {number} angleXZ   In radians
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
    // TO-DO : use this instead of GeomLine? So that other methods can be created?
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
       GeomLine.fromPoints(canvas_pts[0], canvas_pts[1]), // TO-DO: Use this instead of GeomLine?
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
   * Each increment of t by 1 is equal to adding the line vector magnitude 
   *  to the line point. So if this.p = {0, 0, 0} and this.v = {10, 20, -10}, 
   *  this.point(2) returns {20, 40, -20}
   * @param {number} t  Increment, from line formula p + t•v
   * @return {GeomPoint} Point on the line
   */
   point(t) {
     return GeomPoint.fromArray(math.add(this.p, math.dotMultiply(this.v, t)));
   }
 
 /**
  * Is another line equivalent to this one? (Lines occupy same space)
  * @param {GeomLine} l
  * @return {boolean} True if equivalent
  */ 
  equivalent(l) {
    // lines share the same vector and the point of one is collinear to the other line
    if(!this.v.equivalent(l.v)) return false;
    return l.ccw2D(p, "XY") === GEOM_CONSTANTS.COLLINEAR && 
           l.ccw2D(p, "XZ") === GEOM_CONSTANTS.COLLINEAR && 
           l.ccw2D(p, "YZ") === GEOM_CONSTANTS.COLLINEAR; // do we need to test all three?
  }
  
 /**
  * 2D equivalence
  * @param {GeomLine} l
  * @param {"XY"|"XZ"|"YZ"}  plane
  * @return {boolean} True if equivalent in two dimensions
  */
  equivalent2D(v, plane) {
    if(!this.v.equivalent2D(l.v, plane)) return false;
    return l.ccw2D(p, plane) === GEOM_CONSTANTS.COLLINEAR;
  }  
  
 /**
  * Orientation on 2D plane with respect to a point
  * @param {GeomPoint}     p 
  * @param {"XY"|"XZ"|"YZ"} plane
  * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
  */
  orientation2D(p, plane = "XY") {
    // Treat the point as a vector, and compare to the vector for this line
    // Need to set the origin of the point to the 0-point for this line
    // Because points have a 0,0 origin whereas the line originates at the line point
    return this.v.orient2D(p.subtract(this.p), plane);
  }
  
 /**
  * CCW on 2D plane with respect to a point
  * @param {GeomPoint}      p
  * @param {"XY"|"XZ"|"YZ"}  plane
  * @return {GEOM_CONSTANTS.CLOCKWISE |
             GEOM_CONSTANTS.COLLINEAR | 
             GEOM_CONSTANTS.COUNTERCLOCKWISE}
  */
  ccw2D(p, plane) {
    // Treat the point as a vector, and compare to the vector for this line
    // Need to set the origin of the point to the 0-point for this line
    return this.v.ccw2D(p.subtract(this.p), plane)
  }
  
 /**
  * Does this line contain the point in two dimensions?
  * True if collinear with the line
  * @param {GeomPoint}    p
  * @param {"XY"|"XZ"|"YZ"}  plane
  * @return {boolean} True if the point lies on the plane and the line
  */
  contains2D(p, plane) {
    return this.ccw2D(p, plane);
  }
  
 /**
  * Does this line contain the point in three dimensions?
  * @param {GeomPoint}    p
  * @return {boolean} True if the point lies on the line
  */
  contains(p) {
    return l.ccw2D(p, "XY") === GEOM_CONSTANTS.COLLINEAR && 
           l.ccw2D(p, "XZ") === GEOM_CONSTANTS.COLLINEAR && 
           l.ccw2D(p, "YZ") === GEOM_CONSTANTS.COLLINEAR; // do we need to test all three?
           
    // TO-DO: What about using orient3d?       
  }
  
  // -------------- MULTIPLE DISPATCH METHODS ------------- //
/*
Line, as the parent class, defines a set of user-facing methods that take either another 
  Line or a child of Line as a parameter: 
- parallel
- perpendicular
- intersects
- intersection
(and 2D equivalents)

Line also defines a set of private methods that do the relevant computation:
- _parallel
- _perpendicular
...

It is expected that child classes will override the private methods as necessary, as well
as the public method
Child classes are expected to know how to handle instances of the parent as well as 
instances of themselves.
Execution then goes, e.g.:

Line.prototype.parallel(l) { 
  if(l.constructor !== Line) return l._parallel(this);
  return this._parallel(l);
}

Ray.prototype.parallel(r) {
  if(r.constructor !== Line && r.constructor !== Ray) return r._parallel(this);
  return this._parallel(r);
}

Ray.prototype._parallel(r) {
  prelim_result = Line.prototype._parallel.call(this, r); // if necessary
  // do other stuff
}

Thus, these constructions work:
// Line is parent of Ray is parent of Segment
l = new Line();
r = new Ray();
s = new Segment(); // no parallel definition required; falls back to Ray

l.parallel(l) // Line.parallel --> Line._parallel
l.parallel(r) // Line.parallel --> Ray._parallel --> Line._parallel --> Ray._parallel
l.parallel(s) // Line.parallel --> (Segment._parallel) --> Ray._parallel --> ... 
r.parallel(l) // Ray.parallel --> Ray._parallel --> ...
r.parallel(s) // Ray.parallel --> (Segment._parallel) --> Ray._parallel ... 
s.parallel(l) // Ray.parallel --> Ray._parallel --> ...
...

*/ 
  
 /**
  * Is this line parallel to another in 3D? 
  * Vectors of infinite length are parallel if A•B = |A|x|B| where |A| is magnitude
  * @param {GeomLine} l
  * @return {boolean} True if parallel
  */
  parallel(l) {
    if(l.constructor !== GeomLine) return l._parallel(this);
    return this._parallel(l);
  }

 /**
  * Private version of {@link parallel}.
  * @param {GeomLine} l
  * @return {boolean} True if parallel
  * @private
  */
  _parallel(l) {
    const dot = this.v.dot(l.v);
    return almostEqual(dot * dot, this.v.magnitudeSquared * l.v.magnitudeSquared);
  }
  
 /**
  * Is this line parallel to another on the specified plane?
  * @param {GeomLine} l
  * @param {"XY"|"XZ"|"YZ"} plane
  * @return {boolean} True if parallel
  */
  parallel2D(l, plane) {
     if(l.constructor !== GeomLine) return l._parallel2D(this, plane);
     return this._parallel2D(l, plane)
  }
  
 /*
  * Private version of {@link parallel2D}.
  * @param {GeomLine} l
  * @param {"XY"|"XZ"|"YZ"} plane
  * @return {boolean} True if parallel
  * @private
  */
  _parallel2D(l, plane) {
    const l0 = new this(this.p, GeomVector.projectToPlane(this.v, plane));
    const l1 = new this(l.p, GeomVector.projectToPlane(l.v, plane));
    return l0._parallel(l1);
  }  
  
 /**
  * Are these two lines perpendicular to one another in 3D?
  * Perpendicular if A•B === 0
  * @param {GeomLine} l
  * @return {boolean} True if perpendicular
  */
  perpendicular(l) {
   if(l.constructor !== GeomLine) return l._perpendicular(this);
   return this._perpendicular(l);
  } 
  
 /**
  * Private version of {@link perpendicular}.
  * @param {GeomLine} l
  * @return {boolean} True if perpendicular
  * @private
  */
  _perpendicular(l) {
    return almostEqual(this.v.dot(l.v), 0);
  } 
  
 /**
  * Is this line perpendicular to another on the specified plane?
  * @param {GeomLine} l
  * @param {"XY"|"XZ"|"YZ"} plane
  * @return {boolean} True if perpendicular
  */
  perpendicular2D(l, plane) {
    if(l.constructor !== GeomLine) return l._perpendicular2D(this, plane);
    return this._perpendicular2D(l, plane);
  } 
  
 /**
  * Private version of {@link perpendicular2D}.
  * @param {GeomLine} l
  * @param {"XY"|"XZ"|"YZ"} plane
  * @return {boolean} True if perpendicular
  */
  _perpendicular2D(l, plane) {
    const l0 = new this(this.p, GeomVector.projectToPlane(this.v, plane));
    const l1 = new this(l.p, GeomVector.projectToPlane(l.v, plane));
    return l0.perpendicular(l1);
  } 
  
 /**
  * Does this line intersects another in 3D? 
  * @param {GeomLine} l
  * @return {boolean} True if they intersect
  */  
  intersects(l) {
    if(l.constructor !== GeomLine) return l._intersects(this);
    return this._intersects(l);
  }
  
 /**
  * Private version of {@link intersects}.
  * @param {GeomLine} l
  * @return {boolean} True if they intersect
  * @private
  */
  _intersects(l) {
    // if the perpendicular distance between two lines is 0, they intersect.
    // see https://mikespivey.wordpress.com/2016/10/06/how-do-you-tell-whether-two-lines-intersect-in-3d/
    // https://www.quora.com/How-do-I-prove-that-two-lines-intersect-in-3D-geometry
    // l1 = p1 + xv1
    // l2 = p2 + xv2
    // (p1 - p2) • (v1 X v2) === 0
    // note: shortest distance between the two lines is (p1 - p2) • (v1 X v2) / (v1 X v2)
    
    const displacement_vector = this.p.subtract(l.p);
    const plane = this.v.cross(l.v);
    return almostEqual(displacement_vector.dot(plane));
  }
  
 /**
  * Does this line intersect another on the specified plane?
  * @param {GeomLine} l
  * @param {"XY"|"XZ"|"YZ"} plane
  * @return {boolean} True if parallel
  */
  intersects2D(l, plane) {
    if(l.constructor !== GeomLine) return l._intersects2D(this, plane);
    return this._intersects2D(l, plane);
  }  
  
 /**
  * Private version of {@linke intersects2D}.
  * In 2-D, infinite lines either are parallel or they intersect (or they are equivalent).
  * @param {GeomLine} l
  * @param {"XY"|"XZ"|"YZ"} plane
  * @return {boolean} True if parallel
  * @private
  */
  _intersects2D(l, plane) {
    return !this._parallel2D(l, plane);
  }
  
 /**
  * Intersection point of this line with another
  * @param {GeomLine} l
  * @param {boolean} as_point If true, return a GeomPoint with z set to 0. 
  *                           If false, return a GeomLine.
  * @return {GeomPoint}
  */
  intersection(l) {
   if(l.constructor !== GeomLine) return l._intersection(this);
   return this._intersection(l);
  }
  
 /**
  * Private version of {@link intersection}.
  * @param {GeomLine} l
  * @param {boolean} as_point If true, return a GeomPoint with z set to 0. 
  *                           If false, return a GeomLine.
  * @return {GeomPoint}
  */
  _intersection(l) {
    // get the x,y intersection then the x,z intersection
   const intersection_xy = this._findIntersection(l, {plane: "XY"});
   if(!intersection_xy) return false;

   const intersection_xz = this._findIntersection(l, {plane: "XY"});
   if(!intersection_xz) return false;

   return new GeomPoint(intersection_xy.x, intersection_xy.y, intersection_xz.z);
  }
  
 /**
  * Intersection point of this line with another when projected on 2D plane.
  * @param {GeomLine}       l         Other line to test for intersection
  * @param {"XY"|"XZ"|"YZ"} plane   
  * @param {boolean}        as_point  If true, return a GeomPoint with the other dimension
  *                                     set to 0. 
  *                                   If false, return a GeomLine passing perpendicular
  *                                     to the specified plane.
  * @return {GeomPoint|GeomLine|boolean} If no intersection, return false. 
  */ 
  intersection2D(l, plane, as_point = true) {
    if(l.constructor !== GeomLine) return l._intersection(this, plane, as_point);
    return this._intersection2D(l, plane, as_point);
  }
  
 /**
  * Private version of {@link intersection2D}.
  * @param {GeomLine}       l         Other line to test for intersection
  * @param {"XY"|"XZ"|"YZ"} plane   
  * @param {boolean}        as_point  If true, return a GeomPoint with the other dimension
  *                                     set to 0. 
  *                                   If false, return a GeomLine passing perpendicular
  *                                     to the specified plane.
  * @return {GeomPoint|GeomLine|boolean} If no intersection, return false. 
  */ 
  _intersection2D(l, plane, as_point = true) {
    if(l.constructor !== GeomLine) return l.intersection2D(this);
      
    const intersection = this._findIntersection(l, { in2D: true, plane: plane }); 
    if(!intersection) return false;
    if(as_point) return intersection;

    // make a line, infinite in the non-plane direction
    const x = (plane === "YZ") ? 1 : intersection.x;
    const y = (plane === "XZ") ? 1 : intersection.y;
    const z = (plane === "XY") ? 1 : intersection.z;

    return GeomLine.fromPoints(intersection, new GeomPoint(x, y, z));
  }
   
  // -------------- HELPER METHODS (PRIVATE) -------------- // 
 
 /**
  * Helper function to determine intersection of line with this one along a plane.
  * As if the line were projected onto the 2-D plane.
  * @param {GeomLine}       l
  * @param {boolean}      in2D  If true, get the intersection only for the indicated 
  *                             dim1 and dim2
  * @param {"XY"|"XZ"|"YZ"} plane   Only used if in 2D is true
  * @return {boolean|GeomPoint|GeomLine} 
  * @private
  */ 
  _findIntersection(l, { in2D = false, plane = "XY" } = {}) {
   // l0 = this
   // l1 = l
   // l0 = (x0 y0) + a (u0 v0)
   // l1 = (x1 y1) + b (u1 v1)
   // [ u0 -u1 ]     [ t0 ] = [ x1 - x0 ]
   // [ v0 -v1 ] dot [ t1 ] = [ y1 - y0 ]
 
   // Use Cramer's rule
   // Ax = b, then xi = det(Ai) / det(A)
   const t_values = this._intersectionTValues(l, { in2D: in2D, plane: plane} );
   if(t_values === undefined) return false;
      
   const i0 = l0.point(t_values.t0);
   const i1 = l1.point(t_values.t1);
 
   const intersections_match = in2D ? 
           i0.equivalent2D(i1, plane) : i0.equivalent(i1)
         
   return intersections_match ? i0 : false;                  
  }
    
 /**
  * Helper method to get the t values for the intersection between two lines
  * @param {GeomLine}       l
  * @param {boolean}      in2D  If true, get the intersection only for the indicated 
  *                             dim1 and dim2
  * @param {"XY"|"XZ"|"YZ"} plane   Only used if in 2D is true
  * @return {number|undefined}  
  */
  _intersectionTValues(l, { in2D = false, plane = "XY" } = {}) {
   let l0 = this;
   let l1 = l;
   if(in2D) {
     l0.v = GeomVector.projectToPlane(l0.v, plane);
     l1.v = GeomVector.projectToPlane(l1.v, plane);

     l0.p = GeomVector.projectToPlane(l0.p, plane);
     l1.p = GeomVector.projectToPlane(l1.p, plane);
   }
 
   const nzd = this._nonZeroDeterminant(l0, l1, { in2D: in2D, plane: plane });
   if(!nzd) return undefined;
      
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
 
   return { t0: t0, t1: t1 };
  }
   
    
 /**
  * Helper method to get a non-zero determinant matrix for _intersection
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
   for(let i = 0; i < ln; i += 1) {
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
   
   
  // -------------- DRAWING METHOD -------------- // 
       
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
    let intersections = canvas_edges.map(e => this.intersection2D(e, "XY") );

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
