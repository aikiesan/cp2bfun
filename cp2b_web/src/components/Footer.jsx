import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { socialLinks } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      nipe: 'Núcleo Interdisciplinar de Planejamento Energético',
      connect: 'Conecte-se',
      partners: 'Parceiros',
      backToTop: 'VOLTAR AO TOPO ↑',
      university: 'Universidade Estadual de Campinas'
    },
    en: {
      nipe: 'Interdisciplinary Center for Energy Planning',
      connect: 'Connect with us',
      partners: 'Partners',
      backToTop: 'BACK TO TOP ↑',
      university: 'University of Campinas'
    }
  }[language];

  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="mb-3 text-uppercase fw-bold text-success">NIPE</h5>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#ccc' }}>
              <p className="mb-1">{labels.nipe}</p>
              <p className="mb-1">Rua Cora Coralina, 330</p>
              <p className="mb-1">{labels.university} - UNICAMP</p>
              <p className="mb-3">Campinas - São Paulo, Brasil CEP: 13083-896</p>
              
              <p className="mb-1">+55 (19) 3521-1244</p>
              <p>nipe@nipe.unicamp.br</p>
            </div>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3 text-uppercase fw-bold">{labels.connect}</h5>
            <div className="d-flex gap-3 mb-4">
              <a href={socialLinks.facebook} className="text-white fs-5" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href={socialLinks.linkedin} className="text-white fs-5" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
              <a href={socialLinks.instagram} className="text-white fs-5" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href={socialLinks.youtube} className="text-white fs-5" target="_blank" rel="noreferrer"><FaYoutube /></a>
              <a href={socialLinks.whatsapp} className="text-white fs-5" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
            </div>
            
            <h5 className="mb-3 text-uppercase fw-bold">{labels.partners}</h5>
            <div className="d-flex flex-wrap gap-3" style={{ opacity: 0.7 }}>
               <span>FAPESP</span> | <span>Copercana</span> | <span>Comgás</span> | <span>SESAMM</span>
            </div>
          </Col>

          <Col md={4} className="text-md-end">
             <div className="mb-4 d-flex flex-column align-items-md-end gap-3">
                <img src="/assets/CP2B-LOGO-NEGATIVO-BR@8x.png" alt="CP2B Logo" style={{ maxHeight: '70px', borderRadius: 0 }} />
                <img src="/assets/logo_Unicamp.png" alt="Unicamp Logo" style={{ maxHeight: '45px', filter: 'brightness(0) invert(1)', borderRadius: 0 }} />
             </div>
             <p className="small text-white-50" style={{ fontFamily: 'var(--font-mono)' }}>
               &copy; 1969 - {new Date().getFullYear()}<br/>{labels.university}
             </p>
             <button
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="btn btn-link text-white text-decoration-none small fw-bold opacity-75 p-0"
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
