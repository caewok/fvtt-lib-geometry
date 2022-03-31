// pub mod point;
// pub mod segment;
// pub mod intersections;
// pub mod js_api;

// use intersections::js_api::brute_i32;

// use intersections_line::segment::{OrderedSegment};
// use geo::Coordinate;
// use intersections_line::intersections::ix_sort_double_f64;

// #![feature(int_log)]



fn main() {
	println!("Hello world!");

	let z: i8 = 0; // -128 to 127
	let max: i8 = i8::MAX;
	let min: i8 = i8::MIN;

	dbg!(max);
	dbg!(min);

	dbg!(z.overflowing_add(max)); // 0 + 127 = 127, false
	dbg!(max.overflowing_add(max)); // 127 + 127 = -2, true // actually 254
	dbg!(min.overflowing_add(max)); // -128 + 127 = -1, false
	dbg!(z.overflowing_add(min));  // 0 + (-128) = -128, false
	dbg!(min.overflowing_add(min)); // -128 + (-128) = 0, true // actually 256

	dbg!(max.overflowing_mul(max)); // 127 x 127 = 1, true // actually 16129
	dbg!(min.overflowing_mul(min)); // -128 x -128 = 0, true // actually 16384
	dbg!(min.overflowing_mul(max)); // -128 x 127 = -128, true // actually 16256

// 	dbg!(max.log2());
// 	dbg!(min.log2());

// 	dbg!(ix_sort_double_f64(&mut segments0, &mut segments1, false));

}

