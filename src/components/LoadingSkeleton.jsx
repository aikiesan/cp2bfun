import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// Base skeleton styles
const skeletonStyle = {
  background: 'linear-gradient(90deg, var(--cp2b-border-light) 25%, var(--cp2b-bg) 50%, var(--cp2b-border-light) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 'var(--radius-md)'
};

// Add shimmer animation to CSS
const ShimmerStyle = () => (
  <style>{`
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `}</style>
);

// Generic skeleton box
export const SkeletonBox = ({ width = '100%', height = '20px', className = '', style = {} }) => (
  <div
    className={className}
    style={{ ...skeletonStyle, width, height, ...style }}
  />
);

// Text line skeleton
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        height="16px"
        width={i === lines - 1 ? '70%' : '100%'}
        style={{ marginBottom: i < lines - 1 ? '8px' : 0 }}
      />
    ))}
  </div>
);

// Card skeleton
export const SkeletonCard = ({ hasImage = true }) => (
  <div className="card h-100">
    {hasImage && (
      <SkeletonBox height="200px" style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
    )}
    <div className="card-body p-4">
      <SkeletonBox width="60px" height="24px" className="mb-3" style={{ borderRadius: '20px' }} />
      <SkeletonBox width="80%" height="24px" className="mb-3" />
      <SkeletonText lines={2} />
    </div>
  </div>
);

// Page loader with logo
export const PageLoader = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ minHeight: '60vh' }}
  >
    <ShimmerStyle />
    <div className="position-relative mb-4">
      <img
        src="/assets/CP2B-LOGO-COLOR-DEGRADE@8x.png"
        alt="CP2B"
        height="60"
        style={{ opacity: 0.3 }}
      />
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          animation: 'shimmer 2s infinite'
        }}
      />
    </div>
    <SkeletonBox width="120px" height="12px" />
  </div>
);

// News page skeleton
export const NewsPageSkeleton = () => (
  <Container className="py-5">
    <ShimmerStyle />
    <div className="mb-5">
      <SkeletonBox width="100px" height="14px" className="mb-2" />
      <SkeletonBox width="200px" height="40px" className="mb-3" />
      <SkeletonBox width="300px" height="20px" />
    </div>
    <Row className="g-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Col md={4} key={i}>
          <SkeletonCard hasImage />
        </Col>
      ))}
    </Row>
  </Container>
);

// Team page skeleton
export const TeamPageSkeleton = () => (
  <Container className="py-5">
    <ShimmerStyle />
    <div className="text-center mb-5">
      <SkeletonBox width="100px" height="14px" className="mx-auto mb-2" />
      <SkeletonBox width="200px" height="40px" className="mx-auto mb-3" />
      <SkeletonBox width="400px" height="20px" className="mx-auto" style={{ maxWidth: '100%' }} />
    </div>
    <Row className="g-4 justify-content-center">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <Col xs={6} md={4} lg={3} key={i}>
          <div className="text-center">
            <SkeletonBox
              width="120px"
              height="120px"
              className="mx-auto mb-3"
              style={{ borderRadius: '50%' }}
            />
            <SkeletonBox width="80%" height="20px" className="mx-auto mb-2" />
            <SkeletonBox width="60%" height="14px" className="mx-auto" />
          </div>
        </Col>
      ))}
    </Row>
  </Container>
);

// Generic content skeleton
export const ContentSkeleton = () => (
  <Container className="py-5">
    <ShimmerStyle />
    <div className="mb-5">
      <SkeletonBox width="100px" height="14px" className="mb-2" />
      <SkeletonBox width="300px" height="40px" className="mb-3" />
      <SkeletonBox width="500px" height="20px" style={{ maxWidth: '100%' }} />
    </div>
    <Row className="g-4">
      <Col lg={8}>
        <SkeletonText lines={8} />
      </Col>
      <Col lg={4}>
        <SkeletonCard hasImage={false} />
      </Col>
    </Row>
  </Container>
);

export default PageLoader;
