export class GeomPoint {
  /**
   * Represents a point in 3-D Euclidean space.
   * @param {number} x
   * @param {number} y
   * @param {number} z    Elevation off the canvas. Default 0.
   * @constructor
   */
   x: number;
   y: number;
   z: number;
   
  constructor(x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

