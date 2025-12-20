import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { socialLinks } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      nipe: 'Núcleo Interdisciplinar de Planejamento Energético',
      connect: 'Conecte-se',
      quickLinks: 'Links Rápidos',
      partners: 'Parceiros',
      backToTop: 'Voltar ao topo',
      university: 'Universidade Estadual de Campinas',
      rights: 'Todos os direitos reservados',
      about: 'Sobre',
      team: 'Equipe',
      research: 'Pesquisa',
      news: 'Novidades',
      contact: 'Contato'
    },
    en: {
      nipe: 'Interdisciplinary Center for Energy Planning',
      connect: 'Connect with us',
      quickLinks: 'Quick Links',
      partners: 'Partners',
      backToTop: 'Back to top',
      university: 'University of Campinas',
      rights: 'All rights reserved',
      about: 'About',
      team: 'Team',
      research: 'Research',
      news: 'News',
      contact: 'Contact'
    }
  }[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <Container>
        {/* Main Footer Content */}
        <Row className="gy-5 mb-5">
          {/* Brand & Contact Column */}
          <Col lg={4} md={6}>
            <div className="mb-4">
              <img
                src="/assets/CP2B-LOGO-NEGATIVO-BR@8x.png"
                alt="CP2B Logo"
                className="footer-logo mb-4"
                style={{ maxHeight: '55px' }}
              />
            </div>
            <p className="mb-3" style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>
              {labels.nipe}
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
              <p className="mb-1">Rua Cora Coralina, 330</p>
              <p className="mb-1">UNICAMP - Campinas, SP</p>
              <p className="mb-3">CEP: 13083-896</p>
              <p className="mb-1">
                <a href="tel:+551935211244" className="text-decoration-none">
                  +55 (19) 3521-1244
                </a>
              </p>
              <p className="mb-0">
                <a href="mailto:nipe@nipe.unicamp.br" className="text-decoration-none">
                  nipe@nipe.unicamp.br
                </a>
              </p>
            </div>
          </Col>

          {/* Quick Links Column */}
          <Col lg={2} md={6}>
            <h6>{labels.quickLinks}</h6>
            <ul className="list-unstyled" style={{ fontSize: '0.9rem' }}>
              <li className="mb-2">
                <Link to="/sobre" className="text-decoration-none">{labels.about}</Link>
              </li>
              <li className="mb-2">
                <Link to="/equipe" className="text-decoration-none">{labels.team}</Link>
              </li>
              <li className="mb-2">
                <Link to="/pesquisa" className="text-decoration-none">{labels.research}</Link>
              </li>
              <li className="mb-2">
                <Link to="/noticias" className="text-decoration-none">{labels.news}</Link>
              </li>
              <li className="mb-2">
                <Link to="/contato" className="text-decoration-none">{labels.contact}</Link>
              </li>
            </ul>
          </Col>

          {/* Partners Column */}
          <Col lg={3} md={6}>
            <h6>{labels.partners}</h6>
            <ul className="list-unstyled" style={{ fontSize: '0.9rem' }}>
              <li className="mb-2">FAPESP</li>
              <li className="mb-2">Copercana</li>
              <li className="mb-2">Comgás</li>
              <li className="mb-2">SABESP</li>
              <li className="mb-2">EMBRAPII</li>
            </ul>
          </Col>

          {/* Social & University Column */}
          <Col lg={3} md={6}>
            <h6>{labels.connect}</h6>
            <div className="footer-social mb-4">
              {socialLinks.instagram && socialLinks.instagram !== '#' && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
              )}
              {socialLinks.linkedin && socialLinks.linkedin !== '#' && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              )}
              {socialLinks.facebook && socialLinks.facebook !== '#' && (
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <FaFacebookF />
                </a>
              )}
              {socialLinks.youtube && socialLinks.youtube !== '#' && (
                <a href={socialLinks.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                  <FaYoutube />
                </a>
              )}
              <a href="mailto:nipe@nipe.unicamp.br" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>

            <div className="mt-4">
              <img
                src="/assets/logo_Unicamp.png"
                alt="Unicamp Logo"
                style={{ maxHeight: '40px', filter: 'brightness(0) invert(1)', borderRadius: 0, opacity: 0.8 }}
              />
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="small mb-2 mb-md-0" style={{ fontFamily: 'var(--font-mono)', opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} CP2B - {labels.university}. {labels.rights}.
          </p>
          <button
            onClick={scrollToTop}
            className="btn btn-link text-white text-decoration-none small fw-semibold p-0"
            style={{ opacity: 0.8 }}
          >
            {labels.backToTop} &uarr;
          </button>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
