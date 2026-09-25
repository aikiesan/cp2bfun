import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { sdgMap } from '../data/content';
import { laboratories } from '../data/generated/laboratories';
import { axisTheme } from '../utils/axisTheme';
import './AxisExplorer.css';

// Detalhamento dos eixos: seletor 01–08 no topo e, abaixo, um painel em duas
// colunas — à esquerda o resumo do eixo (escopo e ODS), à direita as abas por
// tipo de atividade e os itens numa lista compacta, que abre cada linha no
// lugar. No mobile as colunas empilham, mas nada rola na horizontal: o
// seletor vira uma grade 4×2 e as abas um controle segmentado.
//
// O estado vive na URL (?eixo=N&ramo=id), então a figura do topo da página e
// links externos abrem direto no eixo certo.
//
// Os eixos não são apessoados aqui: a coordenação aparece na figura do topo e
// as pessoas vivem em /equipe. Por isso o ramo 'equipe' fica de fora e os
// itens não trazem nomes.
const HIDDEN_BRANCHES = new Set(['equipe']);

const BRANCH_META = {
  pt: {
    competencias: { label: 'Competências', icon: 'bi-lightbulb', noun: 'competências' },
    projetos: { label: 'Projetos', icon: 'bi-diagram-3', noun: 'projetos' },
    infra: { label: 'Infraestrutura', icon: 'bi-building', noun: 'itens de infraestrutura' },
  },
  en: {
    competencias: { label: 'Competencies', icon: 'bi-lightbulb', noun: 'competencies' },
    projetos: { label: 'Projects', icon: 'bi-diagram-3', noun: 'projects' },
    infra: { label: 'Infrastructure', icon: 'bi-building', noun: 'infrastructure items' },
  },
};

// Quantas linhas aparecem antes do "ver todos": o Eixo 8 tem 22 projetos.
const INITIAL_ITEMS = 8;

const pad = (id) => String(id).padStart(2, '0');
const cleanTitle = (title) => String(title || '').split('–')[1]?.trim() || title;

// O texto dos eixos termina repetindo os ODS por extenso ("ODS: 7, 11, 13 e
// 15."), que já aparecem como ícones logo abaixo.
const SDG_SENTENCE = /\s*(este eixo contribui para os |this axis contributes to (the )?)?(objetivos de desenvolvimento sustentável|sustainable development goals|ods|sdgs)\s*:\s*[\d,\s]+((e|and)\s*\d+)?\s*\.?$/i;
const paragraphs = (text) => String(text || '')
  .split('\n')
  .map((line) => line.trim().replace(SDG_SENTENCE, '').trim())
  .filter(Boolean);

// Normaliza os três tipos de item numa linha: rótulo, título, corpo e rodapé.
const toRow = (branchId, item) => {
  if (branchId === 'competencias') {
    return {
      kicker: item.competency ? item.area : null,
      title: item.competency || item.area,
      text: item.definition,
      foot: item.institution && { icon: 'bi-bank', text: item.institution },
    };
  }
  if (branchId === 'projetos') {
    return {
      kicker: [item.period, item.trl && `TRL ${item.trl}`].filter(Boolean).join(' · ') || null,
      title: item.title,
      text: item.description,
      foot: item.partners && { icon: 'bi-people', text: item.partners },
    };
  }
  const lab = laboratories.find((l) => l.acronym === item.acronym);
  // Laboratórios de ciências sociais aplicadas (LESP, LABSOS) não estão na
  // página de serviços laboratoriais: a descrição deles vive aqui, na linha.
  if (lab && lab.group === 'sociedade') {
    return {
      kicker: lab.acronym,
      title: lab.name,
      meta: [lab.institution, lab.leadRole ? `${lab.lead} (${lab.leadRole})` : lab.lead].filter(Boolean).join(' · '),
      text: [lab.mission?.statement, ...lab.competencyIntro].filter(Boolean),
      foot: [
        lab.approach && { icon: 'bi-people', text: lab.approach },
        lab.infrastructure && { icon: 'bi-door-open', text: lab.infrastructure },
      ].filter(Boolean),
    };
  }
  // Laboratório de bioprocessos: a linha leva à ficha dele em Infraestrutura
  // e Soluções.
  return {
    kicker: item.name ? item.acronym : null,
    title: item.name || item.acronym,
    meta: [item.institution, item.lead].filter(Boolean).join(' · ') || null,
    tag: item.trl || null,
    href: lab ? `/solucoes?lab=${lab.slug}` : null,
  };
};

