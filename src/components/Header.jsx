import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const [lang, setLang] = useState('pt');

  const toggleLang = (l) => setLang(l);

  return (
    <header>
      {/* Top Header - Recod.ai Style */}
      <div id="top-header" className="py-2" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', fontSize: '0.85rem' }}>
        <Container>
          <div className="row align-items-center">
            {/* Desktop Shortcuts (Empty as per ref, but keeping space) */}
            <div className="col d-none d-lg-flex">
              <div className="desktop-shortcuts">
                  {/* Future shortcuts can go here */}
              </div>
            </div>

            {/* Accessibility */}
            <div className="col col-lg-3 accessibility d-flex align-items-center justify-content-end gap-3 text-muted">
              <span className="cursor-pointer fw-bold" title="Aumentar tamanho da letra" style={{ cursor: 'pointer' }}>A+</span>
              <span className="cursor-pointer fw-bold" title="Diminuir tamanho da letra" style={{ cursor: 'pointer' }}>A-</span>
              <span className="contrast-btn cursor-pointer" style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #333', background: 'linear-gradient(to right, #333 50%, #fff 50%)', display: 'inline-block', cursor: 'pointer' }} title="Contraste"></span>
              <span className="d-none d-md-block">Acessibilidade</span>
            </div>

            {/* Languages */}
            <div className="col col-lg-2">
              <div className="languages d-flex justify-content-end gap-2">
                <button 
                  onClick={() => toggleLang('en')} 
                  className={`btn btn-sm p-0 ${lang === 'en' ? 'opacity-100' : 'opacity-50'}`} 
                  title="English"
                  style={{ border: 'none', background: 'none' }}
                >
                  <img loading="lazy" src="https://flagcdn.com/24x18/us.png" width="24" height="18" alt="en" />
                </button>
                <button 
                  onClick={() => toggleLang('pt')} 
                  className={`btn btn-sm p-0 ${lang === 'pt' ? 'opacity-100' : 'opacity-50'}`} 
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
      <Navbar expand="lg" sticky="top" className="bg-white">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img 
              src="/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png" 
              alt="CP2B Logo" 
              height="60" 
              className="d-inline-block align-top me-3" 
              style={{ borderRadius: 0 }} 
            />
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-2">
              <Nav.Link as={Link} to="/">Início</Nav.Link>
              <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
              <Nav.Link as={Link} to="/pesquisa">Eixos</Nav.Link> {/* Renamed */}
              <Nav.Link as={Link} to="/equipe">Equipe</Nav.Link>
              <Nav.Link as={Link} to="/noticias">Notícias</Nav.Link>
              <Nav.Link as={Link} to="/contato">Contato</Nav.Link>
              
              <Form className="d-flex ms-3" onSubmit={(e) => e.preventDefault()}>
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder="Buscar"
                    className="border-light bg-light rounded-start-pill"
                    aria-label="Search"
                    style={{ maxWidth: '150px' }}
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
