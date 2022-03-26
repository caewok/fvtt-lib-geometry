// Interface to Javascript
// For speed, alloc memory in WASM and use pointers in Javascript
// Pass in flat arrays of coordinates for segments

// https://radu-matei.com/blog/practical-guide-to-wasm-memory/
// https://github.com/WebAssembly/design/issues/1231
use crate::intersections::{
	ix_brute_single_f64,
	ix_brute_single_i32,
	ix_brute_double_f64,
	ix_brute_double_i32,
	ix_sort_single_f64,
	ix_sort_single_i32,
	ix_sort_double_f64,
	ix_sort_double_i32,
	};
use crate::point::SimpleOrient;
use crate::segment::OrderedSegment;
use geo::algorithm::kernels::Orientation;
use geo::Coordinate;
use smallvec::SmallVec;
use crate::intersections::IxResultFloat;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}


// test copy versus pointers
// https://users.rust-lang.org/t/pass-js-float64array-to-rust-using-wasm/55669/16
#[wasm_bindgen]
pub fn sum_copy(data: &[f64]) -> f64 {
// 	console_log!("data length {}", data.len());

//     console_log!("{} {} {}", data[0], data[1], data[2]);

	data.iter().sum()
}

#[wasm_bindgen]
pub fn sum_no_copy(ptr: *mut f64, count: usize) -> f64 {
// 	let data = unsafe { std::slice::from_raw_parts(ptr, count) };
    let data = unsafe { Vec::from_raw_parts(ptr, count, count) };
	data.iter().sum()
}

#[wasm_bindgen]
pub fn get_vec_pointer(count: usize) -> *mut f64 {
    let mut v = Vec::with_capacity(count);
    let ptr = v.as_mut_ptr();
    std::mem::forget(v);
    ptr
}

#[wasm_bindgen]
pub fn get_array(ptr: *mut f64, count: usize) -> js_sys::Float64Array {
    unsafe { js_sys::Float64Array::view(std::slice::from_raw_parts(ptr, count)) }
}

// https://radu-matei.com/blog/practical-guide-to-wasm-memory/
#[no_mangle]
pub fn alloc(len: usize) -> *mut f64 {
	let mut buf = Vec::with_capacity(len);
	let ptr = buf.as_mut_ptr();
	std::mem::forget(buf);
	ptr
}

#[no_mangle]
pub fn array_sum(ptr: *mut f64, len: usize) -> f64 {
  let data = unsafe { Vec::from_raw_parts(ptr, len, len) };
  data.iter().sum()
}


// Alternative using allocations
// return an array, indicating its length in the first element
#[no_mangle]
pub fn alloc_f64(len: usize) -> *mut f64 {
	let mut buf = Vec::with_capacity(len);
	let ptr = buf.as_mut_ptr();
	std::mem::forget(buf);
	ptr
}

#[no_mangle]
pub fn brute_f64_ptr(ptr: *mut f64, len: usize) -> *mut f64 {
	let coordinates = unsafe { Vec::from_raw_parts(ptr, len, len) };
	let mut segments = Vec::<OrderedSegment<f64>>::with_capacity(len / 4);

// 	console_log!("Pointer data starts with {},{},{},{}", coordinates[0], coordinates[1], coordinates[2], coordinates[3]);

	for i in (0..len).step_by(4) {
		// don't care about order for brute
		segments.push(OrderedSegment::new_ordered_with_idx((coordinates[i], coordinates[i+1]), (coordinates[i+2], coordinates[i+3]), i / 4));
	}
	let segments = segments; // don't need mutability anymore

// 	console_log!("{} segments. First is {},{}|{},{}", segments.len(), segments[0].start.x, segments[0].start.y, segments[0].end.x, segments[0].end.y);

	let ixs = ix_brute_single_f64(&segments);
// 	console_log!("{} intersections. First is {}, {}", ixs.len(), ixs[0].ix.x(), ixs[0].ix.y());

	// build return array: 4 elements per intersection + 1 to indicate length
	let mut buf = Vec::<f64>::with_capacity((ixs.len() * 4) + 1);
	buf.push(ixs.len() as f64);
	for obj in ixs {
		buf.push(obj.ix.x());
		buf.push(obj.ix.y());
		buf.push(obj.idx1 as f64);
		buf.push(obj.idx2 as f64);
	}
	let ptr = buf.as_mut_ptr();
	std::mem::forget(buf);
	ptr
}


