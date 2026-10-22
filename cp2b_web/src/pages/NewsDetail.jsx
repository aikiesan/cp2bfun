import { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { newsItems } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchNewsArticle, fetchNews } from '../services/api';
import ArticleLayout from '../components/ArticleLayout';
import SeoHead from '../components/SeoHead';
import NotFound from './NotFound';

const NewsDetail = () => {
  const DOMAIN = 'https://cp2b.unicamp.br';
  const { slug } = useParams();
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      back: 'Voltar',
      share: 'Compartilhar',
    },
    en: {
      back: 'Back',
      share: 'Share',
    },
  }[language];

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);

      // Try to fetch from API first
      const apiData = await fetchNewsArticle(slug);

      if (apiData) {
        setArticle({
          title: language === 'pt' ? apiData.title_pt : (apiData.title_en || apiData.title_pt),
          description: language === 'pt' ? apiData.description_pt : (apiData.description_en || apiData.description_pt),
          content: language === 'pt' ? apiData.content_pt : (apiData.content_en || apiData.content_pt),
          image: apiData.image,
          imagePosition: apiData.image_position || '50% 50%',
          badge: apiData.badge,
          badgeColor: apiData.badge_color,
          date: apiData.date_display,
          author: apiData.author || '',
          imageCaption: language === 'pt'
            ? (apiData.image_caption_pt || '')
            : (apiData.image_caption_en || apiData.image_caption_pt || ''),
          tags: apiData.tags || '',
        });

        // Fetch related news (same source, exclude current slug)
        const allNews = await fetchNews();
        if (allNews && allNews.length > 0) {
          setRelatedPosts(
            allNews
              .filter((item) => item.slug !== slug)
              .slice(0, 3)
              .map((item) => ({
                id: item.id,
                title: language === 'pt' ? item.title_pt : (item.title_en || item.title_pt),
                description: language === 'pt' ? item.description_pt : (item.description_en || item.description_pt),
                image: item.image,
                badge: item.badge,
                badgeColor: item.badge_color,
                date: item.date_display,
                link: `/noticias/${item.slug}`,
              }))
          );
        }
      } else {
        // Fallback to static content
        const news = newsItems[language];
        const staticArticle = news.find((item) => item.link.endsWith(slug));
        if (staticArticle) {
          setArticle({
            ...staticArticle,
            content: null, // Static doesn't have full content
          });
        }
      }

      setLoading(false);
    };

    loadArticle();
  }, [slug, language]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!article) {
    return <NotFound />;
  }

  const articleJsonLd = article ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image ? (article.image.startsWith('http') ? article.image : `${DOMAIN}${article.image}`) : undefined,
    datePublished: article.date,
    author: { '@type': 'Organization', name: 'CP2b' },
    publisher: { '@type': 'Organization', name: 'CP2b', logo: { '@type': 'ImageObject', url: 'https://cp2b.unicamp.br/assets/logos/cp2b-logo-og.png' } },
  } : null;

  return (
    <>
      {article && (
        <SeoHead
          title={article.title}
          description={article.description}
          path={pathname}
          image={article.image}
          type="article"
          language={language}
          jsonLd={articleJsonLd}
        />
      )}
      <ArticleLayout
        article={article}
      relatedPosts={relatedPosts}
      backLink="/noticias"
      backLabel={labels.back}
      shareLabel={labels.share}
      language={language}
    />
    </>
  );
};

export default NewsDetail;
