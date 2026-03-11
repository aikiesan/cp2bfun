import { useState, useEffect } from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchMicroscopio, fetchMicroscopia } from '../services/api';
import ArticleLayout from '../components/ArticleLayout';

const MicroscopioDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      notFound: 'Artigo não encontrado',
      backBtn: 'Voltar para Microscópio',
      back: 'Voltar',
      share: 'Compartilhar',
    },
    en: {
      notFound: 'Article not found',
      backBtn: 'Back to Microscópio',
      back: 'Back',
      share: 'Share',
    },
  }[language];

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);

      const data = await fetchMicroscopio(slug);

      if (data) {
        setArticle({
          title: language === 'pt' ? data.title_pt : (data.title_en || data.title_pt),
          description: language === 'pt' ? data.description_pt : (data.description_en || data.description_pt),
          content: language === 'pt' ? data.content_pt : (data.content_en || data.content_pt),
          image: data.image,
          badge: data.badge,
          badgeColor: data.badge_color,
          date: data.date_display,
          author: data.author || '',
          imageCaption: language === 'pt'
            ? (data.image_caption_pt || '')
            : (data.image_caption_en || data.image_caption_pt || ''),
          tags: data.tags || '',
        });

        const allArticles = await fetchMicroscopia();
        if (allArticles && allArticles.length > 0) {
          setRelatedPosts(
            allArticles
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
                link: `/microscopio/${item.slug}`,
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
    return (
      <Container className="py-5 text-center">
        <h2>{labels.notFound}</h2>
        <Button as={Link} to="/microscopio" variant="primary" className="mt-3">
          {labels.backBtn}
        </Button>
      </Container>
    );
  }

  return (
    <ArticleLayout
      article={article}
      relatedPosts={relatedPosts}
      backLink="/microscopio"
      backLabel={labels.back}
      shareLabel={labels.share}
      language={language}
    />
  );
};

export default MicroscopioDetail;
