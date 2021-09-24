# Overview of libGeometry
libGeometry aims to provide classes and associated methods that are useful when manipulating geometric objects in Foundry VTT. Primarily, these classes focus on the needs of vision, lighting, and walls. 


# Concepts

The structure is loosely based on [CGAL concepts](https://doc.cgal.org/latest/Kernel_23/index.html#Chapter_2D_and_3D_Geometry_Kernel). If you have the wherewithal to port the CGAL foundational library into WebAssembly and then into this library, please feel free to do so! 

## Robustness

Most geometric proofs assume exact computation with real numbers. Computers use inexact floating point numbers that introduce rounding errors and inconsistent results in edge cases. libGeometry aims for a reasonable level of robustness, attempting to protect against basic errors but not promising exact computation or exact results. 

To ensure some level of robustness, libGeometry employs three basic tools:
- A robust spatial orientation library for comparing whether sets of points are counter-clockwise (CCW), clockwise (CW), or collinear. 
- Utility functions to compare whether two numbers are approximately equal, given a tolerance amount.
- Separate Pixel classes that use integers to represent points, because Foundry objects generally have {x, y} points that use integers to represent pixel locations. 

## Elevation

libGeometry understands elevation but does not aim for a true 3-D representation of the canvas. Thus, points have 3 dimensions, with the z dimension optional. All other objects inherit these three-dimensional points and thus have some three-dimensional properties and methods. 

## Points, Vectors, Direction Lines, Rays, Segments

- Points have {x, y, z} coordinates, where z defaults to 0.
- A Vector is the difference between two points, p2, p1. It denotes direction and distance from p1 to p2. 
- A Direction is a vector without length. For example, "Go west, young man," denotes direction but not distance. 

## Lines, Rays, Segments

- Lines extend indefinitely in either direction
- Rays have a single fixed starting point, and extend indefinitely in a single direction.
- Segments have two fixed points, and are most comparable to Foundry's Ray Class. Segments are also the basic structure representing Foundry walls. 

Lines, Rays, and Segments are oriented: In 2-D space, they induce a partition on the plane into a positive (left, or CCW) and negative (right, or CW) side. This is based 

## Other Objects

- Circles: Represented by a center Point and a radius distance number.
- Triangles: Three Points representing three vertices. A special version of a Polygon.
- Polygons: Three or more Points representing the polygon vertices.   

## Pixel Objects

Pixel objects inherit from their base object, but require integer coordinates for the Points. These tend to be more efficient, because comparisons between points do not require checks for near-equality. 

## Orientation and Relative Position

Geometric objects in this library have methods that test the position of a point, called the vision point or vp, relative to the object. Essentially, the methods test whether a vp falls on the positive (left, or CCW) or negative (right, or CW) side.

## ID

Objects are assigned unique ids. The one exception are GeomPixelPoints, which use a key that encodes their integer coordinates as their id.

# Naming conventions

- Geom: To avoid naming clashes, all classes begin with Geom.
- Pixel: Classes that use only integers for coordinates are prefixed with "Pixel". E.g., GeomPixelPoint, GeomPixelSegment.
- ORIGIN: In Foundry VTT, {x: 0, y: 0} in the upper left corner of the canvas is designated as the origin point. 
- vp: The vision point. Geometric objects may be described in relation to a vision point or ordered around a vision point. The point can be thought of as the spot at which a person is standing and viewing the scene, although the vision point could also be the location of a light.
- COUNTERCLOCKWISE: 1
- CLOCKWISE: -1
- COLLINEAR: 0
- 2D: Version of method that only accounts for x and y, treating the object as if it were flat on the canvas. 

