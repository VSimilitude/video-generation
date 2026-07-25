// Narration script for the pipeline demo. Run `npm run narration` after
// editing — unchanged lines are served from cache.
export default {
  voice: "af_heart",
  speed: 1.0,
  lines: {
    intro:
      "Welcome to the studio. Every video in this suite is generated from code, with the narration synthesized at build time.",
    pipeline:
      "The pipeline has three steps. We write the script as plain text. Kokoro turns each line into speech. Then Remotion renders the visuals around it.",
    timing:
      "Pacing is driven by the audio. Each scene stretches to fit its narration line, plus a short breath at the end, so the visuals always keep up with the voice.",
    outro:
      "And that's the whole loop. New topic, new script, same pipeline — getting a little better every video.",
  },
};
