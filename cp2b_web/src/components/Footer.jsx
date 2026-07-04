import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSpotify, FaLinkedinIn, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { socialLinks } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tagline: 'Centro Paulista de Estudos em Biogás e Bioprodutos. Pesquisa, inovação e políticas públicas para a transição energética no Estado de São Paulo.',
      explore: 'Explore',
      institutional: 'Institucional',
      contact: 'Contato',
      connect: 'Conecte-se',
      backToTop: 'Voltar ao topo ↑',
      university: 'Universidade Estadual de Campinas',
      links: [
        { to: '/sobre', label: 'Sobre o CP2b' },
        { to: '/eixos', label: 'Eixos de Pesquisa' },
        { to: '/equipe', label: 'Equipe' },
        { to: '/publicacoes', label: 'Publicações' },
        { to: '/noticias', label: 'Notícias' },
        { to: '/eventos', label: 'Eventos' },
        { to: '/galeria', label: 'Galeria' },
        { to: '/contato', label: 'Contato' },
      ],
      institutionalLinks: [
        { to: '/sobre/governanca', label: 'Governança' },
        { to: '/sobre/transparencia', label: 'Transparência' },
        { to: '/sobre/parceiros', label: 'Parceiros' },
        { to: '/oportunidades', label: 'Oportunidades' },
        { to: '/press-kit', label: 'Press Kit' },
        { to: '/forum-paulista', label: 'Fórum Paulista' },
      ],
    },
    en: {
      tagline: 'São Paulo Center for Biogas and Bioproducts Studies. Research, innovation and public policy for the energy transition in the State of São Paulo.',
      explore: 'Explore',
      institutional: 'Institutional',
      contact: 'Contact',
      connect: 'Connect with us',
      backToTop: 'Back to top ↑',
      university: 'University of Campinas',
      links: [
        { to: '/sobre', label: 'About CP2b' },
        { to: '/eixos', label: 'Research Axes' },
        { to: '/equipe', label: 'Team' },
        { to: '/publicacoes', label: 'Publications' },
        { to: '/noticias', label: 'News' },
        { to: '/eventos', label: 'Events' },
        { to: '/galeria', label: 'Gallery' },
        { to: '/contato', label: 'Contact' },
      ],
      institutionalLinks: [
        { to: '/sobre/governanca', label: 'Governance' },
        { to: '/sobre/transparencia', label: 'Transparency' },
        { to: '/sobre/parceiros', label: 'Partners' },
        { to: '/oportunidades', label: 'Opportunities' },
        { to: '/press-kit', label: 'Press Kit' },
        { to: '/forum-paulista', label: 'Fórum Paulista' },
      ],
    },
  }[language];

  const socials = [
    { href: socialLinks.linkedin, icon: <FaLinkedinIn />, label: 'LinkedIn' },
    { href: socialLinks.instagram, icon: <FaInstagram />, label: 'Instagram' },
    { href: socialLinks.youtube, icon: <FaYoutube />, label: 'YouTube' },
    { href: socialLinks.spotify, icon: <FaSpotify />, label: 'Spotify' },
    { href: socialLinks.whatsapp, icon: <FaWhatsapp />, label: 'WhatsApp' },
  ].filter((s) => s.href && s.href !== '#');

  return (
    <footer className="site-footer pt-5 mt-5">
      <Container>
        <Row className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <Col md={12}>
            <NewsletterSignup />
          </Col>
        </Row>

        <Row className="gy-4 pb-5">
          <Col lg={4} md={6}>
            <img
              src="/assets/CP2B-LOGO-NEGATIVO-BR@8x.png"
              alt="CP2b - Centro Paulista de Estudos em Biogás e Bioprodutos"
              style={{ maxHeight: '64px', borderRadius: 0 }}
              className="mb-3"
            />
            <p className="small" style={{ maxWidth: '22rem', color: 'rgba(255,255,255,0.7)' }}>
              {labels.tagline}
            </p>
            <div className="d-flex align-items-center gap-3 mt-3">
              <div style={{ background: '#fff', borderRadius: '6px', padding: '4px 10px' }}>
                <img src="/assets/logo_Unicamp.png" alt="Unicamp" style={{ maxHeight: '34px', display: 'block' }} />
              </div>
              <div style={{ background: '#fff', borderRadius: '6px', padding: '4px 10px' }}>
                <img src="/assets/fapesp_1-e1724070166377-500x200.jpg" alt="FAPESP" style={{ maxHeight: '34px', display: 'block' }} />
              </div>
            </div>
          </Col>

          <Col lg={2} md={6} sm={6}>
            <h6>{labels.explore}</h6>
            <ul className="footer-links">
              {labels.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={2} md={6} sm={6}>
            <h6>{labels.institutional}</h6>
            <ul className="footer-links">
              {labels.institutionalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h6>{labels.contact}</h6>
            <address className="small mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.7)', fontStyle: 'normal', lineHeight: 1.8 }}>
              NIPE — {labels.university}<br />
              Rua Cora Coralina, 330<br />
              Campinas - SP, Brasil, CEP 13083-896<br />
              <a href="tel:+551935211244" style={{ color: 'rgba(255,255,255,0.85)' }}>+55 (19) 3521-1244</a><br />
              <a href="mailto:nipe@nipe.unicamp.br" style={{ color: 'rgba(255,255,255,0.85)' }}>nipe@nipe.unicamp.br</a>
            </address>

            <h6>{labels.connect}</h6>
            <div className="footer-social d-flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="footer-bottom py-4">
          <Col md={8}>
            <small style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}>
              &copy; 1969 - {new Date().getFullYear()} {labels.university} · CP2b<br />
              <strong>Expediente:</strong> Jornalista responsável Sofia Silva MTb 0077363/SP ·
              Estagiário Antônio Bufalo · Estagiária Bárbara Castilho
            </small>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn btn-link p-0 small fw-bold text-decoration-none"
              style={{ color: 'var(--cp2b-lime-500)' }}
            >
              {labels.backToTop}
            </button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
