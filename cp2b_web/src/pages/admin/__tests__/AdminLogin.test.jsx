import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import AdminLogin from '../AdminLogin';

const mocks = vi.hoisted(() => ({ adminLogin: vi.fn() }));

vi.mock('../../../services/api', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, adminLogin: mocks.adminLogin };
});

describe('AdminLogin', () => {
  beforeEach(() => {
    mocks.adminLogin.mockReset();
  });

  it('logs in and notifies the parent on success', async () => {
    mocks.adminLogin.mockResolvedValue({ token: 'abc' });
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<AdminLogin onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText('Senha'), 'senha-de-teste');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(mocks.adminLogin).toHaveBeenCalledWith('senha-de-teste');
  });

  it('shows the API error message on failure', async () => {
    mocks.adminLogin.mockRejectedValue(
      Object.assign(new Error('nope'), { response: { data: { error: 'Incorrect password' } } })
    );
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<AdminLogin onSuccess={onSuccess} />);
    await user.type(screen.getByLabelText('Senha'), 'senha-de-teste-errada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Incorrect password')).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('disables the submit button while the password is empty', () => {
    renderWithProviders(<AdminLogin onSuccess={vi.fn()} />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDisabled();
  });
});
