import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')

test('self-hosts display fonts instead of swapping from Google Fonts', () => {
  assert.doesNotMatch(css, /fonts\.googleapis\.com/)
  for (const file of [
    'dm-sans-latin.woff2',
    'barlow-condensed-600.woff2',
    'barlow-condensed-700.woff2',
    'instrument-serif-regular.woff2',
    'instrument-serif-italic.woff2',
  ]) assert.equal(existsSync(new URL(`../public/assets/fonts/${file}`, import.meta.url)), true, file)
})

test('keeps measured plants hidden until their anchors are ready', () => {
  assert.match(app, /className=\{`botanical-story\s+\$\{anchorsReady\s*\?\s*'is-ready'\s*:\s*''\}`\}/)
  assert.match(css, /\.botanical-story:not\(\.is-ready\)\s+\.story-vine[^{]*\{[^}]*visibility:\s*hidden/s)
})

test('eagerly loads every plant used for desktop anchor measurement', () => {
  for (const className of ['story-sprout', 'story-vine', 'story-flower', 'story-continuation']) {
    assert.match(app, new RegExp(`<MediaFrame[^>]*priority[^>]*className="story-plant ${className}"`), className)
  }
})

test('does not apply smooth scrolling globally during restored page load', () => {
  assert.match(css, /html\s*\{[^}]*scroll-behavior:\s*auto/s)
})

test('clips decorative overflow without widening the mobile page', () => {
  assert.match(css, /html,body\s*\{[^}]*overflow-x:\s*clip/s)
})
