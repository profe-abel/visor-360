// Ajustes rápidos sin editar JSON a mano.
//
//   npm run solo -- panorama5 panorama6        deja visibles SOLO esas vistas
//   npm run todos                              vuelve a mostrar todo
//   npm run proyecto -- banio "Baño" pano5 pano6
//   npm run titulo -- pano5 "Baño - Terminaciones"
//   npm run quitar-proyecto -- banio
//
// Después de cada cambio se regenera el manifiesto automáticamente.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { RAIZ, aSlug, sincronizar } from './sync.mjs'

const ARCHIVO_AJUSTES = path.join(RAIZ, 'datos', 'ajustes.json')
const ARCHIVO_ESTADO = path.join(RAIZ, 'datos', 'estado.json')

const PUERTO_LOCAL = 5173

function leerJson(archivo, porDefecto) {
  try {
    return JSON.parse(fs.readFileSync(archivo, 'utf8'))
  } catch {
    return porDefecto
  }
}

function guardarAjustes(ajustes) {
  fs.mkdirSync(path.dirname(ARCHIVO_AJUSTES), { recursive: true })
  fs.writeFileSync(ARCHIVO_AJUSTES, JSON.stringify(ajustes, null, 2) + '\n', 'utf8')
}

function idsConocidos() {
  const estado = leerJson(ARCHIVO_ESTADO, { vistas: {} })
  return Object.keys(estado.vistas || {})
}

function enlaceRepo() {
  try {
    const url = execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd: RAIZ,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    const m = url.match(/github\.com[:/]+([^/]+)\/([^/.]+)/i)
    if (m) return `https://${m[1]}.github.io/${m[2]}`
  } catch {
    /* sin remoto todavía */
  }
  return 'https://profe-abel.github.io/visor-360'
}

function validar(ids, conocidos) {
  const faltantes = ids.filter((id) => !conocidos.includes(id))
  if (faltantes.length) {
    console.error(`\nNo encuentro estas vistas: ${faltantes.join(', ')}`)
    console.error('Primero poné los archivos en origen/ y corré: npm run sync')
    if (conocidos.length) console.error(`\nDisponibles:\n  ${conocidos.join('\n  ')}`)
    process.exit(1)
  }
}

function ajustesActuales() {
  return leerJson(ARCHIVO_AJUSTES, { titulos: {}, descripciones: {}, ocultas: [], proyectos: {} })
}

function main() {
  const [comando, ...args] = process.argv.slice(2)
  const ajustes = ajustesActuales()
  ajustes.titulos ||= {}
  ajustes.descripciones ||= {}
  ajustes.ocultas ||= []
  ajustes.proyectos ||= {}

  const conocidos = idsConocidos()

  switch (comando) {
    case 'solo': {
      if (!args.length) {
        console.error('Uso: npm run solo -- <id> [<id> ...]')
        process.exit(1)
      }
      validar(args, conocidos)
      ajustes.ocultas = conocidos.filter((id) => !args.includes(id))
      guardarAjustes(ajustes)
      sincronizar({ silencioso: true })
      console.log(`Listado: solo se ven ${args.join(', ')}`)
      break
    }

    case 'todos': {
      ajustes.ocultas = []
      guardarAjustes(ajustes)
      sincronizar({ silencioso: true })
      console.log('Listado: se ven todas las vistas')
      break
    }

    case 'proyecto': {
      const [slugBruto, nombre, ...ids] = args
      if (!slugBruto || !nombre || !ids.length) {
        console.error('Uso: npm run proyecto -- <slug> "<Nombre>" <id> [<id> ...]')
        process.exit(1)
      }
      const slug = aSlug(slugBruto)
      validar(ids, conocidos)
      ajustes.proyectos[slug] = { nombre, vistas: ids }
      guardarAjustes(ajustes)
      sincronizar({ silencioso: true })
      console.log(`Proyecto "${nombre}" listo con ${ids.length} vista(s).`)
      console.log(`  Local:  http://localhost:${PUERTO_LOCAL}/p/${slug}/`)
      console.log(`  Público: ${enlaceRepo()}/p/${slug}/`)
      break
    }

    case 'quitar-proyecto': {
      const slug = aSlug(args[0] || '')
      if (!slug || !ajustes.proyectos[slug]) {
        console.error(`No existe el proyecto "${args[0] || ''}"`)
        process.exit(1)
      }
      delete ajustes.proyectos[slug]
      guardarAjustes(ajustes)
      sincronizar({ silencioso: true })
      console.log(`Proyecto ${slug} eliminado`)
      break
    }

    case 'titulo': {
      const [id, ...resto] = args
      const titulo = resto.join(' ').trim()
      if (!id || !titulo) {
        console.error('Uso: npm run titulo -- <id> "<Título>"')
        process.exit(1)
      }
      validar([id], conocidos)
      ajustes.titulos[id] = titulo
      guardarAjustes(ajustes)
      sincronizar({ silencioso: true })
      console.log(`${id} ahora se llama "${titulo}"`)
      break
    }

    default:
      console.log(`Comandos:
  solo <id...>                          dejar visibles solo esas vistas
  todos                                 mostrar todas
  proyecto <slug> "<Nombre>" <id...>    crear/actualizar proyecto con enlace propio
  quitar-proyecto <slug>                borrar proyecto
  titulo <id> "<Título>"                renombrar una vista`)
      process.exit(comando ? 1 : 0)
  }
}

main()
