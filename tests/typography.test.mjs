import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('restores the original Green Tomato display stack', () => {
  assert.match(css, /--brand-display:\s*Futura,\s*'Futura PT',\s*'Century Gothic',\s*Arial,\s*sans-serif/)
  assert.match(css, /\.home-main\s+\.hero\s+h1\s*\{[^}]*font-family:\s*var\(--brand-display\)/s)
})

test('uses one compact bold homepage heading system', () => {
  assert.match(css, /\.home-main\s+\.section-copy\s+h2[^{]*\{[^}]*font-family:\s*var\(--sans\)[^}]*font-weight:\s*800[^}]*letter-spacing:\s*-\.055em[^}]*line-height:\s*\.88/s)
})

test('keeps the Maya collaboration heading clear of its cards', () => {
  assert.match(css, /\.maya-safe--cases\s+h2\s*\{[^}]*margin:[^;}]*clamp\(42px,6svh,68px\)/s)
  assert.match(css, /\.maya-safe--cases--6,[\s\S]*\.maya-safe--cases--7\s*\{\s*top:5%/)
})
