import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';

const FeaturedNews = ({ newsA, newsB, newsC }) => {
  const { language } = useLanguage();

  const renderHeadline = (news, size = 'large') => {
    if (!news) {
      return (
        <div className={`featured-headline featured-headline-${size} featured-headline-empty`}>
          <div className="featured-headline-content">
            <p className="text-muted">
              {language === 'pt' ? 'Nenhuma notícia em destaque' : 'No featured news'}
            </p>
          </div>
        </div>
      );
    }

    const title = language === 'pt' ? news.title_pt : news.title_en || news.title_pt;
    const description = language === 'pt' ? news.description_pt : news.description_en || news.description_pt;

    return (
      <Link to={`/noticias/${news.slug}`} className="text-decoration-none">
        <motion.div
          className={`featured-headline featured-headline-${size}`}
          style={{
            backgroundImage: `url(${news.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="featured-headline-overlay" />
          <div className="featured-headline-content">
            {news.badge && (
              <Badge bg={news.badge_color || 'primary'} className="mb-2">
                {news.badge}
              </Badge>
            )}
            <h2 className={size === 'large' ? 'display-4' : 'h3'}>{title}</h2>
            <p className="featured-headline-date text-white-50 mb-2">
              <i className="bi bi-calendar me-2"></i>
              {news.date_display}
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
          {renderHeadline(newsA, 'large')}
        </div>

        {/* Right: Headlines B and C stacked (50% width, split height) */}
        <div className="featured-news-secondary">
          <div className="featured-news-top">
            {renderHeadline(newsB, 'small')}
          </div>
          <div className="featured-news-bottom">
            {renderHeadline(newsC, 'small')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
