/* globals canvas, math, ui */

import { GeomVector } from "./Vector.js";
import { GeomPoint } from "./Point.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GEOM, COLORS } from "./constants.js";
import { almostEqual } from "./util.js";

/**
 * An infinite line in either direction.
 * Represented by the parametric form of the equation for a line,
 *   p + t*v
 * To be part of the line class, the child class must:
 * 1. Have at least two points, such that t = 0 and t = 1 return valid points.
 *    (Other values of t should return a point or undefined)
 * 2. Be represented by a vector and a point "anchoring" that vector in space.
 *
 * @param {GeomPoint}  p  Point through which the line passes.
 * @param {GeomVector} v  Direction vector of the line.
 */ 
export class GeomLine {  
  constructor(p, v) {
    this.p = p;
    this.v = v;

    /**
     * @type {number}
     * @private
     */
     this._x_intercept = undefined;
    
    /**
     * @type {number}
     * @private
     */
     this._y_intercept = undefined; 
    
    /**
     * @type {number}
     * @private
     */
     this._z_intercept = undefined; 
     
    /**
     * @type {number}
     * @private
     */
     this._angleXY = undefined; 
     
    /**
     * @type {number}
     * @private
     */
     this._angleYZ = undefined; 
     
    /**
     * @type {number}
     * @private
     */
     this._angleXZ = undefined;   
     
    /**
     * @type {GeomPoint[]}
     * @private 
     */
     this._canvasIntersectionsXY;
  }
  
  // -------------- GETTERS/SETTERS ------------- //
  
 /**
  * @type {number}
  */
  get x_intercept() {
   if(this._x_intercept === undefined) {
     const t = almostEqual(this.v.y, 0) ? -this.p.z / this.v.z : -this.p.y / this.v.y;
     this._x_intercept = this.p.x + t * this.v.x;
   }
   return this._x_intercept;
  }
   
 /**
  * @type {number}
  */
  get y_intercept() { 
   if(this._y_intercept === undefined) {
     const t = almostEqual(this.v.x, 0) ? -this.p.z / this.v.z : -this.p.x / this.v.x;
     this._y_intercept = this.p.y + t * this.v.y;
   }
   return this._y_intercept;
  } 
   
 /**
  * @type {number}
  */
  get z_intercept() {
   if(this._z_intercept === undefined) {
     const t = almostEqual(this.v.y, 0) ? -this.p.x / this.v.x : -this.p.y / this.v.y;
     this._z_intercept = this.p.z + t * this.v.z;
   }
   return this._z_intercept;
  } 
    
 /**
  * @type {number}
  */
  get angleXY() { return this.v.angleXY; }
   
 /**
  * @type {number}
  */
  get angleYZ() { return this.v.angleYZ; }
   
 /**
  * @type {number}
  */
  get angleXZ() { return this.v.angleXZ; }
   
