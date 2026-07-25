// Swap math for the Swap Basics video.
//
// Every number that reaches the screen comes from this file — the two lines in
// the `value` graph, the leg bars, the netted amounts, the PV stacks in
// `pricing` and each readout chip. Nothing is hand-placed and no amount is
// typed into a scene (docs/STYLE.md → "Plot real functions").
//
// ---------------------------------------------------------------------------
// The model, stated honestly
// ---------------------------------------------------------------------------
//
// This is a *flat-curve* swap: one rate `r` is used both as the market's
// expectation of every future floating reset and as the discount rate for every
// cash flow. Real desks bootstrap a forward curve and discount each leg off it;
// that machinery would put six more ideas on screen without changing the one
// the video is about. Under the flat-curve simplification:
//
//   PV(fixed leg)    = FIXED · N · A(n, r)
//   PV(floating leg) = r     · N · A(n, r)        (every expected reset = r)
//   value to payer   = PV(floating) − PV(fixed)
//                    = (r − FIXED) · N · A(n, r)
//
// where A(n, r) = Σ_{t=1..n} (1+r)^−t is the annuity factor. Two consequences
// are worth knowing while reading the scenes:
//
//  1. The fair swap rate is exactly `r` (see `fairSwapRate` — the general
//     formula collapses to it), which is why the `pricing` scene balances at
//     4% and the `value` scene crosses zero at 4%. That is the model being
//     self-consistent, not a coincidence arranged by hand.
//  2. The 3% / 4.5% / 5% floating path in the `legs` and `netting` scenes is
//     therefore *not* the curve the swap was priced off; it is what the resets
//     turned out to be after the swap was struck at the fair 4%. That is also
//     what happens in life: you agree the fixed rate once, then the floating
//     side does whatever the market does.
//
// Rates are decimals (0.04 = 4%); amounts are dollars.

// The reference bond curve, imported rather than re-derived. The `bondlink`
// scene's claim is that a swap is bond exposure repackaged, so its mini-graphs
// plot the *same function* bond-basics plotted — literally one engine, which is
// the point of the scene. This is the suite's first cross-video import; if a
// third video wants it, that is the signal to promote bond pricing into
// src/lib/ rather than grow a web of video-to-video edges.
import { BOND_3Y, price3y } from "../bond-basics/pricing";

export { BOND_3Y, price3y };

/** Notional the swap is calculated on. It is never exchanged. */
export const NOTIONAL = 1_000_000;

/** The agreed fixed rate — the swap rate this deal was struck at. */
export const FIXED = 0.04;

/** Years (annual periods) on both legs. */
export const YEARS = 3;

/** The rate the market is at when the swap is struck (flat curve). */
export const MARKET_RATE = 0.04;

/**
 * Annuity factor: the present value of $1 received at the end of each of `n`
 * periods, discounted at `r`.
 *
 *   A(n, r) = (1 − (1+r)^−n) / r = Σ_{t=1..n} (1+r)^−t
 */
export function annuity(n: number, r: number): number {
  if (r === 0) return n;
  return (1 - Math.pow(1 + r, -n)) / r;
}

/** Present value of $1 received in `t` years, discounted at `r`. */
export function discountFactor(t: number, r: number): number {
  return Math.pow(1 + r, -t);
}

/** PV of the fixed leg at fixed rate `fixedRate`, discounted at `r`. */
export function pvFixedLeg(fixedRate: number, r: number, n = YEARS): number {
  return fixedRate * NOTIONAL * annuity(n, r);
}

/**
 * PV of the floating leg. Under the flat curve every expected reset is `r`, so
 * the leg is worth the same as a fixed leg struck at `r` — which is exactly why
 * the fair fixed rate comes out at `r`.
 */
export function pvFloatingLeg(r: number, n = YEARS): number {
  return r * NOTIONAL * annuity(n, r);
}

/**
 * Value of the swap to the fixed *payer* (pays fixed, receives floating) at
 * market rate `r`: positive when rates are above the rate they locked in.
 *
 * Written as the difference of the two legs rather than as the closed form, so
 * the picture the `pricing` scene draws (two PV stacks, valued apart) and the
 * line the `value` scene plots are the same arithmetic. The closed form
 * (r − FIXED)·N·A(n, r) is asserted against it in the checkpoints below.
 */
export function valueToPayer(r: number, n = YEARS): number {
  return pvFloatingLeg(r, n) - pvFixedLeg(FIXED, r, n);
}

/** Value to the fixed *receiver* — exactly the payer's value, mirrored. */
export function valueToReceiver(r: number, n = YEARS): number {
  return -valueToPayer(r, n);
}

/**
 * The fixed rate that makes the two legs worth the same today, given the
 * market's expected floating payments and a discount rate:
 *
 *   fair = Σ F_t·d_t / (N · Σ d_t)
 *
 * Kept in its general form (it takes an arbitrary expected floating path) so
 * the `pricing` scene's readout is computed, not asserted. Fed the flat-curve
 * expectation it returns `r` exactly.
 */
