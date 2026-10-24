# STRYV Product UI System · Componentes

Base: estándar visual de CuboPolar. Tokens en
[product-ui-tokens.md](product-ui-tokens.md).

Este documento describe **especificaciones**, no código. Cada producto
implementa sus primitivas en su propio stack. No se copian componentes
funcionales de CuboPolar.

- **[OBLIGATORIA]** Una primitiva por pieza; nada "a mano" en las vistas.
- **[OBLIGATORIA]** Las vistas no escriben colores de utilidad
  (`bg-blue-600`, `bg-green-600`…); usan la primitiva o el token.

---

## 1. Shell

### 1.1 Cabecera

| Propiedad | Valor | Clase |
|---|---|---|
| Comportamiento | Pegajosa (`sticky`) | **[OBLIGATORIA]** |
| Fondo | Blanco o lienzo al 90 % con blur | **[OBLIGATORIA]** |
| Alto móvil | 56 px (+ `env(safe-area-inset-top)`) | **[OBLIGATORIA]** |
| Alto escritorio | 64 px | **[OBLIGATORIA]** |
| Izquierda | Botón de menú y título de la pantalla (completo, truncado) | **[OBLIGATORIA]** |
| Derecha | Sólo lo imprescindible: búsqueda (en back office) y UNA campana de avisos con contador rojo "9+" | **[ADAPTABLE]** la búsqueda depende del producto; la campana es única |

- **[OBLIGATORIA]** El título de la pantalla vive SOLO en la cabecera. La vista
  no lo repite.
- Excepción documentada: la cabecera es el único elemento con translucidez y
  blur. El contenido nunca lo es.

### 1.2 Menú lateral (escritorio) y drawer (móvil)

| Propiedad | Valor | Clase |
|---|---|---|
| Ancho del menú lateral | 300–320 px | **[ADAPTABLE]** dentro del rango |
| Fondo | Marca oscura (`--brand-dark`; degradado de marca). En STRYV: `#07131A` sólido mientras el degradado siga sin definir | **[PRODUCTO]** el color; **[OBLIGATORIA]** que menú y drawer usen la MISMA marca |
| Íconos | Sí, en cada destino | **[OBLIGATORIA]** |
| Áreas | Plegables | **[OBLIGATORIA]** |
| Sección "Mi espacio" | Lo personal: mi asistencia, mi cuenta, mis actividades | **[ADAPTABLE]** el contenido depende de los módulos del producto |

### 1.3 Barra inferior móvil

