import { describe, it, expect } from 'vitest';
import { nameKey } from '../nameKey';
import {
  groupTeamByAxis,
  resolveAffiliation,
  stripAxisPrefix,
  DIRECTION_GROUP,
  COLLABORATORS_GROUP,
} from '../teamGroups';

describe('nameKey', () => {
  it('matches the same person across the spellings the two sources use', () => {
    // These are the real disagreements between the site list and Luciana's
    // spreadsheet — middle name present or absent, a doubled letter, an
    // extra preposition.
    expect(nameKey('Dante Pezzin')).toBe(nameKey('Dante Chiavareto Pezzin'));
    expect(nameKey('Mauro Donizetti Berni')).toBe(nameKey('Mauro Donizeti Berni'));
    expect(nameKey('Marcelo Pereira Cunha')).toBe(nameKey('Marcelo Pereira da Cunha'));
  });

  it('ignores accents, case and academic titles', () => {
    expect(nameKey('Profª Drª Ângela Cruz Guirao')).toBe(nameKey('angela cruz guirao'));
  });

  it('does not collapse genuinely different people', () => {
    expect(nameKey('Marcelo Pereira Cunha')).not.toBe(nameKey('Marcelo Kenji Miki'));
  });

  it('returns an empty key for empty input rather than throwing', () => {
    expect(nameKey('')).toBe('');
    expect(nameKey(null)).toBe('');
  });
});

describe('stripAxisPrefix', () => {
  it('drops the "Eixo N –" prefix, since the number is shown separately', () => {
    expect(stripAxisPrefix('Eixo 1 – Inventário de Resíduos')).toBe('Inventário de Resíduos');
  });

  it('leaves a title with no prefix untouched', () => {
    expect(stripAxisPrefix('Inventário de Resíduos')).toBe('Inventário de Resíduos');
  });
});

describe('resolveAffiliation', () => {
  it('accepts axes as a comma-separated string, as the database stores them', () => {
    expect(resolveAffiliation({ name: 'X', axes: '6,7' }).axes).toEqual(['6', '7']);
  });

  it('prefers what the record carries over the spreadsheet', () => {
    const resolved = resolveAffiliation({ name: 'Bruna de Souza Moraes', axes: '3' });
    expect(resolved.axes).toEqual(['3']);
  });

  it('falls back to the spreadsheet when the record has no axis', () => {
    // The static fallback list has no axis column at all.
    const resolved = resolveAffiliation({ name: 'Bruna de Souza Moraes' });
    expect(resolved.axes).toEqual(['6', '7']);
    expect(resolved.isDirector).toBe(true);
  });
});

describe('groupTeamByAxis', () => {
  const members = [
    { name: 'Bruna de Souza Moraes', axes: '6,7', is_director: true },
    { name: 'Someone Without An Axis' },
    { name: 'Axis One Person', axes: '1' },
  ];

  it('puts a director in Direção and in every axis they work in', () => {
    const groups = groupTeamByAxis(members, 'pt');
    const names = (id) =>
      (groups.find((g) => g.category === id)?.members || []).map((m) => m.name);

    expect(names(DIRECTION_GROUP)).toContain('Bruna de Souza Moraes');
    expect(names('eixo-6')).toContain('Bruna de Souza Moraes');
    expect(names('eixo-7')).toContain('Bruna de Souza Moraes');
  });

  it('collects people with no axis under collaborators', () => {
    const groups = groupTeamByAxis(members, 'pt');
    const collaborators = groups.find((g) => g.category === COLLABORATORS_GROUP);
    expect(collaborators.members.map((m) => m.name)).toEqual(['Someone Without An Axis']);
  });

  it('drops empty groups so no axis renders as a blank heading', () => {
    const groups = groupTeamByAxis(members, 'pt');
    expect(groups.every((g) => g.members.length > 0)).toBe(true);
    expect(groups.find((g) => g.category === 'eixo-2')).toBeUndefined();
  });

  it('labels groups in English when asked', () => {
    const groups = groupTeamByAxis(members, 'en');
    expect(groups.find((g) => g.category === DIRECTION_GROUP).title).toBe('CP2b Direction');
    expect(groups.find((g) => g.category === 'eixo-1').shortTitle).toBe('Axis 1');
  });
});
