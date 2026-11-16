# Checkout, signup and conversion flows (Baymard-informed)

Contents: 1 Principles · 2 Guest and account · 3 Fields and autofill · 4 Specific field rules · 5 Costs and trust · 6 Flow structure · 7 Signup and login · 8 Mobile payments

Applies to e-commerce checkout and also to any signup, booking, donation, or application flow. Findings come from Baymard Institute's large-scale checkout usability research and related best-practice sources.

## 1. Principles
- Every field, step, and surprise is a reason to abandon. Remove before you optimize.
- Baymard-type research repeatedly finds the average checkout asks for far more fields than needed (roughly double). Ask only what is required to complete the transaction.
- Keep the flow linear and predictable, with a literal progress path the user can see.

## 2. Guest and account
- Make guest checkout the most prominent option; account creation is optional and can be offered after purchase (e.g., "Simpan data untuk lain kali?"). Research found forced account creation is a leading abandonment cause (roughly a quarter of abandoners cite it).
- Social/one-tap login and email magic links reduce password burden.
- Don't require re-entering data already given (billing = shipping by default, with a visible checkbox to change).

## 3. Fields and autofill
- Single-column forms. Multi-column layouts are misread (users skip fields or misinterpret which column applies).
- Support browser autofill: correct `name`, `autocomplete` tokens (`given-name`, `family-name`, `email`, `tel`, `street-address`, `postal-code`, `cc-number`, `cc-exp`, `cc-csc`), consistent field order, no custom widgets that break it.
- Address lookup/autocomplete and auto-detect city/region from postal code where available.
- Don't ask for a title (Mr/Mrs), second phone, fax, or company unless truly needed. If a field is optional, label it "(opsional)" or remove it.
- Label every field; add a short description when the reason isn't obvious ("Nomor telepon: untuk konfirmasi pengiriman").

## 4. Specific field rules
- **Credit/debit card number:** allow and auto-format spaces (4-4-4-4); numeric keypad; detect card type; don't force users to strip spaces.
- **Expiry:** format as printed on cards (MM/YY), single field with auto-slash.
- **CVC:** short helper icon showing where it is.
- **Phone:** explain why it is required, format with country code, accept common formats.
- **Password:** avoid unnecessarily complex rules; show requirements up front; show/hide toggle; allow paste and password managers.
- **Address line 2:** label clearly or hide behind "+ Tambah detail alamat".
- **Name:** use a single "Nama lengkap" field when the context allows. Many people have one name or non-Western structures; don't force first/last.

## 5. Costs and trust
- Show total cost including shipping, taxes, and fees as early as possible. Unexpected extra costs are the top reported reason for abandoning at checkout. Never add fees at the last step (see ethics reference).
- Show delivery time and return policy near the price and at checkout.
- Trust cues: recognizable payment logos, clear security wording near payment fields, visible support contact. Don't fake badges or fake scarcity.
- Order summary is always visible (collapsible on mobile) with edit access.

## 6. Flow structure
- Cart → Details → Delivery → Payment → Review → Confirmation, with step indicator; or accordion/one-page variants only if every section stays clear and linear.
- Don't distract with global navigation or promos in checkout (use a minimal header), but keep a visible way back and to contact support.
- Preserve the cart and entered data across sessions and errors.
- Confirmation page: order number, what happens next, how to track or change, support contact, and save details for later.

## 7. Signup and login
- Ask for email (or phone) and password first; collect profile details later, progressively.
- Offer passwordless or social options; explain what is shared.
- Login errors should not reveal whether an account exists when security requires it, but still be understandable.
- Provide clear "Lupa kata sandi" and recovery flows; keep session across reloads; support password managers.
- Email/phone verification: OTP boxes, resend countdown, ability to change the number, and a fallback.

## 8. Mobile payments
- Prefer wallets/payment sheets and local methods the audience actually uses (e.g., e-wallets and bank transfer/VA in Indonesia) in addition to cards.
- Large tap targets, numeric keypad, no horizontal scrolling, sticky bottom "Bayar" button with the total.
- Handle app-switching (redirect to bank/e-wallet and back) and show the pending/paid state clearly.
