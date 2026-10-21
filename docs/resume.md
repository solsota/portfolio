# Currículums

Los PDF finales están en `public/cv/`:

- `Sol_Masetti_CV_Harvard_EN.pdf`: inglés.
- `Sol_Masetti_CV_Harvard_ES.pdf`: español.

La sección CV, anterior al footer, descarga el documento del idioma activo y lo
guarda como `sol-masetti-cv-en.pdf` o `sol-masetti-cv-es.pdf`. La asignación está en
`src/data/resume.js`. Reemplazar los documentos conservando sus nombres para
actualizar el contenido; si cambia un nombre, actualizar también esa asignación.

Probar las descargas en ambos idiomas. Publicar sólo ante un pedido explícito del
usuario y, en ese caso, mediante `npm run deploy`.
