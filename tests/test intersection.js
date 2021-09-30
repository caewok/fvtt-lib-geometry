GeomPoint = game.modules.get("libgeometry").api.GeomPoint;
GeomPixelPoint = game.modules.get("libgeometry").api.GeomPixelPoint;
GeomVector = game.modules.get("libgeometry").api.GeomVector;
GeomPixelVector = game.modules.get("libgeometry").api.GeomPixelVector;
GeomLine = game.modules.get("libgeometry").api.GeomLine;
GeomPixelLine = game.modules.get("libgeometry").api.GeomPixelLine;
clearDrawings = game.modules.get("libgeometry").api.clearDrawings;
COLORS = game.modules.get("libgeometry").api.COLORS;
GEOM = game.modules.get("libgeometry").api.GEOM;

function assert(bool, warning) {
  if(!bool) console.warn(warning);
}

origin = new GeomPoint(1000, 1000, 0);

// ---------------- Test points ------------------- //

// XYZ, GEOM.XY (1), GEOM.XZ (2), GEOM.YZ (3)
// 
parallel = [
// XYZ
{ p0: origin
  v0: new GeomVector(100, 100, 100),
  p1: origin.add({x: 100, y: 100, z: 100})
  v1: new GeomVector(100, 100, 100) 
},
  
{
    
},



]
  XYZ: { 
    l0: 
    l1
  },
  XY: {
  
  }  
    }

}


// horizontal and vertical, perpendicular in 3D
vertical0 = new GeomPoint(1000, 900, 100);
horizontal0 = new GeomPoint(1100, 1000, 0);

// horizontal not perpendicular in 3D
vertical1 = new GeomPoint(1000, 900, 200);

// 45º angles
angled45 = new GeomPoint(900, 900, -200);
angled135 = new GeomPoint(1100, 900, 200);

origin.draw(COLORS.gray);
vertical0.draw(COLORS.lightred);
vertical1.draw(COLORS.lightred);
horizontal0.draw(COLORS.lightred);
angled45.draw(COLORS.lightred);
angled135.draw(COLORS.lightred);

// ---------------- Lines ----------------------- //

l_vertical0 = new GeomLine.fromPoints(origin, vertical0);
l_vertical1 = new GeomLine.fromPoints(origin, vertical1);

l_horizontal0 = new GeomLine.fromPoints(origin, horizontal0);

l_angled45 = new GeomLine.fromPoints(origin, angled45);
l_angled135 = new GeomLine.fromPoints(origin, angled135);

l_vertical0.draw(COLORS.lightblue);
l_vertical1.draw(COLORS.lightblue);
l_horizontal0.draw(COLORS.lightblue);
l_angled45.draw(COLORS.lightblue);
l_angled135.draw(COLORS.lightblue);

l_parallel_vertical0 = new GeomLine.fromPoints(origin.add([100, 0, 100]),
                                               vertical0.add([100, 0, 100]));

// Parallel
assert(l_vertical0.parallel(l_parallel_vertical0), "Verticals parallel");
assert(l_vertical0.parallel2D(l_parallel_vertical0), "Verticals parallel XY");
assert(l_vertical0.parallel2D(l_parallel_vertical0, {plane: GEOM.XZ}), "Verticals parallel XZ");
assert(l_vertical0.parallel2D(l_parallel_vertical0, {plane: GEOM.YZ}), "Verticals parallel YZ");
                                               
// Perpendicular
assert(l_horizontal0.perpendicular(l_vertical0), "Vertical/Horizontal perpendicular");
assert(!l_horizontal0.perpendicular(l_vertical1), "Vertical/Horizontal not perpendicular");                           

assert(!l_angled45.perpendicular(l_angled135), "45/135 perpendicular");
assert(l_angled45.perpendicular2D(l_angled135), "45/135 perpendicular XY");
                            
                                               
assert(l_vertical0.intersects(l_vertical1), "Verticals intersect");
assert(l_angled45.intersects(l_angled135), "45/135 intersect");    

                                      

// ---------------- Rays ------------------------ //


// ---------------- Segments -------------------- //

