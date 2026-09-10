# assets-src

Imagens que **não** são servidas pelo site. Esta pasta fica fora de `public/`,
então o Vite não a copia para `dist/` e o Apache nunca a expõe.

Duas categorias moram aqui:

**1. Originais de conversão.** As fotos que o `scripts/optimize-team-photos.mjs`
converte nos `public/assets/team/*.webp`. Cada original tem ~2,5 MB; a versão
convertida tem ~40 KB. É a versão convertida que o site usa — os `teamPhotos.js`
apontam só para `/assets/team/`. Os originais ficam guardados porque são o
material de partida caso a conversão precise ser refeita em outro tamanho.

**2. Arquivos sem referência.** Imagens que nenhuma parte do código, nenhuma
migração do banco e nenhum script menciona. A maioria é sobra de versões
antigas da marca (os PNGs `@8x`, superados pelos SVGs em
`public/assets/logos/`) ou do Fórum de 2026, cujas páginas foram removidas.
Ficam versionadas aqui em vez de apagadas: o histórico do git as guardaria de
todo modo, e assim continuam fáceis de achar e restaurar.

## Por que isso importa

`public/assets` tinha 88 MB, dos quais 64 MB caíam nestas duas categorias.
Tudo isso era copiado para `dist/` em cada build e ocupava espaço na VM e nos
backups, sem que nenhuma página pedisse esses arquivos.

## Se precisar publicar algo daqui de volta

Mova o arquivo para `public/assets/` e referencie-o normalmente como
`/assets/nome-do-arquivo.ext`. O `src/__tests__/assets.test.js` confere que
todo caminho `/assets/...` citado no código existe em disco, então uma
referência a um arquivo que ficou aqui falha no teste, não em produção.
