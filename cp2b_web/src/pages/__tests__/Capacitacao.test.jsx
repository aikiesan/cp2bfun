import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderWithProviders } from '../../test/utils';
import Capacitacao from '../Capacitacao';
import { capacitacaoContent, courseTemplate, proposalsEmail } from '../../data/capacitacao';

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, '../../../public');

describe('Capacitacao', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('publishes the official 16-hour model course', () => {
    renderWithProviders(<Capacitacao />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cursos e Capacitação' })).toBeInTheDocument();

    const course = document.querySelector('#curso-modelo');
    expect(
      within(course).getByRole('heading', { name: 'Biogás, Biometano e Bioprodutos para a Transição Energética' }),
    ).toBeInTheDocument();
    expect(course).toHaveTextContent('16 horas');
    expect(course).toHaveTextContent('Capacitar profissionais para atuar em projetos de biogás, biometano e valorização de resíduos.');
    expect(course).toHaveTextContent('Formação de recursos humanos qualificados e fortalecimento do ecossistema de inovação do CP2b.');
    const audience = [...course.querySelectorAll('.cap-tags li')].map((li) => li.textContent);
    expect(audience).toEqual(['Pesquisadores', 'Profissionais da indústria', 'Gestores públicos', 'Estudantes']);
    expect(course.querySelectorAll('.cap-modules__list li')).toHaveLength(8);
  });

  it('offers the course template as a download', () => {
    renderWithProviders(<Capacitacao />);
    const link = screen.getByRole('link', { name: /Baixar template/ });
    expect(link).toHaveAttribute('href', courseTemplate.href);
    expect(link).toHaveAttribute('download', courseTemplate.fileName);
  });

  it('sends proposals to the board, with the subject filled in', () => {
    renderWithProviders(<Capacitacao />);
    const mailtos = [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute('href'));
    expect(mailtos.length).toBeGreaterThan(0);
    mailtos.forEach((href) => {
      expect(href.startsWith(`mailto:${proposalsEmail}?subject=`)).toBe(true);
      expect(decodeURIComponent(href.split('subject=')[1])).toBe('Proposta de curso – CP2b');
    });
  });

  it('lists the 13 sections of the template, the last one pointing to the model course', () => {
    renderWithProviders(<Capacitacao />);
    const items = document.querySelectorAll('.cap-outline__item');
    expect(items).toHaveLength(13);
    expect(items[0]).toHaveTextContent('Identificação do curso');
    expect(within(items[12]).getByRole('link')).toHaveAttribute('href', '#curso-modelo');
  });

  it('shows the Axis 6 coordination as /eixos does, without academic titles', () => {
    renderWithProviders(<Capacitacao />);
    const coord = document.querySelector('.cap-contact__people');
    expect(coord).toHaveTextContent('Renata Piacentini Rodriguez');
    expect(coord).toHaveTextContent('Bruna de Souza Moraes');
    expect(coord.textContent).not.toMatch(/Prof|Dr/);
    expect(screen.getByRole('link', { name: /Conheça o Eixo 6/ })).toHaveAttribute('href', '/eixos?eixo=6#explorar-eixos');
  });

  it('renders in English and says the template is in Portuguese', () => {
    localStorage.setItem('cp2b_lang', 'en');
    renderWithProviders(<Capacitacao />);
    expect(screen.getByRole('heading', { level: 1, name: 'Courses and Training' })).toBeInTheDocument();
    expect(screen.getByText('The template is in Portuguese.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Download template/ })).toHaveAttribute('href', courseTemplate.href);
  });

  it('keeps the Portuguese and English content in step', () => {
    const { pt, en } = capacitacaoContent;
    expect(en.model.audience).toHaveLength(pt.model.audience.length);
    expect(en.model.modules).toHaveLength(pt.model.modules.length);
    expect(en.propose.formats).toHaveLength(pt.propose.formats.length);
    expect(en.propose.steps).toHaveLength(pt.propose.steps.length);
    expect(en.outline.sections.map((s) => s.anchor)).toEqual(pt.outline.sections.map((s) => s.anchor));
  });

  // O template veio do Google Docs com os comentários da revisão interna
  // guardados em customXml, invisíveis no Word. Os nomes das partes do .docx
  // ficam sem compressão no zip, então basta procurá-los nos bytes do arquivo.
  it('publishes the template without the hidden Google Docs review data', () => {
    const file = fs.readFileSync(path.join(publicDir, courseTemplate.href));
    expect(file.subarray(0, 2).toString()).toBe('PK');
    expect(file.includes('word/document.xml')).toBe(true);
    expect(file.includes('customXml/')).toBe(false);
  });
});
