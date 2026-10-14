import type { Child } from 'hono/jsx';

export function Plantilla({ titulo, children }: { titulo: string; children: Child }) {
  return (
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${titulo} · Cerámica Demo`}</title>
        <link rel="stylesheet" href="/estilos.css" />
      </head>
      <body>
        <header class="cabecera">
          <a href="/" class="marca">
            Cerámica Demo
          </a>
          <nav aria-label="Principal">
            <a href="/">Catálogo</a> · <a href="/carrito">Carrito</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer class="pie">Cerámica Demo · Hecho a mano en un taller ficticio</footer>
      </body>
    </html>
  );
}
