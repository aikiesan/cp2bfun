import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

const BLOCK_COLORS = {
  green:  { bg: '#2E7D32', bgLight: 'rgba(46,125,50,0.08)',  text: '#2E7D32' },
  amber:  { bg: '#F59E0B', bgLight: 'rgba(245,158,11,0.08)', text: '#B45309' },
  petrol: { bg: '#004d61', bgLight: 'rgba(0,77,97,0.08)',    text: '#004d61' },
  dark:   { bg: '#2c3e50', bgLight: 'rgba(44,62,80,0.08)',   text: '#2c3e50' },
};

const SCHEDULE = [
  {
    blockId: 'manha',
    colorKey: 'green',
    icon: 'bi-sunrise-fill',
    pt: { blockLabel: 'MANHÃ', blockTime: '9h – 12h30' },
    en: { blockLabel: 'MORNING', blockTime: '9:00 – 12:30' },
    sessions: [
      {
        sessionId: 'credenciamento',
        pt: { time: '9h – 9h30', title: 'Credenciamento', description: '30 min' },
        en: { time: '9:00 – 9:30', title: 'Check-in & Accreditation', description: '30 min' },
        speakers: [],
      },
      {
        sessionId: 'abertura',
        pt: { time: '9h30 – 10h', title: 'Abertura Institucional' },
        en: { time: '9:30 – 10:00', title: 'Institutional Opening' },
        speakers: [
          { name: 'Bruna de Souza Moraes', role: { pt: 'Diretora do CP2b', en: 'CP2b Director' }, inst: 'CP2b / UNICAMP', isModerator: false },
          { name: 'Ana Maria Frattini Fileti', role: { pt: 'Pró-Reitora de Pesquisa', en: 'Vice-Rector for Research' }, inst: 'UNICAMP', isModerator: false },
          { name: 'Geraldo Melo Filho', role: { pt: 'Secretário', en: 'Secretary' }, inst: 'Sec. Agricultura e Abastecimento SP', isModerator: false },
          { name: 'Braz dos Santos Adegas Júnior', role: { pt: 'Secretário', en: 'Secretary' }, inst: 'SECLIMAS Campinas', isModerator: false },
        ],
      },
      {
        sessionId: 'financiamento',
        pt: { time: '10h – 10h45', title: 'Diálogo sobre fontes de financiamento para P&D' },
        en: { time: '10:00 – 10:45', title: 'Dialogue on R&D Funding Sources' },
        speakers: [
          { name: 'Aline Scarpetta', role: { pt: 'Moderadora', en: 'Moderator' }, inst: 'CIBiogás', isModerator: true },
          { name: 'Lorena Rocha da Costa Assunção', role: { pt: 'Assessora da Diretora', en: 'Director Advisor' }, inst: 'ANP', isModerator: false },
          { name: 'Renato Massaru Nakai', role: { pt: 'Gerência de Comercialização', en: 'Commercialization Manager' }, inst: 'ARSESP', isModerator: false },
        ],
      },
      {
        sessionId: 'eixos',
        pt: { time: '10h45 – 12h', title: 'Apresentações do CP2b — Eixos Temáticos' },
        en: { time: '10:45 – 12:00', title: 'CP2b Presentations — Research Axes' },
        speakers: [
          { name: 'Bruna de Souza Moraes', role: { pt: 'Moderadora', en: 'Moderator' }, inst: 'CP2b / UNICAMP', isModerator: true },
          { name: 'Rubens Augusto Camargo Lamparelli', role: { pt: 'Eixo 1 — Plataforma Pilar', en: 'Axis 1 — Pilar Platform' }, inst: 'CP2b', isModerator: false },
          { name: 'Lucas Tadeu Fuess', role: { pt: 'Eixo 2 — Vinhaça', en: 'Axis 2 — Vinasse' }, inst: 'CP2b', isModerator: false },
          { name: 'Denis Miranda', role: { pt: 'Eixo 2 — Resíduo Alimentar', en: 'Axis 2 — Food Waste' }, inst: 'CP2b', isModerator: false },
          { name: 'Luis Alberto Follegatti Romero', role: { pt: 'Eixo 5 — Bioprodutos', en: 'Axis 5 — Bioproducts' }, inst: 'CP2b', isModerator: false },
          { name: 'Renata Rodriguez', role: { pt: 'Eixos 6 e 7', en: 'Axes 6 & 7' }, inst: 'CP2b / UNIFAL', isModerator: false },
          { name: 'Sofia Silva', role: { pt: 'Eixos 6 e 7', en: 'Axes 6 & 7' }, inst: 'CP2b', isModerator: false },
        ],
      },
      {
        sessionId: 'flow',
        pt: { time: '12h – 12h30', title: 'Espaço para Pitchs — Curso F.L.O.W.', description: 'Finding, Learning, Owning, Work: Empreendedorismo para Pesquisadores' },
        en: { time: '12:00 – 12:30', title: 'Pitch Space — F.L.O.W. Course', description: 'Finding, Learning, Owning, Work: Entrepreneurship for Researchers' },
        speakers: [],
      },
    ],
  },
  {
    blockId: 'intervalo',
    colorKey: 'amber',
    icon: 'bi-cup-hot-fill',
    pt: { blockLabel: 'INTERVALO', blockTime: '12h30 – 14h30' },
    en: { blockLabel: 'BREAK', blockTime: '12:30 – 14:30' },
    sessions: [
      {
        sessionId: 'brunch',
        pt: {
          time: '12h30 – 14h30',
          title: 'Brunch no Gramado + Atividades Paralelas',
          description: 'Pôsteres Temáticos: Governança e Regulação · Sustentabilidade e Economia Circular · Pesquisa, Desenvolvimento e Inovação · Economia e Modelos de Negócio',
        },
        en: {
          time: '12:30 – 14:30',
          title: 'Lawn Brunch + Parallel Activities',
          description: 'Thematic Posters: Governance & Regulation · Sustainability & Circular Economy · R&D&I · Economics & Business Models',
        },
        speakers: [],
      },
    ],
  },
  {
    blockId: 'tarde',
    colorKey: 'petrol',
    icon: 'bi-people-fill',
    pt: { blockLabel: 'TARDE', blockTime: '14h30 – 16h30' },
    en: { blockLabel: 'AFTERNOON', blockTime: '14:30 – 16:30' },
    sessions: [
      {
        sessionId: 'painel1',
        pt: { time: '14h30 – 15h30', title: 'Painel 1 — Integração Academia-Indústria: Desafios e Oportunidades no mercado do biogás e biometano' },
        en: { time: '14:30 – 15:30', title: 'Panel 1 — Academia-Industry Integration: Challenges and Opportunities in the biogas and biomethane market' },
        speakers: [
          { name: 'Renata Piacentini Rodriguez', role: { pt: 'Moderadora', en: 'Moderator' }, inst: 'CP2b / UNIFAL', isModerator: true },
          { name: 'Giovana Fernanda Dionísio', role: { pt: 'Consultora de Inovação', en: 'Innovation Consultant' }, inst: 'Comgás', isModerator: false },
          { name: 'Lara de Oliveira Arinelli', role: { pt: 'Coord. P&D Baixo Carbono', en: 'Low-Carbon R&D Coordinator' }, inst: 'Equinor Brasil', isModerator: false },
        ],
      },
      {
        sessionId: 'painel2',
        pt: { time: '15h30 – 16h30', title: 'Painel 2 — Ecossistema para o desenvolvimento do mercado de biogás e biometano: Combustível do Futuro e outras Políticas Públicas' },
        en: { time: '15:30 – 16:30', title: 'Panel 2 — Ecosystem for biogas and biomethane market development: Fuel of the Future and other Public Policies' },
        speakers: [
          { name: 'Leidiane Ferronato Mariani', role: { pt: 'Moderadora', en: 'Moderator' }, inst: 'Amplum Biogás', isModerator: true },
          { name: 'Renata Beckert Isfer', role: { pt: 'Procuradora', en: 'Attorney' }, inst: 'AGU', isModerator: false },
          { name: 'Lais Palazzo Almada', role: { pt: 'Diretora de Petróleo, Gás e Biocombustíveis', en: 'Oil, Gas & Biofuels Director' }, inst: 'SEMIL', isModerator: false },
          { name: 'Maria Clara Marcon Pontelli', role: { pt: 'Analista Técnica e Regulatória', en: 'Technical & Regulatory Analyst' }, inst: 'ABIOGÁS', isModerator: false },
          { name: 'Paula Isabel da Costa Barbosa', role: { pt: 'Pesquisadora', en: 'Researcher' }, inst: 'EPE', isModerator: false },
        ],
      },
    ],
  },
  {
    blockId: 'encerramento',
    colorKey: 'dark',
    icon: 'bi-flag-fill',
    pt: { blockLabel: 'ENCERRAMENTO', blockTime: '16h30 – 17h' },
    en: { blockLabel: 'CLOSING', blockTime: '16:30 – 17:00' },
    sessions: [
      {
        sessionId: 'closing',
        pt: { time: '16h30 – 17h', title: 'Encerramento do I Fórum Paulista de Biogás e Bioprodutos' },
        en: { time: '16:30 – 17:00', title: 'Closing of the I São Paulo Biogas and Bioproducts Forum' },
        speakers: [],
      },
    ],
  },
];

