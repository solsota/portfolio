import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { animatedWebP } from './image-codec.mjs'

const root = process.cwd()
const raster = /\.(png|jpe?g|gif|webp)$/i
const digest = buffer => createHash('sha256').update(buffer).digest('hex')
const cachePath = path.join(root, '.cache/image-optimization.json')
const policy = 'webp-lossless-original-resolution-v1'
let cache = {}
let restoreOriginals = false
try {
  const saved = JSON.parse(await readFile(cachePath, 'utf8'))
  if (saved.policy === policy) cache = saved.files
  else restoreOriginals = true
} catch { /* First run. */ }

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(path.join(directory, entry.name)) : path.join(directory, entry.name)))
  return nested.flat()
}

const files = (await Promise.all(['public', 'src'].map(filesIn))).flat()
const replacements = []
let before = 0, after = 0, converted = 0
for (const file of files.filter(file => raster.test(file))) {
  let input = await readFile(file)
  if (!input.length) {
    throw new Error(`Imagen vacía: ${file}. Quitala o reemplazala antes de publicar.`)
  }
  const outputPath = file.replace(raster, '.webp')
  const metadata = await sharp(input, { animated: true }).metadata()
  const currentHash = digest(input)
  if (metadata.format === 'webp' && cache[file] === currentHash) {
    before += input.length
    after += input.length
    cache[file] = currentHash
    continue
  }
  const original = path.join(root, '.image-originals', file)
  // Recover the original pixels when upgrading an earlier lossy conversion.
  if (restoreOriginals && /\.webp$/i.test(file)) {
    for (const candidate of [original, ...['.png', '.jpg', '.jpeg', '.gif'].map(extension => original.replace(raster, extension))]) {
      try { input = await readFile(candidate); break } catch { /* Try the next original. */ }
    }
  }
  before += input.length
  await mkdir(path.dirname(original), { recursive: true })
  await writeFile(original, input)
  const output = metadata.pages > 1
    ? await animatedWebP(input)
    : await sharp(input).rotate().webp({ lossless: true, effort: 6 }).toBuffer()
  const temporary = `${outputPath}.tmp`
  await writeFile(temporary, output)
  await rename(temporary, outputPath)
  if (outputPath !== file) {
    // Preserve originals outside both the source and the Hosting directory.
    await rename(file, `${original}.converted`)
    const oldReference = file.startsWith('public/') ? `/${file.slice(7)}` : path.basename(file)
    const newReference = outputPath.startsWith('public/') ? `/${outputPath.slice(7)}` : path.basename(outputPath)
    replacements.push([oldReference, newReference])
  }
  cache[outputPath] = digest(output)
  after += output.length
  converted++
}

for (const file of [...files.filter(file => /\.(jsx?|tsx?|css|json)$/.test(file)), 'index.html']) {
  let text = await readFile(file, 'utf8')
  const original = text
  for (const [from, to] of replacements) text = text.replaceAll(from, to)
  if (text !== original) await writeFile(file, text)
}
await mkdir(path.dirname(cachePath), { recursive: true })
await writeFile(cachePath, `${JSON.stringify({ policy, files: cache }, null, 2)}\n`)
console.log(`WebP sin pérdida: ${converted} imágenes; resolución original preservada. ${(before / 1e6).toFixed(2)} MB → ${(after / 1e6).toFixed(2)} MB. Originales: .image-originals/`)
