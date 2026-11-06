# Judging

Scores and reasons are quoted from each judge's final lines. Each model used one T3 thread across all rounds and was re-scored after every change. Judges were not shown each other's scores, and this file was written only after the last round. Staying in one thread means each judge remembered its own earlier reviews.

| Judge | Provider / model | T3 thread |
|---|---|---|
| Sol 6.1 | `codex / gpt-6.1-sol` | `mcp:6a6f83b7-217a-4717-abf0-aa76254cb2fa` |
| Opus 5.5 | `claudeAgent / claude-opus-5-5` | `mcp:79e4a69c-68d9-456d-ad9c-b5976d0e647e` |
| Grok | `grok / grok-4.7` | `mcp:ff42254a-4a7f-476b-8852-aa52bb9858d4` |

## Round 1

| Judge | Score | Reason |
|---|---|---|
| Sol 6.1 | 7.5/10 | "All required task operations and persistence worked, with no scope creep or functional bugs found. The cream-and-green design is cohesive and polished, but the oversized introduction pushes tasks down and several labels are unnecessarily tiny. Animations provide modest polish rather than exceptional flair; CSS and JavaScript both honor reduced motion on inspection." |
| Opus 5.5 | 6/10 | "All scope items work, there is no scope creep, and reduced-motion handling is correct. The static design is attractive, but the animations are only short basic fades and one scale pop, which misses the "fancy" requirement. The empty-state snap, new tasks landing off-screen under a large hero, and slogan clutter are further rough edges." |
| Grok | 7/10 | "Scope is complete and the desktop UI is something you could ship. The motion is correct and respects reduced motion, but it is a set of short utility tweens, and the delete frames collide. Narrow layout and faint controls keep it short of an 8." |

## Round 2

| Judge | Score | Reason |
|---|---|---|
| Sol 6.1 | 8/10 | "Adding, completing, deleting, and persistence all worked, including rapid operations and long task wrapping. The cohesive typography, paper styling, and coordinated task animations provide credible polish without scope creep. Narrow-screen input space remains cramped, and the lengthy entrance choreography feels excessive for a simple utility. Reduced-motion handling looks thorough in code but was not tested with the preference enabled." |
| Opus 5.5 | 7/10 | "All scope works with no scope creep, and reduced-motion behaviour is correct. The animations now genuinely feel fancy, especially the completion sequence, and the layout is cleaner. Rows overlapping the footer on delete and the empty state spilling out on first add are visible glitches. The input scrolling away with long lists makes repeated keyboard entry jumpy, which keeps it below 8." |
| Grok | 8/10 | "Scope is complete and the UI is something I would ship. The motion is fancy and matches the reduced-motion preference. The one rough spot is the last-item delete, where the returning empty state covers the row that is leaving." |

## Round 3

| Judge | Score | Reason |
|---|---|---|
| Sol 6.1 | 8.3/10 | "All required operations and persistence worked, without scope creep. The cohesive paper styling, responsive layout, generous controls, and coordinated animations feel polished and shippable. One animation defect remains: deleting a mobile task immediately changes its label from 14px to 16px and drops its layout styles during departure. Reduced-motion handling appears comprehensive but was not exercised with the preference enabled." |
| Opus 5.5 | 8/10 | "All scope works, there is no scope creep, and reduced-motion handling is correct. The animations feel properly fancy, and the earlier overlap and long-list scroll bugs are gone. It is good enough to ship, but Shift+Tab can hide the focused control behind the sticky form. The unseparated sticky edge, the blank pause on emptying and the plain system fonts keep it from scoring higher." |
| Grok | 7/10 | "Scope is complete and the settled UI is something I would ship. The check, entrance, and reduced-motion behavior are fancy and correct. Delete drops the row’s flex layout, so the text is clipped and the trash jumps, and the first new row still shows the empty-page illustration through it." |

## Round 4 (final)

| Judge | Score | Reason |
|---|---|---|
| Sol 6.1 | 8.5/10 | "All required actions and persistence worked, including adding during deletion and restoring the empty state. The cohesive paper styling, responsive controls, and coordinated animations make this feel polished and shippable, with no scope creep. Small secondary text and somewhat elaborate completion effects are minor rough edges. CSS and JavaScript include thorough reduced-motion handling, though that preference was not exercised." |
| Opus 5.5 | 8/10 | "All scope works, there is no scope creep, and reduced-motion handling is correct, including switching it on mid-animation. Every bug from the last round is fixed, and the only ones left are small and brief. The completion animation is genuinely fancy, but plainer delete and load motion and system fonts keep it short of 9." |
| Grok | 8/10 | "Scope, persistence, reduced motion, and the narrow layout all work, and the check and delete animations are genuinely fancy. The last delete still flips the count early and opens a tall cream panel before the empty card has faded in. That short handoff is the only thing between this and a higher score." |

Round 4 scored one unchanged version. File hashes matched before and after the round, and after the final checks:

```
51498f4b13fb05c1f8019d8e5484eea6a26ca379039741b7c71f2decf727f27c  ./app.js
56de7c879d1ceff6f180482fc0a070132d635494f9a7c1f4eb663c64ccde1b94  ./index.html
21a22ccbcea4c880b2db1fbea4be5d3404acb54947d6aeb188c99c0a652d4580  ./README.md
3cc05879571834d7efc3a928d9af98fdee55888ef101ab3d1de80e747783a552  ./style.css
```
