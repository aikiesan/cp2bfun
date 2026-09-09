import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import NewsletterSignup from '../components/NewsletterSignup';

const Newsletter = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.newsletter?.[language] || pageSeo.newsletter?.pt || { title: 'Newsletter', description: '' };

  const labels = {
    pt: {
      tag: 'NEWSLETTER',
      title: 'Newsletter CP2b',
      description: 'Cadastre-se para receber por e-mail as novidades do CP2b.',
      whatYouGet: 'O que você recebe',
      items: [
        'Chamadas de oportunidades: bolsas, editais e vagas, assim que abrem.',
        'Novas edições do boletim e publicações do centro.',
        'Convites para eventos, meetups e o Fórum Paulista de Biogás.',
      ],
      privacy:
        'Usamos seu e-mail apenas para enviar as comunicações do CP2b. Você pode cancelar a inscrição a qualquer momento pelo link no rodapé de cada mensagem.',
    },
    en: {
      tag: 'NEWSLETTER',
      title: 'CP2b Newsletter',
      description: 'Sign up to receive CP2b news by email.',
      whatYouGet: 'What you get',
      items: [
        'Opportunity calls: scholarships, grants and openings, as soon as they open.',
        'New bulletin issues and publications from the center.',
        'Invitations to events, meetups and the São Paulo Biogas Forum.',
      ],
      privacy:
        'We use your email only to send CP2b communications. You can unsubscribe at any time through the link at the bottom of every message.',
    },
  }[language] || {
    tag: 'NEWSLETTER',
    title: 'Newsletter CP2b',
    description: '',
    whatYouGet: 'O que você recebe',
    items: [],
    privacy: '',
  };

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHero eyebrow={labels.tag} title={labels.title} subtitle={labels.description} />
        <Container className="py-4 py-md-5">
          <Row className="justify-content-center g-4">
            <Col lg={7}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3 p-md-4">
                  {/* Mesmo formulário do rodapé — uma única implementação de
                      cadastro, para não haver dois caminhos divergindo. */}
                  <NewsletterSignup />
                </Card.Body>
              </Card>

              <p className="text-muted small mt-3 mb-0">
                <i className="bi bi-shield-check me-2"></i>
                {labels.privacy}
              </p>
            </Col>

            <Col lg={5}>
              <h2 className="h5 fw-bold mb-3">{labels.whatYouGet}</h2>
              <ul className="list-unstyled d-flex flex-column gap-3">
                {labels.items.map((item) => (
                  <li key={item} className="d-flex gap-3">
                    <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1"></i>
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
};

export default Newsletter;
