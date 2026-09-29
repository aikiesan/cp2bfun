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
      tag: 'SOBRE O PROJETO',
      process: 'Processo FAPESP',
      start: 'Início',
      duration: 'Duração',
      lab: 'LABORATÓRIO VIVO',
      abstract: 'Resumo Executivo',
      goals: 'Objetivos',
      results: 'Resultados Esperados',
      partnersTag: 'REDE COLABORATIVA',
      partners: 'Instituições e Parceiros',
      headquarters: 'Sede do Centro',
      public: 'Instituições Públicas',
      companies: 'Empresas Parceiras',
      associated: 'Instituições de Pesquisa Associadas',
      viewAllPartners: 'Ver Catálogo de Parceiros',
      axesTag: 'ESTRUTURA TEMÁTICA',
      axesTitle: 'Oito eixos de atuação integrados',
      axesSubtitle: 'Do inventário de resíduos às políticas públicas: a atuação do CP2b se organiza em oito eixos temáticos.',
      axesFigure: { axis: 'EIXO', title: 'Eixos de atuação do CP2b', hint: 'Clique em um eixo para conhecer seu escopo, competências e projetos.' },
    },
    en: {
      tag: 'ABOUT THE PROJECT',
      process: 'FAPESP Process',
      start: 'Start',
      duration: 'Duration',
      lab: 'LIVING LAB',
      abstract: 'Executive Summary',
      goals: 'Objectives',
      results: 'Expected Results',
      partnersTag: 'COLLABORATIVE NETWORK',
      partners: 'Institutions and Partners',
      headquarters: 'Center Headquarters',
      public: 'Public Institutions',
      companies: 'Partner Companies',
      associated: 'Associated Research Institutions',
      viewAllPartners: 'View Partners Catalog',
      axesTag: 'THEMATIC STRUCTURE',
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
                {mvv.sectionTag || 'DIRETRIZES ESTRATÉGICAS'}
              </span>
              <h2 className="fw-bold fs-2 mb-2" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
                {mvv.sectionTitle || 'Missão, Visão e Valores'}
              </h2>
              {mvv.sectionSubtitle && (
                <p className="text-muted lead fs-6 mb-0">{mvv.sectionSubtitle}</p>
              )}
            </div>

            {/* Mission & Vision: 2 Large Cards */}
            <Row className="g-3 g-md-4 mb-4">
              {/* Mission Card */}
              <Col lg={6}>
                <div
                  className="h-100 p-3 p-md-4 p-lg-5 rounded-4 shadow-sm border position-relative d-flex flex-column"
                  style={{
                    backgroundColor: 'var(--bg-surface, #ffffff)',
                    borderTop: '5px solid var(--cp2b-verde-escuro, #00573A)',
                    borderColor: 'var(--border-default, #E2E8F0)',
                    borderRadius: 'var(--radius-xl, 20px)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span
                      className="badge px-3 py-2 text-uppercase fw-bold"
                      style={{
                        backgroundColor: 'rgba(0, 87, 58, 0.1)',
                        color: 'var(--cp2b-verde-escuro, #00573A)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {mvv.mission?.tag || 'MISSÃO'}
                    </span>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'rgba(0, 87, 58, 0.08)',
                        color: 'var(--cp2b-verde-escuro, #00573A)',
                        fontSize: '1.4rem',
                      }}
                    >
                      <i className="bi bi-compass" />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-2 mb-md-3" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
                    {mvv.mission?.title || 'Nossa Missão'}
                  </h3>
                  <p
                    className="text-secondary fs-5 lh-base mb-0 flex-grow-1"
                    style={{ color: 'var(--text-secondary, #4A5568)', fontStyle: 'italic' }}
                  >
                    {mvv.mission?.text || content?.missao}
                  </p>
                </div>
              </Col>

              {/* Vision Card */}
              <Col lg={6}>
                <div
                  className="h-100 p-3 p-md-4 p-lg-5 rounded-4 shadow-sm border position-relative d-flex flex-column"
                  style={{
                    backgroundColor: 'var(--bg-surface, #ffffff)',
                    borderTop: '5px solid var(--cp2b-lima, #B6E03B)',
                    borderColor: 'var(--border-default, #E2E8F0)',
                    borderRadius: 'var(--radius-xl, 20px)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span
                      className="badge px-3 py-2 text-uppercase fw-bold text-dark"
                      style={{
                        backgroundColor: 'rgba(182, 224, 59, 0.25)',
                        color: 'var(--cp2b-verde-escuro, #00573A)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {mvv.vision?.tag || 'VISÃO'}
                    </span>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: 'rgba(182, 224, 59, 0.2)',
                        color: 'var(--cp2b-verde-escuro, #00573A)',
                        fontSize: '1.4rem',
                      }}
                    >
                      <i className="bi bi-eye" />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-2 mb-md-3" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
                    {mvv.vision?.title || 'Nossa Visão'}
                  </h3>
                  <p
                    className="text-secondary fs-5 lh-base mb-0 flex-grow-1"
                    style={{ color: 'var(--text-secondary, #4A5568)', fontStyle: 'italic' }}
                  >
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
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
                    {mvv.valuesTitle || 'Nossos Valores'}
                  </h4>
                  {mvv.valuesStatement && (
                    <p className="text-muted small mb-0">{mvv.valuesStatement}</p>
                  )}
                </div>

                <Row className="row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3 g-md-4">
                  {mvv.values.map((val, idx) => (
                    <Col key={idx}>
                      <div
                        className="h-100 p-3 p-md-4 rounded-4 shadow-sm border d-flex flex-column text-center text-md-start card-editorial"
                        style={{
                          backgroundColor: 'var(--bg-surface, #ffffff)',
                          borderColor: 'var(--border-default, #E2E8F0)',
                          borderRadius: 'var(--radius-lg, 16px)',
                          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        }}
                      >
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto mx-md-0"
                          style={{
                            width: '46px',
                            height: '46px',
                            backgroundColor: 'var(--gray-100, #F1F3F4)',
                            color: 'var(--cp2b-verde-escuro, #00573A)',
                            fontSize: '1.35rem',
                          }}
                        >
                          <i className={`bi ${val.icon || 'bi-award'}`} />
                        </div>
                        <h5
                          className="fw-bold fs-6 mb-2"
                          style={{ color: 'var(--text-primary, #202124)', minHeight: '2.4rem' }}
                        >
                          {val.title}
                        </h5>
                        <p
                          className="text-muted small mb-0 lh-sm flex-grow-1"
                          style={{ fontSize: '0.84rem' }}
                        >
                          {val.description}
                        </p>
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
          className="mb-4 mb-md-5 mx-auto position-relative rounded-4 overflow-hidden shadow-lg"
          style={{ maxWidth: '1100px', border: '1px solid var(--border-default, #E2E8F0)' }}
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
          <div
            className="position-absolute top-0 start-0 bg-white p-2 p-sm-3 border-bottom border-end shadow-sm"
            style={{
              maxWidth: '300px',
              borderBottomRightRadius: 'var(--radius-lg, 16px)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <span className="mono-label mb-0 text-success fw-bold">
              <i className="bi bi-broadcast me-2" />
              {labels.lab}
            </span>
          </div>
        </div>

        {/* 5. Resumo Executivo */}
        <div
          className="mb-4 mb-md-5 p-3 p-md-4 p-lg-5 rounded-4 bg-light border"
          style={{ borderColor: 'var(--border-default, #E2E8F0)' }}
        >
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--cp2b-verde-escuro, #00573A)',
                color: '#fff',
              }}
            >
              <i className="bi bi-file-earmark-text fs-5" />
            </div>
            <h3 className="fw-bold mb-0" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
              {labels.abstract}
            </h3>
          </div>
          <p
            className="text-secondary mb-0 lh-lg"
            style={{ whiteSpace: 'pre-line', fontSize: '1.02rem' }}
          >
            {content?.resumo}
          </p>
        </div>

        {/* 6. Objetivos & Resultados: Structured Editorial Cards */}
        <Row className="g-3 g-md-4 mb-4 mb-md-5">
          <Col md={6}>
            <div
              className="h-100 p-3 p-md-4 p-lg-5 rounded-4 shadow-sm border card-editorial"
              style={{
                backgroundColor: 'var(--bg-surface, #ffffff)',
                borderLeft: '5px solid var(--cp2b-verde-escuro, #00573A)',
                borderColor: 'var(--border-default, #E2E8F0)',
                borderRadius: 'var(--radius-xl, 20px)',
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: 'rgba(0, 87, 58, 0.1)',
                    color: 'var(--cp2b-verde-escuro, #00573A)',
                    fontSize: '1.3rem',
                  }}
                >
                  <i className="bi bi-bullseye" />
                </div>
                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
                  {labels.goals}
                </h3>
              </div>
              <div className="text-secondary lh-base" style={{ whiteSpace: 'pre-line' }}>
                {content?.objetivos}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div
              className="h-100 p-3 p-md-4 p-lg-5 rounded-4 shadow-sm border card-editorial"
              style={{
                backgroundColor: 'var(--bg-surface, #ffffff)',
                borderLeft: '5px solid var(--cp2b-ambar, #D37402)',
                borderColor: 'var(--border-default, #E2E8F0)',
                borderRadius: 'var(--radius-xl, 20px)',
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: 'rgba(211, 116, 2, 0.1)',
                    color: 'var(--cp2b-ambar, #D37402)',
                    fontSize: '1.3rem',
                  }}
                >
                  <i className="bi bi-trophy" />
                </div>
                <h3 className="fw-bold mb-0" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
                  {labels.results}
                </h3>
              </div>
              <div className="text-secondary lh-base" style={{ whiteSpace: 'pre-line' }}>
                {content?.resultados}
              </div>
            </div>
          </Col>
        </Row>

        {/* 7. Partners Summary Section */}
        <section
          className="mb-4 mb-md-5 p-3 p-md-4 p-lg-5 rounded-4 bg-white border shadow-sm"
          style={{ borderColor: 'var(--border-default, #E2E8F0)' }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
            <div>
              <span className="mono-label text-success d-block mb-1">{labels.partnersTag}</span>
              <h3 className="fw-bold mb-0" style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)' }}>
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

          <div
            className="p-4 rounded-3 mb-4"
            style={{
              backgroundColor: 'rgba(0, 87, 58, 0.04)',
              border: '1px solid rgba(0, 87, 58, 0.15)',
            }}
          >
            <span className="badge bg-success mb-2 px-3 py-1">{labels.headquarters}</span>
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
                <div className="p-3 rounded-3 bg-light h-100 border">
                  <h5
                    className="fw-bold mb-3 d-flex align-items-center"
                    style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)', fontSize: '1rem' }}
                  >
                    <i className="bi bi-bank me-2 text-success" />
                    {labels.public}
                  </h5>
                  <ul className="list-unstyled mb-0">
                    {partners.public.map((p, idx) => (
                      <li key={idx} className="mb-2 text-secondary small d-flex align-items-start">
                        <i
                          className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"
                          style={{ fontSize: '0.8rem' }}
                        />
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
              <div className="p-3 rounded-3 bg-light h-100 border">
                <h5
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)', fontSize: '1rem' }}
                >
                  <i className="bi bi-building me-2 text-primary" />
                  {labels.companies}
                </h5>
                <Row className="g-2">
                  {partners.companies.map((p, idx) => (
                    <Col sm={6} lg={partners.public && partners.public.length > 0 ? 6 : 3} key={idx}>
                      <div className="text-secondary small d-flex align-items-start py-1">
                        <i
                          className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"
                          style={{ fontSize: '0.8rem' }}
                        />
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
              <div className="p-3 rounded-3 bg-light border">
                <h5
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ color: 'var(--cp2b-azul-petroleo, #1E3E4C)', fontSize: '1rem' }}
                >
                  <i className="bi bi-mortarboard me-2 text-warning" />
                  {labels.associated}
                </h5>
                <Row className="g-2">
                  {partners.research.map((p, idx) => (
                    <Col sm={6} lg={3} key={idx}>
                      <div className="text-secondary small d-flex align-items-start py-1">
                        <i
                          className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"
                          style={{ fontSize: '0.8rem' }}
                        />
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
