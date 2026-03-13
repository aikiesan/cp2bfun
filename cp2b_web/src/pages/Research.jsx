import { useState, useEffect } from 'react';
import { Container, Accordion, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { researchAxes, sdgMap, menuLabels } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchAxes } from '../services/api';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

const transformApiAxes = (apiAxes, lang) =>
  apiAxes.map((row) => {
    const coordinators = [];
    if (row.coordinator) {
      coordinators.push({ name: row.coordinator, role: 'Coord.', photo: row.coordinator_image || null });
    }
    if (row.sub_coordinator) {
      coordinators.push({ name: row.sub_coordinator, role: 'Adj.', photo: row.sub_coordinator_image || null });
    }
    return {
      id: String(row.axis_number),
      title: lang === 'pt' ? row.title_pt : (row.title_en || row.title_pt),
      coordinators,
      content: lang === 'pt' ? row.content_pt : (row.content_en || row.content_pt),
      sdgs: row.sdgs || [],
    };
  });

const Research = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.research[language] || pageSeo.research.pt;
  const [apiAxes, setApiAxes] = useState(null);
  const t = menuLabels[language];

  useEffect(() => {
    fetchAxes().then((data) => {
      if (data && data.length > 0) setApiAxes(data);
    });
  }, []);

  const axes = apiAxes ? transformApiAxes(apiAxes, language) : researchAxes[language];

  const labels = {
    pt: {
      tag: 'Estrutura de Pesquisa',
      subtitle: 'A atuação do CP2b está organizada em oito eixos temáticos integrados, cobrindo desde o inventário de resíduos até políticas públicas.',
      details: 'Conheça os Eixos',
      axis: 'EIXO',
      sdgs: 'ODS Relacionados:'
    },
    en: {
      tag: 'Research Structure',
      subtitle: 'CP2b\'s activities are organized into eight integrated thematic axes, covering from waste inventory to public policies.',
      details: 'Discover the Axes',
      axis: 'AXIS',
      sdgs: 'Related SDGs:'
    }
  }[language];

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8}>
          <span className="mono-label text-success text-uppercase">{t.axes}</span>
          <h1 className="display-5 fw-bold mb-4">{labels.tag}</h1>
          <p className="lead text-muted">
            {labels.subtitle}
          </p>
        </Col>
      </Row>

      <div className="border-top border-dark pt-5">
        <h3 className="fw-bold mb-4">{labels.details}</h3>
        <Accordion flush alwaysOpen>
          {axes.map((axis) => (
            <Accordion.Item eventKey={axis.id} key={axis.id} className="border-bottom border-dark bg-transparent">
              <Accordion.Header>
                <div className="py-2">
                    <span className="d-block mono-label text-muted mb-1">{labels.axis} {axis.id}</span>
                    <span className="fw-bold fs-5">{axis.title.split('–')[1] || axis.title}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="pb-4 pt-0">
                {axis.coordinators && axis.coordinators.length > 0 && (
                  <div className="d-flex flex-wrap gap-3 mb-4">
                    {axis.coordinators.map((person) => (
                      <div key={person.name} className="d-flex align-items-center gap-2">
                        {person.photo ? (
                          <img
                            src={person.photo}
                            alt={person.name}
                            style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{
                            width: 96, height: 96, borderRadius: '50%', backgroundColor: '#e0e0e0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', fontWeight: 700, color: '#555', flexShrink: 0
                          }}>
                            {person.name.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('')}
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.82rem', lineHeight: 1.2 }}>{person.name}</div>
                          <div className="text-success" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{person.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-muted mb-4" style={{ whiteSpace: 'pre-line' }}>{axis.content}</p>
                
                {/* SDG Images */}
                {axis.sdgs && axis.sdgs.length > 0 && (
                  <div>
                    <span className="mono-label text-muted d-block mb-2">{labels.sdgs}</span>
                    <div className="d-flex flex-wrap gap-2">
                      {axis.sdgs.map((sdgId) => (
                        <img 
                          key={sdgId} 
                          src={sdgMap[sdgId]} 
                          alt={`ODS ${sdgId}`} 
                          title={`Sustainable Development Goal ${sdgId}`}
                          style={{ width: '60px', height: '60px', borderRadius: '8px' }} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </Container>
    </motion.div>
    </>
  );
};

export default Research;
