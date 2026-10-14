import { abrirBd, sembrar } from '../src/db';

export function bdDePrueba() {
  const db = abrirBd(':memory:');
  sembrar(db);
  return db;
}

/** Normaliza los espacios no separables que usa Intl en los importes. */
export function texto(s: string): string {
  return s.replace(/ | /g, ' ');
}
