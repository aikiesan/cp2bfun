import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';

// O modo de movimento é controlado daqui: jsdom não tem preferência de sistema.
const motion = vi.hoisted(() => ({ reduce: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motion.reduce };
});

import { renderWithProviders } from '../../test/utils';
import Solucoes from '../Solucoes';
import { laboratories } from '../../data/generated/laboratories';
import { technicalServices } from '../../data/generated/services';
import { formatFormulas } from '../../utils/formatFormulas';

// O esperado é calculado aqui, direto dos dados gerados da planilha, e não
// pelos helpers do componente: se a conta do componente mudar, o teste acusa.
const short = (acronym) => acronym.replace(/\s*\(.*?\)\s*/g, '').trim();
const expectedLabs = (n) => laboratories.filter((l) => l.group === 'bioprocessos' && l.trl && l.trl.min <= n && n <= l.trl.max);
const expectedServices = (n) => technicalServices.filter((s) => s.trlMin <= n && n <= s.trlMax);

const results = () => document.querySelector('.trl-match__result');
const live = () => document.querySelector('.trl-match__live');
const pick = (n) => fireEvent.click(screen.getByRole('button', { name: new RegExp(`^TRL ${n}:`) }));
const catalogTitles = () => [...document.querySelectorAll('#servicos .svc__title')].map((e) => e.textContent);
const titlesOf = (services) => services.map((s) => formatFormulas(s.pt.title));

beforeEach(() => {
  motion.reduce = false;
  localStorage.removeItem('cp2b_lang');
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  delete Element.prototype.scrollIntoView;
  localStorage.removeItem('cp2b_lang');
});

