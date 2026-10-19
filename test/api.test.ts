import { describe, expect, test } from 'bun:test';
import { crearApp } from '../src/app';
import { bdDePrueba } from './ayudas';

function nuevaApp() {
  return crearApp(bdDePrueba());
}

describe('API JSON', () => {
  test('GET /api/productos devuelve el catálogo', async () => {
    const res = await nuevaApp().request('/api/productos');
    expect(res.status).toBe(200);
    const { productos } = (await res.json()) as { productos: unknown[] };
    expect(productos).toHaveLength(5);
  });

  test('GET /api/productos/:slug responde 404 si no existe', async () => {
    const res = await nuevaApp().request('/api/productos/no-existe');
    expect(res.status).toBe(404);
  });

  test('el carrito se guarda por cookie', async () => {
    const app = nuevaApp();
    const cookie = 'carrito=prueba-1';
    const alta = await app.request('/api/carrito/lineas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ slug: 'plato-llano-arena', cantidad: 3 }),
    });
    expect(alta.status).toBe(201);

    const res = await app.request('/api/carrito', { headers: { Cookie: cookie } });
    const cuerpo = (await res.json()) as { totales: { totalCentimos: number } };
    expect(cuerpo.totales.totalCentimos).toBe(6600);

    const baja = await app.request('/api/carrito/lineas/plato-llano-arena', {
      method: 'DELETE',
      headers: { Cookie: cookie },
    });
    expect(baja.status).toBe(204);
  });

  test('devuelve 400 con un mensaje si no hay stock', async () => {
    const res = await nuevaApp().request('/api/carrito/lineas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'cuenco-olivo', cantidad: 1 }),
    });
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toContain('Cuenco Olivo');
  });
});
