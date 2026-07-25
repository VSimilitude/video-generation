// Narration script for Bond Basics (financial series, part 1). Run
// `npm run narration -- --video bond-basics` after editing — unchanged lines
// are served from cache.
//
// Numbers are spelled out ("one thousand", "five percent") so the voice reads
// them as words rather than guessing at digits; there are no initialisms in
// this script.
//
// v2 (2026-07-25): reworked for depth on user feedback ("more depth, it can be
// longer"). Two new mechanism beats — `discounting` (why a future dollar is
// worth less today) and `duration` (why time amplifies the move) — plus the
// price/yield idea split across `yield` / `curve` / `ratemove` so the graph can
// carry the explanation instead of a single summary line. `terms`,
// `cashflows` and `example` are unchanged from v1, so their clips come from
// cache.
export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    intro:
      "Bonds. Governments and companies borrow trillions with them, and every market watches their prices. In the next few minutes: what a bond is, how it's priced, and why prices fall when rates rise.",
    loan:
      "A bond is a loan, split into tradable pieces. An issuer, a government or a company, borrows by selling bonds. Whoever holds a bond is owed the payments. And because bonds change hands, the market puts a fresh price on that promise every single day.",
    terms:
      "Every bond has three key terms. The face value: the amount paid back at the end. The coupon: the interest paid along the way. And the maturity: the date the loan ends.",
    cashflows:
      "Picture the cash flows on a timeline. You pay the price today. Each year, you receive a coupon. And at maturity, you get the face value back, plus the final coupon.",
    example:
      "Take a bond with a face value of one thousand dollars, a five percent coupon, and three years to maturity. You receive fifty dollars a year, then one thousand and fifty at the end.",
    discounting:
      "Here's the pricing idea. A dollar arriving in three years is worth less than a dollar today, because today's dollar could be earning interest in the meantime. So take every future payment, shrink it back to what it's worth right now, and add the pieces up. That sum is the bond's price.",
    yield:
      "The yield ties it all together. It's the single interest rate that makes the discounted payments add up to the market price. Pay less than face value, and your yield beats the coupon. Pay more, and it trails it.",
    curve:
      "Now put price and yield on a graph. As the yield rises, the price slides down this curve. Price and yield are two views of the same bond: fix either one, and the other follows.",
    ratemove:
      "Watch it move. Market rates jump from five to six percent. New bonds now pay sixty dollars a year, so our fifty dollar coupons look stale, and the price slides down the curve to about nine hundred seventy three dollars. If rates fall to four percent instead, the price climbs to about one thousand and twenty eight.",
    duration:
      "One more idea: time amplifies the move. A ten year bond makes you wait far longer for its payments, so the same one point rise in rates cuts its price by around seven percent, versus under three for the three year bond. The longer the maturity, the steeper the ride. Markets call this sensitivity duration.",
    recap:
      "So, a bond is a tradable loan. Its price is today's value of its future payments. Its yield is the rate that links the two. And when rates move, price slides along the curve. Next time: swaps, and how markets trade fixed for floating.",
  },
};
