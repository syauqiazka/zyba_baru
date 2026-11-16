# Dialogs, sheets, toasts and other overlays

Contents: 1 Decision tree · 2 Modal dialog rules · 3 Bottom sheets · 4 Toasts and snackbars · 5 Popovers and tooltips · 6 Accessibility of overlays · 7 Anti-patterns

Most things that default to a modal should not be one: modals block everything, interrupt flow, and are expensive to make accessible.

## 1. Decision tree
1. Routine success or low-risk status ("Tersimpan") → **toast/snackbar** (non-blocking, auto-dismiss).
2. Reversible action → **do it immediately with Undo** (snackbar "Dihapus · Urungkan").
3. Needs a decision before continuing, or high-risk/irreversible → **modal dialog** (confirm).
4. Phone and needs options, filters, share, or short forms → **bottom sheet**.
5. Contextual detail while keeping the page visible → **popover**, side panel, or inline expand.
6. More than ~2 steps or substantial content → **its own page/route**, not a modal.

## 2. Modal dialog rules
- Title and primary button name the action ("Hapus akun?" / "Hapus akun"); body states the consequence in one or two sentences.
- Buttons: primary on the trailing side, cancel/secondary on the other. Destructive = red with text, not color alone.
- Initial focus: first interactive element; for destructive dialogs, focus the safest option (Cancel).
- Close in at least three ways where appropriate: Esc, backdrop click (not for critical decisions), and a visible Cancel/Close button.
- Never open on page load (except truly critical cases like data loss or security). Never nest modals.
- Keep content short; avoid scrolling inside a dialog. If it needs scroll or many fields, it should be a page or sheet.
- Size: comfortable margins from screen edges (≈ 40px sides, 24px top/bottom on phones), internal padding ≈ 24px. Full-screen or bottom-aligned on small screens.
- Don't use for marketing, newsletters or cookie walls that block content.

## 3. Bottom sheets (mobile)
- Native-feeling pattern for choices, filters, share, and lightweight forms. Provide a drag handle plus a visible close (X) because not everyone discovers swiping.
- Modal sheets dim the background and trap focus; non-modal sheets let the page remain interactive.
- Support the system back gesture to dismiss. Provide safe-area padding at the bottom.
- Prefer sheets over centered dialogs for mobile forms and long option lists.

## 4. Toasts and snackbars
- Short text (one line), appear near the bottom (above bottom nav) on mobile; auto-dismiss in ~4–6s, longer if there's an action; pause on hover/focus.
- Never put critical information or the only error message in a toast (it disappears, can be missed, and may be unreadable by AT users). Use inline or banner.
- Announce with `role="status"` / `aria-live="polite"`; errors that need action use `role="alert"`.
- Stack sparingly (max 1–2 visible), don't cover primary actions or the keyboard.
- An action in a snackbar ("Urungkan") must be reachable by keyboard and last long enough.

## 5. Popovers and tooltips
- Tooltips: short supplemental labels, never the only way to learn something essential. Provide on focus as well as hover; on touch use tap-to-reveal or show info inline.
- Popovers close on Esc and outside click; return focus to the trigger.
- Don't hide primary navigation or crisis actions in popovers.

## 6. Accessibility of overlays
- Use the native `<dialog>` (or a well-tested library) with `aria-modal`, labelled by its title (`aria-labelledby`).
- Trap focus inside modals; restore focus to the trigger on close; make background inert.
- Lock body scroll behind a modal but preserve scroll position.
- Respect `prefers-reduced-motion` for open/close animations.
- Ensure the dialog works at 200% zoom and in landscape on small phones.

## 7. Anti-patterns
- "Are you sure?" on every action (train users to click through). Prefer undo.
- Confirm button labelled "OK/Yes" instead of the verb.
- Cookie/newsletter/app-install interstitials that cover content on first paint.
- Stacked modals, modals on top of sheets.
- Toast as the sole error signal.
- Hover-only tooltips on touch devices.
