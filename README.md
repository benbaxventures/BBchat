# BBchat by BENBAX

BBchat is a chat app demo branded for BENBAX (Katamanso / Apolonia / Tema, Ghana). It has a phone + OTP sign-in flow, a chat list with conversations, status, calls, channels, communities, settings and a "plugins" panel (payments, polls, games, translate, scheduler and more).

> ⚠️ **Status: front-end prototype, not production-ready.**
> There is **no backend**. Nothing is sent, stored, encrypted or paid. Every message, reply, call and payment is simulated in the browser and lost on reload. (Fixed 12–14 Nov 2026: `BB-01` typing bug, `BB-02` source code recovered into [app/](app), `BB-03` "WhatsApp Clone" naming, `BB-04` dark theme switch, `BB-05` false server/encryption claims, `BB-06` unlabelled fake payments.)
> Read [ISSUES.md](ISSUES.md) before deploying.

---

## Contents

1. [What this repository actually contains](#1-what-this-repository-actually-contains)
2. [How the app works](#2-how-the-app-works)
3. [Feature status](#3-feature-status)
4. [Demo sign-in](#4-demo-sign-in)
5. [Running locally](#5-running-locally)
6. [Deploying](#6-deploying)
7. [Configuration files explained](#7-configuration-files-explained)
8. [Brand assets](#8-brand-assets)
9. [Known issues and fix plan](#9-known-issues-and-fix-plan)
10. [Recommended target architecture](#10-recommended-target-architecture)
11. [Contacts](#11-contacts)

---

## 1. What this repository actually contains

The app's **source code** is in `app/`, and the deployed site is **one built file**, `index.html`. Around them are stubs and duplicates from the handover.

| File | Size | What it really is | Keep? |
|---|---|---|---|
| `app/` | — | **The app's source code** (React 18 + Vite + Tailwind 3.4). Recovered from the compiled handover file in `BB-02`. Edit here, then run `npm run release`. | ✅ Yes, this is where changes are made |
| `index.html` | 433 KB | **The deployed app.** A single self-contained file *built from `app/`* (`npm run release`), with JS, CSS and both logos inlined. Page title is still "React Artifact" (`BB-09`). | ✅ Yes, but don't edit it by hand |
| `index-separated.html` | 0.7 KB | A **stub**. It only shows a "BBchat – open index.html" card. It is **not** a maintainable version of the app. | ❌ Remove or replace |
| `js/app.js` | 1.8 KB | A stub that renders the card above, plus unused helpers (`verifyOTP`, `verifyPIN`, `sendMoney`). | ❌ Remove |
| `js/full-app.js` | 2.0 KB | Same as `js/app.js` plus a comment. **Not** the app logic. | ❌ Remove |
| `css/style.css` | 1.8 KB | Small hand-written stylesheet. **Not used by `index.html`.** Used only by the stubs and the dashboard. | ⚠️ Only if dashboard stays |
| `css/full-style.css` | 2.0 KB | Same as `style.css` plus a few CSS variables. Unused. | ❌ Remove |
| `dashboard.html` | 0.5 KB | Static page with **hard-coded, made-up stats** (1,247 users, etc.). | ⚠️ Decide (see `BB-10`) |
| `dashboard-bbchat.html` | 0.5 KB | Byte-for-byte duplicate of `dashboard.html`. | ❌ Remove |
| `benbax-logo.png` / `assets/benbax-logo.png` | 148 KB each | 500×500 logo, duplicated. | Keep one |
| `benbax-logo-64.png` / `assets/…` | 4.6 KB | 64×64 logo. | Keep one |
| `favicon.ico` / `assets/favicon.ico` | 1.6 KB | Duplicated. **Not linked from `index.html`.** | Keep one, link it |
| `manifest.json` | — | PWA manifest. **Not linked from `index.html`.** | Fix (see `BB-08`) |
| `sw.js` | — | Service worker. **Never registered**, and it caches the wrong files. | Fix or remove (`BB-08`) |
| `vercel.json` | — | Vercel config: clean URLs, SPA rewrite, 1-hour cache. | Keep if Vercel |
| `_redirects` | — | Netlify SPA fallback. | Keep if Netlify |
| `.github/workflows/static.yml` | — | GitHub Pages deploy of the **whole repo** on push to `main`. | Decide one host (`BB-12`) |
| `README-DEPLOY.md` | — | The old README (identical to the previous `README.md`). | Superseded by this file |
| `GA4-SETUP-GUIDE.md` | — | Says to replace `G-BBCHAT` in `index.html`. **That placeholder does not exist**, so no analytics is installed. | Fix (`BB-15`) |
| `.freebuff/` | — | Local metadata from the Freebuff AI desktop tool. | Ignore in git |

> 🔎 **Source code (fixed in `BB-02`):** the handover contained no source code, only the compiled `index.html`. The source has been recovered from it into `app/` as readable React/JSX with meaningful names. The rebuilt app was checked against the old file screen by screen and is pixel-identical.

The old README also lists a `.htaccess` file. **It does not exist.**

---

## 2. How the app works

Everything runs in the browser. React state lives in one large component, `App` in [app/src/App.jsx](app/src/App.jsx). Its tabs (`ChatPane`, `StatusTab`, `CallsTab`, `ChannelsTab`, `CommunitiesTab`, `SettingsTab`) are inner functions that share that state. Seed data is in [app/src/data.js](app/src/data.js) and icons are in [app/src/icons.jsx](app/src/icons.jsx). Nothing is persisted (no `localStorage`, no API, no database).

> The inner tab components are **called as functions** (`ChatPane({})`), not rendered as `<ChatPane />`. This is deliberate (`BB-01`): rendering a component declared inside `App` would remount it on every keystroke. To turn one into a normal component, move it out of `App` and pass the state it needs as props.

### Screen flow

```
splash (auto, 1.9 s)
  └─► welcome ── "Agree and Continue" ──► phone
                                           ├─ pick country (+233 GH, +1 US, +44 UK, +234 NG)
                                           ├─ enter ≥ 9 digits
                                           └─► otp (6 boxes, 30 s resend timer)
                                                 └─ code must equal 123456
                                                    └─► profile (name required, about, avatar colour)
                                                          └─► app
                                                               ├─ Chats     (12 seeded conversations)
                                                               ├─ Status
                                                               ├─ Calls     (fake "On call" pill)
                                                               ├─ Channels / Communities
                                                               └─ Settings  (theme, wallpaper, notifications, lock, log out)
```

### Messaging logic

* Sending a message appends it to the open chat, shows a "typing…" indicator, then after **1.4 s** adds a random canned reply from a list of 5.
* Seed data: 12 chats (BENBAX Family, Ventures Group, Ama Mensah, Wallet Alerts (demo), Crypto Desk (demo), Mum, Dad, …), each with 1–3 hard-coded messages.
* Polls, payments, stickers, locations and so on are posted as special message "kinds" inside the same in-memory list.

### Payments (simulated)

The Pay plugin takes an amount in GH₵, a method (MTN MoMo, Vodafone Cash, AirtelTigo, Binance Pay) and a PIN. If the PIN is `1234`, it shows "Demo payment — no money moved" and can post a receipt bubble ("DEMO • GH₵ … (not real)") into the chat. A yellow **DEMO ONLY** banner sits at the top of the sheet. **No money moves.** There is no MoMo, Binance or bank integration.

### Theming

Colours come from CSS variables on `:root` (`--surface`, `--card`, `--ink`, `--wa`, `--green`, `--navy`, …) in [app/src/index.css](app/src/index.css). The app starts from the device's light/dark setting. The **Settings → Theme** toggle then puts `.dark` or `.light` on `<html>`, which overrides it (fixed in `BB-04`).

---

## 3. Feature status

Legend: ✅ works · 🟡 simulated (UI only) · ❌ broken / does nothing

| Area | Status | Notes |
|---|---|---|
| Splash / welcome / country picker | ✅ | |
| Typing into any text field | ✅ | Fixed in `BB-01` (fields used to lose focus after every keystroke) |
| OTP sign-in | 🟡 | Fixed code `123456`, no SMS. Auto-advance works; paste does not (`BB-17`) |
| Profile setup | 🟡 | Kept in memory only |
| Chat list, filters (All / Unread / Favourites / Groups) | ✅ | Search included |
| Send message + auto-reply | 🟡 | Random canned reply |
| Demo-mode notices | ✅ | The false "end-to-end encrypted" and "Connected to BBchat Server" claims are replaced with honest demo notices (`BB-05`) |
| Voice / video calls | 🟡 | Shows an "On call" pill, no audio or video |
| Status, Channels, Communities | 🟡 | Local UI only |
| Payments (MoMo / Vodafone / AirtelTigo / Binance) | 🟡 | PIN `1234`; every payment screen and receipt is labelled DEMO (`BB-06`) |
| Polls, stickers, emoji, GIFs, location, tic-tac-toe, translate (Twi / Ga / French, 3 phrases), scheduler, broadcast | 🟡 | Local UI only |
| Settings → Theme (Light / Dark) | ✅ | Fixed in `BB-04`; works both ways and follows the device setting at start |
| Settings → Notifications, Chat lock | ❌ | Toggles a label only |
| Settings → Wallpaper | ✅ | |
| Log out | 🟡 | Returns to welcome but keeps all state in memory |
| Persistence across reload | ❌ | Everything resets (`BB-07`) |
| PWA install / offline | ❌ | Manifest not linked, service worker not registered (`BB-08`) |
| Analytics (GA4) | ❌ | Not installed (`BB-15`) |
| Mobile layout (375 px) | ✅ | No horizontal scroll; bottom tab bar |

---

## 4. Demo sign-in

| Step | Value |
|---|---|
| Country | any (Ghana +233 is the default) |
| Phone | any number with **9 or more digits** |
| OTP | `123456` |
| Payment PIN | `1234` |

In the OTP screen, click the first box and type the six digits; focus moves to the next box automatically.

---

## 5. Running locally

Requirements: Node.js 18+ (tested on Node 24), a modern browser, and an internet connection for Google Fonts (Sora, Plus Jakarta Sans). Without the fonts the app falls back to system fonts.

**Work on the source** (live reload):

```bash
cd app
```

```bash
npm install
```

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

**Build and update the deployed file:**

```bash
npm run release
```

This builds one self-contained `app/dist/index.html` and copies it to the repo-root `index.html`, which every hosting option below serves. Commit both the source change and the new root `index.html`.

| Script (in `app/`) | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm run build` | Builds `app/dist/index.html` only |
| `npm run release` | Builds, then copies the build to the root `index.html` |
| `npm run preview` | Serves the last build locally |

**Just view the current build** (no Node needed): open the root `index.html` in a browser.

---

## 6. Deploying

> Pick **one** host. The repo currently has config for four (`BB-12`). Fix at least the 🔴 items in [ISSUES.md](ISSUES.md) first.

Intended domains (from the original README): `https://bbchat.benbaxco.com` and `https://bbchat.benbaxventures.com`.

### Option A — Vercel (recommended for this repo)

`vercel.json` already rewrites unknown paths to `index.html` and sets `Cache-Control: public, max-age=3600`.

```bash
npx vercel@latest --prod
```

Custom domain: in Vercel, add `bbchat.benbaxco.com`, then create a DNS `CNAME bbchat → cname.vercel-dns.com` at your DNS provider (Cloudflare: set the proxy to **DNS only** while Vercel issues the certificate).

### Option B — Netlify

Drag and drop the folder in the Netlify UI. `_redirects` (`/* /index.html 200`) handles SPA routing.

### Option C — GitHub Pages

`.github/workflows/static.yml` deploys the **entire repo** (including `.freebuff/`, the docs and the duplicates) on every push to `main`. Enable Pages under *Settings → Pages → Source: GitHub Actions*.
Caveat: a project site is served under `/<repo>/`, so `manifest.json`'s `start_url: "/index.html"` points to the wrong place (`BB-08`).

### Option D — cPanel / shared hosting

Upload `index.html` (plus the logo, favicon and manifest if you fix `BB-08`) to `public_html/` or `public_html/bbchat/`. No `.htaccess` is needed for a single page with no client-side routes.

### Pre-deploy checklist

- [x] `BB-01` typing bug fixed
- [x] `BB-05` false "end-to-end encrypted" claim removed
- [x] `BB-06` payments clearly labelled **DEMO**
- [x] `BB-03` "WhatsApp Clone" naming removed (palette change still open)
- [ ] `<title>`, meta description and favicon set (`BB-09`)
- [ ] Only the intended files are published (`BB-11`, `BB-12`)

---

## 7. Configuration files explained

**`vercel.json`**

```json
{
  "cleanUrls": true,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{ "source": "/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600" }] }]
}
```

* `cleanUrls` serves `/dashboard` for `dashboard.html`.
* The rewrite sends every unknown URL to the app, so real 404s never happen.
* Everything is cached for 1 hour. That is fine for now; after a build pipeline exists, use hashed assets with long cache and `no-cache` on `index.html`.

**`manifest.json`**: name, `start_url: /index.html`, `display: standalone`, theme `#075E54`, icons 64×64 and 500×500. It is missing the 192×192 and 512×512 icons that Chrome needs to offer an install prompt, and it is not linked from any page that matters.

**`sw.js`**: cache-first with cache name `bbchat-v1`. It pre-caches `css/style.css` and `js/app.js` (stubs, unused by the app), never deletes old caches and has no update strategy. Registering it as-is would pin users to stale versions.

---

## 8. Brand assets

| Use | Size |
|---|---|
| Splash / welcome | 96 px |
| Phone screen | 32 px |
| Header / OTP | 24 px |
| Chat background pattern / watermark | 120 px / 280 px at 5–6 % opacity |

Source files: `benbax-logo.png` (500×500, 148 KB) and `benbax-logo-64.png` (64×64). Inside `index.html` both are base64 (≈ 200 KB of the 443 KB file). A 192 px WebP would be ≈ 10 KB (`BB-13`).

Palette: navy `#0a1931`, teal `#075E54` / `#128C7E`, green `#25D366`, gold `#f2b705`, chat background `#efeae2`.

---

## 9. Known issues and fix plan

See **[ISSUES.md](ISSUES.md)**. It is a numbered, prioritised list (`BB-01` … `BB-20`) with severity indicators, where each item says where the problem is, why it matters, how to fix it and how to verify it. Work through it top to bottom.

---

## 10. Recommended target architecture

To move from prototype to a maintainable product:

1. ✅ **Source recovered** as a Vite + React + Tailwind project in `app/` (`BB-02`). Next: split the 2,300-line `App.jsx` into one file per screen and plugin, and optionally move to TypeScript.
2. **Build output** goes to `dist/`, and only `dist/` is deployed.
3. **Backend for real chat** (when ready): auth with real SMS OTP (e.g. Firebase Auth, Supabase, or Twilio Verify), a realtime message store (Firebase / Supabase Realtime / your own WebSocket server), and media storage.
4. **Payments**: only through an official provider integration (MTN MoMo API, Paystack, Flutterwave, etc.) with server-side verification. Never trust the client.
5. **Quality**: ESLint + Prettier, a few Playwright smoke tests (sign-in, send message, theme), and CI on pull requests.

---

## 11. Contacts

BENBAX — https://www.benbaxco.com · https://www.benbaxventures.com · Katamanso Apolonia, Tema, Ghana
