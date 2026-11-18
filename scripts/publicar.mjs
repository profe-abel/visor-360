// Publica: sincroniza, commitea y hace push. GitHub Pages se actualiza solo.
// Uso: npm run publicar -- "mensaje opcional"

import { execFileSync } from 'node:child_process'
import { RAIZ, sincronizar } from './sync.mjs'

function git(args, opciones = {}) {
  return execFileSync('git', args, { cwd: RAIZ, encoding: 'utf8', ...opciones })
}

async function main() {
  sincronizar()

  const mensaje = process.argv.slice(2).join(' ').trim() || `actualizar visor ${new Date().toISOString().slice(0, 16)}`

  try {
    git(['add', '-A'])
    git(['commit', '-m', mensaje])
  } catch (error) {
    const salida = `${error.stdout || ''}${error.stderr || ''}`
    if (salida.includes('nothing to commit')) {
      console.log('\nSin cambios para publicar.')
      return
    }
    console.error(salida || error)
    process.exit(1)
  }

  console.log('\nSubiendo a GitHub...')
  try {
    console.log(git(['push']))
  } catch (error) {
    console.error(`${error.stdout || ''}${error.stderr || ''}`)
    process.exit(1)
  }

  const url = git(['remote', 'get-url', 'origin']).trim().match(/github\.com[:/]+([^/]+)\/([^/.]+)/i)
  const base = url ? `https://${url[1]}.github.io/${url[2]}` : 'https://profe-abel.github.io/visor-360'
  console.log(`\nListo. GitHub Pages tarda 1-2 minutos en refrescar:`)
  console.log(`  ${base}/`)
}

main()
