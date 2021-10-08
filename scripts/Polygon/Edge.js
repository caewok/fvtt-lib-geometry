import { GeomVector } from "./../Vector.js";

/**
 * Edge, represented by a vector.
 * Links to:
 * - origin and destination vectors.
 * - left and right faces
 * - previous and next edges ccw and cw
 * Vector should be sized such that adding vector to origin gets the destination vertex.
3     4    
\  |  /   1. ccwPrevEdge <--> sym.cwEdge
 \ | /    2. cwPrevEdge  <--> sym.ccwEdge
  \|/     3. ccwEdge     <--> sym.cwPrevEdge
   •      4. cwEdge      <--> sym.ccwPrevEdge
/|\|      (Use this.sym to flip direction to get other edges)
 | | e    
dir|
   •
  /|\
 / | \
1     2 
*/
export class GeomEdge extends GeomVector {
  constructor(...args) {
    super(...args);
    
    this._originVertex = undefined;
    this._destVertex = undefined;
    
    this._lFace = undefined;
    this._rFace = undefined;
    
    this._ccwEdge = undefined; // next edge in the CCW direction; shares LFace
    this._cwEdge = undefined; // next edge in CW direction; shares RFace
    this._ccwPrevEdge = undefined; // prior edge in CCW direction; shares LFace
    this._cwPrevEdge = undefined; // prior edge in cw direction; shares RFace
        
    this.data = null;
    this._id = undefined;
    this._segment = undefined;
    
    this._symEdge = undefined;
  }
  
  // -------------- GETTERS / SETTERS --------------------- //
 /**
  * @override
  */
  set x(value) {
    GeomVector.prototype.x.call(this, value);
    this._symEdge = undefined;
    this._segment = undefined;
  }
  
  set y(value) {
    GeomVector.prototype.y.call(this, value);
    this._symEdge = undefined;
    this._segment = undefined;
  } 
  
  set z(value) {
    GeomVector.prototype.z.call(this, value);
    this._symEdge = undefined;
    this._segment = undefined;
  } 
  
  
 /**
  * Symmetric edge, pointing the other direction
  */
  get symEdge() {
    if(this._symEdge === undefined) {
      const e = new GeomEdge(-this.x, -this.y, -this.z);
      e._originVertex = this._destVertex;
      e._destVertex = this._originVertex;
      
      e._rFace = this._lFace;
      e._lFace = this._rFace;
      
      e._ccwEdge = this._cwPrevEdge;
      e._cwEdge  = this._ccwPrevEdge;
      
      e._ccwPrevEdge = this._cwEdge;
      e._cwPrevEdge  = this._ccwEdge;
            
      e.data = this.data;
      
      this._symEdge = e;
    }
    return this._symEdge;
  }
  
  get segment() {
    if(this._segment === undefined) {
      const s = new GeomSegment(this.originV, this);
      s.data = this.data;
      s.id = this.id;
    }
  }
  
  get ccwEdge() { return this._ccwEdge; }
  get cwEdge()  { return this._cwEdge; }
  get ccwPrevEdge() { return this._ccwPrevEdge; }
  get cwPrevEdge()  { return this._cwPrevEdge; }
  
  set ccwEdge(value) {
    this._ccwEdge = value;
    if(this._symEdge) { this.symEdge._cwPrevEdge = value; }    
  }
  
  set cwEdge(value) {
    this._cwEdge = value;
    if(this._symEdge) { this.symEdge._ccwPrevEdge = value; }
  } 
  
  set ccwPrevEdge(value) {
    this._ccwPrevEdge = value;
    if(this._symEdge) { this.symEdge._cwEdge = value; }
  }
  
  set cwPrevEdge(value) {
    this._cwPrevEdge = value;
    if(this._symEdge) { this.symEdge._ccwEdge = value; }
  }
  
  get originVertex() { return this._originVertex; }
  get destVertex()   { return this._destVertex; }
  
  set originV(value) {
    this._originVertex = value;
    if(this._segment) { this._segment = undefined; }
    if(this._symEdge) { this.symEdge._destVertex = value; }
  }
  
  set destV(value) {
    this._destVertex = value;
    if(this._symEdge) { this.symEdge._originVertex = value; }
  }
  
  get lFace(value) { return this._lFace; }
  get rFace(value) { return this._rFace; }
  
  set lFace(value) {
    this._lFace = value;
    if(this._symEdge) { this.symEdge._rFace = value; }
  }
  
