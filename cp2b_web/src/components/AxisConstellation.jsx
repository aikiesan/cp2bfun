import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { axisTheme } from '../utils/axisTheme';
import './AxisConstellation.css';

// Figura integrativa dos oito eixos: eixos 1–4 à esquerda, 5–8 à direita e,
// no centro, a molécula de metano (CH4) com a identidade do CP2b. Substitui a
// imagem estática de referência — o texto fica indexável, legível por leitor
// de tela e se reorganiza em lista no mobile.
//
// Os nomes vêm dos próprios dados dos eixos (API do painel, com content.js de
// fallback): quando a coordenação mudar, basta editar o eixo, sem regravar
// imagem. O primeiro nome é a coordenação e o segundo a vice-coordenação; se
// só houver um, a vice aparece como vaga em aberto.
//
// Os fios são SVG medidos a partir da posição real dos cards, para
// acompanhar quebras de linha e redimensionamento.

// Coordenadas do hub no viewBox 240x240.
const HUB = 240;
const ORBIT_R = 108;
// Abertura angular entre os quatro fios de cada lado.
const WIRE_SPREAD_DEG = 17;

const HONORIFICS = /^(?:(?:Prof|Dr)[ºªa]?\.?\s+)+/i;
const cleanName = (name) => String(name || '').replace(HONORIFICS, '').trim();
// O painel grava a vaga como texto no campo do nome ("Vaga temporariamente em
// aberto"); tratá-la como pessoa a mostraria em destaque, como um nome.
const VACANCY = /^\s*(vaga|position)\b.*\b(aberto|aberta|open)\b/i;
const personName = (person) => (person && !VACANCY.test(person.name) ? cleanName(person.name) : null);
const cleanTitle = (title) => String(title || '').split('–')[1]?.trim() || title;

const useIsDesktop = () => {
  const query = '(min-width: 1200px)';
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
};

// ---------- núcleo: CH4 ----------
// Fórmula estrutural em traço fino, como numa ilustração científica: duas
// ligações no plano (traço simples), uma para fora (cunha cheia) e uma para
// dentro (cunha tracejada) — a notação da geometria tetraédrica do metano.
// Em volta, um anel com marcações de instrumento, onde chegam os fios.
const C = { x: 120, y: 114 };
const BOND_FROM = 15;
const BOND_TO = 49;
const H_AT = 61;
const BONDS = [
  { kind: 'plain', dx: -0.82, dy: -0.57 },
  { kind: 'plain', dx: 0.82, dy: -0.57 },
  { kind: 'hash', dx: -0.5, dy: 0.866 },
  { kind: 'wedge', dx: 0.5, dy: 0.866 },
];
const at = (b, r) => [C.x + b.dx * r, C.y + b.dy * r];

const Bond = ({ b }) => {
  const [x1, y1] = at(b, BOND_FROM);
  const [x2, y2] = at(b, BOND_TO);
  if (b.kind === 'plain') return <line className="axo-hub__bond" x1={x1} y1={y1} x2={x2} y2={y2} />;
  // perpendicular unitária à ligação
  const px = -b.dy;
  const py = b.dx;
  if (b.kind === 'wedge') {
    const w = 5;
    return (
      <polygon
        className="axo-hub__wedge"
        points={`${x1},${y1} ${x2 + px * w},${y2 + py * w} ${x2 - px * w},${y2 - py * w}`}
      />
    );
  }
  const n = 7;
  return (
    <g className="axo-hub__hash">
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 1) / n;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t;
        const h = 0.6 + 4.6 * t;
        return <line key={i} x1={cx + px * h} y1={cy + py * h} x2={cx - px * h} y2={cy - py * h} />;
      })}
    </g>
  );
};

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);

// Variante compacta (página Sobre): o logo do CP2b no centro do anel, no
// lugar da molécula.
const LogoHub = ({ lit }) => (
  <svg className={`axo-hub__svg${lit ? ' is-lit' : ''}`} viewBox={`0 0 ${HUB} ${HUB}`} aria-hidden="true">
    <circle className="axo-hub__disc" cx="120" cy="120" r={ORBIT_R} />
    <g className="axo-hub__ticks">
      {TICKS.map((deg) => {
        const t = (deg * Math.PI) / 180;
        const inner = deg % 30 === 0 ? ORBIT_R - 9 : ORBIT_R - 4;
        return (
          <line
            key={deg}
            className={deg % 30 === 0 ? 'is-major' : undefined}
            x1={120 + Math.cos(t) * inner}
            y1={120 + Math.sin(t) * inner}
            x2={120 + Math.cos(t) * ORBIT_R}
            y2={120 + Math.sin(t) * ORBIT_R}
          />
        );
      })}
    </g>
    <circle className="axo-hub__orbit" cx="120" cy="120" r={ORBIT_R} />
    <circle className="axo-hub__inner" cx="120" cy="120" r="84" />
    <image href="/assets/logos/cp2b-logo-gradient.svg" x="44" y="91" width="152" height="58" />
  </svg>
);

