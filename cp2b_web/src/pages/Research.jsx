import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { researchAxes, menuLabels } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchAxes } from '../services/api';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import AxisMindMap from '../components/AxisMindMap';
import { axisDetails } from '../data/generated/axisDetails';
import { laboratories } from '../data/generated/laboratories';

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
      // O backend ainda não expõe `details` (migration 025) — quando expuser,
      // preferir row.details aqui e cair para o axisDetails estático abaixo.
      details: row.details || null,
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
      sdgs: 'ODS Relacionados:',
      activities: 'Atividades Desenvolvidas',
      mindmapHint: 'Clique em um eixo para abrir suas atividades e, em seguida, em uma atividade para ver os itens.',
      allAxes: 'Todos os eixos',
      noDetails: 'Detalhamento em preparação para este eixo.',
      infraTitle: 'Infraestrutura Laboratorial',
      infraSubtitle: 'Laboratórios e plantas piloto que sustentam os eixos, do TRL de bancada ao pré-industrial.',
      trl: 'TRL',
      axesLabel: 'Eixos',
    },
    en: {
      tag: 'Research Structure',
      subtitle: 'CP2b\'s activities are organized into eight integrated thematic axes, covering from waste inventory to public policies.',
      details: 'Discover the Axes',
      axis: 'AXIS',
      sdgs: 'Related SDGs:',
      activities: 'Activities',
      mindmapHint: 'Click an axis to open its activities, then an activity to see the items.',
      allAxes: 'All axes',
      noDetails: 'Detailed breakdown in preparation for this axis.',
      infraTitle: 'Laboratory Infrastructure',
      infraSubtitle: 'Laboratories and pilot plants underpinning the axes, from bench-scale to pre-industrial TRL.',
      trl: 'TRL',
      axesLabel: 'Axes',
    }
  }[language];

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <PageHero eyebrow={t.axes} title={labels.tag} subtitle={labels.subtitle} />
    <Container className="py-5">

      <div className="border-top border-dark pt-5">
        <h3 className="fw-bold mb-1">{labels.details}</h3>
        <p className="text-muted mb-4">{labels.mindmapHint}</p>
        <AxisMindMap
          axes={axes}
          detailsById={axisDetails}
          language={language}
          labels={labels}
        />
      </div>

      {laboratories.length > 0 && (
        <div className="border-top border-dark pt-5 mt-5">
          <h3 className="fw-bold mb-1">{labels.infraTitle}</h3>
          <p className="text-muted mb-4">{labels.infraSubtitle}</p>
          <Row className="g-4">
            {laboratories.map((lab) => (
              <Col md={4} key={lab.name}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 d-flex flex-column">
                    <span className="mono-label text-success mb-1">{lab.acronym}</span>
                    <h5 className="fw-bold mb-2">{lab.name}</h5>
                    <p className="text-muted small mb-2">{[lab.institution, lab.lead].filter(Boolean).join(' · ')}</p>
                    {lab.axes && lab.axes.length > 0 && (
                      <p className="text-muted small mb-3">
                        {labels.axesLabel}: {lab.axes.join(', ')}
                      </p>
                    )}
                    {lab.trlSuggested && (
                      <span className="badge bg-light text-dark border align-self-start mt-auto">
                        {labels.trl}: {lab.trlSuggested}
                      </span>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
    </motion.div>
    </>
  );
};

export default Research;
