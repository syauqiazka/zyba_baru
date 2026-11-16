# Forms and inputs

Contents: 1 Match control to data · 2 Labels and placeholders · 3 Alignment and layout · 4 Multi-step forms · 5 Buttons · 6 Validation · 7 Mobile keyboards and attributes · 8 Snippets

## 1. Match the control to the data
Ask "what shape is this information?" and make the input that shape.

| Data | Use | Avoid |
|---|---|---|
| OTP / PIN (4–6 digits) | One box per digit, auto-advance, paste support, `inputmode="numeric"`, `autocomplete="one-time-code"` | One long text field |
| Phone | Country prefix + masked number, `type="tel"` | Free text |
| Date | Native date picker or `DD/MM/YYYY` mask with format hint | Three unlabeled dropdowns |
| Country / city / long lists (>15 options) | Searchable combobox: type to filter, still scrollable | Plain `<select>` |
| 2–5 mutually exclusive options | Radio group or segmented control (all visible) | Dropdown |
| Yes/no setting | Switch (immediate effect) or checkbox (submitted later) | Two buttons |
| Quantity | Stepper with +/− (44px) and typeable value | Free text |
| Money | Numeric keypad, thousand separators, currency prefix | Plain text |
| Password | Show/hide toggle, rules visible before typing | Rules only after failure |
| Search | `type="search"`, clear button, instant feedback | Submit-only |

Why: the right control removes errors before they happen and cuts typing on phones.

## 2. Labels and placeholders
- Visible label above every field, always. Floating labels are acceptable only if the label stays readable when floated.
- Placeholder = example value in lighter text ("contoh@email.com"). It disappears on typing and usually fails 4.5:1 contrast, so it can't carry required information.
- Helper text (format, constraints) goes under the field, always visible, not in the placeholder.
- Mark optional fields "(opsional)" rather than starring every required one, when most fields are required.

## 3. Alignment and layout
- Labels left-aligned and stacked above fields; all labels and fields share one left edge. Zig-zag alignment (label beside field with different widths) makes the eye jump.
- Single column on phones. Two columns only for short, tightly related pairs (first/last name, city/postcode) at ≥768px.
- Field width hints at expected input length (postcode short, address long).
- Spacing: ~4–8px between label and its field; 20–24px between fields; 32px+ before a new section; primary button 24–32px below the last field.

## 4. Multi-step forms
Split when a form has more than ~6 fields or mixed topics.
- Progress indicator showing position and total (stepper with numbers/check marks, or "Langkah 2 dari 4").
- 3–5 related fields per step; group by topic.
- Footer: primary "Lanjut" on the right, secondary "Kembali" or "Lewati" (only if truly skippable) beside it. On phones make them full-width or a sticky bottom bar.
- Validate each step before advancing; preserve entered data when going back.
- Final step is a review/summary before submit when the data matters.

## 5. Buttons
- Label = verb + object or the outcome: "Kirim Lamaran", "Simpan Perubahan", "Hapus Akun".
- Avoid "Ya/Tidak/OK/Submit" alone; a confirm dialog's buttons should make sense without reading the question.
- One primary (filled) per view; secondary = outlined/tonal; destructive = red.
- Never disable the submit button silently. Either allow the press and show what's missing, or explain why it is disabled.
- Loading state on the button itself (spinner + "Mengirim…"), and prevent double-submit.

## 6. Validation
- Validate on blur (and on submit), not on every keystroke. Exception: password strength and character counters can be live.
- Error text sits directly under the field, in red plus an icon, and says how to fix it.
- Move focus to the first invalid field on failed submit and announce errors (`aria-live="polite"` or `aria-describedby`).
- Keep user input after an error; never clear the form.
- Success feedback for important saves (toast or inline "Tersimpan").

## 7. Mobile keyboards and attributes
```html
<input type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false">
<input type="tel" inputmode="tel" autocomplete="tel">
<input inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" maxlength="1">
<input type="password" autocomplete="current-password">   <!-- or new-password -->
```
- Input font-size ≥ 16px, otherwise iOS Safari zooms the page on focus.
- Input height ≥ 44px (48px comfortable).
- Don't block paste on password or OTP fields.

## 8. Snippets

OTP boxes (React/Tailwind sketch):
```jsx
{digits.map((d, i) => (
  <input key={i} ref={refs[i]} value={d} maxLength={1}
    inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
    aria-label={`Digit ${i + 1} of ${digits.length}`}
    className="h-12 w-11 rounded-lg border text-center text-lg focus-visible:ring-2" />
))}
```

Searchable select: use a combobox pattern (`role="combobox"`, `aria-expanded`, `aria-controls`, listbox with `role="option"`), filter on input, arrow keys to navigate, Enter to select, Esc to close. Prefer a vetted library (Radix, Headless UI, react-aria) over hand-rolling.

## 9. Proven patterns from GOV.UK-style question design
GOV.UK's design system is a well-tested source for accessible forms, useful beyond government.
- **One thing per page** for complex or high-stakes journeys: a single question (the label/legend can be the page heading), a Back link on every page, a Continue button, and a "Check your answers" summary with Change links at the end. Balance this with network risk and annoyance: group tightly related questions ("one theme per page").
- **Ask direct questions** ("Berapa tanggal lahir kamu?") rather than just naming boxes ("DOB").
- **Dates:** three separate labelled fields (Hari, Bulan, Tahun) with a hint ("Contoh: 31 3 1980") work well for known dates such as birth dates; use a calendar picker for choosing near-future dates. Don't auto-tab between fields.
- **Error pattern:** (1) an error summary at the top that lists each error with a link to its field, (2) the message inline next to the field, (3) a bold/red border or marker, (4) the page title prefixed with "Error:" so screen reader users notice. Move focus to the summary on failed submit.
- **Error wording:** specific and repeats the field context so it makes sense alone in a summary: "Masukkan tanggal mulai", not "Wajib diisi". Show one message per field at a time, in logical order (blank → format → range).
- **Hint text** sits between label and input and is linked via `aria-describedby`.
- **Optional vs required:** if most fields are required, mark optional ones; if most are optional, mark required ones; be consistent.
- **Radios over selects** for short lists; yes/no as two radios with explicit labels, not a lone checkbox.
- **Conditional reveal:** show follow-up fields only when relevant (e.g., choose "Lainnya" → text box), kept right under the triggering option.
- **Don't use placeholder text for hints, don't disable paste, don't use CAPTCHAs unless necessary** (offer accessible alternatives).
