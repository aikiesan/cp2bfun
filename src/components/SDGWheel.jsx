import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { sdgMap, researchAxes } from '../data/content';

const SDGWheel = () => {
  const { language } = useLanguage();
  const [selectedSDG, setSelectedSDG] = useState(null);

  const labels = {
    pt: {
      tag: 'IMPACTO SUSTENTÁVEL',
      title: 'Objetivos de Desenvolvimento Sustentável',
      subtitle: 'Clique em um ODS para ver os eixos de pesquisa relacionados',
      relatedAxes: 'Eixos Relacionados',
      noAxes: 'Nenhum eixo diretamente relacionado'
    },
    en: {
      tag: 'SUSTAINABLE IMPACT',
      title: 'Sustainable Development Goals',
      subtitle: 'Click on an SDG to see related research axes',
      relatedAxes: 'Related Axes',
      noAxes: 'No directly related axes'
    }
  }[language];

  // SDG data with colors
  const sdgs = [
    { id: 1, color: '#E5243B', name: language === 'pt' ? 'Erradicação da Pobreza' : 'No Poverty' },
    { id: 2, color: '#DDA63A', name: language === 'pt' ? 'Fome Zero' : 'Zero Hunger' },
    { id: 3, color: '#4C9F38', name: language === 'pt' ? 'Saúde e Bem-Estar' : 'Good Health' },
    { id: 4, color: '#C5192D', name: language === 'pt' ? 'Educação de Qualidade' : 'Quality Education' },
    { id: 5, color: '#FF3A21', name: language === 'pt' ? 'Igualdade de Gênero' : 'Gender Equality' },
    { id: 6, color: '#26BDE2', name: language === 'pt' ? 'Água Potável' : 'Clean Water' },
    { id: 7, color: '#FCC30B', name: language === 'pt' ? 'Energia Limpa' : 'Clean Energy' },
    { id: 8, color: '#A21942', name: language === 'pt' ? 'Trabalho Decente' : 'Decent Work' },
    { id: 9, color: '#FD6925', name: language === 'pt' ? 'Indústria e Inovação' : 'Innovation' },
    { id: 10, color: '#DD1367', name: language === 'pt' ? 'Redução das Desigualdades' : 'Reduced Inequalities' },
    { id: 11, color: '#FD9D24', name: language === 'pt' ? 'Cidades Sustentáveis' : 'Sustainable Cities' },
    { id: 12, color: '#BF8B2E', name: language === 'pt' ? 'Consumo Responsável' : 'Responsible Consumption' },
    { id: 13, color: '#3F7E44', name: language === 'pt' ? 'Ação Climática' : 'Climate Action' },
    { id: 14, color: '#0A97D9', name: language === 'pt' ? 'Vida na Água' : 'Life Below Water' },
    { id: 15, color: '#56C02B', name: language === 'pt' ? 'Vida Terrestre' : 'Life on Land' },
    { id: 16, color: '#00689D', name: language === 'pt' ? 'Paz e Justiça' : 'Peace & Justice' },
    { id: 17, color: '#19486A', name: language === 'pt' ? 'Parcerias' : 'Partnerships' }
  ];

  // Get axes related to a specific SDG
  const getRelatedAxes = (sdgId) => {
    const axes = researchAxes[language];
    return axes.filter(axis => axis.sdgs && axis.sdgs.includes(sdgId));
  };

  // Check if SDG is used by any axis
  const isSDGActive = (sdgId) => {
    return researchAxes[language].some(axis => axis.sdgs && axis.sdgs.includes(sdgId));
  };

  return (
    <section className="py-5">
      <Container>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mono-label text-green">{labels.tag}</span>
          <h2 className="display-6 fw-bold mb-2">{labels.title}</h2>
          <p className="text-muted">{labels.subtitle}</p>
        </motion.div>

        <Row className="g-5 align-items-start">
          {/* SDG Grid */}
          <Col lg={7}>
            <motion.div
              className="d-flex flex-wrap justify-content-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {sdgs.map((sdg, index) => {
                const isActive = isSDGActive(sdg.id);
                const isSelected = selectedSDG === sdg.id;

                return (
                  <motion.button
                    key={sdg.id}
                    onClick={() => setSelectedSDG(isSelected ? null : sdg.id)}
                    className="border-0 p-0 position-relative"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: isActive ? 'pointer' : 'default',
                      opacity: isActive ? 1 : 0.3,
                      filter: isActive ? 'none' : 'grayscale(100%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: isActive ? 1 : 0.3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    whileHover={isActive ? { scale: 1.1 } : {}}
                    whileTap={isActive ? { scale: 0.95 } : {}}
                    disabled={!isActive}
                    aria-label={sdg.name}
                    aria-pressed={isSelected}
                  >
                    <img
                      src={sdgMap[sdg.id]}
                      alt={`ODS ${sdg.id}: ${sdg.name}`}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', borderRadius: 0 }}
                    />
                    {isSelected && (
                      <motion.div
                        layoutId="sdg-highlight"
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          border: `3px solid ${sdg.color}`,
                          borderRadius: 'var(--radius-sm)',
                          boxShadow: `0 0 20px ${sdg.color}50`
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Legend */}
            <div className="d-flex justify-content-center gap-4 mt-4">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded"
                  style={{ width: '16px', height: '16px', background: 'var(--cp2b-green)' }}
                />
                <span className="small text-muted">
                  {language === 'pt' ? 'ODS abordados pelo CP2B' : 'SDGs addressed by CP2B'}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded"
                  style={{ width: '16px', height: '16px', background: 'var(--cp2b-border)', opacity: 0.5 }}
                />
                <span className="small text-muted">
                  {language === 'pt' ? 'ODS não relacionados' : 'Unrelated SDGs'}
                </span>
              </div>
            </div>
          </Col>

          {/* Selected SDG Details */}
          <Col lg={5}>
            <AnimatePresence mode="wait">
              {selectedSDG ? (
                <motion.div
                  key={selectedSDG}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="border-0"
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      borderTop: `4px solid ${sdgs.find(s => s.id === selectedSDG)?.color}`
                    }}
                  >
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start gap-3 mb-4">
                        <img
                          src={sdgMap[selectedSDG]}
                          alt={`ODS ${selectedSDG}`}
                          style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)' }}
                        />
                        <div>
                          <span className="mono-label text-muted">ODS {selectedSDG}</span>
                          <h5 className="fw-bold mb-0">
                            {sdgs.find(s => s.id === selectedSDG)?.name}
                          </h5>
                        </div>
                      </div>

                      <h6 className="fw-bold mb-3 text-petrol">{labels.relatedAxes}</h6>

                      {getRelatedAxes(selectedSDG).length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {getRelatedAxes(selectedSDG).map(axis => (
                            <div
                              key={axis.id}
                              className="p-3 bg-light rounded"
                              style={{ borderLeft: '3px solid var(--cp2b-green)' }}
                            >
                              <span className="mono-label text-muted d-block mb-1" style={{ fontSize: '0.65rem' }}>
                                {language === 'pt' ? 'EIXO' : 'AXIS'} {axis.id}
                              </span>
                              <p className="mb-0 small fw-medium">
                                {axis.title.split('–')[1]?.trim() || axis.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small mb-0">{labels.noAxes}</p>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-5 bg-light rounded-4"
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'var(--cp2b-green-tint)'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🎯</span>
                  </div>
                  <p className="text-muted mb-0">
                    {language === 'pt'
                      ? 'Selecione um ODS para ver detalhes'
                      : 'Select an SDG to see details'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SDGWheel;