// Completa a aba Infraestrutura com os laboratórios da planilha de
// laboratórios (generated/laboratories.js) que atendem o eixo e que o
// detalhamento gerado (axisDetails, de outra planilha) ainda não lista —
// hoje, LESP e LABSOS no Eixo 8.
const withLabs = (axisId, branches) => {
  if (!axisId) return branches;
  const infra = branches.find((b) => b.id === 'infra');
  const known = new Set((infra?.items || []).map((i) => i.acronym));
  const missing = laboratories
    .filter((l) => l.axes.includes(String(axisId)) && !known.has(l.acronym))
    .map((l) => ({ acronym: l.acronym, name: l.name, institution: l.institution, lead: l.lead, trl: l.trlSuggested }));
  if (!missing.length) return branches;
  if (infra) return branches.map((b) => (b.id === 'infra' ? { ...b, items: [...b.items, ...missing] } : b));
  return [...branches, { id: 'infra', items: missing }];
};

// ---------- uma linha ----------
const ItemRow = ({ row, open, onToggle, id }) => {
  const expandable = Boolean([].concat(row.text || []).length || [].concat(row.foot || []).length);
  const head = (
    <>
      <span className="axx-row__main">
        {row.kicker && <span className="axx-row__kicker">{row.kicker}</span>}
        <span className="axx-row__title">{row.title}</span>
        {row.meta && <span className="axx-row__meta">{row.meta}</span>}
      </span>
      {row.tag && <span className="axx-row__tag">{row.tag}</span>}
      {expandable && <i className="bi bi-plus-lg axx-row__icon" aria-hidden="true" />}
    </>
  );
  return (
    <li className={`axx-row${open ? ' is-open' : ''}`}>
      {row.href ? (
        <Link to={row.href} className="axx-row__head axx-row__head--link">
          {head}
          <i className="bi bi-arrow-right axx-row__icon" aria-hidden="true" />
        </Link>
      ) : expandable ? (
        <button type="button" className="axx-row__head" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          {head}
        </button>
      ) : (
        <div className="axx-row__head">{head}</div>
      )}
      {expandable && open && (
        <div className="axx-row__body" id={id}>
          {[].concat(row.text || []).map((t, i) => <p key={i}>{t}</p>)}
          {[].concat(row.foot || []).map((f) => (
            <p key={f.text} className="axx-row__foot"><i className={`bi ${f.icon}`} aria-hidden="true" /> {f.text}</p>
          ))}
        </div>
      )}
    </li>
  );
};

// ---------- texto do eixo: recolhido no mobile ----------
const AxisText = ({ paras, labels }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`axx-head__text${open ? ' is-open' : ''}`}>
        {paras.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <button type="button" className="axx-head__more" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? labels.readLess : labels.readMore}
        <i className={`bi bi-chevron-${open ? 'up' : 'down'}`} aria-hidden="true" />
      </button>
    </>
  );
};

