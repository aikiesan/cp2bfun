import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { teamMembers as staticTeamMembers, menuLabels, pageSeo } from '../data/content';
import { groupTeamByAxis } from '../utils/teamGroups';
import { teamPhotos } from '../data/teamPhotos';
import { useLanguage } from '../context/LanguageContext';
import { fetchTeam } from '../services/api';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import Avatar from '../components/Avatar';

// The API still stores people under the old ranks; the page no longer
// renders them as ranks, so this is only used to walk the response.
const apiCategories = ['coordinators', 'principals', 'associates', 'support', 'students'];

// Flatten the static fallback, which is shaped as {category, members[]}.
const flattenStatic = (groups, language) =>
  groups.flatMap((group) =>
    (group.members || []).map((m) => ({
      name: m.name,
      role: m[language] || m.role,
      institution: m.institution,
      axes: m.axes,
    }))
  );

const Team = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.team[language] || pageSeo.team.pt;
  const t = menuLabels[language];

  const [apiMembers, setApiMembers] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const apiData = await fetchTeam();
        if (apiData && typeof apiData === 'object' && Object.keys(apiData).length > 0) {
          // Flatten out of the stored rank buckets: the page regroups by
          // axis, so the ranks are just how the rows happen to be indexed.
          const flat = apiCategories
            .filter((cat) => Array.isArray(apiData[cat]))
            .flatMap((cat) =>
              apiData[cat].map((m) => ({
                name: m.name,
                role: language === 'pt' ? (m.role_pt || m.role) : (m.role_en || m.role_pt || m.role),
                institution: m.institution,
                photo: m.photo || m.photo_url || teamPhotos[m.name] || null,
                axes: m.axes,
                is_director: m.is_director,
              }))
            );
          if (flat.length > 0) {
            setApiMembers(flat);
          }
        }
      } catch {
        // Fallback already in place with the static list
      }
    };

    loadTeam();
  }, [language]);

  // Group horizontally by Eixo, not by rank — see utils/teamGroups.
  const allGroups = useMemo(() => {
    const members = apiMembers || flattenStatic(staticTeamMembers, language);
    return groupTeamByAxis(members, language).map((group) => ({
      ...group,
      members: group.members.map((m) => ({
        ...m,
        photo: m.photo || teamPhotos[m.name] || null,
      })),
    }));
  }, [apiMembers, language]);

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

  const totalFilteredCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.members.length, 0);
  }, [filteredGroups]);

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <PageHero
          eyebrow={t.team}
          title={language === 'pt' ? 'Quem Faz o CP2b' : 'Our Team'}
          subtitle={
            language === 'pt'
              ? 'Uma rede multidisciplinar de pesquisadores e especialistas dedicados ao desenvolvimento de soluções em biogás e bioprodutos.'
              : 'A multidisciplinary network of researchers and experts dedicated to the development of biogas and bioproduct solutions.'
          }
        />

        <Container className="py-5">
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
                <span className="mono-label">
                  {language === 'pt'
                    ? `${totalFilteredCount} ${totalFilteredCount === 1 ? 'pesquisador' : 'pesquisadores'}`
                    : `${totalFilteredCount} ${totalFilteredCount === 1 ? 'researcher' : 'researchers'}`}
                </span>
              </Col>
            </Row>

            {/* Filter Chips with Count Badges */}
            <div className="d-flex flex-wrap gap-2 pb-2" role="group" aria-label="Categorias da equipe">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 ${
                  selectedCategory === 'all'
                    ? 'btn-success text-white'
                    : 'btn-outline-secondary bg-white text-dark'
                }`}
                style={{
                  transition: 'all 0.2s ease',
                  borderColor: selectedCategory === 'all' ? 'transparent' : 'var(--gray-300)',
                }}
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
                    className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 ${
                      isSelected
                        ? 'btn-success text-white'
                        : 'btn-outline-secondary bg-white text-dark'
                    }`}
                    style={{
                      transition: 'all 0.2s ease',
                      borderColor: isSelected ? 'transparent' : 'var(--gray-300)',
                    }}
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
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <section key={group.category} className="mb-5">
                <div className="d-flex align-items-baseline justify-content-between border-bottom pb-2 mb-4">
                  <h3
                    className="fw-bold mb-0 text-uppercase fs-6"
                    style={{ letterSpacing: '1px', color: 'var(--text-primary)' }}
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

                <Row className="g-3 g-md-4">
                  {group.members.map((member, idx) => (
                    <Col key={`${group.category}-${member.name}-${idx}`} sm={6} lg={4} xl={3}>
                      <Card
                        className="h-100 p-3 border-0 shadow-sm hover-lift"
                        style={{
                          borderRadius: 'var(--radius-lg, 16px)',
                          background: 'var(--bg-surface, #ffffff)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <Avatar
                            photo={member.photo}
                            name={member.name}
                            size={64}
                          />
                          <div style={{ minWidth: 0 }} className="flex-grow-1">
                            <h6
                              className="fw-bold mb-1"
                              title={member.name}
                              style={{
                                color: 'var(--text-primary, #222)',
                                fontSize: '0.92rem',
                                lineHeight: 1.25,
                                wordBreak: 'break-word',
                              }}
                            >
                              {member.name}
                            </h6>
                            <div
                              className="small fw-semibold mb-1"
                              style={{
                                color: 'var(--brand-primary, #00573A)',
                                fontSize: '0.75rem',
                                lineHeight: 1.25,
                              }}
                            >
                              {member.role}
                            </div>
                            <div
                              className="text-muted small text-truncate"
                              title={member.institution}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {member.institution}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </section>
            ))
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people fs-1 d-block mb-3 text-secondary" />
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
            </div>
          )}
        </Container>
      </motion.div>
    </>
  );
};

export default Team;
