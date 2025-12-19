import React from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link, Navigate } from 'react-router-dom';
import { newsItems } from '../data/content';
import { FaArrowLeft, FaCalendarAlt, FaShareAlt } from 'react-icons/fa';

const NewsDetail = () => {
  const { slug } = useParams();

  // Find the news item that matches the link "/noticias/slug"
  // Note: content.js links are full paths like "/noticias/cau-2025"
  const article = newsItems.find(item => item.link.endsWith(slug));

  if (!article) {
    return (
      <Container className="py-5 text-center">
        <h2>Notícia não encontrada</h2>
        <Button as={Link} to="/noticias" variant="primary" className="mt-3">Voltar para Notícias</Button>
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
                <span>5 min de leitura</span>
            </div>
        </div>

        {/* Content Body */}
        <div className="article-body fs-5 text-secondary mb-5" style={{ lineHeight: '1.8' }}>
            <p className="lead text-dark fw-bold mb-4">
                {article.description}
            </p>
            
            {/* Placeholder for full content simulation since we only have descriptions currently */}
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            <blockquote className="blockquote my-5 p-4 bg-light border-start border-4 border-success fst-italic rounded">
                "O biogás representa uma das fronteiras mais promissoras para a transição energética brasileira, unindo sustentabilidade e desenvolvimento econômico."
            </blockquote>

            <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-between align-items-center border-top pt-4">
            <Button as={Link} to="/noticias" variant="outline-dark" className="rounded-pill px-4">
                <FaArrowLeft className="me-2" /> Voltar
            </Button>
            <Button variant="outline-primary" className="rounded-pill px-4">
                <FaShareAlt className="me-2" /> Compartilhar
            </Button>
        </div>
      </Container>
    </article>
  );
};

export default NewsDetail;
