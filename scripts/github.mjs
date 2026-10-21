import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

process.chdir(fileURLToPath(new URL('../', import.meta.url)))

function git(args, capture = false) {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
    stdio: capture ? ['inherit', 'pipe', 'inherit'] : 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Falló git ${args.join(' ')}. No se continúa con la subida.`)
  return capture ? result.stdout.trim() : ''
}

try {
  const branch = git(['symbolic-ref', '--quiet', '--short', 'HEAD'], true)
  git(['remote', 'get-url', 'origin'], true)
  git(['var', 'GIT_AUTHOR_IDENT'], true)
  git(['var', 'GIT_COMMITTER_IDENT'], true)
  git(['lfs', 'version'])
  git(['lfs', 'install', '--local'])
  git(['add', '--all'])
  // Apply LFS to media that was already staged before .gitattributes existed.
  git(['add', '--renormalize', '--', 'public/projects/technical-art'])
  if (git(['diff', '--cached', '--name-only'], true)) {
    const message = process.argv.slice(2).join(' ').trim() || 'Update portfolio content, media, and tooling'
    git(['commit', '-m', message])
  } else {
    console.log('No hay cambios nuevos para crear un commit.')
  }
  git(['push', '--set-upstream', 'origin', branch])
  console.log(`Cambios subidos a origin/${branch}.`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
