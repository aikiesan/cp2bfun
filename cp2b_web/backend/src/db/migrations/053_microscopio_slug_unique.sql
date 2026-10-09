-- Migração 053: slug único em microscopio.
--
-- A 013 declarou a coluna como UNIQUE com ADD COLUMN IF NOT EXISTS, mas a
-- coluna já existia (veio da antiga tabela events), então a restrição nunca
-- foi criada; a 018 ainda apagou o índice antigo. Resultado: dois artigos
-- podiam ter o mesmo slug, e editar ou apagar um atingia os dois.
--
-- O índice só é criado se o banco não tiver slugs repetidos. Com repetição,
-- CREATE UNIQUE INDEX falharia e derrubaria a migração no boot; nesse caso
-- a rota (routes/microscopio.js) segue impedindo novas duplicatas e os
-- repetidos precisam ser renomeados pelo painel antes.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM microscopio
    WHERE slug IS NOT NULL
    GROUP BY slug
    HAVING count(*) > 1
  ) THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_microscopio_slug_unique
      ON microscopio (slug) WHERE slug IS NOT NULL;
  END IF;
END $$;
