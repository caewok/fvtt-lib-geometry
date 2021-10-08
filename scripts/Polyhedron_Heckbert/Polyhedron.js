// https://www.cs.cmu.edu/afs/andrew/scs/cs/15-463/2001/pub/src/a2/quadedge.html

/**
 * More or less equivalent to the Cell class used by Heckbert.
 * An enclosed volume (or polygon if planar), bounded by vertices and faces
 * Vertices   Vertices of the shape
 * VertexIDs  1...n positive integers 
 * Faces      Faces of the shape (area between the edges)
 * FaceIDs    1...n positive integers
 */

class Polyhedron {
 /**
  * Constructor builds a degenerate cell: 
  * - single closed loop of directed edges,
  * - single vertex
  * - pair of faces
  */
  constructor() {
  
   /**
    * @type {Map<number, GeomVertex>} // Or maybe a map?
    */
    this._vertices = new Map();
    
   /**
    * @type {GeomFace[]} // Or maybe a map?
    */
    this._faces = new Map(); 
  
   
   /**
    * Next unused vertex ID
    * @type {number}
    */
    this._vertexID;
    
   /**
    * Next unused face ID
    * @type {number} 
    */
    this._faceID;
    
    // construct a looping edge that connects to itself
    // single vertex
    // delimits two faces
    
   
  }

  // -------------- GETTERS/SETTERS ----------- // 
 /** 
  * @type {number}
  */
  get nextVertexID() { return this._vertexID += 1; }
  
 /** 
  * @type {number}
  */
  get nextFaceID() { return this._faceID += 1; } 
  
  
  // -------------- FACTORY FUNCTIONS --------------------- //
  
  // -------------- STATIC FUNCTIONS --------------------- //
  get numVertices()
  
  
  
  
  // -------------- METHODS ----------- //
  /**
   * Remove storage of objects linked to the Polyhedron
   */
   static kill() {}
   
  /**
   * Return an edge by splitting the given vertex between a pair of faces
   * New vertex added at the destination of the new edge.
   *    v                               v    v_new
   * ---•---  --> makeVertexEdge --> ---•----•--- 
   *         <-- removeVertexEdge <--      º       º = e_new
   * @param {GeomVertex}  vertex      Vertex to split to make a new edge. 
   *                                  Must share an edge with left and right
   * @param {GeomFace}    left_face   Face adjacent to the new edge. 
   *                                  Must share an edge with vertex
   * @param {GeomFace}    right_face  Face adjacent to the new edge. 
   *                                  Must share an edge with vertex
   * @return {GeomEdge}
   */
   makeVertexEdge(vertex, left_face, right_face) {}
    
  /**
   * Remove an edge from this polyhedron, along with its destination vertex
   * @param {GeomEdge} edge
   */
   removeVertexEdge(edge) {}
   
  /**
   * Return a new edge formed by splitting a given face through a given pair
   * of vertices. A new face will be added to the right of the new edge.
   * The new edge will use origin and destination.
   *       • dest                        • dest
   *      / \                           /|\
   *     | º |    --> makeFaceEdge --> |º|§| º = face
   *      \ /    <-- removeFaceEdge <-- \|/  § = face_new
   *       • origin                      • origin
   *       º = face
   * @param {GeomFace}    face         Face to divide, with origin and destination 
   *                                   on its perimeter
   * @param {GeomVertex}  origin_edge  Vertex on the perimeter
   * @param {GeomVertex}  dest_edge    Vertex on the perimeter
   * @return {GeomEdge}
   */
   makeFaceEdge(face, origin_edge, dest_edge) {}
   
  /**
   * Remove an edge from this polyhedron, along with its right face
   * See figure in makeFaceEdge above
   * @param {GeomEdge} edge
   */
   removeFaceEdge(edge) {}
   
  /**
   * Add a vertex to the polyhedron.
   * @param {GeomVertex} vertex
   */
   addVertex(vertex) {}
   
  /**
   * Remove vertex from this polyhedron
   * @param {GeomVertex} vertex
   */
   removeVertex(vertex) {}
   
  /**
   * Add face to this polyhedron 
   * @param {GeomFace} face
   */
   addFace(face) {}
   
  /**
   * Remove face from this polyhedron
   * @param {GeomFace}
   */
   removeFace(face) {}
   
  /**
   * Get a new face ID (positive number)
   * @return {number} 
   */
   makeFaceID() {} 
    
  /**
   * Provided an edge that encircles "orbits" a specific face and an origin vertex,
   * return the edge that has that origin and also encircles that face.
   * @param {GeomEdge}    edge            Any edge along the face
   * @param {GeomVertex}  origin_vertex   Origin vertex to match
   * @return {GeomEdge|undefined}
   * @private
   */
   getOrbitOrigin(edge, origin_vertex) {}
   
  /**
   * Set the origin of an edge to the provided vertex 
   * @param {GeomEdge}    edge            Edge to set
   * @param {GeomVertex}  origin_vertex   New origin vertex to use
   * @private
   */
   setOrbitOrigin(edge, origin_vertex) {}
   
  /**
   * Get the edge that has the left face in the vertex orbit of a given edge
   * @param {GeomEdge}  edge        Edge that encircles the face
   * @param {GeomFace}  left_face   Left face to search for 
   * @return {GeomEdge} Edge with the same vertex orbit as edge that has the 
   *   specified left face.
   * @private
   */
   getOrbitLeft(edge, left_face) {}
   
  /**
   * Set the left face of a given edge
   * @param {GeomEdge}  edge        Edge of the orbit to set
   * @param {GeomFace}  left_face   New left face to use
   * @private
   */
   setOrbitLeft(edge, left_face) {} 
   
   // -------------- ITERATORS ----------- //
   
   // Edge Iterator
   // Vertex Iterator
   // Face Iterator
   
   
}