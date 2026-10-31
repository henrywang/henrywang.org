# henrywang.org

Personal blog built with [Astro](https://astro.build), deployed to Cloudflare. Posts are plain Markdown in `src/content/blog`.

## Run locally

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
```

## Deploy on Cloudflare

A Cloudflare Worker with static assets, connected to this GitHub repo (Workers Builds), builds and publishes every push to `main`. `wrangler.jsonc` serves `dist/` and uses `404.html` for missing pages. The Worker name in Cloudflare must match `name` in `wrangler.jsonc` (`henrywang-org`).

- Build command: `pnpm build`
- Deploy command: `pnpm wrangler deploy`
- Non-production branch deploy command: `pnpm wrangler versions upload`
- Production branch: `main`

Custom domain: add `henrywang.org` under the project's Custom domains. Nothing else to configure — the site is fully static.

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
