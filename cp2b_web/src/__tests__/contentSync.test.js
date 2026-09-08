import { describe, it, expect } from 'vitest';
import { aboutContent, missionVisionValues, researchAxes } from '../data/content';
import { teamByAxis } from '../data/generated/teamByAxis';
import { laboratories } from '../data/generated/laboratories';
import { technicalServices } from '../data/generated/services';

describe('Milestone M1 Content and Data Synchronization', () => {
  describe('Missão, Visão e Valores', () => {
    it('exports missionVisionValues with pt and en content', () => {
      expect(missionVisionValues).toBeDefined();
      expect(missionVisionValues.pt).toBeDefined();
      expect(missionVisionValues.en).toBeDefined();
    });

    it('contains the revised Missão and Visão in pt, naming inclusive development', () => {
      expect(missionVisionValues.pt.mission.text).toContain('Desenvolver pesquisas, tecnologias e soluções inovadoras em biogás');
      expect(missionVisionValues.pt.mission.text).toContain('desenvolvimento sustentável, inclusivo e equitativo');
      expect(missionVisionValues.pt.vision.text).toContain('Ser referência nacional e internacional na gestão eficiente e sustentável de resíduos urbanos e agropecuários');
      expect(missionVisionValues.pt.vision.text).toContain('vitrine de soluções inteligentes em biogás e de desenvolvimento sustentável, inclusivo e equitativo');
    });

    it('contains professional English translations for Mission and Vision', () => {
      expect(missionVisionValues.en.mission.text).toContain('Develop research, technologies, and innovative biogas solutions');
      expect(missionVisionValues.en.mission.text).toContain('sustainable, inclusive and equitable development');
      expect(missionVisionValues.en.vision.text).toContain('To be a national and international reference in the efficient and sustainable management of urban and agricultural waste');
      expect(missionVisionValues.en.vision.text).toContain('showcase of smart biogas solutions and of sustainable, inclusive and equitable development');
    });

    it('contains 6 Core Guiding Values with icons in pt and en', () => {
      expect(missionVisionValues.pt.values).toHaveLength(6);
      expect(missionVisionValues.en.values).toHaveLength(6);
      expect(missionVisionValues.pt.values.map(v => v.title)).toEqual([
        'Excelência Científica & Rigor Técnico',
        'Sustentabilidade & Impacto Socioambiental',
        'Interdisciplinaridade & Integração',
        'Inovação & Cooperação com a Sociedade',
        'Ética, Transparência & Governança',
        'Diversidade & Equidade de Gênero',
      ]);
      expect(missionVisionValues.en.values.map(v => v.title)).toEqual([
        'Scientific Excellence & Technical Rigor',
        'Sustainability & Socio-environmental Impact',
        'Interdisciplinarity & Integration',
        'Innovation & Societal Cooperation',
        'Ethics, Transparency & Governance',
        'Diversity & Gender Equity',
      ]);
    });

    it('aboutContent has missionVisionValues, missao, visao, and valores integrated', () => {
      expect(aboutContent.pt.missionVisionValues).toBeDefined();
      expect(aboutContent.pt.missao).toBe(missionVisionValues.pt.mission.text);
      expect(aboutContent.pt.visao).toBe(missionVisionValues.pt.vision.text);
      expect(aboutContent.pt.valores).toBe(missionVisionValues.pt.valuesStatement);

      expect(aboutContent.en.missionVisionValues).toBeDefined();
      expect(aboutContent.en.missao).toBe(missionVisionValues.en.mission.text);
      expect(aboutContent.en.visao).toBe(missionVisionValues.en.vision.text);
      expect(aboutContent.en.valores).toBe(missionVisionValues.en.valuesStatement);
    });
  });

  describe('Research Axes Coordination (ANEXO 11)', () => {
    // ANEXO 11, vigente 08/09/2026: o cargo de Coordenador Adjunto foi
    // extinto e a composição de cinco eixos mudou.
    const expected = {
      '1': ['Rubens Augusto Camargo Lamparelli', 'Lucas Nakamura Cerejo'],
      '2': ['Lucas Tadeu Fuess', 'Fabiane Moreira Vieira'],
      '3': ['Priscila Rosseto Camiloti', 'Ana Beatriz Soares Aguiar'],
      '4': ['Marcelo Pereira Cunha', 'Carlos Eduardo Driemeier'],
      '5': ['Rachel Biancalana Costa'],
      '6': ['Renata Piacentini Rodriguez', 'Bruna de Souza Moraes'],
      '7': ['Maria Paula Cardeal Volpi', 'Renata Piacentini Rodriguez'],
      '8': ['Natalia Molina Cetrulo', 'Thais Aparecida Dibbern'],
    };

    it.each(Object.entries(expected))('lists the ANEXO 11 coordination for Eixo %s', (id, names) => {
      for (const lang of ['pt', 'en']) {
        const axis = researchAxes[lang].find((a) => a.id === id);
        expect(axis.coordinators).toHaveLength(names.length);
        names.forEach((name, i) => {
          expect(axis.coordinators[i].name).toContain(name);
          expect(axis.coordinator).toContain(name);
        });
      }
    });

    it('no longer carries adjunct coordinators', () => {
      for (const lang of ['pt', 'en']) {
        for (const axis of researchAxes[lang]) {
          expect(axis.coordinators.every((c) => c.role === 'Coord.')).toBe(true);
          expect(axis.coordinator).not.toContain('(Adj.)');
        }
      }
    });

    it('drops the coordinators replaced by ANEXO 11', () => {
      const all = ['pt', 'en'].flatMap((lang) =>
        researchAxes[lang].flatMap((a) => a.coordinators.map((c) => c.name))
      );
      for (const gone of ['Luana Mattos', 'Enelton Fagnani', 'Luis Alberto Follegatti Romero',
        'Luiz Gustavo', 'Rafael de Brito Dias']) {
        expect(all.some((n) => n.includes(gone))).toBe(false);
      }
    });
  });

  describe('Researcher Sync & Generated Data', () => {
    it('includes active researchers in teamByAxis with correct axes and direction', () => {
      const ana = teamByAxis.find(p => p.name === 'Ana Beatriz Soares Aguiar');
      const luciana = teamByAxis.find(p => p.name === 'Luciana Cristina Lenhari da Silva');

      expect(ana).toBeDefined();
      expect(ana.axes).toContain('3');
      expect(ana.direction).toBe(false);

      expect(luciana).toBeDefined();
      expect(luciana.axes).toContain('8');
      expect(luciana.direction).toBe(false);
    });

    it('includes 3 laboratories and 15 technical services', () => {
      expect(laboratories).toHaveLength(3);
      expect(laboratories.map(l => l.acronym)).toEqual(
        expect.arrayContaining(['CEMARA (UNIFAL)', 'CP2b Lab', 'PPBIOEN'])
      );
      expect(technicalServices).toHaveLength(15);
      technicalServices.forEach(service => {
        expect(service.pt.title).toBeTruthy();
        expect(service.en.title).toBeTruthy();
        expect(service.trl).toBeTruthy();
      });
    });
  });
});
