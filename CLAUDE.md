# What this project is
Nishanth's portfolio site — Vite 7 + React 18 + Tailwind 3, framer-motion, Lucide icons. **JavaScript — stay JS, no TypeScript conversion.** Deploys via Netlify (`netlify.toml`). Repo: `Nishanth-G-Palaniswami/Nishanth-G-Palaniswami-Portfolio`.

# Commands
- `npm run dev` · `npm run build` · `npm run preview` · `npm run resume` (pulls the public Drive PDF into `public/resume.pdf`)
- No tests — verification is loading the built site and walking the changed pages.

# Rules for this repo
- **No em-dashes (—) anywhere. Hard rule, user-set 2026-07-22.** Use commas, colons, semicolons, periods, "·", or parentheses instead. Applies to all copy, meta tags, and comments.
- Design system is locked: **Geist + JetBrains Mono only** (IBM Plex is reject-listed by impeccable). No `text-align: justify`. No emojis as UI icons, Lucide SVGs. One site of emphasis per fact: a display-size (60px+) number is never also bolded in copy.
- The personal email address never renders in the DOM.
- `.claude/`, `council/`, `dist/` stay untracked.
- Copy/claim changes pause for approval; mechanical/code changes can proceed. Audits are read-only first: findings ranked Critical/High/Medium/Low, then wait for a pick.

# Gotchas
- The resume is edited in Google Drive and served from `public/resume.pdf`; the Drive file ID lives in `scripts/sync-resume.js`. Replace the Drive file with "Manage versions" so the ID stays; a fresh upload changes it and the sync fails.
- Content claims are bounded by the vault's `job-search/portfolio-summary.md` → "Gaps" — no invented certs, no inflated scale.
