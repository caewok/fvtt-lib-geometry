/** IntersectionsSort Class—typically faster than brute method **/

'use strict';

import { Intersections } from "./Intersections.js";

export class IntersectionsSort extends Intersections {
 /**
  * Sort method that tests every segment in an array for intersections, skipping
  * segments that are obviously cannot intersect because the second lies entirely
  * before or entirely after another in the xy plane, moving from northwest to southest.
  * @param {Segment[]} segments               Array of segments.
  */
  static single(segments, { alreadySorted = false } = {}) {
    const results = [];

    if(!alreadySorted) {
      // need to mark the original segment indices before mixing them up.
      segments.forEach((s, idx) => s.idx = idx);
      segments.sort((a, b) => a.nw.x - b.nw.x);
    }

    const ln = segments.length;
    for(let i = 0; i < ln; i += 1) {
      const si = segments[i];
      // Skip segments already visited
      for(let j = (i + 1); j < ln; j += 1) {
        const sj = segments[j];

        // if we have not yet reached the left end of this si, skip
        if(sj.se.x < si.nw.x) continue;

        // if we have reached the right end of this si, skip the rest
        if(sj.nw.x > si.se.x) break;

        const ix = this.testForIntersection(si, sj);
        if(ix) {
          results.push(this.reportIntersection(ix, si.idx, sj.idx, si, sj));
        }
      }
    }
    return results;
  }

 /**
  * Sort method that tests every segment in an array for intersections, skipping
  * segments that are obviously cannot intersect because the second lies entirely
  * before or entirely after another in the xy plane, moving from northwest to southeast.
  * @param {Segment[]} segments               Array of segments.
  */
  static double(segments1, segments2, { alreadySorted = false } = {}) {
    const results = [];

    if(!alreadySorted) {
      // need to mark the original segment indices before mixing them up.
      segments1.forEach((s, idx) => s.idx = idx);
      segments1.sort((a, b) => a.nw.x - b.nw.x);

      segments2.forEach((s, idx) => s.idx = idx);
      segments2.sort((a, b) => a.nw.x - b.nw.x);
    }

    const ln1 = segments1.length;
    const ln2 = segments2.length;
    for(let i = 0; i < ln1; i += 1) {
      const si = segments1[i];
      for(let j = 0; j < ln2; j += 1) {
        const sj = segments2[j];

        // if we have not yet reached the left end of this si, skip
        if(sj.se.x < si.nw.x) continue;

        // if we have reached the right end of this si, skip the rest
        if(sj.nw.x > si.se.x) break;

        const ix = this.testForIntersection(si, sj);
        if(ix) {
          results.push(this.reportIntersection(ix, i, j, si, sj));
        }
      }
    }
    return results;
  }
}