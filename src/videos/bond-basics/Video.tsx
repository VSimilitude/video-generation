import React from "react";
import {
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../../lib/components/Backdrop";
import { Caption } from "../../lib/components/Caption";
import { ContentArea } from "../../lib/components/ContentArea";
import { TitleCard } from "../../lib/components/TitleCard";
import { SceneAudio, buildTimeline, type NarrationClip } from "../../lib/narration";
import { theme, darkOutline } from "../../lib/theme";
import { NARRATION } from "./narrationManifest";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene order + narration mapping. The timeline stretches each scene to fit
// its clip, so total duration always tracks the generated audio. minFrames is
// only a floor for scenes that would otherwise flash by.
export function timeline() {
  return buildTimeline(
    [
      { id: "intro", clip: NARRATION.intro, minFrames: 120 },
      { id: "loan", clip: NARRATION.loan, minFrames: 180 },
      { id: "terms", clip: NARRATION.terms, minFrames: 180 },
      { id: "cashflows", clip: NARRATION.cashflows, minFrames: 180 },
      { id: "example", clip: NARRATION.example, minFrames: 180 },
      { id: "priceyield", clip: NARRATION.priceyield, minFrames: 180 },
      { id: "outro", clip: NARRATION.outro, minFrames: 120, tailFrames: 30 },
    ],
    FPS,
  );
}

// --- Beat timing ----------------------------------------------------------
//
// Element entrances inside a scene are staggered (docs/STYLE.md), which needs
// per-element frame numbers. Rather than eyeballing those against a take —
// which rots the moment a line is reworded — each beat is expressed as a
// fraction of *that scene's own clip length* and resolved against the
// generated manifest. Re-run `npm run narration` and every stagger moves with
// the voice, exactly like the scene lengths do.
function beats(clip: NarrationClip, fractions: number[]): number[] {
  const frames = clip.durationSeconds * FPS;
  return fractions.map((f) => Math.round(f * frames));
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
  const p = Math.max(0, Math.min(1, grow));
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

// --- Scene: loan ----------------------------------------------------------

const LoanDiagram: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.8 } });
  const parties = [
    { label: "Issuer", detail: "borrows the money", color: theme.accent, at: at[0] },
    { label: "Investor", detail: "holds the bond", color: theme.good, at: at[1] },
  ];
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
          gap: 78,
          flexShrink: 0,
        }}
      >
        <FlowArrow
          direction="left"
          label="money"
          color={theme.good}
          delay={at[2]}
        />
        <FlowArrow
          direction="right"
          label="bond"
          color={theme.accent}
          delay={at[3]}
        />
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

// --- Scene: terms ---------------------------------------------------------

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
              <div style={{ fontSize: 32, color: theme.textMuted, marginTop: 14 }}>
                {term.detail}
              </div>
            </div>
          </CardShell>
        );
      })}
    </ContentArea>
  );
};

// --- Scene: cashflows / example ------------------------------------------
//
// One timeline component, parameterized by its cash flows, used twice in this
// video: once with generic labels and once with concrete numbers. Kept local
// to the video per the needed-twice rule in CLAUDE.md — the planned swap video
// wants the same picture, and promoting it to src/lib/ at that point should be
// a file move, so the props stay generic (no bond vocabulary in the API).

type CashFlow = {
  /** Slot index along the axis; also indexes `ticks`. */
  t: number;
  /**
   * Signed magnitude. The sign picks the direction (positive = received, drawn
   * upward), and |amount| drives the bar height on a compressed scale so a
   * small coupon next to a large redemption is still legible.
   */
  amount: number;
  /** Text at the arrow's tip. */
  label: string;
  /** Optional smaller second line under the label. */
  sub?: string;
  color: string;
};

const BAR_MIN = 84;
const BAR_MAX = 200;
const HEAD = 26;
const LABEL_H = 48; // 38px * 1.25 line-height, rounded up
const SUB_H = 40; // 30px * 1.3, rounded up (worst case: every flow has a sub)
const LABEL_GAP = 10;
// Space under the axis owned by the year labels: the 20px tick mark straddles
// the axis (8px of it below), then a 6px gap, then a 28px * 1.2 = 34px label —
// 48px in all, plus slack. Downward flows start below this band so a bar can
// never land on a year label.
const TICK_BAND = 56;
const AXIS_H = 4;
// Worst-case space one side of the axis can consume: tallest bar + arrowhead +
// a two-line tip label.
const FLOW_REGION = LABEL_H + SUB_H + LABEL_GAP + HEAD + BAR_MAX; // 324
// 324 above the axis + 4 axis + 56 tick band + 324 below = 708px, which clears
// the 800px ContentArea by 92px.
const TIMELINE_H = FLOW_REGION * 2 + AXIS_H + TICK_BAND;
const TIMELINE_W = 1560;

