import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { fetchNews, fetchProjects, fetchFeaturedContent, updateFeaturedContent } from '../../services/api';

const FeaturedContentManager = () => {
  const [allNews, setAllNews] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
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
      const [newsData, projectsData, featuredData] = await Promise.all([
        fetchNews(),
        fetchProjects(),
        fetchFeaturedContent()
      ]);

      setAllNews(newsData || []);
      setAllProjects(projectsData || []);
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

  const renderPositionSelector = (position, setPosition, label, currentItem) => {
    const items = position.type === 'news' ? allNews : allProjects;

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
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={8}>
              {position.type && (
                <Form.Group className="mb-3">
                  <Form.Label>Selecionar {position.type === 'news' ? 'Notícia' : 'Projeto'}</Form.Label>
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
              <strong>Atual:</strong> {currentItem.content_type === 'news' ? 'Notícia' : 'Projeto'} - {currentItem.title_pt}
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

      {/* Preview section */}
      <Card>
        <Card.Body>
          <Card.Title>Pré-visualização</Card.Title>
          <div className="row">
            <div className="col-md-6">
              {positionA.slug && (
                <div className="border p-3 bg-light">
                  <strong>Posição A (Principal)</strong>
                  <p className="mb-0">
                    {positionA.type === 'news'
                      ? allNews.find(n => n.slug === positionA.slug)?.title_pt
                      : allProjects.find(p => p.slug === positionA.slug)?.title_pt}
                  </p>
                  <small className="text-muted">
                    {positionA.type === 'news' ? 'Notícia' : 'Projeto'}
                  </small>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                {positionB.slug && (
                  <div className="border p-2 bg-light">
                    <strong>Posição B</strong>
                    <p className="mb-0 small">
                      {positionB.type === 'news'
                        ? allNews.find(n => n.slug === positionB.slug)?.title_pt
                        : allProjects.find(p => p.slug === positionB.slug)?.title_pt}
                    </p>
                    <small className="text-muted">
                      {positionB.type === 'news' ? 'Notícia' : 'Projeto'}
                    </small>
                  </div>
                )}
              </div>
              <div>
                {positionC.slug && (
                  <div className="border p-2 bg-light">
                    <strong>Posição C</strong>
                    <p className="mb-0 small">
                      {positionC.type === 'news'
                        ? allNews.find(n => n.slug === positionC.slug)?.title_pt
                        : allProjects.find(p => p.slug === positionC.slug)?.title_pt}
                    </p>
                    <small className="text-muted">
                      {positionC.type === 'news' ? 'Notícia' : 'Projeto'}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FeaturedContentManager;
