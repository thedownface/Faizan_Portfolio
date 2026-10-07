# Faizan Tunnel — scroll animation (React + Vite)

Port of `Faizan Tunnel Scroll.dc.html`: a 61.5s GSAP/SVG timeline scrubbed by page scroll.

```bash
npm install
npm run dev
```

- `src/tunnelScene.js` — the scene (SVG build, GSAP timeline, digger rig). No React dependency.
- `src/TunnelScroll.jsx` — mounts the scene and feeds it scroll progress.
- `src/App.jsx` — overlay UI (progress bar, hint, contact menu, end bar). Edit `PHONE` / `INSTAGRAM` here.

## Using it in Next.js

Copy `tunnelScene.js`, `TunnelScroll.jsx`, `App.jsx` and `styles.css` into the Next app, add
`'use client'` to the top of `TunnelScroll.jsx` and `App.jsx`, import `styles.css` from
`app/layout.js`, load the fonts (Titan One, DM Mono 400/500) via `<link>` or `next/font`, and render
`<App />` from `app/page.js`.
