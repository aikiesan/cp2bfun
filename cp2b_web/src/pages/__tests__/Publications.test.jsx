import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Publications from '../Publications';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../../services/api';

const mockPublications = [
  {
    id: 1,
    title_pt: 'Artigo sobre biogás',
    title_en: 'Biogas article',
    authors: 'Silva, J.; Souza, M.',
    journal: 'Nature Energy',
    year: 2025,
    doi: '10.1234/example.doi',
    url: 'https://example.com/paper',
    pdf_url: 'https://cdn.example.com/paper.pdf',
    publication_type: 'article',
  },
  {
    id: 2,
    title_pt: 'Capítulo sem links',
    title_en: 'Chapter without links',
    authors: 'Costa, A.',
    year: 2024,
    publication_type: 'chapter',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Publications — links and grouping', () => {
  it('renders DOI, Link and PDF anchors with correct hrefs', async () => {
    api.get.mockResolvedValue({ data: mockPublications });
    renderWithProviders(<Publications />);

    await waitFor(() => {
      expect(screen.getByText('Artigo sobre biogás')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'DOI' })).toHaveAttribute(
      'href',
      'https://doi.org/10.1234/example.doi'
    );
    expect(screen.getByRole('link', { name: 'Link' })).toHaveAttribute(
      'href',
      'https://example.com/paper'
    );
    expect(screen.getByRole('link', { name: 'PDF' })).toHaveAttribute(
      'href',
      'https://cdn.example.com/paper.pdf'
    );
  });

  it('omits link buttons for publications missing doi/url/pdf', async () => {
    api.get.mockResolvedValue({ data: [mockPublications[1]] });
    renderWithProviders(<Publications />);

    await waitFor(() => {
      expect(screen.getByText('Capítulo sem links')).toBeInTheDocument();
    });

    expect(screen.queryByRole('link', { name: 'DOI' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'PDF' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Link' })).not.toBeInTheDocument();
  });

  it('groups publications under year headings', async () => {
    api.get.mockResolvedValue({ data: mockPublications });
    renderWithProviders(<Publications />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '2025' })).toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: '2024' })).toBeInTheDocument();
  });

  it('shows an empty message when no publications are returned', async () => {
    api.get.mockResolvedValue({ data: [] });
    renderWithProviders(<Publications />);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma publicação encontrada')).toBeInTheDocument();
    });
  });
});
