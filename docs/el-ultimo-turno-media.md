# El Último Turno

Página: `/work/elultimoturno` (inglés por defecto) y `/es/work/elultimoturno`.

La página usa el banner y la insignia de EVA de `public/ultimoturno`. Accordion Gallery proviene de React Bits; licencia en `src/vendor/react-bits/LICENSE.md`.

Los siete GIFs recibidos se convirtieron a WebP animado sin pérdida, preservando resolución, cuadros, velocidad y bucle:

| Original | WebP publicado | Ubicación |
| --- | --- | --- |
| Home Gif.gif | main-menu.webp | Diseño de UI/UX |
| Clean GIF.gif | cleaning-gameplay.webp | HUD y mecánica de limpieza |
| Arms mop gif.gif | mop-animation.webp | Contribución y galería de animación |
| Pilar GIF.gif | pilar-rigging.webp | Accordion Gallery |
| Sombra GIF.gif | sombra-animation.webp | Accordion Gallery |
| Sombra shader GIF.gif | creature-shadow.webp | Shader de Sombra |
| Sombra desintegration gif.gif | enemy-disintegration.webp | Shader de desintegración |

Faltan las animaciones de servido de cerveza y whisky. Sus espacios están reservados sin solicitudes a archivos inexistentes. Al recibirlas, convertir primero a WebP animado sin pérdida y completar `beer` y `whisky` en `src/data/ultimoTurno.js`.

La configuración de imágenes, textos y animaciones está centralizada en ese archivo. El selector de mecánicas admite clic, toque y teclado; Accordion Gallery admite hover, toque y teclado y se adapta verticalmente a celular.
