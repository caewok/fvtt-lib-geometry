use criterion::*;
use intersections_line::point::{GenerateRandom, SimpleOrient};
use intersections_line::segment::{OrderedSegment, SimpleIntersect};
use intersections_line::intersections::{
	ix_brute_single_f64,
	ix_brute_single_i32,
	ix_brute_double_f64,
	ix_brute_double_i32,
	ix_sort_single_f64,
	ix_sort_single_i32,
	ix_sort_double_f64,
	ix_sort_double_i32,
};
use geo::{CoordNum, Coordinate, Point};
use rand::prelude::Distribution;
use rand::distributions::Standard;
use rand::distributions::uniform::SampleUniform;
use criterion::black_box as bb_;
use std::fs;

// cargo bench -- ixs to filter to intersections
// open -a "Google Chrome" target/criterion/report/index.html
// #[derive(Debug, Clone)]
struct BenchData<T>
	where T: CoordNum,
{
	c0: Coordinate<T>,
	c1: Coordinate<T>,
	c2: Coordinate<T>,
	s0: OrderedSegment<T>,
	s1: OrderedSegment<T>,
}

impl<T> BenchData<T>
	where T: CoordNum + SampleUniform, Standard: Distribution<T>,
{
	fn new() -> BenchData<T> {
		let range: T = num_traits::cast(1000).unwrap();
		let neg_range: T = num_traits::cast(-1000).unwrap();

		BenchData {
			c0: Point::random_range(neg_range, range).into(),
			c1: Point::random_range(neg_range, range).into(),
			c2: Point::random_range(neg_range, range).into(),

			s0: OrderedSegment::random_range(neg_range, range),
			s1: OrderedSegment::random_range(neg_range, range),
		}
	}
}





