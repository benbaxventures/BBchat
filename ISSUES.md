# BBchat — Review Findings & Fix Plan

Review date: 2026-11-11 · Scope: every file in the repo, plus a hands-on test of `index.html` in a browser (desktop 1024 px and mobile 375 px).

Work through the items **in order**. They are sorted by priority, and later items assume the earlier ones are done.

## Legend

| Indicator | Meaning | Rule |
|---|---|---|
| 🔴 **Critical** | Broken core function, or a legal / trust risk | Must fix **before any public deploy** |
| 🟠 **High** | Blocks maintenance or misleads users | Fix in the first sprint |
| 🟡 **Medium** | Quality, performance, SEO, PWA | Fix before calling it "v1" |
| 🟢 **Low** | Cleanup and polish | Fix when convenient |

Effort: **S** < 1 h · **M** ½–1 day · **L** several days
Status: `[ ]` open · `[~]` in progress · `[x]` done. Edit the checkbox in the table as you go.

---

## Summary board

| # | ID | Sev | Title | Effort | Status |
|---|---|---|---|---|---|
| 1 | BB-01 | 🔴 | Text fields lose focus after every keystroke | S | [x] quick fix 2026-11-12 |
| 2 | BB-02 | 🔴 | App source code is missing (only a compiled bundle exists) | M–L | [ ] |
| 3 | BB-03 | 🔴 | Branded as a "WhatsApp Clone" | S | [ ] |
| 4 | BB-05 | 🔴 | False "end-to-end encrypted" claim | S | [ ] |
| 5 | BB-06 | 🔴 | Fake payments use real provider names with no DEMO label | S | [ ] |
| 6 | BB-04 | 🟠 | In-app Dark theme toggle does nothing | S | [ ] |
| 7 | BB-07 | 🟠 | No persistence; log out does not clear state | M | [ ] |
| 8 | BB-10 | 🟠 | Public dashboard shows made-up statistics | S | [ ] |
| 9 | BB-11 | 🟠 | Stubs and duplicate files pose as real code | S | [ ] |
| 10 | BB-12 | 🟠 | Four deploy targets configured; GitHub Pages publishes everything | S | [ ] |
| 11 | BB-14 | 🟠 | Docs are wrong (missing `.htaccess`, wrong "separated" version, demo phone number) | S | [ ] |
| 12 | BB-08 | 🟡 | PWA is broken: manifest not linked, service worker never registered and caches wrong files | M | [ ] |
| 13 | BB-09 | 🟡 | `<title>` is "React Artifact"; no meta description, favicon or social tags | S | [ ] |
| 14 | BB-13 | 🟡 | 443 KB HTML: 200 KB of base64 logo and the full Tailwind preflight inline | M | [ ] |
| 15 | BB-15 | 🟡 | GA4 guide refers to a placeholder that does not exist | S | [ ] |
| 16 | BB-16 | 🟡 | Invalid CSS and an undefined safe-area variable | S | [ ] |
| 17 | BB-17 | 🟡 | OTP input: no paste, no labels; phone number not normalised | S | [ ] |
| 18 | BB-18 | 🟢 | Settings toggles (Notifications, Chat lock) only change a label | S | [ ] |
| 19 | BB-19 | 🟢 | Hard-coded dates and leftover export-tool code | S | [ ] |
| 20 | BB-20 | 🟢 | No `.gitignore`, `package.json`, linting, tests or CI checks | M | [ ] |

---

## 🔴 Critical

### BB-01 — Text fields lose focus after every keystroke · 🔴 · S

> ✅ **Quick fix applied 2026-11-12.** In `index.html`, all 17 call sites now call the inner components as plain functions (`Pt({…})`, `Ka({…})`, `Wa({})`, …) instead of `o(Pt,{…})`. Tested in the browser, typing key by key: the phone number (9 digits), OTP (auto-advance works while the countdown ticks), profile name, chat search ("mum" filters to Mum) and the message composer ("hello" + Enter sends, focus survives the auto-reply). Status, Calls, Channels, Settings and Chats still render, with no console errors.
> **Still open:** the *proper* fix (move the components to module scope) belongs to the source rebuild in `BB-02`.

