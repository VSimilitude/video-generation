import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, darkOutline } from "../theme";

// A payment timeline: an axis with labelled ticks, and arrows leaving it — up
// for money received, down for money paid.
//
// Promoted to src/lib/ on its second video (CLAUDE.md's needed-twice rule):
// bond-basics draws a bond's cash flows with it (twice, same geometry, generic
// labels then concrete numbers), swap-basics draws the two legs of a swap.
// The API is deliberately vocabulary-free — `t` / `amount` / `label`, no bonds
// and no legs — so the next instrument gets it for free.
//
// Two things the caller owns, on purpose:
//
//  - **Layout.** The component renders a plain positioned block of a known
//    size; wrap it in `<ContentArea>` (or stack two of them) yourself. It used
//    to wrap itself, which made "two of these on one screen" impossible.
//  - **The dollar scale.** `maxAmount` defaults to the largest flow *in this
//    instance*, which is wrong the moment two timelines have to be compared:
//    swap-basics passes the same `maxAmount` to both legs so a $40,000 bar is
//    the same height on both rows. Same reason `scale: "linear"` exists — the
//    compressive default keeps a $50 coupon visible beside a $1,050
//    redemption, but it would flatten the difference between $30,000 and
//    $50,000 that the floating leg exists to show.
//
// Height is derived, never guessed: `cashflowTimelineHeight()` sums the same
// bands the component renders, so a caller can check its stack against
// CAPTION_SAFE_BOTTOM arithmetically (docs/STYLE.md → Captions).

export type CashFlow = {
  /** Slot index along the axis; also indexes `ticks`. */
  t: number;
  /**
   * Signed magnitude. The sign picks the direction (positive = received, drawn
   * upward), and |amount| drives the bar height.
   */
  amount: number;
  /** Text at the arrow's tip. */
  label: string;
  /** Optional smaller second line under the label. */
  sub?: string;
  color: string;
};

export type CashflowScale = "compressive" | "linear";

export type CashflowGeometry = {
  /** Overall block width. Slots divide it evenly, one per tick. */
  width: number;
  /** Bar length for the smallest flow ("compressive" only). */
  barMin: number;
  /** Bar length for `maxAmount`. */
  barMax: number;
  /**
   * "compressive" — (|a|/max)^0.45 between barMin and barMax, so a small flow
   * next to a huge one stays legible (bond-basics: $50 beside $1,050).
   * "linear" — length is strictly proportional to |a|, so bars can be compared
   * and subtracted by eye (swap-basics' legs and netting).
   */
  scale: CashflowScale;
  /** The amount that maps to `barMax`. Set it when two timelines share a scale. */
  maxAmount?: number;
  /**
   * Reserve room under every tip label for a second line, whether or not this
   * instance uses one. Default true, and deliberately not derived from the
   * flows: bond-basics cuts between two timelines where only the first has a
   * `sub`, and they must land on identical geometry or the cut jumps.
   */
  subLine: boolean;
  /** Draw the tick marks and their labels under the axis. */
  showTicks: boolean;
};

const DEFAULTS: CashflowGeometry = {
  width: 1560,
  barMin: 84,
  barMax: 200,
  scale: "compressive",
  subLine: true,
  showTicks: true,
};

const HEAD = 26;
const LABEL_H = 48; // 38px * 1.25 line-height, rounded up
const SUB_H = 40; // 30px * 1.3, rounded up
const LABEL_GAP = 10;
// Space under the axis owned by the tick labels: the 20px tick mark straddles
// the axis (8px of it below), then a 6px gap, then a 34px * 1.2 = 41px label —
// 55px in all, inside the 56px band. Downward flows start below this band so a
// bar can never land on a tick label.
const TICK_BAND = 56;
const AXIS_H = 4;

function geom(opts?: Partial<CashflowGeometry>): CashflowGeometry {
  return { ...DEFAULTS, ...opts };
}

/** Worst-case height one side of the axis can consume. */
function flowRegion(g: CashflowGeometry): number {
  return LABEL_H + (g.subLine ? SUB_H : 0) + LABEL_GAP + HEAD + g.barMax;
}

/**
 * Total rendered height of the block, summed from the bands it draws.
 *
 * bond-basics (both flows and both directions, subs reserved, ticks shown):
 *   324 above + 4 axis + 56 ticks + 324 below = 708px, clearing the 800px
 *   ContentArea by 92px.
 */
export function cashflowTimelineHeight(
  flows: CashFlow[],
  opts?: Partial<CashflowGeometry>,
): number {
  const g = geom(opts);
  const region = flowRegion(g);
  const up = flows.some((f) => f.amount >= 0) ? region : 0;
  const down = flows.some((f) => f.amount < 0) ? region : 0;
  return up + AXIS_H + (g.showTicks ? TICK_BAND : 0) + down;
}

/** Bar length in px for `amount`, on the given scale. Exported so a scene that
 * animates bars *into* a timeline's geometry (swap-basics' netting merge) uses
 * the identical function rather than a copy that can drift. */
export function cashflowBarHeight(
  amount: number,
  maxAbs: number,
  opts?: Partial<CashflowGeometry>,
): number {
  const g = geom(opts);
  const ratio = Math.min(1, Math.abs(amount) / maxAbs);
  if (g.scale === "linear") return g.barMax * ratio;
  return g.barMin + (g.barMax - g.barMin) * Math.pow(ratio, 0.45);
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export const CashflowTimeline: React.FC<
  {
    flows: CashFlow[];
    ticks: string[];
    /** Entrance frame for the axis, then one per flow (in `flows` order). */
    at: number[];
  } & Partial<CashflowGeometry>
> = ({ flows, ticks, at, ...opts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = geom(opts);
  const axis = spring({
    frame: frame - at[0],
    fps,
    config: { damping: 18, mass: 0.9 },
  });
  const maxAbs = g.maxAmount ?? Math.max(...flows.map((f) => Math.abs(f.amount)));
  const slotW = g.width / ticks.length;
  const region = flowRegion(g);
  const axisTop = flows.some((f) => f.amount >= 0) ? region : 0;
  const height = cashflowTimelineHeight(flows, opts);

  return (
    <div style={{ width: g.width, height, position: "relative" }}>
      {/* Axis */}
      <div
        style={{
          position: "absolute",
          top: axisTop,
          left: 0,
          width: `${100 * clamp01(axis)}%`,
          height: AXIS_H,
          borderRadius: 2,
          background: theme.textMuted,
          opacity: 0.85,
        }}
      />
      {/* Ticks */}
      {g.showTicks
        ? ticks.map((tick, i) => {
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
          })
        : null}
      {/* Flows */}
      {flows.map((flow, i) => {
        const grow = spring({
          frame: frame - at[i + 1],
          fps,
          config: { damping: 15, mass: 0.8 },
        });
        const p = clamp01(grow);
        const up = flow.amount >= 0;
        const h = cashflowBarHeight(flow.amount, maxAbs, opts);
        // Upward flows leave from the axis; downward ones start under the tick
        // band so they never sit on top of a tick label.
        const originTop = up
          ? axisTop
          : axisTop + AXIS_H + (g.showTicks ? TICK_BAND : 0);
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
  );
};
