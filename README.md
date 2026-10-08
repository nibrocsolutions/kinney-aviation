# Kinney Aviation

Professional GitHub Pages site for **Kinney Aviation** — FAA Airframe (A) & Powerplant (P) maintenance with Arizona fly-to-you pilot-mechanic service.

**Live site (after Pages is enabled):** https://nibrocsolutions.github.io/kinney-aviation/

## What’s on the page

- Brand-led landing experience for Kinney Aviation
- Clear breakdown of Airframe (A), Powerplant (P), and combined A&P capabilities
- Arizona statewide pickup / maintain / return flight workflow
- Interactive Chart.js graphs modeling cost and downtime savings vs. traditional ferry-to-shop logistics
- Contact form that opens a mailto draft (update the address when ready)

## Stack

Plain HTML, CSS, and JavaScript — same approach as [crypto-future-examples](https://nibrocsolutions.github.io/crypto-future-examples/). No Node, no build step.

Charts load [Chart.js](https://www.chartjs.org/) from a CDN.

## Local preview

```bash
# Option A — open the file
open index.html

# Option B — local server
python3 -m http.server 8080
# visit http://localhost:8080
```

## GitHub Pages

Publish from the `main` (or this feature) branch, folder `/` (root).

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` (or merge this PR), folder `/`
4. Save — site builds at `https://nibrocsolutions.github.io/kinney-aviation/`

## Notes

- Savings charts are **illustrative models**, not formal quotes.
- Replace `contact@kinneyaviation.example` in `index.html` / `js/main.js` with the real inbox before going live.
