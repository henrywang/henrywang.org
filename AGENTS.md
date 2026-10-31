# AGENTS.md

Henry Wang's personal blog: a static [Astro](https://astro.build) site, deployed to a Cloudflare Worker at <https://henrywang.org>. Hosting, DNS and domain setup are in the README ("Hosting and domain").

## Commands

Use pnpm only (the version is pinned in `package.json`).

```sh
pnpm install
pnpm dev          # http://localhost:4321, drafts visible
pnpm build        # static site in dist/, drafts excluded
pnpm check        # spelling, Markdown lint, type check, then build
```

`pnpm check` runs, in order:

- `pnpm lint:spell`: cspell (`cspell.json`). Real names and technical terms go in `project-words.txt`; real misspellings get fixed, never added to the word list. Fenced code blocks are not spell-checked.
- `pnpm lint:md`: markdownlint-cli2 (`.markdownlint-cli2.jsonc`).
- `pnpm typecheck`: `astro check`. TypeScript stays on 6.x until `@astrojs/check` supports TypeScript 7.
- `pnpm build`

## Before pushing to main

Every push to `main` is built and published to henrywang.org by Cloudflare within about a minute. There is no staging step.

1. Run `pnpm check`. Do not push if it fails. The `.githooks/pre-push` hook runs it automatically for pushes to `main` once enabled with `git config core.hooksPath .githooks`. Never bypass it with `--no-verify`. The hook checks the working tree, not the commits being pushed, so commit or stash unrelated changes first.
2. If the push adds a post or adds or rewrites prose in an existing one (`src/content/blog/`), run the `/no-ai-slop` skill in **detect** mode ("is this slop?") on that new or rewritten prose only. Spelling and formatting fixes don't need it. Report each finding with the quoted line. Do not rewrite the post: the author decides what to change.
3. Ask before pushing, and before committing.

## Posts

- One Markdown file per post in `src/content/blog/`. The filename is the URL slug: `my-post.md` becomes `/blog/my-post/`.
- Frontmatter fields and types are defined in `src/content.config.ts`. `title`, `description` and `pubDate` (`YYYY-MM-DD`) are required. The first tag is the one shown in lists.
- Set `lang: zh` for posts written mainly in Chinese. For a translation, see "Chinese and bilingual posts" in the README.
- `draft: true` hides a post from the production build.
- Images go in `public/images/blog/` and are referenced as `/images/blog/<file>`.
- Do not change the wording, spelling or structure of existing posts without asking. Formatting-only fixes are fine if the built HTML for the post is unchanged.
- When importing a post from elsewhere, keep the text as written and replace shortened links (such as `lnkd.in`) with the real URL.

## Code

- TypeScript and Astro. Match the style of the file you're editing.
- Site constants are in `src/consts.ts`. UI strings are in `src/i18n.ts`, and every new string needs both `en` and `zh`.
- The site promises no analytics, cookies or trackers. Do not add any, or any third-party script that sets cookies.
- Don't add dependencies unless they're needed. The build must pass with `pnpm install --frozen-lockfile`, which is what Cloudflare runs.

## Licensing

- Code: MIT (`LICENSE`).
- Posts in `src/content/blog/` and images in `public/images/blog/`: CC BY 4.0 (`LICENSE-CONTENT`). Only add images and quoted material that can be published under it.
- `public/images/henry.jpg`: all rights reserved.

## Git

- Conventional commits in the imperative mood (`feat:`, `fix:`, `docs:`, `chore:`). A subject line alone for small changes.

## Agent skills

Before installing any third-party agent skill, scan it with [SkillSpector](https://github.com/NVIDIA/SkillSpector). Download the skill at the exact commit you will install into an empty folder, then scan that folder:

```sh
skillspector scan <skill-folder> --no-llm
```

`--no-llm` keeps the skill's files on this machine. Read the skill's `SKILL.md` and any scripts before installing, and install the same files you scanned.
