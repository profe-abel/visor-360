// Sincroniza los panoramas de origen/ con la web.
//
// - Lee los archivos de origen/
// - Genera la versión web optimizada en panoramas/ y la miniatura en miniaturas/
// - Escribe datos/vistas.json (lo que consume la interfaz)
// - Genera las páginas de proyecto en p/<slug>/index.html
//
// Uso: node scripts/sync.mjs
// También se importa desde scripts/ajustes.mjs

import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const DIR_ORIGEN = path.join(RAIZ, 'origen')
const DIR_PANOS = path.join(RAIZ, 'panoramas')
const DIR_MINI = path.join(RAIZ, 'miniaturas')
const DIR_DATOS = path.join(RAIZ, 'datos')
const DIR_PROYECTOS = path.join(RAIZ, 'p')

const ARCHIVO_VISTAS = path.join(DIR_DATOS, 'vistas.json')
const ARCHIVO_ESTADO = path.join(DIR_DATOS, 'estado.json')
const ARCHIVO_AJUSTES = path.join(DIR_DATOS, 'ajustes.json')

const EXTENSIONES = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MAX_ANCHO_WEB = 6144
const ANCHO_MINIATURA = 1280
const CALIDAD_PANO = 4
const CALIDAD_MINI = 5

// --- utilidades -----------------------------------------------------------

/** Convierte un nombre de archivo en un identificador para la URL. */
export function aSlug(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/gi, 'n')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "terreno_01" -> "Terreno 01" */
function tituloDesdeArchivo(nombre) {
  const sinExtension = path.parse(nombre).name
  return sinExtension
    .replace(/[_-]+/g, ' ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

function leerJson(archivo, porDefecto) {
  try {
    return JSON.parse(fs.readFileSync(archivo, 'utf8'))
  } catch {
    return porDefecto
  }
}

function escribirJson(archivo, datos) {
  fs.mkdirSync(path.dirname(archivo), { recursive: true })
  fs.writeFileSync(archivo, JSON.stringify(datos, null, 2) + '\n', 'utf8')
}

function hashArchivo(archivo) {
  return crypto.createHash('sha1').update(fs.readFileSync(archivo)).digest('hex')
}

function dimensiones(archivo) {
  const salida = execFileSync(
    'ffprobe',
    ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', archivo],
    { encoding: 'utf8' },
  ).trim()
  const [ancho, alto] = salida.split(',').map(Number)
  if (!ancho || !alto) throw new Error(`No pude leer las dimensiones de ${path.basename(archivo)}`)
  return { ancho, alto }
}

function redondearPar(valor) {
  return Math.max(2, Math.floor(valor / 2) * 2)
}

function convertir(origen, destino, anchoOrigen) {
  const escala = anchoOrigen > MAX_ANCHO_WEB
    ? `scale=${MAX_ANCHO_WEB}:-2:flags=lanczos`
    : 'scale=iw:-2:flags=lanczos'
  fs.mkdirSync(path.dirname(destino), { recursive: true })
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-i', origen,
    '-vf', escala,
    '-map_metadata', '-1',
    '-q:v', String(CALIDAD_PANO),
    '-pix_fmt', 'yuvj420p',
    destino,
  ])
}

/** Recorte central 16:9 del panorama, que se lee como una foto normal. */
function generarMiniatura(origen, destino, anchoOrigen, altoOrigen) {
  const anchoCorte = redondearPar(anchoOrigen * 0.5)
  const altoCorte = redondearPar((anchoCorte * 9) / 16)
  const filtro = [
    `crop=${anchoCorte}:${altoCorte}:(iw-${anchoCorte})/2:(ih-${altoCorte})/2`,
    `scale=${ANCHO_MINIATURA}:${redondearPar((ANCHO_MINIATURA * 9) / 16)}:flags=lanczos`,
  ].join(',')
  fs.mkdirSync(path.dirname(destino), { recursive: true })
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-i', origen,
    '-vf', filtro,
    '-map_metadata', '-1',
    '-q:v', String(CALIDAD_MINI),
    destino,
  ])
  if (altoOrigen < altoCorte) {
    console.warn(`  aviso: ${path.basename(origen)} es muy bajo para el recorte de miniatura`)
  }
}

// --- páginas de proyecto --------------------------------------------------

