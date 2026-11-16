# Data tables, lists, dashboards and charts

Contents: 1 Tables · 2 Responsive tables · 3 Lists and cards · 4 Search, filter, sort · 5 Pagination vs infinite scroll · 6 Dashboards · 7 Charts

## 1. Tables
- **Alignment:** left-align text; right-align numbers and currency so digits line up (compare magnitude at a glance); header alignment matches its column. Use tabular numerals.
- Keep heading labels short; add units in the header ("Harga (Rp)") not every cell.
- Same decimal places within a column; consistent date and currency formats.
- Zebra stripes or subtle row dividers, not both heavy. Row hover highlight on pointer devices.
- Sticky header for long tables; optional frozen first column (row identifier) during horizontal scroll.
- Put row actions in one consistent place (usually the last column, right side); avoid scattering interactive controls across many columns.
- Truncate long text with ellipsis plus full text on expand/title; don't let one cell blow up the layout.
- Show empty, loading (skeleton rows) and error states inside the table frame.
- Bulk actions: checkbox column, selection count, contextual toolbar.
- Semantic markup: `<table>`, `<th scope>`, `<caption>`; don't build tables out of divs without roles.

## 2. Responsive tables
Pick by content:
- **≤3–4 key columns:** keep table, shrink padding.
- **Many columns:** transform each row into a card/stacked list (label: value), keeping the primary identifier as the card title.
- **Comparison data:** allow horizontal scroll inside an `overflow-x:auto` container with a frozen first column and a visible scroll hint.
- **Progressive disclosure:** show 2–3 essential columns; expand row for the rest.
Never let the page body scroll sideways because of a table.

## 3. Lists and cards
- Card = one entity, one primary action. Make the whole card tappable (with a clear focus state) rather than only a tiny link, but keep nested actions separate.
- Consistent card height or a masonry intentionally; clamp titles to 2–3 lines and descriptions to 2–3 lines.
- Show the most decision-relevant metadata first (price, date, status, reading time), not all metadata.
- Use real thumbnails with fixed `aspect-ratio`; avoid repeating identical images across cards.
- Status uses badge + text (not color only).

## 4. Search, filter, sort
- Search field visible (not just an icon) when search is a primary task; instant results or clear submit; "no results" state suggests fixes (check spelling, clear filters, popular items).
- Filters: show active filters as removable chips with a "Hapus semua" control; display result count; apply instantly on desktop, via "Terapkan" in a sheet on mobile.
- Counts next to categories help (as in the ZYBA sidebar), but update them with active filters or label as totals.
- On mobile, collapse the filter panel behind a "Filter" button (bottom sheet) so content is reachable immediately.
- Sort control with a clear current state ("Urutkan: Terbaru").
- Preserve filter/sort state in the URL for sharing and back-button behavior.

## 5. Pagination vs infinite scroll
- Pagination or "Muat lebih banyak": for goal-oriented browsing, comparing, needing footer access, or returning to a position. Show "Halaman 2 dari 10".
- Infinite scroll: for casual feeds; must preserve scroll position on back, offer a way to reach the footer, and announce loading.
- Prefer "Load more" button as a middle ground; avoid scroll hijacking.

## 6. Dashboards
- Start with the question the user is trying to answer; the top-left area gets the most important KPI.
- KPI card: big value, small label, subtle delta (▲▼ with color plus sign), time range stated.
- Limit to ~5–9 primary widgets above the fold; group related metrics; use consistent time range and filters across widgets.
- Don't use charts when a number or table answers better.
- Provide drill-down, export, and clear "last updated" time. Define empty/zero states.
- Phones: single column, KPIs first, charts simplified (fewer ticks, no hover-only tooltips, tap to inspect).

## 7. Charts
- Choose the chart for the question: trend → line, comparison → bar (zero baseline), part-to-whole → stacked bar/donut with few segments, distribution → histogram, relationship → scatter.
- Label directly where possible (end-of-line labels) instead of distant legends; always title with the takeaway or topic and units.
- Colors: limited palette; use color-blind-safe pairs; add patterns/labels for essential distinctions; keep red/green meaningful but never the only differentiator.
- Truncated axes on bar charts mislead; if you must, say so.
- Accessible alternative: text summary and/or data table; keyboard-focusable points where interactive.
- Responsive: reduce tick count, rotate or abbreviate labels, increase touch hit areas.
