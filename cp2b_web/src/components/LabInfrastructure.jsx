import { useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { researchAxes } from '../data/content';
import { laboratories } from '../data/generated/laboratories';
import { technicalServices } from '../data/generated/services';
import useScrollReveal from '../hooks/useScrollReveal';
import './LabInfrastructure.css';

// Infraestrutura laboratorial do CP2b, na página Infraestrutura e Soluções.
// Todo o conteúdo dos laboratórios vem da aba 'Laboratórios' da planilha
// estratégica (src/data/generated/laboratories.js) — nada aqui é digitado à
// mão, para a página não divergir da fonte oficial.
//
// Dois blocos: a régua de maturidade (TRL 1–9) e o painel dos laboratórios de
// bioprocessos. A página trata de serviço e atividade laboratorial; LESP e
// LABSOS (Eixo 8, ciências sociais aplicadas) ficam no detalhamento do eixo em
// /eixos. Os serviços técnicos não se repetem aqui: o painel leva ao catálogo
// da própria página (onShowServices), já filtrado pelo laboratório.
//
// Estado na URL: ?lab=<slug>&aba=<id>. Assim o detalhamento dos eixos e links
// externos abrem direto no laboratório certo.

const LABELS = {
  pt: {
    mapEyebrow: 'Da bancada ao piloto',
    mapTitle: 'Infraestrutura laboratorial',
    mapSub: 'Faixa de maturidade tecnológica (TRL) em que cada laboratório atua e o seu ponto de maior concentração.',
    phases: ['Conceito e prova de conceito', 'Validação e escalonamento', 'Demonstração e mercado'],
    legendRange: 'Faixa de atuação',
    legendFocus: 'Foco',
    focus: 'foco',
    bioEyebrow: 'Bioprocessos',
    bioTitle: 'Laboratórios de bioprocessos',
    bioSub: 'Caracterização, bioprocessos e escalonamento para biogás e bioprodutos.',
    labsNav: 'Laboratórios',
    lead: 'Responsável',
    axes: 'Eixos',
    axisShort: 'Eixo',
    trl: 'Maturidade (TRL)',
    infrastructure: 'Infraestrutura',
    equipment: 'Equipamentos estratégicos',
    services: (n) => `Ver os ${n} serviços técnicos`,
    tabs: { competencia: 'Competência', maturidade: 'Maturidade', estrategia: 'Papel estratégico' },
    criteria: 'Critérios de competência essencial',
    trlJustification: 'Justificativa por nível',
    approach: 'Como atua',
    ptNotice: null,
  },
  en: {
    mapEyebrow: 'From bench to pilot',
    mapTitle: 'Laboratory infrastructure',
    mapSub: 'The technology readiness (TRL) range each laboratory works in, and where its work concentrates.',
    phases: ['Concept and proof of concept', 'Validation and scale-up', 'Demonstration and market'],
    legendRange: 'Working range',
    legendFocus: 'Focus',
    focus: 'focus',
    bioEyebrow: 'Bioprocesses',
    bioTitle: 'Bioprocess laboratories',
    bioSub: 'Characterization, bioprocesses and scale-up for biogas and bioproducts.',
    labsNav: 'Laboratories',
    lead: 'Lead',
    axes: 'Axes',
    axisShort: 'Axis',
    trl: 'Readiness (TRL)',
    infrastructure: 'Infrastructure',
    equipment: 'Strategic equipment',
    services: (n) => `See the ${n} technical services`,
    tabs: { competencia: 'Competency', maturidade: 'Readiness', estrategia: 'Strategic role' },
    criteria: 'Core competency criteria',
    trlJustification: 'Rationale by level',
    approach: 'How it works',
    ptNotice: 'Laboratory descriptions are shown in Portuguese, as registered in the CP2b strategic plan.',
  },
};

const TABS = ['competencia', 'maturidade', 'estrategia'];
const bioLabs = laboratories.filter((l) => l.group === 'bioprocessos');

const shortAcronym = (acronym) => String(acronym || '').replace(/\s*\(.*?\)\s*/g, '').trim();
const axisTitle = (lang, id) => {
  const axis = (researchAxes[lang] || researchAxes.pt).find((a) => a.id === String(id));
  return axis ? axis.title.split('–')[1]?.trim() || axis.title : '';
};
const servicesOf = (lab) => technicalServices.filter((s) => s.labAcronym === lab.acronym);

// Faixas de TRL: um nível está na faixa de um laboratório quando cai entre o
// mínimo e o máximo dela. As três fases têm três níveis cada (1–3, 4–6, 7–9).
// A régua, o medidor da ficha e o seletor "Qual é o seu desafio?" de
// /solucoes (TrlMatcher) usam estas mesmas contas, para nunca divergirem.
const inTrlRange = (n, trl) => n >= trl.min && n <= trl.max;
const phasesOf = (labels) => labels.phases.map((name, i) => ({ name, from: i * 3 + 1, to: i * 3 + 3 }));
const trlPhases = (language) => phasesOf(LABELS[language] || LABELS.pt);
const labsAtTrl = (n) => bioLabs.filter((l) => inTrlRange(n, l.trl));

const scrollToEl = (el, smooth) => {
  if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
};

// ---------- régua de TRL ----------
const TrlRuler = ({ labels, onPick, activeSlug }) => (
  <div className="lab-trl" role="group" aria-label={labels.mapTitle}>
    <div className="lab-trl__line lab-trl__line--head" aria-hidden="true">
      <span className="lab-trl__label" />
      <span className="lab-trl__track lab-trl__track--phases">
        {/* Chave pela faixa, não pelo nome: o nome muda com o idioma, e a
            fase remontada tocaria de novo a entrada (lab-fade). */}
        {phasesOf(labels).map((p, i) => (
          <span key={p.from} className="lab-trl__phase" style={{ gridColumn: `${p.from} / ${p.to + 1}`, '--i': i }}>
            <span className="lab-trl__phase-range">TRL {p.from}–{p.to}</span>
            <span className="lab-trl__phase-name">{p.name}</span>
          </span>
        ))}
      </span>
    </div>
    <div className="lab-trl__line lab-trl__line--nums" aria-hidden="true">
      <span className="lab-trl__label" />
      <span className="lab-trl__track">
        {Array.from({ length: 9 }, (_, i) => <span key={i} className="lab-trl__num">{i + 1}</span>)}
      </span>
    </div>

    {bioLabs.map((lab, index) => {
      const { min, max, focus } = lab.trl;
      const span = max - min + 1;
      return (
        <button
          key={lab.slug}
          type="button"
          className={`lab-trl__line lab-trl__row${activeSlug === lab.slug ? ' is-active' : ''}`}
          style={{ '--i': index }}
          onClick={() => onPick(lab.slug)}
          aria-label={`${shortAcronym(lab.acronym)}: TRL ${min}–${max}, ${labels.focus} TRL ${focus}`}
        >
          <span className="lab-trl__label">
            <span className="lab-trl__acr">{shortAcronym(lab.acronym)}</span>
            <span className="lab-trl__inst">{lab.institution} · TRL {min}–{max}</span>
          </span>
          <span className="lab-trl__track">
            <span className="lab-trl__bar" style={{ gridColumn: `${min} / ${max + 1}` }}>
              <span className="lab-trl__focus" style={{ left: `${((focus - min + 0.5) / span) * 100}%` }} />
            </span>
          </span>
        </button>
      );
    })}

    <div className="lab-trl__legend" aria-hidden="true">
      <span><i className="lab-trl__key lab-trl__key--range" /> {labels.legendRange}</span>
      <span><i className="lab-trl__key lab-trl__key--focus" /> {labels.legendFocus}</span>
    </div>
  </div>
);

// ---------- medidor compacto de TRL (ficha do laboratório) ----------
const TrlMeter = ({ trl, labels }) => (
  <div className="lab-meter">
    <div className="lab-meter__cells" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        const on = inTrlRange(n, trl);
        return <span key={n} className={`lab-meter__cell${on ? ' is-on' : ''}${n === trl.focus ? ' is-focus' : ''}`}>{n}</span>;
      })}
    </div>
    <span className="lab-meter__caption">TRL {trl.min}–{trl.max} · {labels.focus} TRL {trl.focus}</span>
  </div>
);

