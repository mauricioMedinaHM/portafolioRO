# Dirección de diseño "Pop al aire" (landing)

Reemplaza a "Claro y limpio". Referencia visual elegida por el cliente: estética "Solar Pop" (crema, naranja sol, rosa; titulares grotescos en mayúsculas con una palabra manuscrita; formas orgánicas; tarjetas redondeadas). Adaptada a una comunicadora: el vocabulario visual sale de la TV y la radio (arco de estudio, rayos de luz, insignia "Al aire · desde Salta", sol con micrófono).

Los componentes base (Sheet, Modal, QR, toasts) usan los tokens `paper/ink`; la landing los re-mapea con `data-theme="pop"` en `app/page.tsx` (`body:has([data-theme="pop"])`) para que alcance también a los portales.

## Paleta (app/globals.css)

Marca: **Ultramarine #290087 · Periwinkle #CAC5E5 · Amethyst #A230A4 · Honeydew #F6FFE9**.

- Honeydew: fondo de página (`cream`). Ultramarine: texto, titulares, botones, labels y foco (`cocoa`, `sun-deep`, `rose-deep`); `cocoa-2` #4B2FBE es el texto secundario (≥4.5 sobre Honeydew, Vanilla y Periwinkle).
- Amethyst: rellenos, formas, íconos en círculo, botón de play, Instagram, barra de progreso (`sun`, `amber`). Periwinkle: arco del hero, formas, paneles y etiquetas (`candy`, `rose`).
- Paneles y bordes: `peach` (Vanilla Custard #F2E0A4), `blush` #DCD8F1 (tinte Periwinkle), `candy`/`rose` (Periwinkle #CAC5E5), bordes `sand` #BFB8DD y `seam` #E0CD8C.
- La banda "Trabajos destacados" va en Ultramarine con texto Honeydew.

Contraste (`lib/contrast.test.ts`): Amethyst sobre Honeydew da 5.84, así que sólo va como **texto grande** (`rose-ink`, la palabra manuscrita) o como relleno con texto Honeydew encima — nunca texto Ultramarine sobre Amethyst (2.42). Los titulares son Ultramarine (`cocoa`, 14.13 sobre Honeydew).

## Tipografía (autohospedada con @fontsource)

- Display: Bricolage Grotesque Variable 800, mayúsculas, tracking -0.02em (`.font-pop`). Hero 64→112, h2 34→52.
- Script: Mr Dafoe (`.font-script`), siempre una palabra o frase corta en rose-ink, dentro del h2 o h1.
- Texto: Hanken Grotesk; labels en `pop-label` (12px, bold, tracking 0.14em).

## Estructura de la landing

Nav (logo en dos líneas, links en desktop y "Menú" en mobile, CTA "Hablemos") → Hero "Contar lo que pasa *en vivo*" + foto en ventana de arco → "Hola, soy Rosario" (bio, firma, áreas) → banda naranja "Trabajos destacados" (una tarjeta por área) → "Lo que hago" + "En números" (las cifras se calculan desde el contenido publicado, sin datos inventados) → secciones por categoría (videos + tarjetas de experiencia) → Trayectoria y formación + habilidades → Compartí (QR) → Hablemos (mail, Instagram, WhatsApp) → footer. Todo el contenido sale de `contenido.ts`.

Sin testimonios: no hay citas reales. Si la clienta consigue alguna, va entre Trayectoria y Compartí.

## Motion

- **Momento focal "Al aire"** (hero, CSS `@keyframes`, corre antes de hidratar; el estado final es el visible): las líneas del titular suben desde una máscara (stagger 90ms), la palabra script se "escribe" con `clip-path`, el arco de la foto se abre de abajo hacia arriba, y los destellos aparecen con un rebote leve.
- **Scroll (Motion)**: parallax de la foto y las formas del hero, la insignia gira con el scroll, la flor de "En números" rota, barra de progreso naranja de 3px bajo el header, y el header se vuelve translúcido.
- **Feedback**: las tarjetas de trabajos suben 6px y la flecha gira 45° al hover; `whileTap` en tarjetas, botones y FAB; fundido de miniatura a iframe en los videos.
- **FAB de WhatsApp contextual**: aparece después del primer pantallazo y se oculta en `#contacto`.

Reglas: contenido siempre visible en SSR (nunca `opacity:0` inicial renderizado en el servidor); `MotionConfig reducedMotion="user"`; con `prefers-reduced-motion` se quitan los keyframes, el giro y el movimiento; ease `cubic-bezier(0.16, 1, 0.3, 1)`; íconos de lucide (sin glifos unicode).
