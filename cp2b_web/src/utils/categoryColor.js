// Colors reference the Pilar-2b brand/semantic tokens (styles/tokens.css)
// via CSS custom properties — consumed as inline style values, which
// browsers resolve just like any other CSS var() usage.
const COLOR_MAP = {
  success:   'var(--color-success)',
  primary:   'var(--cp2b-azul-petroleo)',
  info:      'var(--color-info)',
  warning:   'var(--cp2b-ambar)', // brand amber — legible on white, unlike Bootstrap's default yellow
  danger:    'var(--color-error)',
  secondary: 'var(--gray-600)',
  dark:      'var(--gray-900)',
  light:     'var(--gray-500)',
};

export const getCategoryColor = (badgeColor) => {
  if (!badgeColor) return 'var(--gray-600)';
  return COLOR_MAP[badgeColor.toLowerCase()] || 'var(--gray-600)';
};
