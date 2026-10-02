-- Migration 052: separa as três citações que a 028 deixou para revisão manual.
--
-- A 026 gravou cada citação inteira em title_pt e, em authors, um aviso para
-- o editor: "(citação completa em title_pt — revisar autoria)". A 028 separou
-- 22 das 25; estas três ficaram como vieram, e o site mostrava o aviso interno
-- como autoria e a citação com URL no lugar do título — no celular, cortada
-- na borda do card. Aqui cada uma ganha título, autores, periódico e link,
-- tirados da própria citação (que segue registrada nos comentários da 028).
--
-- Só altera linhas que ainda estejam com o aviso: se um editor já as tiver
-- corrigido pelo painel, nada muda. O ano não é alterado.

BEGIN;

UPDATE publications SET
  title_pt = 'Corporate lobbying, agribusiness, and climate change politics in Brazil''s bioenergy transition',
  authors = 'LLB Lazaro, LL Giatti, AF Simoes, A Giarolla, PR Jacobi, JAP Oliveira',
  journal = 'Energy Research & Social Science',
  url = COALESCE(url, 'https://www.sciencedirect.com/science/article/abs/pii/S2214629625004347')
WHERE authors = '(citação completa em title_pt — revisar autoria)'
  AND title_pt LIKE 'LLB Lazaro, LL Giatti,%';

UPDATE publications SET
  title_pt = 'Climate commitments and energy transition pledges in Latin America: Where is the region headed?',
  authors = 'LLB Lazaro, Usuriga-Najera, JA O. Neto, A. Grimoni, P Jacobi',
  journal = 'Energy for Sustainable Development',
  url = COALESCE(url, 'https://www.sciencedirect.com/science/article/abs/pii/S0973082625001292')
WHERE authors = '(citação completa em title_pt — revisar autoria)'
  AND title_pt LIKE 'LLB Lazaro, Usuriga-Najera,%';

UPDATE publications SET
  title_pt = 'Mathematical modeling to size anaerobic stabilization ponds intended for slaughterhouse wastewater treatment – the role of temperature and hydraulic retention time',
  authors = 'SOLDERA, P. E. S.; DANTAS, R. F.; FAGNANI, E.',
  journal = 'Environmental Science: Water Research & Technology'
WHERE authors = '(citação completa em title_pt — revisar autoria)'
  AND title_pt LIKE 'SOLDERA, P. E. S.%';

COMMIT;