describe('Infraestrutura e Soluções — "Qual é o seu desafio?"', () => {
  it('offers the nine TRL levels, named after the same phases as the ruler', () => {
    renderWithProviders(<Solucoes />);
    const group = screen.getByRole('group', { name: 'Em que nível de maturidade (TRL) está a sua demanda?' });
    const levels = within(group).getAllByRole('button');
    expect(levels.map((b) => b.textContent)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    levels.forEach((b) => expect(b).toHaveAttribute('aria-pressed', 'false'));

    const rulerPhases = [...document.querySelectorAll('.lab-trl__phase-name')].map((e) => e.textContent);
    expect(rulerPhases).toHaveLength(3);
    expect(levels[0]).toHaveAccessibleName(`TRL 1: ${rulerPhases[0]}`);
    expect(levels[4]).toHaveAccessibleName(`TRL 5: ${rulerPhases[1]}`);
    expect(levels[8]).toHaveAccessibleName(`TRL 9: ${rulerPhases[2]}`);
  });

  it('starts with nothing chosen and a live summary region, empty until a level is chosen', () => {
    renderWithProviders(<Solucoes />);
    expect(live()).toHaveAttribute('aria-live', 'polite');
    expect(live()).toHaveClass('visually-hidden');
    expect(live()).toBeEmptyDOMElement();
    expect(within(results()).getByText(/Escolha um nível de 1 a 9/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Fale com o CP2b/ })).toHaveAttribute('href', '/contato');
  });

  it('announces only a short summary of the level, never the whole panel', async () => {
    renderWithProviders(<Solucoes />);
    pick(4);
    const nLabs = expectedLabs(4).length;
    const nServices = expectedServices(4).length;
    expect(nLabs).toBeGreaterThan(1);
    expect(live()).toHaveTextContent(`TRL 4 · Validação e escalonamento: ${nLabs} laboratórios, ${nServices} serviços`);

    // The detailed panel (lab cards, chips, the button) is outside any live
    // region, so it is not read out on every change.
    await waitFor(() => expect(results().querySelectorAll('.trl-match__lab')).toHaveLength(nLabs));
    expect(results().closest('[aria-live]')).toBeNull();
    expect(results().querySelector('[aria-live]')).toBeNull();
    expect(live()).not.toHaveTextContent(expectedLabs(4)[0].lead);

    pick(8);
    expect(live()).toHaveTextContent('TRL 8 · Demonstração e mercado: nenhum laboratório, nenhum serviço');
  });

  it.each([2, 3, 4, 5, 6])('TRL %i: lists exactly the core labs whose range covers it, and counts the services', async (n) => {
    renderWithProviders(<Solucoes />);
    pick(n);
    expect(screen.getByRole('button', { name: new RegExp(`^TRL ${n}:`) })).toHaveAttribute('aria-pressed', 'true');

    const labs = expectedLabs(n);
    expect(labs.length).toBeGreaterThan(0);
    await waitFor(() => {
      const shown = [...results().querySelectorAll('.trl-match__lab-acr')].map((e) => e.textContent);
      expect(shown).toEqual(labs.map((l) => short(l.acronym)));
    });

    const cards = [...results().querySelectorAll('.trl-match__lab')];
    cards.forEach((card, i) => {
      expect(card).toHaveTextContent(labs[i].lead);
      expect(card).toHaveTextContent(`TRL ${labs[i].trl.min}–${labs[i].trl.max}`);
      // O selo de foco só aparece no nível de maior concentração do laboratório.
      expect(Boolean(card.querySelector('.trl-match__focus'))).toBe(labs[i].trl.focus === n);
    });

    const count = expectedServices(n).length;
    expect(results().querySelector('.trl-match__count')).toHaveTextContent(`${count}`);
    expect(within(results()).getByRole('button', { name: `Ver os ${count} serviços` })).toBeInTheDocument();
  });

  it('links each lab axis chip to /eixos?eixo=N#explorar-eixos', async () => {
    renderWithProviders(<Solucoes />);
    pick(4);
    await waitFor(() => expect(results().querySelectorAll('.trl-match__lab')).toHaveLength(expectedLabs(4).length));
    const hrefs = [...results().querySelectorAll('a.lab-chip')].map((a) => a.getAttribute('href'));
    const expected = expectedLabs(4).flatMap((l) => l.axes.map((id) => `/eixos?eixo=${id}#explorar-eixos`));
    expect(hrefs).toEqual(expected);
    hrefs.forEach((h) => expect(h).toMatch(/^\/eixos\?eixo=\d+#explorar-eixos$/));
  });

  it.each([1, 7, 8, 9])('TRL %i: says plainly that no core lab works there and keeps the contact', async (n) => {
    renderWithProviders(<Solucoes />);
    pick(n);
    expect(expectedLabs(n)).toHaveLength(0);
    await waitFor(() => expect(within(results()).getByText('Nenhum laboratório central do CP2b atua nesta faixa hoje.')).toBeInTheDocument());
    expect(results().querySelectorAll('.trl-match__lab')).toHaveLength(0);
    expect(expectedServices(n)).toHaveLength(0);
    expect(within(results()).getByText('Nenhum serviço técnico do catálogo cobre este nível.')).toBeInTheDocument();
    expect(within(results()).queryByRole('button')).toBeNull();
    expect(screen.getByRole('link', { name: /Fale com o CP2b/ })).toHaveAttribute('href', '/contato');
  });

  it('swaps the results when another level is chosen', async () => {
    renderWithProviders(<Solucoes />);
    pick(2);
    await waitFor(() => expect(within(results()).getByRole('button', { name: `Ver os ${expectedServices(2).length} serviços` })).toBeInTheDocument());
    pick(6);
    await waitFor(() => {
      const shown = [...results().querySelectorAll('.trl-match__lab-acr')].map((e) => e.textContent);
      expect(shown).toEqual(expectedLabs(6).map((l) => short(l.acronym)));
    });
    expect(screen.getByRole('button', { name: /^TRL 2:/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('"Ver os N serviços" filters the catalog by TRL, scrolls to it and can be cleared', async () => {
    renderWithProviders(<Solucoes />);
    expect(catalogTitles()).toHaveLength(technicalServices.length);

    pick(6);
    const at6 = expectedServices(6);
    fireEvent.click(await within(results()).findByRole('button', { name: `Ver os ${at6.length} serviços` }));

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
    // O foco do teclado acompanha a rolagem até o catálogo, que tem nome: é
    // o que o leitor de tela anuncia ao chegar.
    expect(document.activeElement).toBe(document.getElementById('servicos'));
    expect(document.activeElement).toHaveAccessibleName('Serviços Técnicos Especializados');
    await waitFor(() => expect(catalogTitles()).toEqual(titlesOf(at6)));

    // O filtro ativo fica à vista, com o número do que está sendo mostrado.
    const status = document.querySelector('.svc-trl-status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('TRL 6');
    expect(status).toHaveTextContent(`${at6.length} de ${technicalServices.length} serviços`);

    const clear = screen.getByRole('button', { name: 'Limpar o filtro TRL 6' });
    clear.focus();
    fireEvent.click(clear);
    await waitFor(() => expect(catalogTitles()).toHaveLength(technicalServices.length));
    expect(status).toBeEmptyDOMElement();
    // O botão sumiu com o filtro; o foco não se perde, fica no catálogo.
    expect(document.activeElement).toBe(document.getElementById('servicos'));
  });

  it('combines the TRL filter with the laboratory filter', async () => {
    renderWithProviders(<Solucoes />);
    pick(4);
    fireEvent.click(await within(results()).findByRole('button', { name: `Ver os ${expectedServices(4).length} serviços` }));
    await waitFor(() => expect(catalogTitles()).toHaveLength(expectedServices(4).length));

    const labFilter = screen.getByRole('group', { name: 'Filtrar por laboratório' });
    fireEvent.click(within(labFilter).getByRole('button', { name: 'CEMARA' }));
    const cemaraAt4 = expectedServices(4).filter((s) => s.labAcronym.includes('CEMARA'));
    await waitFor(() => expect(catalogTitles()).toEqual(titlesOf(cemaraAt4)));
    expect(document.querySelector('.svc-trl-status')).toHaveTextContent('TRL 4');
  });

  it('says so when the combination of laboratory and TRL has no service', async () => {
    renderWithProviders(<Solucoes />);
    pick(6);
    fireEvent.click(await within(results()).findByRole('button', { name: `Ver os ${expectedServices(6).length} serviços` }));
    const labFilter = screen.getByRole('group', { name: 'Filtrar por laboratório' });
    fireEvent.click(within(labFilter).getByRole('button', { name: 'CEMARA' }));
    expect(expectedServices(6).filter((s) => s.labAcronym.includes('CEMARA'))).toHaveLength(0);
    await waitFor(() => expect(catalogTitles()).toHaveLength(0));
    expect(screen.getByText('Nenhum serviço técnico deste laboratório cobre o nível de TRL escolhido.')).toBeInTheDocument();
  });

  it('the TRL button resets the lab filter, and the lab button resets the TRL filter, so each shows the count it promised', async () => {
    renderWithProviders(<Solucoes />);
    const labFilter = screen.getByRole('group', { name: 'Filtrar por laboratório' });
    fireEvent.click(within(labFilter).getByRole('button', { name: 'PPBIOEN' }));

    pick(3);
    const at3 = expectedServices(3);
    fireEvent.click(await within(results()).findByRole('button', { name: `Ver os ${at3.length} serviços` }));
    await waitFor(() => expect(catalogTitles()).toEqual(titlesOf(at3)));
    expect(within(labFilter).getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true');

    // Botão da ficha do laboratório (CEMARA é o primeiro): volta a mostrar
    // todos os serviços dele, sem o filtro de TRL.
    const cemara = technicalServices.filter((s) => s.labAcronym.includes('CEMARA'));
    fireEvent.click(screen.getByRole('button', { name: `Ver os ${cemara.length} serviços técnicos` }));
    await waitFor(() => expect(catalogTitles()).toEqual(titlesOf(cemara)));
    expect(document.querySelector('.svc-trl-status')).toBeEmptyDOMElement();
  });

  it('speaks English too, with the same neutral message', async () => {
    localStorage.setItem('cp2b_lang', 'en');
    renderWithProviders(<Solucoes />);
    expect(screen.getByRole('heading', { name: 'What is your challenge?' })).toBeInTheDocument();
    pick(8);
    expect(live()).toHaveTextContent('TRL 8 · Demonstration and market: no laboratories, no services');
    await waitFor(() => expect(within(results()).getByText('No CP2b core laboratory works at this level today.')).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /Talk to CP2b/ })).toHaveAttribute('href', '/contato');
  });

  it('with reduced motion the results only fade: nothing slides', async () => {
    motion.reduce = true;
    renderWithProviders(<Solucoes />);
    pick(4);
    const panel = await waitFor(() => {
      const el = results().querySelector('.trl-match__panel');
      expect(el).not.toBeNull();
      return el;
    });
    expect(panel.style.transform === '' || panel.style.transform === 'none').toBe(true);
    results().querySelectorAll('.trl-match__lab').forEach((li) => {
      expect(li.style.transform === '' || li.style.transform === 'none').toBe(true);
    });

    // E o salto até o catálogo é imediato, sem rolagem suave.
    fireEvent.click(within(results()).getByRole('button', { name: `Ver os ${expectedServices(4).length} serviços` }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
  });
});
