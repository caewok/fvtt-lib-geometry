use geo::{CoordNum, Point, Coordinate};
use geo::algorithm::kernels::Orientation;
use crate::point::{SimpleOrient, GenerateRandom};
use std::cmp::Ordering;
use num_traits::{Num};
// use num_traits::identities::Zero;
use rand::prelude::Distribution;
use rand::distributions::Standard;
use rand::distributions::uniform::SampleUniform;
use geo::Line;
// use rug::{ Assign, Integer }; // rug dependency does not compile under aarch
use wasm_bindgen::prelude::*;

// Trait for NW to SE Ordering
pub trait NWSEOrdering {
	// partial_cmp means one object is at least partially to the nw
	fn partial_nw(&self, other: &Self) -> Ordering;

	// is_nw means self is entirely nw of the other
	fn is_nw(&self, other: &Self) -> bool;

	// is_se means self is entirely se of the other
	fn is_se(&self, other: &Self) -> bool;
}

impl<T> NWSEOrdering for Coordinate<T>
	where T: CoordNum,
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		let (ax, ay) = self.x_y();
		let (bx, by) = other.x_y();

		if ax == bx {
			if ay == by {
				Ordering::Equal
			} else if ay < by  {
				Ordering::Less
			} else {
				Ordering::Greater
			}
		} else if ax < bx {
			Ordering::Less

		} else {
			Ordering::Greater
		}
	}

	fn is_nw(&self, other: &Self) -> bool {
		// for Coordinates, they are either completely to the left or not at all
		self.partial_nw(other) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		self.partial_nw(other) == Ordering::Greater
	}
}




// Create a simple struct for an ordered Line, where a is ne of b
// Provide a method to order the struct but don't order on creation
// Keep all same types for start, end, and index so that
// union can be used to switch it with an array

#[wasm_bindgen]
#[derive(Debug, Copy, Clone)] // need Copy for the Union
// #[derive(Debug, Clone)] // just to see how far we can get without copying
pub struct OrderedSegment<T>
	where T: CoordNum + Num,
{
	pub start: Coordinate<T>,
	pub end: Coordinate<T>,
	pub idx: T, // needed to easily track intersections
}


impl<T> OrderedSegment<T>
	where T: CoordNum,
{
	pub fn new(start: Coordinate<T>, end: Coordinate<T>) -> OrderedSegment<T>
	{
		Self { start, end, idx: T::zero() }
	}

	pub fn new_with_idx(start: Coordinate<T>, end: Coordinate<T>, idx: T) -> OrderedSegment<T>
	{
		Self { start, end, idx }
	}

	pub fn new_reorder(start: Coordinate<T>, end: Coordinate<T>) -> OrderedSegment<T>
	{
		let order = start.partial_nw(&end);
		let (start, end) = match order {
			Ordering::Greater => (end, start),
			Ordering::Less => (start, end),
			Ordering::Equal => (start, end),
		};

		Self { start, end, idx: T::zero() }
	}

	pub fn new_reorder_with_index(start: Coordinate<T>, end: Coordinate<T>, idx: T) -> OrderedSegment<T>
	{
		let order = start.partial_nw(&end);
		let (start, end) = match order {
			Ordering::Greater => (end, start),
			Ordering::Less => (start, end),
			Ordering::Equal => (start, end),
		};

		Self { start, end, idx }
	}

	pub fn reorder(&mut self) {
		let order = self.start.partial_nw(&self.end);
		if order == Ordering::Greater {
			let old_start = self.start;
			self.start = self.end.into();
			self.end = old_start.into();
		};
	}

	// difference in coordinates (∆x, ∆y)
	pub fn delta(&self) -> Coordinate<T> {
		self.end - self.start
	}

	// change in 'x' component
	pub fn dx(&self) -> T {
		self.end.x - self.start.x
	}

	// change in 'y' component
	pub fn dy(&self) -> T {
		self.end.y - self.start.y
	}

	pub fn start_point(&self) -> Point<T> {
		Point(self.start)
	}

	pub fn end_point(&self) -> Point<T> {
		Point(self.end)
	}

	pub fn points(&self) -> (Point<T>, Point<T>) {
		(self.start_point(), self.end_point())
	}

	pub fn coordinates(&self) -> (Coordinate<T>, Coordinate<T>) {
		(self.start, self.end)
	}

	pub fn coords(&self) -> (T, T, T, T) {
		(self.start.x, self.start.y, self.end.x, self.end.y)
	}

}

impl<T> NWSEOrdering for OrderedSegment<T>
	where T: CoordNum
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		self.start.partial_nw(&other.start)
	}

	fn is_nw(&self, other: &Self) -> bool {
		// Self is nw if its end point is nw of the other's start point
		self.end.partial_nw(&other.start) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		// Self is se if its start point is se of the other's end point
		self.start.partial_nw(&other.end) == Ordering::Greater
	}
}

// impl<T> PartialOrd for OrderedSegment<T>
// 	where T: CoordNum,
// {
// 	fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
// 		Some(OrderedSegment::compare_xy(self.start, other.start))
// 	}
// }

impl<T> PartialEq for OrderedSegment<T>
	where T: CoordNum,
{
	fn eq(&self, other: &Self) -> bool {
		self.start == other.start && self.end == other.end
	}
}

impl From<OrderedSegment<f64>> for OrderedSegment<i64> {
	fn from(item: OrderedSegment<f64>) -> Self {
		let (ax, ay, bx, by) = item.coords();
		Self::new((ax.round() as i64, ay.round() as i64).into(),
		          (bx.round() as i64, by.round() as i64).into())
	}
}

impl From<OrderedSegment<i64>> for OrderedSegment<f64> {
	fn from(item: OrderedSegment<i64>) -> Self {
		let (ax, ay, bx, by) = item.coords();
		Self::new((ax as f64, ay as f64).into(), (bx as f64, by as f64).into())
	}
}

impl From<OrderedSegment<i16>> for OrderedSegment<f64> {
	fn from(item: OrderedSegment<i16>) -> Self {
		let (ax, ay, bx, by) = item.coords();
		Self::new((ax as f64, ay as f64).into(), (bx as f64, by as f64).into())
	}
}

