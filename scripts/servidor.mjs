// Servidor local para probar el sitio tal como lo entrega GitHub Pages.
// Uso: npm run ver

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUERTO = Number(process.env.PORT || process.argv[2] || 5173)

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const servidor = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  let ruta = path.join(RAIZ, url)

  if (!ruta.startsWith(RAIZ)) {
    res.writeHead(403).end('Prohibido')
    return
  }

  try {
    if (fs.existsSync(ruta) && fs.statSync(ruta).isDirectory()) {
      ruta = path.join(ruta, 'index.html')
    }
    if (!fs.existsSync(ruta)) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('No encontrado: ' + url)
      return
    }
    const contenido = fs.readFileSync(ruta)
    res.writeHead(200, {
      'content-type': TIPOS[path.extname(ruta).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store',
      'content-length': contenido.length,
    })
    res.end(contenido)
  } catch (error) {
    res.writeHead(500).end(String(error))
  }
})

servidor.listen(PUERTO, () => {
  console.log(`\n  Visor 360 en  http://localhost:${PUERTO}/\n`)
  console.log('  Ctrl+C para detener\n')
})
