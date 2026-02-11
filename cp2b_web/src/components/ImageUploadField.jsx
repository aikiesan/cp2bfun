import { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import api from '../services/api';

const ImageUploadField = ({ label, value, onChange, helperText }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido');
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
    formData.append('file', file);

    try {
      const response = await api.request('/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type for multipart
      });

      const imageUrl = response.data.url;
      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (err) {
      setError('Erro ao fazer upload da imagem. Tente novamente.');
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
        accept="image/*"
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
    </Form.Group>
  );
};

ImageUploadField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
};

export default ImageUploadField;
