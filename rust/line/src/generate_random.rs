// use rand::prelude::Distribution;
// use rand::distributions::Standard;
// use rand::distributions::uniform::SampleUniform;
use rand::Rng;
use crate::ordered_coordinate::{ OrderedCoordinateF64, OrderedCoordinateI32 };

pub trait GenerateRandom {
	type MaxType;

	fn random() -> Self;

	fn random_range(min: Self::MaxType, max: Self::MaxType) -> Self;

	fn random_pos(max: Self::MaxType) -> Self;
}

impl GenerateRandom for OrderedCoordinateF64
{
	type MaxType = f64;

	fn random() -> Self {
		let (x, y) = rand::random::<(f64, f64)>();
		Self { x,  y }
	}

	fn random_range(min: f64, max: f64) -> Self
	{
		let mut rng = rand::thread_rng();
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}

	fn random_pos(max: f64) -> Self
	{
		let mut rng = rand::thread_rng();
		let min = 0.;
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}
}

impl GenerateRandom for OrderedCoordinateI32
{
	type MaxType = i32;

	fn random() -> Self {
		let (x, y) = rand::random::<(i32, i32)>();
		Self { x,  y }
	}

	fn random_range(min: i32, max: i32) -> Self
	{
		let mut rng = rand::thread_rng();
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}

	fn random_pos(max: i32) -> Self
	{
		let mut rng = rand::thread_rng();
		let min = 0;
		Self { x: rng.gen_range(min..=max), y: rng.gen_range(min..=max) }
	}
}