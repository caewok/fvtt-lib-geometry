// Basic intersection tests:
// - intersects
// - lineLineIntersection
// - segmentIntersection
use crate::ordered_coordinate::{ OrderedCoordinateF64 };
use crate::ordered_segment::{ OrderedSegmentF64, OrderedSegmentI32, OrderedSegmentI128 };
use crate::orientation::{ Orientation, Orientable };


pub trait Intersection<B = Self> {
	fn intersects(&self, other: &B) -> bool;
	fn line_intersection1(&self, other: &B) -> Option<OrderedCoordinateF64>;
	fn line_intersection2(&self, other: &B) -> Option<OrderedCoordinateF64>;
	fn segment_intersection(&self, other: &B) -> Option<OrderedCoordinateF64>;
    fn segment_intersection2(&self, other: &B) -> Option<OrderedCoordinateF64>;
}

// all intersects are the same but we have not implemented orient2d for all,
// so just repeat for now
impl Intersection for OrderedSegmentF64 {
 	fn intersects(&self, other: &Self) -> bool {
		let (a, b) = self.coordinates();
		let (c, d) = other.coordinates();

		let xa = a.orient(&b, &c);
		let xb = a.orient(&b, &d);

		// may intersect in an overlapping line or not intersect at all
		if xa == Orientation::Collinear && xb == Orientation::Collinear { return false; }

		let xc = c.orient(&d, &a);
		let xd = c.orient(&d, &b);

		if xa != xb && xc != xd { return true; }

		false
	}

	fn line_intersection1(&self, other: &Self) -> Option<OrderedCoordinateF64> {
       //  let ab: OrderedSegmentI128 = self.into();
// 	    let other: OrderedSegmentI128 = other.into();

	    // First line coefficients where "a1 x  +  b1 y  +  c1  =  0"
	    let (x1, y1, x2, y2) = self.coords();
	    let (x3, y3, x4, y4) = other.coords();

	    let dnm = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
	    if dnm == 0. { return None; }

	    let x_num = (x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4);
	    let y_num = (x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4);

	    let x = x_num / dnm;
	    let y = y_num / dnm;

	    Some(OrderedCoordinateF64 { x, y })




// 		let d1 = self.delta();
// 		let d2 = other.delta();
//
// 		let x_dnm = d2.cross(d1);
// 		let x_dnm2 = d1.y * d2.x - d2.y * d1.x;
// 		assert_eq!(x_dnm, x_dnm2);
//
// 		if x_dnm == 0. { return None; }
//
//         let y_dnm = d1.cross(d2);
// 		let y_dnm2 = d1.x * d2.y - d2.x * d1.y;
// 		assert_eq!(y_dnm, y_dnm2);
// 		if y_dnm == 0. { return None; }
//
// 		// dbg!(x_dnm);
// // 		dbg!(y_dnm);
//
// 		let a = self.start;
// 		let c = other.start;
//
// 		let (ax, ay) = a.x_y();
// 		let (cx, cy) = c.x_y();
//
// 		let x_num = ax * d1.y * d2.x - cx * d2.y * d1.x + cy * d1.x * d2.x - ay * d1.x * d2.x;
// 		let y_num = ay * d1.x * d2.y - cy * d2.x * d1.y + cx * d1.y * d2.y - ax * d1.y * d2.y;
//
// 		// dbg!(x_num);
// // 		dbg!(y_num);
// // 		println!("");
//
// 		let ratio_x = x_num / x_dnm;
// 		let ratio_y = y_num / y_dnm;
//
// 		Some(OrderedCoordinateF64 { x: ratio_x, y: ratio_y })
	}

	fn line_intersection2(&self, other: &Self) -> Option<OrderedCoordinateF64> {
		let d1 = self.delta();
		let d2 = other.delta();

		let dnm = d1.cross(d2);
// 		let dnm2 = d2.y * d1.x - d2.x * d1.y;
// 		assert_eq!(dnm, dnm2);
		if dnm == 0. { return None; }
		// dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay)

		// Determine the vector distance from a
		let d_ac = self.start - other.start;

		let t0 = d2.cross(d_ac);
// 		let t0_1 = d2.x * d_ac.y - d2.y * d_ac.x;
// 		assert_eq!(t0, t0_1);
		let t0 = t0 / dnm;
		// t0 = ((dx - cx) * (ay - cy) - (dy - cy) * (ax - cx)) / dnm

		let x = self.start.x + t0 * d1.x;
		let y = self.start.y + t0 * d1.y;

		Some(OrderedCoordinateF64 { x, y })
	}

	fn segment_intersection(&self, other: &Self) -> Option<OrderedCoordinateF64> {
		let epsilon = 1e-8;

		let d1 = self.delta();
		let d2 = other.delta();

		let dnm = d1.cross(d2);
// 		let dnm2 = d2.y * d1.x - d2.x * d1.y;
// 		assert_eq!(dnm, dnm2);
		if dnm == 0. { return None; }
		// dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay)

		// Determine the vector distance from a
		let d_ac = self.start - other.start;

        // vector distance from self.start (a)
		let t0 = d2.cross(d_ac);
// 		let t0_1 = d2.x * d_ac.y - d2.y * d_ac.x;
// 		assert_eq!(t0, t0_1);
		let t0 = t0 / dnm;
		if t0 < (0. - epsilon) || t0 > (1. + epsilon) { return None; }
        // t0 = ((dx - cx) * (ay - cy) - (dy - cy) * (ax - cx)) / dnm

        // vector distance from other.start (c)
		let t1 = d1.cross(d_ac);
// 		let t1_1 = d1.x * d_ac.y - d1.y * d_ac.x;
// 		assert_eq!(t1, t1_1);
		let t1 = t1 / dnm;
		if t1 < (0. - epsilon) || t1 > (1. + epsilon) { return None; }
        // t1 = ((bx - ax) * (ay - cy) - (by - ay) * (ax - cx)) / dnm



		let x = self.start.x + t0 * d1.x;
		let y = self.start.y + t0 * d1.y;

		Some(OrderedCoordinateF64 { x, y })
	}

