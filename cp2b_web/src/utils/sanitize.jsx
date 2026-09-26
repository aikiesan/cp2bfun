import DOMPurify from 'dompurify';

// A lista de tags abaixo aceita iframe (para os vídeos que o editor insere) e o
// ALLOWED_URI_REGEXP aceita data:. Sem estes ganchos, passava qualquer iframe e
// qualquer data: URI, em link inclusive. Iframe só dos players conhecidos;
// data: só como imagem.
const IFRAME_SRC = /^https:\/\/(www\.youtube(-nocookie)?\.com\/embed\/|player\.vimeo\.com\/video\/|open\.spotify\.com\/embed\/)/i;
let hooksInstalled = false;
const installHooks = () => {
  if (hooksInstalled) return;
  hooksInstalled = true;
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    const value = String(data.attrValue || '').trim();
    if (node.nodeName === 'IFRAME' && data.attrName === 'src' && !IFRAME_SRC.test(value)) data.keepAttr = false;
    if ((data.attrName === 'src' || data.attrName === 'href') && /^data:/i.test(value)
      && !(node.nodeName === 'IMG' && data.attrName === 'src' && /^data:image\/(png|jpe?g|gif|webp);/i.test(value))) {
      data.keepAttr = false;
    }
  });
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.nodeName === 'IFRAME' && !node.getAttribute('src')) node.remove();
  });
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows safe HTML tags while blocking malicious scripts
 */
// eslint-disable-next-line react-refresh/only-export-components
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
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    // Allow data URIs for images (base64)
    ALLOW_DATA_ATTR: true,
    // Keep relative URLs
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  installHooks();
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
