import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { gzipSync, brotliCompressSync } from 'node:zlib'

export const CODE_LIMIT_BYTES = 2_000_000
export async function measureBuild(directory = 'dist') {
  async function walk(root) {
    const entries = await readdir(root, { withFileTypes: true })
    return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(root, entry.name)) : path.join(root, entry.name)))).flat()
  }
  const report = { limitBytes: CODE_LIMIT_BYTES, code: { raw: 0, gzip: 0, brotli: 0 }, images: 0, other: 0, total: 0, files: [] }
  for (const file of await walk(directory)) {
    if (file.endsWith('size-report.json')) continue
    const data = await readFile(file)
    report.total += data.length
    const code = /\.(html|css|m?js|wasm|json)$/.test(file)
    const entry = { path: path.relative(directory, file), bytes: data.length }
    if (code) {
      entry.gzip = gzipSync(data).length
      entry.brotli = brotliCompressSync(data).length
      report.code.raw += data.length
      report.code.gzip += entry.gzip
      report.code.brotli += entry.brotli
    } else if (/\.(webp|svg|ico|png|jpe?g|gif)$/i.test(file)) report.images += data.length
    else report.other += data.length
    if (/\.(png|jpe?g|gif)$/i.test(file)) throw new Error(`Imagen sin convertir a WebP: ${entry.path}`)
    if (/\.webp$/i.test(file) && (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP')) throw new Error(`El archivo ${entry.path} no es WebP real.`)
    report.files.push(entry)
  }
  return report
}
export function assertBudget(report) {
  if (report.code.gzip > CODE_LIMIT_BYTES) throw new Error(`PUBLICACIÓN BLOQUEADA: código ${(report.code.gzip / 1e6).toFixed(2)} MB gzip; límite estricto 2 MB. Optimizá el código antes de publicar.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = await measureBuild()
    await writeFile('dist/size-report.json', `${JSON.stringify(report, null, 2)}\n`)
    console.log(`Código: ${(report.code.gzip / 1e6).toFixed(2)} MB gzip / 2 MB máximo (${(report.code.brotli / 1e6).toFixed(2)} MB Brotli; ${(report.code.raw / 1e6).toFixed(2)} MB sin comprimir).`)
    console.log(`Imágenes: ${(report.images / 1e6).toFixed(2)} MB. Otros recursos: ${(report.other / 1e6).toFixed(2)} MB. Sitio completo en disco: ${(report.total / 1e6).toFixed(2)} MB.`)
    assertBudget(report)
    console.log('Control de peso aprobado.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
