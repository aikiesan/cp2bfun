import { useState } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { uploadGalleryPhoto } from '../../services/api';
import imageCompression from 'browser-image-compression';
import { useToast } from '../../components/admin'; 

const GalleryUpload = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  // --- ESTADOS DO FORMULÁRIO ---
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const[compressionProgress, setProgress] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // --- ESTADOS DE FEEDBACK (Loading, Sucesso, Erro) ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- SELEÇÃO DE ARQUIVO ---
  // Gera uma URL temporária para pré-visualização antes do envio
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews(selected.map(f => URL.createObjectURL(f)));

    
  };

  const compressFiles = async (rawFiles) => {
    const options = {
      maxSizeMB: 1,              // limite de 1 MB por arquivo
      maxWidthOrHeight: 1920,    // max 1920px
      fileType: 'image/webp',    // converte para WebP
      useWebWorker: true,        // não bloqueia a UI
    };
    setIsCompressing(true);
    setProgress({ current: 0, total: rawFiles.length });
    const compressed = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const result = await imageCompression(rawFiles[i], options);
      compressed.push(result);
      setProgress({ current: i + 1, total: rawFiles.length });
    }
    setIsCompressing(false);
    return compressed;

  }


  // --- ENVIO DO FORMULÁRIO ---
  // Monta um FormData e envia para o backend via POST /gallery
const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0 || !title || !date) { return; }

    setIsSubmitting(true);
    
    try {
      const compressedFiles = await compressFiles(files);
      const formData = new FormData();
      
      compressedFiles.forEach((f, index) => {
        const originalName = f.name ? f.name.replace(/\.[^/.]+$/, "") : `foto-${index}`;
        formData.append('images', f, `${originalName}.webp`);
      });
    
      formData.append('title', title);
      formData.append('date', date);
      
      await uploadGalleryPhoto(formData);
      
      // 4. Mostre o toast de sucesso
      success('Fotos enviadas com sucesso para a galeria!');

      // Limpa os campos
      setTitle('');
      setDate('');
      setFiles([]);
      setPreviews([]);
      setProgress({ current: 0, total: 0 });
    }
    catch (err) {
      console.error('Erro ao enviar fotos:', err);
      
      // 5. Mostre o toast de erro
      error('Ocorreu um erro ao enviar as fotos. Tente novamente.');
    } 
    finally {
      setIsSubmitting(false);
    };
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Nova Foto</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/gallery')}>
          Voltar para Lista
        </Button>
      </div>


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
                onChange={handleFileChange} multiple
              />
            </Form.Group>
            {isCompressing && (
              <div className='mb-3 p-3 border rounded bg-light'>
                <p className='text-muted small mb-1'>
                  Preparando imagens ({compressionProgress.current}/{compressionProgress.total})...
                </p>
                <div className='progress'>
                  <div className='progress-bar progress-bar-animated'
                    style={{ width: `${(compressionProgress.current / compressionProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Pré-visualização da imagem selecionada */}
            {previews.length > 0 && (
              <div className='mb-4 p-3 border rounded bg-light'>
                <p className='text-muted small mb-2'>
                  {previews.length} arquivo(s) selecionado(s)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt={`Preview ${i}`}
                      style={{ height: '100px', objectFit: 'cover' }}
                      className='rounded shadow-sm' />
                  ))}
                </div>
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
