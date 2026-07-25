import React from "react";
import {
  Easing,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../../lib/components/Backdrop";
import { Caption } from "../../lib/components/Caption";
import { CashflowTimeline } from "../../lib/components/CashflowTimeline";
import { ContentArea } from "../../lib/components/ContentArea";
import { Dial, dialAngle } from "../../lib/components/Dial";
import { TitleCard } from "../../lib/components/TitleCard";
import {
  ALREADY_DRAWN,
  AnimatedGraph,
  GraphChip,
  GraphCurve,
  GraphLegend,
  GraphMarker,
  useGraph,
  type AxisSpec,
} from "../../lib/components/graph";
import { SceneAudio, beats, buildTimeline } from "../../lib/narration";
import { theme, darkOutline } from "../../lib/theme";
import { NARRATION } from "./narrationManifest";
import {
  BOND_10Y,
  BOND_3Y,
  discount,
  price3y,
  price10y,
  priceChangePct,
} from "./pricing";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene order + narration mapping. The timeline stretches each scene to fit its
// clip, so total duration always tracks the generated audio. minFrames is only
// a floor for scenes that would otherwise flash by; tailFrames is raised on the
// scenes whose last visual beat lands with (or just after) the voice — the
// discounting stack, the two graph moves and the recap all need a moment to be
// read before the cut.
export function timeline() {
  return buildTimeline(
    [
      { id: "intro", clip: NARRATION.intro, minFrames: 120 },
      { id: "loan", clip: NARRATION.loan, minFrames: 180 },
      { id: "terms", clip: NARRATION.terms, minFrames: 180 },
      { id: "cashflows", clip: NARRATION.cashflows, minFrames: 180 },
      { id: "example", clip: NARRATION.example, minFrames: 180, tailFrames: 20 },
      {
        id: "discounting",
        clip: NARRATION.discounting,
        minFrames: 180,
        tailFrames: 45,
      },
      { id: "yield", clip: NARRATION.yield, minFrames: 180, tailFrames: 45 },
      { id: "curve", clip: NARRATION.curve, minFrames: 180, tailFrames: 30 },
      {
        id: "ratemove",
        clip: NARRATION.ratemove,
        minFrames: 180,
        tailFrames: 45,
      },
      {
        id: "duration",
        clip: NARRATION.duration,
        minFrames: 180,
        tailFrames: 45,
      },
      { id: "recap", clip: NARRATION.recap, minFrames: 120, tailFrames: 45 },
    ],
    FPS,
  );
}

// --- Formatting -----------------------------------------------------------
//
// One place for money and rates, so a number in a readout, a receipt row and an
// axis tick can never disagree about how it's written.

const usd = (v: number, dp = 0): string =>
  `$${v.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
const pct = (v: number, dp = 0): string => `${(v * 100).toFixed(dp)}%`;
const signedPct = (v: number, dp = 1): string =>
  `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(dp)}%`;

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/** Eased 0→1 ramp for continuous motion (docs/STYLE.md: not a spring). */
function ramp(frame: number, from: number, to: number): number {
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
}

// --- Small shared pieces --------------------------------------------------

const CardShell: React.FC<{
  color: string;
  pop: number;
  width: number;
  children?: React.ReactNode;
}> = ({ color, pop, width, children }) => (
  <div
    style={{
      width,
      textAlign: "center",
      background: theme.panel,
      border: `3px solid ${color}`,
      borderRadius: 24,
      boxShadow: `0 0 34px ${color}44`,
      transform: `scale(${0.5 + 0.5 * pop})`,
      opacity: Math.max(0, pop),
    }}
  >
    {children}
  </div>
);

// Horizontal arrow whose shaft grows from its origin toward its head.
const FlowArrow: React.FC<{
  direction: "left" | "right";
  label: string;
  color: string;
  delay: number;
}> = ({ direction, label, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.8 },
  });
  const head = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 13, mass: 0.6 },
  });
  const p = clamp01(grow);
  const pointsRight = direction === "right";
  return (
    <div style={{ width: "100%", opacity: Math.max(0, grow) }}>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color,
          textAlign: "center",
          marginBottom: 14,
          textShadow: darkOutline(1),
        }}
      >
        {label}
      </div>
      <div style={{ position: "relative", height: 36 }}>
        <div
          style={{
            position: "absolute",
            top: 13,
            left: 0,
            right: 26,
            height: 10,
            borderRadius: 5,
            background: color,
            boxShadow: `0 0 22px ${color}66`,
            transformOrigin: pointsRight ? "left center" : "right center",
            transform: `scaleX(${p})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: pointsRight ? 0 : undefined,
            left: pointsRight ? undefined : 0,
            width: 0,
            height: 0,
            borderTop: "18px solid transparent",
            borderBottom: "18px solid transparent",
            borderLeft: pointsRight ? `26px solid ${color}` : undefined,
            borderRight: pointsRight ? undefined : `26px solid ${color}`,
            opacity: Math.max(0, head),
            transform: `scale(${0.4 + 0.6 * Math.max(0, head)})`,
          }}
        />
      </div>
    </div>
  );
};

