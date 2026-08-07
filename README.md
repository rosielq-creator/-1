# Green Tomato

A responsive one-page creative studio site and reusable React Design System.

## Run locally

```bash
npm install
npm run dev
```

## Publish to GitHub Pages

Pushing `main` deploys automatically to
[`https://rosielq-creator.github.io/-1/`](https://rosielq-creator.github.io/-1/)
through the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`.

## Design System

`src/design-system` contains portable layout, typography, link and media primitives. The visual theme is supplied through CSS custom properties in `src/styles.css`:

- 4px base spacing scale
- mobile-first 4/8/12-column composition
- semantic light/dark colors
- accessible focus and reduced-motion defaults

To create another site, retain the primitives and replace the semantic color/font tokens and page composition.

## Assets

The `public/assets` files are temporary static art placements. Replace them with future 3D WebP/PNG renders using the same file names or update the relevant `MediaFrame` source in `src/App.jsx`.

## 3D asset handoff

Potential 3D replacements live in `public/assets/3d/` and are tracked by
`public/assets/3d-assets.manifest.json`. Assets remain pending until explicitly
approved with `验收通过`; the active site must not reference pending assets.
