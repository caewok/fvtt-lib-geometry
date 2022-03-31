use core::ops::{ Add, Div, Mul, Neg, Sub };
use wasm_bindgen::prelude::*;
use num_traits::cast;

/*
Right now, wasm-bindgen cannot handle structs with generics.
So that we can pass segments and coordinates between JS and rust, don't rely on
geo or euclid crates, which use generic structs.

Instead, build a simple version:
- OrderedCoordinate with some math functions from euclid, like cross and dot
- OrderedSegment from two OrderedCoordinates
- one version using f64, one using i32, one using i128 (internal use only)
- also one using i64 for testing purposes
*/

#[wasm_bindgen]
#[derive(Debug, Copy, Clone, PartialEq)]
pub struct OrderedCoordinateF64 {
	pub x: f64,
	pub y: f64,
}

#[wasm_bindgen]
#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub struct OrderedCoordinateI32 {
	pub x: i32,
	pub y: i32,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub struct OrderedCoordinateI64 {
	pub x: i64,
	pub y: i64,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub struct OrderedCoordinateI128 {
	pub x: i128,
	pub y: i128,
}

// convenience constructor
#[inline]
pub const fn c_f64(x: f64, y: f64) -> OrderedCoordinateF64 {
	OrderedCoordinateF64 { x, y }
}

#[inline]
pub const fn c_i32(x: i32, y: i32) -> OrderedCoordinateI32 {
	OrderedCoordinateI32 { x, y }
}

#[inline]
pub const fn c_i64(x: i64, y: i64) -> OrderedCoordinateI64 {
	OrderedCoordinateI64 { x, y }
}

#[inline]
pub const fn c_i128(x: i128, y: i128) -> OrderedCoordinateI128 {
	OrderedCoordinateI128 { x, y }
}

impl OrderedCoordinateF64 {
	pub fn x_y(&self) -> (f64, f64) {
		(self.x, self.y)
	}

	/// Computes ax * bx + ay * by
	#[inline]
	pub fn dot(self, other: Self) -> f64 {
		self.x * other.x + self.y * other.y
	}

	/// Computes the norm of the cross product.
	/// ax * by - ay * bx
	#[inline]
	pub fn cross(self, other: Self) -> f64 {
		self.x * other.y - self.y * other.x
	}
}

impl OrderedCoordinateI32 {
	pub fn x_y(&self) -> (i32, i32) {
		(self.x, self.y)
	}

	/// Computes ax * bx + ay * by
	#[inline]
	pub fn dot(self, other: Self) -> i32 {
		self.x * other.x + self.y * other.y
	}

	/// Computes the norm of the cross product.
	/// ax * by - ay * bx
	#[inline]
	pub fn cross(self, other: Self) -> i32 {
		self.x * other.y - self.y * other.x
	}
}

impl OrderedCoordinateI64 {
	pub fn x_y(&self) -> (i64, i64) {
		(self.x, self.y)
	}

	/// Computes ax * bx + ay * by
	#[inline]
	pub fn dot(self, other: Self) -> i64 {
		self.x * other.x + self.y * other.y
	}

	/// Computes the norm of the cross product.
	/// ax * by - ay * bx
	#[inline]
	pub fn cross(self, other: Self) -> i64 {
		self.x * other.y - self.y * other.x
	}
}

impl OrderedCoordinateI128 {
	pub fn x_y(&self) -> (i128, i128) {
		(self.x, self.y)
	}

	/// Computes ax * bx + ay * by
	#[inline]
	pub fn dot(self, other: Self) -> i128 {
		self.x * other.x + self.y * other.y
	}

	/// Computes the norm of the cross product.
	/// ax * by - ay * bx
	#[inline]
	pub fn cross(self, other: Self) -> i128 {
		self.x * other.y - self.y * other.x
	}
}

impl Neg for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn neg(self) -> Self::Output {
		c_f64(-self.x, -self.y)
	}
}

impl Neg for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn neg(self) -> Self::Output {
		c_i32(-self.x, -self.y)
	}
}

