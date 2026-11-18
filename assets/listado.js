// Listado de panoramas.

const grilla = document.getElementById('grilla')
const aviso = document.getElementById('aviso')
const conteo = document.getElementById('conteo')
const buscar = document.getElementById('buscar')

let vistas = []

function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function peso(bytes) {
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1).replace('.', ',')} MB` : `${Math.round(bytes / 1024)} KB`
}

function fecha(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-PY', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

function mostrarAviso(titulo, html) {
  aviso.innerHTML = `<strong>${titulo}</strong>${html}`
  aviso.classList.remove('oculto')
  grilla.innerHTML = ''
}

function tarjeta(vista) {
  const enlace = document.createElement('a')
  enlace.className = 'tarjeta'
  enlace.href = `visor.html?v=${encodeURIComponent(vista.id)}`
  enlace.setAttribute('aria-label', `Abrir ${vista.titulo} en 360°`)

  const media = document.createElement('div')
  media.className = 'tarjeta__media'

  const img = document.createElement('img')
  img.src = vista.miniatura
  img.alt = vista.titulo
  img.loading = 'lazy'
  img.decoding = 'async'
  media.appendChild(img)

  const sello = document.createElement('span')
  sello.className = 'etiqueta-360'
  sello.textContent = '360°'
  media.appendChild(sello)

  if (vista.proyecto) {
    const chip = document.createElement('span')
    chip.className = 'etiqueta-proyecto'
    chip.textContent = vista.proyecto.nombre
    media.appendChild(chip)
  }

  const cuerpo = document.createElement('div')
  cuerpo.className = 'tarjeta__cuerpo'

  const titulo = document.createElement('h2')
  titulo.className = 'tarjeta__titulo'
  titulo.textContent = vista.titulo
  cuerpo.appendChild(titulo)

  const meta = document.createElement('p')
  meta.className = 'tarjeta__meta'
  const partes = [`${vista.ancho} × ${vista.alto} px`]
  if (vista.tamano) partes.push(peso(vista.tamano))
  const dia = fecha(vista.agregado)
  if (dia) partes.push(dia)
  meta.textContent = partes.join(' · ')
  cuerpo.appendChild(meta)

  enlace.append(media, cuerpo)
  return enlace
}

function pintar(filtro = '') {
  const busqueda = normalizar(filtro.trim())
  const lista = vistas.filter((vista) => {
    if (!busqueda) return true
    const texto = normalizar([vista.titulo, vista.descripcion, vista.proyecto?.nombre].filter(Boolean).join(' '))
    return texto.includes(busqueda)
  })

  grilla.innerHTML = ''
  conteo.textContent = lista.length === vistas.length
    ? `${vistas.length} panorama${vistas.length === 1 ? '' : 's'}`
    : `${lista.length} de ${vistas.length}`

  if (!lista.length) {
    mostrarAviso('Sin resultados', '<p>Probá con otro nombre.</p>')
    return
  }

  aviso.classList.add('oculto')
  const fragmento = document.createDocumentFragment()
  for (const vista of lista) fragmento.appendChild(tarjeta(vista))
  grilla.appendChild(fragmento)
}

async function iniciar() {
  try {
    const respuesta = await fetch('datos/vistas.json', { cache: 'no-cache' })
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
    const datos = await respuesta.json()
    vistas = (datos.vistas || []).filter((vista) => !vista.oculto)
  } catch (error) {
    mostrarAviso(
      'No pude cargar el listado',
      `<p>Falta <code>datos/vistas.json</code> o el sitio no está sirviéndose desde la raíz del proyecto.</p>
       <p>En tu computadora: poné los panoramas en <code>origen/</code> y corré <code>npm run sync</code>.</p>
       <p style="opacity:.6">${String(error.message || error)}</p>`,
    )
    return
  }

  if (!vistas.length) {
    mostrarAviso(
      'Todavía no hay panoramas',
      `<p>Copiá tus imágenes 360° a la carpeta <code>origen/</code> y ejecutá <code>npm run sync</code>.</p>`,
    )
    return
  }

  pintar()
  buscar.addEventListener('input', () => pintar(buscar.value))
}

iniciar()
