import { formatearPrecio } from '../formato';
import type { Producto } from '../tipos';
import { Plantilla } from './Plantilla';

export function Catalogo({ productos }: { productos: Producto[] }) {
  return (
    <Plantilla titulo="Catálogo">
      <h1>Catálogo</h1>
      {productos.length === 0 ? (
        <p>Todavía no hay productos. Ejecuta «bun run db:seed» para cargar los de ejemplo.</p>
      ) : (
        <ul class="rejilla">
          {productos.map((p) => (
            <li class="tarjeta">
              <h2>
                <a href={`/productos/${p.slug}`}>{p.nombre}</a>
              </h2>
              <p>{p.descripcion}</p>
              <p class="precio">{formatearPrecio(p.precioCentimos)}</p>
              {p.stock === 0 ? <p class="agotado">Agotado</p> : null}
            </li>
          ))}
        </ul>
      )}
    </Plantilla>
  );
}
