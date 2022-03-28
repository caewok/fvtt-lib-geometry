use geo::{ Point };
use crate::segment::{OrderedSegment, SimpleIntersect, NWSEOrdering };

// make idx1 and idx2 same bit length as point
#[derive(Debug, PartialEq)]
pub struct IxResultFloat {
	pub ix: Point<f64>,
	pub idx1: i64,
	pub idx2: i64,
}

// Need enum to store different IxResults
// #[derive(Debug, PartialEq)]
// pub enum IxResultEnum {
// 	Float(IxResult<f64>),
// 	Int(IxResult<i64>),
// }

pub fn ix_brute_single_i32(segments: &[OrderedSegment<i32>]) -> Vec<IxResultFloat>
{
	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		for sj in &segments[(i + 1)..] {
// 			println!("ix_brute_single");
// 			dbg!(&si);
// 			dbg!(&sj);
			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);
			if let Some(ix) = res {
// 				println!("Found intersection {},{} at index {},{}", ix.x(), ix.y(), si.idx, sj.idx);

				ixs.push( IxResultFloat {
					ix,
					idx1: si.idx.into(),
					idx2: sj.idx.into(),
				});
			}
		}
	}

	ixs
}

pub fn ix_brute_single_i64(segments: &[OrderedSegment<i64>]) -> Vec<IxResultFloat>
{
	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		for sj in &segments[(i + 1)..] {
// 			println!("ix_brute_single");
// 			dbg!(&si);
// 			dbg!(&sj);
			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);
			if let Some(ix) = res {
// 				println!("Found intersection {},{} at index {},{}", ix.x(), ix.y(), si.idx, sj.idx);

				ixs.push( IxResultFloat {
					ix,
					idx1: si.idx,
					idx2: sj.idx,
				});
			}
		}
	}

	ixs
}

pub fn ix_brute_single_f64(segments: &[OrderedSegment<f64>]) -> Vec<IxResultFloat>
{
	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		for sj in &segments[(i + 1)..] {
// 			println!("ix_brute_single");
// 			dbg!(&si);
// 			dbg!(&sj);
			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);
			if let Some(ix) = res {
// 				println!("Found intersection {},{} at index {},{}", ix.x(), ix.y(), si.idx, sj.idx);

				ixs.push( IxResultFloat {
					ix,
					idx1: num_traits::cast(si.idx).unwrap(),
					idx2: num_traits::cast(sj.idx).unwrap(),
				});
			}
		}
	}

	ixs
}

pub fn ix_brute_double_i32(segments1: &[OrderedSegment<i32>], segments2: &[OrderedSegment<i32>]) -> Vec<IxResultFloat>
{
	let mut ixs = Vec::<IxResultFloat>::new();
	for si in segments1 {
		for sj in segments2 {
			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);

			if let Some(ix) = res {
				ixs.push( IxResultFloat {
					ix,
					idx1: si.idx.into(),
					idx2: sj.idx.into(),
				});
			}
		}
	}

	ixs
}

pub fn ix_brute_double_f64(segments1: &[OrderedSegment<f64>], segments2: &[OrderedSegment<f64>]) -> Vec<IxResultFloat>
{
	let mut ixs = Vec::<IxResultFloat>::new();
	for si in segments1 {
		for sj in segments2 {
			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);

			if let Some(ix) = res {
				ixs.push( IxResultFloat {
					ix,
					idx1: num_traits::cast(si.idx).unwrap(),
					idx2: num_traits::cast(sj.idx).unwrap(),
				});
			}
		}
	}

	ixs
}

pub fn ix_sort_single_i32(segments: &mut [OrderedSegment<i32>], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
	let segments = segments; // no longer need mutability

	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		for sj in &segments[(i + 1)..] {
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(si) { break; }

			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);
			if let Some(ix) = res {
				ixs.push( IxResultFloat {
					ix,
					idx1: si.idx.into(),
					idx2: sj.idx.into(),
				});
			}
		}
	}

	ixs
}

