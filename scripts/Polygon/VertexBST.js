import { BinarySearchTree } from "./../BinarySearchTree.js";
import { GeomVector } from "./../Vector.js";
import { GEOM } from "./../constants.js";

/**
 * Organize edges of a face counterclockwise around the face
 */
export class VertexBST extends BinarySearchTree {
//   constructor(vertex) {
//     super();
//     this.vertex = vertex;
//   }
  
 /**
  * @override
  */
  compare(a, b) {
    // arrange so the vertex is the origin of each vector edge
    // done when adding the edge in Vertex Class, so can skip here
    //if(a.originVertex.id !== this.vertex.id) a = a.symEdge;
    //if(b.originVertex.id !== this.vertex.id) b = b.symEdge;
    
    return GeomVector.ccw2D(a.originVertex, a.destVertex, b.destVertex, { plane: GEOM.PROJECTED });
  }
}