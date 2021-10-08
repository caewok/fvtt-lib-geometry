// https://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/2001/pub/src/a2/quadedge.html

/** 
 * Vertex class, representing the vertex of a polygon.
 * Made of a GeomPoint along with links to edges.
 * @param {GeomCell} cell
 */
class GeomVertex {
  constructor(cell) {
  
   /**
    * Unique id of this vertex
    * @type {number}
    */
    this.id = id;
    
   /**
    * Position of the vertex
    * @type {GeomPoint} 
    */
    this.position = undefined;
   
   /**
    * Data associated with the vertex
    * @type {Object|undefined}
    */
    this.data = null;
    
   /**
    * Polyhedron associated with this vertex.
    * @type {GeomCell}
    * @private
    */
    this._cell = undefined;
    
   /**
    * Outgoing edge of this vertex
    * @type {GeomEdge}
    * @private
    */
    this._edge = undefined;  
  
  }
  // -------------- GETTERS/SETTERS ----------- // 
 /**
  * Cell for this vertex
  * @type {GeomCell}
  */
  get cell() {};
  
 /**
  * Return an outgoing edge from this vertex.
  * @type {GeomEdge}
  */
  get edge() { };  
  
  
  // -------------- STATIC FUNCTIONS --------------------- //
 /**
  * Remove the vertex
  * @param {GeomVertex}
  */ 
  static kill(vertex) {
  } 
   
  // -------------- METHODS --------------------- //
  
 /**
  * Add an outgoing edge to this vertex
  * @param {GeomEdge} 
  */
  addEdge(edge) { 
    if(!edge) console.error(`libgeometry|removeEdge has undefined edge.`);
    this._edge = edge; 
  }
  
 /**
  * Remove an edge from this vertex.
  * @param {GeomEdge}
  */
  removeEdge(edge) { 
    if(!edge) console.error(`libgeometry|removeEdge has undefined edge.`);
    const next = edge.nextOriginEdge;
    this._edge = !next ? null : next;
  } 
 }
