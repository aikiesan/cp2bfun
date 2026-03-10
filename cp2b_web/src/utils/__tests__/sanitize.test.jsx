/**
 * sanitize utility tests
 *
 * Teaching notes for grad students:
 * - These are pure *unit* tests: they call a function and check its output.
 *   No React rendering, no network, no side effects.
 * - Security utilities like HTML sanitizers deserve thorough testing because
 *   a bug here can create XSS vulnerabilities in the entire application.
 * - We test both the "happy path" (safe input stays safe) and the "attack path"
 *   (malicious input is stripped).
 * - The SafeHtml *component* is tested separately at the bottom — it wraps
 *   sanitizeHtml(), so the component tests focus on React behavior (rendering,
 *   className, null handling), not repeating the sanitization logic tests.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { sanitizeHtml, SafeHtml } from '../../utils/sanitize';

// ── sanitizeHtml() — pure function tests ──────────────────────────────────────

describe('sanitizeHtml()', () => {
  // ── Edge cases: falsy inputs ────────────────────────────────────────────────

  it('returns empty string for null', () => {
    expect(sanitizeHtml(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(sanitizeHtml(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  // ── XSS attack vectors ──────────────────────────────────────────────────────

  it('strips <script> tags', () => {
    const result = sanitizeHtml('<script>alert("xss")</script><p>Hello</p>');
    expect(result).not.toContain('<script>');
    // The safe text content must survive
    expect(result).toContain('Hello');
  });

  it('strips javascript: href (classic XSS vector)', () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click me</a>');
    expect(result).not.toContain('javascript:');
  });

  it('strips inline event handlers (onerror, onclick, …)', () => {
    const result = sanitizeHtml('<img onerror="alert(1)" src="x.png">');
    expect(result).not.toContain('onerror');
  });

  it('strips <iframe> with dangerous srcdoc', () => {
    const result = sanitizeHtml('<iframe srcdoc="<script>alert(1)</script>"></iframe>');
    expect(result).not.toContain('srcdoc');
  });

  // ── Allowed HTML elements must survive sanitization ─────────────────────────

  it('preserves <p>, <strong>, <em>', () => {
    const result = sanitizeHtml('<p><strong>Bold</strong> and <em>italic</em></p>');
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
  });

  it('preserves headings h1 through h6', () => {
    const html = '<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>';
    const result = sanitizeHtml(html);
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
      expect(result).toContain(`<${tag}>`);
    });
  });

  it('preserves unordered and ordered lists', () => {
    const result = sanitizeHtml('<ul><li>A</li></ul><ol><li>B</li></ol>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>');
  });

  it('preserves anchor tags with safe https href', () => {
    const result = sanitizeHtml('<a href="https://example.com" target="_blank">Link</a>');
    expect(result).toContain('href="https://example.com"');
  });

  it('preserves <blockquote> and <code>', () => {
    const result = sanitizeHtml('<blockquote><code>const x = 1;</code></blockquote>');
    expect(result).toContain('<blockquote>');
    expect(result).toContain('<code>');
  });

  it('preserves table structure', () => {
    const result = sanitizeHtml(
      '<table><thead><tr><th>Col</th></tr></thead><tbody><tr><td>Val</td></tr></tbody></table>'
    );
    expect(result).toContain('<table>');
    expect(result).toContain('<th>');
    expect(result).toContain('<td>');
  });

  it('passes through plain text unchanged', () => {
    const result = sanitizeHtml('Just plain text with no HTML');
    expect(result).toBe('Just plain text with no HTML');
  });
});

// ── <SafeHtml> component tests ────────────────────────────────────────────────

describe('SafeHtml component', () => {
  it('renders sanitized HTML into the DOM', () => {
    const { container } = render(<SafeHtml html="<p><strong>Hello</strong></p>" />);
    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('Hello');
  });

  it('applies the className prop to its wrapper div', () => {
    const { container } = render(
      <SafeHtml html="<p>Content</p>" className="article-content" />
    );
    expect(container.firstChild).toHaveClass('article-content');
  });

  it('applies the style prop to its wrapper div', () => {
    const { container } = render(
      <SafeHtml html="<p>Styled</p>" style={{ color: 'red' }} />
    );
    // Access the DOM style property directly — more reliable than toHaveStyle()
    // because jsdom can normalize colour values differently across environments.
    expect(container.firstChild.style.color).toBe('red');
  });

  it('renders an empty wrapper div when html is null', () => {
    const { container } = render(<SafeHtml html={null} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild.innerHTML).toBe('');
  });

  it('does not render <script> tags injected via html prop (XSS guard)', () => {
    const { container } = render(
      <SafeHtml html={'<script>alert("xss")</script><p>Safe content</p>'} />
    );
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('p')).toHaveTextContent('Safe content');
  });
});
