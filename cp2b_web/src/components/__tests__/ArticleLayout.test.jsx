import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';

// jsdom has no layout and no scrolling, so "in view", the OS motion setting
// and the scroll progress are driven from here. The spring is swapped for a
// value of its own, so a test can tell which of the two the bar follows.
const motion = vi.hoisted(() => ({ inView: false, reduce: false, progress: 0.75, spring: 0.25 }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useInView: () => motion.inView,
    useReducedMotion: () => motion.reduce,
    useScroll: () => ({ scrollYProgress: actual.motionValue(motion.progress) }),
    useSpring: () => actual.motionValue(motion.spring),
  };
});

import ArticleLayout from '../ArticleLayout';

const article = {
  title: 'Biogás e Descarbonização no Estado de São Paulo',
  description: 'Pesquisa inovadora em digestão anaeróbia.',
  content: '<p>O projeto desenvolve tecnologias em bioenergia.</p>',
  image: '/assets/DSC00339-500x333.jpg',
  badge: 'Pesquisa',
  badgeColor: 'green',
  date: '18 DEZ 2025',
};

const related = [
  { id: 1, title: 'Primeira', link: '/noticias/a', image: '/assets/a.jpg', date: '01 JAN 2026' },
  { id: 2, title: 'Segunda', link: '/noticias/b', date: '02 JAN 2026' },
  { id: 3, title: 'Terceira', link: '/noticias/c', date: '03 JAN 2026' },
];

const renderArticle = (props = {}) =>
  renderWithProviders(
    <ArticleLayout article={article} relatedPosts={related} backLink="/noticias" backLabel="Voltar" language="pt" {...props} />,
  );

const bar = () => document.body.querySelector('.reading-progress');

// Give every element a layout box of the given height.
const giveLayout = (height) =>
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0, bottom: height, left: 0, right: 980, width: 980, height, x: 0, y: 0,
  });

beforeEach(() => {
  motion.inView = false;
  motion.reduce = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ArticleLayout — reading progress', () => {
  it('renders one decorative progress bar at the top of <body>, out of the accessibility tree', () => {
    const { container } = renderArticle();
    const el = bar();
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-hidden', 'true');
    // Portalled out of the page, so the navbar's stacking context cannot cover it.
    expect(el.parentElement).toBe(document.body);
    expect(container.contains(el)).toBe(false);
    expect(document.body.querySelectorAll('.reading-progress')).toHaveLength(1);
  });

  it('removes the bar when the article goes away', () => {
    const { unmount } = renderArticle();
    unmount();
    expect(bar()).toBeNull();
  });

  it('glides on a spring normally, and follows the scroll directly with reduced motion', () => {
    const { unmount } = renderArticle();
    expect(bar().style.transform).toBe('scaleX(0.25)');
    unmount();

    motion.reduce = true;
    renderArticle();
    expect(bar().style.transform).toBe('scaleX(0.75)');
  });

  it('rests while the article fits in the window and tracks once it is taller', () => {
    const { unmount } = renderArticle();
    // No layout in jsdom: 0px of article is not taller than the window.
    expect(bar()).toHaveAttribute('data-idle');
    unmount();

    giveLayout(3000);
    renderArticle();
    expect(bar()).not.toHaveAttribute('data-idle');
  });

  it('does not render a bar when there is no article', () => {
    renderWithProviders(<ArticleLayout article={null} relatedPosts={[]} backLink="/" backLabel="Voltar" language="pt" />);
    expect(bar()).toBeNull();
  });
});

describe('ArticleLayout — opening photo', () => {
  it('wraps the photo in a cropping frame and marks it once it has loaded', () => {
    renderArticle();
    const img = screen.getByAltText(article.title);
    const frame = img.parentElement;
    expect(frame).toHaveClass('article-hero-frame');
    expect(frame.parentElement).toHaveClass('article-fapesp-figure');
    expect(frame).not.toHaveAttribute('data-loaded');

    fireEvent.load(img);
    expect(frame).toHaveAttribute('data-loaded');
  });

  it('releases the starting pose when the photo fails to load', () => {
    renderArticle();
    const img = screen.getByAltText(article.title);
    fireEvent.error(img);
    expect(img.parentElement).toHaveAttribute('data-loaded');
  });

  it('keeps the title as one plain text node', () => {
    renderArticle();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(screen.getByText(article.title)).toBe(heading);
    expect(heading.children).toHaveLength(0);
  });
});

describe('ArticleLayout — related posts', () => {
  const grid = () => document.querySelector('.article-related-grid');

  it('shows the cards in their final state when there is no layout', () => {
    renderArticle();
    expect(grid()).not.toHaveAttribute('data-reveal');
    expect(grid().querySelectorAll('.article-related-card')).toHaveLength(3);
  });

  it('holds the cards until the row scrolls into view, then lets them cascade in order', () => {
    giveLayout(400);
    const { rerender } = renderArticle();
    expect(grid()).toHaveAttribute('data-reveal', 'armed');

    motion.inView = true;
    rerender(<ArticleLayout article={article} relatedPosts={related} backLink="/noticias" backLabel="Voltar" language="pt" />);
    expect(grid()).toHaveAttribute('data-reveal', 'shown');
    const delays = [...grid().querySelectorAll('.article-related-card')].map((card) => card.style.getPropertyValue('--i'));
    expect(delays).toEqual(['0', '1', '2']);
  });

  it('never arms under reduced motion', () => {
    motion.reduce = true;
    giveLayout(400);
    renderArticle();
    expect(grid()).not.toHaveAttribute('data-reveal');
  });
});
