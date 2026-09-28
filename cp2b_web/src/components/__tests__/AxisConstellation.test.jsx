import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test/utils';
import AxisConstellation from '../AxisConstellation';

const labels = {
  eyebrow: 'Estrutura Temática', title: 'Eixos de Atuação do CP2b', subtitle: '',
  axis: 'EIXO', coordination: 'Coordenação',
  vacancy: 'Vaga temporariamente em aberto', hubCaption: '', hint: '',
};

// Formato que o Research.jsx monta a partir da API (/api/axes).
const axes = [
  {
    id: '5',
    title: 'Eixo 5 – Inovação em Bioprodutos na Cadeia do Biogás',
    coordinators: [
      { name: 'Profª Drª Rachel Biancalana Costa', role: 'Coord.' },
      { name: 'Vaga temporariamente em aberto', role: 'Coord.' },
    ],
  },
  {
    id: '8',
    title: 'Eixo 8 – Políticas Públicas e Inovação Regulatória',
    coordinators: [
      { name: 'Profª Drª Natalia Molina Cetrulo', role: 'Coord.' },
      { name: 'Drª Thais Aparecida Dibbern', role: 'Coord.' },
    ],
  },
];

describe('AxisConstellation', () => {
  it('shows the vacancy stored as text by the admin panel as a vacancy, not a person', () => {
    renderWithProviders(<AxisConstellation axes={axes} labels={labels} />);
    const [card5, card8] = document.querySelectorAll('.axo-card');

    const names5 = [...card5.querySelectorAll('.axo-card__people li')];
    expect(names5.map((li) => li.textContent)).toEqual(['Rachel Biancalana Costa', 'Vaga temporariamente em aberto']);
    expect(names5[0].classList.contains('is-vacant')).toBe(false);
    expect(names5[1].classList.contains('is-vacant')).toBe(true);
    expect(card8.querySelector('.is-vacant')).toBeNull();
  });

  it('gives both coordinators the same treatment, with no coord/vice labels', () => {
    renderWithProviders(<AxisConstellation axes={axes} labels={labels} />);
    const card8 = document.querySelectorAll('.axo-card')[1];
    expect(card8).not.toHaveTextContent(/Coord\.|Vice/);
    const items = [...card8.querySelectorAll('.axo-card__people li')];
    expect(new Set(items.map((li) => li.className)).size).toBe(1);
  });

  it('strips academic titles and the "Eixo N –" prefix', () => {
    renderWithProviders(<AxisConstellation axes={axes} labels={labels} />);
    const card8 = document.querySelectorAll('.axo-card')[1];
    const names = [...card8.querySelectorAll('.axo-card__people li')].map((li) => li.textContent);
    expect(names).toEqual(['Natalia Molina Cetrulo', 'Thais Aparecida Dibbern']);
    expect(card8.querySelector('.axo-card__title')).toHaveTextContent(/^EIXO 8: Políticas Públicas e Inovação Regulatória$/);
  });
});
