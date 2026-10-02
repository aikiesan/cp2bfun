-- Migration: 027_partner_logos.sql
-- Description: Populate logo paths and website URLs for non-governmental partners.
--
-- Conformidade com o Defeso Eleitoral 2026 (DEFESO_ELEITORAL_2026.md):
-- Apenas os 12 parceiros não-governamentais (8 de pesquisa e 4 empresas)
-- são atualizados. Os órgãos governamentais (SAASP e Prefeitura de Campinas)
-- permanecem intocados/ocultos.

BEGIN;

-- Research Institutions (8)
UPDATE partners
SET logo = '/assets/partners/unifal.png',
    website = 'https://www.unifal-mg.edu.br',
    updated_at = NOW()
WHERE name_pt = 'Universidade Federal de Alfenas (UNIFAL)';

UPDATE partners
SET logo = '/assets/partners/iac.png',
    website = 'https://www.iac.sp.gov.br',
    updated_at = NOW()
WHERE name_pt = 'Instituto Agronômico de Campinas (IAC/SAASP)';

UPDATE partners
SET logo = '/assets/partners/embrapii.png',
    website = 'https://embrapii.org.br',
    updated_at = NOW()
WHERE name_pt = 'Associação Brasileira de Pesquisa e Inovação Industrial (EMBRAPII)';

UPDATE partners
SET logo = '/assets/partners/iz.png',
    website = 'https://www.iz.sp.gov.br',
    updated_at = NOW()
WHERE name_pt = 'Instituto de Zootecnia (IZ/SAASP)';

UPDATE partners
SET logo = '/assets/partners/ep-usp.png',
    website = 'https://www.poli.usp.br',
    updated_at = NOW()
WHERE name_pt = 'Escola Politécnica (EP/USP)';

UPDATE partners
SET logo = '/assets/partners/uca.png',
    website = 'https://www.uca.es',
    updated_at = NOW()
WHERE name_pt = 'Universidad de Cádiz (UCA)';

UPDATE partners
SET logo = '/assets/partners/tudelft.png',
    website = 'https://www.tudelft.nl',
    updated_at = NOW()
WHERE name_pt = 'Delft University of Technology (TUDELFT)';

UPDATE partners
SET logo = '/assets/partners/lneg.png',
    website = 'https://www.lneg.pt',
    updated_at = NOW()
WHERE name_pt = 'Laboratório Nacional de Energia e Geologia (LNEG)';

-- Partner Companies (4)
UPDATE partners
SET logo = '/assets/partners/comgas.png',
    website = 'https://www.comgas.com.br',
    updated_at = NOW()
WHERE name_pt = 'Companhia de Gás de São Paulo (COMGAS)';

UPDATE partners
SET logo = '/assets/partners/amplum-biogas.png',
    website = 'https://amplumbiogas.com.br',
    updated_at = NOW()
WHERE name_pt = 'Amplum Biogás e Energias Renováveis Ltda.';

UPDATE partners
SET logo = '/assets/partners/sabesp.png',
    website = 'https://www.sabesp.com.br',
    updated_at = NOW()
WHERE name_pt = 'Companhia de Saneamento Básico do Estado de São Paulo (SABESP)';

UPDATE partners
SET logo = '/assets/partners/copercana.png',
    website = 'https://www.copercana.com.br',
    updated_at = NOW()
WHERE name_pt = 'Cooperativa dos Plantadores de Cana do Oeste do Estado de São Paulo (COPERCANA)';

COMMIT;
