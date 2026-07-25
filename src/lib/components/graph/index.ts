// Shared, video-agnostic graph pieces for the suite.
//
//   <AnimatedGraph width height x={axis} y={axis} draw={{at, frames}}>
//     <GraphCurve fn={f} color draw={{at, frames}} />
//     <GraphMarker fn={f} x={animatedX} color appearAt />
//     <GraphChip x y dx dy text color />
//     <GraphLegend entries={[{label, color}]} x y />
//   </AnimatedGraph>
//
// Axes draw themselves in, curves are sampled from a real function and drawn on
// with the frame, and markers read live values off the curve. See
// docs/STYLE.md → "Animation must mean something".

export {
  AnimatedGraph,
  ALREADY_DRAWN,
  GRAPH_MARGIN,
  // Exported so a scene can check the graph's lowest ink against
  // CAPTION_SAFE_BOTTOM arithmetically instead of re-deriving the number.
  X_TITLE_BASELINE,
  graphType,
  drawProgress,
  useGraph,
  type AxisSpec,
  type DrawSpec,
  type GraphMargin,
} from "./AnimatedGraph";
export { GraphCurve } from "./GraphCurve";
export { GraphMarker, GraphChip, GraphLegend, chipWidth } from "./GraphMarker";
