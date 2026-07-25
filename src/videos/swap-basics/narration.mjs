// Narration script for Swap Basics (financial series, part 2). Run
// `npm run narration -- --video swap-basics` after editing — unchanged lines
// are served from cache.
//
// Conventions carried over from bond-basics: numbers are spelled out ("one
// million", "four percent") so the voice reads words rather than guessing at
// digits, and there are no initialisms in this script. In particular the
// reference rate is never named in the voice track — "SOFR" is a TTS coin-flip
// (letters vs. a word), so it appears only in the on-screen caption for the
// `legs` scene while the narration says "resets with the market".
//
// Amounts are consistent across `legs`, `netting` and `value`, and every one of
// them is checkpointed in ./pricing.ts:
//   fixed 4% on a $1M notional            -> $40,000 a year
//   floating 3% / 4.5% / 5%               -> $30,000 / $45,000 / $50,000
//   net to the fixed payer                -> −$10,000 / +$5,000 / +$10,000
export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    intro:
      "Swaps. They're the quiet giant of finance, with hundreds of trillions of dollars outstanding. And at heart, a swap is just an agreement to trade one stream of payments for another. Here's how interest rate swaps work.",
    problem:
      "Start with the problem. A company borrows one million dollars at a floating rate, one that resets with the market every period. When rates climb, so does its interest bill. The company wants a steady, predictable payment instead. But rewriting the loan is expensive. So it adds a swap on top.",
    deal:
      "An interest rate swap is a deal between two parties. One side pays a fixed rate. The other pays a floating rate. Both are calculated on the same notional amount, and the notional itself never changes hands. Only interest payments are exchanged.",
    legs:
      "Picture the two legs on one timeline. The fixed leg pays forty thousand dollars every year: four percent of the one million notional. The floating leg resets each period: three percent the first year, four and a half the next, then five. One leg is flat. The other moves with the market.",
    netting:
      "In practice, only the difference changes hands. When floating sets at three percent against four fixed, the fixed payer hands over ten thousand dollars. When floating sets at four and a half, five thousand flows back the other way. Same swap, opposite flows, depending on where rates land.",
    hedge:
      "Now stack the swap on top of the company's loan. The company pays floating on its debt, and receives floating from the swap. Those two streams cancel. What remains is the fixed leg. The floating rate loan now behaves exactly like a fixed rate loan. That's hedging: reshaping your risk without touching the original deal.",
    pricing:
      "So what should the fixed rate be? The same idea that priced the bond. Discount the fixed payments back to today. Discount what the market expects the floating payments to be. The fair swap rate is the fixed rate that makes the two sides equal, so the swap begins life worth zero to both parties.",
    value:
      "Then rates move, and the zero doesn't last. Suppose market rates rise. The fixed payer is locked in at below-market payments, so their side gains value, and the receiver's side loses exactly as much. Plot the swap's value against rates, and you get two mirrored lines, crossing at the swap rate.",
    bondlink:
      "If this feels familiar, it should. Paying fixed on a swap behaves like being short a bond. Receiving fixed behaves like owning one. Same discounting, same rate sensitivity, same curve underneath. Two instruments, one engine.",
    recap:
      "So, a swap trades one payment stream for another: fixed for floating, on a notional that never moves. The fair rate makes both sides equal at the start. And when rates move, value flows from one side to the other. Bonds gave us pricing. Swaps put it to work.",
  },
};
