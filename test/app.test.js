const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const staticDir = path.join(__dirname, '..', 'static')
const read = (file) => fs.readFileSync(path.join(staticDir, file), 'utf8')
const exists = (file) => fs.existsSync(path.join(staticDir, file))

const sw = read('sw.js')
const html = read('index.html')
const manifest = JSON.parse(read('manifest.json'))

/* cache.addAll() is all or nothing: one missing file stops the service worker installing */
test('every precached file exists', () => {
  const list = sw.match(/const PRECACHE = (\[[\s\S]*?\]);/)[1]
  const files = [...list.matchAll(/'([^']+)'/g)].map((match) => match[1])
  assert.ok(files.length > 0)

  for (const file of files) {
    assert.ok(exists(file === './' ? 'index.html' : file), file)
  }
})

test('files referenced by the page and manifest exist and are precached', () => {
  const referenced = [
    ...[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
    ...manifest.icons.map((icon) => icon.src),
    manifest.start_url,
  ]

  for (const file of referenced) {
    assert.ok(exists(file), file)
    assert.ok(sw.includes(`'${file}'`), `${file} is missing from the precache list`)
  }
})

/* The app is hosted under /pwa-clock/, where root-relative paths would break */
test('paths are relative', () => {
  const paths = [
    ...[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
    ...manifest.icons.map((icon) => icon.src),
    manifest.start_url,
  ]

  for (const file of paths) {
    assert.ok(!file.startsWith('/'), file)
  }
})

test('manifest meets the install requirements', () => {
  const sizes = manifest.icons.map((icon) => icon.sizes)
  assert.ok(sizes.includes('192x192'))
  assert.ok(sizes.includes('512x512'))
  assert.equal(manifest.display, 'standalone')
})
