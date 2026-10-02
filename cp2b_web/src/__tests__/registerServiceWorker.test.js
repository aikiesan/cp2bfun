import { describe, it, expect } from 'vitest';
import { shouldReloadImmediately } from '../registerServiceWorker';

describe('shouldReloadImmediately', () => {
  it('recarrega sozinho nas páginas públicas', () => {
    // É o ponto da mudança: quem já visitou o site ficava preso na versão
    // antiga até dar F5 por conta própria.
    expect(shouldReloadImmediately('/')).toBe(true);
    expect(shouldReloadImmediately('/equipe')).toBe(true);
    expect(shouldReloadImmediately('/eixos')).toBe(true);
    expect(shouldReloadImmediately('/noticias/alguma-noticia')).toBe(true);
  });

  it('não recarrega sozinho no admin', () => {
    // Os editores guardam o formulário inteiro em estado de React: um reload
    // silencioso jogaria fora um artigo pela metade.
    expect(shouldReloadImmediately('/admin')).toBe(false);
    expect(shouldReloadImmediately('/admin/equipe')).toBe(false);
    expect(shouldReloadImmediately('/admin/noticias/nova')).toBe(false);
  });

  it('trata caminho ausente como página pública em vez de estourar', () => {
    expect(shouldReloadImmediately(undefined)).toBe(true);
    expect(shouldReloadImmediately(null)).toBe(true);
    expect(shouldReloadImmediately('')).toBe(true);
  });
});
