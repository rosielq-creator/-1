import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('profile typography loads and scopes Instrument Serif', () => {
  assert.match(styles, /family=Instrument\+Serif/)
  assert.match(styles, /--serif:\s*'Instrument Serif'/)
  assert.match(styles, /\.maya-world-copy[\s\S]*font-family:\s*var\(--serif\)/)
  assert.match(styles, /letter-spacing:\s*\.01em/)
})

test('all collaboration assets use a shared non-cropping 3:4 frame', () => {
  assert.match(app, /className="maya-collaboration-media"/)
  assert.match(styles, /\.maya-collaboration-media\s*\{[\s\S]*aspect-ratio:\s*3\s*\/\s*4/)
  assert.match(styles, /\.maya-collaboration-media\s*\{[\s\S]*radial-gradient/)
  assert.match(styles, /\.maya-collaboration-media\s*>\s*img[\s\S]*object-fit:\s*contain/)
  assert.match(styles, /\.maya-collaboration-media\s*>\s*video[\s\S]*object-fit:\s*contain/)
})
