# CLASHBID Architecture — Phase 0

## 1. System overview

CLASHBID is a single Next.js application using the App Router. Phase 0 is a
fully static frontend foundation: all five routes (including not-found) are
prerendered, there are no API routes, server actions, databases, or runtime
environment variables.

The architecture optimises for:

1. A small dependency surface that runs comfortably on constrained machines.
2. Clear boundaries between design primitives, layout chrome, and domain features.
3. A visual token layer that can absorb future cinematic/3D work without a
   redesign.
4. Strict TypeScript and a small number of client components.

## 2. Stack decisions

| Concern      | Choice                              | Rationale |
| ------------ | ----------------------------------- | --------- |
| Framework    | Next.js 16 App Router               | File-system routes, static rendering, font optimisation |
| Language     | TypeScript strict                   | `noUncheckedIndexedAccess`, no JavaScript files |
| Styling      | Tailwind CSS 4 (CSS-first `@theme`) | Tokens live in CSS, no `tailwind.config` overhead |
| Fonts        | `next/font/local`                   | Self-hosted woff2 files; zero runtime font requests |
| Icons        | Hand-drawn inline SVG               | Avoids an icon dependency and keeps stroke consistency |
| Client state | Tiny external store                 | No state library needed for Phase 0 UI concerns |
| Motion       | CSS keyframes + transitions         | No GSAP/Three.js yet; reduced-motion safe |

## 3. Rendering and client boundaries

```text
app/layout.tsx                  Server Component
├── arena backdrop              static markup
├── SiteHeader                  Client (route state, scroll, mobile drawer)
│   └── MobileNav               Client (dialog, focus trap, body scroll lock)
├── page content                Server Components by default
└── SiteFooter                  Server Component
```

Client-only code is limited to:

- `src/components/layout/site-header.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/store/*` and the hooks they use

Page sections and feature modules are Server Components wherever possible.
Future interactive auctions will introduce new client islands rather than
converting whole routes.

## 4. Feature-oriented structure

```text
src/
  app/            Route composition only; thin page files with metadata
  components/
    ui/           Reusable primitives with no domain knowledge
    layout/       Global chrome (header, mobile nav, footer)
  features/
    home/         Landing sections
    lobby/        Lobby-specific room and roadmap modules
    characters/   Category card, sealed pool
    leaderboard/  Standings shell, metric cards
  lib/            Cross-cutting site constants, fonts, utilities
  hooks/          Generic UI hooks
  store/          UI external store and store factory
  styles/         Design token source
  types/          Shared domain contracts
```

Rules:

- `components/ui` never imports from `features`.
- `features/*` may import UI primitives, lib, hooks, and types.
- `app/*` composes features and owns page-level metadata.
- A feature is added by creating a folder, not by expanding a shared
  `components` dumping ground.

## 5. State management

Phase 0 deliberately avoids Zustand, Redux, Jotai, or server-state libraries.

`src/store/create-store.ts` provides a typed, immutable external store:

- `getState` / `getInitialState`
- `setState` with partial patches or updater functions
- `subscribe` for `useSyncExternalStore`
- `useStore(store, selector)` with a server snapshot

The only current store is `app-shell.ts`, which owns `mobileNavOpen` and is shared
by the header trigger and the drawer. Feature/game state is not created yet.

When the game engine arrives, introduce domain stores or server state based on
actual requirements (optimistic bids, timers, server reconciliation). This
choice requires approval before Phase 1 data work.

## 6. Styling pipeline

```text
src/styles/tokens.css   raw tokens in @theme + keyframes
        ↓
src/app/globals.css     Imports Tailwind, tokens; base and component CSS
        ↓
Tailwind utilities      bg-elevated, text-gold, py-section, rounded-card, ...
        ↓
components              Utilities + a few global helpers (arena-backdrop, grain,
                        text-gradient-gold, hairline, arena-grid)
```

No style is generated at runtime. All tokens are static CSS variables.

### Typography loading

`src/lib/fonts.ts` loads local files from `src/fonts/`:

- Rajdhani 500/600/700 (latin subset)
- Inter variable, 100–900 (latin subset)

The font variables are attached to `<html>` in the root layout and surfaced to
Tailwind through `--font-display` and `--font-sans`. No external font requests
occur in development or production.

## 7. Navigation and accessibility

- Fixed header, four primary destinations, active state via `usePathname`.
- Desktop navigation from `lg` upward; mobile drawer below `lg`.
- Drawer is a labelled, modal dialog with:
  - focus trap across its interactive elements
  - Escape to close
  - focus moved to the close button and restored on close
  - background scroll lock
  - `inert` + `aria-hidden` when closed
  - route changes close the drawer
- Skip-to-content link is the first focusable element.
- Global `:focus-visible` gold outline.
- All decorative SVGs are `aria-hidden`.
- Global reduced-motion media query disables animation/transition duration and
  delays.

## 8. Future phases (not implemented)

- Character dataset and validation schema
- Lobby creation/pairing (real-time transport decision pending)
- Auction engine: lot rotation, timer, bids, budget guards
- Roster validation and settlement
- Authentication and persistence
- 2.5D/3D hero and arena treatments (Three.js decision pending)
- Choreographed motion (GSAP decision pending)
- Sound design and haptics

## 9. Decisions requiring approval before Phase 1

1. **Data contract:** category IDs (`fictional`, `football`, `cricket`), entity
   schema, lot ordering, and base-price rules.
2. **Scoring formula:** how match wins, roster strength, and budget efficiency
   combine on the leaderboard.
3. **State strategy:** continue with the in-house store or adopt a dedicated
   client/server state solution once live bidding exists.
4. **Transport:** WebSocket, SSE, or managed realtime provider for 1v1 rooms.
5. **Toolchain versions:** Next 16 / Tailwind 4 are current; pinning a previous
   major is possible if the team prefers a more conservative toolchain.
6. **ESLint maintenance risk:** ESLint `9.39.5` is pinned because
   `eslint-config-next` depends on `eslint-plugin-jsx-a11y`, whose published peer
   range does not yet include ESLint 10. Revisit when that dependency updates.
7. **Asset pipeline:** which 3D/2D assets are licensed and how they are optimised
   for 8 GB development machines.

## 10. Constraints preserved in Phase 0

- No backend functionality or invented records.
- No authentication.
- No auction logic.
- No Three.js or GSAP.
- No extra runtime dependencies beyond Next/React/Tailwind tooling.
- Static rendering only.
