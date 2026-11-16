# Layout, navigation and responsiveness (all devices)

Contents: 1 Device canvas · 2 Breakpoints · 3 Navigation by size · 4 The phone header rule · 5 Touch vs pointer · 6 Spacing and rhythm · 7 Grids, cards, content width · 8 Tablets, foldables, landscape · 9 Browser quirks · 10 Testing

## 1. Device canvas
Design mobile-first, then enhance. Typical widths to check: 320 (small/old phones), 360–393 (most Android and iPhone), 430 (large phones), 600–768 (small tablet / foldable unfolded / phone landscape), 820–1024 (tablet), 1280 (laptop), 1536+ (desktop). Orientation and split-screen change width at runtime, so layouts must respond to available width, not device name.

## 2. Breakpoints
Align to Material 3 window size classes, which map well to the web:

| Class | Width | Typical device | Columns / margins |
|---|---|---|---|
| Compact | < 600px | Phones portrait | 4 cols, 16px margins |
| Medium | 600–839px | Tablets portrait, foldables | 8 cols, 24px margins |
| Expanded | ≥ 840px | Tablet landscape, laptops, desktop | 12 cols, 24–32px margins |

Practical CSS tiers: base (mobile), `min-width: 640px`, `768px`, `1024px`, `1280px`. Prefer `min-width` (mobile-first). Prefer container queries for components that live in different-width containers.

## 3. Navigation by size
- Compact: bottom navigation bar (3–5 top-level destinations) or compact top bar + drawer/sheet for the rest.
- Medium: navigation rail on the left (icons + labels) or compact top bar.
- Expanded: permanent sidebar or full horizontal nav with labels.
- Top-level destinations with equal importance → visible. Overflow → "Lainnya"/drawer. Never bury the primary action or safety-critical features behind a hamburger.
- Keep the user's location obvious (active state with more than color alone).
- Back affordance: on phones a back arrow (44px) replaces long text like "Kembali ke Menu Utama".


### Hidden vs visible navigation (NN/g research)
NN/g's quantitative studies found that hiding navigation behind a menu lowers discoverability and use, and slows task completion, on both desktop and mobile, compared with visible or partly visible navigation.
- Prefer **visible or combo navigation**: keep the 3–5 most important destinations visible (bottom bar, tab bar, or horizontal chips) and tuck the rest under "Lainnya"/menu.
- If a menu is unavoidable, use a **clear label** ("Menu"/"Jelajahi") or a hamburger icon with text, a large footprint, and good contrast; make the bar **sticky** where it helps.
- Support users who don't open the menu: in-content links to related pages, repeat key navigation in the footer.
- Use descriptive nav labels (information scent): "Artikel Tidur", not "Insights".
- Never hide crisis/emergency/support or the single primary action inside the menu.

## 4. The phone header rule
The header is chrome; it must stay thin and calm.
- One row, ~56px (plus safe-area top). Never two or three rows of wrapped text.
- Budget the width: at 375px minus 24px padding there is ~350px. Typical allocation: back (44) + logo/title (flex) + 2–3 icon buttons (44 each). If text buttons don't fit, switch them to icon-only below ~480px and show text from 640px.
- Shorten labels for small widths ("Menu Utama ZYBA" → icon, "Teman Zibi AI" → icon or "Zibi AI").
- Make flexible text shrinkable: `min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap`.
- Fixed-size items (buttons, badges): `flex-shrink:0; white-space:nowrap`.
- A badge that can't fit is hidden (`display:none` below the breakpoint) rather than clipped.
- Icon-only buttons need `aria-label` (and optionally a tooltip on desktop).
- If a second row is truly needed (e.g., search bar), design it as an intentional row with its own purpose, not overflow.

```css
.topbar{display:flex;align-items:center;gap:8px;min-height:56px;
  padding:env(safe-area-inset-top) 12px 0;}
.topbar .title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.topbar .btn{flex:none;min-width:44px;min-height:44px;white-space:nowrap}
.topbar .btn .label{display:none}
.topbar .badge{display:none}
@media (min-width:480px){.topbar .badge{display:inline-flex}}
@media (min-width:640px){.topbar .btn .label{display:inline}}
```

## 5. Touch vs pointer
- Touch targets ≥ 44×44px (Apple 44pt, Material 48dp; WCAG 2.2 AA floor is 24px, AAA 44px). Keep ≥ 8px between adjacent targets. A 24px icon inside a 44px button is fine.
- Hover-only features (tooltips, hover menus, hover-reveal actions) must have a touch/keyboard equivalent. Gate hover styles: `@media (hover:hover){...}`. Use `@media (pointer:coarse)` to enlarge controls.
- Put primary actions in the thumb zone on phones (bottom half); avoid critical buttons in the top corners.
- Avoid gestures as the only way (swipe-to-delete needs a visible alternative).

## 6. Spacing and rhythm
- Use a scale (4/8/12/16/24/32/48/64). Don't invent one-off values.
- Proximity rule: related things closer than unrelated things. Within a group 8–12px, between groups 24–32px, between sections 48–64px.
- Reduce hero/section padding on phones (e.g., 64px → 32px); big gaps between header and first content push content below the fold.
- Cards: consistent internal padding (16px phone, 20–24px desktop).

## 7. Grids, cards, content width
- Card grids: 1 column phone → 2 tablet → 3–4 desktop using `grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr))`.
- Sidebars (filters) on desktop become a top collapsible panel, bottom sheet, or "Filter" button on phones. Don't stack a huge filter card above all content on mobile; collapse it so content is reachable.
- Max content width ~1200–1280px, centered; reading text 45–75 characters (`max-width: 65ch`).
- Images: set `aspect-ratio`, `object-fit: cover`, `loading="lazy"` below the fold; always `alt` text.
- Tables on phones: transform to cards/stacked rows or allow scrolling inside their own `overflow-x:auto` container, never page-level.

## 8. Tablets, foldables, landscape
- Don't just stretch the phone layout. Use rail + two-pane (list/detail) at ≥840px.
- Handle height too: phone landscape is short (< 480px), so avoid tall fixed headers/footers there.
- Foldables change width on unfold; avoid layouts keyed to a fixed device size.

## 9. Browser quirks
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Never disable zoom.
- Use `100dvh`/`svh` instead of `100vh` for full-height sections (mobile URL bar).
- Respect safe areas: `env(safe-area-inset-*)` for notches and home indicators.
- Sticky bottom bars: add bottom safe-area padding and extra page bottom padding so content isn't covered.
- Prevent layout shift: reserve space for images, fonts (`font-display: swap` plus fallback metrics), and async content.
- Avoid `position: fixed` stacks (sticky header + banner + FAB) that eat the viewport on short screens.

## 10. Testing
Check 320, 375, 414, 768, 1024, 1280, 1536; portrait and landscape; light and dark; long strings (Indonesian, German); 200% browser zoom; one-handed reach. Look specifically for wrapped chrome, clipped badges, overlapping fixed elements, and horizontal scroll.
