// TO-DO: Possibly switch to geo crate to handle points, lines.
// For now, create from scratch to learn rust.
// for nightly:
// cargo +nightly build
// cargo +nightly test
// cargo +nightly benchmark
// cargo +nightly run

// #![feature(test)]
//#![feature(saturating_int_impl)]

// extern crate test;

pub mod ordered_coordinate;
pub mod generate_random;
pub mod orientation;
pub mod ordered_segment;
pub mod nwse_ordering;
pub mod intersection;
pub mod intersect_segments;
//pub mod js_api;

