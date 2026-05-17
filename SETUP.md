# Mamaland Sofia — Setup Guide

Step-by-step from this starter to a live site at `mamaland.bg` with Merilin editing through Sveltia CMS.

Estimated time: **about 90 minutes**, mostly waiting for DNS.

---

## Part 1 — Get it running locally (15 minutes)

This is the boring part. Make sure everything works on your machine first.

### 1.1. Install Node.js

If you don't have it, get Node 20+ from [nodejs.org](https://nodejs.org). Verify:

```bash
node -v   # should print v20.x or higher
```

### 1.2. Install dependencies

In this folder:

```bash
npm install
```

### 1.3. Run the dev server

```bash
npm run dev
```

Open http://localhost:4321 — you should see the site with three sample articles and one seminar. Click around, check every page renders.

---

## Part 2 — Push to GitHub (10 minutes)

### 2.1. Create the repo

Go to [github.com/new](https://github.com/new). Create a public repo named `mamaland-sofia` (or whatever — just remember the name).

Don't initialize it with a README — we already have files.

### 2.2. Push this code

In this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mamaland-sofia.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2.3. Update the CMS config with your repo

Open `public/admin/config.yml`. Change line 3:

```yaml
repo: YOUR_GITHUB_USERNAME/mamaland-sofia
```

Use your actual GitHub username. Commit and push:

```bash
git add public/admin/config.yml
git commit -m "Point CMS at correct repo"
git push
```

---

## Part 3 — Enable GitHub Pages (5 minutes)

### 3.1. Turn on Pages

In your repo on GitHub, go to **Settings → Pages**.

Under "Build and deployment", set **Source** to **GitHub Actions** (NOT "Deploy from a branch").

### 3.2. Trigger the first build

Go to **Actions** tab. You should see a workflow running. If not, push any small change to trigger it. Wait ~2 minutes for it to complete (green checkmark).

### 3.3. Verify it's live

GitHub will assign a temporary URL like `https://YOUR_USERNAME.github.io/mamaland-sofia/`. Open it. You should see the site.

If it looks broken (no styles, no images), the most common cause is the wrong base path — but with a custom domain we're about to add, this fixes itself.

---

## Part 4 — Point mamaland.bg at GitHub Pages (15 min + DNS wait)

You already own the domain, so we just need to point it.

### 4.1. Add DNS records at your registrar

Wherever you registered mamaland.bg, log in and find the DNS settings. Add these records:

**For `www.mamaland.bg`:**
| Type | Name | Value |
|------|------|-------|
| CNAME | www | YOUR_USERNAME.github.io |

**For the apex `mamaland.bg`:**
| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

The four A records are GitHub's official Pages IPs. They redirect to www automatically.

### 4.2. Configure custom domain on GitHub

Back in **Settings → Pages**, under "Custom domain", enter `www.mamaland.bg` and Save.

GitHub will check DNS. You may see a yellow warning for a while — that's normal, DNS propagation takes 15 min to 24 hr (usually under an hour for .bg).

### 4.3. Enable HTTPS

Once DNS resolves, check the **Enforce HTTPS** box. GitHub auto-issues a free Let's Encrypt certificate.

### 4.4. Verify

Open https://www.mamaland.bg — should be live. The site will rebuild and deploy automatically on every Git push.

---

## Part 5 — Set up Sveltia CMS auth (15 minutes)

This is the part that lets Merilin log in and write articles. The Cloudflare Worker handles the OAuth handshake between her browser and GitHub.

### 5.1. Create a Cloudflare account

Sign up at [cloudflare.com](https://www.cloudflare.com) — free, no credit card.

### 5.2. Deploy the Sveltia Auth Worker

1. Go to [github.com/sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth).
2. Click the "Deploy to Cloudflare" button in the README.
3. Authorize Cloudflare to read the repo, then click "Create and deploy".
4. Once deployed, copy your worker URL — it looks like `https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev`.

### 5.3. Register a GitHub OAuth App

Go to [github.com/settings/developers](https://github.com/settings/developers) → "OAuth Apps" → "New OAuth App".

Fill in:
- **Application name:** Mamaland CMS
- **Homepage URL:** `https://www.mamaland.bg`
- **Authorization callback URL:** `https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev/callback` (use your actual worker URL)

Click "Register application". You'll see a **Client ID**. Click "Generate a new client secret" and save the **Client Secret** somewhere safe — GitHub only shows it once.

### 5.4. Add the credentials to your Worker

In Cloudflare dashboard → Workers & Pages → your worker → Settings → Variables.

Add two encrypted variables:
- `GITHUB_CLIENT_ID` = the client ID from step 5.3
- `GITHUB_CLIENT_SECRET` = the client secret from step 5.3

Save. The worker auto-redeploys.

### 5.5. Point the CMS config at your worker

Open `public/admin/config.yml`. Update line 5:

```yaml
base_url: https://sveltia-cms-auth.YOUR-SUBDOMAIN.workers.dev
```

Commit and push:

```bash
git add public/admin/config.yml
git commit -m "Configure CMS auth worker"
git push
```

Wait for GitHub Actions to rebuild (~2 min).

### 5.6. Test login

Open https://www.mamaland.bg/admin in a private browser window. Click "Sign in with GitHub". Approve the OAuth permission. You should land in the CMS dashboard.

Try creating a test article, save it, watch your repo — a new file appears in `src/content/articles/`, and the site rebuilds within a minute.

---

## Part 6 — Give Merilin access (10 minutes)

### 6.1. Create her GitHub account

Either she creates one herself, or you create it for her using her email. She doesn't need to know how GitHub works — she'll never see it.

### 6.2. Add her as a collaborator

In your repo: **Settings → Collaborators → Add people**. Add her GitHub username. She'll get an email invite.

### 6.3. Give her the credentials

Send her:
- The URL: `https://www.mamaland.bg/admin`
- Her GitHub username and password (in a secure way — password manager, signal, etc.)
- A 1-page guide on writing her first article (suggest making it; happy to draft it)

That's it. She bookmarks `/admin`, logs in, and writes.

---

## Part 7 — Optional: Contact form (10 minutes)

The contact page has a form pointing at Formspree. To activate:

1. Go to [formspree.io](https://formspree.io) (free for 50 submissions/month — plenty)
2. Create an account, create a new form, get your form ID (looks like `xqkjvwla`)
3. In `src/pages/kontakt.astro`, find `YOUR_FORM_ID` and replace it
4. Commit, push, done. Submissions arrive in Merilin's inbox.

Skip this for now if you want — the rest of the site works fine without it.

---

## What lives where (so you don't get lost)

```
src/
├── content/          ← Merilin's actual content (markdown files)
│   ├── articles/     ← Each article = one .md file
│   ├── seminars/     ← Each seminar = one .md file
│   └── team/         ← Bios for the about page
├── pages/            ← Site routes (don't edit these for content)
├── layouts/Base.astro    ← Header, footer, meta — edit for site-wide changes
├── components/       ← Reusable bits (ArticleCard, SeminarCard)
└── styles/global.css ← Brand colors, fonts, spacing — edit here for theme changes

public/
├── admin/            ← Sveltia CMS lives here
│   ├── index.html    ← Don't touch
│   └── config.yml    ← Defines what fields Merilin can edit
├── images/           ← All article images, auto-uploaded by CMS
├── favicon.svg
└── CNAME             ← Custom domain pointer

.github/workflows/deploy.yml   ← GitHub Actions auto-deploy
```

---

## How content updates work

1. Merilin opens `mamaland.bg/admin`, logs in
2. She clicks "New статия", fills in title/excerpt/category/cover/body
3. She clicks "Save" — Sveltia creates a `.md` file and commits to your repo
4. GitHub Actions sees the commit, rebuilds the site (~60 seconds)
5. New article is live at `mamaland.bg/statii/her-slug`

She never opens code. You never get pinged.

---

## When something breaks

- **CMS won't load:** check `public/admin/config.yml` — the `repo` and `base_url` lines
- **Build fails:** check the Actions tab on GitHub — error log is there
- **DNS not resolving:** wait. Bulgarian DNS sometimes takes 6+ hours
- **CMS says "not authorized":** the OAuth app callback URL must exactly match the worker URL
- **Article doesn't appear after publish:** check the Actions tab — build is probably still running

---

## Two things to do after launch

1. **Send the site to Google Search Console** at search.google.com/search-console — verify ownership, submit sitemap (which Astro auto-generates at `/sitemap-index.xml`)
2. **Set up a backup** — your content is in Git already so it's safe, but you could star/fork the repo for peace of mind

---

## Costs

Everything in this stack is free:
- GitHub Pages — free
- GitHub Actions — free for public repos, 2000 min/month for private (you'll use ~5/month)
- Cloudflare Workers — free up to 100k requests/day (you'll use ~10/day)
- Sveltia CMS — open source, free
- Domain — already owned

Total: 0 BGN/month, forever, unless the site gets so popular it breaks free tier limits — at which point Merilin's career has gone really well and a few euros is the least of her problems.
