GeomPoint = game.modules.get("libgeometry").api.GeomPoint;
GeomPixelPoint = game.modules.get("libgeometry").api.GeomPixelPoint;
GeomVector = game.modules.get("libgeometry").api.GeomVector;
GeomPixelVector = game.modules.get("libgeometry").api.GeomPixelVector;
GeomLine = game.modules.get("libgeometry").api.GeomLine;
GeomPixelLine = game.modules.get("libgeometry").api.GeomPixelLine;
clearDrawings = game.modules.get("libgeometry").api.clearDrawings;
COLORS = game.modules.get("libgeometry").api.COLORS;
GEOM = game.modules.get("libgeometry").api.GEOM;

dimensions = ["XYZ", "XY", "XZ", "YZ"];

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

// XY
{ p0: origin
  v0: new GeomVector(100, 100, 100),
  p1: origin.add({x: 100, y: 100, z: 100})
  v1: new GeomVector(100, 100, 200)   
},

// XZ
{ p0: origin
  v0: new GeomVector(100, 100, 100),
  p1: origin.add({x: 100, y: 100, z: 100})
  v1: new GeomVector(100, 200, 100)   
},

// YZ
{ p0: origin
  v0: new GeomVector(100, 100, 100),
  p1: origin.add({x: 100, y: 100, z: 100})
  v1: new GeomVector(200, 100, 100)   
}
]

// ---------------- Lines ----------------------- //
l_parallel = parallel.map(obj => {
  return [ new GeomLine(obj.p0, obj.v0), 
           new GeomLine(obj.p1, obj.v1) ];
});

// Draw
l_parallel[0][0].draw();
l_parallel[0][1].draw();

// 3D Parallel
assert(l_parallel[GEOM.XYZ][0].parallel(l_parallel[GEOM.XYZ][1]),
       `Parallel Line ${dimensions[GEOM.XYZ]}`);

assert(!l_parallel[GEOM.XY][0].parallel(l_parallel[GEOM.XY][1]),
       `Parallel Line ${dimensions[GEOM.XY]}`);

assert(!l_parallel[GEOM.XZ][0].parallel(l_parallel[GEOM.XZ][1]),
       `Parallel Line ${dimensions[GEOM.XZ]}`);       

assert(!l_parallel[GEOM.YZ][0].parallel(l_parallel[GEOM.YZ][1]),
       `Parallel Line ${dimensions[GEOM.YZ]}`);
       
// 2D parallel
for(i = 0; i < 4; i += 1) {
  assert(l_parallel[i][0].parallel2D(l_parallel[i][1], { plane: i }),
       `Parallel Line 2D ${dimensions[i]}`);
}
  
for(i = 0; i < 4; i += 1) {
  assert(!l_parallel[i][0].parallel2D(l_parallel[i][1], , { plane: (i + 1) % 4 }),
       `Parallel Line ${dimensions[i]}`);
}    

// ---------------- Rays ------------------------ //

r_parallel = parallel.map(obj => {
  return [ new GeomRay(obj.p0, obj.v0), 
           new GeomRay(obj.p1, obj.v1) ];
});

// ---------------- Segments -------------------- //

s_parallel = parallel.map(obj => {
  return [ new GeomSegment(obj.p0, obj.v0), 
           new GeomSegment(obj.p1, obj.v1) ];
});


// ---------------- Combos -------------------- //