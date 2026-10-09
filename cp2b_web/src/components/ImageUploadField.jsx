import { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import api from '../services/api';
import ImagePositionPicker from './admin/ImagePositionPicker';

// Os mesmos formatos que o backend aceita (backend/src/routes/upload.js).
// Com accept="image/*", um .heic do celular, um .svg ou um .bmp passavam aqui
// e só eram recusados pelo servidor, com uma mensagem genérica.
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ImageUploadField = ({ label, value, onChange, helperText, positionValue, onPositionChange }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    // Limpa o campo: sem isso, escolher de novo o mesmo arquivo depois de um
    // erro (sessão expirada, rede) não dispara onChange e nada acontece.
    e.target.value = '';
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato não aceito. Use JPG, PNG, GIF ou WebP.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('O arquivo deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // O cliente da API já tira o Content-Type quando o corpo é FormData.
      const response = await api.post('/upload/image', formData);

      const imageUrl = response.data.url;
      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (err) {
      setError(`Erro ao fazer upload da imagem: ${err.message}`);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>

      {preview && (
        <div className="mb-2 position-relative" style={{ maxWidth: '300px' }}>
          <img
            src={preview}
            alt="Preview"
            className="img-fluid rounded border"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          <button
            type="button"
            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
            onClick={handleRemove}
            disabled={uploading}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      <Form.Control
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {uploading && (
        <div className="mt-2">
          <Spinner size="sm" className="me-2" />
          <small className="text-muted">Fazendo upload...</small>
        </div>
      )}

      {error && (
        <Form.Text className="text-danger d-block mt-1">
          {error}
        </Form.Text>
      )}

      {helperText && !error && (
        <Form.Text className="text-muted">
          {helperText}
        </Form.Text>
      )}

      {preview && onPositionChange && (
        <ImagePositionPicker
          imageUrl={preview}
          value={positionValue}
          onChange={onPositionChange}
        />
      )}
    </Form.Group>
  );
};

ImageUploadField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  positionValue: PropTypes.string,
  onPositionChange: PropTypes.func,
};

export default ImageUploadField;
