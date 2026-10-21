# Preferencias del proyecto

- Toda imagen raster que se incorpore o se utilice en el sitio debe convertirse previamente a **WebP sin pérdida (lossless)** antes de referenciarla en el código. Mantener su resolución original, proporciones, transparencia y calidad visual. No reducir dimensiones ni usar compresión con pérdida para cumplir un presupuesto de peso sin autorización explícita del usuario.
- Usar también WebP para nuevas variantes de tamaño; no publicar originales PNG/JPEG ni dejarlos como descargas alternativas.
- Mantener los íconos vectoriales del sistema de interfaz como SVG/Lucide.
- Convertir también los GIFs a WebP animado sin pérdida, conservando todos los cuadros, su duración, el bucle y la resolución original.
- **Nunca publicar ni desplegar la página sin un pedido explícito del usuario.** Los pedidos de cambios, arreglos, pruebas o builds se realizan sólo en local y no autorizan una publicación. Una autorización de publicación anterior no se extiende a cambios futuros.
- Cuando el usuario pida explícitamente publicar, usar `npm run deploy`: optimizar primero y bloquear la publicación si el código de producción supera 2 MB comprimidos (HTML, CSS, JavaScript y WebAssembly, sumados; las imágenes y fuentes se informan aparte).
- En Firebase Hosting conservar únicamente la versión activa del sitio `portfoliosol`; eliminar versiones anteriores sólo después de verificar una publicación exitosa y proteger cualquier versión activa en otro canal.
