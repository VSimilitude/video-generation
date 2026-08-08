import React from "react";
import { AbsoluteFill } from "remotion";
import { kidInkOutline, kidOutline, kidTheme, kidType } from "../../../lib/kid";
import { PIP_COLOR, Pip, type PipState } from "../scenes/Pip";

// PIP — CHARACTER SHEET. Rendered by:
//
//   npx remotion still src/videos/plants/sheet/entry.tsx PipSheet \
//       scratchpad/ep4_pip_sheet.png
//
// It bundles this file rather than `src/index.ts` on purpose (the same trick
// `npm run icons` uses): the sheet is a design artefact, not an episode, and it
// should not cost a registry entry or a composition in the gallery.
//
// It exists to be looked at by somebody who has not read the code — it ships to
// Mike sight-unseen — so every panel is labelled with the prop that produced it.

export const SHEET = { width: 1920, height: 2900, fps: 30 } as const;

const GROUND_1 = 384;

const STATES: { state: PipState; label: string; note: string }[] = [
  { state: "seed", label: "SEED", note: "cold open · in the air · fluff open" },
  { state: "planted", label: "PLANTED", note: "Sc 3 · fluff folds to a ruff" },
  { state: "sprout", label: "SPROUT", note: "Sc 14 · germination · +height" },
  { state: "leaf", label: "FIRST LEAF", note: "Sc 16 · her first pointer" },
  { state: "young", label: "YOUNG PLANT", note: "Sc 24+ · five leaves" },
];

const EMOTIONS = [
  "happy",
  "skeptical",
  "neutral",
  "proud",
  "grumpy",
  "sad",
  "excited",
  "amazed",
] as const;

const Panel: React.FC<{
  label: string;
  note?: string;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ label, note, width, height, children }) => (
  <div
    style={{
      position: "relative",
      width,
      height,
      background: "rgba(255,255,255,0.34)",
      borderRadius: 28,
      border: `4px solid ${kidTheme.ink}22`,
      overflow: "hidden",
    }}
  >
    {children}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 14,
        textAlign: "center",
        fontFamily: kidTheme.fontFamily,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2, color: kidTheme.ink }}>
        {label}
      </div>
      {note ? (
        <div style={{ fontSize: 21, fontWeight: 700, color: kidTheme.inkSoft, marginTop: 2 }}>
          {note}
        </div>
      ) : null}
    </div>
  </div>
);

const Heading: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <div style={{ fontFamily: kidTheme.fontFamily, marginBottom: 10 }}>
    <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: 3, color: kidTheme.ink }}>
      {text}
    </span>
    {sub ? (
      <span style={{ fontSize: 26, fontWeight: 700, color: kidTheme.inkSoft, marginLeft: 18 }}>
        {sub}
      </span>
    ) : null}
  </div>
);