const AxisExplorer = ({ axes, detailsById, language, labels }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const branchMeta = BRANCH_META[language] || BRANCH_META.pt;

  const urlAxis = searchParams.get('eixo');
  const urlBranch = searchParams.get('ramo');
  const activeIndex = Math.max(0, axes.findIndex((a) => a.id === urlAxis));
  const activeAxis = axes[activeIndex];

  const branches = useMemo(
    () => withLabs(
      activeAxis?.id,
      ((activeAxis && (activeAxis.details || detailsById[activeAxis.id])) || [])
        .filter((b) => !HIDDEN_BRANCHES.has(b.id) && b.items?.length),
    ),
    [activeAxis, detailsById]
  );
  const activeBranch = branches.find((b) => b.id === urlBranch) || branches[0] || null;

  const [showAll, setShowAll] = useState(false);
  const [openRow, setOpenRow] = useState(null);
  useEffect(() => { setShowAll(false); setOpenRow(null); }, [activeAxis?.id, activeBranch?.id]);

  const select = useCallback((axisId, branchId) => {
    const next = new URLSearchParams(searchParams);
    next.set('eixo', axisId);
    if (branchId) next.set('ramo', branchId); else next.delete('ramo');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // O anterior/próximo fica no pé do painel: ao trocar por ele, volta ao
  // topo do seletor para o eixo novo começar a ser lido do início.
  const rootRef = useRef(null);
  const goTo = (axisId) => {
    select(axisId, null);
    const el = rootRef.current;
    if (el && el.scrollIntoView && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  // Setas do teclado percorrem os eixos, como num tablist.
  const tabRefs = useRef([]);
  const onRailKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = (activeIndex + step + axes.length) % axes.length;
    select(axes[i].id, null);
    tabRefs.current[i]?.focus();
  };

  if (!activeAxis) return null;

  const prev = axes[activeIndex - 1];
  const next = axes[activeIndex + 1];
  const items = activeBranch ? activeBranch.items : [];
  const visible = showAll ? items : items.slice(0, INITIAL_ITEMS);
  const fade = reduceMotion ? false : { opacity: 0, y: 6 };
  const key = `${activeAxis.id}-${language}`;

  return (
    <div className="axx" ref={rootRef} style={{ '--axis': axisTheme(activeAxis.id).color }}>
      {/* ---------- seletor 01–08 ---------- */}
      <div className="axx-rail" role="tablist" aria-label={labels.axesNav} onKeyDown={onRailKey}>
        {axes.map((a, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={a.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`axx-tab-${a.id}`}
              aria-selected={isActive}
              aria-controls="axx-panel"
              aria-label={`${labels.axis} ${a.id}: ${cleanTitle(a.title)}`}
              tabIndex={isActive ? 0 : -1}
              className={`axx-tab${isActive ? ' is-active' : ''}`}
              style={{ '--axis': axisTheme(a.id).color }}
              onClick={() => select(a.id, null)}
            >
              <span className="axx-tab__top">
                <span className="axx-tab__num">{pad(a.id)}</span>
                <i className={`bi ${axisTheme(a.id).icon} axx-tab__icon`} aria-hidden="true" />
              </span>
              <span className="axx-tab__label">{cleanTitle(a.title)}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- painel do eixo ---------- */}
      <div className="axx-panel" id="axx-panel" role="tabpanel" aria-labelledby={`axx-tab-${activeAxis.id}`}>
        <motion.aside
          key={`h-${key}`}
          className="axx-head"
          initial={fade}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="axx-head__top">
            <span className="axx-head__num" aria-hidden="true">{pad(activeAxis.id)}</span>
            <div className="axx-head__id">
              <span className="axx-head__kicker">
                <i className={`bi ${axisTheme(activeAxis.id).icon}`} aria-hidden="true" />{' '}{labels.axis} {pad(activeAxis.id)} <span aria-hidden="true">/</span> {pad(axes.length)}
              </span>
              <h3 className="axx-head__title">{cleanTitle(activeAxis.title)}</h3>
            </div>
          </div>

          <AxisText key={key} paras={paragraphs(activeAxis.content)} labels={labels} />

          {activeAxis.sdgs?.length > 0 && (
            <div className="axx-head__sdgs">
              <span className="axx-head__label">{labels.sdgsTitle}</span>
              <div className="axx-sdgs">
                {activeAxis.sdgs.map((id) => (
                  <img key={id} src={sdgMap[id]} alt={`ODS ${id}`} title={`ODS ${id}`} loading="lazy" />
                ))}
              </div>
            </div>
          )}
        </motion.aside>

        <div className="axx-main">
          {branches.length === 0 ? (
            <p className="axx-empty">{labels.noDetails}</p>
          ) : (
            <>
              <div
                className="axx-branches"
                role="group"
                aria-label={labels.activities}
                style={{ '--n': branches.length }}
              >
                {branches.map((b) => {
                  const meta = branchMeta[b.id] || { label: b.id, icon: 'bi-diagram-2' };
                  const isActive = b.id === activeBranch?.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className={`axx-branch${isActive ? ' is-active' : ''}`}
                      aria-pressed={isActive}
                      onClick={() => select(activeAxis.id, b.id)}
                    >
                      <i className={`bi ${meta.icon}`} aria-hidden="true" />
                      <span className="axx-branch__label">{meta.label}</span>
                      <span className="axx-branch__count">{b.items.length}</span>
                    </button>
                  );
                })}
              </div>

              <motion.ul
                key={`i-${key}-${activeBranch?.id}`}
                className="axx-list"
                initial={fade}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.04 }}
              >
                {visible.map((item, i) => (
                  <ItemRow
                    key={i}
                    id={`axx-row-${activeAxis.id}-${activeBranch.id}-${i}`}
                    row={toRow(activeBranch.id, item)}
                    open={openRow === i}
                    onToggle={() => setOpenRow((cur) => (cur === i ? null : i))}
                  />
                ))}
              </motion.ul>

              {items.length > INITIAL_ITEMS && (
                <button type="button" className="axx-showall" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
                  {showAll
                    ? labels.showLess
                    : `${labels.showAll} ${items.length} ${(branchMeta[activeBranch.id] || {}).noun || ''}`}
                  <i className={`bi bi-chevron-${showAll ? 'up' : 'down'}`} aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>

        {/* ---------- anterior / próximo ---------- */}
        <nav className="axx-pager" aria-label={labels.axesNav}>
          {prev ? (
            <button type="button" className="axx-pager__btn" onClick={() => goTo(prev.id)}>
              <i className="bi bi-arrow-left" aria-hidden="true" />
              <span className="axx-pager__txt">
                <span className="axx-pager__kicker">{labels.axis} {pad(prev.id)}</span>
                <span className="axx-pager__title">{cleanTitle(prev.title)}</span>
              </span>
            </button>
          ) : <span />}
          {next ? (
            <button type="button" className="axx-pager__btn axx-pager__btn--next" onClick={() => goTo(next.id)}>
              <span className="axx-pager__txt">
                <span className="axx-pager__kicker">{labels.axis} {pad(next.id)}</span>
                <span className="axx-pager__title">{cleanTitle(next.title)}</span>
              </span>
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
};

export default AxisExplorer;