	fn segment_intersection2(&self, other: &Self) -> Option<OrderedCoordinateF64> {
	    self.segment_intersection(other)
	}
}

// https://stackoverflow.com/questions/21224361/calculate-intersection-of-two-lines-using-integers-only
// https://godbolt.org/z/zVx9cD
fn same_signs(a: i128, b: i128) -> bool {
    a ^ b >= 0
}

impl Intersection for OrderedSegmentI32 {
// interesting integer version:
// https://stackoverflow.com/questions/21224361/calculate-intersection-of-two-lines-using-integers-only

 	fn intersects(&self, other: &Self) -> bool {
		let (a, b) = self.coordinates();
		let (c, d) = other.coordinates();

		let xa = a.orient(&b, &c);
		let xb = a.orient(&b, &d);

		// may intersect in an overlapping line or not intersect at all
		if xa == Orientation::Collinear && xb == Orientation::Collinear { return false; }

		let xc = c.orient(&d, &a);
		let xd = c.orient(&d, &b);

		if xa != xb && xc != xd { return true; }

		false
	}

	fn line_intersection1(&self, other: &Self) -> Option<OrderedCoordinateF64> {
	    // cannot do the long multiplication below without upscaling from i32 --> i28
	    let ab: OrderedSegmentI128 = self.into();
	    let other: OrderedSegmentI128 = other.into();

		let d1 = ab.delta();
		let d2 = other.delta();

		let x_dnm = d2.cross(d1);
// 		let x_dnm2 = d1.y * d2.x - d2.y * d1.x;
// 		assert_eq!(x_dnm, x_dnm2);

		if x_dnm == 0 { return None; }

        let y_dnm = d1.cross(d2);
// 		let y_dnm2 = d1.x * d2.y - d2.x * d1.y;
// 		assert_eq!(y_dnm, y_dnm2);
		if y_dnm == 0 { return None; }

		// dbg!(x_dnm);
// 		dbg!(y_dnm);

		let a = ab.start;
		let c = other.start;

		let (ax, ay) = a.x_y();
		let (cx, cy) = c.x_y();

		let x_num = ax * d1.y * d2.x - cx * d2.y * d1.x + cy * d1.x * d2.x - ay * d1.x * d2.x;
		let y_num = ay * d1.x * d2.y - cy * d2.x * d1.y + cx * d1.y * d2.y - ax * d1.y * d2.y;

		// dbg!(x_num);
// 		dbg!(y_num);
// 		println!("");

		let ratio_x = x_num as f64 / x_dnm as f64;
		let ratio_y = y_num as f64 / y_dnm as f64;

		Some(OrderedCoordinateF64 { x: ratio_x, y: ratio_y })
	}

	fn line_intersection2(&self, other: &Self) -> Option<OrderedCoordinateF64> {
	    // cannot do the subtraction below without upscaling from i32 --> i28
	    let ab: OrderedSegmentI128 = self.into();
	    let other: OrderedSegmentI128 = other.into();

		let d1 = ab.delta();
		let d2 = other.delta();

		let dnm = d1.cross(d2);
// 		let dnm2 = d2.y * d1.x - d2.x * d1.y;
// 		assert_eq!(dnm, dnm2);
		if dnm == 0 { return None; }
		// dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay)

		// Determine the vector distance from a
		let d_ac = ab.start - other.start;

		let t0 = d2.cross(d_ac);
// 		let t0_1 = d2.x * d_ac.y - d2.y * d_ac.x;
// 		assert_eq!(t0, t0_1);
		let t0 = t0 as f64 / dnm as f64;
		// t0 = ((dx - cx) * (ay - cy) - (dy - cy) * (ax - cx)) / dnm

		let x = ab.start.x as f64 + t0 * d1.x as f64;
		let y = ab.start.y as f64 + t0 * d1.y as f64;

		Some(OrderedCoordinateF64 { x, y })
	}

	fn segment_intersection(&self, other: &Self) -> Option<OrderedCoordinateF64> {
	    // cannot do the subtraction below without upscaling from i32 --> i28
	    let ab: OrderedSegmentI128 = self.into();
	    let other: OrderedSegmentI128 = other.into();

		let epsilon = 1e-8_f64;

		let d1 = ab.delta();
		let d2 = other.delta();

		let dnm = d1.cross(d2);
// 		let dnm2 = d2.y * d1.x - d2.x * d1.y;
// 		assert_eq!(dnm, dnm2);
		if dnm == 0 { return None; }
		// dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay)

		// Determine the vector distance from a
		let d_ac = ab.start - other.start;

        // vector distance from self.start (a)
		let t0 = d2.cross(d_ac);
// 		let t0_1 = d2.x * d_ac.y - d2.y * d_ac.x;
// 		assert_eq!(t0, t0_1);
		let t0 = t0 as f64 / dnm as f64;
		if t0 < (0. - epsilon) || t0 > (1. + epsilon) { return None; }
        // t0 = ((dx - cx) * (ay - cy) - (dy - cy) * (ax - cx)) / dnm

        // vector distance from other.start (c)
		let t1 = d1.cross(d_ac);
// 		let t1_1 = d1.x * d_ac.y - d1.y * d_ac.x;
// 		assert_eq!(t1, t1_1);
		let t1 = t1 as f64 / dnm as f64;
		if t1 < (0. - epsilon) || t1 > (1. + epsilon) { return None; }
        // t1 = ((bx - ax) * (ay - cy) - (by - ay) * (ax - cx)) / dnm



		let x = ab.start.x as f64 + t0 * d1.x as f64;
		let y = ab.start.y as f64 + t0 * d1.y as f64;

		Some(OrderedCoordinateF64 { x, y })
	}