impl From<OrderedSegment<f64>> for OrderedSegment<i32> {
	fn from(item: OrderedSegment<f64>) -> Self {
		let (ax, ay, bx, by) = item.coords();
		Self::new((ax.round() as i32, ay.round() as i32).into(),
		          (bx.round() as i32, by.round() as i32).into())
	}
}

impl From<OrderedSegment<i32>> for OrderedSegment<f64> {
	fn from(item: OrderedSegment<i32>) -> Self {
		let (ax, ay, bx, by) = item.coords();
		Self::new((ax as f64, ay as f64).into(), (bx as f64, by as f64).into())
	}
}

impl From<Line<f64>> for OrderedSegment<f64> {
	fn from(item: Line<f64>) -> Self {
		let (ax, ay) = item.start.x_y();
		let (bx, by) = item.end.x_y();
		Self::new((ax, ay).into(), (bx, by).into())
 	}
}

impl From<OrderedSegment<f64>> for Line<f64> {
	fn from(item: OrderedSegment<f64>) -> Self {
		let (ax, ay, bx, by) = item.coords();
		Self::new((ax, ay), (bx, by))
 	}
}

impl<T> GenerateRandom for OrderedSegment<T>
	where T: CoordNum + SampleUniform, Standard: Distribution<T>,
{
	type MaxType = T;

	fn random() -> Self {
		Self::new(Coordinate::random(), Coordinate::random())
	}

	fn random_range(min: T, max: T) -> Self {
		Self::new(Coordinate::random_range(min, max), Coordinate::random_range(min, max))
	}

	fn random_pos(max: T) -> Self {
		Self::new(Coordinate::random_pos(max), Coordinate::random_pos(max))
	}
}



pub trait SimpleIntersect<B = Self> {
	fn intersects(&self, other: &B) -> bool;
	fn line_intersection(&self, other: &B) -> Option<Coordinate<f64>>;
}

// all intersects are the same but we have not implemented orient2d for all,
// so just repeat for now
impl SimpleIntersect for OrderedSegment<f64> {
	fn intersects(&self, other: &Self) -> bool {
		let (a, b) = self.coordinates();
		let (c, d) = other.coordinates();

		let xa = a.orient2d(b, c);
		let xb = a.orient2d(b, d);

		// may intersect in an overlapping line or not intersect at all
		if xa == Orientation::Collinear && xb == Orientation::Collinear { return false; }

		let xc = c.orient2d(d, a);
		let xd = c.orient2d(d, b);

		if xa != xb && xc != xd { return true; }

		false
	}

	fn line_intersection(&self, other: &Self) -> Option<Coordinate<f64>> {
// 		let (ax, ay, bx, by) = self.coords();
// 		let (cx, cy, dx, dy) = other.coords();
// 		println!("\nintersecting {},{}|{},{} x {},{}|{},{}", ax, ay, bx, by, cx, cy, dx, dy);


		let d1 = self.delta();
		let d2 = other.delta();

		let x_dnm = d1.y * d2.x - d2.y * d1.x;
		if x_dnm == 0. { return None; }

		let y_dnm = d1.x * d2.y - d2.x * d1.y;
		if y_dnm == 0. { return None; }

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

		let ratio_x = x_num / x_dnm;
		let ratio_y = y_num / y_dnm;

		Some(Coordinate { x: ratio_x, y: ratio_y })
	}
}

impl SimpleIntersect for OrderedSegment<i16> {
	#[inline]
	fn intersects(&self, other: &Self) -> bool {

		// moving to i128 here does nothing helpful to performance
		let (a, b) = self.coordinates();
		let (c, d) = other.coordinates();

		let xa = a.orient2d(b, c);
		let xb = a.orient2d(b, d);

		// may intersect in an overlapping line or not intersect at all
		if xa == Orientation::Collinear && xb == Orientation::Collinear { return false; }

		let xc = c.orient2d(d, a);
		let xd = c.orient2d(d, b);

		if xa != xb && xc != xd { return true; }

		false
	}

	#[inline]
	fn line_intersection(&self, other: &Self) -> Option<Coordinate<f64>> {
		let (ax, ay, bx, by) = self.coords();
		let (cx, cy, dx, dy) = other.coords();

		// need to upconvert b/c it is easy to overflow with all the multiplication below
		let (ax, ay) = (ax as i64, ay as i64);
		let (bx, by) = (bx as i64, by as i64);
		let (cx, cy) = (cx as i64, cy as i64);
		let (dx, dy) = (dx as i64, dy as i64);

		let d1x = bx - ax;
		let d1y = by - ay;
		let d2x = dx - cx;
		let d2y = dy - cy;

		let x_dnm = d1y * d2x - d2y * d1x;
		if x_dnm == 0 { return None; }

		let y_dnm = d1x * d2y - d2x * d1y;
		if y_dnm == 0 { return None; }

		let x_num = ax * d1y * d2x - cx * d2y * d1x + cy * d1x * d2x - ay * d1x * d2x;
		let y_num = ay * d1x * d2y - cy * d2x * d1y + cx * d1y * d2y - ax * d1y * d2y;

		// euclid vs division of float: both are basically same for performance
		let quot_x = x_num.div_euclid(x_dnm);
		let rem_x = x_num.rem_euclid(x_dnm);
		let ratio_x = (quot_x as f64) + (rem_x as f64 / x_dnm as f64);

		let quot_y = y_num.div_euclid(y_dnm);
		let rem_y = y_num.rem_euclid(y_dnm);
		let ratio_y = (quot_y as f64) + (rem_y as f64 / y_dnm as f64);


		Some(Coordinate { x: ratio_x, y: ratio_y })
	}
}

