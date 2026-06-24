# Image Generation — Nano Banana Pro

The reveal only works if the **new** and **old** house images share the **exact same camera,
framing and house geometry**. The pixels behind the mask must line up.

## Workflow (do this in order)
1. Generate **Prompt A (new house)** first.
2. Feed that result back into Nano Banana Pro as a **reference / edit image** and run
   **Prompt B (old house)** — editing the existing image keeps the structure locked.
3. Export **both at the same resolution** (recommended **16:9, ≥ 2560×1440**).
4. Convert to WebP, save as `assets/img/house-new.webp` and `assets/img/house-old.webp`.
5. Update the two `<img src>` in `index.html`, then re‑tune hotspot `x/y` in `scripts/hotspots.js`.

> Tip: leave the house slightly left‑of‑center with open sky above and lake to the right —
> that negative space is where headline/UI breathe, and it keeps hotspots clear of the frame edge.

---

## Prompt A — NEW house (generate first)
> Photorealistic architectural real‑estate photograph of a freshly renovated two‑story American
> suburban Craftsman house. Warm white and sage‑green fiber‑cement siding, crisp white trim, a
> brand‑new charcoal architectural asphalt‑shingle roof, a tidy red‑brick chimney with a stainless
> cap, an attached two‑car garage with a new carriage‑style insulated door, a covered front porch
> with turned white columns and wooden steps, twelve new black‑shuttered double‑hung windows, a
> freshly poured light‑grey concrete driveway and walkway, a white cedar picket fence with a
> matching gate, a lush manicured green lawn with young maple trees and flower beds. The house sits
> on a clearing at the edge of a pine forest beside a calm mirror‑like lake. Golden‑hour sunlight,
> clear blue sky with soft clouds, warm inviting atmosphere. Shot on a 35mm lens, eye‑level,
> three‑quarter front view, house positioned slightly left of center with open sky above and lake
> to the right as negative space. Ultra‑detailed, sharp, high dynamic range, professional
> real‑estate photography. No people, no cars, no text, no watermark.
>
> **Aspect 16:9, maximum resolution.**

## Prompt B — OLD house (run as an edit on A, A as the reference image)
> Use the previous image as the exact reference. Keep the identical camera angle, lens, framing,
> and the house's exact structure, proportions and position. Transform it into the same house years
> earlier — derelict and storm‑damaged, before renovation. The roof sags with many missing, curled,
> moss‑covered shingles and exposed rotted decking; the brick chimney is cracked and crumbling with
> no cap; the porch is rotted and sagging with broken steps and peeling grey paint; the front door
> is warped and weathered; the windows are cracked, broken and boarded with plywood; the siding is
> faded, stained and peeling; the garage door is dented and rusted; the driveway is cracked asphalt
> full of weeds; the picket fence is grey, leaning and broken with a hanging gate; the lawn is dead
> and overgrown with tall brown weeds and scattered debris. Heavy rain, dark storm clouds, gloomy
> overcast light, puddles and wet reflections, desaturated moody atmosphere. Same forest‑and‑lake
> setting but bleak and grey. Photorealistic, ultra‑detailed, exactly the same composition.
> No people, no text, no watermark.

### If alignment drifts
Regenerate both from one detailed scene description using a **fixed seed** and identical camera
wording, then crop/letterbox both to the same pixel dimensions in any editor.

---

## Optional extra images
- **Featured Projects:** 1–2 more before/after exterior pairs (vary the house) using the same
  "before = derelict/rainy, after = bright/sunny" contrast. Drop into `assets/img/` and update the
  `<img src>` in the Projects cards.
- **OG share image:** a 1200×630 crop of the new house with the logo, saved as `assets/img/og-image.jpg`
  (then point the `og:image` meta at it).
- **Logo / favicon:** already built as inline SVG (`assets/img/favicon.svg`) — no generation needed.

## Element checklist (must exist in both renders, same positions)
roof · chimney · front porch · front door · windows (upper & lower) · garage + garage door ·
driveway · walkway · picket fence · gate · lawn · a visible exterior plumbing/vent pipe.
