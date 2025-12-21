import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaNewspaper, FaUsers, FaFlask } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      title: '404',
      subtitle: 'Página não encontrada',
      description: 'A página que você está procurando pode ter sido movida ou não existe.',
      home: 'Voltar ao Início',
      suggestions: 'Talvez você esteja procurando:',
      links: [
        { to: '/', label: 'Página Inicial', icon: FaHome },
        { to: '/pesquisa', label: 'Eixos de Pesquisa', icon: FaFlask },
        { to: '/equipe', label: 'Nossa Equipe', icon: FaUsers },
        { to: '/noticias', label: 'Notícias', icon: FaNewspaper }
      ]
    },
    en: {
      title: '404',
      subtitle: 'Page not found',
      description: 'The page you are looking for may have been moved or does not exist.',
      home: 'Back to Home',
      suggestions: 'Maybe you are looking for:',
      links: [
        { to: '/', label: 'Home Page', icon: FaHome },
        { to: '/pesquisa', label: 'Research Axes', icon: FaFlask },
        { to: '/equipe', label: 'Our Team', icon: FaUsers },
        { to: '/noticias', label: 'News', icon: FaNewspaper }
      ]
    }
  }[language];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        <Row className="justify-content-center text-center py-5">
          <Col lg={6}>
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="fw-bold mb-0"
                style={{
                  fontSize: '8rem',
                  background: 'var(--gradient-subtle)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}
              >
                {labels.title}
              </h1>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="fw-bold mb-3">{labels.subtitle}</h2>
              <p className="text-muted mb-4">{labels.description}</p>

              <Button
                as={Link}
                to="/"
                variant="primary"
                size="lg"
                className="rounded-pill px-4 mb-5"
              >
                <FaHome className="me-2" />
                {labels.home}
              </Button>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-muted small mb-3">{labels.suggestions}</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {labels.links.map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                  >
                    <link.icon size={14} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default NotFound;
