// Visor 360°. Funciona en dos modos:
//   - "vista":    abre un panorama pedido con ?v=<id> y permite pasar entre las vistas visibles
//   - "proyecto": abre todas las escenas de un proyecto (páginas p/<slug>/)

const cuerpo = document.body
const base = cuerpo.dataset.base || './'
const modo = cuerpo.dataset.modo || 'vista'
const slugProyecto = cuerpo.dataset.proyecto || ''
const pedido = new URLSearchParams(location.search).get('v')

const app = document.getElementById('app')

let viewer = null
let lista = []
let indice = 0

// --- plantillas ------------------------------------------------------------

function capaCarga(mensaje) {
  return `<div class="capa" id="capa">
    <div class="spinner"></div>
    <p>${mensaje}</p>
  </div>`
}

function capaError(titulo, detalle, conVolver) {
  const volver = conVolver
    ? `<a href="${base}index.html">Volver al listado</a>`
    : ''
  return `<div class="capa" id="capa">
    <strong>${titulo}</strong>
    <p>${detalle}</p>
    ${volver}
  </div>`
}

function iconoVolver() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>`
}

function iconoFlecha(direccion) {
  const d = direccion > 0 ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`
}

function vistaInicial() {
  if (!pedido) return 0
  const i = lista.findIndex((v) => v.id === pedido)
  return i >= 0 ? i : 0
}

// --- interfaz --------------------------------------------------------------

function montar(extra) {
  // Si el ?v= pedido está oculto en el listado, igual lo abrimos
  if (pedido && !lista.some((v) => v.id === pedido) && extra?.length) {
    const encontrada = extra.find((v) => v.id === pedido)
    if (encontrada) lista = [encontrada, ...lista]
  }

  indice = vistaInicial()

  const hayVarias = lista.length > 1

  app.innerHTML = `
    <div id="panorama"></div>

    <div class="barra">
      ${modo === 'vista' ? `<a class="boton-volver" href="${base}index.html" aria-label="Volver al listado" title="Volver al listado">${iconoVolver()}</a>` : ''}
      <div class="barra__textos">
        <h1 class="barra__titulo" id="barra-titulo"></h1>
        <p class="barra__sub" id="barra-sub"></p>
      </div>
      ${hayVarias ? `<span class="barra__contador" id="contador"></span>` : ''}
    </div>

    ${hayVarias ? `
      <button class="nav-flecha nav-flecha--izq" id="anterior" type="button" aria-label="Panorama anterior">${iconoFlecha(-1)}</button>
      <button class="nav-flecha nav-flecha--der" id="siguiente" type="button" aria-label="Panorama siguiente">${iconoFlecha(1)}</button>
      <nav class="tira" id="tira" aria-label="Panoramas"></nav>
    ` : ''}

    ${capaCarga('Cargando panorama…')}
  `

  const tira = document.getElementById('tira')
  if (tira) {
    for (const vista of lista) {
      const boton = document.createElement('button')
      boton.type = 'button'
      boton.className = 'tira__item'
      boton.dataset.id = vista.id
      boton.title = vista.titulo
      boton.innerHTML = `<img src="${base}${vista.miniatura}" alt="" loading="lazy" decoding="async"><span>${escapar(vista.titulo)}</span>`
      boton.addEventListener('click', () => irA(vista.id))
      tira.appendChild(boton)
    }
  }

  document.getElementById('anterior')?.addEventListener('click', () => mover(-1))
  document.getElementById('siguiente')?.addEventListener('click', () => mover(1))
}

