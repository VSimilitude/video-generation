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
import {
  CashflowTimeline,
  cashflowBarHeight,
  type CashflowGeometry,
} from "../../lib/components/CashflowTimeline";
import { ContentArea } from "../../lib/components/ContentArea";
import { Dial, DIAL_HEIGHT, dialAngle } from "../../lib/components/Dial";
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
  EXPECTED_FLOATING,
  FIXED,
  FIXED_PAYMENTS,
  FLOATING_PAYMENTS,
  FLOATING_SETS,
  MARKET_RATE,
  NET_TO_PAYER,
  NOTIONAL,
  YEARS,
  discountFactor,
  fairSwapRate,
  price3y,
  pvFixedLeg,
  pvFloatingLeg,
  valueToPayer,
  valueToReceiver,
} from "./pricing";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene order + narration mapping. Every length is the clip plus a tail; the
// tails are raised on the scenes whose last visual beat lands with (or just
// after) the voice — the netting merge, the hedge cancellation, the dial
// settling on the fair rate, the two graph moves and the recap all want a
// moment to be read before the cut.
export function timeline() {
  return buildTimeline(
    [
      { id: "intro", clip: NARRATION.intro, minFrames: 120 },
      { id: "problem", clip: NARRATION.problem, minFrames: 180, tailFrames: 20 },
      { id: "deal", clip: NARRATION.deal, minFrames: 180, tailFrames: 20 },
      { id: "legs", clip: NARRATION.legs, minFrames: 180, tailFrames: 30 },
      { id: "netting", clip: NARRATION.netting, minFrames: 180, tailFrames: 45 },
      { id: "hedge", clip: NARRATION.hedge, minFrames: 180, tailFrames: 45 },
      { id: "pricing", clip: NARRATION.pricing, minFrames: 180, tailFrames: 45 },
      { id: "value", clip: NARRATION.value, minFrames: 180, tailFrames: 45 },
      { id: "bondlink", clip: NARRATION.bondlink, minFrames: 180, tailFrames: 30 },
      { id: "recap", clip: NARRATION.recap, minFrames: 120, tailFrames: 45 },
    ],
    FPS,
  );
}

// --- Formatting -----------------------------------------------------------
//
// One place for money and rates, so a bar label, an axis tick and a readout can
// never disagree about how a number is written.

