-- Semente das publicações indexadas do CP2b (2025), extraídas da aba
-- 'Publicações Indexadas' da planilha estratégica (Luciana, ago/2026).
--
-- A coluna de origem traz a citação completa (autores+título+periódico+DOI)
-- como um único campo de texto livre, não estruturado por autor/periódico.
-- Por segurança, `title_pt` guarda a citação completa tal como veio da
-- planilha (nunca incorreta), e `authors`/`journal` recebem um placeholder
-- indicando que ainda não foram separados — um editor deve revisar e
-- quebrar os campos manualmente pelo admin (/admin/publications).
--
-- Idempotente por DOI: cada INSERT só roda se o DOI ainda não existir na
-- tabela (ou, na ausência de DOI, se o título completo ainda não existir).

INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Aguiar, A. B. S., Volpi, M. P. C., Mockaitis, G., de Moura, R. B., Rodriguez, R. P., & Moraes, B. de S. (2025). Assessment of methane production through co-digestion of biomass from the sugarcane and livestock sectors. Biomass Conversion and Biorefinery, 15, Article 1. https://doi.org/10.1007/s13399-025-02100-x', '(citação completa em title_pt — revisar autoria)', 2025, '10.1007/s13399-025-02100-x', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1007/s13399-025-02100-x');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'BENATTI, JULIO CESAR BELTRAME; DE ANDRADE, AFONSO ERIS FERREIRA; NOUR, EDSON APARECIDO ABDUL; DE OLIVEIRA CRUZ, LUANA MATTOS. Aeration-Driven Microbial Aggregation in Aerobic Granular Sludge Systems for Low-Strength Wastewater Treatment. DESALINATION AND WATER TREATMENT (ONLINE), v. 322, p. 101050, 2025. Citações:3 (http://dx.doi.org/10.1016/j.dwt.2025.101050)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.dwt.2025.101050', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.dwt.2025.101050');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Bovio-Winkler, P., Orellana, E., Campanaro, S., Montoya-Rosales, J.J., Fuess, L.T., Carrillo-Reyes, J., Castelló, E., Muñoz-Páez, K.M., Moreno-Andrade, I., Buitrón, G., Razo-Flores, E., Etchebehere, C., Unraveling the biological mechanisms of biohydrogen production through dark fermentation using assembled genomes from metagenomic data (https://doi.org/10.1007/s00449-025-03267-6)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1007/s00449-025-03267-6', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1007/s00449-025-03267-6');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Souza, D. F. de, Sauer, I. L., Dorileo, I. L., & Tatizawa, H. (2025). Eficiência energética em sistemas motrizes e as novas tecnologias no contexto da transição energética. Revista Caribeña - QUALIS B1, 14(3), e4489. https://doi.org/10.55905/rcssv14n3-013 - DOI: 10.55905/rcssv14n3-013.', '(citação completa em title_pt — revisar autoria)', 2025, '10.55905/rcssv14n3-013', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.55905/rcssv14n3-013');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Dias, M.E.S., Fuess, L.T., Nogueira, E.W., Tommaso, G., Beyond two-phase anaerobic digestion: using acidogenic fermentation-derived liquor as a catalyst for thermochemical pretreatment of coffee wastes prior to methanogenesis (https://doi.org/10.1016/j.fuel.2025.137232)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.fuel.2025.137232', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.fuel.2025.137232');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Dias, M.E.S., Fuess, L.T., Oliveira, G.H.D., Takeda, P.Y., Carneiro, R.B., Tommaso, G., Unraveling the independent effects of mild alkaline pretreatment and bicarbonate buffering on methane yield from spent coffee grounds (https://doi.org/10.1016/j.biombioe.2025.108575)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.biombioe.2025.108575', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.biombioe.2025.108575');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'DIAS, R. B. Visões de desenvolvimento: a relação entre natureza, sociedade e tecnologia na construção de uma Civilização Ecológica pela China. Revista Brasileira de Estudos CTS, v. 1, p. 236-251, 2025. https://revistabrasileiradeestudoscts.com/revista/article/view/20', '(citação completa em title_pt — revisar autoria)', 2025, NULL, 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE title_pt = 'DIAS, R. B. Visões de desenvolvimento: a relação entre natureza, sociedade e tecnologia na construção de uma Civilização Ecológica pela China. Revista Brasileira de Estudos CTS, v. 1, p. 236-251, 2025. https://revistabrasileiradeestudoscts.com/revista/article/view/20');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Bagattolli, C., & de Brito Dias, R. (2025). Editorial for the Thematic Issue: Rethinking Innovation Beyond the Fable — Critical Pathways and Alternative Policy Models. NOvation — Critical Studies of Innovation, (7), 1–8. https://doi.org/10.5380/nocsi.i7.102441', '(citação completa em title_pt — revisar autoria)', 2025, '10.5380/nocsi.i7.102441', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.5380/nocsi.i7.102441');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'GERALDO, SAMARA LUIZA ALVES ; DE ANDRADE, AFONSO ERIS FERREIRA ; NOUR, EDSON APARECIDO ABDUL ; MATTOS DE OLIVEIRA CRUZ, LUANA . What drives the adoption of a technology? An analysis of the implementation of Nereda®. WATER RESEARCH, v. 281, p. 123591, 2025. (http://dx.doi.org/10.1016/j.watres.2025.123591)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.watres.2025.123591', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.watres.2025.123591');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Gheewala, S. H., Lazaro, L., Albatayneh, A., Brown, R. M., Park, W. K., Brandäo, M., & Zeng, X. (2025). Pathways to sustainable biofuels. One Earth, 8(7). 10.1016/j.oneear.2025.101384. https://www.sciencedirect.com/science/article/abs/pii/S2590332225002106', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.oneear.2025.101384', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.oneear.2025.101384');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'LLB Lazaro, LL Giatti, AF Simoes, A Giarolla, PR Jacobi, JAP Oliveira Energy Research & Social Science 129, 104353. Corporate lobbying, agribusiness, and climate change politics in Brazil''s bioenergy transition. https://www.sciencedirect.com/science/article/abs/pii/S2214629625004347', '(citação completa em title_pt — revisar autoria)', 2025, NULL, 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE title_pt = 'LLB Lazaro, LL Giatti, AF Simoes, A Giarolla, PR Jacobi, JAP Oliveira Energy Research & Social Science 129, 104353. Corporate lobbying, agribusiness, and climate change politics in Brazil''s bioenergy transition. https://www.sciencedirect.com/science/article/abs/pii/S2214629625004347');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'LLB Lazaro, Usuriga-Najera, JA O. Neto, A. Grimoni, P Jacobi Energy for Sustainable Development Volume 88 (October 2025), 101779. Climate commitments and energy transition pledges in Latin America: Where is the region headed?. https://www.sciencedirect.com/science/article/abs/pii/S0973082625001292', '(citação completa em title_pt — revisar autoria)', 2025, NULL, 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE title_pt = 'LLB Lazaro, Usuriga-Najera, JA O. Neto, A. Grimoni, P Jacobi Energy for Sustainable Development Volume 88 (October 2025), 101779. Climate commitments and energy transition pledges in Latin America: Where is the region headed?. https://www.sciencedirect.com/science/article/abs/pii/S0973082625001292');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Miele, M. J., Pereira Coltri, P., Ferreira Soares, C., Teixeira Souza, R., Carvalho Pacagnella, R., Cecatti, J. G., & Teruel, B. (2025). Correction: From field to plate: 50 years of plant-based food production and emerging risks to planetary and women''s health. Frontiers in Nutrition, 12, 1666757. https://doi.org/10.3389/fnut.2025.1666757', '(citação completa em title_pt — revisar autoria)', 2025, '10.3389/fnut.2025.1666757', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.3389/fnut.2025.1666757');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Miele MJ, da Silva JT, Souza RT, Cecatti JG, Teruel B (2025) Integrating national open databases for a comprehensive view on food systems, environment sustainability and health in Brazil. PLoS One 20(11): e0329353. https://doi.org/10.1371/journal.pone.0329353', '(citação completa em title_pt — revisar autoria)', 2025, '10.1371/journal.pone.0329353', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1371/journal.pone.0329353');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Nascimento, I. da S. (2026). Um panorama geral das energias renováveis e sua importância para a sustentabilidade energética. Revista OWL (OWL Journal). https://www.revistaowl.com.br/index.php/owl/article/view/474', '(citação completa em title_pt — revisar autoria)', 2026, NULL, 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE title_pt = 'Nascimento, I. da S. (2026). Um panorama geral das energias renováveis e sua importância para a sustentabilidade energética. Revista OWL (OWL Journal). https://www.revistaowl.com.br/index.php/owl/article/view/474');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Oldoni, H., Magalhães, P. S. G., Oliveira, A. L. G., Lima, J. P., Figueiredo, G. K. D. A., Moro, E., & Amaral, L. R. (2025). Management zones delineation: A proposal to overcome the crop–pasture rotation challenge. Precision Agriculture, 26, Article 21. https://doi.org/10.1007/s11119-024-10214-0', '(citação completa em title_pt — revisar autoria)', 2025, '10.1007/s11119-024-10214-0', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1007/s11119-024-10214-0');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Oliveira Cruz, Luana Mattos de; MENEZES, ROSANA OLIVEIRA ; ALVES GERALDO, SAMARA LUIZA ; PÉREZ, JULIO . Anaerobic ammonium oxidation in sponge-bed trickling filter: Operational conditions and mainstream sewage treatment. BIORESOURCE TECHNOLOGY, v. 440, p. 133478, 2026. (http://dx.doi.org/10.1016/j.biortech.2025.133478)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.biortech.2025.133478', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.biortech.2025.133478');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'PATRAKOV, E.; DIAS, R. B. ; FROGERI, R.; BATURINA, L. The Human and Social Factors of Technological Innovations: Risks and Resources Analysis Model. NOvation, v. 7, p. 189-212, 2025. https://doi.org/10.5380/nocsi.i7.98322', '(citação completa em title_pt — revisar autoria)', 2025, '10.5380/nocsi.i7.98322', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.5380/nocsi.i7.98322');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'PESSOA, CAROLINE MAYARA ; DA SILVA, AMANDA ARAÚJO ; DE ABREU SOUSA, DEMETRIO ; Fagnani, Enelton ; CRISTALE, JOYCE . Assessing human exposure to organophosphate esters through consumption of animal-based and plant-based foods in Brazil. MICROCHEMICAL JOURNAL, v. 1, p. 112607-112607, 2025. https://doi.org/10.1016/j.microc.2024.112607', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.microc.2024.112607', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.microc.2024.112607');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Rogeri, R.C., Gomes, K.G., Araujo, M.N., Borges, A.V., Gil-Garcia, C., Damianovic, M.H.R.Z., Zaiat, M., Fuess, L.T., Advancements in two stage anaerobic digestion of sugarcane vinasse: overcoming drawbacks by exploiting the fermentative sulfidogenic process (https://doi.org/10.1007/s11157-025-09744-4)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1007/s11157-025-09744-4', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1007/s11157-025-09744-4');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Rogeri, R.C., Stolecka-Antczak, K., Maradini, P.S., Camiloti, P.R., Rusin, A., Fuess, L.T., Risk Assessment of Biogas Production from Sugarcane Vinasse: Does the Anaerobic Bioreactor Configuration Affect the Hazards? (https://doi.org/10.3390/biomass5040079)', '(citação completa em title_pt — revisar autoria)', 2025, '10.3390/biomass5040079', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.3390/biomass5040079');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Silva, T.A., Araujo, M.N., Rezende, E.G.F., Saia, F.T., Magalhães, I.B., Pereira, A.S.A.P., Ferreira, J., Gregoracci, G.B., Adorno, M.A.T., Fuess, L.T., Zaiat, M., Calijuri, M.L., Biohydrogen production from wastewater-grown microalgae-bacteria consortia: Optimizing inoculum selection for enhanced yield (https://doi.org/10.1016/j.renene.2025.123079)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.renene.2025.123079', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.renene.2025.123079');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Silva, T.A., Jesus Junior, M.M., Araujo, M.N., Castro, L.S., Fuess, L.T., Rodrigues, F.A., Zaiat, M., Reis, A.J.D., Calijuri, M.L., Enhancing microalgal biohydrogen production: Unlocking higher yields with hydrothermal pretreatment with niobium phosphate (https://doi.org/10.1016/j.renene.2025.125048)', '(citação completa em title_pt — revisar autoria)', 2025, '10.1016/j.renene.2025.125048', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.1016/j.renene.2025.125048');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'SOLDERA, P. E. S. ; DANTAS, R. F. ; FAGNANI, E. . Mathematical modeling to size anaerobic stabilization ponds intended for slaughterhouse wastewater treatment - the role of temperature and hydraulic retention time. Environmental Science-Water Research & Technology, v. 1, p. 1-1, 2024. Mathematical modeling to size anaerobic stabilization ponds intended for slaughterhouse wastewater treatment – the role of temperature and hydraulic retention time - Environmental Science: Water Research & Technology (RSC Publishing)', '(citação completa em title_pt — revisar autoria)', 2025, NULL, 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE title_pt = 'SOLDERA, P. E. S. ; DANTAS, R. F. ; FAGNANI, E. . Mathematical modeling to size anaerobic stabilization ponds intended for slaughterhouse wastewater treatment - the role of temperature and hydraulic retention time. Environmental Science-Water Research & Technology, v. 1, p. 1-1, 2024. Mathematical modeling to size anaerobic stabilization ponds intended for slaughterhouse wastewater treatment – the role of temperature and hydraulic retention time - Environmental Science: Water Research & Technology (RSC Publishing)');
INSERT INTO publications (title_pt, authors, year, doi, publication_type)
SELECT 'Vanolli, B. da S., Dias, H. B., da Luz, F. B., Lamparelli, R. A. C., Magalhães, P. S. G., & Cherubin, M. R. (2025). Crop–livestock integrated systems improve soil health in tropical sandy soils. Agronomy, 15(2), 378. https://doi.org/10.3390/agronomy15020378', '(citação completa em title_pt — revisar autoria)', 2025, '10.3390/agronomy15020378', 'article'
WHERE NOT EXISTS (SELECT 1 FROM publications WHERE doi = '10.3390/agronomy15020378');
