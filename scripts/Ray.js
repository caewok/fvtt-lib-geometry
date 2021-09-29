/* globals canvas, ui */

import { GeomLine } from "./Line.js";
import { almostEqual } from "./util.js";
import { GEOM, COLORS } from "./constants.js";

/**
 * An infinite line in one direction from a point
 * Represented by the parametric form of the equation for a line,
 *   p + t*v
 * t is constrained to be only positive. 
 * @param {GeomPoint}  p  Origination point for the ray.
 * @param {GeomVector} v  Direction vector of the ray.
 */ 
export class GeomRay extends GeomLine {

  // -------------------- GETTERS / SETTERS --------------- //
 /**
  * Origin points. Consistent with Foundry Ray class.
  * @type {GeomPoint}
  */
  get x0() { return this.p.x; }
  get y0() { return this.p.y; }
  get z0() { return this.p.z; }
    

   // ccw & orient for points: same as lines  
   
   // ccw & orient for rays:
   // Rays can cross one another so they are both clockwise and counter depending
   // but rays will sometimes have a specific orientation if not crossed
   
   
 /**
  * Get a point on the line
  * t = 0 is this.p.
  * Each increment of t by 1 is equal to adding the line vector magnitude 
  * to the line point. So if this.p = {0, 0, 0} and this.v = {10, 20, -10}, 
  * this.point(2) returns {20, 40, -20}. 
  * For rays, only positive t are permitted. Negative t values are undefined.
  * @override
  */
  point(t) {
    if(almostEqual(t, 0)) { t = 0; }
    if(t < 0) { return undefined; }
    return GeomLine.prototype.point.call(this, t);
  }
   
  // -------------- MULTIPLE DISPATCH METHODS ------------- // 
  
  // parallel: just like lines
  // perpendicular: just like lines 
  // intersection: handled by Line: point returns undefined if outside the ray
    
 /**
  * Does this ray intersect another ray or a line?
  * @override
  */
  intersects(l) {
    if(l.constructor !== GeomLine && 
       l.constructor !== GeomRay) { return l._intersects(this); }
    return this._intersects(l);
  }
  
 /**
  * Private version of {@link intersects}.
  * @override
  * @private 
  */
  _intersects(l) {
    if(!GeomLine.prototype._intersects.call(this, l)) return false;
  
    // determine if the intersection is within the ray
    const t_values = this._intersectionTValues(l);
    if(!t_values) { return false; }
    
    // t values must be positive for rays
    // otherwise, the intersection happens before the ray starts
    if(t_values.t0 < 0) { return false; }
    if(l instanceof GeomRay && t_values.t1 < 0) { return false; }
    return true;
  }
  
 /**
  * Alternative intersection for testing
  * Treat like a segment  
  
 /**
  * Does this ray intersect another ray or a line in 2D?
  * @override
  */
  intersects2D(l, { plane = GEOM.XY } = {}) {
    if(l.constructor !== GeomLine && 
       l.constructor !== GeomRay) { return l._intersects(this, { plane }); }
    return this._intersects2D(l, { plane });
  }
  
 /**
  * Private version of {@link intersects2D}.
  * @override
  * @private 
  */
  _intersects2D(l, { plane = GEOM.XY } = {}) {
     const l0 = this.constructor.projectToPlane(this, plane);
     const l1 = l.constructor.projectToPlane(l, plane);
     return l0._intersects(l1);
  }
   
   
 
 
  // -------------- DRAWING METHOD -------------- // 
       
 /**
  * Draw this segment extending across the entire canvas in one direction
  * @param {number} color
  * @param {number} alpha
  * @param {number} width
  */
  draw(color = COLORS.gray, alpha = 1, width = 1) {
    // draw from point to the canvas edge
    // to do so, locate the intersections of this line with the canvas
    //const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, "XY") );
    const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, "XY"));
    let intersections = canvas_edges.map(e => this.intersection2D(e, "XY") );

    // find the one intersection within the canvas
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
    
    canvas.controls.debug
      .lineStyle(width, color, alpha)
      .moveTo(this.p.x, this.p.y)
      .lineTo(intersections[0].x, intersections[0].y);      
    }
}