import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')

test('profile typography loads and scopes Instrument Serif', () => {
  assert.match(styles, /@font-face\s*\{[^}]*font-family:'Instrument Serif'[^}]*instrument-serif-regular\.woff2/s)
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

test('all five artist personality sections provide business-ready Chinese copy', () => {
  for (const artist of ['amber', 'ooona', 'mario', 'noah']) {
    assert.match(app, new RegExp(`${artist}: \\{[\\s\\S]*?personality: \\[[\\s\\S]*?[\\u4e00-\\u9fff]`, 'i'))
  }
  for (const trait of ['精致克制', '审美敏锐', '艺术导向', '独立鲜明']) {
    assert.match(app, new RegExp(trait))
  }
  assert.match(app, /const localizedStory = language === 'en' \? story : localizeStoryProfile\(artist\.id, story, language\)/)
})
