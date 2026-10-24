# Guía de adopción progresiva

Cómo llevar un producto existente al STRYV Product UI System sin reescribirlo y
sin romper producción. Aplica a ADMINSTRYV, SALA, STRYV Restaurant y a cualquier
producto nuevo. CuboPolar es el origen del estándar y sirve de referencia.

## Principios

- **[OBLIGATORIA]** Se adopta por capas y por pantalla, nunca en una sola
  entrega gigante.
- **[OBLIGATORIA]** Cada fase deja el producto publicable.
- **[OBLIGATORIA]** La marca del cliente se conserva: se migra la *estructura*
  (neutros, semánticos, tipografía, radios, sombras, movimiento, componentes),
  no su identidad. La identidad STRYV (`#0B7798`, `#07131A`) sólo se aplica a
  productos de STRYV.
- **[OBLIGATORIA]** Adoptar el sistema no cambia fondos ni tipografías de
  material de marca existente. En particular, `#07131A` no reemplaza
  automáticamente los fondos de Landing V3.
- **[ADAPTABLE]** El orden de las fases 3 a 5 puede cambiar según el dolor del
  producto; las fases 0 a 2 van siempre primero.

## Fase 0 · Inventario (sin cambios de código)

1. Crear la tarjeta de diseño del producto (equivalente a
   `docs/sistema/diseno.md`) con:
   - Ranuras de marca: acento y marca oscura del producto
     ([product-ui-tokens.md §4](product-ui-tokens.md#4-ranuras-de-marca-producto)).
   - Mapa de estados del negocio → semántico (un nombre y un color por estado).
   - Desviaciones conocidas respecto a este sistema.
2. Medir el contraste del acento del producto (tabla de
   [mobile-accessibility.md §2](mobile-accessibility.md#contraste)).
3. Contar deuda: colores escritos a mano, emojis, `window.confirm`, títulos
   repetidos, `<select>` operativos, tablas sin vista móvil, spinners de pantalla
   completa.

**Salida:** tarjeta de diseño + lista de deuda priorizada.

## Fase 1 · Tokens

1. Declarar en `:root` (y en `tailwind.config` si aplica) los neutros, los
   semánticos, los radios, las sombras y la curva de movimiento.
2. Declarar las ranuras de marca. En productos STRYV:
   `--brand-accent: var(--stryv-accent)` (`#0B7798`),
   `--brand-accent-soft: var(--stryv-accent-soft)` (`#0B7798` al 10 %) y
   `--brand-dark: var(--stryv-dark)` (`#07131A`). En productos de clientes, los
   valores del cliente, con su verificación de contraste.
3. Si el producto ya tiene nombres propios, crear **alias** que apunten a los
   valores del sistema en lugar de renombrar todo de golpe.
4. Cargar Inter (400–800) con `cv11`, `ss01`, `cv02` y `tabular-nums` en cifras.

**Riesgo:** bajo. Los tokens no cambian nada hasta que algo los usa.

## Fase 2 · Guardas de calidad

1. Añadir la suite de diseño en modo **informe** (no bloquea) con las cuatro
   comprobaciones: colores a mano, emojis, `window.confirm` y título repetido.
2. Ver la deuda real en números.
3. Activarla como **bloqueante sólo para archivos nuevos o tocados**, de modo
   que la deuda no crezca.

**Salida:** la deuda deja de aumentar desde aquí.

## Fase 3 · Primitivas

Implementar las primitivas de [components.md](components.md) en el stack del
producto, en este orden (de mayor a menor impacto):

1. FormBtn, IconButton, FormInput / FormSelect / FormTextarea.
2. Card, ListRow, StatusBadge, SectionLabel.
3. Modal / BottomSheet, ConfirmDialog (eliminar `window.confirm`), Toast.
4. KpiTile, SegmentedTabs, Chips, ChoiceButton.
5. EmptyState, Skeleton, Guia, tabla responsive.
6. Módulo único de íconos.

- **[OBLIGATORIA]** Se escriben desde la especificación. No se copian
  componentes funcionales de CuboPolar ni de otro producto de cliente.

## Fase 4 · Shell

1. Cabecera pegajosa con el título de la pantalla (y quitar los títulos
   repetidos de las vistas).
2. Menú lateral y drawer con la marca oscura del producto.
3. Barra inferior móvil (4–5 destinos + "Más").
4. Safe-areas y `viewport-fit=cover`.
5. Bienvenida por rol con la hora del negocio.
6. Mover los banners globales dentro de su módulo.
7. Login con la estructura del sistema.

## Fase 5 · Migración por pantalla

Por cada pantalla, empezando por las de más uso operativo:

1. Sustituir lo "hecho a mano" por primitivas.
2. Ordenar: KPIs → filtros → lista.
3. Acciones principales al pie pegajoso.
4. Pickers operativos a ChoiceButton.
5. Tabla → tarjetas en móvil desde el mismo componente.
6. Estados vacíos y de carga.
7. Capturas WebKit iPhone 14 y SE del rol afectado.
8. Marcar la pantalla como migrada en la tarjeta de diseño.

## Fase 6 · Cierre

- Suite de diseño bloqueante para todo el código.
- Cero deuda pendiente en la tarjeta de diseño.
- Lista de revisión de
  [mobile-accessibility.md §3](mobile-accessibility.md#lista-de-revisión-antes-de-publicar)
  superada para cada rol.

## Por producto

| Producto | Marca | Punto de partida |
|---|---|---|
| CuboPolar | Propia del cliente | Origen del estándar. Sirve de referencia. |
| ADMINSTRYV | STRYV: acento `#0B7798`, acento suave al 10 %, superficie oscura `#07131A` | **No se modifica todavía.** Cuando se autorice: Fase 0. Ranuras de marca ya resueltas (degradado sin definir: se usa `#07131A` sólido). |
| SALA Studio | Propia | Fase 0 cuando se autorice. |
| STRYV Restaurant | Propia | Fase 0 cuando se autorice. |
| Productos nuevos | STRYV o cliente | Nacen en el sistema: fases 1–4 desde el primer commit. |

Los datos de marca de cada producto de cliente no se fijan en este documento: se
registran en la tarjeta de diseño de cada producto.

## Cómo se cambia este sistema

- Una regla **[OBLIGATORIA]** sólo cambia en este repositorio
  (`docs/design-system/`), con revisión, y se propaga a todos los productos.
- Una regla **[ADAPTABLE]** se ajusta en la tarjeta de diseño del producto,
  dejando constancia del valor elegido.
- Lo **[PRODUCTO]** vive sólo en el producto.
- Si un producto descubre un patrón nuevo útil para todos, se propone aquí antes
  de copiarlo a otro producto.
