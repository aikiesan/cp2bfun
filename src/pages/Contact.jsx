import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      tag: 'FALE CONOSCO',
      title: 'Entre em Contato',
      subtitle: 'Estamos prontos para ajudar. Entre em contato conosco para colaborações, dúvidas ou informações sobre o CP2B.',
      address: 'Endereço',
      direct: 'Contatos Diretos',
      general: 'Geral',
      financial: 'Administrativo',
      phone: 'Telefone',
      sendMsg: 'Envie uma mensagem',
      formName: 'Nome',
      formEmail: 'E-mail',
      formMsg: 'Mensagem',
      formBtn: 'Enviar Mensagem'
    },
    en: {
      tag: 'GET IN TOUCH',
      title: 'Contact Us',
      subtitle: 'We\'re ready to help. Contact us for collaborations, questions, or information about CP2B.',
      address: 'Address',
      direct: 'Direct Contacts',
      general: 'General',
      financial: 'Administrative',
      phone: 'Phone',
      sendMsg: 'Send a message',
      formName: 'Name',
      formEmail: 'E-mail',
      formMsg: 'Message',
      formBtn: 'Send Message'
    }
  }[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        {/* Page Header */}
        <Row className="mb-5 page-header">
          <Col lg={7}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <span className="mono-label text-green">{labels.tag}</span>
              <h1 className="display-5 fw-bold mb-4">{labels.title}</h1>
              <p className="lead">{labels.subtitle}</p>
            </motion.div>
          </Col>
        </Row>

        <Row className="g-5">
          {/* Contact Information */}
          <Col lg={5}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              {/* Address Card */}
              <Card className="border-0 mb-4" style={{ borderLeft: '3px solid var(--cp2b-petrol)' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--cp2b-petrol-tint)',
                        color: 'var(--cp2b-petrol)',
                        flexShrink: 0
                      }}
                    >
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1rem' }}>{labels.address}</h5>
                      <p className="text-muted mb-0" style={{ lineHeight: '1.7', fontSize: '0.9rem' }}>
                        Rua Cora Coralina, 330<br />
                        NIPE - UNICAMP<br />
                        Campinas - SP, Brasil<br />
                        CEP: 13083-896
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Contacts Card */}
              <Card className="border-0 mb-4" style={{ borderLeft: '3px solid var(--cp2b-green)' }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4" style={{ fontSize: '1rem' }}>{labels.direct}</h5>

                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        background: 'var(--cp2b-green-tint)',
                        color: 'var(--cp2b-green)',
                        flexShrink: 0
                      }}
                    >
                      <FaEnvelope size={14} />
                    </div>
                    <div>
                      <span className="mono-label text-muted d-block" style={{ fontSize: '0.65rem' }}>{labels.general}</span>
                      <a
                        href="mailto:nipe@nipe.unicamp.br"
                        className="text-decoration-none"
                        style={{ color: 'var(--cp2b-dark)', fontSize: '0.9rem' }}
                      >
                        nipe@nipe.unicamp.br
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        background: 'var(--cp2b-petrol-tint)',
                        color: 'var(--cp2b-petrol)',
                        flexShrink: 0
                      }}
                    >
                      <FaEnvelope size={14} />
                    </div>
                    <div>
                      <span className="mono-label text-muted d-block" style={{ fontSize: '0.65rem' }}>{labels.financial}</span>
                      <a
                        href="mailto:administrativo@cp2b.unicamp.br"
                        className="text-decoration-none"
                        style={{ color: 'var(--cp2b-dark)', fontSize: '0.9rem' }}
                      >
                        administrativo@cp2b.unicamp.br
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        background: 'var(--cp2b-orange-tint)',
                        color: 'var(--cp2b-orange)',
                        flexShrink: 0
                      }}
                    >
                      <FaPhone size={14} />
                    </div>
                    <div>
                      <span className="mono-label text-muted d-block" style={{ fontSize: '0.65rem' }}>{labels.phone}</span>
                      <a
                        href="tel:+551935211244"
                        className="text-decoration-none"
                        style={{ color: 'var(--cp2b-dark)', fontSize: '0.9rem' }}
                      >
                        +55 (19) 3521-1244
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Location Image */}
              <div
                className="overflow-hidden"
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                <img
                  src="/assets/nipe_unicamp_2024-07-08_22-20-16_jpg_2024-07-08_22-20-16.webp"
                  alt="NIPE Unicamp"
                  className="w-100"
                  style={{ borderRadius: 0, maxHeight: '200px', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          </Col>

          {/* Contact Form */}
          <Col lg={7}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 h-100" style={{ borderRadius: 'var(--radius-xl)' }}>
                <Card.Body className="p-4 p-lg-5">
                  <h4 className="fw-bold mb-4">{labels.sendMsg}</h4>
                  <Form onSubmit={(e) => e.preventDefault()}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-medium small">{labels.formName}</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={language === 'pt' ? 'Seu nome' : 'Your name'}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-medium small">{labels.formEmail}</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder={language === 'pt' ? 'seu@email.com' : 'your@email.com'}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-medium small">{labels.formMsg}</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={6}
                            placeholder={language === 'pt' ? 'Como podemos ajudar?' : 'How can we help?'}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100 py-3 mt-2 rounded-pill"
                        >
                          {labels.formBtn}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Contact;
