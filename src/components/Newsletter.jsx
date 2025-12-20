import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheck } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Newsletter = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'

  const labels = {
    pt: {
      tag: 'FIQUE ATUALIZADO',
      title: 'Receba Novidades do CP2B',
      subtitle: 'Inscreva-se para receber atualizações sobre pesquisas, eventos e oportunidades.',
      placeholder: 'Seu melhor e-mail',
      button: 'Inscrever-se',
      success: 'Obrigado! Você receberá nossas novidades.',
      error: 'Ocorreu um erro. Tente novamente.',
      privacy: 'Respeitamos sua privacidade. Sem spam.'
    },
    en: {
      tag: 'STAY UPDATED',
      title: 'Receive CP2B News',
      subtitle: 'Subscribe to receive updates about research, events, and opportunities.',
      placeholder: 'Your best email',
      button: 'Subscribe',
      success: 'Thank you! You will receive our news.',
      error: 'An error occurred. Please try again.',
      privacy: 'We respect your privacy. No spam.'
    }
  }[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section
      className="py-5 position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--cp2b-forest) 0%, var(--cp2b-petrol-dark) 100%)'
      }}
    >
      {/* Decorative circles */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '300px',
          height: '300px',
          background: 'rgba(164, 198, 57, 0.1)',
          top: '-150px',
          right: '-100px'
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.05)',
          bottom: '-100px',
          left: '10%'
        }}
      />

      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="mono-label d-inline-block px-3 py-1 rounded-pill mb-3"
                style={{ background: 'rgba(164, 198, 57, 0.2)', color: 'var(--cp2b-lime)' }}
              >
                {labels.tag}
              </span>
              <h2 className="h3 fw-bold text-white mb-2">{labels.title}</h2>
              <p className="text-white-50 mb-4">{labels.subtitle}</p>

              {status === 'success' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="d-flex align-items-center justify-content-center gap-2 py-3"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--cp2b-lime)',
                      color: 'var(--cp2b-petrol-dark)'
                    }}
                  >
                    <FaCheck />
                  </div>
                  <span className="text-white fw-medium">{labels.success}</span>
                </motion.div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <div
                    className="d-flex flex-column flex-sm-row gap-2 mx-auto"
                    style={{ maxWidth: '450px' }}
                  >
                    <Form.Control
                      type="email"
                      placeholder={labels.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-grow-1 py-3 px-4 border-0"
                      style={{
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.95rem'
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={status === 'loading'}
                      className="d-flex align-items-center justify-content-center gap-2 py-3 px-4 border-0"
                      style={{
                        background: 'var(--cp2b-lime)',
                        color: 'var(--cp2b-petrol-dark)',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {status === 'loading' ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <>
                          <FaPaperPlane size={14} />
                          {labels.button}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-white-50 small mt-3 mb-0">{labels.privacy}</p>
                </Form>
              )}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
