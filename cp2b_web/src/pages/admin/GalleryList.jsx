import { useState, useEffect } from 'react';
import { Container, Button, Table, Image, Badge, Spinner, ProgressBar, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchGallery, deleteGalleryPhoto, deleteGalleryAlbum, fetchGalleryStorage, updateGalleryCaption } from '../../services/api';
import { ConfirmDialog, useToast } from '../../components/admin';

const formatMB = (bytes) => (bytes / (1024 * 1024)).toFixed(0);

// Mesmo limite da coluna gallery.caption (backend/src/routes/gallery.js).
const MAX_CAPTION_LENGTH = 300;

// Legenda de uma foto: Enter ou "Salvar" grava, Esc desfaz. Texto vazio remove.
const CaptionField = ({ photo, onSaved }) => {
  const { success, error } = useToast();
  const [value, setValue] = useState(photo.caption || '');
  const [saving, setSaving] = useState(false);
  const dirty = value.trim() !== (photo.caption || '');

  const save = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      const updated = await updateGalleryCaption(photo.id, value.trim());
      onSaved(updated);
      setValue(updated.caption || '');
      success(updated.caption ? 'Legenda salva!' : 'Legenda removida.');
    } catch (err) {
      console.error('Error saving gallery caption:', err);
      error(err.response?.data?.error || 'Não foi possível salvar a legenda.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <InputGroup size="sm">
      <Form.Control
        value={value}
        maxLength={MAX_CAPTION_LENGTH}
        placeholder="Adicionar legenda"
        aria-label={`Legenda da foto ${photo.id}`}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); save(); }
          if (e.key === 'Escape') setValue(photo.caption || '');
        }}
      />
      {dirty && (
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      )}
    </InputGroup>
  );
};

const GalleryList = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // target = { kind: 'photo', photo } | { kind: 'album', albumId, title }
  const [target, setTarget] = useState(null);
  const [storage, setStorage] = useState(null);

  const reloadStorage = () => fetchGalleryStorage().then(setStorage);

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery();
      setPhotos(data);
      setLoading(false);
    };
    loadPhotos();
    reloadStorage();
  }, []);

  const requestDeletePhoto = (photo) => {
    setTarget({ kind: 'photo', photo });
    setIsConfirmOpen(true);
  };

  const requestDeleteAlbum = (albumId, title) => {
    setTarget({ kind: 'album', albumId, title });
    setIsConfirmOpen(true);
  };

  const handleCaptionSaved = (updated) => {
    setPhotos((prev) => prev.map((photo) => (photo.id === updated.id ? { ...photo, caption: updated.caption } : photo)));
  };

  const executeDelete = async () => {
    try {
      if (target.kind === 'album') {
        await deleteGalleryAlbum(target.albumId);
        setPhotos((prev) => prev.filter((photo) => photo.album_id !== target.albumId));
        success('Álbum excluído com sucesso!');
      } else {
        await deleteGalleryPhoto(target.photo.id);
        setPhotos((prev) => prev.filter((photo) => photo.id !== target.photo.id));
        success('Foto excluída com sucesso!');
      }
      reloadStorage();
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      error('Ocorreu um erro ao excluir. Tente novamente.');
    } finally {
      setIsConfirmOpen(false);
      setTarget(null);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Gerenciar Galeria</h2>
        <Button variant="primary" onClick={() => navigate('/admin/gallery/upload')}>
          <i className="bi bi-plus-lg me-2"></i>
          Nova Foto
        </Button>
      </div>

      {storage && (
        <div className="bg-white rounded shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold small">Armazenamento da Galeria</span>
            <span className="small text-muted">
              {formatMB(storage.usedBytes)} MB / {formatMB(storage.limitBytes)} MB ({storage.usedPercent}%)
            </span>
          </div>
          <ProgressBar
            now={storage.usedPercent}
            variant={storage.usedPercent > 90 ? 'danger' : storage.usedPercent > 70 ? 'warning' : 'success'}
          />
        </div>
      )}

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <Table responsive hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="py-3 px-4">Imagem</th>
              <th className="py-3">Título</th>
              <th className="py-3" style={{ minWidth: '240px' }}>Legenda</th>
              <th className="py-3">Data</th>
              <th className="py-3 text-end px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                  Carregando fotos...
                </td>
              </tr>
            ) : photos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="bi bi-images mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                  Nenhuma foto cadastrada na galeria.
                </td>
              </tr>
            ) : (
              photos.map((photo) => (
                <tr key={photo.id}>
                  <td className="px-4">
                    <Image
                      src={photo.url}
                      alt={photo.title}
                      width={80}
                      height={60}
                      rounded
                      style={{ objectFit: 'cover' }}
                    />
                  </td>
                  <td className="fw-semibold">
                    {photo.title}
                    {photo.is_cover && (
                      <Badge bg="warning" text="dark" className="ms-2">Capa do Álbum</Badge>
                    )}
                  </td>
                  <td>
                    {photo.is_cover ? (
                      <span className="text-muted small">A capa não aparece dentro do álbum</span>
                    ) : (
                      <CaptionField photo={photo} onSaved={handleCaptionSaved} />
                    )}
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {new Date(photo.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </Badge>
                  </td>
                  <td className="text-end px-4">
                    {photo.is_cover && photo.album_id && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="me-2"
                        onClick={() => requestDeleteAlbum(photo.album_id, photo.title)}
                      >
                        <i className="bi bi-trash3-fill"></i> Apagar Álbum
                      </Button>
                    )}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => requestDeletePhoto(photo)}
                    >
                      <i className="bi bi-trash"></i> Apagar Foto
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <ConfirmDialog
        show={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        title={
          target?.kind === 'album'
            ? '⚠️ ALERTA: Apagar Álbum Inteiro'
            : target?.photo?.is_cover
              ? '⚠️ ALERTA: Apagar Capa do Álbum'
              : 'Apagar Foto'
        }
        message={
          target?.kind === 'album'
            ? `Tem certeza que deseja apagar o álbum "${target?.title}" e TODAS as suas fotos? Esta ação não pode ser desfeita.`
            : target?.photo?.is_cover
              ? `Tem certeza que deseja apagar a capa do álbum "${target?.photo?.title}"? A galeria pública usará a foto mais antiga como capa substituta, mas o ideal é apagar o álbum inteiro em vez desta foto isolada.`
              : 'Tem certeza que deseja apagar esta foto da galeria? Esta ação não pode ser desfeita.'
        }
      />
    </Container>
  );
};

export default GalleryList;
