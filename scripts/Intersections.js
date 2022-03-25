/** Intersection class: methods to intersect multiple segments or other objects **/

/**
The Intersection class contains static methods, grouped in the class for organization,
that deal with reporting intersections of multiple lines.

Concepts used:
- Brute: Typically slower method of testing every segment against every other.
- Sort: Typically faster method that relies on sorting segments from northeast to southwest.
- Single: Test an array of segments for intersections against each other.
- Double: Test one array of segments against another array, only reporting intersections
          between objects in different arrays.
- WASM: Relies on a rust--> WASM interface and rust code.
- Segment: Any object that has A.x, A.y, B.x, and B.y coordinates.
- OrderedSegment: Any object that has _ne and _sw designated coordinates, like Wall.

The fastest method is typically WASMSort.
**/

/* globals
foundry
*/

'use strict';





export function IntersectionSetup({ reportIntersection,
                                    testForIntersection
                                    } = {}) {
	function reportIntersectionDefault(ix, i, j, s1, s2) {
		return { ix, i: i, j: j, s1: s1, s2: s2 };
	}

	function testForIntersectionDefault(s1, s2) {
		if(!foundry.utils.lineSegmentIntersects(s1.A, s1.B, s2.A, s2.B)) return false;
		return foundry.utils.lineLineIntersection(s1.A, s1.B, s2.A, s2.B);
	}

	reportIntersection = reportIntersection ?? reportIntersectionDefault;
  testForIntersection = testForIntersection ?? testForIntersectionDefault;

	function bruteSingle(segments) {
    const results = [];
    const ln = segments.length;
    for(let i = 0; i < ln; i += 1) {
      const si = segments[i];
      // Skip segments already visited
      for(let j = (i + 1); j < ln; j += 1) {
        const sj = segments[j];
        const ix = testForIntersection(si, sj);
        if(ix) {
          results.push(reportIntersection(ix, i, j, si, sj));
        }
      }
    }
    return results;
  }

  return bruteSingle;
}


export class Intersections {

 /**
  * Default method to report an intersection between two segments.
  * @param {Point} ix   Intersection point
  * @param {number} i   Index of the first segment
  * @param {number} j   Index of the second segment
  * @param {Segment} s1 First segment
  * @param {Segment} s2 Second segment
  * @return {Object} Data to store for the intersection.
  */
  static reportIntersection(ix, i, j, s1, s2) {
    //return { ix, i: i, j: j, s1: s1, s2: s2 };
    return { ix, i: i, j: j }
  }


 /**
  * Test for whether two segments intersect.
  * @param {Segment} s1   First segment to test
  * @param {Segment} s2   Second segment to test
  * @return {boolean|Object}  If no intersection, return a falsy value. Otherwise,
  *                           return the relevant intersection information.
  */
  static testForIntersection(s1, s2) {
    if(!foundry.utils.lineSegmentIntersects(s1.A, s1.B, s2.A, s2.B)) return false;
    return foundry.utils.lineLineIntersection(s1.A, s1.B, s2.A, s2.B);
  }

 /**
  * Brute method that tests every segment in an array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static single(segments) {
    const results = [];
    const ln = segments.length;
    for(let i = 0; i < ln; i += 1) {
      const si = segments[i];
      // Skip segments already visited
      for(let j = (i + 1); j < ln; j += 1) {
        const sj = segments[j];
        const ix = this.testForIntersection(si, sj);
        if(ix) {
          results.push(this.reportIntersection(ix, i, j, si, sj));
        }
      }
    }
    return results;
  }

 /**
  * Brute method that tests every segment in an array against every segment in a second
  * array for intersections.
  * @param {Segment[]} segments               Array of segments.
  * Optional:
  * @param {Function} reportIntersection      Function used to report the results of
  *                                           an intersection. See default method.
  * @param {boolean} ignoreSharedEndpoints    If false, report shared endpoints
  *                                           as intersections.
  */
  static double(segments1, segments2) {
    const results = [];
    const ln1 = segments1.length;
    const ln2 = segments2.length;
    for(let i = 0; i < ln1; i += 1) {
      const si = segments1[i];
      for(let j = 0; j < ln2; j += 1) {
        const sj = segments2[j];
        const ix = this.testForIntersection(si, sj);
        if(ix) {
          results.push(this.reportIntersection(ix, i, j, si, sj));
        }
      }
    }
    return results;
  }
}




