import { formatearPrecio } from '../formato';
import type { Producto } from '../tipos';
import { Plantilla } from './Plantilla';

export function FichaProducto({ producto }: { producto: Producto }) {
  return (
    <Plantilla titulo={producto.nombre}>
      <article>
        <h1>{producto.nombre}</h1>
        <p>{producto.descripcion}</p>
        <p class="precio">{formatearPrecio(producto.precioCentimos)}</p>
        {producto.stock > 0 ? (
          <form method="post" action="/carrito">
            <input type="hidden" name="slug" value={producto.slug} />
            <label>
              Cantidad <input type="number" name="cantidad" value="1" min="1" max="10" />
            </label>
            <button type="submit">Añadir al carrito</button>
          </form>
        ) : (
          <p class="agotado">Agotado</p>
        )}
      </article>
    </Plantilla>
  );
}
