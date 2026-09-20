# IEEE RAS — Engineering in Motion

A single-page, interactive site for an IEEE Robotics & Automation Society
(RAS) student chapter. Built as plain HTML/CSS/JavaScript — no framework,
no build step — so it deploys the same way any static site does: push it
to GitHub, turn on Pages, done.

**Live site:** _add your GitHub Pages link here_
**Repo:** _add this repo's URL here_

## Why plain HTML/CSS/JS, not React/Vite/Three.js

A from-scratch React + TypeScript + Vite + Three.js build needs Node.js,
npm, a compile step, and either a committed `dist/` folder or a GitHub
Actions workflow to build it for you — real infrastructure to get right
under a deadline. This project delivers the same interaction ideas
(custom cursor, boot sequence, interactive diagrams, scroll choreography)
using nothing but a browser can already run, so the only thing that can go
wrong when you deploy it is a typo — not a broken build pipeline.

## Features

- **Boot sequence** — a short technical "system boot" animation on first
  load, skipped instantly if the visitor has reduced motion enabled.
- **Custom cursor** — a dot + ring that reacts to hoverable elements, on
  devices with a real mouse only (never shown on touch/mobile).
- **Magnetic buttons** — primary CTAs gently pull toward the cursor.
- **Reactive particle field** — an ambient canvas of connected nodes
  behind the whole page, nudged by mouse position.
- **Scroll-aware navigation** — transparent at the top, becomes a glass
  panel once you scroll; collapses to a fullscreen menu on mobile.
- **Numbered scroll indicator** — tracks which section you're in.
- **Interactive domain modules** — click to expand a description.
- **Signal-to-action pipeline** — a five-stage clickable diagram
  (Sensing → Perception → Decision → Control → Actuation) with a signal
  dot that travels to whichever stage is selected.
- **System schematic** — a simplified, clickable "what's inside a robot"
  diagram (Sensor, Controller, Processor, Motor, Power, Communication).
- **Project Lab, Events, Community, FAQ** — large-format, non-generic
  layouts for showcasing real chapter content.
- Respects `prefers-reduced-motion` throughout, and every interactive
  element is a real, keyboard-focusable `<button>`.

## File structure

```
.
├── index.html      # markup and content
├── style.css       # design system, layout, animation
├── main.js         # all interaction logic
├── favicon.svg
└── README.md
```

## Running it locally

No build step — open `index.html` directly, or serve it if your browser
blocks local file requests for the stylesheet/script:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying (GitHub Pages)

1. Push this folder to a new **public** GitHub repository (files in the
   repo root, no subfolder).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a
   branch**, set branch to `main` and folder to `/ (root)`, then **Save**.
4. Wait about a minute; your live URL appears at the top of that same
   settings page.

### Updating an existing repo

Go to **Add file → Upload files**, drag in the changed files (same file
names as before), and commit. GitHub matches them by filename and
overwrites the old versions — no need to delete anything first. Pages
rebuilds automatically within a minute or so.

## Before you publish — replace the placeholders

- `[Your College Name]` — in the hero and footer
- The three stats under **Identity** (members, workshops, competitions)
- The three project cards under **Project Lab**
- The five dates under **Events**
- The names and roles under **Community**
- The membership-fee answer in the **FAQ**
- The contact email and social links in the footer

## Tech

Vanilla HTML, CSS, and JavaScript. Google Fonts (Space Grotesk, Inter,
JetBrains Mono) load via CDN. The particle field, cursor, boot sequence,
and every interactive diagram are hand-written — no animation or 3D
libraries.     
