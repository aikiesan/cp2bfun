import pg from 'pg';
import dotenv from 'dotenv';

// override: true e deliberado. Sem ele o dotenv NAO sobrescreve variaveis ja
// presentes em process.env, entao um DATABASE_URL exportado no shell (por
// exemplo por um `set -a; . ./.env` de outro projeto na mesma sessao) vence o
// .env desta aplicacao em silencio. Foi assim que um deploy do site apontou
// para o banco de producao da Arqueia.
dotenv.config({ override: true });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
