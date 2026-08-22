import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CoordinatorAvatar from './CoordinatorAvatar';
import { sdgMap } from '../data/content';
import './AxisMindMap.css';

// Mapa mental dos eixos: três colunas da esquerda para a direita —
// Eixo -> Atividades desenvolvidas -> Itens. Os conectores são SVG
// desenhados a partir da posição real dos cards (medida no layout), então
// acompanham qualquer quebra de linha ou redimensionamento.
//
// No mobile vira um drill-down de uma coluna só com breadcrumb: três colunas
// não cabem, e forçar scroll horizontal seria repetir o problema que a
// timeline da home tinha.

const BRANCH_META = {
  pt: {
    competencias: { label: 'Competências', icon: 'bi-lightbulb' },
    projetos: { label: 'Projetos', icon: 'bi-diagram-3' },
    equipe: { label: 'Equipe', icon: 'bi-people' },
    infra: { label: 'Infraestrutura', icon: 'bi-building' },
  },
  en: {
    competencias: { label: 'Competencies', icon: 'bi-lightbulb' },
    projetos: { label: 'Projects', icon: 'bi-diagram-3' },
    equipe: { label: 'Team', icon: 'bi-people' },
    infra: { label: 'Infrastructure', icon: 'bi-building' },
  },
};

const AXIS_COLORS = [
  '#2f6fd6', '#3fa34d', '#7b4fc9', '#2f9e6b',
  '#e07a2c', '#c9a635', '#4a8fc4', '#a6455c',
];

const axisColor = (id) => AXIS_COLORS[(parseInt(id, 10) - 1) % AXIS_COLORS.length];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
};

// ---------- nível 3: um item ----------
const ItemCard = ({ branchId, item, color }) => {
  if (branchId === 'competencias') {
    return (
      <article className="mmap-item">
        <h4 className="mmap-item__title">{item.competency || item.area}</h4>
        {item.area && item.competency && <p className="mmap-item__sub">{item.area}</p>}
        {item.definition && <p className="mmap-item__text">{item.definition}</p>}
        {item.person && <span className="mmap-chip">{item.person}</span>}
        {item.institution && <span className="mmap-chip">{item.institution}</span>}
      </article>
    );
  }
  if (branchId === 'projetos') {
    return (
      <article className="mmap-item">
        <h4 className="mmap-item__title">{item.title}</h4>
        {item.description && <p className="mmap-item__text">{item.description}</p>}
        <div className="mmap-item__chips">
          {item.period && <span className="mmap-chip">{item.period}</span>}
          {item.trl && <span className="mmap-chip mmap-chip--accent" style={{ color }}>TRL {item.trl}</span>}
          {item.person && <span className="mmap-chip">{item.person}</span>}
          {item.partners && <span className="mmap-chip">{item.partners}</span>}
        </div>
      </article>
    );
  }
  if (branchId === 'equipe') {
    return (
      <article className="mmap-item">
        <h4 className="mmap-item__title">{item.person}</h4>
        <p className="mmap-item__sub">{[item.level, item.institution].filter(Boolean).join(' · ')}</p>
        {item.title && <p className="mmap-item__text">{item.title}</p>}
        {item.area && <span className="mmap-chip">{item.area}</span>}
      </article>
    );
  }
  return (
    <article className="mmap-item">
      <h4 className="mmap-item__title">{item.acronym || item.name}</h4>
      <p className="mmap-item__sub">{[item.institution, item.lead].filter(Boolean).join(' · ')}</p>
      {item.trl && <span className="mmap-chip mmap-chip--accent" style={{ color }}>{item.trl}</span>}
    </article>
  );
};