const MethaneHub = ({ lit }) => (
  <svg className={`axo-hub__svg${lit ? ' is-lit' : ''}`} viewBox={`0 0 ${HUB} ${HUB}`} aria-hidden="true">
    <circle className="axo-hub__disc" cx="120" cy="120" r={ORBIT_R} />
    <g className="axo-hub__ticks">
      {TICKS.map((deg) => {
        const t = (deg * Math.PI) / 180;
        const inner = deg % 30 === 0 ? ORBIT_R - 9 : ORBIT_R - 4;
        return (
          <line
            key={deg}
            className={deg % 30 === 0 ? 'is-major' : undefined}
            x1={120 + Math.cos(t) * inner}
            y1={120 + Math.sin(t) * inner}
            x2={120 + Math.cos(t) * ORBIT_R}
            y2={120 + Math.sin(t) * ORBIT_R}
          />
        );
      })}
    </g>
    <circle className="axo-hub__orbit" cx="120" cy="120" r={ORBIT_R} />
    <circle className="axo-hub__inner" cx="120" cy="120" r="84" />

    {BONDS.map((b) => <Bond key={b.kind + b.dx} b={b} />)}
    {BONDS.map((b) => {
      const [x, y] = at(b, H_AT);
      return <text key={b.kind + b.dx} className="axo-hub__atom axo-hub__atom--h" x={x} y={y}>H</text>;
    })}
    <text className="axo-hub__atom axo-hub__atom--c" x={C.x} y={C.y}>C</text>
  </svg>
);

// ---------- card de um eixo ----------
// Cada eixo tem ícone e cor próprios (utils/axisTheme) para ser reconhecido
// de relance, e um "Ver detalhes" explícito: o card é a porta de entrada do
// detalhamento logo abaixo. Os coordenadores aparecem lado a lado, com o
// mesmo peso — não há hierarquia entre eles.
const AxisCard = ({ axis, index, labels, side, isActive, onActivate, onPick, cardRef, reduceMotion, compact }) => {
  const people = (axis.coordinators || []).map(personName).filter(Boolean);
  const hasVacancy = people.length < 2;
  const theme = axisTheme(axis.id);
  return (
    <motion.a
      ref={cardRef}
      href={compact ? `/eixos?eixo=${axis.id}#explorar-eixos` : `?eixo=${axis.id}`}
      className={`axo-card axo-card--${side}${isActive ? ' is-active' : ''}`}
      style={{ '--row': (index % 4) + 1, '--axis': theme.color }}
      onMouseEnter={() => onActivate(index)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(index)}
      onBlur={() => onActivate(null)}
      onClick={(e) => onPick(e, axis.id)}
      // animate, e não whileInView: a figura abre a página, e um card que só
      // aparece ao entrar na viewport ficaria invisível no HTML pré-renderizado.
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.06 + (side === 'r' ? 0.12 : 0) }}
    >
      <span className="axo-card__icon" aria-hidden="true">
        <i className={`bi ${theme.icon}`} />
      </span>
      <span className="axo-card__body">
        <span className="axo-card__top" aria-hidden="true">
          <span className="axo-card__kicker">{labels.axis} {String(axis.id).padStart(2, '0')}</span>
          <span className="axo-card__cta">{!compact && labels.details} <i className="bi bi-arrow-right" /></span>
        </span>
        <h3 className="axo-card__title">
          <span className="visually-hidden">{labels.axis} {axis.id}: </span>
          {cleanTitle(axis.title)}
        </h3>
        {/* A variante compacta (Sobre) mostra só os eixos, sem coordenação. */}
        {!compact && (
          <ul className="axo-card__people" aria-label={labels.coordination}>
            {people.map((name) => <li key={name}>{name}</li>)}
            {hasVacancy && <li className="is-vacant">{labels.vacancy}</li>}
          </ul>
        )}
      </span>
    </motion.a>
  );
};