	fn segment_intersection2(&self, other: &Self) -> Option<OrderedCoordinateF64> {
        let ab: OrderedSegmentI128 = self.into();
	    let other: OrderedSegmentI128 = other.into();

	    // First line coefficients where "a1 x  +  b1 y  +  c1  =  0"
	    let (x1, y1, x2, y2) = ab.coords();
	    let (x3, y3, x4, y4) = other.coords();

	     // First line coefficients where "a1 x  +  b1 y  +  c1  =  0"
        let a1 = y2 - y1;
        let b1 = x1 - x2;
        let c1 = x2 * y1 - x1 * y2;

        // Second line coefficients
        let a2 = y4 - y3;
        let b2 = x3 - x4;
        let c2 = x4 * y3 - x3 * y4;

        let denom = a1 * b2 - a2 * b1;

        // Lines are colinear
        if denom == 0 {
            return None;
        }

        // Compute sign values
        let r3 = a1 * x3 + b1 * y3 + c1;
        let r4 = a1 * x4 + b1 * y4 + c1;

        // Sign values for second line
        let r1 = a2 * x1 + b2 * y1 + c2;
        let r2 = a2 * x2 + b2 * y2 + c2;

        // Flag denoting whether intersection point is on passed line segments. If this is false,
        // the intersection occurs somewhere along the two mathematical, infinite lines instead.
        //
        // Check signs of r3 and r4.  If both point 3 and point 4 lie on same side of line 1, the
        // line segments do not intersect.
        //
        // Check signs of r1 and r2.  If both point 1 and point 2 lie on same side of second line
        // segment, the line segments do not intersect.
        let is_on_segments = (r3 != 0 && r4 != 0 && same_signs(r3, r4))
            || (r1 != 0 && r2 != 0 && same_signs(r1, r2));

        if !is_on_segments { return None; }
        // If we got here, line segments intersect. Compute intersection point using method similar
        // to that described here: http://paulbourke.net/geometry/pointlineplane/#i2l

        // The denom/2 is to get rounding instead of truncating. It is added or subtracted to the
        // numerator, depending upon the sign of the numerator.
       //  let offset = if denom < 0 { -denom / 2 } else { denom / 2 };
    //
    //     let num = b1 * c2 - b2 * c1;
    //     let x = if num < 0 { num - offset } else { num + offset } / denom;
    //
    //     let num = a2 * c1 - a1 * c2;
    //     let y = if num < 0 { num - offset } else { num + offset } / denom;

        // do float instead
        let num = b1 * c2 - b2 * x1;
        let x = num as f64 / denom as f64;

        let num = a2 * c1 - a1 * c2;
        let y = num as f64 / denom as f64;

        Some(OrderedCoordinateF64{ x, y })
	}
}

impl Intersection for OrderedSegmentI128 {
// interesting integer version:
// https://stackoverflow.com/questions/21224361/calculate-intersection-of-two-lines-using-integers-only

 	fn intersects(&self, other: &Self) -> bool {
		let (a, b) = self.coordinates();
		let (c, d) = other.coordinates();

		let xa = a.orient(&b, &c);
		let xb = a.orient(&b, &d);

		// may intersect in an overlapping line or not intersect at all
		if xa == Orientation::Collinear && xb == Orientation::Collinear { return false; }

		let xc = c.orient(&d, &a);
		let xd = c.orient(&d, &b);

		if xa != xb && xc != xd { return true; }

		false
	}

	fn line_intersection1(&self, other: &Self) -> Option<OrderedCoordinateF64> {
	    // cannot do the long multiplication below without upscaling from i32 --> i28


		let d1 = self.delta();
		let d2 = other.delta();

		let x_dnm = d2.cross(d1);
// 		let x_dnm2 = d1.y * d2.x - d2.y * d1.x;
// 		assert_eq!(x_dnm, x_dnm2);

		if x_dnm == 0 { return None; }

        let y_dnm = d1.cross(d2);
// 		let y_dnm2 = d1.x * d2.y - d2.x * d1.y;
// 		assert_eq!(y_dnm, y_dnm2);
		if y_dnm == 0 { return None; }

		// dbg!(x_dnm);
// 		dbg!(y_dnm);

		let a = self.start;
		let c = other.start;

		let (ax, ay) = a.x_y();
		let (cx, cy) = c.x_y();

		let x_num = ax * d1.y * d2.x - cx * d2.y * d1.x + cy * d1.x * d2.x - ay * d1.x * d2.x;
		let y_num = ay * d1.x * d2.y - cy * d2.x * d1.y + cx * d1.y * d2.y - ax * d1.y * d2.y;

		// dbg!(x_num);
// 		dbg!(y_num);
// 		println!("");

		let ratio_x = x_num as f64 / x_dnm as f64;
		let ratio_y = y_num as f64 / y_dnm as f64;

		Some(OrderedCoordinateF64 { x: ratio_x, y: ratio_y })
	}

	fn line_intersection2(&self, other: &Self) -> Option<OrderedCoordinateF64> {
	    // cannot do the subtraction below without upscaling from i32 --> i28


		let d1 = self.delta();
		let d2 = other.delta();

		let dnm = d1.cross(d2);
// 		let dnm2 = d2.y * d1.x - d2.x * d1.y;
// 		assert_eq!(dnm, dnm2);
		if dnm == 0 { return None; }
		// dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay)

		// Determine the vector distance from a
		let d_ac = self.start - other.start;

		let t0 = d2.cross(d_ac);
// 		let t0_1 = d2.x * d_ac.y - d2.y * d_ac.x;
// 		assert_eq!(t0, t0_1);
		let t0 = t0 as f64 / dnm as f64;
		// t0 = ((dx - cx) * (ay - cy) - (dy - cy) * (ax - cx)) / dnm

		let x = self.start.x as f64 + t0 * d1.x as f64;
		let y = self.start.y as f64 + t0 * d1.y as f64;

		Some(OrderedCoordinateF64 { x, y })
	}

