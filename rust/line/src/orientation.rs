use crate::ordered_coordinate::{ OrderedCoordinateI32, OrderedCoordinateF64, OrderedCoordinateI64, OrderedCoordinateI128 };
use wasm_bindgen::prelude::*;

/// Is the object clockwise, counterclockwise, or collinear?
// (Cannot align with Foundry -1, 0, 1 if using wasm_bindgen)
#[wasm_bindgen]
#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub enum Orientation {
    Collinear,
    Clockwise,
    CounterClockwise,
}

pub trait Orientable {
    /// orientation calculated from twice the area of the triangle
    /// formed by the three objects
    fn orient(&self, b: &Self, c: &Self) -> Orientation;
}

// impl Orientation {
//     /// orientation calculated from twice the area of the triangle
//     /// formed by the three objects
//     fn orient(&self, b: &Self, c: &Self) -> Orientation;
// }

impl Orientable for OrderedCoordinateF64 {
    #[inline]
    fn orient(&self, b: &Self, c: &Self) -> Orientation {
//         let (ax, ay) = self.x_y();
//         let (bx, by) = b.x_y();
//         let (cx, cy) = c.x_y();
//         let res = (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);

        let dac = *self - c;
        let dbc = *b - c;
        let res = dac.x * dbc.y - dac.y * dbc.x;

     	if res < 0. {
     		Orientation::CounterClockwise
     	} else if res > 0. {
     		Orientation::Clockwise
     	} else {
     		Orientation::Collinear
     	}

//         let right = dac.y * dbc.x;
//         let left =  dac.x * dbc.y;
//
//      	if right > left {
//      		Orientation::CounterClockwise
//      	} else if right < left {
//      		Orientation::Clockwise
//      	} else {
//      		Orientation::Collinear
//      	}
    }
}

impl Orientable for OrderedCoordinateI32 {
    #[inline]
     fn orient(&self, b: &Self, c: &Self) -> Orientation {
        // (ay - cy) * (bx - cx) - (ax - cx) * (by - cy)

        // options: don't check overflow (fails for Foundry)
        // cast to i64 (works for Foundry) -- time cost ~ 2x (~100% increase time)
        // cast to i128 (works for all i32) -- same time cost as i64

//         let (a, b, c) = (*self, *b, *c); // no overflow checks
//         let (a, b, c): (OrderedCoordinateI64, OrderedCoordinateI64, OrderedCoordinateI64) = (self.into(), b.into(), c.into()); // overflow avoidance
        let (a, b, c): (OrderedCoordinateI128, OrderedCoordinateI128, OrderedCoordinateI128) = (self.into(), b.into(), c.into()); // overflow avoidance

        let dac = a - c;
        let dbc = b - c;
        let res = dac.x * dbc.y - dac.y * dbc.x;

     	if res < 0 {
     		Orientation::CounterClockwise
     	} else if res > 0 {
     		Orientation::Clockwise
     	} else {
     		Orientation::Collinear
     	}

//         let dac = a - c;
//         let dbc = b - c;
//         let right = dac.y * dbc.x;
//         let left  = dac.x * dbc.y;
//
//      	if right > left {
//      		Orientation::CounterClockwise
//      	} else if right < left {
//      		Orientation::Clockwise
//      	} else {
//      		Orientation::Collinear
//      	}
    }
}

impl Orientable for OrderedCoordinateI128 {
    #[inline]
     fn orient(&self, b: &Self, c: &Self) -> Orientation {
        // (ay - cy) * (bx - cx) - (ax - cx) * (by - cy)
        let dac = *self - c;
        let dbc = *b - c;
        let res = dac.x * dbc.y - dac.y * dbc.x;

     	if res < 0 {
     		Orientation::CounterClockwise
     	} else if res > 0 {
     		Orientation::Clockwise
     	} else {
     		Orientation::Collinear
     	}

//         let (a, b, c) = (*self, *b, *c); // no overflow checks
//
//         let dac = a - c;
//         let dbc = b - c;
//         let right = dac.y * dbc.x;
//         let left  = dac.x * dbc.y;
//
//      	if right > left {
//      		Orientation::CounterClockwise
//      	} else if right < left {
//      		Orientation::Clockwise
//      	} else {
//      		Orientation::Collinear
//      	}
    }
}