impl SimpleIntersect for OrderedSegment<i32> {
	#[inline]
	fn intersects(&self, other: &Self) -> bool {

		// moving to i128 here does nothing helpful to performance
		let (a, b) = self.coordinates();
// 		let (a, b): (Coordinate<i128>, Coordinate<i128>) = (Coordinate { x: a.x as i128, y: a.y as i128 },
// 		                                  Coordinate { x: b.x as i128, y: b.y as i128 });


		let (c, d) = other.coordinates();
// 		let (c, d): (Coordinate<i128>, Coordinate<i128>) = (Coordinate { x: c.x as i128, y: c.y as i128 },
// 		                                  Coordinate { x: d.x as i128, y: d.y as i128 });

		let xa = a.orient2d(b, c);
		let xb = a.orient2d(b, d);

		// may intersect in an overlapping line or not intersect at all
		if xa == Orientation::Collinear && xb == Orientation::Collinear { return false; }

		let xc = c.orient2d(d, a);
		let xd = c.orient2d(d, b);

		if xa != xb && xc != xd { return true; }

		false
	}

	#[inline]
	fn line_intersection(&self, other: &Self) -> Option<Coordinate<f64>> {
		let (ax, ay, bx, by) = self.coords();
		let (cx, cy, dx, dy) = other.coords();

		// need to upconvert b/c it is easy to overflow with all the multiplication below
		let (ax, ay) = (ax as i128, ay as i128);
		let (bx, by) = (bx as i128, by as i128);
		let (cx, cy) = (cx as i128, cy as i128);
		let (dx, dy) = (dx as i128, dy as i128);

// 		use core::num::Wrapping;
// 		let (ax, ay) = (Wrapping(ax), Wrapping(ay));
// 		let (bx, by) = (Wrapping(bx), Wrapping(by));
// 		let (cx, cy) = (Wrapping(cx), Wrapping(cy));
// 		let (dx, dy) = (Wrapping(dx), Wrapping(dy));


		// End result will be a coordinate, but with infinite lines the coordinate
		// intersection conceivably could exceed the coordinate bounds
		// but cannot be infinitely large given integer coordinates.
		// instead, the largest is if one line is along the canvas border and starts
		// at the other canvas corner and moves down to the bottom corner - 1.
		// So worst case should be:
		// s0: (MIN, MIN),(MIN, MAX)
		// s1: (MAX, MIN), (MAX - 1, MAX)
		// if this were i8:
		// s0: (-128, -128), (-128, 127)
		// s1: ( 127, -128), ( 126, 127)
		// ix: (-128, 64897, t0: 255)
		// if s0: (MIN, MIN), (MIN, MIN + 1) then t0: 65025
		// so i32 to handle the coordinates

		// But—we don't actually care about intersection locations outside the bounds,
		// so we could return the max/min in that situation
		// still need to calculate it without overflow issues!

		// switch to
		// const dnm = ((d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y));
		// const t0 = ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)) / dnm; (dist from a)
		// x: a.x + t0 * (b.x - a.x),
		// y: a.y + t0 * (b.y - a.y)

		// (assume we are unlucky and all subtractions become additions)
		// 2*MAX * 2*MAX ≈ 2^2 * 2^31 * 2^31 ≈ 2^64
		// 2^64 + 2^64 ≈ 2^1 * 2^64 ≈ 2^65 .. and now we have exceeded i64 (barely)!
		// worse, we eventually need to multiply below, so more likely to exceed t0

// 		let dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay);
// 		if dnm == 0 { return None; }

// 		dbg!(dnm);

		// dnm cannot be a fraction, so we know that t0 is the same or smaller magnitude than its numerator
		// but we are dividing, so we need to switch to float or use euclidean and then switch
// 		let num = (dx - cx) * (ay - cy) - (dy - cy) * (ax - cx);
// 		dbg!(num);

// 		let t0: f64 = (num as f64) / (dnm as f64);
// 		dbg!(t0);
//
// 		let x = ax as f64 + t0 * (bx - ax) as f64;
// 		let y = ay as f64 + t0 * (by - ay) as f64;

// 		let x = ax.saturating_add(t0.saturating_mul(bx - ax));
// 		let y = ay.saturating_add(t0.saturating_mul(by - ay));

// 		Some(Point::new(x as f64, y as f64))


		// MAX + 2^39 * (2*2^32) = not w/in i64 --> possibly over but unlikely.




// 		println!("\nintersecting {},{}|{},{} x {},{}|{},{}", ax, ay, bx, by, cx, cy, dx, dy);

		let d1x = bx - ax;
		let d1y = by - ay;
		let d2x = dx - cx;
		let d2y = dy - cy;

		let x_dnm = d1y * d2x - d2y * d1x;
		if x_dnm == 0 { return None; }

		let y_dnm = d1x * d2y - d2x * d1y;
		if y_dnm == 0 { return None; }


		// dbg!(x_dnm);
// 		dbg!(y_dnm);

		// MAX
		// d1x = 2^31 + 2^31 ≈ 2^32
		// x_num paren = (2^31 * 2^32 * 2^32) ≈ 2^95
		// x_num = 2^95 + 2^95 + 2^95 + 2^95 ≈ 2^2 * 2^95 ≈ 2^97

		// (cx * d2y + cy * d2x - ay * d2x)
		// 2^31 * 2^32 + 2^31 * 2^32 + 2^31 * 2^32 ≈ 2^63 + 2^63 + 2^63 ≈ 2^3 * 2^63 ≈ 2^66
		// 2^32 * 2^66 ≈ 2^98

		let x_num = ax * d1y * d2x - cx * d2y * d1x + cy * d1x * d2x - ay * d1x * d2x;
		let y_num = ay * d1x * d2y - cy * d2x * d1y + cx * d1y * d2y - ax * d1y * d2y;


		// d has max value of 2 * i32::MAX
		// coordinate has max value of i32::MAX
		// so a * d * d has maximum i32::MAX * 2 * i32::MAX * 2 * i32::MAX = 4 * i32::MAX ^ 3
		//

		// d1x(cx * d2y + cy * d2x - ay * d2x)
		// d1y(cx * d2x + cx * d2y - ax * d2y)
// 		let x_left = ax * d1y * d2x;
// 		let x_right_paren = cx * d2y + cy * d2x - ay * d2x;
// 		let x_right = d1x * x_right_paren;
// 		let x_num = x_left - x_right;
//
// 		let y_left = ay * d1x * d2y;
// 		let y_right_paren = cx * d2x + cx * d2y - ax * d2y;
// 		let y_right = d1y * y_right_paren;
// 		let y_num = y_left - y_right;

		// dbg!(x_num);
// 		dbg!(y_num);
// 		println!("");

		// euclid: 7 / 3 = 2 rem 1
		// convert to float: 2 + 1/3

		// euclid vs division of float: both are basically same for performance
		let quot_x = x_num.div_euclid(x_dnm);
		let rem_x = x_num.rem_euclid(x_dnm);
		let ratio_x = (quot_x as f64) + (rem_x as f64 / x_dnm as f64);

		let quot_y = y_num.div_euclid(y_dnm);
		let rem_y = y_num.rem_euclid(y_dnm);
		let ratio_y = (quot_y as f64) + (rem_y as f64 / y_dnm as f64);


// 		let ratio_x = (x_num as f64) / (x_dnm as f64);
// 		let ratio_y = (y_num as f64) / (y_dnm as f64);

		Some(Coordinate { x: ratio_x, y: ratio_y })
	}
}

