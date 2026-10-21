import sharp from 'sharp'

function chunk(type, data) {
  const header = Buffer.alloc(8)
  header.write(type, 0, 4, 'ascii')
  header.writeUInt32LE(data.length, 4)
  return Buffer.concat([header, data, Buffer.alloc(data.length % 2)])
}

// libwebp normally merges duplicate frames. Mux full lossless frames explicitly
// to preserve the original frame count, per-frame duration and loop exactly.
export async function animatedWebP(input) {
  const metadata = await sharp(input, { animated: true }).metadata()
  const { data, info } = await sharp(input, { animated: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const width = info.width
  const height = metadata.pageHeight || info.height
  const pages = metadata.pages || 1
  const stride = width * height * 4
  let alpha = false
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) { alpha = true; break }
  }
  const extended = Buffer.alloc(10)
  extended[0] = 0x02 | (alpha ? 0x10 : 0)
  extended.writeUIntLE(width - 1, 4, 3)
  extended.writeUIntLE(height - 1, 7, 3)
  const animation = Buffer.alloc(6)
  animation.writeUInt16LE(metadata.loop ?? 1, 4)
  const chunks = [chunk('VP8X', extended), chunk('ANIM', animation)]
  for (let page = 0; page < pages; page++) {
    const frame = await sharp(data.subarray(page * stride, (page + 1) * stride), { raw: { width, height, channels: 4 } }).webp({ lossless: true, effort: 6 }).toBuffer()
    const imageChunks = []
    for (let offset = 12; offset < frame.length;) {
      const type = frame.toString('ascii', offset, offset + 4)
      const size = frame.readUInt32LE(offset + 4)
      const length = 8 + size + size % 2
      if (['VP8L', 'VP8 ', 'ALPH'].includes(type)) imageChunks.push(frame.subarray(offset, offset + length))
      offset += length
    }
    const header = Buffer.alloc(16)
    header.writeUIntLE(width - 1, 6, 3)
    header.writeUIntLE(height - 1, 9, 3)
    header.writeUIntLE(metadata.delay?.[page] ?? 100, 12, 3)
    header[15] = 2 // Full frame replaces the previous canvas; no blending.
    chunks.push(chunk('ANMF', Buffer.concat([header, ...imageChunks])))
  }
  const body = Buffer.concat(chunks)
  const riff = Buffer.alloc(12)
  riff.write('RIFF', 0)
  riff.writeUInt32LE(body.length + 4, 4)
  riff.write('WEBP', 8)
  return Buffer.concat([riff, body])
}