	fn segment_intersection(&self, other: &Self) -> Option<OrderedCoordinateF64> {
	    // cannot do the subtraction below without upscaling from i32 --> i28

		let epsilon = 1e-8_f64;

		let d1 = self.delta();
		let d2 = other.delta();

		let dnm = d1.cross(d2);
// 		let dnm2 = d2.y * d1.x - d2.x * d1.y;
// 		assert_eq!(dnm, dnm2);
		if dnm == 0 { return None; }
		// dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay)

		// Determine the vector distance from a
		let d_ac = self.start - other.start;

        // vector distance from self.start (a)
		let t0 = d2.cross(d_ac);
// 		let t0_1 = d2.x * d_ac.y - d2.y * d_ac.x;
// 		assert_eq!(t0, t0_1);
		let t0 = t0 as f64 / dnm as f64;
		if t0 < (0. - epsilon) || t0 > (1. + epsilon) { return None; }
        // t0 = ((dx - cx) * (ay - cy) - (dy - cy) * (ax - cx)) / dnm

        // vector distance from other.start (c)
		let t1 = d1.cross(d_ac);
// 		let t1_1 = d1.x * d_ac.y - d1.y * d_ac.x;
// 		assert_eq!(t1, t1_1);
		let t1 = t1 as f64 / dnm as f64;
		if t1 < (0. - epsilon) || t1 > (1. + epsilon) { return None; }
        // t1 = ((bx - ax) * (ay - cy) - (by - ay) * (ax - cx)) / dnm



		let x = self.start.x as f64 + t0 * d1.x as f64;
		let y = self.start.y as f64 + t0 * d1.y as f64;

		Some(OrderedCoordinateF64 { x, y })
	}

	fn segment_intersection2(&self, other: &Self) -> Option<OrderedCoordinateF64> {

	    // First line coefficients where "a1 x  +  b1 y  +  c1  =  0"
	    let (x1, y1, x2, y2) = self.coords();
	    let (x3, y3, x4, y4) = other.coords();

	     // First line coefficients where "a1 x  +  b1 y  +  c1  =  0"
        let a1 = y2 - y1;
        let b1 = x1 - x2;
        let c1 = x2 * y1 - x1 * y2;

        // Second line coefficients
        let a2 = y4 - y3;
        let b2 = x3 - x4;
        let c2 = x4 * y3 - x3 * y4;

        let denom = a1 * b2 - a2 * b1;

        // Lines are colinear
        if denom == 0 {
            return None;
        }

        // Compute sign values
        let r3 = a1 * x3 + b1 * y3 + c1;
        let r4 = a1 * x4 + b1 * y4 + c1;

        // Sign values for second line
        let r1 = a2 * x1 + b2 * y1 + c2;
        let r2 = a2 * x2 + b2 * y2 + c2;

        // Flag denoting whether intersection point is on passed line segments. If this is false,
        // the intersection occurs somewhere along the two mathematical, infinite lines instead.
        //
        // Check signs of r3 and r4.  If both point 3 and point 4 lie on same side of line 1, the
        // line segments do not intersect.
        //
        // Check signs of r1 and r2.  If both point 1 and point 2 lie on same side of second line
        // segment, the line segments do not intersect.
        let is_on_segments = (r3 != 0 && r4 != 0 && same_signs(r3, r4))
            || (r1 != 0 && r2 != 0 && same_signs(r1, r2));

        if !is_on_segments { return None; }
        // If we got here, line segments intersect. Compute intersection point using method similar
        // to that described here: http://paulbourke.net/geometry/pointlineplane/#i2l

        // The denom/2 is to get rounding instead of truncating. It is added or subtracted to the
        // numerator, depending upon the sign of the numerator.
       //  let offset = if denom < 0 { -denom / 2 } else { denom / 2 };
    //
    //     let num = b1 * c2 - b2 * c1;
    //     let x = if num < 0 { num - offset } else { num + offset } / denom;
    //
    //     let num = a2 * c1 - a1 * c2;
    //     let y = if num < 0 { num - offset } else { num + offset } / denom;

        // do float instead
        let num = b1 * c2 - b2 * x1;
        let x = num as f64 / denom as f64;

        let num = a2 * c1 - a1 * c2;
        let y = num as f64 / denom as f64;

        Some(OrderedCoordinateF64{ x, y })
	}
}


#[cfg(test)]
mod tests {
	use super::*;
	use crate::generate_random::{ GenerateRandom };
	use crate::ordered_coordinate::{ OrderedCoordinateF64, c_i32, c_f64 };
	use rand::SeedableRng;
	use rand::rngs::StdRng;

	struct SegmentDataI32
    {
        s0: OrderedSegmentI32,
        s1: OrderedSegmentI32,
        s2: OrderedSegmentI32,
        s3: OrderedSegmentI32,

        expected01: Option<OrderedCoordinateF64>,
        expected02: Option<OrderedCoordinateF64>,
        expected03: Option<OrderedCoordinateF64>,
        expected12: Option<OrderedCoordinateF64>,
        expected13: Option<OrderedCoordinateF64>,
        expected23: Option<OrderedCoordinateF64>,
    }

	struct SegmentDataF64
    {
        s0: OrderedSegmentF64,
        s1: OrderedSegmentF64,
        s2: OrderedSegmentF64,
        s3: OrderedSegmentF64,

        expected01: Option<OrderedCoordinateF64>,
        expected02: Option<OrderedCoordinateF64>,
        expected03: Option<OrderedCoordinateF64>,
        expected12: Option<OrderedCoordinateF64>,
        expected13: Option<OrderedCoordinateF64>,
        expected23: Option<OrderedCoordinateF64>,
    }

