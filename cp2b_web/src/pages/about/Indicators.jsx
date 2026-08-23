import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { pageSeo } from '../../data/content';
import {
  kpiDimensions,
  kpiVision2035,
  kpiPrinciples,
  kpiFrameworkTotalWeight,
  kpiIndicatorCount,
} from '../../data/generated/kpiFramework';
import SeoHead from '../../components/SeoHead';
import PageHero from '../../components/PageHero';

const labels = {
  pt: {
    eyebrow: 'Sobre o CP2b',
    tag: 'Governança e Monitoramento',
    subtitle: (count) =>
      `O CP2b acompanha seu desempenho por meio de um sistema de 7 dimensões e ${count} indicadores, com pesos que orientam a priorização estratégica do centro.`,
    dimensions: 'Dimensões e Pesos Estratégicos',
    dimensionsLead: 'Distribuição proporcional do peso de cada dimensão no sistema de acompanhamento do CP2b.',
    vision: 'Visão de Longo Prazo (2035)',
    principles: 'Princípios Norteadores',
    weight: 'Peso',
    total: 'Total',
    indicatorsLabel: 'indicadores',
    points: 'pts',
    weightNote:
      'Os números abaixo são pesos de priorização, não resultados apurados: distribuem 100 pontos entre as dimensões e seus indicadores para indicar a importância relativa de cada um no acompanhamento do centro.',
    pointsTitle: (n, name) => `${name}: peso ${n} de 100 pontos do sistema de acompanhamento`,
  },
  en: {
    eyebrow: 'About CP2b',
    tag: 'Governance and Monitoring',
    subtitle: (count) =>
      `CP2b tracks its performance through a system of 7 dimensions and ${count} indicators, with weights that guide the center's strategic prioritization.`,
    dimensions: 'Strategic Dimensions and Weights',
    dimensionsLead: 'Proportional weight distribution of each dimension across the CP2b monitoring framework.',
    vision: 'Long-Term Vision (2035)',
    principles: 'Guiding Principles',
    weight: 'Weight',
    total: 'Total',
    indicatorsLabel: 'indicators',
    points: 'pts',
    weightNote:
      'The numbers below are prioritization weights, not measured results: they distribute 100 points across the dimensions and their indicators to show the relative importance of each within the monitoring framework.',
    pointsTitle: (n, name) => `${name}: weight ${n} of the framework's 100 points`,
  },
};