pub fn ix_sort_single_i64(segments: &mut [OrderedSegment<i64>], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
	let segments = segments; // no longer need mutability

	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		for sj in &segments[(i + 1)..] {
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(si) { break; }

			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);
			if let Some(ix) = res {
				ixs.push( IxResultFloat {
					ix,
					idx1: si.idx,
					idx2: sj.idx,
				});
			}
		}
	}

	ixs
}

pub fn ix_sort_single_f64(segments: &mut [OrderedSegment<f64>], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
	let segments = segments; // no longer need mutability

	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		for sj in &segments[(i + 1)..] {
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(si) { break; }

			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);
			if let Some(ix) = res {
				ixs.push( IxResultFloat {
					ix,
					idx1: num_traits::cast(si.idx).unwrap(),
					idx2: num_traits::cast(sj.idx).unwrap(),
				});
			}
		}
	}

	ixs
}

pub fn ix_sort_double_i32(segments1: &mut [OrderedSegment<i32>], segments2: &mut [OrderedSegment<i32>], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted {
		segments1.sort_unstable_by(|a, b| a.partial_nw(b));
		segments2.sort_unstable_by(|a, b| a.partial_nw(b));
	}

	// no longer need mutability after the sort
	let segments1 = segments1;
	let segments2 = segments2;

	let mut ixs = Vec::<IxResultFloat>::new();
	for si in segments1 {
		for sj in &mut *segments2 {
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(si) { break; }

			if !si.intersects(sj) { continue; }
			let res = si.line_intersection(sj);

			if let Some(ix) = res {
				ixs.push( IxResultFloat {
					ix,
					idx1: si.idx.into(),
					idx2: sj.idx.into(),
				});
			}
		}
	}

	ixs
}

pub fn ix_sort_double_f64(segments1: &mut [OrderedSegment<f64>], segments2: &mut [OrderedSegment<f64>], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted {
		segments1.sort_unstable_by(|a, b| a.partial_nw(b));
		segments2.sort_unstable_by(|a, b| a.partial_nw(b));
	}

// 	dbg!(&segments1);
// 	dbg!(&segments2);

	// no longer need mutability after the sort
	let segments1 = segments1;
	let segments2 = segments2;

	let mut ixs = Vec::<IxResultFloat>::new();
	for si in segments1 {
		for sj in &mut *segments2 {
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(si) {
// 				println!("Continuing at {},{}", si.idx, sj.idx);
			continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(si) {
// 				println!("Breaking at {},{}", si.idx, sj.idx);
			break; }

			if !si.intersects(sj) {
// 				println!("No intersection at {}, {}", si.idx, sj.idx);
			continue; }
			let res = si.line_intersection(sj);

			if let Some(ix) = res {
// 				println!("Recording ix {},{} at {},{}", ix.x(), ix.y(), si.idx, sj.idx);

				ixs.push( IxResultFloat {
					ix,
					idx1: num_traits::cast(si.idx).unwrap(),
					idx2: num_traits::cast(sj.idx).unwrap(),
				});
			}
		}
	}

	ixs
}

#[cfg(test)]
mod tests {
	use super::*;
	use geo::Coordinate;

// ---------------- BENCHMARK FLOAT VERSIONS

// ---------------- TESTING

// ---------------- BRUTE
	#[test]
	fn brute_single_float_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<f64> = OrderedSegment::new_with_idx((2300., 1900.).into(), (4200., 1900.).into(), 0.);
		let s1: OrderedSegment<f64> = OrderedSegment::new_with_idx((2387., 1350.).into(), (2500., 2100.).into(), 1.);
		let s2: OrderedSegment<f64> = OrderedSegment::new_with_idx((2500., 2100.).into(), (2900., 2100.).into(), 2.);

		let segments = vec![s0, s1, s2];
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});

		let ixs = ix_brute_single_f64(&segments);
		assert_eq!(ixs, res);
	}

	#[test]
	fn brute_double_float_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<f64> = OrderedSegment::new_with_idx((2300., 1900.).into(), (4200., 1900.).into(), 0.);
		let s1: OrderedSegment<f64> = OrderedSegment::new_with_idx((2387., 1350.).into(), (2500., 2100.).into(), 1.);
		let s2: OrderedSegment<f64> = OrderedSegment::new_with_idx((2500., 2100.).into(), (2900., 2100.).into(), 2.);

		let segments = vec![s0, s1, s2];
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 1,
				idx2: 0,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 2,
				idx2: 1,
			});

		let ixs = ix_brute_double_f64(&segments, &segments);
		assert_eq!(ixs, res);
	}

	#[test]
	fn brute_single_int_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);

		let segments = vec![s0, s1, s2];
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});

		let ixs = ix_brute_single_i32(&segments);
		assert_eq!(ixs, res);
	}

	#[test]
	fn brute_double_int_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);

		let segments = vec![s0, s1, s2];
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 1,
				idx2: 0,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 2,
				idx2: 1,
			});

		let ixs = ix_brute_double_i32(&segments, &segments);
		assert_eq!(ixs, res);
	}