// compact: versão da página Sobre — só os títulos dos eixos e o logo do CP2b
// no centro, sem coordenadores; cada card leva ao eixo em /eixos.
const AxisConstellation = ({ axes, labels, targetId, compact = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(null);

  const pick = useCallback((e, axisId) => {
    e.preventDefault();
    if (compact) {
      navigate(`/eixos?eixo=${axisId}#explorar-eixos`);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.set('eixo', axisId);
    next.delete('ramo');
    setSearchParams(next, { replace: true });
    const target = targetId && document.getElementById(targetId);
    // scrollIntoView não existe em jsdom.
    if (target && target.scrollIntoView) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [searchParams, setSearchParams, targetId, reduceMotion, compact, navigate]);

  // ---------- fios SVG ----------
  const gridRef = useRef(null);
  const hubRef = useRef(null);
  const cardRefs = useRef([]);
  const [wires, setWires] = useState([]);

  useLayoutEffect(() => {
    if (!isDesktop) { setWires([]); return undefined; }

    const compute = () => {
      const grid = gridRef.current;
      const hub = hubRef.current;
      if (!grid || !hub) return;
      const base = grid.getBoundingClientRect();
      const h = hub.getBoundingClientRect();
      if (!h.width) { setWires([]); return; }
      const cx = h.left - base.left + h.width / 2;
      const cy = h.top - base.top + h.height / 2;
      const r = (h.width / HUB) * ORBIT_R;

      const next = axes.slice(0, 8).map((axis, i) => {
        const el = cardRefs.current[i];
        if (!el) return null;
        const c = el.getBoundingClientRect();
        const left = i < 4;
        const row = i % 4;
        const px = left ? c.right - base.left : c.left - base.left;
        const py = c.top - base.top + c.height / 2;
        // Linha 0 no alto: à esquerda o ângulo sai de ~205°, à direita de ~-25°.
        const deg = left
          ? 180 + (1.5 - row) * WIRE_SPREAD_DEG
          : -(1.5 - row) * WIRE_SPREAD_DEG;
        const t = (deg * Math.PI) / 180;
        const qx = cx + r * Math.cos(t);
        const qy = cy + r * Math.sin(t);
        const dx = Math.abs(qx - px) * 0.55;
        const c1x = left ? px + dx : px - dx;
        const c2x = qx + Math.cos(t) * dx;
        const c2y = qy + Math.sin(t) * dx;
        return {
          key: axis.id,
          color: axisTheme(axis.id).color,
          d: `M ${px} ${py} C ${c1x} ${py}, ${c2x} ${c2y}, ${qx} ${qy}`,
          p: [px, py],
          q: [qx, qy],
        };
      });
      setWires(next.filter(Boolean));
    };

    compute();
    // ResizeObserver não existe em jsdom; sem ele os fios só não reagem a resize.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null;
    if (ro && gridRef.current) ro.observe(gridRef.current);
    return () => { if (ro) ro.disconnect(); };
  }, [isDesktop, axes]);

  return (
    // O título e o subtítulo desta figura são os do hero da página (Research):
    // aqui ela começa direto nos eixos, sem repetir o cabeçalho.
    <section className={`axo${compact ? ' axo--compact' : ''}`} aria-label={labels.title}>

      <div className={`axo__grid${active !== null ? ' has-active' : ''}`} ref={gridRef}>
        {isDesktop && (
          <svg className="axo__wires" aria-hidden="true">
            {wires.map((w, i) => (
              <g key={w.key} className={`axo-wire${active === i ? ' is-active' : ''}`} style={{ '--axis': w.color }}>
                <motion.path
                  d={w.d}
                  className="axo-wire__path"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.25 + (i % 4) * 0.08, ease: 'easeOut' }}
                />
                <path d={w.d} className="axo-wire__flow" />
                <circle className="axo-wire__end" cx={w.q[0]} cy={w.q[1]} r="2.5" />
                <circle className="axo-wire__node" cx={w.p[0]} cy={w.p[1]} r="4" />
              </g>
            ))}
          </svg>
        )}

        <div className="axo-hub">
          <div className="axo-hub__art" ref={hubRef}>
            {compact ? <LogoHub lit={active !== null} /> : <MethaneHub lit={active !== null} />}
          </div>
          {!compact && (
          <div className="axo-hub__brand">
            <span className="axo-hub__formula" aria-hidden="true">CH<sub>4</sub> · {labels.methane}</span>
            <img
              className="axo-hub__logo"
              src="/assets/logos/cp2b-logo-gradient.svg"
              alt="CP2b"
              width="168"
              height="64"
            />
            <span className="axo-hub__caption">{labels.hubCaption}</span>
          </div>
          )}
        </div>

        {axes.slice(0, 8).map((axis, i) => (
          <AxisCard
            key={axis.id}
            axis={axis}
            index={i}
            side={i < 4 ? 'l' : 'r'}
            labels={labels}
            isActive={active === i}
            onActivate={setActive}
            onPick={pick}
            cardRef={(el) => { cardRefs.current[i] = el; }}
            reduceMotion={reduceMotion}
            compact={compact}
          />
        ))}
      </div>

      <p className="axo__hint">
        <i className="bi bi-hand-index" aria-hidden="true" /> {labels.hint}
      </p>
    </section>
  );
};

export default AxisConstellation;
