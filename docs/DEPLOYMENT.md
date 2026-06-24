# Deployment — GitHub Pages

## Why GitHub Pages fits
The site is 100% static (HTML/CSS/JS/SVG), so GitHub Pages — a free static host — is an ideal
match. Practical limits (soft: ~1 GB repo, 100 GB/month bandwidth, ~10 builds/hour) are far beyond
a portfolio's needs. The only constraints to respect:

- **No server code** → the contact form uses Formspree or a `mailto:` fallback (below).
- **The site lives on a sub‑path** (`/AW-House-Flipping/`) → all asset paths are **relative**
  (no leading `/`), and a `.nojekyll` file is included so nothing gets filtered.

## One‑time setup
```bash
git init
git add -A
git commit -m "Initial commit: Ashwood Revival interactive portfolio"
gh repo create RemDee13/AW-House-Flipping --public --source . --remote origin --push
```

Enable Pages from the default branch root:
```bash
gh api -X POST repos/RemDee13/AW-House-Flipping/pages \
  -f "source[branch]=main" -f "source[path]=/"
# (use PUT instead of POST to update an existing Pages config)
```

**Live URL:** https://remdee13.github.io/AW-House-Flipping/
(First build takes ~1 minute. Check status: `gh api repos/RemDee13/AW-House-Flipping/pages`.)

## Updating the site
```bash
git add -A && git commit -m "..." && git push
```
Pages redeploys automatically on push to `main`.

## Contact form
- **Recommended (working submit):** create a free form at [formspree.io], then replace
  `REPLACE_ME` in the form `action` in `index.html` with your form ID. `scripts/main.js` already
  does an async `fetch` submit when a real endpoint is present.
- **No third party:** leave the placeholder — the script falls back to opening the visitor's email
  client via `mailto:`. Update the address in `main.js` (`hello@ashwoodrevival.example`).

## Custom domain (optional, not required)
`pavlov-ai.online` is only linked in the footer; it is **not** the host. To serve the site from a
custom domain instead, add a `CNAME` file and a DNS record per GitHub's docs — otherwise the
`github.io` URL is the live site.

## Pre‑deploy checklist
- [ ] Real `house-new.webp` / `house-old.webp` in place (or keep SVG placeholders) and hotspots re‑tuned
- [ ] Contact form endpoint set (or mailto address updated)
- [ ] `og:image` points at a real share image
- [ ] Tested at 375 / 768 / 1024 / 1440 and with reduced motion
- [ ] All asset paths relative; `.nojekyll` present
