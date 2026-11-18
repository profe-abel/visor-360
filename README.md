# Visor 360°

Galería y visor de panoramas 360° estáticos. Se publica en GitHub Pages y no necesita
backend ni build: los archivos se sirven tal cual.

- **Listado:** `/` → tarjetas con miniatura, buscador, lo último cargado primero.
- **Visor:** `/visor.html?v=<id>` → panorama a pantalla completa con tira de miniaturas.
- **Link de cliente:** `/p/<proyecto>/` → muestra únicamente las escenas de un proyecto.

## Requisitos

- Node.js 18+
- `ffmpeg` en el PATH (se usa para optimizar las imágenes y armar las miniaturas)

## Agregar panoramas

1. Copiá los archivos (JPG, PNG o WEBP, equirectangulares 2:1) a la carpeta `origen/`.
2. Corré:

   ```bash
   npm run sync
   ```

3. Mirá el resultado en `http://localhost:5173/`:

   ```bash
   npm run ver
   ```

`sync` hace todo lo demás:

- genera la versión web en `panoramas/` (máximo 6144 px de ancho, ~1–2 MB)
- genera la miniatura 16:9 en `miniaturas/`
- escribe `datos/vistas.json`, que es lo que lee la interfaz
- borra los derivados de archivos que ya no están en `origen/`

Los originales de `origen/` **no** se suben al repositorio (ver `.gitignore`).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run ver` | servidor local en `http://localhost:5173/` |
| `npm run sync` | procesa `origen/` y regenera el manifiesto |
| `npm run solo -- <id> [<id>…]` | deja visibles **solo** esas vistas en el listado |
| `npm run todos` | vuelve a mostrar todas |
| `npm run titulo -- <id> "Nuevo título"` | renombra una vista |
| `npm run proyecto -- <slug> "<Nombre>" <id> [<id>…]` | crea el link `/p/<slug>/` con esas escenas |
| `npm run quitar-proyecto -- <slug>` | elimina el link del proyecto |
| `npm run publicar` | sync + commit + push (GitHub Pages se actualiza solo) |

Los `id` son el nombre del archivo en minúsculas y sin extensión: `Panorama1.png` → `panorama1`.

## Link para un cliente

```bash
# 1) los dos panoramas tienen que estar en origen/ y sincronizados
npm run sync

# 2) agrupalos en un proyecto
npm run proyecto -- banio "Baño principal" banio-1 banio-2

# 3) publicá
npm run publicar
```

Queda en `https://<usuario>.github.io/visor-360/p/banio/` y muestra solo esas dos escenas,
sin acceso al resto de la galería. La página tiene `noindex`, pero **no es privada**:
cualquiera con el link la puede abrir.

Si además querés que el listado general muestre únicamente esas vistas:

```bash
npm run solo -- banio-1 banio-2
```

## Ajustes manuales

`datos/ajustes.json` (opcional, editable a mano; después corré `npm run sync`):

```json
{
  "titulos": { "panorama5": "Baño · Terminaciones" },
  "descripciones": { "panorama5": "Vista desde la puerta" },
  "ocultas": [],
  "proyectos": {
    "banio": { "nombre": "Baño principal", "vistas": ["panorama5", "panorama6"] }
  }
}
```

## Publicación en GitHub Pages

El repositorio ya está preparado (`main` / raíz, `.nojekyll`). Para republicar
después de cambiar archivos:

```bash
npm run publicar
```

GitHub Pages tarda 1–2 minutos en reflejar los cambios y el CDN puede cachear
unos 10 minutos más.

## Estructura

```
index.html            listado
visor.html            visor individual
assets/               CSS y JS del sitio
origen/               originales (ignorados por git)
panoramas/            panoramas web generados
miniaturas/           miniaturas generadas
datos/vistas.json     manifiesto generado
datos/estado.json     cache de hashes y fechas de alta
datos/ajustes.json    títulos, visibilidad y proyectos
p/<slug>/index.html   páginas de proyecto generadas
scripts/              sync, servidor, ajustes y publicación
```
