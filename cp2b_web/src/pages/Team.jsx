import { useState, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { menuLabels, pageSeo } from '../data/content';
import { getTeamPhoto } from '../data/teamPhotos';
import { groupTeamByAxis, isCoordinator } from '../utils/teamGroups';
import { useLanguage } from '../context/LanguageContext';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import Avatar from '../components/Avatar';
import ResearcherModal from '../components/ResearcherModal';
import TeamProfile from '../components/TeamProfile';
import ListPresence from '../components/ListPresence';
import { computeTeamProfile } from '../utils/teamProfile';
import useTeamRoster from '../hooks/useTeamRoster';
import { useUrlChoice, useUrlText } from '../hooks/useUrlFilters';
import useListMotion, { listItemMotion } from '../hooks/useListMotion';
import Metaninho from '../components/Metaninho';

// "Coordenação" em vez de "Coordenador"/"Coordenadora": o rótulo é gerado a
// partir do número do eixo, e derivar o gênero do nome da pessoa seria
// adivinhação. A forma neutra é português corrente e vale para qualquer um.
// O \u00A0 entre "Eixo" e o número é espaço não-separável: o card é estreito e,
// com espaço comum, a pílula quebrava deixando o número sozinho na segunda
// linha ("Coordenação do Eixo" / "6").
const COORDINATION_LABEL = {
  pt: (axisId) => `Coordenação do Eixo\u00A0${axisId}`,
  en: (axisId) => `Axis\u00A0${axisId} Coordination`,
};

// A pílula que marca a coordenação. Fica aqui, e não repetida nos dois pontos
// de uso, para as duas formas não divergirem de aparência.
const coordinatorPillStyle = {
  display: 'inline-block',
  border: '1px solid currentColor',
  borderRadius: '999px',
  padding: '0.05rem 0.5rem',
  fontSize: '0.75rem',
  lineHeight: 1.25,
};

const Team = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.team[language] || pageSeo.team.pt;
  const t = menuLabels[language];

  // A busca vive no link (?busca=), para poder ser compartilhada. A categoria
  // também, mais abaixo: ela só pode ser validada depois dos grupos montados.
  const [searchQuery, setSearchQuery] = useUrlText('busca');
  // One modal for the whole page, holding whichever person was clicked.
  const [selectedMember, setSelectedMember] = useState(null);

  const { members, source: listSource } = useTeamRoster(language);
  const teamProfile = useMemo(() => computeTeamProfile(members), [members]);

  // Group horizontally by Eixo, not by rank — see utils/teamGroups.
  const allGroups = useMemo(() => {
    return groupTeamByAxis(members, language).map((group) => {
      // Chave estável entre filtragens. Com o índice na chave, cada busca
      // trocava a chave dos cartões seguintes, que remontavam em vez de
      // deslizar até o novo lugar. O sufixo só aparece se um nome se repetir
      // dentro do mesmo grupo.
      const seen = new Map();
      return {
        ...group,
        members: group.members.map((m) => {
          const repeat = seen.get(m.name) || 0;
          seen.set(m.name, repeat + 1);
          return {
            ...m,
            photo: m.photo || getTeamPhoto(m.name) || null,
            cardKey: `${group.category}-${m.name}${repeat ? `-${repeat}` : ''}`,
          };
        }),
      };
    });
  }, [members, language]);

  // ?categoria= aceita só os grupos que a página de fato mostra; qualquer
  // outro valor (link antigo, digitado errado) abre em "Todos".
  const [selectedCategory, setSelectedCategory] = useUrlChoice('categoria', {
    fallback: 'all',
    isValid: (value) => allGroups.some((group) => group.category === value),
  });

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: 0 };
    for (const group of allGroups) {
      counts[group.category] = (group.members || []).length;
      counts.all += (group.members || []).length;
    }
    return counts;
  }, [allGroups]);

  // Filtered groups & members based on category chip and search query
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allGroups
      .filter((group) => selectedCategory === 'all' || group.category === selectedCategory)
      .map((group) => {
        const matchedMembers = group.members.filter((member) => {
          if (!query) return true;
          const nameMatch = member.name.toLowerCase().includes(query);
          const instMatch = member.institution && member.institution.toLowerCase().includes(query);
          const roleMatch = member.role && member.role.toLowerCase().includes(query);
          return nameMatch || instMatch || roleMatch;
        });

        return {
          ...group,
          members: matchedMembers,
        };
      })
      .filter((group) => group.members.length > 0);
  }, [allGroups, selectedCategory, searchQuery]);

  // Easter egg: quem busca "metaninho" encontra o mascote no meio da equipe.
  // Ele não entra nas contagens nem nos filtros; só aparece para essa busca.
  const showMascot = useMemo(
    () => searchQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes('metaninho'),
    [searchQuery]
  );

  const totalFilteredCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.members.length, 0);
  }, [filteredGroups]);

  // Ao filtrar, grupos e cartões deslizam para o novo lugar e os que saem
  // somem aos poucos (hooks/useListMotion). Só a troca de filtro dispara a
  // medição: carregar a API, trocar de idioma ou abrir um perfil não mexem
  // nos cartões. A chegada da API troca a fonte da lista (estática → API) e
  // remonta a fronteira de presença (resetKey): a lista nova entra em
  // repouso, como a primeira, sem animar a diferença entre as duas.
  const listRef = useRef(null);
  const animateList = useListMotion(listRef);
  const layoutKey = `${selectedCategory}|${searchQuery.trim().toLowerCase()}`;

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <PageHero
          className="page-hero--overlap"
          eyebrow={t.team}
          title={language === 'pt' ? 'Quem Faz o CP2b' : 'Our Team'}
          subtitle={
            language === 'pt'
              ? 'Uma rede multidisciplinar de pesquisadores e especialistas dedicados ao desenvolvimento de soluções em biogás e bioprodutos.'
              : 'A multidisciplinary network of researchers and experts dedicated to the development of biogas and bioproduct solutions.'
          }
        />

        <Container className="pb-5">
          {/* Perfil da equipe (painel sobre o hero), calculado do cadastro. */}
          <TeamProfile profile={teamProfile} language={language} />

          {/* Controls: Search and Category Chips */}
          <div className="mb-5">
            <Row className="g-3 align-items-center mb-4">
              <Col md={6} lg={5}>
                <InputGroup size="lg">
                  <InputGroup.Text className="bg-white border-end-0 text-muted">
                    <i className="bi bi-search" aria-hidden="true" />
                  </InputGroup.Text>
                  <Form.Control
                    type="search"
                    placeholder={
                      language === 'pt'
                        ? 'Buscar por nome, instituição ou cargo...'
                        : 'Search by name, institution or role...'
                    }
                    aria-label={language === 'pt' ? 'Buscar membro da equipe' : 'Search team member'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-start-0 ps-0"
                    style={{ fontSize: '0.95rem' }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0 bg-white text-muted"
                      onClick={() => setSearchQuery('')}
                      aria-label="Limpar busca"
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  )}
                </InputGroup>
              </Col>
              <Col md={6} lg={7} className="text-md-end text-muted small">
                {/* A contagem acompanha o filtro: anunciada ao leitor de tela,
                    já que os cartões mudam fora do campo em foco. */}
                <span className="mono-label" aria-live="polite">
                  {language === 'pt'
                    ? `${totalFilteredCount} ${totalFilteredCount === 1 ? 'pesquisador' : 'pesquisadores'}`
                    : `${totalFilteredCount} ${totalFilteredCount === 1 ? 'researcher' : 'researchers'}`}
                </span>
              </Col>
            </Row>

            {/* Filter Chips with Count Badges - Horizontal Scroll Rail on Mobile */}
            <div
              className="d-flex flex-nowrap overflow-x-auto gap-2 pb-2 category-chips-rail"
              role="group"
              aria-label="Categorias da equipe"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'btn-success text-white'
                    : 'btn-outline-secondary bg-white text-dark'
                }`}
                style={{
                  minHeight: '44px',
                  transition: 'all 0.2s ease',
                  borderColor: selectedCategory === 'all' ? 'transparent' : 'var(--gray-300)',
                }}
                aria-pressed={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              >
                <span>{language === 'pt' ? 'Todos' : 'All'}</span>
                <span
                  className={`badge rounded-pill ${
                    selectedCategory === 'all' ? 'bg-white text-success' : 'bg-light text-dark'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {categoryCounts.all || 0}
                </span>
              </button>

              {allGroups.map((cat) => {
                const count = categoryCounts[cat.category] || 0;
                const isSelected = selectedCategory === cat.category;
                const label = cat.shortTitle;

                return (
                  <button
                    key={cat.category}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 flex-shrink-0 ${
                      isSelected
                        ? 'btn-success text-white'
                        : 'btn-outline-secondary bg-white text-dark'
                    }`}
                    style={{
                      minHeight: '44px',
                      transition: 'all 0.2s ease',
                      borderColor: isSelected ? 'transparent' : 'var(--gray-300)',
                    }}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedCategory(cat.category)}
                  >
                    <span>{label}</span>
                    <span
                      className={`badge rounded-pill ${
                        isSelected ? 'bg-white text-success' : 'bg-light text-dark'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Members by Group */}
          <div ref={listRef} className="list-motion">
            <ListPresence animate={animateList} resetKey={listSource}>
              {filteredGroups.map((group, groupIndex) => (
                <motion.section
                  key={group.category}
                  className="mb-4 mb-md-5"
                  {...listItemMotion(animateList, { index: groupIndex, layoutDependency: layoutKey })}
                >
                  <div className="d-flex align-items-baseline justify-content-between border-bottom pb-2 mb-3 mb-md-4">
                    <h3
                      className="fw-semibold mb-0 fs-5"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {group.title}
                    </h3>
                    <span className="mono-label text-muted small">
                      {group.members.length}{' '}
                      {language === 'pt'
                        ? group.members.length === 1 ? 'membro' : 'membros'
                        : group.members.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  {group.blurb && (
                    <p className="text-muted small mb-3" style={{ maxWidth: '62ch' }}>
                      {group.blurb}
                    </p>
                  )}

                  <Row className="g-2 g-sm-3 g-md-4 list-motion">
                    <ListPresence animate={animateList}>
                      {group.members.map((member, idx) => (
                        <Col
                          as={motion.div}
                          key={member.cardKey}
                          xs={6}
                          sm={6}
                          lg={4}
                          xl={3}
                          {...listItemMotion(animateList, { index: idx, layoutDependency: layoutKey })}
                        >
                          <Card
                            className="h-100 p-2 p-sm-3 border-0 shadow-sm hover-lift team-member-card"
                            style={{
                              borderRadius: 'var(--radius-lg, 16px)',
                              background: 'var(--bg-surface, #ffffff)',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                          >
                            {/* The card used to be a dead end. It now opens the
                                person's profile, so it has to be a real button. */}
                            <button
                              type="button"
                              aria-haspopup="dialog"
                              onClick={() => setSelectedMember(member)}
                              className="d-flex align-items-center gap-2 gap-sm-3 team-member-inner team-member-trigger"
                            >
                              <Avatar
                                photo={member.photo}
                                name={member.name}
                                size={64}
                                className="team-avatar"
                              />
                              <div style={{ minWidth: 0 }} className="flex-grow-1">
                                <h4
                                  className="fw-semibold mb-1 team-member-name"
                                  title={member.name}
                                  style={{
                                    color: 'var(--text-primary, #222)',
                                    fontSize: '0.92rem',
                                    lineHeight: 1.25,
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {member.name}
                                </h4>
                                {/* Duas formas de anunciar a coordenação, porque há
                                    dois casos. Quando o próprio cargo já diz
                                    ("Coordenador do Eixo 1"), ele vira a pílula.
                                    Quando não diz — Bruna e Renata, cujo cargo é
                                    "Diretora" e "Vice-diretora" mas que coordenam
                                    os eixos 6 e 7 —, o cargo fica como está e uma
                                    pílula a mais nomeia a coordenação.

                                    O destaque é só visual de propósito: o texto diz
                                    o que a pílula significa, então a informação não
                                    depende da cor nem da borda para ser entendida
                                    (WCAG 1.4.1). Sem cor nova — a mesma
                                    var(--brand-primary) que o cargo já usava. */}
                                {member.coordinatesAxis && !isCoordinator(member) && (
                                  <div
                                    className="small fw-semibold mb-1 team-member-role--coordinator"
                                    style={{ ...coordinatorPillStyle, color: 'var(--brand-primary, #00573A)' }}
                                  >
                                    {(COORDINATION_LABEL[language] || COORDINATION_LABEL.pt)(
                                      member.coordinatesAxis
                                    )}
                                  </div>
                                )}
                                <div
                                  className={`small fw-semibold mb-1 team-member-role${
                                    member.coordinatesAxis && isCoordinator(member)
                                      ? ' team-member-role--coordinator'
                                      : ''
                                  }`}
                                  style={{
                                    color: 'var(--brand-primary, #00573A)',
                                    fontSize: '0.75rem',
                                    lineHeight: 1.25,
                                    ...(member.coordinatesAxis && isCoordinator(member)
                                      ? coordinatorPillStyle
                                      : null),
                                  }}
                                >
                                  {member.role}
                                </div>
                                <div
                                  className="text-muted small text-truncate team-member-inst"
                                  title={member.institution}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {member.institution}
                                </div>
                              </div>
                            </button>
                          </Card>
                        </Col>
                      ))}
                    </ListPresence>
                  </Row>
                </motion.section>
              ))}
              {showMascot && (
                <motion.section
                  key="metaninho"
                  className="mb-4 mb-md-5 team-mascot"
                  {...listItemMotion(animateList, { layoutDependency: layoutKey })}
                >
                  <div className="d-flex align-items-baseline justify-content-between border-bottom pb-2 mb-3 mb-md-4">
                    <h3
                      className="fw-semibold mb-0 fs-5"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {language === 'pt' ? 'Mascote' : 'Mascot'}
                    </h3>
                  </div>
                  <Row className="g-2 g-sm-3 g-md-4">
                    <Col xs={12} sm={6} lg={4} xl={3}>
                      <Card className="h-100 p-2 p-sm-3 border-0 shadow-sm team-member-card team-mascot__card">
                        <div className="d-flex align-items-center gap-2 gap-sm-3 team-member-inner">
                          <Metaninho pose="feliz" size={64} className="team-mascot__img" />
                          <div style={{ minWidth: 0 }} className="flex-grow-1">
                            <h4 className="fw-semibold mb-1 team-member-name" style={{ fontSize: '0.92rem', lineHeight: 1.25 }}>
                              Metaninho
                            </h4>
                            <div
                              className="small fw-semibold mb-1 team-member-role"
                              style={{ color: 'var(--brand-primary, #00573A)', fontSize: '0.75rem', lineHeight: 1.25 }}
                            >
                              {language === 'pt' ? 'Mascote oficial do CP2b' : "CP2b's official mascot"}
                            </div>
                            <div className="text-muted small team-member-inst" style={{ fontSize: '0.75rem' }}>
                              {language === 'pt' ? 'CH₄ · um carbono e quatro hidrogênios' : 'CH₄ · one carbon and four hydrogens'}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </motion.section>
              )}
              {filteredGroups.length === 0 && !showMascot && (
                <motion.div
                  key="empty"
                  className="text-center py-5 text-muted"
                  {...listItemMotion(animateList, { layoutDependency: layoutKey })}
                >
                  <Metaninho pose="curioso" size={130} className="d-block mx-auto mb-3" />
                  <h5>
                    {language === 'pt'
                      ? 'Nenhum membro encontrado com os filtros selecionados.'
                      : 'No team members found matching the selected filters.'}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm mt-3 rounded-pill px-4"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    {language === 'pt' ? 'Limpar filtros' : 'Reset filters'}
                  </button>
                </motion.div>
              )}
            </ListPresence>
          </div>
        </Container>
      </motion.div>

      <ResearcherModal
        member={selectedMember}
        show={Boolean(selectedMember)}
        onHide={() => setSelectedMember(null)}
      />
    </>
  );
};

export default Team;
