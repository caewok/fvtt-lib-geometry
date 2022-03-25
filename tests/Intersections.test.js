/* Test intersections */
'use strict';

import { Intersections } from "../scripts/Intersections.js";
import { IntersectionsSort } from "../scripts/IntersectionsSort.js";

import { OrderedPolygonEdge } from "../scripts/OrderedPolygonEdge.js";

// see https://web.archive.org/web/20061025015342/http://aymanh.com/9-javascript-tips-you-may-not-know
function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}

function test(description, fn) {
  console.log(`testing ${description}`);
  try { fn(); console.log("PASSED!\n"); } catch(error) { console.log(error); }
}


// Basic test: known inputs, outputs

export default (function TestIntersections() {
  // setup

  let basic_segments = [
    new OrderedPolygonEdge({x: 2300, y: 1900}, {x: 4200, y: 1900}),
    new OrderedPolygonEdge({x: 2387, y: 1350}, {x: 2500, y: 2100}),
    new OrderedPolygonEdge({x: 2500, y: 2100}, {x: 2900, y: 2100})
  ];

  let basic_expected = [
    { ix: { x: 2469.866666666667, y: 1900 }, i: 0, j: 1,
      s0: basic_segments[0], s1: basic_segments[1] },

    { ix: { x: 2500, y: 2100 }, i: 1, j: 2,
      s0: basic_segments[1], s1: basic_segments[2] }
  ];

  let basic_double_expected = [
    { ix: { x: 2469.866666666667, y: 1900 }, i: 0, j: 1,
      s0: basic_segments[0], s1: basic_segments[1] },

    { ix: { x: 2469.866666666667, y: 1900 }, i: 1, j: 0,
      s0: basic_segments[1], s1: basic_segments[0] },

    { ix: { x: 2500, y: 2100 }, i: 1, j: 2,
      s0: basic_segments[1], s1: basic_segments[2] },

    { ix: { x: 2500, y: 2100 }, i: 2, j: 1,
      s0: basic_segments[2], s1: basic_segments[1] }
  ];

  function run() {
    test('single brute intersection basic works', () => {
      let ix_res = Intersections.single(basic_segments);
      assert(ix_res.length === basic_expected.length, "Lengths not equal.");
      for(let i = 0; i < ix_res.length; i += 1) {
        assert(ix_res[i].ix.x === basic_expected[i].ix.x, "ix.x not equal");
        assert(ix_res[i].ix.y === basic_expected[i].ix.y, "ix.x not equal");
        assert(ix_res[i].i === basic_expected[i].i, "i not equal");
        assert(ix_res[i].j === basic_expected[i].j, "j not equal");
        assert(ix_res[i].si === basic_expected[i].si, "si not equal"); // pointers equal
        assert(ix_res[i].sj === basic_expected[i].sj, "sj not equal"); // pointers equal
      }
    });

    test('double brute intersection basic works', () => {
      let ix_res = Intersections.double(basic_segments, basic_segments);
      assert(ix_res.length === basic_double_expected.length, "Lengths not equal.");
      for(let i = 0; i < ix_res.length; i += 1) {
        assert(ix_res[i].ix.x === basic_double_expected[i].ix.x, "ix.x not equal");
        assert(ix_res[i].ix.y === basic_double_expected[i].ix.y, "ix.x not equal");
        assert(ix_res[i].i === basic_double_expected[i].i, "i not equal");
        assert(ix_res[i].j === basic_double_expected[i].j, "j not equal");
        assert(ix_res[i].si === basic_double_expected[i].si, "si not equal"); // pointers equal
        assert(ix_res[i].sj === basic_double_expected[i].sj, "sj not equal"); // pointers equal
      }
    });

    test('single sort intersection basic works', () => {
      let ix_res = IntersectionsSort.single(basic_segments);
      assert(ix_res.length === basic_expected.length, "Lengths not equal.");
      for(let i = 0; i < ix_res.length; i += 1) {
        assert(ix_res[i].ix.x === basic_expected[i].ix.x, "ix.x not equal");
        assert(ix_res[i].ix.y === basic_expected[i].ix.y, "ix.x not equal");
        assert(ix_res[i].i === basic_expected[i].i, "i not equal");
        assert(ix_res[i].j === basic_expected[i].j, "j not equal");
        assert(ix_res[i].si === basic_expected[i].si, "si not equal"); // pointers equal
        assert(ix_res[i].sj === basic_expected[i].sj, "sj not equal"); // pointers equal
      }


    });

  }
  return run;
}());


// Foundry canvas test: Foundry canvas inputs, different versions of an algorithm
// should return the same values


// tests are structured as setup, run




