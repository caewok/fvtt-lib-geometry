export class GeomLine {  
  /**
   * Represents a line with infinite length in either direction.
   * Defined by a slope and y-intercept. y = mx + b
   * @property {number} m    Slope of the line. 0 for horizontal lines. 
   *                           Undefined for vertical.
   * @property {number} b    Y-intercept. Undefined for vertical.
   * @property {number} k    X-intercept. Optional but for vertical lines.
   * @constructor
   */
  m: number,
  b: number
  k: number

  constructor(m, b, k) {
    this.m = m;
    this.b = b;
    this.k = k;
  }
  
  // factory functions
  /**
   * Construct a line given two points
   * @param {GeomPoint|GeomPixelPoint} A  First point; anchor for direction
   * @param {GeomPoint|GeomPixelPoint} B  Second point.
   * @return {GeomLine} 
   */}
  static lineFrom(A: GeomPoint|GeomPixelPoint, 
                  B: GeomPoint|GeomPixelPoint) {
    
    let m = undefined;
    if(almostEqual(B.x - A.x, 0)) return new GeomLine()
    
    const m = (B.y - A.y) / (B.x - A.x)                    
  }
  
  static lineFrom(A: GeomPixelPoint, B: GeomPixelPoint) {
  
  }
  
  static lineFrom(ray: Ray) {
    
  
  }

}