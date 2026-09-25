import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import AxisExplorer from '../AxisExplorer';

const labels = {
  axis: 'EIXO', sdgsTitle: 'ODS relacionados', activities: 'Atividades', axesNav: 'Eixos temáticos',
  noDetails: 'Detalhamento em preparação.', readMore: 'Ler mais', readLess: 'Ler menos',
  showAll: 'Ver todos os', showLess: 'Mostrar menos',
};

const longText = 'Descrição longa do projeto. '.repeat(20);
const axes = [
  {
    id: '1',
    title: 'Eixo 1 – Inventário',
    content: `Mapeia cadeias agroindustriais.
      ODS: 7, 11, 13 e 15.`,
    sdgs: [7, 11],
  },
  {
    // Eixo 4: nenhum laboratório da planilha atende este eixo, então a aba
    // Infraestrutura não é completada e o painel mostra "em preparação".
    id: '4',
    title: 'Eixo 4 – Ciência de Base',
    content: 'Pesquisa fundamental. Este eixo contribui para os Objetivos de Desenvolvimento Sustentável: 2, 6, 7 e 9.',
    sdgs: [2],
  },
];
const detailsById = {
  1: [
    { id: 'projetos', items: Array.from({ length: 9 }, (_, i) => ({ title: `Projeto ${i + 1}`, description: i === 0 ? longText : 'Curta.' })) },
    { id: 'equipe', items: [{ person: 'Alguém' }] },
  ],
  4: [],
};

const render = () => renderWithProviders(
  <AxisExplorer axes={axes} detailsById={detailsById} language="pt" labels={labels} />
);

describe('AxisExplorer', () => {
  it('drops the SDG sentence from the axis text, since the SDGs show as icons', () => {
    render();
    const text = document.querySelector('.axx-head__text');
    expect(text).toHaveTextContent('Mapeia cadeias agroindustriais.');
    expect(text).not.toHaveTextContent(/ODS/);
    expect(screen.getAllByAltText(/^ODS \d+$/)).toHaveLength(2);
  });

  it('hides the team branch and lists the first items with a "see all" toggle', async () => {
    const user = userEvent.setup();
    render();
    expect([...document.querySelectorAll('.axx-branch')].map((b) => b.textContent)).toEqual(['Projetos9']);
    expect(document.querySelectorAll('.axx-row')).toHaveLength(8);

    await user.click(screen.getByRole('button', { name: /Ver todos os 9 projetos/ }));
    expect(document.querySelectorAll('.axx-row')).toHaveLength(9);
  });

  it('opens one row at a time in place', async () => {
    const user = userEvent.setup();
    render();
    const [first, second] = screen.getAllByRole('button', { name: /^Projeto [12]$/ });
    expect(document.querySelector('.axx-row__body')).toBeNull();

    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelector('.axx-row__body')).toHaveTextContent('Descrição longa do projeto.');

    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelectorAll('.axx-row__body')).toHaveLength(1);
  });

  it('moves to the next axis from the pager', async () => {
    const user = userEvent.setup();
    render();
    await user.click(screen.getByRole('button', { name: /EIXO 04/ }));
    expect(document.querySelector('.axx-tab.is-active')).toHaveTextContent('Ciência de Base');
    expect(document.querySelector('.axx-head__text')).toHaveTextContent('Pesquisa fundamental.');
    expect(document.querySelector('.axx-head__text')).not.toHaveTextContent(/Objetivos/);
    expect(screen.getByText('Detalhamento em preparação.')).toBeInTheDocument();
  });

  it('lists the Axis 8 public policy labs (LESP, LABSOS) under Infrastructure, with their mission', async () => {
    const user = userEvent.setup();
    const axis8 = [{ id: '8', title: 'Eixo 8 – Políticas Públicas e Inovação Regulatória', content: '', sdgs: [] }];
    renderWithProviders(<AxisExplorer axes={axis8} detailsById={{}} language="pt" labels={labels} />);

    expect([...document.querySelectorAll('.axx-branch')].map((b) => b.textContent)).toEqual(['Infraestrutura2']);
    const lesp = screen.getByRole('button', { name: /Laboratório de Estudos do Setor Público/ });
    await user.click(lesp);
    expect(document.querySelector('.axx-row__body')).toHaveTextContent(/Produzir, divulgar e aplicar conhecimento/);
    expect(document.querySelector('.axx-row__body')).toHaveTextContent('Estudos, eventos e parcerias com atores do setor público');
  });
});
