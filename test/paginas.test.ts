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

  test('añadir desde el formulario redirige al carrito con el total', async () => {
    const app = crearApp(bdDePrueba());
    const cookie = 'carrito=prueba-2';
    const alta = await app.request('/carrito', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: new URLSearchParams({ slug: 'jarron-alto-cal', cantidad: '1' }),
    });
    expect(alta.status).toBe(303);
    const html = texto(
      await (await app.request('/carrito', { headers: { Cookie: cookie } })).text(),
    );
    expect(html).toContain('Jarrón alto Cal');
    expect(html).toContain('53,95 €');
  });
});
