---
title: "Local LLM + Claude Code: Cut AI Costs Without Cutting Quality"
description: "Split agent work by complexity: Claude Code for reasoning, a local Qwen model on a MacBook Air for mechanical tasks at zero token cost, with Ollama and oMLX benchmarked."
pubDate: 2026-07-02
tags: ["Software", "Apple"]
lang: en
---

Cloud AI is expensive when you run it as an agent. A Claude Code session for a non-trivial feature can burn hundreds of thousands of tokens. Do that daily and the bill adds up.

My solution is to split the work by complexity.

Claude Code handles the hard stuff: requirements, architecture, complex debugging, PR review. That's where the frontier model earns its cost.

Local LLM via Pi handles the mechanical work: running tests and reporting failures, validating release checklists, triggering deployments. These are repetitive, structured tasks that don't need deep reasoning, and they cost zero tokens.

---

I benchmarked this setup on a MacBook Air M5 32GB, running Qwen3.6 35B (4-bit) through two local runners, Ollama and oMLX.

For coding quality, I used Pi to autonomously complete two real tasks: write a Python data analysis script from scratch, and find and fix three bugs with unit tests.

Both runners scored 88–95 / 100, with correct output, clean code and passing tests.

oMLX was faster: 55 tok/s vs Ollama's 44, and finished the bug-fixing task in 87 seconds vs 254. Power draw: ~5W. The fanless MacBook Air never struggled.

---

The model uses ~25GB of 32GB RAM. Setup takes an afternoon.

Local LLMs let me stop paying Claude prices for tasks that don't need Claude intelligence.

Full benchmark: [mac-llm-bench report](https://github.com/henrywang/mac-llm-bench/blob/main/REPORT.md)
