# Equipe — pessoas ainda sem Eixo

A página `/equipe` passou a agrupar a equipe **por Eixo**, horizontalmente, em vez
de por hierarquia. O vínculo pessoa→Eixo vem da planilha estratégica
(`Planejamento_Estrategico_CP2B_Integrado_projetos_pesquisadores_labs_v2.xlsx`,
abas *Coord Eixos* e *Pesquisadores*).

Hoje a situação é:

| | Pessoas |
| --- | ---: |
| Total na equipe | **99** |
| Com Eixo informado na planilha | **50** |
| **Sem Eixo** | **49** |

As 49 abaixo aparecem no site sob **"Colaboradores e Parceiros"** — um grupo
plano, sem hierarquia. Não chutamos um Eixo para ninguém: quem não está na
planilha fica ali até que alguém informe.

Boa parte são pesquisadores externos e parceiros (Aalborg, Curtin, COMGAS,
Amplum Biogás), para quem "Colaboradores" provavelmente é o lugar certo mesmo.
Outros são do CP2b e só faltou o Eixo na planilha.

**Como corrigir:** basta preencher a coluna *Eixo CP2b* dessas pessoas na aba
*Pesquisadores* (ou *Coord Eixos*) da planilha. Depois é só rodar:

```
python scripts/extract-strategic-data.py <caminho-da-planilha>
```

e gerar uma nova migration com os vínculos. Quem deve permanecer como
colaborador pode simplesmente ficar sem Eixo.

---

## Lista

| Nome | Instituição | Papel atual no site |
| --- | --- | --- |
| Alessandro Sanches Pereira | Curtin University/CU | Pesquisador Responsável na Instituição Parceira |
| Aline Veronese da Silva | IE/UNICAMP | Pesquisador Associado |
| Ana Beatriz Soares Aguiar | UNICAMP | Pesquisador Associado |
| Anderson Targino da Silva Ferreira | Centro de Pós-Graduação e Pesquisa/CEPPE/UNG | Pesquisador Responsável na Instituição Parceira |
| Barbara Janet Teruel Mederos | FEAGRI/UNICAMP | Pesquisador Associado |
| Bruno Felipe Veloso | CCUEC/UNICAMP | Apoio Técnico |
| Bruno Sidnei da Silva | — | Pesquisador Responsável na Instituição Parceira |
| Caio Henrique Rufino | FEM/UNICAMP | Pesquisador Associado |
| Carla Kazue Nakao Cavaliero | FEM/UNICAMP | Pesquisador Associado |
| Daniel Francisco Nagao Menezes | FACAMP | Pesquisador Associado |
| Daniel Henrique Dario Capitani | FCA/UNICAMP | Pesquisador Associado |
| Daniel de Oliveira Silva | — | Pesquisador Responsável na Instituição Parceira |
| Danúsia Arantes Ferreira | FEEC/UNICAMP | Pesquisador Associado |
| Flávia Luciane Consoni | IG/UNICAMP | Pesquisador Associado |
| Gabriel Dias Mangolini Neves | — | Pesquisador Responsável na Instituição Parceira |
| Gustavo Mockaitis | FEAGRI/UNICAMP | Pesquisador Associado |
| Hildo Guillardi Júnior | FESJBV/UNESP | Pesquisador Associado |
| Jens Bo Holm-Nielsen | Aalborg University (AAU) | Pesquisador Responsável na Instituição Parceira |
| Joaquim Eugênio Abel Seabra | FEM/UNICAMP | Apoio Técnico |
| Joni de Almeida Amorim | FEEC/UNICAMP | Pesquisador Associado |
| José Octavio Armani Paschoal | — | Pesquisador Responsável na Instituição Parceira |
| João Guilherme Ito Cypriano | FEEC/UNICAMP | Pesquisador Associado |
| Juliana Paula da Silva Ulian | FEM/UNICAMP | Pesquisador Responsável na Instituição Parceira |
| Karla Adriana Martins Bessa | PAGU/UNICAMP | Pesquisador Associado |
| Leandro Wang Hantao | IQ/UNICAMP | Pesquisador Associado |
| Leidiane Mariani | Amplum Biogás | Pesquisador Responsável na Instituição Parceira |
| Leonardo Vasconcelos Fregolente | FEQ/UNICAMP | Pesquisador Responsável na Instituição Parceira |
| Lira Luz Benites Lazaro | FEEC/UNICAMP | Pesquisador Associado |
| Luciana Cristina Lenhari da Silva | IG/UNICAMP | Pesquisador Associado |
| Luiz Carlos Pereira da Silva | FEEC/UNICAMP | Pesquisador Associado |
| Luiz Carlos Roma Júnior | IZ/SAASP | Pesquisador Associado |
| Magali Luzia Maróstica | NIPE/UNICAMP | Apoio Administrativo |
| Marcelo Antunes Nolasco | EACH/USP | Pesquisador Associado |
| Marcelo Kenji Miki | — | Pesquisador Responsável na Instituição Parceira |
| Marcelo de Carvalho Pereira | IE/UNICAMP | Pesquisador Associado |
| Paola Mercadante Petry | COMGAS | Pesquisador Responsável na Instituição Parceira |
| Patricia Jacqueline Thyssen | IB/UNICAMP | Pesquisador Associado |
| Patricia Nunes da Silva Mariuzzo | IE/UNICAMP | Pesquisador Associado |
| Paulo Cesar Souza Manduca | NIPE/UNICAMP | Pesquisador Associado |
| Paulo César de Almeida Pinheiro | NIPE/UNICAMP | Apoio Administrativo |
| Raffaella Rossetto | APTA/SAASP | Apoio Técnico |
| Raquel Teixeira Gomes Magri | FEEC/UNICAMP | Estudante sem Bolsa |
| Rosângela Pedroz | NIPE/UNICAMP | Apoio Administrativo |
| Rubens Maciel Filho | FEQ/UNICAMP | Pesquisador Responsável na Instituição Parceira |
| Sarita Cândida Rabelo | FCA/UNESP | Pesquisador Associado |
| Solange Teles da Silva | CPG/UPM | Pesquisador Associado |
| Thalita dos Santos Dalbelo | FEC/UNICAMP | Pesquisador Associado |
| Valeria Maia Merzel | CPQBA/UNICAMP | Pesquisador Associado |
| Ângela Cruz Guirao | — | Pesquisador Responsável na Instituição Parceira |
