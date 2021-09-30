GeomPoint = game.modules.get("libgeometry").api.GeomPoint;
GeomPixelPoint = game.modules.get("libgeometry").api.GeomPixelPoint;
GeomVector = game.modules.get("libgeometry").api.GeomVector;
GeomPixelVector = game.modules.get("libgeometry").api.GeomPixelVector;
GeomLine = game.modules.get("libgeometry").api.GeomLine;
GeomPixelLine = game.modules.get("libgeometry").api.GeomPixelLine;
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

l2 = GeomLine.fromPoints(p, pix);
l2.draw(COLORS.orange)

// Test CCW -------------------------------

// Vector
clearDrawings()
origin = new GeomPoint(1000, 1000, 0);
p_q1 = new GeomPoint(500, 500, 0)
p_q2 = new GeomPoint(1300, 700, 0)
p_q3 = new GeomPoint(1300, 1200, 0)
p_q4 = new GeomPoint(700, 1200, 0)

p_up = new GeomPoint(1000, 500, 0)
p_down = new GeomPoint(1000, 1500, 0)
p_left = new GeomPoint(500, 1000, 0)
p_right = new GeomPoint(1500, 1000, 0)


v_up = new GeomVector(0, -1000, 0);
v_left = new GeomVector(-500, 0, 0);

// angled

v_up.draw(origin, COLORS.blue);
p_q1.draw(COLORS.red);

assert(v_up.ccw2D(p_q1.subtract(origin), { plane: GEOM.XY }) === GEOM.COUNTERCLOCKWISE, 
       "Point Q1 CCW");
       
p_q2.draw(COLORS.red);       
assert(v_up.ccw2D(p_q2.subtract(origin), { plane: GEOM.XY }) === GEOM.CLOCKWISE, 
       "Point Q2 CCW");

p_q3.draw(COLORS.red);
assert(v_up.ccw2D(p_q3.subtract(origin), { plane: GEOM.XY }) === GEOM.CLOCKWISE, 
       "Point Q3 CCW");

p_q4.draw(COLORS.red);
assert(v_up.ccw2D(p_q4.subtract(origin), { plane: GEOM.XY }) === GEOM.COUNTERCLOCKWISE, 
       "Point Q4 CCW");

// coincident
assert(v_up.ccw2D(p_up.subtract(origin), { plane: GEOM.XY }) === GEOM.COLLINEAR,
       "Point Up CCW");

assert(v_up.ccw2D(p_down.subtract(origin), { plane: GEOM.XY }) === GEOM.COLLINEAR,
       "Point Down CCW");
              
// perpendicular
v_left.draw(origin, COLORS.lightblue);
assert(v_left.ccw2D(v_up, { plane: GEOM.XY }) === GEOM.CLOCKWISE,
       "Vector left CCW");
       
assert(v_up.ccw2D(v_left, { plane: GEOM.XY }) === GEOM.COUNTERCLOCKWISE,
       "Vector left CCW");

assert(v_up.ccw2D(p_left.subtract(origin), { plane: GEOM.XY }) === GEOM.COUNTERCLOCKWISE,
       "Point left CCW")

// Line
clearDrawings()
l_horizontal = new GeomLine(origin, v_left)
l_vertical = new GeomLine(origin, v_up)
l45 = new GeomLine(origin, new GeomVector(100, 100, 0));
l120 = new GeomLine(origin, new GeomVector(200, -100, 0));

l_horizontal.draw(COLORS.blue)
l_vertical.draw(COLORS.blue)
l45.draw(COLORS.lightblue)
l120.draw(COLORS.green)

// angles
assert(l_vertical.ccw2D(p_q1, { plane: GEOM.XY }) === GEOM.COUNTERCLOCKWISE, 
       "Line Vertical Q1 CCW");
assert(l_vertical.ccw2D(p_q2, { plane: GEOM.XY }) === GEOM.CLOCKWISE, 
       "Line Vertical Q2 CCW");
assert(l_vertical.ccw2D(p_q3, { plane: GEOM.XY }) === GEOM.CLOCKWISE, 
       "Line Vertical Q3 CCW");
assert(l_vertical.ccw2D(p_q4, { plane: GEOM.XY }) === GEOM.COUNTERCLOCKWISE, 
       "Line Vertical Q4 CCW");

// perpendicular
assert(l_vertical.ccw2D(p_left, { plane: GEOM.XY }) === GEOM.COUNTERCLOCKWISE,
       "Line Vertical Left CCW");
       
// coincident
assert(l_vertical.ccw2D(p_up, { plane: GEOM.XY }) === GEOM.COLLINEAR,
       "Line Vertical Up CCW");

assert(l_vertical.ccw2D(p_down, { plane: GEOM.XY }) === GEOM.COLLINEAR,
       "Line Vertical Down CCW");

// Test intersections

// parallel
l45_parallel = new GeomLine(new GeomPoint(origin.x + 100, origin.y + 10, origin.z), l45.v);
l45_parallel.draw(COLORS.blue);

assert(!l45.intersects2D(l45_parallel, { plane: GEOM.XY }), "Line 45 Parallel Intersects");
assert(l45.parallel2D(l45_parallel, { plane: GEOM.XY }, "Line 45 Parallel"));

// perpendicular
assert(l_horizontal.perpendicular2D(l_vertical, { plane: GEOM.XY }), "Line Horizontal/Vertical Perpendicular");

// angles
assert(l_horizontal.intersects2D(l45, { plane: GEOM.XY }), "Line Horizontal/45 Intersect")
assert(l120.intersects2D(l45,{ plane: GEOM.XY }), "Line 120/45 Intersect")

// actual intersection points
assert(l_horizontal.intersection2D(l45, { plane: GEOM.XY }) === origin, "Line Horizontal/45 Intersection")

l_horizontal.intersection2D(l45, { plane: GEOM.XY }, as_point = false)

// 3-D intersection
l45 = new GeomLine(origin, new GeomVector(100, 100, 100));
l135 = new GeomLine(origin, new GeomVector(100, -100, 100));

assert(l45.intersects(l135), "Line 45/135 3D Intersect");

// 3-D parallel
l45_parallel = new GeomLine(new GeomPoint(origin.x + 100, origin.y + 10, origin.z + 20), l45.v);
assert(l45.parallel(l45_parallel), "Line 45 3D Parallel");

// 3-D orthogonal
assert(l45.perpendicular(l135), "Line 45/135 3D Perpendicular");
assert(l_horizontal.perpendicular(l_vertical), 
       "Line Vertical/Horizontal 3D Perpendicular");



