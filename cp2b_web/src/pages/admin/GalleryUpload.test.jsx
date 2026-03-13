
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import GalleryUpload from './GalleryUpload';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

test('smoke: renders without crashing', () => {
  expect(() =>
    renderWithProviders(<GalleryUpload />)
  ).not.toThrow();
});

test('submit button is disabled while submitting', () => {
  renderWithProviders(<GalleryUpload />);
  const btn = screen.getByRole('button', { name: /guardar foto/i });
  expect(btn).not.toBeDisabled();
  // Simule isSubmitting=true e verifique que btn fica disabled
});

test('submit button is disabled while submitting', async () => {
  // 1. Inicializa o userEvent e renderiza o componente
  const user = userEvent.setup();
  renderWithProviders(<GalleryUpload />);
  
  // Pegamos o botão e verificamos que ele começa habilitado
  const submitBtn = screen.getByRole('button', { name: /guardar foto/i });
  expect(submitBtn).not.toBeDisabled();

  // 2. Preenche os campos obrigatórios para passar na validação
  const titleInput = screen.getByLabelText(/título do álbum/i);
  await user.type(titleInput, 'Abertura do Evento');

  const dateInput = screen.getByLabelText(/data do evento/i);
  await user.type(dateInput, '2026-03-12');

  // Criamos um arquivo falso para simular o upload da capa
  const coverInput = screen.getByLabelText(/foto de capa/i);
  const fakeCover = new File(['(⌐□_□)'], 'capa.png', { type: 'image/png' });
  await user.upload(coverInput, fakeCover);

  // Cria um arquivo falso (Mock) e faz o upload
  const fileInput = screen.getByLabelText(/selecionar imagem/i);
  const fakeFile = new File(['(⌐□_□)'], 'foto.png', { type: 'image/png' });
  await user.upload(fileInput, fakeFile);

  // 3. Clica no botão de enviar
  // Não usamos "await" aqui de propósito, para podermos checar a tela ANTES do envio terminar
  user.click(submitBtn);

  // 4. Verifica se o botão ficou desabilitado durante o envio
  await waitFor(() => {
    expect(submitBtn).toBeDisabled();
    // Bônus: verifica se o texto do botão mudou para indicar o carregamento
    expect(screen.getByText(/enviando foto/i)).toBeInTheDocument();
  });
});
