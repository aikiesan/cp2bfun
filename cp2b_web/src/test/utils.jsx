import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';

export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <HelmetProvider>
        <LanguageProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </LanguageProvider>
      </HelmetProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
