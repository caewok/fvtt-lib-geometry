/* globals math */

import { GeomPoint } from "./Point.js";

/**
 * An arbitrary plane in 3D, represented by two orthogonal lines.
 * @param {GeomPoint}  l0  First line
 * @param {GeomVector} l1  Second line. Should be orthogonal to the first
 */ 
export class GeomPlane {
  constructor(p1, p2, p3) {
    this.A = p1;
    this.B = p2;
    this.C = p3;
     
    this._M = undefined;
    this._invM = undefined;
  }
  
  // -------------- GETTERS/SETTERS ----------- // 
  
  get M() {
    if(this._M === undefined) {
      const AB = this.B.subtract(this.A);
      const AC = this.C.subtract(this.A);
 
      const uAB = AB.normalize();
      const u = A.add(uAB);

      const N = AC.cross(AB);
      const uN = N.normalize();
      const n = A.add(uN);

      const V = uAB.cross(uN);
      const v = A.add(V);
      
      const S = [[A.x, u.x, v.x, n.x],
                 [A.y, u.y, v.y, n.y],
                 [A.z, u.z, v.z, n.z],
                 [  1,   1,   1,   1]];
      
      const D = [[0, 1, 0, 0],
                 [0, 0, 1, 0],
                 [0, 0, 0, 1],
                 [1, 1, 1, 1]];
                 
      this._M = math.multiply(D, math.inv(S));  
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
    p = [p.x, p.y, p.z, 1];
    const res = math.multiply(this.M, p);
    return new GeomPoint(res[0], res[1], 0);
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
    const res = math.multiply(this.invM, p);
    return new GeomPoint(res[0], res[1], res[2]);
  }
  
   

}
