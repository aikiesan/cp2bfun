-- Migration: Seed partners data
-- Date: 2026-02-09
-- Description: Initial partners data migrated from content.js
--
-- Idempotente por nome: cada linha só entra se `name_pt` ainda não existir.
-- A tabela `partners` não tem restrição UNIQUE em name_pt, então a versão
-- original deste arquivo duplicava as 30 linhas a cada nova execução do
-- db:init. O guarda abaixo troca VALUES por SELECT ... WHERE NOT EXISTS.

BEGIN;

-- Insert Host Institution
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Núcleo Interdisciplinar de Planejamento Energético (NIPE/UNICAMP)', 'Interdisciplinary Center for Energy Planning (NIPE/UNICAMP)', 'host', 'Campinas, SP', 10, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Núcleo Interdisciplinar de Planejamento Energético (NIPE/UNICAMP)');

-- Insert Public Entities
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Secretaria Estadual de Agricultura e Abastecimento de São Paulo (SAASP)', 'São Paulo State Secretariat of Agriculture and Supply (SAASP)', 'public', 'São Paulo, SP', 10, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Secretaria Estadual de Agricultura e Abastecimento de São Paulo (SAASP)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Secretaria Municipal do Verde, Meio Ambiente e Desenvolvimento Sustentável de Campinas (SMVMADS/PMC)', 'Campinas Municipal Secretariat of Green, Environment and Sustainable Development (SMVMADS/PMC)', 'public', 'Campinas, SP', 20, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Secretaria Municipal do Verde, Meio Ambiente e Desenvolvimento Sustentável de Campinas (SMVMADS/PMC)');

-- Insert Research Institutions
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Universidade Federal de Alfenas (UNIFAL)', 'Federal University of Alfenas (UNIFAL)', 'research', 'Alfenas, MG', 10, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Universidade Federal de Alfenas (UNIFAL)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Instituto Agronômico de Campinas (IAC/SAASP)', 'Agronomic Institute of Campinas (IAC/SAASP)', 'research', 'Campinas, SP', 20, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Instituto Agronômico de Campinas (IAC/SAASP)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Associação Brasileira de Pesquisa e Inovação Industrial (EMBRAPII)', 'Brazilian Association for Industrial Research and Innovation (EMBRAPII)', 'research', 'Brasília, DF', 30, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Associação Brasileira de Pesquisa e Inovação Industrial (EMBRAPII)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Instituto de Zootecnia (IZ/SAASP)', 'Institute of Animal Science (IZ/SAASP)', 'research', 'Nova Odessa, SP', 40, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Instituto de Zootecnia (IZ/SAASP)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Escola Politécnica (EP/USP)', 'Polytechnic School (EP/USP)', 'research', 'São Paulo, SP', 50, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Escola Politécnica (EP/USP)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Universidad de Cádiz (UCA)', 'University of Cádiz (UCA)', 'research', 'Espanha', 60, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Universidad de Cádiz (UCA)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Delft University of Technology (TUDELFT)', 'Delft University of Technology (TUDELFT)', 'research', 'Países Baixos', 70, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Delft University of Technology (TUDELFT)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Laboratório Nacional de Energia e Geologia (LNEG)', 'National Laboratory of Energy and Geology (LNEG)', 'research', 'Portugal', 80, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Laboratório Nacional de Energia e Geologia (LNEG)');

-- Insert Companies
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Companhia de Gás de São Paulo (COMGAS)', 'São Paulo Gas Company (COMGAS)', 'companies', 'São Paulo, SP', 10, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Companhia de Gás de São Paulo (COMGAS)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Amplum Biogás e Energias Renováveis Ltda.', 'Amplum Biogas and Renewable Energy Ltd.', 'companies', 'Campo Mourão, PR', 20, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Amplum Biogás e Energias Renováveis Ltda.');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Companhia de Saneamento Básico do Estado de São Paulo (SABESP)', 'São Paulo State Basic Sanitation Company (SABESP)', 'companies', 'São Paulo, SP', 30, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Companhia de Saneamento Básico do Estado de São Paulo (SABESP)');

INSERT INTO partners (name_pt, name_en, category, location, sort_order, active)
SELECT 'Cooperativa dos Plantadores de Cana do Oeste do Estado de São Paulo (COPERCANA)', 'Cooperative of Sugar Cane Planters of Western São Paulo State (COPERCANA)', 'companies', 'Sertãozinho, SP', 40, TRUE
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name_pt = 'Cooperativa dos Plantadores de Cana do Oeste do Estado de São Paulo (COPERCANA)');

COMMIT;
