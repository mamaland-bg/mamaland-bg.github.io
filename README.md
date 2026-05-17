# Mamaland Sofia

Personal website for Mamaland Sofia — a Bulgarian content brand for parents, founded by Dr. Merilin Ivanova.

**Live:** [mamaland.bg](https://www.mamaland.bg)
**CMS:** [mamaland.bg/admin](https://www.mamaland.bg/admin)

## Stack

- [Astro](https://astro.build) — static site generator
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) — git-based CMS for non-technical editing
- GitHub Pages — hosting
- GitHub Actions — auto-deploy on push
- Cloudflare Workers — OAuth proxy for CMS login

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:4321.

## Deployment

Push to `main` and the GitHub Action will build and deploy automatically.

## First-time setup

See [SETUP.md](./SETUP.md) for the full walkthrough.

## Content structure

- `src/content/articles/` — blog articles
- `src/content/seminars/` — events
- `src/content/team/` — team member bios

Non-technical editing happens through Sveltia CMS at `/admin`.

## License

Code: MIT. Content: © Mamaland Sofia.
