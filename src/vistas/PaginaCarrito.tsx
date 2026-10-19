import type { Totales } from '../carrito';
import { formatearPrecio } from '../formato';
import type { LineaCarrito } from '../tipos';
import { Plantilla } from './Plantilla';

export function PaginaCarrito({ lineas, totales }: { lineas: LineaCarrito[]; totales: Totales }) {
  return (
    <Plantilla titulo="Carrito">
      <h1>Tu carrito</h1>
      {lineas.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Importe</th>
            </tr>
          </thead>
          <tbody>
            {lineas.map((l) => (
              <tr>
                <td>{l.producto.nombre}</td>
                <td>{l.cantidad}</td>
                <td>{formatearPrecio(l.producto.precioCentimos * l.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <dl class="totales">
        <dt>Subtotal</dt>
        <dd>{formatearPrecio(totales.subtotalCentimos)}</dd>
        <dt>Envío</dt>
        <dd>{totales.envioCentimos === 0 ? 'Gratis' : formatearPrecio(totales.envioCentimos)}</dd>
        <dt>Total</dt>
        <dd data-total>{formatearPrecio(totales.totalCentimos)}</dd>
      </dl>
    </Plantilla>
  );
}
