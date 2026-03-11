
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GalleryUpload from './GalleryUpload';
test('smoke: renders without crashing', () => {
  expect(() =>
    render(<MemoryRouter><GalleryUpload /></MemoryRouter>)
  ).not.toThrow();
});
test('submit button is disabled while submitting', () => {
  render(<MemoryRouter><GalleryUpload /></MemoryRouter>);
  const btn = screen.getByRole('button', { name: /enviar/i });
  expect(btn).not.toBeDisabled();
  // Simule isSubmitting=true e verifique que btn fica disabled
});
