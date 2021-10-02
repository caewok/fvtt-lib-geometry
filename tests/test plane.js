GeomPoint = game.modules.get("libgeometry").api.GeomPoint;
GeomPixelPoint = game.modules.get("libgeometry").api.GeomPixelPoint;
GeomVector = game.modules.get("libgeometry").api.GeomVector;
GeomPixelVector = game.modules.get("libgeometry").api.GeomPixelVector;
GeomLine = game.modules.get("libgeometry").api.GeomLine;
GeomPixelLine = game.modules.get("libgeometry").api.GeomPixelLine;
GeomPlane = game.modules.get("libgeometry").api.GeomPlane;
clearDrawings = game.modules.get("libgeometry").api.clearDrawings;
COLORS = game.modules.get("libgeometry").api.COLORS;
GEOM = game.modules.get("libgeometry").api.GEOM;

dimensions = ["XYZ", "XY", "XZ", "YZ"];

function assert(bool, warning) {
  if(!bool) console.warn(warning);
}

origin = new GeomPoint(1000, 1000, 0);

// construct a plane in the same coordinate system
pl = new GeomPlane(new GeomPoint())