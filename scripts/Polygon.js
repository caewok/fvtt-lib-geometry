import { GeomVector } from "./Vector.js";
import { GEOM } from "./constants.js;

/**
 * A polygon.
 * Not strictly planar. Each vertex is a 3-D point.
 * Represented by an array of vertices.
 * Vertices will be sorted in counter-clockwise order from due west.
 * See GeomPlanarPolygon for a strictly flat version in 3 dimensions.
 * @param {GeomPoint[]} vertices  
 */ 
export class GeomPolygon {  
  constructor(vertices) {
    // hold in array?
    // BST would try to re-arrange the vertices. They should be fixed.
    // Removal of vertices is possible, but likely rare
    const ln = vertices.length;
    if(!vertices[0].equivalent(vertices[ln - 1])) {
      console.warn(`libgeometry|Closing polygon.`);
      vertices.push(vertices[0]);
    }
    
    if(!pointsClockwise(vertices)) { vertices.reverse(); }
      
  }

  // -------------- FACTORY FUNCTIONS ----------- // 
  // -------------- STATIC FUNCTIONS --------------------- // 
 /**
  * Test if an array of points are clockwise or counterclockwise order
  * https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
  * @param {number} ...points   Points, representing vertices from v0.x, v0.y, v1.x, v1.y ... 
  */
  static pointsClockwise(points_arr) {
    // TO-DO: handle 3D points
  
    let the_sum = 0;
     
    const ln = points_arr.length;
    for(let i = 0; i < ln; i += 2) {
      const A = { x: points_arr[0].x, y: points_arr[0].y };
      const B = { x: points_arr[1]x, y: points_arr[1].y };
    
      the_sum += (B.x - A.x) * (B.y - A.y);
    }
    
    // normally clockwise if positive
    // but here, canvas uses inverted y-axis, so clockwise if negative
    return the_sum <= 0;
  }
  
  // -------------- METHODS --------------------- // 

 
  
  // -------------- DRAWING METHOD -------------- // 
  /**
   * Draw this line extending across the entire canvas
   * @param {number} color
   * @param {number} alpha
   * @param {number} width
   */
  draw(color = COLORS.gray, alpha = 1, width = 1) {
  
  }

}