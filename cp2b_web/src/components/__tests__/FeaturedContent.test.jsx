import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import FeaturedContent from '../FeaturedContent';

const item = (overrides = {}) => ({
  slug: 'meu-slug',
  title_pt: 'Título destaque',
  title_en: 'Headline title',
  description_pt: 'Resumo do conteúdo em destaque para o leitor.',
  image: '/assets/DSC00361-1920x748.jpg',
  badge: 'Notícia',
  badge_color: 'success',
  date_display: '10 MAR 2025',
  ...overrides,
});

describe('FeaturedContent', () => {
  it('renders the headline image as an <img> element and renders badge + title', () => {
    const { container } = renderWithProviders(<FeaturedContent itemA={item()} itemB={null} itemC={null} />);

    const headline = container.querySelector('.featured-headline-large');
    const img = headline.querySelector('img.featured-image-bg');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/assets/DSC00361-1920x748.jpg');
    expect(screen.getByText('Título destaque')).toBeInTheDocument();
    expect(screen.getByText('Notícia')).toBeInTheDocument();
  });

  it('renders the image and dark overlay only when the item has an image', () => {
    const { container } = renderWithProviders(
      <FeaturedContent itemA={item()} itemB={item({ slug: 'sem-img', image: undefined })} itemC={null} />
    );
    const headlines = container.querySelectorAll('.featured-headline');
    const withImage = [...headlines].find((el) => el.querySelector('img.featured-image-bg'));
    const withoutImage = [...headlines].find((el) => !el.querySelector('img.featured-image-bg') && el.style.backgroundColor);

    // Image slot keeps the dark gradient overlay; imageless slot must not (avoids black bars).
    expect(withImage.querySelector('.featured-headline-overlay')).toBeTruthy();
    expect(withoutImage.querySelector('.featured-headline-overlay')).toBeNull();
    expect(withoutImage.querySelector('img.featured-image-bg')).toBeNull();
    expect(withoutImage.style.backgroundColor).toBe('rgb(45, 55, 72)');
  });

  it('shows the empty state for a null slot', () => {
    renderWithProviders(<FeaturedContent itemA={null} itemB={null} itemC={null} />);
    expect(screen.getAllByText('Nenhum conteúdo em destaque').length).toBe(3);
  });

  it.each([
    ['news', undefined, '/noticias/meu-slug'],
    ['project', 'project', '/projetos/meu-slug'],
    ['microscopio', 'microscopio', '/microscopio/meu-slug'],
    ['opportunity', 'opportunity', '/oportunidades/meu-slug'],
  ])('links a %s headline to the correct route', (_label, contentType, expectedHref) => {
    const { container } = renderWithProviders(
      <FeaturedContent itemA={item({ content_type: contentType })} itemB={null} itemC={null} />
    );
    const anchor = container.querySelector('.featured-headline-large').closest('a');
    expect(anchor).toHaveAttribute('href', expectedHref);
  });
});
