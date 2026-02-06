import { Container, Accordion, Row, Col } from 'react-bootstrap';
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
      sdgs: 'ODS Relacionados:'
    },
    en: {
      tag: 'Research Structure',
      subtitle: 'CP2B\'s activities are organized into eight integrated thematic axes, covering from waste inventory to public policies.',
      details: 'Discover the Axes',
      axis: 'AXIS',
      sdgs: 'Related SDGs:'
    }
  }[language];

  return (
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
                <p className="fw-bold text-success mb-3 small text-uppercase">{axis.coordinator}</p>
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
  );
};

export default Research;