function escapar(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function titulos(id) {
  const vista = lista.find((v) => v.id === id) || lista[0]
  const principal = document.getElementById('barra-titulo')
  const secundario = document.getElementById('barra-sub')
  if (!principal) return

  if (modo === 'proyecto') {
    const proyecto = vista?.proyecto?.nombre || ''
    principal.textContent = proyecto || vista?.titulo || ''
    secundario.textContent = vista?.titulo || ''
  } else {
    principal.textContent = vista?.titulo || ''
    secundario.textContent = vista?.proyecto?.nombre || 'Vista 360°'
  }
  document.title = `${vista?.titulo || 'Visor 360°'} · Visor 360°`
}

function marcarActiva(id) {
  const posicion = lista.findIndex((v) => v.id === id)
  if (posicion >= 0) indice = posicion

  document.querySelectorAll('.tira__item').forEach((item) => {
    item.classList.toggle('activa', item.dataset.id === id)
  })

  const contador = document.getElementById('contador')
  if (contador) contador.textContent = `${indice + 1} / ${lista.length}`

  const activo = document.querySelector('.tira__item.activa')
  activo?.scrollIntoView({ inline: 'center', block: 'nearest' })

  if (modo === 'vista' && id) {
    const url = `${location.pathname}?v=${encodeURIComponent(id)}`
    history.replaceState(null, '', url)
  }
}

function irA(id) {
  if (!viewer || !id) return
  if (lista[indice]?.id === id) return
  viewer.loadScene(id)
}

function mover(paso) {
  if (lista.length < 2) return
  const destino = (indice + paso + lista.length) % lista.length
  irA(lista[destino].id)
}

// --- arranque --------------------------------------------------------------

async function iniciar() {
  app.innerHTML = capaCarga('Cargando…')

  let datos
  try {
    const respuesta = await fetch(`${base}datos/vistas.json`, { cache: 'no-cache' })
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
    datos = await respuesta.json()
  } catch (error) {
    app.innerHTML = capaError(
      'No pude cargar los datos',
      `No se encontró <code>datos/vistas.json</code>. Corré <code>npm run sync</code> en el proyecto.`,
      modo === 'vista',
    )
    return
  }

  const todas = datos.vistas || []
  if (modo === 'proyecto') {
    lista = todas.filter((v) => v.proyecto?.slug === slugProyecto)
    if (!lista.length) {
      app.innerHTML = capaError(
        'Este proyecto no tiene panoramas',
        `Agregá las vistas al proyecto <code>${escapar(slugProyecto)}</code> y volvé a publicar.`,
        true,
      )
      return
    }
  } else {
    lista = todas.filter((v) => !v.oculto)
    if (!lista.length) {
      app.innerHTML = capaError('No hay panoramas visibles', 'Corré <code>npm run sync</code> después de agregar imágenes a <code>origen/</code>.', true)
      return
    }
  }

  montar(todas)

  if (typeof pannellum === 'undefined') {
    app.innerHTML = capaError(
      'No se pudo cargar el visor',
      'La librería 360° (Pannellum) no está disponible. Revisá la conexión e intentá de nuevo.',
      modo === 'vista',
    )
    return
  }

  const escenas = {}
  for (const vista of lista) {
    escenas[vista.id] = {
      type: 'equirectangular',
      panorama: `${base}${vista.archivo}`,
      hfov: 100,
      autoRotate: -1.2,
      autoRotateInactivityDelay: 5000,
    }
  }

  try {
    viewer = pannellum.viewer('panorama', {
      default: {
        firstScene: lista[indice].id,
        sceneFadeDuration: 600,
        autoLoad: true,
      },
      scenes: escenas,
      showZoomCtrl: window.matchMedia('(pointer: fine)').matches,
      showFullscreenCtrl: true,
      compass: false,
      backgroundColor: [5, 7, 10],
    })
  } catch (error) {
    app.innerHTML = capaError('No pude iniciar el visor', escapar(error.message || 'Error desconocido'), modo === 'vista')
    return
  }

  viewer.on('load', () => {
    document.getElementById('capa')?.classList.add('oculto')
  })

  viewer.on('scenechange', (id) => {
    titulos(id)
    marcarActiva(id)
  })

  viewer.on('error', (mensaje) => {
    const capa = document.getElementById('capa')
    const detalle = escapar(mensaje || 'Revisá que el archivo exista en panoramas/.')
    if (!capa) {
      app.insertAdjacentHTML('beforeend', capaError('No pude abrir la imagen', detalle, modo === 'vista'))
      return
    }
    capa.innerHTML = `<strong>No pude abrir la imagen</strong><p>${detalle}</p>`
    capa.classList.remove('oculto')
  })

  titulos(lista[indice].id)
  marcarActiva(lista[indice].id)

  // Teclado: n / p y Re Pág / Av Pág (las flechas las usa el visor para mirar)
  addEventListener('keydown', (evento) => {
    if (evento.target instanceof HTMLInputElement) return
    if (evento.key === 'n' || evento.key === 'PageDown') mover(1)
    if (evento.key === 'p' || evento.key === 'PageUp') mover(-1)
  })
}

iniciar()