function barHeight(amount: number, maxAbs: number): number {
  const ratio = Math.min(1, Math.abs(amount) / maxAbs);
  // Compressive (sub-linear) so a 50 next to a 1050 is still ~120px tall.
  return BAR_MIN + (BAR_MAX - BAR_MIN) * Math.pow(ratio, 0.45);
}

const CashflowTimeline: React.FC<{
  flows: CashFlow[];
  ticks: string[];
  /** Entrance frame for the axis, then one per flow (in `flows` order). */
  at: number[];
}> = ({ flows, ticks, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const axis = spring({
    frame: frame - at[0],
    fps,
    config: { damping: 18, mass: 0.9 },
  });
  const maxAbs = Math.max(...flows.map((f) => Math.abs(f.amount)));
  const slotW = TIMELINE_W / ticks.length;
  const axisTop = FLOW_REGION;

  return (
    <ContentArea paddingX={80}>
      <div style={{ width: TIMELINE_W, height: TIMELINE_H, position: "relative" }}>
        {/* Axis */}
        <div
          style={{
            position: "absolute",
            top: axisTop,
            left: 0,
            width: `${100 * Math.max(0, Math.min(1, axis))}%`,
            height: AXIS_H,
            borderRadius: 2,
            background: theme.textMuted,
            opacity: 0.85,
          }}
        />
        {/* Ticks */}
        {ticks.map((tick, i) => {
          const show = spring({
            frame: frame - at[0] - 6 * i,
            fps,
            config: { damping: 18, mass: 0.9 },
          });
          return (
            <div
              key={tick}
              style={{
                position: "absolute",
                top: axisTop - 12,
                left: i * slotW,
                width: slotW,
                opacity: Math.max(0, show),
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
                  fontSize: 28,
                  fontWeight: 600,
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
        {/* Flows */}
        {flows.map((flow, i) => {
          const grow = spring({
            frame: frame - at[i + 1],
            fps,
            config: { damping: 15, mass: 0.8 },
          });
          const p = Math.max(0, Math.min(1, grow));
          const up = flow.amount >= 0;
          const h = barHeight(flow.amount, maxAbs);
          // Upward flows leave from the axis; downward ones start under the
          // tick band so they never sit on top of a year label.
          const originTop = up ? axisTop : axisTop + AXIS_H + TICK_BAND;
          return (
            <div
              key={`${flow.t}-${flow.label}`}
              style={{
                position: "absolute",
                top: originTop,
                left: flow.t * slotW,
                width: slotW,
                height: 0,
                opacity: Math.max(0, grow),
              }}
            >
              {/* Shaft */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: -15,
                  width: 30,
                  height: h * p,
                  bottom: up ? 0 : undefined,
                  top: up ? undefined : 0,
                  borderRadius: 6,
                  background: flow.color,
                  boxShadow: `0 0 26px ${flow.color}55`,
                }}
              />
              {/* Head */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: -22,
                  bottom: up ? h * p : undefined,
                  top: up ? undefined : h * p,
                  width: 0,
                  height: 0,
                  borderLeft: "22px solid transparent",
                  borderRight: "22px solid transparent",
                  borderBottom: up ? `${HEAD}px solid ${flow.color}` : undefined,
                  borderTop: up ? undefined : `${HEAD}px solid ${flow.color}`,
                }}
              />
              {/* Label at the tip */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  width: slotW,
                  bottom: up ? h * p + HEAD + LABEL_GAP : undefined,
                  top: up ? undefined : h * p + HEAD + LABEL_GAP,
                  textAlign: "center",
                  color: flow.color,
                  textShadow: darkOutline(2),
                }}
              >
                <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.25 }}>
                  {flow.label}
                </div>
                {flow.sub ? (
                  <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.3 }}>
                    {flow.sub}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </ContentArea>
  );
};

const TICKS = ["today", "year 1", "year 2", "maturity"];

// --- Scene: priceyield ----------------------------------------------------

const PriceYield: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [barsAt, triggerAt, moveFrom, moveTo] = at;

  const trigger = spring({
    frame: frame - triggerAt,
    fps,
    config: { damping: 13, mass: 0.7 },
  });
  // Continuous motion, so interpolate rather than a spring (docs/STYLE.md).
  const swing = interpolate(frame, [moveFrom, moveTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const TRACK = 320;
  const bars = [
    {
      label: "Price",
      color: theme.bad,
      glyph: "▼",
      from: 0.92,
      to: 0.42,
      delay: barsAt,
    },
    {
      label: "Yield",
      color: theme.good,
      glyph: "▲",
      from: 0.42,
      to: 0.92,
      delay: barsAt + 8,
    },
  ];

  return (
    <ContentArea direction="column" gap={56}>
      <div
        style={{
          padding: "18px 32px",
          borderRadius: 999,
          background: theme.panel,
          border: `3px solid ${theme.warm}`,
          boxShadow: `0 0 30px ${theme.warm}44`,
          fontSize: 38,
          fontWeight: 800,
          color: theme.warm,
          textShadow: darkOutline(1),
          transform: `translateY(${(1 - Math.max(0, trigger)) * -24}px)`,
          opacity: Math.max(0, trigger),
        }}
      >
        ↑ new bonds pay more
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 200 }}>
        {bars.map((bar) => {
          const rise = spring({
            frame: frame - bar.delay,
            fps,
            config: { damping: 16, mass: 0.9 },
          });
          const level = bar.from + (bar.to - bar.from) * swing;
          const h = TRACK * level * Math.max(0, Math.min(1, rise));
          return (
            <div key={bar.label} style={{ opacity: Math.max(0, rise) }}>
              <div
                style={{
                  width: 230,
                  height: TRACK,
                  display: "flex",
                  alignItems: "flex-end",
                  borderBottom: `4px solid ${theme.panelBorder}`,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: h,
                    borderRadius: "18px 18px 0 0",
                    background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.color}88 100%)`,
                    boxShadow: `0 0 34px ${bar.color}55`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 18,
                    fontSize: 40,
                    color: theme.outline,
                    opacity: 1,
                  }}
                >
                  <span style={{ opacity: 0.35 * swing + 0.15 }}>{bar.glyph}</span>
                </div>
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontSize: 48,
                  fontWeight: 900,
                  textAlign: "center",
                  color: bar.color,
                  textShadow: darkOutline(2),
                }}
              >
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>
    </ContentArea>
  );
};

// --- Scene: outro ---------------------------------------------------------
//
// No caption on this scene, so it uses the whole frame — a caption-less scene
// must not carry a leftover bottom padding "just in case".
const Outro: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = [
    { label: "Face value", color: theme.accent },
    { label: "Coupon", color: theme.good },
    { label: "Maturity", color: theme.warm },
  ];
  const next = interpolate(frame, [at[3], at[3] + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
      }}
    >
      <div style={{ display: "flex", gap: 36 }}>
        {recap.map((item, i) => {
          const pop = spring({
            frame: frame - at[i],
            fps,
            config: { damping: 14, mass: 0.8 },
          });
          return (
            <CardShell key={item.label} color={item.color} pop={pop} width={420}>
              <div
                style={{
                  padding: "40px 20px",
                  fontSize: 52,
                  fontWeight: 900,
                  textShadow: darkOutline(2),
                }}
              >
                {item.label}
              </div>
            </CardShell>
          );
        })}
      </div>
      <div
        style={{
          fontSize: 62,
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
  priceyield: "Price and yield move in opposite directions",
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
              // "…just a loan" / "an issuer borrows by selling bonds" /
              // "whoever holds the bond is the lender"
              <LoanDiagram at={beats(NARRATION.loan, [0.04, 0.1, 0.36, 0.56])} />
            ) : null}
            {scene.id === "terms" ? (
              // one card per named term
              <TermCards at={beats(NARRATION.terms, [0.22, 0.47, 0.7])} />
            ) : null}
            {scene.id === "cashflows" ? (
              <CashflowTimeline
                ticks={TICKS}
                at={beats(NARRATION.cashflows, [0.03, 0.22, 0.38, 0.47, 0.62])}
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
            ) : null}
            {scene.id === "example" ? (
              <CashflowTimeline
                ticks={TICKS}
                at={beats(NARRATION.example, [0.03, 0.15, 0.58, 0.65, 0.78])}
                flows={[
                  { t: 0, amount: -1000, label: "−$1,000", color: theme.bad },
                  { t: 1, amount: 50, label: "+$50", color: theme.good },
                  { t: 2, amount: 50, label: "+$50", color: theme.good },
                  { t: 3, amount: 1050, label: "+$1,050", color: theme.good },
                ]}
              />
            ) : null}
            {scene.id === "priceyield" ? (
              <PriceYield
                at={beats(NARRATION.priceyield, [0.05, 0.32, 0.55, 0.85])}
              />
            ) : null}
            {scene.id === "outro" ? (
              // three recap cards under "a price, a coupon, and a maturity",
              // then the sign-off under "Next time: swaps…"
              <Outro at={beats(NARRATION.outro, [0.1, 0.26, 0.4, 0.58])} />
            ) : null}
            {CAPTIONS[scene.id] ? <Caption text={CAPTIONS[scene.id]} /> : null}
          </Series.Sequence>
        ))}
      </Series>
    </Backdrop>
  );
};
