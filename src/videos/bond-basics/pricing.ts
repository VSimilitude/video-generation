// Bond pricing math for the Bond Basics video.
//
// The graph scenes plot a *real* pricing function — nothing on screen is a
// hand-placed point. The curve, the marker readouts and the duration
// percentages all come from `priceBond` below, so a change to the example bond
// (coupon, maturity, axis range) moves the drawing with it and can't drift out
// of sync with the narration's numbers.
//
// Convention: annual coupons, annual compounding, price quoted per $1,000 of
// face value, settlement exactly one period before the first coupon.
//
//   price(y) = Σ_{t=1..n} C/(1+y)^t  +  F/(1+y)^n
//
// For the video's 3-year, 5% bond that is
//
//   price(y) = 50/(1+y) + 50/(1+y)^2 + 1050/(1+y)^3

export type Bond = {
  /** Redemption amount paid at maturity. */
  face: number;
  /** Annual coupon rate as a decimal (0.05 = 5%). */
  couponRate: number;
  /** Whole years to maturity. */
  years: number;
};

export const BOND_3Y: Bond = { face: 1000, couponRate: 0.05, years: 3 };
export const BOND_10Y: Bond = { face: 1000, couponRate: 0.05, years: 10 };

/** Cash flow at each future period: [{ t: 1, amount: 50 }, …]. */
export function cashFlows(bond: Bond): { t: number; amount: number }[] {
  const coupon = bond.face * bond.couponRate;
  return Array.from({ length: bond.years }, (_, i) => ({
    t: i + 1,
    amount: coupon + (i === bond.years - 1 ? bond.face : 0),
  }));
}

/** Present value of a single amount received in `t` years, at yield `y`. */
export function discount(amount: number, t: number, y: number): number {
  return amount / Math.pow(1 + y, t);
}

/** Clean price of `bond` at annual yield `y` (decimal). */
export function priceBond(bond: Bond, y: number): number {
  return cashFlows(bond).reduce((sum, cf) => sum + discount(cf.amount, cf.t, y), 0);
}

/** Price of the video's 3-year bond — the curve drawn in scenes 8–10. */
export const price3y = (y: number): number => priceBond(BOND_3Y, y);

/** Price of the 10-year comparison bond — the steeper curve in scene 10. */
export const price10y = (y: number): number => priceBond(BOND_10Y, y);

/** Percentage price change from `fromY` to `toY`, e.g. -2.67 for the 3y bond. */
export function priceChangePct(bond: Bond, fromY: number, toY: number): number {
  const a = priceBond(bond, fromY);
  return ((priceBond(bond, toY) - a) / a) * 100;
}

// --- Checkpoints ----------------------------------------------------------
//
// Verified against the values quoted in the narration (rounded to the cent /
// to one decimal place for percentages):
//
//   price3y(0.05)                     = 1000.00
//   price3y(0.06)                     =  973.27   ("about nine hundred seventy three")
//   price3y(0.04)                     = 1027.75   ("about one thousand and twenty eight")
//   price10y(0.06)                    =  926.40
//   priceChangePct(BOND_3Y,  .05,.06) =   -2.67 %  ("under three")
//   priceChangePct(BOND_10Y, .05,.06) =   -7.36 %  ("around seven")
//
// Discounting scene (scene 6) pieces at the 5% coupon yield, which is why they
// sum to exactly par:
//
//   discount(50, 1, 0.05)   =  47.62
//   discount(50, 2, 0.05)   =  45.35
//   discount(1050, 3, 0.05) = 907.03
//                             ------
//                             1000.00

/** Every checkpoint above, as [label, actual, expected, tolerance]. */
export const PRICING_CHECKPOINTS: [string, number, number, number][] = [
  ["price3y(5%)", price3y(0.05), 1000.0, 0.005],
  ["price3y(6%)", price3y(0.06), 973.27, 0.005],
  ["price3y(4%)", price3y(0.04), 1027.75, 0.005],
  ["price10y(6%)", price10y(0.06), 926.4, 0.005],
  ["Δ% 3y 5→6", priceChangePct(BOND_3Y, 0.05, 0.06), -2.67, 0.005],
  ["Δ% 10y 5→6", priceChangePct(BOND_10Y, 0.05, 0.06), -7.36, 0.005],
  ["PV(50, 1y, 5%)", discount(50, 1, 0.05), 47.62, 0.005],
  ["PV(50, 2y, 5%)", discount(50, 2, 0.05), 45.35, 0.005],
  ["PV(1050, 3y, 5%)", discount(1050, 3, 0.05), 907.03, 0.005],
];

/**
 * Returns the checkpoints that don't hold (empty array = all good). Cheap
 * enough to call from a scratch script when the bond terms change; not run at
 * render time.
 */
export function failingCheckpoints(): string[] {
  return PRICING_CHECKPOINTS.filter(
    ([, actual, expected, tol]) => Math.abs(actual - expected) > tol,
  ).map(
    ([label, actual, expected]) =>
      `${label}: got ${actual.toFixed(4)}, expected ${expected}`,
  );
}
