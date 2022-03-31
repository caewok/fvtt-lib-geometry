// use rand::prelude::Distribution;
// use rand::distributions::Standard;
// use rand::distributions::uniform::SampleUniform;
use rand::{ Rng, RngCore };
use crate::ordered_coordinate::{ OrderedCoordinateF64, OrderedCoordinateI32 };
use crate::ordered_segment::{ OrderedSegmentF64, OrderedSegmentI32 };

pub trait GenerateRandom {
	type MaxType;

	fn random<R>(rng: &mut R) -> Self where R: Rng + RngCore;

	fn random_range<R>(min: Self::MaxType, max: Self::MaxType, rng: &mut R) -> Self where R: Rng + RngCore;

	fn random_pos<R>(max: Self::MaxType, rng: &mut R) -> Self where R: Rng + RngCore;
}

impl GenerateRandom for OrderedCoordinateF64
{
	type MaxType = f64;

	fn random<R: RngCore>(rng: &mut R) -> Self {
		let (x, y): (f64, f64) = (rng.gen(), rng.gen());
		Self { x,  y }
	}

	fn random_range<R: RngCore>(min: f64, max: f64, rng: &mut R) -> Self
	{
// 		let mut rng = rand::thread_rng();
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}

	fn random_pos<R: RngCore>(max: f64, rng: &mut R) -> Self
	{
// 		let mut rng = rand::thread_rng();
		let min = 0.;
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}
}

impl GenerateRandom for OrderedCoordinateI32
{
	type MaxType = i32;

	fn random<R: RngCore>(rng: &mut R) -> Self {
		let (x, y): (i32, i32) = (rng.gen(), rng.gen());
		Self { x,  y }
	}

	fn random_range<R: RngCore>(min: i32, max: i32, rng: &mut R) -> Self
	{
// 		let mut rng = rand::thread_rng();
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}

	fn random_pos<R: RngCore>(max: i32, rng: &mut R) -> Self
	{
// 		let mut rng = rand::thread_rng();
		let min = 0;
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}
}

impl GenerateRandom for OrderedSegmentF64
{
	type MaxType = f64;

	fn random<R: RngCore>(rng: &mut R) -> Self {
		Self::new(OrderedCoordinateF64::random(rng), OrderedCoordinateF64::random(rng))
	}

	fn random_range<R: RngCore>(min: f64, max: f64, rng: &mut R) -> Self {
		Self::new(OrderedCoordinateF64::random_range(min, max, rng), OrderedCoordinateF64::random_range(min, max, rng))
	}

	fn random_pos<R: RngCore>(max: f64, rng: &mut R) -> Self {
		Self::new(OrderedCoordinateF64::random_pos(max, rng), OrderedCoordinateF64::random_pos(max, rng))
	}
}

impl GenerateRandom for OrderedSegmentI32
{
	type MaxType = i32;

	fn random<R: RngCore>(rng: &mut R) -> Self {
		Self::new(OrderedCoordinateI32::random(rng), OrderedCoordinateI32::random(rng))
	}

	fn random_range<R: RngCore>(min: i32, max: i32, rng: &mut R) -> Self {
		Self::new(OrderedCoordinateI32::random_range(min, max, rng), OrderedCoordinateI32::random_range(min, max, rng))
	}

	fn random_pos<R: RngCore>(max: i32, rng: &mut R) -> Self {
		Self::new(OrderedCoordinateI32::random_pos(max, rng), OrderedCoordinateI32::random_pos(max, rng))
	}
}