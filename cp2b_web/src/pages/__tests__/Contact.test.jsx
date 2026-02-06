import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import Contact from '../Contact';

// Mock the api module
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../../services/api';

describe('Contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the contact form', () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText('Entre em Contato')).toBeInTheDocument();
    expect(screen.getByText('NOME')).toBeInTheDocument();
    expect(screen.getByText('E-MAIL')).toBeInTheDocument();
    expect(screen.getByText('MENSAGEM')).toBeInTheDocument();
  });

  it('shows validation error for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);

    await user.click(screen.getByText('ENVIAR MENSAGEM'));
    expect(screen.getByText('Preencha todos os campos.')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Contact />);

    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const messageInput = container.querySelector('textarea[name="message"]');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'invalid-email');
    await user.type(messageInput, 'Test message');
    await user.click(screen.getByText('ENVIAR MENSAGEM'));

    expect(screen.getByText('E-mail invalido.')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValueOnce({ data: { id: 1 } });
    const { container } = renderWithProviders(<Contact />);

    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const messageInput = container.querySelector('textarea[name="message"]');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(screen.getByText('ENVIAR MENSAGEM'));

    await waitFor(() => {
      expect(screen.getByText('Mensagem enviada com sucesso!')).toBeInTheDocument();
    });
  });

  it('shows error on submission failure', async () => {
    const user = userEvent.setup();
    api.post.mockRejectedValueOnce(new Error('Network error'));
    const { container } = renderWithProviders(<Contact />);

    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const messageInput = container.querySelector('textarea[name="message"]');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(screen.getByText('ENVIAR MENSAGEM'));

    await waitFor(() => {
      expect(screen.getByText('Erro ao enviar mensagem. Tente novamente.')).toBeInTheDocument();
    });
  });
});