**Where:** `index.html`, inline `<script type="module">`, main component `Ia`. Seven sub-components are **declared inside** `Ia` and rendered as components: `Pt` (page wrapper), `Ka` (chat pane), `Wa`, `qa`, `Xa`, `Va`, `ja` (Status / Calls / Channels / Communities / Settings).

**What happens:** each render of `Ia` creates new function identities for these components. React treats each one as a *different component type*, so it unmounts and remounts the whole subtree on every state change. Every keystroke changes state, so the input is destroyed and recreated, and focus drops to `<body>`.

**Verified in the browser:**
- Phone, OTP, profile name and about, chat **search**, and the chat **message composer** each accept **one character**, then lose focus.
- In the OTP screen, auto-advance to the next box fails, and the 30 s countdown re-mounts the boxes every second.

**Impact:** the core feature (typing a message) is unusable for real users.

**Fix (quick, safe, no source needed):** none of the seven inner components uses hooks, so they can be **called as plain functions** instead of rendered as components. In the minified bundle, replace the 17 call sites:

```
o(Pt,{   →  Pt({      (5×)
o(Ka,{   →  Ka({      (2×)
o(Wa,{}) →  Wa({})    (2×)   … same for qa, Xa, Va, ja (2× each)
```

Match on a preceding `(`, `,`, `:`, `?` or space so that identifiers like `Lo(Pt,` are not touched.

**Fix (proper, after BB-02):** move each sub-component to module scope and pass the state it needs as props, or lift the state into context.

**Verify:** click the composer, type `hello` key by key, and confirm all five letters appear and the field keeps focus. Repeat for search, phone, profile name and OTP auto-advance.

---

### BB-02 — App source code is missing · 🔴 · M–L

**Where:** the whole repo. `index.html` is the compiled output of a React 18 + Tailwind 3.4.18 "artifact" export (the `<title>` is literally "React Artifact"). There is no `src/`, no `package.json` and no Tailwind config.
`index-separated.html`, `js/app.js` and `js/full-app.js` *claim* to be the maintainable version, but they are only 30-line stubs that print "open index.html".

**Impact:** every change means editing ~200 KB of minified JS. No one can review, test or safely extend it.

**Fix:**
1. Ask the person who handed over the site for the original source (or the chat/project in the AI tool that generated it; a `.freebuff/` folder suggests the Freebuff desktop tool).
2. If it cannot be recovered, rebuild it as Vite + React + TS + Tailwind. The formatted bundle (≈ 2,600 lines of app code after `prettier`) is a usable reference for screens, seed data and styling.
3. Split it into `src/screens/*`, `src/components/*`, `src/plugins/*` and `src/data/seed.ts`.

**Verify:** `npm run build` produces `dist/index.html`, and the app behaves the same as today (minus the bugs).

---

### BB-03 — Branded as a "WhatsApp Clone" · 🔴 · S

**Where:** the old `README.md` / `README-DEPLOY.md` title, `manifest.json` `name`, the `index-separated.html` `<title>`, `js/app.js`, and both CSS file headers. The UI also closely reuses WhatsApp's palette (`#075E54`, `#128C7E`, `#25D366`, `#efeae2`, `#d9fdd3`) and layout.

**Impact:** "WhatsApp" is a registered Meta trademark. Publicly calling the product a "WhatsApp Clone" on a company domain risks a takedown or app-store rejection. The first commit's README described it as "an original chat app inspired by familiar messaging workflows", which is the safer wording.

**Fix:** remove "WhatsApp" from every user-facing string and file. Consider shifting the primary colour toward BENBAX navy/gold so the product reads as its own brand. Get a business or legal decision on naming.

**Verify:** `grep -ri whatsapp .` returns only historical notes.

---

### BB-05 — False "end-to-end encrypted" claim · 🔴 · S

