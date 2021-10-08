/* globals canvas */

import { GEOM, COLORS } from "./constants.js";
import { GeomVector } from "./Vector.js";
import { orient2d, orient2dfast } from "./lib/orient2d.js";
import { orient3d, orient3dfast } from "./lib/orient3d.js";
import { almostEqual } from "./util.js";

/**
 * Represents a point in space.
 * Technically equivalent to a vector, but conceptually different.
 * Extended from Array so it can be used with math.js functions.
 * Can have any number of dimensions but some methods only work with 2 or 3.
 * Drawing will use the x, y dimensions.
 *
 * Points follow affine geometry rules. 
 * P - P --> V (point subtraction)
 * P + V --> P (point-vector addition)
 * Not possible to multiply a point times a scalar or add two points together. 
 * But can do affine combinations of points.
 *
 * @param {number[]}  coords  x, y, z, ... coordinates.
 */ 
export class GeomPoint extends Array {
  constructor(...coords) {
    super(...items);
  }

 // --------------- METHODS --------------------- // 
  
 // --------------- GETTERS/SETTERS ------------- //
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
  }
  
 /**
  * @type {number}
  */
  set y(value) { 
    this[1] = value; 
  }
  
 /**
  * @type {number}
  */
  set z(value) { 
    this[2] = value; 
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
 
 // --------------- STATIC METHODS --------------------- // 
 /**
  * Affine combination. 
  * points: [p0, p1, ...]
  * scalars: [a0, a1, ...]
  * a0p0 + a1p1 + ... = p0 + a1(p1 - p0)
  * Weighted average of two+ points. 
  * In 2d, if p0 ≠ p1 and a0, a1 are between 0 and 1, 
  *   then the affine point lies on the line joining p0 and p1.
  *   If a0, a1 are not between 0 and 1, the affine point lies on the line past p0 and p1
  * A convex combination is where a0, a1 are between 0 and 1. The convex combination 
  *   in 2d splits a line segment into two subsegments of relative sizes a1 to a0. 
  * In 2d, the set of all affine combinations generate the line.
  * In 2d, the set of all convex affine combinations generate the segment p0 <--> p1
  * In 3d, the set of all affine combinations define a plane.
  * In 3d, the set of all convex affine combinations generate all points of the triangle
  * @param {GeomPoint[]} points
  * @param {number[]}    scalars
  * @return {GeomPoint}
  */
  static affine(points, scalars) {
    const ln = points.length;
    if(ln !== scalars.length) { console.error(`libgeometry|affine points length ${points.length} but scalars are length ${scalars.length}.`); }
    
    const scalar_sum = math.sum(scalars);
    if(!almostEqual(scalar_sum, 1)) { console.warn(`libgeometry|affine scalars do not sum to 1.`) }
    
    let total = points[0];
    for(i = 0; i < ln; i += 1) {
      total = math.chain()
                  .subtract(points[1], points[0])
                  .multiply(scalars[1])
                  .add(total)
                  .done();
    }
    return new GeomPoint(total);
  }
  
 // --------------- ORIENTATION STATIC METHODS ------------ //
 /**
  * Order of points in space. 
  * See orient2d and orient3d for robust methods and further explanation
  * This version uses the formal definition of the sign of a determinant.
  * It is non-robust but is extensible to more dimensions.
  * If using 2D or 3D points, it is strongly advised to use orient2d or orient3d.
  * Note that the meaning of the return value changes based on dimension of the points.
  * @param {GeomPoint[]}  points
  * @return {number}
  */
  static orientation(points) { return math.det(math.matrixFromRows(points)); }
  
 /**
  * Order of points in space.
  * See orientation. In most cases, you want ccw3d or ccw2d.
  * Note that the meaning of the return value changes based on dimension of the points.
  * @param {GeomPoint[]}
  * @return {GEOM.CLOCKWISE|GEOM.COLLINEAR|GEOM.COUNTERCLOCKWISE}
  */
  static ccw(points) { 
    const res = GeomPoint.orientation(points);
    return almostEqual(res, 0) ? GEOM.COLLINEAR :
           res < 0 : GEOM.CLOCKWISE : GEOM.COUNTERCLOCKWISE 
  }
  
 /**
  * orientation of four points or vectors in 3D
  * p1 --> p2 --> p3 are CCW as viewed from p4
  * Will only use x, y, z dimensions of the points
  * TO-DO: Can projectPoints be done for 4D --> 3D? 
  * @param {GeomPoint}  p1
  * @param {GeomPoint}  p2
  * @param {GeomPoint}  p3
  * @param {GeomPoint}  p4
  * @param {boolean}    robust  Use robust or faster non-robust version of orient3d
  * @return {number}
  */
  static orient3d(p1, p2, p3, p4, { robust = true } = {}) {
    const fn = robust ? orient3d : orient3dfast;
    return fn(p1.x, p1.y, p1.z,
              p2.x, p2.y, p2.z,
              p3.x, p3.y, p3.z,
              p4.x, p4.y, p4.z); 
  }
  
 /**
  * Determine whether 4 points are oriented up, down, or coplanar
  * @param {boolean}   use_robust   Use robust or use non-robust, faster orient test.
  * @param {GeomPoint}  p1
  * @param {GeomPoint}  p2
  * @param {GeomPoint}  p3
  * @param {GeomPoint}  p4
  * @param {boolean}    robust  Use robust or faster non-robust version of orient3d
  * @return {GEOM.UP|GEOM.DOWN|GEOM.COPLANAR}  
  */
  static ccw3d(p1, p2, p3, p4, { robust = true } = {}) {
    const res = GeomPoint.orient3d(p1, p2, p3, p4, { robust });
    return almostEqual(res, 0) ? GEOM.COPLANAR :
           res < 0 ? GEOM.UP : GEOM.DOWN;
  }
   
 /**
  * Orient 3 points on a plane.
  * p1 --> p2 --> p3
  * Will only use x, y dimensions of the points.
  * Pass project value to first project the points onto a 2D plane
  * @param {GeomPoint}  p1
  * @param {GeomPoint}  p2
  * @param {GeomPoint}  p3
  * @param {boolean}    robust  Use robust or faster non-robust version of orient2d
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ|GEOM.PROJECT}  project  
  * @return {number}
  */  
  static orient2d(p1, p2, p3, { robust = true, project = false } = {}) {
    const fn = robust ? orient2d : orient2dfast;
    if(project) {
      const res = GeomPoint.projectPoints([p1, p2, p3], { project });
      p1 = res[0];
      p2 = res[1];
      p3 = res[2];
    }
    
    return fn(p1.x, p1.y,
              p2.x, p2.y,
              p3.x, p3.y);   
  }
  
 /**
  * Determine whether 3 points are oriented counterclockwise, clockwise, or colinear
  * @param {GeomPoint}  p1
  * @param {GeomPoint}  p2
  * @param {GeomPoint}  p3
  * @param {boolean}    robust  Use robust or faster non-robust version of orient2d
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ|GEOM.PROJECT}  project 
  * @return {GEOM.CLOCKWISE|GEOM.COLLINEAR|GEOM.COUNTERCLOCKWISE}
  */
  static ccw2d(p1, p2, p3, { robust = true, project = false } = {}) {
    const res = GeomPoint.orient2d(p1, p2, p3, { robust, project });
    return almostEqual(res, 0) ? GEOM.COLLINEAR :
           res < 0 ? GEOM.CLOCKWISE : GEOM.COUNTERCLOCKWISE;
  }
  
 /** 
  * Helper function to take 3D points and return their equivalents projected
  * onto a plane.
  * Either an arbitrary plane (3+ points) or project onto XY, XZ, or YZ planes.
  * Note that for an arbitrary plane, the result will not be robust
  * @param {GeomPoint[]} points
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane  
  * @return {GeomPoint[]}
  */
  static projectPoints(points, { plane: GEOM.XY }) {
    if(plane === GEOM.PROJECTED) {
      const pl = new GeomPlane(points[0], points[1], points[2]);
      return points.map(p => pl.transformPointToPlane(p));
    }
    
    const dim1 = (plane === GEOM.YZ) ? "y" : "x";
    const dim2 = (plane === GEOM.XY) ? "y" : "z";
    
    return points.map(p => new GeomPoint(p[dim1], p[dim2]))
  } 
 
 /**
  * Signed angle between three points forming angle pqr: 
  * sin Ø = Orient2d(q, p, r) / ||p -q|| • ||r - q||
  * @param {GeomPoint} p
  * @param {GeomPoint} q
  * @param {GeomPoint} r
  * @return {number} (between -π and π)
  */
  signedAngle2d(p, q, r, { robust = true, { project: false }} = {}) { 
    if(project) {
      const res = GeomPoint.projectPoints([p, q, r], { project });
      p = res[0];
      q = res[1];
      r = res[2];
    }
    
    const o = GeomPoint.orient2d(p, q, r, { robust });
    return math.asin(o / (p.subtract(q).magnitude * r.subtract(q).magnitude))  
  }
  
 // --------------- METHODS --------------------- // 
 
 /**
  * Point subtraction.
  * Formula: this - p.
  * @param {GeomPoint} p
  * @return {GeomVector}
  */
  subtract(p) { return new GeomVector(math.subtract(this, p));  }
  
 /**
  * Point/vector addition
  * @param {GeomVector} v
  * @return (GeomPoint)
  */
  add(v) { return new GeomPoint(math.add(this, v)); } 
  
 /**
  * Distance between this and another point.
  * ||pq|| = ||p - q|| (length/magnitude of the vector between)
  * @param {GeomPoint}
  * @return {number}
  */ 
  dist(p) { return this.subtract(p).magnitude; }
  
 /**
  * Distance squared between this and another point.
  * @param {GeomPoint}
  * @return {number}
  */
  distSquared(p) { return this.subtract(p).magnitudeSquared; } 
 
  
 // --------------- DRAWING --------------------- // 
 /**
  * Draw a circular point of given radius.
  * Only drawn in x,y dimensions.
  * @param {number} color
  * @param {number} alpha
  * @param {number} radius
  */
  draw(color = COLORS.gray, alpha = 1, radius = 5) {
   canvas.controls.debug
         .beginFill(color, alpha)
         .drawCircle(this.x, this.y, radius)
         .endFill();
  }
}


