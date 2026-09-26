import { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import { technicalServices } from '../data/generated/services';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import LabInfrastructure from '../components/LabInfrastructure';
import ServiceGallery from '../components/ServiceGallery';

const content = {
  pt: {
    hero: {
      eyebrow: 'Laboratórios, serviços e parcerias',
      title: 'Infraestrutura e Soluções',
      subtitle:
        'O CP2b conecta ciência de ponta às necessidades do mercado, oferecendo infraestrutura laboratorial da bancada à escala piloto (TRL 2 a 6), serviços especializados e modelos flexíveis de cooperação tecnológica.',
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
          link: { to: '/capacitacao', label: 'Conheça os cursos' },
        },
      ],
    },
    servicesSection: {
      tag: 'CAPACIDADES ANALÍTICAS',
      title: 'Serviços Técnicos Especializados',
      subtitle: '15 capacidades analíticas e operacionais distribuídas nos 3 laboratórios centrais do CP2b.',
      allLabs: 'Todos os Laboratórios',
      allShort: 'Todos',
      filterLabel: 'Filtrar por laboratório',
      details: 'Como funciona',
      hideDetails: 'Fechar',
      trlLabel: 'Maturidade Tecnológica',
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
      eyebrow: 'Laboratories, services and partnerships',
      title: 'Infrastructure and Solutions',
      subtitle:
        'CP2b connects cutting-edge science to market demands, providing laboratory infrastructure from bench to pilot scale (TRL 2 to 6), specialized technical services, and flexible technological cooperation models.',
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
          link: { to: '/capacitacao', label: 'See the courses' },
        },
      ],
    },
    servicesSection: {
      tag: 'ANALYTICAL CAPABILITIES',
      title: 'Specialized Technical Services',
      subtitle: '15 analytical and operational capabilities available across CP2b core laboratories.',
      allLabs: 'All Laboratories',
      allShort: 'All',
      filterLabel: 'Filter by laboratory',
      details: 'How it works',
      hideDetails: 'Close',
      trlLabel: 'Technological Maturity',
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

const Solucoes = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const t = content[language] || content.pt;
  const seo = pageSeo.solucoes[language] || pageSeo.solucoes.pt;

  const [activeLabFilter, setActiveLabFilter] = useState('all');

  // O painel dos laboratórios não repete os serviços: leva ao catálogo
  // abaixo, já filtrado pelo laboratório escolhido.
  const servicesRef = useRef(null);
  const showServices = (labKey) => {
    setActiveLabFilter(labKey);
    const el = servicesRef.current;
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

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
        className="page-hero--overlap"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Container className="pb-4 pb-md-5">
          {/* Infraestrutura laboratorial: régua de TRL (sobre o hero), painel
              dos laboratórios de bioprocessos e laboratórios do Eixo 8. */}
          <LabInfrastructure language={language} onShowServices={showServices} />

          {/* Section 3: Technical Services with TRL Ranges */}
          <section id="servicos" ref={servicesRef} className="solucoes-services mb-4 mb-md-5 pb-3 pb-md-4 pt-3 pt-md-4 border-top">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end mb-4 gap-3">
              <div>
                <span className="mono-label text-success d-block mb-1">{t.servicesSection.tag}</span>
                <h2 className="fw-bold fs-2 mb-2">{t.servicesSection.title}</h2>
                <p className="text-muted small mb-0">{t.servicesSection.subtitle}</p>
              </div>

              {/* Filtro por laboratório: controle segmentado que divide a largura
                  — cabe em qualquer tela sem rolagem lateral. */}
              <div className="svc-filter" role="group" aria-label={t.servicesSection.filterLabel}>
                {[
                  { key: 'all', label: t.servicesSection.allLabs, short: t.servicesSection.allShort },
                  { key: 'CEMARA', label: 'CEMARA' },
                  { key: 'CP2b Lab', label: 'CP2b Lab' },
                  { key: 'PPBIOEN', label: 'PPBIOEN' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`svc-filter__btn${activeLabFilter === f.key ? ' is-active' : ''}`}
                    aria-pressed={activeLabFilter === f.key}
                    onClick={() => setActiveLabFilter(f.key)}
                  >
                    {f.short ? (
                      <>
                        <span className="d-none d-md-inline">{f.label}</span>
                        <span className="d-md-none">{f.short}</span>
                      </>
                    ) : f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Galeria: ilustração + título + TRL; a descrição abre sob demanda. */}
            <ServiceGallery services={filteredServices} language={language} labels={t.servicesSection} />
          </section>

          {/* Section 2: 5 Partnership Modalities */}
          <section className="mb-4 mb-md-5 pb-3 pb-md-4">
            <div className="text-center max-w-3xl mx-auto mb-4 mb-md-5">
              <span className="mono-label text-success d-block mb-2">{t.modalitiesSection.tag}</span>
              <h2 className="fw-bold fs-2 mb-2 mb-md-3">{t.modalitiesSection.title}</h2>
              <p className="text-muted lead fs-6">{t.modalitiesSection.subtitle}</p>
            </div>

            <Row className="g-2 g-sm-3 g-md-4">
              {/* Uma coluna no celular: em duas, a descrição corria em ~120px
                  e os selos ("Transferência de Tecnologia") eram cortados na
                  borda do card. O quinto card fecha a grade na largura toda até
                  o xl, em vez de deixar meia linha vazia. */}
              {t.modalitiesSection.items.map((mod, idx) => (
                <Col key={idx} xs={12} sm={idx === 4 ? 12 : 6} xl={4}>
                  <Card
                    className="h-100 p-3 p-md-4 border-0 shadow-sm hover-lift"
                    style={{
                      borderRadius: 'var(--radius-lg, 16px)',
                      background: 'var(--bg-surface, #ffffff)',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2 mb-md-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center solution-modality-icon"
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
                        className="text-dark border px-2 py-1 solution-modality-badge"
                        style={{ fontSize: '0.72rem', fontWeight: 600 }}
                      >
                        {mod.badge}
                      </Badge>
                    </div>
                    <h3 className="fw-bold mb-1 mb-md-2 fs-5 mobile-compact-title" style={{ color: 'var(--text-primary)' }}>
                      {mod.title}
                    </h3>
                    <p className="text-muted small mb-0 solution-modality-copy" style={{ lineHeight: 1.5 }}>
                      {mod.description}
                    </p>
                    {mod.link && (
                      <Link to={mod.link.to} className="arrow-link small mt-2 mt-md-3">
                        {mod.link.label} <i className="bi bi-arrow-right" aria-hidden="true" />
                      </Link>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </section>

          {/* Section 5: Getting Started Funnel */}
          <section className="mb-4 mb-md-5 pb-3 pb-md-4 pt-3 pt-md-4 border-top">
            <div className="text-center max-w-3xl mx-auto mb-4 mb-md-5">
              <span className="mono-label text-success d-block mb-2">{t.funnelSection.tag}</span>
              <h2 className="fw-bold fs-2 mb-2 mb-md-3">{t.funnelSection.title}</h2>
              <p className="text-muted lead fs-6">{t.funnelSection.subtitle}</p>
            </div>

            <Row className="g-2 g-sm-3 g-md-4">
              {t.funnelSection.steps.map((st) => (
                <Col key={st.number} xs={12} sm={6} lg={4}>
                  <Card
                    className="h-100 p-3 p-md-4 border-0 shadow-sm"
                    style={{
                      borderRadius: 'var(--radius-lg, 16px)',
                      background: 'var(--bg-surface, #ffffff)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span
                        className="mono-label fw-bold d-inline-flex align-items-center justify-content-center rounded-circle solution-step-number"
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
          <section className="text-center py-4 py-md-5 px-3 px-md-4 rounded-4" style={{ background: 'linear-gradient(135deg, var(--cp2b-azul-petroleo) 0%, var(--cp2b-verde-escuro) 100%)', color: '#fff' }}>
            <Container className="max-w-2xl py-2 py-md-3">
              <h2 className="fw-bold fs-2 mb-3 text-white">{t.ctaSection.title}</h2>
              <p className="lead fs-6 mb-4 text-white-50">{t.ctaSection.lead}</p>
              <Button
                as={Link}
                to="/contato"
                size="lg"
                className="btn-glow px-4 px-md-5 py-2 py-md-3 rounded-pill fw-bold"
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
