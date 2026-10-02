import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  aboutContent as staticAboutContent,
  partners,
  projectDetails,
  missionVisionValues as staticMissionVisionValues,
  pageSeo,
  researchAxes,
} from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchPageContent } from '../services/api';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import AboutSubnav from '../components/AboutSubnav';
import AxisConstellation from '../components/AxisConstellation';
import './About.css';

const About = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.about[language] || pageSeo.about.pt;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const details = projectDetails;
  const tTitle = projectDetails[language].title;

  const labels = {
    pt: {
      tag: 'Sobre o projeto',
      process: 'Processo FAPESP',
      start: 'Início',
      duration: 'Duração',
      lab: 'Laboratório vivo',
      abstract: 'Resumo Executivo',
      goals: 'Objetivos',
      results: 'Resultados Esperados',
      partnersTag: 'Rede colaborativa',
      partners: 'Instituições e Parceiros',
      headquarters: 'Sede do Centro',
      public: 'Instituições Públicas',
      companies: 'Empresas Parceiras',
      associated: 'Instituições de Pesquisa Associadas',
      viewAllPartners: 'Ver Catálogo de Parceiros',
      axesTag: 'Estrutura temática',
      axesTitle: 'Oito eixos de atuação integrados',
      axesSubtitle: 'Do inventário de resíduos às políticas públicas: a atuação do CP2b se organiza em oito eixos temáticos.',
      axesFigure: { axis: 'EIXO', title: 'Eixos de atuação do CP2b', hint: 'Clique em um eixo para conhecer seu escopo, competências e projetos.' },
    },
    en: {
      tag: 'About the project',
      process: 'FAPESP Process',
      start: 'Start',
      duration: 'Duration',
      lab: 'Living lab',
      abstract: 'Executive Summary',
      goals: 'Objectives',
      results: 'Expected Results',
      partnersTag: 'Collaborative network',
      partners: 'Institutions and Partners',
      headquarters: 'Center Headquarters',
      public: 'Public Institutions',
      companies: 'Partner Companies',
      associated: 'Associated Research Institutions',
      viewAllPartners: 'View Partners Catalog',
      axesTag: 'Thematic structure',
      axesTitle: 'Eight integrated thematic axes',
      axesSubtitle: 'From waste inventory to public policy: CP2b work is organized into eight thematic axes.',
      axesFigure: { axis: 'AXIS', title: 'CP2b thematic axes', hint: 'Click an axis to see its scope, competencies and projects.' },
    },
  }[language];

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const apiData = await fetchPageContent('about');
      const staticData = staticAboutContent[language] || staticAboutContent.pt;

      if (apiData) {
        const langContent = language === 'pt' ? apiData.content_pt : apiData.content_en;
        if (langContent && typeof langContent === 'object') {
          setContent({
            ...staticData,
            ...langContent,
            objetivos: (typeof langContent.objetivos === 'string' && langContent.objetivos.trim()) ? langContent.objetivos : staticData.objetivos,
            resultados: (typeof langContent.resultados === 'string' && langContent.resultados.trim()) ? langContent.resultados : staticData.resultados,
            resumo: (typeof langContent.resumo === 'string' && langContent.resumo.trim()) ? langContent.resumo : staticData.resumo,
            missao: (typeof langContent.missao === 'string' && langContent.missao.trim()) ? langContent.missao : staticData.missao,
            visao: (typeof langContent.visao === 'string' && langContent.visao.trim()) ? langContent.visao : staticData.visao,
          });
        } else {
          setContent(staticData);
        }
      } else {
        setContent(staticData);
      }
      setLoading(false);
    };

    loadContent();
  }, [language]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const mvv =
    content?.missionVisionValues ||
    staticAboutContent[language]?.missionVisionValues ||
    staticMissionVisionValues[language] ||
    staticMissionVisionValues.pt;

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      
      {/* 1. Page Hero */}
      <PageHero eyebrow={labels.tag} title={tTitle} photo={{ src: '/assets/fotos/sobre-reuniao.webp', width: 700, height: 500 }}>
        <p className="page-hero-sub mb-1">
          <strong>{labels.process}:</strong> {details.number}
        </p>
        <p className="page-hero-sub mb-0" style={{ fontSize: '0.95rem' }}>
          <strong>{labels.start}:</strong> {details.startDate} | <strong>{labels.duration}:</strong> {details[language].duration}
        </p>
      </PageHero>

      <Container className="py-4 py-md-5">
        {/* 2. Navegação da seção Sobre (a mesma em todas as páginas dela) */}
        <AboutSubnav />

        {/* 3. Missão, Visão e Valores Section */}
        {mvv && (
          <section className="mb-4 mb-md-5 pb-3">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <span className="mono-label text-success d-block mb-1">
                {mvv.sectionTag || 'Diretrizes estratégicas'}
              </span>
              <h2 className="fw-bold fs-2 mb-2" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
                {mvv.sectionTitle || 'Missão, Visão e Valores'}
              </h2>
              {mvv.sectionSubtitle && (
                <p className="text-muted lead fs-6 mb-0">{mvv.sectionSubtitle}</p>
              )}
            </div>

            {/* Missão e visão: duas folhas presas com fita (verde e lima). */}
            <Row className="g-3 g-md-4 mb-4">
              <Col lg={6}>
                <div className="about-sheet h-100 p-3 p-md-4 p-lg-5 d-flex flex-column" data-tape="verde">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="about-label">{mvv.mission?.tag || 'Missão'}</span>
                    <i className="bi bi-compass about-icon" aria-hidden="true" />
                  </div>
                  <h3 className="about-sheet__title mb-2 mb-md-3">
                    {mvv.mission?.title || 'Nossa Missão'}
                  </h3>
                  <p className="about-sheet__quote mb-0 flex-grow-1">
                    {mvv.mission?.text || content?.missao}
                  </p>
                </div>
              </Col>
              <Col lg={6}>
                <div className="about-sheet h-100 p-3 p-md-4 p-lg-5 d-flex flex-column" data-tape="lima">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="about-label">{mvv.vision?.tag || 'Visão'}</span>
                    <i className="bi bi-eye about-icon" aria-hidden="true" />
                  </div>
                  <h3 className="about-sheet__title mb-2 mb-md-3">
                    {mvv.vision?.title || 'Nossa Visão'}
                  </h3>
                  <p className="about-sheet__quote mb-0 flex-grow-1">
                    {mvv.vision?.text || content?.visao}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Valores: grade 3x2 no desktop.
                Eram 5 cards em `row-cols-lg-5`; com o sexto valor (Diversidade
                & Equidade de Gênero) a última linha ficava com um card órfão.
                Três colunas dividem os seis em duas linhas cheias e ainda dão
                mais largura para as descrições, que são longas. */}
            {Array.isArray(mvv.values) && mvv.values.length > 0 && (
              <div className="mt-4">
                <div className="mb-3 text-center text-md-start">
                  <h4 className="about-block-title justify-content-center justify-content-md-start mb-1">
                    {mvv.valuesTitle || 'Nossos Valores'}
                  </h4>
                  {mvv.valuesStatement && (
                    <p className="text-muted small mb-0">{mvv.valuesStatement}</p>
                  )}
                </div>

                <Row className="about-values row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3 g-md-4">
                  {mvv.values.map((val, idx) => (
                    <Col key={idx}>
                      <div className="about-sheet h-100 p-3 p-md-4 d-flex flex-column text-center text-md-start">
                        <i className={`bi ${val.icon || 'bi-award'} about-icon mb-3`} aria-hidden="true" />
                        <h5 className="about-value__title mb-2">{val.title}</h5>
                        <p className="about-value__text mb-0 flex-grow-1">{val.description}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </section>
        )}

        {/* 3b. Estrutura temática: figura dos 8 eixos, versão compacta — só os
            títulos e o logo do CP2b no centro, sem coordenadores. */}
        <section className="mb-4 mb-md-5 pb-3" aria-labelledby="about-axes-title">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <span className="mono-label text-success d-block mb-1">{labels.axesTag}</span>
            <h2 id="about-axes-title" className="fw-bold fs-2 mb-2" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
              {labels.axesTitle}
            </h2>
            <p className="text-muted lead fs-6 mb-0">{labels.axesSubtitle}</p>
          </div>
          <AxisConstellation axes={researchAxes[language] || researchAxes.pt} labels={labels.axesFigure} compact />
        </section>

        {/* 4. Institutional Video (Responsive 16:9 container) */}
        <div
          className="about-sheet mb-4 mb-md-5 mx-auto position-relative overflow-hidden p-2"
          style={{ maxWidth: '1100px' }}
        >
          <div className="ratio ratio-16x9">
            <video
              className="w-100 h-100 object-fit-cover"
              poster="/assets/cp2b-institucional-poster.jpg"
              controls
              playsInline
              autoPlay
              muted
              loop
              preload="auto"
            >
              <source src="/assets/cp2b-institucional.mp4" type="video/mp4" />
            </video>
          </div>
          {/* Selo no canto superior: embaixo ele cobria o botão de play e o
              início da linha do tempo dos controles nativos do vídeo. */}
          <span className="about-video-tag">{labels.lab}</span>
        </div>

        {/* 5. Resumo Executivo: texto corrido, sem a caixa cinza em volta. */}
        <section className="mb-4 mb-md-5">
          <h3 className="about-block-title mb-3">
            <i className="bi bi-file-earmark-text about-icon" aria-hidden="true" />
            {labels.abstract}
          </h3>
          <p className="about-abstract__text mb-0">{content?.resumo}</p>
        </section>

        {/* 6. Objetivos e resultados: duas folhas, fita verde e fita âmbar. */}
        <Row className="g-3 g-md-4 mb-4 mb-md-5">
          <Col md={6}>
            <div className="about-sheet h-100 p-3 p-md-4 p-lg-5" data-tape="verde">
              <h3 className="about-block-title mb-3">
                <i className="bi bi-bullseye about-icon" aria-hidden="true" />
                {labels.goals}
              </h3>
              <div className="text-secondary lh-base" style={{ whiteSpace: 'pre-line' }}>
                {content?.objetivos}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="about-sheet h-100 p-3 p-md-4 p-lg-5" data-tape="ambar">
              <h3 className="about-block-title mb-3">
                <i className="bi bi-trophy about-icon" aria-hidden="true" />
                {labels.results}
              </h3>
              <div className="text-secondary lh-base" style={{ whiteSpace: 'pre-line' }}>
                {content?.resultados}
              </div>
            </div>
          </Col>
        </Row>

        {/* 7. Partners Summary Section */}
        {/* Sem a caixa branca de fora: as folhas de dentro já separam os grupos. */}
        <section className="mb-4 mb-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
            <div>
              <span className="mono-label text-success d-block mb-1">{labels.partnersTag}</span>
              <h3 className="about-block-title mb-0">
                {labels.partners}
              </h3>
            </div>
            <Button
              as={Link}
              to="/sobre/parceiros"
              variant="outline-success"
              className="rounded-pill px-4 align-self-start align-self-md-auto"
            >
              {labels.viewAllPartners} <i className="bi bi-arrow-right ms-2" />
            </Button>
          </div>

          <div className="about-sheet p-3 p-md-4 mb-4" data-tape="verde">
            <span className="about-label d-block mb-1">{labels.headquarters}</span>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
              {partners.host.name}
            </h5>
            <p className="text-muted small mb-0">
              <i className="bi bi-geo-alt me-1 text-danger" />
              {partners.host.location}
            </p>
          </div>

          <Row className="g-4">
            {partners.public && partners.public.length > 0 && (
              <Col md={6}>
                <div className="about-sheet p-3 p-md-4 h-100">
                  <h5
                    className="fw-bold mb-3 d-flex align-items-center"
                    style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)', fontSize: '1rem' }}
                  >
                    <i className="bi bi-bank me-2 about-icon" aria-hidden="true" />
                    {labels.public}
                  </h5>
                  <ul className="list-unstyled mb-0">
                    {partners.public.map((p, idx) => (
                      <li key={idx} className="mb-2 text-secondary small d-flex align-items-start">
                        <span className="about-leaf" aria-hidden="true" />
                        <span>
                          <strong>{p.name}</strong> <span className="text-muted">({p.location})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            )}
            <Col md={partners.public && partners.public.length > 0 ? 6 : 12}>
              <div className="about-sheet p-3 p-md-4 h-100">
                <h5
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)', fontSize: '1rem' }}
                >
                  <i className="bi bi-building me-2 about-icon" aria-hidden="true" />
                  {labels.companies}
                </h5>
                <Row className="g-2">
                  {partners.companies.map((p, idx) => (
                    <Col sm={6} lg={partners.public && partners.public.length > 0 ? 6 : 3} key={idx}>
                      <div className="text-secondary small d-flex align-items-start py-1">
                        <span className="about-leaf" aria-hidden="true" />
                        <span>
                          <strong>{p.name}</strong> <span className="text-muted">({p.location})</span>
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
            <Col md={12}>
              <div className="about-sheet p-3 p-md-4">
                <h5
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)', fontSize: '1rem' }}
                >
                  <i className="bi bi-mortarboard me-2 about-icon" aria-hidden="true" />
                  {labels.associated}
                </h5>
                <Row className="g-2">
                  {partners.research.map((p, idx) => (
                    <Col sm={6} lg={3} key={idx}>
                      <div className="text-secondary small d-flex align-items-start py-1">
                        <span className="about-leaf" aria-hidden="true" />
                        <span>
                          <strong>{p.name}</strong> <span className="text-muted">({p.location})</span>
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
};

export default About;
