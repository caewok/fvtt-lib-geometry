/* globals math */

import { GeomVector } from "./Vector.js";
import { GeomPoint } from "./Point.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GEOM, COLORS } from "./constants.js";

/**
 * A circle.
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
export class GeomCircle {  
  constructor(p, v) {
    if(!(p instanceof GeomVector)) console.error(`libgeometry|GeomCircle p is not a GeomVector`);
    if(!(v instanceof GeomVector)) console.error(`libgeometry|GeomCircle v is not a GeomVector`);

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
  static fromPoint(p, radius, { plane = GEOM.XY } = {}) {
    const v = plane === GEOM.XY ? new GeomVector(radius, radius, 0) :
              plane === GEOM.XZ ? new GeomVector(radius, 0, radius) :
                                  new GeomVector(0, radius, radius);
    return new this(p, v);                                      
  }
 
  // -------------- METHODS --------------------- // 
 /**
  * Are two circles equivalent?
  * @param {GeomCircle} Circle to test
  * @return {boolean} True if equivalent
  */
  equivalent(c) {
    if(!(c instanceof GeomCircle)) return false;
    return this.p.equivalent(c.p) && this.v.equivalent(c.v);
  }

   
 /**
  * Get a point on the circle
  * If on XY plane:
  * t === 0 or 2π or -2π: leftmost point
  * t === π 
  * @param {number|undefined} t  Increment in radians
  * @return {GeomPoint} Point on the line. 
  */
  point(t) {
   t = Math.normalizeRadians(t);
  
   return new GeomPoint(Math.cos(t) * this.v.magnitude + this.p.x,
                        Math.sin(t) * this.v.magnitude + this.p.y);
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
   
  // -------------- DRAWING METHOD -------------- // 
       
  /**
   * Draw this circle 
   * @param {number} color
   * @param {number} alpha
   * @param {number} width
   */
  draw(color = COLORS.gray, alpha = 1, width = 1) {
    canvas.controls.debug
      .lineStyle(width, color, alpha)
      .drawCircle(this.p.x, this.p.y, this.v.magnitudeXY);   
  }
}
