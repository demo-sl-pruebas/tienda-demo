const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export function formatearPrecio(centimos: number): string {
  return euros.format(centimos / 100);
}
