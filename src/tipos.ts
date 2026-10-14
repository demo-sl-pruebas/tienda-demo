export interface Producto {
  slug: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  /** Precio con IVA, en céntimos de euro. */
  precioCentimos: number;
  stock: number;
}

export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
}
