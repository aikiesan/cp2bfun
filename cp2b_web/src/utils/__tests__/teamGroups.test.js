import { describe, it, expect } from 'vitest';
import { nameKey } from '../nameKey';
import {
  groupTeamByAxis,
  resolveAffiliation,
  stripAxisPrefix,
  DIRECTION_GROUP,
  ASSOCIATES_GROUP,
  PARTNERS_GROUP,
  SUPPORT_GROUP,
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

  // Sem eixo atribuído, o cargo diz de que vínculo se trata: reunir os dois
  // sob "Colaboradores e Parceiros" fazia o centro parecer menor do que é e o
  // parceiro externo, mais interno do que é.
  it('reads someone from the centre with no axis as an associate', () => {
    const groups = groupTeamByAxis(members, 'pt');
    const associates = groups.find((g) => g.category === ASSOCIATES_GROUP);
    expect(associates.members.map((m) => m.name)).toEqual(['Someone Without An Axis']);
    expect(groups.find((g) => g.category === PARTNERS_GROUP)).toBeUndefined();
  });

  it('reads a lead researcher at a partner institution as a partner', () => {
    const groups = groupTeamByAxis(
      [
        ...members,
        {
          name: 'Jens Bo Holm-Nielsen',
          role: 'Pesquisador Responsável na Instituição Parceira',
        },
      ],
      'pt'
    );

    const partners = groups.find((g) => g.category === PARTNERS_GROUP);
    expect(partners.members.map((m) => m.name)).toEqual(['Jens Bo Holm-Nielsen']);

    const associates = groups.find((g) => g.category === ASSOCIATES_GROUP);
    expect(associates.members.map((m) => m.name)).not.toContain('Jens Bo Holm-Nielsen');
  });

  it('prefers the membership the record carries over the role heuristic', () => {
    // Mesma precedência de resolveAffiliation: o registro ganha da heurística.
    // É como o Prof. Seabra sai do apoio técnico sem depender do texto do
    // cargo.
    const groups = groupTeamByAxis(
      [
        ...members,
        {
          name: 'Joaquim Eugênio Abel Seabra',
          role: 'Apoio Técnico',
          membership: 'associado',
        },
      ],
      'pt'
    );

    const associates = groups.find((g) => g.category === ASSOCIATES_GROUP);
    expect(associates.members.map((m) => m.name)).toContain('Joaquim Eugênio Abel Seabra');
    expect(groups.find((g) => g.category === SUPPORT_GROUP)).toBeUndefined();
  });

  it('explains the bond of each new section, not just its title', () => {
    const groups = groupTeamByAxis(
      [
        ...members,
        { name: 'Partner Person', role: 'Pesquisador Responsável na Instituição Parceira' },
      ],
      'pt'
    );

    expect(groups.find((g) => g.category === ASSOCIATES_GROUP).blurb).toMatch(/eixo/i);
    expect(groups.find((g) => g.category === PARTNERS_GROUP).blurb).toMatch(/FAPESP/);
  });

  it('orders the sections direction, axes, associates, partners, support', () => {
    const groups = groupTeamByAxis(
      [
        ...members,
        { name: 'Partner Person', role: 'Pesquisador Responsável na Instituição Parceira' },
        { name: 'Support Person', role: 'Apoio Administrativo' },
      ],
      'pt'
    );

    expect(groups.map((g) => g.category)).toEqual([
      DIRECTION_GROUP,
      'eixo-1',
      'eixo-6',
      'eixo-7',
      ASSOCIATES_GROUP,
      PARTNERS_GROUP,
      SUPPORT_GROUP,
    ]);
  });

  it('collects administrative and technical support under SUPPORT_GROUP', () => {
    const supportMembers = [
      ...members,
      { name: 'Magali Luzia Maróstica', role: 'Apoio Administrativo', category: 'support' },
    ];
    const groups = groupTeamByAxis(supportMembers, 'pt');
    const supportGroup = groups.find((g) => g.category === 'apoio');
    expect(supportGroup).toBeDefined();
    expect(supportGroup.members.map((m) => m.name)).toContain('Magali Luzia Maróstica');
  });

  it('drops empty groups so no axis renders as a blank heading', () => {
    const groups = groupTeamByAxis(members, 'pt');
    expect(groups.every((g) => g.members.length > 0)).toBe(true);
    expect(groups.find((g) => g.category === 'eixo-2')).toBeUndefined();
  });

  it('still separates partners when the roles arrive in English', () => {
    // O cargo chega traduzido quando a página está em inglês. Sem ler as duas
    // grafias, /equipe em inglês perdia a seção de parceiras inteira e jogava
    // as 14 pessoas em associados.
    const groups = groupTeamByAxis(
      [
        ...members,
        { name: 'Jens Bo Holm-Nielsen', role: 'Lead Researcher at Partner Institution' },
        { name: 'Magali Luzia Maróstica', role: 'Administrative Support' },
        { name: 'Bruno Felipe Veloso', role: 'Technical Support' },
      ],
      'en'
    );

    const names = (id) => (groups.find((g) => g.category === id)?.members || []).map((m) => m.name);
    expect(names(PARTNERS_GROUP)).toEqual(['Jens Bo Holm-Nielsen']);
    expect(names(SUPPORT_GROUP)).toEqual(['Magali Luzia Maróstica', 'Bruno Felipe Veloso']);
    expect(names(ASSOCIATES_GROUP)).toEqual(['Someone Without An Axis']);
  });

  it('labels groups in English when asked', () => {
    const groups = groupTeamByAxis(members, 'en');
    expect(groups.find((g) => g.category === DIRECTION_GROUP).title).toBe('CP2b Direction');
    expect(groups.find((g) => g.category === 'eixo-1').shortTitle).toBe('Axis 1');
  });
});
