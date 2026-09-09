import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import { pressKitLogos, pressKitDocuments, brandColors, brandTypography } from '../data/pressKitAssets';
import api from '../services/api';

// Não há mais lista estática de itens: os antigos "Logotipos", "Fotos
// Institucionais" e "Apresentação CP2b" apontavam para file_url '#' e viravam
// botões desabilitados — a página prometia downloads que não existiam. Os
// logotipos agora têm sua própria seção, servida de public/assets/logos/, e
// os demais materiais entram pelo /admin/press-kit quando houver arquivo.

const PressKit = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.pressKit[language] || pageSeo.pressKit.pt;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      tag: 'MARCA',
      title: 'Identidade Visual',
      description: 'Logotipos, manual de identidade, paleta e tipografia do CP2b, prontos para uso em publicações e materiais de imprensa.',
      download: 'Baixar',
      logosTitle: 'Logotipos',
      logosHint: 'Arquivos vetoriais (SVG), prontos para impressão e web. Clique para baixar.',
      docsTitle: 'Documentos',
      docsHint: 'Diretrizes oficiais de uso da marca.',
      colorsTitle: 'Paleta institucional',
      colorsHint: 'Cores oficiais do CP2b, conforme o manual de identidade.',
      typeTitle: 'Tipografia',
      typeHint: 'Fontes institucionais. São licenciadas ao CP2b e não são distribuídas aqui — para materiais de terceiros, use um equivalente sem serifa.',
      otherTitle: 'Outros materiais',
    },
    en: {
      tag: 'BRAND',
      title: 'Visual Identity',
      description: 'CP2b logos, identity manual, palette and typography, ready for use in publications and press materials.',
      download: 'Download',
      logosTitle: 'Logos',
      logosHint: 'Vector files (SVG), ready for print and web. Click to download.',
      docsTitle: 'Documents',
      docsHint: 'Official brand usage guidelines.',
      colorsTitle: 'Institutional palette',
      colorsHint: 'Official CP2b colours, as defined in the identity manual.',
      typeTitle: 'Typography',
      typeHint: 'Institutional typefaces. They are licensed to CP2b and are not distributed here — for third-party materials, use a sans-serif equivalent.',
      otherTitle: 'Other materials',
    },
  }[language];

  useEffect(() => {
    api.get('/press-kit')
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const getTitle = (item) =>
    language === 'pt' ? item.title_pt : (item.title_en || item.title_pt);

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Container className="py-4 py-md-5">
          <Row className="justify-content-center text-center">
            <Col lg={7}>
              <i className="bi bi-file-earmark-zip text-success mobile-empty-icon" style={{ fontSize: '4rem', opacity: 0.8 }}></i>
              <div className="mt-3 mt-md-4">
                <span className="mono-label text-success text-uppercase">{labels.tag}</span>
                <h1 className="display-5 mobile-display-6 fw-bold mt-2 mb-2 mb-md-3">{labels.title}</h1>
                <p className="lead text-muted mb-4 mb-md-5">{labels.description}</p>

              </div>
            </Col>
          </Row>

          {/* Logotipos — servidos direto de public/assets/logos, sempre
              disponíveis, independentes do backend. */}
          <Row className="justify-content-center mt-4 mt-md-5">
            <Col lg={9}>
              <h2 className="h5 fw-bold mb-1">{labels.logosTitle}</h2>
              <p className="text-muted small mb-3">{labels.logosHint}</p>

              <Row className="g-3">
                {pressKitLogos.map((logo) => (
                  <Col xs={12} sm={6} lg={4} key={logo.file}>
                    <a
                      href={logo.file}
                      download
                      className="d-flex align-items-center gap-3 p-3 border rounded text-decoration-none h-100 press-kit-logo"
                    >
                      {/* Fundo xadrez claro: metade dos arquivos é negativa ou
                          transparente e sumiria sobre branco puro. */}
                      <span
                        className="d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded"
                        style={{
                          width: 56,
                          height: 56,
                          background:
                            'repeating-conic-gradient(#f1f3f5 0% 25%, #ffffff 0% 50%) 50% / 12px 12px',
                        }}
                      >
                        <img
                          src={logo.file}
                          alt=""
                          loading="lazy"
                          style={{ maxWidth: 44, maxHeight: 44 }}
                        />
                      </span>
                      <span className="flex-grow-1">
                        <span className="d-block fw-semibold text-body">
                          {language === 'pt' ? logo.name : logo.name_en}
                        </span>
                        <span className="d-block text-muted small">
                          {language === 'pt' ? logo.usage : logo.usage_en}
                        </span>
                      </span>
                      <i className="bi bi-download text-success flex-shrink-0"></i>
                    </a>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Documentos de marca — no repositório, sempre disponíveis. */}
          <Row className="justify-content-center mt-4 mt-md-5">
            <Col lg={9}>
              <h2 className="h5 fw-bold mb-1">{labels.docsTitle}</h2>
              <p className="text-muted small mb-3">{labels.docsHint}</p>

              <Row className="g-3">
                {pressKitDocuments.map((doc) => (
                  <Col xs={12} md={6} key={doc.file}>
                    <a
                      href={doc.file}
                      download
                      className="d-flex align-items-center gap-3 p-3 border rounded text-decoration-none h-100 press-kit-logo"
                    >
                      <i className={`bi ${doc.icon} text-success flex-shrink-0`} style={{ fontSize: '1.75rem' }}></i>
                      <span className="flex-grow-1">
                        <span className="d-block fw-semibold text-body">
                          {language === 'pt' ? doc.name : doc.name_en}
                        </span>
                        <span className="d-block text-muted small">
                          {language === 'pt' ? doc.description : doc.description_en}
                        </span>
                        <span className="d-block text-muted small mt-1">{doc.meta}</span>
                      </span>
                      <i className="bi bi-download text-success flex-shrink-0"></i>
                    </a>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Paleta — o hex é o que a imprensa precisa copiar. */}
          <Row className="justify-content-center mt-4 mt-md-5">
            <Col lg={9}>
              <h2 className="h5 fw-bold mb-1">{labels.colorsTitle}</h2>
              <p className="text-muted small mb-3">{labels.colorsHint}</p>

              <Row className="g-3">
                {brandColors.map((color) => (
                  <Col xs={6} sm={4} lg={2} key={color.hex}>
                    <div className="border rounded overflow-hidden h-100">
                      <div
                        style={{
                          background: color.hex,
                          height: 72,
                          color: color.onDark ? '#fff' : '#14532D',
                        }}
                      />
                      <div className="p-2">
                        <span className="d-block small fw-semibold">{color.name}</span>
                        <code className="small text-muted">{color.hex}</code>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Tipografia — informativa: as fontes não são redistribuídas. */}
          <Row className="justify-content-center mt-4 mt-md-5">
            <Col lg={9}>
              <h2 className="h5 fw-bold mb-1">{labels.typeTitle}</h2>
              <p className="text-muted small mb-3">{labels.typeHint}</p>

              <Row className="g-3">
                {brandTypography.map((font) => (
                  <Col xs={12} md={6} key={font.family}>
                    <div className="border rounded p-3 h-100">
                      <span className="d-block fw-semibold">{font.family}</span>
                      <span className="d-block text-muted small mb-2">
                        {language === 'pt' ? font.role : font.role_en}
                      </span>
                      <span
                        className="d-block"
                        style={{ fontFamily: `'${font.family}', sans-serif`, fontSize: '1.15rem' }}
                      >
                        {font.sample}
                      </span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          {/* Materiais enviados pelo /admin/press-kit. A seção some quando não
              há nenhum, em vez de mostrar botões que não baixam nada. */}
          {loading ? (
            <div className="text-center mt-4"><Spinner animation="border" variant="success" /></div>
          ) : items.length > 0 && (
            <Row className="justify-content-center mt-4 mt-md-5">
              <Col lg={9}>
                <h2 className="h5 fw-bold mb-3">{labels.otherTitle}</h2>
                <Row className="g-3">
                  {items.map((item) => (
                    <Col xs={12} sm={6} md={4} key={item.id}>
                      <Button
                        variant="outline-success"
                        className="w-100 px-3 py-3 d-flex flex-column align-items-center gap-2"
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <i className={`bi ${item.icon || 'bi-file-earmark-pdf'}`} style={{ fontSize: '1.5rem' }}></i>
                        <span>{getTitle(item)}</span>
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          )}
        </Container>
      </motion.div>
    </>
  );
};

export default PressKit;
