import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import Footer from '../Footer';

describe('Footer', () => {
  const renderFooter = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <Footer />
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderFooter();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays copyright information', () => {
    renderFooter();
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    renderFooter();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('displays social media links', () => {
    renderFooter();
    // Check for LinkedIn link (based on Header.jsx, we know there's a LinkedIn link)
    const socialLinks = screen.getAllByRole('link').filter(
      link => link.getAttribute('target') === '_blank'
    );
    expect(socialLinks.length).toBeGreaterThan(0);
  });
});
