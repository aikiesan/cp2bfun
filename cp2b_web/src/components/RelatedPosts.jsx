import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { getCategoryColor } from '../utils/categoryColor';

const relatedLabels = {
  pt: 'Leia também',
  en: 'Read also',
};

const RelatedPosts = ({ posts, language }) => {
  if (!posts || posts.length === 0) return null;

  const heading = relatedLabels[language] || relatedLabels.pt;

  return (
    <section className="article-related-section">
      <Container style={{ maxWidth: '980px' }}>
        <h4 className="article-related-heading">{heading}</h4>
        <div className="article-related-grid">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              to={post.link}
              className="article-related-card"
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
