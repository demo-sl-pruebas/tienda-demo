import type { Database } from 'bun:sqlite';
import { obtenerProducto } from './catalogo';
import type { LineaCarrito } from './tipos';

/** A partir de este subtotal (incluido) el envío es gratuito. */
export const ENVIO_GRATIS_DESDE_CENTIMOS = 6000;
export const COSTE_ENVIO_CENTIMOS = 495;
export const MAX_UNIDADES_POR_LINEA = 10;

export interface Totales {
  subtotalCentimos: number;
  envioCentimos: number;
  totalCentimos: number;
  unidades: number;
}

export function calcularTotales(lineas: LineaCarrito[]): Totales {
  const subtotalCentimos = lineas.reduce((s, l) => s + l.producto.precioCentimos * l.cantidad, 0);
  const unidades = lineas.reduce((s, l) => s + l.cantidad, 0);
  const envioCentimos =
    unidades === 0 || subtotalCentimos >= ENVIO_GRATIS_DESDE_CENTIMOS ? 0 : COSTE_ENVIO_CENTIMOS;
  return {
    subtotalCentimos,
    envioCentimos,
    totalCentimos: subtotalCentimos + envioCentimos,
    unidades,
  };
}

export class ErrorCarrito extends Error {}

export function leerCarrito(db: Database, carritoId: string): LineaCarrito[] {
  const filas = db
    .query<{ producto_slug: string; cantidad: number }, [string]>(
      'SELECT producto_slug, cantidad FROM lineas_carrito WHERE carrito_id = ? ORDER BY rowid',
    )
    .all(carritoId);
  return filas.flatMap((f) => {
    const producto = obtenerProducto(db, f.producto_slug);
    return producto ? [{ producto, cantidad: f.cantidad }] : [];
  });
}

export function anadirAlCarrito(
  db: Database,
  carritoId: string,
  slug: string,
  cantidad: number,
): void {
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new ErrorCarrito('La cantidad debe ser un número entero mayor que cero.');
  }
  const producto = obtenerProducto(db, slug);
  if (!producto) throw new ErrorCarrito(`No existe el producto «${slug}».`);
  const actual =
    db
      .query<{ cantidad: number }, [string, string]>(
        'SELECT cantidad FROM lineas_carrito WHERE carrito_id = ? AND producto_slug = ?',
      )
      .get(carritoId, slug)?.cantidad ?? 0;
  const nueva = actual + cantidad;
  if (nueva > Math.min(producto.stock, MAX_UNIDADES_POR_LINEA)) {
    throw new ErrorCarrito(`No hay unidades suficientes de «${producto.nombre}».`);
  }
  db.run(
    `INSERT INTO lineas_carrito (carrito_id, producto_slug, cantidad) VALUES (?, ?, ?)
     ON CONFLICT(carrito_id, producto_slug) DO UPDATE SET cantidad = excluded.cantidad`,
    [carritoId, slug, nueva],
  );
}

export function quitarDelCarrito(db: Database, carritoId: string, slug: string): void {
  db.run('DELETE FROM lineas_carrito WHERE carrito_id = ? AND producto_slug = ?', [
    carritoId,
    slug,
  ]);
}
