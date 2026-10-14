import type { Producto } from '../tipos';

/** Catálogo de ejemplo. Los precios incluyen IVA. */
export const PRODUCTOS_EJEMPLO: Producto[] = [
  {
    slug: 'taza-terra',
    nombre: 'Taza Terra',
    descripcion: 'Taza de gres esmaltada a mano, 300 ml.',
    categoria: 'tazas',
    precioCentimos: 1450,
    stock: 24,
  },
  {
    slug: 'taza-mar',
    nombre: 'Taza Mar',
    descripcion: 'Taza con esmalte azul cobalto, 250 ml.',
    categoria: 'tazas',
    precioCentimos: 1600,
    stock: 12,
  },
  {
    slug: 'plato-llano-arena',
    nombre: 'Plato llano Arena',
    descripcion: 'Plato llano de 27 cm, apto para lavavajillas.',
    categoria: 'platos',
    precioCentimos: 2200,
    stock: 30,
  },
  {
    slug: 'cuenco-olivo',
    nombre: 'Cuenco Olivo',
    descripcion: 'Cuenco de 15 cm con esmalte verde oliva.',
    categoria: 'cuencos',
    precioCentimos: 1800,
    stock: 0,
  },
  {
    slug: 'jarron-alto-cal',
    nombre: 'Jarrón alto Cal',
    descripcion: 'Jarrón de 32 cm, acabado mate.',
    categoria: 'decoracion',
    precioCentimos: 4900,
    stock: 5,
  },
];
