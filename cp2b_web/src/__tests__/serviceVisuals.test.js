import { describe, it, expect } from 'vitest';
/* eslint-env node */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { technicalServices } from '../data/generated/services';
import { serviceVisuals } from '../data/serviceVisuals';

describe('serviceVisuals', () => {
  it('covers every technical service, keyed by the right id', () => {
    // Se uma nova extração da planilha reordenar os serviços, o id passaria a
    // apontar para outro serviço e a ilustração ficaria trocada.
    technicalServices.forEach((s) => {
      expect(serviceVisuals[s.id], `serviço ${s.id}`).toBeDefined();
      expect(serviceVisuals[s.id].title).toBe(s.pt.title);
      expect(serviceVisuals[s.id].icon).toMatch(/^bi-/);
    });
  });

  it('points only to illustrations that exist in public/', () => {
    Object.values(serviceVisuals)
      .filter((v) => v.image)
      .forEach((v) => {
        expect(existsSync(resolve(process.cwd(), 'public', `.${v.image}`)), v.image).toBe(true);
      });
  });
});