  set rFace(value) {
    this._rFace = value;
    if(this._symEdge) { this.symEdge._lFace = value; } 
  }
  
  // -------------- STATIC METHODS -------------------------------- //

 /**
  * Remove an edge and replace it with its origin vertex.
  * Combine the origin and destination vertices.
  *    v                               v    v_new
  * ---•---  --> makeVertexEdge --> ---•----•--- 
  *         <-- removeVertexEdge <--      º       º = e_new
  * @param {GeomEdge} edge
  * @param {"origin"|"destination"|"average"|"disconnect"} method   How to combine the two
  *   vertices. Origin and destination mean use those vertices, respectively. Average
  *   constructs a new vertex at the midpoint. 
  *   Disconnect keeps the vertices and does not link them.
  * @return {GeomVertex|GeomVertex[]}  
  */
  static removeVertexEdge(edge, {method = "origin"} = {}) {
    if(method === "disconnect") { return [edge.originVertex, edge.destVertex]; }

    let target_v;
    let removed_e;
    switch(method) {
      case "origin":
        target_v = edge.originVertex;
        removed_e = edge.destVertex.edges;
        break;
      case "destination":
        target_v = edge.destVertex;
        removed_e = edge.originVertex.edges;
        break;
      case "average":
        const p = edge.originVertex.add(edge.multiplyScalar(.5));
        target_v = new GeomVertex(p);
        removed_e = edge.originVertex.edges.push([...edge.destVertex.edges]);
        break;      
    }
    // update the relevant edge vectors
    // the edge now stretches from the removed vector to the remaining
    // add to the vector the distance between the removed and the target
    const added_v = removed_v
    removed_e.forEach(e => {
      const new_e = e.moveVertex(removed_e, target_v);
      target_v.addEdge(new_e);
    });
    
    delete edge;
    
    return target_v;
  }
  
 /**
  * Add/insert an edge. All adjacent edges should keep the same faces, so that 
  * the vertex is essentially stretched into two.
  *    v                               v    v_new
  * ---•---  --> makeVertexEdge --> ---•----•--- 
  *         <-- removeVertexEdge <--      º       º = e_new
  * @param {GeomVertex} v           Vertex to split
  * @param {GeomFace}   left_face   Left face
  * @param {GeomFace}   right_face  Right face
  * @param {GeomPoint}  p           Location of the new vertex
  * @return {GeomEdge} The new edge. The new vertex will be at edge.destVertex.
  */
  static makeVertexEdge(vertex, left_face, right_face, p = vertex) {
    const e_new = new GeomEdge(p.subtract(vertex));
    const v_new = new GeomVertex(p);
    
    e_new.lFace = left_face;
    e_new.rFace = right_face;
    
    e_new.originVertex = vertex;
    e_new.destVertex = v_new;
    
    left_face.addEdge(e_new);
    right_face.addEdge(e_new);
    
    v.addEdge(e_new);
    v_new.addEdge(e_new);
    
    // walking around the vertex clockwise, edges are assigned to the new vertex
    //   if between the right face and left face. 
    // need to first find an appropriate starting edge
    const starting_edge = v.edges.find(e => {
      return e.rFace.id === right_face.id || 
             e.rFace.id === left_face.id ||
             e.lFace.id === left_face.id ||
             e.lFace.id === right_face.id;
    });
    
    const walker = vertex.walkAround({ edge: starting_edge });
    let in_upper = false;
    for(const edge of walker) {
      if(edge.rFace.id === right_face.id) {
        // we have hit the beginning of the top edges. 
        // this edge is the clockwise edge:
        // e_new --> v_new -- cw --> edge
        e_new.cwEdge = edge; 
//         v_new.addEdge(edge);
//         v.removeEdge(edge);
        in_upper = true;
      } else if(edge.rFace.id === left_face.id) {
        // we have hit the beginning of the bottom edges
        // edge --> ccw --> v --> e_new
        e_new.ccwPrevEdge = edge;
        in_upper = false;
      } else if(edge.lFace.id === left_face.id) {
        // we have hit the end of the top edges
        // e_new --> v_new -- ccw --> edge
        // add this as the last edge to v_new
        e_new.ccwEdge = edge;
        v_new.addEdge(edge);
        v.removeEdge(edge);
        in_upper = false;
      } else if(edge.lFace.id === right_face.id) {
        // we have hit the end of the bottom edges
        // edge --> v -- cw --> e_new
        e_new.cwPrevEdge = edge;
        in_upper = false;
      }
      
      if(in_upper) {
        v_new.addEdge(edge);
        v.removeEdge(edge);
      } 
    }
    return e_new;
    
  }
  
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
  * @param {GeomFace}    face           Face to divide, with origin and destination 
  *                                     on its perimeter
  * @param {GeomVertex}  origin_vertex  Vertex on the perimeter
  * @param {GeomVertex}  dest_vertex    Vertex on the perimeter
  * @return {GeomEdge}
  */
  static makeFaceEdge(face, origin_vertex, dest_vertex) {
    const e_new = new GeomEdge(dest_vertex.subtract(origin_vertex));
    const f_new = new GeomFace();
    
    e_new.lFace = face;
    e_new.rFace = f_new;
    
    e_new.originVertex = origin_vertex;
    e_new.dest_vertex = dest_vertex;
    
    // we need to walk around the face, starting with the edge at the org vertex 
    // with a left face equal to this one
    
    const starting_edge = origin_vertex.edges.find(e => {
      e.lFace.id === face.id; 
    });
    
    const walker = face.walkAround({ edge: starting_edge });
    for(const edge of walker) {
      let dest_found = false;
      if(!dest_found) {
        if(edge.originVertex.id === dest_vertex.id) { dest_found = true; }
      }
      
      if(dest_found) {
        // everything from here on is circling the old face
        break;  
      }
      // change each left face to the new face until dest is found
      edge.lFace = f_new;
      face.removeEdge(edge);
    }
    
    face.addEdge(e_new);    
    f_new.addEdge(e_new);
    
    origin_vertex.addEdge(e_new);
    dest_vertex.addEdge(e_new);
    
    return e_new;
  }
  
