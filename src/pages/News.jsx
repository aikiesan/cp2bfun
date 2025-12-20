import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { newsItems } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const News = () => {
  const { language } = useLanguage();
  const news = newsItems[language];

  const labels = {
    pt: {
      tag: 'NOVIDADES',
      title: 'Agência CP2B de Notícias',
      readMore: 'Ler mais',
      latest: 'Mais Notícias'
    },
    en: {
      tag: 'NEWS',
      title: 'CP2B News Agency',
      readMore: 'Read more',
      latest: 'More News'
    }
  }[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Badge color mapping
  const getBadgeStyle = (badgeColor) => ({
    background: badgeColor === 'success' ? 'var(--cp2b-green-tint)' :
               badgeColor === 'primary' ? 'var(--cp2b-petrol-tint)' :
               'var(--cp2b-orange-tint)',
    color: badgeColor === 'success' ? 'var(--cp2b-green)' :
          badgeColor === 'primary' ? 'var(--cp2b-petrol)' :
          'var(--cp2b-orange)'
  });

  if (!news || news.length === 0) return null;

  const featured = news[0];
  const others = news.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Container className="py-5">
        {/* Page Header */}
        <Row className="mb-5 page-header">
          <Col lg={8}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <span className="mono-label text-petrol">{labels.tag}</span>
              <h1 className="display-5 fw-bold mb-4" style={{ color: 'var(--cp2b-petrol)' }}>
                {labels.title}
              </h1>
            </motion.div>
          </Col>
        </Row>

        {/* Featured News */}
        <motion.section
          className="mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
            <Row className="g-0">
              <Col lg={7}>
                <div style={{ height: '400px' }} className="overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', borderRadius: 0 }}
                  />
                </div>
              </Col>
              <Col lg={5} className="p-4 p-lg-5 d-flex flex-column justify-content-center bg-white">
                <span
                  className="badge rounded-pill mb-3 align-self-start"
                  style={getBadgeStyle(featured.badgeColor)}
                >
                  {featured.badge}
                </span>
                <h2 className="fw-bold mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.3' }}>
                  <Link
                    to={featured.link}
                    className="text-decoration-none"
                    style={{ color: 'var(--cp2b-dark)' }}
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-muted mb-4" style={{ lineHeight: '1.7' }}>
                  {featured.description}
                </p>
                <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                  <span className="small text-muted" style={{ fontFamily: 'var(--font-mono)' }}>
                    {featured.date}
                  </span>
                  <Link
                    to={featured.link}
                    className="fw-semibold text-decoration-none d-inline-flex align-items-center gap-1"
                    style={{ color: 'var(--cp2b-petrol)' }}
                  >
                    {labels.readMore}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </Col>
            </Row>
          </Card>
        </motion.section>

        {/* Others Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex align-items-center gap-3 mb-4">
            <span
              className="d-inline-block"
              style={{ width: '40px', height: '3px', background: 'var(--cp2b-green)', borderRadius: '2px' }}
            />
            <h3 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>{labels.latest}</h3>
          </div>

          <Row className="g-4">
            {others.map((item, index) => (
              <Col md={6} lg={4} key={item.id}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20px" }}
                  variants={fadeInUp}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0">
                    <div
                      className="overflow-hidden mb-3"
                      style={{ height: '200px', borderRadius: 'var(--radius-lg)' }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-100 h-100"
                        style={{
                          objectFit: 'cover',
                          borderRadius: 0,
                          transition: 'transform 0.4s ease'
                        }}
                      />
                    </div>
                    <Card.Body className="p-0">
                      <span
                        className="badge rounded-pill mb-2"
                        style={getBadgeStyle(item.badgeColor)}
                      >
                        {item.badge}
                      </span>
                      <Card.Title className="fw-bold mb-3" style={{ fontSize: '1rem' }}>
                        <Link
                          to={item.link}
                          className="text-decoration-none"
                          style={{ color: 'var(--cp2b-dark)' }}
                        >
                          {item.title}
                        </Link>
                      </Card.Title>
                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          className="small text-muted"
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                        >
                          {item.date}
                        </span>
                        <Link
                          to={item.link}
                          className="text-decoration-none small fw-semibold"
                          style={{ color: 'var(--cp2b-petrol)' }}
                        >
                          {labels.readMore} &rarr;
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.section>
      </Container>
    </motion.div>
  );
};

export default News;
