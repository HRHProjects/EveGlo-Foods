# EveGlo Foods React Website

Modern React/Vite website package for EveGlo Foods. This is not a static HTML-only page; it is a JavaScript React project ready to push to GitHub and deploy on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static host.

## Stack

- React
- Vite
- CSS modules through a global `src/styles.css`
- lucide-react icons
- Local EveGlo logo assets in `public/assets`

## Local setup

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production files will be generated in the `dist` folder.

## GitHub push

```bash
git init
git add .
git commit -m "Initial EveGlo Foods site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/eveglo-foods-site.git
git push -u origin main
```

## Notes

- Product names are placeholders using EveGlo branding.
- Replace placeholder product cards with real package images when available.
- The wholesale form is visual only. Connect it to Formspree, Netlify Forms, Shopify, Supabase, or a custom backend when ready.
