// GERADO — não editar à mão, EXCETO pelas correções do ANEXO 11 abaixo.
// Gerado por scripts/extract-strategic-data.py a partir das abas
// 'Coord Eixos' e 'Pesquisadores' da planilha estratégica do CP2b.
//
// Uma entrada por pessoa, com todos os eixos em que ela aparece. É a
// fonte do vínculo pessoa→eixo usado em /equipe; os nomes e instituições
// vêm da planilha da Luciana, não digitados à mão.
//
// ANEXO 11 (Composição da Coordenação dos Eixos, vigente 08/09/2026):
// aplicado à mão sobre a geração — troca de eixo de Priscila (2→3),
// Ana Beatriz (2→3) e Fabiane (3→2), rótulos de coordenação e a inclusão
// de Carlos Eduardo Driemeier. O cargo de Coordenador Adjunto foi extinto.
// Refletir essas mudanças na planilha de origem antes da próxima geração.
export const teamByAxis = [
  {
    "name": "Alexandre Da Silva Souza",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "UNIFAL",
    "role": null,
    "level": "Doutorando"
  },
  {
    "name": "Amanda Pietra Santerio Cavini",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "UNIFAL",
    "role": null,
    "level": "Mestre"
  },
  {
    "name": "Ana Beatriz Soares Aguiar",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": "Coordenadora do Eixo 3",
    "level": "Pós-Doc"
  },
  {
    "name": "Antonio Eduardo Colins Sena",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": null,
    "role": null,
    "level": "Graduando"
  },
  {
    "name": "Antonio Parice Bufalo",
    "axes": [
      "7"
    ],
    "direction": false,
    "institution": "CP2b/UNICAMP",
    "role": null,
    "level": "Graduando"
  },
  {
    "name": "Bruna de Souza Moraes",
    "axes": [
      "6",
      "7"
    ],
    "direction": true,
    "institution": "NIPE/UNICAMP",
    "role": "Diretora do CP2b",
    "level": null
  },
  {
    "name": "Carlos Eduardo Driemeier",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": "Coordenador do Eixo 4",
    "level": null
  },
  {
    "name": "Dante Pezzin",
    "axes": [
      "6"
    ],
    "direction": false,
    "institution": "USP/UNICAMP",
    "role": null,
    "level": "Doutorando"
  },
  {
    "name": "Dave Ronel  (Hilman Ibnu Mahdi)",
    "axes": [
      "5"
    ],
    "direction": false,
    "institution": "USP",
    "role": null,
    "level": "Doutorando"
  },
  {
    "name": "Denis da Silva Miranda",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": null,
    "level": "Doutorando"
  },
  {
    "name": "Eder Kevin Arango Escalante",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Mestrando"
  },
  {
    "name": "Enelton Fagnani",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "Ciências Ambientais/FT/UNICAMP",
    "role": "Professor UNICAMP",
    "level": null
  },
  {
    "name": "Fabiane Moreira Vieira",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "FEAGRI/UNICAMP",
    "role": "Coordenadora do Eixo 2",
    "level": "Pós-Doc"
  },
  {
    "name": "Gabriel de Oliveira Rodrigues",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "USP",
    "role": null,
    "level": "Doutorando"
  },
  {
    "name": "Henrique de Souza Dornelles",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Pós-Doc"
  },
  {
    "name": "Isabela Minucio Pontes",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Doutoranda"
  },
  {
    "name": "Ivo Leandro Dorileo",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "UFMT",
    "role": null,
    "level": "Professor"
  },
  {
    "name": "Jessica Cristina Franco Nogueira",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "UNIFAL",
    "role": null,
    "level": "Doutoranda"
  },
  {
    "name": "Jessica Jacinta Silva",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "UNIFAL",
    "role": null,
    "level": "Doutoranda"
  },
  {
    "name": "Jose Maria Ferreira Jardim da Silveira",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "IE/UNICAMP",
    "role": null,
    "level": "Professor"
  },
  {
    "name": "Leonardo Ariel Benavidez Mamani",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Doutorando"
  },
  {
    "name": "Luana Mattos de Oliveira Cruz",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "FEC/UNICAMP",
    "role": "Professora UNICAMP",
    "level": null
  },
  {
    "name": "Lucas Boaro",
    "axes": [
      "1"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Iniciação Científica"
  },
  {
    "name": "Lucas Nakamura Cerejo",
    "axes": [
      "1"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": "Coordenador do Eixo 1",
    "level": "Pós-Doc"
  },
  {
    "name": "Lucas Tadeu Fuess",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "Engenharia Ambiental/USP",
    "role": "Coordenador do Eixo 2",
    "level": null
  },
  {
    "name": "Luciana Cristina Lenhari da Silva",
    "axes": [
      "8"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": null,
    "level": "Pós-Doc"
  },
  {
    "name": "Luis Alberto Follegatti Romero",
    "axes": [
      "5"
    ],
    "direction": false,
    "institution": "POLI/USP",
    "role": "Professor USP",
    "level": null
  },
  {
    "name": "Luiz Gustavo Antônio de Souza",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "ITA/Fortaleza",
    "role": "Professor ITA",
    "level": null
  },
  {
    "name": "Luiza Arones Gaspar",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": null,
    "role": null,
    "level": "Graduanda"
  },
  {
    "name": "Marcelo Marques de Magalhães",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "FCE/UNESP",
    "role": null,
    "level": "Professor"
  },
  {
    "name": "Marcelo Pereira Cunha",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "Economia/UNICAMP",
    "role": "Coordenador do Eixo 4",
    "level": null
  },
  {
    "name": "Marcelo Zaiat",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": null,
    "role": null,
    "level": "Professor"
  },
  {
    "name": "Marcus Lívio Carlin",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "UNIFAL",
    "role": null,
    "level": "Mestre"
  },
  {
    "name": "Maria Paula Cardeal Volpi",
    "axes": [
      "7"
    ],
    "direction": false,
    "institution": "ESALQ/USP",
    "role": "Coordenadora do Eixo 7",
    "level": null
  },
  {
    "name": "Mariana Conceição da Costa",
    "axes": [
      "5"
    ],
    "direction": false,
    "institution": "FEQ/UNICAMP",
    "role": null,
    "level": "Professora"
  },
  {
    "name": "Mauro Donizetti Berni",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": null,
    "level": "Professor"
  },
  {
    "name": "Mayara Régia Sousa de Melo",
    "axes": [
      "6"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Doutoranda"
  },
  {
    "name": "Natalia Molina Cetrulo",
    "axes": [
      "8"
    ],
    "direction": false,
    "institution": "FCA/UNICAMP",
    "role": "Coordenadora do Eixo 8",
    "level": null
  },
  {
    "name": "Patricia Prediger",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "FT UNICAMP",
    "role": null,
    "level": "Professora"
  },
  {
    "name": "Paulo Sergio Graziano Magalhães",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Professor"
  },
  {
    "name": "Priscila Rosseto Camiloti",
    "axes": [
      "3"
    ],
    "direction": false,
    "institution": "Divisão Científica de Planejamento, Análise e Desenvolvimento Energético do Instituto de Energia e Ambiente/USP",
    "role": "Coordenadora do Eixo 3",
    "level": null
  },
  {
    "name": "Rachel Biancalana Costa",
    "axes": [
      "5"
    ],
    "direction": false,
    "institution": "POLI/USP",
    "role": "Coordenadora do Eixo 5",
    "level": null
  },
  {
    "name": "Rafael de Brito Dias",
    "axes": [
      "8"
    ],
    "direction": false,
    "institution": "FCA/UNICAMP",
    "role": "Professor UNICAMP",
    "level": null
  },
  {
    "name": "Raphael Guarda Cavalcante",
    "axes": [
      "4"
    ],
    "direction": false,
    "institution": "UNIFAL",
    "role": null,
    "level": "Mestrando"
  },
  {
    "name": "Renata Piacentini Rodriguez",
    "axes": [
      "6",
      "7"
    ],
    "direction": true,
    "institution": "UNIFAL/UNICAMP",
    "role": "Vice-diretora do CP2b",
    "level": null
  },
  {
    "name": "Rubens Augusto Camargo Lamparelli",
    "axes": [
      "1"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": "Coordenador do Eixo 1",
    "level": null
  },
  {
    "name": "Sergio Valdir Bajay",
    "axes": [
      "8"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": null,
    "level": "Professor"
  },
  {
    "name": "Simone Aparecida dos Santos",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": null,
    "level": "Doutoranda"
  },
  {
    "name": "Sofia Silva",
    "axes": [
      "7"
    ],
    "direction": false,
    "institution": "UNICAMP",
    "role": null,
    "level": "Bolsista JC"
  },
  {
    "name": "Sonia Regina da Cal Seixas",
    "axes": [
      "6"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": null,
    "level": "Professora"
  },
  {
    "name": "Stella Stopa Assis Palma",
    "axes": [
      "2"
    ],
    "direction": false,
    "institution": "NIPE/UNICAMP",
    "role": null,
    "level": "Pós-Doc"
  },
  {
    "name": "Thais Aparecida Dibbern",
    "axes": [
      "8"
    ],
    "direction": false,
    "institution": "FCA/UNICAMP",
    "role": "Coordenadora do Eixo 8",
    "level": null
  },
  {
    "name": "Waldyr Luiz Ribeiro Gallo",
    "axes": [
      "5"
    ],
    "direction": false,
    "institution": "FEM/UNICAMP",
    "role": null,
    "level": "Professor"
  }
];
