import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { assertBudget, measureBuild, CODE_LIMIT_BYTES } from './check-size.mjs'
import { previousVersions, pruneHosting } from './prune-hosting.mjs'
import { animatedWebP } from './image-codec.mjs'

const version = (id, time, status = 'FINALIZED') => ({ name: `sites/portfoliosol/versions/${id}`, createTime: `2026-10-${time}T12:00:00Z`, status })
const channel = (name, version) => ({ name: `sites/portfoliosol/channels/${name}`, release: { version } })
const live = version('current', '20')
const old = version('old', '19')
const preview = version('preview', '18')
const channels = [channel('live', live), channel('preview', preview)]

test('WebP conversion preserves original pixels and resolution, is idempotent and accepts replacement images', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'portfolio-lossless-'))
  try {
    await mkdir(path.join(dir, 'public'))
    await mkdir(path.join(dir, 'src'))
    await writeFile(path.join(dir, 'index.html'), '<img src="/sample.png">')
    const pixels = randomBytes(48 * 64 * 3)
    const png = await sharp(pixels, { raw: { width: 48, height: 64, channels: 3 } }).png().toBuffer()
    await writeFile(path.join(dir, 'public/sample.png'), png)
    const run = () => promisify(execFile)(process.execPath, [fileURLToPath(new URL('./optimize-images.mjs', import.meta.url))], { cwd: dir })
    await run()
    const outputPath = path.join(dir, 'public/sample.webp')
    const converted = await readFile(outputPath)
    assert.deepEqual(await sharp(converted).raw().toBuffer(), pixels)
    assert.equal((await sharp(converted).metadata()).width, 48)
    assert.match(await readFile(path.join(dir, 'index.html'), 'utf8'), /sample.webp/)
    await run()
    assert.deepEqual(await readFile(outputPath), converted)
    const replacement = await sharp({ create: { width: 91, height: 73, channels: 3, background: '#702a32' } }).webp({ lossless: true }).toBuffer()
    await writeFile(outputPath, replacement)
    await run()
    const updated = await readFile(outputPath)
    assert.equal((await sharp(updated).metadata()).width, 91)
    assert.deepEqual(await sharp(updated).raw().toBuffer(), await sharp(replacement).raw().toBuffer())
  } finally { await rm(dir, { recursive: true }) }
})

test('the 2 MB budget blocks an oversized code build; images do not use the code budget', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'portfolio-size-'))
  try {
    await writeFile(path.join(dir, 'index.html'), '<html>portfolio</html>')
    await writeFile(path.join(dir, 'large.svg'), 'x'.repeat(3_000_000))
    const small = await measureBuild(dir)
    assert.doesNotThrow(() => assertBudget(small))
    await writeFile(path.join(dir, 'bundle.js'), randomBytes(CODE_LIMIT_BYTES + 100))
    assert.throws(() => assertBudget({ code: { gzip: CODE_LIMIT_BYTES + 1 } }), /PUBLICACIÓN BLOQUEADA/)
    const large = await measureBuild(dir)
    assert.throws(() => assertBudget(large), /PUBLICACIÓN BLOQUEADA/)
  } finally { await rm(dir, { recursive: true }) }
})

test('measureBuild rejects a PNG falsely renamed WebP', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'portfolio-image-'))
  try {
    await writeFile(path.join(dir, 'fake.webp'), Buffer.from([137, 80, 78, 71]))
    await assert.rejects(measureBuild(dir), /no es WebP real/)
  } finally { await rm(dir, { recursive: true }) }
})

test('GIF conversion keeps every frame, original resolution and timing in animated WebP', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'portfolio-animation-'))
  try {
    await mkdir(path.join(dir, 'public'))
    await mkdir(path.join(dir, 'src'))
    await writeFile(path.join(dir, 'index.html'), '<img src="/animation.gif">')
    const pixels = Buffer.concat([Buffer.alloc(12 * 9 * 3, 32), Buffer.alloc(12 * 9 * 3, 192)])
    const gif = await sharp(pixels, { raw: { width: 12, height: 18, channels: 3, pageHeight: 9 } }).gif({ delay: [100, 200], loop: 0 }).toBuffer()
    await writeFile(path.join(dir, 'public/animation.gif'), gif)
    await promisify(execFile)(process.execPath, [fileURLToPath(new URL('./optimize-images.mjs', import.meta.url))], { cwd: dir })
    const converted = await readFile(path.join(dir, 'public/animation.webp'))
    const before = await sharp(gif, { animated: true }).metadata()
    const after = await sharp(converted, { animated: true }).metadata()
    assert.equal(after.format, 'webp')
    assert.equal(after.pages, before.pages)
    assert.equal(after.width, before.width)
    assert.equal(after.pageHeight, before.pageHeight)
    assert.equal(after.loop, before.loop)
    assert.deepEqual(after.delay, before.delay)
    assert.deepEqual(await sharp(converted, { animated: true }).ensureAlpha().raw().toBuffer(), await sharp(gif, { animated: true }).ensureAlpha().raw().toBuffer())
  } finally { await rm(dir, { recursive: true }) }
})

test('animation encoding preserves duplicate frames instead of merging them', async () => {
  // Three identical 1×1 GIF frames with distinct durations; constructing the
  // fixture directly prevents an encoder from merging the input frames first.
  const input = Buffer.concat([
    Buffer.from('GIF89a'),
    Buffer.from([1, 0, 1, 0, 0x80, 0, 0, 0x70, 0x2a, 0x32, 255, 255, 255]),
    ...[10, 15, 20].map(delay => Buffer.from([
      0x21, 0xf9, 4, 0, delay, 0, 0, 0,
      0x2c, 0, 0, 0, 0, 1, 0, 1, 0, 0,
      2, 2, 0x44, 1, 0,
    ])),
    Buffer.from([0x3b]),
  ])
  const before = await sharp(input, { animated: true }).metadata()
  assert.equal(before.pages, 3)
  const result = await animatedWebP(input)
  const after = await sharp(result, { animated: true }).metadata()
  assert.equal(after.pages, before.pages)
  assert.deepEqual(after.delay, before.delay)
})

test('cleanup excludes live, preview, pending and concurrent future versions', () => {
  const versions = [live, old, preview, version('pending', '17', 'CREATED'), version('future', '21')]
  assert.deepEqual(previousVersions(versions, channels), [old])
  assert.throws(() => previousVersions(versions, []), /versión activa/)
})

test('failed publication verification performs no cleanup or retention mutation', async () => {
  let touched = false
  await assert.rejects(pruneHosting({ listChannels: async () => { touched = true } }, async () => { throw new Error('health check failed') }), /health check failed/)
  assert.equal(touched, false)
})

test('successful verified publication deletes only the old inactive version', async () => {
  const deleted = []
  let retained = 0
  const count = await pruneHosting({
    listChannels: async () => channels,
    listVersions: async () => [live, old, preview],
    keepOneRelease: async () => { retained = 1 },
    deleteVersion: async name => deleted.push(name),
  }, async () => {})
  assert.equal(retained, 1)
  assert.equal(count, 1)
  assert.deepEqual(deleted, [old.name])
})

test('cleanup stops if another deploy changes the live version', async () => {
  let reads = 0
  let deleted = false
  await assert.rejects(pruneHosting({
    listChannels: async () => ++reads === 1 ? channels : [channel('live', version('newer', '21'))],
    listVersions: async () => [old, live],
    keepOneRelease: async () => {},
    deleteVersion: async () => { deleted = true },
  }, async () => {}), /Cambió la versión activa/)
  assert.equal(deleted, false)
})
