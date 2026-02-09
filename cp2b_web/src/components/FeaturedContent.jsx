import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';

const FeaturedContent = ({ itemA, itemB, itemC }) => {
  const { language } = useLanguage();

  const renderHeadline = (item, size = 'large') => {
    if (!item) {
      return (
        <div className={`featured-headline featured-headline-${size} featured-headline-empty`}>
          <div className="featured-headline-content">
            <p className="text-muted">
              {language === 'pt' ? 'Nenhum conteúdo em destaque' : 'No featured content'}
            </p>
          </div>
        </div>
      );
    }

    const title = language === 'pt' ? item.title_pt : item.title_en || item.title_pt;
    const description = language === 'pt' ? item.description_pt : item.description_en || item.description_pt;

    // Determine link path based on content type
    const linkPath = item.content_type === 'project'
      ? `/projetos/${item.slug}`
      : `/noticias/${item.slug}`;

    return (
      <Link to={linkPath} className="text-decoration-none">
        <motion.div
          className={`featured-headline featured-headline-${size}`}
          style={{
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="featured-headline-overlay" />
          <div className="featured-headline-content">
            {item.badge && (
              <Badge bg={item.badge_color || 'primary'} className="mb-2">
                {item.badge}
              </Badge>
            )}
            <h2 className={size === 'large' ? 'display-4' : 'h3'}>{title}</h2>
            <p className="featured-headline-date text-white-50 mb-2">
              <i className="bi bi-calendar me-2"></i>
              {item.date_display}
            </p>
            {size === 'large' && description && (
              <p className="featured-headline-excerpt">{description.substring(0, 150)}...</p>
            )}
          </div>
        </motion.div>
      </Link>
    );
  };

  return (
    <section className="featured-news-section">
      <div className="featured-news-container">
        {/* Left: Headline A (50% width, full height) */}
        <div className="featured-news-main">
          {renderHeadline(itemA, 'large')}
        </div>

        {/* Right: Headlines B and C stacked (50% width, split height) */}
        <div className="featured-news-secondary">
          <div className="featured-news-top">
            {renderHeadline(itemB, 'small')}
          </div>
          <div className="featured-news-bottom">
            {renderHeadline(itemC, 'small')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