 /**
  * 2D Intersections of the line with the canvas
  * @type {GeomPoint[]}
  */
  get canvasIntersectionsXY() {
    if(this._canvasIntersectionsXY === undefined) {
      const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, GEOM.XY));
      // find the intersections on the line that are within the canvas
      // a typical line has two. This could vary for child classes.
      // also need to avoid doubling up intersections at the corners.
      const intersections = [];
      canvas_edges.map(e => {
        const intersection = this.intersection2D(e, GEOM.XY); 
        if(intersection) {         
          const x_in = (intersection.x > 0 && intersection.x < canvas.dimensions.width) || 
                        almostEqual(intersection.x, 0) || 
                        almostEqual(intersection.x, canvas.dimensions.width);
          if(!x_in) { return; }

          const y_in = (intersection.y > 0 && intersection.y < canvas.dimensions.height) || 
                        almostEqual(intersection.y, 0) || 
                        almostEqual(intersection.y, canvas.dimensions.height);
          if(!y_in) { return; }    

          if(intersections.length !== 0) {
            const i_is_new = intersections.every(i => {
              return !i.equivalent(intersection);
            });
            if(!i_is_new) { return; }
          }     
          intersections.push(intersection);
        }
      });
      this._canvasIntersectionsXY = intersections;
    }
    return this._canvasIntersectionsXY;
  }  
  
  // -------------- FACTORY FUNCTIONS ----------- // 
  /**
   * Construct a line given two points
   * @param {GeomPoint} A  First point
   * @param {GeomPoint} B  Second point.
   * @return {GeomLine} 
   */
  static fromPoints(A, B) {
    // TO-DO : use this instead of GeomLine? So that other methods can be created?
    return new this(A, B.subtract(A));
  }
  
  /**
   * Get the canvas borders as lines
   * @return {GeomLine[]} The four canvas borders as infinite lines
   */
  static canvasEdges() {
    // clockwise from 0,0
    const canvas_w = canvas.dimensions.width;
    const canvas_h = canvas.dimensions.height;
    let canvas_pts = [{ x: 0, y: 0 }, 
                      { x: canvas_w, y: 0 },
                      { x: canvas_w, y: canvas_h },
                      { x: 0, y: canvas_h }];
  
   canvas_pts = canvas_pts.map(pt => new GeomPoint(pt.x, pt.y));
  
   const canvas_edges = [
       this.fromPoints(canvas_pts[0], canvas_pts[1]), // TO-DO: Use this instead of GeomLine?
       this.fromPoints(canvas_pts[1], canvas_pts[2]),
       this.fromPoints(canvas_pts[2], canvas_pts[3]),
       this.fromPoints(canvas_pts[3], canvas_pts[0]),
     ];
   
   return canvas_edges;  
  }
  
 /**
  * Strip one dimension from a line
  * @param {GeomLine}                l       Line to project onto a plane
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane   Plane to use
  * @return {GeomLine} New line with third dimension zeroed out
  */ 
  static projectToPlane(l, plane) {
    const l_new = new this(l.p.constructor.projectToPlane(l.p, plane),
                     l.v.constructor.projectToPlane(l.v, plane));
    return l_new;
  }

  
  // -------------- METHODS --------------------- // 
 /**
  * Get a point on the line
  * t = 0 is this.p.
  * Each increment of t by 1 is equal to adding the line vector magnitude 
  *  to the line point. So if this.p = {0, 0, 0} and this.v = {10, 20, -10}, 
  *  this.point(2) returns {20, 40, -20}
  * @param {number|undefined} t  Increment, from line formula p + t•v. 
  *                              Undefined if not a number or not otherwise on the line.
  * @return {GeomPoint} Point on the line
  */
  point(t) {
   return GeomPoint.fromArray(math.add(this.p, math.dotMultiply(this.v, t)));
  }
  
 /**
  * Get arbitrary pixel point on the line.
  * Note: Point will be rounded to nearest pixel and thus may fall slightly outside the line.
  * @param {number} t	Portion of the vector to move along the line, from p.
  * @return {GeomPixelPoint|undefined} Pixel nearest to the point on the line.
  */
  pixelPoint(t) {
    const p = this.point(t);
    if(!p) return undefined;
    return new GeomPixelPoint(p);
  }
   
 
 /**
  * Is another line equivalent to this one? (Lines occupy same space)
  * @param {GeomLine} l
  * @return {boolean} True if equivalent
  */ 
  equivalent(l) {
    // lines share the same vector and the point of one is collinear to the other line
    if(!this.v.equivalent(l.v)) return false;
    return l.ccw2D(this.p, GEOM.XY) === GEOM.COLLINEAR && 
           l.ccw2D(this.p, GEOM.XZ) === GEOM.COLLINEAR && 
           l.ccw2D(this.p, GEOM.YZ) === GEOM.COLLINEAR; // do we need to test all three?
  }
  
 /**
  * 2D equivalence
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane
  * @return {boolean} True if equivalent in two dimensions
  */
  equivalent2D(l, { plane = GEOM.XY } = {}) {
    if(!this.v.equivalent2D(l.v, { plane })) return false;
    return l.ccw2D(this.p, { plane }) === GEOM.COLLINEAR;
  }  
    
  
 /**
  * Orientation on 2D plane with respect to a point
  * @param {GeomPoint}     p 
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @return {number} Positive value if CCW, negative if CW, 0 if collinear.
  */
  orientation2D(p, { plane = GEOM.XY } = {}) {
    // Treat the point as a vector, and compare to the vector for this line
    // Need to set the origin of the point to the 0-point for this line
    // Because points have a 0,0 origin whereas the line originates at the line point
    return this.v.orient2D(p.subtract(this.p), { plane });
  }
  
 /**
  * CCW on 2D plane with respect to a point
  * @param {GeomPoint}      p
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane
  * @return {GEOM.CLOCKWISE |
             GEOM.COLLINEAR | 
             GEOM.COUNTERCLOCKWISE}
  */
  ccw2D(p, { plane = GEOM.XY } = {}) {
    // Treat the point as a vector, and compare to the vector for this line
    // Need to set the origin of the point to the 0-point for this line
    return this.v.ccw2D(p.subtract(this.p), { plane })
  }
  
 /**
  * Does this line contain the point in three dimensions?
  * @param {GeomPoint}    p
  * @return {boolean} True if the point lies on the line
  */
  contains(p) {
    return this.ccw2D(p, GEOM.XY) === GEOM.COLLINEAR && 
           this.ccw2D(p, GEOM.XZ) === GEOM.COLLINEAR && 
           this.ccw2D(p, GEOM.YZ) === GEOM.COLLINEAR; // do we need to test all three?           
  }
  
 /**
  * Does this line contain the point in two dimensions?
  * True if collinear with the line
  * @param {GeomPoint}    p
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane
  * @return {boolean} True if the point lies on the plane and the line
  */
  contains2D(p, { plane = GEOM.XY } = {}) {
    return this.ccw2D(p, { plane });
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
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ|undefined} plane
  * @return {boolean} True if parallel
  */
  parallel(l) {
    if(l.constructor !== GeomLine) return l._parallel(this);
    return this._parallel(l);
  }
  
 /**
  * Is this line parallel to another in 2D? 
  * Vectors of infinite length are parallel if A•B = |A|x|B| where |A| is magnitude
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ|undefined} plane
  * @return {boolean} True if parallel
  */ 
  parallel2D(l, { plane = GEOM.XY } = {}) {
    if(l.constructor !== GeomLine) return l._parallel(this, { plane });
    return this._parallel(l, { plane });
  }

 /**
  * Private version of {@link parallel}.
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @return {boolean} True if parallel
  * @private
  */
  _parallel(l) {
    const dot = this.v.dot(l.v);
    return almostEqual(dot * dot, this.v.magnitudeSquared * l.v.magnitudeSquared);
  }
  
 /**
  * Private version of {@link parallel2D}
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @return {boolean} True if parallel
  * @private
  */
  _parallel2D(l, { plane = GEOM.XY } = {}) {
    const l0 = this.constructor.projectToPlane(this, plane);
    const l1 = l.constructor.projectToPlane(l, plane);    
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
  * Are these two lines perpendicular to one another in 2D?
  * Perpendicular if A•B === 0
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @return {boolean} True if perpendicular
  */
  perpendicular2D(l, { plane = GEOM.XY } = {}) {
   if(l.constructor !== GeomLine) return l._perpendicular(this, { plane });
   return this._perpendicular(l, { plane });
  } 
  
 /**
  * Private version of {@link perpendicular2D}.
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @return {boolean} True if perpendicular
  * @private
  */
  _perpendicular2D(l, { plane = GEOM.XY } = {}) {
    const l0 = this.constructor.projectToPlane(this, plane);
    const l1 = l.constructor.projectToPlane(l, plane);
    return l0._perpendicular(l1);
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
  * Does this line intersects another in 2D? 
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @return {boolean} True if they intersect
  */  
  intersects2D(l, { plane = GEOM.XY } = {}) {
    if(l.constructor !== GeomLine) return l._intersects2D(this, { plane });
    return this._intersects(l, { plane });
  }
  
 /**
  * Private version of {@link intersects2D}.
  * @param {GeomLine} l
  * @return {boolean} True if they intersect
  * @private
  */
  _intersects2D(l, { plane = GEOM.XY } = {}) {
     const l0 = this.constructor.projectToPlane(this, plane);
     const l1 = l.constructor.projectToPlane(l, plane);
     return l0._intersects(l1);
  }
  
 /**
  * Alternative version of intersect2D for testing
  * Treat lines as segments with intersections at the canvas edge
  * TO-DO: Handle lines that are vertical in z-direction, so do not intersect canvas edge
  */
  _intersects2DAlt(l, { plane = GEOM.XY } = {}) {
    let l0 = { A: undefined, B: undefined };
    let l1 = { A: undefined, B: undefined };
    
    if(this.canvasIntersectionsXY.length > 1) {
      // use the two intersection points
      l0.A = this.canvasIntersectionsXY[0];
      l0.B = this.canvasIntersectionsXY[1];
    } else if(this.canvasIntersectionsXY.length === 1) {
      l0.A = this.point(0);
      l0.B = this.canvasIntersectionsXY[0];
    } else {
      l0.A = this.point(0);
      l0.B = this.point(1);
    }
    
    if(this.canvasIntersectionsXY.length > 1) {
      // use the two intersection points
      l1.A = l.canvasIntersectionsXY[0];
      l1.B = l.canvasIntersectionsXY[1];
    } else if(this.canvasIntersectionsXY.length === 1) {
      l1.A = l.point(0);
      l1.B = l.canvasIntersectionsXY[0];
    } else {
      l1.A = l.point(0);
      l1.B = l.point(1);
    }
      
    return GeomVector.ccw2D(l0.A, l0.B, l1.A, { plane }) !== 
             GeomVector.ccw2D(l0.A, l0.B, l1.B, { plane }) &&
           GeomVector.ccw2D(l1.A, l1.B, l0.A, { plane }) !== 
             GeomVector.ccw2D(l1.A, l1.B, l0.B, { plane });  
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
    const intersection = this._findIntersection(l);
    if(!intersection) return false;
   
    return new GeomPoint(intersection.x, intersection.y, intersection.z);
  }
  
  /**
  * Intersection point of this line with another in 2D
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @param {boolean} as_point If true, return a GeomPoint with z set to 0. 
  *                           If false, return a GeomLine.
  * @return {GeomPoint}
  */
  intersection2D(l, { plane = GEOM.XY, as_point = true } = {}) {
   if(l.constructor !== GeomLine) return l._intersection(this, { plane, as_point });
   return this._intersection2D(l, { plane, as_point });
  }
  
 /**
  * Private version of {@link intersection}.
  * @param {GeomLine} l
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane
  * @param {boolean} as_point If true, return a GeomPoint with z set to 0. 
  *                           If false, return a GeomLine.
  * @return {GeomPoint}
  */
  _intersection2D(l, { plane = GEOM.XY, as_point = true } = {}) {
    const intersection = this._findIntersection(l, { in2D: true, plane: plane});
    if(!intersection) return false;
    if(as_point) return intersection;

    // make a line, infinite in the non-plane direction
    const x = (plane === GEOM.YZ) ? 1 : intersection.x;
    const y = (plane === GEOM.XZ) ? 1 : intersection.y;
    const z = (plane === GEOM.XY) ? 1 : intersection.z;

    return GeomLine.constructor.fromPoints(intersection, new GeomPoint(x, y, z));
  }
  
  // -------------- HELPER METHODS (PRIVATE) -------------- // 
 
 /**
  * Helper function to determine intersection of line with this one along a plane.
  * As if the line were projected onto the 2-D plane.
  * @param {GeomLine}       l
  * @param {boolean}      in2D  If true, get the intersection only for the indicated 
  *                             dim1 and dim2
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane   Only used if in 2D is true
  * @return {boolean|GeomPoint|GeomLine} 
  * @private
  */ 
  _findIntersection(l, { in2D = false, plane = GEOM.XY } = {}) {
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
      
   const i0 = this.point(t_values.t0);
   if(!i0) return false;
   
   const i1 = l.point(t_values.t1);
   if(!i1) return false;
    
   const intersections_match = in2D ? 
           i0.equivalent2D(i1, plane) : i0.equivalent(i1)
         
   return intersections_match ? i0 : false;                  
  }
    
 /**
  * Helper method to get the t values for the intersection between two lines
  * @param {GeomLine}       l
  * @param {boolean}      in2D  If true, get the intersection only for the indicated 
  *                             dim1 and dim2
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ} plane   Only used if in 2D is true
  * @return {number|undefined}  
  */
  _intersectionTValues(l, { in2D = false, plane = GEOM.XY } = {}) {
   let l0 = this;
   let l1 = l;
   if(in2D) {
     l0 = l0.constructor.projectToPlane(l0, plane);
     l1 = l1.constructor.projectToPlane(l1, plane);
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
  _nonZeroDeterminant(l0, l1, {in2D = false, plane = GEOM.XY} = {}) {
   // If 2D, test the A matrix for the given two dimensions
   // If 3D, test all combinations (could the others be different?)
   let dim1 = ["x", "x", "y"];
   let dim2 = ["y", "z", "z"];
 
   if(in2D) {
     dim1 = (plane === GEOM.YZ) ? "y" : "x";
     dim2 = (plane === GEOM.XY) ? "y" : "z";
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
    //const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, GEOM.XY) );
    const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, GEOM.XY));
    let intersections = canvas_edges.map(e => this.intersection2D(e, GEOM.XY) );

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
