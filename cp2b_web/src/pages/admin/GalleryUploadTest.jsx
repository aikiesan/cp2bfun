import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GalleryUpload from './GalleryUpload';
test('smoke: renders without crashing', () => {
  expect(() =>
    render(<MemoryRouter><GalleryUpload /></MemoryRouter>)
  ).not.toThrow();
});
