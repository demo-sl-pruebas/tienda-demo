import { Database } from 'bun:sqlite';
import type { Producto } from '../tipos';
import { PRODUCTOS_EJEMPLO } from './datos-ejemplo';
import { crearEsquema } from './esquema';

export const RUTA_BD_POR_DEFECTO = 'data/tienda.sqlite';

/** Abre la base de datos y crea las tablas si no existen. Usa ':memory:' en los tests. */
export function abrirBd(ruta: string = process.env.TIENDA_BD ?? RUTA_BD_POR_DEFECTO): Database {
  const db = new Database(ruta, { create: true, strict: true });
  db.run('PRAGMA foreign_keys = ON');
  crearEsquema(db);
  return db;
}

/** Inserta o actualiza los productos de ejemplo. Es idempotente. */
export function sembrar(db: Database, productos: Producto[] = PRODUCTOS_EJEMPLO): number {
  const insertar = db.prepare(`
    INSERT INTO productos (slug, nombre, descripcion, categoria, precio_centimos, stock)
    VALUES ($slug, $nombre, $descripcion, $categoria, $precioCentimos, $stock)
    ON CONFLICT(slug) DO UPDATE SET
      nombre = excluded.nombre,
      descripcion = excluded.descripcion,
      categoria = excluded.categoria,
      precio_centimos = excluded.precio_centimos,
      stock = excluded.stock
  `);
  db.transaction((lista: Producto[]) => {
    for (const p of lista) insertar.run({ ...p });
  })(productos);
  return productos.length;
}
