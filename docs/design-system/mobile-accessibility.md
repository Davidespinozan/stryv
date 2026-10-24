# STRYV Product UI System · Mobile-first, accesibilidad y calidad

Base: estándar visual de CuboPolar.

## 1. Mobile-first: reglas duras

- **[OBLIGATORIA]** Se diseña primero para **390 px** de ancho y para uso con el
  pulgar. Escala a escritorio sin cambiar de lenguaje.
- **[OBLIGATORIA]** Sin scroll horizontal: `overflow-x: hidden` en `html`,
  `body` y el contenedor raíz (`#root` en CuboPolar).
- **[OBLIGATORIA]** `-webkit-tap-highlight-color: transparent`.
- **[OBLIGATORIA]** Scrollbars ocultas en móvil; de 6 px y redondeadas en
  escritorio.
- **[OBLIGATORIA]** En móvil, todo `input`, `select` y `textarea` mide 16 px como
  mínimo (evita el zoom de iOS).

### Tamaños táctiles

| Elemento | Tamaño |
|---|---|
| Objetivo táctil mínimo | ≥ 44 px |
| Botón de icono | 40 px visibles, con área táctil de 44 px |
| Botones de campo / ChoiceButton | 48 px |
| Campos de formulario | 48 px |
| Botón estándar (FormBtn) | 44 px |
| Acciones principales de operación (FormBtn `lg`, login) | 52 px |
| Cabecera | 56 px móvil / 64 px escritorio |
| Barra inferior | 56 px |

Todos son **[OBLIGATORIA]**.

### Viewport y safe-areas

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

- **[OBLIGATORIA]** `viewport-fit=cover`.
- **[OBLIGATORIA]** La cabecera suma `env(safe-area-inset-top)`.
- **[OBLIGATORIA]** El pie de las hojas y la barra inferior suman
  `env(safe-area-inset-bottom)`.

### Patrones móviles

- **[OBLIGATORIA]** Pickers operativos (producto, método de pago, causa, turno)
  en rejilla de 2 columnas con `ChoiceButton` de 48 px. Nunca `<select>` para
  elegir entre pocas opciones operativas.
- **[OBLIGATORIA]** Filtros de fecha/selección en dos columnas; nunca una fila
  que desborde.
- **[OBLIGATORIA]** Tablas: en escritorio tabla; en móvil la MISMA fuente se
  pinta como tarjetas apiladas (título 15 px, subtítulo 13 px, pares
  etiqueta/valor, badge arriba a la derecha). Un solo componente.
- **[OBLIGATORIA]** Modal = hoja inferior en móvil (92dvh máx.) y diálogo
  centrado en escritorio (85vh máx.).
