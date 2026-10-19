import { Container } from 'react-bootstrap';
import './PageHero.css';

/**
 * Faixa de título das páginas internas, como o cabeçalho de página do
 * PILAR-2b: faixa clara fria com um fio embaixo, a etiqueta (eyebrow) em
 * caixa-alta pequena, o título e o subtítulo. À direita, a partir de telas
 * médias, as folhas da ilustração do manual (1.16): o contorno da folha
 * grande em Azul Petróleo e a folha pequena preenchida em Verde Limão.
 */
const HeaderLeaves = () => (
  <svg className="page-hero-leaves" viewBox="0 0 600 600" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M560 250 C 500 236 440 262 416 318 C 398 360 412 396 430 424 C 444 446 436 470 408 492 C 470 476 520 450 548 400 C 566 368 566 330 562 296 Z"
      fill="#B6E03B"
      fillOpacity=".4"
    />
    <path
      d="M236 40 C 380 30 500 140 500 290 C 500 360 470 410 440 452 C 418 482 418 520 450 560 L 380 532 C 260 484 180 400 172 286 C 168 220 176 150 182 96 L 184 44 Z"
      stroke="#1E3E4C"
      strokeWidth="2"
      vectorEffect="non-scaling-stroke"
      opacity=".25"
    />
  </svg>
);

const PageHero = ({ eyebrow, title, subtitle, children, className }) => (
  <div className={['page-hero', className].filter(Boolean).join(' ')}>
    <HeaderLeaves />
    <Container className="page-hero-inner">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {subtitle && <p className="page-hero-sub">{subtitle}</p>}
      {children}
    </Container>
  </div>
);

export default PageHero;