const Indicators = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.indicators[language] || pageSeo.indicators.pt;
  const t = labels[language] || labels.pt;

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <PageHero
        eyebrow={t.eyebrow}
        title={seo.title}
        subtitle={t.subtitle(kpiIndicatorCount)}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Container className="py-5">
          {/* Vision and Principles Section */}
          <Row className="mb-5 g-4">
            <Col lg={7}>
              <Card className="h-100 p-4 border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg, 16px)' }}>
                <span className="mono-label text-success mb-2">{t.tag}</span>
                <h3 className="fw-bold mb-3">{t.vision}</h3>
                <ul className="text-muted mb-0 ps-3">
                  {kpiVision2035[language].map((item) => (
                    <li key={item} className="mb-2" style={{ lineHeight: 1.5 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
            <Col lg={5}>
              <Card className="h-100 p-4 border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg, 16px)' }}>
                <h3 className="fw-bold mb-3">{t.principles}</h3>
                <div className="d-flex flex-wrap gap-2">
                  {kpiPrinciples[language].map((p) => (
                    <span
                      key={p}
                      className="badge px-3 py-2 fw-semibold"
                      style={{
                        background: 'var(--gray-100)',
                        color: 'var(--cp2b-azul-petroleo)',
                        fontSize: '0.85rem',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius-md, 8px)',
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          {/* 100% Stacked Proportional Bar */}
          <section className="mb-5 p-4 bg-white border-0 shadow-sm" style={{ borderRadius: 'var(--radius-lg, 16px)' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-baseline mb-3 gap-2">
              <div>
                <h3 className="fw-bold mb-1 fs-4">{t.dimensions}</h3>
                <p className="text-muted small mb-1">{t.dimensionsLead}</p>
                <p className="text-muted small mb-0" style={{ maxWidth: '46rem' }}>
                  {t.weightNote}
                </p>
              </div>
              <span className="mono-label fw-bold" style={{ color: 'var(--brand-primary)' }}>
                {t.total}: {kpiFrameworkTotalWeight} {t.points} ({kpiIndicatorCount} {t.indicatorsLabel})
              </span>
            </div>

            {/* Stacked Progress Bar (5-second visual read) */}
            <div
              className="d-flex w-100 mb-3"
              style={{
                height: 24,
                borderRadius: 'var(--radius-full, 9999px)',
                overflow: 'hidden',
                background: 'var(--gray-200)',
              }}
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t.dimensions}
            >
              {kpiDimensions.map((dim) => {
                const dimLabel = dim[language] || dim.pt;
                const widthPercent = (dim.weight / kpiFrameworkTotalWeight) * 100;
                return (
                  <div
                    key={dim.id}
                    style={{
                      width: `${widthPercent}%`,
                      height: '100%',
                      backgroundColor: dim.color,
                      transition: 'width 0.3s ease',
                    }}
                    title={t.pointsTitle(dim.weight, dimLabel.title)}
                  />
                );
              })}
            </div>

            {/* Legend Chips */}
            <div className="d-flex flex-wrap gap-2 pt-1">
              {kpiDimensions.map((dim) => {
                const dimLabel = dim[language] || dim.pt;
                return (
                  <div
                    key={dim.id}
                    className="d-inline-flex align-items-center gap-2 px-2 py-1 rounded small"
                    style={{ background: 'var(--gray-50)', fontSize: '0.8rem' }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: dim.color,
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span className="fw-semibold text-truncate" style={{ maxWidth: 220 }}>
                      {dimLabel.title}
                    </span>
                    <span className="mono-label fw-bold ms-auto" style={{ color: dim.color }}>
                      {dim.weight} {t.points}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Responsive 7-Card Grid (All indicators listed, no accordion) */}
          <section>
            <Row className="g-4">
              {kpiDimensions.map((dim) => {
                const dimLabel = dim[language] || dim.pt;
                return (
                  <Col key={dim.id} lg={6}>
                    <Card
                      className="h-100 border-0 shadow-sm"
                      style={{
                        borderRadius: 'var(--radius-lg, 16px)',
                        borderTop: `4px solid ${dim.color}`,
                        background: 'var(--bg-surface, #ffffff)',
                      }}
                    >
                      <Card.Body className="p-4 d-flex flex-column">
                        {/* Dimension Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3 pb-2 border-bottom">
                          <div>
                            <span className="mono-label text-muted small d-block mb-1">
                              {dim.indicators.length} {t.indicatorsLabel}
                            </span>
                            <h4 className="fw-bold mb-0 fs-5" style={{ color: 'var(--text-primary)' }}>
                              {dimLabel.title}
                            </h4>
                          </div>
                          <div className="text-end">
                            <span
                              className="badge px-3 py-2 fw-bold"
                              style={{
                                backgroundColor: `${dim.color}15`,
                                color: dim.color,
                                border: `1px solid ${dim.color}40`,
                                fontSize: '0.9rem',
                                fontFamily: 'var(--font-mono, monospace)',
                              }}
                            >
                              {t.weight} {dim.weight} {t.points}
                            </span>
                          </div>
                        </div>

                        {/* Relative Weight Bar inside Dimension */}
                        <div
                          className="mb-4"
                          style={{
                            height: 6,
                            borderRadius: 3,
                            background: 'var(--gray-200)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${(dim.weight / kpiFrameworkTotalWeight) * 100}%`,
                              height: '100%',
                              background: dim.color,
                            }}
                          />
                        </div>

                        {/* Itemized Indicators List */}
                        <div className="d-flex flex-column gap-3 flex-grow-1">
                          {dim.indicators.map((ind) => {
                            const indLabel = ind[language] || ind.pt;
                            return (
                              <div
                                key={ind.code}
                                className="p-2 rounded"
                                style={{
                                  background: 'var(--gray-50)',
                                  borderLeft: `3px solid ${dim.color}`,
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                  <div>
                                    <span
                                      className="mono-label fw-bold me-2"
                                      style={{ color: dim.color, fontSize: '0.8rem' }}
                                    >
                                      {ind.code}
                                    </span>
                                    <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
                                      {indLabel.name}
                                    </span>
                                  </div>
                                  {/* Points, not "%": a bare "2%" next to
                                      "Geração de ativos de conhecimento" reads as
                                      "only 2% of our work generates knowledge".
                                      These are weights in a 100-point framework. */}
                                  <span
                                    className="mono-label fw-bold flex-shrink-0"
                                    style={{ color: dim.color, fontSize: '0.82rem' }}
                                    title={t.pointsTitle(ind.weight, indLabel.name)}
                                  >
                                    {ind.weight} {t.points}
                                  </span>
                                </div>
                                <div className="text-muted small ps-1" style={{ fontSize: '0.78rem', lineHeight: 1.35 }}>
                                  {indLabel.measures}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </section>
        </Container>
      </motion.div>
    </>
  );
};

export default Indicators;
