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


// plane in z
A = new GeomPoint(900, 1000, 100)
B = new GeomPoint(1000, 1000, 100)
C = new GeomPoint(1000, 900, 100)
p = new GeomPoint(500, 500, 100);


pl = new GeomPlane(A, B, C);

A_new = pl.transformPointToPlane(A);
B_new = pl.transformPointToPlane(B);
C_new = pl.transformPointToPlane(C);
p_new = pl.transformPointToPlane(p);

A_orig = pl.transformPointFromPlane(A_new);
B_orig = pl.transformPointFromPlane(B_new);
C_orig = pl.transformPointFromPlane(C_new);
p_orig = pl.transformPointFromPlane(p_new);

assert(A_orig.equivalent(A), "Plane: Transform Point A");
assert(B_orig.equivalent(B), "Plane: Transform Point B");
assert(C_orig.equivalent(C), "Plane: Transform Point C");
assert(p_orig.equivalent(p), "Plane: Transform Point p");

// plane on y
A = new GeomPoint(900, 1000, 100)
B = new GeomPoint(1000, 1000, 200)
C = new GeomPoint(20, 1000, 300)
p = new GeomPoint(500, 1000, 100);

pl = new GeomPlane(A, B, C);

A_new = pl.transformPointToPlane(A);
B_new = pl.transformPointToPlane(B);
C_new = pl.transformPointToPlane(C);
p_new = pl.transformPointToPlane(p);

A_orig = pl.transformPointFromPlane(A_new);
B_orig = pl.transformPointFromPlane(B_new);
C_orig = pl.transformPointFromPlane(C_new);
p_orig = pl.transformPointFromPlane(p_new);

assert(A_orig.equivalent(A), "Plane: Transform Point A");
assert(B_orig.equivalent(B), "Plane: Transform Point B");
assert(C_orig.equivalent(C), "Plane: Transform Point C");
assert(p_orig.equivalent(p), "Plane: Transform Point p");

// Example from 
// https://stackoverflow.com/questions/49769459/convert-points-on-a-3d-plane-to-2d-coordinates#comment95407382_54281436
// https://imgur.com/a/ocOJsXi
A = new GeomPoint(1,1,1)
B = new GeomPoint(2,1,1)
C = new GeomPoint(1,1,2)
p = new GeomPoint(-2,1,7);

pl = new GeomPlane(A, B, C);

A_new = pl.transformPointToPlane(A);
B_new = pl.transformPointToPlane(B);
C_new = pl.transformPointToPlane(C);
p_new = pl.transformPointToPlane(p);

A_orig = pl.transformPointFromPlane(A_new);
B_orig = pl.transformPointFromPlane(B_new);
C_orig = pl.transformPointFromPlane(C_new);
p_orig = pl.transformPointFromPlane(p_new);

assert(A_orig.equivalent(A), "Plane: Transform Point A");
assert(B_orig.equivalent(B), "Plane: Transform Point B");
assert(C_orig.equivalent(C), "Plane: Transform Point C");
assert(p_orig.equivalent(p), "Plane: Transform Point p");



A = new GeomPoint(1,1,1);
B = new GeomPoint(2,1,1);
C = new GeomPoint(1,1,2);

AB = B.subtract(A);
AC = C.subtract(A);

uAB = AB.normalize();
u = A.add(uAB);

N = AC.cross(AB);
uN = N.normalize();
n = A.add(uN);

V = uAB.cross(uN);
v = A.add(V);


S = [[A.x, u.x, v.x, n.x],
     [A.y, u.y, v.y, n.y],
     [A.z, u.z, v.z, n.z],
     [  1,   1,   1,   1]];

Sinv = math.inv(S);
D = [[0, 1, 0, 0],
     [0, 0, 1, 0],
     [0, 0, 0, 1],
     [1, 1, 1, 1]];

M = math.multiply(D, Sinv);
Minv = math.inv(M)

A_new = math.multiply(M, [A.x, A.y, A.z, 1])
B_new = math.multiply(M, [B.x, B.y, B.z, 1])
C_new = math.multiply(M, [C.x, C.y, C.z, 1])

math.multiply(Minv, A_new)
math.multiply(Minv, B_new)
math.multiply(Minv, C_new)


p = [-2,1,7,1];
p_new = math.multiply(M, p);
math.multiply(Minv, p_new)


A = new GeomPoint(1,1,1);
B = new GeomPoint(2,1,1);
C = new GeomPoint(1,1,2);

pl = new GeomPlane(A, B, C);

A_new = pl.transformPointToPlane(A);
pl.transformPointFromPlane(A_new);

B_new = pl.transformPointToPlane(B);
pl.transformPointFromPlane(B_new);

C_new = pl.transformPointToPlane(C);
pl.transformPointFromPlane(C_new);

p = new GeomPoint(-2, 1, 7);
p_new = pl.transformPointToPlane(p);
pl.transformPointFromPlane(p_new);
















               