**Where:** chat pane banner: "🔒 Messages are end-to-end encrypted on BBchat • BENBAX watermark active". Also the splash text "Connecting to BBchat Server…" and the app header badge "Connected to BBchat Server".

**Impact:** nothing is encrypted, and nothing even leaves the browser. A false security claim is a consumer-protection and trust problem.

**Fix:** replace it with an honest demo notice, e.g. "🔒 Demo mode — messages stay on this device and are not sent." Change the splash text to "Loading…".

**Verify:** search the bundle for `encrypted` and `Server`.

---

### BB-06 — Fake payments use real provider names with no DEMO label · 🔴 · S

**Where:** Pay plugin (MTN MoMo, Vodafone Cash, AirtelTigo, Binance Pay), a PIN hint "demo 1234", a "Payment sent ✓" screen and a shareable receipt bubble "Payment sent: GH₵ … via MTN MoMo". The seed chats "MTN MoMo" and "Binance Ghana" show "You received GH₵ 250.00".

**Impact:** a screenshot of a realistic "Payment sent" receipt can be used to deceive people. Using provider names implies a partnership that does not exist.

**Fix:** add a persistent **DEMO – no money is moved** badge on the Pay sheet, the success screen and the receipt bubble. Remove or rename the provider-branded seed chats. Never collect a real PIN in the client. Real payments must go through an official provider API with server-side verification (see the README, section 10).

**Verify:** every payment surface shows the DEMO badge.

---

## 🟠 High

### BB-04 — In-app Dark theme toggle does nothing · 🟠 · S

**Where:** Settings → Theme. It sets class `dark` on the root wrapper, but colours come from CSS variables that switch only inside `@media (prefers-color-scheme: dark)`. Only 4 `dark:` utilities exist.

**Verified:** after toggling, the label reads "Dark" and the toast says "Dark theme", but the body stays `rgb(238,242,239)` and the cards stay white.

**Fix:** duplicate the dark variable block under `.dark { … }` (or `:root.dark`), and put the class on `<html>` so that the body background also changes. Optionally offer System / Light / Dark.

**Verify:** toggle in Settings → the background and cards turn dark; toggle back → light.

---

### BB-07 — No persistence; log out does not clear state · 🟠 · M

**Where:** all state is `useState` in `Ia`. There is no `localStorage` and no backend.

**Impact:** a page reload sends the user back to the splash and the sign-in flow, and every message and setting is lost. "Log out" only switches the screen back to welcome; profile and chats stay in memory.

**Fix (demo level):** persist `profile`, `chats`, `theme` and `wallpaper` to `localStorage` (wrapped in try/catch). Skip the sign-in flow if a profile exists. On log out, clear the storage and reset state.
**Fix (product level):** a real backend; see the README, section 10.

**Verify:** send a message, reload, and it is still there. Log out, reload, and you are back at welcome with no data.

---

### BB-10 — Public dashboard shows made-up statistics · 🟠 · S

**Where:** `dashboard.html` and its duplicate `dashboard-bbchat.html`: "Total Users: 1,247 • Total Chats: 3,420 • Total Minutes: 12,890 • Active Now: 42". Static text with no auth, reachable at `/dashboard`.

**Impact:** fabricated metrics on a public URL mislead anyone who finds them (investors, partners, users).

**Fix:** delete both files, or keep one behind auth with real data or clearly labelled sample data.

---

### BB-11 — Stubs and duplicate files pose as real code · 🟠 · S

**Duplicates (byte-identical):** `dashboard.html` = `dashboard-bbchat.html` · `README.md`(old) = `README-DEPLOY.md` · `benbax-logo.png` = `assets/benbax-logo.png` · `favicon.ico` = `assets/favicon.ico` · `benbax-logo-64.png` = `assets/benbax-logo-64.png`.
**Near-duplicates / stubs:** `css/style.css` ≈ `css/full-style.css` · `js/app.js` ≈ `js/full-app.js` · `index-separated.html`.

