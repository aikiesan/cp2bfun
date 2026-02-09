-- Migration: Seed partners data
-- Date: 2026-02-09
-- Description: Initial partners data migrated from content.js

BEGIN;

-- Insert Host Institution
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active) VALUES
('Núcleo Interdisciplinar de Planejamento Energético (NIPE/UNICAMP)', 'Interdisciplinary Center for Energy Planning (NIPE/UNICAMP)', 'host', 'Campinas, SP', 10, TRUE);

-- Insert Public Entities
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active) VALUES
('Secretaria Estadual de Agricultura e Abastecimento de São Paulo (SAASP)', 'São Paulo State Secretariat of Agriculture and Supply (SAASP)', 'public', 'São Paulo, SP', 10, TRUE),
('Secretaria Municipal do Verde, Meio Ambiente e Desenvolvimento Sustentável de Campinas (SMVMADS/PMC)', 'Campinas Municipal Secretariat of Green, Environment and Sustainable Development (SMVMADS/PMC)', 'public', 'Campinas, SP', 20, TRUE);

-- Insert Research Institutions
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active) VALUES
('Universidade Federal de Alfenas (UNIFAL)', 'Federal University of Alfenas (UNIFAL)', 'research', 'Alfenas, MG', 10, TRUE),
('Instituto Agronômico de Campinas (IAC/SAASP)', 'Agronomic Institute of Campinas (IAC/SAASP)', 'research', 'Campinas, SP', 20, TRUE),
('Associação Brasileira de Pesquisa e Inovação Industrial (EMBRAPII)', 'Brazilian Association for Industrial Research and Innovation (EMBRAPII)', 'research', 'Brasília, DF', 30, TRUE),
('Instituto de Zootecnia (IZ/SAASP)', 'Institute of Animal Science (IZ/SAASP)', 'research', 'Nova Odessa, SP', 40, TRUE),
('Escola Politécnica (EP/USP)', 'Polytechnic School (EP/USP)', 'research', 'São Paulo, SP', 50, TRUE),
('Universidad de Cádiz (UCA)', 'University of Cádiz (UCA)', 'research', 'Espanha', 60, TRUE),
('Delft University of Technology (TUDELFT)', 'Delft University of Technology (TUDELFT)', 'research', 'Países Baixos', 70, TRUE),
('Laboratório Nacional de Energia e Geologia (LNEG)', 'National Laboratory of Energy and Geology (LNEG)', 'research', 'Portugal', 80, TRUE);

-- Insert Companies
INSERT INTO partners (name_pt, name_en, category, location, sort_order, active) VALUES
('Companhia de Gás de São Paulo (COMGAS)', 'São Paulo Gas Company (COMGAS)', 'companies', 'São Paulo, SP', 10, TRUE),
('Amplum Biogás e Energias Renováveis Ltda.', 'Amplum Biogas and Renewable Energy Ltd.', 'companies', 'Campo Mourão, PR', 20, TRUE),
('Companhia de Saneamento Básico do Estado de São Paulo (SABESP)', 'São Paulo State Basic Sanitation Company (SABESP)', 'companies', 'São Paulo, SP', 30, TRUE),
('Cooperativa dos Plantadores de Cana do Oeste do Estado de São Paulo (COPERCANA)', 'Cooperative of Sugar Cane Planters of Western São Paulo State (COPERCANA)', 'companies', 'Sertãozinho, SP', 40, TRUE);

COMMIT;
