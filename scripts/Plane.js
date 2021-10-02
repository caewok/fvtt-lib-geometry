/* globals math */

import { GeomPoint } from "./Point.js";

/**
 * An arbitrary plane in 3D, represented by two orthogonal lines.
 * @param {GeomPoint}  l0  First line
 * @param {GeomVector} l1  Second line. Should be orthogonal to the first
 */ 
export class GeomPlane {
  constructor(p1, p2, p3) {
    this.AB = p2.subtract(p1);
    this.AC = p3.subtract(p1);
     
    this._M = undefined;
    this._Minv = undefined;
  }
  
  // -------------- GETTERS/SETTERS ----------- // 
  
  get M() {
    if(this._M === undefined) {
      // N is l1
      // AB is l0
      const N = this.AB.cross(this.AC);
      const uAB = this.AB.normalize();
      const uN = N.normalize();
      const V = uAB.cross(uN);
      
      const A = this.p1;
      const u = A.add(uAB);
      const v = A.add(V);
      const n = A.add(uN);
      
      const S = [[A.x, u.x, v.x, n.x],
                 [A.y, u.y, v.y, n.y],
                 [A.z, u.z, v.z, n.z],
                 [  1,   1,   1,   1]];
      
      const D = [[0, 1, 0, 0],
                 [0, 0, 1, 0],
                 [0, 0, 0, 1],
                 [1, 1, 1, 1]];
                 
      this._M = math.mult(D, math.inv(S));  
    }
    return this._M;
  }
  
  get invM() {
    if(this._invM === undefined) { this._invM = math.inv(this.M); }
    return this._invM;
  }
  
  
  // -------------- FACTORY FUNCTIONS ----------- // 

  
  // -------------- METHODS ----------- // 
 /** 
  * Transform a point in 3D in Foundry coordinates to a 2D point with coordinates
  * of the plane.
  * See https://stackoverflow.com/questions/49769459/convert-points-on-a-3d-plane-to-2d-coordinates
  * @param {GeomPoint} p
  * @return {GeomPoint} Point with x & y transformed, z set to 0.
  */
  transformPointToPlane(p) {
    const res = math.mult(this.M, p);
    return new GeomPoint(res[0][0], res[0][1], 0);
  }
  
 /** 
  * Transform a point from a 2D point with coordinates of the plane to 
  * a 3D point in Foundry coordinates.
  * See https://stackoverflow.com/questions/49769459/convert-points-on-a-3d-plane-to-2d-coordinates
  * @param {GeomPoint} p
  * @return {GeomPoint} Point with x & y transformed, z set to 0.
  */ 
  transformPointFromPlane(p) {
    p = [p.x, p.y, p.z, 1];
    const res = math.mult(this._M, p);
    return new GeomPoint(res[0][0], res[0][1], res[0][2]);
  }
  
   

}