fn bundle_ix(ixs: SmallVec<[IxResultFloat; 4]>) -> Option<Box<[f64]>> {
	let ixs_ln = ixs.len();
	if ixs_ln == 0 { return None };

	// build return array: coords followed by indices
	let mut buf = Vec::<f64>::with_capacity(ixs_ln * 4);
	for obj in ixs {
		buf.push(obj.ix.x());
		buf.push(obj.ix.y());
		buf.push(obj.idx1 as f64);
		buf.push(obj.idx2 as f64);
	}

	Some(buf.into_boxed_slice())
}

#[wasm_bindgen]
pub fn brute_i32(coordinates: &[i32]) -> Option<Box<[f64]>> {
	let n_coords = coordinates.len();
// 	let n_segments = n_coords / 4;

// 	println!("{} coordinates to add to construct {} segments", n_coords, n_segments);

	// build segments
	let mut segments = Vec::<OrderedSegment<i32>>::with_capacity(n_coords / 4);
	for i in (0..n_coords).step_by(4) {
// 		println!("Adding coordinates {},{}|{},{} at at index {}", coordinates[i], coordinates[i+1], coordinates[i+2], coordinates[i+3], i / 4);
		// don't care about ordering for brute
		segments.push(OrderedSegment::new_ordered_with_idx((coordinates[i], coordinates[i+1]), (coordinates[i+2], coordinates[i+3]), i / 4));
	}
	let segments = segments; // don't need mutability anymore

// 	println!("Locating intersections...");

	let ixs = ix_brute_single_i32(&segments);
	bundle_ix(ixs)
}

#[wasm_bindgen]
pub fn brute_f64(coordinates: &[f64]) -> Option<Box<[f64]>> {
	let n_coords = coordinates.len();

	// build segments
	let mut segments = Vec::<OrderedSegment<f64>>::with_capacity(n_coords / 4);
	for i in (0..n_coords).step_by(4) {
		segments.push(OrderedSegment::new_ordered_with_idx((coordinates[i], coordinates[i+1]), (coordinates[i+2], coordinates[i+3]), i / 4));
	}
	let segments = segments; // don't need mutability anymore

	let ixs = ix_brute_single_f64(&segments);
	bundle_ix(ixs)
}

#[wasm_bindgen]
pub fn brute_double_i32(coordinates0: &[i32], coordinates1: &[i32]) -> Option<Box<[f64]>> {
	let n_coords0 = coordinates0.len();

	// build segments
	let mut segments0 = Vec::<OrderedSegment<i32>>::with_capacity(n_coords0 / 4);
	for i in (0..n_coords0).step_by(4) {
		segments0.push(OrderedSegment::new_ordered_with_idx((coordinates0[i], coordinates0[i+1]), (coordinates0[i+2], coordinates0[i+3]), i / 4));
	}
	let segments0 = segments0; // don't need mutability anymore

	let n_coords1 = coordinates1.len();

	// build segments
	let mut segments1 = Vec::<OrderedSegment<i32>>::with_capacity(n_coords1 / 4);
	for i in (0..n_coords1).step_by(4) {
		segments1.push(OrderedSegment::new_ordered_with_idx((coordinates1[i], coordinates1[i+1]), (coordinates1[i+2], coordinates1[i+3]), i / 4));
	}

	let segments0 = segments0; // don't need mutability anymore
	let segments1 = segments1; // don't need mutability anymore

	let ixs = ix_brute_double_i32(&segments0, &segments1);
	bundle_ix(ixs)
}