// --- Scene 2: loan --------------------------------------------------------
//
// v1's issuer/investor exchange, extended with the certificate whose *price*
// keeps being re-quoted — the visual for "the market puts a fresh price on that
// promise every single day". The quotes are a fixed, plausible walk; the point
// is that the number moves, not what it moves to.

const QUOTES = [1000, 1004, 997, 1002, 999];

const LoanDiagram: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.8 } });
  const parties = [
    { label: "Issuer", detail: "borrows the money", color: theme.accent, at: at[0] },
    { label: "Investor", detail: "holds the bond", color: theme.good, at: at[1] },
  ];

  // Certificate + repricing tag. `at[4]` is the certificate's entrance; the
  // quote then re-prints every `QUOTE_EVERY` frames, each print punched in with
  // a short scale pulse so a glance catches the change.
  const certAt = at[4];
  const QUOTE_EVERY = 16;
  const sinceCert = frame - certAt;
  const step = Math.max(0, Math.min(QUOTES.length - 1, Math.floor(sinceCert / QUOTE_EVERY)));
  const intoStep = sinceCert - step * QUOTE_EVERY;
  const pulse = sinceCert < 0 ? 0 : interpolate(intoStep, [0, 5, 12], [1, 0, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cert = clamp01(pop(certAt));

  return (
    <ContentArea gap={30} paddingX={80}>
      <CardShell color={parties[0].color} pop={pop(parties[0].at)} width={520}>
        <div style={{ padding: "60px 32px" }}>
          <div style={{ fontSize: 76, fontWeight: 900, textShadow: darkOutline(2) }}>
            {parties[0].label}
          </div>
          <div style={{ fontSize: 36, color: theme.textMuted, marginTop: 14 }}>
            {parties[0].detail}
          </div>
        </div>
      </CardShell>
      <div
        style={{
          width: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
          flexShrink: 0,
        }}
      >
        <FlowArrow direction="left" label="money" color={theme.good} delay={at[2]} />
        <FlowArrow direction="right" label="bond" color={theme.accent} delay={at[3]} />
        {/* The certificate being re-quoted. */}
        <div
          style={{
            width: 420,
            borderRadius: 18,
            border: `3px solid ${theme.accent}`,
            background: theme.panel,
            padding: "18px 20px 22px",
            textAlign: "center",
            opacity: cert,
            transform: `translateY(${(1 - cert) * 18}px)`,
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 2,
              color: theme.textMuted,
              textShadow: darkOutline(1),
            }}
          >
            BOND · $1,000 FACE
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 52,
              fontWeight: 900,
              color: theme.warm,
              fontVariantNumeric: "tabular-nums lining-nums",
              textShadow: darkOutline(2),
              transform: `scale(${1 + 0.12 * pulse})`,
            }}
          >
            {usd(QUOTES[step])}
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, color: theme.textMuted }}>
            today's price
          </div>
        </div>
      </div>
      <CardShell color={parties[1].color} pop={pop(parties[1].at)} width={520}>
        <div style={{ padding: "60px 32px" }}>
          <div style={{ fontSize: 76, fontWeight: 900, textShadow: darkOutline(2) }}>
            {parties[1].label}
          </div>
          <div style={{ fontSize: 36, color: theme.textMuted, marginTop: 14 }}>
            {parties[1].detail}
          </div>
        </div>
      </CardShell>
    </ContentArea>
  );
};

// --- Scene 3: terms -------------------------------------------------------

const TermCards: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const terms = [
    { label: "Face value", detail: "paid back at maturity", color: theme.accent },
    { label: "Coupon", detail: "interest along the way", color: theme.good },
    { label: "Maturity", detail: "when the loan ends", color: theme.warm },
  ];
  return (
    <ContentArea gap={44}>
      {terms.map((term, i) => {
        const pop = spring({
          frame: frame - at[i],
          fps,
          config: { damping: 13, mass: 0.7 },
        });
        return (
          <CardShell key={term.label} color={term.color} pop={pop} width={470}>
            <div style={{ padding: "46px 24px" }}>
              <div
                style={{ fontSize: 58, fontWeight: 900, textShadow: darkOutline(2) }}
              >
                {term.label}
              </div>
              <div style={{ fontSize: 34, color: theme.textMuted, marginTop: 14 }}>
                {term.detail}
              </div>
            </div>
          </CardShell>
        );
      })}
    </ContentArea>
  );
};

