import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Nav } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import { technicalServices } from '../data/generated/services';
import { laboratories } from '../data/generated/laboratories';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';

const content = {
  pt: {
    hero: {
      eyebrow: 'Catálogo de Soluções & Parcerias',
      title: 'Quais problemas conseguimos ajudar a resolver?',
      subtitle:
        'O CP2b conecta ciência de ponta às necessidades do mercado, oferecendo infraestrutura analítica da bancada à escala piloto (TRL 2 a 6), serviços especializados e modelos flexíveis de cooperação tecnológica.',
    },
    modalitiesSection: {
      tag: 'MODELOS DE COOPERAÇÃO',
      title: 'Modalidades de Parceria',
      subtitle: 'Estruturas contratuais e modelos de cooperação adaptados à maturidade e necessidade de cada parceiro.',
      items: [
        {
          icon: 'bi-diagram-3',
          title: 'P&D Cooperativo com o Setor Privado',
          description:
            'Projetos conjuntos de pesquisa aplicada para resolver desafios específicos da indústria com aporte compartilhado e co-desenvolvimento tecnológico.',
          badge: 'Co-desenvolvimento',
        },
        {
          icon: 'bi-clipboard-pulse',
          title: 'Consultoria e Serviços Especializados',
          description:
            'Análises laboratoriais avançadas, diagnóstico de processos fermentativos/anaeróbios, ensaios analíticos e assessoria técnica sob medida.',
          badge: 'Serviços Técnicos',
        },
        {
          icon: 'bi-key',
          title: 'Licenciamento de Tecnologia',
          description:
            'Transferência de propriedade intelectual, patentes, cepas microbianas e rotas biotecnológicas geradas pelas pesquisas do centro.',
          badge: 'Transferência de Tecnologia',
        },
        {
          icon: 'bi-shield-check',
          title: 'P&D Regulado (Cláusulas ANP / ANEEL)',
          description:
            'Estruturação e execução de projetos de pesquisa e desenvolvimento em total conformidade com as obrigações regulatórias de investimento do setor de energia.',
          badge: 'Regulatório',
        },
        {
          icon: 'bi-mortarboard',
          title: 'Capacitação e Cursos de Extensão',
          description:
            'Programas de formação técnica e executiva customizados para empresas, cooperativas e órgãos públicos sobre biogás, bioprodutos e sustentabilidade.',
          badge: 'Formação',
        },
      ],
    },
    servicesSection: {
      tag: 'CAPACIDADES ANALÍTICAS',
      title: 'Serviços Técnicos Especializados',
      subtitle: '15 capacidades analíticas e operacionais distribuídas nos 3 laboratórios centrais do CP2b.',
      allLabs: 'Todos os Laboratórios',
      trlLabel: 'Maturidade Tecnológica',
    },
    infraSection: {
      tag: 'INSTALAÇÕES & EQUIPAMENTOS',
      title: 'Infraestrutura Laboratorial Integrada',
      subtitle: 'Estrutura multiusuária com equipamentos analíticos de última geração da bancada ao escalonamento piloto.',
      leadLabel: 'Coordenação Científica',
      axesLabel: 'Eixos Atendidos',
      competencyLabel: 'Competência Essencial',
    },
    funnelSection: {
      tag: 'PASSO A PASSO',
      title: 'Por Onde Começar',
      subtitle: 'O fluxo ágil para transformar uma demanda tecnológica em um projeto concreto com o CP2b.',
      steps: [
        { number: '01', title: 'Contato Inicial', desc: 'Envio de formulário ou e-mail apresentando a demanda, gargalo ou oportunidade de parceria.' },
        { number: '02', title: 'Alinhamento Técnico', desc: 'Reunião preliminar com especialistas para mapear escopo, objetivos e estágio de maturidade (TRL).' },
        { number: '03', title: 'Aproximação com o Eixo', desc: 'Conexão direta com os pesquisadores líderes e laboratórios mais qualificados para o desafio.' },
        { number: '04', title: 'Visita & Diagnóstico', desc: 'Avaliação de amostras de biomassa, visita às instalações e parametrização experimental.' },
        { number: '05', title: 'Proposta & Plano de Trabalho', desc: 'Elaboração do plano técnico, metas, cronograma, entregáveis e orçamento compartilhado.' },
        { number: '06', title: 'Formalização & Execução', desc: 'Assinatura do convênio/contrato e início das atividades de bancada ou planta piloto.' },
      ],
    },
    ctaSection: {
      title: 'Tem um desafio em biogás ou bioprodutos?',
      lead: 'Nossa equipe técnica e científica está pronta para analisar sua demanda e estruturar a melhor solução para o seu negócio.',
      button: 'Fale Conosco',
    },
  },
  en: {
    hero: {
      eyebrow: 'Solutions & Partnership Catalog',
      title: 'What problems can we help you solve?',
      subtitle:
        'CP2b connects cutting-edge science to market demands, providing analytical infrastructure from bench to pilot scale (TRL 2 to 6), specialized technical services, and flexible technological cooperation models.',
    },
    modalitiesSection: {
      tag: 'COOPERATION MODELS',
      title: 'Partnership Modalities',
      subtitle: 'Contractual frameworks tailored to the maturity and requirements of each partner.',
      items: [
        {
          icon: 'bi-diagram-3',
          title: 'Cooperative R&D with Private Sector',
          description:
            'Joint applied research projects solving industry-specific challenges through cost-sharing and collaborative technology co-development.',
          badge: 'Co-development',
        },
        {
          icon: 'bi-clipboard-pulse',
          title: 'Consulting & Specialized Services',
          description:
            'Advanced laboratory analyses, bioprocess diagnosis, feasibility studies, and tailored technical consulting.',
          badge: 'Technical Services',
        },
        {
          icon: 'bi-key',
          title: 'Technology Licensing',
          description:
            'Transfer of intellectual property, patents, microbial strains, and bioprocess pathways developed across the CP2b research network.',
          badge: 'Tech Transfer',
        },
        {
          icon: 'bi-shield-check',
          title: 'Regulated R&D (ANP / ANEEL Clauses)',
          description:
            'Structuring and executing R&D projects compliant with mandatory regulatory investment obligations in the energy sector.',
          badge: 'Regulatory',
        },
        {
          icon: 'bi-mortarboard',
          title: 'Training & Executive Courses',
          description:
            'Customized technical and executive educational programs for enterprises, cooperatives, and public agencies on biogas and circular bioeconomy.',
          badge: 'Education',
        },
      ],
    },
    servicesSection: {
      tag: 'ANALYTICAL CAPABILITIES',
      title: 'Specialized Technical Services',
      subtitle: '15 analytical and operational capabilities available across CP2b core laboratories.',
      allLabs: 'All Laboratories',
      trlLabel: 'Technological Maturity',
    },
    infraSection: {
      tag: 'FACILITIES & EQUIPMENT',
      title: 'Integrated Laboratory Infrastructure',
      subtitle: 'Multi-user facilities with advanced analytical instruments from bench testing to pilot-scale demonstration.',
      leadLabel: 'Scientific Leadership',
      axesLabel: 'Connected Axes',
      competencyLabel: 'Core Competency',
    },
    funnelSection: {
      tag: 'STEP BY STEP',
      title: 'How to Get Started',
      subtitle: 'A streamlined pathway to turn a technological need into an active collaborative project with CP2b.',
      steps: [
        { number: '01', title: 'Initial Contact', desc: 'Submit a message or inquiry describing your challenge, feedstock, or partnership interest.' },
        { number: '02', title: 'Alignment Meeting', desc: 'Technical discussion to clarify project scope, target objectives, and technological readiness level (TRL).' },
        { number: '03', title: 'Axis Matching', desc: 'Direct engagement with the lead researchers and laboratories best suited for the challenge.' },
        { number: '04', title: 'Diagnosis & Site Visit', desc: 'Biomass sample evaluation, facility walkthrough, and experimental parameter planning.' },
        { number: '05', title: 'Proposal & Work Plan', desc: 'Detailed development of technical milestones, timeline, deliverables, and budget allocation.' },
        { number: '06', title: 'Agreement & Kickoff', desc: 'Contract execution and launch of experimental trials in bench bioreactors or pilot plant.' },
      ],
    },
    ctaSection: {
      title: 'Have a challenge in biogas or bioproducts?',
      lead: 'Our scientific and engineering team is ready to assess your demand and structure the best collaborative solution for your organization.',
      button: 'Contact Us',
    },
  },
};