export const PipSheet: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, ${kidTheme.skyLow} 0%, #eaf7e3 46%, #dff0d2 100%)`,
      fontFamily: kidTheme.fontFamily,
      color: kidTheme.ink,
      lineHeight: "normal",
      padding: "44px 52px",
    }}
  >
    <div
      style={{
        fontSize: kidType.title * 0.56,
        fontWeight: 900,
        letterSpacing: -1,
        color: kidTheme.paper,
        textShadow: kidInkOutline(5),
      }}
    >
      PIP — character sheet
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: kidTheme.inkSoft, marginBottom: 26 }}>
      Little Big World, episode four · dandelion seed · never travels · lean + leaf are her
      whole gesture rig
    </div>

    {/* --- growth states ---------------------------------------------------- */}
    <Heading text="GROWTH STATES" sub="capability unlocks, not a time-lapse — one ground line, one box" />
    <div style={{ display: "flex", gap: 14, marginBottom: 30 }}>
      {STATES.map(({ state, label, note }) => (
        <Panel key={state} label={label} note={note} width={358} height={540}>
          {/* One ground line across every panel, so the heights are comparable
              at a glance — which is the only thing this row is for. */}
          <div
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: GROUND_1,
              borderTop: `3px dashed ${kidTheme.ink}55`,
            }}
          />
          {/* `y` is the box CENTRE and the drawing sits on the box's bottom
              edge, so feet land at `y + PIP_BOX/2` whatever the scale — the
              same arithmetic `stand()` does. */}
          <Pip x={179} y={GROUND_1 - 230} scale={0.62} state={state} phase={state.length} emotion="happy" look="camera" />
        </Panel>
      ))}
    </div>

    {/* --- emotions ---------------------------------------------------------- */}
    <Heading text="EMOTIONS" sub="the shared rig, worn by a seed · skeptical is her resting face" />
    <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
      {EMOTIONS.map((e, i) => (
        <Panel key={e} label={e.toUpperCase()} width={220} height={356}>
          <Pip
            x={110}
            y={256 - 230}
            scale={0.5}
            state="planted"
            phase={i * 1.3}
            emotion={e}
            look="camera"
            idle={0}
          />
        </Panel>
      ))}
    </div>

    {/* --- the lean ---------------------------------------------------------- */}
    <Heading
      text="THE LEAN"
      sub="heliotropism · signed degrees about her base · fires 6× · pipLean() drifts and snaps back"
    />
    <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
      {[
        { deg: -15, label: "lean −15", note: "toward camera-left" },
        { deg: 0, label: "lean 0", note: "upright · Sc 5 wide" },
        { deg: 9, label: "lean +9", note: "drifting (Sc 5, 7, 12, 15)" },
        { deg: 15, label: "lean +15", note: "LEAN_FULL · Sc 26, permanent" },
        { deg: -6, label: "snap-back", note: "rings back through upright" },
      ].map((l, i) => (
        <Panel key={l.label} label={l.label} note={l.note} width={276} height={412}>
          <div
            style={{
              position: "absolute",
              left: 26,
              right: 26,
              top: 250,
              borderTop: `3px dashed ${kidTheme.ink}55`,
            }}
          />
          <Pip
            x={138}
            y={250 - 230}
            scale={0.5}
            state="leaf"
            lean={l.deg}
            phase={i * 2.1}
            emotion="skeptical"
            look="camera"
          />
        </Panel>
      ))}
      <Panel label="tremble 1" note="straining (Sc 3) · kitchen at full roar (Sc 24)" width={276} height={412}>
        <div
          style={{
            position: "absolute",
            left: 26,
            right: 26,
            top: 250,
            borderTop: `3px dashed ${kidTheme.ink}55`,
          }}
        />
        <Pip x={138} y={250 - 230} scale={0.5} state="planted" tremble={1} phase={4.4} emotion="grumpy" look="camera" />
      </Panel>
    </div>

    {/* --- the pointer -------------------------------------------------------- */}
    <Heading text="THE LEAF-POINT" sub="her first pointer, unlocked Sc 16 · degrees from horizontal" />
    <div style={{ display: "flex", gap: 12, marginBottom: 30, alignItems: "flex-start" }}>
      {[
        { p: undefined, label: "at rest", note: "before Sc 16 she has none" },
        { p: 0, label: "point 0°", note: "level — 'You. Sky.'" },
        { p: 52, label: "point +52°", note: "up at the Sun (Sc 23)" },
        { p: -34, label: "point −34°", note: "down at the dirt (Sc 16)" },
        { p: 52, label: "left side", note: "pointSide='left'", left: true },
      ].map((l, i) => (
        <Panel key={l.label} label={l.label} note={l.note} width={340} height={412}>
          <Pip
            x={170}
            y={254 - 230}
            scale={0.5}
            state="leaf"
            point={l.p}
            pointSide={l.left ? "left" : "right"}
            phase={i * 1.9}
            emotion="happy"
            look="camera"
          />
        </Panel>
      ))}
    </div>

    {/* --- the silhouette test ------------------------------------------------ */}
    <Heading
      text="SILHOUETTE, MIRRORED"
      sub="STYLE's test: flatten to a solid shape and look at it next to its own mirror — no taper, no tail, symmetric about the vertical"
    />
    <div style={{ display: "flex", gap: 12 }}>
      {(["seed", "planted", "sprout", "young"] as PipState[]).map((state, i) =>
        [false, true].map((mirror) => (
          <Panel
            key={`${state}${mirror}`}
            label={mirror ? `${state} ↔` : state}
            width={228}
            height={392}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                filter: "brightness(0) saturate(0)",
                transform: mirror ? "scaleX(-1)" : undefined,
              }}
            >
              <Pip
                x={114}
                y={258 - 230}
                scale={0.46}
                state={state}
                phase={i * 2.4}
                emotion="happy"
                idle={0}
              />
            </div>
          </Panel>
        )),
      )}
    </div>

    <div
      style={{
        marginTop: 22,
        fontSize: 24,
        fontWeight: 700,
        color: kidTheme.inkSoft,
        textShadow: kidOutline(2),
      }}
    >
      palette · seed {PIP_COLOR.seed} · shade {PIP_COLOR.seedShade} · stem {PIP_COLOR.stem} ·
      leaf {PIP_COLOR.leaf} · outline {kidTheme.ink} (never black)
    </div>
  </AbsoluteFill>
);
