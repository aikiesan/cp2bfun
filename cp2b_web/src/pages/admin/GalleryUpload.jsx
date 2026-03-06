import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { uploadGalleryPhoto } from '../../services/api';

const GalleryUpload = () => {
  const navigate = useNavigate();

  // --- ESTADOS DO FORMULÁRIO ---
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- ESTADOS DE FEEDBACK (Loading, Sucesso, Erro) ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- SELEÇÃO DE ARQUIVO ---
  // Gera uma URL temporária para pré-visualização antes do envio
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // --- ENVIO DO FORMULÁRIO ---
  // Monta um FormData e envia para o backend via POST /gallery
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title || !date) {
      setMessage({ type: 'danger', text: 'Por favor, preencha todos os campos e selecione uma imagem.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // O campo 'image' deve corresponder ao nome esperado pelo backend
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('date', date);

      await uploadGalleryPhoto(formData);

      setMessage({ type: 'success', text: 'Foto enviada com sucesso!' });

      // Limpa o formulário após sucesso
      setTitle('');
      setDate('');
      setFile(null);
      setPreviewUrl(null);

      // Redireciona para a listagem após 1,5 segundos
      setTimeout(() => navigate('/admin/gallery'), 1500);

    } catch (error) {
      // Exibe mensagem de erro sem derrubar a tela
      const errorMsg = error.response?.data?.error || 'Erro ao enviar a foto. Tente novamente.';
      setMessage({ type: 'danger', text: errorMsg });
      console.error('Error uploading gallery photo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Nova Foto</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/gallery')}>
          Voltar para Lista
        </Button>
      </div>

      {/* --- FEEDBACK (sucesso ou erro) --- */}
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>

            {/* Campo Título */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Título da Foto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Abertura do Fórum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            {/* Campo Data */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Data do Evento</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            {/* Campo de Arquivo */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Selecionar Imagem</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            {/* Pré-visualização da imagem selecionada */}
            {previewUrl && (
              <div className="mb-4 text-center p-3 border rounded bg-light">
                <p className="text-muted small mb-2">Pré-visualização</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                  className="rounded shadow-sm"
                />
              </div>
            )}

            {/* Botão de Enviar */}
            <div className="d-grid">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Enviando foto...
                  </>
                ) : (
                  'Guardar Foto na Galeria'
                )}
              </Button>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GalleryUpload;
