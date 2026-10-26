import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  CharacterFrame,
  Face,
  kidEase,
  kidTheme,
  mixHex,
  useRig,
  type CharacterProps,
} from "../../../lib/kid";

// BOOM — the thunder. Episode six's hero, he/him, born in the lobby of the
// Cloud Hotel in the same instant as Flash, out of the same crackle.
//
// ---------------------------------------------------------------------------
// THE BODY IS THE PHYSICS (script.md, Scene 9 and the physics-honesty ledger)
//
// **Size tracks DISTANCE, never emotion.** Sound spreads and softens as it
// travels, so the Boom you meet at the cloud is small, tight and sharp, and
// the Boom who arrives at the window after a long count is huge and soft. The
// one prop that says so is `distance` (0..1):
//
//   distance 0   at the source — the lobby, or right overhead (Scene 16). His
//                body is BOOM_NEAR of his natural size, his outline is a
//                crisp ink line, his two rings sit close.
//   distance 1   nine counts away (three kilometres). BOOM_FAR of his natural
//                size, no ink outline at all — a feathered edge three halos
//                deep — and his rings spread wide and pale.
//
// `distanceForCount(n)` maps a count to it (nine counts = 1; ten and more
// clamp), so an act never types a distance: it passes the count the script
// wrote down. `scale` is still there and still means FRAMING (how big the shot
// is), exactly as on every other body in the kit; `distance` is the physics on
// top of it.
//
// **Two offset concentric rings, always — never one** (STYLE, the motion-trail
// law: a single trail off a round body is a tadpole). They are the sound
// itself, drawn: they breathe outward continuously and sit offset *behind* his
// direction of travel (`heading`), which is what makes a round body read as
// moving without a single line off its back.
//
// **No arms.** His gesture rig is SCALE, APPROACH and RINGS — the Ember
// precedent (orange bars at a blob's size read as fins). A proud Boom puffs
// (`puff`), a "Present!" fires a ring burst (`burstAt`), and that is all he
// has. **He WALKS, at one pace**: two small round feet step on a fixed cadence
// (WALK_HZ) that no prop can change, because sound has one speed and so does
// he (script: 1.0 on every line, forever). `walking` only turns the steps on
// and off; it cannot hurry them.
//
// ---------------------------------------------------------------------------
// WHAT BOOM CANNOT DO (the act briefs repeat this)
//   - get faster: there is no speed prop, and WALK_HZ is a constant;
//   - be one ring, or no rings: `rings` is a strength (0.25 floor), not a count;
//   - grow because he is pleased: size comes from `distance` only;
//   - point, wave, hold anything: no arms;
//   - be sharp and far, or soft and near: `softness` is derived from
//     `distance` and is not a prop.

/** Natural body radius, in his own units, at size multiplier 1. */
export const BOOM_R = 120;
/**
 * His frame box, for `makeBodyGeometry` (`CHAR_BOX.boom`). Square and much
 * bigger than the body, because the rings and the far halos have to fit at
 * BOOM_FAR; the body is always centred in it, so stage him with `hover`.
 */
export const BOOM_BOX = 900;
/** Size multiplier at the source and nine counts out. */
export const BOOM_NEAR = 0.62;
export const BOOM_FAR = 1.9;
/** Steps per second. A constant — he walks at one pace (see the header). */
export const WALK_HZ = 1.5;

/** His colours: warm grey-violet, soft, the gentlest thing in the sky. */
export const BOOM_COLOR = {
  body: "#8d7fa3",
  light: "#b3a7c6",
  edge: "#4e4363",
  ring: "#cfc6dd",
  /** His rings on a body: a mid value, visible on a pale lobby and a dark sky. */
  ringBody: "#9a8cb6",
  /** The faceless sound crossing a bright bay needs a value of its own. */
  ringDark: "#7a6e92",
} as const;

/** Nine counts is three kilometres and "far"; ten and more clamp. */
export function distanceForCount(count: number): number {
  return Math.max(0, Math.min(1, count / 9));
}