// --- Scenes 4 & 5: cashflows / example ------------------------------------
//
// One timeline component, parameterized by its cash flows, used twice here:
// once with generic labels and once with concrete numbers. It now lives in
// src/lib/components/CashflowTimeline.tsx — promoted on its second video
// (swap-basics draws both legs of a swap with it) per CLAUDE.md's needed-twice
// rule. The move took the geometry with it; what stayed behind is layout, so
// these two scenes wrap it in the ContentArea the component used to own.

const TICKS = ["today", "year 1", "year 2", "maturity"];

// --- Scene 6: discounting -------------------------------------------------
//
// The mechanism scene. Each future payment detaches from its year, slides back
// to today while shrinking by exactly its discount factor, and slots into a
// single column whose height IS the sum of the pieces. Heights are strictly
// linear in dollars (0.40 px per $) — the whole point is that the parts add up,
// so the compressive scale used by CashflowTimeline would be a lie here. The
// consequence is honest and worth seeing: the redemption is ~91% of the price.
//
// Geometry, in a 1740 x 800 block (ContentArea at paddingX 90):
//   timeline  x 0…1100 (4 slots of 275)   receipt x 1240…1740
//   baseline  y 640; tallest bar $1,050 -> 420px, top at y 220
//   ticks     y 650…691, clearing the 800px safe area by 109px
//   receipt   y 257…543, x 1240+, clear of the tallest bar (max x 995)

const DISC_YIELD = BOND_3Y.couponRate; // 5% — the yield that makes the sum $1,000
const PX_PER_DOLLAR = 0.4;
const DISC_BASELINE = 640;
const DISC_SLOT_W = 275;
const DISC_BAR_W = 64;
const DISC_TL_W = DISC_SLOT_W * 4;

const slotCenter = (i: number): number => i * DISC_SLOT_W + DISC_SLOT_W / 2;

const DISC_PAYMENTS = [
  { t: 1, amount: 50, factor: "÷ 1.05" },
  { t: 2, amount: 50, factor: "÷ 1.05²" },
  { t: 3, amount: 1050, factor: "÷ 1.05³" },
].map((p) => ({ ...p, pv: discount(p.amount, p.t, DISC_YIELD) }));

// Landing position of each piece in the stack, bottom-up in arrival order.
const DISC_LANDING = (() => {
  let below = 0;
  return DISC_PAYMENTS.map((p) => {
    const bottom = DISC_BASELINE - below;
    below += p.pv * PX_PER_DOLLAR;
    return bottom;
  });
})();
const DISC_TOTAL = DISC_PAYMENTS.reduce((s, p) => s + p.pv, 0); // 1000.00

const FLIGHT_FRAMES = 42;

const DiscountingScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [axisAt, b1, b2, b3, tagsAt, f1, f2, f3, totalAt] = at;
  const barAt = [b1, b2, b3];
  const flyAt = [f1, f2, f3];

  const axis = clamp01(
    spring({ frame: frame - axisAt, fps, config: { damping: 18, mass: 0.9 } }),
  );
  const total = clamp01(ramp(frame, totalAt, totalAt + 18));

  return (
    <ContentArea>
      <div style={{ width: 1740, height: 800, position: "relative" }}>
        {/* --- timeline ------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            top: DISC_BASELINE,
            left: 0,
            width: `${DISC_TL_W * axis}px`,
            height: 4,
            borderRadius: 2,
            background: theme.textMuted,
            opacity: 0.85,
          }}
        />
        {TICKS.map((tick, i) => {
          const show = clamp01(
            spring({
              frame: frame - axisAt - 5 * i,
              fps,
              config: { damping: 18, mass: 0.9 },
            }),
          );
          return (
            <div
              key={tick}
              style={{
                position: "absolute",
                top: DISC_BASELINE - 8,
                left: i * DISC_SLOT_W,
                width: DISC_SLOT_W,
                opacity: show,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 20,
                  margin: "0 auto",
                  borderRadius: 2,
                  background: theme.textMuted,
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  marginTop: 6,
                  fontSize: 34,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: theme.textMuted,
                  textAlign: "center",
                  textShadow: darkOutline(1),
                }}
              >
                {tick}
              </div>
            </div>
          );
        })}

        {/* --- payments: stand, fly, shrink, stack ---------------------- */}
        {DISC_PAYMENTS.map((p, i) => {
          const grow = clamp01(
            spring({
              frame: frame - barAt[i],
              fps,
              config: { damping: 15, mass: 0.8 },
            }),
          );
          if (grow <= 0) return null;
          const fly = ramp(frame, flyAt[i], flyAt[i] + FLIGHT_FRAMES);
          const value = p.amount + (p.pv - p.amount) * fly;
          const h = value * PX_PER_DOLLAR * grow;
          const cx = slotCenter(p.t) + (slotCenter(0) - slotCenter(p.t)) * fly;
          const bottom = DISC_BASELINE + (DISC_LANDING[i] - DISC_BASELINE) * fly;
          const tag = clamp01(
            interpolate(frame, [tagsAt + i * 4, tagsAt + i * 4 + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * (1 - clamp01((fly - 0.75) / 0.25)),
          );
          // Colour shifts from "a future payment" to "part of the price" as it
          // lands, so the stack reads as one thing made of three.
          const color = fly < 0.5 ? theme.good : theme.accent;
          return (
            <div key={p.t}>
              <div
                style={{
                  position: "absolute",
                  left: cx - DISC_BAR_W / 2,
                  top: bottom - h,
                  width: DISC_BAR_W,
                  height: h,
                  borderRadius: 5,
                  background: color,
                  boxShadow: `0 0 26px ${color}55`,
                  // 4px of backdrop between stacked pieces so the parts stay
                  // countable once they're touching.
                  border: `2px solid ${theme.bgBottom}`,
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: cx - 190,
                  top: bottom - h - 54,
                  width: 380,
                  textAlign: "center",
                  fontSize: 40,
                  fontWeight: 800,
                  color,
                  fontVariantNumeric: "tabular-nums lining-nums",
                  textShadow: darkOutline(2),
                }}
              >
                {usd(value, fly > 0.02 ? 2 : 0)}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: cx - 150,
                  top: bottom - h - 102,
                  width: 300,
                  textAlign: "center",
                  fontSize: 34,
                  fontWeight: 700,
                  color: theme.warm,
                  opacity: tag,
                  textShadow: darkOutline(1),
                }}
              >
                {p.factor}
              </div>
            </div>
          );
        })}

        {/* --- the sum ------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            left: slotCenter(0) + DISC_BAR_W / 2 + 28,
            top: DISC_BASELINE - DISC_TOTAL * PX_PER_DOLLAR - 34,
            fontSize: 46,
            fontWeight: 900,
            color: theme.accent,
            fontVariantNumeric: "tabular-nums lining-nums",
            textShadow: darkOutline(2),
            opacity: total,
            transform: `translateY(${(1 - total) * 16}px)`,
          }}
        >
          price today = {usd(DISC_TOTAL, 2)}
        </div>

        {/* --- receipt -------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            left: 1240,
            top: 257,
            width: 500,
          }}
        >
          {DISC_PAYMENTS.map((p, i) => {
            const show = clamp01(
              ramp(frame, flyAt[i] + FLIGHT_FRAMES * 0.75, flyAt[i] + FLIGHT_FRAMES),
            );
            return (
              <div
                key={p.t}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  height: 62,
                  fontSize: 34,
                  fontWeight: 700,
                  opacity: show,
                  transform: `translateX(${(1 - show) * -24}px)`,
                  textShadow: darkOutline(1),
                }}
              >
                <span style={{ color: theme.textMuted }}>Year {p.t}</span>
                <span style={{ fontVariantNumeric: "tabular-nums lining-nums" }}>
                  <span style={{ color: theme.textMuted }}>{usd(p.amount)}</span>
                  <span style={{ color: theme.warm }}> → </span>
                  <span style={{ color: theme.accent }}>{usd(p.pv, 2)}</span>
                </span>
              </div>
            );
          })}
          <div
            style={{
              height: 4,
              margin: "10px 0 14px",
              background: theme.panelBorder,
              opacity: total,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 44,
              fontWeight: 900,
              opacity: total,
              textShadow: darkOutline(2),
            }}
          >
            <span>Price</span>
            <span
              style={{
                color: theme.accent,
                fontVariantNumeric: "tabular-nums lining-nums",
              }}
            >
              {usd(DISC_TOTAL, 2)}
            </span>
          </div>
        </div>
      </div>
    </ContentArea>
  );
};

// --- Scene 7: yield -------------------------------------------------------
//
// Yield as the dial that balances an equation. The left side is computed with
// the real pricing function at the dial's current rate, so when the dial lands
// the two sides are equal *because the maths says so*, not because two labels
// were told to match. The "=" flips to "≠" whenever they differ by more than a
// cent, which is what makes turning the dial feel like solving for something.

// The dial itself now lives in src/lib/components/Dial.tsx (promoted on its
// second use — swap-basics turns the same gauge to find the fair swap rate).
// What stays here is the part that is about *this* scene: where the needle sits
// relative to the coupon, and what that means.

const DIAL_COUPON = BOND_3Y.couponRate;
/** Dial sweep: ±120° maps to coupon ±2%. */
const yieldAngle = (y: number): number => dialAngle(y, DIAL_COUPON, 0.02);

/** Muted at the coupon, good above it, warm below — the scene's own reading. */
const yieldColor = (y: number): string => {
  const a = yieldAngle(y);
  if (Math.abs(a) < 1) return theme.textMuted;
  return y > DIAL_COUPON ? theme.good : theme.warm;
};

const YieldDial: React.FC<{ value: number; opacity: number }> = ({
  value,
  opacity,
}) => (
  <Dial
    label="YIELD"
    value={pct(value, 1)}
    angle={yieldAngle(value)}
    color={yieldColor(value)}
    opacity={opacity}
  />
);

const EquationCard: React.FC<{
  label: string;
  value: string;
  color: string;
  opacity: number;
}> = ({ label, value, color, opacity }) => (
  <div
    style={{
      width: 620,
      background: theme.panel,
      border: `3px solid ${color}`,
      borderRadius: 24,
      boxShadow: `0 0 34px ${color}44`,
      padding: "26px 24px 30px",
      textAlign: "center",
      opacity,
      transform: `translateY(${(1 - opacity) * 20}px)`,
    }}
  >
    <div style={{ fontSize: 36, fontWeight: 700, color: theme.textMuted }}>
      {label}
    </div>
    <div
      style={{
        marginTop: 10,
        fontSize: 72,
        fontWeight: 900,
        color,
        fontVariantNumeric: "tabular-nums lining-nums",
        textShadow: darkOutline(2),
      }}
    >
      {value}
    </div>
  </div>
);

const YieldScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const [leftAt, rightAt, dialAt, stateAAt, stateBAt] = at;

  // Market price steps at each state beat; the dial then turns until the
  // discounted payments match it again.
  const target =
    frame >= stateBAt ? price3y(0.04) : frame >= stateAAt ? price3y(0.06) : price3y(0.05);
  const dialY = interpolate(
    frame,
    [stateAAt + 8, stateAAt + 38, stateBAt + 8, stateBAt + 38],
    [0.05, 0.06, 0.06, 0.04],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const left = price3y(dialY);
  const balanced = Math.abs(left - target) < 0.01;

  const fade = (f: number) => clamp01(ramp(frame, f, f + 14));
  const stateText =
    frame >= stateBAt
      ? "price above face value → yield below the 5% coupon"
      : frame >= stateAAt
        ? "price below face value → yield above the 5% coupon"
        : "at face value → yield equals the coupon";
  const stateColor =
    frame >= stateBAt ? theme.warm : frame >= stateAAt ? theme.good : theme.textMuted;
  const stateShow = fade(Math.min(stateAAt, dialAt) + 10);

  return (
    <ContentArea direction="column" gap={0}>
      <div style={{ display: "flex", alignItems: "center", gap: 40, height: 240 }}>
        <EquationCard
          label="discounted payments"
          value={usd(left, 2)}
          color={theme.accent}
          opacity={fade(leftAt)}
        />
        <div
          style={{
            width: 120,
            textAlign: "center",
            fontSize: 96,
            fontWeight: 900,
            color: balanced ? theme.good : theme.bad,
            textShadow: darkOutline(3),
            opacity: fade(rightAt + 6),
          }}
        >
          {balanced ? "=" : "≠"}
        </div>
        <EquationCard
          label="market price"
          value={usd(target, 2)}
          color={theme.warm}
          opacity={fade(rightAt)}
        />
      </div>
      {/* 43 (label) + 210 (arc) + 74 (value) = 327px of dial in a 330px row;
          240 + 330 + 90 = 660 of the 800px safe area. */}
      <div style={{ height: 330, display: "flex", alignItems: "center" }}>
        <YieldDial value={dialY} opacity={fade(dialAt)} />
      </div>
      <div
        style={{
          height: 90,
          display: "flex",
          alignItems: "center",
          fontSize: 44,
          fontWeight: 800,
          color: stateColor,
          opacity: stateShow,
          textShadow: darkOutline(2),
        }}
      >
        {stateText}
      </div>
    </ContentArea>
  );
};

// --- Scenes 8–10: the price/yield curve -----------------------------------
//
// One graph, three scenes. Scene 8 draws it; 9 and 10 mount it with
// ALREADY_DRAWN so the cut lands on the same picture instead of re-drawing it,
// which is what makes the marker's move read as continuous.
//
// Geometry: the 1520x700 SVG centres inside the 800px ContentArea (y 50…750),
// and its lowest ink — the x-axis title at plot + 130 — sits at y ≈ 718, i.e.
// 82px clear of CAPTION_SAFE_BOTTOM.

const GRAPH_W = 1520;
const GRAPH_H = 700;

const YIELD_AXIS: AxisSpec = {
  domain: [0, 0.12],
  ticks: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12],
  label: "Yield (annual %)",
  format: (v) => pct(v, 0),
};

const PRICE_AXIS: AxisSpec = {
  domain: [800, 1150],
  ticks: [800, 900, 1000, 1100],
  label: "Price ($)",
  format: (v) => usd(v, 0),
};

const fmtYield = (v: number) => pct(v, 1);
const fmtPrice = (v: number) => usd(v, 0);

const CurveScene: React.FC<{ at: number[] }> = ({ at }) => {
  const [axesAt, curveAt, curveEnd, markerAt] = at;
  return (
    <ContentArea>
      <AnimatedGraph
        width={GRAPH_W}
        height={GRAPH_H}
        x={YIELD_AXIS}
        y={PRICE_AXIS}
        draw={{ at: axesAt, frames: 26 }}
      >
        <GraphCurve
          fn={price3y}
          color={theme.accent}
          draw={{ at: curveAt, frames: curveEnd - curveAt }}
        />
        <GraphMarker
          fn={price3y}
          x={0.05}
          color={theme.warm}
          appearAt={markerAt}
          formatX={fmtYield}
          formatY={fmtPrice}
        />
      </AnimatedGraph>
    </ContentArea>
  );
};

const RateMoveScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const [compareAt, upFrom, upTo, downFrom, downTo] = at;
  // One continuous path for the marker: hold 5%, slide to 6%, hold, slide to 4%.
  const y = interpolate(
    frame,
    [upFrom, upTo, downFrom, downTo],
    [0.05, 0.06, 0.06, 0.04],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const compare = clamp01(ramp(frame, compareAt, compareAt + 16));
  // The coupon comparison has done its job once the price starts moving.
  const compareOut = 1 - clamp01(ramp(frame, upFrom, upFrom + 20));

  return (
    <ContentArea>
      <AnimatedGraph
        width={GRAPH_W}
        height={GRAPH_H}
        x={YIELD_AXIS}
        y={PRICE_AXIS}
        draw={ALREADY_DRAWN}
      >
        <GraphCurve fn={price3y} color={theme.accent} draw={ALREADY_DRAWN} />
        <GraphChip
          x={0.088}
          y={1112}
          text="new bonds pay $60"
          color={theme.warm}
          opacity={compare * compareOut}
        />
        <GraphChip
          x={0.088}
          y={1048}
          text="ours pays $50"
          color={theme.accent}
          opacity={compare * compareOut}
        />
        <GraphMarker
          fn={price3y}
          x={y}
          color={theme.warm}
          formatX={fmtYield}
          formatY={fmtPrice}
        />
      </AnimatedGraph>
    </ContentArea>
  );
};

// The level both bonds start from ($1,000, par) — the reference the two drops
// below are measured against.
const ParLine: React.FC<{ x: number; level: number; opacity: number }> = ({
  x,
  level,
  opacity,
}) => {
  const { sx, sy } = useGraph();
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity * 0.8}>
      <line
        x1={0}
        y1={sy(level)}
        x2={sx(x) * opacity}
        y2={sy(level)}
        stroke={theme.textMuted}
        strokeWidth={3}
        strokeDasharray="10 12"
      />
    </g>
  );
};

