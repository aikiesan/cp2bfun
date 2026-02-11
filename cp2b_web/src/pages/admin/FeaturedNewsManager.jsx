import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { fetchNews, fetchFeaturedNews, updateFeaturedNews } from '../../services/api';

const FeaturedNewsManager = () => {
  const [allNews, setAllNews] = useState([]);
  const [currentFeatured, setCurrentFeatured] = useState({ A: null, B: null, C: null });
  const [selectedA, setSelectedA] = useState('');
  const [selectedB, setSelectedB] = useState('');
  const [selectedC, setSelectedC] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [newsData, featuredData] = await Promise.all([
        fetchNews(),
        fetchFeaturedNews()
      ]);

      setAllNews(newsData || []);
      setCurrentFeatured(featuredData);

      // Set dropdown values to current selections
      setSelectedA(featuredData.A?.slug || '');
      setSelectedB(featuredData.B?.slug || '');
      setSelectedC(featuredData.C?.slug || '');
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erro ao carregar notícias' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation: Ensure no duplicates
    const selections = [selectedA, selectedB, selectedC].filter(Boolean);
    if (selections.length !== new Set(selections).size) {
      setMessage({ type: 'warning', text: 'Não é possível selecionar a mesma notícia em múltiplas posições' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await updateFeaturedNews(
        selectedA || null,
        selectedB || null,
        selectedC || null
      );

      setMessage({ type: 'success', text: 'Notícias em destaque atualizadas com sucesso!' });
      await loadData();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setSaving(false);
    }
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
      <h2 className="mb-4">Gerenciar Notícias em Destaque na Home</h2>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Card.Title>Selecione as notícias para cada posição</Card.Title>
          <Card.Text className="text-muted mb-4">
            Escolha quais notícias aparecerão na seção de destaques da página inicial.
            A Posição A é a maior (lado esquerdo), e B/C são menores (lado direito, topo/base).
          </Card.Text>

          <Form onSubmit={handleSave}>
            {/* Position A */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Posição A</strong> (Principal - Esquerda)
              </Form.Label>
              <Form.Select
                value={selectedA}
                onChange={(e) => setSelectedA(e.target.value)}
                size="lg"
              >
                <option value="">-- Nenhuma --</option>
                {allNews.map((news) => (
                  <option key={news.slug} value={news.slug}>
                    {news.title_pt} ({news.date_display})
                  </option>
                ))}
              </Form.Select>
              {currentFeatured.A && (
                <Form.Text className="text-muted">
                  Atual: {currentFeatured.A.title_pt}
                </Form.Text>
              )}
            </Form.Group>

            {/* Position B */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Posição B</strong> (Secundária - Topo Direito)
              </Form.Label>
              <Form.Select
                value={selectedB}
                onChange={(e) => setSelectedB(e.target.value)}
              >
                <option value="">-- Nenhuma --</option>
                {allNews.map((news) => (
                  <option key={news.slug} value={news.slug}>
                    {news.title_pt} ({news.date_display})
                  </option>
                ))}
              </Form.Select>
              {currentFeatured.B && (
                <Form.Text className="text-muted">
                  Atual: {currentFeatured.B.title_pt}
                </Form.Text>
              )}
            </Form.Group>

            {/* Position C */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Posição C</strong> (Secundária - Base Direito)
              </Form.Label>
              <Form.Select
                value={selectedC}
                onChange={(e) => setSelectedC(e.target.value)}
              >
                <option value="">-- Nenhuma --</option>
                {allNews.map((news) => (
                  <option key={news.slug} value={news.slug}>
                    {news.title_pt} ({news.date_display})
                  </option>
                ))}
              </Form.Select>
              {currentFeatured.C && (
                <Form.Text className="text-muted">
                  Atual: {currentFeatured.C.title_pt}
                </Form.Text>
              )}
            </Form.Group>

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
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Pré-visualização</Card.Title>
          <div className="row">
            <div className="col-md-6">
              {selectedA && allNews.find(n => n.slug === selectedA) && (
                <div className="border p-3 bg-light">
                  <strong>Posição A (Principal)</strong>
                  <p className="mb-0">{allNews.find(n => n.slug === selectedA).title_pt}</p>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                {selectedB && allNews.find(n => n.slug === selectedB) && (
                  <div className="border p-2 bg-light">
                    <strong>Posição B</strong>
                    <p className="mb-0 small">{allNews.find(n => n.slug === selectedB).title_pt}</p>
                  </div>
                )}
              </div>
              <div>
                {selectedC && allNews.find(n => n.slug === selectedC) && (
                  <div className="border p-2 bg-light">
                    <strong>Posição C</strong>
                    <p className="mb-0 small">{allNews.find(n => n.slug === selectedC).title_pt}</p>
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

export default FeaturedNewsManager;
