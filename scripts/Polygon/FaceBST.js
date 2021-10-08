import { BinarySearchTree } from "./../BinarySearchTree.js";
import { GeomVector } from "./../Vector.js";
import { GEOM } from "./../constants.js";

/**
 * Organize edges of a face counterclockwise around the face
 */
export class FaceBST extends BinarySearchTree {
//   constructor(face) {
//     super();
//     this.face = face;
//   }
  
 /**
  * @override
  */
  compare(a, b) {
    // arrange so the face is to the left of the vectors
    // done when adding in Face, so can skip here
    //if(a.lFace.id !== this.face.id) a = a.symEdge;
    //if(b.lFace.id !== this.face.id) b = b.symEdge;
    
    return GeomVector.ccw2D(a.originVertex, a.destVertex, b.destVertex, { plane: GEOM.PROJECTED });
  }


}