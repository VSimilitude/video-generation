# Ep 2 bug pass — brief (hub feedback round 3, 2026-10-19)

Source: the family hub (kthanks.com) feedback sheet, read with `npm run
feedback` in ~/projects/kids-hub. Math (8) watched "Puff and the Kite That
Wouldn't Fly" (`PuffWind`, src/videos/wind, the August third cut) and filed
eight notes between 00:48 and 01:14 on 2026-10-19, every one 🙂, three tagged
"Something broke". Two more notes landed on the CYOA videos. Notes are quoted
VERBATIM (voice-dictated — "Claudia" = Cloudia, "Daisy" = the dandelion):

| # | time | tags | note |
|---|---|---|---|
| 1 | 00:48 | Something broke | "At the beginning, something broke the thing that broke was the dandelion at the start when puff knocked all the seeds off. It was not connected to anything and that looked weird so that's the bug." |
| 2 | 00:58 | Something broke | "When Sunny says good morning at the beginning, the word bubble is at is pointing to the wrong place" |
| 3 | 01:00 | Something broke | "A lot of word bubbles were not pointing to the right area" |
| 4 | 01:02 | — | "Birds were teleported off screen because like they went under an area that's just background so they didn't update so the parts of it were there and parts of it were not there" |
| 5 | 01:03 | Something broke | "When we see, Claudia puff, starts to teleport backwards about a bunch of times" |
| 6 | 01:06 | Something broke, Fun! | "When we go to the beach, the birds are not moving and that just kind of looks weird to me" |
| 7 | 01:10 | Fun! | "Daisy before we see Claudia for the second time are in weird spots like on air" |
| 8 | 01:14 | Fun! | "At the end, Sunny says what for no reason I think you deleted something earlier, but you did not delete his words" |

And on `DripChooses` (src/videos/drip-fork), 01:17, 🙂 Something broke + Fun! + Funny:

> "When you leave straight down like water droplets it's away from cloud as a hotel. He says oh Noah, weE"

That is the rain path (`wayDown` = rain): `ra_01_cloudia` "Everybody OUT!…"
then `ra_02_drip` "Ohhhh nooooo. WHEEE!" (kokoro af_bella 1.1). The gag
landed (Fun!, Funny) but something read as broken — the clip, or the exit
visual.

## Mandate

Fix what the kid saw, nothing else. Ep 2's script is not reopened; the
only line in play is #8. No new gags, no restaging, no plate re-rolls
unless a bug forces one. Other episodes, `src/site/`, `src/lib/` are out of
scope (if a shared `src/lib/kid` fix is the real root cause, report it and
fix it minimally, naming every episode it touches).

## Per note — what to establish, then fix

1. **Dandelion seeds (cold open).** Find the seed-head / seeds in
   `scenes/coldOpen.tsx`. "Not connected to anything" = the seeds detach
   from a head that is not where they start, or float with no stem/head
   anchor. Render a frame sequence across the knock-off and fix the anchor.
2. + 3. **Speech-bubble tails, episode-wide.** script.md (~line 1139)
   already states the rule — bubble ABOVE its speaker, `tailAt` aimed at the
   speaker whenever a bubble was moved off its mark — but it was applied to
   one scene in July. Do this mechanically: enumerate every bubble in the
   episode (every scene file), render one still at the midpoint of every
   bubble's visible window, and check the tail points at its speaker's
   body. Fix every miss. Sunny's opening "Good morning" is the named case
   (Scene 1–3 area, `a1_*_sunny`); expect many more. A builder's checklist
   of bubbles with ✓/✗ and the fix per ✗ is the deliverable here.
4. **Birds drawn under background / partly missing.** Find the bird
   component(s) and their z-order relative to painted plates and any
   foreground SVG masks. "Parts were there and parts were not" = a layer
   above them clips them. Fix layering (and whatever element is covering
   them); confirm with stills along the bird flight path.
5. **Puff teleports backwards when Cloudia first appears.** Likely a
   scene-seam discontinuity (Puff's x/y resets per scene, or a sub-scene
   loop) around Cloudia's first entrance (Scene ~21, `a2_21*`). Render a
   dense frame sequence across the seam(s) and make his position continuous.
6. **Beach birds static.** Find the beach scene (sea breeze, Scene ~15–17);
   the birds there have no motion. Give them the same gentle flight/bob the
   episode's other birds have. Keep it small — scenery-grade motion.
7. **Dandelion "in weird spots like on air" before Cloudia's second
   appearance.** The dandelion (or its seeds) floats unanchored in the
   scenes preceding Cloudia's second entrance (Scene ~29–30). Establish
   where it is supposed to be and pin it.
8. **Sunny's "Wait. What?" (`rc_16_sunny`, roll call).** The kid is right
   that the setup is not there: the 45-frame beat in front of it was asked
   to carry the whole dawning (script.md ~line 1577 flagged exactly this as
   an ear check). SHOWRUNNER TASTE CALL, log it: either (a) cut the line
   and its beat, or (b) give it a visible setup (what he just noticed must
   be on screen first). Prefer the cheapest fix that makes the line read;
   do not add new narration without logging it as a Mike question.

**DripChooses rain exit:** (i) run the Whisper gate on `ra_02_drip`'s mp3
(the ep-4 chant round used it; see src/videos/plants/ep4-decision-log.md
for the procedure). If the transcript is garbage, respell for kokoro
("Oh, no. Wheee!") and regenerate (free), preserving the old take in
scratchpad for Mike's ear. (ii) Render stills across the hotel→rain exit
(`ra_01`–`ra_03`) and check Drip actually leaves the cloud-hotel downward
with no pop/teleport. Queue the clip path as an ear check for Mike either
way — nobody in the pipeline can hear.

## How

Showrunner (fable) runs this. Spawn ONE opus scene-builder for ep 2 with
this file as its brief (quota gate before each spawn; max 2 concurrent
builders); it must render + Read its own stills and iterate (the single
biggest quality lever). It may run the DripChooses item itself or as a
second builder. Showrunner does a sampled before/after still review via its
own eyes (stills are expensive — sample the riskiest: bubble sheet, bird
path, the Cloudia seam). Builders never commit; report changed paths.

Deliverables, all under scratchpad/feedback-2026-10-19/:
- `ep2-bugpass-report.md`: per note — root cause, fix, before/after still
  paths, status; the bubble checklist; gates output.
- `decision-log.md`: every taste call (esp. #8) TOP-logged for Mike's
  overturn, with still/clip paths.
- Ear checks for Mike: a list of clip paths with one-line labels.

Gates before handing back: `npm run typecheck`, `npm run lint:hooks`,
full-scale stills of every touched scene, a quarter-scale render of
`PuffWind` end to end (and of the DripChooses rain path if touched),
`npm run site`. Update docs/HANDOFF.md's in-flight section for this round
as you go.