    impl SegmentDataI32
    {
        fn new() -> SegmentDataI32 {
            SegmentDataI32 {
                s0: OrderedSegmentI32::new(c_i32(2300, 1900), c_i32(4200, 1900)),
                s1: OrderedSegmentI32::new(c_i32(2387, 1350), c_i32(2500, 2100)),
                s2: OrderedSegmentI32::new(c_i32(2387, 1350), c_i32(3200, 1900)),
                s3: OrderedSegmentI32::new(c_i32(2500, 2100), c_i32(2900, 2100)),

                expected01: Some(OrderedCoordinateF64 { x: 2469.866666666667, y: 1900. }), // s0 x s1
                expected02: Some(OrderedCoordinateF64 { x: 3200., y: 1900. }),
                expected03: None,
                expected12: Some(OrderedCoordinateF64 { x: 2387., y: 1350. }),
                expected13: Some(OrderedCoordinateF64 { x: 2500., y: 2100. }),
                expected23: Some(OrderedCoordinateF64 { x: 3495.6363636363635, y: 2100. }),
            }
        }
    }

    impl From<SegmentDataI32> for SegmentDataF64 {
        fn from(data: SegmentDataI32) -> Self {
            SegmentDataF64 {
                s0: data.s0.into(),
                s1: data.s1.into(),
                s2: data.s2.into(),
                s3: data.s3.into(),

                expected01: data.expected01,
                expected02: data.expected02,
                expected03: data.expected03,
                expected12: data.expected12,
                expected13: data.expected13,
                expected23: data.expected23,
            }
        }
    }

    // ---------------- SEGMENT INTERSECTS
	#[test]
	fn intersects_f64_works() {
	    let data: SegmentDataF64 = SegmentDataI32::new().into();

		assert!(data.s0.intersects(&data.s1));
		assert!(data.s0.intersects(&data.s2));
		assert!(!data.s0.intersects(&data.s3));
	}

	#[test]
	fn intersects_i32_works() {
	    let data: SegmentDataI32 = SegmentDataI32::new();

		assert!(data.s0.intersects(&data.s1));
		assert!(data.s0.intersects(&data.s2));
		assert!(!data.s0.intersects(&data.s3));
	}


    #[test]
    fn intersects_i32_overflow_works() {
		let nw = c_i32(i32::MIN, i32::MIN);
		let sw = c_i32(i32::MIN, i32::MAX);
		let ne = c_i32(i32::MAX, i32::MIN);
		let se = c_i32(i32::MAX, i32::MAX);

		let ne_sw = OrderedSegmentI32::new(ne.into(), sw.into());
		let se_nw = OrderedSegmentI32::new(se.into(), nw.into());
		let ne_nw = OrderedSegmentI32::new(ne.into(), nw.into());
		let se_sw = OrderedSegmentI32::new(se.into(), sw.into());

		assert!(ne_sw.intersects(&se_nw));
		assert!(ne_sw.intersects(&ne_nw));
		assert!(!ne_nw.intersects(&se_sw));

    }

