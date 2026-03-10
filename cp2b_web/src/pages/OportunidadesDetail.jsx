import { useState, useEffect } from 'react';
import { Container, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaShareAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { fetchOpportunity } from '../services/api';
import { SafeHtml } from '../utils/sanitize.jsx';

const OportunidadesDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      notFound: 'Oportunidade nao encontrada',
      backBtn: 'Voltar para Oportunidades',
      readTime: '5 min de leitura',
      back: 'Voltar',
      share: 'Compartilhar'
    },
    en: {
      notFound: 'Opportunity not found',
      backBtn: 'Back to Opportunities',
      readTime: '5 min read',
      back: 'Back',
      share: 'Share'
    }
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
          badge: data.badge,
          badgeColor: data.badge_color,
          date: data.date_display,
        });
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
        <Button as={Link} to="/oportunidades" variant="primary" className="mt-3">{labels.backBtn}</Button>
      </Container>
    );
  }

  return (
    <article className="py-5">
      {article.image && (
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
      )}

      <Container style={{ maxWidth: '800px' }}>
        <div className="text-center mb-5 border-bottom pb-4">
          <h1 className="fw-bold mb-4 display-5">{article.title}</h1>
          <div className="d-flex justify-content-center align-items-center gap-4 text-muted small" style={{ fontFamily: 'var(--font-mono)' }}>
            <span><FaCalendarAlt className="me-2" />{article.date}</span>
            <span>-</span>
            <span>{labels.readTime}</span>
          </div>
        </div>

        <div className="article-body fs-5 text-secondary mb-5" style={{ lineHeight: '1.8' }}>
          <p className="lead text-dark fw-bold mb-4">
            {article.description}
          </p>

          {article.content ? (
            <SafeHtml html={article.content} className="article-content" />
          ) : (
            <p className="text-muted fst-italic">Conteudo completo nao disponivel.</p>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center border-top pt-4">
          <Button as={Link} to="/oportunidades" variant="outline-dark" className="rounded-pill px-4">
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

export default OportunidadesDetail;
