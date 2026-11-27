import { describe, it, expect } from 'vitest';
import { isAmbientRoute, COMMUNICATION_ROUTES } from '../ambientRoutes';

describe('isAmbientRoute', () => {
  it('is true for the Home and every Comunicação listing', () => {
    expect(isAmbientRoute('/')).toBe(true);
    COMMUNICATION_ROUTES.forEach((path) => expect(isAmbientRoute(path), path).toBe(true));
  });

  it('ignores a trailing slash', () => {
    expect(isAmbientRoute('/noticias/')).toBe(true);
  });

  it('is false for detail pages and the rest of the site', () => {
    ['/noticias/uma-noticia', '/galeria/12', '/sobre', '/equipe', '/eixos', '/admin'].forEach((path) =>
      expect(isAmbientRoute(path), path).toBe(false)
    );
  });
});
