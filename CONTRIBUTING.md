# Cómo contribuir a tienda-demo

Trabajamos con **GitHub Flow**: `main` es la única rama permanente y siempre se puede desplegar.

## Ramas

- Crea tu rama desde `main` actualizada.
- Nombres: `feat/<slug>` para funcionalidades y `fix/<slug>` para correcciones, en minúsculas y con guiones
  (`feat/filtro-por-categoria`, `fix/envio-gratis-60`).
- Nada de ramas de larga duración: si algo tarda más de unos días, divídelo.

## Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/) en español:
`feat: añadir página del carrito`, `fix: el envío gratuito empieza en 60 € exactos`,
`docs: …`, `test: …`, `chore: …`, `ci: …`, `refactor: …`.

## Pull requests

1. Abre un PR contra `main` y rellena la plantilla.
2. El título del PR debe seguir Conventional Commits: al fusionar se usa como mensaje del commit.
3. Tienen que pasar las comprobaciones `lint`, `typecheck` y `test`, y hace falta una aprobación.
4. Se fusiona **solo con «Squash and merge»**; la rama se borra después.

## Despliegue

Cada push a `main` lanza el flujo `Deploy` (de momento simulado) hacia producción.
Las versiones se marcan con etiquetas anotadas `vX.Y.Z` en `main`.

## Puesta en marcha

```sh
mise install          # instala la versión de Bun fijada en mise.toml
bun install
bun run db:seed       # crea data/tienda.sqlite con el catálogo de ejemplo
bun run dev           # http://localhost:3000 (cambia el puerto con PORT=…)
```
