# Context for Indonesian users and products (and multilingual/local UX in general)

These are practical heuristics from common local conventions. Verify against the specific product's analytics and research; they are starting points, not rules.

Contents: 1 Language and tone · 2 Formats · 3 Names, addresses, phones · 4 Payments and trust · 5 Devices, network, behavior · 6 Culture and sensitivity · 7 i18n engineering

## 1. Language and tone
- Default to Bahasa Indonesia (`lang="id"`); offer English if the audience needs it. Don't mix languages in the same control set.
- Pick one register and stay consistent: informal "kamu" for youth/wellbeing/consumer apps, formal "Anda" for finance/government/health-provider contexts. Avoid awkward machine-translated phrasing.
- Indonesian strings are often 20–40% longer than English; "Menu Utama ZYBA", "Bantuan Krisis 24/7" must survive narrow widths (icons, truncation with tooltips).
- Button verbs: Kirim, Simpan, Lanjut, Batal, Hapus, Daftar, Masuk, Bayar, Cari, Terapkan, Kembali.
- Error voice: "Format email belum benar. Contoh: nama@email.com".

## 2. Formats
- Date: DD/MM/YYYY or "16 Nov 2026"; avoid MM/DD. Month names in Indonesian.
- Time: 24-hour is common ("14.30" or "14:30"); state time zone (WIB/WITA/WIT) for events.
- Numbers: thousands separator is a dot and decimal separator a comma ("1.250.000,50"). Use `Intl.NumberFormat('id-ID')`.
- Currency: "Rp 1.250.000" (no decimals typically); put the symbol before the amount.
- Phone: +62, local numbers start with 0 (08xx...). Accept both `08xx` and `+628xx` and normalize.

## 3. Names, addresses, identity
- Many Indonesians have a single name (mononym). Use one "Nama lengkap" field; don't require a last name.
- Addresses include RT/RW, kelurahan/desa, kecamatan, kota/kabupaten, provinsi, kode pos. Provide structured, autocompleting fields and a free-text "detail alamat/patokan" field.
- ID numbers (NIK 16 digits, NPWP) need masks, clear purpose and privacy assurances; ask only when legally required.

## 4. Payments and trust
- Common methods: bank transfer/virtual account, e-wallets (GoPay, OVO, DANA, ShopeePay, etc.), QRIS, convenience-store payment, cards, COD for some commerce. Show what's accepted early.
- Display payment deadlines and status clearly (waiting for payment, paid, expired) with countdown that is real.
- WhatsApp is a primary support/communication channel; offer it as a contact option and use "Hubungi via WhatsApp" with a deep link.
- Build trust with visible contact info, clear policy pages, and recognizable payment logos.

## 5. Devices, network, behavior
- Majority mobile, many mid- and low-range Android phones, mixed 4G/3G conditions, data cost sensitivity: keep pages light, lazy-load, avoid autoplay video, support offline-friendly patterns and Save-Data.
- Test on small, low-density screens (360×640) and with large system font/zoom.
- Browsers: Chrome on Android dominates; also in-app browsers (Instagram, WhatsApp, TikTok) — test inside webviews where links are opened (viewport, fixed bars, file upload, popups can differ).
- Sunlight readability: strong contrast, avoid thin light-gray text.
- Many users share devices or use prepaid data; avoid unnecessary large downloads.

## 6. Culture and sensitivity
- Wellbeing/mental-health content: warm, non-stigmatizing language; avoid clinical labels used casually; provide trusted local resources and emergency contacts reachable at any time; consider that users may seek privacy (discreet icons/notifications, easy "quick exit" where appropriate).
- Religious and cultural calendars (Ramadan, Lebaran) change usage and expectations (timing, promos, tone).
- Imagery and illustration: reflect local diversity (hijab, varied skin tones, local settings) rather than generic stock visuals.
- Avoid humor or imagery that may be insensitive; test with local reviewers.

## 7. i18n engineering
- Externalize strings; never concatenate sentences; use ICU/plural rules.
- Set `lang`, `dir`; support text expansion without clipping (min-width/auto layouts, not fixed widths).
- Use `Intl` APIs for dates, numbers, currency, relative time.
- Test with pseudo-localization (long strings with accents) and with the longest real translations.