impl SimpleIntersect for OrderedSegment<i64> {
	#[inline]
	fn intersects(&self, other: &Self) -> bool {
		let (a, b) = self.coordinates();
		let (c, d) = other.coordinates();

		let xa = a.orient2d(b, c);
		let xb = a.orient2d(b, d);

		// may intersect in an overlapping line or not intersect at all
		if xa == Orientation::Collinear && xb == Orientation::Collinear { return false; }

		let xc = c.orient2d(d, a);
		let xd = c.orient2d(d, b);

		if xa != xb && xc != xd { return true; }

		false
	}

	#[inline]
	fn line_intersection(&self, other: &Self) -> Option<Coordinate<f64>> {
		// use foundry.utils.lineLineIntersection method
		let (ax, ay, bx, by) = self.coords();
		let (cx, cy, dx, dy) = other.coords();

		// need to upconvert b/c it is easy to overflow with all the multiplication below
		let (ax, ay) = (ax as i128, ay as i128);
		let (bx, by) = (bx as i128, by as i128);
		let (cx, cy) = (cx as i128, cy as i128);
		let (dx, dy) = (dx as i128, dy as i128);

		let dnm = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay);
		if dnm == 0 { return None; }

		let t0 = (dx - cx) * (ay - cy) - (dy - cy) * (ax - cx);

		let quot_t = t0.div_euclid(dnm);
		let rem_t = t0.rem_euclid(dnm);
		let t0 = (quot_t as f64) + (rem_t as f64 / dnm as f64);

		let x = ax as f64 + t0 * (bx as f64 - ax as f64);
		let y = ay as f64 + t0 * (by as f64 - ax as f64);

		Some(Coordinate { x, y })
	}

	// works but is slow and rug won't compile
	// #[inline]
// 	fn line_intersection(&self, other: &Self) -> Option<Point<f64>> {
// 		let (ax, ay, bx, by) = self.coords();
// 		let (cx, cy, dx, dy) = other.coords();
//
//
// 		// Wrapping reaches the correct answer for addition, subtraction, multiplication
// 		// only if the end result is within the bounds.
// 		// hypothesis:
// 		// calculating x and y denominators could wrap all the way back to 0.
// 		// d1y * d2x - d2y * d1x
// 		// d1y, etc.: MAX - MIN = MAX or MIN (~ -MAX) are possible.
// 		// MAX * MAX - (-MAX) * MAX = MAX^2 + MAX^2 = 2 MAX ^2
//
// 		// so could check each one and do something else (what?) if saturated.
// 		// if we knew the last was saturated, we would know denom is not 0
// 		// but we would be screwed when trying to divide
//
// 		let (ax, ay, bx, by) = ( Integer::from(ax), Integer::from(ay),
// 								 Integer::from(bx), Integer::from(by) );
//
// 		let (cx, cy, dx, dy) = ( Integer::from(cx), Integer::from(cy),
// 								 Integer::from(dx), Integer::from(dy) );
//
//
// 		// https://docs.rs/rug/1.12.0/rug/index.html#incomplete-computation-values
// 		let mut d1x = Integer::new();
// 		let mut d1y = Integer::new();
// 		let mut d2x = Integer::new();
// 		let mut d2y = Integer::new();
//
// 		// need to use ax, ay, cx, cy below, so they must be borrowed here
//
// 		d1x.assign(&bx - &ax);
// 		d1y.assign(&by - &ay);
// 		d2x.assign(&dx - &cx);
// 		d2y.assign(&dy - &cy);
//
// 		let mut d1y_mult_d2x = Integer::new();
// 		let mut d1x_mult_d2y = Integer::new();
// 		let mut d2y_mult_d1x = Integer::new();
// 		let mut d2x_mult_d1y = Integer::new();
//
// 		d1y_mult_d2x.assign(&d1y * &d2x);
// 		d1x_mult_d2y.assign(&d1x * &d2y);
// 		d2y_mult_d1x.assign(&d2y * &d1x);
// 		d2x_mult_d1y.assign(&d2x * &d1y);
//
// 		let x_dnm = Integer::from(&d1y_mult_d2x - &d2y_mult_d1x);
// // 		let x_dnm = Integer::from(d1y * d2x - d2y * d1x);
// 		if x_dnm == Integer::ZERO { return None; }
//
// 		let y_dnm = Integer::from(&d1x_mult_d2y - &d2x_mult_d1y);
// // 		let y_dnm = Integer::from(d1x * d2y - d2x * d1y);
// 		if y_dnm == Integer::ZERO { return None; }
//
// 		// the rest must be done sequentially
// 		// preserve order of operation by grouping the multiplications
// 		let mut buffer1 = Integer::new();
// 		let mut buffer2 = Integer::new();
// 		let mut buffer3 = Integer::new();
// 		let mut buffer4 = Integer::new();
// 		let mut buffer5 = Integer::new();
// 		let mut buffer6 = Integer::new();
// 		let mut buffer7 = Integer::new();
// 		let mut buffer8 = Integer::new();
//
// 		buffer1.assign(&ax * &d1y_mult_d2x);
// 		let buffer1 = buffer1;
//
// 		buffer2.assign(&cx * &d2y_mult_d1x);
// 		let buffer2 = buffer2;
//
// 		buffer3.assign(&cy * &d1x);
// 		let buffer3 = buffer3;
// 		buffer4.assign(&buffer3 * &d2x);
// 		let buffer4 = buffer4;
//
// 		buffer5.assign(&ay * &d1x);
// 		let buffer5 = buffer5;
// 		buffer6.assign(&buffer5 * &d2x);
// 		let buffer6 = buffer6;
//
// 		buffer7.assign(&buffer1 - &buffer2);
// 		let buffer7 = buffer7;
//
// 		buffer8.assign(&buffer4 - &buffer6);
// 		let buffer8 = buffer8;
//
// 		let x_num = Integer::from(&buffer7 + &buffer8);
//
// 		let mut buffer1 = Integer::new();
// 		let mut buffer2 = Integer::new();
// 		let mut buffer3 = Integer::new();
// 		let mut buffer4 = Integer::new();
// 		let mut buffer5 = Integer::new();
// 		let mut buffer6 = Integer::new();
// 		let mut buffer7 = Integer::new();
// 		let mut buffer8 = Integer::new();
//
// 		buffer1.assign(&ay * &d1x_mult_d2y);
// 		let buffer1 = buffer1;
//
// 		buffer2.assign(&cy * &d2x_mult_d1y);
// 		let buffer2 = buffer2;
//
// 		buffer3.assign(&cx * &d1y);
// 		let buffer3 = buffer3;
// 		buffer4.assign(&buffer3 * &d2y);
// 		let buffer4 = buffer4;
//
// 		buffer5.assign(&ax * &d1y);
// 		let buffer5 = buffer5;
// 		buffer6.assign(&buffer5 * &d2y);
// 		let buffer6 = buffer6;
//
// 		buffer7.assign(&buffer1 - &buffer2);
// 		let buffer7 = buffer7;
//
// 		buffer8.assign(&buffer4 - &buffer6);
// 		let buffer8 = buffer8;
//
//
// 		let y_num = Integer::from(&buffer7 + & buffer8);
//
//
// // 		let x_num = Integer::from(&ax * &d1y_mult_d2x - &cx * &d2y_mult_d1x + &cy * &d1x * &d2x - &ay * &d1x * &d2x);
// // 		let y_num = Integer::from(&ay * &d1x_mult_d2y - &cy * &d2x_mult_d1y + &cx * &d1y * &d2y - &ax * &d1y * &d2y);
//
// // 		let x_num = Integer::from(&ax * d1y * d2x - &cx * d2y * d1x + &cy * d1x * d2x - &ay * d1x * d2x);
// // 		let y_num = Integer::from(&ay * d1x * d2y - &cy * d2x * d1y + &cx * d1y * d2y - &ax * d1y * d2y);
//
// 		let x_dnm_f = x_dnm.to_f64();
// 		let y_dnm_f = y_dnm.to_f64();
//
// 		let (quot_x, rem_x) = x_num.div_rem_euc(x_dnm);
// 		let ratio_x:f64 = (quot_x.to_f64()) + (rem_x.to_f64() / x_dnm_f);
//
// 		let (quot_y, rem_y) = y_num.div_rem_euc(y_dnm);
// 		let ratio_y:f64 = (quot_y.to_f64()) + (rem_y.to_f64() / y_dnm_f);
//
// 		Some(Point::new(ratio_x, ratio_y))
// 	}
}


