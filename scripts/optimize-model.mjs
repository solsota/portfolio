import { readFile, writeFile, mkdir, copyFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const file = 'src/components/Lanyard/card.glb'
const current = await readFile(file)
const currentDocument = JSON.parse(current.subarray(20, 20 + current.readUInt32LE(12)).toString())
const original = path.join('.image-originals', file)
let buffer = current
try { buffer = await readFile(original) } catch { /* The current model is the original. */ }
if (buffer.readUInt32LE(0) !== 0x46546c67 || buffer.readUInt32LE(4) !== 2) throw new Error('Modelo GLB inválido')
const jsonLength = buffer.readUInt32LE(12)
const document = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString())
const pending = (document.images || []).filter(image => image.mimeType !== 'image/webp')
if (pending.length && currentDocument.asset.extras?.portfolioTextureEncoding !== 'webp-lossless-v1') {
  await mkdir(path.dirname(original), { recursive: true })
  try { await stat(original) } catch { await copyFile(file, original) }
  const binary = buffer.subarray(28 + jsonLength)
  const replacements = new Map()
  for (const image of pending) {
    const view = document.bufferViews[image.bufferView]
    const input = binary.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength)
    replacements.set(image.bufferView, await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer())
    image.mimeType = 'image/webp'
  }
  for (const texture of document.textures || []) {
    if (texture.source === undefined) continue
    texture.extensions = { ...texture.extensions, EXT_texture_webp: { source: texture.source } }
    delete texture.source
  }
  document.extensionsUsed = [...new Set([...(document.extensionsUsed || []), 'EXT_texture_webp'])]
  document.extensionsRequired = [...new Set([...(document.extensionsRequired || []), 'EXT_texture_webp'])]
  document.asset.extras = { ...document.asset.extras, portfolioTextureEncoding: 'webp-lossless-v1' }
  const chunks = []
  let offset = 0
  for (const [index, view] of document.bufferViews.entries()) {
    if (view.buffer !== 0) throw new Error('El optimizador GLB requiere un único buffer interno')
    const data = replacements.get(index) || binary.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength)
    const padding = Buffer.alloc((4 - offset % 4) % 4)
    chunks.push(padding, data)
    offset += padding.length
    view.byteOffset = offset
    view.byteLength = data.length
    offset += data.length
  }
  document.buffers[0].byteLength = offset
  const bin = Buffer.concat([...chunks, Buffer.alloc((4 - offset % 4) % 4)])
  const json = Buffer.from(JSON.stringify(document))
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)])
  const header = Buffer.alloc(20)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(28 + jsonPadded.length + bin.length, 8)
  header.writeUInt32LE(jsonPadded.length, 12)
  header.writeUInt32LE(0x4e4f534a, 16)
  const binHeader = Buffer.alloc(8)
  binHeader.writeUInt32LE(bin.length, 0)
  binHeader.writeUInt32LE(0x004e4942, 4)
  const output = Buffer.concat([header, jsonPadded, binHeader, bin])
  await writeFile(file, output)
  console.log(`Modelo 3D con textura WebP sin pérdida: ${(buffer.length / 1e6).toFixed(2)} MB → ${(output.length / 1e6).toFixed(2)} MB`)
} else console.log('Modelo 3D: texturas WebP sin pérdida ya optimizadas.')
