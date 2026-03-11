import PropTypes from 'prop-types';

const POSITIONS = [
  ['top left',    'top center',    'top right'],
  ['center left', 'center center', 'center right'],
  ['bottom left', 'bottom center', 'bottom right'],
];

const ImagePositionPicker = ({ imageUrl, value, onChange }) => {
  const current = value || 'center center';

  const previewStyle = (pos) => ({
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: pos,
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    flexShrink: 0,
  });

  return (
    <div className="mt-3">
      <small className="text-muted d-block mb-2 fw-semibold">Posição da imagem</small>

      {/* Dual previews */}
      {imageUrl && (
        <div className="d-flex gap-3 mb-3 align-items-flex-end">
          <div>
            <small className="text-muted d-block mb-1" style={{ fontSize: '0.7rem' }}>Card A (retrato)</small>
            <div style={{ ...previewStyle(current), width: '100px', height: '150px' }} />
          </div>
          <div>
            <small className="text-muted d-block mb-1" style={{ fontSize: '0.7rem' }}>Cards B/C (paisagem)</small>
            <div style={{ ...previewStyle(current), width: '150px', height: '80px' }} />
          </div>
        </div>
      )}

      {/* 3×3 position grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '180px' }}>
        {POSITIONS.flat().map((pos) => (
          <button
            key={pos}
            type="button"
            title={pos}
            onClick={() => onChange(pos)}
            style={{
              height: '32px',
              border: current === pos ? '2px solid #0d6efd' : '1px solid #dee2e6',
              borderRadius: '4px',
              backgroundColor: current === pos ? '#e8f0fe' : '#f8f9fa',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{
              display: 'block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: current === pos ? '#0d6efd' : '#adb5bd',
            }} />
          </button>
        ))}
      </div>
      <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>{current}</small>
    </div>
  );
};

ImagePositionPicker.propTypes = {
  imageUrl: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ImagePositionPicker;
