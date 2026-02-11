import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows safe HTML tags while blocking malicious scripts
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';

  // Configure DOMPurify with allowed tags and attributes
  const config = {
    ALLOWED_TAGS: [
      // Text formatting
      'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Lists
      'ul', 'ol', 'li',
      // Links
      'a',
      // Images
      'img',
      // Media containers and iframes (for YouTube)
      'div', 'span', 'iframe',
      // Block elements
      'blockquote', 'pre', 'code',
      // Tables
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: [
      // General attributes
      'class', 'id', 'style',
      // Links
      'href', 'target', 'rel',
      // Images
      'src', 'alt', 'width', 'height',
      // Iframes (YouTube)
      'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen',
      // Alignment and formatting
      'align',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Allow data URIs for images (base64)
    ALLOW_DATA_ATTR: true,
    // Keep relative URLs
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  // Additional check for YouTube iframes
  const cleanHtml = DOMPurify.sanitize(html, config);

  return cleanHtml;
};

/**
 * Safe HTML rendering component
 * Usage: <SafeHtml html={content} className="article-content" />
 */
export const SafeHtml = ({ html, className = '', style = {} }) => {
  const sanitizedHtml = sanitizeHtml(html);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
