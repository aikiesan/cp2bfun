import React from 'react';
import { Navbar, Nav, Container, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { menuLabels, socialLinks } from '../data/content';

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const t = menuLabels[language];

  const toggleLang = (l) => setLanguage(l);

  return (
    <header>
      {/* Top Header - Recod.ai Style */}
      <div id="top-header" className="py-2" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', fontSize: '0.85rem' }}>
        <Container>
          <div className="row align-items-center">
            <div className="col d-none d-lg-flex">
              <div className="desktop-shortcuts">
                  {/* Future shortcuts */}
              </div>
            </div>

            {/* Accessibility */}
            <div className="col col-lg-3 accessibility d-flex align-items-center justify-content-end gap-3 text-muted">
              <span className="cursor-pointer fw-bold" title="Aumentar tamanho da letra" style={{ cursor: 'pointer' }}>A+</span>
              <span className="cursor-pointer fw-bold" title="Diminuir tamanho da letra" style={{ cursor: 'pointer' }}>A-</span>
              <span className="contrast-btn cursor-pointer" style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #333', background: 'linear-gradient(to right, #333 50%, #fff 50%)', display: 'inline-block', cursor: 'pointer' }} title="Contraste"></span>
              <span className="d-none d-md-block">{t.accessibility}</span>
            </div>

            {/* Languages */}
            <div className="col col-lg-2">
              <div className="languages d-flex justify-content-end gap-2">
                <button 
                  onClick={() => toggleLang('en')} 
                  className={`btn btn-sm p-0 ${language === 'en' ? 'opacity-100' : 'opacity-50'}`} 
                  title="English"
                  style={{ border: 'none', background: 'none' }}
                >
                  <img loading="lazy" src="https://flagcdn.com/24x18/us.png" width="24" height="18" alt="en" />
                </button>
                <button 
                  onClick={() => toggleLang('pt')} 
                  className={`btn btn-sm p-0 ${language === 'pt' ? 'opacity-100' : 'opacity-50'}`} 
                  title="Portuguese"
                  style={{ border: 'none', background: 'none' }}
                >
                  <img loading="lazy" src="https://flagcdn.com/24x18/br.png" width="24" height="18" alt="pt" />
                </button>
              </div>
            </div>
            
            {/* Mobile Actions */}
            <div className="col d-lg-none text-end">
              <FaSearch />
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" sticky="top" className="bg-white shadow-sm py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img 
              src="/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png" 
              alt="CP2B Logo" 
              height="55" 
              className="d-inline-block align-top me-3" 
              style={{ borderRadius: 0 }} 
            />
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-1">
              <Nav.Link as={Link} to="/" className="fw-semibold px-2">{t.home}</Nav.Link>
              <Nav.Link as={Link} to="/sobre" className="fw-semibold px-2">{t.about}</Nav.Link>
              <Nav.Link as={Link} to="/oportunidades" className="fw-semibold px-2">{t.opportunities}</Nav.Link>
              <Nav.Link as={Link} to="/noticias" className="fw-semibold px-2">{t.news}</Nav.Link>
              <Nav.Link as={Link} to="/equipe" className="fw-semibold px-2">{t.team}</Nav.Link>
              <Nav.Link as={Link} to="/publicacoes" className="fw-semibold px-2">{t.publications}</Nav.Link>
              <Nav.Link as={Link} to="/projetos" className="fw-semibold px-2">{t.projects}</Nav.Link>
              <Nav.Link as={Link} to="/na-midia" className="fw-semibold px-2">{t.media}</Nav.Link>
              <Nav.Link as={Link} to="/outros" className="fw-semibold px-2">{t.others}</Nav.Link>
              
              <Nav.Link href={socialLinks.linkedin} target="_blank" className="fw-semibold px-2 text-primary d-flex align-items-center gap-1">
                <FaLinkedin /> {t.linkedin}
              </Nav.Link>

              <Form className="d-flex ms-2" onSubmit={(e) => e.preventDefault()}>
                <InputGroup size="sm">
                  <Form.Control
                    type="search"
                    placeholder={t.search}
                    className="border-light bg-light rounded-start-pill"
                    aria-label="Search"
                    style={{ maxWidth: '120px' }}
                  />
                  <Button variant="light" className="border-light rounded-end-pill text-muted">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