// ---------------- SORT
	#[test]
	fn sort_single_float_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<f64> = OrderedSegment::new_with_idx((2300., 1900.).into(), (4200., 1900.).into(), 0.);
		let s1: OrderedSegment<f64> = OrderedSegment::new_with_idx((2387., 1350.).into(), (2500., 2100.).into(), 1.);
		let s2: OrderedSegment<f64> = OrderedSegment::new_with_idx((2500., 2100.).into(), (2900., 2100.).into(), 2.);

		let mut segments = vec![s0, s1, s2];
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});

		let ixs = ix_sort_single_f64(&mut segments, false);
		assert_eq!(ixs, res);
	}

	#[test]
	fn sort_double_float_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<f64> = OrderedSegment::new_with_idx((2300., 1900.).into(), (4200., 1900.).into(), 0.);
		let s1: OrderedSegment<f64> = OrderedSegment::new_with_idx((2387., 1350.).into(), (2500., 2100.).into(), 1.);
		let s2: OrderedSegment<f64> = OrderedSegment::new_with_idx((2500., 2100.).into(), (2900., 2100.).into(), 2.);

		let mut segments1 = vec![s0, s1, s2];
		let mut segments2 = segments1.clone();
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 1,
				idx2: 0,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 2,
				idx2: 1,
			});

		let ixs = ix_sort_double_f64(&mut segments1, &mut segments2, false);
		assert_eq!(ixs, res);
	}

	#[test]
	fn sort_single_int_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);

		let mut segments = vec![s0, s1, s2];
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});
		let ixs = ix_sort_single_i32(&mut segments, false);
		assert_eq!(ixs, res);
	}

	#[test]
	fn sort_double_int_works() {
		// s0|s1 intersect
		// s0|s2 do not intersect
		// s1|s2 intersect at endpoint
		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);

		let mut segments1 = vec![s0, s1, s2];
		let mut segments2 = segments1.clone();
		let mut res = Vec::<IxResultFloat>::new();
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 0,
				idx2: 1,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2469.866666666667, 1900.),
				idx1: 1,
				idx2: 0,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 1,
				idx2: 2,
			});
		res.push(
			IxResultFloat {
				ix: Point::new(2500., 2100.),
				idx1: 2,
				idx2: 1,
			});

		let ixs = ix_sort_double_i32(&mut segments1, &mut segments2, false);
		assert_eq!(ixs, res);
	}

	#[test]
	fn sort_double_float_square_diamond_works() {
		// square with a rotated square.
		// 1 shared vertex
		let p00: Coordinate<f64> = Coordinate { x: 100., y: 100. };
		let p01: Coordinate<f64> = Coordinate { x: 1000., y: 100. };
		let p02: Coordinate<f64> = Coordinate { x: 1000., y: 1000. };
		let p03: Coordinate<f64> = Coordinate { x: 100., y: 1000. };

		let p10: Coordinate<f64> = Coordinate { x: 50., y: 500. };
		let p11: Coordinate<f64> = Coordinate { x: 500., y: 50. };
		let p12: Coordinate<f64> = Coordinate { x: 1500., y: 500. };
		let p13: Coordinate<f64> = Coordinate { x: 500., y: 1500. };

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

		let expected: Vec<IxResultFloat> = vec![
			IxResultFloat {
				ix: Point::new(450., 100.),
				idx1: 0,
				idx2: 0,
			},
			IxResultFloat {
				ix: Point::new(611.1111111111111, 100.),
				idx1: 0,
				idx2: 1,
			},
			IxResultFloat {
				ix: Point::new(100., 450.),
				idx1: 3,
				idx2: 0,
			},
			IxResultFloat {
				ix: Point::new(100., 611.1111111111111),
				idx1: 3,
				idx2: 3,
			},
			IxResultFloat {
				ix: Point::new(275., 1000.),
				idx1: 2,
				idx2: 3,
			},
			IxResultFloat {
				ix: Point::new(1000., 1000.),
				idx1: 2,
				idx2: 2,
			},
			IxResultFloat {
				ix: Point::new(1000., 275.),
				idx1: 1,
				idx2: 1,
			},
			IxResultFloat {
				ix: Point::new(1000., 1000.),
				idx1: 1,
				idx2: 2,
			},
		];

		let ixs = ix_sort_double_f64(&mut segments0, &mut segments1, false);
		assert_eq!(ixs, expected);
	}

	#[test]
	fn brute_double_float_square_diamond_works() {
		// square with a rotated square.
		// 1 shared vertex

		let p00: Coordinate<f64> = Coordinate { x: 100., y: 100. };
		let p01: Coordinate<f64> = Coordinate { x: 1000., y: 100. };
		let p02: Coordinate<f64> = Coordinate { x: 1000., y: 1000. };
		let p03: Coordinate<f64> = Coordinate { x: 100., y: 1000. };

		let p10: Coordinate<f64> = Coordinate { x: 50., y: 500. };
		let p11: Coordinate<f64> = Coordinate { x: 500., y: 50. };
		let p12: Coordinate<f64> = Coordinate { x: 1500., y: 500. };
		let p13: Coordinate<f64> = Coordinate { x: 500., y: 1500. };

		let segments0: Vec<OrderedSegment<f64>> = vec![
			OrderedSegment::new_with_idx(p00, p01, 0.),
			OrderedSegment::new_with_idx(p01, p02, 1.),
			OrderedSegment::new_with_idx(p02, p03, 2.),
			OrderedSegment::new_with_idx(p03, p00, 3.),
		];

		let segments1 = vec![
			OrderedSegment::new_with_idx(p10, p11, 0.),
			OrderedSegment::new_with_idx(p11, p12, 1.),
			OrderedSegment::new_with_idx(p12, p13, 2.),
			OrderedSegment::new_with_idx(p13, p10, 3.),
		];

		let expected: Vec<IxResultFloat> = vec![
			IxResultFloat {
				ix: Point::new(450., 100.),
				idx1: 0,
				idx2: 0,
			},
			IxResultFloat {
				ix: Point::new(611.1111111111111, 100.),
				idx1: 0,
				idx2: 1,
			},
			IxResultFloat {
				ix: Point::new(1000., 275.),
				idx1: 1,
				idx2: 1,
			},
			IxResultFloat {
				ix: Point::new(1000., 1000.),
				idx1: 1,
				idx2: 2,
			},
			IxResultFloat {
				ix: Point::new(1000., 1000.),
				idx1: 2,
				idx2: 2,
			},
			IxResultFloat {
				ix: Point::new(275., 1000.),
				idx1: 2,
				idx2: 3,
			},
			IxResultFloat {
				ix: Point::new(100., 450.),
				idx1: 3,
				idx2: 0,
			},
			IxResultFloat {
				ix: Point::new(100., 611.1111111111111),
				idx1: 3,
				idx2: 3,
			},
		];

		let ixs = ix_brute_double_f64(&segments0, &segments1);
		assert_eq!(ixs, expected);
	}


}