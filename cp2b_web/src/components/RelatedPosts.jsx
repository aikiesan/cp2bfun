import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { getCategoryColor } from '../utils/categoryColor';
import useScrollReveal from '../hooks/useScrollReveal';
import './RelatedPosts.css';

const relatedLabels = {
  pt: 'Leia também',
  en: 'Read also',
};

const RelatedPosts = ({ posts, language }) => {
  // The cards arrive one after another the first time the row scrolls into
  // view (see RelatedPosts.css), as soon as its top edge shows ('some'). A
  // fraction of the row is not safe: stacked in one column on a phone, or
  // at 200% zoom on a laptop, it grows taller than the window can ever show
  // a quarter of, and the cards would stay hidden.
  const gridRef = useRef(null);
  const reveal = useScrollReveal(gridRef, { amount: 'some' });

  if (!posts || posts.length === 0) return null;

  const heading = relatedLabels[language] || relatedLabels.pt;

  return (
    <section className="article-related-section">
      <Container style={{ maxWidth: '980px' }}>
        <h4 className="article-related-heading">{heading}</h4>
        <div ref={gridRef} className="article-related-grid" data-reveal={reveal}>
          {posts.slice(0, 3).map((post, index) => (
            <Link
              key={post.id}
              to={post.link}
              className="article-related-card"
              style={{ '--i': index }}
            >
              {post.image && (
                <div className="article-related-img-wrap">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="article-related-img"
                  />
                </div>
              )}
              <div className="article-related-body">
                {post.badge && (
                  <span
                    className="article-related-category"
                    style={{ color: getCategoryColor(post.badgeColor) }}
                  >
                    {post.badge}
                  </span>
                )}
                <p className="article-related-title">{post.title}</p>
                {post.date && (
                  <time className="article-related-date">{post.date}</time>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default RelatedPosts;
