use crate::ordered_coordinate::{ OrderedCoordinateF64 };
use crate::ordered_segment::{ OrderedSegmentF64, OrderedSegmentI32, OrderedSegmentI128 };
use crate::intersection::{ Intersection };
use crate::nwse_ordering::NWSEOrdering;
use wasm_bindgen::prelude::*;

// make idx1 and idx2 same bit length as point
#[wasm_bindgen]
#[derive(Debug, PartialEq)]
pub struct IxResultFloat {
	pub ix: OrderedCoordinateF64,
	pub idx1: f64,
	pub idx2: f64,
}

// cannot use #[wasm_bindgen] with slices or Vec returns
pub fn ix_brute_single_i32(segments: &[OrderedSegmentI32]) -> Vec<IxResultFloat> {
	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		// looks like an ~5% performance improvement to transition the segments to i128 first
		let si: OrderedSegmentI128 = si.into();
		for sj in &segments[(i + 1)..] {
			let sj: OrderedSegmentI128 = sj.into();

// 			if !si.intersects(&sj) { continue; }
// 			let res = si.line_intersection2(&sj);
			let res = si.segment_intersection(&sj);

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

fn ix_result_builder(ix_res: Option<OrderedCoordinateF64>, si: &OrderedSegmentF64, sj: &OrderedSegmentF64) -> Option<IxResultFloat> {
	match ix_res {
		Some(ix) => Some(IxResultFloat { ix: ix, idx1: si.idx.into(), idx2: sj.idx.into() }),
		None => None
	}
}



pub fn ix_brute_single_f64(segments: &[OrderedSegmentF64]) -> Vec<IxResultFloat> {
	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		// works but slower than the dual for loops:
// 		let mut tmp: Vec<IxResultFloat> = segments[(i + 1)..].iter().filter(|sj| si.intersects(&sj)).filter_map(|sj| ix_result_builder(si.line_intersection2(&sj), &si, &sj)).collect();
// 		ixs.append(&mut tmp);

		// faster then the
		for sj in &segments[(i + 1)..] {
// 			if !si.intersects(&sj) { continue; }
// 			let res = si.line_intersection2(&sj);
			let res = si.segment_intersection(sj);
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


pub fn ix_brute_double_i32(segments1: &[OrderedSegmentI32], segments2: &[OrderedSegmentI32]) -> Vec<IxResultFloat>
{
	let mut ixs = Vec::<IxResultFloat>::new();
	for si in segments1 {
		let si: OrderedSegmentI128 = si.into();
		for sj in segments2 {
			let sj: OrderedSegmentI128 = sj.into();

			if !si.intersects(&sj) { continue; }
			let res = si.line_intersection2(&sj);
// 			let res = si.segment_intersection(&sj);
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

pub fn ix_brute_double_f64(segments1: &[OrderedSegmentF64], segments2: &[OrderedSegmentF64]) -> Vec<IxResultFloat>
{
	let mut ixs = Vec::<IxResultFloat>::new();
	for si in segments1 {
		for sj in segments2 {
			if !si.intersects(sj) { continue; }
			let res = si.line_intersection2(&sj);
// 			let res = si.segment_intersection(sj);
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

pub fn ix_sort_single_i32(segments: &mut [OrderedSegmentI32], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
	let segments = segments; // no longer need mutability

	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		let si: OrderedSegmentI128 = si.into();
		for sj in &segments[(i + 1)..] {
			let sj: OrderedSegmentI128 = sj.into();
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(&si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(&si) { break; }

			if !si.intersects(&sj) { continue; }
			let res = si.line_intersection2(&sj);
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

pub fn ix_sort_double_i32(segments1: &mut [OrderedSegmentI32], segments2: &mut [OrderedSegmentI32], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted {
		segments1.sort_unstable_by(|a, b| a.partial_nw(b));
		segments2.sort_unstable_by(|a, b| a.partial_nw(b));
	}

	// no longer need mutability after the sort
	let segments1 = segments1;
	let segments2 = segments2;

	let mut ixs = Vec::<IxResultFloat>::new();
	for si in segments1.iter() {
		let si: OrderedSegmentI128 = si.into();
		for sj in segments2.iter() {
			let sj: OrderedSegmentI128 = sj.into();
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(&si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(&si) { break; }

			if !si.intersects(&sj) { continue; }
			let res = si.line_intersection2(&sj);

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

pub fn ix_sort_single_f64(segments: &mut [OrderedSegmentF64], sorted: bool) -> Vec<IxResultFloat>
{
	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
	let segments = segments; // no longer need mutability

	let mut ixs = Vec::<IxResultFloat>::new();
	for(i, si) in segments.iter().enumerate() {
		for sj in &segments[(i + 1)..] {
			// if we have not yet reached the left end, we can skip
			if sj.is_nw(&si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(&si) { break; }

			if !si.intersects(&sj) { continue; }
			let res = si.line_intersection2(&sj);
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

pub fn ix_sort_double_f64(segments1: &mut [OrderedSegmentF64], segments2: &mut [OrderedSegmentF64], sorted: bool) -> Vec<IxResultFloat>
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
			if sj.is_nw(&si) { continue; }

			// if we reach the right end, we can skip the rest
			if sj.is_se(&si) { break; }

			if !si.intersects(&sj) { continue; }
			let res = si.line_intersection2(&sj);

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



// pub fn ix_brute_single_i32(segments: &[OrderedSegment<i32>]) -> Vec<IxResultFloat>
// {
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for(i, si) in segments.iter().enumerate() {
// 		for sj in &segments[(i + 1)..] {
// // 			println!("ix_brute_single");
// // 			dbg!(&si);
// // 			dbg!(&sj);
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
// 			if let Some(ix) = res {
// // 				println!("Found intersection {},{} at index {},{}", ix.x(), ix.y(), si.idx, sj.idx);
//
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx.into(),
// 					idx2: sj.idx.into(),
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_brute_single_i64(segments: &[OrderedSegment<i64>]) -> Vec<IxResultFloat>
// {
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for(i, si) in segments.iter().enumerate() {
// 		for sj in &segments[(i + 1)..] {
// // 			println!("ix_brute_single");
// // 			dbg!(&si);
// // 			dbg!(&sj);
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
// 			if let Some(ix) = res {
// // 				println!("Found intersection {},{} at index {},{}", ix.x(), ix.y(), si.idx, sj.idx);
//
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: num_traits::cast(si.idx).unwrap(),
// 					idx2: num_traits::cast(sj.idx).unwrap(),
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_brute_single_f64(segments: &[OrderedSegment<f64>]) -> Vec<IxResultFloat>
// {
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for(i, si) in segments.iter().enumerate() {
// 		for sj in &segments[(i + 1)..] {
// // 			println!("ix_brute_single");
// // 			dbg!(&si);
// // 			dbg!(&sj);
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
// 			if let Some(ix) = res {
// // 				println!("Found intersection {},{} at index {},{}", ix.x(), ix.y(), si.idx, sj.idx);
//
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx,
// 					idx2: sj.idx,
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_brute_double_i32(segments1: &[OrderedSegment<i32>], segments2: &[OrderedSegment<i32>]) -> Vec<IxResultFloat>
// {
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for si in segments1 {
// 		for sj in segments2 {
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
//
// 			if let Some(ix) = res {
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx.into(),
// 					idx2: sj.idx.into(),
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_brute_double_f64(segments1: &[OrderedSegment<f64>], segments2: &[OrderedSegment<f64>]) -> Vec<IxResultFloat>
// {
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for si in segments1 {
// 		for sj in segments2 {
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
//
// 			if let Some(ix) = res {
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx,
// 					idx2: sj.idx,
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_sort_single_i32(segments: &mut [OrderedSegment<i32>], sorted: bool) -> Vec<IxResultFloat>
// {
// 	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
// 	let segments = segments; // no longer need mutability
//
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for(i, si) in segments.iter().enumerate() {
// 		for sj in &segments[(i + 1)..] {
// 			// if we have not yet reached the left end, we can skip
// 			if sj.is_nw(si) { continue; }
//
// 			// if we reach the right end, we can skip the rest
// 			if sj.is_se(si) { break; }
//
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
// 			if let Some(ix) = res {
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx.into(),
// 					idx2: sj.idx.into(),
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_sort_single_i64(segments: &mut [OrderedSegment<i64>], sorted: bool) -> Vec<IxResultFloat>
// {
// 	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
// 	let segments = segments; // no longer need mutability
//
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for(i, si) in segments.iter().enumerate() {
// 		for sj in &segments[(i + 1)..] {
// 			// if we have not yet reached the left end, we can skip
// 			if sj.is_nw(si) { continue; }
//
// 			// if we reach the right end, we can skip the rest
// 			if sj.is_se(si) { break; }
//
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
// 			if let Some(ix) = res {
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: num_traits::cast(si.idx).unwrap(),
// 					idx2: num_traits::cast(sj.idx).unwrap(),
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_sort_single_f64(segments: &mut [OrderedSegment<f64>], sorted: bool) -> Vec<IxResultFloat>
// {
// 	if !sorted { segments.sort_unstable_by(|a, b| a.partial_nw(b)); }
// 	let segments = segments; // no longer need mutability
//
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for(i, si) in segments.iter().enumerate() {
// 		for sj in &segments[(i + 1)..] {
// 			// if we have not yet reached the left end, we can skip
// 			if sj.is_nw(si) { continue; }
//
// 			// if we reach the right end, we can skip the rest
// 			if sj.is_se(si) { break; }
//
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
// 			if let Some(ix) = res {
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx,
// 					idx2: sj.idx,
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_sort_double_i32(segments1: &mut [OrderedSegment<i32>], segments2: &mut [OrderedSegment<i32>], sorted: bool) -> Vec<IxResultFloat>
// {
// 	if !sorted {
// 		segments1.sort_unstable_by(|a, b| a.partial_nw(b));
// 		segments2.sort_unstable_by(|a, b| a.partial_nw(b));
// 	}
//
// 	// no longer need mutability after the sort
// 	let segments1 = segments1;
// 	let segments2 = segments2;
//
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for si in segments1 {
// 		for sj in &mut *segments2 {
// 			// if we have not yet reached the left end, we can skip
// 			if sj.is_nw(si) { continue; }
//
// 			// if we reach the right end, we can skip the rest
// 			if sj.is_se(si) { break; }
//
// 			if !si.intersects(sj) { continue; }
// 			let res = si.line_intersection(sj);
//
// 			if let Some(ix) = res {
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx.into(),
// 					idx2: sj.idx.into(),
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//
// pub fn ix_sort_double_f64(segments1: &mut [OrderedSegment<f64>], segments2: &mut [OrderedSegment<f64>], sorted: bool) -> Vec<IxResultFloat>
// {
// 	if !sorted {
// 		segments1.sort_unstable_by(|a, b| a.partial_nw(b));
// 		segments2.sort_unstable_by(|a, b| a.partial_nw(b));
// 	}
//
// // 	dbg!(&segments1);
// // 	dbg!(&segments2);
//
// 	// no longer need mutability after the sort
// 	let segments1 = segments1;
// 	let segments2 = segments2;
//
// 	let mut ixs = Vec::<IxResultFloat>::new();
// 	for si in segments1 {
// 		for sj in &mut *segments2 {
// 			// if we have not yet reached the left end, we can skip
// 			if sj.is_nw(si) {
// // 				println!("Continuing at {},{}", si.idx, sj.idx);
// 			continue; }
//
// 			// if we reach the right end, we can skip the rest
// 			if sj.is_se(si) {
// // 				println!("Breaking at {},{}", si.idx, sj.idx);
// 			break; }
//
// 			if !si.intersects(sj) {
// // 				println!("No intersection at {}, {}", si.idx, sj.idx);
// 			continue; }
// 			let res = si.line_intersection(sj);
//
// 			if let Some(ix) = res {
// // 				println!("Recording ix {},{} at {},{}", ix.x(), ix.y(), si.idx, sj.idx);
//
// 				ixs.push( IxResultFloat {
// 					ix,
// 					idx1: si.idx,
// 					idx2: sj.idx,
// 				});
// 			}
// 		}
// 	}
//
// 	ixs
// }
//

// cargo test cargo test -- --nocapture
#[cfg(test)]
mod tests {
	use super::*;
	use crate::ordered_coordinate::c_i32;

// ---------------- BENCHMARK FLOAT VERSIONS

// ---------------- TESTING

	struct ExpectedI32 {
		segments: [OrderedSegmentI32; 3],

		expected_single: Vec<IxResultFloat>,
		expected_double: Vec<IxResultFloat>,
	}

	struct ExpectedF64 {
		segments: [OrderedSegmentF64; 3],

		expected_single: Vec<IxResultFloat>,
		expected_double: Vec<IxResultFloat>,
	}

	impl ExpectedI32 {
		fn new() -> Self {
			// s0|s1 intersect
			// s0|s2 do not intersect
			// s1|s2 intersect at endpoint

			let mut expected_single = Vec::<IxResultFloat>::new();
			expected_single.push(
				IxResultFloat {
					ix: OrderedCoordinateF64 { x: 2469.866666666667, y: 1900. },
					idx1: 0.,
					idx2: 1.,
				});
			expected_single.push(
				IxResultFloat {
					ix: OrderedCoordinateF64 { x: 2500., y: 2100. },
					idx1: 1.,
					idx2: 2.,
				});

			let mut expected_double = Vec::<IxResultFloat>::new();
			expected_double.push(
			IxResultFloat {
				ix: OrderedCoordinateF64 { x: 2469.866666666667, y: 1900. },
				idx1: 0.,
				idx2: 1.,
			});
			expected_double.push(
				IxResultFloat {
					ix: OrderedCoordinateF64 { x: 2469.866666666667, y: 1900. },
					idx1: 1.,
					idx2: 0.,
				});
			expected_double.push(
				IxResultFloat {
					ix: OrderedCoordinateF64 { x: 2500., y: 2100. },
					idx1: 1.,
					idx2: 2.,
				});
			expected_double.push(
				IxResultFloat {
					ix: OrderedCoordinateF64 { x: 2500., y: 2100. },
					idx1: 2.,
					idx2: 1.,
				});

			ExpectedI32 {
				segments: [ OrderedSegmentI32::new_with_idx(c_i32(2300, 1900), c_i32(4200, 1900), 0),
		  		            OrderedSegmentI32::new_with_idx(c_i32(2387, 1350), c_i32(2500, 2100), 1),
							OrderedSegmentI32::new_with_idx(c_i32(2500, 2100), c_i32(2900, 2100), 2),
						  ],

				expected_single,
				expected_double,
			}
		}
	}

	impl From<ExpectedI32> for ExpectedF64 {
        fn from(data: ExpectedI32) -> Self {
            ExpectedF64 {
            	segments: [ (&data.segments[0]).into(), (&data.segments[1]).into(), (&data.segments[2]).into(), ],

                expected_single: data.expected_single,
                expected_double: data.expected_double,
            }
        }
    }


// ---------------- BRUTE
	#[test]
	fn brute_single_float_works() {
		let data: ExpectedF64 = ExpectedI32::new().into();
		let ixs = ix_brute_single_f64(&data.segments[..]);
		assert_eq!(ixs, data.expected_single);
	}

	#[test]
	fn brute_single_int_works() {
		let data = ExpectedI32::new();
		let ixs = ix_brute_single_i32(&data.segments[..]);
		assert_eq!(ixs, data.expected_single);
	}

	#[test]
	fn brute_double_float_works() {
		let data: ExpectedF64 = ExpectedI32::new().into();
		let ixs = ix_brute_double_f64(&data.segments[..], &data.segments[..]);
		assert_eq!(ixs, data.expected_double);
	}

	#[test]
	fn brute_double_int_works() {
		let data = ExpectedI32::new();
		let ixs = ix_brute_double_i32(&data.segments[..], &data.segments[..]);
		assert_eq!(ixs, data.expected_double);
	}

	#[test]
	fn sort_single_float_works() {
		let mut data: ExpectedF64 = ExpectedI32::new().into();
		let ixs = ix_sort_single_f64(&mut data.segments[..], false);
		assert_eq!(ixs, data.expected_single);
	}

	#[test]
	fn sort_single_int_works() {
		let mut data = ExpectedI32::new();
		let ixs = ix_sort_single_i32(&mut data.segments[..], false);
		assert_eq!(ixs, data.expected_single);
	}

	#[test]
	fn sort_double_float_works() {
		let data: ExpectedF64 = ExpectedI32::new().into();
		let mut segments1 = data.segments.clone();
		let mut segments2 = data.segments.clone();

		let ixs = ix_sort_double_f64(&mut segments1, &mut segments2, false);
		assert_eq!(ixs, data.expected_double);
	}

	#[test]
	fn sort_double_int_works() {
		let data = ExpectedI32::new();
		let mut segments1 = data.segments.clone();
		let mut segments2 = data.segments.clone();

		let ixs = ix_sort_double_i32(&mut segments1, &mut segments2, false);
		assert_eq!(ixs, data.expected_double);
	}
//
// 	#[test]
// 	fn brute_double_float_works() {
// 		// s0|s1 intersect
// 		// s0|s2 do not intersect
// 		// s1|s2 intersect at endpoint
// 		let s0: OrderedSegment<f64> = OrderedSegment::new_with_idx((2300., 1900.).into(), (4200., 1900.).into(), 0.);
// 		let s1: OrderedSegment<f64> = OrderedSegment::new_with_idx((2387., 1350.).into(), (2500., 2100.).into(), 1.);
// 		let s2: OrderedSegment<f64> = OrderedSegment::new_with_idx((2500., 2100.).into(), (2900., 2100.).into(), 2.);
//
// 		let segments = vec![s0, s1, s2];
// 		let expected = Expected::new();
//
// 		let ixs = ix_brute_double_f64(&segments, &segments);
// 		assert_eq!(ixs, expected.double);
// 	}
//
// 	#[test]
// 	fn brute_single_int_works() {
// 		// s0|s1 intersect
// 		// s0|s2 do not intersect
// 		// s1|s2 intersect at endpoint
// 		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
// 		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
// 		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);
//
// 		let segments = vec![s0, s1, s2];
// 		let expected = Expected::new();
//
// 		let ixs = ix_brute_single_i32(&segments);
// 		assert_eq!(ixs, expected.single);
// 	}
//
// 	#[test]
// 	fn brute_double_int_works() {
// 		// s0|s1 intersect
// 		// s0|s2 do not intersect
// 		// s1|s2 intersect at endpoint
// 		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
// 		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
// 		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);
//
// 		let segments = vec![s0, s1, s2];
// 		let expected = Expected::new();
//
// 		let ixs = ix_brute_double_i32(&segments, &segments);
// 		assert_eq!(ixs, expected.double);
// 	}
//
//
// // ---------------- SORT
// 	#[test]
// 	fn sort_single_float_works() {
// 		// s0|s1 intersect
// 		// s0|s2 do not intersect
// 		// s1|s2 intersect at endpoint
// 		let s0: OrderedSegment<f64> = OrderedSegment::new_with_idx((2300., 1900.).into(), (4200., 1900.).into(), 0.);
// 		let s1: OrderedSegment<f64> = OrderedSegment::new_with_idx((2387., 1350.).into(), (2500., 2100.).into(), 1.);
// 		let s2: OrderedSegment<f64> = OrderedSegment::new_with_idx((2500., 2100.).into(), (2900., 2100.).into(), 2.);
//
// 		let mut segments = vec![s0, s1, s2];
// 		let expected = Expected::new();
//
// 		let ixs = ix_sort_single_f64(&mut segments, false);
// 		assert_eq!(ixs, expected.single);
// 	}
//
// 	#[test]
// 	fn sort_double_float_works() {
// 		// s0|s1 intersect
// 		// s0|s2 do not intersect
// 		// s1|s2 intersect at endpoint
// 		let s0: OrderedSegment<f64> = OrderedSegment::new_with_idx((2300., 1900.).into(), (4200., 1900.).into(), 0.);
// 		let s1: OrderedSegment<f64> = OrderedSegment::new_with_idx((2387., 1350.).into(), (2500., 2100.).into(), 1.);
// 		let s2: OrderedSegment<f64> = OrderedSegment::new_with_idx((2500., 2100.).into(), (2900., 2100.).into(), 2.);
//
// 		let mut segments1 = vec![s0, s1, s2];
// 		let mut segments2 = segments1.clone();
// 		let expected = Expected::new();
//
// 		let ixs = ix_sort_double_f64(&mut segments1, &mut segments2, false);
// 		assert_eq!(ixs, expected.double);
// 	}
//
// 	#[test]
// 	fn sort_single_int_works() {
// 		// s0|s1 intersect
// 		// s0|s2 do not intersect
// 		// s1|s2 intersect at endpoint
// 		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
// 		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
// 		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);
//
// 		let mut segments = vec![s0, s1, s2];
// 		let expected = Expected::new();
// 		let ixs = ix_sort_single_i32(&mut segments, false);
// 		assert_eq!(ixs, expected.single);
// 	}
//
// 	#[test]
// 	fn sort_double_int_works() {
// 		// s0|s1 intersect
// 		// s0|s2 do not intersect
// 		// s1|s2 intersect at endpoint
// 		let s0: OrderedSegment<i32> = OrderedSegment::new_with_idx((2300, 1900).into(), (4200, 1900).into(), 0);
// 		let s1: OrderedSegment<i32> = OrderedSegment::new_with_idx((2387, 1350).into(), (2500, 2100).into(), 1);
// 		let s2: OrderedSegment<i32> = OrderedSegment::new_with_idx((2500, 2100).into(), (2900, 2100).into(), 2);
//
// 		let mut segments1 = vec![s0, s1, s2];
// 		let mut segments2 = segments1.clone();
// 		let expected = Expected::new();
//
// 		let ixs = ix_sort_double_i32(&mut segments1, &mut segments2, false);
// 		assert_eq!(ixs, expected.double);
// 	}
//
// 	#[test]
// 	fn sort_double_float_square_diamond_works() {
// 		// square with a rotated square.
// 		// 1 shared vertex
// 		let p00: Coordinate<f64> = Coordinate { x: 100., y: 100. };
// 		let p01: Coordinate<f64> = Coordinate { x: 1000., y: 100. };
// 		let p02: Coordinate<f64> = Coordinate { x: 1000., y: 1000. };
// 		let p03: Coordinate<f64> = Coordinate { x: 100., y: 1000. };
//
// 		let p10: Coordinate<f64> = Coordinate { x: 50., y: 500. };
// 		let p11: Coordinate<f64> = Coordinate { x: 500., y: 50. };
// 		let p12: Coordinate<f64> = Coordinate { x: 1500., y: 500. };
// 		let p13: Coordinate<f64> = Coordinate { x: 500., y: 1500. };
//
// 		let mut segments0: Vec<OrderedSegment<f64>> = vec![
// 			OrderedSegment::new_reorder_with_index(p00, p01, 0.),
// 			OrderedSegment::new_reorder_with_index(p01, p02, 1.),
// 			OrderedSegment::new_reorder_with_index(p02, p03, 2.),
// 			OrderedSegment::new_reorder_with_index(p03, p00, 3.),
// 		];
//
// 		let mut segments1 = vec![
// 			OrderedSegment::new_reorder_with_index(p10, p11, 0.),
// 			OrderedSegment::new_reorder_with_index(p11, p12, 1.),
// 			OrderedSegment::new_reorder_with_index(p12, p13, 2.),
// 			OrderedSegment::new_reorder_with_index(p13, p10, 3.),
// 		];
//
// 		let expected: Vec<IxResultFloat> = vec![
// 			IxResultFloat {
// 				ix: Coordinate { x: 450., y: 100. },
// 				idx1: 0.,
// 				idx2: 0.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 611.1111111111111, y: 100. },
// 				idx1: 0.,
// 				idx2: 1.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 100., y: 450. },
// 				idx1: 3.,
// 				idx2: 0.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 100., y: 611.1111111111111 },
// 				idx1: 3.,
// 				idx2: 3.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 275., y: 1000. },
// 				idx1: 2.,
// 				idx2: 3.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 1000., y: 1000. },
// 				idx1: 2.,
// 				idx2: 2.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 1000., y: 275. },
// 				idx1: 1.,
// 				idx2: 1.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 1000., y: 1000. },
// 				idx1: 1.,
// 				idx2: 2.,
// 			},
// 		];
//
// 		let ixs = ix_sort_double_f64(&mut segments0, &mut segments1, false);
// 		assert_eq!(ixs, expected);
// 	}
//
// 	#[test]
// 	fn brute_double_float_square_diamond_works() {
// 		// square with a rotated square.
// 		// 1 shared vertex
//
// 		let p00: Coordinate<f64> = Coordinate { x: 100., y: 100. };
// 		let p01: Coordinate<f64> = Coordinate { x: 1000., y: 100. };
// 		let p02: Coordinate<f64> = Coordinate { x: 1000., y: 1000. };
// 		let p03: Coordinate<f64> = Coordinate { x: 100., y: 1000. };
//
// 		let p10: Coordinate<f64> = Coordinate { x: 50., y: 500. };
// 		let p11: Coordinate<f64> = Coordinate { x: 500., y: 50. };
// 		let p12: Coordinate<f64> = Coordinate { x: 1500., y: 500. };
// 		let p13: Coordinate<f64> = Coordinate { x: 500., y: 1500. };
//
// 		let segments0: Vec<OrderedSegment<f64>> = vec![
// 			OrderedSegment::new_with_idx(p00, p01, 0.),
// 			OrderedSegment::new_with_idx(p01, p02, 1.),
// 			OrderedSegment::new_with_idx(p02, p03, 2.),
// 			OrderedSegment::new_with_idx(p03, p00, 3.),
// 		];
//
// 		let segments1 = vec![
// 			OrderedSegment::new_with_idx(p10, p11, 0.),
// 			OrderedSegment::new_with_idx(p11, p12, 1.),
// 			OrderedSegment::new_with_idx(p12, p13, 2.),
// 			OrderedSegment::new_with_idx(p13, p10, 3.),
// 		];
//
// 		let expected: Vec<IxResultFloat> = vec![
// 			IxResultFloat {
// 				ix: Coordinate { x: 450., y: 100. },
// 				idx1: 0.,
// 				idx2: 0.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 611.1111111111111, y: 100. },
// 				idx1: 0.,
// 				idx2: 1.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 1000., y: 275. },
// 				idx1: 1.,
// 				idx2: 1.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 1000., y: 1000. },
// 				idx1: 1.,
// 				idx2: 2.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 1000., y: 1000. },
// 				idx1: 2.,
// 				idx2: 2.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 275., y: 1000. },
// 				idx1: 2.,
// 				idx2: 3.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 100., y: 450. },
// 				idx1: 3.,
// 				idx2: 0.,
// 			},
// 			IxResultFloat {
// 				ix: Coordinate { x: 100., y: 611.1111111111111 },
// 				idx1: 3.,
// 				idx2: 3.,
// 			},
// 		];
//
// 		let ixs = ix_brute_double_f64(&segments0, &segments1);
// 		assert_eq!(ixs, expected);
// 	}
//
//
}