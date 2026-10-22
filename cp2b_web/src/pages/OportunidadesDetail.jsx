import { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchOpportunity, fetchOpportunities } from '../services/api';
import ArticleLayout from '../components/ArticleLayout';
import SeoHead from '../components/SeoHead';
import NotFound from './NotFound';

const OportunidadesDetail = () => {
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

      const data = await fetchOpportunity(slug);

      if (data) {
        setArticle({
          title: language === 'pt' ? data.title_pt : (data.title_en || data.title_pt),
          description: language === 'pt' ? data.description_pt : (data.description_en || data.description_pt),
          content: language === 'pt' ? data.content_pt : (data.content_en || data.content_pt),
          image: data.image,
          imagePosition: data.image_position || '50% 50%',
          badge: data.badge,
          badgeColor: data.badge_color,
          date: data.date_display,
          author: data.author || '',
          imageCaption: language === 'pt'
            ? (data.image_caption_pt || '')
            : (data.image_caption_en || data.image_caption_pt || ''),
          tags: data.tags || '',
        });

        const allOpportunities = await fetchOpportunities();
        if (allOpportunities && allOpportunities.length > 0) {
          setRelatedPosts(
            allOpportunities
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
                link: `/oportunidades/${item.slug}`,
              }))
          );
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
      backLink="/oportunidades"
      backLabel={labels.back}
      shareLabel={labels.share}
      language={language}
    />
    </>
  );
};

export default OportunidadesDetail;
