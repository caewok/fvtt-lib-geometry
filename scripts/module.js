/* globals Hooks, game */

export const MODULE_ID = 'libgeometry';

import { GEOM_CONSTANTS, COLORS } from "./constants.js";
import { clearDrawings } from "./util.js";

import { GeomPoint } from "./Point.js";
import { GeomPixelPoint } from "./PixelPoint.js";

import { GeomVector } from "./Vector.js";
import { GeomPixelVector } from "./PixelVector.js";

import { GeomLine } from "./Line.js";
import { GeomPixelLine } from "./PixelLine.js";

import { GeomRay } from "./Ray.js";

Hooks.once('init', async function() {
  game.modules.get(MODULE_ID).api = {
    GEOM_CONSTANTS: GEOM_CONSTANTS,
    COLORS: COLORS,
    clearDrawings: clearDrawings,
    
    GeomPoint: GeomPoint,
    GeomPixelPoint: GeomPixelPoint,
    
    GeomVector: GeomVector,
    GeomPixelVector: GeomPixelVector,
    
    GeomLine: GeomLine,
    GeomPixelLine: GeomPixelLine,
    
    GeomRay: GeomRay
  };
});
