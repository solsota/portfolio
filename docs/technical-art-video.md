# Technical Art: reproducción del video

El reproductor ofrece primero HLS nativo para Safari/iPad y luego MP4/H.264 para
los demás motores. Detecta la API de presentación nativa de WebKit, porque algunos
Chromium informan soporte HLS con `canPlayType` pero no avanzan la reproducción.
No requiere una biblioteca de streaming.
Conserva controles, reproducción inline y carga a pedido (`preload="none"`). Si
falla el streaming se intenta el MP4 una vez; si tampoco carga se ofrece un enlace
directo al video.

La prueba del MP4 publicado en Firebase devolvió HTTP 200 y el archivo completo
ante solicitudes `Range: bytes=0-1023` y `Range: bytes=0-1`. Apple requiere soporte
de rangos para servir archivos de video directamente en iOS. El HLS evita esa
dependencia mediante archivos MPEG-TS independientes que se descargan completos.

- MP4: `public/projects/technical-art/environment.mp4`, H.264 High 5.1, yuv420p,
  2560 × 1440, 60 fps, CRF 16, preset medium, metadatos `faststart`.
- Audio AAC-LC: copiado del original sin recodificar.
- HLS VOD: `public/projects/technical-art/stream/index.m3u8`, segmentos en
  fotogramas clave de aproximadamente 4 segundos. Se empaquetó copiando los
  streams del MP4 compatible, sin una segunda compresión. Los nombres de los
  segmentos incluyen un hash del contenido del MP4.
- Original HEVC: conservado sin cambios en
  `.image-originals/public/projects/technical-art/environment-hevc.mp4`; el MOV
  original del usuario también sigue archivado.

La copia H.264 utiliza compresión de alta calidad y no es matemáticamente sin
pérdida. Mantiene las dimensiones, la frecuencia de cuadros y todos los cuadros;
no se reemplaza ni modifica el original archivado.

Firebase tiene tipos MIME explícitos para las listas y los segmentos. Las listas
se revalidan y los segmentos se pueden cachear durante una hora. Un cambio de
contenido debe generar nuevos nombres de segmentos y actualizar la lista.

Comprobar reproducción, búsqueda, formatos y fallback en WebKit y Chromium antes
de publicar. La emulación de iPad no sustituye una prueba física en el dispositivo.
No publicar sin un pedido explícito del usuario.

Referencias oficiales:

- https://developer.apple.com/documentation/webkit/delivering-video-content-for-safari
- https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/CreatingVideoforSafarioniPhone/CreatingVideoforSafarioniPhone.html
