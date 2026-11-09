# tienda-demo

Tienda online de Cerámica Demo: catálogo de productos, ficha de producto y carrito.
Páginas renderizadas en servidor con Hono JSX y una pequeña API JSON. Base de datos SQLite con `bun:sqlite`.

## Comandos

- Instalar: `bun install --frozen-lockfile` (Bun 1.4.2, fijado en `mise.toml` y en `packageManager`)
- Cargar datos de ejemplo: `bun run db:seed` (crea `data/tienda.sqlite`; es idempotente)
- Servidor de desarrollo: `bun run dev` → http://localhost:3000 (variable `PORT` para cambiarlo)
- Lint y formato: `bun run lint` (Biome) · corregir: `bun run format`
- Tipos: `bun run typecheck`
- Tests: `bun test`

Antes de dar un cambio por terminado, pasa `bun run lint`, `bun run typecheck` y `bun test`.

## Estructura

- `src/app.tsx` — rutas: páginas (`/`, `/productos/:slug`, `/carrito`) y API (`/api/...`).
- `src/vistas/` — componentes JSX de las páginas. Todo el texto visible está en español.
- `src/catalogo.ts`, `src/carrito.ts` — lógica de negocio y consultas SQL.
- `src/db/` — esquema, apertura de la base de datos y datos de ejemplo.
- `test/` — tests con `bun:test`; usan una base de datos en memoria (`bdDePrueba()`).

## Convenciones

- Código y nombres en español (dominio de la tienda); TypeScript estricto.
- Los importes son siempre enteros en céntimos; se formatean con `formatearPrecio`.
- SQL siempre con parámetros, nunca concatenando valores.
- Cada ruta nueva lleva su test en `test/`.
- Ramas `feat/<slug>` o `fix/<slug>`, Conventional Commits, PR a `main` con squash merge (ver CONTRIBUTING.md).

## No hacer

- No subir `data/*.sqlite` ni ficheros `.env`.
- No añadir dependencias sin consultarlo.
- No editar `bun.lock` a mano.
