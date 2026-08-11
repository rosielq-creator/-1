# Profile Typography and Collaboration Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all five artist profiles a restrained Instrument Serif display layer and align every collaboration asset inside a non-cropping 3:4 frame with artist-matched gradient fill.

**Architecture:** Keep DM Sans as the global UI family and add Instrument Serif as a display token used only by profile narrative and selected display headings. Wrap collaboration images and videos in one reusable media-frame element; its background reads the existing per-artist palette CSS variables, with Maya receiving equivalent local variables.

**Tech Stack:** React, Vite, CSS, Node built-in test runner.

## Global Constraints

- Collaboration media uses a fixed `3 / 4` frame.
- Source images and 16:9 videos use `object-fit: contain`; no source media is cropped.
- Empty space is filled with a subtle artist-specific radial/linear gradient, not white, black, or blurred imagery.
- Navigation, labels, metadata, names, and controls remain DM Sans.
- Profile narrative copy and a limited set of large profile headings use Instrument Serif with relaxed `0.01em` letter spacing.
- Desktop and mobile layouts must be visually checked, followed by one correction pass.

---

### Task 1: Regression contract

**Files:**
- Create: `tests/profile-visual-contract.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/App.jsx`, `src/styles.css`
- Produces: static contract assertions runnable through `npm test`

- [ ] Write assertions for the Instrument Serif import/token, restricted selectors, collaboration media wrapper, 3:4 ratio, gradient background, and `object-fit: contain`.
- [ ] Run `npm test` and confirm failure because the new contract is not implemented.
- [ ] Add the `test` script to `package.json` and keep the test focused on user-visible invariants.

### Task 2: Typography and media-frame implementation

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing artist palette variables and collaboration arrays
- Produces: `.maya-collaboration-media` wrappers and `--serif` typography token

- [ ] Load Instrument Serif 400 and define `--serif` with safe fallbacks.
- [ ] Apply it only to Profile narrative, My World lead text, and selected large profile headings, preserving DM Sans UI text.
- [ ] Wrap every Maya and shared artist collaboration asset in `.maya-collaboration-media`.
- [ ] Style the wrapper as 3:4 with artist-colored layered gradients, subtle grain-like highlight, border, and inner shadow.
- [ ] Center images and videos with `object-fit: contain`, equal inset, and equal card dimensions.
- [ ] Add responsive rules that retain the 3:4 frame and readable one/two-column mobile grid.
- [ ] Run `npm test` and `npm run build` and confirm both pass.

### Task 3: Visual QA and correction

**Files:**
- Modify if required: `src/styles.css`
- Evidence: `qa/profile-work-desktop.png`
- Evidence: `qa/profile-work-mobile.png`

**Interfaces:**
- Consumes: local Vite build
- Produces: desktop/mobile screenshot evidence and one documented correction pass

- [ ] Run the site locally and inspect representative 3:4 and 16:9 collaboration assets on desktop.
- [ ] Inspect the same profile scene at mobile width.
- [ ] Correct spacing, alignment, overflow, or contrast issues found in the first pass.
- [ ] Re-run `npm test` and `npm run build` before deployment.
- [ ] Commit and push only the scoped repository changes, then verify the GitHub Pages URL.
