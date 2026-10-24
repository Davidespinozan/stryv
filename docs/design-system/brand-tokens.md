# STRYV Brand System · Tokens de marca

Ámbito: landing, propuestas, presentaciones, material corporativo y uniformes.
También define la identidad de los productos propios de STRYV (ADMINSTRYV y
futuros internos) dentro del Product UI System.

Este documento es **sólo identidad STRYV**. Las identidades de clientes no se
definen aquí (ver [§3](#3-identidad-stryv-vs-identidades-de-clientes)).

## 1. Acento corporativo oficial

| Token | Valor | Estado |
|---|---|---|
| `--stryv-accent` | `#0B7798` | **[OBLIGATORIA]** Aprobado · oficial e invariable |

- **[OBLIGATORIA]** Es el color del logotipo de los uniformes. Todo material de
  STRYV usa exactamente `#0B7798`.
- **[OBLIGATORIA]** No se sustituye por otro azul ni teal, ni se aclara u
  oscurece "por contraste". Si hace falta otro tono, se usa una opacidad del
  mismo color (ver [§4](#4-derivados-del-acento)) o un neutro.
- **[OBLIGATORIA]** El token se llama `--stryv-accent`. Los alias existentes en
  otros archivos (por ejemplo, `--accent` o `--teal` en la landing) deben
  apuntar a este token, no repetir el hexadecimal.

```css
:root {
  --stryv-accent: #0B7798;
}
```

### Contraste medido (WCAG 2.x)

| Combinación | Ratio | Resultado |
|---|---|---|
| `#0B7798` sobre `#FFFFFF` | 5.11 : 1 | AA texto normal |
| `#FFFFFF` sobre `#0B7798` | 5.11 : 1 | AA texto normal (botón de acento con texto blanco) |
| `#0B7798` sobre `#F4F6F9` (lienzo Product UI) | 4.72 : 1 | AA texto normal |
| `#0B7798` sobre `#0B1220` (tinta) | 3.66 : 1 | Sólo AA texto grande / elementos no textuales |
| `#0B7798` sobre `#07131A` (superficie oscura) | 3.68 : 1 | Sólo AA texto grande / elementos no textuales |

Consecuencia: **[OBLIGATORIA]** sobre fondos oscuros (tinta o superficie oscura
de marca) el acento no se usa para texto de cuerpo; sí para iconos, píldoras de
estado activo, bordes y texto grande (≥ 18.66 px bold o ≥ 24 px regular).

## 2. Superficie oscura de marca

| Token | Valor | Estado |
|---|---|---|
| `--stryv-dark` | `#07131A` | **[OBLIGATORIA]** Aprobado para superficies corporativas oscuras |

- **[OBLIGATORIA]** Es la superficie oscura de STRYV: fondos oscuros de material
  corporativo y, en productos STRYV, la ranura `--brand-dark` del Product UI
  (cabecera y menú oscuros, drawer, barra inferior móvil, login y Card tono
  "dark").
- **[OBLIGATORIA]** `#07131A` **no reemplaza automáticamente los fondos
  existentes de Landing V3.** La landing usa hoy varios fondos oscuros (`--bg`,
  `--bg2`, `--bg3`, `--bg4`, `--bg-deep`; ver [§8](#8-observado-en-landing-v3)).
  Este documento no los modifica, no los unifica y no obliga a migrarlos. Cualquier
  cambio de fondos en la landing es una decisión aparte, dentro del trabajo de
  Landing V3.
- **[ADAPTABLE]** El material corporativo puede usar los fondos escalonados de la
  landing para dar profundidad, pero la superficie oscura de referencia es
  `#07131A`.
- El estándar de CuboPolar describe la marca oscura del menú como "degradado de
  marca". El degradado de STRYV **no está definido**: mientras tanto se usa
  `#07131A` sólido (ver [§7](#7-pendientes-de-marca)).

### Contraste medido

| Combinación | Ratio | Resultado |
|---|---|---|
| `#FFFFFF` sobre `#07131A` | 18.80 : 1 | AA/AAA texto normal |
| `#8A94A3` sobre `#07131A` | 6.13 : 1 | AA texto normal |
| `#0B7798` sobre `#07131A` | 3.68 : 1 | Sólo texto grande / no textual |

```css
:root {
  --stryv-dark: #07131A;
}
```

## 3. Identidad STRYV vs identidades de clientes

| | STRYV | Clientes |
|---|---|---|
| Productos y piezas | Landing, propuestas, presentaciones, uniformes, ADMINSTRYV, futuros internos | CuboPolar, SALA, STRYV Restaurant y otros |
| `--brand-accent` | `var(--stryv-accent)` = `#0B7798` | **[PRODUCTO]** el del cliente |
| `--brand-dark` | `var(--stryv-dark)` = `#07131A` | **[PRODUCTO]** el del cliente |
| Tipografía de marca | §6 | La del cliente, sólo en su material de marca |
| Product UI (neutros, semánticos, Inter, radios, sombras, movimiento, componentes) | Común | Común |

- **[OBLIGATORIA]** `#0B7798` y `#07131A` no aparecen en la interfaz de un
  cliente, salvo en una firma "Hecho por STRYV" si el cliente la acepta.
- **[OBLIGATORIA]** El Product UI System no reemplaza la identidad visual de los
  clientes: define cómo se construye la interfaz, no de qué color es su marca.
- **[OBLIGATORIA]** Dentro de una interfaz de producto (de STRYV o de cliente) la
  tipografía es Inter, no la tipografía de marca.

Ranuras completas en
[product-ui-tokens.md §4](product-ui-tokens.md#4-ranuras-de-marca-producto).

## 4. Derivados del acento

Valores que resultan de aplicar las reglas del sistema al acento de STRYV. No
son colores nuevos: son el mismo `#0B7798` con opacidad.

| Uso | Derivado | Estado |
|---|---|---|
| Anillo de foco de campo: acento al 15 % | `rgba(11, 119, 152, 0.15)` | Derivado de la regla de la fuente |
| Foco visible por teclado: acento al 60 % | `rgba(11, 119, 152, 0.60)` | Derivado de la regla de la fuente |
| **Acento suave**: acento al 10 % | `rgba(11, 119, 152, 0.10)` | **Aprobado**, sujeto a contraste accesible |

```css
:root {
  --stryv-accent-soft: rgba(11, 119, 152, 0.10);
}
```

### Acento suave: condiciones de contraste

Se usa en la píldora activa de la barra inferior, el avatar de ListRow y fondos
de estado activo. Color resultante y contraste medidos:

| Acento suave sobre… | Color resultante | Contenido encima | Ratio | Resultado |
|---|---|---|---|---|
| Blanco `#FFFFFF` | ≈ `#E7F1F5` | Tinta `#0B1220` | 16.31 : 1 | AA texto |
| Blanco `#FFFFFF` | ≈ `#E7F1F5` | Acento `#0B7798` | 4.46 : 1 | **No AA para texto normal**; sí para iconos y texto grande |
| Lienzo `#F4F6F9` | ≈ `#DDE9EF` | Acento `#0B7798` | 4.13 : 1 | **No AA para texto normal**; sí para iconos y texto grande |
| Superficie oscura `#07131A` | ≈ `#071D27` | Blanco | 17.30 : 1 | AA texto |
| Superficie oscura `#07131A` | ≈ `#071D27` | Acento `#0B7798` | 3.38 : 1 | Sólo iconos y texto grande |

Reglas de uso:

- **[OBLIGATORIA]** Sobre acento suave, el texto normal va en **tinta** (fondo
  claro) o **blanco** (fondo oscuro). El acento sólo pinta iconos, la inicial
  del avatar en ≥ 18.66 px bold, o texto grande.
- **[OBLIGATORIA]** El acento suave no es, por sí solo, indicador suficiente de
  estado: contra su fondo mide 1.15 : 1 (blanco) y 1.09 : 1 (oscuro). El estado
  activo se refuerza con el color del icono o la etiqueta y con
  `aria-current` / `aria-selected`.
- **[PRODUCTO]** Un producto de cliente que adopte "su acento al 10 %" repite
  esta tabla con su propio acento.

## 5. Reglas de marca ya establecidas

- **[OBLIGATORIA]** *Marca ajena contenida.* Cuando un material de STRYV (la
  landing, una propuesta) promociona otro producto, la paleta ajena sólo vive
  dentro de una pieza enmarcada (tarjeta con `max-width`, borde y radio) que se
  lee como anuncio. Nunca un fondo ajeno a todo lo ancho, ni títulos, botones o
  íconos en el color ajeno fuera del marco. De la otra marca sólo aparecen su
  logo y sus capturas.
- **[OBLIGATORIA]** *Copy afirmativo.* El copy de STRYV afirma lo que hace. No
  responde objeciones imaginarias, no se define por lo que no es ("no somos X")
  ni usa escenarios de catástrofe.
- **[OBLIGATORIA]** Sin emojis en piezas de marca, igual que en producto.

## 6. Tipografía de marca (provisional)

| Rol | Familia | Estado |
|---|---|---|
| Titulares | Space Grotesk | **Provisional**: la actual de Landing V3 |
| Cuerpo | IBM Plex Sans | **Provisional**: la actual de Landing V3 |

- **[ADAPTABLE]** Se conserva provisionalmente la tipografía actual de Landing V3
  para landing, propuestas, presentaciones y material corporativo. La decisión
  definitiva sigue pendiente.
- **[OBLIGATORIA]** No se usa en interfaces de producto: el Product UI usa Inter
  ([product-ui-tokens.md §3](product-ui-tokens.md#3-tipografía)).
- Pesos, escala e interlíneas de marca: **sin definir**.

## 7. Pendientes de marca

| Elemento | Situación |
|---|---|
| Degradado de marca STRYV | **Sin definir.** Se usa `#07131A` sólido hasta que se apruebe. |
| Tipografía de marca definitiva, pesos y escala | **Provisional** (§6). |
| Logotipo: versiones, área de respeto y tamaño mínimo | **Sin definir.** |
| Plantillas de propuesta y presentación | **Sin definir.** |

## 8. Observado en Landing V3

Referencia del trabajo en curso de `feat/landing-v3`. Este documento no lo
modifica. Salvo el acento, ninguno de estos valores es un token del sistema, y
`#07131A` no los sustituye automáticamente (§2).

| Token observado | Valor | Relación con el sistema |
|---|---|---|
| `--accent`, `--teal`, `--lima` | `#0b7798` | = `--stryv-accent` (deberían ser alias) |
| `--bg`, `--bg2` | `#07131a` | = `--stryv-dark` |
| `--bg3` | `#0a1c27` | Propio de la landing |
| `--bg4` | `#0d2130` | Propio de la landing |
| `--bg-deep` | `#050e14` | Propio de la landing |
| `--text`, `--ink`, `--lima-text` | `#ffffff` | Propio de la landing |
| Tipografías | Space Grotesk (titulares) · IBM Plex Sans (cuerpo) | = tipografía de marca provisional (§6) |

Nota: en la landing, `--ink` vale `#ffffff`, mientras que en el Product UI la
tinta es `#0B1220`. Cuando se toque la landing conviene renombrar ese token
(`--text-on-dark` o similar) para que `ink` signifique lo mismo en los dos
sistemas. Es una recomendación, no un cambio de este documento.
