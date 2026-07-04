import { useState, useEffect, useMemo } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchGallery } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';

const Gallery = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const seo = pageSeo.gallery?.[language] || pageSeo.gallery?.pt || {};
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      eyebrow: 'Memória',
      title: 'Galeria de Fotos',
      subtitle: 'Os registros dos eventos, fóruns e atividades do CP2b, organizados por ano.',
      empty: 'Ainda não há álbuns publicados na galeria.',
      photos: 'fotos',
      photo: 'foto',
    },
    en: {
      eyebrow: 'Memory',
      title: 'Photo Gallery',
      subtitle: 'Records of CP2b events, forums and activities, organized by year.',
      empty: 'No albums have been published yet.',
      photos: 'photos',
      photo: 'photo',
    },
  }[language];

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await fetchGallery();
      setPhotos(data);
      setLoading(false);
    };
    loadPhotos();
  }, []);

  // Albums (covers) grouped by year, newest first; photo count per album.
  const albumsByYear = useMemo(() => {
    const counts = photos.reduce((acc, p) => {
      if (!p.is_cover && p.album_id) acc[p.album_id] = (acc[p.album_id] || 0) + 1;
      return acc;
    }, {});

    const covers = photos
      .filter((p) => p.is_cover)
      .map((album) => ({ ...album, photoCount: counts[album.album_id] || 0 }))
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const groups = new Map();
    covers.forEach((album) => {
      const year = album.date
        ? new Date(album.date).getUTCFullYear()
        : (language === 'pt' ? 'Sem data' : 'Undated');
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(album);
    });
    return [...groups.entries()];
  }, [photos, language]);

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />

      <div className="page-hero">
        <Container>
          <span className="eyebrow">{labels.eyebrow}</span>
          <h1>{labels.title}</h1>
          <p className="page-hero-sub">{labels.subtitle}</p>
        </Container>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : albumsByYear.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-camera-fill" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3">{labels.empty}</p>
          </div>
        ) : (
          albumsByYear.map(([year, albums]) => (
            <section key={year} aria-label={String(year)}>
              <h2 className="gallery-year-label">{year}</h2>
              <div className="album-grid">
                {albums.map((album, index) => (
                  <motion.button
                    type="button"
                    key={album.id}
                    className="album-card"
                    onClick={() => navigate(`/gallery/${album.album_id}`)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
                    aria-label={album.title}
                  >
                    <img src={album.url} alt={album.title} loading="lazy" />
                    <span className="album-overlay">
                      <span className="album-title">{album.title}</span>
                      <span className="album-meta">
                        {album.date && (
                          <span>
                            <i className="bi bi-calendar-event me-1"></i>
                            {new Date(album.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { timeZone: 'UTC' })}
                          </span>
                        )}
                        {album.photoCount > 0 && (
                          <span>
                            <i className="bi bi-images me-1"></i>
                            {album.photoCount} {album.photoCount === 1 ? labels.photo : labels.photos}
                          </span>
                        )}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>
          ))
        )}
      </Container>
    </>
  );
};

export default Gallery;