#[cfg(test)]
mod tests {
	use super::*;

// ---------------- SEGMENT CREATION
	#[test]
	fn create_float_works() {
		let mut s: OrderedSegment<f64> = OrderedSegment::random();
		s.reorder();
		let s = s; // no further need for mutate

		let (ax, ay, bx, by) = s.coords();

		assert!(ax <= 1.);
		assert!(ay <= 1.);
		assert!(bx <= 1.);
		assert!(by <= 1.);

		assert!(ax >= 0.);
		assert!(ay >= 0.);
		assert!(bx >= 0.);
		assert!(by >= 0.);

		assert!(ax < bx || ax == bx && ay <= by);

		let (a, b) = s.points();
		let s_dupe = OrderedSegment::new(a.into(), b.into());
		assert_eq!(s, s_dupe);
	}

	#[test]
	fn create_int_works() {
		let mut s: OrderedSegment<i64> = OrderedSegment::random();
		s.reorder();
		let s = s; // no further need for mutate

		let (ax, ay, bx, by) = s.coords();
		assert!(ax < bx || ax == bx && ay <= by);

		let (a, b) = s.points();
		let s_dupe = OrderedSegment::new(a.into(), b.into());
		assert_eq!(s, s_dupe);
	}

// ---------------- SEGMENT INTERSECTS
	#[test]
	fn intersects_f64_works() {
		let s0: OrderedSegment<f64> = OrderedSegment::new((2300., 1900.).into(), (4200., 1900.).into());
		let s1: OrderedSegment<f64> = OrderedSegment::new((2387., 1350.).into(), (2500., 2100.).into());
		let s2: OrderedSegment<f64> = OrderedSegment::new((2387., 1350.).into(), (3200., 1900.).into());
		let s3: OrderedSegment<f64> = OrderedSegment::new((2500., 2100.).into(), (2900., 2100.).into());

		assert!(s0.intersects(&s1));
		assert!(s0.intersects(&s2));
		assert!(!s0.intersects(&s3));
	}

	#[test]
	fn intersects_i16_works() {
		let s0: OrderedSegment<i16> = OrderedSegment::new((2300, 1900).into(), (4200, 1900).into());
		let s1: OrderedSegment<i16> = OrderedSegment::new((2387, 1350).into(), (2500, 2100).into());
		let s2: OrderedSegment<i16> = OrderedSegment::new((2387, 1350).into(), (3200, 1900).into());
		let s3: OrderedSegment<i16> = OrderedSegment::new((2500, 2100).into(), (2900, 2100).into());

		assert!(s0.intersects(&s1));
		assert!(s0.intersects(&s2));
		assert!(!s0.intersects(&s3));
	}

