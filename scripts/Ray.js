import { GeomLine } from "./Line.js";

export class GeomRay extends GeomLine {
  /**
   * GeomRay is basically the same as a Line except that it extends only in one
   *   direction from p. 
   * Ray treats the p property as the stopping point 
   */
   
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
  * For rays, only positive t are permitted. Negative t will be changed to absolute
  *   value with a warning
  * @param {number} t  Increment, from line formula p + t•v
  * @return {GeomPoint} Point on the line
  */
  point(t) {
    if(t < 0) {
      console.warn(`libgeometry|GeomRay.point parameters "t" is less than 0. Taking absolute value.`);
      t = Math.abs(t);
    }
    return GeomLine.prototype.point.call(this, t);
  }
   
   
   
  // intersect, parallel, perpendicular for rays
  // parallel and perpendicular just like for lines
  
 /**
  * Does this ray intersect another ray or a line when projected on a plane?
  * @param {GeomRay|GeomLine} l
  * @param {"XY"|"XZ"|"YZ"}  plane
  * @return {boolean} True if the rays intersect 
  */ 
  intersects2D(l, plane) {   
    if(l.constructor === GeomRay) { return this.ccw2D(r.p, plane) !== r.ccw2D(this.p, plane); }
    if(l.constructor !== GeomLine) return l.intersects2D(this, plane);
    
    const t_values = this._intersectionTValues(l, { in2D: true, plane: plane} );
    if(t_values === undefined) return false;
    if(t_values.t0 < 0) return false;
    
    // if(l instanceof GeomRay && t_values.t1 < 0) return false;
    
    return true;
  }
  
  // intersects(r)
   
  // intersect, parallel, perpendicular for lines
  // parallel and perpendicular just like for lines
    
 /**
  * Does this ray intersect another ray or a line?
  * @param {GeomLine|GeomRay} l
  * @param {"XY"|"XZ"|"YZ"}  plane
  * @return {boolean} True if the line intersects the ray
  */
  intersects(l) {
    if(l.constructor !== GeomLine && l.constructor !== GeomRay) return l.intersects(this);
  
    // the ray must have a valid t (> 0) to intersect the line
    const t_values = this._intersectionTValues(l);
    if(t_values === undefined) return false;
    if(t_values.t0 < 0) return false;
    
    if(l instanceof GeomRay && t_values.t1 < 0) return false;
    
    return true;
  }
  
  // l.constructor === GeomLine // true if line
  // l.constructor === GeomLine // false if GeomVector
  
  // could set l.constructor to GeomVector to coerce it... 
  // doesn't change instanceof but does change l.constructor
  
 /**
  * What is the intersection point, if any, between this ray and another ray or a line
  *   projected on a 2D plane?
  * @override
  */
  intersection2D(l, plane, as_point = true) {
    if(l.constructor !== GeomLine && l.constructor !== GeomRay) return l.intersection2D(this, plane, as_point);
  
    const t_values = this._intersectionTValues(l, { in2D: true, plane: plane} );
    if(t_values === undefined) return false;
    if(t_values.t0 < 0) return false;
    
    if(l instanceof GeomRay && t_values.t1 < 0) return false;
    
    const i0 = l0.point(t_values.t0);
    const i1 = l1.point(t_values.t1);
     
    const intersections_match = in2D ? 
           i0.equivalent2D(i1, plane) : i0.equivalent(i1)
             
    if(!intersections_match) return false;
    
    if(as_point) return intersection;

    // make a line, infinite in the non-plane direction
    const x = (plane === "YZ") ? 1 : intersection.x;
    const y = (plane === "XZ") ? 1 : intersection.y;
    const z = (plane === "XY") ? 1 : intersection.z;

    return GeomLine.fromPoints(intersection, new GeomPoint(x, y, z));
  }
  
 /**
  * What is the intersection point, if any, between this ray and another ray or a line?
  * @override
  */
  intersection(l) {
    if(l.constructor !== GeomLine && l.constructor !== GeomRay) return l.intersection(this);
    
    const t_values = this._intersectionTValues(l);
    if(t_values === undefined) return false;
    if(t_values.t0 < 0) return false;
    
    if(l instanceof GeomRay && t_values.t1 < 0) return false;
    
    const i0 = l0.point(t_values.t0);
    const i1 = l1.point(t_values.t1);
     
    const intersections_match = in2D ? 
            i0.equivalent2D(i1, plane) : i0.equivalent(i1)
             
    return intersections_match ? i0 : false;                  
  }
  
  draw(color = COLORS.gray, alpha = 1, width = 1) {
  // draw from point to the canvas edge
  // to do so, locate the intersections of this line with the canvas
  //const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, "XY") );
  const canvas_edges = GeomLine.canvasEdges().filter(e => this.intersects2D(e, "XY"));
  let intersections = canvas_edges.map(e => this.intersection2D(e, "XY") );

  // find the one intersections within the canvas
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