// The drop from par to the marker, drawn as a bar — the "steeper ride" made
// literal. Local to this video because it only makes sense against a reference
// level; the lib stays free of it until a second video wants the same picture.
const DropBar: React.FC<{
  x: number;
  from: number;
  to: number;
  dx: number;
  color: string;
  opacity: number;
}> = ({ x, from, to, dx, color, opacity }) => {
  const { sx, sy } = useGraph();
  if (opacity <= 0) return null;
  const px = sx(x) + dx;
  const y0 = sy(from);
  const y1 = sy(to);
  return (
    <g opacity={opacity}>
      <line
        x1={px}
        y1={y0}
        x2={px}
        y2={y0 + (y1 - y0) * opacity}
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        opacity={0.85}
      />
    </g>
  );
};

const DurationScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const [dimAt, tenYearAt, moveFrom, moveTo, chipsAt, dropsAt] = at;
  const y = interpolate(frame, [moveFrom, moveTo], [0.05, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const dim = 1 - 0.55 * clamp01(ramp(frame, dimAt, dimAt + 20));
  const legend = clamp01(ramp(frame, tenYearAt, tenYearAt + 16));
  const chips = clamp01(ramp(frame, chipsAt, chipsAt + 14));
  const drops = clamp01(ramp(frame, dropsAt, dropsAt + 22));
  const d3 = priceChangePct(BOND_3Y, 0.05, y);
  const d10 = priceChangePct(BOND_10Y, 0.05, y);

  return (
    <ContentArea>
      <AnimatedGraph
        width={GRAPH_W}
        height={GRAPH_H}
        x={YIELD_AXIS}
        y={PRICE_AXIS}
        draw={ALREADY_DRAWN}
      >
        <GraphCurve
          fn={price3y}
          color={theme.accent}
          draw={ALREADY_DRAWN}
          opacity={dim}
        />
        <GraphCurve
          fn={price10y}
          color={theme.good}
          // Plotted from where it enters the price window (it is worth $1,170
          // at a 3% yield) so the draw-on isn't spent on clipped-away path.
          range={[0.032, 0.12]}
          draw={{ at: tenYearAt, frames: 46 }}
        />
        <GraphLegend
          x={700}
          y={26}
          opacity={legend}
          entries={[
            { label: "3-year bond", color: theme.accent, opacity: dim },
            { label: "10-year bond", color: theme.good },
          ]}
        />
        {/* Par reference + the two drops measured from it, on "the longer the
            maturity, the steeper the ride". */}
        <ParLine x={y} level={1000} opacity={drops} />
        <DropBar
          x={y}
          from={1000}
          to={price3y(y)}
          dx={-26}
          color={theme.accent}
          opacity={drops}
        />
        <DropBar
          x={y}
          from={1000}
          to={price10y(y)}
          dx={26}
          color={theme.good}
          opacity={drops}
        />
        {/* Both bonds are at par at 5%, so the markers start on the same point
            and separate as the yield rises — the whole idea, drawn. */}
        <GraphMarker
          fn={price10y}
          x={y}
          color={theme.good}
          appearAt={tenYearAt + 30}
          projections={false}
          readouts={false}
        />
        <GraphMarker
          fn={price3y}
          x={y}
          color={theme.accent}
          projections={false}
          readouts={false}
        />
        <GraphChip
          x={y}
          y={price3y(y)}
          dx={56}
          dy={-48}
          anchor="start"
          text={signedPct(d3)}
          color={theme.accent}
          opacity={chips}
        />
        <GraphChip
          x={y}
          y={price10y(y)}
          dx={56}
          dy={48}
          anchor="start"
          text={signedPct(d10)}
          color={theme.good}
          opacity={chips}
        />
        {/* The rate itself, read off the x axis as it moves. */}
        <GraphChip
          x={y}
          y={PRICE_AXIS.domain[0]}
          dy={48}
          text={fmtYield(y)}
          color={theme.warm}
          opacity={legend}
        />
      </AnimatedGraph>
    </ContentArea>
  );
};

// --- Scene 11: recap ------------------------------------------------------
//
// No caption on this scene, so it uses the whole frame — a caption-less scene
// must not carry a leftover bottom padding "just in case".

const RECAP_LINES = [
  { text: "A bond is a tradable loan", color: theme.accent },
  { text: "Its price is today's value of its future payments", color: theme.good },
  { text: "Its yield is the rate that links the two", color: theme.warm },
  { text: "Rates up → price down the curve", color: theme.bad },
];

const Recap: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const next = clamp01(ramp(frame, at[4], at[4] + 24));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 26,
        padding: "0 220px",
      }}
    >
      {RECAP_LINES.map((line, i) => {
        const show = clamp01(ramp(frame, at[i], at[i] + 16));
        return (
          <div
            key={line.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              opacity: show,
              transform: `translateX(${(1 - show) * -28}px)`,
            }}
          >
            <div
              style={{
                width: 14,
                height: 62,
                borderRadius: 7,
                background: line.color,
                boxShadow: `0 0 22px ${line.color}66`,
              }}
            />
            <div
              style={{ fontSize: 54, fontWeight: 800, textShadow: darkOutline(2) }}
            >
              {line.text}
            </div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 40,
          alignSelf: "center",
          fontSize: 64,
          fontWeight: 900,
          textShadow: darkOutline(3),
          opacity: next,
          transform: `translateY(${(1 - next) * 24}px)`,
        }}
      >
        Next: Swap Basics
        <span style={{ color: theme.accent }}>.</span>
      </div>
    </div>
  );
};

