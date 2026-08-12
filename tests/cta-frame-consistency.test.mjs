import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

assert.match(css, /--frame-stroke:\s*2px/, 'shared frame thickness must be 2px')
assert.match(css, /\.text-link\s*\{[\s\S]*?font-size:\s*10px;[\s\S]*?\}/, 'both VIEW ALL links must use 10px text')
assert.match(css, /\.text-link\s*\{[\s\S]*?border-bottom:\s*var\(--frame-stroke\) solid currentColor;[\s\S]*?\}/, 'both VIEW ALL links must share the same underline')
assert.match(css, /\.artist-tile\s*\{\s*border-width:\s*var\(--frame-stroke\);\s*\}/, 'all five artist frames must share the same thickness')

