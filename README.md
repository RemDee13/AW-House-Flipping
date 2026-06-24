# Ashwood Revival — Interactive House-Flipping Portfolio

> **Portfolio demo by Anton Pavlov.** Ashwood Revival is a *fictional* house‑flipping company.
> The site exists to showcase front‑end & interaction design — most of all its signature
> cursor‑reveal effect. Live work: **[pavlov-ai.online](https://pavlov-ai.online)**

A single‑page site whose hero shows a **renovated** suburban house. Drag your cursor across it
and a circular "window" follows the pointer, peeling back the new house to reveal the
**storm‑damaged original** underneath. Pulsing hotspots mark every repair; activate one and the
spotlight pins to that element while a side panel explains the *before*, the *work done* and the *cost*.

Inspired by the cursor‑reveal idea on the "Stones" site — re‑themed entirely around a house flip.

## Live demo

GitHub Pages → **https://remdee13.github.io/AW-House-Flipping/**

## Tech

Plain **HTML + CSS + JavaScript** — no framework, no build step. It deploys to GitHub Pages exactly
as it sits in the repo. The reveal is a pure CSS `radial-gradient` mask on the top image whose
center tracks the pointer via a `requestAnimationFrame`‑throttled handler.

```
index.html
styles/   main.css      design tokens, layout, sections, responsive
          reveal.css    hero stage, mask, hotspots, info panel
scripts/  hotspots.js   the 11 repair hotspots (data + icons)
          reveal.js     spotlight mask, hotspot logic, info panel
          main.js       nav, counters, scroll reveals, form, ribbon
assets/img/             house-new.svg / house-old.svg (placeholders), favicon
docs/                   CONCEPT · DESIGN-SYSTEM · IMAGE-PROMPTS · DEPLOYMENT
```

## Swapping in real photos

The two SVGs in `assets/img/` are aligned **placeholders**. To use photoreal renders:

1. Generate the pair with the prompts in [`docs/IMAGE-PROMPTS.md`](docs/IMAGE-PROMPTS.md)
   (generate the *new* house first, then edit it into the *old* version so geometry matches).
2. Export both at the **same resolution**, save as `assets/img/house-new.webp` / `house-old.webp`.
3. Update the two `<img>` `src` attributes in `index.html`.
4. Re‑tune each hotspot's `x` / `y` percentages in `scripts/hotspots.js` to the new image.

## Features

- Cursor / touch‑drag spotlight reveal (GPU‑friendly CSS mask)
- 11 keyboard‑accessible hotspots with a live info panel and per‑item cost
- "Reveal the before" toggle for a no‑hover path
- Animated stat counters, scroll‑in reveals, sticky blurred nav, mobile menu
- Fully responsive (375 → 1440+), `prefers-reduced-motion` aware, semantic & labelled

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Credits

Designed & built by **Pavlov Anton** — [pavlov-ai.online](https://pavlov-ai.online).
Fonts: Cinzel + Josefin Sans (Google Fonts). Icons: Lucide‑style, inline SVG.
