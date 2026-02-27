import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { getCategoryColor } from '../utils/categoryColor';
import { SafeHtml } from '../utils/sanitize.jsx';
import RelatedPosts from './RelatedPosts';

const ArticleLayout = ({
  article,
  relatedPosts,
  backLink,
  backLabel,
  shareLabel,
  language,
}) => {
  if (!article) return null;

  const { title, description, content, image, badge, badgeColor, date, author, imageCaption, tags } = article;
  const categoryColor = getCategoryColor(badgeColor);

  const handleShare = () => {
    navigator.share?.({
      title,
      url: window.location.href,
    });
  };

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
          <Button
            as={Link}
            to={backLink}
            variant="outline-dark"
            className="rounded-pill px-4"
          >
            <FaArrowLeft className="me-2" />
            {backLabel}
          </Button>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4"
            onClick={handleShare}
          >
            <FaShareAlt className="me-2" />
            {shareLabel}
          </Button>
        </div>

      </Container>

      {/* 8. Related posts (full-width section) */}
      <RelatedPosts posts={relatedPosts} language={language} />

    </article>
  );
};

export default ArticleLayout;
