const COLOR_MAP = {
  success:   '#2E7D32',
  primary:   '#004d61',
  info:      '#0077a8',
  warning:   '#b35c00', // dark amber — Bootstrap yellow (#ffc107) is illegible on white
  danger:    '#c0392b',
  secondary: '#555555',
  dark:      '#1a1a1a',
  light:     '#6c757d',
};

export const getCategoryColor = (badgeColor) => {
  if (!badgeColor) return '#555555';
  return COLOR_MAP[badgeColor.toLowerCase()] || '#555555';
};
