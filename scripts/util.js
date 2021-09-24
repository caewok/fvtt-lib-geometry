const PRESET_EPSILON = 1e-8;

 /*
  * Test if two numbers are almost equal, given a small error window.
  * See https://www.toptal.com/python/computational-geometry-in-python-from-theory-to-implementation
  * @param {number} x         First number
  * @param {number} y         Second number for comparison
  * @param {number} EPSILON   Small number representing error within which the numbers 
  *                           will be considered equal
  * See Number.EPSILON for smallest possible error number.
  * Given the use in light measurements over long distances, probably make this 
  * relatively small in case comparing small angles.
  *
  * @return {boolean} True if x and y are within the error of each other.
  */
export function almostEqual(x, y, EPSILON = PRESET_EPSILON) {
  return Math.abs(x - y) < EPSILON;
}
