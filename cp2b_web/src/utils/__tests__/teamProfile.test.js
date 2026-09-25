import { describe, it, expect } from 'vitest';
import { computeTeamProfile, leadershipComposition, careerLevel, institutionGroup, resolveMembership } from '../teamProfile';

const person = (name, extra = {}) => ({ name, role_pt: 'Pesquisador Associado', ...extra });

describe('teamProfile', () => {
  it('reads leadership from the official ANEXO 11 coordination: 9 women among 14 people, 15 seats', () => {
    // Renata coordena dois eixos: dois assentos, uma pessoa. A vaga do Eixo 5
    // não entra. O gênero vem do título do documento (Profª/Drª), não do nome.
    expect(leadershipComposition()).toEqual({ people: 14, women: 9, seats: 15 });
  });

  it('splits the CP2b team from the linked external network', () => {
    const p = computeTeamProfile([
      person('Ana Núcleo', { membership: 'nucleo', axes: ['2'] }),
      person('Bia Direção', { membership: 'direcao', axes: ['6', '7'], role_pt: 'Diretora' }),
      person('Caio Apoio', { membership: 'apoio', role_pt: 'Apoio Técnico' }),
      person('Duda Associada', { membership: 'associado' }),
      person('Enzo Parceiro', { membership: 'parceira', role_pt: 'Pesquisador Responsável na Instituição Parceira' }),
    ]);
    expect(p).toMatchObject({ total: 5, team: 3, external: 2, associates: 1, partners: 1 });
    // A direção conta nos dois eixos em que atua.
    expect(p.byAxis).toMatchObject({ 2: 1, 6: 1, 7: 1 });
  });

  it('counts a person once even if they appear on more than one card', () => {
    const p = computeTeamProfile([person('Renata X', { membership: 'nucleo' }), person('Renata X', { membership: 'nucleo' })]);
    expect(p.total).toBe(1);
  });

  it('classifies by declared role, without claiming a degree the roster does not record', () => {
    expect(careerLevel(person('A', { role_pt: 'Doutorando(a)' }), 'nucleo')).toBe('posgrad');
    expect(careerLevel(person('A', { role_pt: 'Pós-Doutorando(a)' }), 'nucleo')).toBe('posdoc');
    expect(careerLevel(person('A', { role_pt: 'Coordenadora do Eixo 3' }), 'nucleo')).toBe('coordenacao');
    expect(careerLevel(person('A', { role_pt: 'Vice-Diretora / Pesquisadora Responsável' }), 'direcao')).toBe('direcao');
    expect(careerLevel(person('A', { role_pt: 'Bolsista de Jornalismo Científico' }), 'nucleo')).toBe('graduacao');
    expect(careerLevel(person('A', { role_pt: 'Pesquisador Principal' }), 'nucleo')).toBe('docente');
  });

  it('normalizes institutions to the parent university', () => {
    expect(institutionGroup('FEEC/UNICAMP')).toBe('UNICAMP');
    expect(institutionGroup('FT UNICAMP')).toBe('UNICAMP');
    expect(institutionGroup('EESC/USP')).toBe('USP');
    expect(institutionGroup('ICT/UNIFAL')).toBe('UNIFAL');
    expect(institutionGroup('FCA/UNESP')).toBe('UNESP');
    expect(institutionGroup('Aalborg University (AAU)')).toBe('outras');
    expect(institutionGroup(null)).toBe('sem');
  });

  it('falls back to what the page already infers when membership is missing', () => {
    expect(resolveMembership(person('X', { axes: ['3'] }))).toBe('nucleo');
    expect(resolveMembership(person('X', { role_pt: 'Pesquisador Responsável na Instituição Parceira' }))).toBe('parceira');
  });
});