const AxisChips = ({ lab, language, labels }) => (
  <span className="lab-chips">
    {lab.axes.map((id) => (
      <Link key={id} to={`/eixos?eixo=${id}#explorar-eixos`} className="lab-chip" title={axisTitle(language, id)}>
        {labels.axisShort} {id}
      </Link>
    ))}
  </span>
);

const NumberedList = ({ items }) => (
  <ol className="lab-criteria">
    {items.map((c, i) => (
      <li key={c.title}>
        <span className="lab-criteria__num">{String(i + 1).padStart(2, '0')}</span>
        <h4>{c.title}</h4>
        <p>{c.text}</p>
      </li>
    ))}
  </ol>
);

// ---------- abas do laboratório ----------
const TabContent = ({ tab, lab, labels }) => {
  if (tab === 'competencia') {
    return (
      <div className="lab-tab">
        {lab.competencyIntro.map((p, i) => <p key={i} className={i === 0 ? 'lab-lead' : 'lab-text'}>{p}</p>)}
        {lab.criteria.length > 0 && (
          <>
            <span className="lab-kicker lab-kicker--sep">{lab.criteriaIntro || labels.criteria}</span>
            <NumberedList items={lab.criteria} />
          </>
        )}
      </div>
    );
  }
  if (tab === 'maturidade') {
    return (
      <div className="lab-tab">
        <span className="lab-kicker">{labels.trlJustification}</span>
        <ol className="lab-levels">
          {lab.trl.levels.map((lv) => (
            <li key={lv.level} className={lv.level === lab.trl.focus ? 'is-focus' : undefined}>
              <span className="lab-levels__num"><span>TRL</span>{lv.level}</span>
              <div>
                <h4>
                  {lv.name}
                  {lv.level === lab.trl.focus && <span className="lab-levels__focus">{labels.focus}</span>}
                </h4>
                <p>{lv.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  return (
    <div className="lab-tab">
      {lab.approach && (
        <>
          <span className="lab-kicker">{labels.approach}</span>
          <p className="lab-lead">{lab.approach}</p>
        </>
      )}
      {lab.mission?.statement && <p className="lab-lead">{lab.mission.statement}</p>}
      {lab.mission?.points?.length > 0 && <NumberedList items={lab.mission.points} />}
    </div>
  );
};

// ---------- painel dos laboratórios de bioprocessos ----------
const LabDossier = ({ activeSlug, activeTab, onSelect, onShowServices, language, labels, reduceMotion }) => {
  const lab = bioLabs.find((l) => l.slug === activeSlug) || bioLabs[0];
  const tab = TABS.includes(activeTab) ? activeTab : TABS[0];
  const fade = reduceMotion ? false : { opacity: 0, y: 6 };
  const nameDiffers = lab.name && shortAcronym(lab.acronym).toLowerCase() !== lab.name.toLowerCase();
  const nServices = servicesOf(lab).length;

  return (
    <div className="lab-dossier">
      <div className="lab-rail" role="tablist" aria-label={labels.labsNav}>
        {bioLabs.map((l) => (
          <button
            key={l.slug}
            type="button"
            role="tab"
            id={`lab-tab-${l.slug}`}
            aria-selected={l.slug === lab.slug}
            aria-controls="lab-panel"
            className={`lab-rail__tab${l.slug === lab.slug ? ' is-active' : ''}`}
            onClick={() => onSelect(l.slug, null)}
          >
            <span className="lab-rail__acr">{shortAcronym(l.acronym)}</span>
            <span className="lab-rail__meta">
              <span className="lab-rail__inst">{l.institution} · </span>TRL {l.trl.min}–{l.trl.max}
            </span>
          </button>
        ))}
      </div>

      <div className="lab-panel" id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${lab.slug}`}>
        <motion.aside
          key={`a-${lab.slug}`}
          className="lab-aside"
          initial={fade}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          <span className="lab-kicker">{lab.institution}</span>
          <h3 className="lab-aside__acr">{shortAcronym(lab.acronym)}</h3>
          {nameDiffers && <p className="lab-aside__name">{lab.name}</p>}

          <dl className="lab-facts">
            <div><dt>{labels.lead}</dt><dd>{lab.lead}</dd></div>
            <div><dt>{labels.axes}</dt><dd><AxisChips lab={lab} language={language} labels={labels} /></dd></div>
            <div><dt>{labels.trl}</dt><dd><TrlMeter trl={lab.trl} labels={labels} /></dd></div>
            {lab.infrastructure && <div><dt>{labels.infrastructure}</dt><dd>{lab.infrastructure}</dd></div>}
            {lab.equipment.length > 0 && (
              <div>
                <dt>{labels.equipment}</dt>
                <dd><ul className="lab-equip">{lab.equipment.map((e) => <li key={e}>{e}</li>)}</ul></dd>
              </div>
            )}
          </dl>

          {nServices > 0 && onShowServices && (
            <button type="button" className="lab-services-link" onClick={() => onShowServices(shortAcronym(lab.acronym))}>
              {labels.services(nServices)} <i className="bi bi-arrow-down-short" aria-hidden="true" />
            </button>
          )}
        </motion.aside>

        <div className="lab-main">
          <div className="lab-seg" role="group" aria-label={shortAcronym(lab.acronym)}>
            {TABS.map((id) => (
              <button
                key={id}
                type="button"
                className={`lab-seg__btn${id === tab ? ' is-active' : ''}`}
                aria-pressed={id === tab}
                onClick={() => onSelect(lab.slug, id)}
              >
                {labels.tabs[id]}
              </button>
            ))}
          </div>
          {labels.ptNotice && <p className="lab-note"><i className="bi bi-translate" aria-hidden="true" /> {labels.ptNotice}</p>}
          <motion.div
            key={`t-${lab.slug}-${tab}`}
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.04 }}
          >
            <TabContent tab={tab} lab={lab} labels={labels} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const LabInfrastructure = ({ language, onShowServices }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const labels = LABELS[language] || LABELS.pt;

  const urlLab = searchParams.get('lab');
  const urlTab = searchParams.get('aba');
  const activeSlug = bioLabs.some((l) => l.slug === urlLab) ? urlLab : bioLabs[0]?.slug;

  const dossierRef = useRef(null);
  // Na primeira vez que a régua aparece, as fases surgem, cada barra cresce
  // da sua ponta esquerda até ocupar a faixa, um laboratório depois do outro,
  // e o marcador de foco aparece por último (ver LabInfrastructure.css).
  const mapRef = useRef(null);
  const mapReveal = useScrollReveal(mapRef);

  const select = useCallback((slug, tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('lab', slug);
    if (tab) next.set('aba', tab); else next.delete('aba');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const pickFromRuler = (slug) => {
    select(slug, null);
    scrollToEl(dossierRef.current, !reduceMotion);
  };

  // Chegando com ?lab=... (do detalhamento dos eixos), rola até o
  // laboratório. Adiado um quadro: o ScrollToTop do App roda depois deste
  // efeito e levaria a página de volta ao topo.
  useEffect(() => {
    if (!urlLab) return undefined;
    const id = requestAnimationFrame(() => scrollToEl(dossierRef.current, false));
    return () => cancelAnimationFrame(id);
    // Só na chegada: trocar de laboratório dentro da página não deve rolar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ---------- régua de maturidade: painel sobre o hero ---------- */}
      <section ref={mapRef} className="lab-map" aria-labelledby="lab-map-title" data-reveal={mapReveal}>
        <header className="lab-head">
          <span className="eyebrow">{labels.mapEyebrow}</span>
          <h2 id="lab-map-title">{labels.mapTitle}</h2>
          <p>{labels.mapSub}</p>
        </header>
        <TrlRuler labels={labels} onPick={pickFromRuler} activeSlug={activeSlug} />
      </section>

      {/* ---------- laboratórios de bioprocessos ---------- */}
      <section className="lab-section" id="laboratorios" ref={dossierRef} aria-labelledby="lab-bio-title">
        <header className="lab-head lab-head--left">
          <span className="eyebrow">{labels.bioEyebrow}</span>
          <h2 id="lab-bio-title">{labels.bioTitle}</h2>
          <p>{labels.bioSub}</p>
        </header>
        <LabDossier
          activeSlug={activeSlug}
          activeTab={urlTab}
          onSelect={select}
          onShowServices={onShowServices}
          language={language}
          labels={labels}
          reduceMotion={reduceMotion}
        />
      </section>
    </>
  );
};

// Para o seletor de TRL de /solucoes (TrlMatcher): mesmos laboratórios,
// mesmas faixas, mesmos nomes de fase e os mesmos chips de eixo desta página.
// eslint-disable-next-line react-refresh/only-export-components
export { AxisChips, labsAtTrl, trlPhases, shortAcronym };

export default LabInfrastructure;
