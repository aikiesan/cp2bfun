import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { teamMembers as staticTeamMembers, menuLabels } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchTeam } from '../services/api';

const categoryLabels = {
  coordinators: { pt: 'Pesquisadores Responsaveis', en: 'Lead Researchers' },
  principals: { pt: 'Pesquisadores Principais', en: 'Principal Investigators' },
  associates: { pt: 'Pesquisadores Associados', en: 'Associate Researchers' },
  support: { pt: 'Apoio Tecnico e Administrativo', en: 'Technical and Administrative Support' },
  students: { pt: 'Estudantes', en: 'Students' },
};

const categoryOrder = ['coordinators', 'principals', 'associates', 'support', 'students'];

const Team = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      const apiData = await fetchTeam();

      if (apiData && Object.keys(apiData).length > 0) {
        // Transform API data to grouped format
        const transformed = categoryOrder
          .filter(cat => apiData[cat] && apiData[cat].length > 0)
          .map(cat => ({
            category: cat,
            pt: categoryLabels[cat]?.pt || cat,
            en: categoryLabels[cat]?.en || cat,
            members: apiData[cat].map(m => ({
              name: m.name,
              role: language === 'pt' ? m.role_pt : (m.role_en || m.role_pt),
              institution: m.institution,
              email: m.email,
              phone: m.phone,
            })),
          }));
        setTeamData(transformed);
      } else {
        // Fallback to static content
        setTeamData(staticTeamMembers);
      }
      setLoading(false);
    };

    loadTeam();
  }, [language]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8}>
          <span className="mono-label text-success">{t.team}</span>
          <h1 className="display-5 fw-bold mb-4">{language === 'pt' ? 'Quem Faz o CP2B' : 'Our Team'}</h1>
          <p className="lead text-muted">
            {language === 'pt'
              ? 'Uma rede multidisciplinar de pesquisadores e especialistas dedicados ao desenvolvimento de solucoes em biogas e bioprodutos.'
              : 'A multidisciplinary network of researchers and experts dedicated to the development of biogas and bioproduct solutions.'}
          </p>
        </Col>
      </Row>

      {teamData && teamData.map((group) => (
        <section key={group.category} className="mb-5">
          <h3 className="fw-bold mb-4 border-bottom pb-2 text-uppercase fs-5" style={{ letterSpacing: '1px' }}>
            {group[language]}
          </h3>
          <Row className="g-4">
            {group.members.map((member, idx) => (
              <Col md={4} lg={3} key={idx}>
                <Card className="h-100 p-3 border-0 shadow-sm hover-lift" style={{ borderRadius: '16px' }}>
                  <Card.Body className="p-2">
                    <h6 className="fw-bold mb-1" style={{ color: '#222' }}>{member.name}</h6>
                    <p className="text-success small mb-2 fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                        {member.role}
                    </p>
                    <p className="text-muted small mb-3 fst-italic" style={{ fontSize: '0.8rem' }}>{member.institution}</p>

                    {(member.email || member.phone) && (
                      <div className="text-muted small border-top pt-2 mt-auto" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        {member.email && <div className="mb-1 text-truncate" title={member.email}>{member.email}</div>}
                        {member.phone && <div>{member.phone}</div>}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </Container>
  );
};

export default Team;
