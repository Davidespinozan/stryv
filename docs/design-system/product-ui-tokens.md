# STRYV Product UI System · Tokens

Base: estándar visual de CuboPolar. Ámbito: sistemas administrativos, ERP, POS,
CRM y aplicaciones operativas, propios o de clientes.

Las capas de tokens son tres:

1. **Neutros**: iguales en todos los productos ([§1](#1-neutros)).
2. **Semánticos**: iguales en todos los productos, no son de marca ([§2](#2-semánticos)).
3. **Marca**: la pone cada producto ([§4](#4-ranuras-de-marca-producto)).

## 1. Neutros

**[OBLIGATORIA]** Iguales en todos los sistemas.

| Token sugerido | Uso | Valor |
|---|---|---|
| `--ui-canvas` | Lienzo (fondo de toda la app) | `#F4F6F9` |
| `--ui-surface` | Superficie: tarjetas, hojas, cabecera, modales | `#FFFFFF` |
| `--ui-field` | Fondo de campos en reposo (al enfocar pasa a blanco) | `#F8FAFC` (slate-50) |
| `--ui-muted` | Fondo de chips, iconos de fila, pista de pestañas | slate-100 / `rgba(11,18,32,0.06)` |
| `--ui-line` | Línea (bordes de todo) | `#E6EAF0` |
| `--ui-line-strong` | Línea fuerte (bordes de opciones no activas) | `#D6DCE5` |
| `--ui-ink` | Tinta: texto principal y botón primario | `#0B1220` |
| `--ui-text-2` | Texto secundario | `#5B6472` |
| `--ui-text-3` | Texto suave / placeholder | `#8A94A3` |
| `--ui-overlay` | Fondo de overlay de modal: tinta al 40 % | `rgba(11,18,32,0.40)` (derivado) |

Los nombres de token son una propuesta de nomenclatura común. **[ADAPTABLE]**
Un producto existente puede conservar sus nombres (`text-ink`, `border-line`)
siempre que apunten a estos valores.

Nota: slate-100 de Tailwind v3 es `#F1F5F9`. La fuente da dos formas para el
mismo uso (slate-100 o tinta al 6 %); ambas son válidas, pero dentro de un
producto se usa una sola.

### Reglas de neutros

- **[OBLIGATORIA]** El lienzo NUNCA lleva manchas de color ni degradados. El
  color vive sólo en la marca (cabecera y menú oscuros), en el acento y en los
  semánticos.
- **[OBLIGATORIA]** Las superficies son blancas, opacas, con borde de 1 px
  `#E6EAF0`. Nada translúcido (`bg-white/70`, `backdrop-blur`) en el contenido.
  (La cabecera pegajosa es la única excepción; ver
  [components.md §1.1](components.md#11-cabecera).)
- **[OBLIGATORIA]** El botón primario es TINTA (`#0B1220`), no el color de
  marca. El color de marca se reserva para estado activo, enlaces y foco.
  *Decisión aprobada (DS-01C): la acción primaria de producto es `#0B1220` en
  todos los productos, de STRYV y de clientes.*

## 2. Semánticos

**[OBLIGATORIA]** Iguales en todos los sistemas. No son de marca.

| Token sugerido | Rol | Sólido | Fondo tintado (`-50`) | Borde (`-100`) | Texto (`-800`) |
|---|---|---|---|---|---|
| `--ui-success` | Éxito | `#059669` | emerald-50 `#ECFDF5` | emerald-100 `#D1FAE5` | emerald-800 `#065F46` |
| `--ui-warning` | Aviso | `#D97706` | amber-50 `#FFFBEB` | amber-100 `#FEF3C7` | amber-800 `#92400E` |
| `--ui-danger` | Peligro | `#DC2626` | red-50 `#FEF2F2` | red-100 `#FEE2E2` | red-800 `#991B1B` |

Los hexadecimales de las columnas tintadas son la equivalencia de Tailwind v3 de
las clases que nombra la fuente. Los sólidos coinciden con emerald-600, amber-600
y red-600.

Otros semánticos citados en la fuente:

| Uso | Valor |
|---|---|
| Borde de campo con error | red-300 `#FCA5A5` |
| Texto de error bajo el campo | rojo, 12 px (la fuente no fija el tono; se usa `--ui-danger`) |
| Toast de éxito | emerald-700 `#047857` (**aprobado** en DS-01C; la fuente decía "verde 700"). Texto blanco: 5.48 : 1. |
| Toast de error | red-600 `#DC2626`. Texto blanco: 4.83 : 1. |
| Contador de la campana | rojo (`--ui-danger`) |

### Reglas de semánticos

- **[OBLIGATORIA]** Siempre como píldora o tarjeta TINTADA: fondo al 8–10 %
  (`-50`), borde `-100` y texto `-800`.
- **[OBLIGATORIA]** Nunca fondo sólido de color con texto blanco, salvo en
  botones de acción (éxito/peligro) y toasts.
- **[OBLIGATORIA]** Un solo verde, un solo ámbar y un solo rojo. Sin variantes.
- **[OBLIGATORIA]** Cada estado del negocio tiene UN nombre y UN color en todo
  el sistema (mapa único de estados; ver StatusBadge en
  [components.md](components.md#statusbadge)).
- **[PRODUCTO]** El mapa concreto estado → color (pagado, pendiente, cancelado…)
  lo define cada producto, con estos tres semánticos más los neutros.

## 3. Tipografía

| Regla | Valor | Clase |
|---|---|---|
| Familia | **Inter** (Google Fonts), pesos 400 / 500 / 600 / 700 / 800 | **[OBLIGATORIA]** |
| Rasgos | `font-feature-settings: 'cv11', 'ss01', 'cv02'` | **[OBLIGATORIA]** |
| Suavizado | antialiased | **[OBLIGATORIA]** |
| Cifras | `font-variant-numeric: tabular-nums` en montos, cantidades, fechas, tablas y KPIs | **[OBLIGATORIA]** |

Una sola familia. No se mezclan tipografías dentro del producto.

*Decisión aprobada (DS-01C): la tipografía del Product UI es Inter en todos los
productos.* La tipografía de marca (provisionalmente la de Landing V3; ver
[brand-tokens.md §6](brand-tokens.md#6-tipografía-de-marca-provisional)) no se
usa dentro de interfaces de producto.

### Escala fija

| Rol | Tamaño / interlínea | Peso | Tracking | Clase |
|---|---|---|---|---|
| Display (cifras grandes, bienvenida) | 28 / 32 | — | −0.02em | **[OBLIGATORIA]** |
| Título de pantalla, móvil | 17 px | semibold (600) | −0.015 a −0.02em | **[OBLIGATORIA]** |
| Título de pantalla, escritorio | 20–22 px | semibold (600) | −0.015 a −0.02em | **[ADAPTABLE]** dentro del rango |
| Título de hoja/modal | 17 px | bold (700) | −0.015 a −0.02em | **[OBLIGATORIA]** |
| Cuerpo | 15 / 22 | — | — | **[OBLIGATORIA]** |
| Secundario | 13 / 18 | — | — | **[OBLIGATORIA]** |
| Pista | 12 | — | — | **[OBLIGATORIA]** |
| Etiqueta | 11 / 14 | — | — | **[OBLIGATORIA]** |
| Kicker (etiqueta de sección) | 11 px | semibold (600), MAYÚSCULAS | 0.08em (no más ancho) | **[OBLIGATORIA]** |

"—" = la fuente no lo fija. Peso por defecto: 400.

- **[OBLIGATORIA]** El kicker va en color de texto secundario (`#5B6472`).
- **[OBLIGATORIA]** Los títulos siempre llevan letter-spacing negativo (−0.015 a
  −0.02em). Nunca títulos en mayúsculas.
- **[OBLIGATORIA]** En móvil, todo `input`, `select` y `textarea` mide 16 px
  como mínimo (iOS hace zoom si son menores).

Tamaños usados por componentes (detalle en [components.md](components.md)): cifra
de KpiTile 24 px tabular, título de Guia 14 px, StatusBadge 11 px semibold,
etiqueta de campo 13 px medium.

## 4. Ranuras de marca (producto)

El estándar fuente excluye a propósito los colores de marca y acento: "cada
sistema pone los suyos". Estas son las ranuras que el sistema reserva:

| Ranura | Dónde se usa | Productos STRYV | Productos de clientes |
|---|---|---|---|
| `--brand-accent` | Estado activo, enlaces, foco, anillo de campo (15 %), outline de teclado (60 %), botón del login, IconButton tono accent | `var(--stryv-accent)` = `#0B7798` | **[PRODUCTO]** el del cliente |
| `--brand-accent-soft` | Píldora activa de la barra inferior, avatar de ListRow | `var(--stryv-accent-soft)` = `#0B7798` al 10 % (sujeto a contraste; ver [brand-tokens.md §4](brand-tokens.md#4-derivados-del-acento)) | **[PRODUCTO]** el acento del cliente, con su propia verificación de contraste |
| `--brand-dark` / degradado de marca | Cabecera y menú lateral oscuros, drawer móvil, barra inferior móvil, fondo del login, Card tono "dark" | `var(--stryv-dark)` = `#07131A` sólido. Degradado: sin definir ([brand-tokens.md §2](brand-tokens.md#2-superficie-oscura-de-marca)) | **[PRODUCTO]** el del cliente |
| Logo | Login, menú | Versiones sin definir ([brand-tokens.md §7](brand-tokens.md#7-pendientes-de-marca)) | **[PRODUCTO]** |

La columna "Productos STRYV" es identidad STRYV y sólo aplica a productos de
STRYV. Los productos de clientes llenan las mismas ranuras con su identidad.

- **[OBLIGATORIA]** El acento nunca pinta el botón primario, los fondos de
  lienzo ni grandes superficies de contenido.
- **[OBLIGATORIA]** Un producto puede cambiar las ranuras de marca, pero no los
  neutros ni los semánticos.

## 5. Radios

| Token sugerido | Uso | Valor | Clase |
|---|---|---|---|
| `--radius-field` | Campo y botón | **14 px** | **[OBLIGATORIA]** |
| `--radius-card` | Tarjeta | **20 px** | **[OBLIGATORIA]** |
| `--radius-sheet` | Hoja, modal y tabla | **28 px** | **[OBLIGATORIA]** |
| `--radius-pill` | Píldora | 999 px | **[OBLIGATORIA]** |

*Decisión aprobada (DS-01C): los radios principales son 14, 20, 28 y 999 px.
Las excepciones se conservan cuando el componente las requiere.*

Excepciones nombradas en la fuente (se conservan sólo en su componente; no son
radios adicionales de uso libre):

| Uso | Valor |
|---|---|
| Botón grande (52 px) | 16 px |
| Icono de fila / IconButton | 12 px |
| Pista de SegmentedTabs | 14 px (= campo) |
| Outline de foco por teclado | 10 px |
| Caja del logo en el login | 26 px |

- **[OBLIGATORIA]** "Tres radios y nada más" (14, 20 y 28, más la píldora). Las
  excepciones de la tabla son las únicas permitidas.

## 6. Sombras

*Decisión aprobada (DS-01C): se conservan las cuatro sombras del estándar,
distinguiendo las dos principales de las específicas.*

| Token sugerido | Tipo | Uso | Valor |
|---|---|---|---|
| `--shadow-card` | **Principal** | Tarjeta y toda superficie de contenido sobre el lienzo | `0 1px 2px rgba(11,18,32,.04), 0 10px 28px -14px rgba(11,18,32,.14)` |
| `--shadow-sheet` | **Principal** | Hoja inferior (superficie que sube desde abajo) | `0 -8px 40px rgba(11,18,32,.14)` |
| `--shadow-pop` | Específica | Pop / menú | `0 18px 48px -12px rgba(11,18,32,.28)` |
| `--shadow-primary` | Específica | Botón primario (sombra de la tinta, no de color) | `0 10px 24px -10px rgba(11,18,32,.45)` |

Las dos principales son las "dos sombras, muy suaves" que cita la fuente. Las
específicas sólo se usan en su componente (menús/popovers y FormBtn `primary`).

- **[OBLIGATORIA]** Sin sombras duras, sin `shadow-xl` de Tailwind.
- **[OBLIGATORIA]** Todas las sombras usan la tinta (`11,18,32`), nunca un color
  de marca.
- **[OBLIGATORIA]** En tarjetas, siempre borde y sombra juntos: la sombra sola se
  pierde en el lienzo gris.
- La sombra mínima de la píldora activa de SegmentedTabs no tiene valor fijado
  (**sin definir**).

## 7. Bordes

- **[OBLIGATORIA]** Borde estándar: 1 px `#E6EAF0`.
- **[OBLIGATORIA]** Opciones no activas: `#D6DCE5`.
- **[OBLIGATORIA]** Sin bordes de 2 px, salvo en opciones seleccionables
  (ChoiceButton y similares).

## 8. Movimiento

| Token sugerido | Valor |
|---|---|
| `--ease` | `cubic-bezier(.32,.72,0,1)`: una sola curva para todo |
| Rango de duraciones | 160–260 ms |

| Animación | Recorrido | Duración |
|---|---|---|
| Entrada de vista | fade + subida de 6 px | 220 ms |
| Hoja inferior | sube 24 px | 260 ms |
| Menús y paneles | `scale(.96) → scale(1)` | 180 ms |
| Toasts | suben 12 px | 200 ms |
| Botón pulsado | `active: scale(0.985)` | — |
| Transiciones de color, borde y sombra (todo botón, campo y enlace) | — | 160 ms |
| Shimmer de esqueleto | gradiente gris | 1.3 s (ciclo) |

- **[OBLIGATORIA]** Una sola curva de easing.
- **[OBLIGATORIA]** Mientras carga, esqueletos con shimmer; nunca un spinner a
  pantalla completa.
- **[OBLIGATORIA]** Con `prefers-reduced-motion` se apagan todas las
  animaciones.
- **[OBLIGATORIA]** La animación de entrada de vista debe terminar SIN
  `transform` residual (`animation-fill-mode: backwards`). Si queda un transform
  en el contenedor, los elementos `position: fixed` (hojas, barras) se rompen.

## 9. Iconografía

- **[OBLIGATORIA]** Cero emojis en la interfaz.
- **[OBLIGATORIA]** Íconos SVG de línea, 16×16 en `viewBox="0 0 24 24"`,
  `stroke="currentColor"`, grosor 1.8, extremos y uniones redondeados (estilo
  Lucide/Feather).
- **[OBLIGATORIA]** El icono toma el color del texto y se dimensiona por CSS según
  el contexto (por ejemplo `[&>svg]:h-5 [&>svg]:w-5`).
- **[ADAPTABLE]** Un solo módulo con todos los íconos (en CuboPolar,
  `Icons.jsx`). El nombre y el formato dependen del stack; lo obligatorio es que
  haya una única fuente.

## 10. Cómo se consumen los tokens

- **[OBLIGATORIA]** Los tokens viven en `:root` y, si hay Tailwind, en
  `tailwind.config` (colores, radios, sombras).
- **[OBLIGATORIA]** Las vistas usan los nombres (`rounded-card`, `shadow-card`,
  `border-line`, `text-ink`), nunca valores sueltos.

Ejemplo de referencia (producto STRYV):

```css
:root {
  /* Marca (producto STRYV; un cliente pone aquí la suya) */
  --stryv-accent: #0B7798;
  --stryv-accent-soft: rgba(11, 119, 152, 0.10);
  --stryv-dark: #07131A;
  --brand-accent: var(--stryv-accent);
  --brand-accent-soft: var(--stryv-accent-soft);
  --brand-dark: var(--stryv-dark);

  /* Neutros */
  --ui-canvas: #F4F6F9;
  --ui-surface: #FFFFFF;
  --ui-field: #F8FAFC;
  --ui-muted: rgba(11, 18, 32, 0.06);
  --ui-line: #E6EAF0;
  --ui-line-strong: #D6DCE5;
  --ui-ink: #0B1220;
  --ui-text-2: #5B6472;
  --ui-text-3: #8A94A3;
  --ui-overlay: rgba(11, 18, 32, 0.40);

  /* Semánticos */
  --ui-success: #059669;
  --ui-warning: #D97706;
  --ui-danger: #DC2626;
  --ui-success-toast: #047857; /* emerald-700 */

  /* Radios */
  --radius-field: 14px;
  --radius-card: 20px;
  --radius-sheet: 28px;
  --radius-pill: 999px;

  /* Sombras: principales */
  --shadow-card: 0 1px 2px rgba(11,18,32,.04), 0 10px 28px -14px rgba(11,18,32,.14);
  --shadow-sheet: 0 -8px 40px rgba(11,18,32,.14);
  /* Sombras: específicas */
  --shadow-pop: 0 18px 48px -12px rgba(11,18,32,.28);
  --shadow-primary: 0 10px 24px -10px rgba(11,18,32,.45);

  /* Movimiento */
  --ease: cubic-bezier(.32,.72,0,1);
}
```
