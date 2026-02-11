import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { FaPlay } from 'react-icons/fa';

/**
 * FeaturedVideos Component
 * Displays 3 YouTube videos in A/B_C layout (one large left, two stacked right)
 * Reuses .featured-news-* CSS classes for consistent styling
 */
const FeaturedVideos = ({ itemA, itemB, itemC }) => {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  // Video card component
  const VideoCard = ({ video, className }) => {
    if (!video) {
      return (
        <div className={`${className} d-flex align-items-center justify-content-center bg-light`}>
          <p className="text-muted mb-0">Sem vídeo</p>
        </div>
      );
    }

    const title = language === 'pt' ? video.title_pt : (video.title_en || video.title_pt);
    const description = language === 'pt' ? video.description_pt : (video.description_en || video.description_pt);

    return (
      <div
        className={`${className} position-relative overflow-hidden cursor-pointer`}
        onClick={() => handleVideoClick(video)}
        style={{ cursor: 'pointer' }}
      >
        {/* Thumbnail */}
        <img
          src={video.thumbnail_url}
          alt={title}
          className="w-100 h-100 object-fit-cover"
          style={{ filter: 'brightness(0.7)' }}
        />

        {/* Play button overlay */}
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FaPlay style={{ fontSize: '2rem', color: '#dc3545', marginLeft: '6px' }} />
        </div>

        {/* Text overlay */}
        <div className="featured-headline-content position-absolute bottom-0 start-0 end-0 text-white p-4">
          {video.date_display && (
            <div className="text-white-50 small mb-2">{video.date_display}</div>
          )}
          <h2 className="fw-bold text-white mb-2">{title}</h2>
          {description && (
            <p className="text-white-50 mb-0 small" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {description}
            </p>
          )}
        </div>

        {/* Hover overlay effect */}
        <div className="hover-overlay"></div>
      </div>
    );
  };

  return (
    <>
      <div className="featured-news-grid">
        {/* Column A - Large video (left) */}
        <VideoCard
          video={itemA}
          className="featured-news-large featured-headline-large"
        />

        {/* Column B/C - Stacked videos (right) */}
        <div className="featured-news-small-container">
          <VideoCard
            video={itemB}
            className="featured-news-top featured-headline-small"
          />
          <VideoCard
            video={itemC}
            className="featured-news-bottom featured-headline-small"
          />
        </div>
      </div>

      {/* Video Player Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedVideo && (language === 'pt' ? selectedVideo.title_pt : (selectedVideo.title_en || selectedVideo.title_pt))}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedVideo && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`}
                title={language === 'pt' ? selectedVideo.title_pt : (selectedVideo.title_en || selectedVideo.title_pt)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FeaturedVideos;
