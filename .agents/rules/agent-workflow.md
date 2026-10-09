# Agent Workflow

## Rule 15: Inspect the instruction directories named in AGENTS.md and report when they are absent

Before making changes, read the files under `.agents/rules` (this directory), and check for `.agents/skills` and `memory-bank`. If a directory named in `AGENTS.md` is absent, report the gap rather than inventing its contents.

**Repo fact:** `AGENTS.md` directs agents to `./.agents/rules`, `./.agents/skills`, and `./memory-bank`, but `.agents/skills` and `memory-bank` did not exist during the review (`.agents/rules` was created afterward as a draft).
