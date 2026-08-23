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

const Avatar = ({ photo, name = '', size = 96, className = '', style = {} }) => {
  const initials = getInitials(name);
  const fontSize = Math.max(12, Math.round(size * 0.36));

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
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

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)',
        color: 'var(--cp2b-azul-petroleo)',
        border: '1px solid var(--gray-300)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        fontFamily: 'var(--font-mono, monospace)',
        flexShrink: 0,
        letterSpacing: '0.5px',
        userSelect: 'none',
        ...style,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