#[cfg(test)]
mod tests {
	use super::*;
	use crate::ordered_coordinate::{ c_i32, c_f64, c_i128 };

// ---------------- ORIENTATION

	#[test]
	fn orient_i32_works() {
		let p1 = c_i32(0, 0);
		let p2 = c_i32(1, 1);
		let p3 = c_i32(0, 1); // cw
		let p4 = c_i32(1, 0); // ccw
		let p5 = c_i32(2, 2); // collinear

		assert_eq!(p1.orient(&p2, &p3), Orientation::Clockwise);
		assert_eq!(p1.orient(&p2, &p4), Orientation::CounterClockwise);
		assert_eq!(p1.orient(&p2, &p5), Orientation::Collinear);
	}

	#[test]
	fn orient_f64_works() {
		let p1 = c_f64(0., 0.);
		let p2 = c_f64(1., 1.);
		let p3 = c_f64(0., 1.); // cw
		let p4 = c_f64(1., 0.); // ccw
		let p5 = c_f64(2., 2.); // collinear

		assert_eq!(p1.orient(&p2, &p3), Orientation::Clockwise);
		assert_eq!(p1.orient(&p2, &p4), Orientation::CounterClockwise);
		assert_eq!(p1.orient(&p2, &p5), Orientation::Collinear);
	}

	#[test]
	fn orient_i128_works() {
		let p1 = c_i128(0, 0);
		let p2 = c_i128(1, 1);
		let p3 = c_i128(0, 1); // cw
		let p4 = c_i128(1, 0); // ccw
		let p5 = c_i128(2, 2); // collinear

		assert_eq!(p1.orient(&p2, &p3), Orientation::Clockwise);
		assert_eq!(p1.orient(&p2, &p4), Orientation::CounterClockwise);
		assert_eq!(p1.orient(&p2, &p5), Orientation::Collinear);
	}

    // test whether we can use very large integers without overflowing
    // (not at the maximum coordinates, which will overflow)
    // can only get to 2^14 without raising the integer value in orient
    // #[test]
//     fn orient_i32_2e20_works() {
//         let min = -2_i32.pow(14);
//         let max =  2_i32.pow(14);
//
//  		let nw = c_i32(min, min);
// 		let sw = c_i32(min, max);
// 		let ne = c_i32(max, min);
// 		let se = c_i32(max, max);
// 		let z  = c_i32(0, 0);
//
// 		assert_eq!(nw.orient(&se, &ne), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient(&se, &sw), Orientation::Clockwise);
// 		assert_eq!(nw.orient(&z, &se), Orientation::Collinear);
// 		assert_eq!(nw.orient(&sw, &se), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient(&ne, &se), Orientation::Clockwise);
//     }

    // Maximum map resolution in Foundry is 16384 x 16384 (2^14 x 2^14)
    // https://forums.forge-vtt.com/t/the-image-optimizer/681
    // In theory, it would be 0 to 16384, although some possibility
    // of negative coordinates at the map borders.
    #[test]
    fn orient_i32_foundry_overflow_works() {
        let min = 0;
        let max = 2e14 as i32;

 		let nw = c_i32(min, min);
		let sw = c_i32(min, max);
		let ne = c_i32(max, min);
		let se = c_i32(max, max);
		let z  = c_i32(0, 0);

		assert_eq!(nw.orient(&se, &ne), Orientation::CounterClockwise);
		assert_eq!(nw.orient(&se, &sw), Orientation::Clockwise);
		assert_eq!(nw.orient(&z, &se), Orientation::Collinear);
		assert_eq!(nw.orient(&sw, &se), Orientation::CounterClockwise);
		assert_eq!(nw.orient(&ne, &se), Orientation::Clockwise);
    }