**Impact:** a new developer will edit `js/app.js` or `css/style.css` and see no change. They also bloat whatever gets deployed.

**Fix:** delete the stubs and duplicates. Keep a single `public/` (or `assets/`) folder for the logo, favicon and manifest. Remove `README-DEPLOY.md` (superseded by `README.md`).

---

### BB-12 — Four deploy targets; GitHub Pages publishes everything · 🟠 · S

**Where:** `vercel.json`, `_redirects` (Netlify), `.github/workflows/static.yml` (GitHub Pages, `path: '.'`), and cPanel instructions.

**Impact:** with GitHub Pages enabled, every push to `main` publishes the whole repo, including `.freebuff/project-id`, internal docs and the fake dashboard. Two hosts behind one domain also cause confusion.

**Fix:** choose one host (Vercel is the best fit for the existing config). Delete the other configs. If you keep the GitHub Pages workflow, upload only a build folder (`path: dist`).

---

### BB-14 — Docs are wrong · 🟠 · S

- The old README lists `.htaccess`. **It does not exist.**
- It says `index-separated.html` is "for maintenance". It is a stub (BB-02).
- It publishes a specific mobile number (`054…3031`) as the "demo phone". The app accepts any 9+ digit number. If that number belongs to a real person, remove it.
- `GA4-SETUP-GUIDE.md` refers to `G-BBCHAT`, which is not present (BB-15).

**Fix:** done in the new `README.md`. Delete `README-DEPLOY.md` and fix or delete `GA4-SETUP-GUIDE.md`.

---

## 🟡 Medium

### BB-08 — PWA is broken · 🟡 · M

- `index.html` has no `<link rel="manifest">`, and nothing calls `navigator.serviceWorker.register`.
- `sw.js` pre-caches `css/style.css` and `js/app.js` (unused stubs), uses cache-first forever, never deletes old caches and has no `skipWaiting` or update path. **If it is registered as-is, users get stuck on old versions.**
- `manifest.json`: `start_url: "/index.html"` breaks under a sub-path (GitHub Pages `/BBchat/`, cPanel `/bbchat/`). Icons are 64 and 500; installability needs **192×192 and 512×512** (plus a maskable icon).

**Fix:** generate 192/512/maskable icons, set `start_url: "./"` and `scope: "./"`, and link the manifest with `<meta name="theme-color">`. Either remove `sw.js` or replace it with a versioned, network-first-for-HTML worker (e.g. Workbox via `vite-plugin-pwa`).

**Verify:** Chrome DevTools → Application → Manifest shows no errors; Lighthouse PWA "Installable" passes.

---

### BB-09 — Page metadata · 🟡 · S

`<title>React Artifact</title>`. No `meta description`, no favicon link, no `theme-color`, no Open Graph or Twitter tags.

**Fix:**

```html
<title>BBchat by BENBAX</title>
<meta name="description" content="BBchat — chat, call and connect. A BENBAX demo from Tema, Ghana.">
<meta name="theme-color" content="#0a1931">
<link rel="icon" href="favicon.ico">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<link rel="manifest" href="manifest.json">
<meta property="og:title" content="BBchat by BENBAX">
<meta property="og:image" content="https://bbchat.benbaxco.com/icons/og.png">
```

---

### BB-13 — Page weight · 🟡 · M

`index.html` is **443 KB**: ≈ 198 KB is the 500×500 logo as base64 (shown at most 96 px), ≈ 6 KB the 64 px logo, plus the full Tailwind preflight and a second copy of the Google Fonts `@import`.

**Fix:** serve the logo as a separate, cacheable file at 192 px in WebP/PNG (~10 KB). Load fonts with `<link rel="preconnect">` + `<link rel="stylesheet">` instead of `@import` (which blocks rendering). After BB-02, Vite and Tailwind purge produce a much smaller bundle with hashed filenames.

**Verify:** Lighthouse performance on mobile; target HTML + JS < 200 KB gzip.

