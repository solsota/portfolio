import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'

const project = 'portfoliosol'
const site = 'portfoliosol'
const versionId = name => name?.split('/').at(-1)

export function previousVersions(versions, channels) {
  const live = channels.find(channel => channel.name.endsWith('/live'))?.release?.version
  if (!live?.name) throw new Error('No se pudo identificar la versión activa. No se borra ninguna versión.')
  const active = new Set(channels.map(channel => versionId(channel.release?.version?.name)).filter(Boolean))
  const liveVersion = versions.find(version => versionId(version.name) === versionId(live.name))
  const liveTime = Date.parse(liveVersion?.createTime || live.createTime)
  if (!Number.isFinite(liveTime)) throw new Error('No se pudo verificar la fecha de la versión activa. No se borra ninguna versión.')
  return versions.filter(version => version.status === 'FINALIZED' && !active.has(versionId(version.name)) && Date.parse(version.createTime) <= liveTime)
}

export async function pruneHosting(api, verifyPublished) {
  // Never prune after a failed upload, stale deployment or failed health check.
  await verifyPublished()
  const channels = await api.listChannels()
  const live = channels.find(channel => channel.name.endsWith('/live'))
  if (!live?.release?.version?.name) throw new Error('El canal live no tiene una versión activa verificable.')
  const versions = await api.listVersions()
  const previous = previousVersions(versions, channels)
  await api.keepOneRelease()
  let deleted = 0
  for (const version of previous) {
    const currentChannels = await api.listChannels()
    const currentLive = currentChannels.find(channel => channel.name.endsWith('/live'))
    if (versionId(currentLive?.release?.version?.name) !== versionId(live.release.version.name)) throw new Error('Cambió la versión activa durante la limpieza. Limpieza detenida.')
    if (currentChannels.some(channel => versionId(channel.release?.version?.name) === versionId(version.name))) continue
    await api.deleteVersion(version.name)
    deleted++
  }
  return deleted
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const require = createRequire(import.meta.url)
    // Pinned firebase-tools version: reuse its signed-in CLI account/ADC.
    const firebase = require('firebase-tools')
    const hosting = require('firebase-tools/lib/hosting/api')
    const { Client } = require('firebase-tools/lib/apiv2')
    const client = new Client({ urlPrefix: 'https://firebasehosting.googleapis.com', apiVersion: 'v1beta1', auth: true })
    const count = await pruneHosting({
      listChannels: async () => (await firebase.hosting.channel.list({ project, site, nonInteractive: true })).channels,
      listVersions: () => hosting.listVersions(project, site),
      keepOneRelease: () => client.patch(`/projects/${project}/sites/${site}/channels/live`, { retainedReleaseCount: 1 }, { queryParams: { updateMask: 'retainedReleaseCount' } }),
      deleteVersion: name => client.delete(`/projects/${project}/sites/${site}/versions/${versionId(name)}`),
    }, async () => {
      const response = await fetch(`https://${site}.web.app/?deploy-check=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(30_000) })
      if (!response.ok) throw new Error(`La web publicada devolvió HTTP ${response.status}. No se borra ninguna versión anterior.`)
      const hash = data => createHash('sha256').update(data).digest('hex')
      if (hash(await response.text()) !== hash(await readFile('dist/index.html'))) throw new Error('La web publicada no coincide con el build local. No se borra ninguna versión anterior.')
    })
    console.log(`Firebase: ${count} versiones anteriores eliminadas; se conserva la activa. La liberación de almacenamiento puede tardar hasta 24 horas.`)
  } catch (error) {
    console.error(`No se pudo completar la limpieza de Firebase: ${error.message}`)
    process.exitCode = 1
  }
}
