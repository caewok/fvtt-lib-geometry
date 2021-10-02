
import { GeomVector } from "./Vector.js";
import { GeomPoint } from "./Point.js";

import { GEOM } from "./constants.js";

/**
 * An approximate circle, using Bezier curves.
 * Represented by a center point and a radius vector
 * The radius vector describes the plane on which the circle lies
 * Interchangeable with the line class in many respects.
 * 1. Has at least two points, such that t = 0 and t = 1 return valid points.
 *    (Other values of t should return a point or undefined)
 * 2. Represented by a vector and a point "anchoring" that vector in space.
 *
 * @param {GeomPoint}  p  Center point of the circle
 * @param {GeomVector} v  Radius and direction of the circular plane.
 */ 
export class GeomBezierCircle {  
  constructor(p, v) {
    if(!(p instanceof GeomVector)) console.error(`libgeometry|GeomBezierCircle p is not a GeomVector`);
    if(!(v instanceof GeomVector)) console.error(`libgeometry|GeomBezierCircle v is not a GeomVector`);

    this.p = p;
    this.v = v;    
  }  
  
   // -------------- FACTORY FUNCTIONS ----------- // 
 /**
  * Create a circle on the plane given a center point and scalar radius.
  * @param {GeomPoint} p       Center point of the circle.
  * @param {number}    radius  Radius of the circle
  * @param {GEOM.XY|GEOM.XZ|GEOM.YZ}  plane
  * @return {GeomCircle}
  */
  fromPoint(p, radius, { plane = GEOM.XY } = {}) {
    const v = plane === GEOM.XY ? new GeomVector(p.x + radius, p.y + radius, p.z) :
              plane === GEOM.XZ ? new GeomVector(p.x + radius, p.y, p.z + radius) :
                                  new GeomVector(p.x, p.y + radius, p.z + radius);
    return new this(p, v);                                      
  }
  
  // -------------- STATIC METHODS --------------------- //
 /**
  * Bezier approximation of a circle arc in the northeast quadrant.
  * See https://spencermortensen.com/articles/bezier-circle/
  * Points returned will be for arc in northeast quadrant (Q2): (0, 1) to (1, 0)
  * @param {number} t  Value between 0 and 1
  * @return {GeomPoint} Point corresponding to that t
  */
  static pointNE(t) {
    const paren = 1 - t;
    const paren2 = paren * paren;
    const paren3 = paren2 * paren;
    const t2 = t * t;
    const t3 = t * t * t;
    const c_times_3 = 3 * 0.551915024494;
  
    const x = c_times_3 * paren2 * t + 3 * paren * t2 + t3;
    const y = c_times_3 * t2 * paren + 3 * t * paren2 + paren3;  
        
    return new GeomPoint(x, y, 0);
  }
  
 /**
  * Approximate bezier circle for each quadrant.
  * @param {number}         t         Value between 0 and 1
  * @param {GEOM.QUADRANT}  quadrant  Which quadrant the arc is in 
  * @return {GeomPoint} Point corresponding to t, adjusted for quadrant.
  */  
  pointForQuadrant(t, quadrant) {
    // recall that y is reversed: -y is at the top, +y is at the bottom
    // bezierCircle: for t 0 -> 1, returns {0,1} to {1, 0}
    let pt;
    switch(quadrant) {
      case GEOM.QUADRANT.NW:
        pt = GeomBezier.pointNE(1 - t);
        pt.x = -pt.x;
        pt.y = -pt.y;
        return pt;
      case GEOM.QUADRANT.NE:
        pt = GeomBezier.pointNE(t);
        pt.y = -pt.y;
        return pt;
      case GEOM.QUADRANT.SE:
        return GeomBezier.pointNE(1 - t);
      case GEOM.QUADRANT.SW: 
        pt = GeomBezier.pointNE(t)
        pt.x = -pt.x;
        return pt;
    } 
  }
 
  // -------------- METHODS --------------------- //    
 /**
  * Get a point on the circle
  * t spans from -2 to 2. 
  * 0 to 1 is NE, 1 to 2 is SE, -2 to -1 is 
  * @param {number|undefined} t  Increment
  *                              Undefined if not a number or not otherwise on the circle.
  * @return {GeomPoint} Point on the line
  */
  point(t) {
    
  
   // if(t === 0) return this.p;
//    return GeomPoint.fromArray(math.add(this.p, math.dotMultiply(this.v, t)));
  }
  
 /**
  * Get arbitrary pixel point on the line.
  * Note: Point will be rounded to nearest pixel and thus may fall slightly outside the line.
  * @param {number} t	Portion of the vector to move along the line, from p.
  * @return {GeomPixelPoint|undefined} Pixel nearest to the point on the line.
  */
  pixelPoint(t) {
    // const p = this.point(t);
//     if(!p) return undefined;
//     return new GeomPixelPoint(p);
  }
   
  // -------------- DRAWING METHOD -------------- // 
       
  /**
   * Draw this circle 
   * @param {number} color
   * @param {number} alpha
   * @param {number} width
   */
  draw(color = COLORS.gray, alpha = 1, width = 1) {
    
  }
}