---

### BB-15 — Analytics not installed · 🟡 · S

`GA4-SETUP-GUIDE.md` says "Replace G-BBCHAT in index.html". No `gtag` or GA code exists anywhere. The listed events (`new_user`, `chat_open`, `message_sent`, `plugin_used`, `payment_simulated`) are not wired.

**Fix:** decide whether analytics is wanted. If so, add the GA4 snippet with the real Measurement ID and a cookie-consent banner (Ghana's Data Protection Act 2012 and GDPR for EU visitors). Fire the five events from the relevant handlers.

---

### BB-16 — Invalid CSS and an undefined variable · 🟡 · S

- In the last `<style>` block, `@import url(fonts…)` appears **after** other rules, so browsers ignore it. Raw `@tailwind base; @tailwind components; @tailwind utilities;` directives were left in the compiled CSS (ignored, but evidence of a broken build step).
- `paddingTop: var(--safe-area-inset-top)` is used on splash and other pages, but `--safe-area-inset-top` is never defined. On notched iPhones in standalone mode, content can sit under the status bar.

**Fix:** remove the stray `@import` and `@tailwind` lines. Use `env(safe-area-inset-top)` and add `viewport-fit=cover` to the viewport meta tag.

---

### BB-17 — OTP and phone input details · 🟡 · S

- The OTP boxes have `maxLength=1` and no paste handler, so pasting `123456` only fills one box. No `autocomplete="one-time-code"`, so iOS/Android SMS autofill will not work once real SMS exists.
- The six OTP inputs have no `aria-label` (screen readers hear "edit text" × 6).
- The phone number is not normalised: entering `054…` displays `+233 054…` (Ghana numbers drop the leading 0 after +233).

**Fix:** handle `onPaste` and spread the digits; add `autocomplete="one-time-code"` on the first box and `aria-label="Digit n of 6"`; strip a leading `0` when a country code is chosen.

---

## 🟢 Low

### BB-18 — Settings toggles do nothing · 🟢 · S
"Notifications" and "Privacy • Chat lock" flip a label and show a toast, with no effect. Either implement them (Notification API permission request; a PIN screen for lock) or mark them "Coming soon".

### BB-19 — Hard-coded dates and leftover export-tool code · 🟢 · S
- The scheduler defaults to `2026-06-20 10:00` and a seeded item on `2026-06-20`, which is already in the past. Default to "now + 1 h".
- The seed message times ("09:24", "Yesterday") are static.
- Leftover export-tool code at the bottom of `index.html`: an external-link rewriter script and an empty `data-clippy-inline-media-manifest` JSON. Remove them in the rebuild.

### BB-20 — Project hygiene · 🟢 · M
- No root `.gitignore` (add `node_modules/`, `dist/`, `.freebuff/`, `.vercel/`, `.env*`).
- Most files are **untracked** in git (only `README.md` and the workflow are committed). Commit a clean baseline before changing anything, so every fix is reviewable.
- No `package.json`, ESLint, Prettier, tests or PR checks. Add Playwright smoke tests for: sign-in → send a message → reload → theme toggle.

---

## Suggested sprint plan

| Sprint | Items | Outcome |
|---|---|---|
| **0 — Baseline** (½ day) | BB-20 (git baseline + `.gitignore`), BB-11, BB-14 | Clean, honest repo |
| **1 — Make it usable & honest** (1 day) | BB-01 (quick patch), BB-05, BB-06, BB-03, BB-10, BB-09, BB-12 | Safe to put on a public URL as a **demo** |
| **2 — Rebuild source** (2–4 days) | BB-02, then the proper BB-01 fix, BB-04, BB-16, BB-13 | Maintainable Vite project, small bundle |
| **3 — Demo polish** (1–2 days) | BB-07, BB-08, BB-17, BB-18, BB-19, BB-15 | Installable PWA demo with persistence |
| **4 — Real product** | Backend, real OTP, real messaging, real payments | Out of scope for this review; needs product decisions |
