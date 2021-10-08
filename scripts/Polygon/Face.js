import { FaceBST } from "./FaceBST.js";


/**
 * Represent the "face" of a polygon, meaning the area between a group of edges.
 * May be open or closed.
 */
export class GeomFace {
  constructor() {
    this.data = null;
    this._id = undefined;
    this._edges = new FaceBST(this);
    this.num_edges = 0;
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
  
  
  // -------------- METHODS ----------- //  
 /**
  * Link to an edge for this vertex.
  * @param {GeomEdge} e   Edge to add
  */
  addEdge(e) { 
    // always add so that the face is on the left side of the edge
    if(e.lFace.id !== this.id) e = e.symEdge;
    this._edges.insert(e); 
    this.num_edges += 1;
  }

 /**
  * Remove edge from this vertex.
  * @param {GeomEdge} e   Edge to remove
  */
  removeEdge(e) { 
    this._edges.remove(e); 
    this.num_edges -= 1;  
  }
  
 /**
  * Get all the edges
  * @type {GeomEdge[]}
  */
  get edges() { return this._edges.inorder(); } 
  
  // intersect with the plane
  // assuming a distorted topology, get the point location at the intersect
  // e.g., for a rectangle that ramps upward, what is the point of intersection
  //  1/4 up the ramp? 
  
  // intersect with edges
  
  /**
   * Walk around the face either clockwise or counter-clockwise
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
