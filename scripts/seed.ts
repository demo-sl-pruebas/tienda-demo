import { abrirBd, sembrar } from '../src/db';

const db = abrirBd();
const n = sembrar(db);
console.log(`Catálogo de ejemplo cargado: ${n} productos.`);
db.close();
