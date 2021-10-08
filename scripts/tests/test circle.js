GeomPoint = game.modules.get("libgeometry").api.GeomPoint;
GeomPixelPoint = game.modules.get("libgeometry").api.GeomPixelPoint;
GeomVector = game.modules.get("libgeometry").api.GeomVector;
GeomPixelVector = game.modules.get("libgeometry").api.GeomPixelVector;
GeomLine = game.modules.get("libgeometry").api.GeomLine;
GeomPixelLine = game.modules.get("libgeometry").api.GeomPixelLine;
GeomCircle = game.modules.get("libgeometry").api.GeomCircle;
clearDrawings = game.modules.get("libgeometry").api.clearDrawings;
COLORS = game.modules.get("libgeometry").api.COLORS;
GEOM = game.modules.get("libgeometry").api.GEOM;

function drawSegment(p0, p1, color = COLORS.blue, alpha = 1, width = 1) {
    canvas.controls.debug.lineStyle(width, color, alpha).
      moveTo(p0.x, p0.y).
      lineTo(p1.x, p1.y);
  }

function assert(bool, warning) {
  if(!bool) console.warn(warning);
}


origin = new GeomPoint(1000, 1000, 0);
radius = new GeomVector(100, 0, 0);

cir = new GeomCircle(origin, radius)
cir2 = GeomCircle.fromPoint(origin, 100);

//cir.equivalent(cir2);

clearDrawings()
cir.draw(COLORS.red)
cir.point(0).draw(COLORS.lightblue);
cir.point(Math.PI).draw(COLORS.blue);
cir.point(Math.PI / 2).draw(COLORS.lightgreen);
cir.point(Math.PI + (Math.PI / 2)).draw(COLORS.green);