const getTrlBadgeColor = (trlMin) => {
  if (trlMin <= 2) return { bg: 'rgba(47, 111, 214, 0.12)', color: '#2f6fd6', border: 'rgba(47, 111, 214, 0.3)' };
  if (trlMin <= 3) return { bg: 'rgba(92, 160, 50, 0.12)', color: '#00573A', border: 'rgba(92, 160, 50, 0.3)' };
  return { bg: 'rgba(211, 116, 2, 0.12)', color: '#D37402', border: 'rgba(211, 116, 2, 0.3)' };
};

const Solucoes = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const t = content[language] || content.pt;
  const seo = pageSeo.solucoes[language] || pageSeo.solucoes.pt;

  const [activeLabFilter, setActiveLabFilter] = useState('all');

  const filteredServices = technicalServices.filter((s) => {
    if (activeLabFilter === 'all') return true;
    return s.labAcronym.includes(activeLabFilter) || s.labName === activeLabFilter;
  });

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />

      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Container className="py-5">
          {/* Section 2: 5 Partnership Modalities */}
          <section className="mb-5 pb-4">
            <div className="text-center max-w-3xl mx-auto mb-5">
              <span className="mono-label text-success d-block mb-2">{t.modalitiesSection.tag}</span>
              <h2 className="fw-bold fs-2 mb-3">{t.modalitiesSection.title}</h2>
              <p className="text-muted lead fs-6">{t.modalitiesSection.subtitle}</p>
            </div>

            <Row className="g-4">
              {t.modalitiesSection.items.map((mod, idx) => (
                <Col key={idx} md={6} lg={idx === 4 ? 12 : 6} xl={idx === 4 ? 4 : 4}>
                  <Card
                    className="h-100 p-4 border-0 shadow-sm hover-lift"
                    style={{
                      borderRadius: 'var(--radius-lg, 16px)',
                      background: 'var(--bg-surface, #ffffff)',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)',
                          color: 'var(--cp2b-verde-escuro)',
                          fontSize: '1.4rem',
                        }}
                      >
                        <i className={`bi ${mod.icon}`} />
                      </div>
                      <Badge
                        bg="light"
                        className="text-dark border px-2 py-1"
                        style={{ fontSize: '0.72rem', fontWeight: 600 }}
                      >
                        {mod.badge}
                      </Badge>
                    </div>
                    <h3 className="fw-bold mb-2 fs-5" style={{ color: 'var(--text-primary)' }}>
                      {mod.title}
                    </h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                      {mod.description}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Section 3: Technical Services with TRL Ranges */}
          <section className="mb-5 pb-4 pt-4 border-top">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
              <div>
                <span className="mono-label text-success d-block mb-1">{t.servicesSection.tag}</span>
                <h2 className="fw-bold fs-2 mb-2">{t.servicesSection.title}</h2>
                <p className="text-muted small mb-0">{t.servicesSection.subtitle}</p>
              </div>

              {/* Lab Filter Nav */}
              <Nav
                variant="pills"
                className="bg-light p-1 rounded-pill d-inline-flex flex-wrap"
                style={{ border: '1px solid var(--gray-300)', maxWidth: '100%' }}
              >
                <Nav.Item>
                  <Nav.Link
                    active={activeLabFilter === 'all'}
                    onClick={() => setActiveLabFilter('all')}
                    className="rounded-pill px-3 py-1 fw-semibold small"
                    style={{ cursor: 'pointer' }}
                  >
                    {t.servicesSection.allLabs}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeLabFilter === 'CEMARA'}
                    onClick={() => setActiveLabFilter('CEMARA')}
                    className="rounded-pill px-3 py-1 fw-semibold small"
                    style={{ cursor: 'pointer' }}
                  >
                    CEMARA
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeLabFilter === 'CP2b Lab'}
                    onClick={() => setActiveLabFilter('CP2b Lab')}
                    className="rounded-pill px-3 py-1 fw-semibold small"
                    style={{ cursor: 'pointer' }}
                  >
                    CP2b Lab
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeLabFilter === 'PPBIOEN'}
                    onClick={() => setActiveLabFilter('PPBIOEN')}
                    className="rounded-pill px-3 py-1 fw-semibold small"
                    style={{ cursor: 'pointer' }}
                  >
                    PPBIOEN
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            <Row className="g-4">
              {filteredServices.map((service) => {
                const trlColors = getTrlBadgeColor(service.trlMin);
                const item = service[language] || service.pt;

                return (
                  <Col key={service.id} md={6} lg={4}>
                    <Card
                      className="h-100 p-3 border-0 shadow-sm hover-lift"
                      style={{
                        borderRadius: 'var(--radius-lg, 16px)',
                        background: 'var(--bg-surface, #ffffff)',
                      }}
                    >
                      <Card.Body className="p-2 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                          <span
                            className="badge rounded-pill px-2 py-1"
                            style={{
                              backgroundColor: 'var(--gray-100)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono, monospace)',
                            }}
                          >
                            {service.labAcronym}
                          </span>
                          <span
                            className="badge rounded-pill px-2 py-1 fw-bold"
                            style={{
                              backgroundColor: trlColors.bg,
                              color: trlColors.color,
                              border: `1px solid ${trlColors.border}`,
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono, monospace)',
                            }}
                          >
                            {service.trl}
                          </span>
                        </div>

                        <h4 className="fw-bold fs-6 mb-2" style={{ color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {item.title}
                        </h4>
                        <p className="text-muted small mb-0 flex-grow-1" style={{ lineHeight: 1.45, fontSize: '0.82rem' }}>
                          {item.description}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </section>

          {/* Section 4: Infrastructure (3 Laboratories) */}
          <section className="mb-5 pb-4 pt-4 border-top">
            <div className="mb-4">
              <span className="mono-label text-success d-block mb-1">{t.infraSection.tag}</span>
              <h2 className="fw-bold fs-2 mb-2">{t.infraSection.title}</h2>
              <p className="text-muted small mb-0">{t.infraSection.subtitle}</p>
            </div>

            <Row className="g-4">
              {laboratories.map((lab) => (
                <Col key={lab.acronym} lg={4}>
                  <Card
                    className="h-100 p-4 border-0 shadow-sm"
                    style={{
                      borderRadius: 'var(--radius-lg, 16px)',
                      background: 'var(--bg-surface, #ffffff)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-baseline mb-2">
                      <span className="mono-label fw-bold" style={{ color: 'var(--brand-primary)' }}>
                        {lab.acronym}
                      </span>
                      <span className="badge bg-light text-dark border px-2 py-1 small">
                        {lab.trlSuggested}
                      </span>
                    </div>

                    <h3 className="fw-bold fs-5 mb-1" style={{ color: 'var(--text-primary)' }}>
                      {lab.name}
                    </h3>
                    <div className="text-muted small mb-3">
                      <strong>{lab.institution}</strong> · {t.infraSection.leadLabel}: {lab.lead}
                    </div>

                    <div className="p-3 rounded mb-3 flex-grow-1" style={{ background: 'var(--gray-50)' }}>
                      <span className="mono-label text-muted d-block small mb-1">
                        {t.infraSection.competencyLabel}
                      </span>
                      <p className="small text-dark mb-0" style={{ lineHeight: 1.45, fontSize: '0.82rem' }}>
                        {lab.competency}
                      </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="mono-label text-muted small">{t.infraSection.axesLabel}:</span>
                      {lab.axes.map((ax) => (
                        <span
                          key={ax}
                          className="badge rounded-pill"
                          style={{
                            background: 'var(--cp2b-verde-escuro)',
                            color: '#fff',
                            fontSize: '0.72rem',
                          }}
                        >
                          Eixo {ax}
                        </span>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Section 5: Getting Started Funnel */}
          <section className="mb-5 pb-4 pt-4 border-top">
            <div className="text-center max-w-3xl mx-auto mb-5">
              <span className="mono-label text-success d-block mb-2">{t.funnelSection.tag}</span>
              <h2 className="fw-bold fs-2 mb-3">{t.funnelSection.title}</h2>
              <p className="text-muted lead fs-6">{t.funnelSection.subtitle}</p>
            </div>

            <Row className="g-4">
              {t.funnelSection.steps.map((st) => (
                <Col key={st.number} sm={6} lg={4}>
                  <Card
                    className="h-100 p-4 border-0 shadow-sm"
                    style={{
                      borderRadius: 'var(--radius-lg, 16px)',
                      background: 'var(--bg-surface, #ffffff)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span
                        className="mono-label fw-bold d-inline-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: 36,
                          height: 36,
                          background: 'var(--brand-primary)',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                        }}
                      >
                        {st.number}
                      </span>
                      <h4 className="fw-bold fs-6 mb-0" style={{ color: 'var(--text-primary)' }}>
                        {st.title}
                      </h4>
                    </div>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.45 }}>
                      {st.desc}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Section 6: CTA Section */}
          <section className="text-center py-5 px-4 rounded-4" style={{ background: 'linear-gradient(135deg, var(--cp2b-azul-petroleo) 0%, var(--cp2b-verde-escuro) 100%)', color: '#fff' }}>
            <Container className="max-w-2xl py-3">
              <h2 className="fw-bold fs-2 mb-3 text-white">{t.ctaSection.title}</h2>
              <p className="lead fs-6 mb-4 text-white-50">{t.ctaSection.lead}</p>
              <Button
                as={Link}
                to="/contato"
                size="lg"
                className="btn-glow px-5 py-3 rounded-pill fw-bold"
                style={{
                  background: 'var(--cp2b-verde)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                }}
              >
                {t.ctaSection.button} <i className="bi bi-arrow-right ms-2" />
              </Button>
            </Container>
          </section>
        </Container>
      </motion.div>
    </>
  );
};

export default Solucoes;
