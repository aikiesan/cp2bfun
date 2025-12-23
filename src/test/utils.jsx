import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of @testing-library/react's render for components that need context
 */
export function renderWithProviders(ui, options = {}) {
  const {
    route = '/',
    ...renderOptions
  } = options;

  // Set the initial route
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => {
    return (
      <HelmetProvider>
        <ThemeProvider>
          <LanguageProvider>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing library
export * from '@testing-library/react';
