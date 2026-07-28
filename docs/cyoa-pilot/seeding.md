# Seeded violations — what was planted, what was caught

Before the audits ran, the orchestrator planted five violations — one per
failure-mode family in `audit-checklist.md` — in per-path copies of the
segment files (the clean files in `segments/` were never touched). Auditors
were not told violations existed, only to assume errors do. Score: **5/5
caught, all as blockers, each by the check designed to catch it.**

| id | path | planted | caught? |
| --- | --- | --- | --- |
| S1 | pipe-cut | `mid.2`: Barnaby "leaned out from his post" and called advice down the cove — a physical act plus off-jetty speech (bible P-3) | **Yes** — blocker A1, P-3 cited twice, plus four pieces of downstream fallout traced (including that it breaks the premise E5 depends on) |
| S2 | wall-float | `[wall, float]` state doc: "a smooth green pebble from the Pipe" added to `carrying` — Pipe material on a wall path, no scene, no ledger entry | **Yes** — blocker B1, with the full argument: no scene put it there, no entry licenses it, sibling doc lacks it, and it vanishes again at `ending` |
| S3 | wall-cut | `ending.2`: the entire E5 insert deleted, and P7 + E5 references silently stripped from the `[wall, cut]` final doc | **Yes** — five-blocker cluster: empty variant slot (F), choice 2 cosmetic (C2), zero post-merge callbacks (D1/D2), P7 silently dropped (G1), orphaned state doc (B1). One violation tripped four independent checks — the checklist's redundancy is real |
| S4 | pipe-float | `d-float.2` header: "step four from eleven o'clock" (formula: five) | **Yes** — blocker A-1, by recomputing the tide formula; the auditor also noticed the scene's own prose disagreed |
| S5 | pipe-cut | `c-cut.3`: the C-V1 pipe variant rewritten so Grumble sits on his rock at twenty-five past eleven, contradicting the L-A1 timetable the tag itself cites | **Yes** — blocker E1, by recomputing both timetables; the auditor further showed "complaint six" fits *neither* schedule (P-5) |

## Sensitivity beyond the seeds

One real, unplanted slip was left in deliberately as a probe: `a-pipe.1`'s
staging says the kittiwakes sang eight "three quarters of an hour ago" at
twenty to nine (it is forty minutes). **Both** auditors with that file on
their path caught it independently (pipe-cut A3, pipe-float A-4).

The auditors also produced 60+ real findings nobody planted — see
`audits/*.md` and the consolidated fix round in `findings.md`. The strongest:
the sixteen/seventeen-bricks distance error appearing in four files, the
40−11="thirty" arithmetic slip propagated into state docs, Nan's kelp cord
teleporting back onto the peg, and the Pipe's revealed west mouth sitting
below its east mouth while the trickle Crumb navigates by runs the other way.
