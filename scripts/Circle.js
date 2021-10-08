/* globals math */

import { GeomVector } from "./Vector.js";
import { GeomPoint } from "./Point.js";
import { GeomPixelPoint } from "./PixelPoint.js";
import { GEOM, COLORS } from "./constants.js";

/**
 * A circle.
 * Represented by a center point and a radius scalar
 * The circle is flat on the XY plane, at the elevation of the center.z.
 *
 * @param {GeomPoint}  center  Center point of the circle
 * @param {GeomVector} r  Radius of the circular plane.
 */ 
export class GeomCircle {  
  constructor(center, radius) {
    if(!(center instanceof GeomVector)) console.error(`libgeometry|GeomCircle p is not a GeomVector`);

    this.center = center;
    this.radius = radius;    
  }  
  
   // -------------- FACTORY FUNCTIONS ----------- // 

  // -------------- METHODS --------------------- // 
 /**
  * Are two circles equivalent?
  * @param {GeomCircle} Circle to test
  * @return {boolean} True if equivalent
  */
  equivalent(c) {
    if(!(c instanceof GeomCircle)) return false;
    return this.center.equivalent(c.center) && this.radius.equivalent(c.radius);
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
  
   return new GeomPoint(Math.cos(t) * this.radius + this.center.x,
                        Math.sin(t) * this.radius + this.center.y,
                        this.center.z);
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
      .drawCircle(this.center.x, this.center.y, this.radius);   
  }
}
