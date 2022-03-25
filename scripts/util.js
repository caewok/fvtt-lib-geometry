/** Utility Functions **/

'use strict';

/**
 * Sort 2D points from northeast to southwest, such that smaller x values
 * are negative and when x is equal, smaller y values are negative
 * @param {Point} a		First x,y object to compare.
 * @param {Point} b		Second x,y object to compare.
 * @return {number}		Difference between x values or if equal, between y values,
 *                    such that smaller coordinates are sorted first. See array sort.
 *
 * Performance: https://jsbench.me/nikyhj8c9s
 */
export function compareXY(a, b) {
	return ( a.x === b.x ) ? ( a.y - b.y ) : ( a.x - b.x );
}

/**
 * Same as compareXY function but uses near equality to test if the x values are equal.
 * May be necessary when using calculated floats for x coordinates.
 * Uses Foundry's almostEqual function.
 * @param {Point} a		First x,y object to compare.
 * @param {Point} b		Second x,y object to compare.
 * @return {number}		Difference between x values or if equal, between y values,
 *                    such that smaller coordinates are sorted first. See array sort.
 */
export function compareXYAlmost(a, b) {
	return ( a.x.almostEqual(b.x) ) ? ( a.y - b.y ) : ( a.x - b.x );
}

/**
 * Returns the integer key used by Foundry's PolygonVertex
 * @param {Point} p		Object with x,y values to calculate a key
 * @return {number}		Integer representing the rounded x,y values
 */
export function keyForPoint(p) {
	return ( Math.round(p.x) << 16 ) ^ Math.round(p.y);
}

export function clearVertexLabels() {
	canvas.controls.debug.polygonText.removeChildren();
}

export function clearDrawings() {
  canvas.controls.debug.clear();
}