import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';

export function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <LanguageProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </LanguageProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
