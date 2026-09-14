# No Debates

End group chat indecision in 3 seconds flat. Type your options, spin the prize wheel, and share the locked verdict. No accounts, no voting, no 40-message arguments.

## Features

- **Prize-wheel decider** — canvas wheel with easing, tick sounds, and confetti on lock-in
- **Editable templates** — dinner, drinks, game night, movies, coffee runs, day trips (edits persist locally)
- **Sealed receipts** — every verdict gets a timestamped, hashed receipt marked FAIR SELECTOR. Any edit breaks the proof
- **Shareable verdicts** — copy chat-formatted text (WhatsApp/Telegram), proof links (`…/v/<code>`), or downloadable receipt images (PNG tickets)
- **Squad spins** — share a room link, friends add options live, everyone watches the lock-in. Only the creator can spin
- **Ritual preset packs** — one-tap question presets (Lunch lottery, Demo roulette, On-call lottery…) with a live present-mode screen at `/e/<roomId>`
- **Speed round** — rapid-fire head-to-head duels with a running tally and a sprint champion, built for streams and big screens
- **Embeddable live board** — chromeless `/e/<roomId>` screen for OBS, presentations, and iframes that animates in sync
- **Fair flip API** — `POST /api/flip` returns a fair verdict with a verifiable receipt URL for bots and integrations
- **Landing showcases** — the marketing page walks through every way to settle a debate: solo machine, squad spins, speed round, live screen, and the flip API
- **Spin clips** — every spin is recorded and exportable as video
- **History + stats** — local decision log with settled counts, weekly pace, and day streaks
- **Mobile bottom tab bar + desktop navbar** — full-width bottom bar with animated concave cutout on mobile; sticky navbar with direct access to Machine, Speed round, Squad, and History on desktop

## Routes

| Route           | What it is                                  |
| --------------- | ------------------------------------------- |
| `#/`            | Landing page                                |
| `#/machine`     | Standalone decision machine                 |
| `#/speed`       | Speed round (head-to-head sprints)          |
| `#/history`     | Decision log with stats                     |
| `#/squad[/id]`  | Squad lobby + live rooms                    |
| `#<payload>`    | Shared sealed-verdict receipt               |
| `#/terms`       | Terms                                       |
| `#/privacy`     | Privacy                                     |
| `#/nodb-admin`  | Admin dashboard (traffic + usage, login-gated) |
| `/v/<code>`     | Bot-facing proof page (OG tags, auto-bounces to the receipt) |
| `/e/<roomId>`   | Chromeless embeddable live board            |

Shared links are fully self-contained: the question, options, and winning index are encoded in the URL. No solo data touches a server.

## Tech

React 18 + TypeScript + Vite + Tailwind CSS, Motion for reveals, canvas-confetti, Web Audio API for synthesized sounds, DiceBear avatars, Lucide/Heroicons. Squad multiplayer and anonymous page-view counts run on Convex; share/OG rendering runs on Vercel edge functions (`/v/`, `/api/og-image`, `/api/flip`).

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Backend (squad rooms)

Squad multiplayer runs on Convex. Local dev:

```bash
npx convex dev
```

The URL it prints goes into `.env.local` as `VITE_CONVEX_URL`. Production needs the same variable set in Vercel. Without it, the squad page shows setup instructions and everything else works.

Admin dashboard (`#/nodb-admin`) is login-gated. Seed the first admin:

```bash
npx convex run admins:seed '{"email":"you@example.com","passcode":"a-long-secret"}' --prod
```

## Privacy

Solo play is fully client-side: history and template edits live in `localStorage` and are never uploaded. Squad rooms sync through Convex so every player sees the same room; anyone with a room link can read it. The traffic dashboard stores only anonymous page-view counts (page name, day, count) — never content or identity. See `#/privacy` for the full policy.