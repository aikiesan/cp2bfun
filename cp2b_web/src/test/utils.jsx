import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { ToastProvider } from '../components/admin';

export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <LanguageProvider>
        <BrowserRouter>
          <ToastProvider>
            {children}
          </ToastProvider>
        </BrowserRouter>
      </LanguageProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