const AxisMindMap = ({ axes, detailsById, language, labels }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const branchLabels = BRANCH_META[language] || BRANCH_META.pt;

  const urlAxis = searchParams.get('eixo');
  const urlBranch = searchParams.get('ramo');

  const firstAxisId = axes[0]?.id;
  const activeAxisId = axes.some((a) => a.id === urlAxis) ? urlAxis : (isMobile ? null : firstAxisId);
  const activeAxis = axes.find((a) => a.id === activeAxisId) || null;
  // Memoizado: sem isso a referência muda a cada render e o efeito que mede
  // os conectores rodaria em loop.
  const branches = useMemo(
    () => (activeAxis && (activeAxis.details || detailsById[activeAxis.id])) || [],
    [activeAxis, detailsById]
  );
  const activeBranchId = branches.some((b) => b.id === urlBranch)
    ? urlBranch
    : (isMobile ? null : branches[0]?.id);
  const activeBranch = branches.find((b) => b.id === activeBranchId) || null;

  const select = useCallback((axisId, branchId) => {
    const next = new URLSearchParams(searchParams);
    if (axisId) next.set('eixo', axisId); else next.delete('eixo');
    if (branchId) next.set('ramo', branchId); else next.delete('ramo');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // ---------- conectores SVG ----------
  const wrapRef = useRef(null);
  const axisRefs = useRef({});
  const branchRefs = useRef({});
  const itemsColRef = useRef(null);
  const [paths, setPaths] = useState([]);

  useLayoutEffect(() => {
    if (isMobile) { setPaths([]); return undefined; }

    const compute = () => {
      const wrap = wrapRef.current;
      const axisEl = axisRefs.current[activeAxisId];
      if (!wrap || !axisEl) { setPaths([]); return; }
      const base = wrap.getBoundingClientRect();
      const rel = (el) => {
        const r = el.getBoundingClientRect();
        return {
          left: r.left - base.left, right: r.right - base.left,
          mid: r.top - base.top + r.height / 2,
        };
      };
      const a = rel(axisEl);
      const next = [];

      // eixo -> cada ramo
      branches.forEach((b) => {
        const el = branchRefs.current[b.id];
        if (!el) return;
        const t = rel(el);
        const dx = (t.left - a.right) / 2;
        next.push({
          key: `a-${b.id}`,
          d: `M ${a.right} ${a.mid} C ${a.right + dx} ${a.mid}, ${t.left - dx} ${t.mid}, ${t.left} ${t.mid}`,
          active: b.id === activeBranchId,
        });
      });

      // ramo ativo -> coluna de itens
      const bEl = branchRefs.current[activeBranchId];
      if (bEl && itemsColRef.current) {
        const b = rel(bEl);
        const t = rel(itemsColRef.current);
        const dx = (t.left - b.right) / 2;
        next.push({
          key: 'b-items',
          d: `M ${b.right} ${b.mid} C ${b.right + dx} ${b.mid}, ${t.left - dx} ${b.mid}, ${t.left} ${b.mid}`,
          active: true,
        });
      }
      setPaths(next);
    };

    compute();
    // ResizeObserver não existe em jsdom (e em navegadores muito antigos);
    // sem ele os fios apenas não reagem a resize, o resto segue funcionando.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(compute) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('scroll', compute, { passive: true });
    return () => { if (ro) ro.disconnect(); window.removeEventListener('scroll', compute); };
  }, [isMobile, activeAxisId, activeBranchId, branches, language]);

  const color = activeAxis ? axisColor(activeAxis.id) : 'var(--brand-primary)';

  // ---------- coluna 1 ----------
  const axisColumn = (
    <div className="mmap__col mmap__col--axes">
      <span className="mono-label text-muted d-block mb-2">{labels.axis}</span>
      {axes.map((a) => {
        const c = axisColor(a.id);
        const isActive = a.id === activeAxisId;
        return (
          <button
            key={a.id}
            type="button"
            ref={(el) => { axisRefs.current[a.id] = el; }}
            className={`mmap-node mmap-node--axis${isActive ? ' is-active' : ''}`}
            style={{ '--node-color': c }}
            aria-expanded={isActive}
            onClick={() => select(a.id, null)}
          >
            <span className="mmap-node__num">{a.id}</span>
            <span className="mmap-node__label">{a.title.split('–')[1]?.trim() || a.title}</span>
            <i className="bi bi-chevron-right mmap-node__caret" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );

  // ---------- coluna 2 ----------
  const branchColumn = activeAxis && (
    <div className="mmap__col mmap__col--branches">
      <span className="mono-label text-muted d-block mb-2">{labels.activities}</span>
      {activeAxis.coordinators?.length > 0 && (
        <div className="mmap__coords">
          {activeAxis.coordinators.map((p) => <CoordinatorAvatar key={p.name} person={p} />)}
        </div>
      )}
      {activeAxis.content && <p className="mmap__axis-text">{activeAxis.content}</p>}
      {activeAxis.sdgs?.length > 0 && (
        <div className="mmap__sdgs">
          {activeAxis.sdgs.map((id) => (
            <img key={id} src={sdgMap[id]} alt={`ODS ${id}`} title={`Sustainable Development Goal ${id}`} />
          ))}
        </div>
      )}
      {branches.length === 0 ? (
        <p className="text-muted small mb-0">{labels.noDetails}</p>
      ) : branches.map((b) => {
        const meta = branchLabels[b.id] || { label: b.id, icon: 'bi-diagram-2' };
        const isActive = b.id === activeBranchId;
        return (
          <button
            key={b.id}
            type="button"
            ref={(el) => { branchRefs.current[b.id] = el; }}
            className={`mmap-node mmap-node--branch${isActive ? ' is-active' : ''}`}
            style={{ '--node-color': color }}
            aria-expanded={isActive}
            onClick={() => select(activeAxis.id, b.id)}
          >
            <i className={`bi ${meta.icon} mmap-node__icon`} aria-hidden="true" />
            <span className="mmap-node__label">{meta.label}</span>
            <span className="mmap-node__count">{b.items.length}</span>
          </button>
        );
      })}
    </div>
  );

  // ---------- coluna 3 ----------
  const itemColumn = activeBranch && (
    <div className="mmap__col mmap__col--items" ref={itemsColRef}>
      <span className="mono-label text-muted d-block mb-2">
        {(branchLabels[activeBranch.id] || {}).label} · {activeBranch.items.length}
      </span>
      <div className="mmap__items-scroll">
        {activeBranch.items.map((item, i) => (
          <ItemCard key={i} branchId={activeBranch.id} item={item} color={color} />
        ))}
      </div>
    </div>
  );

  // ---------- mobile: drill-down ----------
  if (isMobile) {
    return (
      <div className="mmap mmap--mobile">
        {(activeAxis || activeBranch) && (
          <nav className="mmap__crumbs" aria-label="breadcrumb">
            <button type="button" onClick={() => select(null, null)}>{labels.allAxes}</button>
            {activeAxis && (
              <>
                <i className="bi bi-chevron-right" aria-hidden="true" />
                <button type="button" onClick={() => select(activeAxis.id, null)}>
                  {labels.axis} {activeAxis.id}
                </button>
              </>
            )}
            {activeBranch && (
              <>
                <i className="bi bi-chevron-right" aria-hidden="true" />
                <span>{(branchLabels[activeBranch.id] || {}).label}</span>
              </>
            )}
          </nav>
        )}
        {/* motion.div com key, sem AnimatePresence: a troca de key remonta o
            nó e roda initial -> animate. Com AnimatePresence mode="wait" o
            filho que saía ficava preso no estado inicial e passava a divergir
            do breadcrumb. A animação de saída não vale esse risco aqui. */}
        <motion.div
          key={`${activeAxisId || 'root'}-${activeBranchId || ''}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18 }}
        >
          {!activeAxis ? axisColumn : !activeBranch ? branchColumn : itemColumn}
        </motion.div>
      </div>
    );
  }

  // ---------- desktop: três colunas + conectores ----------
  return (
    <div className="mmap" ref={wrapRef}>
      <svg className="mmap__wires" aria-hidden="true">
        {paths.map((p) => (
          <path
            key={p.key}
            d={p.d}
            className={p.active ? 'mmap__wire is-active' : 'mmap__wire'}
            style={{ stroke: color }}
          />
        ))}
      </svg>
      {axisColumn}
      {branchColumn}
      {itemColumn}
    </div>
  );
};

export default AxisMindMap;
