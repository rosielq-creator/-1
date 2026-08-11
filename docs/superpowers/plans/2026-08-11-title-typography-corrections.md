# Title Typography Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct Maya title overlap, restore the original Green Tomato display glyphs, and unify homepage titles with the compact bold reference.

**Architecture:** Add narrowly scoped CSS typography tokens and selectors in the existing stylesheet. Keep profile editorial serif rules and collaboration card geometry intact.

**Tech Stack:** React, Vite, CSS, Node test runner

## Global Constraints

- Do not change React markup or content.
- Do not crop or resize the approved 3:4 collaboration frames.
- Verify desktop and mobile screenshots and complete one correction pass.

---

### Task 1: Add regression assertions

**Files:**
- Modify: `tests/typography.test.mjs`

- [ ] Assert the stylesheet contains the Green Tomato legacy display stack, compact homepage title rule, and Maya case-heading clearance rule.
- [ ] Run `npm test` and confirm the new assertions fail before implementation.

### Task 2: Implement typography corrections

**Files:**
- Modify: `src/styles.css`

- [ ] Add a Futura-first `--brand-display` stack.
- [ ] Apply the stack to the homepage Green/Tomato hero display only.
- [ ] Apply DM Sans 800, `-.055em` tracking, and `.88` line-height to homepage section titles.
- [ ] Give the Maya cases heading its own compact display rule and enough bottom clearance before the collaboration grid.
- [ ] Run `npm test` and `npm run build`.

### Task 3: Visual QA and correction

**Files:**
- Modify if needed: `src/styles.css`

- [ ] Capture homepage and Maya collaboration views at desktop and mobile widths.
- [ ] Check clipping, overlap, line breaks, and hierarchy against the supplied references.
- [ ] Make one targeted correction pass and rerun tests/build.
