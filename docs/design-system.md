# CLASHBID Design System — Phase 0

The visual direction is a **cinematic dark arena**: near-black layered
backgrounds, a single precious-metal accent, condensed display typography, and
restrained motion. Game-like spectacle is implied through atmosphere and
structure; it is not yet powered by 3D or a motion library.

## 1. Color tokens

Source of truth: `src/styles/tokens.css`.

| Token                 | Value                        | Usage |
| --------------------- | ---------------------------- | ----- |
| `background`          | `#08090D`                    | Page base |
| `background-deep`     | `#050609`                    | Footer / deepest wells |
| `elevated`            | `#10131A`                    | Cards, drawers, terminal panels |
| `surface`             | `#171B24`                    | Hover surfaces, raised content |
| `surface-raised`      | `#1D2230`                    | Scrollbar thumbs, deeper nesting |
| `gold`                | `#F0B94A`                    | Primary accent, CTAs, highlights |
| `gold-bright`         | `#FFD778`                    | Active states, gradient light |
| `gold-deep`           | `#A77A2A`                    | Gradient shade |
| `gold-soft`           | `rgb(240 185 74 / 0.12)`     | Accent washes and icon wells |
| `foreground`          | `#F5F3ED`                    | Primary text |
| `muted`               | `#A5A9B2`                    | Secondary copy |
| `subtle`              | `#7F8490`                    | Metadata (meets AA on base) |
| `line`                | `rgb(245 243 237 / 0.08)`    | Default borders |
| `line-strong`         | `rgb(245 243 237 / 0.16)`    | Hover/bordered controls |
| `line-gold`           | `rgb(240 185 74 / 0.28)`     | Accent borders |
| `success`             | `#6ECF9B`                    | Positive status only |
| `danger`              | `#E2565B`                    | Reserved, not used in Phase 0 |

Rules:

- Gold is the only brand accent. Do not introduce category colors in Phase 0.
- Use `muted` for supporting copy and `subtle` for metadata at larger sizes.
- Do not use pure white for body or headings; use `foreground`.
- Glass surfaces are `elevated` at 60–90% opacity with backdrop blur.

## 2. Typography

Fonts:

- **Rajdhani** (500/600/700): display headings, labels, navigation, numerals.
- **Inter variable** (100–900): body copy, descriptions, secondary UI.

Tailwind utilities generated from tokens:

| Utility             | Approx. size                        | Use |
| ------------------- | ----------------------------------- | --- |
| `text-display-2xl`  | clamp 3.25 → 6 rem                  | Hero headlines |
| `text-display-xl`   | clamp 2.75 → 4.5 rem                | Page titles |
| `text-display-lg`   | clamp 2.125 → 3.25 rem              | Section titles |
| `text-display-md`   | clamp 1.625 → 2.125 rem             | Large card titles |
| `text-display-sm`   | 1.3125 rem                          | Card titles |
| `text-eyebrow`      | 0.6875 rem, `.28em` tracking        | Kickers, status labels |

Guidelines:

- Headings use the display face with tight leading; body copy stays at 1.6
  line-height.
- Eyebrows are uppercase, gold or subtle, with wide tracking.
- Use `font-display` on numbers, buttons, nav links, and badges for a game-like
  HUD feel.
- Keep paragraphs under ~70 characters on large screens.

## 3. Spacing, layout, radius

Spacing tokens:

| Token            | Value                          | Use |
| ---------------- | ------------------------------ | --- |
| `gutter`         | `clamp(1.25rem, 4vw, 2.5rem)`  | Horizontal page padding |
| `section`        | `clamp(4.5rem, 9vw, 8rem)`     | Vertical section padding |
| `header`         | `4.5rem`                       | Fixed header height |

Tailwind utilities: `px-gutter`, `py-section`, `h-[var(--spacing-header)]`.

Containers (`Container` component):

| Size      | Max width | Use |
| --------- | --------- | --- |
| `narrow`  | 56 rem    | Not-found / editorial |
| `default` | 80 rem    | Standard pages |
| `wide`    | 90 rem    | Future dashboard tables |

Radius tokens:

| Token     | Value    | Use |
| --------- | -------- | --- |
| `control` | 0.625rem | Buttons, inputs, compact wells |
| `card`    | 1rem     | Cards |
| `panel`   | 1.5rem   | Large panels, terminal surfaces |
| `pill`    | 9999px   | Badges, status chips |

