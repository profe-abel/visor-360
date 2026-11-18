# Sistema de recorridos virtuales inmobiliarios 360°

## 1. Objetivo

Desarrollar una plataforma web propia para comercializar y presentar:

-   Casas y departamentos en venta o alquiler.
-   Loteamientos.
-   Barrios cerrados y residenciales.
-   Proyectos inmobiliarios futuros, con visualizaciones 360° generadas
    desde Lumion o D5.

La experiencia debe combinar fotografías convencionales, planos, mapas,
fichas comerciales y recorridos inmersivos 360°. El visitante podrá
explorar una propiedad desde el navegador, sin instalar aplicaciones.

La plataforma debe ser modular: el mismo motor de recorridos se
reutilizará en casas, lotes y residenciales, cambiando la estructura de
navegación y los datos asociados.

## 2. Experiencias principales

### A. Casa o departamento

Objetivo: reproducir una visita presencial mediante escenas 360°
conectadas.

Flujo típico:

1.  Vista desde la calle.
2.  Vereda / acceso.
3.  Puerta principal.
4.  Sala y comedor.
5.  Cocina.
6.  Circulaciones.
7.  Dormitorios y baños.
8.  Patio, quincho, balcón u otros espacios.

Funciones de interfaz:

-   Visor panorámico 360° con arrastre táctil y mouse.
-   Hotspots/flechas para pasar de una escena a otra.
-   Menú de escenas o miniaturas.
-   Plano de planta con indicador de la posición actual.
-   Galería de fotografías convencionales.
-   Ficha de la propiedad: precio, superficie, dormitorios, baños,
    ubicación y contacto.
-   Opción para salir del tour y volver a la ficha.

No todas las propiedades tendrán la misma cantidad de escenas. El
recorrido debe admitir escenas opcionales y conexiones no lineales.

### B. Loteamiento

Objetivo: que el interesado seleccione un lote en un plano y recorra
visualmente el terreno y su entorno, de forma similar a Street View.

Interfaz recomendada para escritorio:

-   Plano del loteamiento en un panel.
-   Visor 360° en el panel principal.
-   Ficha del lote seleccionado.
-   Controles para cambiar entre puntos de observación.

En móvil, usar una interfaz apilada: plano/ficha y visor en secciones o
pestañas, evitando reducir demasiado el panorama.

Flujo:

1.  El visitante abre el plano general.
2.  Selecciona un lote.
3.  Se resalta el polígono del lote.
4.  Se muestran los puntos 360° disponibles: frente, fondo y, si hace
    falta, puntos adicionales.
5.  Al elegir un punto, se abre la escena panorámica correspondiente.
6.  Los hotspots permiten avanzar a otros puntos o volver a la calle.
7.  La ficha muestra superficie, dimensiones, precio, estado y datos de
    contacto.

Importante: no es obligatorio crear dos panoramas para cada lote. Los
puntos pueden compartirse entre lotes vecinos cuando la ubicación y el
campo visual sean adecuados. La base debe permitir relaciones
muchos-a-muchos entre lotes y escenas.

Estados comerciales posibles: disponible, reservado, vendido,
bloqueado/no comercializable. El estado debe proceder de la base de
datos y reflejarse tanto en el plano como en la ficha.

### C. Barrio cerrado / residencial

Objetivo: ofrecer una visita virtual del conjunto.

Elementos:

-   Plano general o mapa del desarrollo.
-   Acceso, portería y calles internas.
-   Áreas verdes, plazas, amenities y espacios comunes.
-   Sectores de viviendas y lotes.
-   Escenas 360° conectadas por calles y recorridos.
-   Fichas de unidades o lotes disponibles.
-   Puntos de interés y enlaces a proyectos de viviendas.

El visitante debe poder navegar por el conjunto sin tener que entrar
primero a una unidad específica.

### D. Proyecto inmobiliario futuro

