import { Container } from 'react-bootstrap';

/**
 * Editorial page header band used across inner pages.
 * Renders the petrol gradient hero with an eyebrow label, title and subtitle.
 */
const PageHero = ({ eyebrow, title, subtitle, children }) => (
  <div className="page-hero">
    <Container>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {subtitle && <p className="page-hero-sub">{subtitle}</p>}
      {children}
    </Container>
  </div>
);

export default PageHero;
