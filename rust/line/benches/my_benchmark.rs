use criterion::*;
use criterion::black_box as bb_;
use intersections_line::ordered_coordinate::{ OrderedCoordinateI32, OrderedCoordinateF64 };
use intersections_line::generate_random::{ GenerateRandom };
use intersections_line::orientation::{ Orientable };


// use intersections_line::point::{GenerateRandom, SimpleOrient};
// use intersections_line::segment::{OrderedSegment, SimpleIntersect};
// use intersections_line::intersections::{
// 	ix_brute_single_f64,
// 	ix_brute_single_i32,
// 	ix_brute_double_f64,
// 	ix_brute_double_i32,
// 	ix_sort_single_f64,
// 	ix_sort_single_i32,
// 	ix_sort_double_f64,
// 	ix_sort_double_i32,
// 	ix_brute_single_i64,
// 	ix_sort_single_i64,
// };
// use geo::{ CoordNum, Coordinate };
// use rand::prelude::Distribution;
// use rand::distributions::Standard;
// use rand::distributions::uniform::SampleUniform;

//
// cargo bench -- ixs to filter to intersections
// open -a "Google Chrome" target/criterion/report/index.html
// #[derive(Debug, Clone)]
struct BenchDataI32
{
	c0: OrderedCoordinateI32,
	c1: OrderedCoordinateI32,
	c2: OrderedCoordinateI32,
// 	s0: OrderedSegment<T>,
// 	s1: OrderedSegment<T>,
}

struct BenchDataF64
{
	c0: OrderedCoordinateF64,
	c1: OrderedCoordinateF64,
	c2: OrderedCoordinateF64,
}

impl BenchDataI32
{
	fn new() -> BenchDataI32 {
		let range = 10_000;
		let neg_range = - 10_000;

		BenchDataI32 {
			c0: OrderedCoordinateI32::random_range(neg_range, range),
			c1: OrderedCoordinateI32::random_range(neg_range, range),
			c2: OrderedCoordinateI32::random_range(neg_range, range),

// 			s0: OrderedSegment::random_range(neg_range, range),
// 			s1: OrderedSegment::random_range(neg_range, range),
		}
	}
}

impl From<BenchDataI32> for BenchDataF64 {
	fn from(data: BenchDataI32) -> Self {
		BenchDataF64 {
			c0: data.c0.into(),
			c1: data.c1.into(),
			c2: data.c2.into(),
		}
	}
}


