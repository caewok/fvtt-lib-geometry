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


function assert(bool, warning) {
  if(!bool) console.warn(warning);
  return bool;
}

origin = new GeomPoint(1000, 1000, 0);

// construct a plane in the same coordinate system
pl = new GeomPlane(new GeomPoint(900, 1000, 100),
                   new GeomPoint(1000, 1000, 100),
                   new GeomPoint(1000, 900, 100));

p = new GeomPoint(500, 500, 100);
p_new = pl.transformPointToPlane(p);
p_orig = pl.transformPointFromPlane(p_new);
assert(p_new.equivalent(p_orig), "Plane: Transform Point");

// plane on y
pl = new GeomPlane(new GeomPoint(900, 1000, 100),
               new GeomPoint(1000, 1000, 200),
               new GeomPoint(20, 1000, 300));  
p = new GeomPoint(500, 1000, 100);                            
p_new = pl.transformPointToPlane(p);
p_orig = pl.transformPointFromPlane(p_new);
assert(p_new.equivalent(p_orig), "Plane: Transform Point"); 

p1 = new GeomPoint(900, 1000, 100);
p2 = new GeomPoint(1000, 1000, 100);
p3 = new GeomPoint(1000, 900, 100);




local_origin = p2;
right_vector = p1.subtract(p2).normalize();

// get the perpendicular line by either cross product or swapping
// right_vector.cross(p3.subtract(p))



up_vector = right_vector.x === right_vector.y ? new GeomVector(-right_vector.z, 0, right_vector.x) : new GeomVector(-right_vector.y, right_vector.x, 0);

d = p.subtract(local_origin)
u = d.dot(right_vector);
v = d.dot(up_vector);

math.multiply([right_vector, up_vector], p);

M = [right_vector, up_vector, [1, 1, 1]]

p_new = math.multiply(M, p);
p_new[2] = 0;

invM = math.inv(M);
p_orig = math.multiply(p_new, invM);





















               