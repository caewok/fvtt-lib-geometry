// Track overflow registers

pub struct OInt32 {
    exp: i32,
    rem: i32,
    sign: i32,
}

impl OInt32 {
    pub fn new(value: i32) -> Self {
        if value == 0 {
            return Self { exp: 0, rem: 0, sign: 0 }
        }

        let exp = i32::BITS - value.abs().leading_zeros()
        let sign = value.signum;
        let rem = value | exp;

        Self { exp, rem, sign }
    }

    fn simplify(self) -> Self {
        if rem == 0 { return Self };

        // if remainder is ≥ the exp value,
        // then we can simplify by incrementing exp
        let exp_value = 2.pow(self.exp);

        if rem < 2 { return Self };




    }
}

impl Add for OInt32 {
    type Output = Self;
    fn add(self, other: Self) -> Self {
        if other.sign == 0 { return self; }
        if self.sign == 0 { return other; }

        // larger one is the new exponent,
        // sum smaller exp, smaller remainder, and larger remainder
        let sum_rem = OInt32::new(self.rem + other.rem);

        let max_exp =



        let (value, carry) = self.overflowing_add(other)
        if carry { return Self { value, overflow: self.overflow + 1 } }
        return Self {
            value, overflow: self.overflow
        }
    }

    fn combine_higher(self, other: Self) -> Self {


    }
}

impl Sub for OInt32 {
    type Output = Self;
    fn sub(self, other: Self) -> Self {
        let (value, borrow) = self.overflowing_sub(other)
        if borrow { return Self { value, overflow: self.overflow - 1 } }
        return Self {
            value, overflow: self.overflow
        }
    }
}

