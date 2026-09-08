import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Research from '../Research';

describe('Research', () => {
  it('renders the research structure heading', () => {
    renderWithProviders(<Research />);
    expect(screen.getByText('Estrutura de Pesquisa')).toBeInTheDocument();
  });

  it('renders all 8 axes as clickable nodes in the mind map', () => {
    renderWithProviders(<Research />);
    // Coluna 1 do mapa mental: um botão por eixo. Os títulos vêm de
    // content.js no formato "Eixo N – Título"; o mapa mostra só o título.
    const axisNodes = document.querySelectorAll('.mmap-node--axis');
    expect(axisNodes.length).toBe(8);
  });

  it('renders "Conheça os Eixos" section title', () => {
    renderWithProviders(<Research />);
    expect(screen.getByText('Conheça os Eixos')).toBeInTheDocument();
  });

  it('shows SDG icons for the selected axis', () => {
    renderWithProviders(<Research />);
    // O primeiro eixo abre por padrão no desktop; seus ODS aparecem como
    // imagens com alt "ODS <n>".
    const sdgImages = screen.getAllByAltText(/^ODS \d+$/);
    expect(sdgImages.length).toBeGreaterThan(0);
  });

  it('drills down from an axis into its activity branches', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Research />);

    // Eixo 2 tem competências, projetos e infraestrutura.
    const axisNodes = document.querySelectorAll('.mmap-node--axis');
    await user.click(axisNodes[1]);

    const branchNodes = document.querySelectorAll('.mmap-node--branch');
    expect(branchNodes.length).toBeGreaterThan(0);
    // Cada ramo mostra um contador de itens.
    expect(document.querySelectorAll('.mmap-node__count').length).toBe(branchNodes.length);
  });

  it('does not attribute the axes to people', async () => {
    // Os eixos não são apessoados: a coordenação muda a cada ano e as
    // pessoas vivem em /equipe. Ver AxisMindMap (HIDDEN_BRANCHES).
    const user = userEvent.setup();
    renderWithProviders(<Research />);

    expect(document.querySelector('.mmap__coords')).toBeNull();
    expect(screen.queryByText(/Rubens Augusto Camargo Lamparelli/)).toBeNull();

    const axisNodes = document.querySelectorAll('.mmap-node--axis');
    for (const node of axisNodes) {
      await user.click(node);
      const branches = [...document.querySelectorAll('.mmap-node--branch')].map((b) => b.textContent);
      expect(branches.some((b) => /Equipe/i.test(b))).toBe(false);
    }
  });

  it('lists the laboratory infrastructure section', () => {
    renderWithProviders(<Research />);
    expect(screen.getByText('Infraestrutura Laboratorial')).toBeInTheDocument();
    expect(screen.getByText('PPBIOEN')).toBeInTheDocument();
  });
});
