import React from 'react';
import { Container, Accordion, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { researchAxes, sdgMap, menuLabels } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const Research = () => {
  const { language } = useLanguage();
  const axes = researchAxes[language];
  const t = menuLabels[language];

  const labels = {
    pt: {
      tag: 'Estrutura de Pesquisa',
      subtitle: 'A atuação do CP2B está organizada em oito eixos temáticos integrados, cobrindo desde o inventário de resíduos até políticas públicas.',
      details: 'Conheça os Eixos',
      axis: 'EIXO',
      coordinator: 'Coordenação',
      sdgs: 'ODS Relacionados'
    },
    en: {
      tag: 'Research Structure',
      subtitle: 'CP2B\'s activities are organized into eight integrated thematic axes, covering from waste inventory to public policies.',
      details: 'Discover the Axes',
      axis: 'AXIS',
      coordinator: 'Coordination',
      sdgs: 'Related SDGs'
    }
  }[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Colors for each axis
  const axisColors = [
    'var(--cp2b-petrol)',
    'var(--cp2b-forest)',
    'var(--cp2b-green)',
    'var(--cp2b-petrol)',
    'var(--cp2b-orange)',
    'var(--cp2b-forest)',
    'var(--cp2b-lime)',
    'var(--cp2b-petrol)'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        {/* Page Header */}
        <Row className="mb-5 page-header">
          <Col lg={8}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <span className="mono-label text-green">{t.axes}</span>
              <h1 className="display-5 fw-bold mb-4">{labels.tag}</h1>
              <p className="lead">{labels.subtitle}</p>
            </motion.div>
          </Col>
        </Row>

        {/* Axes Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex align-items-center gap-3 mb-4">
            <span
              className="d-inline-block"
              style={{ width: '40px', height: '3px', background: 'var(--cp2b-petrol)', borderRadius: '2px' }}
            />
            <h3 className="fw-bold mb-0">{labels.details}</h3>
          </div>

          <Accordion flush>
            {axes.map((axis, index) => (
              <Accordion.Item
                eventKey={axis.id}
                key={axis.id}
                className="mb-3"
                style={{
                  borderLeft: `3px solid ${axisColors[index] || 'var(--cp2b-petrol)'}`
                }}
              >
                <Accordion.Header>
                  <div className="py-2">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          background: axisColors[index] || 'var(--cp2b-petrol)',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      >
                        {labels.axis} {axis.id}
                      </span>
                    </div>
                    <span className="fw-bold" style={{ fontSize: '1.1rem' }}>
                      {axis.title.split('–')[1]?.trim() || axis.title}
                    </span>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="pb-4 pt-0">
                  {/* Coordinator */}
                  <div className="mb-4 pb-3 border-bottom">
                    <span className="mono-label text-muted d-block mb-1">{labels.coordinator}</span>
                    <p
                      className="mb-0 fw-medium"
                      style={{ color: axisColors[index] || 'var(--cp2b-petrol)', fontSize: '0.9rem' }}
                    >
                      {axis.coordinator}
                    </p>
                  </div>

                  {/* Content */}
                  <p className="text-muted mb-4" style={{ whiteSpace: 'pre-line', lineHeight: '1.75' }}>
                    {axis.content}
                  </p>

                  {/* SDG Images */}
                  {axis.sdgs && axis.sdgs.length > 0 && (
                    <div className="pt-3 border-top">
                      <span className="mono-label text-muted d-block mb-3">{labels.sdgs}</span>
                      <div className="d-flex flex-wrap gap-2">
                        {axis.sdgs.map((sdgId) => (
                          <img
                            key={sdgId}
                            src={sdgMap[sdgId]}
                            alt={`ODS ${sdgId}`}
                            title={`Sustainable Development Goal ${sdgId}`}
                            style={{
                              width: '55px',
                              height: '55px',
                              borderRadius: 'var(--radius-sm)',
                              transition: 'transform 0.2s ease'
                            }}
                            className="hover-lift"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Research;