 /**
  * Remove an edge that splits two faces.
  * This will remove the right face.
  * See makeFaceEdge.
  * @param {GeomEdge}
  * @return {GeomFace} The remaining face
  */
  static removeFaceEdge(edge) {
   // for the right face, walk around and change the face for each edge
    const walker = edge.rFace.walkAround();
    const remaining_face = edge.lFace;
    for(const e of walker) {
      e.lFace = remaining_face;
      remaining_face.addEdge(e);
    }
    edge.originVertex.removeEdge(edge);
    edge.destVertex.removeEdge(edge);
    remaining_face.removeEdge(edge);
    
    delete edge;
    
    return remaining_face;
  }
  
  
  // -------------- METHODS -------------------------------- //
 
 /**
  * Change one of the vertices for the edge.
  * Update the vector accordingly
  * @param {GeomVertex} old_v
  * @param {GeomVertex} new_v
  * @return {GeomEdge} The updated edge
  */
  moveVertex(old_v, new_v) {
    const is_origin = old_v.id === this.originVertex.id ? true :
                      old_v.id === this.destVertex.id ? false :
                      undefined;
    
    if(is_origin === undefined) {
      console.warn(`libgeometry|moveVertex old_v.id not found in vertices.`);
      return;
    }
    
    const delta = this.originVertex.subtract(new_v);
    const new_e = old_v.add(delta);
    this.x = new_e.x;
    this.y = new_e.y;
    this.z = new_e.z;
  
    if(is_origin) {
      this.originVertex = new_v;
    } else 
      this.destVertex = new_v;
    } 
    return this;
  }
  
  // -------------- ITERATORS/GENERATORS ------------------- //
 /**
  * Construct an iterator to get each linked edge.
  * First edge returned will be the one provided or its symmetric edge.
  * @param {boolean}  ccw       Walk counterclockwise or clockwise?
  * @pararm {boolean} reverse   Walk from the edge destination to the edge origin 
  *                             (walk the symEdge)  
  * @return {Iterator<GeomEdge>}
  */
  * walk({ccw = true, reverse = false} = {}) {
    let e = this;
    if(reverse) e = e.symEdge;
    const prop = ccw ? "ccwEdge" : "cwEdge";
    
    let e_new = e;
    do {
      yield e_new;
      e_new = ccw ? e_new[prop] : e_new[prop];
    
    } while(e.id !== e_new.id)    
   }
  
 /**
  * Draw this vector from a given origin point. (for debugging)
  * @param {number} color
  * @param {number} alpha
  * @param {number} width
  * @override
  */
  draw(color = COLORS.gray, alpha = 1, width = 1) {
    Vector.prototype.draw.call(this, this.originVertex, color, alpha, width);
  }
  
  

}