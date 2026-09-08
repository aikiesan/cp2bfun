// GERADO — não editar à mão.
// Gerado por scripts/extract-researcher-profiles.py a partir da aba
// 'Equipe CP2B 2026' de "CP2B_Equipe_2026_identificadores_final.xlsx".
//
// Identificadores públicos de pesquisador, indexados por nameKey() (primeiro +
// último nome), a mesma chave usada por teamPhotos e teamByAxis. É o que
// permite a /equipe abrir o currículo de cada pessoa.
//
// Cobertura de 72 pessoas: orcid 49 · lattes 33 · scholar 48 · scopus 1 · wos 2 · bvFapesp 48 · institutional 47.
// Quem não tem nenhum identificador não aparece aqui — a ausência é o padrão,
// e o modal de perfil é desenhado para ela.
//
// Células "NÃO LOCALIZADO" da planilha viram ausência, nunca a string: um
// href com esse texto seria um link quebrado na página.
//
// Biografias não vêm desta planilha: bioPt/bioEn são redigidas no admin e
// vivem no banco (team_members.bio_pt / bio_en).
import { nameKey } from '../../utils/nameKey';

export const researcherProfiles = {
  // Alessandro Sanches Pereira
  "alessandro|pereira": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/677092/alessandro-sanches-pereira/",
    "institutional": "https://staffportal.curtin.edu.au/staff/profile/view/alessandro-sanches-pereira-ea0046a8/"
  },
  // Aline Veronese da Silva
  "aline|silva": {
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=331133",
    "orcid": "https://orcid.org/0000-0003-4335-5963",
    "scholar": "https://scholar.google.com/citations?user=DjrSd9EAAAAJ"
  },
  // Ana Beatriz Soares Aguiar
  "ana|aguiar": {
    "lattes": "http://lattes.cnpq.br/7272812902289704",
    "orcid": "https://orcid.org/0000-0001-9615-1484",
    "scholar": "https://scholar.google.com/citations?user=T02QnW8AAAAJ"
  },
  // Anderson Targino da Silva Ferreira
  "anderson|ferreira": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/718294/anderson-targino-da-silva-ferreira/",
    "institutional": "https://www.ige.unicamp.br/neal/integrantes/",
    "orcid": "https://orcid.org/0000-0002-0440-6273",
    "scholar": "https://scholar.google.com/citations?user=Rvkas6UAAAAJ"
  },
  // Antonio Eduardo Colins Sena
  "antonio|sena": {
    "lattes": "http://lattes.cnpq.br/9179659362790658"
  },
  // Barbara Janet Teruel Mederos
  "barbara|mederos": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/8869/barbara-janet-teruel-mederos/",
    "institutional": "https://nipe.unicamp.br/profissional/barbara-janet-teruel-mederos/",
    "lattes": "http://lattes.cnpq.br/8216159372617370",
    "orcid": "https://orcid.org/0000-0002-5102-6716",
    "scholar": "https://scholar.google.com/citations?user=Crkf7EcAAAAJ"
  },
  // Bruna de Souza Moraes
  "bruna|moraes": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/32170/bruna-de-souza-moraes/",
    "institutional": "https://www.nipe.unicamp.br/profissional/bruna-de-souza-moraes/",
    "orcid": "https://orcid.org/0000-0003-4305-7608",
    "scholar": "https://scholar.google.com/citations?user=5mpHdngAAAAJ",
    "wos": "https://www.webofscience.com/wos/author/rid/ABC-3515-2020"
  },
  // Caio Henrique Rufino
  "caio|rufino": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/687728/caio-henrique-rufino/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=321269",
    "lattes": "http://lattes.cnpq.br/8526204483675376",
    "orcid": "https://orcid.org/0000-0002-4564-5377",
    "scholar": "https://scholar.google.com/citations?user=SxmmTSEAAAAJ"
  },
  // Carla Kazue Nakao Cavaliero
  "carla|cavaliero": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/46452/carla-kazue-nakao-cavaliero/",
    "institutional": "http://www.somos.unicamp.br/professores/view/4295",
    "lattes": "http://lattes.cnpq.br/2699196515879292",
    "orcid": "https://orcid.org/0000-0002-5016-0091"
  },
  // Daniel Henrique Dario Capitani
  "daniel|capitani": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/685636/daniel-henrique-dario-capitani/",
    "institutional": "https://www2.fca.unicamp.br/profissional/daniel-henrique-dario-capitani/",
    "orcid": "https://orcid.org/0000-0002-8025-4152",
    "scholar": "https://scholar.google.com/citations?user=24X_OkwAAAAJ"
  },
  // Daniel Francisco Nagao Menezes
  "daniel|menezes": {
    "orcid": "https://orcid.org/0000-0002-7755-3063",
    "scholar": "https://scholar.google.com/citations?user=EZtHeAoAAAAJ"
  },
  // Dante Chiavareto Pezzin
  "dante|pezzin": {
    "orcid": "https://orcid.org/0000-0001-6738-7383"
  },
  // Danúsia Arantes Ferreira
  "danusia|ferreira": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/719976/danusia-arantes-ferreira/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=317198"
  },
  // Dave Ronel (Hilman Ibnu Mahdi)
  "dave|mahdi": {
    "scholar": "https://scholar.google.com/citations?user=i2dIFRYAAAAJ"
  },
  // Denis da Silva Miranda
  "denis|miranda": {
    "lattes": "http://lattes.cnpq.br/6560120596598893",
    "orcid": "https://orcid.org/0000-0001-7415-0624",
    "scholar": "https://scholar.google.com/citations?user=QcG_7gcAAAAJ"
  },
  // Eder Kevin Arango Escalante
  "eder|escalante": {
    "lattes": "http://lattes.cnpq.br/4765849234619347"
  },
  // Enelton Fagnani
  "enelton|fagnani": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/681435/enelton-fagnani/",
    "institutional": "https://www.ft.unicamp.br/pt-br/pessoas/docentes/enelton",
    "lattes": "http://lattes.cnpq.br/2493281934291188",
    "scholar": "https://scholar.google.com/citations?user=fO-yZacAAAAJ"
  },
  // Flávia Luciane Consoni
  "flavia|consoni": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/692648/flavia-luciane-consoni/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=303549",
    "lattes": "http://lattes.cnpq.br/3178864999293864",
    "orcid": "https://orcid.org/0000-0002-2096-1357",
    "scholar": "https://scholar.google.com/citations?user=5qlGRSIAAAAJ"
  },
  // Gabriel Dias Mangolini Neves
  "gabriel|neves": {
    "orcid": "https://orcid.org/0000-0001-8202-269X"
  },
  // Henrique de Souza Dornelles
  "henrique|dornelles": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/697810/henrique-de-souza-dornelles/",
    "scholar": "https://scholar.google.com/citations?user=2LDukRAAAAAJ"
  },
  // Hildo Guillardi Júnior
  "hildo|junior": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/74695/hildo-guillardi-junior/",
    "institutional": "https://www2.unesp.br/portaldocentes/docentes/19594",
    "lattes": "http://lattes.cnpq.br/2763526214348012",
    "orcid": "https://orcid.org/0000-0002-2029-7070",
    "scholar": "https://scholar.google.com/citations?user=J0v81u0AAAAJ"
  },
  // Isabela Minucio Pontes
  "isabela|pontes": {
    "scholar": "https://scholar.google.com/citations?user=9Bvj0SgAAAAJ"
  },
  // Ivo Leandro Dorileo
  "ivo|dorileo": {
    "scholar": "https://scholar.google.com/citations?user=oSsLCoMAAAAJ"
  },
  // Jens Bo Holm-Nielsen
  "jens|nielsen": {
    "institutional": "https://vbn.aau.dk/en/persons/jhn/",
    "orcid": "https://orcid.org/0000-0002-0797-9691"
  },
  // Jessica Cristina Franco Nogueira
  "jessica|nogueira": {
    "lattes": "http://lattes.cnpq.br/1265221206960284"
  },
  // João Guilherme Ito Cypriano
  "joao|cypriano": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/733770/joao-guilherme-ito-cypriano/",
    "orcid": "https://orcid.org/0000-0001-5318-2272",
    "scholar": "https://scholar.google.com/citations?user=FzEJTvEAAAAJ"
  },
  // Joaquim Eugênio Abel Seabra
  "joaquim|seabra": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/105790/joaquim-eugenio-abel-seabra/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=297843"
  },
  // Joni de Almeida Amorim
  "joni|amorim": {
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=327841",
    "lattes": "http://lattes.cnpq.br/3278489088705449",
    "orcid": "https://orcid.org/0000-0002-9837-9519",
    "scholar": "https://scholar.google.com/citations?user=KTndlCAAAAAJ"
  },
  // José Maria Ferreira Jardim da Silveira
  "jose|silveira": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/992/jose-maria-ferreira-jardim-da-silveira/",
    "institutional": "https://nipe.unicamp.br/profissional/jose-maria-ferreira-jardim-da-silveira/",
    "lattes": "http://lattes.cnpq.br/4984859173592703",
    "orcid": "https://orcid.org/0000-0003-3680-875X",
    "scholar": "https://scholar.google.com/citations?user=iJUYLdkAAAAJ"
  },
  // Karla Adriana Martins Bessa
  "karla|bessa": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/87513/karla-adriana-martins-bessa/",
    "institutional": "https://www.ifch.unicamp.br/pessoas/karla-adriana-martins-bessa",
    "orcid": "https://orcid.org/0000-0002-5867-5372",
    "scholar": "https://scholar.google.com/citations?user=I2FUe2sAAAAJ"
  },
  // Leandro Wang Hantao
  "leandro|hantao": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/102845/leandro-wang-hantao/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=312196"
  },
  // Leonardo Vasconcelos Fregolente
  "leonardo|fregolente": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/693300/leonardo-vasconcelos-fregolente/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=311496"
  },
  // Lira Luz Benites Lazaro
  "lira|lazaro": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/700064/lira-luz-benites-lazaro/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=327409",
    "lattes": "http://lattes.cnpq.br/4648134943131346",
    "orcid": "https://orcid.org/0000-0001-6587-1497",
    "scholar": "https://scholar.google.com/citations?user=EWlxI-YAAAAJ"
  },
  // Luana Mattos de Oliveira Cruz
  "luana|cruz": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/693297/luana-mattos-de-oliveira-cruz/",
    "lattes": "http://lattes.cnpq.br/8177360178972866",
    "orcid": "https://orcid.org/0000-0003-3795-9111"
  },
  // Lucas Mantovani Boaro
  "lucas|boaro": {
    "lattes": "http://lattes.cnpq.br/5624524360987171"
  },
  // Lucas Nakamura Cerejo
  "lucas|cerejo": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/741698/lucas-nakamura-cerejo/",
    "institutional": "https://portal.dados.unicamp.br/perfil?origem=&docente=330455",
    "lattes": "http://lattes.cnpq.br/9131453561416650",
    "orcid": "https://orcid.org/0000-0002-9292-2752",
    "scholar": "https://scholar.google.com/citations?user=AhFVjwkAAAAJ"
  },
  // Lucas Tadeu Fuess
  "lucas|fuess": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/82238/lucas-tadeu-fuess/",
    "institutional": "https://nipe.unicamp.br/profissional/lucas-tadeu-fuess/",
    "lattes": "http://lattes.cnpq.br/2310904305639447",
    "orcid": "https://orcid.org/0000-0001-8520-1124",
    "scholar": "https://scholar.google.com/citations?user=ty_F2JYAAAAJ",
    "wos": "https://www.webofscience.com/wos/author/rid/L-1500-2015"
  },
  // Luis Alberto Follegatti Romero
  "luis|romero": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/176272/luis-alberto-follegatti-romero/",
    "institutional": "https://sites.usp.br/peq_epusp/orientadores/",
    "orcid": "https://orcid.org/0000-0002-5596-833X",
    "scholar": "https://scholar.google.com/citations?user=CyTTGMgAAAAJ"
  },
  // Luiza Arones Gaspar
  "luiza|gaspar": {
    "lattes": "http://lattes.cnpq.br/0876530986125053"
  },
  // Luiz Carlos Roma Júnior
  "luiz|junior": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/10019/luiz-carlos-roma-junior/",
    "orcid": "https://orcid.org/0000-0002-0019-2538",
    "scholar": "https://scholar.google.com/citations?user=yAk8IFEAAAAJ"
  },
  // Luiz Carlos Pereira da Silva
  "luiz|silva": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/57198/luiz-carlos-pereira-da-silva/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=283630",
    "orcid": "https://orcid.org/0000-0002-0651-7292",
    "scholar": "https://scholar.google.com/citations?user=38eIBxsAAAAJ"
  },
  // Luiz Gustavo Antonio de Souza
  "luiz|souza": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/669969/luiz-gustavo-antonio-de-souza/",
    "institutional": "https://www.nipe.unicamp.br/profissional/luiz-gustavo-antonio-de-souza/",
    "orcid": "https://orcid.org/0000-0002-6937-8576",
    "scholar": "https://scholar.google.com/citations?user=5I16lAcAAAAJ"
  },
  // Marcelo Pereira da Cunha
  "marcelo|cunha": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/685638/marcelo-pereira-da-cunha/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=302214",
    "orcid": "https://orcid.org/0000-0002-1027-1694",
    "scholar": "https://scholar.google.com/citations?user=AYNGYrgAAAAJ"
  },
  // Marcelo Marques de Magalhães
  "marcelo|magalhaes": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/673021/marcelo-marques-de-magalhaes/",
    "institutional": "https://unesp.br/portaldocentes/docentes/29396",
    "lattes": "http://lattes.cnpq.br/4117906942336504",
    "orcid": "https://orcid.org/0000-0001-6334-5493",
    "scholar": "https://scholar.google.com/citations?user=n3jbke0AAAAJ"
  },
  // Marcelo Antunes Nolasco
  "marcelo|nolasco": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/34599/marcelo-antunes-nolasco/",
    "orcid": "https://orcid.org/0000-0002-1408-2954",
    "scholar": "https://scholar.google.com/citations?user=gl1pcFsAAAAJ"
  },
  // Marcelo de Carvalho Pereira
  "marcelo|pereira": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/680204/marcelo-de-carvalho-pereira/",
    "orcid": "https://orcid.org/0000-0002-8069-2734",
    "scholar": "https://scholar.google.com/citations?user=9P41WkAAAAAJ"
  },
  // Marcelo Zaiat
  "marcelo|zaiat": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/3234/marcelo-zaiat/",
    "institutional": "https://shs.eesc.usp.br/administracao/docente/?d=marcelo-zaiat",
    "lattes": "http://lattes.cnpq.br/7593950695805418",
    "orcid": "https://orcid.org/0000-0001-7336-9093",
    "scholar": "https://scholar.google.com/citations?user=zgYWu00AAAAJ"
  },
  // Marcus Lívio Carlin
  "marcus|carlin": {
    "lattes": "http://lattes.cnpq.br/0948460064235731"
  },
  // Mariana Conceição da Costa
  "mariana|costa": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/33191/mariana-conceicao-da-costa/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=300237",
    "orcid": "https://orcid.org/0000-0003-1710-7202",
    "scholar": "https://scholar.google.com/citations?user=_3vvHqwAAAAJ"
  },
  // Mauro Donizeti Berni
  "mauro|berni": {
    "institutional": "https://www.nipe.unicamp.br/profissional/mauro-donizeti-berni/",
    "lattes": "http://lattes.cnpq.br/1602054738205274",
    "orcid": "https://orcid.org/0000-0002-0027-2458",
    "scholar": "https://scholar.google.com/citations?user=vLFuoVEAAAAJ"
  },
  // Natalia Molina Cetrulo
  "natalia|cetrulo": {
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=324557"
  },
  // Patricia Nunes da Silva Mariuzzo
  "patricia|mariuzzo": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/97114/patricia-nunes-da-silva-mariuzzo/"
  },
  // Patricia Prediger
  "patricia|prediger": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/66219/patricia-prediger/",
    "institutional": "https://www.ft.unicamp.br/pt-br/pessoas/docentes/patriciap",
    "scholar": "https://scholar.google.com/citations?user=TSSr5c0AAAAJ"
  },
  // Patricia Jacqueline Thyssen
  "patricia|thyssen": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/41576/patricia-jacqueline-thyssen/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=306923",
    "orcid": "https://orcid.org/0000-0001-7343-2419",
    "scholar": "https://scholar.google.com/citations?user=yg9SakMAAAAJ"
  },
  // Paulo Sergio Graziano Magalhães
  "paulo|magalhaes": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/3321/paulo-sergio-graziano-magalhaes/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=318552",
    "lattes": "http://lattes.cnpq.br/1198843146263387",
    "orcid": "https://orcid.org/0000-0002-5374-3591",
    "scholar": "https://scholar.google.com/citations?user=dQJj6oEAAAAJ"
  },
  // Paulo Cesar Souza Manduca
  "paulo|manduca": {
    "institutional": "https://www.nipe.unicamp.br/profissional/paulo-cesar-manduca/",
    "scholar": "https://scholar.google.com/citations?user=HZLN6rIAAAAJ"
  },
  // Priscila Rosseto Camiloti
  "priscila|camiloti": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/170330/priscila-rosseto-camiloti/",
    "institutional": "https://www.iee.usp.br/priscila-camiloti/",
    "lattes": "http://lattes.cnpq.br/8086315340339526",
    "orcid": "https://orcid.org/0000-0001-6642-0399",
    "scholar": "https://scholar.google.com/citations?user=UpVuOxAAAAAJ"
  },
  // Rachel Biancalana Costa
  "rachel|costa": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/74680/rachel-biancalana-costa/",
    "scholar": "https://scholar.google.com/citations?user=skVJWxgAAAAJ"
  },
  // Rafael de Brito Dias
  "rafael|dias": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/177742/rafael-de-brito-dias/",
    "institutional": "https://www2.fca.unicamp.br/pessoas/docentes/",
    "lattes": "http://lattes.cnpq.br/6070019241046907",
    "orcid": "https://orcid.org/0000-0002-9702-2323",
    "scholar": "https://scholar.google.com/citations?user=zOeU8_4AAAAJ"
  },
  // Raffaella Rossetto
  "raffaella|rossetto": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/34647/raffaella-rossetto/",
    "institutional": "https://www.iac.sp.gov.br/scriptlattes/2023/membro-5276354621668931.html",
    "lattes": "http://lattes.cnpq.br/5276354621668931",
    "orcid": "https://orcid.org/0000-0003-1238-2213"
  },
  // Renata Piacentini Rodriguez
  "renata|rodriguez": {
    "institutional": "https://sistemas.unifal-mg.edu.br/app/rh/gestaopessoas/paginas/unidadesdirigentes.php?unidade_id=124957",
    "lattes": "http://lattes.cnpq.br/3494982072959140",
    "orcid": "https://orcid.org/0000-0002-2837-3437",
    "scholar": "https://scholar.google.com/citations?user=5jTq2CUAAAAJ"
  },
  // Rubens Maciel Filho
  "rubens|filho": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/363/rubens-maciel-filho/",
    "institutional": "https://www.feq.unicamp.br/funcionario/rubens-maciel-filho/",
    "orcid": "https://orcid.org/0000-0001-6511-7283",
    "scholar": "https://scholar.google.com/citations?user=e15Za9wAAAAJ"
  },
  // Rubens Augusto Camargo Lamparelli
  "rubens|lamparelli": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/33856/rubens-augusto-camargo-lamparelli/",
    "institutional": "https://www.nipe.unicamp.br/profissional/rubens-augusto-lamparelli/",
    "lattes": "http://lattes.cnpq.br/5130566170893828",
    "orcid": "https://orcid.org/0000-0003-4344-1263",
    "scholar": "https://scholar.google.com/citations?user=9EQkMZoAAAAJ",
    "scopus": "https://www.scopus.com/authid/detail.uri?authorId=6602713722"
  },
  // Sarita Cândida Rabelo
  "sarita|rabelo": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/72820/sarita-candida-rabelo/",
    "institutional": "https://www.unesp.br/portaldocentes/docentes/319970?lang=pt_BR",
    "lattes": "http://lattes.cnpq.br/9184386547741809",
    "orcid": "https://orcid.org/0000-0002-3153-7674",
    "scholar": "https://scholar.google.com/citations?user=bKX4NIwAAAAJ"
  },
  // Sergio Valdir Bajay
  "sergio|bajay": {
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=297738",
    "orcid": "https://orcid.org/0000-0003-4806-7872"
  },
  // Solange Teles da Silva
  "solange|silva": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/91706/solange-teles-da-silva/",
    "orcid": "https://orcid.org/0000-0001-9770-9734"
  },
  // Sonia Regina da Cal Seixas
  "sonia|seixas": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/33854/sonia-regina-da-cal-seixas/",
    "institutional": "https://nipe.unicamp.br/profissional/sonia-regina-da-cal-seixas/",
    "lattes": "http://lattes.cnpq.br/4762940910820774",
    "orcid": "https://orcid.org/0000-0002-5117-7194"
  },
  // Stella Stopa Assis Palma
  "stella|palma": {
    "lattes": "http://lattes.cnpq.br/4566576044661389",
    "orcid": "https://orcid.org/0000-0001-8821-2048",
    "scholar": "https://scholar.google.com/citations?user=DiMHciYAAAAJ"
  },
  // Thais Aparecida Dibbern
  "thais|dibbern": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/726686/thais-aparecida-dibbern/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=323867"
  },
  // Thalita dos Santos Dalbelo
  "thalita|dalbelo": {
    "orcid": "https://orcid.org/0000-0002-0835-0502",
    "scholar": "https://scholar.google.com/citations?user=hr4gr5QAAAAJ"
  },
  // Valeria Maia Merzel
  "valeria|merzel": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/68088/valeria-maia-merzel/",
    "institutional": "https://site.cpqba.unicamp.br/en/valeriamaia/",
    "lattes": "http://lattes.cnpq.br/3886687872358496",
    "orcid": "https://orcid.org/0000-0001-8817-4758"
  },
  // Waldyr Luiz Ribeiro Gallo
  "waldyr|gallo": {
    "bvFapesp": "https://bv.fapesp.br/pt/pesquisador/87261/waldyr-luiz-ribeiro-gallo/",
    "institutional": "https://portal.dados.unicamp.br/perfil?docente=60917",
    "scholar": "https://scholar.google.com/citations?user=FK4RMkkAAAAJ"
  },
};

// Forma completa do perfil, para o consumidor não precisar testar cada campo.
const EMPTY_PROFILE = {
  orcid: null,
  lattes: null,
  scholar: null,
  scopus: null,
  wos: null,
  bvFapesp: null,
  institutional: null,
  bioPt: null,
  bioEn: null,
};

/**
 * Perfil de uma pessoa pelo nome, espelhando getTeamPhoto: mapa explícito por
 * nameKey, sem casamento difuso. Sempre devolve a forma completa, com null
 * para o que a planilha não trouxe.
 */
export function getResearcherProfile(name) {
  const key = nameKey(name);
  if (!key) return { ...EMPTY_PROFILE };
  return { ...EMPTY_PROFILE, ...(researcherProfiles[key] || {}) };
}

export default researcherProfiles;
