import { describe, it, expect } from 'vitest';
import { safeHref } from '../safeUrl';

describe('safeHref', () => {
  it('keeps web, mail, phone and site-relative links', () => {
    expect(safeHref('https://www.unifal-mg.edu.br')).toBe('https://www.unifal-mg.edu.br');
    expect(safeHref('http://exemplo.org/a?b=1')).toBe('http://exemplo.org/a?b=1');
    expect(safeHref('mailto:diretoria@cp2b.unicamp.br')).toBe('mailto:diretoria@cp2b.unicamp.br');
    expect(safeHref('tel:+551935211244')).toBe('tel:+551935211244');
    expect(safeHref('/assets/boletins/edicao-1.pdf')).toBe('/assets/boletins/edicao-1.pdf');
    expect(safeHref('#contato')).toBe('#contato');
  });

  it('adds https:// to a bare domain typed in the panel', () => {
    expect(safeHref('www.exemplo.org/inscricao')).toBe('https://www.exemplo.org/inscricao');
    expect(safeHref('  exemplo.org  ')).toBe('https://exemplo.org');
  });

  it('refuses script and data URLs, protocol-relative links and empty values', () => {
    expect(safeHref('javascript:alert(1)')).toBeUndefined();
    expect(safeHref(' JavaScript:alert(1)')).toBeUndefined();
    expect(safeHref('data:text/html;base64,PHNjcmlwdD4=')).toBeUndefined();
    expect(safeHref('vbscript:msgbox(1)')).toBeUndefined();
    expect(safeHref('//evil.example/x')).toBeUndefined();
    expect(safeHref('')).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
  });
});
