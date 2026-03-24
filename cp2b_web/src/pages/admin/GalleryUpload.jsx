import { useState } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { uploadGalleryPhoto } from '../../services/api';
import imageCompression from 'browser-image-compression';
import { useToast } from '../../components/admin';

const GalleryUpload = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [files, setFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [compressionProgress, setProgress] = useState({ current: 0, total: 0 });
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const compressFiles = async (rawFiles) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      fileType: 'image/webp',
      useWebWorker: true,
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverFile || files.length === 0 || !title || !date) {
      error('Preencha todos os campos e selecione a capa e as imagens internas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const [compressedCover] = await compressFiles([coverFile]);
      const compressedImages = await compressFiles(files);

      const formData = new FormData();

      const coverName = coverFile.name ? coverFile.name.replace(/\.[^/.]+$/, '') : 'capa';
      formData.append('cover', compressedCover, `${coverName}.webp`);

      compressedImages.forEach((f, index) => {
        const originalName = f.name ? f.name.replace(/\.[^/.]+$/, '') : `foto-${index}`;
        formData.append('images', f, `${originalName}.webp`);
      });

      formData.append('title', title);
      formData.append('date', date);

      await uploadGalleryPhoto(formData);

      success('Álbum e fotos enviados com sucesso para a galeria!');

      setTitle('');
      setDate('');
      setFiles([]);
      setPreviews([]);
      setCoverFile(null);
      setCoverPreview(null);
      setProgress({ current: 0, total: 0 });
    } catch (err) {
      console.error('Erro ao enviar fotos:', err);
      error('Ocorreu um erro ao enviar o álbum. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Novo Álbum</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/gallery')}>
          Voltar para Lista
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3" controlId="photoTitle">
              <Form.Label className="fw-semibold">Título do Álbum</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Abertura do Fórum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="photoDate">
              <Form.Label className="fw-semibold">Data do Evento</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="coverFile">
              <Form.Label className="fw-semibold">Foto de Capa do Álbum</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
              />
            </Form.Group>

            {coverPreview && (
              <div className="mb-4 p-3 border rounded bg-light">
                <p className="text-muted small mb-2">Preview da Capa</p>
                <img src={coverPreview} alt="Preview Capa" style={{ height: '150px', objectFit: 'cover' }} className="rounded shadow-sm" />
              </div>
            )}

            <Form.Group className="mb-4" controlId="photoFile">
              <Form.Label className="fw-semibold">Fotos Internas do Álbum</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
              />
            </Form.Group>

            {isCompressing && (
              <div className="mb-3 p-3 border rounded bg-light">
                <p className="text-muted small mb-1">
                  Preparando imagens ({compressionProgress.current}/{compressionProgress.total})...
                </p>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-animated"
                    style={{ width: `${(compressionProgress.current / compressionProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {previews.length > 0 && (
              <div className="mb-4 p-3 border rounded bg-light">
                <p className="text-muted small mb-2">
                  {previews.length} arquivo(s) selecionado(s)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt={`Preview ${i}`}
                      style={{ height: '100px', objectFit: 'cover' }}
                      className="rounded shadow-sm" />
                  ))}
                </div>
              </div>
            )}

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
                    Enviando álbum...
                  </>
                ) : (
                  'Guardar Álbum na Galeria'
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
