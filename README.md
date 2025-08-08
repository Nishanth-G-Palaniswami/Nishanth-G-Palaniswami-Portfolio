# Nishanth · Portfolio (React + Vite + Tailwind)

## Dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy (Netlify UI)
1) Push this folder to a GitHub repo (e.g., `nishanth-portfolio`).
2) On Netlify: New site from Git → GitHub → pick repo.
3) Build command: `npm run build`
4) Publish directory: `dist`
5) Deploy.

## Deploy (Netlify CLI)
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```
