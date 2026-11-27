-- Migration 058: título da notícia do Metaninho sem exclamação.
--
-- Passe anti-slop: títulos de interface não levam "!". Só troca o título
-- original; se alguém já o editou pelo admin, fica como está. O slug
-- (metaninho-mascote) não muda.
--
-- Par estático: src/data/content.js e backend/src/db/seed.sql.

UPDATE news
   SET title_pt = 'Conheça o Metaninho, o novo mascote do CP2b'
 WHERE slug = 'metaninho-mascote'
   AND title_pt = 'Conheça o Metaninho: o novo mascote do CP2b!';

UPDATE news
   SET title_en = 'Meet Metaninho, the new CP2b mascot'
 WHERE slug = 'metaninho-mascote'
   AND title_en = 'Meet Metaninho: the new CP2b mascot!';
