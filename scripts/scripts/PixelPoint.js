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
  }

}