# Portfolio de Sol Masetti

## Subir cambios a GitHub

Instalar Git LFS (`brew install git-lfs` en macOS), configurar el nombre y correo
de Git y autenticarse en GitHub. Para subir todos los cambios no ignorados:

```sh
npm run github -- "Descripción de los cambios"
```

El comando ejecuta lint, las pruebas existentes y el build optimizado con el
control de tamaño. Si todos los pasos pasan, agrega los cambios, crea un commit
y sube la rama actual a `origin`. Los videos y segmentos de streaming se guardan
completos en Git LFS. Si falla un paso, se detiene; si el commit ya existe,
vuelve a intentar la subida.

Para clonar el proyecto con sus videos, ejecutar `git lfs install` antes de
`git clone` y luego `git lfs pull` dentro del repositorio. Instalar las
dependencias con `npm ci` y usar `npm run dev` para desarrollo local.

El build local se genera con `npm run build:optimized`. Los archivos de `dist/`,
las dependencias y los originales archivados quedan fuera de Git.
La publicación en Firebase se realiza por separado con `npm run deploy`, sólo
ante un pedido explícito. Ver [instrucciones de publicación](docs/deployment.md).

## Referencias de la plantilla React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
