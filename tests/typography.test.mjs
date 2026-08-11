import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('restores the original Green Tomato display stack', () => {
  assert.match(css, /--brand-display:\s*Futura,\s*'Futura PT',\s*'Century Gothic',\s*Arial,\s*sans-serif/)
  assert.match(css, /\.home-main\s+\.hero\s+h1\s*\{[^}]*font-family:\s*var\(--brand-display\)/s)
})

test('uses one tall condensed homepage heading system below the hero', () => {
  assert.match(css, /\.home-main\s+\.section-copy\s+h2[^{]*\{[^}]*font-family:\s*var\(--display-condensed\)[^}]*font-weight:\s*700[^}]*letter-spacing:\s*-\.025em[^}]*line-height:\s*\.86/s)
})

test('keeps the Maya collaboration heading clear of its cards', () => {
  assert.match(css, /\.maya-safe--cases\s+h2\s*\{[^}]*margin:[^;}]*clamp\(42px,6svh,68px\)/s)
  assert.match(css, /\.maya-safe--cases\s*>\s*\.eyebrow\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2/s)
  assert.match(css, /\.maya-safe--cases--6,[\s\S]*\.maya-safe--cases--7\s*\{\s*top:clamp\(56px,7svh,76px\)/)
})

test('keeps the artist directory title condensed, bold, and on one line', () => {
  assert.match(css, /--display-condensed:\s*'Barlow Condensed'/)
  assert.match(css, /\.artist-directory-title\s*\{[^}]*font-family:\s*var\(--display-condensed\)[^}]*font-weight:\s*700[^}]*white-space:\s*nowrap/s)
})

test('tightens all five profile name wordmarks', () => {
  assert.match(css, /\.maya-safe--hero\s+h1\s*\{[^}]*letter-spacing:\s*-\.06em/s)
})
