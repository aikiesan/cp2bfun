import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { useUrlChoice, useUrlText } from '../useUrlFilters';

const COLOURS = ['verde', 'azul'];

// A tiny filter bar: one choice, one text field, and a link to the same page
// standing in for any navigation from outside.
const Harness = () => {
  const [colour, setColour] = useUrlChoice('cor', {
    fallback: 'todas',
    isValid: (value) => COLOURS.includes(value),
  });
  const [text, setText] = useUrlText('busca', { delay: 30 });
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <output data-testid="colour">{colour}</output>
      <output data-testid="search">{location.search}</output>
      <input aria-label="busca" value={text} onChange={(e) => setText(e.target.value)} />
      <button type="button" onClick={() => setColour('azul')}>azul</button>
      <button type="button" onClick={() => setColour('todas')}>todas</button>
      <button type="button" onClick={() => navigate('/?busca=externa')}>link</button>
    </>
  );
};

const renderAt = (url) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Harness />
    </MemoryRouter>
  );

const search = () => screen.getByTestId('search').textContent;

describe('useUrlChoice', () => {
  it('reads a known value', () => {
    renderAt('/?cor=verde');
    expect(screen.getByTestId('colour')).toHaveTextContent('verde');
  });

  it('treats an unknown value as the fallback, without rewriting the URL', () => {
    renderAt('/?cor=roxo');
    expect(screen.getByTestId('colour')).toHaveTextContent('todas');
    expect(search()).toBe('?cor=roxo');
  });

  it('writes a choice and removes the parameter for the fallback', () => {
    renderAt('/?busca=x');
    fireEvent.click(screen.getByRole('button', { name: 'azul' }));
    expect(search()).toBe('?busca=x&cor=azul');
    fireEvent.click(screen.getByRole('button', { name: 'todas' }));
    expect(search()).toBe('?busca=x');
  });
});

describe('useUrlText', () => {
  it('starts from the URL and writes the trimmed text after a pause', async () => {
    renderAt('/?busca=abc');
    const field = screen.getByRole('textbox', { name: 'busca' });
    expect(field).toHaveValue('abc');

    fireEvent.change(field, { target: { value: '  biogás ' } });
    expect(field).toHaveValue('  biogás ');
    expect(search()).toBe('?busca=abc');
    await waitFor(() => expect(search()).toBe('?busca=biog%C3%A1s'));
    // The field keeps what was typed; only the link is tidied.
    expect(field).toHaveValue('  biogás ');
  });

  it('drops the parameter when the text is emptied', async () => {
    renderAt('/?busca=abc&cor=azul');
    fireEvent.change(screen.getByRole('textbox', { name: 'busca' }), { target: { value: '   ' } });
    await waitFor(() => expect(search()).toBe('?cor=azul'));
  });

  it('does not undo a choice made while the text was still waiting', async () => {
    renderAt('/');
    fireEvent.change(screen.getByRole('textbox', { name: 'busca' }), { target: { value: 'lodo' } });
    fireEvent.click(screen.getByRole('button', { name: 'azul' }));
    await waitFor(() => expect(search()).toBe('?cor=azul&busca=lodo'));
  });

  it('follows the URL when it changes from outside', () => {
    renderAt('/?busca=abc');
    fireEvent.click(screen.getByRole('button', { name: 'link' }));
    expect(screen.getByRole('textbox', { name: 'busca' })).toHaveValue('externa');
  });
});