impl Neg for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn neg(self) -> Self::Output {
		c_i64(-self.x, -self.y)
	}
}

impl Neg for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn neg(self) -> Self::Output {
		c_i128(-self.x, -self.y)
	}
}

impl Add for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn add(self, other: Self) -> Self::Output {
		c_f64(self.x + other.x, self.y + other.y)
	}
}

impl Add for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn add(self, other: Self) -> Self::Output {
		c_i32(self.x + other.x, self.y + other.y)
	}
}

impl Add for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn add(self, other: Self) -> Self::Output {
		c_i64(self.x + other.x, self.y + other.y)
	}
}

impl Add for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn add(self, other: Self) -> Self::Output {
		c_i128(self.x + other.x, self.y + other.y)
	}
}

impl Add<&Self> for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn add(self, other: &Self) -> Self::Output {
		c_f64(self.x + other.x, self.y + other.y)
	}
}

impl Add<&Self> for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn add(self, other: &Self) -> Self::Output {
		c_i32(self.x + other.x, self.y + other.y)
	}
}

impl Add<&Self> for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn add(self, other: &Self) -> Self::Output {
		c_i64(self.x + other.x, self.y + other.y)
	}
}

impl Add<&Self> for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn add(self, other: &Self) -> Self::Output {
		c_i128(self.x + other.x, self.y + other.y)
	}
}

impl Sub for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn sub(self, other: Self) -> Self::Output {
		c_f64(self.x - other.x, self.y - other.y)
	}
}

impl Sub for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn sub(self, other: Self) -> Self::Output {
		c_i32(self.x - other.x, self.y - other.y)
	}
}

impl Sub for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn sub(self, other: Self) -> Self::Output {
		c_i64(self.x - other.x, self.y - other.y)
	}
}

impl Sub for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn sub(self, other: Self) -> Self::Output {
		c_i128(self.x - other.x, self.y - other.y)
	}
}

impl Sub<&Self> for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn sub(self, other: &Self) -> Self::Output {
		c_f64(self.x - other.x, self.y - other.y)
	}
}

impl Sub<&Self> for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn sub(self, other: &Self) -> Self::Output {
		c_i32(self.x - other.x, self.y - other.y)
	}
}

impl Sub<&Self> for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn sub(self, other: &Self) -> Self::Output {
		c_i64(self.x - other.x, self.y - other.y)
	}
}

impl Sub<&Self> for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn sub(self, other: &Self) -> Self::Output {
		c_i128(self.x - other.x, self.y - other.y)
	}
}

impl Mul for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn mul(self, other: Self) -> Self::Output {
		c_f64(self.x * other.x, self.y * other.y)
	}
}

impl Mul for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn mul(self, other: Self) -> Self::Output {
		c_i32(self.x * other.x, self.y * other.y)
	}
}

impl Mul for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn mul(self, other: Self) -> Self::Output {
		c_i64(self.x * other.x, self.y * other.y)
	}
}

impl Mul for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn mul(self, other: Self) -> Self::Output {
		c_i128(self.x * other.x, self.y * other.y)
	}
}

impl Mul<f64> for OrderedCoordinateF64 {

	type Output = OrderedCoordinateF64;

	#[inline]
	fn mul(self, scale: f64) -> Self::Output {
		c_f64(self.x * scale, self.y * scale)
	}
}

impl Mul<i32> for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn mul(self, scale: i32) -> Self::Output {
		c_i32(self.x * scale, self.y * scale)
	}
}

impl Mul<i64> for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn mul(self, scale: i64) -> Self::Output {
		c_i64(self.x * scale, self.y * scale)
	}
}


impl Mul<i128> for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn mul(self, scale: i128) -> Self::Output {
		c_i128(self.x * scale, self.y * scale)
	}
}

impl Div for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn div(self, other: Self) -> Self::Output {
		c_f64(self.x / other.x, self.y / other.y)
	}
}

