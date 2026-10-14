import { describe, expect, test } from 'bun:test';
import { crearApp } from '../src/app';
import { bdDePrueba, texto } from './ayudas';

describe('páginas', () => {
  test('el catálogo lista los productos con su precio', async () => {
    const res = await crearApp(bdDePrueba()).request('/');
    const html = texto(await res.text());
    expect(res.status).toBe(200);
    expect(html).toContain('<title>Catálogo · Cerámica Demo</title>');
    expect(html).toContain('Taza Terra');
    expect(html).toContain('14,50 €');
  });

  test('la ficha de un producto agotado no permite comprarlo', async () => {
    const res = await crearApp(bdDePrueba()).request('/productos/cuenco-olivo');
    const html = await res.text();
    expect(html).toContain('Agotado');
    expect(html).not.toContain('Añadir al carrito');
  });

});
