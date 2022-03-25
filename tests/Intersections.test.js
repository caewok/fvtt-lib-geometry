/* Test intersections */
'use strict';

import { Intersections } from "../scripts/Intersections.js";
import { IntersectionsSort } from "../scripts/IntersectionsSort.js";
import { IntersectionsWASM_f64,
         IntersectionsSortWASM_f64,
         IntersectionsWASM_i32,
         IntersectionsSortWASM_i32 } from "../scripts/IntersectionsWASM.js";

import { OrderedPolygonEdge } from "../scripts/OrderedPolygonEdge.js";

import { assert, test, announceGroup } from "./test_api.js";


// Basic test: known inputs, outputs

export const TestIntersections = (function () {
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
    announceGroup("JS Intersections");

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

    test('double sort intersection basic works', () => {
      let ix_res = IntersectionsSort.double(basic_segments, basic_segments);
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

  }
  return run;
}());

export const TestIntersectionsWASM = (function () {
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
    announceGroup("WASM Intersections");

    test('single brute intersection basic works', () => {
      let ix_res = IntersectionsWASM_f64.single(basic_segments);
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
      let ix_res = IntersectionsWASM_f64.double(basic_segments, basic_segments);
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
      let ix_res = IntersectionsSortWASM_f64.single(basic_segments);
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

    test('double sort intersection basic works', () => {
      let ix_res = IntersectionsSortWASM_f64.double(basic_segments, basic_segments);
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

    test('i32 single brute intersection basic works', () => {
      let ix_res = IntersectionsWASM_i32.single(basic_segments);
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

    test('i32 double brute intersection basic works', () => {
      let ix_res = IntersectionsWASM_i32.double(basic_segments, basic_segments);
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

    test('i32 single sort intersection basic works', () => {
      let ix_res = IntersectionsSortWASM_i32.single(basic_segments);
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

    test('i32 double sort intersection basic works', () => {
      let ix_res = IntersectionsSortWASM_i32.double(basic_segments, basic_segments);
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

  }
  return run;
}());