// --------------- 	BENCH ORIENT2D
fn bench_orient2d(c: &mut Criterion) {
	let mut group = c.benchmark_group("orient2d");

	group.bench_function("f64", move |b| {
		b.iter_batched(|| BenchData::<f64>::new(),
		|data| {
			data.c0.orient2d(bb_(data.c1), bb_(data.c2));
		},
		BatchSize::SmallInput)
	});

// 	group.bench_function("f32", move |b| {
// 		b.iter_batched(|| BenchData::<f32>::new(),
// 		|data| {
// 			orient2d(data.p0.into(), data.p1.into(), data.p2.into());
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("i64", move |b| {
// 		b.iter_batched(|| BenchData::<i64>::new(),
// 		|data| {
// 			orient2d(data.p0.into(), data.p1.into(), data.p2.into());
// 		},
// 		BatchSize::SmallInput)
// 	});
//
	group.bench_function("i32", move |b| {
		b.iter_batched(|| BenchData::<i32>::new(),
		|data| {
			data.c0.orient2d(bb_(data.c1), bb_(data.c2));
		},
		BatchSize::SmallInput)
	});

// 	group.bench_function("robust_f64", move |b| {
// 		b.iter_batched(|| BenchData::<f64>::new(),
// 		|data| {
// 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("robust_f32", move |b| {
// 		b.iter_batched(|| BenchData::<f32>::new(),
// 		|data| {
// 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// 		},
// 		BatchSize::SmallInput)
// 	});

//  cannot coerce i64 --> robust f64
// 	group.bench_function("robust_i64", move |b| {
// 		b.iter_batched(|| BenchData::<i64>::new(),
// 		|data| {
// 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// 		},
// 		BatchSize::SmallInput)
// 	});

// 	group.bench_function("robust_i32", move |b| {
// 		b.iter_batched(|| BenchData::<i32>::new(),
// 		|data| {
// 				orient2drobust(data.p0.into(), data.p1.into(), data.p2.into());
// 		},
// 		BatchSize::SmallInput)
// 	});


	group.finish();
}

// ---------------- BENCH SEGMENT INTERSECTS
fn bench_segment_intersects(c: &mut Criterion) {
	let mut group = c.benchmark_group("intersects");

	group.bench_function("f64", move |b| {
		b.iter_batched(|| BenchData::<f64>::new(),
		|data| {
			data.s0.intersects(&bb_(data.s1));
		},
		BatchSize::SmallInput)
	});
//
// 	group.bench_function("i64", move |b| {
// 		b.iter_batched(|| BenchData::<i64>::new(),
// 		|data| {
// 				data.s0.intersects(&data.s1);
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("f32", move |b| {
// 		b.iter_batched(|| BenchData::<f32>::new(),
// 		|data| {
// 				data.s0.intersects(&data.s1);
// 		},
// 		BatchSize::SmallInput)
// 	});
//
	group.bench_function("i32", move |b| {
		b.iter_batched(|| BenchData::<i32>::new(),
		|data| {
			data.s0.intersects(&bb_(data.s1));
		},
		BatchSize::SmallInput)
	});

	group.finish();
}

// ---------------- BENCH SEGMENT LINE INTERSECTION
fn bench_segment_intersection(c: &mut Criterion) {
	let mut group = c.benchmark_group("line_intersection");

	group.bench_function("f64", move |b| {
		b.iter_batched(|| BenchData::<f64>::new(),
		|data| {
			data.s0.line_intersection(&bb_(data.s1));
		},
		BatchSize::SmallInput)
	});
//
// 	group.bench_function("i64", move |b| {
// 		b.iter_batched(|| BenchData::<i64>::new(),
// 		|data| {
// 				data.s0.line_intersection(&data.s1);
// 		},
// 		BatchSize::SmallInput)
// 	});
//
// 	group.bench_function("f32", move |b| {
// 		b.iter_batched(|| BenchData::<f32>::new(),
// 		|data| {
// 				data.s0.line_intersection(&data.s1);
// 		},
// 		BatchSize::SmallInput)
// 	});
//
	group.bench_function("i32", move |b| {
		b.iter_batched(|| BenchData::<i32>::new(),
		|data| {
			data.s0.line_intersection(&bb_(data.s1));
		},
		BatchSize::SmallInput)
	});

	group.finish();
}

fn generate_segments_f64(n: usize) -> Vec<OrderedSegment<f64>>
{
	let mut segments = vec![];
	for _ in 0..n {
	  segments.push(OrderedSegment::<f64>::random_range(0., 5000.));
	}
	segments
}

fn generate_segments_i32(n: usize) -> Vec<OrderedSegment<i32>>
{
	let mut segments = vec![];
	for _ in 0..n {
	  segments.push(OrderedSegment::<i32>::random_range(0, 5000));
	}
	segments
}


fn bench_ixs_single(c: &mut Criterion) {
	let mut group = c.benchmark_group("ixs_single");
	for n in [100, 500, 1000, 1500, 2000].iter() {
		let n = *n as usize;
		group.throughput(Throughput::Elements(n as u64));
		group.bench_function(BenchmarkId::new("brute float", n), |b| {
			b.iter_batched(|| generate_segments_f64(n), |data| ix_brute_single_f64(bb_(&data[..])), BatchSize::SmallInput)
		});

		group.bench_function(BenchmarkId::new("sort float", n), |b| {
			b.iter_batched(|| generate_segments_f64(n), |mut data| ix_sort_single_f64(bb_(&mut data[..]), false), BatchSize::SmallInput)
		});
	}

	for n in [100, 500, 1000, 1500, 2000].iter() {
		let n = *n as usize;
		group.throughput(Throughput::Elements(n as u64));
		group.bench_function(BenchmarkId::new("brute int", n), |b| {
			b.iter_batched (|| generate_segments_i32(n), |data| ix_brute_single_i32(bb_(&data[..])), BatchSize::SmallInput)
		});

		group.bench_function(BenchmarkId::new("sort int", n), |b| {
			b.iter_batched (|| generate_segments_i32(n), |mut data| ix_sort_single_i32(bb_(&mut data[..]), false), BatchSize::SmallInput)
		});
	}
	group.finish();
}

fn bench_ixs_double(c: &mut Criterion) {
	let mut group = c.benchmark_group("ixs_double");
	for n in [50, 100, 500, 1000].iter() {
		let n = *n as usize;
		group.throughput(Throughput::Elements(n as u64));
		group.bench_function(BenchmarkId::new("brute float", n), |b| {
			b.iter_batched(|| (generate_segments_f64(n), generate_segments_f64(n)), |(data1, data2)| ix_brute_double_f64(bb_(&data1[..]), bb_(&data2[..])), BatchSize::SmallInput)
		});

		group.bench_function(BenchmarkId::new("sort float", n), |b| {
			b.iter_batched(|| (generate_segments_f64(n), generate_segments_f64(n)), |(mut data1, mut data2)| ix_sort_double_f64(bb_(&mut data1[..]), bb_(&mut data2[..]), false), BatchSize::SmallInput)
		});
	}

	for n in [50, 100, 500, 1000].iter() {
		let n = *n as usize;
		group.throughput(Throughput::Elements(n as u64));
		group.bench_function(BenchmarkId::new("brute int", n), |b| {
			b.iter_batched(|| (generate_segments_i32(n), generate_segments_i32(n)), |(data1, data2)| ix_brute_double_i32(bb_(&data1[..]), bb_(&data2[..])), BatchSize::SmallInput)
		});

		group.bench_function(BenchmarkId::new("sort int", n), |b| {
			b.iter_batched(|| (generate_segments_i32(n), generate_segments_i32(n)), |(mut data1, mut data2)| ix_sort_double_i32(bb_(&mut data1[..]), bb_(&mut data2[..]), false), BatchSize::SmallInput)
		});
	}
	group.finish();
}

criterion_group!(
	benches,
	bench_orient2d,
	bench_segment_intersects,
	bench_segment_intersection,
	bench_ixs_single,
	bench_ixs_double,
	);

criterion_main!(benches);