Para proyectos que todavía no existen físicamente, generar panoramas
360° desde Lumion o D5 Render.

Flujo de producción:

1.  Preparar el modelo y el entorno.
2.  Definir puntos de cámara y altura.
3.  Renderizar panoramas esféricos 360° equirectangulares.
4.  Exportar imágenes con resolución suficiente para visualización web.
5.  Incorporarlas como escenas en el mismo motor de recorridos.

Se puede ofrecer un selector "Situación actual / Proyecto futuro" cuando
existan panoramas reales y renders del mismo punto o sector.

No confundir una imagen panorámica renderizada con una captura
fotográfica del sitio: identificar claramente el contenido como
visualización del proyecto.

## 3. Captura de imágenes y equipamiento

### Prueba inicial con teléfonos existentes

Se dispone de un Xiaomi Redmi Note 14 Pro y un Samsung Galaxy A23
(modelo exacto por confirmar).

Los teléfonos sirven para probar el flujo de captura y la webapp, pero
una panorámica horizontal común no equivale a una esfera 360° completa.

Para generar una esfera con teléfono:

-   Usar una aplicación compatible con captura Photo Sphere / panorama
    esférico, si el dispositivo y la aplicación lo permiten.
-   Capturar una secuencia de imágenes superpuestas, incluyendo techo y
    suelo.
-   Mantener el punto de giro lo más cerca posible del centro óptico
    para reducir paralaje.
-   Evitar personas, vehículos y objetos en movimiento durante la
    secuencia.
-   Procesar las imágenes con software de stitching.
-   Revisar costuras, zonas faltantes, horizonte y orientación antes de
    publicar.

Esta modalidad es una prueba de concepto. No asumir que el teléfono
produce una esfera completa en una sola toma.

### Cámara 360° dedicada

Candidatas para evaluar:

-   Insta360 X4: alternativa de menor costo, adecuada para comenzar con
    recorridos exteriores e interiores bien iluminados.
-   Insta360 X5: opción preferente si se priorizan mejores resultados en
    interiores y condiciones de iluminación complejas.
-   DJI Osmo 360: alternativa a comparar por calidad fotográfica, video,
    flujo de trabajo, disponibilidad local y precio.

La elección final debe basarse en pruebas reales de fotografía fija
360°, no solamente en la resolución de video anunciada.

Accesorios recomendados:

-   Trípode compacto y estable.
-   Bastón invisible compatible.
-   MicroSD de alta velocidad y capacidad compatible con el fabricante.
-   Batería adicional.
-   Estuche y protección de lentes.

Antes de comprar en Paraguay o Ciudad del Este, confirmar stock,
garantía local, versión/combos, accesorios incluidos y precio final.

### Protocolo de captura

Para cada escena registrar:

-   Identificador de propiedad/desarrollo.
-   Identificador de escena.
-   Fecha y hora.
-   Coordenadas o posición dentro del plano.
-   Altura de cámara.
-   Orientación/azimut inicial.
-   Tipo de escena: interior, exterior, calle, amenity, lote, render.
-   Archivo panorámico original.
-   Observaciones sobre iluminación, clima y calidad.

En casas, mantener una altura de cámara coherente entre ambientes. En
loteamientos, definir puntos de captura en el plano y registrar su
posición con precisión suficiente para ubicarlos.

Para integrar modelos 3D en fotografías reales se necesita más que una
panorámica: registrar posición, altura, orientación, referencias
geométricas y condiciones de iluminación. La integración realista puede
requerir HDRI, mediciones, puntos de control y trabajo de
composición/render.

## 4. Arquitectura técnica propuesta

La arquitectura debe separar el motor panorámico, el modelo
inmobiliario, la administración de contenido y la interfaz comercial.

### Stack inicial sugerido

-   Frontend: React + Vite + TypeScript.
-   Visor 360°: evaluar Pannellum y Photo Sphere Viewer mediante un
    prototipo comparativo.