const labels = {
  pt: {
    heroBadge: 'I EDIÇÃO • 28 MAI 2026',
    heroTitle: 'Cronograma do Evento',
    heroSubtitle: 'I Fórum Paulista de Biogás e Bioprodutos',
    heroLocation: 'Centro de Convenções Unicamp — Auditório 3',
    heroDate: '28 de maio de 2026',
    scheduleTag: 'PROGRAMAÇÃO DETALHADA',
    scheduleTitle: 'Grade Completa do Dia',
    scheduleNotice: 'Programação sujeita a alterações.',
    moderatorBadge: 'Moderador(a)',
    ctaBtn: 'Inscreva-se',
    backBtn: 'Sobre o Evento',
    ctaTitle: 'Garanta sua participação',
  },
  en: {
    heroBadge: '1ST EDITION • MAY 28, 2026',
    heroTitle: 'Event Schedule',
    heroSubtitle: 'I São Paulo Forum on Biogas and Bioproducts',
    heroLocation: 'Unicamp Convention Center — Auditorium 3',
    heroDate: 'May 28, 2026',
    scheduleTag: 'DETAILED PROGRAM',
    scheduleTitle: 'Full Day Schedule',
    scheduleNotice: 'Schedule subject to change.',
    moderatorBadge: 'Moderator',
    ctaBtn: 'Register Now',
    backBtn: 'About the Event',
    ctaTitle: 'Secure your spot',
  },
};