impl Div for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn div(self, other: Self) -> Self::Output {
		let div_x = self.x.div_euclid(other.x);
		let rem_x = self.x.rem_euclid(other.x);
		let cmp_x = self.x.div_euclid(2);
		let x = if rem_x >= cmp_x { div_x + 1 } else { div_x };

		let div_y = self.y.div_euclid(other.y);
		let rem_y = self.y.rem_euclid(other.y);
		let cmp_y = self.y.div_euclid(2);
		let y = if rem_y >= cmp_y { div_y + 1 } else { div_y };

		c_i32(x, y)
	}
}

impl Div for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn div(self, other: Self) -> Self::Output {
		let div_x = self.x.div_euclid(other.x);
		let rem_x = self.x.rem_euclid(other.x);
		let cmp_x = self.x.div_euclid(2);
		let x = if rem_x >= cmp_x { div_x + 1 } else { div_x };

		let div_y = self.y.div_euclid(other.y);
		let rem_y = self.y.rem_euclid(other.y);
		let cmp_y = self.y.div_euclid(2);
		let y = if rem_y >= cmp_y { div_y + 1 } else { div_y };

		c_i64(x, y)
	}
}

impl Div for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn div(self, other: Self) -> Self::Output {
		let div_x = self.x.div_euclid(other.x);
		let rem_x = self.x.rem_euclid(other.x);
		let cmp_x = self.x.div_euclid(2);
		let x = if rem_x >= cmp_x { div_x + 1 } else { div_x };

		let div_y = self.y.div_euclid(other.y);
		let rem_y = self.y.rem_euclid(other.y);
		let cmp_y = self.y.div_euclid(2);
		let y = if rem_y >= cmp_y { div_y + 1 } else { div_y };

		c_i128(x, y)
	}
}

impl Div<f64> for OrderedCoordinateF64 {
	type Output = OrderedCoordinateF64;

	#[inline]
	fn div(self, scale: f64) -> Self::Output {
		c_f64(self.x / scale, self.y / scale)
	}
}

/// Rounds to nearest integer when dividing
impl Div<i32> for OrderedCoordinateI32 {
	type Output = OrderedCoordinateI32;

	#[inline]
	fn div(self, scale: i32) -> Self::Output {
		let div_x = self.x.div_euclid(scale);
		let rem_x = self.x.rem_euclid(scale);
		let cmp_x = self.x.div_euclid(2);
		let x = if rem_x >= cmp_x { div_x + 1 } else { div_x };

		let div_y = self.y.div_euclid(scale);
		let rem_y = self.y.rem_euclid(scale);
		let cmp_y = self.y.div_euclid(2);
		let y = if rem_y >= cmp_y { div_y + 1 } else { div_y };

		c_i32(x, y)
	}
}

/// Rounds to nearest integer when dividing
impl Div<i64> for OrderedCoordinateI64 {
	type Output = OrderedCoordinateI64;

	#[inline]
	fn div(self, scale: i64) -> Self::Output {
		let div_x = self.x.div_euclid(scale);
		let rem_x = self.x.rem_euclid(scale);
		let cmp_x = self.x.div_euclid(2);
		let x = if rem_x >= cmp_x { div_x + 1 } else { div_x };

		let div_y = self.y.div_euclid(scale);
		let rem_y = self.y.rem_euclid(scale);
		let cmp_y = self.y.div_euclid(2);
		let y = if rem_y >= cmp_y { div_y + 1 } else { div_y };

		c_i64(x, y)
	}
}

/// Rounds to nearest integer when dividing
impl Div<i128> for OrderedCoordinateI128 {
	type Output = OrderedCoordinateI128;

	#[inline]
	fn div(self, scale: i128) -> Self::Output {
		let div_x = self.x.div_euclid(scale);
		let rem_x = self.x.rem_euclid(scale);
		let cmp_x = self.x.div_euclid(2);
		let x = if rem_x >= cmp_x { div_x + 1 } else { div_x };

		let div_y = self.y.div_euclid(scale);
		let rem_y = self.y.rem_euclid(scale);
		let cmp_y = self.y.div_euclid(2);
		let y = if rem_y >= cmp_y { div_y + 1 } else { div_y };

		c_i128(x, y)
	}
}

