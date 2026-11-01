---
title: "Two tools in my AI workflow: no-ai-slop and SkillSpector"
description: "How I use Peter Yang's no-ai-slop skill to check writing before it's published, and NVIDIA's SkillSpector to scan third-party agent skills before I install them."
pubDate: 2026-11-01
tags: ["Software"]
draft: false
lang: en
---

My agents run two tools without being asked. no-ai-slop checks writing before it goes out, and SkillSpector checks agent skills before they come in. no-ai-slop is itself a third-party skill, so SkillSpector scanned it before I installed it.

Both are rules in the instruction files my agents read: the global `CLAUDE.md` that Claude Code and pi share, and the `AGENTS.md` in this blog's repo. I don't have to remember to run either one.

## no-ai-slop

[no-ai-slop](https://github.com/petergyang/no-ai-slop) is a skill by Peter Yang, MIT licensed. It's a `SKILL.md` plus an `eval.md` checklist the agent grades its own edit against. The skill tells the agent to act as an editor: keep the writer's point and voice, make the smallest edit that works, and cut a named list of patterns. A few are words like "delve" and "leverage". Most are sentence shapes: binary contrasts ("It's not X. It's Y."), colon reveals, fake-profound closing lines, recap endings, and em dashes used for rhythm.

It has two modes. Edit mode returns a revised draft and a short "What changed" list. Detect mode names each pattern it finds, quotes the line and suggests a fix. It doesn't rewrite anything, and it doesn't guess whether AI wrote the text.

My rules for which mode to use:

- When an agent drafts or rewrites prose that other people will read (a blog post, a README, docs), it runs no-ai-slop in edit mode and fixes the findings before showing me the draft.
- When it's my own writing, detect mode only. The agent lists the findings and I decide what to change.
- Never on chat replies, commit messages, code comments or code.

That way an agent's prose is already cleaned up when I read it, and my own posts only change when I change them.

This blog's `AGENTS.md` puts detect mode in the pre-push checklist. If a push adds a post or rewrites prose in one, the agent runs no-ai-slop on that prose only and reports each finding with the quoted line. Spelling and formatting fixes skip it.

I ran it over the older posts here, and the cleanup went into one commit. Some of what came out of my own sentences:

- "Same agent, same context, two engineers — wildly different output. The gap isn't the tool. It's the judgment." became "Give two engineers the same agent and the same context, and they get wildly different output. The difference is their judgment."
- "Token cost for those: zero." was a colon reveal. It's now the end of the sentence before it: "...and they cost zero tokens."
- The last line of my layoff post, "For the first time in two months, the future feels less like a threat and more like a question I get to answer," was a fake-profound kicker. It's gone, and the post now ends by asking readers how they're approaching it.

## SkillSpector

A skill is a folder of instructions, and sometimes scripts, that the agent loads and follows with my permissions. Installing one from someone else's repo is closer to running their code than to reading their docs.

[SkillSpector](https://github.com/NVIDIA/SkillSpector) is NVIDIA's scanner for agent skills, Apache 2.0 licensed. Its README cites Liu et al. (2026): in a 31,132-skill subset they analyzed, 26.1% had at least one vulnerability and 5.2% showed likely malicious intent.

It checks 71 patterns in 17 categories, including prompt injection, data exfiltration, privilege escalation, supply chain, tool misuse, dangerous Python code (through AST analysis) and YARA malware signatures. It never runs the skill. The report gives a risk score from 0 to 100, a severity, and a recommendation: `SAFE`, `CAUTION` or `DO_NOT_INSTALL`.

By default it also sends the skill's file contents to an LLM provider for a second pass. I turn that off with `--no-llm`, so the files stay on my machine. The supply-chain check still sends the dependency names and versions a skill declares to OSV.dev to look up known CVEs, but not the file contents.

My setup script installs it pinned to a release:

```sh
uv tool install "git+https://github.com/NVIDIA/skillspector.git@v2.13.2"
```

The process is the same for any skill, plugin or MCP server I didn't write. Download it at an exact commit into an empty temporary folder. No moving branches or tags, and no auto-update. Read `SKILL.md` and every script in it without running any of its scripts, installers or hooks. Then scan the folder:

```sh
skillspector scan <skill-folder> --no-llm
```

Scanning the no-ai-slop copy in my dotfiles gives this (trimmed):

```text
Skill: no-ai-slop

 Score           0/100
 Severity        LOW
 Recommendation  SAFE

 File      Type      Lines  Executable
 LICENSE   other        21  No
 SKILL.md  markdown     97  No
 eval.md   markdown     43  No

No security issues detected.
```

The agent reads the recommendation itself. By default `SAFE` and `CAUTION` both exit 0, so a script that only checked the exit code would let a `CAUTION` through.

- `DO_NOT_INSTALL`: don't install.
- `CAUTION`: show me every finding and wait for my decision.
- `SAFE`: go ahead.

A HIGH or CRITICAL finding doesn't get waved through because the publisher is well known. Before installing, the agent shows me the recommendation, the score and the source commit. An update gets a full rescan of the new commit, even when the diff looks small.

Installing means copying the scanned files into my [devcage-macos](https://github.com/henrywang/devcage-macos) dotfiles repo under `config/.claude/skills/<name>/`, with the upstream license, and recording the commit in its README. `setup.sh` symlinks each skill into `~/.claude/skills` and `~/.pi/agent/skills`, so Claude Code and pi load the same copy. I don't use `npx skills add` or other installers, because they fetch their own copy, which may not be the files I scanned. With a plain copy in git, the installed skill is the one I reviewed, and an update shows up as a diff.

no-ai-slop is the only third-party skill in that folder so far, pinned at upstream commit `000650b`.
