# No Debates

End group chat indecision in 3 seconds flat. Type your options, spin the prize wheel, and share the locked verdict. No accounts, no voting, no 40-message arguments.

## Features

- **Prize-wheel decider** — canvas wheel with easing, tick sounds, and confetti on lock-in
- **Editable templates** — dinner, drinks, game night, movies, coffee runs, day trips (edits persist locally)
- **Sealed receipts** — every verdict gets a timestamped hash verifiable via proof link
- **Shareable verdicts** — copy chat-formatted text (WhatsApp/Telegram), proof links, or downloadable receipt images (PNG tickets)
- **Spin clips** — every spin is recorded and exportable as video
- **History + stats** — local decision log with settled counts, weekly pace, and day streaks
- **Mobile bottom tab bar** — full-width bar with animated concave cutout under the active tab
- **Squad spins** — share a room link, friends add options live, everyone watches the lock-in

## Routes

| Route        | Page                              |
| ------------ | --------------------------------- |
| `#/`         | Landing page                      |
| `#/machine`  | Standalone decision machine       |
| `#/history`  | Decision log with stats           |
| `#<payload>`  | Shared sealed-verdict receipt     |
| `#/terms`    | Terms                             |
| `#/privacy`  | Privacy                           |
| `#/squad`    | Squad lobby + live rooms          |

Shared links are fully self-contained: the question, options, and winning index are encoded in the URL hash. No server, no database.

## Tech

React 18 + TypeScript + Vite + Tailwind CSS, Motion for reveals, canvas-confetti, Web Audio API for synthesized sounds, DiceBear avatars, Lucide/Heroicons.

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

Copy the URL it prints into `.env.local` as `VITE_CONVEX_URL`. Production needs the same variable set in Vercel. Without it, the squad page shows setup instructions and everything else works.

## Privacy

Solo play is fully client-side: history and template edits live in `localStorage` and are never uploaded. Squad rooms sync through Convex so every player sees the same room; anyone with a room link can read it.
