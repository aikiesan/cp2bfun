import { useState, useEffect } from 'react';
import { Container, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { newsItems } from '../data/content';
import { FaArrowLeft, FaCalendarAlt, FaShareAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { fetchNewsArticle } from '../services/api';
import { SafeHtml } from '../utils/sanitize.jsx';

const NewsDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      notFound: 'Noticia nao encontrada',
      backBtn: 'Voltar para Noticias',
      readTime: '5 min de leitura',
      back: 'Voltar',
      share: 'Compartilhar'
    },
    en: {
      notFound: 'News not found',
      backBtn: 'Back to News',
      readTime: '5 min read',
      back: 'Back',
      share: 'Share'
    }
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
          badge: apiData.badge,
          badgeColor: apiData.badge_color,
          date: apiData.date_display,
        });
      } else {
        // Fallback to static content
        const news = newsItems[language];
        const staticArticle = news.find(item => item.link.endsWith(slug));
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
        <Button as={Link} to="/noticias" variant="primary" className="mt-3">{labels.backBtn}</Button>
      </Container>
    );
  }

  return (
    <article className="py-5">
      {/* Hero Image for Article */}
      <div className="w-100 mb-5 position-relative" style={{ height: '50vh', maxHeight: '500px', backgroundColor: '#f0f0f0' }}>
         <img
            src={article.image}
            alt={article.title}
            className="w-100 h-100 object-fit-cover"
            style={{ filter: 'brightness(0.9)' }}
         />
         <Container className="position-absolute bottom-0 start-50 translate-middle-x pb-5">
            <Badge bg={article.badgeColor} className="mb-3 px-3 py-2 rounded-pill shadow-sm">{article.badge}</Badge>
         </Container>
      </div>

      <Container style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div className="text-center mb-5 border-bottom pb-4">
            <h1 className="fw-bold mb-4 display-5">{article.title}</h1>
            <div className="d-flex justify-content-center align-items-center gap-4 text-muted small" style={{ fontFamily: 'var(--font-mono)' }}>
                <span><FaCalendarAlt className="me-2"/>{article.date}</span>
                <span>-</span>
                <span>{labels.readTime}</span>
            </div>
        </div>

        {/* Content Body */}
        <div className="article-body fs-5 text-secondary mb-5" style={{ lineHeight: '1.8' }}>
            <p className="lead text-dark fw-bold mb-4">
                {article.description}
            </p>

            {article.content ? (
              <SafeHtml html={article.content} className="article-content" />
            ) : (
              <>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <blockquote className="blockquote my-5 p-4 bg-light border-start border-4 border-success fst-italic rounded">
                    {language === 'pt' ? '"O biogas representa uma das fronteiras mais promissoras para a transicao energetica brasileira..."' : '"Biogas represents one of the most promising frontiers for the Brazilian energy transition..."'}
                </blockquote>

                <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </>
            )}
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-between align-items-center border-top pt-4">
            <Button as={Link} to="/noticias" variant="outline-dark" className="rounded-pill px-4">
                <FaArrowLeft className="me-2" /> {labels.back}
            </Button>
            <Button variant="outline-primary" className="rounded-pill px-4">
                <FaShareAlt className="me-2" /> {labels.share}
            </Button>
        </div>
      </Container>
    </article>
  );
};

export default NewsDetail;
