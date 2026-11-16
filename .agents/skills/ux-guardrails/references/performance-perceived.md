# Performance as UX

Contents: 1 Targets · 2 Perceived speed · 3 Layout stability · 4 Responsiveness · 5 Assets and network · 6 Resilience · 7 Checklist

Speed is a UX feature. In many markets (including Indonesia) a large share of users are on mid-range Android phones and variable mobile networks, so design for that baseline.

## 1. Targets (Google Core Web Vitals, measured at the 75th percentile of real users)
- **LCP** (largest content visible): ≤ 2.5 s (poor > 4 s).
- **INP** (responsiveness to interaction): ≤ 200 ms (poor > 500 ms).
- **CLS** (layout shift): ≤ 0.1 (poor > 0.25).
- Doherty threshold: keep response under ~400 ms to maintain flow; acknowledge input immediately even if the result takes longer.

## 2. Perceived speed
- Show structure immediately (skeletons), then fill content. Show something meaningful within 1 second.
- Use optimistic UI for low-risk actions; roll back with a clear message on failure.
- Prefetch likely next routes on hover/visible; keep transitions short (150–250 ms) and purposeful.
- Progress feedback for operations > ~1s; percentage or steps for > ~4s.
- Don't block the whole page for one slow widget; load independently.

## 3. Layout stability (CLS)
- Always set `width`/`height` or `aspect-ratio` on images, video, iframes, ads and embeds.
- Reserve space for async content (skeleton with same dimensions), banners, and cookie bars (overlay rather than push content).
- Font loading: `font-display: swap` with a metric-compatible fallback; preload the critical font; subset fonts.
- Animate with `transform`/`opacity`, not properties that trigger layout (top, height, margin).
- Don't inject content above existing content after load.

## 4. Responsiveness (INP)
- Keep main-thread tasks short (< 50 ms); split heavy work, defer non-critical JS, use workers for heavy computation.
- Debounce search inputs (~200–300 ms); throttle scroll/resize handlers; use passive listeners.
- Virtualize very long lists; avoid rendering thousands of DOM nodes.
- Avoid layout thrash in animation loops.

## 5. Assets and network
- Images: modern formats (AVIF/WebP), responsive `srcset`/`sizes`, `loading="lazy"` below the fold, high-priority and no lazy for the LCP image, compress aggressively, no oversized hero images on mobile.
- Ship less JS and CSS: code-split by route, tree-shake, avoid heavy libraries for small features.
- Use caching and CDN; compress with Brotli/gzip; minimize third-party scripts.
- Video: poster image, `preload="none"`, no autoplay with sound, respect data-saver.
- Respect `prefers-reduced-data` / Save-Data where available.

## 6. Resilience
- Offline/slow states are designed: retry buttons, cached content, clear messaging.
- Timeouts have user-facing explanations; long operations survive reloads.
- Forms preserve input if the network fails; avoid double-submit.
- Support low-end devices: avoid heavy blur/backdrop-filter, large box-shadows and many simultaneous animations on scrolling lists.

## 7. Checklist
- [ ] LCP image prioritized, not lazy-loaded
- [ ] Images have dimensions; no layout shifts on load
- [ ] Fonts subsetted with fallback; no invisible text flash
- [ ] Skeletons match final layout
- [ ] Interactions respond < 200 ms to first visual feedback
- [ ] Heavy JS deferred; third-party scripts audited
- [ ] Works on slow 4G and a mid-range Android
