# Publicación en Firebase

Proyecto y sitio de Hosting: `portfoliosol`. URL: https://portfoliosol.web.app

```sh
npm ci
npx firebase login
npm run deploy
```

`npm run deploy` publica únicamente Hosting. No se necesita añadir el SDK de Firebase al navegador para servir este portfolio.

El hook `predeploy` de `firebase.json` ejecuta `npm run build:optimized`, incluso si se usa directamente `firebase deploy`:

1. Convierte las imágenes raster a WebP **sin pérdida (lossless)**, manteniendo resolución original, proporciones, transparencia y calidad visual. Conserva originales fuera de `src`, `public` y `dist`, en `.image-originals/` (ignorado por Git). Las imágenes ya optimizadas se omiten para evitar recompresión repetida.
   Los GIFs se convierten a WebP animado conservando todos los cuadros, su duración y el bucle.
2. Convierte también la textura incrustada del modelo GLB a WebP sin pérdida y a resolución original, manteniendo sus mallas e interacción.
3. Compila producción y verifica los archivos resultantes. Rechaza PNG/JPEG publicados o archivos que sólo tengan extensión WebP.
4. Bloquea la publicación si la suma del código **HTML + CSS + JavaScript + WebAssembly**, comprimido por archivo con gzip, supera **2.000.000 bytes**. Incluye todas las rutas y módulos diferidos. Informa también Brotli, código sin comprimir, imágenes y otros recursos; estos últimos no consumen el presupuesto de código. Firebase Hosting aplica gzip/Brotli al servir los archivos.

El informe detallado queda en `dist/size-report.json` y no se publica. Se puede repetir con `npm run check:size`. Las imágenes se pueden optimizar sin publicar con `npm run optimize:images`.

Después de una publicación exitosa, `postdeploy` compara la página publicada con el build local. Sólo si coinciden configura `retainedReleaseCount: 1` en el canal `live` y elimina versiones finalizadas anteriores que no estén activas en ningún canal. Se detiene si cambia la versión activa durante la limpieza. No borra versiones en preparación ni despliegues concurrentes más nuevos.

Firebase puede tardar hasta 24 horas en liberar el contenido eliminado. Los registros históricos de las releases pueden seguir visibles aunque su contenido se haya eliminado. Las versiones que estén activas en otros canales se protegen.

`firebase-tools` está fijado a una versión concreta porque el script de limpieza reutiliza su cliente autenticado. Al actualizarlo, ejecutar `npm run test:deploy` y verificar el script antes de publicar.

Fuentes: [compresión de Firebase Hosting](https://firebase.google.com/docs/hosting/), [gestión de releases y retención](https://firebase.google.com/docs/hosting/manage-hosting-resources), [API del canal](https://firebase.google.com/docs/reference/hosting/rest/v1beta1/sites.channels/patch).
