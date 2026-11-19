# BBchat by BENBAX

BBchat is a chat app demo for BENBAX (Katamanso / Apolonia / Tema, Ghana). It has phone + code sign-in, chats, status, calls, channels, communities, settings and a plugins panel (payments, polls, games, translate, scheduler and more).

> ⚠️ **Status: front-end demo, not a live messaging service.**
> There is **no backend**. Messages are not sent to anyone, and nothing is encrypted or paid. In this demo, chats and settings are **saved on your own device** (BB-07) and stay there until you log out.
> Fixed so far: BB-01 to BB-14 (see [ISSUES.md](ISSUES.md)). The plan to a real product is in [SYSTEM-DESIGN.md](SYSTEM-DESIGN.md).

---

## Contents

1. [Repository layout](#1-repository-layout)
2. [How the app works](#2-how-the-app-works)
3. [Feature status](#3-feature-status)
4. [Demo sign-in](#4-demo-sign-in)
5. [Running locally](#5-running-locally)
6. [Deploying (Vercel)](#6-deploying-vercel)
7. [Configuration files](#7-configuration-files)
8. [Brand assets](#8-brand-assets)
9. [Issues, design and proof](#9-issues-design-and-proof)
10. [Contacts](#10-contacts)

---

## 1. Repository layout

```
BBchat/
├── app/                       ← the app: edit here
│   ├── src/
│   │   ├── main.jsx           entry: fonts, <App/>, service-worker registration
│   │   ├── App.jsx            all screens and state
│   │   ├── storage.js         save / load / clear on this device (BB-07)
│   │   ├── data.js            sample chats, countries, replies, emojis, translations
│   │   ├── icons.jsx          35 Lucide icons
│   │   ├── index.css          Tailwind, theme colours, animations
│   │   └── assets/            logos (288 px WebP used in the app; 500 px PNG master)
│   ├── public/                copied as-is into the build
│   │   ├── manifest.webmanifest   install-on-phone settings (BB-08)
│   │   ├── sw.js                  service worker: offline + install (BB-08)
│   │   ├── icons/                 192, 512, maskable, apple-touch, favicon-32
│   │   ├── favicon.ico
│   │   └── og-image.png           link-preview image, 1200×630 (BB-09)
│   ├── index.html             page title, description, sharing tags (BB-09)
│   ├── vite.config.js         build → app/dist/
│   └── package.json
├── vercel.json                hosting (the only host: BB-12)
├── .github/workflows/ci.yml   checks on every push (builds, publishes nothing)
├── docs/                      architecture diagram
├── proof/                     before/after proof reports for management
├── README.md · ISSUES.md · SYSTEM-DESIGN.md
└── BBchat-Review-and-Fix-Plan.docx
```

The handover's stubs, duplicates, fake dashboard and extra hosting files were removed in BB-10 and BB-11. They remain in git history (commit `bd3e148`).

---

## 2. How the app works

Everything runs in the browser. React state lives in `App` ([app/src/App.jsx](app/src/App.jsx)). Its tabs (`ChatPane`, `StatusTab`, `CallsTab`, `ChannelsTab`, `CommunitiesTab`, `SettingsTab`) are inner functions that share that state.

> The inner tabs are **called as functions** (`ChatPane({})`), not rendered as `<ChatPane />`. This is deliberate (BB-01): rendering a component declared inside `App` would remount it on every keystroke.

**Screen flow:** splash (1.9 s) → welcome → phone → code (`123456`) → profile → app (Chats · Status · Calls · Channels · Communities · Settings). A **returning signed-in user skips straight from the splash to their chats** (BB-07).

**Saved on the device (BB-07):** after sign-in, the profile, chats and messages, open chat, theme, wallpaper, plugin toggles, followed channels, status text and scheduled messages are saved in the browser's `localStorage` (key `bbchat:v1`) after every change. **Log out** deletes it and restarts the app. If storage is blocked (some private modes), the app still works, just without saving.

**Messages:** sending adds the message to the open chat. After 1.4 s, one of 5 canned replies arrives. Polls, payments, stickers and locations are message "kinds" in the same list.

**Payments:** simulated and labelled **DEMO** everywhere (PIN `1234`). No money moves (BB-06).

**Theme:** CSS variables in [app/src/index.css](app/src/index.css). The app starts from the device's light/dark setting, and the Settings → Theme toggle overrides it (BB-04).

**Offline and install (BB-08):** after the first visit, the service worker keeps a copy of the app, so it opens without signal. Pages are fetched fresh when online. Phones can install it to the home screen ("Add to Home screen" / "Install app").

---

## 3. Feature status

Legend: ✅ works · 🟡 simulated (demo only) · ❌ not working

| Area | Status | Notes |
|---|---|---|
| Typing in every field | ✅ | BB-01 |
| Sign-in | 🟡 | Fixed code `123456`, no SMS. Paste and autofill: BB-17 |
| Chats, search, filters | ✅ | |
| Send message + reply | 🟡 | Canned reply, not a real person |
| Saved after reload, cleared on log out | ✅ | BB-07 |
| Install on phone, open offline | ✅ | BB-08 (needs HTTPS, so on the live site) |
| Page title, description, link preview | ✅ | BB-09 |
| Demo notices (no false claims) | ✅ | BB-05 |
| Payments | 🟡 | DEMO labels everywhere (BB-06) |
| Calls | 🟡 | "On call" pill only |
| Status, Channels, Communities, polls, games, translate, scheduler | 🟡 | Local demo only |
| Theme (Light / Dark), Wallpaper | ✅ | BB-04 |
| Notifications, Chat lock toggles | ❌ | Label only (BB-18) |
| Analytics | ❌ | Not installed (BB-15) |

---

## 4. Demo sign-in

| Step | Value |
|---|---|
| Country | any (Ghana +233 is the default) |
| Phone | any number with **9 or more digits** |
| Code | `123456` (type it; focus moves box to box) |
| Payment PIN | `1234` (demo) |

---

## 5. Running locally

Requirements: Node.js 20+ (CI uses Node 20; developed on Node 24) and a modern browser. No internet connection is needed for fonts; they are bundled.

```bash
cd app
```

```bash
npm install
```

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). Edits reload instantly. The service worker is only active in production builds.

| Script (in `app/`) | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build to `app/dist/` |
| `npm run preview` | Serves `app/dist/` locally (test offline and install here) |

---

## 6. Deploying (Vercel)

Vercel is the **only** hosting setup (BB-12). It builds the app from source on every push, so there is no built file to commit.

1. In Vercel, **import** the GitHub repository. Leave the settings empty; `vercel.json` provides them (install `npm ci --prefix app`, build `npm run build --prefix app`, output `app/dist`).
2. Choose the **production branch** (`main`). Other branches and pull requests get preview links automatically.
3. Add the domain `bbchat.benbaxco.com`, then create a DNS record `CNAME bbchat → cname.vercel-dns.com` at your DNS provider (Cloudflare: proxy **DNS only** while the certificate is issued).

Only `app/dist` is published. `proof/`, `docs/` and the markdown files are **never** served.

**Other hosts (not set up):** to host elsewhere, run `npm run build` and upload the *contents* of `app/dist/` to the web root (it must be the domain root, because paths start with `/`).

### Pre-deploy checklist

- [x] BB-01 to BB-06 fixed (typing, source, naming, theme, claims, payments)
- [x] BB-07 to BB-14 fixed (saving, install/offline, metadata, no fake dashboard, cleanup, one host, size, docs)
- [x] Only the app is published (`outputDirectory: app/dist`)
- [ ] Vercel project created and domain connected (needs BENBAX's Vercel and DNS access)

---

## 7. Configuration files

**[vercel.json](vercel.json)**: install and build commands, output `app/dist`, clean URLs. Built files in `/assets/` (with content-hashed names) are cached for a year; `sw.js` is never cached, so updates reach users. It also adds `nosniff` and `Referrer-Policy` security headers. There is no catch-all rewrite, so missing pages return a real 404.

**[app/public/manifest.webmanifest](app/public/manifest.webmanifest)**: name "BBchat by BENBAX", `start_url` and `scope` `/`, standalone display, theme `#075E54`, 192, 512 and maskable 512 icons.

**[app/public/sw.js](app/public/sw.js)**: cache `bbchat-v2`. On install it caches the app shell plus the current JS and CSS. Pages are network-first (fresh when online, cached when offline); same-origin files are cache-first. Old caches are deleted on activate. **Change the `CACHE` name whenever `sw.js` itself changes.**

**[.github/workflows/ci.yml](.github/workflows/ci.yml)**: on every push and pull request it runs `npm ci`, `npm audit --omit=dev`, `npm run build`, and checks that the title, manifest and service worker are in the build. It deploys nothing.

---

## 8. Brand assets

| File | Size | Used for |
|---|---|---|
| `app/src/assets/benbax-logo-288.webp` | 7 KB | All in-app logos (96 px max sharp; 280 px faint watermark) |
| `app/src/assets/benbax-logo-64.png` | 4.6 KB | Small header logo |
| `app/src/assets/benbax-logo.png` | 148 KB | **Master** (not shipped; used to generate the files above) |
| `app/public/icons/*` | 1–50 KB | Phone and desktop app icons |
| `app/public/og-image.png` | 35 KB | Link preview on WhatsApp, Facebook, X, LinkedIn |

Fonts: Sora and Plus Jakarta Sans (variable, self-hosted via `@fontsource-variable`). Palette: navy `#0a1931`, teal `#075E54` / `#128C7E`, green `#25D366`, gold `#f2b705`, chat background `#efeae2`.

---

## 9. Issues, design and proof

* **[ISSUES.md](ISSUES.md)**: all 20 issues (BB-01 to BB-20) by priority, each with its fix and how it was verified.
* **[SYSTEM-DESIGN.md](SYSTEM-DESIGN.md)**: goals, current system, target v2 (real accounts and messaging), roadmap, decisions needed.
* **[proof/](proof)**: before/after reports for management (Week 2: BB-01 to BB-06; Week 3: BB-07 to BB-14).

---

## 10. Contacts

BENBAX — https://www.benbaxco.com · https://www.benbaxventures.com · Katamanso Apolonia, Tema, Ghana
