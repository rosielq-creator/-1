# Home Section Heading Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the five homepage section titles as DM Sans Medium 500 with zero tracking and identical responsive sizing.

**Architecture:** Keep the change CSS-only by replacing the existing homepage section-title override. Protect the contract with the existing Node typography test.

**Tech Stack:** React, CSS, Node test runner, Vite

## Global Constraints

- Keep the homepage hero unchanged.
- Preserve existing title copy and line breaks.
- Do not affect profile or subpage typography.

---

### Task 1: Homepage section-title typography

**Files:**
- Modify: `tests/typography.test.mjs`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.home-main` homepage scope and existing section-title selectors.
- Produces: one shared computed typography contract for the five section titles.

- [ ] **Step 1: Update the typography contract test**

Assert that the shared selector uses `var(--sans)`, weight `500`, tracking `0em`, line-height `.94`, and `clamp(48px, 5vw, 92px)`.

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test`

Expected: the homepage heading-system test fails against the old Barlow Condensed rule.

- [ ] **Step 3: Implement the shared CSS rule**

Replace the condensed homepage heading override with the approved DM Sans values, including an explicit shared font size so the About title no longer inherits its larger exception.

- [ ] **Step 4: Verify tests and production build**

Run: `npm test && npm run build`

Expected: all tests pass and Vite exits successfully.

- [ ] **Step 5: Inspect desktop and mobile**

Open the homepage at desktop and mobile widths and confirm all five titles remain readable, aligned, and free of overflow.
