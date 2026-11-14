---
title: "One coordinator, five runners: clearing a release milestone with Claude Code in Rex tabs"
description: "How I ran eight GitHub issues in parallel for Berthly 1.7.2: one Claude Code session as coordinator, one runner per issue in its own Rex tab and git worktree, one PR each, and GitHub as the shared state."
pubDate: 2026-11-13
tags: ["Software"]
draft: false
lang: en
---

On the evening of November 12, a codebase review of [Berthly](https://berthly.net), my Mac app for Apple's `container` tool, turned into a GitHub milestone for version 1.7.2 with eight cleanup issues. Instead of working through them one at a time, I typed this into my Claude Code session:

> could you please run those 8 issue in parallel with multi claude agent in different tab of Rex? Or keep current as coordinator and multi claude agent as runner??

After the runners had started, I added "one task one pr".

![The request, and the coordinator's plan for who pushes and who merges](/images/blog/rex-runners-request.png)

By 4:15 the next morning, seven PRs were merged. Berthly 1.7.2 shipped later that day. I've since turned the setup into a skill, so the next run takes one sentence.

## The setup

[Rex](https://www.superlogical.com/updates/public-testing-beginning) is the terminal I work in. It has tabs and panes like any multiplexer, and a CLI an agent can drive: `rex window new` opens a tab running a command, `rex capture` reads a tab's screen, and `rex send` types into it.

The session I typed into became the coordinator. For each issue, it:

1. created a git worktree on a new branch from `origin/main`, in `../Berthly-worktrees/issue-N`,
2. wrote a brief for that issue to a file,
3. opened a Rex tab named after the issue, running `claude` in auto mode with the brief as its first message.

Wave one was five runners started at once: #244, #245, #246, #250 and #251. Two issues waited for later waves. #248 changed the base class that #250 and #251 were deleting methods from, and #247 split the 3,500-line file most of the others edited. Starting those later from a fresh `origin/main` was cheaper than resolving conflicts. One more, #249, was a decision rather than a task (keep or cut three features), so I answered it before any runner started.

Each runner also got its own build folder, so five Xcode builds weren't fighting over one shared DerivedData.

## Who owns what

The split that worked:

| Step | Owner |
|---|---|
| Implement, lint, unit tests, commit | Runner |
| Push, open the PR with `Closes #N` | Runner |
| Watch CI and fix failures on its own branch | Runner |
| Review each diff against its issue | Coordinator |
| Run tests that take over the screen | Coordinator |
| Decide merge order, update overlapping branches | Coordinator |
| Merge after my OK, then clean up | Coordinator |

The coordinator merges because merge order is a decision a runner can't see. #255 and #256 both edited `PARITY.md` and the System page, so whichever merged second needed `main` merged into it first. A runner only knows its own branch.

The other rule is one writer per branch. When the coordinator needs to push to a runner's branch, it tells that runner to stop first.

![The coordinator reading each runner's commit as it lands](/images/blog/rex-runners-review.png)

## GitHub is the shared state

The runners never talk to each other, and the coordinator rarely talks to them. Everyone reads and writes the same issues, PRs and CI checks:

- **The milestone is the batch, and the finish line.** "Done" meant the v1.7.2 milestone showed zero open issues.
- **The issue is the runner's brief.** Each runner started with `gh issue view N`. The coordinator's brief only added what the issue couldn't know: which open PRs touched nearby files, what not to touch, and how to ship.
- **The PR is the unit of output.** One branch and one PR per issue, with `Closes #N` in the body, so merging closed the issue and moved the milestone.
- **CI checks are the gate.** Runners watched `gh pr checks` and fixed their own failures. The coordinator read the same checks before merging instead of trusting the runners' reports.
- **New findings become new issues.** #246 asked for a comment fix and a recheck of an old push hang against a real `container` daemon. The recheck changes daemon state, so its runner skipped it, and it became #258 in the same milestone.

![CI status across the five wave-one PRs](/images/blog/rex-runners-ci.png)

## What went wrong

**Pasted instructions aren't permission.** I said "one task one pr" after the runners had started, so the coordinator sent each tab its shipping instructions with `rex send`. They arrived as pasted text, and Claude Code's auto mode doesn't treat pasted text as my permission to write to GitHub. #251's `git push` and `gh pr create` were blocked. The same instructions got the other four runners through. The coordinator pushed that branch and opened PR #256 itself, then told the runner to stop. Now the shipping steps go in the launch prompt.

![Runner #251 blocked on push, and the coordinator taking the PR over](/images/blog/rex-runners-blocked-push.png)

**Lint crawled the build folders.** Running `swiftlint` with no paths walked each worktree's DerivedData and its package checkouts. Passing the four source folders explicitly fixed it.

**The coordinator's monitor reported a PR that didn't exist.** An empty `gh` result printed as "null null", and the monitor treated it as a new PR. The coordinator noticed and restarted the monitor.

**Some tests take over the screen.** Berthly's UI and end-to-end tests drive the real mouse and keyboard. Five runners doing that at once would click into each other's windows. So runners ran only lint and unit tests, CI ran the mock UI tests on every PR, and the coordinator ran the 30-test real-daemon suite once, on the 3,500-line split. All 30 passed.

**Tabs named after issues stop being useful once PRs exist.** I had to ask which tab held PR #255. The coordinator renamed every tab to show both numbers, and now each runner renames its own tab as soon as its PR opens.

![Tabs renamed to show issue and PR numbers](/images/blog/rex-runners-tabs.png)

**CI flaked.** #253 changed only comments and still failed its UI tests once. A rerun passed.

## The numbers

- Issues created: 8:44 to 8:53 PM.
- Wave-one PRs opened: 9:22 to 9:30 PM.
- Merges: 10:36 PM to 4:15 AM, seven PRs, one per issue.
- Real-daemon tests on the biggest refactor: 30 of 30.
- Berthly 1.7.2 published the same day, after Apple's notary service made me accept an updated developer agreement.

## The skill

I turned the run into a Claude Code skill, [`rex-issue-runners`](https://github.com/henrywang/devcage-macos/tree/main/config/.claude/skills/rex-issue-runners). It holds the ownership table, the brief template with shipping steps included, the `rex window new` launch command, how to track PRs through `gh` instead of reading runners' screens, and the cleanup after each merge: close the tab, remove the worktree, delete the branch, sync local `main`.

Project details stay with the project. Berthly's lint command, test command and screen-taking test suites live in its own instructions, and the coordinator copies them into each brief.