-   Mapas y planos: SVG interactivo para planos parcelarios; Leaflet o
    MapLibre para mapas geográficos cuando corresponda.
-   Backend/API: mantener el stack existente si ya hay una aplicación;
    si se inicia desde cero, elegir una API REST tipada y modular.
-   Base de datos: PostgreSQL. PostGIS si se requieren consultas
    geográficas, geometrías y mapas.
-   Archivos: almacenamiento de objetos compatible con S3 o Firebase
    Storage, según infraestructura disponible.
-   Autenticación: roles de administrador, editor/comercial y visitante.
-   Despliegue: hosting estático para frontend, API y base de datos
    administradas, almacenamiento externo de panoramas.

No adoptar todas las tecnologías sin revisar primero el repositorio y la
infraestructura actual. Codex debe inspeccionar el proyecto existente y
proponer la integración menos disruptiva.

### Módulos

1.  **Catálogo inmobiliario:** propiedades, desarrollos y proyectos.
2.  **Inventario de lotes/unidades:** geometrías, medidas, precios y
    estados.
3.  **Gestor de escenas:** carga de panoramas, metadatos y publicación.
4.  **Motor de tours:** escenas, enlaces, hotspots y navegación.
5.  **Planos y mapas:** selección de lotes y ubicación de escenas.
6.  **Fichas comerciales:** fotos, características, precio y contacto.
7.  **Panel administrativo:** crear y editar propiedades, lotes, escenas
    y recorridos.
8.  **Analítica básica:** visitas, escenas más vistas, lotes consultados
    y clics de contacto.

## 5. Modelo de datos conceptual

Diseñar un esquema relacional flexible. Entidades iniciales:

### Development / Desarrollo

-   id
-   name
-   slug
-   type: subdivision, gated_community, building, project
-   description
-   address
-   latitude / longitude
-   cover_image
-   status
-   published_at

### Property / Unidad inmobiliaria

Para casas, departamentos u otras unidades comercializables:

-   id
-   development_id (nullable)
-   title
-   type
-   description
-   price
-   currency
-   area_land
-   area_built
-   bedrooms
-   bathrooms
-   status
-   address

### Parcel / Lote

-   id
-   development_id
-   parcel_code
-   block_code
-   area
-   frontage
-   depth
-   price
-   currency
-   status
-   geometry (polígono, si se usa PostGIS; o geometría SVG/GeoJSON)
-   notes

### Scene / Escena panorámica

-   id
-   development_id
-   property_id (nullable)
-   title
-   scene_type
-   panorama_url
-   thumbnail_url
-   position_x / position_y (coordenadas locales del plano, si aplica)
-   latitude / longitude (nullable)
-   camera_height
-   initial_yaw
-   initial_pitch
-   is_published
-   sort_order

### Scene connection / Conexión entre escenas

-   id
-   source_scene_id
-   target_scene_id
-   label
-   hotspot_yaw
-   hotspot_pitch
-   icon/type
-   sort_order

### Scene--Parcel relation / Relación escena-lote

-   scene_id
-   parcel_id
-   viewpoint_role: front, rear, street, shared, other

Permite que una escena sea visible desde más de un lote cuando
corresponda.

### Hotspot

Si se requiere mayor flexibilidad, modelar hotspots por separado:

-   id
-   scene_id
-   type: scene_link, info, external_link, parcel, contact
-   yaw
-   pitch
-   label
-   target_scene_id (nullable)
-   target_entity_id (nullable)
-   content/config JSON

### Media

-   id
-   entity_type
-   entity_id
-   media_type: photo, panorama, floorplan, render, video
-   file_url
-   thumbnail_url
-   alt_text
-   sort_order

Este modelo es conceptual; ajustar nombres, relaciones y tipos al
estándar del repositorio.

## 6. Motor de recorridos 360°

Requisitos funcionales:

-   Cargar panoramas equirectangulares 2:1.
-   Soportar mouse, teclado y gestos táctiles.
-   Zoom y control de orientación.
-   Hotspots configurables.
-   Cambio entre escenas sin perder el contexto.
-   Menú/lista de escenas.
-   Pantalla completa.
-   Indicador de carga y manejo de errores.
-   Adaptación a escritorio, tablet y móvil.
-   Imágenes optimizadas y carga diferida de escenas no visitadas.
-   Posibilidad de establecer una escena inicial y una orientación
    inicial.

No codificar el motor desde cero en la primera etapa. Integrar una
biblioteca probada y construir alrededor la experiencia propia.

## 7. Interfaz por tipo de desarrollo

### Casa

Escritorio: - Visor principal. - Menú de ambientes. - Plano de planta
lateral. - Ficha y contacto.

Móvil: - Visor a pantalla amplia. - Botón de escenas. - Acceso a plano y
ficha mediante paneles desplegables.

### Loteamiento

Escritorio: - Plano parcelario interactivo. - Visor 360°. - Ficha del
lote. - Selector frente/fondo y escenas cercanas.

Móvil: - Plano con selección de lote. - Botón "Ver recorrido". - Visor a
pantalla completa. - Ficha accesible sin perder la selección.

### Residencial

-   Mapa/plano general.
-   Categorías de puntos de interés.
-   Navegación por escenas conectadas.
-   Acceso a lotes, viviendas y amenities.

## 8. Administración y flujo de publicación

El panel administrativo debe permitir:

1.  Crear un desarrollo o propiedad.
2.  Cargar plano, mapa y fotografías.
3.  Crear lotes/unidades y definir sus estados.
4.  Cargar panoramas 360°.
5.  Ubicar cada escena en el plano.
6.  Definir orientación inicial y altura de cámara.
7.  Crear hotspots conectando escenas.
8.  Asociar escenas con lotes.
9.  Previsualizar el tour.
10. Publicar o despublicar.

La edición de hotspots debería ser visual: abrir el panorama, hacer clic
en la posición deseada y configurar el destino, evitando editar
coordenadas manualmente.

## 9. Rendimiento, almacenamiento y calidad

Las panorámicas 360° pueden ser archivos pesados. Prever:

-   Conservar el original en alta calidad.
-   Generar versiones web optimizadas.
-   Usar tiles/panoramas multirresolución si el tamaño y la cantidad de
    escenas lo justifican.
-   Cargar inicialmente solo la escena activa.
-   Generar miniaturas.
-   CDN o almacenamiento de objetos para distribución.
-   Validar formato, dimensiones y relación de aspecto al cargar.
-   Definir límites de tamaño y mensajes de error.
-   No almacenar imágenes pesadas directamente en la base de datos.

Para la primera versión, comenzar con JPEG equirectangular optimizado.
Escalar a multirresolución cuando las pruebas de rendimiento lo
justifiquen.

## 10. Seguridad y control comercial

-   El visitante público solo debe consultar contenido publicado.
-   El panel administrativo requiere autenticación y permisos.
-   Validar archivos cargados y sus tipos.
-   No exponer claves privadas en frontend.
-   Mantener historial básico de cambios de precio y estado de lotes.
-   El estado comercial debe tener una única fuente de verdad.
-   Un lote vendido o reservado debe actualizarse en el plano, la ficha
    y cualquier listado.

## 11. Plan de implementación por etapas

### Etapa 0 --- Auditoría técnica

Antes de modificar código:

-   Inspeccionar estructura, dependencias y scripts del repositorio.
-   Identificar framework, backend, base de datos, autenticación y
    almacenamiento existentes.
-   Revisar convenciones y componentes reutilizables.
-   Informar riesgos y proponer arquitectura compatible.
-   No reemplazar tecnologías existentes sin justificación.

### Etapa 1 --- MVP de una casa

Construir un tour funcional con escenas de prueba:

