import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('restores the original Green Tomato display stack', () => {
  assert.match(css, /--brand-display:\s*Futura,\s*'Futura PT',\s*'Century Gothic',\s*Arial,\s*sans-serif/)
  assert.match(css, /\.home-main\s+\.hero\s+h1\s*\{[^}]*font-family:\s*var\(--brand-display\)/s)
})

test('uses one DM Sans Medium homepage heading system below the hero', () => {
  assert.match(css, /\.home-main\s+\.section-copy\s+h2[^{]*\{[^}]*font-family:\s*var\(--sans\)[^}]*font-weight:\s*500[^}]*font-size:\s*clamp\(40\.515px,\s*calc\(4\.5125vw\s*-\s*2\.805px\),\s*80\.225px\)[^}]*letter-spacing:\s*-6\.66px[^}]*line-height:\s*\.94/s)
  assert.match(css, /@media\s*\(min-width:761px\)[\s\S]*\.home-main\s+\.section-copy\s+h2,[\s\S]*\.home-main\s+\.world-copy\s+h2\s*\{[^}]*white-space:\s*nowrap/s)
  assert.match(css, /\.home-main\s+\.work-section\s+\.work-grid\s*\{[^}]*grid-column:\s*7\s*\/\s*-1/s)
})

test('gives multilingual work headings enough line height to avoid overlap', () => {
  assert.match(css, /\.work-page-heading\s+h1\s*\{[^}]*line-height:\s*\.96/s)
})

test('keeps the Maya collaboration heading clear of its cards', () => {
  assert.match(css, /\.maya-safe--cases\s+h2\s*\{[^}]*margin:[^;}]*clamp\(42px,6svh,68px\)/s)
  assert.match(css, /\.maya-safe--cases\s*>\s*\.eyebrow\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2/s)
  assert.match(css, /\.maya-safe--cases--6,[\s\S]*\.maya-safe--cases--7\s*\{\s*top:clamp\(56px,7svh,76px\)/)
})

test('keeps the artist directory title medium, open, and on one line', () => {
  assert.match(css, /\.artist-directory-title\s*\{[^}]*font-family:\s*var\(--sans\)[^}]*font-weight:\s*500[^}]*letter-spacing:\s*0[^}]*white-space:\s*nowrap/s)
})

test('tightens all five profile name wordmarks', () => {
  assert.match(css, /\.maya-safe--hero\s+h1\s*\{[^}]*letter-spacing:\s*-\.055em/s)
  assert.match(css, /\.artist-story-profile\s+\.maya-safe--hero\s+h1\s*\{[^}]*letter-spacing:\s*-\.1em/s)
  assert.match(css, /@media\s*\(max-width:760px\)[\s\S]*\.maya-safe--hero\s+h1\s*\{[^}]*padding-bottom:\s*24px/s)
})

test('matches the homepage support typography contract', () => {
  assert.match(css, /\.home-main\s+\.artists-section\s+\.section-copy\s*>\s*p:not\(\.eyebrow\)\s*\{[^}]*font-family:\s*var\(--sans\)[^}]*font-weight:\s*400[^}]*font-size:\s*14\.4px[^}]*line-height:\s*21\.6px[^}]*letter-spacing:\s*normal/s)
  assert.match(css, /\.home-main\s+\.directory-link\s*\{[^}]*font-family:\s*var\(--sans\)[^}]*font-weight:\s*700[^}]*font-size:\s*10px[^}]*letter-spacing:\s*\.08em/s)
  assert.match(css, /\.home-main\s+\.eyebrow\s*>\s*span\s*\{[^}]*font-family:\s*var\(--sans\)[^}]*font-weight:\s*700[^}]*font-size:\s*10\.88px[^}]*letter-spacing:\s*1\.09px/s)
})

test('scales homepage heading tracking safely on mobile', () => {
  assert.match(css, /@media\s*\(max-width:760px\)[\s\S]*\.home-main\s+\.section-copy\s+h2[^{]*\{[^}]*letter-spacing:\s*calc\(-\.055em \+ 1px\)/s)
})