/** The body-size multiplier `distance` buys. Exported so bubbles can clear him. */
export function boomGrow(distance: number): number {
  const d = Math.max(0, Math.min(1, distance));
  return BOOM_NEAR + (BOOM_FAR - BOOM_NEAR) * kidEase.easeInOutSine(d);
}

export type BoomProps = CharacterProps & {
  /** 0 = at the source (small, tight, sharp) .. 1 = nine counts away (huge, soft). */
  distance?: number;
  /** Step cadence on/off, 0..1. The cadence itself is fixed (WALK_HZ). */
  walking?: number;
  /**
   * Direction of travel in degrees (0 = towards frame right, 180 = towards
   * frame left). The rings trail behind it. Default 180: he arrives from the
   * sea, which is frame left in the window framing.
   */
  heading?: number;
  /** Ring strength, 0.25..1. Never 0 — he is a sound; the rings are him. */
  rings?: number;
  /** A ring burst, as a frame number (his "Present!"). */
  burstAt?: number;
  /** Proud puff, 0..1 — the body swells a few percent around a face that does not. */
  puff?: number;
  /** Draw the face. `false` = rings and body only: the rumble before we meet him. */
  face?: boolean;
  /** Draw only the rings (no body): the sound crossing the bay, faceless. */
  ringsOnly?: boolean;
  opacity?: number;
};

