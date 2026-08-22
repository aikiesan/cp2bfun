import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { governanceContent, governanceChart } from '../../data/content';
import OrgChart from '../../components/OrgChart';
import { useLanguage } from '../../context/LanguageContext';
import { fetchPageContent } from '../../services/api';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../../data/content';
import SeoHead from '../../components/SeoHead';
import PageHero from '../../components/PageHero';

const Governance = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.governance[language] || pageSeo.governance.pt;
  const staticContent = governanceContent[language];
  const [content, setContent] = useState({
    title: staticContent.title,
    description: staticContent.description,
    sections: {
      structure: staticContent.sections.structure,
      committee: staticContent.sections.committee,
      committees: staticContent.sections.committees,
      guidelines: staticContent.sections.guidelines
    }
  });
  const chart = governanceChart[language] || governanceChart.pt;

  useEffect(() => {
    const loadContent = async () => {
      const data = await fetchPageContent('governance');
      if (data) {
        const langContent = language === 'pt' ? data.content_pt : data.content_en;
        if (langContent && Object.keys(langContent).length > 0) {
          setContent({
            title: staticContent.title,
            description: staticContent.description,
            sections: {
              structure: {
                title: langContent.section1_title || staticContent.sections.structure.title,
                content: langContent.section1_content || staticContent.sections.structure.content
              },
              committee: {
                title: langContent.section2_title || staticContent.sections.committee.title,
                content: langContent.section2_content || staticContent.sections.committee.content
              },
              committees: staticContent.sections.committees,
              guidelines: {
                title: langContent.section3_title || staticContent.sections.guidelines.title,
                content: langContent.section3_content || staticContent.sections.guidelines.content
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
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <PageHero eyebrow="CP2b" title={content.title} subtitle={content.description} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container className="py-5">
          {/* Organizational Structure */}
        <Row className="mb-5">
          <Col md={12}>
            <h3 className="fw-bold mb-4">{content.sections.structure.title}</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
              {content.sections.structure.content}
            </p>
          </Col>
        </Row>

        {/* Management Committee */}
        <Row className="mb-5 bg-light p-4 rounded-3">
          <Col md={12}>
            <h3 className="fw-bold mb-4">{content.sections.committee.title}</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
              {content.sections.committee.content}
            </p>
          </Col>
        </Row>

        {/* Organizational Chart */}
        <Row className="mb-5">
          <Col md={12}>
            <h3 className="fw-bold mb-4">{language === 'pt' ? 'Organograma' : 'Organizational Chart'}</h3>
            <OrgChart chart={chart} />
          </Col>
        </Row>

        {/* Governance Bodies (Committees) */}
        {content.sections.committees && (
          <Row className="mb-5">
            <Col md={12}>
              <h3 className="fw-bold mb-4">{content.sections.committees.title}</h3>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                {content.sections.committees.content}
              </p>
            </Col>
          </Row>
        )}

        {/* Guidelines */}
        <Row>
          <Col md={12}>
            <h3 className="fw-bold mb-4">{content.sections.guidelines.title}</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
              {content.sections.guidelines.content}
            </p>
          </Col>
        </Row>
      </Container>
    </motion.div>
    </>
  );
};

export default Governance;
