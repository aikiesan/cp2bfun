// Colors reference the Pilar-2b brand/semantic tokens (styles/tokens.css)
// via CSS custom properties — consumed as inline style values, which
// browsers resolve just like any other CSS var() usage.
// The category is small uppercase text (0.75rem), so every color must reach
// 4.5:1 on white: the brand dark green instead of the semantic success green
// (3.1:1), and amber and red darkened from 3.3:1 and 3.9:1 to about 5:1.
const COLOR_MAP = {
  success:   'var(--cp2b-verde-escuro)',
  primary:   'var(--cp2b-azul-petroleo)',
  info:      'var(--color-info)',
  warning:   'color-mix(in srgb, var(--cp2b-ambar) 75%, black)',
  danger:    'color-mix(in srgb, var(--color-error) 80%, black)',
  secondary: 'var(--gray-600)',
  dark:      'var(--gray-900)',
  light:     'var(--gray-500)',
};

export const getCategoryColor = (badgeColor) => {
  if (!badgeColor) return 'var(--gray-600)';
  return COLOR_MAP[badgeColor.toLowerCase()] || 'var(--gray-600)';
};
