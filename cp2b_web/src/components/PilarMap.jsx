import { useEffect, useMemo, useRef, useState } from 'react';
import { pilarBand } from '../data/content';
import './PilarMap.css';

// O mapa do PILAR-2b do vídeo institucional v3, desenhado em SVG: os 645
// municípios no potencial de biogás (5 faixas por quantil), as linhas de
// transmissão, os gasodutos, as subestações e as plantas de biogás.
//
// Os caminhos já vêm projetados e simplificados em sp-map.json
// (scripts/build-pilar-map.py), que só é baixado quando a faixa se aproxima
// da tela. A animação roda uma vez, quando o mapa entra na tela: os
// municípios se pintam de oeste para leste, depois a infraestrutura se
// desenha. Com "reduzir movimento" o mapa já aparece pronto.
const MAP_URL = '/assets/pilar2b/sp-map.json';
const RAMP_STEPS = [0, 1, 2, 3, 4];

const prefersReducedMotion = () =>
  typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dispara uma vez quando o elemento cruza a margem dada; sem
// IntersectionObserver (navegador antigo), dispara na hora.
const useOnceInView = (ref, options) => {
  const [hit, setHit] = useState(false);
  const { rootMargin, threshold } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el || hit) return undefined;
    if (typeof window.IntersectionObserver !== 'function') {
      setHit(true);
      return undefined;
    }
    const io = new window.IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHit(true);
        io.disconnect();
      }
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, hit, rootMargin, threshold]);
  return hit;
};

const PilarMap = ({ language }) => {
  const t = (pilarBand[language] || pilarBand.pt).map;
  const ref = useRef(null);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [armed] = useState(() => !prefersReducedMotion());

  const near = useOnceInView(ref, { rootMargin: '400px 0px', threshold: 0 });
  const inView = useOnceInView(ref, { rootMargin: '0px', threshold: 0.3 });

  useEffect(() => {
    if (!near || data) return undefined;
    let alive = true;
    fetch(MAP_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => { if (alive) setData(json); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [near, data]);

  // A malha cinza por baixo é um caminho só, não 645.
  const land = useMemo(() => (data ? data.munis.map((m) => m.d).join('') : ''), [data]);

  if (failed) return null;

  const classes = ['pilar-map', armed && 'is-armed', armed && data && inView && 'is-playing']
    .filter(Boolean)
    .join(' ');

  return (
    <figure ref={ref} className={classes}>
      <div className="pilar-map__frame">
        {data && (
          <svg viewBox={`0 0 ${data.w} ${data.h}`} role="img" aria-label={t.alt} className="pilar-map__svg">
            <path className="pilar-map__land" d={land} />
            <g>
              {data.munis.map((m, i) => (
                <path
                  key={i}
                  d={m.d}
                  className={`pilar-map__muni pilar-map__muni--t${m.t}`}
                  style={{ '--k': m.k }}
                />
              ))}
            </g>
            <path className="pilar-map__line pilar-map__line--transmission" d={data.transmission} pathLength="1" />
            <path className="pilar-map__line pilar-map__line--gas" d={data.gas} pathLength="1" />
            <g>
              {data.substations.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.2" className="pilar-map__substation" style={{ '--i': i % 13 }} />
              ))}
            </g>
            <g>
              {data.plants.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="8" className="pilar-map__plant" style={{ '--i': i }} />
              ))}
            </g>
          </svg>
        )}
      </div>
      <figcaption className="pilar-map__legend">
        <span className="pilar-map__ramp">
          <span>{t.low}</span>
          {RAMP_STEPS.map((s) => <i key={s} className={`pilar-map__swatch pilar-map__muni--t${s}`} aria-hidden="true" />)}
          <span>{t.high}</span>
        </span>
        <span className="pilar-map__key pilar-map__key--transmission">{t.transmission}</span>
        <span className="pilar-map__key pilar-map__key--gas">{t.gas}</span>
        <span className="pilar-map__key pilar-map__key--plant">{t.plants}</span>
      </figcaption>
    </figure>
  );
};

export default PilarMap;
