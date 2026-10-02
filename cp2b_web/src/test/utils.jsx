import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../context/LanguageContext';
import { ToastProvider } from '../components/admin';

export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <HelmetProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ToastProvider>
              {children}
            </ToastProvider>
          </BrowserRouter>
        </LanguageProvider>
      </HelmetProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