// --------------- 	BENCH ORIENT2D
fn bench_orient2d(c: &mut Criterion) {
	let mut group = c.benchmark_group("orient2d");

	group.bench_function("f64", move |b| {
		b.iter_batched(|| BenchDataI32::new().into(),
		|data: BenchDataF64| {
			let b: OrderedCoordinateF64 = data.c1;
			let c: OrderedCoordinateF64 = data.c2;
			data.c0.orient(&bb_(b), &bb_(c));
		},
		BatchSize::SmallInput)
	});

		group.bench_function("i32", move |b| {
		b.iter_batched(|| BenchDataI32::new(),
		|data: BenchDataI32| {
			let b: OrderedCoordinateI32 = data.c1;
			let c: OrderedCoordinateI32 = data.c2;
			data.c0.orient(&bb_(b), &bb_(c));
		},
		BatchSize::SmallInput)
	});

}
//
// // 	group.bench_function("f32", move |b| {
// // 		b.iter_batched(|| BenchData::<f32>::new(),
// // 		|data| {
// // 			orient2d(data.p0.into(), data.p1.into(), data.p2.into());
// // 		},
// // 		BatchSize::SmallInput)
// // 	});
// //
// 	group.bench_function("i64", move |b| {
// 		b.iter_batched(|| BenchData::<i64>::new(),
// 		|data| {
// 			data.c0.orient2d(bb_(data.c1), bb_(data.c2));
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("i32", move |b| {
// 		b.iter_batched(|| BenchData::<i32>::new(),
// 		|data| {
// 			data.c0.orient2d(bb_(data.c1), bb_(data.c2));
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("i16", move |b| {
// 		b.iter_batched(|| BenchData::<i32>::new(),
// 		|data| {
// 			data.c0.orient2d(bb_(data.c1), bb_(data.c2));
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// // 	group.bench_function("robust_f64", move |b| {
// // 		b.iter_batched(|| BenchData::<f64>::new(),
// // 		|data| {
// // 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// // 		},
// // 		BatchSize::SmallInput)
// // 	});
// //
// // 	group.bench_function("robust_f32", move |b| {
// // 		b.iter_batched(|| BenchData::<f32>::new(),
// // 		|data| {
// // 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// // 		},
// // 		BatchSize::SmallInput)
// // 	});
//
// //  cannot coerce i64 --> robust f64
// // 	group.bench_function("robust_i64", move |b| {
// // 		b.iter_batched(|| BenchData::<i64>::new(),
// // 		|data| {
// // 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// // 		},
// // 		BatchSize::SmallInput)
// // 	});
//
// // 	group.bench_function("robust_i32", move |b| {
// // 		b.iter_batched(|| BenchData::<i32>::new(),
// // 		|data| {
// // 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// // 		},
// // 		BatchSize::SmallInput)
// // 	});
//
//
// 	group.finish();
// }
//
// // ---------------- BENCH SEGMENT INTERSECTS
// fn bench_segment_intersects(c: &mut Criterion) {
// 	let mut group = c.benchmark_group("intersects");
//
// 	group.bench_function("f64", move |b| {
// 		b.iter_batched(|| BenchData::<f64>::new(),
// 		|data| {
// 			data.s0.intersects(&bb_(data.s1));
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("i64", move |b| {
// 		b.iter_batched(|| BenchData::<i64>::new(),
// 		|data| {
// 				data.s0.intersects(&bb_(data.s1));
// 		},
// 		BatchSize::SmallInput)
// 	});
// //
// // 	group.bench_function("f32", move |b| {
// // 		b.iter_batched(|| BenchData::<f32>::new(),
// // 		|data| {
// // 				data.s0.intersects(&data.s1);
// // 		},
// // 		BatchSize::SmallInput)
// // 	});
// //
// 	group.bench_function("i32", move |b| {
// 		b.iter_batched(|| BenchData::<i32>::new(),
// 		|data| {
// 			data.s0.intersects(&bb_(data.s1));
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.finish();
// }
//
// // ---------------- BENCH SEGMENT LINE INTERSECTION
// fn bench_segment_intersection(c: &mut Criterion) {
// 	let mut group = c.benchmark_group("line_intersection");
//
// 	group.bench_function("f64", move |b| {
// 		b.iter_batched(|| BenchData::<f64>::new(),
// 		|data| {
// 			data.s0.line_intersection(&bb_(data.s1));
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("i64", move |b| {
// 		b.iter_batched(|| BenchData::<i64>::new(),
// 		|data| {
// 				data.s0.line_intersection(&bb_(data.s1));
// 		},
// 		BatchSize::SmallInput)
// 	});
// //
// // 	group.bench_function("f32", move |b| {
// // 		b.iter_batched(|| BenchData::<f32>::new(),
// // 		|data| {
// // 				data.s0.line_intersection(&data.s1);
// // 		},
// // 		BatchSize::SmallInput)
// // 	});
// //
// 	group.bench_function("i32", move |b| {
// 		b.iter_batched(|| BenchData::<i32>::new(),
// 		|data| {
// 			data.s0.line_intersection(&bb_(data.s1));
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.finish();
// }
//
//
// // For Foundry all (nearly all?) segments will be positive, with canvas size
// // likely well under 10000.
// // make sure integers and floats all use a comparable range
//
// fn generate_segments_f64(n: usize) -> Vec<OrderedSegment<f64>>
// {
// 	let mut segments = vec![];
// 	for _ in 0..n {
// 		let mut s = OrderedSegment::<f64>::random_range(0., 10000.);
// 		s.reorder();
// 		let s = s;
// 	  	segments.push(s);
// 	}
// 	segments
// }
//
// fn generate_segments_i32(n: usize) -> Vec<OrderedSegment<i32>>
// {
// 	let mut segments = vec![];
// 	for _ in 0..n {
// 		let mut s = OrderedSegment::<i32>::random_range(0, 10000);
// 		s.reorder();
// 		let s = s;
// 	  	segments.push(s);
// 	}
// 	segments
// }
//
// fn generate_segments_i64(n: usize) -> Vec<OrderedSegment<i64>>
// {
// 	let mut segments = vec![];
// 	for _ in 0..n {
// 		let mut s = OrderedSegment::<i64>::random_range(0, 10000);
// 		s.reorder();
// 		let s = s;
// 	  	segments.push(s);
// 	}
// 	segments
// }
//
// fn bench_ixs_single(c: &mut Criterion) {
// 	let mut group = c.benchmark_group("ixs_single");
// 	for n in [100, 1000, 2000].iter() {
// 		let n = *n as usize;
// 		group.throughput(Throughput::Elements(n as u64));
// 		group.bench_function(BenchmarkId::new("brute float", n), |b| {
// 			b.iter_batched(|| generate_segments_f64(n), |data| ix_brute_single_f64(bb_(&data[..])), BatchSize::SmallInput)
// 		});
//
// 		group.bench_function(BenchmarkId::new("sort float", n), |b| {
// 			b.iter_batched(|| generate_segments_f64(n), |mut data| ix_sort_single_f64(bb_(&mut data[..]), false), BatchSize::SmallInput)
// 		});
// 	}
//
// 	for n in [100, 1000, 2000].iter() {
// 		let n = *n as usize;
// 		group.throughput(Throughput::Elements(n as u64));
// 		group.bench_function(BenchmarkId::new("brute int", n), |b| {
// 			b.iter_batched (|| generate_segments_i32(n), |data| ix_brute_single_i32(bb_(&data[..])), BatchSize::SmallInput)
// 		});
//
// 		group.bench_function(BenchmarkId::new("sort int", n), |b| {
// 			b.iter_batched (|| generate_segments_i32(n), |mut data| ix_sort_single_i32(bb_(&mut data[..]), false), BatchSize::SmallInput)
// 		});
// 	}
//
// 	for n in [100, 1000, 2000].iter() {
// 		let n = *n as usize;
// 		group.throughput(Throughput::Elements(n as u64));
// 		group.bench_function(BenchmarkId::new("brute int64", n), |b| {
// 			b.iter_batched (|| generate_segments_i64(n), |data| ix_brute_single_i64(bb_(&data[..])), BatchSize::SmallInput)
// 		});
//
// 		group.bench_function(BenchmarkId::new("sort int64", n), |b| {
// 			b.iter_batched (|| generate_segments_i64(n), |mut data| ix_sort_single_i64(bb_(&mut data[..]), false), BatchSize::SmallInput)
// 		});
// 	}
// 	group.finish();
// }
//
// fn bench_ixs_double(c: &mut Criterion) {
// 	let mut group = c.benchmark_group("ixs_double");
// 	for n in [50, 500, 1000].iter() {
// 		let n = *n as usize;
// 		group.throughput(Throughput::Elements(n as u64));
// 		group.bench_function(BenchmarkId::new("brute float", n), |b| {
// 			b.iter_batched(|| (generate_segments_f64(n), generate_segments_f64(n)), |(data1, data2)| ix_brute_double_f64(bb_(&data1[..]), bb_(&data2[..])), BatchSize::SmallInput)
// 		});
//
// 		group.bench_function(BenchmarkId::new("sort float", n), |b| {
// 			b.iter_batched(|| (generate_segments_f64(n), generate_segments_f64(n)), |(mut data1, mut data2)| ix_sort_double_f64(bb_(&mut data1[..]), bb_(&mut data2[..]), false), BatchSize::SmallInput)
// 		});
// 	}
//
// 	for n in [50, 500, 1000].iter() {
// 		let n = *n as usize;
// 		group.throughput(Throughput::Elements(n as u64));
// 		group.bench_function(BenchmarkId::new("brute int", n), |b| {
// 			b.iter_batched(|| (generate_segments_i32(n), generate_segments_i32(n)), |(data1, data2)| ix_brute_double_i32(bb_(&data1[..]), bb_(&data2[..])), BatchSize::SmallInput)
// 		});
//
// 		group.bench_function(BenchmarkId::new("sort int", n), |b| {
// 			b.iter_batched(|| (generate_segments_i32(n), generate_segments_i32(n)), |(mut data1, mut data2)| ix_sort_double_i32(bb_(&mut data1[..]), bb_(&mut data2[..]), false), BatchSize::SmallInput)
// 		});
// 	}
// 	group.finish();
// }
//
criterion_group!(
	benches,
	bench_orient2d,
// 	bench_segment_intersects,
// 	bench_segment_intersection,
// 	bench_ixs_single,
// 	bench_ixs_double,
	);

criterion_main!(benches);