    // What if we use the full i32 values?
    // (Requires i128)
    #[test]
    fn orient_i32_overflow_works() {
        let min = i32::MIN;
        let max = i32::MAX;

 		let nw = c_i32(min, min);
		let sw = c_i32(min, max);
		let ne = c_i32(max, min);
		let se = c_i32(max, max);
		let z  = c_i32(0, 0);

		assert_eq!(nw.orient(&se, &ne), Orientation::CounterClockwise);
		assert_eq!(nw.orient(&se, &sw), Orientation::Clockwise);
		assert_eq!(nw.orient(&z, &se), Orientation::Collinear);
		assert_eq!(nw.orient(&sw, &se), Orientation::CounterClockwise);
		assert_eq!(nw.orient(&ne, &se), Orientation::Clockwise);
    }


// 	#[test]
// 	fn orient_point_int16_overflow_works() {
// 		let nw = (i16::MIN, i16::MIN);
// 		let sw = (i16::MIN, i16::MAX);
// 		let ne = (i16::MAX, i16::MIN);
// 		let se = (i16::MAX, i16::MAX);
// 		let z: (i16, i16) = (0, 0);
//
// 		let nw: Coordinate<i16> = nw.into();
// 		let sw: Coordinate<i16> = sw.into();
// 		let ne: Coordinate<i16> = ne.into();
// 		let se: Coordinate<i16> = se.into();
// 		let z:  Coordinate<i16> = z.into();
//
// 		assert_eq!(nw.orient2d(se, ne), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient2d(se, sw), Orientation::Clockwise);
// 		assert_eq!(nw.orient2d(z, se), Orientation::Collinear);
// 		assert_eq!(nw.orient2d(sw, se), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient2d(ne, se), Orientation::Clockwise);
// 	}
//
// 	#[test]
// 	fn orient_point_int32_overflow_works() {
// 		let nw = (i32::MIN, i32::MIN);
// 		let sw = (i32::MIN, i32::MAX);
// 		let ne = (i32::MAX, i32::MIN);
// 		let se = (i32::MAX, i32::MAX);
// 		let z: (i32, i32) = (0, 0);
//
// 		let nw: Coordinate<i32> = nw.into();
// 		let sw: Coordinate<i32> = sw.into();
// 		let ne: Coordinate<i32> = ne.into();
// 		let se: Coordinate<i32> = se.into();
// 		let z:  Coordinate<i32> = z.into();
//
// 		assert_eq!(nw.orient2d(se, ne), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient2d(se, sw), Orientation::Clockwise);
// 		assert_eq!(nw.orient2d(z, se), Orientation::Collinear);
// 		assert_eq!(nw.orient2d(sw, se), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient2d(ne, se), Orientation::Clockwise);
// 	}
//
// 	#[test]
// 	fn orient_point_int64_overflow_works() {
// 		let nw = (i64::MIN, i64::MIN);
// 		let sw = (i64::MIN, i64::MAX);
// 		let ne = (i64::MAX, i64::MIN);
// 		let se = (i64::MAX, i64::MAX);
// 		let z: (i64, i64) = (0, 0);
//
// 		let nw: Coordinate<i64> = nw.into();
// 		let sw: Coordinate<i64> = sw.into();
// 		let ne: Coordinate<i64> = ne.into();
// 		let se: Coordinate<i64> = se.into();
// 		let z:  Coordinate<i64> = z.into();
//
// 		assert_eq!(nw.orient2d(se, ne), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient2d(se, sw), Orientation::Clockwise);
// 		assert_eq!(nw.orient2d(z, se), Orientation::Collinear);
// 		assert_eq!(nw.orient2d(sw, se), Orientation::CounterClockwise);
// 		assert_eq!(nw.orient2d(ne, se), Orientation::Clockwise);
// 	}
}
