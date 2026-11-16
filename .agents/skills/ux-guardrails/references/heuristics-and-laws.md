# Heuristics and Laws of UX (the thinking tools)

Contents: 1 Nielsen's 10 heuristics applied · 2 Laws of UX applied · 3 Squint and 5-second tests · 4 Severity scale · 5 Heuristic evaluation workflow

Use these as a lens when *reviewing*, and as a sanity check when *building*. They are rules of thumb, not laws of physics: when a heuristic conflicts with evidence from the user's actual context, context wins.

## 1. Nielsen's 10 usability heuristics (NN/g) and what they mean for you

| # | Heuristic | What to do in the UI you build |
|---|---|---|
| 1 | Visibility of system status | Always show what is happening: loading, saving, uploaded, step 2 of 4, offline. Acknowledge every tap within ~100ms. |
| 2 | Match between system and real world | Use the user's words (not DB or internal terms), familiar icons, natural order. Write in the user's language and register. |
| 3 | User control and freedom | Clear exits: Back, Cancel, Undo, Close, Esc. Never trap the user in a flow. Prefer undo over "Are you sure?". |
| 4 | Consistency and standards | Same word, same icon, same place for the same thing. Follow platform and web conventions (logo → home, cart top-right, underlined links). |
| 5 | Error prevention | Constrain input (masks, pickers, disabled invalid options with explanation), confirm destructive actions, sensible defaults. Better than good error messages. |
| 6 | Recognition rather than recall | Show options instead of making people remember them: visible labels, recent items, autocomplete, persistent context (breadcrumbs, selected filters as chips). |
| 7 | Flexibility and efficiency | Shortcuts for experts (keyboard, bulk actions, saved filters, autofill) that don't clutter the novice path. |
| 8 | Aesthetic and minimalist design | Every extra element competes with the important ones. Remove, group, or disclose progressively. |
| 9 | Help users recognize, diagnose, recover from errors | Plain language, say what's wrong and how to fix it, preserve input. |
| 10 | Help and documentation | Contextual help near the task (helper text, tooltips, "Why we ask"), searchable, short. Needed less if 1–9 are done well. |

## 2. Laws of UX (Yablonski / lawsofux.com) and the practical move

| Law | Core idea | Practical move |
|---|---|---|
| Jakob's Law | Users expect your product to work like the ones they already know | Use conventional patterns; innovate on content, not on basic navigation or form behavior |
| Fitts's Law | Time to hit a target depends on its distance and size | Big primary buttons; frequent actions within thumb reach; don't place destructive next to primary |
| Hick's Law | More choices → slower decisions | Limit options per step; highlight a recommended default; progressive disclosure; group and categorize |
| Miller's Law / chunking | Working memory is small | Chunk long content (phone numbers 4-4-4, card numbers 4-4-4-4, sections with headings); don't rely on memory across screens |
| Postel's Law | Be liberal in what you accept, conservative in what you send | Accept `0812-3456`, `+62 812 3456`, with spaces; normalize behind the scenes; ask for the minimum |
| Tesler's Law | Complexity can't vanish, only move | Absorb complexity in the system (autofill, defaults, detection) instead of pushing it onto the user |
| Doherty Threshold | Respond within ~400ms to keep flow | Instant feedback on tap; skeleton/optimistic UI for slower work |
| Law of Proximity | Near = related | Spacing and grouping before borders |
| Law of Common Region | Shared boundary = grouped | Cards/containers for related controls |
| Law of Similarity | Similar look = similar function | Same style for same-role elements (all links look alike) |
| Law of Uniform Connectedness | Connected elements read as related | Lines/steppers connecting stages |
| Law of Prägnanz | People perceive simple forms | Prefer simple shapes and layouts; reduce visual noise |
| Von Restorff (isolation) | The different item stands out | Make the one primary CTA visually distinct; don't highlight everything |
| Serial Position | First and last items are remembered | Put key nav items/actions at ends of lists and bars |
| Peak-End Rule | People judge by the peak and the end | Invest in the success/completion moment and error recovery |
| Goal-Gradient | Motivation rises near the goal | Progress indicators that show momentum |
| Zeigarnik Effect | Unfinished tasks are remembered | Show incomplete profile/progress, offer to resume |
| Aesthetic-Usability Effect | Pretty is perceived as easier | Polish builds tolerance, but never hides real usability problems |
| Cognitive Load | Mental effort is limited | Reduce extraneous load: fewer fields, clear labels, one primary task per screen |
| Mental Model | Users carry expectations from experience | Match terms and flows to how users think the task works |
| Occam's Razor / Pareto | Simplest sufficient solution; 80/20 | Ship the few features that cover most use, hide the rest |

## 3. Quick checks (cheap and revealing)
- **Squint test:** blur your eyes or view a thumbnail. Can you still identify the primary action and the most important information? If not, hierarchy is too flat.
- **5-second test:** Can a stranger say what this screen is for and what to do next in five seconds?
- **One-thumb test:** can the main task be done one-handed on a 6.5" phone?
- **Grandma/worst-day test:** would someone tired, in sunlight, on a slow network, with large text enabled, still succeed?

## 4. Severity scale (use in reviews)
- 4 Catastrophe: blocks a core or safety-critical task. Fix before release.
- 3 Major: many users struggle or fail; high frustration.
- 2 Minor: slows or confuses some users.
- 1 Cosmetic: polish.
- 0 Not a problem.
Rate by frequency × impact × how hard it is to recover.

## 5. Heuristic evaluation workflow (for review mode)
1. Define the task (e.g., "register, then find an article, then contact crisis help").
2. Walk through at phone width first, then desktop. At each step ask which heuristic is violated.
3. Note location, evidence (screenshot or code line), heuristic, severity.
4. Merge duplicates, order by severity, propose the smallest fix that resolves it.
5. Say what to validate with real users; heuristics find likely problems, not all of them.
