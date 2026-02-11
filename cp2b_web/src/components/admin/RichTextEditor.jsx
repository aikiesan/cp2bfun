import { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const RichTextEditor = ({ value, onChange, placeholder, height = '400px' }) => {
  const quillRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeError, setYoutubeError] = useState('');

  // Image upload handler
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg,image/jpg,image/png,image/gif,image/webp');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      if (!file) return;

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('O arquivo é muito grande. Tamanho máximo: 10MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Tipo de arquivo inválido. Use JPG, PNG, GIF ou WebP');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        setUploading(true);
        const response = await fetch('/api/upload/news-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erro ao fazer upload da imagem');
        }

        const data = await response.json();
        const imageUrl = data.imageUrl;

        // Insert image into editor
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', imageUrl);
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Erro ao fazer upload da imagem. Tente novamente.');
      } finally {
        setUploading(false);
      }
    };
  };

  // YouTube embed handler
  const videoHandler = () => {
    setYoutubeUrl('');
    setYoutubeError('');
    setShowYouTubeModal(true);
  };

  const extractYouTubeId = (url) => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const insertYouTubeVideo = () => {
    const videoId = extractYouTubeId(youtubeUrl);

    if (!videoId) {
      setYoutubeError('URL do YouTube inválida. Use um link como: https://www.youtube.com/watch?v=VIDEO_ID');
      return;
    }

    // Create responsive YouTube iframe HTML
    const iframeHtml = `
      <div class="youtube-embed-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;

    // Insert into editor
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    quill.clipboard.dangerouslyPasteHTML(range.index, iframeHtml);
    quill.setSelection(range.index + 1);

    setShowYouTubeModal(false);
    setYoutubeUrl('');
  };

  // Custom toolbar configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
    }),
    []
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'align',
    'link',
    'image',
    'video',
    'blockquote',
    'code-block',
  ];

  return (
    <div className="rich-text-editor-wrapper" style={{ position: 'relative' }}>
      {uploading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2">Fazendo upload da imagem...</div>
          </div>
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />

      {/* YouTube URL Modal */}
      <Modal show={showYouTubeModal} onHide={() => setShowYouTubeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inserir Vídeo do YouTube</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>URL do YouTube</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
                setYoutubeError('');
              }}
              isInvalid={!!youtubeError}
            />
            <Form.Control.Feedback type="invalid">{youtubeError}</Form.Control.Feedback>
            <Form.Text className="text-muted">
              Cole o link completo do vídeo (youtube.com/watch, youtu.be, ou youtube.com/shorts)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowYouTubeModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={insertYouTubeVideo}>
            Inserir Vídeo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RichTextEditor;
