import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import NewsletterPanel from '../NewsletterPanel';

vi.mock('../../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}));

import api from '../../../services/api';

describe('NewsletterPanel — planilha semanal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: [] });
  });

  it('envia a planilha agora e confirma para quem foi', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'Planilha enviada para mrktcp2b@unicamp.br.', to: 'mrktcp2b@unicamp.br', total: 3 } });
    const user = userEvent.setup();
    renderWithProviders(<NewsletterPanel />);

    expect(screen.getByText(/Toda segunda-feira, às 08h30/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Enviar planilha agora/ }));

    expect(api.post).toHaveBeenCalledWith('/newsletter/report');
    expect(await screen.findByText('Planilha enviada para mrktcp2b@unicamp.br.')).toBeInTheDocument();
  });

  it('mostra o erro quando o envio falha', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { error: 'Erro ao enviar a planilha. Verifique a configuração de e-mail (SMTP) do servidor.' } } });
    const user = userEvent.setup();
    renderWithProviders(<NewsletterPanel />);

    await user.click(screen.getByRole('button', { name: /Enviar planilha agora/ }));

    expect(await screen.findByText(/Verifique a configuração de e-mail/)).toBeInTheDocument();
  });
});
