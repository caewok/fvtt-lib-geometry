/* globals NormalizedRectangle */

import { GeomRay } from "./Line.js";
import { almostEqual} from "./util.js";
import { GEOM } from "./constants.js";
import { GeomLine } from "./Line.js";

/**
 * An line from one point to a second point
 * Represented by the parametric form of the equation for a line,
 *   p + t*v
 * t is constrained to be only between 0 and 1, where 0 gives p and 1 gives the endpoint.
 * v magnitude gives the end point.
 * @param {GeomPoint}  p  Origination point for the ray.
 * @param {GeomVector} v  Direction vector of the ray.
 */ 
export class GeomSegment extends GeomRay {

  constructor(p, v) {
    super(p, v);
    
    // for getters
    this._A = undefined;
    this._B = undefined;
  }
  
  // -------------------- GETTERS / SETTERS --------------- //
 /**
  * Starting point of the segment. Consistent with Foundry Ray class.
  * @type {GeomPoint}
  */
  get A() {
    if(this._A === undefined) { this._A = this.point(0); }
    return this._A;
  }
  
 /**
  * Ending point of the segment. Consistent with Foundry Ray class.
  * @type {GeomPoint}
  */ 
  get B() {
    if(this._B === undefined) { this._A = this.point(1); }
    return this._B;
  }
  
 /**
  * Change in distance along a dimension. Consistent with Foundry Ray class.
  * @type {number}
  */
  get dx() { return this.v.x; }
  get dy() { return this.v.y; }
  get dz() { return this.v.z; }
  
 /**
  * Distance of the segment. Consistent with Foundry Ray class.
  * @type {number}
  */
  get distance() { return this.v.magnitude; }
  get distanceXY() { return this.v.magnitudeXY; }
  get distanceXZ() { return this.v.magnitudeXZ; }
  get distanceYZ() { return this.v.magnitudeYZ; } 
  
 /**
  * A bounding rectangle that encompasses the segment along a plane.
  * @type {NormalizedRectangle}
  */
  get boundsXY() { return new NormalizedRectangle(this.A.x, this.A.y, this.dx, this.dy); }
  get boundsXZ() { return new NormalizedRectangle(this.A.x, this.A.z, this.dx, this.dz); }
  get boundsYZ() { return new NormalizedRectangle(this.A.y, this.A.z, this.dy, this.dz); }
  
  // -------------- METHODS --------------------- // 
  
 /**
  * Get a point on the line
  * t = 0 is this.p.
  * Each increment of t by 1 is equal to adding the line vector magnitude 
  * to the line point. So if this.p = {0, 0, 0} and this.v = {10, 20, -10}, 
  * this.point(2) returns {20, 40, -20}. 
  * For rays, only positive t are permitted. Negative t will be changed to absolute
  *   value with a warning
  * @override
  */
  point(t) {
    if(almostEqual(t, 0)) { t = 0; }
    if(t < 0 || t > 1) {
      console.warn(`libgeometry|GeomSegment.point parameters "t" is less than 0 or greater than 1. Returning undefined.`);
      return undefined;
    }
    return GeomLine.prototype.point.call(this, t);
  }
  
 /**
  * Does this segment intersect another segment, ray or a line?
  * @override
  */
  intersects(l) {
    if(l.constructor !== GeomLine &&
       l.constructor !== GeomRay &&
       l.constructor !== GeomSegment) { return l._intersects(this); }
    return this._intersects(l);   
  }
  
 /**
  * Private version of {@link intersects}.
  * Test segments using ccw
  * @override
  * @private 
  */
  _intersects(l) {
    const t_values = this._intersectionTValues(l);
    if(!t_values) { return false; }
    
    // t values must be between 0 and 1 for segments
    // otherwise, the intersection happens before the ray starts
    if(t_values.t0 < 0 || t_values.t0 > 1) { return false; }
    if(l instanceof GeomSegment && 
       (t_values.t1 < 0 || t_values.t1 > 1)) { return false; }
  
    // could call GeomRay.prototype._intersect but it would repeat _intersectionTValues
    if(l instanceof GeomRay && t_values.t1 < 0) { return false; }
    
    return true;
  }
  
 /**
  * Does this ray intersect another ray or a line in 2D?
  * @override
  */
  intersects2D(l, { plane = GEOM.XY } = {}) {
    // if two segments, can use ccw to test for intersection
    if(l instanceof GeomSegment) {
      // this.A --> this.B --> s.A !== this.A --> B --> s.B &&
      // s.A --> s.B --> this.A !== s.A --> s.b --> this.B
      return this.ccw2D(l.A, { plane }) !== this.ccw2D(l.B, { plane }) && 
             l.ccw2D(this.A, { plane }) !== l.ccw2D(this.B, { plane });    
    }
  
    if(l.constructor !== GeomLine &&
       l.constructor !== GeomRay &&
       l.constructor !== GeomSegment) { return l._intersects(this, { plane }); }
       
    return this._intersects2D(l, { plane });    
  }
  

  
}