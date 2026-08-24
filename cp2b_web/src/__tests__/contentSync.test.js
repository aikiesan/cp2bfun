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

    it('contains verbatim Missão and Visão from slide 5 in pt', () => {
      expect(missionVisionValues.pt.mission.text).toContain('Desenvolver pesquisas, tecnologias e soluções inovadoras de biogás');
      expect(missionVisionValues.pt.mission.text).toContain('aproveitamento inteligente de resíduos para o desenvolvimento sustentável');
      expect(missionVisionValues.pt.vision.text).toContain('ser referência nacional e internacional na gestão eficiente e sustentável de resíduos urbanos e agropecuários');
      expect(missionVisionValues.pt.vision.text).toContain('transformando o estado de SP em vitrine de soluções inteligentes em biogás');
    });

    it('contains professional English translations for Mission and Vision', () => {
      expect(missionVisionValues.en.mission.text).toContain('Develop research, technologies, and innovative biogas solutions');
      expect(missionVisionValues.en.mission.text).toContain('smart use of waste for sustainable development');
      expect(missionVisionValues.en.vision.text).toContain('To be a national and international reference in the efficient and sustainable management of urban and agricultural waste');
      expect(missionVisionValues.en.vision.text).toContain('transforming the State of São Paulo into a showcase of smart biogas solutions');
    });

    it('contains 5 Core Guiding Values with icons in pt and en', () => {
      expect(missionVisionValues.pt.values).toHaveLength(5);
      expect(missionVisionValues.en.values).toHaveLength(5);
      expect(missionVisionValues.pt.values.map(v => v.title)).toEqual([
        'Excelência Científica & Rigor Técnico',
        'Sustentabilidade & Impacto Socioambiental',
        'Interdisciplinaridade & Integração',
        'Inovação & Cooperação com a Sociedade',
        'Ética, Transparência & Governança',
      ]);
      expect(missionVisionValues.en.values.map(v => v.title)).toEqual([
        'Scientific Excellence & Technical Rigor',
        'Sustainability & Socio-environmental Impact',
        'Interdisciplinarity & Integration',
        'Innovation & Societal Cooperation',
        'Ethics, Transparency & Governance',
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

  describe('Research Axes & Co-Coordinators', () => {
    it('includes Luiz Gustavo Antônio de Souza as co-coordinator in Eixo 4', () => {
      const axis4Pt = researchAxes.pt.find(a => a.id === '4');
      const axis4En = researchAxes.en.find(a => a.id === '4');
      expect(axis4Pt.coordinator).toContain('Luiz Gustavo Antônio de Souza');
      expect(axis4Pt.coordinators.some(c => c.name.includes('Luiz Gustavo Antônio de Souza'))).toBe(true);
      expect(axis4En.coordinator).toContain('Luiz Gustavo Antônio de Souza');
      expect(axis4En.coordinators.some(c => c.name.includes('Luiz Gustavo Antônio de Souza'))).toBe(true);
    });

    it('includes Rachel Biancalana Costa as co-coordinator in Eixo 5', () => {
      const axis5Pt = researchAxes.pt.find(a => a.id === '5');
      const axis5En = researchAxes.en.find(a => a.id === '5');
      expect(axis5Pt.coordinator).toContain('Rachel Biancalana Costa');
      expect(axis5Pt.coordinators.some(c => c.name.includes('Rachel Biancalana Costa'))).toBe(true);
      expect(axis5En.coordinator).toContain('Rachel Biancalana Costa');
      expect(axis5En.coordinators.some(c => c.name.includes('Rachel Biancalana Costa'))).toBe(true);
    });

    it('includes Thais Aparecida Dibbern as co-coordinator in Eixo 8', () => {
      const axis8Pt = researchAxes.pt.find(a => a.id === '8');
      const axis8En = researchAxes.en.find(a => a.id === '8');
      expect(axis8Pt.coordinator).toContain('Thais Aparecida Dibbern');
      expect(axis8Pt.coordinators.some(c => c.name.includes('Thais Aparecida Dibbern'))).toBe(true);
      expect(axis8En.coordinator).toContain('Thais Aparecida Dibbern');
      expect(axis8En.coordinators.some(c => c.name.includes('Thais Aparecida Dibbern'))).toBe(true);
    });
  });

  describe('Researcher Sync & Generated Data', () => {
    it('includes active researchers in teamByAxis with correct axes and direction', () => {
      const ana = teamByAxis.find(p => p.name === 'Ana Beatriz Soares Aguiar');
      const luciana = teamByAxis.find(p => p.name === 'Luciana Cristina Lenhari da Silva');

      expect(ana).toBeDefined();
      expect(ana.axes).toContain('2');
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
