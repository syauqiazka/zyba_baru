# Ethical UX: never ship deceptive patterns

Contents: 1 Why · 2 Patterns to refuse · 3 Honest alternatives · 4 Special care contexts · 5 When asked to build one

Deceptive ("dark") patterns trick or pressure users into actions they didn't intend. They may work in the short term but erode trust and increasingly carry legal risk (consumer protection and privacy regulators in many jurisdictions penalize them). The taxonomy comes from Harry Brignull's deceptive.design work.

## 1. Why this is in a UX skill
An agent optimizing for "conversion" can drift into manipulation. Optimize for the user's informed choice and long-term trust; accidental conversions are not wins.

## 2. Patterns to refuse (and recognize in reviews)
- **Roach motel:** easy to sign up, hard to cancel/delete. Cancellation must be as easy as signup.
- **Hidden costs / sneak into basket:** fees, taxes or add-ons revealed at the last step or pre-added to the cart.
- **Forced continuity:** free trial silently becomes paid with no reminder.
- **Confirmshaming:** guilt-trip wording on the decline button ("Tidak, saya tidak mau hemat").
- **Misdirection:** visual tricks that steer attention to the option the business wants (tiny gray "Batalkan", giant bright "Pertahankan langganan").
- **Bait and switch:** a control does something other than expected.
- **Trick questions / double negatives:** "Jangan kirimi saya email ✔ untuk tidak berhenti berlangganan".
- **Pre-checked boxes for consent, marketing, or add-ons.**
- **Fake urgency/scarcity/social proof:** invented countdown timers, "3 orang melihat ini" with no basis, fabricated reviews.
- **Privacy zuckering:** nudging users to share more data than intended; consent banners where "Accept" is prominent and "Reject" is buried.
- **Disguised ads:** ads styled as content or navigation.
- **Nagging and interruptions:** repeated prompts that ignore a previous "no".
- **Friend spam / contact harvesting.**
- **Price comparison prevention / obscured pricing.**

## 3. Honest alternatives
- Equal visual weight for Accept and Reject; same number of clicks.
- Clear, plain language for choices and consequences; no double negatives.
- Show total price early; tax/fees explained under the price.
- Trial reminders before renewal; one-click cancel in the account area; confirm by email.
- Opt-in (unchecked) for marketing and non-essential data.
- Real urgency only when real (true stock/time limits, labelled with source).
- Respect "no": remember dismissals; don't re-ask on every visit.

## 4. Special care contexts
- **Mental health, health, finance, children, older adults:** these users are more vulnerable. Avoid pressure, shame, streaks that punish, and guilt-based engagement hooks. Tone: warm, calm, non-judgmental; never exploit emotional distress to increase engagement or purchases.
- **Safety-critical help (crisis lines, emergency):** never gated, delayed, hidden, or monetized.
- **Privacy:** minimum data collection, plain-language purpose, easy export/delete.

## 5. When asked to build one
If the user explicitly requests a deceptive pattern (e.g., hide the cancel button, fake countdown), explain the risk briefly (trust, legal exposure, churn), and offer an honest alternative that still serves the business goal (e.g., a retention offer shown *alongside* an equally easy cancel). Don't silently implement it.
