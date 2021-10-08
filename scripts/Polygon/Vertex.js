import { GeomPoint } from "./../Point.js";
import { FaceBST } from "./FaceBST.js";

/**
 * Vertex, represented by a point.
 * Links to:
 * - 
 */
export class GeomVertex extends GeomPoint {
  constructor(...args) {
    super(...args);
    
    this.data = undefined;
    this._edges = new FaceBST();
    
    // maintain count of edges
    this.num_edges = 0;
  }
  
  // -------------- METHODS --------------------- //
 /**
  * Link to an edge for this vertex.
  * @param {GeomEdge} e   Edge to add
  */
  addEdge(e) { 
    // edges are always inserted such that their origin is this vertex
    if(e.originVertex.id !== this.id) e = e.symEdge;
    this.edges.insert(e.id, e); 
    this.num_edges += 1;
  }

 /**
  * Remove edge from this vertex.
  * @param {GeomEdge} e   Edge to remove
  */
  removeEdge(e) { 
    this.edges.remove(e.id); 
    this.num_edges -= 1;  
  }
  
 /**
  * Get all the edges
  * @type {GeomEdge[]}
  */
  get edges() { return this._edges.inorder(); } 
  
 /**
  * Walk around the vertex either clockwise or counter-clockwise
  * Optionally pass a starting edge
  * First edge returned will be the one provided
  * @param {boolean}   ccw           Walk counterclockwise or clockwise
  * @param {GeomEdge}  start_edge    First edge to use
  * @return {Iterator<GeomEdge>}
  */
  * walkAround({ccw = true, edge = this._edges.findMinNode().data} = {}) {
   let edges = this._edges.inorder();
   if(!ccw) edges.reverse();

   const retains = [];
   const ln = edges.ln;
   let found_start = false;
   for(let i = 0; i < ln; i += 1) {
     const e = edges[i];
     if(!found_start) {
       if(e.id === edge.id) {
         found_start = true;
       } else {
         retains.push(e);
         continue;
       }
     }
     yield e;
   }

   const ln_retains = retains.length;
   for(let i = 0; i < ln_retains; i += 1) {
     const e = retains[i];
     yield e;
   }
  }  

}