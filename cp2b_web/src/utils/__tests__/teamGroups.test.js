import { describe, it, expect } from 'vitest';
import { nameKey } from '../nameKey';
import {
  groupTeamByAxis,
  coordinatorRank,
  isCoordinator,
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

describe('isCoordinator (o cargo já anuncia a coordenação?)', () => {
  it('recognises the role in both genders and in English', () => {
    expect(isCoordinator({ role: 'Coordenador do Eixo 1' })).toBe(true);
    expect(isCoordinator({ role: 'Coordenadora do Eixo 3' })).toBe(true);
    expect(isCoordinator({ role: 'Axis 3 Coordinator' })).toBe(true);
  });

  it('reads role_pt too, because role arrives translated on the English page', () => {
    expect(isCoordinator({ role: 'Axis 8 Lead', role_pt: 'Coordenadora do Eixo 8' })).toBe(true);
  });

  it('is false for the directors, who coordinate without the role saying so', () => {
    // Bruna e Renata coordenam os eixos 6 e 7, mas o cargo delas diz outra
    // coisa — é o que faz elas precisarem de uma tag a mais.
    expect(isCoordinator({ role: 'Diretora do CP2b' })).toBe(false);
    expect(isCoordinator({ role: 'Vice-diretora do CP2b' })).toBe(false);
    expect(isCoordinator({ role: 'Professor UNICAMP' })).toBe(false);
    expect(isCoordinator({})).toBe(false);
  });
});

describe('coordinatorRank (quem coordena vem de researchAxes, não do cargo)', () => {
  it('ranks each axis in the order researchAxes lists, which is not alphabetical', () => {
    // A ordem pedida pelo centro: Eixo 1 abre com Rubens, não com Lucas.
    expect(coordinatorRank({ name: 'Rubens Augusto Camargo Lamparelli' }, '1')).toBe(0);
    expect(coordinatorRank({ name: 'Lucas Nakamura Cerejo' }, '1')).toBe(1);
    expect(coordinatorRank({ name: 'Lucas Tadeu Fuess' }, '2')).toBe(0);
    expect(coordinatorRank({ name: 'Fabiane Moreira Vieira' }, '2')).toBe(1);
    expect(coordinatorRank({ name: 'Priscila Rosseto Camiloti' }, '3')).toBe(0);
    expect(coordinatorRank({ name: 'Ana Beatriz Soares Aguiar' }, '3')).toBe(1);
    expect(coordinatorRank({ name: 'Marcelo Pereira Cunha' }, '4')).toBe(0);
    expect(coordinatorRank({ name: 'Carlos Eduardo Driemeier' }, '4')).toBe(1);
  });

  it('matches through the academic titles researchAxes carries', () => {
    // O dado guarda "Profº Drº Rubens...", a lista da equipe guarda o nome
    // limpo. nameKey é o que costura os dois.
    expect(coordinatorRank({ name: 'Profº Drº Rubens Augusto Camargo Lamparelli' }, '1')).toBe(0);
  });

  it('finds the directors, whose role never says "coordenadora"', () => {
    expect(coordinatorRank({ name: 'Renata Piacentini Rodriguez' }, '6')).toBe(0);
    expect(coordinatorRank({ name: 'Bruna de Souza Moraes' }, '6')).toBe(1);
    expect(coordinatorRank({ name: 'Renata Piacentini Rodriguez' }, '7')).toBe(1);
  });

  it('returns Infinity for someone who only belongs to the axis', () => {
    expect(coordinatorRank({ name: 'Lucas Boaro' }, '1')).toBe(Infinity);
    expect(coordinatorRank({ name: 'Bruna de Souza Moraes' }, '1')).toBe(Infinity);
    expect(coordinatorRank({ name: 'Quem Quer Que Seja' }, '99')).toBe(Infinity);
  });
});

describe('axis groups put coordination first, in the centre order', () => {
  const members = [
    { name: 'Lucas Boaro', axes: ['1'], role: 'Iniciação Científica' },
    { name: 'Lucas Nakamura Cerejo', axes: ['1'], role: 'Coordenador do Eixo 1' },
    { name: 'Rubens Augusto Camargo Lamparelli', axes: ['1'], role: 'Coordenador do Eixo 1' },
    { name: 'Ângela Cruz Guirao', axes: ['1'], role: 'Pesquisadora' },
  ];

  const axisGroup = () => groupTeamByAxis(members, 'pt').find((g) => g.category === 'eixo-1');

  it('opens with Rubens then Lucas — the researchAxes order, not the alphabet', () => {
    expect(axisGroup().members.map((m) => m.name).slice(0, 2)).toEqual([
      'Rubens Augusto Camargo Lamparelli',
      'Lucas Nakamura Cerejo',
    ]);
  });

  it('keeps the rest alphabetical, with accents beside their base letter', () => {
    expect(axisGroup().members.map((m) => m.name).slice(2)).toEqual([
      'Ângela Cruz Guirao',
      'Lucas Boaro',
    ]);
  });

  it('tags each coordinator with the axis they coordinate', () => {
    const byName = Object.fromEntries(axisGroup().members.map((m) => [m.name, m]));
    expect(byName['Rubens Augusto Camargo Lamparelli'].coordinatesAxis).toBe('1');
    expect(byName['Lucas Boaro'].coordinatesAxis).toBe(null);
  });

  it('tags the directors on the axis they coordinate and not on others', () => {
    // A Renata coordena o 6 e o 7; a Bruna, só o 6. Nos dois casos o cargo
    // delas não diz isso, e é a tag que passa a dizer.
    const both = [
      { name: 'Bruna de Souza Moraes', axes: ['6', '7'], role: 'Diretora do CP2b' },
      { name: 'Renata Piacentini Rodriguez', axes: ['6', '7'], role: 'Vice-diretora do CP2b' },
    ];
    const groups = groupTeamByAxis(both, 'pt');
    const find = (cat, name) =>
      groups.find((g) => g.category === cat).members.find((m) => m.name === name);

    expect(find('eixo-6', 'Bruna de Souza Moraes').coordinatesAxis).toBe('6');
    expect(find('eixo-6', 'Renata Piacentini Rodriguez').coordinatesAxis).toBe('6');
    expect(find('eixo-7', 'Renata Piacentini Rodriguez').coordinatesAxis).toBe('7');
    // A Bruna integra o Eixo 7 mas não o coordena.
    expect(find('eixo-7', 'Bruna de Souza Moraes').coordinatesAxis).toBe(null);
  });

  it('leaves non-axis groups in the order they already had', () => {
    const staff = [
      { name: 'Zulmira Apoio', membership: 'apoio', role: 'Apoio Administrativo' },
      { name: 'Ana Apoio', membership: 'apoio', role: 'Apoio Técnico' },
    ];
    const group = groupTeamByAxis(staff, 'pt').find((g) => g.category === SUPPORT_GROUP);
    expect(group.members.map((m) => m.name)).toEqual(['Zulmira Apoio', 'Ana Apoio']);
  });
});