#[wasm_bindgen]
pub fn brute_double_f64(coordinates0: &[f64], coordinates1: &[f64]) -> Option<Box<[f64]>> {
	let n_coords0 = coordinates0.len();

	// build segments
	let mut segments0 = Vec::<OrderedSegment<f64>>::with_capacity(n_coords0 / 4);
	for i in (0..n_coords0).step_by(4) {
		segments0.push(OrderedSegment::new_ordered_with_idx((coordinates0[i], coordinates0[i+1]), (coordinates0[i+2], coordinates0[i+3]), i / 4));
	}
	let segments0 = segments0; // don't need mutability anymore

	let n_coords1 = coordinates1.len();

	// build segments
	let mut segments1 = Vec::<OrderedSegment<f64>>::with_capacity(n_coords1 / 4);
	for i in (0..n_coords1).step_by(4) {
		segments1.push(OrderedSegment::new_ordered_with_idx((coordinates1[i], coordinates1[i+1]), (coordinates1[i+2], coordinates1[i+3]), i / 4));
	}

	let segments0 = segments0; // don't need mutability anymore
	let segments1 = segments1; // don't need mutability anymore

	let ixs = ix_brute_double_f64(&segments0, &segments1);
	bundle_ix(ixs)
}

#[wasm_bindgen]
pub fn sort_i32(coordinates: &[i32], ordered: bool, sorted: bool) -> Option<Box<[f64]>> {
	let n_coords = coordinates.len();

	// build segments
	let mut segments = Vec::<OrderedSegment<i32>>::with_capacity(n_coords / 4);
	if ordered {
		for i in (0..n_coords).step_by(4) {
			segments.push(OrderedSegment::new_ordered_with_idx((coordinates[i], coordinates[i+1]), (coordinates[i+2], coordinates[i+3]), i / 4));
		}
	} else {
		for i in (0..n_coords).step_by(4) {
			segments.push(OrderedSegment::new_with_idx((coordinates[i], coordinates[i+1]), (coordinates[i+2], coordinates[i+3]), i / 4));
		}
	}

	let ixs = ix_sort_single_i32(&mut segments, sorted);
	bundle_ix(ixs)
}

#[wasm_bindgen]
pub fn sort_f64(coordinates: &[f64], ordered: bool, sorted: bool) -> Option<Box<[f64]>> {
	let n_coords = coordinates.len();

	// build segments
	let mut segments = Vec::<OrderedSegment<f64>>::with_capacity(n_coords / 4);
	if ordered {
		for i in (0..n_coords).step_by(4) {
			segments.push(OrderedSegment::new_ordered_with_idx((coordinates[i], coordinates[i+1]), (coordinates[i+2], coordinates[i+3]), i / 4));
		}
	} else {
		for i in (0..n_coords).step_by(4) {
			segments.push(OrderedSegment::new_with_idx((coordinates[i], coordinates[i+1]), (coordinates[i+2], coordinates[i+3]), i / 4));
		}
	}

	let ixs = ix_sort_single_f64(&mut segments, sorted);
	bundle_ix(ixs)
}

#[wasm_bindgen]
pub fn sort_double_i32(coordinates0: &[i32], coordinates1: &[i32], ordered: bool, sorted: bool) -> Option<Box<[f64]>> {
	let n_coords0 = coordinates0.len();
	let n_coords1 = coordinates1.len();

	// build segments
	let mut segments0 = Vec::<OrderedSegment<i32>>::with_capacity(n_coords0 / 4);
	let mut segments1 = Vec::<OrderedSegment<i32>>::with_capacity(n_coords1 / 4);
	if ordered {
		for i in (0..n_coords0).step_by(4) {
			segments0.push(OrderedSegment::new_ordered_with_idx((coordinates0[i], coordinates0[i+1]), (coordinates0[i+2], coordinates0[i+3]), i / 4));
		}

		for i in (0..n_coords1).step_by(4) {
			segments1.push(OrderedSegment::new_ordered_with_idx((coordinates1[i], coordinates1[i+1]), (coordinates1[i+2], coordinates1[i+3]), i / 4));
		}
	} else {
		for i in (0..n_coords0).step_by(4) {
			segments0.push(OrderedSegment::new_with_idx((coordinates0[i], coordinates0[i+1]), (coordinates0[i+2], coordinates0[i+3]), i / 4));
		}

		for i in (0..n_coords1).step_by(4) {
			segments1.push(OrderedSegment::new_with_idx((coordinates1[i], coordinates1[i+1]), (coordinates1[i+2], coordinates1[i+3]), i / 4));
		}
	}


	let ixs = ix_sort_double_i32(&mut segments0, &mut segments1, sorted);
	bundle_ix(ixs)
}

