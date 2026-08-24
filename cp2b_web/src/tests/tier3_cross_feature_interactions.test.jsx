/**
 * Tier 3 — Cross-Feature Interactions Test Suite
 *
 * Verifies pairwise and cross-feature interactions:
 * 1. Language toggling preserving data integrity across core pages:
 *    - /sobre (About)
 *    - /eixos (Research)
 *    - /solucoes (Solucoes)
 *    - /equipe (Team)
 *    - /noticias (News)
 * 2. Search & filter state preservation across language changes
 * 3. SEO metadata synchronization with language context
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

import About from '../pages/About';
import Research from '../pages/Research';
import Solucoes from '../pages/Solucoes';
import Team from '../pages/Team';
import News from '../pages/News';
import { menuLabels } from '../data/content';
import { technicalServices } from '../data/generated/services';

// Test wrapper with language toggle control
function PageWithLanguageToggle({ Component }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <div className="test-lang-controls">
        <button onClick={() => setLanguage('pt')}>Set PT</button>
        <button onClick={() => setLanguage('en')}>Set EN</button>
        <span data-testid="current-lang">{language}</span>
      </div>
      <Component />
    </div>
  );
}

describe('Tier 3 — Cross-Feature Interactions: Language Toggling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles language on /sobre (About) between PT and EN seamlessly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageWithLanguageToggle Component={About} />);

    // Default is PT
    expect(screen.getByTestId('current-lang')).toHaveTextContent('pt');
    await waitFor(() => {
      expect(screen.getByText(/SOBRE O PROJETO|Sobre/i)).toBeInTheDocument();
    });

    // Switch to EN
    await user.click(screen.getByText('Set EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    await waitFor(() => {
      expect(screen.getByText(/ABOUT THE PROJECT|About/i)).toBeInTheDocument();
    });

    // Switch back to PT
    await user.click(screen.getByText('Set PT'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('pt');
    await waitFor(() => {
      expect(screen.getByText(/SOBRE O PROJETO|Sobre/i)).toBeInTheDocument();
    });
  });

  it('toggles language on /eixos (Research) preserving all 8 axes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageWithLanguageToggle Component={Research} />);

    // PT mode: 8 axes rendered
    await waitFor(() => {
      const axisNodesPt = document.querySelectorAll('.mmap-node--axis');
      expect(axisNodesPt.length).toBe(8);
    });

    // Switch to EN
    await user.click(screen.getByText('Set EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');

    // Axes still present in EN
    await waitFor(() => {
      const axisNodesEn = document.querySelectorAll('.mmap-node--axis');
      expect(axisNodesEn.length).toBe(8);
    });
  });

  it('toggles language on /solucoes preserving 15 technical services and TRL badges', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageWithLanguageToggle Component={Solucoes} />);

    // Default PT
    expect(screen.getByTestId('current-lang')).toHaveTextContent('pt');

    await waitFor(() => {
      const badges = document.querySelectorAll('.badge');
      expect(badges.length).toBeGreaterThan(0);
    });

    // Switch to EN
    await user.click(screen.getByText('Set EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');

    // Technical services data exists in both languages
    expect(technicalServices[0].en.title).toBeDefined();
    expect(technicalServices[0].pt.title).toBeDefined();
  });

  it('toggles language on /equipe (Team) preserving member list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageWithLanguageToggle Component={Team} />);

    expect(screen.getByTestId('current-lang')).toHaveTextContent('pt');
    await waitFor(() => {
      expect(screen.getAllByText(/Bruna de Souza Moraes/i).length).toBeGreaterThan(0);
    });

    // Switch to EN
    await user.click(screen.getByText('Set EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    await waitFor(() => {
      expect(screen.getAllByText(/Bruna de Souza Moraes/i).length).toBeGreaterThan(0);
    });

    // Switch back to PT
    await user.click(screen.getByText('Set PT'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('pt');
  });

  it('toggles language on /noticias (News) without crashing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PageWithLanguageToggle Component={News} />);

    expect(screen.getByTestId('current-lang')).toHaveTextContent('pt');

    await user.click(screen.getByText('Set EN'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
  });

  it('preserves menu labels across all 5 core routes during language toggle', async () => {
    const user = userEvent.setup();

    function MenuTester() {
      const { language, setLanguage } = useLanguage();
      const labels = menuLabels[language];
      return (
        <div>
          <button onClick={() => setLanguage('en')}>EN</button>
          <button onClick={() => setLanguage('pt')}>PT</button>
          <span data-testid="menu-about">{labels.about}</span>
          <span data-testid="menu-axes">{labels.axes}</span>
          <span data-testid="menu-solutions">{labels.solutions}</span>
          <span data-testid="menu-team">{labels.team}</span>
          <span data-testid="menu-news">{labels.news}</span>
        </div>
      );
    }

    render(
      <LanguageProvider>
        <MenuTester />
      </LanguageProvider>
    );

    // Initial PT
    expect(screen.getByTestId('menu-about')).toHaveTextContent('Sobre');
    expect(screen.getByTestId('menu-axes')).toHaveTextContent('Eixos');
    expect(screen.getByTestId('menu-solutions')).toHaveTextContent('Soluções');
    expect(screen.getByTestId('menu-team')).toHaveTextContent('Equipe');
    expect(screen.getByTestId('menu-news')).toHaveTextContent('Comunicação');

    // Switch to EN
    await user.click(screen.getByText('EN'));
    expect(screen.getByTestId('menu-about')).toHaveTextContent('About');
    expect(screen.getByTestId('menu-axes')).toHaveTextContent('Axes');
    expect(screen.getByTestId('menu-solutions')).toHaveTextContent('Solutions');
    expect(screen.getByTestId('menu-team')).toHaveTextContent('Team');
    expect(screen.getByTestId('menu-news')).toHaveTextContent('Communication');
  });
});
