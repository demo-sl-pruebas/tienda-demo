import type { Database } from 'bun:sqlite';

export function crearEsquema(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      slug TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      categoria TEXT NOT NULL,
      precio_centimos INTEGER NOT NULL CHECK (precio_centimos > 0),
      stock INTEGER NOT NULL DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS lineas_carrito (
      carrito_id TEXT NOT NULL,
      producto_slug TEXT NOT NULL REFERENCES productos(slug),
      cantidad INTEGER NOT NULL CHECK (cantidad > 0),
      PRIMARY KEY (carrito_id, producto_slug)
    )
  `);
}
