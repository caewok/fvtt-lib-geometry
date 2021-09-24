import { GeomPoint } from "./Point.js";

export class GeomPixelPoint extends GeomPoint {
  /**
   * Represents pixel coordinates in 3-D Euclidean space.
   * @param {number} x    Integer
   * @param {number} y    Integer
   * @param {number} z    Integer elevation off the canvas. Default 0.
   * @constructor
   */
  constructor(x, y, z = 0) {
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(x);
    
    super(x, y, z);
    
    this.location_key = this.x | (this.y << 16);
  }
  
  // -------------- METHODS ----------- // 
  /**
   * Test for PixelPoint equivalence using location_key
   * @override
   */
   equivalent(p, EPSILON) {
     if(p instanceof GeomPixelPoint) { 
       return this.equivalent2D(p, EPSILON) && this.z === p.z;
     }
      
     return super(p, EPSILON);
   }
  
  /**
   * Determine if another PixelPoint point shares the same 2-D space as this one.
   * @override
   */
   equivalent2D(p, EPSILON)  {
     if(p instanceof GeomPixelPoint) { return this.location_key === p.location_key; }
     return super(p, EPSILON);
   }  
   
  /**
   * Given two other points, determine their orientation
   * @override
   */
   orientation2D(p1, p2) {
     if(p1 instanceof GeomPixelPoint &&
        p2 instanceof GeomPixelPoint) {   
       return orient2dfast(this.x, this.y, p1.x, p1.y, p2.x, p2.y);
     }
   
     return super(p1, p2);
   }
   
}