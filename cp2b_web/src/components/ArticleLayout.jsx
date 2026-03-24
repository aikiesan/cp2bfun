import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaWhatsapp, FaTelegramPlane, FaLinkedinIn } from 'react-icons/fa';
import { getCategoryColor } from '../utils/categoryColor';
import { SafeHtml } from '../utils/sanitize.jsx';
import RelatedPosts from './RelatedPosts';

const ArticleLayout = ({
  article,
  relatedPosts,
  backLink,
  backLabel,
  language,
}) => {
  if (!article) return null;

  const { title, description, content, image, imagePosition, badge, badgeColor, date, author, imageCaption, tags } = article;

  const url = encodeURIComponent(window.location.href);
  const tituloEncoded = encodeURIComponent(title); // Adaptado para usar o 'title' do seu arquivo

  const whatsappUrl = `https://wa.me/?text=${tituloEncoded}%20${url}`;
  const telegramUrl = `https://t.me/share/url?url=${url}&text=${tituloEncoded}`;
  const linkedinUrl = `https://linkedin.com/sharing/share-offsite/?url=${url}`;

  const categoryColor = getCategoryColor(badgeColor);


  const renderContent = () => {
    if (content) {
      return (
        <SafeHtml
          html={content}
          className="article-content article-fapesp-content"
        />
      );
    }
    if (description) {
      return <p>{description}</p>;
    }
    return (
      <p className="text-muted fst-italic">
        {language === 'pt' ? 'Conteúdo indisponível.' : 'Content not available.'}
      </p>
    );
  };

  return (
    <article className="article-fapesp-page py-5">
      <Container style={{ maxWidth: '980px' }}>

        {/* 1. Category tag */}
        {badge && (
          <p className="article-fapesp-category" style={{ color: categoryColor }}>
            {badge}
          </p>
        )}

        {/* 2. H1 Title */}
        <h1 className="article-fapesp-title">{title}</h1>

        {/* 3. Deck / Subtitle */}
        {description && (
          <p className="article-fapesp-deck">{description}</p>
        )}

        {/* 4. Hero image + optional caption */}
        {image && (
          <figure className="article-fapesp-figure">
            <img
              src={image}
              alt={title}
              className="article-fapesp-hero"
              style={imagePosition ? { objectPosition: imagePosition } : undefined}
            />
            {imageCaption && (
              <figcaption className="article-fapesp-caption">{imageCaption}</figcaption>
            )}
          </figure>
        )}

        {/* 5. Three-column editorial grid */}
        <div className="article-fapesp-grid">

          {/* Left sidebar */}
          <aside className="article-fapesp-sidebar">
            <hr className="article-fapesp-hr" />
            {author && (
              <span className="article-fapesp-sidebar-author">{author}</span>
            )}
            {date && (
              <>
                {author && <hr className="article-fapesp-hr" />}
                <time className="article-fapesp-sidebar-date">{date}</time>
              </>
            )}
            {badge && (
              <>
                <hr className="article-fapesp-hr" />
                <span
                  className="article-fapesp-sidebar-tag"
                  style={{ color: categoryColor }}
                >
                  {badge}
                </span>
              </>
            )}
            <hr className="article-fapesp-hr" />
          </aside>

          {/* Center: article body */}
          <div className="article-fapesp-body">
            {renderContent()}
          </div>

          {/* Right spacer */}
          <div className="article-fapesp-spacer" aria-hidden="true" />

        </div>

        {/* 6. Tags/keywords — use tags field if available, fall back to badge */}
        {(tags && tags.trim()) ? (
          <div className="article-fapesp-tags">
            {tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
              <span key={tag} className="article-fapesp-tag-chip">{tag}</span>
            ))}
          </div>
        ) : badge ? (
          <div className="article-fapesp-tags">
            <span className="article-fapesp-tag-chip">{badge}</span>
          </div>
        ) : null}

        {/* 7. Footer actions */}
        <div className="article-fapesp-actions d-flex justify-content-between align-items-center">
          
          {/* Filho 1: Botão Voltar (Fica na esquerda) */}
          <Button
            as={Link}
            to={backLink}
            variant="outline-dark"
            className="rounded-pill px-4"
          >
            <FaArrowLeft className="me-2" />
            {backLabel}
          </Button>

          {/* Filho 2: Caixinha das redes sociais (Fica na direita) */}
          <div className="d-flex gap-3"> 
            <Button
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-success"
              className="rounded-pill px-4 border border-success"
            >
              <FaWhatsapp className="me-2" size={18} /> WhatsApp
            </Button>
            
            <Button
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-info"
              className="rounded-pill px-4 border border-info"
            >
              <FaTelegramPlane className="me-2" size={18} /> Telegram
            </Button>
            
            <Button
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-primary"
              className="rounded-pill px-4"
            >
              <FaLinkedinIn className="me-2" size={18} /> LinkedIn
            </Button>
          </div>
          
        </div>

      </Container>

      {/* 8. Related posts (full-width section) */}
      <RelatedPosts posts={relatedPosts} language={language} />

    </article>
  );
};

export default ArticleLayout;