- **[OBLIGATORIA]** Barra inferior sólo en móvil; menú lateral en escritorio.
- **[OBLIGATORIA]** KPIs en 2 columnas (3 sólo si caben).
- **[OBLIGATORIA]** No dejar `transform` residual en el contenedor de la vista
  (rompe los `position: fixed`; ver
  [product-ui-tokens.md §8](product-ui-tokens.md#8-movimiento)).

## 2. Accesibilidad mínima

### Foco

- **[OBLIGATORIA]** Foco visible por teclado: `outline` de 2 px del acento al
  60 %, `outline-offset: 2px`, radio 10 px.
- **[OBLIGATORIA]** Anillo de foco de campo: acento al 15 %.

Con el acento STRYV (derivados):

```css
:focus-visible {
  outline: 2px solid rgba(11, 119, 152, 0.60);
  outline-offset: 2px;
  border-radius: 10px;
}
```

### Roles ARIA

| Componente | Atributos |
|---|---|
| Pestañas (SegmentedTabs) | `role="tablist"`, `role="tab"`, `aria-selected` |
| Opciones (ChoiceButton, Chips) | `aria-pressed` |
| Diálogos (Modal, ConfirmDialog) | `role="dialog"`, `aria-modal="true"`, `aria-label` |
| Toasts | `aria-live="polite"` |
| Skeletons | `aria-busy` |
| IconButton | `aria-label` y `title` siempre |

Todos son **[OBLIGATORIA]**.

### Contraste

| Combinación | Ratio | Uso permitido |
|---|---|---|
| `#0B1220` (tinta) sobre `#FFFFFF` | 18.72 : 1 | Todo |
| `#5B6472` (secundario) sobre `#FFFFFF` | 5.98 : 1 | Texto AA |
| `#5B6472` sobre `#F4F6F9` | 5.53 : 1 | Texto AA |
| `#8A94A3` (suave) sobre `#FFFFFF` | 3.07 : 1 | **Sólo** placeholders y pistas |
| `#0B7798` (acento STRYV) sobre `#FFFFFF` | 5.11 : 1 | Enlaces, estados activos y texto AA |
| `#0B7798` sobre `#F4F6F9` | 4.72 : 1 | Texto AA |
| `#FFFFFF` sobre `#07131A` (superficie oscura STRYV) | 18.80 : 1 | Texto en cabecera, menú, barra inferior y login |
| `#0B7798` sobre `#07131A` | 3.68 : 1 | **Sólo** iconos y texto grande |
| `#0B1220` sobre acento suave en blanco (≈ `#E7F1F5`) | 16.31 : 1 | Texto AA |
| `#0B7798` sobre acento suave en blanco (≈ `#E7F1F5`) | 4.46 : 1 | **Sólo** iconos y texto grande (no llega a AA) |
| `#FFFFFF` sobre emerald-700 `#047857` (toast de éxito) | 5.48 : 1 | Texto AA |
| `#FFFFFF` sobre red-600 `#DC2626` (toast de error) | 4.83 : 1 | Texto AA |
| `#FFFFFF` sobre `#0B1220` (toast info, botón primario) | 18.72 : 1 | Texto AA |

- **[OBLIGATORIA]** El texto secundario `#5B6472` cumple AA sobre blanco y sobre
  el lienzo.
- **[OBLIGATORIA]** El texto suave `#8A94A3` es sólo para placeholders y pistas.
- **[OBLIGATORIA]** El acento suave (acento al 10 %) se aprueba sujeto a
  contraste: el texto normal encima va en tinta o blanco, nunca en acento. El
  estado activo no depende sólo de la píldora suave (contra su fondo mide
  ≈ 1.1 : 1); se refuerza con el color del icono o la etiqueta y con
  `aria-current` / `aria-selected`. Detalle en
  [brand-tokens.md §4](brand-tokens.md#4-derivados-del-acento).
- **[PRODUCTO]** Cada producto de cliente debe verificar el contraste de su
  propio acento, su acento suave y su superficie oscura con la misma tabla antes
  de adoptarlos.

### Movimiento

- **[OBLIGATORIA]** Con `prefers-reduced-motion: reduce` se apagan todas las
  animaciones.

### Otros

- **[OBLIGATORIA]** Cero emojis en la interfaz (los lectores de pantalla los
  leen de forma impredecible y rompen el tono).
- **[OBLIGATORIA]** Cuando una acción no aplica, se muestra el motivo en texto.

## 3. Pruebas y criterios de calidad

### Cómo se mantiene el nivel

- **[OBLIGATORIA]** Tokens en `:root` y en `tailwind.config` (colores, radios,
  sombras). Las vistas usan nombres, nunca valores sueltos.
- **[OBLIGATORIA]** Una suite de pruebas de diseño que **falla** si una vista:
  1. usa colores escritos a mano;
  2. usa emojis;
  3. usa `window.confirm`;
  4. repite el título de la pantalla (que sólo vive en la cabecera).
- **[ADAPTABLE]** Nombres de la suite. En CuboPolar son
  `disenoSistema.test.jsx` y `movilFirst.test.jsx`; cada producto los nombra y
  los implementa según su stack.
- **[OBLIGATORIA]** Capturas en **WebKit iPhone 14** y **iPhone SE** de cada rol
  antes de publicar.
- **[OBLIGATORIA]** Cada producto tiene una tarjeta de diseño (en CuboPolar,
  `docs/sistema/diseno.md`) con tokens, componentes y decisiones cerradas, que se
  lee antes de tocar estilos. **[ADAPTABLE]** la ruta.

### Lista de revisión antes de publicar

Diseño

- [ ] Ninguna vista usa hexadecimales, `rgb()` ni clases de color de utilidad sueltas.
- [ ] El lienzo no tiene manchas de color ni degradados.
- [ ] Ninguna superficie de contenido es translúcida.
- [ ] El botón primario es tinta.
- [ ] Sólo radios 14 / 20 / 28 / 999 y las excepciones documentadas.
- [ ] Sólo las sombras documentadas; nada de `shadow-xl`.
- [ ] Tarjetas con borde + sombra.
- [ ] Semánticos tintados (salvo botones de acción y toasts).
- [ ] Inter con `tabular-nums` en toda cifra.
- [ ] Títulos con tracking negativo y nunca en mayúsculas.
- [ ] El título de la pantalla no se repite en la vista.
- [ ] Cero emojis.

Interacción

- [ ] Ningún `window.confirm`.
- [ ] Esqueletos en lugar de spinner de pantalla completa.
- [ ] Una sola curva de easing; duraciones de 160–260 ms.
- [ ] `prefers-reduced-motion` apaga las animaciones.
- [ ] Ningún `transform` residual tras la entrada de vista.
- [ ] Estados vacíos con EmptyState.

Móvil

- [ ] Sin scroll horizontal a 390 px ni en iPhone SE.
- [ ] Objetivos táctiles ≥ 44 px.
- [ ] Campos a 16 px como mínimo en móvil.
- [ ] Safe-areas respetadas en cabecera, hojas y barra inferior.
- [ ] Pickers operativos con ChoiceButton, no `<select>`.
- [ ] Tablas convertidas en tarjetas en móvil desde el mismo componente.

Accesibilidad

- [ ] Foco visible por teclado en todo elemento interactivo.
- [ ] Roles ARIA de la tabla de §2.
- [ ] `IconButton` con `aria-label` y `title`.
- [ ] Contraste AA del texto, incluido el acento del producto.
- [ ] Ningún texto normal en acento sobre acento suave ni sobre superficie oscura.

Evidencia

- [ ] Capturas WebKit iPhone 14 y SE de cada rol.
- [ ] Suite de diseño en verde.
