# STRYV Studio · Design System

Sistema visual oficial de STRYV Studio. Es la referencia común para ADMINSTRYV,
CuboPolar, SALA, STRYV Restaurant y los productos que vengan.

Estado: **estándar aprobado** (DS-01C). Listo para adopción en ADMINSTRYV.

## Decisiones aprobadas (DS-01C)

| Decisión | Valor | Detalle |
|---|---|---|
| Acento STRYV | `#0B7798` | [brand-tokens.md §1](brand-tokens.md#1-acento-corporativo-oficial) |
| Superficie oscura de marca STRYV | `#07131A`, para superficies corporativas oscuras | [brand-tokens.md §2](brand-tokens.md#2-superficie-oscura-de-marca) |
| Acción primaria de producto | `#0B1220` (tinta) | [product-ui-tokens.md §1](product-ui-tokens.md#1-neutros) |
| Éxito | `#059669` | [product-ui-tokens.md §2](product-ui-tokens.md#2-semánticos) |
| Toast de éxito | emerald-700 `#047857` | [product-ui-tokens.md §2](product-ui-tokens.md#2-semánticos) |
| Acento suave | `#0B7798` al 10 %, sujeto a contraste accesible | [brand-tokens.md §4](brand-tokens.md#4-derivados-del-acento) |
| Radios principales | 14, 20, 28 y 999 px; las excepciones se conservan cuando el componente las requiere | [product-ui-tokens.md §5](product-ui-tokens.md#5-radios) |
| Sombras | Las cuatro del estándar: dos principales y dos específicas | [product-ui-tokens.md §6](product-ui-tokens.md#6-sombras) |
| Tipografía Product UI | Inter | [product-ui-tokens.md §3](product-ui-tokens.md#3-tipografía) |
| Tipografía de marca | Provisional: la actual de Landing V3 (Space Grotesk + IBM Plex Sans) | [brand-tokens.md §6](brand-tokens.md#6-tipografía-de-marca-provisional) |

Los valores de componentes que el estándar no establece siguen **sin definir**
a propósito (lista en [§ Pendientes](#pendientes)).

## Identidad STRYV vs identidades de clientes

| | Productos y material de STRYV | Productos de clientes |
|---|---|---|
| Ejemplos | Landing, propuestas, presentaciones, uniformes, ADMINSTRYV | CuboPolar, SALA, STRYV Restaurant |
| Acento | `#0B7798` | El del cliente |
| Superficie oscura de marca | `#07131A` | La del cliente |
| Neutros, semánticos, tipografía, radios, sombras, movimiento y componentes de producto | Product UI System | Product UI System |
| Presencia de STRYV en la interfaz | Total | Ninguna, salvo una firma "Hecho por STRYV" si el cliente la acepta |

El Product UI System es común a todos; la identidad es de cada dueño.

## Dos sistemas, una casa

| Sistema | Para qué | Documento |
|---|---|---|
| **STRYV Brand System** | Landing, propuestas comerciales, presentaciones, material corporativo y uniformes. | [brand-tokens.md](brand-tokens.md) |
| **STRYV Product UI System** | Sistemas administrativos, ERP, POS, CRM y aplicaciones operativas. | [product-ui-tokens.md](product-ui-tokens.md), [components.md](components.md), [mobile-accessibility.md](mobile-accessibility.md) |

El **Product UI System** toma como base el estándar visual de CuboPolar
(aprobado como referencia). Ese estándar define los neutros, los semánticos, la
tipografía, los radios, las sombras, el movimiento y los componentes. **No**
define colores de marca: cada producto pone los suyos.

Los productos de clientes conservan su identidad propia. El Product UI System
fija *cómo* se construye la interfaz, no *de qué color es la marca del cliente*.

## Acento corporativo oficial

```css
--stryv-accent: #0B7798;
```

Es el color del logotipo de los uniformes. Es invariable: no se sustituye por
otro azul, ni se "ajusta" por pantalla o por producto. Se aplica en todo el
Brand System y como acento de los productos propios de STRYV (por ejemplo,
ADMINSTRYV). Detalle en [brand-tokens.md](brand-tokens.md).

## Clasificación de reglas

Cada regla de estos documentos lleva una etiqueta:

| Etiqueta | Significado |
|---|---|
| **[OBLIGATORIA]** | Igual en todos los productos. No se negocia por proyecto. Cambiarla requiere cambiar este sistema. |
| **[ADAPTABLE]** | El principio es obligatorio, pero el valor concreto, el rango o la implementación pueden ajustarse al stack o al producto, dentro de los límites indicados. |
| **[PRODUCTO]** | Lo define cada producto (marca, acento, textos de dominio). El sistema sólo dice *dónde* va. |

Cuando un valor no existe en la fuente ni en las decisiones aprobadas, figura como **sin definir**. No se
rellenó con valores supuestos.

## Fuente de autoridad

- **Product UI System:** `tips-visuales-cubopolar.md` (estándar de CuboPolar,
  extraído de `src/index.css`, `tailwind.config.js`, `src/components/ui/*` y
  `docs/sistema/diseno.md` de CuboPolar). Todos los valores numéricos de
  [product-ui-tokens.md](product-ui-tokens.md), [components.md](components.md) y
  [mobile-accessibility.md](mobile-accessibility.md) vienen de ahí.
- **Brand System:** decisión oficial de marca (`#0B7798`), decisiones aprobadas
  en DS-01C y las reglas de marca ya establecidas por el propietario para la
  landing.

Valores **derivados** (por ejemplo, el acento al 15 % expresado en `rgba`) se
marcan como tales: son el cálculo directo de una regla de la fuente, no un valor
nuevo.

Las equivalencias hexadecimales de clases de Tailwind (`emerald-50`, etc.) se
dan con la paleta por defecto de **Tailwind v3**, que es la que nombra la
fuente. Si un producto usa otra versión de Tailwind, manda el hexadecimal de
este documento.

## Índice

1. [brand-tokens.md](brand-tokens.md): acento oficial, superficie oscura, acento suave, tipografía de marca provisional, reglas de marca y pendientes.
2. [product-ui-tokens.md](product-ui-tokens.md): neutros, semánticos, tipografía, radios, sombras, movimiento e iconografía.
3. [components.md](components.md): shell (cabecera, menú, barra inferior), componentes canónicos, Modal/BottomSheet y jerarquía de contenido.
4. [mobile-accessibility.md](mobile-accessibility.md): reglas mobile-first, tamaños táctiles, safe-areas, accesibilidad, y pruebas y criterios de calidad.
5. [adoption-guide.md](adoption-guide.md): cómo adoptar el sistema de forma progresiva en proyectos existentes.

## Principios en una línea

- El lienzo es neutro; el color vive sólo en la marca, el acento y los semánticos.
- El botón primario es tinta, no marca.
- Una primitiva por pieza; nada "a mano" en las vistas.
- Se diseña para 390 px y el pulgar; el escritorio escala sin cambiar de lenguaje.
- Cada estado del negocio tiene un nombre y un color en todo el sistema.
- Las vistas usan tokens con nombre, nunca valores sueltos.

## Pendientes

Sin definir a propósito: ni el estándar de CuboPolar ni las decisiones
aprobadas los establecen.

| Pendiente | Dónde |
|---|---|
| Degradado de marca STRYV (el estándar habla de "degradado de marca" en el menú; hoy se usa `#07131A` sólido) | [brand-tokens.md §7](brand-tokens.md#7-pendientes-de-marca) |
| Tipografía de marca definitiva | [brand-tokens.md §6](brand-tokens.md#6-tipografía-de-marca-provisional) |
| Logotipo: versiones, área de respeto, tamaño mínimo | [brand-tokens.md §7](brand-tokens.md#7-pendientes-de-marca) |
| Plantillas de propuesta y presentación | [brand-tokens.md §7](brand-tokens.md#7-pendientes-de-marca) |
| Variante `warning` de FormBtn (sólida o tintada) | [components.md](components.md#formbtn) |
| Radio y padding de KpiTile; padding por defecto de Card | [components.md](components.md#kpitile) |
| Sombra mínima de la píldora activa de SegmentedTabs | [product-ui-tokens.md §6](product-ui-tokens.md#6-sombras) |
| Animación y sombra del diálogo de escritorio (propuesta pendiente de confirmar) | [components.md](components.md#modal--bottomsheet-en-móvil--diálogo-en-escritorio) |
