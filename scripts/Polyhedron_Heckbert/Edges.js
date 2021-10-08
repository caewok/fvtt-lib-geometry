// https://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/2001/pub/src/a2/quadedge.html

/** 
 * Edge class, representing a directed edge.
 * An edge is a vector (directed) from one vertex to another.
 * Two directed edges make up a segment (wall) of a polygon.
 * @param {number} id   Positive ID number assigned to the edge.
 * @param {Object} data Arbitrary data for this edge
 * @param {GeomVertex|undefined} origin Vertex at the beginning of this edge.
 * @param {GeomVertex|undefined} destination Vertex at the end of this edge.
 * @param {GeomFace|undefined} left Face to the left (ccw) of this edge
 * @param {GeomFace|undefined} right Face to the right (cw) of this edge
 */
class GeomEdge {

 /**
  * Return a new, unconnected edge.
  */
  constructor(data = null) {
    // _index, _next, id initialized by QuadEdge
  
    this.data = data; // data associated with this edge.
    
   /**
    * Array of 4 edges, of which this edge is one.
    * @type {GeomQuadEdge}
    * @private
    */
    this._quad = undefined;  
    
   /**
    * Next counter-clockwise edge from the origin of this one.
    * @type {GeomEdge}
    * @private
    */
    this._next = undefined;
    
   /**
    * Origin vertex, if prime.
    * Null if not prime
    * @type {GeomVertex}
    * @private 
    */
    this._vertex = null;
    
   /**
    * Target face of this edge, if dual.
    * Null if not dual 
    * @type {GeomFace}
    * @private
    */
    this._face = null;
    
   /**
    * Index of the edge for QuadEdge
    * @type {0|1|2|3} 
    * @private
    */    
    this._index = undefined;
    
   /**
    * Numeric ID of the edge. Must be greater than zero.
    * @type {number}
    */
    this.id;
    
   /**
    * Track the ids used thus far
    * @type {number}
    * @private
    */
    this._nextID = 4; 
  }
  
  // -------------- GETTERS/SETTERS ----------- // 
  
  
  
  /**
   * @type {GeomFace}
   * Connect this edge to the left face
   */
   get leftFace() { this.invRotEdge._face; }  
   set leftFace(value) {
     this.rotEdge._face = value;
     value.addEdge(this);
   }
   
 
  /**
   * @type {GeomFace}
   * Connect this edge to the right face
   */
   get rightFace() { this.rotEdge._face; }  
   set rightFace(value) {
     this.invRotEdge._face = value;
     value.addEdge(this.symEdge);
   }
   
  /**
   * @type {GeomVertex}
   * Connect this edge to the origin vertex
   */
   get originVertex() { return this._vertex; }
   set originVertex(value) {
     this._vertex = value;
     value.addEdge(this);
   }
   
  /**
   * @type {GeomVertex}
   * Connect this edge to the destination vertex.
   */
   get destinationVertex() { return this.symEdge._vertex; }
   set destinationVertex(value) {
     this.symEdge.vertex = value;
     value.addEdge(this.symEdge);
   }
   
     
   
  /**
   * @type {GeomEdge}
   */
   get rotEdge() {
     const i = this.index;
     
     // TO-DO: should this use mod?
     return i < 3 ? this._quad[i + 1] : this._quad[i - 3];
   }
   
  /**
   * @type {GeomEdge}
   */
   get invRotEdge() {
     const i = this.index;
     
     // TO-DO: should this use mod?
     return i > 0 ? this._quad[i - 1] : this._quad[i + 3];
   }
   
  /**
   * @type {GeomEdge}
   */
   get symEdge() {
     const i = this.index;
     
     // TO-DO: should this use mod?
     return i < 2 ? this._quad[i + 2] : this._quad[i - 2];
   }
   
  /**
   * @type {GeomEdge}
   */
   get nextOriginEdge() { return this._next; }
   
  /**
   * @type {GeomEdge}
   */
   get prevOriginEdge() { return this.rotEdge.nextOriginEdge.rotEdge; }
   
  /**
   * @type {GeomEdge}
   */
   get nextDestinationEdge() { this.symEdge.nextOriginEdge.symEdge; }
   
  /**
   * @type {GeomEdge}
   */
   get prevDestinationEdge() { return this.invRotEdge.nextOriginEdge.invRotEdge; }
   
  /**
   * @type {GeomEdge}
   */
   get nextLeftEdge() { return this.invRotEdge.nextOriginEdge.rotEdge; }
   
  /**
   * @type {GeomEdge}
   */
   get prevLeftEdge() { return this.nextOriginEdge.symEdge; } 
  
  /**
   * Return the edge around the right face ccw following this edge.
   * @type {GeomEdge} 
   */
   get nextRightEdge() { return this.rotEdge.nextOriginEdge.invRotEdge; } 
    
  /**
   * @type {GeomEdge}
   */
   get prevRightEdge() { return this.symEdge.nextOriginEdge; }  
  
   
  // -------------- FACTORY FUNCTIONS --------------------- // 
 /**
  * Create a QuadEdge array of edges
  * @param {Object|null} data
  * @return {GeomEdge[]}
  */
  makeQuadEdge(data = null) {
    return new QuadEdge(data).edges;
  }
   
  // -------------- STATIC FUNCTIONS --------------------- //
 /**
  * Delete a given edge
  * @param {GeomEdge} edge
  */ 
  
  static kill(edge) {
    // make sure the edge exists
    if(!edge) console.error(`libgeometry|kill edge: edge undefined.`);
    
    // remove the edge from its cell    
    splice(edge, edge.prevOriginEdge);
    splice(edge.symEdge, edge.SymEdge.prevOriginEdge);
    
    // free the quad edge that the edge belongs to
    // TO-DO
    
  }
  
 /**
  * Affects the two edge rings around a and b origins and left faces.
  * If distinct, combine them into one.
  * If same ring, break into two.
  * See Guibas & Stolfi (1985) p. 96.
  * @param {GeomEdge} a
  * @param {GeomEdge} b
  */
  static splice(a, b) {
    if(!a || !b) console.error(`libgeometry|splice a or b is undefined`);
    
    const alpha = a.nextOriginEdge.rotEdge;
    const beta = b.nextOriginEdge.rotEdge;
    
    a.next = b.nextOriginEdge;
    b.next = a.nextOriginEdge;
    alpha.next = beta.nextOriginEdge;
    beta.next = alpha.nextOriginEdge;
  }
  
  // -------------- METHODS --------------------- // 

} 

/**
 * Private class to hold the 4 edges 
 */
class GeomQuadEdge() {
  constructor(data = null) {
    this.edges = [];
    
    for(i = 0; i < 4; i += 1) {
      this.edges[i] = new Edge(data);
    }
    
    const id = Edge.nextID; // TO-DO: Fix this.
   
    for(i = 0; i < 4; i += 1) {
      this.edges[i]._next = this.edges[(i + 1) % 4];
      this.edges._quad = this;
      this.edges[i].id = id + i;
    }
    
    Edge.nextID = id+4; // TO-DO: Fix this. Need to track ID some other way
  }
}