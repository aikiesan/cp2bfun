import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import MetaninhoAmigo from '../MetaninhoAmigo';

afterEach(() => {
  vi.useRealTimers();
});

describe('MetaninhoAmigo (easter egg)', () => {
  it('is a named button whose speech bubble is a live region, empty until clicked', () => {
    renderWithProviders(<MetaninhoAmigo />);
    expect(screen.getByRole('button', { name: 'Metaninho, o mascote do CP2b' })).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeEmptyDOMElement();
  });

  it('says the next line on each click, hops, and goes quiet after a few seconds', () => {
    vi.useFakeTimers();
    const { container } = renderWithProviders(<MetaninhoAmigo />);
    const button = screen.getByRole('button', { name: 'Metaninho, o mascote do CP2b' });

    fireEvent.click(button);
    expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('Oi! Eu sou o Metaninho: um carbono e quatro hidrogênios.');
    expect(container.querySelector('.metaninho')).toHaveClass('metaninho--hop');

    fireEvent.click(button);
    expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('No biogás, eu sou a parte que vira energia.');

    act(() => { vi.advanceTimersByTime(4100); });
    expect(screen.getByRole('status', { hidden: true })).toBeEmptyDOMElement();
  });

  it('uses the lines it is given, in a loop', () => {
    renderWithProviders(<MetaninhoAmigo lines={{ pt: ['Um', 'Dois'] }} />);
    const button = screen.getByRole('button', { name: 'Metaninho, o mascote do CP2b' });
    ['Um', 'Dois', 'Um'].forEach((expected) => {
      fireEvent.click(button);
      expect(screen.getByRole('status', { hidden: true })).toHaveTextContent(expected);
    });
  });
});
