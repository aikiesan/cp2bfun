# Arquivo do Novo Prédio CP2b

Este documento registra o inventário do material do novo prédio do CP2b
recebido em 21/08/2026, para que não se perca mesmo não entrando no site
agora. Decisão (confirmada com o usuário): **este material não entra no
site nesta fase** — fica arquivado até a fase de expansão do HIDS/NIPE.

## O que existe

Local: `New_Data_To_Update_Website/` (fora do controle de versão — ver
`.gitignore`; ~1,4 GB no total, mantido apenas localmente/backup).

| Pasta | Conteúdo | Tamanho aprox. |
| --- | --- | --- |
| `Projeto_Predio_CP2b-20260821T202429Z-1-001/` | 46 renders arquitetônicos, 15 vídeos de sobrevoo (flythrough), 2 modelos SketchUp (`.skp`) | ~1,1 GB |
| `Prédio CP2B-20260821T202607Z-1-001/` | 22 fotos do prédio atual + 8 fotos do painel de grafite artístico | ~305 MB |

## Por que não entra no site agora

O prédio ainda é um projeto/obra futura, não a sede operacional atual do
CP2b. Publicar renders de um prédio ainda não construído ao lado do
conteúdo institucional corrente criaria confusão sobre o que já existe.

## O que fazer quando for a hora

1. Selecionar um subconjunto curado dos renders (não os 46) e 1–2 vídeos de
   sobrevoo comprimidos para web — os arquivos originais são pesados demais
   para o site.
2. Criar uma seção "Novo Prédio" ligada à narrativa de expansão do
   HIDS/NIPE, não misturada com a galeria de fotos do dia a dia.
3. Os modelos `.skp` não têm uso direto no site — servem apenas de fonte
   para gerar novos renders/imagens quando necessário.
4. As fotos do prédio atual (22) e do painel de grafite (8) podem, a
   qualquer momento, alimentar a galeria normal (`/admin/gallery/upload`) —
   não dependem da decisão acima, pois mostram a sede existente.

## Onde está o arquivo original

`New_Data_To_Update_Website/` no repositório local. Não é versionado — ao
decidir publicar parte do material, copie os arquivos selecionados para
`cp2b_web/public/assets/` (ou faça upload pela galeria) em vez de apontar
para este diretório.
