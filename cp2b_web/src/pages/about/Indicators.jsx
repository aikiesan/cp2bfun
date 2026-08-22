import { useState } from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { pageSeo } from '../../data/content';
import { kpiDimensions, kpiVision2035, kpiPrinciples, kpiFrameworkTotalWeight, kpiIndicatorCount } from '../../data/generated/kpiFramework';
import SeoHead from '../../components/SeoHead';

const labels = {
  pt: {
    tag: 'Governança e Monitoramento',
    subtitle: (count) => `O CP2b acompanha seu desempenho por meio de um sistema de 7 dimensões e ${count} indicadores, com pesos que orientam a priorização estratégica do centro.`,
    dimensions: 'Dimensões e Pesos',
    vision: 'Visão de Longo Prazo (2035)',
    principles: 'Princípios',
    weight: 'Peso',
    total: 'Total',
  },
  en: {
    tag: 'Governance and Monitoring',
    subtitle: (count) => `CP2b tracks its performance through a system of 7 dimensions and ${count} indicators, with weights that guide the center's strategic prioritization.`,
    dimensions: 'Dimensions and Weights',
    vision: 'Long-Term Vision (2035)',
    principles: 'Principles',
    weight: 'Weight',
    total: 'Total',
  },
};

const Indicators = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.indicators[language] || pageSeo.indicators.pt;
  const t = labels[language] || labels.pt;
  const [openDimension, setOpenDimension] = useState(null);

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Container className="py-5">
          <Row className="mb-5">
            <Col lg={8}>
              <span className="mono-label text-success">{t.tag}</span>
              <h1 className="display-4 fw-bold mb-4">{seo.title}</h1>
              <p className="lead text-muted">{t.subtitle(kpiIndicatorCount)}</p>
            </Col>
          </Row>

          <Row className="mb-5 g-4">
            <Col md={7}>
              <h3 className="fw-bold mb-3">{t.vision}</h3>
              <ul className="text-muted">
                {kpiVision2035[language].map((item) => (
                  <li key={item} className="mb-2">{item}</li>
                ))}
              </ul>
            </Col>
            <Col md={5}>
              <h3 className="fw-bold mb-3">{t.principles}</h3>
              <div className="d-flex flex-wrap gap-2">
                {kpiPrinciples[language].map((p) => (
                  <span key={p} className="badge bg-light text-dark border px-3 py-2">{p}</span>
                ))}
              </div>
            </Col>
          </Row>

          <div className="border-top border-dark pt-5">
            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <h3 className="fw-bold mb-0">{t.dimensions}</h3>
              <span className="mono-label text-muted">{t.total}: {kpiFrameworkTotalWeight}%</span>
            </div>

            <Accordion flush activeKey={openDimension} onSelect={(key) => setOpenDimension(key)}>
              {kpiDimensions.map((dim) => {
                const dimLabel = dim[language] || dim.pt;
                return (
                  <Accordion.Item eventKey={dim.id} key={dim.id} className="border-bottom border-dark bg-transparent">
                    <Accordion.Header>
                      <div className="d-flex align-items-center justify-content-between w-100 py-2 pe-3">
                        <span className="fw-bold fs-5">{dimLabel.title}</span>
                        <span
                          className="mono-label fw-bold ms-3"
                          style={{ color: dim.color, whiteSpace: 'nowrap' }}
                        >
                          {t.weight} {dim.weight}%
                        </span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="pb-4 pt-0">
                      <div className="mb-3" style={{ height: 6, borderRadius: 3, background: 'var(--gray-200)', overflow: 'hidden' }}>
                        <div style={{ width: `${(dim.weight / kpiFrameworkTotalWeight) * 100}%`, height: '100%', background: dim.color }} />
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {dim.indicators.map((ind) => {
                          const indLabel = ind[language] || ind.pt;
                          return (
                            <div key={ind.code} className="d-flex justify-content-between align-items-start gap-3 py-2 border-bottom">
                              <div>
                                <span className="mono-label text-muted me-2">{ind.code}</span>
                                <span className="fw-semibold">{indLabel.name}</span>
                                <div className="text-muted small">{indLabel.measures}</div>
                              </div>
                              <span className="mono-label flex-shrink-0" style={{ color: dim.color }}>{ind.weight}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </div>
        </Container>
      </motion.div>
    </>
  );
};

export default Indicators;
