# CLASHBID

Competitive 1v1 cross-universe character auction game. The frontend ships a
complete **playable demo build**: a local, clearly-labeled simulation of the
entire match loop — matchmaking, shared-pool auctions with a 15-second turn
clock, escrow wallet settlement, deterministic battle scoring, and the lobby,
character database, and profile screens around it.

> **Status:** Demo build. All gameplay is a client-side simulation
> (`demo-*` stores), persisted to `sessionStorage`/`localStorage` only. There is
> no backend: no authentication, matchmaking, ranked ratings, or server
> authority. Data shown — 30 placeholder characters, challenges, rivalry
> results — is invented and clearly labeled "Demo".

## Stack

- Next.js 16.4.4 (App Router, Turbopack)
- React 19.3.1
- TypeScript 5.9.x (strict)
- Tailwind CSS 4.3.3 (token-driven design system)
- Motion 14 (`motion/react`) for animation, respecting reduced motion
- Zustand 5 for domain stores (match engine, rival AI, career, sound, auth)
- ESLint 9 with `eslint-config-next`
- Local Rajdhani + Inter font files via `next/font/local`

## Getting started

Requires Node.js 20.9+ (tested on Node 22.23.2).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command             | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the development server         |
| `npm run build`     | Create a production build            |
| `npm run start`     | Serve the production build           |
| `npm run lint`      | Run ESLint over the repository       |
| `npm run typecheck` | Run `tsc --noEmit` with strict rules |

## Routes

| Route                           | Status | Description                                       |
| ------------------------------- | ------ | ------------------------------------------------- |
| `/`                             | Ready  | Landing page / brand identity                     |
| `/lobby`                        | Ready  | Play hub, career stats, resume in-progress match  |
| `/characters`                   | Ready  | 30-character demo database with filters + detail  |
| `/leaderboard`                  | Ready  | Locked podium / standings (arrive with accounts)  |
| `/how-to-play`                  | Ready  | Full arena protocol explained end-to-end          |
| `/login`, `/register`           | Ready  | Local demo auth screens (session-only identity)   |
| `/profile`                      | Ready  | Local demo career, match history, achievements    |
| `/matchmaking`                  | Ready  | Animated 1v1 pairing flow → creates demo match    |
| `/match/[matchId]/challenge`    | Ready  | Challenge reveal → starts the auction             |
| `/match/[matchId]/auction`      | Ready  | Live arena: lots, bid/pass, 15s clock, wallet     |
| `/match/[matchId]/battle`       | Ready  | Staged evaluation reveal (deterministic scoring)  |
| `/results/[matchId]`            | Ready  | Verdict, breakdown, squad lists, rematch          |
| `*`                             | Ready  | Custom not-found page                             |

## Demo match rules

- 30 shared lots, 1v1 vs a scripted rival, ₹100 Cr war chest, 5-slot squads
- Bids from each lot's base price, rising in ₹1 Cr increments; first bid is the
  base price itself
- Every live bid is escrowed from the wallet; losing escrow is refunded
- 15-second turn clock shared by both players; expiry counts as a pass
- Pass while a rival leads → sold to that leader; two passes with no leader →
  unsold (no money leaves the wallet)
- Auction ends when both squads are full or lots are exhausted
- Battle evaluation is deterministic (`demo-eval-1.0`): weighted attribute
  averages + balance + synergy bonuses; identical squads always produce the
  identical result
- Wins/losses feed a local demo rating (never posted anywhere)

## Project structure

```text
src/
  app/                  Route entry points, root layout, global CSS, icon
  components/
    auction/            Lot stage, bid panel, activity feed, resolution overlay
    game/               Character artwork/cards, timers, wallet, match gate
    layout/             Site header, mobile navigation, footer
    motion/             Page transition and reveal primitives
    ui/                 Buttons, cards, badges, icons, containers, primitives
  features/             Domain-oriented feature modules
    auction/            Arena screen + stage clock
    auth/               Login/register screens
    characters/         Character database + filters + detail modal
    evaluation/         Battle and result screens
    home/               Landing sections
    leaderboard/        Podium + standings
    lobby/              Play hub
    matchmaking/        Pairing scene + challenge reveal
    profile/            Local career profile
  hooks/                Reusable client hooks
  lib/                  Demo datasets, site constants, utilities
  stores/               Zustand stores: demo-match, demo-rival, demo-career,
                        auth, sound (+ WebAudio synth in stores/tone.ts)
  store/                Typed external store foundation (navigation shell)
  styles/               Design tokens consumed by Tailwind CSS
  types/                Domain type contracts
  fonts/                Self-hosted Subset woff2 files + OFL licenses
docs/                   Architecture, design system, and Phase 0 report
```

## Design foundation

- Cinematic dark arena palette with gold as the single primary accent
- Rajdhani for display type, Inter for body copy; tabular numerals for all
  money, timers, and scores
- Tokenized color, typography, spacing, radius, shadow, easing, and motion
- Layered global background (gold haze, arena grid, vignette, grain)
- Responsive 12-column-friendly containers with fluid gutters and section rhythm
- Core primitives: `Button`, `Card`, `Badge`, `Container`, `PageHero`,
  `SectionHeading`, `EmptyState`, `Stat`, `Logo`
- Motion via `motion/react`; every cinematic animation is skipped under
  `prefers-reduced-motion`
- Optional synthesized sound cues (WebAudio), off by default, persisted toggle

See [docs/design-system.md](docs/design-system.md) for the token inventory and
usage rules.

## Demo boundaries

Explicitly **not** included yet:

- Authentication or player accounts (local demo identity only)
- Real matchmaking, rooms, or live sessions — the rival is a scripted local AI
- Backend, database, API routes, or server persistence
- Ranked ratings, leaderboards, or anti-cheat (nothing leaves the browser)
- Three.js, GSAP, or other 3D/animation dependencies

Character names, stats, and rival overtures are invented for the demo. When the
production backend lands, its authoritative resolution replaces the demo engine;
client animations only stage already-committed states.

## Documentation

- [Architecture](docs/architecture.md)
- [Design system](docs/design-system.md)
- [Phase 0 implementation report](docs/phase-0-report.md)

## Font licenses

Rajdhani and Inter are self-hosted under the SIL Open Font License. License
texts are included in `src/fonts/` alongside the woff2 files.
