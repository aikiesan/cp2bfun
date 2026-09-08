import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Team from '../Team';

vi.mock('../../services/api', () => ({
  fetchTeam: vi.fn(),
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { fetchTeam } from '../../services/api';

// A person now legitimately appears in several groups — a director shows up
// under Direção and again under each of their axes — so most assertions use
// getAllByText, or scope the query to one section.
const sectionFor = (heading) => heading.closest('section');

describe('Team page — grouped by Eixo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchTeam.mockResolvedValue({});
  });

  it('groups by Eixo and direction instead of by rank', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    expect(screen.getByRole('heading', { name: /Direção do CP2b/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Eixo 1 —/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Eixo 8 —/ })).toBeInTheDocument();
    // "Colaboradores e Parceiros" reunia dois vínculos incomparáveis; agora
    // são duas seções.
    expect(screen.getByRole('heading', { name: /Pesquisadores Associados/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Instituições Parceiras/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Colaboradores e Parceiros/ })).not.toBeInTheDocument();

    // The old hierarchy is gone from the page entirely. "Pesquisadores
    // Associados" acima é outra coisa: uma faixa de vínculo — quem integra o
    // CP2b sem eixo atribuído — e não o posto que a página deixou de exibir.
    expect(screen.queryByRole('heading', { name: 'Pesquisadores Responsáveis' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Pesquisadores Principais' })).not.toBeInTheDocument();
  }, 15000);

  it('shows the directors under Direção and still inside their own axes', async () => {
    renderWithProviders(<Team />);

    const direction = await waitFor(() =>
      sectionFor(screen.getByRole('heading', { name: /Direção do CP2b/ }))
    );

    // Both directors lead the centre as a whole...
    expect(within(direction).getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    expect(within(direction).getByText('Renata Piacentini Rodriguez')).toBeInTheDocument();

    // ...and still appear as members of the axes they work in (6 and 7),
    // which is the point of reading the team horizontally.
    const axis6 = sectionFor(screen.getByRole('heading', { name: /^Eixo 6 —/ }));
    expect(within(axis6).getByText('Bruna de Souza Moraes')).toBeInTheDocument();
    expect(within(axis6).getByText('Renata Piacentini Rodriguez')).toBeInTheDocument();
  });

  it('separates the centre’s own researchers from the partner institutions', async () => {
    renderWithProviders(<Team />);

    const partners = await waitFor(() =>
      sectionFor(screen.getByRole('heading', { name: /Instituições Parceiras/ }))
    );
    const associates = sectionFor(screen.getByRole('heading', { name: /Pesquisadores Associados/ }));

    // Colaboração externa formalizada por carta de apoio à FAPESP.
    expect(within(partners).getByText('Jens Bo Holm-Nielsen')).toBeInTheDocument();
    expect(within(associates).queryByText('Jens Bo Holm-Nielsen')).not.toBeInTheDocument();

    // Pesquisador do próprio CP2b, apenas sem eixo atribuído.
    expect(within(associates).getByText('Karla Adriana Martins Bessa')).toBeInTheDocument();
    expect(within(partners).queryByText('Karla Adriana Martins Bessa')).not.toBeInTheDocument();

    // O parágrafo é o que desfaz a confusão — o título sozinho não bastava.
    expect(within(partners).getByText(/carta de apoio à FAPESP/)).toBeInTheDocument();
    expect(within(associates).getByText(/ainda não têm eixo de pesquisa atribuído/)).toBeInTheDocument();
  });

  it('counts 27 associates, 14 partner institutions and 5 support', async () => {
    renderWithProviders(<Team />);

    const countIn = (name) =>
      sectionFor(screen.getByRole('heading', { name })).querySelectorAll('.team-member-trigger')
        .length;

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    // 27 e não 26: o Prof. Seabra saiu do apoio técnico.
    expect(countIn(/Pesquisadores Associados/)).toBe(27);
    expect(countIn(/Instituições Parceiras/)).toBe(14);
    expect(countIn(/Apoio Técnico e Administrativo/)).toBe(5);
  });

  it('lists Prof. Seabra as an associate researcher, not as technical support', async () => {
    renderWithProviders(<Team />);

    const associates = await waitFor(() =>
      sectionFor(screen.getByRole('heading', { name: /Pesquisadores Associados/ }))
    );

    // É professor da FEM/UNICAMP.
    expect(within(associates).getByText('Joaquim Eugênio Abel Seabra')).toBeInTheDocument();

    const support = sectionFor(
      screen.getByRole('heading', { name: /Apoio Técnico e Administrativo/ })
    );
    expect(within(support).queryByText('Joaquim Eugênio Abel Seabra')).not.toBeInTheDocument();
  });

  it('renders <img> for members with photos and initials for those without', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    const brunaImgs = screen.getAllByRole('img', { name: 'Bruna de Souza Moraes' });
    expect(brunaImgs[0]).toHaveAttribute('src', '/assets/team/bruna-de-souza-moraes.webp');

    // Bruno Felipe Veloso has no photo -> initials 'BF'.
    expect(screen.getAllByText('Bruno Felipe Veloso').length).toBeGreaterThan(0);
    expect(screen.queryByRole('img', { name: 'Bruno Felipe Veloso' })).not.toBeInTheDocument();
    expect(screen.getAllByText('BF').length).toBeGreaterThan(0);
  });

  it('filters members in real time when typing in the search field', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByRole('searchbox', { name: /buscar membro da equipe/i });
    fireEvent.change(searchInput, { target: { value: 'Lamparelli' } });

    expect(screen.getAllByText('Rubens Augusto Camargo Lamparelli').length).toBeGreaterThan(0);
    expect(screen.queryByText('Bruna de Souza Moraes')).not.toBeInTheDocument();

    // Search by institution
    fireEvent.change(searchInput, { target: { value: 'POLI/USP' } });
    expect(screen.getAllByText('Rachel Biancalana Costa').length).toBeGreaterThan(0);
    expect(screen.queryByText('Rubens Augusto Camargo Lamparelli')).not.toBeInTheDocument();
  });

  it('filters to a single axis when clicking its chip', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /^Eixo 1/ }));

    expect(screen.getByRole('heading', { name: /^Eixo 1 —/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^Eixo 2 —/ })).not.toBeInTheDocument();
    expect(screen.getAllByText('Rubens Augusto Camargo Lamparelli').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /Todos/i }));
    expect(screen.getByRole('heading', { name: /^Eixo 2 —/ })).toBeInTheDocument();
  });

  it('does not display email or phone numbers on public cards', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Bruna de Souza Moraes').length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('bsmoraes@unicamp.br')).not.toBeInTheDocument();
    expect(screen.queryByText('+55 (19) 3521-1241')).not.toBeInTheDocument();
  });

  it('opens a profile with the person’s CV links when their card is clicked', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Rubens Augusto Camargo Lamparelli').length).toBeGreaterThan(0);
    });

    // Nothing of the profile exists until a card is clicked: the page has
    // assertions that certain names are absent from the DOM, and an
    // always-mounted modal would put them there.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /ORCID/ })).not.toBeInTheDocument();

    const [card] = screen.getAllByRole('button', { name: /Rubens Augusto Camargo Lamparelli/ });
    expect(card).toHaveAttribute('aria-haspopup', 'dialog');
    fireEvent.click(card);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Rubens Augusto Camargo Lamparelli' })).toBeInTheDocument();

    // Rótulo textual visível, não só o ícone.
    const orcid = within(dialog).getByRole('link', { name: /ORCID/ });
    expect(orcid).toHaveAttribute('href', 'https://orcid.org/0000-0003-4344-1263');
    expect(orcid).toHaveAttribute('target', '_blank');
    expect(orcid).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(dialog).getByRole('link', { name: /Lattes/ })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Google Scholar/ })).toBeInTheDocument();
  });

  it('summarises a coordinator from the strategic spreadsheet, and omits the headings for everyone else', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Rubens Augusto Camargo Lamparelli').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Rubens Augusto Camargo Lamparelli/ })[0]);

    let dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /Áreas de atuação/i })).toBeInTheDocument();
    expect(
      within(dialog).getByText('Engenharia Agrícola com ênfase em Sensoriamento Remoto')
    ).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: /Competências/i })).toBeInTheDocument();
    expect(
      within(dialog).getByText('Domínio de Tecnologias de Sensoriamento Remoto e SIG')
    ).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    // A planilha cobre as 15 pessoas na coordenação dos eixos. Para as demais,
    // o resumo é a biografia editável no admin — e um cabeçalho vazio seria
    // pior do que nenhum.
    fireEvent.click(screen.getAllByRole('button', { name: /Karla Adriana Martins Bessa/ })[0]);

    dialog = await screen.findByRole('dialog');
    expect(within(dialog).queryByRole('heading', { name: /Áreas de atuação/i })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('heading', { name: /Competências/i })).not.toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: /Currículo e perfis/i })).toBeInTheDocument();
  });

  it('shows a plain line instead of an empty link bar for someone with no identifiers', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Sofia Silva').length).toBeGreaterThan(0);
    });

    // 26 das 98 pessoas não têm nenhum identificador localizado — o caso vazio
    // é frequente o bastante para ser desenhado.
    fireEvent.click(screen.getAllByRole('button', { name: /Sofia Silva/ })[0]);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Currículo não cadastrado.')).toBeInTheDocument();
    expect(within(dialog).queryByRole('link')).not.toBeInTheDocument();
  });

  it('closes the profile on Escape', async () => {
    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getAllByText('Sofia Silva').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByRole('button', { name: /Sofia Silva/ })[0]);
    const dialog = await screen.findByRole('dialog');

    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('does not display former members returned by an older API response', async () => {
    fetchTeam.mockResolvedValue({
      associates: [
        { name: 'Marlon Fernandes de Souza', role_pt: 'Pesquisador Associado', institution: 'ESALQ/USP' },
        { name: 'Gustavo Mockaitis', role_pt: 'Pesquisador Associado', institution: 'FEAGRI/UNICAMP' },
        { name: 'Pesquisador Atual', role_pt: 'Pesquisador Associado', institution: 'UNICAMP' },
      ],
    });

    renderWithProviders(<Team />);

    await waitFor(() => {
      expect(screen.getByText('Pesquisador Atual')).toBeInTheDocument();
    });

    expect(screen.queryByText('Marlon Fernandes de Souza')).not.toBeInTheDocument();
    expect(screen.queryByText('Gustavo Mockaitis')).not.toBeInTheDocument();
  });
});
