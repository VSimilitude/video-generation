// Narration script for Bond Basics (financial series, part 1). Run
// `npm run narration -- --video bond-basics` after editing — unchanged lines
// are served from cache.
//
// Numbers are spelled out ("one thousand", "five percent") so the voice reads
// them as words rather than guessing at digits; there are no initialisms in
// this script.
export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    intro:
      "Bonds. They fund governments and companies, and they power much of the financial world. Here's how a bond works, in about two minutes.",
    loan:
      "A bond is just a loan, split into tradable pieces. An issuer, say a government or a company, borrows money by selling bonds. Whoever holds the bond is the lender.",
    terms:
      "Every bond has three key terms. The face value: the amount paid back at the end. The coupon: the interest paid along the way. And the maturity: the date the loan ends.",
    cashflows:
      "Picture the cash flows on a timeline. You pay the price today. Each year, you receive a coupon. And at maturity, you get the face value back, plus the final coupon.",
    example:
      "Take a bond with a face value of one thousand dollars, a five percent coupon, and three years to maturity. You receive fifty dollars a year, then one thousand and fifty at the end.",
    priceyield:
      "Now the key idea: price and yield move in opposite directions. When new bonds pay higher rates, older bonds with smaller coupons become less attractive, so their price falls until the yields match.",
    outro:
      "So that's a bond: a tradable loan with a price, a coupon, and a maturity. Next time: swaps, and how markets trade fixed for floating.",
  },
};
