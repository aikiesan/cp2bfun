import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaLinkedin, FaInstagram, FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { menuLabels, socialLinks } from '../data/content';
import SearchModal from './SearchModal';

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const t = menuLabels[language];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLang = (l) => setLanguage(l);

  // Navigation labels
  const navLabels = {
    pt: {
      axes: 'Eixos',
      more: 'Mais'
    },
    en: {
      axes: 'Axes',
      more: 'More'
    }
  }[language];

  // Check if current path matches
  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (paths) => paths.some(path => location.pathname === path);

  return (
    <>
      <header>
        {/* Top Header - Refined Accessibility Bar */}
        <div className="top-header" role="banner">
          <Container>
            <div className="d-flex align-items-center justify-content-between">
              {/* Left side - FAPESP badge */}
              <div className="d-none d-lg-flex align-items-center gap-2">
                <span className="text-petrol" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  FAPESP 2021/10413-6
                </span>
              </div>

              {/* Right side - Accessibility & Language */}
              <div className="d-flex align-items-center gap-3 ms-auto">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="accessibility-control d-flex align-items-center justify-content-center"
                  style={{
                    border: 'none',
                    background: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%'
                  }}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  title={isDarkMode ? 'Light mode' : 'Dark mode'}
                >
                  {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
                </button>

                {/* Divider */}
                <div style={{ width: '1px', height: '16px', background: 'var(--cp2b-border)' }} />

                {/* Accessibility Controls */}
                <div className="d-flex align-items-center gap-1">
                  <button
                    className="accessibility-control fw-semibold"
                    title={language === 'pt' ? 'Aumentar fonte' : 'Increase font'}
                    style={{ border: 'none', background: 'none' }}
                    aria-label={language === 'pt' ? 'Aumentar fonte' : 'Increase font'}
                  >
                    A+
                  </button>
                  <button
                    className="accessibility-control fw-semibold"
                    title={language === 'pt' ? 'Diminuir fonte' : 'Decrease font'}
                    style={{ border: 'none', background: 'none' }}
                    aria-label={language === 'pt' ? 'Diminuir fonte' : 'Decrease font'}
                  >
                    A-
                  </button>
                  <button
                    className="accessibility-control"
                    title={language === 'pt' ? 'Alto contraste' : 'High contrast'}
                    style={{ border: 'none', background: 'none' }}
                    aria-label={language === 'pt' ? 'Alto contraste' : 'High contrast'}
                  >
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1.5px solid currentColor',
                        background: 'linear-gradient(to right, currentColor 50%, transparent 50%)',
                        display: 'inline-block'
                      }}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '16px', background: 'var(--cp2b-border)' }} />

                {/* Language Selector */}
                <div className="d-flex align-items-center gap-1" role="group" aria-label="Language selection">
                  <button
                    onClick={() => toggleLang('pt')}
                    className={`lang-btn ${language === 'pt' ? 'active' : ''}`}
                    title="Português"
                    aria-label="Português"
                    aria-pressed={language === 'pt'}
                  >
                    <img loading="lazy" src="https://flagcdn.com/20x15/br.png" width="20" height="15" alt="" />
                  </button>
                  <button
                    onClick={() => toggleLang('en')}
                    className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                    title="English"
                    aria-label="English"
                    aria-pressed={language === 'en'}
                  >
                    <img loading="lazy" src="https://flagcdn.com/20x15/us.png" width="20" height="15" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Main Navbar */}
        <Navbar
          expand="lg"
          sticky="top"
          className={`py-3 ${scrolled ? 'scrolled shadow-sm' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <Container>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
              <img
                src="/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png"
                alt="CP2B - Centro Paulista de Estudos em Biogás e Bioprodutos"
                height="50"
                className="d-inline-block align-top"
              />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-navbar" className="border-0" />

            <Navbar.Collapse id="main-navbar">
              <Nav className="ms-auto align-items-lg-center gap-lg-1">
                {/* Home */}
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`px-3 ${isActive('/') ? 'active' : ''}`}
                >
                  {t.home}
                </Nav.Link>

                {/* Sobre */}
                <Nav.Link
                  as={Link}
                  to="/sobre"
                  className={`px-3 ${isActive('/sobre') ? 'active' : ''}`}
                >
                  {t.about}
                </Nav.Link>

                {/* Equipe */}
                <Nav.Link
                  as={Link}
                  to="/equipe"
                  className={`px-3 ${isActive('/equipe') ? 'active' : ''}`}
                >
                  {t.team}
                </Nav.Link>

                {/* Eixos (Research) */}
                <Nav.Link
                  as={Link}
                  to="/pesquisa"
                  className={`px-3 ${isActive('/pesquisa') ? 'active' : ''}`}
                >
                  {navLabels.axes}
                </Nav.Link>

                {/* Notícias */}
                <Nav.Link
                  as={Link}
                  to="/noticias"
                  className={`px-3 ${isActive('/noticias') ? 'active' : ''}`}
                >
                  {t.news}
                </Nav.Link>

                {/* Contato */}
                <Nav.Link
                  as={Link}
                  to="/contato"
                  className={`px-3 ${isActive('/contato') ? 'active' : ''}`}
                >
                  {t.contact}
                </Nav.Link>

                {/* More Dropdown - at the end */}
                <NavDropdown
                  title={navLabels.more}
                  id="more-dropdown"
                  className={`px-2 ${isActiveGroup(['/publicacoes', '/projetos', '/na-midia', '/oportunidades', '/faq']) ? 'active' : ''}`}
                >
                  <NavDropdown.Item as={Link} to="/publicacoes">{t.publications}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/projetos">{t.projects}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/na-midia">{t.media}</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/oportunidades">{t.opportunities}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/faq">FAQ</NavDropdown.Item>
                </NavDropdown>

                {/* Divider */}
                <div
                  className="d-none d-lg-block mx-2"
                  style={{ width: '1px', height: '24px', background: 'var(--cp2b-border)' }}
                />

                {/* Search Button */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="btn btn-link p-2 d-flex align-items-center gap-2 text-muted"
                  aria-label={language === 'pt' ? 'Buscar' : 'Search'}
                  title={`${language === 'pt' ? 'Buscar' : 'Search'} (Ctrl+K)`}
                >
                  <FaSearch size={16} />
                  <span
                    className="d-none d-xl-inline small px-2 py-1 rounded"
                    style={{ background: 'var(--cp2b-bg)', fontSize: '0.7rem' }}
                  >
                    Ctrl+K
                  </span>
                </button>

                {/* Social Links */}
                <div className="d-flex align-items-center gap-1">
                  <Nav.Link
                    href="https://www.instagram.com/cp2b_biogas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 d-flex align-items-center text-petrol"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={18} aria-hidden="true" />
                  </Nav.Link>
                  <Nav.Link
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 d-flex align-items-center text-petrol"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={18} aria-hidden="true" />
                  </Nav.Link>
                </div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* Search Modal */}
      <SearchModal show={showSearch} onHide={() => setShowSearch(false)} />
    </>
  );
};

export default Header;
