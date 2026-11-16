# Feedback, states and content

Contents: 1 Loading · 2 Empty states · 3 Errors · 4 Destructive actions · 5 Success and progress · 6 Microcopy · 7 Placeholder content · 8 Safety-critical flows

## 1. Loading
- Skeleton screens for content areas (feeds, cards, dashboards, profiles): gray blocks that match the final layout's shapes, subtle shimmer, same dimensions to avoid layout shift. They make waits feel shorter and show structure.
- Spinners only for short, indeterminate actions (button submit, pull-to-refresh), ideally inline.
- Progress bar with percentage for uploads/long tasks; show what's happening.
- Under ~300ms show nothing (avoid flicker); over ~10s offer cancel or explanation.
- Respect `prefers-reduced-motion`: replace shimmer with a static placeholder.
- Optimistic UI for low-risk actions (like, toggle) with rollback on failure.

## 2. Empty states
Explain why it's empty and give the next step: illustration/icon (optional), one-line explanation, primary action ("Tambah artikel pertama"). Distinguish "no data yet", "no results for filter" (offer clear-filters), and "error".

## 3. Errors
- Specific, human, actionable: what happened + how to fix. "Email sudah terdaftar. Masuk atau gunakan email lain."
- Inline for fields; banner/toast for page-level; full-page only when nothing can render.
- Offer Retry; preserve user input; never blame the user.
- Network failure: say you're offline and what still works.
- Don't auto-dismiss errors that need action; auto-dismiss only low-stakes confirmations (~4–6s) and allow reading time.

## 4. Destructive actions
- Confirmation dialog restates the consequence ("Akun dan semua datamu akan dihapus permanen").
- Confirm button is red and names the action ("Hapus Akun"); Cancel is neutral and is the default/safe focus.
- Prefer undo (snackbar "Dihapus · Urungkan") for reversible deletes over a confirm dialog.
- For irreversible high-stakes actions, require typing the name or a deliberate second step.
- Keep destructive buttons away from primary ones; no accidental-tap adjacency.

## 5. Success and progress
- Confirm important completions (saved, sent) in place; say what happens next.
- Multi-step flows: always show position, allow going back, save progress.
- Don't navigate away from a successful action without any acknowledgment.

## 6. Microcopy
- Plain language, active voice, consistent terms (don't alternate "Masuk/Login/Sign in").
- Sentence case for buttons and labels in Indonesian/English.
- Tone matches context: warm and calm for wellbeing and health, precise for finance, brief for tools.
- Avoid jargon, internal IDs, or raw error codes in user-facing text.
- Button text = outcome verbs ("Kirim", "Simpan", "Lanjut"), not "Ya/Tidak".
- Length: leave 30–40% extra room for translated text.

## 7. Placeholder content
- Don't ship the same image/title across many cards; it looks broken and hides layout problems. Use distinct sample content or one intentional neutral placeholder style.
- Test with real-length titles, one-word titles, very long titles (clamp to 2–3 lines), missing images, zero/one/many results.

## 8. Safety-critical flows (mental health, medical, emergency, finance)
- Emergency/crisis help is always one tap away on every screen and every breakpoint, as a visible control (icon + accessible name), never only inside a menu.
- Use calm, non-judgmental language; avoid alarming red decoration for non-emergencies so true emergencies stand out.
- Don't gate crisis resources behind sign-in or steps.
- State clearly what an AI assistant is and isn't (not a substitute for professional help) where relevant.
