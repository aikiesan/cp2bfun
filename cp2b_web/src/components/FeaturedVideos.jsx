import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { FaPlay } from 'react-icons/fa';

/**
 * FeaturedVideos Component
 * Left: inline YouTube player for the active video
 * Right: scrollable playlist of all provided videos
 * If only 1 video: full-width, no playlist
 */
const FeaturedVideos = ({ itemA, itemB, itemC }) => {
  const { language } = useLanguage();

  const videos = [itemA, itemB, itemC].filter(Boolean);
  const [activeVideo, setActiveVideo] = useState(videos[0] || null);
  const [playing, setPlaying] = useState(false);

  if (videos.length === 0) return null;

  const getTitle = (v) =>
    language === 'pt' ? v.title_pt : (v.title_en || v.title_pt);
  const getDescription = (v) =>
    language === 'pt' ? v.description_pt : (v.description_en || v.description_pt);

  const handleSelect = (video) => {
    setActiveVideo(video);
    setPlaying(true);
  };

  const handlePlay = () => setPlaying(true);

  const single = videos.length === 1;

  return (
    <div className="container">
      <Row className="g-0 overflow-hidden rounded-4 shadow-lg" style={{ minHeight: '360px' }}>

        {/* ── Left: player ── */}
        <Col lg={single ? 12 : 8} className="position-relative bg-black">
          {playing ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                key={activeVideo.youtube_id}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1`}
                title={getTitle(activeVideo)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="position-relative w-100 h-100 cursor-pointer"
              style={{ minHeight: '360px', cursor: 'pointer' }}
              onClick={handlePlay}
            >
              <img
                src={activeVideo.thumbnail_url}
                alt={getTitle(activeVideo)}
                className="w-100 h-100"
                style={{ objectFit: 'cover', filter: 'brightness(0.65)', minHeight: '360px' }}
              />
              {/* Play button */}
              <div
                className="position-absolute top-50 start-50 translate-middle"
                style={{
                  width: '72px', height: '72px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <FaPlay style={{ fontSize: '1.6rem', color: '#dc3545', marginLeft: '5px' }} />
              </div>
              {/* Text overlay */}
              <div
                className="position-absolute bottom-0 start-0 end-0 text-white p-4"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
              >
                {activeVideo.date_display && (
                  <div className="text-white-50 small mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
                    {activeVideo.date_display}
                  </div>
                )}
                <h3 className="fw-bold text-white mb-1">{getTitle(activeVideo)}</h3>
                {getDescription(activeVideo) && (
                  <p className="text-white-50 mb-0 small" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {getDescription(activeVideo)}
                  </p>
                )}
              </div>
            </div>
          )}
        </Col>

        {/* ── Right: playlist (hidden for single video) ── */}
        {!single && (
          <Col lg={4} className="d-flex flex-column" style={{ background: '#111', overflowY: 'auto', maxHeight: '500px' }}>
            {videos.map((video) => {
              const isActive = activeVideo?.youtube_id === video.youtube_id;
              return (
                <div
                  key={video.youtube_id}
                  onClick={() => handleSelect(video)}
                  style={{
                    cursor: 'pointer',
                    borderLeft: isActive ? '3px solid #dc3545' : '3px solid transparent',
                    background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                    transition: 'background 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  className="d-flex gap-2 p-3 align-items-start"
                >
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', flexShrink: 0, width: '90px', height: '54px', borderRadius: '6px', overflow: 'hidden' }}>
                    <img
                      src={video.thumbnail_url}
                      alt={getTitle(video)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FaPlay style={{ fontSize: '0.75rem', color: isActive ? '#dc3545' : 'rgba(255,255,255,0.7)' }} />
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ minWidth: 0 }}>
                    <p className="mb-0 fw-semibold text-white small" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.3',
                    }}>
                      {getTitle(video)}
                    </p>
                    {video.date_display && (
                      <p className="mb-0 text-white-50" style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                        {video.date_display}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default FeaturedVideos;