export function fairSwapRate(expectedFloating: number[], r: number): number {
  const dfs = expectedFloating.map((_, i) => discountFactor(i + 1, r));
  const pv = expectedFloating.reduce((s, f, i) => s + f * dfs[i], 0);
  const sumDf = dfs.reduce((s, d) => s + d, 0);
  return pv / (NOTIONAL * sumDf);
}

// --- The legs, as cash flows ----------------------------------------------

/** What the floating side actually reset to, year by year (`legs`/`netting`). */
export const FLOATING_SETS = [0.03, 0.045, 0.05];

/** Fixed leg payments: 4% of $1M, three times. */
export const FIXED_PAYMENTS: number[] = Array.from(
  { length: YEARS },
  () => FIXED * NOTIONAL,
);

/** Floating leg payments: each reset applied to the same notional. */
export const FLOATING_PAYMENTS: number[] = FLOATING_SETS.map(
  (r) => r * NOTIONAL,
);

/** The market's expectation at inception: a flat path at the market rate. */
export const EXPECTED_FLOATING: number[] = Array.from(
  { length: YEARS },
  () => MARKET_RATE * NOTIONAL,
);

/**
 * What actually changes hands each period, from the fixed payer's seat:
 * floating received minus fixed paid. Negative = the payer writes a cheque.
 */
export const NET_TO_PAYER: number[] = FLOATING_PAYMENTS.map(
  (f, i) => f - FIXED_PAYMENTS[i],
);

// --- Checkpoints ----------------------------------------------------------
//
// The values quoted in the narration and drawn on screen, verified:
//
//   annuity(3, 0.04)      =   2.775091
//   valueToPayer(0.04)    =        0.00   (the swap starts life worth nothing)
//   valueToPayer(0.05)    =  +27,232.48   ("+$27k" chip, `value` scene)
//   valueToPayer(0.03)    =  −28,286.11
//   valueToPayer(0.07)    =  +78,729.48   (still inside the ±$100k y domain)
//   valueToReceiver(0.05) =  −27,232.48   (mirror image, exactly)
//   fairSwapRate(flat 4%) =        0.04   ("value at start: $0")
//   pvFixedLeg(4%, 4%)    = 111,003.64    (both PV stacks in `pricing`)
//   legs                  =  40,000 ×3 fixed; 30,000 / 45,000 / 50,000 floating
//   nets to the payer     = −10,000 / +5,000 / +10,000
//
// Bond echo used by the `bondlink` scene, from bond-basics' own module:
//
//   price3y(0.04) = 1027.75   price3y(0.05) = 1000.00   price3y(0.03) = 1056.57

const closedForm = (r: number): number =>
  (r - FIXED) * NOTIONAL * annuity(YEARS, r);

/** Every checkpoint above, as [label, actual, expected, tolerance]. */
export const SWAP_CHECKPOINTS: [string, number, number, number][] = [
  ["annuity(3, 4%)", annuity(3, 0.04), 2.775091, 5e-6],
  ["valueToPayer(4%)", valueToPayer(0.04), 0, 5e-9],
  ["valueToPayer(5%)", valueToPayer(0.05), 27232.48, 0.005],
  ["valueToPayer(3%)", valueToPayer(0.03), -28286.11, 0.005],
  ["valueToPayer(7%)", valueToPayer(0.07), 78729.48, 0.005],
  ["valueToReceiver(5%)", valueToReceiver(0.05), -27232.48, 0.005],
  // The two-leg difference must equal the closed form at every rate we draw.
  ["closed form @3%", valueToPayer(0.03), closedForm(0.03), 1e-9],
  ["closed form @7%", valueToPayer(0.07), closedForm(0.07), 1e-9],
  ["fairSwapRate(flat 4%)", fairSwapRate(EXPECTED_FLOATING, MARKET_RATE), 0.04, 1e-12],
  ["pvFixedLeg(4%, 4%)", pvFixedLeg(FIXED, MARKET_RATE), 111003.64, 0.005],
  ["pvFloatingLeg(4%)", pvFloatingLeg(MARKET_RATE), 111003.64, 0.005],
  ["fixed payment", FIXED_PAYMENTS[0], 40000, 1e-9],
  ["floating payment y1", FLOATING_PAYMENTS[0], 30000, 1e-9],
  ["floating payment y2", FLOATING_PAYMENTS[1], 45000, 1e-9],
  ["floating payment y3", FLOATING_PAYMENTS[2], 50000, 1e-9],
  ["net to payer y1", NET_TO_PAYER[0], -10000, 1e-9],
  ["net to payer y2", NET_TO_PAYER[1], 5000, 1e-9],
  ["net to payer y3", NET_TO_PAYER[2], 10000, 1e-9],
  ["price3y(4%)", price3y(0.04), 1027.75, 0.005],
  ["price3y(3%)", price3y(0.03), 1056.57, 0.005],
];

/**
 * Returns the checkpoints that don't hold (empty array = all good). Same shape
 * as bond-basics' — cheap to run from a scratch script when a term changes; not
 * run at render time.
 */
export function failingCheckpoints(): string[] {
  return SWAP_CHECKPOINTS.filter(
    ([, actual, expected, tol]) => Math.abs(actual - expected) > tol,
  ).map(
    ([label, actual, expected]) =>
      `${label}: got ${actual.toFixed(6)}, expected ${expected}`,
  );
}
