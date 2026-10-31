# henrywang.org

Personal blog built with [Astro](https://astro.build), deployed to Cloudflare. Posts are plain Markdown in `src/content/blog`.

## Run locally

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
```

## Hosting and domain

Everything below is configured in the Cloudflare and Namecheap dashboards, not in this repo. It is recorded here so it can be checked or rebuilt later.

### Cloudflare Worker (build and deploy)

A Cloudflare Worker with static assets, connected to the GitHub repo `henrywang/henrywang.org` (Workers Builds), builds and publishes every push to `main`. There is no GitHub Actions workflow. `wrangler.jsonc` serves `dist/` and uses `404.html` for missing pages.

Workers & Pages → `henrywang-org` → Settings → Build:

- Worker name: `henrywang-org` (must match `name` in `wrangler.jsonc`, or the build fails)
- Build command: `pnpm build`
- Deploy command: `pnpm wrangler deploy`
- Non-production branch deploy command: `pnpm wrangler versions upload` (other branches get a preview URL; the live site is untouched)
- Production branch: `main`
- Root path: `/`
- Protect with Cloudflare Access: off (nothing private; drafts are excluded from every build)

Workers & Pages → `henrywang-org` → Settings → Domains & Routes → Custom domains:

- `henrywang.org`
- `www.henrywang.org` (redirected to the root, see below)

### Domain registrar (Namecheap)

`henrywang.org` is registered at Namecheap; DNS is hosted by Cloudflare.

- Domain List → Manage → Nameservers: **Custom DNS**
  - `micah.ns.cloudflare.com`
  - `zara.ns.cloudflare.com`
- DNSSEC at Namecheap: off. Turn it on from Cloudflare (DNS → Settings → DNSSEC), which then shows the DS record to enter at Namecheap.
- Namecheap's own DNS, URL redirects and email forwarding no longer apply, since Namecheap does not serve DNS for the domain.

### Cloudflare domain (`henrywang.org` zone)

Added via Account Home → Onboard a domain → Connect a domain, Free plan.

DNS → Records:

| Type | Name | Content | Notes |
|---|---|---|---|
| Worker | `henrywang.org` | `henrywang-org` | Created by the Worker custom domain |
| Worker | `www` | `henrywang-org` | Created by the Worker custom domain |
| TXT | `@` | `v=spf1 -all` | No server may send mail for the domain |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;` | Receivers reject mail claiming to be from the domain |

There are no MX records: the domain does not send or receive email. If email is ever set up (e.g. Cloudflare Email Routing), replace the SPF record and relax the DMARC policy to match.

SSL/TLS → Edge Certificates:

- Always Use HTTPS: on (`http://` → `https://`, 301)
- Certificate: issued and renewed automatically by Cloudflare

Rules → Redirect Rules (created from the "Redirect from WWW to root" template):

- Match: wildcard `https://www.*`
- Target: `https://${1}`, status 301, preserve query string
- The dashboard warns that `www` may not be proxied, because the Worker custom-domain record is not a normal DNS record. It is proxied; deploy the rule anyway.

### Checks

```sh
dig +short NS henrywang.org                  # micah/zara.ns.cloudflare.com
dig +short TXT henrywang.org                 # "v=spf1 -all"
dig +short TXT _dmarc.henrywang.org          # "v=DMARC1; p=reject; ..."
curl -sI http://henrywang.org/      | grep -i location   # https://henrywang.org/
curl -sI https://www.henrywang.org/ | grep -i location   # https://henrywang.org/
```

## Writing a post

Create `src/content/blog/my-post.md`. The filename becomes the URL: `/blog/my-post/`.

```md
---
title: "Post title"
description: "One or two sentences. Shown in lists, the post header, RSS, and social cards."
pubDate: 2026-09-14
updatedDate: 2026-09-20        # optional
tags: ["Software", "Apple"]    # first tag is shown in lists
draft: false                   # true = visible in dev, hidden in production
heroImage: /images/cover.jpg   # optional, file under public/
lang: en                       # en (default) or zh — language of the body
---

Body in Markdown. `## Headings` build the table of contents. Footnotes work like this.[^1]

[^1]: A footnote.
```

Tags with built-in colours: Software, Design, Apple, Travel, Books, Life. Any other tag gets a stable colour from the same palette (`src/utils.ts`).

## Chinese and bilingual posts

The site UI is English; individual posts can be Chinese.

- **Chinese post:** add `lang: zh` to the frontmatter. It gets a 中文 badge in lists and Chinese typography (PingFang SC, looser line height, no italics).
- **Translation:** create a second file, e.g. `my-post-zh.md`, with `lang: zh` and `translationOf: my-post` (the original's filename). Lists show the post once with an "EN · 中文" badge; each version links to the other. Works the other way round too (Chinese original, English copy).
- **Mixed passages:** inside any post, wrap other-language text in `<div lang="zh">…</div>` (blank lines inside, so Markdown still renders) or `<span lang="zh">…</span>` inline. See `mixed-language-example.md` (a draft).

## Where things live

- `src/consts.ts` — site title, bio, X handle. **Edit the bio here.**
- `src/styles/global.css` — colours (light/dark via `light-dark()`), prose typography.
- `src/layouts/Base.astro` — head, meta/OG tags, nav + footer.
- `src/pages/` — thin route files; page markup lives in `src/views/` (Home, Archive, About, Tag, Post).
- `src/i18n.ts` — UI strings.
- `src/components/` — Nav, Footer, PostRow, TagChip, TagFilter, Toc.

Dark mode follows the system setting by default; the nav button flips Light ↔ Dark and remembers the choice (no flash on load). Reading view includes a progress bar, sticky table of contents (≥1080px wide), estimated read time, footnotes, syntax-highlighted code (Shiki, `vitesse-dark`), and newer/older links.

## To do after cloning

1. Replace `bio` in `src/consts.ts`.
2. Your photo is `public/images/henry.jpg` (home intro, post byline, About card). Replace it with a larger one any time — same filename. About copy lives in `src/views/About.astro`.
