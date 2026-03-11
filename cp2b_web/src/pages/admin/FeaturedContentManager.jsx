import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { fetchNews, fetchProjects, fetchMicroscopia, fetchOpportunities, fetchFeaturedContent, updateFeaturedContent } from '../../services/api';

const FeaturedContentManager = () => {
  const [allNews, setAllNews] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allMicroscopia, setAllMicroscopia] = useState([]);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [currentFeatured, setCurrentFeatured] = useState({ A: null, B: null, C: null });

  // Each position has type and slug
  const [positionA, setPositionA] = useState({ type: '', slug: '' });
  const [positionB, setPositionB] = useState({ type: '', slug: '' });
  const [positionC, setPositionC] = useState({ type: '', slug: '' });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [newsData, projectsData, microscopiaData, opportunitiesData, featuredData] = await Promise.all([
        fetchNews(),
        fetchProjects(),
        fetchMicroscopia(),
        fetchOpportunities(),
        fetchFeaturedContent()
      ]);

      setAllNews(newsData || []);
      setAllProjects(projectsData || []);
      setAllMicroscopia(microscopiaData || []);
      setAllOpportunities(opportunitiesData || []);
      setCurrentFeatured(featuredData);

      // Set dropdown values to current selections
      if (featuredData.A) {
        setPositionA({ type: featuredData.A.content_type, slug: featuredData.A.slug });
      } else {
        setPositionA({ type: '', slug: '' });
      }

      if (featuredData.B) {
        setPositionB({ type: featuredData.B.content_type, slug: featuredData.B.slug });
      } else {
        setPositionB({ type: '', slug: '' });
      }

      if (featuredData.C) {
        setPositionC({ type: featuredData.C.content_type, slug: featuredData.C.slug });
      } else {
        setPositionC({ type: '', slug: '' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erro ao carregar conteúdo' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation: Ensure no duplicates (same type + same slug)
    const selections = [];
    if (positionA.slug) selections.push(`${positionA.type}:${positionA.slug}`);
    if (positionB.slug) selections.push(`${positionB.type}:${positionB.slug}`);
    if (positionC.slug) selections.push(`${positionC.type}:${positionC.slug}`);

    if (selections.length !== new Set(selections).size) {
      setMessage({ type: 'warning', text: 'Não é possível selecionar o mesmo conteúdo em múltiplas posições' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await updateFeaturedContent(
        positionA.slug ? positionA : null,
        positionB.slug ? positionB : null,
        positionC.slug ? positionC : null
      );

      setMessage({ type: 'success', text: 'Destaques atualizados com sucesso!' });
      await loadData();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const typeLabels = {
    news: 'Notícia',
    project: 'Projeto',
    microscopio: 'Microscópio',
    opportunity: 'Oportunidade',
  };

  const itemsByType = {
    news: allNews,
    project: allProjects,
    microscopio: allMicroscopia,
    opportunity: allOpportunities,
  };

  const renderPositionSelector = (position, setPosition, label, currentItem) => {
    const items = itemsByType[position.type] || [];

    return (
      <Card className="mb-3">
        <Card.Body>
          <Form.Label><strong>{label}</strong></Form.Label>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Conteúdo</Form.Label>
                <Form.Select
                  value={position.type}
                  onChange={(e) => setPosition({ type: e.target.value, slug: '' })}
                >
                  <option value="">-- Selecione --</option>
                  <option value="news">Notícia</option>
                  <option value="project">Projeto</option>
                  <option value="microscopio">Microscópio</option>
                  <option value="opportunity">Oportunidade</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={8}>
              {position.type && (
                <Form.Group className="mb-3">
                  <Form.Label>Selecionar {typeLabels[position.type]}</Form.Label>
                  <Form.Select
                    value={position.slug}
                    onChange={(e) => setPosition({ ...position, slug: e.target.value })}
                  >
                    <option value="">-- Nenhum --</option>
                    {items.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.title_pt} {item.date_display && `(${item.date_display})`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </Col>
          </Row>

          {currentItem && (
            <Form.Text className="text-muted">
              <strong>Atual:</strong> {typeLabels[currentItem.content_type] || currentItem.content_type} - {currentItem.title_pt}
            </Form.Text>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Gerenciar Destaques na Home</h2>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Selecione o conteúdo para cada posição</Card.Title>
          <Card.Text className="text-muted mb-4">
            Escolha notícias ou projetos para destacar na página inicial.
            A Posição A é a maior (lado esquerdo), e B/C são menores (lado direito, topo/base).
          </Card.Text>

          <Form onSubmit={handleSave}>
            {renderPositionSelector(
              positionA,
              setPositionA,
              'Posição A (Principal - Esquerda)',
              currentFeatured.A
            )}

            {renderPositionSelector(
              positionB,
              setPositionB,
              'Posição B (Secundária - Topo Direito)',
              currentFeatured.B
            )}

            {renderPositionSelector(
              positionC,
              setPositionC,
              'Posição C (Secundária - Base Direito)',
              currentFeatured.C
            )}

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Destaques'
                )}
              </Button>
              <Button variant="outline-secondary" onClick={loadData} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Visual preview — mirrors FeaturedContent.jsx layout */}
      <Card>
        <Card.Body>
          <Card.Title>Pré-visualização</Card.Title>
          <Card.Text className="text-muted small mb-3">
            Representação aproximada do layout na página inicial.
          </Card.Text>
          {(() => {
            const findItem = (pos) => {
              if (!pos.slug) return null;
              return (itemsByType[pos.type] || []).find(i => i.slug === pos.slug);
            };
            const itemA = findItem(positionA);
            const itemB = findItem(positionB);
            const itemC = findItem(positionC);

            const overlayStyle = {
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '12px',
            };

            const emptyStyle = {
              background: '#dee2e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#adb5bd',
              fontSize: '0.8rem',
              fontStyle: 'italic',
            };

            const cardBase = (item) => ({
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundImage: item?.image ? `url(${item.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: item?.image_position || 'center center',
              ...(item?.image ? {} : emptyStyle),
            });

            return (
              <div style={{ display: 'flex', gap: '6px', height: '280px' }}>
                {/* Card A — portrait, left half */}
                <div style={{ flex: 1, ...cardBase(itemA) }}>
                  {itemA?.image ? (
                    <div style={overlayStyle}>
                      {itemA.badge && (
                        <span className={`badge bg-${itemA.badge_color || 'primary'} mb-1`} style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>
                          {itemA.badge}
                        </span>
                      )}
                      <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem', lineHeight: '1.3' }}>
                        {itemA.title_pt}
                      </div>
                      {itemA.date_display && (
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', marginTop: '4px' }}>
                          {itemA.date_display}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>Posição A vazia</span>
                  )}
                </div>

                {/* Right half — Cards B and C stacked */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Card B — landscape top */}
                  <div style={{ flex: 1, ...cardBase(itemB) }}>
                    {itemB?.image ? (
                      <div style={overlayStyle}>
                        {itemB.badge && (
                          <span className={`badge bg-${itemB.badge_color || 'primary'} mb-1`} style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>
                            {itemB.badge}
                          </span>
                        )}
                        <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.8rem', lineHeight: '1.3' }}>
                          {itemB.title_pt}
                        </div>
                        {itemB.date_display && (
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', marginTop: '3px' }}>
                            {itemB.date_display}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>Posição B vazia</span>
                    )}
                  </div>

                  {/* Card C — landscape bottom */}
                  <div style={{ flex: 1, ...cardBase(itemC) }}>
                    {itemC?.image ? (
                      <div style={overlayStyle}>
                        {itemC.badge && (
                          <span className={`badge bg-${itemC.badge_color || 'primary'} mb-1`} style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>
                            {itemC.badge}
                          </span>
                        )}
                        <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.8rem', lineHeight: '1.3' }}>
                          {itemC.title_pt}
                        </div>
                        {itemC.date_display && (
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', marginTop: '3px' }}>
                            {itemC.date_display}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>Posição C vazia</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FeaturedContentManager;