// --- Composition ----------------------------------------------------------

const CAPTIONS: Record<string, string> = {
  loan: "A bond is a loan, split into tradable pieces",
  terms: "Face value · Coupon · Maturity",
  cashflows: "Pay today — collect coupons — get face value back",
  example: "$1,000 face · 5% coupon · 3 years",
  discounting: "Price = today's value of all future payments",
  yield: "Yield: the rate that makes the payments equal the price",
  curve: "Price and yield: two views of the same bond",
  ratemove: "Rates up → price down the curve",
  duration: "Longer maturity → bigger price swings (duration)",
};

export const BondBasicsVideo: React.FC = () => {
  const { scenes } = timeline();
  return (
    <Backdrop>
      <Series>
        {scenes.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <SceneAudio clip={scene.clip} />
            {scene.id === "intro" ? (
              <TitleCard title="Bond Basics" subtitle="Financial Foundations · Part 1" />
            ) : null}
            {scene.id === "loan" ? (
              // "a loan, split into tradable pieces" / "an issuer … borrows by
              // selling bonds" / "because bonds change hands, the market puts a
              // fresh price on that promise"
              <LoanDiagram
                at={beats(NARRATION.loan, [0.04, 0.1, 0.26, 0.34, 0.62], FPS)}
              />
            ) : null}
            {scene.id === "terms" ? (
              // one card per named term
              <TermCards at={beats(NARRATION.terms, [0.22, 0.47, 0.7], FPS)} />
            ) : null}
            {scene.id === "cashflows" ? (
              <ContentArea paddingX={80}>
                <CashflowTimeline
                  ticks={TICKS}
                  at={beats(NARRATION.cashflows, [0.03, 0.22, 0.38, 0.47, 0.62], FPS)}
                  flows={[
                    { t: 0, amount: -1000, label: "price", color: theme.bad },
                    { t: 1, amount: 50, label: "coupon", color: theme.good },
                    { t: 2, amount: 50, label: "coupon", color: theme.good },
                    {
                      t: 3,
                      amount: 1050,
                      label: "face value",
                      sub: "+ final coupon",
                      color: theme.good,
                    },
                  ]}
                />
              </ContentArea>
            ) : null}
            {scene.id === "example" ? (
              <ContentArea paddingX={80}>
                <CashflowTimeline
                  ticks={TICKS}
                  at={beats(NARRATION.example, [0.03, 0.15, 0.58, 0.65, 0.78], FPS)}
                  flows={[
                    { t: 0, amount: -1000, label: "−$1,000", color: theme.bad },
                    { t: 1, amount: 50, label: "+$50", color: theme.good },
                    { t: 2, amount: 50, label: "+$50", color: theme.good },
                    { t: 3, amount: 1050, label: "+$1,050", color: theme.good },
                  ]}
                />
              </ContentArea>
            ) : null}
            {scene.id === "discounting" ? (
              // axis + the three payments under "here's the pricing idea";
              // ÷(1.05)ᵗ tags on "today's dollar could be earning interest";
              // the three flights across "take every future payment / shrink it
              // back / and add the pieces up"; the total on "that sum is the
              // bond's price".
              <DiscountingScene
                at={beats(
                  NARRATION.discounting,
                  [0.02, 0.06, 0.11, 0.16, 0.36, 0.57, 0.67, 0.77, 0.9],
                  FPS,
                )}
              />
            ) : null}
            {scene.id === "yield" ? (
              // the two sides and the dial under "the single interest rate that
              // makes the discounted payments add up to the market price";
              // then "pay less…" and "pay more…"
              <YieldScene
                at={beats(NARRATION.yield, [0.05, 0.13, 0.22, 0.53, 0.82], FPS)}
              />
            ) : null}
            {scene.id === "curve" ? (
              // axes on "put price and yield on a graph"; the curve draws
              // across "as the yield rises, the price slides down this curve";
              // the marker reads out on "two views of the same bond".
              <CurveScene
                at={beats(NARRATION.curve, [0.03, 0.28, 0.56, 0.62], FPS)}
              />
            ) : null}
            {scene.id === "ratemove" ? (
              // coupon comparison on "new bonds now pay sixty dollars a year";
              // 5%→6% on "the price slides down the curve to about nine hundred
              // seventy three"; 6%→4% on "if rates fall to four percent".
              <RateMoveScene
                at={beats(NARRATION.ratemove, [0.22, 0.47, 0.63, 0.78, 0.93], FPS)}
              />
            ) : null}
            {scene.id === "duration" ? (
              // dim the 3y and draw the 10y under "a ten year bond makes you
              // wait far longer"; both markers move on "the same one point rise
              // in rates"; the change chips land on "versus under three"; the
              // par line + drop bars on "the steeper the ride".
              <DurationScene
                at={beats(
                  NARRATION.duration,
                  [0.14, 0.17, 0.44, 0.6, 0.64, 0.76],
                  FPS,
                )}
              />
            ) : null}
            {scene.id === "recap" ? (
              <Recap
                at={beats(NARRATION.recap, [0.03, 0.22, 0.42, 0.6, 0.8], FPS)}
              />
            ) : null}
            {CAPTIONS[scene.id] ? <Caption text={CAPTIONS[scene.id]} /> : null}
          </Series.Sequence>
        ))}
      </Series>
    </Backdrop>
  );
};
