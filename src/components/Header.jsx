import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaLinkedin, FaChevronDown } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { menuLabels, socialLinks } from '../data/content';

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const t = menuLabels[language];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = (l) => setLanguage(l);

  // Navigation labels for dropdowns
  const navLabels = {
    pt: {
      institutional: 'Institucional',
      research: 'Pesquisa',
      connect: 'Conecte-se'
    },
    en: {
      institutional: 'Institutional',
      research: 'Research',
      connect: 'Connect'
    }
  }[language];

  // Check if current path matches
  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (paths) => paths.some(path => location.pathname === path);

  return (
    <header>
      {/* Top Header - Refined Accessibility Bar */}
      <div className="top-header">
        <Container>
          <div className="d-flex align-items-center justify-content-between">
            {/* Left side - FAPESP badge */}
            <div className="d-none d-lg-flex align-items-center gap-2">
              <span className="text-petrol" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                FAPESP 2021/10413-6
              </span>
            </div>

            {/* Right side - Accessibility & Language */}
            <div className="d-flex align-items-center gap-4 ms-auto">
              {/* Accessibility Controls */}
              <div className="d-flex align-items-center gap-2">
                <button
                  className="accessibility-control fw-semibold"
                  title={language === 'pt' ? 'Aumentar fonte' : 'Increase font'}
                  style={{ border: 'none', background: 'none' }}
                >
                  A+
                </button>
                <button
                  className="accessibility-control fw-semibold"
                  title={language === 'pt' ? 'Diminuir fonte' : 'Decrease font'}
                  style={{ border: 'none', background: 'none' }}
                >
                  A-
                </button>
                <button
                  className="accessibility-control"
                  title={language === 'pt' ? 'Alto contraste' : 'High contrast'}
                  style={{ border: 'none', background: 'none' }}
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
                  />
                </button>
              </div>

              {/* Language Selector */}
              <div className="d-flex align-items-center gap-1">
                <button
                  onClick={() => toggleLang('pt')}
                  className={`lang-btn ${language === 'pt' ? 'active' : ''}`}
                  title="Português"
                >
                  <img loading="lazy" src="https://flagcdn.com/20x15/br.png" width="20" height="15" alt="PT" />
                </button>
                <button
                  onClick={() => toggleLang('en')}
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  title="English"
                >
                  <img loading="lazy" src="https://flagcdn.com/20x15/us.png" width="20" height="15" alt="EN" />
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

              {/* Institutional Dropdown */}
              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-1">
                    {navLabels.institutional}
                    <FaChevronDown size={10} />
                  </span>
                }
                id="institutional-dropdown"
                className={`px-2 ${isActiveGroup(['/sobre', '/equipe']) ? 'active' : ''}`}
              >
                <NavDropdown.Item as={Link} to="/sobre">{t.about}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/equipe">{t.team}</NavDropdown.Item>
              </NavDropdown>

              {/* Research Dropdown */}
              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-1">
                    {navLabels.research}
                    <FaChevronDown size={10} />
                  </span>
                }
                id="research-dropdown"
                className={`px-2 ${isActiveGroup(['/pesquisa', '/publicacoes', '/projetos']) ? 'active' : ''}`}
              >
                <NavDropdown.Item as={Link} to="/pesquisa">{t.research}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/publicacoes">{t.publications}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/projetos">{t.projects}</NavDropdown.Item>
              </NavDropdown>

              {/* News */}
              <Nav.Link
                as={Link}
                to="/noticias"
                className={`px-3 ${isActive('/noticias') ? 'active' : ''}`}
              >
                {t.news}
              </Nav.Link>

              {/* Media */}
              <Nav.Link
                as={Link}
                to="/na-midia"
                className={`px-3 ${isActive('/na-midia') ? 'active' : ''}`}
              >
                {t.media}
              </Nav.Link>

              {/* Opportunities */}
              <Nav.Link
                as={Link}
                to="/oportunidades"
                className={`px-3 ${isActive('/oportunidades') ? 'active' : ''}`}
              >
                {t.opportunities}
              </Nav.Link>

              {/* Contact */}
              <Nav.Link
                as={Link}
                to="/contato"
                className={`px-3 ${isActive('/contato') ? 'active' : ''}`}
              >
                {t.contact}
              </Nav.Link>

              {/* LinkedIn - Accent */}
              <Nav.Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 d-flex align-items-center gap-2 text-petrol"
              >
                <FaLinkedin size={18} />
                <span className="d-none d-xl-inline">{t.linkedin}</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