impl From<OrderedCoordinateI32> for OrderedCoordinateF64 {
	fn from(c: OrderedCoordinateI32) -> Self {
		c_f64(c.x as f64, c.y as f64)
	}
}

impl From<OrderedCoordinateI32> for OrderedCoordinateI128 {
	fn from(c: OrderedCoordinateI32) -> Self {
		c_i128(c.x as i128, c.y as i128)
	}
}

impl From<OrderedCoordinateI32> for OrderedCoordinateI64 {
	fn from(c: OrderedCoordinateI32) -> Self {
		c_i64(c.x as i64, c.y as i64)
	}
}

impl From<OrderedCoordinateI64> for OrderedCoordinateI128 {
	fn from(c: OrderedCoordinateI64) -> Self {
		c_i128(c.x as i128, c.y as i128)
	}
}

impl From<&OrderedCoordinateI32> for OrderedCoordinateI128 {
	fn from(c: &OrderedCoordinateI32) -> Self {
		c_i128(c.x as i128, c.y as i128)
	}
}

impl From<&OrderedCoordinateI32> for OrderedCoordinateI64 {
	fn from(c: &OrderedCoordinateI32) -> Self {
		c_i64(c.x as i64, c.y as i64)
	}
}

impl From<OrderedCoordinateF64> for OrderedCoordinateI32 {
	fn from(c: OrderedCoordinateF64) -> Self {
		c_i32(cast(c.x).unwrap(), cast(c.y).unwrap())
	}
}

impl From<OrderedCoordinateI128> for OrderedCoordinateF64 {
	fn from(c: OrderedCoordinateI128) -> Self {
		c_f64(cast(c.x).unwrap(), cast(c.y).unwrap())
	}
}

impl From<OrderedCoordinateI64> for OrderedCoordinateF64 {
	fn from(c: OrderedCoordinateI64) -> Self {
		c_f64(cast(c.x).unwrap(), cast(c.y).unwrap())
	}
}

/*
Using T for different types is possible, but it is very difficult to handle integer overflow.
If passed i32, it is possible to overflow with the subtraction or multiplication.
(More likely when calculating intersections, but..)
Cannot just use check overflow functions b/c they are not implemented for floats.

Instead, implement an orientation trait and switch on different coordinate types.
https://stackoverflow.com/questions/56100579/how-do-i-match-on-the-concrete-type-of-a-generic-parameter
*/

// compare to impl functions
// no diff
// pub fn orient2d_f64(a: Coordinate<f64>, b: Coordinate<f64>, c: Coordinate<f64>) -> Orientation {
// 	let dac = a - c;
// 	let dbc = b - c;
// 	let right = dac.y * dbc.x;
// 	let left = dac.x * dbc.y;
// 	if right > left {
// 		Orientation::CounterClockwise
// 	} else if right < left {
// 		Orientation::Clockwise
// 	} else {
// 		Orientation::Collinear
// 	}
// }


