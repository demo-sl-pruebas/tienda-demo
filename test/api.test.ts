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

});
