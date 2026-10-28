import type { Database } from 'bun:sqlite';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import {
  anadirAlCarrito,
  calcularTotales,
  ErrorCarrito,
  leerCarrito,
  quitarDelCarrito,
} from './carrito';
import { listarProductos, obtenerProducto } from './catalogo';
import { ESTILOS } from './estilos';
import { Catalogo } from './vistas/Catalogo';
import { FichaProducto } from './vistas/FichaProducto';
import { PaginaCarrito } from './vistas/PaginaCarrito';

const COOKIE_CARRITO = 'carrito';

type Entorno = { Variables: { carritoId: string } };

export function crearApp(db: Database) {
  const app = new Hono<Entorno>();

  // Cada visitante tiene un carrito anónimo identificado por una cookie.
  app.use('*', async (c, next) => {
    let id = getCookie(c, COOKIE_CARRITO);
    if (!id) {
      id = crypto.randomUUID();
      setCookie(c, COOKIE_CARRITO, id, { httpOnly: true, sameSite: 'Lax', path: '/' });
    }
    c.set('carritoId', id);
    await next();
  });

  app.get('/estilos.css', (c) => c.body(ESTILOS, 200, { 'Content-Type': 'text/css' }));

  // Páginas
  app.get('/', (c) => c.html(<Catalogo productos={listarProductos(db)} />));

  app.get('/productos/:slug', (c) => {
    const producto = obtenerProducto(db, c.req.param('slug'));
    if (!producto) return c.notFound();
    return c.html(<FichaProducto producto={producto} />);
  });

  app.get('/carrito', (c) => {
    const lineas = leerCarrito(db, c.get('carritoId'));
    return c.html(<PaginaCarrito lineas={lineas} totales={calcularTotales(lineas)} />);
  });

  app.post('/carrito', async (c) => {
    const form = await c.req.parseBody();
    try {
      anadirAlCarrito(db, c.get('carritoId'), String(form.slug), Number(form.cantidad ?? 1));
    } catch (error) {
      if (error instanceof ErrorCarrito) return c.text(error.message, 400);
      throw error;
    }
    return c.redirect('/carrito', 303);
  });

  // API JSON
  app.get('/api/productos', (c) => c.json({ productos: listarProductos(db) }));

  app.get('/api/productos/:slug', (c) => {
    const producto = obtenerProducto(db, c.req.param('slug'));
    return producto ? c.json(producto) : c.json({ error: 'Producto no encontrado' }, 404);
  });

  app.get('/api/carrito', (c) => {
    const lineas = leerCarrito(db, c.get('carritoId'));
    return c.json({ lineas, totales: calcularTotales(lineas) });
  });

  app.post('/api/carrito/lineas', async (c) => {
    const cuerpo = await c.req.json<{ slug?: unknown; cantidad?: unknown }>();
    try {
      anadirAlCarrito(db, c.get('carritoId'), String(cuerpo.slug), Number(cuerpo.cantidad ?? 1));
    } catch (error) {
      if (error instanceof ErrorCarrito) return c.json({ error: error.message }, 400);
      throw error;
    }
    const lineas = leerCarrito(db, c.get('carritoId'));
    return c.json({ lineas, totales: calcularTotales(lineas) }, 201);
  });

  app.delete('/api/carrito/lineas/:slug', (c) => {
    quitarDelCarrito(db, c.get('carritoId'), c.req.param('slug'));
    return c.body(null, 204);
  });

  return app;
}
