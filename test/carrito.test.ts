import { describe, expect, test } from 'bun:test';
import {
  anadirAlCarrito,
  COSTE_ENVIO_CENTIMOS,
  calcularTotales,
  ErrorCarrito,
  leerCarrito,
} from '../src/carrito';
import { obtenerProducto } from '../src/catalogo';
import { bdDePrueba } from './ayudas';

describe('calcularTotales', () => {
  const db = bdDePrueba();
  const taza = obtenerProducto(db, 'taza-terra');
  if (!taza) throw new Error('falta el producto de ejemplo');

  test('un carrito vacío no paga envío', () => {
    expect(calcularTotales([])).toEqual({
      subtotalCentimos: 0,
      envioCentimos: 0,
      totalCentimos: 0,
      unidades: 0,
    });
  });

  test('por debajo de 60 € se cobra el envío', () => {
    const t = calcularTotales([{ producto: taza, cantidad: 2 }]);
    expect(t.envioCentimos).toBe(COSTE_ENVIO_CENTIMOS);
    expect(t.totalCentimos).toBe(2900 + COSTE_ENVIO_CENTIMOS);
  });

});

describe('anadirAlCarrito', () => {
  test('acumula unidades del mismo producto', () => {
    const db = bdDePrueba();
    anadirAlCarrito(db, 'c1', 'taza-mar', 1);
    anadirAlCarrito(db, 'c1', 'taza-mar', 2);
    expect(leerCarrito(db, 'c1')).toMatchObject([{ producto: { slug: 'taza-mar' }, cantidad: 3 }]);
  });

  test('no permite productos agotados', () => {
    const db = bdDePrueba();
    expect(() => anadirAlCarrito(db, 'c1', 'cuenco-olivo', 1)).toThrow(ErrorCarrito);
  });

  test('rechaza cantidades no válidas', () => {
    const db = bdDePrueba();
    expect(() => anadirAlCarrito(db, 'c1', 'taza-mar', 0)).toThrow(ErrorCarrito);
  });
});
