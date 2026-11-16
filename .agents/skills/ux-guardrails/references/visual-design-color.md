# Visual design and color

Contents: 1 Pure black/white · 2 Hierarchy · 3 Color meaning · 4 Light vs dark tuning · 5 Typography · 6 Elevation and shape · 7 Tokens

## 1. Avoid pure black and pure white
`#000` on `#FFF` (or the reverse on large areas) maximizes contrast so much that it causes glare and halation, especially in dark mode and for people with astigmatism. Soften both ends:
- Light surfaces: warm or cool off-white (`#FAF9F6`, `#F7F8FA`).
- Dark surfaces: near-black with a slight tint of the brand hue (`#010013`–`#0F0F1A`, or `#121212`–`#1A1A22` for elevated layers).
- Text: near-black (`#14141C`) on light; off-white (`#EDEDF2`) on dark.
Still verify contrast ≥ 4.5:1 for body text. Softening should not push it below.

## 2. Hierarchy: prioritize important information
Users scan; make the thing they came for win.
- The key value (balance, price, grade, status) is largest and boldest; its label is small and muted; secondary meta (change %, timestamp) smaller still.
- One focal point per card/screen; limit to 2–3 type sizes per component.
- Weight and size before color; color is a supporting signal.
- De-emphasize chrome (borders, icons, helper text) so content leads.
- Order by importance, not by data-model order.

## 3. Color has jobs: be consistent
- Primary brand color: main actions and active states only (don't spray it everywhere).
- Red: destructive/error. Green: success. Amber: warning/caution. Blue: info/links.
- A destructive confirmation shows a red confirm button and a neutral cancel; a "Delete Account" blue primary button signals the wrong thing.
- Never rely on color alone (add icon, text, pattern), since ~8% of men have some color-vision deficiency.
- Limit palette: one brand hue + neutrals + 3–4 semantic colors. Tint neutrals toward the brand hue for cohesion.
- Cultural/context care: in mental-health, medical or financial contexts prefer calm, low-alarm palettes, but keep crisis/emergency actions unmistakable.

## 4. Light vs dark: tune, don't invert
- Light mode: colors can be fuller and more saturated; muted pastels look washed out and low-contrast on white.
- Dark mode: desaturate and lighten accents (e.g., use the 200–400 tone, not 600) so they don't vibrate against dark surfaces. Express depth with lighter surfaces instead of heavy shadows.
- Re-verify contrast for every text/background pair in both themes. Provide `prefers-color-scheme` support and, ideally, a manual toggle.
- Don't reuse the same swatches blindly across themes; keep semantic tokens (`--surface`, `--text`, `--accent`) with per-theme values.
- Images/illustrations with white backgrounds need treatment in dark mode (transparent, dimmed, or alternate asset).

## 5. Typography
- Body 16px minimum on mobile (14px only for secondary text); line-height 1.5–1.7 for body, 1.1–1.3 for headings.
- Limit to 1–2 typeface families; use weights/sizes for hierarchy.
- Heading scale example (mobile → desktop): H1 28→48, H2 22→32, H3 18→24.
- Use relative units (`rem`) so user font settings are respected. Avoid ALL CAPS for long text; small caps labels (≤3 words) with letter-spacing are fine.
- Avoid centered paragraphs beyond 2–3 lines; left-align longer text.
- Numbers in tables/dashboards: tabular figures (`font-variant-numeric: tabular-nums`), right-aligned.

## 6. Elevation, shape, density
- One radius system (e.g., 8 / 12 / 16 / full) used consistently.
- Shadows subtle and consistent; use borders or surface tint in dark mode.
- Don't box everything: group with spacing first, divider second, card third.
- Density: touch interfaces need air; dense data tables are acceptable on desktop but still 44px rows on touch.

## 7. Tokens (starter)
```css
:root{
  --bg:#FAF9F6; --surface:#FFFFFF; --text:#14141C; --muted:#5B5B6B;
  --border:#E4E2DC; --accent:#3D7A55; --danger:#D93025; --warning:#B26A00; --success:#1E8E3E;
  --radius-sm:8px; --radius-md:12px; --radius-lg:16px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px; --space-8:32px;
}
@media (prefers-color-scheme:dark){
  :root{ --bg:#0B0B12; --surface:#15151F; --text:#EDEDF2; --muted:#A0A0B2;
    --border:#2A2A38; --accent:#7CC59A; --danger:#FF8A80; --warning:#F2B24C; --success:#6FCF8D; }
}
```
(Surface in light mode may be pure white for small cards on an off-white page; avoid it for the page background and large text areas.)

## 8. Refactoring UI tactics (Wathan & Schoger) that fix most "amateur-looking" UI
- **Hierarchy with weight and color, not just size.** Primary text dark and heavier, secondary text lighter/greyer, tertiary lighter still. Avoid making everything bigger.
- **De-emphasize by lowering contrast, not by lowering weight below regular.** Keep body weights 400–500 and emphasis 600–700; don't use thin weights in UI text.
- **Hand-pick muted text colors** that share the background's hue instead of applying opacity (avoids muddy greys); saturate greys slightly toward the brand temperature.
- **Add space before adding lines.** Increase separation between groups, then use background tint, then a border, then a shadow, in that order.
- **Fewer borders:** replace with subtle shadows or different background shades.
- **Shadows:** use a small scale (sm/md/lg/xl); add a vertical offset and moderate blur rather than huge blur. Shadows are low-opacity (≈ 6–15%).
- **Design in grayscale first** to force hierarchy through spacing, contrast and size; add color after the layout works.
- **Constrain choices:** fixed spacing scale, type scale (e.g., 12/14/16/18/20/24/30/36/48), 5–9 shades per color, 2 font weights where possible.
- **Not every button needs a fill:** primary = solid, secondary = outline or tonal, tertiary = text/link style. Hierarchy first, semantics second.
- **Accent borders and subtle gradients** add personality to bland cards without extra components.
- **Start with too much whitespace, then remove.**
- **Icons next to text:** match optical weight, align baselines, don't enlarge icons to fill space.
- **Images:** add a subtle inner shadow/overlay behind text on photos; avoid text directly on busy images.
