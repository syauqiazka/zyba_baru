# Accessibility baseline

Treat these as part of "done", not extras. They also improve usability for everyone (bright sun, one hand, slow device).

## Perceivable
- Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large text ≥ 24px or 18.66px bold) and for UI component boundaries/icons.
- Placeholder, disabled, and muted text still need legible contrast when conveying information.
- Don't use color alone for meaning (errors, status, charts: add icon/label/pattern).
- Images: meaningful `alt`; decorative `alt=""`. Icons-only buttons: `aria-label`.
- Support 200% text zoom and 320px reflow without horizontal scrolling or clipped content.
- Don't put essential text in images.

## Operable
- Everything reachable and usable by keyboard; logical tab order; no keyboard traps; skip link on content-heavy pages.
- Visible `:focus-visible` indicator (≥ 2px, 3:1 contrast). Never `outline: none` without a replacement.
- Targets ≥ 44×44px (touch), minimum 24×24px by WCAG 2.2 AA with spacing rules; inline text links exempt.
- Provide alternatives to drag, swipe and path-based gestures.
- Motion: respect `prefers-reduced-motion`; no auto-playing motion > 5s without pause; nothing flashes more than 3 times/second.
- Timeouts: warn and allow extension.

## Understandable
- Set `<html lang="id">` (or correct language); mark language changes.
- Consistent navigation and component behavior across pages.
- Labels/instructions before fields; error identification with suggestions; confirm irreversible submissions.
- Don't require re-entering info already provided in the same flow.

## Robust (semantics first)
- Use native elements: `button` for actions, `a` for navigation, `label` bound to inputs (`for`/`id`), `nav`, `main`, `header`, `footer`, `ul/li` for lists, headings in order (one `h1`).
- ARIA only when native HTML can't express it; custom widgets (combobox, tabs, dialog) follow ARIA Authoring Practices patterns, manage focus (move in, trap in modal, restore on close), and close on Esc.
- Live regions for async updates (`aria-live="polite"`), `role="alert"` for urgent errors.
- `aria-current="page"` on active nav item; `aria-expanded` on disclosure buttons.

## Quick audit commands (if tools available)
- Lighthouse accessibility run, axe-core, keyboard-only walkthrough, screen reader smoke test (VoiceOver/TalkBack), 200% zoom, and `prefers-reduced-motion` toggle.
