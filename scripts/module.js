/* globals
Hooks,
game
*/

'use strict';
export const MODULE_ID = 'libgeometry';

import { Intersections } from "./Intersections.js";
import { IntersectionsSort } from "./IntersectionsSort.js";

import { OrderedPolygonEdge } from "./OrderedPolygonEdge.js";

import TestIntersections from "../tests/Intersections.test.js";



Hooks.once('init', async function() {
  game.modules.get(MODULE_ID).api = {
    Intersections: Intersections,
    IntersectionsSort: IntersectionsSort,
    OrderedPolygonEdge: OrderedPolygonEdge,
  };

  game.modules.get(MODULE_ID).testing = {
		TestIntersections: TestIntersections,
  };

  game.modules.get(MODULE_ID).benchmarking = {

  };
});