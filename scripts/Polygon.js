//import { GeomVector } from "./Vector.js";
import { COLORS } from "./constants.js";


/**
 * A polygon.
 * Not strictly planar. Each vertex is a 3-D point.
 * The polygon starts with a single face, encircled by edges.
 * But it is possible to subdivide the polygon in various ways which will 
 * add faces.
 * It is also possible to add "holes"---polygons entirely encompassed by this polygon.
 * @param {GeomPoint[]} points
 */
export class GeomPolygon {
  constructor(points) {
    points = GeomPolygon.closePoints(points);
    if(pointsClockwise(points)) points.reverse;   
    
    this.points = points;
    this._vertices = new Map();
    this._edges = new Map();
    this._faces = new Map();
    this._holes = undefined;
    
    // Create the face that this polygon will encompass
    this.primary_face = new GeomFace();      
    this._faces.set(this.primary_face.id, this.primary_face);
    
    // link to the last edge in counterclockwise for the polygon
    // (first edge is the first in the ._edges map)
    this.last_edge = undefined;
    
    // construct the polygon from the points
    const ln = points.length; 
    let close = false;
    let edge = undefined;
    for(i = 0; i < ln; i += 1) {
      if(i === (ln - 1)) { close = true; }
      const res = this._appendVertex(points[i], edge, { close}
      edge = res.e_new;
    }
      
    this._id = undefined;
    
    this.data = undefined;
  }
  
  
  // -------------- GETTERS/SETTERS ----------- //  

 /**
  * Unique id for this face
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
  
  
  // -------------- STATIC METHODS ----------- // 
 /**
  * From array of coordinates, get a set of points
  * @param {number[]} coords
  * @param {boolean} d2       If false, the coords are listed [x0, y0, z0, x1, y1, z1,...]
  *                           If true, the coords are listed [x0, y0, x1, y1,...]
  * @return {GeomPoint[]}
  */ 
  static pointsFromCoords(coords, { d2 = true } = {}) {
    const ln = coords.length;
    const jump = d2 ? 2 : 3;
    const points = [];
    for(let i = 0; i < ln; i += jump) {
      const p = d2 ? new GeomPoint(coords[i], coords[i + 1], 0) :
                     new GeomPoint(coords[i], coords[i + 1], coords[i + 2]);
      points.push(p);
    }
    return points;
  }
  
 /**
  * From set of points, get array of coordinates
  * Reverse of pointsFromCoords
  * @param {GeomPoint[]} points 
  * @param {boolean} d2       If false, the coords are listed [x0, y0, z0, x1, y1, z1,...]
  *                           If true, the coords are listed [x0, y0, x1, y1,...]
  * @return {number[]}
  */
  static coordsFromPoints(points, { d2 = true } = {}) {
    const coords = [];
    const ln = points.length;
    for(let i = 0; i < ln; i += 1) {
      coords.push(points[i].x, points[i].y);
      if(!d2) { coords.push(points[i].z); }
    }
    return coords;
  }
  
 /**
  * Close points if necessary.
  * By closed, the first point must equal the last
  * @param {GeomPoint[]}
  * @return {GeomPoint[]}
  */
  static closePoints(points) {
    if(!points[0].equivalent(points[points.length - 1])) {
      points.push(points[0]);
    }
    return points;
  } 
  
  
 /**
  * Test if an array of points are clockwise or counterclockwise order
  * https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
  * @param {number} ...points   Points, representing vertices 
  *                               from v0.x, v0.y, v1.x, v1.y ... 
  */
  static pointsClockwise(points) {
    // TO-DO: handle 3D points
  
    let the_sum = 0;
     
    const ln = points.length;
    for(let i = 0; i < ln; i += 2) {
      const A = { x: points[0].x, y: points[0].y };
      const B = { x: points[1].x, y: points[1].y };
    
      the_sum += (B.x - A.x) * (B.y - A.y);
    }
    
    // normally clockwise if positive
    // but here, canvas uses inverted y-axis, so clockwise if negative
    return the_sum <= 0;
  }
  // -------------- METHODS ----------- //  
  
 /**
  * Build the main polygon by linking a vertex (point) to it
  * @param {GeomPoint}  p
  * @param {GeomEdge}   edge    Edge to link to, at the edge destVertex
  * @param {boolean}    close   If true, link this vertex to the first vertex 
  * @private
  */  
  _appendVertex(p, edge = undefined, { close = false } = {}) {
    
    if(close) {
      if(!edge) { console.error(`libgeometry|_appendVertex must have an edge to close`)}
      // link the previous edge to the start edge
      const start_edge = this._edges.values().next().value;
      start_edge.ccwPrevEdge = edge;
      edge.ccwEdge = start_edge;
      
      this.last_edge = edge;
      return;
    } 
    
    // construct v_new(p) --> e_new
    const v_new = new GeomVertex(p);
    const e_new = new GeomEdge(p.subtract(edge.destVertex));
    e_new.lFace = this.primary_face;
    
    e_new.originVertex = v_new;

    e_new.originVertex.addEdge(e_new);
    e_new.lFace.addEdge(e_new);
    
    this._vertices.set(v_new.id, v_new);
    this._edges.set(e_new.id, e_new);
    
    if(edge) {
      // construct edge --> v_new --> e_new
      e_new.ccwPrevEdge = edge;
      edge.ccwEdge = e_new;
      edge.destVertex = v_new;
    }
  }
  
  return { v_new: v_new, e_new: e_new };
  
}



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
    
    if(!GeomPolygon.pointsClockwise(vertices)) { vertices.reverse(); }
      
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
      const B = { x: points_arr[1].x, y: points_arr[1].y };
    
      the_sum += (B.x - A.x) * (B.y - A.y);
    }
    
    // normally clockwise if positive
    // but here, canvas uses inverted y-axis, so clockwise if negative
    return the_sum <= 0;
  }
  
  static closePoints(points_arr) {
    if(points_arr[0])
  
  }
  
  // -------------- METHODS --------------------- // 

  // -------------- ITERATORS/GENERATORS --------------------- //   
  
  // -------------- DRAWING METHOD -------------- // 
 /**
  * Draw this line extending across the entire canvas
  * @param {number} color
  * @param {number} alpha
  * @param {number} width
  */
  drawPolygon(color = COLORS.gray, alpha = 1, width = 1) {
    const points = GeomPolygon.coordsFromPoints(this.points);
    const poly = new PIXI.Polygon(...points)
    canvas.controls.debug.lineStyle(width, color, alpha).drawShape(poly);
    this._holes.forEach(h => {
        h.drawPolygon(color, alpha, width);
    });
  }
  
 /**
  * Draw using individual segments and vertices
  * @param {number} color
  * @param {number} alpha
  * @param {number} width
  */
  draw(color = COLORS.gray, alpha = 1, width = 1) {
    starting_edge = this._edges.values().next().value;
    const walker = starting_edge.walk();
    for(const edge of walker) {
      edge.draw(color, alpha, width);
      edge.destVertex.draw(color, alpha, width);
    }
  
    this._holes.forEach(h => {
        h.draw(color, alpha, width);
    });
  }
    

}