const getInitials = (name) =>
  name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

const SpeakerCard = ({ speaker, lang, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay * 0.07, duration: 0.35 }}
    style={{ minWidth: '148px', maxWidth: '176px', flexShrink: 0 }}
  >
    <Card className="border-0 shadow-sm h-100 hover-lift" style={{ borderRadius: 'var(--cp2b-radius-sm)' }}>
      <Card.Body className="p-3 text-center d-flex flex-column align-items-center">
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: color.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            marginBottom: '0.5rem',
            flexShrink: 0,
          }}
        >
          {getInitials(speaker.name)}
        </div>
        {speaker.isModerator && (
          <Badge bg="warning" text="dark" className="mb-1" style={{ fontSize: '0.62rem' }}>
            ★ {labels[lang].moderatorBadge}
          </Badge>
        )}
        <p className="fw-semibold mb-0" style={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
          {speaker.name}
        </p>
        <p className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>
          {speaker.role[lang]}
        </p>
        <p className="mb-0 fw-semibold" style={{ fontSize: '0.67rem', color: color.text }}>
          {speaker.inst}
        </p>
      </Card.Body>
    </Card>
  </motion.div>
);

const SessionCard = ({ session, lang, color, index }) => {
  const s = session[lang] || session.pt;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="mb-4"
    >
      <div
        className="rounded-3 p-3 p-md-4"
        style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        {/* Time + title row */}
        <div className="d-flex align-items-start gap-3 mb-2 flex-wrap">
          <span
            className="flex-shrink-0"
            style={{
              background: color.bgLight,
              color: color.text,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
            }}
          >
            {s.time}
          </span>
          <p className="fw-semibold mb-0" style={{ lineHeight: 1.4 }}>
            {s.title}
          </p>
        </div>
        {s.description && (
          <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
            {s.description}
          </p>
        )}
        {session.speakers.length > 0 && (
          <div
            className="d-flex gap-3 mt-3 pb-1"
            style={{ overflowX: 'auto', flexWrap: 'wrap' }}
          >
            {session.speakers.map((spk, i) => (
              <SpeakerCard key={i} speaker={spk} lang={lang} color={color} delay={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ScheduleBlock = ({ block, lang }) => {
  const b = block[lang] || block.pt;
  const color = BLOCK_COLORS[block.colorKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-2"
    >
      {/* Block header */}
      <div
        className="d-flex align-items-center gap-3 rounded-3 px-4 py-3 mb-3"
        style={{
          background: color.bgLight,
          borderLeft: `5px solid ${color.bg}`,
        }}
      >
        <i className={`bi ${block.icon}`} style={{ fontSize: '1.4rem', color: color.text }} />
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              color: color.text,
            }}
          >
            {b.blockLabel}
          </span>
          <span className="text-muted ms-2" style={{ fontSize: '0.82rem' }}>
            {b.blockTime}
          </span>
        </div>
      </div>

      {/* Sessions */}
      <div className="ps-0 ps-md-3">
        {block.sessions.map((session, i) => (
          <SessionCard key={session.sessionId} session={session} lang={lang} color={color} index={i} />
        ))}
      </div>
    </motion.div>
  );
};

const CronogramaEvento = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const t = labels[language];
  const seo = pageSeo.cronograma?.[language] ?? pageSeo.cronograma.pt;

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0a1a1a 0%, #004d61 60%, #2E7D32 100%)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
          }}
        />
        <Container style={{ position: 'relative', zIndex: 1 }} className="py-5">
          <Row className="justify-content-center text-center">
            <Col lg={9}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="mono-label text-success">{t.heroBadge}</span>
                <h1 className="display-4 fw-bold text-white mt-2 mb-2">{t.heroTitle}</h1>
                <p className="lead text-white-50 mb-4">{t.heroSubtitle}</p>
                <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
                  <span className="text-white">
                    <i className="bi bi-geo-alt-fill text-success me-1" />
                    {t.heroLocation}
                  </span>
                  <span className="text-white">
                    <i className="bi bi-calendar-event-fill text-success me-1" />
                    {t.heroDate}
                  </span>
                </div>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button
                    variant="success"
                    size="lg"
                    href="https://proceedings.science/cfp/100701?lang=pt-br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 fw-bold"
                  >
                    {t.ctaBtn}
                  </Button>
                  <Link to="/forum-paulista" className="btn btn-outline-light btn-lg px-4">
                    <i className="bi bi-arrow-left me-2" />
                    {t.backBtn}
                  </Link>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Schedule */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={9}>
              <div className="text-center mb-5">
                <span className="mono-label text-success">{t.scheduleTag}</span>
                <h2 className="fw-bold mt-2 mb-2">{t.scheduleTitle}</h2>
                <p className="text-muted small fst-italic">* {t.scheduleNotice}</p>
              </div>
              {SCHEDULE.map((block) => (
                <ScheduleBlock key={block.blockId} block={block} lang={language} />
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer CTA */}
      <section
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #004d61 0%, #2E7D32 100%)',
        }}
      >
        <Container className="text-center text-white">
          <h3 className="fw-bold mb-3 text-white">{t.ctaTitle}</h3>
          <Button
            variant="warning"
            size="lg"
            href="https://proceedings.science/cfp/100701?lang=pt-br"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 fw-bold"
          >
            {t.ctaBtn}
          </Button>
        </Container>
      </section>
    </>
  );
};

export default CronogramaEvento;
