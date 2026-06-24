# Concept — Ashwood Revival

## The idea in one line
A house‑flipping company's site where the hero is a **renovated** house, and dragging the cursor
reveals the **derelict** house that stood there before the flip — repair by repair.

## Why
This is a **portfolio piece** for Anton Pavlov. The goal is to prove front‑end and interaction
skill with one memorable, original mechanic. It borrows only the *interaction idea* from the
"Stones" reference (a cursor‑following reveal) and applies it to a completely different story:
the before/after of a home renovation.

The before/after is the perfect narrative match for the mechanic — the "reveal" literally *is*
the product. It also reads instantly: sunny restored house on top, rainy ruined house beneath.

## Audience & framing
The site must read as a **real, polished company site** *and* clearly disclose that it is a demo:
- a slim **portfolio ribbon** at the very top,
- an **"About this site"** disclosure card in the About section,
- a **footer credit**: *Made by Pavlov Anton → pavlov-ai.online*.

## The signature interaction
1. **Spotlight reveal.** A circular hole follows the pointer (or finger), masking away the new
   house so the old one shows through. An idle auto‑drift + hint pill teaches the gesture.
2. **Hotspots.** Eleven pulsing amber dots sit over every repaired element. Hovering, focusing
   or tapping one pins the spotlight to that element and opens the info panel.
3. **Info panel.** Shows the element name, the *before* damage, a checklist of *work done* and the
   *cost*. A grand total ("invested in this flip") anchors the flipping economics.
4. **Reveal‑all toggle + keyboard path** make the whole thing usable without a mouse hover.

## The 11 hotspots
Roof · Chimney · Front porch · Front door · Windows · Lawn & landscaping · Plumbing · Fence ·
Gate · Driveway · Garage door. Full copy + costs live in `scripts/hotspots.js`.

## Narrative economics (illustrative)
Rehab invested **$71,350** · timeline **14 weeks** · **11** elements restored ·
after‑repair value **$340K**. Numbers are demo values; tune in `index.html` and `hotspots.js`.

## Page flow (single scroll)
Ribbon → Nav → Hero (interactive) → Numbers → Services → Process → Featured Projects →
About (+ disclosure) → Contact → Footer.

## Non‑goals
No backend, no CMS, no e‑commerce. It is a static showcase; the contact form is a thin
Formspree/mailto shim (see `docs/DEPLOYMENT.md`).