const usd = (v: number, dp = 0): string =>
  `$${Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
/** Signed money, with a real minus sign — the netting scene lives on this. */
const usdSigned = (v: number, dp = 0): string =>
  `${v < 0 ? "−" : "+"}${usd(v, dp)}`;
/** Compact money for axis ticks and chips: −$50k / $0 / +$27k. */
const usdK = (v: number): string =>
  Math.round(v / 1000) === 0 ? "$0" : `${v < 0 ? "−" : "+"}$${Math.round(Math.abs(v) / 1000)}k`;
const pct = (v: number, dp = 0): string => `${(v * 100).toFixed(dp)}%`;

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

const Card: React.FC<{
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
      transform: `scale(${0.5 + 0.5 * clamp01(pop)})`,
      opacity: clamp01(pop),
    }}
  >
    {children}
  </div>
);

/**
 * A payment flowing between two parties. The fixed leg is drawn as a straight
 * shaft, the floating leg as a wave whose phase advances every frame — the
 * shape *is* the distinction the scene is making, so "fixed" and "floating"
 * don't have to be carried by the labels alone.
 */
const PaymentArrow: React.FC<{
  direction: "left" | "right";
  label: string;
  color: string;
  wavy?: boolean;
  width: number;
  at: number;
}> = ({ direction, label, color, wavy = false, width, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const H = 60;
  const mid = H / 2;
  const headLen = 30;
  const draw = clamp01(ramp(frame, at, at + 22));
  const head = clamp01(
    spring({ frame: frame - at - 14, fps, config: { damping: 13, mass: 0.6 } }),
  );
  const pointsRight = direction === "right";
  // Shaft runs from the tail to just short of the head, in draw order (so the
  // dash offset reveals it travelling *toward* the party being paid).
  const x0 = pointsRight ? 0 : width;
  const x1 = pointsRight ? width - headLen : headLen;
  const steps = 80;
  const d = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = wavy
      ? mid + 11 * Math.sin(t * Math.PI * 5 + frame * 0.11)
      : mid;
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const tip = pointsRight ? width : 0;
  const back = pointsRight ? width - headLen : headLen;

  return (
    <div style={{ width, opacity: draw > 0 ? 1 : 0 }}>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color,
          textAlign: "center",
          marginBottom: 12,
          opacity: draw,
          textShadow: darkOutline(1),
        }}
      >
        {label}
      </div>
      <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
          style={{ filter: `drop-shadow(0 0 18px ${color}66)` }}
        />
        <polygon
          points={`${tip},${mid} ${back},${mid - 19} ${back},${mid + 19}`}
          fill={color}
          opacity={head}
        />
      </svg>
    </div>
  );
};

// --- Scene 2: problem -----------------------------------------------------
//
// The floating-rate bill, drawn as three bars that climb with the resets, and a
// flat dashed line at what a steady payment would cost. The dashed line sits at
// FIXED × NOTIONAL — the same $40,000 the swap's fixed leg will pay two scenes
// later, so the "wanted" line is literally the answer arriving early.
//
// Geometry, in the 1740 × 800 ContentArea (paddingX 90):
//   card      x 0…470, vertically centred
//   chart     x 560…1740 (3 slots of 393)   baseline y 640
//   bars      $50,000 -> 420px (top y 220); tip labels sit 54px above a tip,
//             so the tallest reaches y 166
//   ticks     y 652…734, clearing the 800px safe area by 66px
//   dashed    y 304 ($40,000). Its label wraps to two lines at 380px wide, so
//             it is sized from its own leading and hung *above* the line
//             (y 203…290, 14px of air): x 0…380, clear of bar 1's label (starts
//             y 334) and of slot 2 (starts x 393)

const PROB_W = 1740;
const PROB_H = 800;
const PROB_CHART_X = 560;
const PROB_CHART_W = PROB_W - PROB_CHART_X;
const PROB_SLOT = PROB_CHART_W / YEARS;
const PROB_BASE = 640;
const PROB_BAR_W = 96;
/** 420px for the largest bill on screen. */
const PROB_PX = 420 / Math.max(...FLOATING_PAYMENTS);
const WANTED = FIXED * NOTIONAL;
/** The "wanted" label: two lines at 380px wide, hung above its dashed line. */
const PROB_WANT_FS = 36;
const PROB_WANT_LEADING = 1.2;
const PROB_WANT_H = Math.ceil(PROB_WANT_FS * PROB_WANT_LEADING * 2);
const PROB_WANT_GAP = 14;

const ProblemScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = clamp01(
    spring({ frame: frame - at[0], fps, config: { damping: 14, mass: 0.8 } }),
  );
  const wanted = clamp01(ramp(frame, at[4], at[4] + 22));

  return (
    <ContentArea>
      <div style={{ width: PROB_W, height: PROB_H, position: "relative" }}>
        {/* The borrower */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: (PROB_H - 300) / 2,
            width: 470,
          }}
        >
          <Card color={theme.bad} pop={card} width={470}>
            <div style={{ padding: "48px 26px" }}>
              <div style={{ fontSize: 62, fontWeight: 900, textShadow: darkOutline(2) }}>
                Company
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontSize: 46,
                  fontWeight: 800,
                  color: theme.text,
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {usd(NOTIONAL)}
              </div>
              <div style={{ marginTop: 8, fontSize: 34, color: theme.textMuted }}>
                borrowed at a floating rate
              </div>
            </div>
          </Card>
        </div>

        {/* Axis */}
        <div
          style={{
            position: "absolute",
            left: PROB_CHART_X,
            top: PROB_BASE,
            width: PROB_CHART_W * clamp01(ramp(frame, at[0], at[0] + 18)),
            height: 4,
            borderRadius: 2,
            background: theme.textMuted,
            opacity: 0.85,
          }}
        />

        {/* The interest bill, one bar per reset */}
        {FLOATING_PAYMENTS.map((amount, i) => {
          const grow = clamp01(
            spring({
              frame: frame - at[i + 1],
              fps,
              config: { damping: 15, mass: 0.8 },
            }),
          );
          const h = amount * PROB_PX * grow;
          const left = PROB_CHART_X + i * PROB_SLOT;
          return (
            <div key={i} style={{ opacity: grow }}>
              <div
                style={{
                  position: "absolute",
                  left: left + (PROB_SLOT - PROB_BAR_W) / 2,
                  top: PROB_BASE - h,
                  width: PROB_BAR_W,
                  height: h,
                  borderRadius: 6,
                  background: theme.bad,
                  boxShadow: `0 0 26px ${theme.bad}55`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left,
                  top: PROB_BASE - h - 54,
                  width: PROB_SLOT,
                  textAlign: "center",
                  fontSize: 40,
                  fontWeight: 800,
                  color: theme.bad,
                  fontVariantNumeric: "tabular-nums lining-nums",
                  textShadow: darkOutline(2),
                }}
              >
                {usd(amount)}
              </div>
              {/* Year + the reset that produced the bar */}
              <div
                style={{
                  position: "absolute",
                  left,
                  top: PROB_BASE + 12,
                  width: PROB_SLOT,
                  textAlign: "center",
                  fontSize: 34,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: theme.textMuted,
                  textShadow: darkOutline(1),
                }}
              >
                Year {i + 1}
                <div style={{ color: theme.warm, fontWeight: 800 }}>
                  resets at {pct(FLOATING_SETS[i], 1)}
                </div>
              </div>
            </div>
          );
        })}

        {/* What it wishes it were paying */}
        <div
          style={{
            position: "absolute",
            left: PROB_CHART_X,
            top: PROB_BASE - WANTED * PROB_PX,
            width: PROB_CHART_W * wanted,
            height: 0,
            borderTop: `4px dashed ${theme.good}`,
            opacity: wanted,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: PROB_CHART_X,
            // Bottom of the label block, not its baseline: the text hangs from
            // the dashed line so both lines stay above it however it wraps.
            top: PROB_BASE - WANTED * PROB_PX - PROB_WANT_H - PROB_WANT_GAP,
            height: PROB_WANT_H,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: 380,
            fontSize: PROB_WANT_FS,
            fontWeight: 800,
            color: theme.good,
            lineHeight: PROB_WANT_LEADING,
            opacity: wanted,
            textShadow: darkOutline(2),
          }}
        >
          wanted: steady {usd(WANTED)}
        </div>
      </div>
    </ContentArea>
  );
};

// --- Scene 3: deal --------------------------------------------------------
//
// Two parties, two opposing payments, and the notional sitting between them
// doing nothing — which is the point. Centre column: arrow (108) + gap (30) +
// vault (187) + gap (30) + arrow (108) = 463 of the 800px safe area.

const DealScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (d: number) =>
    spring({ frame: frame - d, fps, config: { damping: 14, mass: 0.8 } });
  const vault = clamp01(ramp(frame, at[4], at[4] + 20));
  const lock = clamp01(ramp(frame, at[5], at[5] + 18));

  const party = (label: string, detail: string, color: string, p: number) => (
    <Card color={color} pop={p} width={520}>
      <div style={{ padding: "50px 28px" }}>
        <div style={{ fontSize: 62, fontWeight: 900, textShadow: darkOutline(2) }}>
          {label}
        </div>
        <div style={{ fontSize: 34, color: theme.textMuted, marginTop: 12 }}>
          {detail}
        </div>
      </div>
    </Card>
  );

  return (
    <ContentArea gap={40} paddingX={70}>
      {party("Fixed payer", "pays a rate agreed today", theme.accent, pop(at[0]))}
      <div
        style={{
          width: 580,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          flexShrink: 0,
        }}
      >
        <PaymentArrow
          direction="right"
          label={`fixed ${pct(FIXED)} — ${usd(FIXED * NOTIONAL)} a year`}
          color={theme.accent}
          width={560}
          at={at[2]}
        />
        {/* The notional: named, sized, and deliberately inert. */}
        <div
          style={{
            width: 480,
            borderRadius: 18,
            border: `3px dashed ${theme.textMuted}`,
            background: "rgba(10, 14, 24, 0.5)",
            padding: "18px 20px 20px",
            textAlign: "center",
            opacity: vault * 0.92,
            transform: `translateY(${(1 - vault) * 16}px)`,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: theme.textMuted,
              fontVariantNumeric: "tabular-nums lining-nums",
              textShadow: darkOutline(2),
            }}
          >
            {usd(NOTIONAL)}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 1,
              color: theme.textMuted,
              opacity: lock,
            }}
          >
            notional — never moves
          </div>
        </div>
        <PaymentArrow
          direction="left"
          label="floating — resets with the market"
          color={theme.warm}
          wavy
          width={560}
          at={at[3]}
        />
      </div>
      {party("Floating payer", "pays whatever the market sets", theme.warm, pop(at[1]))}
    </ContentArea>
  );
};

// --- Scene 4: legs --------------------------------------------------------
//
// Two instances of the promoted CashflowTimeline on one screen, sharing one
// dollar scale (`maxAmount`) and a linear bar scale so "one leg is flat, the
// other climbs" is true in pixels and not just in the labels.
//
//   row header 56 + gap 12 + timeline
//   fixed    258px (up region 254 + axis 4, no ticks)  -> 326 with its header
//   floating 314px (…+ 56px tick band)                 -> 382 with its header
//   326 + 24 (row gap) + 382 = 732, clearing the 800px safe area by 68px

const LEG_GEOM: Partial<CashflowGeometry> = {
  width: 1440,
  barMax: 130,
  scale: "linear",
  // Both rows measured against the largest payment on screen, so a $40,000 bar
  // is the same height on the fixed row as on the floating one.
  maxAmount: Math.max(...FLOATING_PAYMENTS, ...FIXED_PAYMENTS),
};

const LEG_TICKS = FLOATING_SETS.map((_, i) => `Year ${i + 1}`);

const LegHeader: React.FC<{
  title: string;
  detail: string;
  color: string;
  show: number;
}> = ({ title, detail, color, show }) => (
  <div
    style={{
      width: LEG_GEOM.width,
      height: 56,
      display: "flex",
      alignItems: "baseline",
      gap: 20,
      opacity: show,
      transform: `translateX(${(1 - show) * -24}px)`,
    }}
  >
    <div
      style={{ fontSize: 46, fontWeight: 900, color, textShadow: darkOutline(2) }}
    >
      {title}
    </div>
    <div style={{ fontSize: 34, fontWeight: 600, color: theme.textMuted }}>
      {detail}
    </div>
  </div>
);

const LegsScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const [fixedHeadAt, fixedAxisAt, f1, f2, f3, floatHeadAt, floatAxisAt, g1, g2, g3] =
    at;
  const fade = (f: number) => clamp01(ramp(frame, f, f + 16));

  return (
    <ContentArea direction="column" gap={24} paddingX={90}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <LegHeader
          title="Fixed leg"
          detail={`${pct(FIXED)} of the notional, every year`}
          color={theme.accent}
          show={fade(fixedHeadAt)}
        />
        <CashflowTimeline
          {...LEG_GEOM}
          showTicks={false}
          ticks={LEG_TICKS}
          at={[fixedAxisAt, f1, f2, f3]}
          flows={FIXED_PAYMENTS.map((amount, i) => ({
            t: i,
            amount,
            label: usd(amount),
            sub: pct(FIXED, 1),
            color: theme.accent,
          }))}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <LegHeader
          title="Floating leg"
          detail="resets each period"
          color={theme.warm}
          show={fade(floatHeadAt)}
        />
        <CashflowTimeline
          {...LEG_GEOM}
          ticks={LEG_TICKS}
          at={[floatAxisAt, g1, g2, g3]}
          flows={FLOATING_PAYMENTS.map((amount, i) => ({
            t: i,
            amount,
            label: usd(amount),
            sub: pct(FLOATING_SETS[i], 1),
            color: theme.warm,
          }))}
        />
      </div>
    </ContentArea>
  );
};

// --- Scene 5: netting -----------------------------------------------------
//
// The subtraction, performed on screen. Each period starts as two bars — the
// floating payment received (up, good) and the fixed payment made (down, bad) —
// and then both shrink by the smaller of the two, in dollars, until one is gone
// and the other holds the net. Bar heights are strictly linear and the labels
// re-format an interpolated *amount*, so the arithmetic is watchable rather
// than asserted.
//
// Geometry, in a 1440 × 588 block under a 46px perspective label:
//   up region   264 (bar 180 + head 26 + gap 10 + label 48)
//   axis          4      tick band 56      down region 264
//   46 + 22 + 588 = 656 of the 800px safe area, clearing it by 144px

const NET_MAX = Math.max(...FLOATING_PAYMENTS, ...FIXED_PAYMENTS);
const NET_GEOM: Partial<CashflowGeometry> = {
  width: 1440,
  barMax: 180,
  scale: "linear",
  subLine: false,
  maxAmount: NET_MAX,
};
const NET_UP_REGION = 180 + 26 + 10 + 48;
const NET_TICK_BAND = 56;
const NET_BLOCK_H = NET_UP_REGION * 2 + 4 + NET_TICK_BAND;
const NET_SLOT = 1440 / YEARS;
const NET_BAR_W = 84;

/** Height in px of a netting bar, on the scale both directions share. */
const netBarH = (amount: number): number =>
  cashflowBarHeight(amount, NET_MAX, NET_GEOM);

/**
 * One arrow of the netting picture, sized from a live dollar amount — so the
 * bar shrinking and the label counting down are the same number.
 */
const NetBar: React.FC<{ amount: number; up: boolean; left: number }> = ({
  amount,
  up,
  left,
}) => {
  const color = up ? theme.good : theme.bad;
  const h = netBarH(amount);
  const originTop = up ? NET_UP_REGION : NET_UP_REGION + 4 + NET_TICK_BAND;
  // Below half a dollar the bar has been fully cancelled — drop it entirely so
  // the surviving side is unmistakably the only one left.
  if (amount <= 0.5) return null;
  return (
    <div style={{ position: "absolute", top: originTop, left, width: NET_SLOT }}>
      <div
        style={{
          position: "absolute",
          left: (NET_SLOT - NET_BAR_W) / 2,
          top: up ? -h : 0,
          width: NET_BAR_W,
          height: h,
          borderRadius: 6,
          background: color,
          boxShadow: `0 0 26px ${color}55`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: NET_SLOT,
          top: up ? -h - 26 - 10 - 48 : h + 26 + 10,
          textAlign: "center",
          fontSize: 40,
          fontWeight: 800,
          color,
          fontVariantNumeric: "tabular-nums lining-nums",
          textShadow: darkOutline(2),
        }}
      >
        {usdSigned(up ? amount : -amount)}
      </div>
      {/* Arrowhead at the tip */}
      <div
        style={{
          position: "absolute",
          left: (NET_SLOT - 44) / 2,
          top: up ? -h - 26 : h,
          width: 0,
          height: 0,
          borderLeft: "22px solid transparent",
          borderRight: "22px solid transparent",
          borderBottom: up ? `26px solid ${color}` : undefined,
          borderTop: up ? undefined : `26px solid ${color}`,
        }}
      />
    </div>
  );
};

const NettingScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const [labelAt, m1, m2, m3] = at;
  const label = clamp01(ramp(frame, labelAt, labelAt + 16));
  const mergeAt = [m1, m2, m3];

  return (
    <ContentArea direction="column" gap={22}>
      <div
        style={{
          width: NET_GEOM.width,
          height: 46,
          fontSize: 38,
          fontWeight: 700,
          color: theme.textMuted,
          opacity: label,
          textShadow: darkOutline(1),
        }}
      >
        From the fixed payer's seat: <span style={{ color: theme.good }}>received</span>{" "}
        minus <span style={{ color: theme.bad }}>paid</span>
      </div>
      <div style={{ width: NET_GEOM.width, height: NET_BLOCK_H, position: "relative" }}>
        {/* Axis */}
        <div
          style={{
            position: "absolute",
            top: NET_UP_REGION,
            left: 0,
            width: "100%",
            height: 4,
            borderRadius: 2,
            background: theme.textMuted,
            opacity: 0.85,
          }}
        />
        {FLOATING_PAYMENTS.map((floating, i) => {
          const fixed = FIXED_PAYMENTS[i];
          // The merge: both sides give up `min(floating, fixed)` dollars, so one
          // bar reaches zero exactly as the other reaches the net.
          const t = clamp01(ramp(frame, mergeAt[i], mergeAt[i] + 34));
          const cancelled = Math.min(floating, fixed) * t;
          const up = floating - cancelled;
          const down = fixed - cancelled;
          const left = i * NET_SLOT;
          return (
            <div key={i}>
              <NetBar amount={up} up left={left} />
              <NetBar amount={down} up={false} left={left} />
              {/* Tick: the year and the reset that set the floating side */}
              <div
                style={{
                  position: "absolute",
                  top: NET_UP_REGION - 12,
                  left,
                  width: NET_SLOT,
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
                  Year {i + 1} · floating {pct(FLOATING_SETS[i], 1)}
                </div>
              </div>
              {/* "net" tag, once this column has finished collapsing */}
              <div
                style={{
                  position: "absolute",
                  left,
                  width: NET_SLOT,
                  // Just beyond the surviving bar's tip label: bar + head (26)
                  // + gap (10) + label (48), then 44px of air.
                  top:
                    NET_TO_PAYER[i] >= 0
                      ? NET_UP_REGION - netBarH(NET_TO_PAYER[i]) - 128
                      : NET_UP_REGION +
                        4 +
                        NET_TICK_BAND +
                        netBarH(NET_TO_PAYER[i]) +
                        86,
                  textAlign: "center",
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: theme.textMuted,
                  opacity: clamp01(ramp(frame, mergeAt[i] + 26, mergeAt[i] + 40)),
                  textShadow: darkOutline(1),
                }}
              >
                {NET_TO_PAYER[i] >= 0 ? "net received" : "net paid"}
              </div>
            </div>
          );
        })}
      </div>
    </ContentArea>
  );
};

// --- Scene 6: hedge -------------------------------------------------------
//
// Three rows of exposure, two of which annihilate. The loan's floating payment
// and the swap's floating receipt are struck through *where they are*, fade
// out, and only then does the fixed row rise into the space they left, boxed as
// the net position. Nothing is asserted by a label that isn't first done by the
// motion.
//
// The cancellation is strictly sequential — strike, then fade, then collapse —
// because the two floating rows are a row-pitch apart: any converge-while-
// visible overlaps two 52px strings in one spot and both become unreadable. The
// still review caught exactly that (docs/LEARNINGS.md, swap-basics). Legibility
// invariant: at most one of the pair is above 15% opacity outside its own slot,
// and neither moves at all.
//
// Block 1440 × 542: rows of 132 at y 0 / 166 / 332. After the collapse the
// survivor holds the middle slot (y 166…298) with the net label at y 322…376,
// which centres the remaining pair in the block.

const HEDGE_ROW_H = 132;
const HEDGE_GAP = 34;
const HEDGE_BLOCK_H = HEDGE_ROW_H * 3 + HEDGE_GAP * 2 + 78;
const HEDGE_ROWS = [
  { tag: "Loan", text: "pay floating on the debt", color: theme.bad },
  { tag: "Swap", text: "receive floating", color: theme.good },
  { tag: "Swap", text: "pay fixed", color: theme.accent },
];

const HedgeScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [r1, r2, r3, cancelAt, boxAt] = at;
  const rowAt = [r1, r2, r3];
  // Three stages that do not overlap: the pair is struck through in place,
  // then fades out of the way, and only once it is gone does the survivor
  // move. Two legible rows never share a slot.
  const strike = clamp01(ramp(frame, cancelAt, cancelAt + 18));
  const gone = clamp01(ramp(frame, cancelAt + 20, cancelAt + 42));
  const rise = clamp01(ramp(frame, cancelAt + 44, cancelAt + 68));
  const box = clamp01(ramp(frame, boxAt, boxAt + 20));
  const pitch = HEDGE_ROW_H + HEDGE_GAP;

  return (
    <ContentArea>
      <div style={{ width: 1440, height: HEDGE_BLOCK_H, position: "relative" }}>
        {HEDGE_ROWS.map((row, i) => {
          const pop = clamp01(
            spring({
              frame: frame - rowAt[i],
              fps,
              config: { damping: 15, mass: 0.8 },
            }),
          );
          const floating = i < 2;
          // The cancelled pair never moves; the survivor rises a full pitch
          // into the emptied middle slot once they have faded to nothing.
          const dy = floating ? 0 : -pitch * rise;
          const opacity = floating ? pop * (1 - gone) : pop;
          if (opacity <= 0) return null;
          const boxed = !floating ? box : 0;
          return (
            <div
              key={row.text}
              style={{
                position: "absolute",
                top: i * pitch + dy,
                left: 0,
                width: 1440,
                height: HEDGE_ROW_H,
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "0 34px",
                boxSizing: "border-box",
                background: theme.panel,
                border: `3px solid ${row.color}`,
                borderRadius: 22,
                boxShadow: `0 0 ${34 + 26 * boxed}px ${row.color}${boxed > 0.5 ? "88" : "44"}`,
                opacity,
                transform: `scale(${(0.6 + 0.4 * pop) * (1 + 0.03 * boxed)})`,
              }}
            >
              <div
                style={{
                  minWidth: 150,
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: theme.textMuted,
                }}
              >
                {row.tag.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: row.color,
                  textShadow: darkOutline(2),
                }}
              >
                {row.text}
              </div>
              {/* Struck through as the pair cancels */}
              {floating ? (
                <div
                  style={{
                    position: "absolute",
                    left: 34,
                    right: 34,
                    top: HEDGE_ROW_H / 2 - 3,
                    height: 6,
                    borderRadius: 3,
                    background: theme.text,
                    transformOrigin: "left center",
                    transform: `scaleX(${strike})`,
                    opacity: 0.85,
                  }}
                />
              ) : null}
            </div>
          );
        })}
        {/* What's left */}
        <div
          style={{
            position: "absolute",
            top: pitch * 2 - pitch * rise + HEDGE_ROW_H + 24,
            left: 0,
            width: 1440,
            textAlign: "center",
            fontSize: 46,
            fontWeight: 900,
            color: theme.accent,
            opacity: box,
            transform: `translateY(${(1 - box) * 14}px)`,
            textShadow: darkOutline(2),
          }}
        >
          net position: a fixed rate loan
        </div>
      </div>
    </ContentArea>
  );
};

// --- Scene 7: pricing -----------------------------------------------------
//
// The same balance the bond video used for yield, now solving for the fixed
// rate. The left stack is PV(fixed leg) *at the dial's current rate*, so the
// stack grows as the dial turns and the two sides come level because the maths
// says so. The readout is the live difference — the swap's value to the payer —
// counting to zero.
//
// Geometry: a 466px row (title 88 + gap 12 + 300px stack + gap 12 + total 54)
// beside the 327px dial, then a 68px readout — 574 of the 800px safe area.
//
// The title box holds two lines at all times and the text sits on its bottom
// edge, so a title that wraps ("PV of the expected floating leg", which does not
// fit 420px on one line) grows upwards into reserved space instead of down
// through its own stack, and both stacks stay aligned whatever their titles do.

const PV_FAIR = pvFloatingLeg(MARKET_RATE);
const PV_TITLE_FS = 34;
const PV_TITLE_LEADING = 1.2;
/** Two lines of title, reserved for both columns. */
const PV_TITLE_H = Math.ceil(PV_TITLE_FS * PV_TITLE_LEADING * 2);
const PV_STACK_H = 300;
const PV_PX = PV_STACK_H / PV_FAIR;
const PV_DIAL_START = 0.025;

const PvStack: React.FC<{
  title: string;
  /** Payment amount for each period, before discounting. */
  payments: number[];
  color: string;
  show: number;
}> = ({ title, payments, color, show }) => {
  const pvs = payments.map((p, i) => p * discountFactor(i + 1, MARKET_RATE));
  const total = pvs.reduce((s, v) => s + v, 0);
  return (
    <div style={{ width: 420, opacity: show }}>
      <div
        style={{
          height: PV_TITLE_H,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          fontSize: PV_TITLE_FS,
          lineHeight: PV_TITLE_LEADING,
          fontWeight: 700,
          color: theme.textMuted,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div
        style={{
          height: PV_STACK_H,
          marginTop: 12,
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {pvs.map((pv, i) => (
          <div
            key={i}
            style={{
              width: 200,
              height: pv * PV_PX * show,
              background: color,
              border: `2px solid ${theme.bgBottom}`,
              boxSizing: "border-box",
              borderRadius: 5,
              boxShadow: `0 0 24px ${color}44`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          height: 54,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 900,
          color,
          fontVariantNumeric: "tabular-nums lining-nums",
          textShadow: darkOutline(2),
        }}
      >
        {usd(total, 0)}
      </div>
    </div>
  );
};

const PricingScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const [dialAt, fixedAt, floatAt, turnFrom, turnTo, zeroAt] = at;
  const fade = (f: number) => clamp01(ramp(frame, f, f + 16));

  // The dial turns from a deliberately-too-low fixed rate up to the fair one.
  const fair = fairSwapRate(EXPECTED_FLOATING, MARKET_RATE);
  const rate = interpolate(frame, [turnFrom, turnTo], [PV_DIAL_START, fair], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const pvFixed = pvFixedLeg(rate, MARKET_RATE);
  const value = PV_FAIR - pvFixed; // value of the swap to the fixed payer
  const level = Math.abs(value) < 1;

  return (
    <ContentArea direction="column" gap={40}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 80,
          height: PV_TITLE_H + 12 + PV_STACK_H + 12 + 54,
        }}
      >
        <PvStack
          title="PV of the fixed leg"
          payments={Array.from({ length: YEARS }, () => rate * NOTIONAL)}
          color={theme.accent}
          show={fade(fixedAt)}
        />
        <div style={{ height: DIAL_HEIGHT }}>
          <Dial
            label="FIXED RATE"
            value={pct(rate, 2)}
            angle={dialAngle(rate, MARKET_RATE, 0.02)}
            color={level ? theme.good : theme.warm}
            opacity={fade(dialAt)}
          />
        </div>
        <PvStack
          title="PV of the expected floating leg"
          payments={EXPECTED_FLOATING}
          color={theme.warm}
          show={fade(floatAt)}
        />
      </div>
      <div
        style={{
          height: 68,
          display: "flex",
          alignItems: "center",
          gap: 22,
          fontSize: 48,
          fontWeight: 900,
          opacity: fade(zeroAt - 10),
          textShadow: darkOutline(2),
        }}
      >
        <span style={{ color: theme.textMuted, fontWeight: 700 }}>
          value at start
        </span>
        <span
          style={{
            color: level ? theme.good : theme.warm,
            fontVariantNumeric: "tabular-nums lining-nums",
            transform: `scale(${1 + 0.08 * clamp01(ramp(frame, zeroAt, zeroAt + 12))})`,
            display: "inline-block",
          }}
        >
          {level ? usd(0) : usdSigned(value)}
        </span>
        <span
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: theme.good,
            opacity: level ? clamp01(ramp(frame, zeroAt, zeroAt + 14)) : 0,
          }}
        >
          — fair to both sides
        </span>
      </div>
    </ContentArea>
  );
};

// --- Scene 8: value -------------------------------------------------------
//
// Two mirrored lines from one function: valueToPayer, and its negation. The
// markers share a single vertical rate line — one rate, two opposite outcomes —
// and every number in a chip is the function evaluated at that rate.
//
// The 1520 × 700 SVG centres in the 800px ContentArea; its lowest ink (the
// x-axis title at plot + 130) sits at y ≈ 718, 82px clear of the caption strip.
// Plot area is 1120 × 500.

const GRAPH_W = 1520;
const GRAPH_H = 700;

const RATE_AXIS: AxisSpec = {
  domain: [0.01, 0.07],
  ticks: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07],
  label: "Market rate (annual %)",
  format: (v) => pct(v, 0),
};

const VALUE_AXIS: AxisSpec = {
  domain: [-100000, 100000],
  ticks: [-100000, -50000, 0, 50000, 100000],
  label: "Swap value ($)",
  format: usdK,
};

/** The $0 line — the level the whole scene is measured against. */
const ZeroLine: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { sy, plotW } = useGraph();
  if (opacity <= 0) return null;
  return (
    <line
      x1={0}
      y1={sy(0)}
      x2={plotW * opacity}
      y2={sy(0)}
      stroke={theme.textMuted}
      strokeWidth={3}
      strokeDasharray="10 12"
      opacity={0.8}
    />
  );
};

/** One rate, read by both sides — hence one shared vertical. */
const RateLine: React.FC<{ x: number; opacity: number }> = ({ x, opacity }) => {
  const { sx, sy, plotH } = useGraph();
  if (opacity <= 0) return null;
  return (
    <line
      x1={sx(x)}
      y1={sy(0)}
      x2={sx(x)}
      y2={plotH}
      stroke={theme.warm}
      strokeWidth={3}
      strokeDasharray="12 14"
      opacity={0.7 * opacity}
    />
  );
};

const ValueScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const [axesAt, payerAt, receiverAt, markersAt, slideFrom, slideTo, chipsAt, crossAt] =
    at;
  const r = interpolate(frame, [slideFrom, slideTo], [MARKET_RATE, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const legend = clamp01(ramp(frame, markersAt, markersAt + 16));
  const chips = clamp01(ramp(frame, chipsAt, chipsAt + 14));
  const cross = clamp01(ramp(frame, crossAt, crossAt + 16));
  const zero = clamp01(ramp(frame, axesAt + 12, axesAt + 30));

  return (
    <ContentArea>
      <AnimatedGraph
        width={GRAPH_W}
        height={GRAPH_H}
        x={RATE_AXIS}
        y={VALUE_AXIS}
        draw={{ at: axesAt, frames: 26 }}
      >
        <ZeroLine opacity={zero} />
        <GraphCurve
          fn={valueToPayer}
          color={theme.accent}
          draw={{ at: payerAt, frames: 34 }}
        />
        <GraphCurve
          fn={valueToReceiver}
          color={theme.warm}
          draw={{ at: receiverAt, frames: 34 }}
        />
        {/* Legend sits in the empty wedge below the crossing (y 380…456),
            where neither line reaches until well outside the plot. */}
        <GraphLegend
          x={380}
          y={380}
          opacity={legend}
          entries={[
            { label: "Pay fixed", color: theme.accent },
            { label: "Receive fixed", color: theme.warm },
          ]}
        />
        <RateLine x={r} opacity={legend} />
        <GraphMarker
          fn={valueToPayer}
          x={r}
          color={theme.accent}
          appearAt={markersAt}
          projections={false}
          readouts={false}
        />
        <GraphMarker
          fn={valueToReceiver}
          x={r}
          color={theme.warm}
          appearAt={markersAt}
          projections={false}
          readouts={false}
        />
        <GraphChip
          x={r}
          y={valueToPayer(r)}
          dx={60}
          dy={-40}
          anchor="start"
          text={usdK(valueToPayer(r))}
          color={theme.accent}
          opacity={chips}
        />
        <GraphChip
          x={r}
          y={valueToReceiver(r)}
          dx={60}
          dy={40}
          anchor="start"
          text={usdK(valueToReceiver(r))}
          color={theme.warm}
          opacity={chips}
        />
        {/* The rate itself, read off the x axis as the markers move. */}
        <GraphChip
          x={r}
          y={VALUE_AXIS.domain[0]}
          dy={48}
          text={pct(r, 1)}
          color={theme.warm}
          opacity={legend}
        />
        {/* Where the two sides agree: value zero, at the swap rate. */}
        <GraphChip
          x={FIXED}
          y={0}
          dy={-110}
          text={`swap rate · ${pct(FIXED)}`}
          color={theme.good}
          opacity={cross}
        />
        <CrossMark x={FIXED} opacity={cross} />
      </AnimatedGraph>
    </ContentArea>
  );
};

/** The crossing point, plus the stem tying it to its chip. */
const CrossMark: React.FC<{ x: number; opacity: number }> = ({ x, opacity }) => {
  const { sx, sy } = useGraph();
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity}>
      <line
        x1={sx(x)}
        y1={sy(0) - 78}
        x2={sx(x)}
        y2={sy(0) - 16}
        stroke={theme.good}
        strokeWidth={3}
        opacity={0.7}
      />
      <circle
        cx={sx(x)}
        cy={sy(0)}
        r={16}
        fill="none"
        stroke={theme.good}
        strokeWidth={5}
      />
    </g>
  );
};

// --- Scene 9: bondlink ----------------------------------------------------
//
// Two equivalence cards, each with the *same* price/yield curve bond-basics
// drew — same function, imported, which is the claim the scene is making. The
// graphs mount ALREADY_DRAWN (they are an echo, not a new argument); what moves
// is each card's marker, and each card moves in the direction that side wins:
// the short gains as rates rise and prices fall, the owner gains as rates fall
// and prices rise. Hence one marker slides down its curve and the other up.
//
// Geometry:
//   card    850 wide; 28 padding + 58 title + 8 + 40 subtitle + 14 + 430 graph
//           + 12 + 46 footer + 28 padding = 664, inside the 800px safe area
//   row     850 × 2 + 60 gap = 1760, inside the 1800 that paddingX 60 leaves
//   graph   780 × 430, plot 450 × 256 after the margins below
//
// The left margin stays at the library default (290) even though the plot is
// small: the y-axis readout chip is anchored to the axis and reaches x −211 at
// six characters ("$1,028"), while the rotated axis title sits at −286…−245.
// Trimming the margin to fit the plot would put the two on top of each other —
// the chip is meant to overlay the *tick labels*, not the title.
// Below the plot: tick labels reach plot + 46, the readout chip plot + 82, and
// the axis title's glyph tops plot + 98; 24 + 256 + 130 = 410 of the 430 box.

const MINI_W = 780;
const MINI_H = 430;
const MINI_MARGIN = { top: 24, right: 40, bottom: 150, left: 290 };

const MINI_YIELD_AXIS: AxisSpec = {
  domain: [0.02, 0.07],
  ticks: [0.02, 0.03, 0.04, 0.05, 0.06, 0.07],
  label: "Yield",
  format: (v) => pct(v, 0),
};

const MINI_PRICE_AXIS: AxisSpec = {
  domain: [940, 1100],
  ticks: [950, 1000, 1050, 1100],
  label: "Bond price",
  format: (v) => usd(v, 0),
};

const EquivalenceCard: React.FC<{
  title: string;
  detail: string;
  color: string;
  /** Rate the marker travels to, from the swap's fixed rate. */
  to: number;
  pop: number;
  slideFrom: number;
  slideTo: number;
}> = ({ title, detail, color, to, pop, slideFrom, slideTo }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [slideFrom, slideTo], [FIXED, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const move = price3y(y) - price3y(FIXED);
  return (
    <div
      style={{
        width: 850,
        padding: 28,
        boxSizing: "border-box",
        background: theme.panel,
        border: `3px solid ${color}`,
        borderRadius: 26,
        boxShadow: `0 0 34px ${color}44`,
        opacity: clamp01(pop),
        transform: `scale(${0.6 + 0.4 * clamp01(pop)})`,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          lineHeight: 1.2,
          color,
          textShadow: darkOutline(2),
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 32,
          fontWeight: 600,
          lineHeight: 1.25,
          color: theme.textMuted,
        }}
      >
        {detail}
      </div>
      <div style={{ marginTop: 14 }}>
        <AnimatedGraph
          width={MINI_W}
          height={MINI_H}
          x={MINI_YIELD_AXIS}
          y={MINI_PRICE_AXIS}
          margin={MINI_MARGIN}
          draw={ALREADY_DRAWN}
        >
          <GraphCurve fn={price3y} color={theme.textMuted} draw={ALREADY_DRAWN} />
          <GraphMarker
            fn={price3y}
            x={y}
            color={color}
            formatX={(v) => pct(v, 1)}
            formatY={(v) => usd(v, 0)}
          />
        </AnimatedGraph>
      </div>
      <div
        style={{
          marginTop: 12,
          height: 46,
          fontSize: 36,
          fontWeight: 800,
          color: theme.good,
          fontVariantNumeric: "tabular-nums lining-nums",
          textShadow: darkOutline(1),
        }}
      >
        price {usdSigned(move, 2)} per $1,000
        <span style={{ color: theme.textMuted, fontWeight: 600 }}> → your side gains</span>
      </div>
    </div>
  );
};

const BondLinkScene: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [aAt, aFrom, aTo, bAt, bFrom, bTo] = at;
  const pop = (d: number) =>
    spring({ frame: frame - d, fps, config: { damping: 15, mass: 0.8 } });
  return (
    <ContentArea gap={60} paddingX={60}>
      <EquivalenceCard
        title="Pay fixed ≈ short a bond"
        detail="you owe the fixed payments · rates up, prices down"
        color={theme.accent}
        to={0.05}
        pop={pop(aAt)}
        slideFrom={aFrom}
        slideTo={aTo}
      />
      <EquivalenceCard
        title="Receive fixed ≈ own a bond"
        detail="you're owed the fixed payments · rates down, prices up"
        color={theme.warm}
        to={0.03}
        pop={pop(bAt)}
        slideFrom={bFrom}
        slideTo={bTo}
      />
    </ContentArea>
  );
};

// --- Scene 10: recap ------------------------------------------------------
//
// No caption, so the whole frame is available — a caption-less scene must not
// carry a leftover bottom padding "just in case".

const RECAP_LINES = [
  { text: "A swap trades one payment stream for another", color: theme.accent },
  { text: "The notional is only a measuring stick — it never moves", color: theme.textMuted },
  { text: "The fair fixed rate makes both sides equal: value starts at zero", color: theme.good },
  { text: "Rates move, and value flows from one side to the other", color: theme.warm },
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
        padding: "0 170px",
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
            <div style={{ fontSize: 50, fontWeight: 800, textShadow: darkOutline(2) }}>
              {line.text}
            </div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 44,
          alignSelf: "center",
          textAlign: "center",
          opacity: next,
          transform: `translateY(${(1 - next) * 24}px)`,
        }}
      >
        <div style={{ fontSize: 62, fontWeight: 900, textShadow: darkOutline(3) }}>
          Bonds priced it. Swaps put it to work
          <span style={{ color: theme.accent }}>.</span>
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 3,
            color: theme.textMuted,
          }}
        >
          SERIES: FINANCIAL FOUNDATIONS
        </div>
      </div>
    </div>
  );
};

// --- Composition ----------------------------------------------------------

const CAPTIONS: Record<string, string> = {
  problem: "Floating-rate debt: the bill moves with the market",
  deal: "Fixed for floating, on a notional that never changes hands",
  legs: "Fixed leg: flat · Floating leg: resets each period (e.g. SOFR)",
  netting: "Only the net difference is exchanged",
  hedge: "Floating cancels — a fixed rate remains",
  pricing: "The fair swap rate sets both sides equal — value starts at zero",
  value: "Rates up: fixed payer gains, receiver loses — mirror images",
  bondlink: "A swap is bond exposure, repackaged",
};

export const SwapBasicsVideo: React.FC = () => {
  const { scenes } = timeline();
  return (
    <Backdrop>
      <Series>
        {scenes.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <SceneAudio clip={scene.clip} />
            {scene.id === "intro" ? (
              <TitleCard title="Swap Basics" subtitle="Financial Foundations · Part 2" />
            ) : null}
            {scene.id === "problem" ? (
              // the borrower on "a company borrows one million dollars"; the
              // three bills as the resets climb ("at a floating rate" / "when
              // rates climb, so does its interest bill"); the flat line on "the
              // company wants a steady, predictable payment instead".
              <ProblemScene
                at={beats(NARRATION.problem, [0.06, 0.3, 0.47, 0.55, 0.65], FPS)}
              />
            ) : null}
            {scene.id === "deal" ? (
              // the parties under "a deal between two parties"; the fixed arrow
              // on "one side pays a fixed rate"; the floating arrow on "the
              // other pays a floating rate"; the notional on "the same notional
              // amount"; its label on "never changes hands".
              <DealScene
                at={beats(NARRATION.deal, [0.05, 0.11, 0.24, 0.37, 0.55, 0.72], FPS)}
              />
            ) : null}
            {scene.id === "legs" ? (
              // the fixed row on "the fixed leg pays forty thousand dollars
              // every year"; the floating row's bars land one per quoted reset
              // ("three percent the first year, four and a half the next, then
              // five").
              <LegsScene
                at={beats(
                  NARRATION.legs,
                  [0.12, 0.14, 0.22, 0.26, 0.3, 0.53, 0.55, 0.64, 0.73, 0.8],
                  FPS,
                )}
              />
            ) : null}
            {scene.id === "netting" ? (
              // the perspective label under "only the difference changes
              // hands"; year 1 collapses on "the fixed payer hands over ten
              // thousand dollars"; year 2 on "five thousand flows back the
              // other way"; year 3 on "same swap, opposite flows".
              <NettingScene
                at={beats(NARRATION.netting, [0.03, 0.22, 0.58, 0.78], FPS)}
              />
            ) : null}
            {scene.id === "hedge" ? (
              // the loan row on "stack the swap on top of the company's loan";
              // receive-floating on "receives floating from the swap"; pay-fixed
              // just after; the cancellation on "those two streams cancel"; the
              // net box on "behaves exactly like a fixed rate loan".
              <HedgeScene
                at={beats(NARRATION.hedge, [0.1, 0.28, 0.4, 0.47, 0.62], FPS)}
              />
            ) : null}
            {scene.id === "pricing" ? (
              // the dial under "what should the fixed rate be?"; the fixed stack
              // on "discount the fixed payments back to today"; the floating
              // stack on "discount what the market expects"; the dial turns
              // across "the fixed rate that makes the two sides equal"; the zero
              // lands on "worth zero to both parties".
              <PricingScene
                at={beats(NARRATION.pricing, [0.06, 0.26, 0.42, 0.6, 0.8, 0.84], FPS)}
              />
            ) : null}
            {scene.id === "value" ? (
              // axes on "then rates move"; the payer line, then its mirror,
              // under "suppose market rates rise"; both markers slide 4%→5%
              // across "their side gains value"; the chips on "loses exactly as
              // much"; the crossing on "crossing at the swap rate".
              <ValueScene
                at={beats(
                  NARRATION.value,
                  [0.04, 0.14, 0.26, 0.34, 0.42, 0.58, 0.62, 0.86],
                  FPS,
                )}
              />
            ) : null}
            {scene.id === "bondlink" ? (
              // the short card on "paying fixed behaves like being short a
              // bond"; the long card on "receiving fixed behaves like owning
              // one"; each marker moves the way that side wins.
              <BondLinkScene
                at={beats(
                  NARRATION.bondlink,
                  [0.14, 0.28, 0.4, 0.44, 0.56, 0.68],
                  FPS,
                )}
              />
            ) : null}
            {scene.id === "recap" ? (
              <Recap
                at={beats(NARRATION.recap, [0.06, 0.24, 0.46, 0.66, 0.86], FPS)}
              />
            ) : null}
            {CAPTIONS[scene.id] ? <Caption text={CAPTIONS[scene.id]} /> : null}
          </Series.Sequence>
        ))}
      </Series>
    </Backdrop>
  );
};
