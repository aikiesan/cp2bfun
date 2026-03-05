import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GalleryUpload = () => {
  const navigate = useNavigate();
  
  // 1. ESTADOS DO FORMULÁRIO
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // 2. ESTADOS DE FEEDBACK (Loading, Sucesso, Erro)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 3. LÓGICA DE ESCOLHA DE FICHEIRO
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Cria um link temporário para mostrar a foto no ecrã antes de enviar
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // 4. LÓGICA DE ENVIO DO FORMULÁRIO
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede a página de recarregar (comportamento padrão do HTML)
    
    if (!file || !title || !date) {
      setMessage({ type: 'danger', text: 'Por favor, preencha todos os campos e selecione uma imagem.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Aqui seria o local onde usaríamos o FormData para enviar para o backend (API)
    // Como ainda não temos backend, vamos simular uma espera de 2 segundos:
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Foto enviada com sucesso!' });
      
      // Limpa o formulário após o sucesso
      setTitle('');
      setDate('');
      setFile(null);
      setPreviewUrl(null);
      
      // Opcional: Redirecionar para a listagem após 1,5 segundos
      setTimeout(() => navigate('/admin/gallery'), 1500);
      
    }, 2000);
  };

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Nova Foto</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/gallery')}>
          Voltar para Lista
        </Button>
      </div>

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

            {/* Campo de Arquivo (Imagem) */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Selecionar Imagem</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" // Só permite escolher ficheiros de imagem
                onChange={handleFileChange}
              />
            </Form.Group>

            {/* Área de Pré-visualização */}
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
                disabled={isSubmitting} // Desativa o botão se estiver a enviar
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    A enviar foto...
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