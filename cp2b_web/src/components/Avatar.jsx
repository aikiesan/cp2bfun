import { useState } from 'react';

// Componente compartilhado de Avatar: foto quando disponível,
// círculo com iniciais elegantes do design system quando não.
// Utilizado em CoordinatorAvatar (/eixos) e Team (/equipe).

const getInitials = (name) => {
  if (!name) return '';
  const clean = name.replace(/^(Profª?|Drª?|Profº?|Drº?)\.?\s+/gi, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const significant = words.filter((w) => w.length > 2);
  if (significant.length >= 2) {
    return (significant[0][0] + significant[1][0]).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const AXIS_COLORS = [
  '#2f6fd6', '#3fa34d', '#7b4fc9', '#2f9e6b',
  '#e07a2c', '#c9a635', '#4a8fc4', '#a6455c',
];

const Avatar = ({ photo, name = '', axisId, size = 96, className = '', style = {} }) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const fontSize = Math.max(12, Math.round(size * 0.36));

  if (photo && !imgError) {
    return (
      <img
        src={photo}
        alt={name}
        onError={() => setImgError(true)}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  const axisNum = axisId ? parseInt(axisId, 10) : null;
  const isAxisBadge = Boolean(axisNum && axisNum >= 1 && axisNum <= 8);
  const axisBg = isAxisBadge ? AXIS_COLORS[(axisNum - 1) % AXIS_COLORS.length] : null;

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: isAxisBadge ? axisBg : 'linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)',
        color: isAxisBadge ? '#ffffff' : 'var(--cp2b-azul-petroleo)',
        border: isAxisBadge ? 'none' : '1px solid var(--gray-300)',
        boxShadow: isAxisBadge ? `0 2px 8px ${axisBg}40` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isAxisBadge ? `${Math.round(size * 0.44)}px` : `${fontSize}px`,
        fontWeight: 700,
        fontFamily: isAxisBadge ? 'var(--font-heading, var(--font-sans))' : 'var(--font-mono, monospace)',
        flexShrink: 0,
        letterSpacing: isAxisBadge ? '-0.5px' : '0.5px',
        userSelect: 'none',
        ...style,
      }}
    >
      {isAxisBadge ? axisNum : initials}
    </div>
  );
};

export default Avatar;
