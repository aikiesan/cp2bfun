import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Research from '../Research';

describe('Research', () => {
  it('renders the research structure heading', () => {
    renderWithProviders(<Research />);
    // O título da figura dos eixos é o próprio título da página, uma vez só:
    // antes ele se repetia no hero e no topo do infográfico.
    expect(screen.getByRole('heading', { level: 1, name: 'Eixos de Atuação do CP2b' })).toBeInTheDocument();
    expect(screen.getAllByText('Eixos de Atuação do CP2b')).toHaveLength(1);
    expect(screen.queryByText('Estrutura de Pesquisa')).toBeNull();
  });

  it('renders all 8 axes in the details selector', () => {
    renderWithProviders(<Research />);
    // Seletor 01–08 do detalhamento: um botão por eixo. Os títulos vêm de
    // content.js no formato "Eixo N – Título"; o seletor mostra só o título.
    const axisNodes = document.querySelectorAll('.axx-tab');
    expect(axisNodes.length).toBe(8);
  });

  it('renders "Conheça os Eixos" section title', () => {
    renderWithProviders(<Research />);
    expect(screen.getByText('Conheça os Eixos')).toBeInTheDocument();
  });

  it('shows SDG icons for the selected axis', () => {
    renderWithProviders(<Research />);
    // O primeiro eixo abre por padrão; seus ODS aparecem como
    // imagens com alt "ODS <n>".
    const sdgImages = screen.getAllByAltText(/^ODS \d+$/);
    expect(sdgImages.length).toBeGreaterThan(0);
  });

  it('drills down from an axis into its activity branches', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Research />);

    // Eixo 2 tem competências, projetos e infraestrutura.
    const axisNodes = document.querySelectorAll('.axx-tab');
    await user.click(axisNodes[1]);

    const branchNodes = document.querySelectorAll('.axx-branch');
    expect(branchNodes.length).toBeGreaterThan(0);
    // Cada ramo mostra um contador de itens.
    expect(document.querySelectorAll('.axx-branch__count').length).toBe(branchNodes.length);
  });

  it('opens with the integrative figure of the 8 axes and their coordination', () => {
    renderWithProviders(<Research />);
    expect(screen.getByRole('heading', { name: 'Eixos de Atuação do CP2b' })).toBeInTheDocument();

    const cards = document.querySelectorAll('.axo-card');
    expect(cards.length).toBe(8);
    // Coordenação e vice, sem os títulos acadêmicos que vêm nos dados.
    expect(cards[0]).toHaveTextContent('Rubens Augusto Camargo Lamparelli');
    expect(cards[0]).toHaveTextContent('Lucas Nakamura Cerejo');
    expect(cards[0]).not.toHaveTextContent(/Prof|Dr[ºª.]/);
    // Eixo 5 tem só a coordenação: a vice aparece como vaga.
    expect(cards[4]).toHaveTextContent('Rachel Biancalana Costa');
    expect(cards[4]).toHaveTextContent('Vaga temporariamente em aberto');
  });

  it('opens the matching axis in the details when a figure card is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Research />);

    await user.click(document.querySelectorAll('.axo-card')[2]);
    const active = document.querySelector('.axx-tab.is-active');
    expect(active).toHaveTextContent('Engenharia de Processos e Bioprocessos');
  });

  it('keeps the axis details free of people', async () => {
    // A coordenação aparece só na figura do topo; o detalhamento continua
    // descrevendo o trabalho. Ver AxisExplorer (HIDDEN_BRANCHES).
    const user = userEvent.setup();
    renderWithProviders(<Research />);

    const map = document.querySelector('.axx');
    expect(map).not.toHaveTextContent(/Rubens Augusto Camargo Lamparelli/);

    const axisNodes = document.querySelectorAll('.axx-tab');
    for (const node of axisNodes) {
      await user.click(node);
      const branches = [...document.querySelectorAll('.axx-branch')].map((b) => b.textContent);
      expect(branches.some((b) => /Equipe/i.test(b))).toBe(false);
    }
  });

  it('does not list the laboratory infrastructure here', () => {
    // A infraestrutura laboratorial vai ganhar página própria, mais
    // detalhada; /eixos não repete a lista de laboratórios.
    renderWithProviders(<Research />);
    expect(screen.queryByText('Infraestrutura Laboratorial')).toBeNull();
    expect(screen.queryByText('Planta Piloto para Bioenergia')).toBeNull();
  });
});
