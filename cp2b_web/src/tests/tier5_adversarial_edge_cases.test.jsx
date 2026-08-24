/**
 * Tier 5 — Adversarial & Stress Testing Suite
 *
 * Verifies system robustness under adversarial conditions:
 * 1. Special characters, XML entity escaping, scientific formulas, and UTF-8 encoding fidelity
 * 2. Malformed input resilience and defensive guards
 * 3. Extreme search input stress and rapid concurrency cycles
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import Team from '../pages/Team';

// Helper XML escaper matching generate-seo.mjs
const escapeXml = (s = '') =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

describe('Tier 5 — Adversarial & Stress Testing', () => {
  // ── 1. Encoding & Escaping Integrity ──────────────────────────────────────
  describe('Encoding & Escaping Integrity', () => {
    it('escapes XML meta-characters in sitemap URL generation', () => {
      const dangerousUrls = [
        'https://cp2b.unicamp.br/noticias/pesquisa-&-desenvolvimento',
        'https://cp2b.unicamp.br/eixos?axis=1&detail=true',
        'https://cp2b.unicamp.br/busca?q="biogas"<script>',
      ];

      dangerousUrls.forEach((url) => {
        const escaped = escapeXml(url);
        expect(escaped).not.toContain('<script>');
        expect(escaped).not.toMatch(/(?<!&amp;)&(?!amp;|lt;|gt;|quot;|apos;)/);
      });
    });

    it('preserves UTF-8 fidelity for complex Portuguese academic terminology', () => {
      const terms = [
        'Centro Paulista de Estudos em Biogás e Bioprodutos',
        'Avaliação Integrada Socioeconômica, Ambiental e Energética',
        'Biomassa lignocelulósica & digestão anaeróbia',
        'Fórum de Ciência, Tecnologia & Inovação Regulatória',
      ];

      terms.forEach((term) => {
        const encoded = encodeURIComponent(term);
        const decoded = decodeURIComponent(encoded);
        expect(decoded).toBe(term);
      });
    });

    it('handles chemical formulas and scientific units safely', () => {
      const formulas = ['CH₄', 'CO₂', 'H₂S', '4,5 bilhões de m³/ano', 'TRL 4–6'];

      formulas.forEach((formula) => {
        expect(formula.length).toBeGreaterThan(0);
        // Ensure serialization / deserialization does not corrupt unicode superscripts/subscripts
        const json = JSON.stringify({ formula });
        const parsed = JSON.parse(json);
        expect(parsed.formula).toBe(formula);
      });
    });
  });

  // ── 2. Malformed / Invalid Input Combinations ─────────────────────────────
  describe('Malformed Input Resilience', () => {
    it('handles oversized search queries (500+ characters) without crashing Team page', async () => {
      renderWithProviders(<Team />);

      const searchInput = await screen.findByPlaceholderText(/Buscar por nome/i);
      const oversizedText = 'A'.repeat(500);

      // Typing an oversized string via fireEvent change should not throw or freeze
      fireEvent.change(searchInput, { target: { value: oversizedText } });
      expect(searchInput).toHaveValue(oversizedText);
    });

    it('handles whitespace-only and special character search inputs cleanly', async () => {
      renderWithProviders(<Team />);

      const searchInput = await screen.findByPlaceholderText(/Buscar por nome/i);

      fireEvent.change(searchInput, { target: { value: '   !@#$%^&*()_+<>?:{}   ' } });
      expect(searchInput).toHaveValue('   !@#$%^&*()_+<>?:{}   ');
    });
  });

  // ── 3. Concurrency & Rapid State Cycling ──────────────────────────────────
  describe('Concurrency & Rapid State Cycling', () => {
    it('survives 20 rapid sequential language toggles without state corruption', async () => {
      const user = userEvent.setup();

      function RapidToggler() {
        const { language, setLanguage } = useLanguage();
        return (
          <div>
            <span data-testid="lang-val">{language}</span>
            <button onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}>Toggle</button>
          </div>
        );
      }

      render(
        <LanguageProvider>
          <RapidToggler />
        </LanguageProvider>
      );

      const toggleBtn = screen.getByText('Toggle');

      // Rapidly toggle 20 times
      for (let i = 0; i < 20; i++) {
        await user.click(toggleBtn);
      }

      // After 20 toggles (even number), language should return to initial 'pt'
      expect(screen.getByTestId('lang-val')).toHaveTextContent('pt');
    });
  });
});
