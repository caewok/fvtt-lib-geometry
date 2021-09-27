GeomPoint = game.modules.get("libgeometry").api.GeomPoint;
GeomPixelPoint = game.modules.get("libgeometry").api.GeomPixelPoint;
GeomVector = game.modules.get("libgeometry").api.GeomVector;
GeomPixelVector = game.modules.get("libgeometry").api.GeomPixelVector;
GeomLine = game.modules.get("libgeometry").api.GeomLine;
GeomPixelLine = game.modules.get("libgeometry").api.GeomPixelLine;
COLORS = game.modules.get("libgeometry").api.COLORS;

function drawSegment(p0, p1, color = COLORS.blue, alpha = 1, width = 1) {
    canvas.controls.debug.lineStyle(width, color, alpha).
      moveTo(p0.x, p0.y).
      lineTo(p1.x, p1.y);
  }

function assert(bool, warning) {
  if(!bool) console.warn(warning);
}

POINT = {x: 100.5, y: 200, z: 10};

p = new GeomPoint(POINT.x, POINT.y, POINT.z);
p2 = new GeomPoint(POINT.x + 400, POINT.y);

pix = new GeomPixelPoint(POINT.x + 100, POINT.y + 100, POINT.z + 10);
pix2 = new GeomPixelPoint(POINT.x, POINT.y + 400);

v = new GeomVector(p.x, p.y, p.z);
vix = new GeomPixelVector(pix.x, pix.y, pix.z);

l = GeomLine.fromPoints(p, p2);
lix = GeomPixelLine.fromPoints(p, pix2);


assert(pix.x === Math.round(POINT.x + 100),
       "PixelPoint x");
assert(pix.y === Math.round(POINT.y + 100),
       "PixelPoint y"); 
assert(pix.z === Math.round(POINT.z + 10),
       "PixelPoint z");        

assert(p.magnitudeSquaredXY === p.x * p.x + p.y * p.y, 
       "Points MagnitudeSquaredXY");

assert(p.magnitudeSquaredXZ === p.x * p.x + p.z * p.z, 
       "Points MagnitudeSquaredXY");

assert(p.magnitudeSquaredYZ === p.y * p.y + p.z * p.z, 
       "Points MagnitudeSquaredXY");
       
assert(p.magnitudeSquared === p.x * p.x + p.y * p.y + p.z * p.z, 
       "Points Magnitude Squared");     
                             
assert(p.magnitude === Math.sqrt(p.magnitudeSquared),
       "Points Magnitude")

assert(p.angleXY === Math.atan2(p.x, p.y), "Point AngleXY")
assert(p.angleXZ === Math.atan2(p.x, p.z), "Point AngleXZ")
assert(p.angleYZ === Math.atan2(p.y, p.z), "Point AngleYZ")

p.draw(COLORS.red);
pix.draw(COLORS.red);

v.draw({x: 0, y: 0}, COLORS.green);
vix.draw({x: 0, y: 0}, COLORS.green);

v.draw({x: 1000, y: 100}, COLORS.green);
vix.draw({x: 1000, y: 1000}, COLORS.green);

l.draw(COLORS.blue)
lix.draw(COLORS.blue)