function paginaProyecto(slug, nombre) {
  return `<!DOCTYPE html>
<!-- Generado por scripts/sync.mjs. No editar a mano. -->
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex">
  <title>${escaparHtml(nombre)} · Recorrido 360°</title>
  <meta name="theme-color" content="#05070a">
  <link rel="manifest" href="../../manifest.webmanifest">
  <link rel="apple-touch-icon" href="../../assets/icono-180.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="${escaparHtml(nombre)}">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css">
  <link rel="stylesheet" href="../../assets/estilo.css">
  <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
</head>
<body data-modo="proyecto" data-proyecto="${escaparHtml(slug)}" data-base="../../">
  <div id="app"></div>
  <script type="module" src="../../assets/visor.js"></script>
</body>
</html>
`
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// --- proceso principal ----------------------------------------------------

export function sincronizar({ silencioso = false } = {}) {
  const log = (...args) => { if (!silencioso) console.log(...args) }

  if (!fs.existsSync(DIR_ORIGEN)) fs.mkdirSync(DIR_ORIGEN, { recursive: true })
  for (const dir of [DIR_PANOS, DIR_MINI, DIR_DATOS, DIR_PROYECTOS]) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const estado = leerJson(ARCHIVO_ESTADO, { version: 1, vistas: {} })
  estado.version = 1
  estado.vistas = estado.vistas || {}

  const ajustes = leerJson(ARCHIVO_AJUSTES, {})
  const titulos = ajustes.titulos || {}
  const descripciones = ajustes.descripciones || {}
  const ocultas = new Set(ajustes.ocultas || [])
  const proyectos = ajustes.proyectos || {}

  const archivos = fs
    .readdirSync(DIR_ORIGEN, { withFileTypes: true })
    .filter((d) => d.isFile() && EXTENSIONES.has(path.extname(d.name).toLowerCase()))
    .map((d) => d.name)
    .sort()

  const vistos = new Set()
  const vistas = []
  let generados = 0

  for (const nombre of archivos) {
    const rutaOrigen = path.join(DIR_ORIGEN, nombre)
    const id = aSlug(path.parse(nombre).name)

    if (!id) {
      console.warn(`  salteado: "${nombre}" no genera un nombre válido`)
      continue
    }
    if (vistos.has(id)) {
      console.warn(`  salteado: "${nombre}" choca con otro archivo (id "${id}")`)
      continue
    }
    vistos.add(id)

    const anterior = estado.vistas[id]
    const sha1 = hashArchivo(rutaOrigen)
    const stat = fs.statSync(rutaOrigen)
    const modificado = stat.mtime.toISOString()

    const rutaPano = path.join(DIR_PANOS, `${id}.jpg`)
    const rutaMini = path.join(DIR_MINI, `${id}.jpg`)

    let info = anterior
    const cambio = !anterior || anterior.sha1 !== sha1
    const faltanArchivos = !fs.existsSync(rutaPano) || !fs.existsSync(rutaMini)

    if (cambio || faltanArchivos) {
      const { ancho, alto } = dimensiones(rutaOrigen)
      log(`  procesando ${nombre} (${ancho}x${alto})`)
      convertir(rutaOrigen, rutaPano, ancho)
      generarMiniatura(rutaOrigen, rutaMini, ancho, alto)
      const anchoWeb = Math.min(ancho, MAX_ANCHO_WEB)
      info = {
        origen: nombre,
        sha1,
        agregado: anterior?.agregado || new Date().toISOString(),
        modificado,
        ancho: anchoWeb,
        alto: Math.round((alto * anchoWeb) / ancho),
      }
      generados += 1
    } else {
      info = { ...anterior, origen: nombre, modificado }
    }

    estado.vistas[id] = info

    const proyectoDe = Object.entries(proyectos).find(([, p]) => (p?.vistas || []).includes(id))

    vistas.push({
      id,
      titulo: titulos[id] || tituloDesdeArchivo(nombre),
      descripcion: descripciones[id] || '',
      proyecto: proyectoDe ? { slug: proyectoDe[0], nombre: proyectoDe[1]?.nombre || proyectoDe[0] } : null,
      archivo: `panoramas/${id}.jpg`,
      miniatura: `miniaturas/${id}.jpg`,
      ancho: info.ancho,
      alto: info.alto,
      tamano: fs.existsSync(rutaPano) ? fs.statSync(rutaPano).size : 0,
      agregado: info.agregado,
      modificado: info.modificado,
      oculto: ocultas.has(id),
    })
  }

  // Limpiar derivados de archivos que ya no están en origen/
  for (const id of Object.keys(estado.vistas)) {
    if (vistos.has(id)) continue
    for (const archivo of [path.join(DIR_PANOS, `${id}.jpg`), path.join(DIR_MINI, `${id}.jpg`)]) {
      if (fs.existsSync(archivo)) fs.unlinkSync(archivo)
    }
    delete estado.vistas[id]
    log(`  quitado ${id} (ya no está en origen/)`)
  }

  // Lo último cargado primero; a igualdad, el archivo más reciente
  vistas.sort((a, b) => {
    if (a.agregado !== b.agregado) return a.agregado < b.agregado ? 1 : -1
    if (a.modificado !== b.modificado) return a.modificado < b.modificado ? 1 : -1
    return a.id.localeCompare(b.id)
  })

  escribirJson(ARCHIVO_ESTADO, estado)
  escribirJson(ARCHIVO_VISTAS, {
    generado: new Date().toISOString(),
    total: vistas.length,
    vistas,
  })

  // Páginas de proyecto
  const slugsEsperados = new Set()
  for (const [slugBruto, proyecto] of Object.entries(proyectos)) {
    const slug = aSlug(slugBruto)
    const nombre = proyecto?.nombre || slug
    if (!slug) continue
    slugsEsperados.add(slug)
    const carpeta = path.join(DIR_PROYECTOS, slug)
    fs.mkdirSync(carpeta, { recursive: true })
    fs.writeFileSync(path.join(carpeta, 'index.html'), paginaProyecto(slug, nombre), 'utf8')
  }

  // Borrar páginas de proyectos que ya no existen
  if (fs.existsSync(DIR_PROYECTOS)) {
    for (const entrada of fs.readdirSync(DIR_PROYECTOS, { withFileTypes: true })) {
      if (!entrada.isDirectory()) continue
      if (slugsEsperados.has(entrada.name)) continue
      fs.rmSync(path.join(DIR_PROYECTOS, entrada.name), { recursive: true, force: true })
      log(`  quitada página de proyecto ${entrada.name}`)
    }
  }

  const ocultasVisibles = vistas.filter((v) => !v.oculto).length
  log(`\n${vistas.length} vista(s) en total · ${ocultasVisibles} visible(s) en el listado · ${generados} procesada(s)`)
  return vistas
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  sincronizar()
}