	#[test]
	fn intersects_i32_works() {
		let s0: OrderedSegment<i32> = OrderedSegment::new((2300, 1900).into(), (4200, 1900).into());
		let s1: OrderedSegment<i32> = OrderedSegment::new((2387, 1350).into(), (2500, 2100).into());
		let s2: OrderedSegment<i32> = OrderedSegment::new((2387, 1350).into(), (3200, 1900).into());
		let s3: OrderedSegment<i32> = OrderedSegment::new((2500, 2100).into(), (2900, 2100).into());

		assert!(s0.intersects(&s1));
		assert!(s0.intersects(&s2));
		assert!(!s0.intersects(&s3));
	}

	#[test]
	fn intersects_i16_overflow_works() {
		let nw = (i16::MIN, i16::MIN);
		let sw = (i16::MIN, i16::MAX);
		let ne = (i16::MAX, i16::MIN);
		let se = (i16::MAX, i16::MAX);
// 		let z: (i32, i32) = (0, 0);

		let ne_sw: OrderedSegment<i16> = OrderedSegment::new(ne.into(), sw.into());
		let se_nw: OrderedSegment<i16> = OrderedSegment::new(se.into(), nw.into());
		let ne_nw: OrderedSegment<i16> = OrderedSegment::new(ne.into(), nw.into());
		let se_sw: OrderedSegment<i16> = OrderedSegment::new(se.into(), sw.into());

		assert!(ne_sw.intersects(&se_nw));
		assert!(ne_sw.intersects(&ne_nw));
		assert!(!ne_nw.intersects(&se_sw));
	}

	#[test]
	fn intersects_i32_overflow_works() {
		let nw = (i32::MIN, i32::MIN);
		let sw = (i32::MIN, i32::MAX);
		let ne = (i32::MAX, i32::MIN);
		let se = (i32::MAX, i32::MAX);
// 		let z: (i32, i32) = (0, 0);

		let ne_sw: OrderedSegment<i32> = OrderedSegment::new(ne.into(), sw.into());
		let se_nw: OrderedSegment<i32> = OrderedSegment::new(se.into(), nw.into());
		let ne_nw: OrderedSegment<i32> = OrderedSegment::new(ne.into(), nw.into());
		let se_sw: OrderedSegment<i32> = OrderedSegment::new(se.into(), sw.into());

		assert!(ne_sw.intersects(&se_nw));
		assert!(ne_sw.intersects(&ne_nw));
		assert!(!ne_nw.intersects(&se_sw));
	}

	#[test]
	fn intersects_i64_works() {
		let s0: OrderedSegment<i64> = OrderedSegment::new((2300, 1900).into(), (4200, 1900).into());
		let s1: OrderedSegment<i64> = OrderedSegment::new((2387, 1350).into(), (2500, 2100).into());
		let s2: OrderedSegment<i64> = OrderedSegment::new((2387, 1350).into(), (3200, 1900).into());
		let s3: OrderedSegment<i64> = OrderedSegment::new((2500, 2100).into(), (2900, 2100).into());

		assert!(s0.intersects(&s1));
		assert!(s0.intersects(&s2));
		assert!(!s0.intersects(&s3));
	}

	#[test]
	fn intersects_i64_overflow_works() {
		let nw = (i64::MIN, i64::MIN);
		let sw = (i64::MIN, i64::MAX);
		let ne = (i64::MAX, i64::MIN);
		let se = (i64::MAX, i64::MAX);
// 		let z: (i32, i32) = (0, 0);

		let ne_sw: OrderedSegment<i64> = OrderedSegment::new(ne.into(), sw.into());
		let se_nw: OrderedSegment<i64> = OrderedSegment::new(se.into(), nw.into());
		let ne_nw: OrderedSegment<i64> = OrderedSegment::new(ne.into(), nw.into());
		let se_sw: OrderedSegment<i64> = OrderedSegment::new(se.into(), sw.into());

		assert!(ne_sw.intersects(&se_nw));
		assert!(ne_sw.intersects(&ne_nw));
		assert!(!ne_nw.intersects(&se_sw));
	}