#[wasm_bindgen]
pub fn sort_double_f64(coordinates0: &[f64], coordinates1: &[f64], ordered: bool, sorted: bool) -> Option<Box<[f64]>> {
	let n_coords0 = coordinates0.len();
	let n_coords1 = coordinates1.len();

	// build segments
	let mut segments0 = Vec::<OrderedSegment<f64>>::with_capacity(n_coords0 / 4);
	let mut segments1 = Vec::<OrderedSegment<f64>>::with_capacity(n_coords1 / 4);
	if ordered {
		for i in (0..n_coords0).step_by(4) {
			segments0.push(OrderedSegment::new_ordered_with_idx((coordinates0[i], coordinates0[i+1]), (coordinates0[i+2], coordinates0[i+3]), i / 4));
		}

		for i in (0..n_coords1).step_by(4) {
			segments1.push(OrderedSegment::new_ordered_with_idx((coordinates1[i], coordinates1[i+1]), (coordinates1[i+2], coordinates1[i+3]), i / 4));
		}

	} else {

		for i in (0..n_coords0).step_by(4) {
			segments0.push(OrderedSegment::new_with_idx((coordinates0[i], coordinates0[i+1]), (coordinates0[i+2], coordinates0[i+3]), i / 4));
		}

		for i in (0..n_coords1).step_by(4) {
			segments1.push(OrderedSegment::new_with_idx((coordinates1[i], coordinates1[i+1]), (coordinates1[i+2], coordinates1[i+3]), i / 4));
		}
	}

	let ixs = ix_sort_double_f64(&mut segments0, &mut segments1, sorted);
	bundle_ix(ixs)
}



#[wasm_bindgen]
pub fn orient2d_i32_js(ax: i32, ay: i32, bx: i32, by: i32, cx: i32, cy: i32) -> i8 {
	let c1: Coordinate<i32> = (ax, ay).into();
	let c2: Coordinate<i32> = (bx, by).into();
	let c3: Coordinate<i32> = (cx, cy).into();

	let res = c1.orient2d(c2, c3);
	match res {
		Orientation::Clockwise => 1,
		Orientation::CounterClockwise => -1,
		Orientation::Collinear => 0
	}
}

#[wasm_bindgen]
pub fn orient2d_f64_js(ax: f64, ay: f64, bx: f64, by: f64, cx: f64, cy: f64) -> i8 {
	let c1: Coordinate<f64> = (ax, ay).into();
	let c2: Coordinate<f64> = (bx, by).into();
	let c3: Coordinate<f64> = (cx, cy).into();

	let res = c1.orient2d(c2, c3);
	match res {
		Orientation::Clockwise => 1,
		Orientation::CounterClockwise => -1,
		Orientation::Collinear => 0
	}
}

#[no_mangle]
pub fn orient2d_i32_fast(ax: i32, ay: i32, bx: i32, by: i32, cx: i32, cy: i32) -> i8 {
// 	console_log!("a: {},{}, b: {},{}, c: {},{}", ax, ay, bx, by, cx, cy);
	let (ax, ay) = (ax as i128, ay as i128);
	let (bx, by) = (bx as i128, by as i128);
	let (cx, cy) = (cx as i128, cy as i128);

	let res = (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);

	if res > 0 {
		-1
	} else if res < 0 {
		1
	} else {
		0
	}
}

#[no_mangle]
pub fn orient2d_f64_fast(ax: f64, ay: f64, bx: f64, by: f64, cx: f64, cy: f64) -> f64 {
// 	console_log!("a: {},{}, b: {},{}, c: {},{}", ax, ay, bx, by, cx, cy);
	-((ay - cy) * (bx - cx) - (ax - cx) * (by - cy))
}


#[cfg(test)]
mod tests {
	use super::*;

// ---------------- BRUTE INTERSECTIONS
	#[test]
	fn brute_single_i32_works() {
		let coordinates: Vec<i32> = vec![
			2300, 1900, 4200, 1900,
			2387, 1350, 2500, 2100,
			2387, 1350, 3200, 1900,
			2500, 2100, 2900, 2100,
		];

		let expected: Vec<f64> = vec![
			2469.866666666667, 1900., 0., 1.,
			3200., 1900., 0., 2.,
			2387., 1350., 1., 2.,
			2500., 2100., 1., 3.,
		];

		let res = brute_i32(&coordinates[..]);

		assert_eq!(Some(expected.into_boxed_slice()), res);
	}
}



