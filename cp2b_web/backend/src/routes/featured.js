import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

/**
 * Tipos que podem ocupar os três destaques da home.
 *
 * O destaque exige uma forma comum (slug, imagem, badge, data), mas as tabelas
 * não são iguais: boletim e podcast não têm slug nem página de detalhe, o
 * boletim guarda a capa em `cover_image`, e nenhum dos dois tem badge. Em vez
 * de replicar seis colunas em cada tabela nova, cada tipo declara aqui como se
 * projeta nessa forma — a próxima seção destacável é uma entrada a mais, não
 * uma migração.
 *
 *  key    coluna que identifica o item ao gravar a posição.
 *  image  coluna da imagem do card.
 *  badge  expressão SQL do rótulo; um literal quando a tabela não tem badge.
 *  date   expressão SQL da data exibida; NULL quando não há o que mostrar.
 */
const TYPES = {
  news:        { table: 'news',            key: 'slug', image: 'image',       badge: 'badge', badgeColor: 'badge_color', date: 'date_display' },
  project:     { table: 'projects',        key: 'slug', image: 'image',       badge: 'badge', badgeColor: 'badge_color', date: 'date_display' },
  microscopio: { table: 'microscopio',     key: 'slug', image: 'image',       badge: 'badge', badgeColor: 'badge_color', date: 'date_display' },
  opportunity: { table: 'opportunities',   key: 'slug', image: 'image',       badge: 'badge', badgeColor: 'badge_color', date: 'date_display' },
  event:       { table: 'events',          key: 'slug', image: 'image',       badge: "'Evento'",  badgeColor: "'#00573A'", date: 'NULL' },
  // Sem slug: o clique leva à listagem, porque o conteúdo vive no PDF e no
  // Spotify, não numa página do site.
  boletim:     { table: 'boletins',        key: 'id',   image: 'cover_image', badge: "'Boletim'", badgeColor: "'#1E3E4C'", date: 'NULL' },
  podcast:     { table: 'podcast_episodes', key: 'id',  image: 'image',       badge: "'Podcast'", badgeColor: "'#5CA032'", date: 'NULL' },
};

// GET unified featured content
router.get('/', async (req, res) => {
  try {
    const queries = Object.entries(TYPES).map(([type, t]) =>
      pool.query(
        `SELECT id,
                ${t.key === 'slug' ? 'slug' : 'id::text AS slug'},
                title_pt, title_en, description_pt, description_en,
                ${t.image} AS image,
                ${t.badge} AS badge,
                ${t.badgeColor} AS badge_color,
                ${t.date} AS date_display,
                featured_position,
                '${type}' AS content_type
         FROM ${t.table}
         WHERE featured_position IN ('A', 'B', 'C')`
      )
    );

    const results = await Promise.all(queries);
    const allFeatured = results.flatMap((r) => r.rows);

    const featured = {
      A: allFeatured.find((item) => item.featured_position === 'A') || null,
      B: allFeatured.find((item) => item.featured_position === 'B') || null,
      C: allFeatured.find((item) => item.featured_position === 'C') || null,
    };

    res.json(featured);
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Failed to fetch featured content' });
  }
});

// PUT unified featured positions
router.put('/', async (req, res) => {
  const { positionA, positionB, positionC } = req.body;

  try {
    await pool.query('BEGIN');

    // Limpa todas as posições antes de gravar as novas: um mesmo item pode
    // trocar de posição, e duas tabelas não podem disputar a mesma letra.
    for (const t of Object.values(TYPES)) {
      await pool.query(
        `UPDATE ${t.table} SET featured_position = NULL WHERE featured_position IS NOT NULL`
      );
    }

    for (const [pos, data] of [['A', positionA], ['B', positionB], ['C', positionC]]) {
      if (!data || !TYPES[data.type]) continue;
      const t = TYPES[data.type];
      // O admin manda sempre `slug`; para as tabelas sem slug ele carrega o id.
      const identifier = data.slug;
      if (identifier === undefined || identifier === null || identifier === '') continue;

      await pool.query(
        `UPDATE ${t.table} SET featured_position = $1 WHERE ${t.key}::text = $2`,
        [pos, String(identifier)]
      );
    }

    await pool.query('COMMIT');
    res.json({ success: true, message: 'Featured positions updated' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating featured positions:', error);
    res.status(500).json({ error: 'Failed to update featured positions' });
  }
});

export default router;