// pub trait SimpleOrient<B = Self, C = Self> {
// 	fn orient2d(self, b: B, c: C) -> Orientation;
// }
//
// impl SimpleOrient for Coordinate<f64> {
// 	#[inline]
// 	fn orient2d(self, b: Self, c: Self) -> Orientation {
// 		let dac = self - c;
// 		let dbc = b - c;
//      	let right = dac.y * dbc.x;
//      	let left = dac.x * dbc.y;
//      	if right > left {
//      		Orientation::CounterClockwise
//      	} else if right < left {
//      		Orientation::Clockwise
//      	} else {
//      		Orientation::Collinear
//      	}
// 	}
// }
//
// impl SimpleOrient for Coordinate<i128> {
// 	// assumes the actual numbers do not exceed i32
// 	#[inline]
// 	fn orient2d(self, b: Self, c: Self) -> Orientation {
// 		let (ax, ay) = self.x_y();
// 		let (bx, by) = b.x_y();
// 		let (cx, cy) = c.x_y();
//
// 		let res = (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);
// 		if res > 0 {
// 			Orientation::CounterClockwise
// 		} else if res < 0 {
// 			Orientation::Clockwise
// 		} else {
// 			Orientation::Collinear
// 		}
// 	}
// }
//
//
// impl SimpleOrient for Coordinate<i32> {
// 	#[inline]
// 	fn orient2d(self, b: Self, c: Self) -> Orientation {
// 		// our choices are try w/o conversion using overflow checks or
// 		// convert upfront to i64.
// 		let (ax, ay) = self.x_y();
// 		let (bx, by) = b.x_y();
// 		let (cx, cy) = c.x_y();
//
// 		// TO-DO: Any faster or better alternative to i128?
// 		// jumping from i32 to i128 is quite limiting
// 		// Orient = ~ area of triangle * 2, which maximum size can exceed i64.
// 		// (consider three corner points of a canvas)
// 		// ax, ay: MIN, MIN
// 		// bx, by: MAX, MIN
// 		// cx, cy: MAX, MAX
// 		// maximum area of canvas is ( 2^32 - (- 2^32) ) ^2 ~ 2^33 * 2^33 = 2^66
// 		// 2^2 + 2^2 = 8 = 2^3
// 		// 2^1 + 2^3 = 10 ~ 2^4 <-- increase maximum exponent by one for approx addition
// 		//
// 		// (assume MAX - MAX is actually 1)
// 		//
//
// 		// to make an overflow calculation work, would have to track sign correctly
// 		// Hypothesis: Could keep i32 if the result can be tested for sign...
// // 		let d1 = ay.overflowing_sub(cy).0;
// // 		let d2 = bx.overflowing_sub(cx).0;
// // 		let d3 = ax.overflowing_sub(cx).0;
// // 		let d4 = by.overflowing_sub(cy).0;
// //
// // 		let left = d1.overflowing_mul(d2).0;
// // 		let right = d3.overflowing_mul(d4).0;
// // 		let res = left.saturating_sub(right);
//
// 		// following works fine, but is slow to do the conversion
// // 		without the up-conversion, orient2d fails on very large/small coordinates
// 		let (ax, ay) = (ax as i128, ay as i128);
// 		let (bx, by) = (bx as i128, by as i128);
// 		let (cx, cy) = (cx as i128, cy as i128);
// //
// // 		// right/left version appears slower, perhaps b/c
// // 		// integer compare to 0 is fast or b/c res calc is streamlined
// 		let res = (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);
// 		if res > 0 {
// 			Orientation::CounterClockwise
// 		} else if res < 0 {
// 			Orientation::Clockwise
// 		} else {
// 			Orientation::Collinear
// 		}
// 	}
// }
//
// impl SimpleOrient for Coordinate<i16> {
// 	#[inline]
// 	fn orient2d(self, b: Self, c: Self) -> Orientation {
// 		let (ax, ay) = self.x_y();
// 		let (bx, by) = b.x_y();
// 		let (cx, cy) = c.x_y();
//
// 		let (ax, ay) = (ax as i64, ay as i64);
// 		let (bx, by) = (bx as i64, by as i64);
// 		let (cx, cy) = (cx as i64, cy as i64);
// 		let res = (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);
//
// 		if res > 0 {
// 			Orientation::CounterClockwise
// 		} else if res < 0 {
// 			Orientation::Clockwise
// 		} else {
// 			Orientation::Collinear
// 		}
// 	}
// }
//
// impl SimpleOrient for Coordinate<i64> {
// 	#[inline]
// 	fn orient2d(self, b: Self, c: Self) -> Orientation {
// 		let (ax, ay) = self.x_y();
// 		let (bx, by) = b.x_y();
// 		let (cx, cy) = c.x_y();
//
// 		let d1 = ay.overflowing_sub(cy).0;
// 		let d2 = bx.overflowing_sub(cx).0;
// 		let d3 = ax.overflowing_sub(cx).0;
// 		let d4 = by.overflowing_sub(cy).0;
//
// 		let left = d1.overflowing_mul(d2).0;
// 		let right = d3.overflowing_mul(d4).0;
// 		let res = left.saturating_sub(right);
//
// 		if res > 0 {
// 			Orientation::CounterClockwise
// 		} else if res < 0 {
// 			Orientation::Clockwise
// 		} else {
// 			Orientation::Collinear
// 		}
// 	}
// }
//
//
// #[cfg(test)]
// mod tests {
// 	use super::*;
//
// // ---------------- ORIENTATION
// 	#[test]
// 	fn orient_point_int16_works() {
// 		let p1: Coordinate<i16> = Coordinate { x:0, y:0 };
// 		let p2: Coordinate<i16> = Coordinate { x:1, y:1 };
// 		let p3: Coordinate<i16> = Coordinate { x:0, y:1 }; // cw
// 		let p4: Coordinate<i16> = Coordinate { x:1, y:0 }; // ccw
// 		let p5: Coordinate<i16> = Coordinate { x:2, y:2 }; // collinear
//
// 		assert_eq!(p1.orient2d(p2, p3), Orientation::Clockwise);
// 		assert_eq!(p1.orient2d(p2, p4), Orientation::CounterClockwise);
// 		assert_eq!(p1.orient2d(p2, p5), Orientation::Collinear);
// 	}
//
// 	#[test]
// 	fn orient_point_int32_works() {
// 		let p1: Coordinate<i32> = Coordinate { x:0, y:0 };
// 		let p2: Coordinate<i32> = Coordinate { x:1, y:1 };
// 		let p3: Coordinate<i32> = Coordinate { x:0, y:1 }; // cw
// 		let p4: Coordinate<i32> = Coordinate { x:1, y:0 }; // ccw
// 		let p5: Coordinate<i32> = Coordinate { x:2, y:2 }; // collinear
//
// 		assert_eq!(p1.orient2d(p2, p3), Orientation::Clockwise);
// 		assert_eq!(p1.orient2d(p2, p4), Orientation::CounterClockwise);
// 		assert_eq!(p1.orient2d(p2, p5), Orientation::Collinear);
// 	}
//
// 	#[test]
// 	fn orient_point_int64_works() {
// 		let p1: Coordinate<i64> = Coordinate { x:0, y:0 };
// 		let p2: Coordinate<i64> = Coordinate { x:1, y:1 };
// 		let p3: Coordinate<i64> = Coordinate { x:0, y:1 }; // cw
// 		let p4: Coordinate<i64> = Coordinate { x:1, y:0 }; // ccw
// 		let p5: Coordinate<i64> = Coordinate { x:2, y:2 }; // collinear
//
// 		assert_eq!(p1.orient2d(p2, p3), Orientation::Clockwise);
// 		assert_eq!(p1.orient2d(p2, p4), Orientation::CounterClockwise);
// 		assert_eq!(p1.orient2d(p2, p5), Orientation::Collinear);
// 	}
//
// 	#[test]
// 	fn orient_point_float64_works() {
// 		let p1: Coordinate<f64> = Coordinate { x:0., y:0. };
// 		let p2: Coordinate<f64> = Coordinate { x:1., y:1. };
// 		let p3: Coordinate<f64> = Coordinate { x:0., y:1. }; // cw
// 		let p4: Coordinate<f64> = Coordinate { x:1., y:0. }; // ccw
// 		let p5: Coordinate<f64> = Coordinate { x:2., y:2. }; // collinear
//
// 		assert_eq!(p1.orient2d(p2, p3), Orientation::Clockwise);
// 		assert_eq!(p1.orient2d(p2, p4), Orientation::CounterClockwise);
// 		assert_eq!(p1.orient2d(p2, p5), Orientation::Collinear);
// 	}
//
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
// }
