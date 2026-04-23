# Nishanth G Palaniswami — Portfolio

Personal portfolio site for Nishanth G Palaniswami, Applied ML Engineer (NYU MS CE '26).
Single-page React + Vite site with a case-study-driven structure, built for recruiter
scannability.

**Live:** `https://nishanthgp.me` (when deployed)

![React](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.1-646CFF) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.10-38B2AC) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.18.2-pink)

---

## Structure

Nine sections in a single scrolling page:

1. **Hero** — Availability + work-auth pills, name, role, thesis, trajectory timeline
2. **About** — Personal paragraph + Quick Facts card (graduation, location, work authorization)
3. **Skills** — Four grouped cards: Machine Learning · Data & Infrastructure · Cloud & MLOps · Languages & Web
4. **SAIL** — Flagship case study with Problem / Approach / Impact, 3-column metric strip, and "What I own" ownership breakdown
5. **Projects** — Supporting project cards (ASL, MetroScan, Drug-Target)
6. **Publications** — Peer-reviewed work
7. **Experience** — Prior roles with impact bullets
8. **Education** — Degree cards with GPA + coursework
9. **Contact** — Full-bleed dark closing section with Gmail-compose CTA

Header nav anchors to each section. Contact lives outside `<main>` as a full-bleed dark band.

---

## Stack

- **React** 18 with **Vite** 7
- **Tailwind CSS** 3.4 (no plugins — arbitrary values for fluid width)
- **Framer Motion** 11 (respects `prefers-reduced-motion` via `useReducedMotion`)
- **Lucide React** for icons (no emojis)
- **Geist** (body) + **JetBrains Mono** (display/mono) — Google Fonts

---

## Design principles

- **Fluid-width layout**: `clamp(20rem, min(92vw, 80rem), 80rem)` — scales with viewport, caps at 1280px
- **Typography as brand**: Geist sans + JetBrains Mono pairs a clean reading face with a technical display face
- **Restrained color**: Slate base, blue-600 accent, emerald for availability, violet for peer-reviewed work — no gradient text, no glassmorphism, no AI-slop tells
- **Accessibility**: `focus-visible:` rings on all interactive elements, skip link, reduced-motion support, semantic headings
- **Honest hierarchy**: SAIL gets a full case-study section; supporting projects live below; each section lives in one clearly-separated card container

---

## Quick start

```bash
git clone https://github.com/Nishanth-G-Palaniswami/Nishanth-G-Palaniswami-Portfolio.git
cd Nishanth-G-Palaniswami-Portfolio
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### Available scripts

| Command | Does |
|---|---|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## File layout

```
nishanth-portfolio/
├── public/
│   ├── favicon.svg
│   ├── portfolio-icon.svg
│   ├── nyu-logo.png           # used in NYU Education card
│   ├── og.png                 # 1200×630 Open Graph preview card
│   └── og-template.html       # source HTML for og.png (re-render if content changes)
├── src/
│   ├── App.jsx                # entire site — all content, components, routing
│   ├── index.css              # Tailwind entry + a couple of base rules
│   └── main.jsx               # React entry point
├── index.html                 # title, meta, OG tags, JSON-LD Person schema, Google Fonts
├── tailwind.config.js         # font family tokens only (arbitrary values handle the rest)
├── package.json
└── README.md
```

---

## Editing content

All site copy lives as top-level `const` arrays/objects in `src/App.jsx`. You almost never need to touch JSX.

### Identity + CTAs
```js
const PROFILE = {
  name: "Nishanth G Palaniswami",
  role: "Applied ML Engineer",
  thesis: "Ship production classifiers end-to-end…",
  availability: "Open May 2026",
  workAuthShort: "F-1 · OPT + STEM-OPT · no sponsorship needed until 2029",
};

const LINKS = {
  email: "ng3124@nyu.edu",
  emailCompose: `https://mail.google.com/mail/?view=cm&fs=1&to=...&su=...`,
  github: "https://github.com/...",
  linkedin: "https://linkedin.com/in/...",
  resume: "https://drive.google.com/file/d/.../view",
};
```

### Sections as data
- `ABOUT` — about-paragraph string
- `EDUCATION` — array of degree objects (optional `logo` field — see the NYU entry)
- `SKILLS` — array of groups; each group has `{ group, icon, items }`
- `PUBLICATIONS` — peer-reviewed work with title, venue, summary, links
- `EXPERIENCE` — prior roles with period, location, impact bullets, stack
- `PROJECTS` — supporting projects (SAIL is its own dedicated Section in the JSX, not inside this array)

### Nav
```js
const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#sail", label: "SAIL" },
  { href: "#projects", label: "Projects" },
  { href: "#publications", label: "Publications" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];
```

---

## OG (social link preview)

The 1200×630 preview card shown when the URL is pasted into LinkedIn / Slack / iMessage is at `public/og.png`.

**To regenerate:**

1. Open `http://localhost:5173/og-template.html` in Chrome
2. DevTools → **Elements** → right-click the `<body>` node → **Capture node screenshot**
3. Save the downloaded 1200×630 PNG as `public/og.png`
4. Commit

Edit copy by modifying `public/og-template.html` directly — it's a standalone HTML file, no React.

---

## Accessibility checklist

- [x] Skip link to `#main`
- [x] Sequential heading hierarchy (H1 → H2 → H3)
- [x] `:focus-visible` ring on every interactive element
- [x] `aria-label` on icon-only buttons
- [x] `aria-hidden` on decorative icons inside labelled buttons
- [x] `prefers-reduced-motion` respected (all Framer Motion entrances degrade to opacity-only)
- [x] Touch targets ≥ 44px on mobile
- [x] Mobile hamburger drawer with theme toggle inside
- [x] Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`)
- [x] WCAG AA contrast on all text/background pairs (light + dark)

---

## SEO

- Title, meta description, canonical URL
- OpenGraph + Twitter card meta
- Person JSON-LD schema (`index.html:31-58`) with `alumniOf`, `jobTitle`, `knowsAbout`, `sameAs`
- No `<img>` tags (all visuals are SVG) — zero image-alt debt

---

## Deployment

### Netlify (recommended)

```
Build command:      npm run build
Publish directory:  dist
Production branch:  main
```

No `netlify.toml` needed — Vite builds are auto-detected.

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages

Build locally with `npm run build`, push `dist/` to a `gh-pages` branch, or use `gh-pages` npm package.

---

## Custom domain

Canonical is set to `https://nishanthgp.me` in `index.html` and the JSON-LD schema. If deploying to a different domain, update:

- `<link rel="canonical">` in `index.html`
- `og:url` and `twitter:url` meta tags
- `url` and `sameAs` in the Person JSON-LD block

---

## License

MIT. See `LICENSE` if included.

---

## Contact

- Email: ng3124@nyu.edu
- LinkedIn: [nishanth-g-palaniswami](https://www.linkedin.com/in/nishanth-g-palaniswami)
- GitHub: [@Nishanth-G-Palaniswami](https://github.com/Nishanth-G-Palaniswami)
