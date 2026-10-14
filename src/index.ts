import { crearApp } from './app';
import { abrirBd } from './db';

const db = abrirBd();
const total = db.query<{ n: number }, []>('SELECT count(*) AS n FROM productos').get()?.n ?? 0;
if (total === 0) {
  console.warn('La base de datos está vacía: ejecuta «bun run db:seed» para cargar el catálogo.');
}

const port = Number(process.env.PORT ?? 3000);
const servidor = Bun.serve({ port, fetch: crearApp(db).fetch });
console.log(`Cerámica Demo escuchando en http://localhost:${servidor.port}`);