| Propiedad | Valor | Clase |
|---|---|---|
| Fondo | La misma marca oscura del menú | **[OBLIGATORIA]** |
| Destinos | 4–5 + "Más" | **[OBLIGATORIA]** |
| Alto | 56 px (+ `env(safe-area-inset-bottom)`) | **[OBLIGATORIA]** |
| Estado activo | Píldora de acento suave (`--brand-accent-soft`, acento al 10 %) sobre el icono; el icono y la etiqueta también cambian de color | **[OBLIGATORIA]** (condiciones de contraste en [brand-tokens.md §4](brand-tokens.md#4-derivados-del-acento)) |
| Escritorio | Se oculta | **[OBLIGATORIA]** |

### 1.4 Bienvenida

- **[OBLIGATORIA]** En la pantalla de inicio de cada rol: "Buenos días / tardes /
  noches, <nombre>", calculado con la hora del negocio (no la del dispositivo).
- Tipografía: Display 28/32.

### 1.5 Avisos globales

- **[OBLIGATORIA]** Sin banners globales permanentes (modo prueba, avisos). El
  aviso vive dentro del módulo al que aplica.

### 1.6 Login

| Elemento | Especificación |
|---|---|
| Fondo | Marca oscura (`--brand-dark`; en STRYV `#07131A`) |
| Logo | En caja redondeada (radio 26 px) con borde blanco al 10 % |
| Texto | Kicker, "Bienvenido", frase de una línea |
| Campos | 52 px de alto, sobre blanco al 7 % |
| Botón | De acento, 52 px |
| Pie | Nombre del sistema y ciudad |

- **[OBLIGATORIA]** La estructura.
- **[PRODUCTO]** Marca oscura, logo, frase, nombre del sistema y ciudad.
- Excepción documentada: el login es el único lugar donde el botón principal es
  de acento y no de tinta.

---

## 2. Componentes canónicos

### PageHeader

- Trae sólo acciones (y el subtítulo en escritorio). No repite el título.
- Acción principal: botón tinta de 44 px con icono "+".
- **[OBLIGATORIA]** Nunca `bg-blue-600` / `bg-green-600` escritos en una vista.

### KpiTile

| Propiedad | Valor |
|---|---|
| Disposición | `grid` de 2 columnas (3 sólo si caben) |
| Etiqueta | 11 px, MAYÚSCULAS |
| Cifra | 24 px, tabular |
| Pista | 12 px |
| Tonos | `success` / `warning` / `danger` tintados; `accent` = fondo tinta con texto blanco |

- **[OBLIGATORIA]** Todo lo anterior.
- Nota: el tono "accent" del KpiTile usa la **tinta**, no el color de marca.
- Radio y padding del KpiTile: **sin definir** (la fuente no los fija).

### SegmentedTabs (≤ 4 opciones)

| Propiedad | Valor |
|---|---|
| Pista | Gris `rgba(11,18,32,.06)`, radio 14 |
| Activa | Píldora blanca con sombra mínima |
| ARIA | `role="tablist"` / `role="tab"`, `aria-selected` |

### Chips (más de 4 filtros)

| Propiedad | Valor |
|---|---|
| Comportamiento | Desplazables en horizontal |
| Activo | Tinta con texto blanco |
| Inactivo | Blanco con línea |
| Contador | Dentro de la píldora |

- **[OBLIGATORIA]** Nunca pestañas subrayadas ni píldoras de colores distintos.

### Card

| Tono | Especificación |
|---|---|
| Por defecto | Blanca, línea `#E6EAF0`, `--shadow-card`, radio 20 |
| `success` / `warning` / `danger` | Tintados (fondo `-50`, borde `-100`, texto `-800`) |
| `dark` | Con la marca oscura |

- `padding=0` cuando contiene ListRows.
- Padding por defecto: **sin definir** (la fuente no lo fija).

### ListRow

| Parte | Especificación |
|---|---|
| Inicio | Icono en cuadro gris de 40 px (radio 12) o avatar con inicial en círculo de acento suave (`--brand-accent-soft`; inicial en tinta, o en acento sólo si es texto grande) |
| Título | 15 px semibold |
| Subtítulo | 13 px, gris (texto secundario) |
| Fin | Valor tabular a la derecha |
| Extras | Badge y chevron, sólo si la fila navega |
| Contenedor | Dentro de `Card padding=0` |

- **[OBLIGATORIA]** Máximo dos niveles de texto por fila (título y subtítulo).

### StatusBadge

- Píldora de 11 px semibold, tintada, con borde.
- **[OBLIGATORIA]** Un mapa único estado → color en todo el sistema.
- **[PRODUCTO]** Los estados concretos del negocio.

### SectionLabel

- Una por bloque. Es el kicker (11 px, semibold, MAYÚSCULAS, 0.08em, texto
  secundario).
- **[OBLIGATORIA]** No `h2` sueltos.

### FormInput / FormSelect / FormTextarea

| Propiedad | Valor |
|---|---|
| Etiqueta | 13 px, medium (500) |
| Alto del campo | 48 px |
| Radio | 14 px |
| Fondo en reposo | slate-50 `#F8FAFC` |
| Fondo al enfocar | Blanco |
| Borde | Línea `#E6EAF0` |
| Anillo de foco | Acento al 15 % |
| Error | Borde red-300 + texto rojo de 12 px bajo el campo |
| Pista | Gris de 12 px cuando no hay error |
| `select` | Sin flecha nativa; flecha SVG propia |
| Tamaño de texto en móvil | ≥ 16 px |

### FormBtn

| Variante | Especificación |
|---|---|
| `primary` | Tinta, `--shadow-primary` |
| `success` | Sólido de éxito, texto blanco |
| `danger` | Sólido de peligro, texto blanco |
| `warning` | Aviso (la fuente no fija si es sólido o tintado: **sin definir**) |
| `ghost` | Gris |
| `default` | Blanco con línea |

| Tamaño | Alto | Radio |
|---|---|---|
| Normal | 44 px | 14 px |
| `lg` | 52 px | 16 px |

- `loading` muestra spinner + "Guardando...".
- `active: scale(0.985)`; transiciones de 160 ms.

### IconButton

| Propiedad | Valor |
|---|---|
| Tamaño | 40 px, con área táctil de 44 px |
| Radio | 12 px |
| Tonos | `neutral` / `danger` / `accent` |
| Accesibilidad | Siempre con `aria-label` y `title` |

### ChoiceButton

- 48 px, en rejilla de 2 columnas, para pickers operativos (producto, método de
  pago, causa, turno).
- Borde de 2 px permitido (opción seleccionable). Las opciones no activas usan
  la línea fuerte `#D6DCE5`.
- ARIA: `aria-pressed`.
- **[OBLIGATORIA]** Nunca `<select>` para elegir entre pocas opciones operativas.

### Modal = BottomSheet en móvil / diálogo en escritorio

| Propiedad | Móvil (hoja inferior) | Escritorio (diálogo centrado) |
|---|---|---|
| Radio | 28 px arriba | 28 px |
| Asa | Gris, 40 × 6 px | — |
| Altura máxima | 92dvh | 85vh |
| Entrada | Sube 24 px en 260 ms | `scale .96 → 1` en 180 ms (menú/panel) |
| Sombra | `--shadow-sheet` | `--shadow-pop` |

| Comportamiento | Especificación |
|---|---|
| Encabezado | Pegajoso; título de 17 px bold |
| Pie | Pegajoso; lleva los botones; respeta `env(safe-area-inset-bottom)` |
| Cuerpo | Hace scroll con `overscroll-behavior: contain` |
| Body | Se bloquea su scroll mientras el modal está abierto |
| Cierre | Escape y clic fuera |
| Overlay | Tinta al 40 % |
| ARIA | `role="dialog"`, `aria-modal="true"`, `aria-label` |

- **[OBLIGATORIA]** Todo lo anterior.
- **Sin definir:** la fuente no fija la animación del diálogo de escritorio. La
  tabla propone la de "menús/paneles" por ser la más cercana; no es una decisión
  aprobada.
- **Sin definir:** la fuente asigna `--shadow-sheet` (principal) a la hoja
  inferior; la sombra del diálogo de escritorio no está fijada. La tabla propone
  `--shadow-pop` (específica); no es una decisión aprobada.

### ConfirmDialog / useConfirm

- **[OBLIGATORIA]** Nunca `window.confirm`.
- Tarjeta centrada.
- Icono en círculo tintado (ámbar o rojo).
- Título de 17 px y mensaje de 13 px.
- Dos botones iguales: Cancelar (blanco) y Confirmar (tinta o rojo).

### Toast

| Propiedad | Valor |
|---|---|
| Forma | Píldora inferior centrada, sobre la barra de navegación |
| Duración | 3.2 s |
| Icono | SVG |
| Info | Fondo tinta |
| Éxito | emerald-700 `#047857` (aprobado; ver [product-ui-tokens.md §2](product-ui-tokens.md#2-semánticos)) |
| Error | red-600 `#DC2626` |
| Entrada | Sube 12 px en 200 ms |
| ARIA | `aria-live="polite"` |

- **[OBLIGATORIA]** Sin emojis.

### EmptyState

| Parte | Especificación |
|---|---|
| Icono | En círculo gris de 56 px |
| Frase | Corta, 15 px |
| Pista | 13 px |
| Acciones | Botón tinta + secundario blanco |

- **[OBLIGATORIA]** Nunca una tabla vacía ni "No hay datos" sin más.

### Guia ("cómo funciona")

- Tarjeta tintada con icono de info.
- Título de 14 px y texto de 13 px.
- Pasos numerados con estado hecho / pendiente.
- Cada paso pendiente lleva a donde se completa.
- **[PRODUCTO]** El contenido de los pasos.

### Skeleton

- Skeleton de página y de vista con las mismas formas del contenido real (barra
  de título, 2 KPIs, tarjetas) mientras carga el módulo.
- Shimmer con gradiente gris de 1.3 s.
- `aria-busy="true"` en el contenedor que carga.
- **[OBLIGATORIA]** Nunca un spinner a pantalla completa.

### Tabla responsive

- En escritorio, tabla (radio 28).
- En móvil, la MISMA fuente de datos se pinta como tarjetas apiladas: título de
  15 px, subtítulo de 13 px, pares etiqueta/valor y badge arriba a la derecha.
- **[OBLIGATORIA]** Un solo componente, sin duplicar.

---

## 3. Jerarquía y contenido

- **[OBLIGATORIA]** Una pantalla = una tarea.
- **[OBLIGATORIA]** Las acciones principales van al pie pegajoso de la hoja,
  nunca sueltas al final del cuerpo.
- **[OBLIGATORIA]** Orden: cifras importantes arriba (KPIs), luego filtros,
  luego la lista.
- **[OBLIGATORIA]** Máximo dos niveles de texto por fila (título + subtítulo).
- **[OBLIGATORIA]** Textos cortos y sin cortes a media palabra: truncar con
  puntos suspensivos en una línea (`truncate`) o permitir dos líneas
  (`line-clamp-2`) en títulos de tarjeta.
- **[ADAPTABLE]** Idioma: el estándar fija español. Los productos bilingües
  aplican la misma regla en cada idioma.
- **[OBLIGATORIA]** Cada estado del negocio tiene UN nombre y UN color en todo el
  sistema.
- **[OBLIGATORIA]** Cuando una acción no aplica se muestra el motivo; no se
  esconde el botón sin explicación.
- **[OBLIGATORIA]** Los avisos se dividen en dos grupos:
  - **"Por resolver"**: se quitan solos al resolverse y llevan al módulo.
  - **"Notificaciones"**: se marcan como leídas.

---

## 4. Inventario de primitivas

Lista de comprobación para cada producto. Una sola implementación por pieza.

| Primitiva | Sección |
|---|---|
| Cabecera | §1.1 |
| Menú lateral / Drawer | §1.2 |
| Barra inferior | §1.3 |
| Login | §1.6 |
| PageHeader | §2 |
| KpiTile | §2 |
| SegmentedTabs | §2 |
| Chips | §2 |
| Card | §2 |
| ListRow | §2 |
| StatusBadge | §2 |
| SectionLabel | §2 |
| FormInput / FormSelect / FormTextarea | §2 |
| FormBtn | §2 |
| IconButton | §2 |
| ChoiceButton | §2 |
| Modal / BottomSheet | §2 |
| ConfirmDialog / useConfirm | §2 |
| Toast | §2 |
| EmptyState | §2 |
| Guia | §2 |
| Skeleton | §2 |
| Tabla responsive | §2 |
| Íconos (módulo único) | [product-ui-tokens.md §9](product-ui-tokens.md#9-iconografía) |
