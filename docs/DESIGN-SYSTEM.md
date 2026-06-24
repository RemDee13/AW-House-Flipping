# Design System — Ashwood Revival

Dark, cinematic, premium real‑estate. Big serif display over near‑black, warm amber accents,
restoration‑green for "after" and rust‑red for "before".

## Tokens (defined in `styles/main.css :root`)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0B0C0E` | page base (near‑black) |
| `--surface` | `#15171B` | cards, panels, alt sections |
| `--surface-2` | `#1C1F24` | hover surface |
| `--text` | `#F4F1EA` | warm off‑white body/heading |
| `--muted` | `#9AA0A6` | secondary text |
| `--line` / `--line-strong` | `rgba(244,241,234,.12 / .22)` | borders |
| `--amber` | `#F5A623` | hotspots, CTAs, accents |
| `--green` | `#3FB68B` | "after" / costs done / checks |
| `--rust` | `#C2452D` | "before" / damage labels |

## Typography
- **Display / headings:** `Cinzel` (600). Italic accent for the highlighted hero word.
- **Body / UI:** `Josefin Sans` (300–600).
- Loaded from Google Fonts in `index.html`.
- Headings line‑height `1.08`; body `1.65`; line length capped ~60ch.

## Type scale (fluid)
- Hero H1: `clamp(2.5rem, 6.6vw, 5.1rem)`
- Section title: `clamp(2rem, 4.4vw, 3.4rem)`
- Body: 16–17px (≥16px on mobile).

## Components
- **Buttons:** pill, `.btn-primary` (amber) / `.btn-ghost` (outline). 150–200ms color transitions, no layout‑shifting scale.
- **Cards / steps / projects:** `--surface` + `--line`, lift on hover via `translateY`.
- **Nav:** sticky, transparent → blurred (`backdrop-filter`) after 24px scroll; off‑canvas mobile menu under 760px.
- **Hotspot:** 44×44 hit area; 18px glowing dot that grows to 36px and shows its icon on hover/focus/active; expanding pulse ring (disabled under reduced motion).
- **Info panel:** glass card (`rgba(21,23,27,.82)` + blur), sticky on desktop, static below 1024px.

## Motion
- Micro‑interactions 150–300ms.
- Reveal mask updates on `requestAnimationFrame` (transform/opacity/mask only — no layout thrash).
- Counters & scroll‑in reveals via `IntersectionObserver`.
- **`prefers-reduced-motion: reduce`** → no idle drift, no pulse, no counter tween, instant reveals.

## Accessibility
- Color never the only signal — icons + text labels accompany every state.
- Hotspots are real `<button>`s with `aria-label` + `aria-pressed`; Esc closes; "Reveal the before" gives a hover‑free path.
- `aria-live="polite"` on the info panel; visible focus rings (`--amber`).
- Contrast: off‑white on near‑black clears 4.5:1; amber used for large text / accents.

## Iconography
Lucide‑style inline SVG, 24×24 viewBox, `currentColor` stroke. No emoji.

## Responsive breakpoints
`1024` (panel stacks) · `980` (about/contact stack, numbers → 2col) · `760` (mobile nav) · `520` (type/step down).
Targets verified at 375 / 768 / 1024 / 1440.
