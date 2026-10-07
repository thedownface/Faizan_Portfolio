# Faizan Tunnel — scroll animation (React + Vite)

Port of `Faizan Tunnel Scroll.dc.html`: a 61.5s GSAP/SVG timeline scrubbed by page scroll.

```bash
npm install
npm run dev
```

- `src/tunnelScene.js` — the scene (SVG build, GSAP timeline, digger rig). No React dependency.
- `src/TunnelScroll.jsx` — mounts the scene and feeds it scroll progress.
- `src/App.jsx` — overlay UI: progress bar, career-era tag, mid-dig checkpoint, contact menu, end bar.
- `src/Dossier.jsx` — the "more about me" sheet.
- `src/resume.js` — all resume content (links, eras, experience, skills). Edit text here.
- `public/Faizan_Khan_Resume.pdf` — served for the RESUME buttons.

The impact cards inside the animation are `card(...)` calls in `tunnelScene.js`. The checkpoint pause is
`HOLDS` in the same file (timeline second + how long the scroll holds).

## Using it in Next.js

Copy the `src/` files and `public/` resume into the Next app, add
`'use client'` to the top of `TunnelScroll.jsx`, `App.jsx` and `Dossier.jsx`, import `styles.css` from
`app/layout.js`, load the fonts (Titan One, DM Mono 400/500) via `<link>` or `next/font`, and render
`<App />` from `app/page.js`.
