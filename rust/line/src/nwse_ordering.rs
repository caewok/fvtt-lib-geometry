use crate::ordered_coordinate::{ OrderedCoordinateF64, OrderedCoordinateI32, OrderedCoordinateI128 };
use crate::ordered_segment::{ OrderedSegmentF64, OrderedSegmentI32, OrderedSegmentI128 };
use std::cmp::Ordering;

// Trait for NW to SE Ordering
pub trait NWSEOrdering {
	// partial_cmp means one object is at least partially to the nw
	fn partial_nw(&self, other: &Self) -> Ordering;

	// is_nw means self is entirely nw of the other
	fn is_nw(&self, other: &Self) -> bool;

	// is_se means self is entirely se of the other
	fn is_se(&self, other: &Self) -> bool;
}

impl NWSEOrdering for OrderedCoordinateF64
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		let (ax, ay) = self.x_y();
		let (bx, by) = other.x_y();

		if ax == bx {
			if ay == by {
				Ordering::Equal
			} else if ay < by  {
				Ordering::Less
			} else {
				Ordering::Greater
			}
		} else if ax < bx {
			Ordering::Less

		} else {
			Ordering::Greater
		}
	}

	fn is_nw(&self, other: &Self) -> bool {
		// for Coordinates, they are either completely to the left or not at all
		self.partial_nw(other) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		self.partial_nw(other) == Ordering::Greater
	}
}

impl NWSEOrdering for OrderedCoordinateI32
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		let (ax, ay) = self.x_y();
		let (bx, by) = other.x_y();

		if ax == bx {
			if ay == by {
				Ordering::Equal
			} else if ay < by  {
				Ordering::Less
			} else {
				Ordering::Greater
			}
		} else if ax < bx {
			Ordering::Less

		} else {
			Ordering::Greater
		}
	}

	fn is_nw(&self, other: &Self) -> bool {
		// for Coordinates, they are either completely to the left or not at all
		self.partial_nw(other) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		self.partial_nw(other) == Ordering::Greater
	}
}

impl NWSEOrdering for OrderedCoordinateI128
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		let (ax, ay) = self.x_y();
		let (bx, by) = other.x_y();

		if ax == bx {
			if ay == by {
				Ordering::Equal
			} else if ay < by  {
				Ordering::Less
			} else {
				Ordering::Greater
			}
		} else if ax < bx {
			Ordering::Less

		} else {
			Ordering::Greater
		}
	}

	fn is_nw(&self, other: &Self) -> bool {
		// for Coordinates, they are either completely to the left or not at all
		self.partial_nw(other) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		self.partial_nw(other) == Ordering::Greater
	}
}

impl NWSEOrdering for OrderedSegmentF64
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		self.start.partial_nw(&other.start)
	}

	fn is_nw(&self, other: &Self) -> bool {
		// Self is nw if its end point is nw of the other's start point
		self.end.partial_nw(&other.start) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		// Self is se if its start point is se of the other's end point
		self.start.partial_nw(&other.end) == Ordering::Greater
	}
}

impl NWSEOrdering for OrderedSegmentI32
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		self.start.partial_nw(&other.start)
	}

	fn is_nw(&self, other: &Self) -> bool {
		// Self is nw if its end point is nw of the other's start point
		self.end.partial_nw(&other.start) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		// Self is se if its start point is se of the other's end point
		self.start.partial_nw(&other.end) == Ordering::Greater
	}
}

impl NWSEOrdering for OrderedSegmentI128
{
	fn partial_nw(&self, other: &Self) -> Ordering {
		self.start.partial_nw(&other.start)
	}

	fn is_nw(&self, other: &Self) -> bool {
		// Self is nw if its end point is nw of the other's start point
		self.end.partial_nw(&other.start) == Ordering::Less
	}

	fn is_se(&self, other: &Self) -> bool {
		// Self is se if its start point is se of the other's end point
		self.start.partial_nw(&other.end) == Ordering::Greater
	}
}