-   5--8 panoramas de ejemplo.
-   Visor 360°.
-   Hotspots entre escenas.
-   Menú de ambientes.
-   Ficha de propiedad.
-   Galería de fotos.
-   Diseño responsive.

Si todavía no hay panoramas reales, usar imágenes de prueba claramente
identificadas y dejar preparado el reemplazo.

### Etapa 2 --- Panel de administración de tours

-   CRUD de escenas.
-   Carga de panoramas.
-   Posición y orientación.
-   Editor visual de hotspots.
-   Previsualización y publicación.

### Etapa 3 --- Loteamiento

-   Plano interactivo.
-   Selección y resaltado de lotes.
-   Ficha comercial.
-   Asociación de escenas compartidas.
-   Puntos frente/fondo.
-   Sincronización del estado comercial.

### Etapa 4 --- Residenciales

-   Mapa general.
-   Categorías y puntos de interés.
-   Navegación por calles y amenities.
-   Acceso a unidades y lotes.

### Etapa 5 --- Proyectos 3D y visualizaciones futuras

-   Importar panoramas renderizados desde Lumion/D5.
-   Distinguir render de fotografía real.
-   Alternar estado actual y futuro.
-   Estudiar integración de modelos 3D interactivos solo si aporta valor
    y el rendimiento es aceptable.

## 12. Criterios de aceptación del MVP

El MVP de una casa se considera funcional cuando:

-   Abre correctamente en Chrome de escritorio y navegadores móviles.
-   El usuario puede mirar alrededor con mouse o tacto.
-   Puede pasar entre escenas mediante hotspots.
-   Puede elegir un ambiente desde el menú.
-   El plano indica la escena actual.
-   La ficha de la propiedad permanece accesible.
-   Las imágenes cargan sin bloquear toda la interfaz.
-   Los errores de carga se muestran de forma comprensible.
-   El administrador puede modificar escenas y conexiones sin editar
    código.

## 13. Instrucciones iniciales para Codex

Trabajar sobre el repositorio existente. No comenzar reescribiendo la
aplicación.

Primera tarea solicitada a Codex:

1.  Auditar el repositorio y resumir stack, estructura, módulos,
    persistencia y despliegue.
2.  Identificar qué componentes existentes se pueden reutilizar.
3.  Proponer un plan técnico para implementar primero el MVP de una casa
    con recorrido 360°.
4.  Comparar brevemente Pannellum y Photo Sphere Viewer según
    integración, mantenimiento, hotspots, compatibilidad móvil y
    necesidades del proyecto.
5.  Definir el modelo de datos mínimo sin sobredimensionarlo.
6.  Presentar los archivos que se modificarían y el orden de trabajo.
7.  Esperar aprobación antes de hacer cambios estructurales o instalar
    dependencias importantes.

Luego implementar por incrementos pequeños, probar cada etapa y
documentar cómo cargar panoramas y crear un recorrido.

## 14. Decisiones que conviene mantener

-   Construir un motor reutilizable para casas, loteamientos y
    residenciales.
-   Empezar por una casa real como prueba de concepto.
-   Usar escenas 360° conectadas, no una colección aislada de imágenes.
-   Permitir que escenas se compartan entre lotes.
-   Mantener plano/inventario y recorrido sincronizados.
-   Separar fotografías reales de renders de proyectos futuros.
-   Priorizar tecnologías web abiertas y evitar costos recurrentes por
    propiedad cuando sea posible.
-   Comprar la cámara dedicada después de validar el flujo con una
    prueba inicial.

## 15. Resultado esperado

Una plataforma inmobiliaria donde cada desarrollo tenga una experiencia
digital propia: el usuario consulta información, selecciona una
propiedad o lote en el plano y recorre visualmente el lugar mediante
panoramas 360° conectados. El sistema debe poder crecer desde una casa
individual hasta loteamientos y barrios cerrados, y admitir panoramas
renderizados de proyectos que todavía no fueron construidos.
