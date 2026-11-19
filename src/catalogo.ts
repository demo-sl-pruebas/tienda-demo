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

export function listarProductos(db: Database, categoria?: string): Producto[] {
  if (categoria) {
    return db
      .query<FilaProducto, [string]>('SELECT * FROM productos WHERE categoria = ? ORDER BY nombre')
      .all(categoria)
      .map(aProducto);
  }
  return db
    .query<FilaProducto, []>('SELECT * FROM productos ORDER BY categoria, nombre')
    .all()
    .map(aProducto);
}

export function listarCategorias(db: Database): string[] {
  return db
    .query<{ categoria: string }, []>('SELECT DISTINCT categoria FROM productos ORDER BY categoria')
    .all()
    .map((f) => f.categoria);
}

export function obtenerProducto(db: Database, slug: string): Producto | undefined {
  const fila = db.query<FilaProducto, [string]>('SELECT * FROM productos WHERE slug = ?').get(slug);
  return fila ? aProducto(fila) : undefined;
}