export const Boom: React.FC<BoomProps> = (props) => {
  const rig = useRig(props);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + (props.phase ?? 0);
  const d = Math.max(0, Math.min(1, props.distance ?? 0));
  const grow = boomGrow(d);
  const R = BOOM_R * grow * (1 + 0.05 * (props.puff ?? 0));
  const walking = Math.max(0, Math.min(1, props.walking ?? 0));
  const heading = ((props.heading ?? 180) * Math.PI) / 180;
  const rings = Math.max(0.25, Math.min(1, props.rings ?? 1));
  const showFace = props.face ?? true;

  // THE STEP. One fixed cadence; the bob rides it and the feet alternate.
  const stepPhase = t * WALK_HZ * Math.PI * 2;
  const bob = walking * Math.abs(Math.sin(stepPhase)) * 7 * grow;
  const footL = walking * Math.max(0, Math.sin(stepPhase)) * 10 * grow;
  const footR = walking * Math.max(0, -Math.sin(stepPhase)) * 10 * grow;

  // SOFTNESS IS DISTANCE. Near: a crisp ink outline. Far: no outline, three
  // feathered halos. The two cross over the middle of the range, so a mid
  // count is a little of both rather than a switch.
  const outline = Math.max(0, 1 - d * 1.6);
  const feather = Math.max(0, Math.min(1, (d - 0.15) / 0.7));
  const body = mixHex(BOOM_COLOR.body, BOOM_COLOR.ring, 0.22 * feather);

  // THE RINGS. Offset behind the heading; they breathe outward on a slow loop
  // so they never sit still (STYLE: nothing dead still), and they spread with
  // distance: near they hug him, far they are wide and pale.
  const back = { x: -Math.cos(heading), y: -Math.sin(heading) * 0.35 };
  const spread = 1.18 + 0.32 * d;
  const breathe = (k: number): number => ((t * 0.55 + k * 0.5) % 1);
  const ring = (k: number) => {
    const u = breathe(k);
    const r = R * (spread + 0.16 * k + 0.22 * u);
    const off = R * (0.1 + 0.12 * k) * (0.6 + 0.4 * u);
    const a = rings * (0.62 - 0.22 * d) * Math.sin(Math.PI * Math.min(1, u * 1.15)) + 0.12 * rings;
    return { cx: back.x * off, cy: back.y * off - R * 0.05, r, a, w: (7 - 2.5 * d) * Math.max(0.7, grow) };
  };
  const r1 = ring(0);
  const r2 = ring(1);

  // "PRESENT!": a burst — both rings kicked out fast and bright, then gone.
  const since = props.burstAt === undefined ? -1 : frame - props.burstAt;
  const burst = since >= 0 && since < 24 ? 1 - since / 24 : 0;
  const burstR = R * (1.2 + (since / 24) * 1.4);

  const W = BOOM_BOX;
  const H = BOOM_BOX;
  const face = R / BOOM_R;

  return (
    <CharacterFrame
      rig={rig}
      x={props.x}
      y={props.y}
      width={W}
      height={H}
      viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}
      scale={props.scale}
      flip={props.flip}
      zIndex={props.zIndex}
    >
      <g opacity={props.opacity ?? 1}>
        {/* The two rings — the sound. Drawn first, behind him. */}
        {[r2, r1].map((r, i) => (
          <circle
            key={i}
            cx={r.cx}
            cy={r.cy - bob}
            r={r.r}
            fill="none"
            stroke={props.ringsOnly ? BOOM_COLOR.ringDark : BOOM_COLOR.ringBody}
            strokeWidth={props.ringsOnly ? r.w * 1.6 : r.w}
            opacity={props.ringsOnly ? Math.min(1, r.a * 1.5) : r.a}
          />
        ))}
        {burst > 0 ? (
          <>
            <circle cx={0} cy={-bob} r={burstR} fill="none" stroke={kidTheme.paper} strokeWidth={9 * grow} opacity={0.8 * burst} />
            <circle cx={back.x * R * 0.12} cy={-bob} r={burstR * 1.22} fill="none" stroke={kidTheme.paper} strokeWidth={6 * grow} opacity={0.55 * burst} />
          </>
        ) : null}

        {props.ringsOnly ? null : (
          <g transform={`translate(0 ${(-bob).toFixed(2)})`}>
            {/* Feet: two small rounds that step on the one cadence. */}
            {[
              { x: -R * 0.36, lift: footL },
              { x: R * 0.36, lift: footR },
            ].map((f, i) => (
              <ellipse
                key={i}
                cx={f.x}
                cy={R * 0.9 - f.lift + bob}
                rx={R * 0.2}
                ry={R * 0.12}
                fill={mixHex(BOOM_COLOR.body, BOOM_COLOR.edge, 0.45)}
                opacity={1 - 0.6 * feather}
              />
            ))}
            {/* Feathered halos (far only): soft is three copies, not a blur. */}
            {feather > 0.01
              ? [1.16, 1.09, 1.04].map((s, i) => (
                  <ellipse
                    key={s}
                    cx={0}
                    cy={0}
                    rx={R * s}
                    ry={R * 0.94 * s}
                    fill={body}
                    opacity={feather * (0.16 + i * 0.12)}
                  />
                ))
              : null}
            {/* The body: round, a touch wider than tall, flat-filled. */}
            <ellipse
              cx={0}
              cy={0}
              rx={R}
              ry={R * 0.94}
              fill={body}
              stroke={BOOM_COLOR.edge}
              strokeWidth={6 * grow * outline}
              strokeOpacity={outline}
            />
            {/* One flat highlight, kept clear of the face (STYLE). */}
            <ellipse
              cx={-R * 0.46}
              cy={-R * 0.58}
              rx={R * 0.26}
              ry={R * 0.13}
              fill={BOOM_COLOR.light}
              opacity={0.75}
              transform={`rotate(-28 ${-R * 0.46} ${-R * 0.58})`}
            />
            {showFace ? (
              <Face
                rig={rig}
                x={0}
                y={R * 0.02}
                // A HUGE face — the series rule (60–75% of the body width).
                size={1.55 * face}
                skin={body}
                eyeSpread={1.08}
                eyeScale={1.05}
                blushColor="#e0708f"
                blushStrength={1.4}
              />
            ) : null}
          </g>
        )}
      </g>
    </CharacterFrame>
  );
};

/**
 * **Size by distance, the series of it**: where Boom is and how big he is
 * while a count runs. `u` is how far through the count the sound has got
 * (0 = the flash, 1 = arrival); `count` is the scripted count. He starts at
 * the source (small) and arrives at the window at the size the count earns.
 */
export function boomTravel(u: number, count: number): { distance: number } {
  const k = Math.max(0, Math.min(1, u));
  return { distance: distanceForCount(count) * kidEase.easeInOutSine(k) };
}