Elevation tokens: `shadow-card`, `shadow-float`, `shadow-glow`,
`shadow-glow-strong`.

## 4. Background system

`.arena-backdrop` is a fixed layer containing:

1. A warm gold haze at the top center
2. Cool navy-petrol secondary glows
3. A faint 5 rem arena grid masked to the top of the viewport
4. Radial and linear vignettes to darken the edges and footer transition

Additional helpers:

- `.arena-grid` — localized 3 rem technical grid, masked radially.
- `.grain` — subtle SVG turbulence overlay at 5% opacity.
- `.hairline` — gold-to-transparent divider.
- `.text-gradient-gold` — champagne-to-deep-gold headline fill.

Avoid stacking more than two atmospheric layers on the same section; contrast
and performance both degrade.

## 5. Component inventory

### Button

Variants: `primary` (gold gradient), `secondary` (elevated outline),
`outline` (gold-tinted), `ghost`. Sizes: `sm`, `md`, `lg`, `icon`.
`ButtonLink` shares the exact same styling for internal navigation.

- Primary is reserved for the main action on a screen.
- Disabled actions must be clearly disabled; Phase 1 actions use a lock icon.
- Do not put more than two buttons side by side on mobile.

### Card

Variants: `base`, `elevated`, `outline`, `glass`. Optional `interactive` adds
lift, border, and glow on hover. Compound subcomponents (`CardHeader`,
`CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) are available.

### Badge

Tones: `gold`, `neutral`, `success`, `muted`. Optional status dot. Used for
line states, not for long copy.

### PageHero

Standard subpage opener: eyebrow, display title, description, optional actions
and an aside panel. Includes the atmospheric grid and hairlines.

### SectionHeading

Eyebrow + title + description with optional right-aligned action. Supports
centered layout for protocol/explainer sections.

### EmptyState

Icon well, title, description, optional actions. Used for the sealed vault,
empty standings, and room placeholders.

### Stat

Label, display value, optional hint/icon. Used for numeric metadata.

### Brand

`BrandMark` (diamond + crossed blades) and `Logo` lockup. The same mark powers
`app/icon.svg`.

## 6. Motion

Phase 0 is CSS-only.

| Token / utility      | Purpose |
| -------------------- | ------- |
| `animate-fade-up`    | Hero and section entrance |
| `animate-fade-in`    | Reserved |
| `animate-glow-pulse` | Reserved for future live orb |
| `animate-scan`       | Auction terminal scan line |
| `animate-float`      | Reserved for future floating panels |
| `ease-out-expo`      | Signature deceleration |

Rules:

- Animations communicate state or atmosphere; never block reading.
- No continuous motion without a meaningful cue.
- All animation delays and durations are neutralised under
  `prefers-reduced-motion: reduce`.
- GSAP, Lenis, and Three.js are intentionally absent in Phase 0.

## 7. Responsive behavior

Tailwind defaults: `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem.

- Header navigation switches to the drawer below `lg`.
- Hero becomes a single column below `lg`; terminal stacks under the copy.
- Card grids: 1 → 3 columns at `md`.
- Lobby room becomes a 3-column VS layout at `lg`; operator slots remain
  side-by-side on mobile with the shared pool beneath.
- Leaderboard table has a minimum width and scrolls horizontally inside a
  labelled, focusable region.
- Touch targets are at least 2.75 rem for icon-only controls.

## 8. Accessibility baseline

- Skip-to-content link.
- Visible gold focus ring on all interactive elements.
- `aria-current` on active navigation.
- Modal drawer: labelled, focus-trapped, Escape-dismissable, scroll-locking.
- Semantic headings: one `h1` per page, then `h2`/`h3`.
- Table headers use `scope="col"`; table container is keyboard focusable.
- Decorative graphics are hidden from assistive technology.
- Reduced-motion support is global.
- Metadata text (`subtle`) is verified for contrast on the base background.

## 9. Usage notes

- Prefer tokens over raw hex values. A raw value is acceptable only inside
  `tokens.css`.
- Keep page sections composed from `Container`, `SectionHeading`, and `Card`.
- Do not add feature-specific content directly to `components/ui`.
- Avoid inventing entity data or standings to fill visual space; use sealed,
  empty, or planned states instead.
