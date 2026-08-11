# Title Typography Corrections

## Approved visual contract

- Keep Maya's collaboration cards unchanged, but move and size the “Made with brands.” heading so it never overlaps the first card row.
- Restore Green Tomato wordmark/hero display typography to the original Futura-first stack, with Century Gothic and Arial fallbacks.
- Make homepage section headings match the compact bold sans-serif reference: DM Sans 800, tight but readable tracking, and compact line-height.
- Preserve Instrument Serif only for the previously approved profile editorial copy and selected profile display accents.
- Verify desktop and mobile layouts, then perform one correction pass before deployment.

## Implementation boundary

All changes live in `src/styles.css`. No React markup, content, media, card geometry, or routing changes are required.

## Success criteria

The Maya heading has clear space above the first row at desktop and mobile widths; Green Tomato has its original geometric glyph character; homepage headings share one compact bold typographic system without clipping or overlap.
