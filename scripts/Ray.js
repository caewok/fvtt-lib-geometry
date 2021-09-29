import { GeomLine } from "./Line.js";

export class GeomRay extends GeomLine {
  /**
   * GeomRay is basically the same as a Line except that it extends only in one
   *   direction from p. 
   * Ray treats the p property as the stopping point.
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
   
  // -------------- MULTIPLE DISPATCH METHODS ------------- // 
  
  // parallel: just like lines
  // perpendicular: just like lines 
    
 /**
  * Does this ray intersect another ray or a line?
  * @override
  */
  intersects(r) {
    if(r.constructor !== GeomLine && 
       r.constructor !== GeomRay) { return r._intersects(this); }
    return this._intersects(r);
  }
  
 /**
  * Private version of {@link intersects}.
  * @override
  * @private 
  */
  _intersects(r) {
    const t_values = this._intersectionTValues(r);
    if(!t_values) return false;
    
    // t values must be positive for rays
    // otherwise, the intersection happens before the ray starts
    if(t_values.t0 < 0) return false;
    if(r instanceof GeomRay && t_values.t1 < 0) return false;
    return true;
  }
  
 /**
  * Does this ray intersect another ray or a line in 2D?
  * @override
  */
  intersects2D(r, { plane = GEOM.XY } = {}) {
    if(r.constructor !== GeomLine && 
       r.constructor !== GeomRay) { return r._intersects(this, { plane }); }
    return this._intersects2D(r, { plane });
  }
  
 /**
  * Private version of {@link intersects2D}.
  * @override
  * @private 
  */
  _intersects2D(r) {
     const r0 = this.constructor.projectToPlane(this, plane);
     const r1 = r.constructor.projectToPlane(r, plane);
     return r0._intersects(r1);
  }
   
   
 /**
  * What is the intersection point, if any, between this ray and another ray or a line?
  * @override
  */
  intersection(r) {
    if(r.constructor !== GeomLine && 
       r.constructor !== GeomRay) { return r._intersection(this); }
    return this._intersection(r);
  
  }
  
 /**
  * Private version of {@link intersection}.
  * @override
  */
  _intersection(r) {    
    const t_values = this._intersectionTValues(r);
    if(t_values === undefined) return false;
    if(t_values.t0 < 0) return false;
    
    if(r instanceof GeomRay && t_values.t1 < 0) return false;
    
    const i0 = this.point(t_values.t0);
    const i1 = r.point(t_values.t1);
                 
    return i0.equivalent(i1) ? i0 : false;                  
  }  

 /**
  * What is the intersection point, if any, between this ray and another ray or a line
  *   projected on a 2D plane?
  * @override
  */
  intersection2D(r) {
    if(r.constructor !== GeomLine && 
       r.constructor !== GeomRay) { return r._intersection2D(this); }
    return this._intersection2D(r);
  }
  
  
  _intersection2D(r, { plane = GEOM.XY, as_point = true } = {}) {
    const t_values = this._intersectionTValues(r, { in2D: true, plane: plane} );
    if(t_values === undefined) return false;
    if(t_values.t0 < 0) return false;
    
    if(r instanceof GeomRay && t_values.t1 < 0) return false;
    
    const i0 = r0.point(t_values.t0);
    const i1 = r1.point(t_values.t1);
     
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