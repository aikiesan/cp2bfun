/**
 * LanguageContext tests
 *
 * Teaching notes for grad students:
 * - Unit tests for a React Context isolate the context logic from any page/component.
 * - We create a small helper component (LanguageDisplay) that consumes the context
 *   so we can assert on its values without mounting a full page.
 * - localStorage interaction is tested by reading/setting it directly.
 * - The "error outside provider" test verifies the defensive guard in useLanguage().
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';

// ── Helper components ──────────────────────────────────────────────────────────

/** Renders current language and exposes buttons to change it. */
function LanguageDisplay() {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={() => setLanguage('en')}>to-en</button>
      <button onClick={() => setLanguage('pt')}>to-pt</button>
    </div>
  );
}

/** Used to verify that useLanguage() throws outside a provider. */
function OutsideProvider() {
  const { language } = useLanguage(); // intentionally called without a provider
  return <span>{language}</span>;
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('LanguageContext', () => {
  beforeEach(() => {
    // Always start each test with a clean localStorage so tests don't bleed
    // into each other — this is a common source of flaky tests.
    localStorage.clear();
  });

  it('defaults to Portuguese ("pt") when localStorage is empty', () => {
    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('pt');
  });

  it('reads the initial language from localStorage on mount', () => {
    // Simulate a returning user who previously chose English
    localStorage.setItem('cp2b_lang', 'en');

    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );

    expect(screen.getByTestId('lang')).toHaveTextContent('en');
  });

  it('setLanguage switches the active language', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );

    // Initially Portuguese
    expect(screen.getByTestId('lang')).toHaveTextContent('pt');

    // Switch to English
    await user.click(screen.getByText('to-en'));
    expect(screen.getByTestId('lang')).toHaveTextContent('en');

    // Switch back to Portuguese
    await user.click(screen.getByText('to-pt'));
    expect(screen.getByTestId('lang')).toHaveTextContent('pt');
  });

  it('persists language changes to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );

    await user.click(screen.getByText('to-en'));

    // The next time the app loads, it should remember the preference
    expect(localStorage.getItem('cp2b_lang')).toBe('en');
  });

  it('throws a descriptive error when useLanguage is called outside a LanguageProvider', () => {
    // Suppress React's error boundary noise in the test output
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<OutsideProvider />)).toThrow(
      'useLanguage must be used within a LanguageProvider'
    );

    consoleError.mockRestore();
  });
});