	#[test]
	fn intersects_random_i32_f64_equal() {
		let max_iter = 100;
		let mut rng: StdRng = SeedableRng::seed_from_u64(42);

		for _ in 0..max_iter {
			let s0_i = OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s0_f: OrderedSegmentF64 = s0_i.clone().into();

			let s1_i =  OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s1_f: OrderedSegmentF64 = s1_i.clone().into();

			let res_i = s0_i.intersects(&s1_i);
			let res_f = s0_f.intersects(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

// ---------------- LINE INTERSECTION
    #[test]
    fn line_intersection1_f64_works() {
        let data: SegmentDataF64 = SegmentDataI32::new().into();

    	assert_eq!(data.s0.line_intersection1(&data.s1), data.expected01);
		assert_eq!(data.s0.line_intersection1(&data.s2), data.expected02);
		assert_eq!(data.s0.line_intersection1(&data.s3), data.expected03);

		assert_eq!(data.s1.line_intersection1(&data.s2), data.expected12);
		assert_eq!(data.s1.line_intersection1(&data.s3), data.expected13);
		assert_eq!(data.s2.line_intersection1(&data.s3), data.expected23);
    }

    #[test]
    fn line_intersection2_f64_works() {
        let data: SegmentDataF64 = SegmentDataI32::new().into();

    	assert_eq!(data.s0.line_intersection2(&data.s1), data.expected01);
		assert_eq!(data.s0.line_intersection2(&data.s2), data.expected02);
		assert_eq!(data.s0.line_intersection2(&data.s3), data.expected03);

		assert_eq!(data.s1.line_intersection2(&data.s2), data.expected12);
		assert_eq!(data.s1.line_intersection2(&data.s3), data.expected13);
		assert_eq!(data.s2.line_intersection2(&data.s3), data.expected23);
    }

    #[test]
    fn line_intersection1_i32_works() {
        let data = SegmentDataI32::new();

    	assert_eq!(data.s0.line_intersection1(&data.s1), data.expected01);
		assert_eq!(data.s0.line_intersection1(&data.s2), data.expected02);
		assert_eq!(data.s0.line_intersection1(&data.s3), data.expected03);

		assert_eq!(data.s1.line_intersection1(&data.s2), data.expected12);
		assert_eq!(data.s1.line_intersection1(&data.s3), data.expected13);
		assert_eq!(data.s2.line_intersection1(&data.s3), data.expected23);
    }

    #[test]
    fn line_intersection2_i32_works() {
        let data = SegmentDataI32::new();

    	assert_eq!(data.s0.line_intersection2(&data.s1), data.expected01);
		assert_eq!(data.s0.line_intersection2(&data.s2), data.expected02);
		assert_eq!(data.s0.line_intersection2(&data.s3), data.expected03);

		assert_eq!(data.s1.line_intersection2(&data.s2), data.expected12);
		assert_eq!(data.s1.line_intersection2(&data.s3), data.expected13);
		assert_eq!(data.s2.line_intersection2(&data.s3), data.expected23);
    }

    // Maximum map resolution in Foundry is 16384 x 16384 (2^14 x 2^14)
    // https://forums.forge-vtt.com/t/the-image-optimizer/681
    // In theory, it would be 0 to 16384, but using i32 here, so...
//     #[test]
//     fn line_intersection1_i32_foundry_max_works() {
//
//
//     }


    #[test]
    fn line_intersection1_i32_overflow_works() {
		let nw = c_i32(i32::MIN, i32::MIN);
		let sw = c_i32(i32::MIN, i32::MAX);
		let ne = c_i32(i32::MAX, i32::MIN);
		let se = c_i32(i32::MAX, i32::MAX);
// 		let z: (i32, i32) = (0, 0);

		let diag_up = OrderedSegmentI32::new(sw, ne); // ne_sw
		let diag_down = OrderedSegmentI32::new(nw, se); // se_nw
		let top = OrderedSegmentI32::new(nw, ne); // ne_nw
		let bottom = OrderedSegmentI32::new(sw, se); // se_sw
		let right = OrderedSegmentI32::new(ne, se);
		let left = OrderedSegmentI32::new(nw, sw);

        // four corners intersections
        let expected_nw: OrderedCoordinateF64 = nw.into();
        let expected_sw: OrderedCoordinateF64 = sw.into();
        let expected_ne: OrderedCoordinateF64 = ne.into();
        let expected_se: OrderedCoordinateF64 = se.into();


        // midpoint intersection
        let expected_mid = c_f64(-0.5, -0.5);

		assert_eq!(top.line_intersection1(&left), Some(expected_nw));
		assert_eq!(top.line_intersection1(&right), Some(expected_ne));
		assert_eq!(top.line_intersection1(&bottom), None);
		assert_eq!(top.line_intersection1(&diag_up), Some(expected_ne));
		assert_eq!(top.line_intersection1(&diag_down), Some(expected_nw));

		assert_eq!(bottom.line_intersection1(&left), Some(expected_sw));
		assert_eq!(bottom.line_intersection1(&right), Some(expected_se));
		assert_eq!(bottom.line_intersection1(&diag_up), Some(expected_sw));
		assert_eq!(bottom.line_intersection1(&diag_down), Some(expected_se));

		assert_eq!(right.line_intersection1(&left), None);
		assert_eq!(right.line_intersection1(&diag_up), Some(expected_ne));
		assert_eq!(right.line_intersection1(&diag_down), Some(expected_se));

		assert_eq!(left.line_intersection1(&diag_up), Some(expected_sw));
		assert_eq!(left.line_intersection1(&diag_down), Some(expected_nw));

		assert_eq!(diag_up.line_intersection1(&diag_down), Some(expected_mid));

		// compare with F64 version
// 		let diag_up: OrderedSegmentF64 = diag_up.into();
// 		let diag_down: OrderedSegmentF64 = diag_down.into();
// 		let top: OrderedSegmentF64 = top.into();
// 		let bottom: OrderedSegmentF64 = bottom.into();
// 		let right: OrderedSegmentF64 = right.into();
// 		let left: OrderedSegmentF64 = left.into();
//
// 		assert_eq!(top.line_intersection1(&left), Some(expected_nw));
// 		assert_eq!(top.line_intersection1(&right), Some(expected_ne));
// 		assert_eq!(top.line_intersection1(&bottom), None);
// 		assert_eq!(top.line_intersection1(&diag_up), Some(expected_ne));
// 		assert_eq!(top.line_intersection1(&diag_down), Some(expected_nw));
//
// 		assert_eq!(bottom.line_intersection1(&left), Some(expected_sw));
// 		assert_eq!(bottom.line_intersection1(&right), Some(expected_se));
// 		assert_eq!(bottom.line_intersection1(&diag_up), Some(expected_sw));
// 		assert_eq!(bottom.line_intersection1(&diag_down), Some(expected_se));
//
// 		assert_eq!(right.line_intersection1(&left), None);
// 		assert_eq!(right.line_intersection1(&diag_up), Some(expected_ne));
// 		assert_eq!(right.line_intersection1(&diag_down), Some(expected_se));
//
// 		assert_eq!(left.line_intersection1(&diag_up), Some(expected_sw));
// 		assert_eq!(left.line_intersection1(&diag_down), Some(expected_nw));

        // will be off: Some(OrderedCoordinateF64 { x: -0.5000000002328306, y: -0.5000000002328306 })
// 		assert_eq!(diag_up.line_intersection1(&diag_down), Some(expected_mid));
    }

    #[test]
    fn line_intersection2_i32_overflow_works() {
		let nw = c_i32(i32::MIN, i32::MIN);
		let sw = c_i32(i32::MIN, i32::MAX);
		let ne = c_i32(i32::MAX, i32::MIN);
		let se = c_i32(i32::MAX, i32::MAX);
// 		let z: (i32, i32) = (0, 0);

		let diag_up = OrderedSegmentI32::new(sw, ne); // ne_sw
		let diag_down = OrderedSegmentI32::new(nw, se); // se_nw
		let top = OrderedSegmentI32::new(nw, ne); // ne_nw
		let bottom = OrderedSegmentI32::new(sw, se); // se_sw
		let right = OrderedSegmentI32::new(ne, se);
		let left = OrderedSegmentI32::new(nw, sw);

        // four corners intersections
        let expected_nw: OrderedCoordinateF64 = nw.into();
        let expected_sw: OrderedCoordinateF64 = sw.into();
        let expected_ne: OrderedCoordinateF64 = ne.into();
        let expected_se: OrderedCoordinateF64 = se.into();


        // midpoint intersection
        let expected_mid = c_f64(-0.5, -0.5);

		assert_eq!(top.line_intersection2(&left), Some(expected_nw));
		assert_eq!(top.line_intersection2(&right), Some(expected_ne));
		assert_eq!(top.line_intersection2(&bottom), None);
		assert_eq!(top.line_intersection2(&diag_up), Some(expected_ne));
		assert_eq!(top.line_intersection2(&diag_down), Some(expected_nw));

		assert_eq!(bottom.line_intersection2(&left), Some(expected_sw));
		assert_eq!(bottom.line_intersection2(&right), Some(expected_se));
		assert_eq!(bottom.line_intersection2(&diag_up), Some(expected_sw));
		assert_eq!(bottom.line_intersection2(&diag_down), Some(expected_se));

		assert_eq!(right.line_intersection2(&left), None);
		assert_eq!(right.line_intersection2(&diag_up), Some(expected_ne));
		assert_eq!(right.line_intersection2(&diag_down), Some(expected_se));

		assert_eq!(left.line_intersection2(&diag_up), Some(expected_sw));
		assert_eq!(left.line_intersection2(&diag_down), Some(expected_nw));

		assert_eq!(diag_up.line_intersection2(&diag_down), Some(expected_mid));
    }


    #[test]
	fn line_intersection1_i32_overflow_severe_works() {

		// s0: (MIN, MIN),(MIN, MAX)
		// s1: (MAX, MIN), (MAX - 1, MAX)
		let vert = OrderedSegmentI32::new(c_i32(i32::MIN, i32::MIN), c_i32(i32::MIN, i32::MAX));
		let near_horiz = OrderedSegmentI32::new(c_i32(i32::MAX, i32::MIN), c_i32(i32::MAX - 1, i32::MAX));

		let res1 = OrderedCoordinateF64 { x: -2147483648., y: 18446744062972133000. };

		assert_eq!(vert.line_intersection1(&near_horiz), Some(res1));
	}

    #[test]
	fn line_intersection2_i32_overflow_severe_works() {

		// s0: (MIN, MIN),(MIN, MAX)
		// s1: (MAX, MIN), (MAX - 1, MAX)
		let vert = OrderedSegmentI32::new(c_i32(i32::MIN, i32::MIN), c_i32(i32::MIN, i32::MAX));
		let near_horiz = OrderedSegmentI32::new(c_i32(i32::MAX, i32::MIN), c_i32(i32::MAX - 1, i32::MAX));

		let res1 = OrderedCoordinateF64 { x: -2147483648., y: 18446744062972133000. };

		assert_eq!(vert.line_intersection2(&near_horiz), Some(res1));
	}

    #[test]
	fn segment_intersection_i32_overflow_severe_works() {

		// s0: (MIN, MIN),(MIN, MAX)
		// s1: (MAX, MIN), (MAX - 1, MAX)
		let vert = OrderedSegmentI32::new(c_i32(i32::MIN, i32::MIN), c_i32(i32::MIN, i32::MAX));
		let near_horiz = OrderedSegmentI32::new(c_i32(i32::MAX, i32::MIN), c_i32(i32::MAX - 1, i32::MAX));

		assert_eq!(vert.segment_intersection(&near_horiz), None);
	}

// ---------------- SEGMENT INTERSECTION

    #[test]
    fn segment_intersection_f64_works() {
        let data: SegmentDataF64 = SegmentDataI32::new().into();

    	assert_eq!(data.s0.segment_intersection(&data.s1), data.expected01);
		assert_eq!(data.s0.segment_intersection(&data.s2), data.expected02);
		assert_eq!(data.s0.segment_intersection(&data.s3), data.expected03);

		assert_eq!(data.s1.segment_intersection(&data.s2), data.expected12);
		assert_eq!(data.s1.segment_intersection(&data.s3), data.expected13);

		// this last intersection is outside the segments
		assert_eq!(data.s2.segment_intersection(&data.s3), None);
    }

    #[test]
    fn segment_intersection_i32_works() {
        let data = SegmentDataI32::new();

    	assert_eq!(data.s0.segment_intersection(&data.s1), data.expected01);
		assert_eq!(data.s0.segment_intersection(&data.s2), data.expected02);
		assert_eq!(data.s0.segment_intersection(&data.s3), data.expected03);

		assert_eq!(data.s1.segment_intersection(&data.s2), data.expected12);
		assert_eq!(data.s1.segment_intersection(&data.s3), data.expected13);

		// this last intersection is outside the segments
		assert_eq!(data.s2.segment_intersection(&data.s3), None);
    }

    #[test]
    fn segment_intersection_i32_overflow_works() {
		let nw = c_i32(i32::MIN, i32::MIN);
		let sw = c_i32(i32::MIN, i32::MAX);
		let ne = c_i32(i32::MAX, i32::MIN);
		let se = c_i32(i32::MAX, i32::MAX);
// 		let z: (i32, i32) = (0, 0);

		let diag_up = OrderedSegmentI32::new(sw, ne); // ne_sw
		let diag_down = OrderedSegmentI32::new(nw, se); // se_nw
		let top = OrderedSegmentI32::new(nw, ne); // ne_nw
		let bottom = OrderedSegmentI32::new(sw, se); // se_sw
		let right = OrderedSegmentI32::new(ne, se);
		let left = OrderedSegmentI32::new(nw, sw);

        // four corners intersections
        let expected_nw: OrderedCoordinateF64 = nw.into();
        let expected_sw: OrderedCoordinateF64 = sw.into();
        let expected_ne: OrderedCoordinateF64 = ne.into();
        let expected_se: OrderedCoordinateF64 = se.into();


        // midpoint intersection
        let expected_mid = c_f64(-0.5, -0.5);

		assert_eq!(top.segment_intersection(&left), Some(expected_nw));
		assert_eq!(top.segment_intersection(&right), Some(expected_ne));
		assert_eq!(top.segment_intersection(&bottom), None);
		assert_eq!(top.segment_intersection(&diag_up), Some(expected_ne));
		assert_eq!(top.segment_intersection(&diag_down), Some(expected_nw));

		assert_eq!(bottom.segment_intersection(&left), Some(expected_sw));
		assert_eq!(bottom.segment_intersection(&right), Some(expected_se));
		assert_eq!(bottom.segment_intersection(&diag_up), Some(expected_sw));
		assert_eq!(bottom.segment_intersection(&diag_down), Some(expected_se));

		assert_eq!(right.segment_intersection(&left), None);
		assert_eq!(right.segment_intersection(&diag_up), Some(expected_ne));
		assert_eq!(right.segment_intersection(&diag_down), Some(expected_se));

		assert_eq!(left.segment_intersection(&diag_up), Some(expected_sw));
		assert_eq!(left.segment_intersection(&diag_down), Some(expected_nw));

		assert_eq!(diag_up.segment_intersection(&diag_down), Some(expected_mid));
    }

        #[test]
    fn segment_intersection2_i32_works() {
        let data = SegmentDataI32::new();

    	assert_eq!(data.s0.segment_intersection2(&data.s1), data.expected01);
		assert_eq!(data.s0.segment_intersection2(&data.s2), data.expected02);
		assert_eq!(data.s0.segment_intersection2(&data.s3), data.expected03);

		assert_eq!(data.s1.segment_intersection2(&data.s2), data.expected12);
		assert_eq!(data.s1.segment_intersection2(&data.s3), data.expected13);

		// this last intersection is outside the segments
		assert_eq!(data.s2.segment_intersection2(&data.s3), None);
    }

    #[test]
    fn segment_intersection2_i32_overflow_works() {
		let nw = c_i32(i32::MIN, i32::MIN);
		let sw = c_i32(i32::MIN, i32::MAX);
		let ne = c_i32(i32::MAX, i32::MIN);
		let se = c_i32(i32::MAX, i32::MAX);
// 		let z: (i32, i32) = (0, 0);

		let diag_up = OrderedSegmentI32::new(sw, ne); // ne_sw
		let diag_down = OrderedSegmentI32::new(nw, se); // se_nw
		let top = OrderedSegmentI32::new(nw, ne); // ne_nw
		let bottom = OrderedSegmentI32::new(sw, se); // se_sw
		let right = OrderedSegmentI32::new(ne, se);
		let left = OrderedSegmentI32::new(nw, sw);

        // four corners intersections
        let expected_nw: OrderedCoordinateF64 = nw.into();
        let expected_sw: OrderedCoordinateF64 = sw.into();
        let expected_ne: OrderedCoordinateF64 = ne.into();
        let expected_se: OrderedCoordinateF64 = se.into();


        // midpoint intersection
        let expected_mid = c_f64(-0.5, -0.5);

		assert_eq!(top.segment_intersection2(&left), Some(expected_nw));
		assert_eq!(top.segment_intersection2(&right), Some(expected_ne));
		assert_eq!(top.segment_intersection2(&bottom), None);
		assert_eq!(top.segment_intersection2(&diag_up), Some(expected_ne));
		assert_eq!(top.segment_intersection2(&diag_down), Some(expected_nw));

		assert_eq!(bottom.segment_intersection2(&left), Some(expected_sw));
		assert_eq!(bottom.segment_intersection2(&right), Some(expected_se));
		assert_eq!(bottom.segment_intersection2(&diag_up), Some(expected_sw));
		assert_eq!(bottom.segment_intersection2(&diag_down), Some(expected_se));

		assert_eq!(right.segment_intersection2(&left), None);
		assert_eq!(right.segment_intersection2(&diag_up), Some(expected_ne));
		assert_eq!(right.segment_intersection2(&diag_down), Some(expected_se));

		assert_eq!(left.segment_intersection2(&diag_up), Some(expected_sw));
		assert_eq!(left.segment_intersection2(&diag_down), Some(expected_nw));

		assert_eq!(diag_up.segment_intersection2(&diag_down), Some(expected_mid));
    }

// ---------------- TEST RANDOM LINES FOR DIFFERENCES IN RESULTS

	#[test]
	fn line_intersection1_random_i32_f64_equal() {
		let max_iter = 100;
		let mut rng: StdRng = SeedableRng::seed_from_u64(42);

		for _ in 0..max_iter {
			let s0_i = OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s0_f: OrderedSegmentF64 = s0_i.clone().into();

			let s1_i =  OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s1_f: OrderedSegmentF64 = s1_i.clone().into();

			let res_i = s0_i.line_intersection1(&s1_i);
			let res_f = s0_f.line_intersection1(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

	#[test]
	fn line_intersection2_random_i32_f64_equal() {
		let max_iter = 100;
		let mut rng: StdRng = SeedableRng::seed_from_u64(42);

		for _ in 0..max_iter {
			let s0_i = OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s0_f: OrderedSegmentF64 = s0_i.clone().into();

			let s1_i =  OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s1_f: OrderedSegmentF64 = s1_i.clone().into();

			let res_i = s0_i.line_intersection2(&s1_i);
			let res_f = s0_f.line_intersection2(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

	#[test]
	fn segment_intersection_random_i32_f64_equal() {
		let max_iter = 100;
		let mut rng: StdRng = SeedableRng::seed_from_u64(42);

		for _ in 0..max_iter {
			let s0_i = OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s0_f: OrderedSegmentF64 = s0_i.clone().into();

			let s1_i =  OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s1_f: OrderedSegmentF64 = s1_i.clone().into();

			let res_i = s0_i.segment_intersection(&s1_i);
			let res_f = s0_f.segment_intersection(&s1_f);

			assert_eq!(res_i, res_f);

			let res1 = s0_i.segment_intersection(&s1_i);
			let res2 = s0_i.segment_intersection2(&s1_i);

			assert_eq!(res1, res2);
		}
	}

	#[test]
	fn segment_intersection2_random_i32_f64_equal() {
		let max_iter = 100;
		let mut rng: StdRng = SeedableRng::seed_from_u64(42);

		for _ in 0..max_iter {
			let s0_i = OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s0_f: OrderedSegmentF64 = s0_i.clone().into();

			let s1_i =  OrderedSegmentI32::random_range(-10000, 10000, &mut rng);
			let s1_f: OrderedSegmentF64 = s1_i.clone().into();

			let res_i = s0_i.segment_intersection2(&s1_i);
			let res_f = s0_f.segment_intersection2(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

}




