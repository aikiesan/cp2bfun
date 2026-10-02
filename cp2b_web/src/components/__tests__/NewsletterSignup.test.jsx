import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import NewsletterSignup from '../NewsletterSignup';

vi.mock('../../services/api', () => ({
  default: { post: vi.fn(), get: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import api from '../../services/api';

describe('NewsletterSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requires an email and does not call the API on an empty submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewsletterSignup />);

    // The email field is marked required, so the browser blocks empty submits.
    expect(screen.getByPlaceholderText('Seu e-mail')).toBeRequired();

    await user.click(screen.getByRole('button', { name: 'Inscrever' }));
    expect(api.post).not.toHaveBeenCalled();
  });

  it('submits a valid email and shows the success message', async () => {
    api.post.mockResolvedValueOnce({ data: { ok: true } });
    const user = userEvent.setup();
    renderWithProviders(<NewsletterSignup />);

    await user.type(screen.getByPlaceholderText('Seu e-mail'), 'lucas@example.com');
    await user.click(screen.getByRole('button', { name: 'Inscrever' }));

    await waitFor(() => {
      expect(screen.getByText('Inscrição realizada! Verifique seu e-mail.')).toBeInTheDocument();
    });
    expect(api.post).toHaveBeenCalledWith(
      '/newsletter/subscribe',
      expect.objectContaining({ email: 'lucas@example.com' })
    );
  });

  it('shows a server error message when the API rejects', async () => {
    api.post.mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    renderWithProviders(<NewsletterSignup />);

    await user.type(screen.getByPlaceholderText('Seu e-mail'), 'lucas@example.com');
    await user.click(screen.getByRole('button', { name: 'Inscrever' }));

    await waitFor(() => {
      expect(screen.getByText('Erro ao realizar inscrição. Tente novamente.')).toBeInTheDocument();
    });
  });
});
