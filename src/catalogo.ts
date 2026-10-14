import type { Database } from 'bun:sqlite';
import type { Producto } from './tipos';

interface FilaProducto {
  slug: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio_centimos: number;
  stock: number;
}

function aProducto(fila: FilaProducto): Producto {
  return {
    slug: fila.slug,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    categoria: fila.categoria,
    precioCentimos: fila.precio_centimos,
    stock: fila.stock,
  };
}

export function listarProductos(db: Database): Producto[] {
  return db
    .query<FilaProducto, []>('SELECT * FROM productos ORDER BY categoria, nombre')
    .all()
    .map(aProducto);
}

export function obtenerProducto(db: Database, slug: string): Producto | undefined {
  const fila = db.query<FilaProducto, [string]>('SELECT * FROM productos WHERE slug = ?').get(slug);
  return fila ? aProducto(fila) : undefined;
}
