import type { Database } from 'bun:sqlite';
import { Hono } from 'hono';
import { listarProductos, obtenerProducto } from './catalogo';
import { ESTILOS } from './estilos';
import { Catalogo } from './vistas/Catalogo';
import { FichaProducto } from './vistas/FichaProducto';

export function crearApp(db: Database) {
  const app = new Hono();

  app.get('/estilos.css', (c) => c.body(ESTILOS, 200, { 'Content-Type': 'text/css' }));

  // Páginas
  app.get('/', (c) => c.html(<Catalogo productos={listarProductos(db)} />));

  app.get('/productos/:slug', (c) => {
    const producto = obtenerProducto(db, c.req.param('slug'));
    if (!producto) return c.notFound();
    return c.html(<FichaProducto producto={producto} />);
  });

  // API JSON
  app.get('/api/productos', (c) => c.json({ productos: listarProductos(db) }));

  app.get('/api/productos/:slug', (c) => {
    const producto = obtenerProducto(db, c.req.param('slug'));
    return producto ? c.json(producto) : c.json({ error: 'Producto no encontrado' }, 404);
  });

  return app;
}