	#[test]
	fn intersects_random_i16_f64_equal() {
		let max_iter = 100;

		for _ in 0..max_iter {
			// testing w/o copy, so re-construct the random values

			let s0_i = OrderedSegment::<i16>::random_range(-10000, 10000);
			let s0_f: OrderedSegment<f64> = s0_i.clone().into();

			let s1_i =  OrderedSegment::<i16>::random_range(-10000, 10000);
			let s1_f: OrderedSegment<f64> = s1_i.clone().into();

			let res_i = s0_i.intersects(&s1_i);
			let res_f = s0_f.intersects(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

	#[test]
	fn intersects_random_i32_f64_equal() {
		let max_iter = 100;

		for _ in 0..max_iter {
			let s0_i = OrderedSegment::<i32>::random_range(-10000, 10000);
			let s0_f: OrderedSegment<f64> = s0_i.clone().into();

			let s1_i =  OrderedSegment::<i32>::random_range(-10000, 10000);
			let s1_f: OrderedSegment<f64> = s1_i.clone().into();

			let res_i = s0_i.intersects(&s1_i);
			let res_f = s0_f.intersects(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

// ---------------- SEGMENT LINE INTERSECTION
	#[test]
	fn line_intersection_f64_works() {
		let s0: OrderedSegment<f64> = OrderedSegment::new((2300., 1900.).into(), (4200., 1900.).into());
		let s1: OrderedSegment<f64> = OrderedSegment::new((2387., 1350.).into(), (2500., 2100.).into());
		let s2: OrderedSegment<f64> = OrderedSegment::new((2387., 1350.).into(), (3200., 1900.).into());
		let s3: OrderedSegment<f64> = OrderedSegment::new((2500., 2100.).into(), (2900., 2100.).into());

		let res01: Coordinate<f64> = Coordinate { x: 2469.866666666667, y: 1900. }; // s0 x s1
		let res02: Coordinate<f64> = Coordinate { x: 3200., y: 1900. }; // s0 x s2
		// s0 x s3: null
		let res12: Coordinate<f64> = Coordinate { x: 2387., y: 1350. }; // s1 x s2 intersect at p2
		let res13: Coordinate<f64> = Coordinate { x: 2500., y: 2100. }; //s1 x s4 intersect
		let res23: Coordinate<f64> = Coordinate { x: 3495.6363636363635, y: 2100. };

		assert_eq!(s0.line_intersection(&s1), Some(res01));
		assert_eq!(s0.line_intersection(&s2), Some(res02));
		assert_eq!(s0.line_intersection(&s3), None);

		assert_eq!(s1.line_intersection(&s2), Some(res12));
		assert_eq!(s1.line_intersection(&s3), Some(res13));
		assert_eq!(s2.line_intersection(&s3), Some(res23));
	}

	#[test]
	fn line_intersection_i16_works() {
		let s0: OrderedSegment<i16> = OrderedSegment::new((2300, 1900).into(), (4200, 1900).into());
		let s1: OrderedSegment<i16> = OrderedSegment::new((2387, 1350).into(), (2500, 2100).into());
		let s2: OrderedSegment<i16> = OrderedSegment::new((2387, 1350).into(), (3200, 1900).into());
		let s3: OrderedSegment<i16> = OrderedSegment::new((2500, 2100).into(), (2900, 2100).into());

		let res01: Coordinate<f64> = Coordinate { x: 2469.866666666667, y: 1900. }; // s0 x s1
		let res02: Coordinate<f64> = Coordinate { x: 3200., y: 1900. }; // s0 x s2
		// s0 x s3: null
		let res12: Coordinate<f64> = Coordinate { x: 2387., y: 1350. }; // s1 x s2 intersect at p2
		let res13: Coordinate<f64> = Coordinate { x: 2500., y: 2100. }; //s1 x s4 intersect
		let res23: Coordinate<f64> = Coordinate { x: 3495.6363636363635, y: 2100. };

		assert_eq!(s0.line_intersection(&s1), Some(res01));
		assert_eq!(s0.line_intersection(&s2), Some(res02));
		assert_eq!(s0.line_intersection(&s3), None);

		assert_eq!(s1.line_intersection(&s2), Some(res12));
		assert_eq!(s1.line_intersection(&s3), Some(res13));
		assert_eq!(s2.line_intersection(&s3), Some(res23));
	}


	#[test]
	fn line_intersection_i16_overflow_works() {
		let nw = (i16::MIN, i16::MIN);
		let sw = (i16::MIN, i16::MAX);
		let ne = (i16::MAX, i16::MIN);
		let se = (i16::MAX, i16::MAX);
// 		let z: (i32, i32) = (0, 0);

		let ne_sw: OrderedSegment<i16> = OrderedSegment::new(ne.into(), sw.into());
		let se_nw: OrderedSegment<i16> = OrderedSegment::new(se.into(), nw.into());
		let ne_nw: OrderedSegment<i16> = OrderedSegment::new(ne.into(), nw.into());
		let se_sw: OrderedSegment<i16> = OrderedSegment::new(se.into(), sw.into());

		let res1: Coordinate::<f64> = Coordinate { x: -0.5, y: -0.5 };
		let res2: Coordinate::<f64> = Coordinate { x: i16::MAX.into(), y: i16::MIN.into() };

		assert_eq!(ne_sw.line_intersection(&se_nw), Some(res1));
		assert_eq!(ne_sw.line_intersection(&ne_nw), Some(res2));
		assert_eq!(ne_nw.line_intersection(&se_sw), None);
	}

	#[test]
	fn line_intersection_i16_overflow_severe_works() {

		// s0: (MIN, MIN),(MIN, MAX)
		// s1: (MAX, MIN), (MAX - 1, MAX)
		let vert: OrderedSegment<i16> = OrderedSegment::new((i16::MIN, i16::MIN).into(), (i16::MIN, i16::MAX).into());
		let near_horiz: OrderedSegment<i16> = OrderedSegment::new((i16::MAX, i16::MIN).into(), (i16::MAX - 1, i16::MAX).into());

		let res1: Coordinate::<f64> = Coordinate { x: -32768., y: 4294803457. };

		assert_eq!(vert.line_intersection(&near_horiz), Some(res1));
	}


	#[test]
	fn line_intersection_i32_works() {
		let s0: OrderedSegment<i32> = OrderedSegment::new((2300, 1900).into(), (4200, 1900).into());
		let s1: OrderedSegment<i32> = OrderedSegment::new((2387, 1350).into(), (2500, 2100).into());
		let s2: OrderedSegment<i32> = OrderedSegment::new((2387, 1350).into(), (3200, 1900).into());
		let s3: OrderedSegment<i32> = OrderedSegment::new((2500, 2100).into(), (2900, 2100).into());

		let res01: Coordinate<f64> = Coordinate { x: 2469.866666666667, y: 1900. }; // s0 x s1
		let res02: Coordinate<f64> = Coordinate { x: 3200., y: 1900. }; // s0 x s2
		// s0 x s3: null
		let res12: Coordinate<f64> = Coordinate { x: 2387., y: 1350. }; // s1 x s2 intersect at p2
		let res13: Coordinate<f64> = Coordinate { x: 2500., y: 2100. }; //s1 x s4 intersect
		let res23: Coordinate<f64> = Coordinate { x: 3495.6363636363635, y: 2100. };

		assert_eq!(s0.line_intersection(&s1), Some(res01));
		assert_eq!(s0.line_intersection(&s2), Some(res02));
		assert_eq!(s0.line_intersection(&s3), None);

		assert_eq!(s1.line_intersection(&s2), Some(res12));
		assert_eq!(s1.line_intersection(&s3), Some(res13));
		assert_eq!(s2.line_intersection(&s3), Some(res23));
	}


	#[test]
	fn line_intersection_i32_overflow_works() {
		let nw = (i32::MIN, i32::MIN);
		let sw = (i32::MIN, i32::MAX);
		let ne = (i32::MAX, i32::MIN);
		let se = (i32::MAX, i32::MAX);
// 		let z: (i32, i32) = (0, 0);

		let ne_sw: OrderedSegment<i32> = OrderedSegment::new(ne.into(), sw.into());
		let se_nw: OrderedSegment<i32> = OrderedSegment::new(se.into(), nw.into());
		let ne_nw: OrderedSegment<i32> = OrderedSegment::new(ne.into(), nw.into());
		let se_sw: OrderedSegment<i32> = OrderedSegment::new(se.into(), sw.into());

		let res1: Coordinate::<f64> = Coordinate { x: -0.5, y: -0.5 };
		let res2: Coordinate::<f64> = Coordinate { x: i32::MAX.into(), y: i32::MIN.into() };

		assert_eq!(ne_sw.line_intersection(&se_nw), Some(res1));
		assert_eq!(ne_sw.line_intersection(&ne_nw), Some(res2));
		assert_eq!(ne_nw.line_intersection(&se_sw), None);
	}

	#[test]
	fn line_intersection_i32_overflow_severe_works() {

		// s0: (MIN, MIN),(MIN, MAX)
		// s1: (MAX, MIN), (MAX - 1, MAX)
		let vert: OrderedSegment<i32> = OrderedSegment::new((i32::MIN, i32::MIN).into(), (i32::MIN, i32::MAX).into());
		let near_horiz: OrderedSegment<i32> = OrderedSegment::new((i32::MAX, i32::MIN).into(), (i32::MAX - 1, i32::MAX).into());

		let res1: Coordinate::<f64> = Coordinate { x: -2147483648., y: 18446744062972133000. };

		assert_eq!(vert.line_intersection(&near_horiz), Some(res1));
	}

	// i64 currently not functional
//
// 	#[test]
// 	fn line_intersection_i64_works() {
// 		let s0: OrderedSegment<i64> = OrderedSegment::new((2300, 1900), (4200, 1900));
// 		let s1: OrderedSegment<i64> = OrderedSegment::new((2387, 1350), (2500, 2100));
// 		let s2: OrderedSegment<i64> = OrderedSegment::new((2387, 1350), (3200, 1900));
// 		let s3: OrderedSegment<i64> = OrderedSegment::new((2500, 2100), (2900, 2100));
//
// 		let res01: Point<f64> = Point::new(2469.866666666667, 1900.); // s0 x s1
// 		let res02: Point<f64> = Point::new(3200., 1900.); // s0 x s2
// 		// s0 x s3: null
// 		let res12: Point<f64> = Point::new(2387., 1350.); // s1 x s2 intersect at p2
// 		let res13: Point<f64> = Point::new(2500., 2100.); //s1 x s4 intersect
// 		let res23: Point<f64> = Point::new(3495.6363636363635, 2100.);
//
// 		assert_eq!(s0.line_intersection(&s1), Some(res01));
// 		assert_eq!(s0.line_intersection(&s2), Some(res02));
// 		assert_eq!(s0.line_intersection(&s3), None);
//
// 		assert_eq!(s1.line_intersection(&s2), Some(res12));
// 		assert_eq!(s1.line_intersection(&s3), Some(res13));
// 		assert_eq!(s2.line_intersection(&s3), Some(res23));
// 	}
//
// 	// technically, res2 here is not an accurate result, just in the ballpark?
// 	// the i64::MAX and i64::MIN coords will be rounded to get f64
// 	#[test]
// 	fn line_intersection_i64_overflow_works() {
// 		let nw = (i64::MIN, i64::MIN);
// 		let sw = (i64::MIN, i64::MAX);
// 		let ne = (i64::MAX, i64::MIN);
// 		let se = (i64::MAX, i64::MAX);
// // 		let z: (i32, i32) = (0, 0);
//
// 		let ne_sw: OrderedSegment<i64> = OrderedSegment::new(ne, sw);
// 		let se_nw: OrderedSegment<i64> = OrderedSegment::new(se, nw);
// 		let ne_nw: OrderedSegment<i64> = OrderedSegment::new(ne, nw);
// 		let se_sw: OrderedSegment<i64> = OrderedSegment::new(se, sw);
//
// 		let res1: Point::<f64> = Point::new(-0.5, -0.5);
// // 		let res2: Point::<f64> = Point::new(i64::MAX.into(), i64::MIN.into());
// 		let res2: Point::<f64> = Point::new(f64::MAX, f64::MIN);
//
// 		assert_eq!(ne_sw.line_intersection(&se_nw), Some(res1));
// 		assert_eq!(ne_sw.line_intersection(&ne_nw), Some(res2));
// 		assert_eq!(ne_nw.line_intersection(&se_sw), None);
// 	}
//
// 	#[test]
// 	fn line_intersection_i64_overflow_severe_works() {
//
// 		// s0: (MIN, MIN),(MIN, MAX)
// 		// s1: (MAX, MIN), (MAX - 1, MAX)
// 		let vert: OrderedSegment<i64> = OrderedSegment::new((i64::MIN, i64::MIN), (i64::MIN, i64::MAX));
// 		let near_horiz: OrderedSegment<i64> = OrderedSegment::new((i64::MAX, i64::MIN), (i64::MAX - 1, i64::MAX));
//
// 		let res1: Point::<f64> = Point::new(-9.223372036854776e18, 3.4028236692093843e38);
//
// 		assert_eq!(vert.line_intersection(&near_horiz), Some(res1));
// 	}

	#[test]
	fn line_intersection_random_i16_f64_equal() {
		let max_iter = 100;

		for _ in 0..max_iter {
			let s0_i = OrderedSegment::<i16>::random_range(-10000, 10000);
			let s0_f: OrderedSegment<f64> = s0_i.clone().into();

			let s1_i =  OrderedSegment::<i16>::random_range(-10000, 10000);
			let s1_f: OrderedSegment<f64> = s1_i.clone().into();

			let res_i = s0_i.line_intersection(&s1_i);
			let res_f = s0_f.line_intersection(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

	#[test]
	fn line_intersection_random_i32_f64_equal() {
		let max_iter = 100;

		for _ in 0..max_iter {
			let s0_i = OrderedSegment::<i32>::random_range(-10000, 10000);
			let s0_f: OrderedSegment<f64> = s0_i.clone().into();

			let s1_i =  OrderedSegment::<i32>::random_range(-10000, 10000);
			let s1_f: OrderedSegment<f64> = s1_i.clone().into();

			let res_i = s0_i.line_intersection(&s1_i);
			let res_f = s0_f.line_intersection(&s1_f);

			assert_eq!(res_i, res_f);
		}
	}

}
