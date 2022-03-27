// pub mod point;
// pub mod segment;
// pub mod intersections;
// pub mod js_api;

// use intersections::js_api::brute_i32;

use intersections_line::segment::{OrderedSegment};
use geo::Coordinate;
// use intersections_line::intersections::ix_sort_double_f64;

fn main() {
	println!("Hello world!");

	let p00: Coordinate<f64> = Coordinate {x: 100., y: 100.};
	let p01: Coordinate<f64> = Coordinate {x: 1000., y: 100. };
	let p02: Coordinate<f64> = Coordinate {x: 1000., y: 1000. };
	let p03: Coordinate<f64> = Coordinate {x: 100., y: 1000. };

	let p10: Coordinate<f64> = Coordinate {x: 50., y: 500. };
	let p11: Coordinate<f64> = Coordinate {x: 500., y: 50. };
	let p12: Coordinate<f64> = Coordinate {x: 1500., y: 500. };
	let p13: Coordinate<f64> = Coordinate {x: 500., y: 1500. };

	let mut segments0: Vec<OrderedSegment<f64>> = vec![
		OrderedSegment::new_reorder_with_index(p00, p01, 0.),
		OrderedSegment::new_reorder_with_index(p01, p02, 1.),
		OrderedSegment::new_reorder_with_index(p02, p03, 2.),
		OrderedSegment::new_reorder_with_index(p03, p00, 3.),
	];

	let mut segments1 = vec![
		OrderedSegment::new_reorder_with_index(p10, p11, 0.),
		OrderedSegment::new_reorder_with_index(p11, p12, 1.),
		OrderedSegment::new_reorder_with_index(p12, p13, 2.),
		OrderedSegment::new_reorder_with_index(p13, p10, 3.),
	];

	dbg!(segments0);
	dbg!(segments1);

// 	dbg!(ix_sort_double_f64(&mut segments0, &mut segments1, false));

}