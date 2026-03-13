import { useState, useEffect } from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { newsItems } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchNewsArticle, fetchNews } from '../services/api';
import ArticleLayout from '../components/ArticleLayout';

const NewsDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      notFound: 'Notícia não encontrada',
      backBtn: 'Voltar para Notícias',
      back: 'Voltar',
      share: 'Compartilhar',
    },
    en: {
      notFound: 'News not found',
      backBtn: 'Back to News',
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
          imagePosition: apiData.image_position || 'center center',
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
    return (
      <Container className="py-5 text-center">
        <h2>{labels.notFound}</h2>
        <Button as={Link} to="/noticias" variant="primary" className="mt-3">
          {labels.backBtn}
        </Button>
      </Container>
    );
  }

  return (
    <ArticleLayout
      article={article}
      relatedPosts={relatedPosts}
      backLink="/noticias"
      backLabel={labels.back}
      shareLabel={labels.share}
      language={language}
    />
  );
};

export default NewsDetail;
