import React from 'react';
import { Container, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { newsItems } from '../data/content';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import SocialShare from '../components/SocialShare';

const NewsDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const news = newsItems[language];

  // Find the news item that matches the link "/noticias/slug"
  const article = news.find(item => item.link.endsWith(slug));

  const labels = {
    pt: {
      notFound: 'Notícia não encontrada',
      backBtn: 'Voltar para Notícias',
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
                <span>•</span>
                <span>{labels.readTime}</span>
            </div>
        </div>

        {/* Content Body */}
        <div className="article-body fs-5 text-secondary mb-5" style={{ lineHeight: '1.8' }}>
            <p className="lead text-dark fw-bold mb-4">
                {article.description}
            </p>
            
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            <blockquote className="blockquote my-5 p-4 bg-light border-start border-4 border-success fst-italic rounded">
                {language === 'pt' ? '"O biogás representa uma das fronteiras mais promissoras para a transição energética brasileira..."' : '"Biogas represents one of the most promising frontiers for the Brazilian energy transition..."'}
            </blockquote>

            <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-between align-items-center border-top pt-4">
            <Button as={Link} to="/noticias" variant="outline-dark" className="rounded-pill px-4">
                <FaArrowLeft className="me-2" /> {labels.back}
            </Button>
            <SocialShare
              title={article.title}
              description={article.description}
              compact
            />
        </div>
      </Container>
    </article>
  );
};

export default NewsDetail;
