import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { transparencyContent } from '../../data/content';
import { useLanguage } from '../../context/LanguageContext';
import { fetchPageContent } from '../../services/api';
import { motion } from 'framer-motion';

const Transparency = () => {
  const { language } = useLanguage();
  const staticContent = transparencyContent[language];
  const [content, setContent] = useState({
    title: staticContent.title,
    description: staticContent.description,
    sections: staticContent.sections
  });

  useEffect(() => {
    const loadContent = async () => {
      const data = await fetchPageContent('transparency');
      if (data) {
        const langContent = language === 'pt' ? data.content_pt : data.content_en;
        if (langContent && Object.keys(langContent).length > 0) {
          setContent({
            title: staticContent.title,
            description: staticContent.description,
            sections: {
              fapesp: {
                title: langContent.fapesp_title || staticContent.sections.fapesp.title,
                number: langContent.fapesp_number || staticContent.sections.fapesp.number,
                link: langContent.fapesp_link || staticContent.sections.fapesp.link
              },
              reports: {
                title: langContent.reports_title || staticContent.sections.reports.title,
                description: langContent.reports_description || '',
                items: staticContent.sections.reports.items
              },
              financials: {
                title: langContent.financial_title || staticContent.sections.financials.title,
                content: langContent.financial_content || staticContent.sections.financials.content
              }
            }
          });
        }
      }
    };

    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={8}>
            <span className="mono-label text-success">CP2B</span>
            <h1 className="display-4 fw-bold mb-4">{content.title}</h1>
            <p className="lead text-muted">{content.description}</p>
          </Col>
        </Row>

        {/* FAPESP Process */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-3">{content.sections.fapesp.title}</h3>
                <p className="text-muted mb-3">
                  <strong>{language === 'pt' ? 'Número:' : 'Number:'}</strong> {content.sections.fapesp.number}
                </p>
                <Button
                  variant="outline-success"
                  href={content.sections.fapesp.link}
                  target="_blank"
                  size="sm"
                >
                  {language === 'pt' ? 'Ver no Portal FAPESP' : 'View on FAPESP Portal'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Annual Reports */}
        <Row className="mb-5">
          <Col md={12}>
            <h3 className="fw-bold mb-4">{content.sections.reports.title}</h3>
            {content.sections.reports.description && (
              <p className="text-muted mb-3">{content.sections.reports.description}</p>
            )}
            {content.sections.reports.items.length > 0 ? (
              <div>
                {/* Render report cards */}
              </div>
            ) : (
              <p className="text-muted">
                {language === 'pt'
                  ? 'Em breve, disponibilizaremos os relatórios anuais do CP2B.'
                  : 'Annual reports from CP2B will be available soon.'}
              </p>
            )}
          </Col>
        </Row>

        {/* Financial Information */}
        <Row className="bg-light p-4 rounded-3">
          <Col md={12}>
            <h3 className="fw-bold mb-4">{content.sections.financials.title}</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
              {content.sections.financials.content}
            </p>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Transparency;
