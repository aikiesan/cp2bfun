import { useRef } from 'react';
import { sdgMap } from '../data/content';
import { publicationsYear1, publicationsAnalysis } from '../data/publicationsYear1';
import CountUp from './CountUp';
import useScrollReveal from '../hooks/useScrollReveal';
import './PublicationsSummary.css';

// Infográfico "Publicações do Ano 1 — 2025" e os tópicos de análise, no topo de
// /publicacoes. Construído em HTML, e não como imagem: os números ficam
// legíveis por leitor de tela e buscadores, e se ajustam ao celular.
const LABELS = {
  pt: {
    eyebrow: 'Ano 1 · 2025',
    title: 'Publicações do Ano 1',
    subtitle: 'Síntese da produção científica do CP2b no primeiro ano do Centro.',
    publications: 'publicações',
    of: 'de',
    sdgs: 'ODS em destaque',
  },
  en: {
    eyebrow: 'Year 1 · 2025',
    title: 'Year 1 publications',
    subtitle: "A summary of CP2b's scientific output in the Centre's first year.",
    publications: 'publications',
    of: 'of',
    sdgs: 'Highlighted SDGs',
  },
};

// Anel de progresso: a fração do total, na cor da métrica. --len é o
// comprimento do traço, de onde a animação de entrada parte (ver o CSS).
const R = 42;
const C = 2 * Math.PI * R;
const Ring = ({ pct, color }) => (
  <svg className="pubs-ring" viewBox="0 0 100 100" aria-hidden="true">
    <circle className="pubs-ring__track" cx="50" cy="50" r={R} />
    <circle
      className="pubs-ring__bar"
      cx="50"
      cy="50"
      r={R}
      style={{ stroke: color, strokeDasharray: `${(pct / 100) * C} ${C}`, '--len': (pct / 100) * C }}
    />
  </svg>
);

export const PublicationsSummary = ({ language }) => {
  const t = LABELS[language] || LABELS.pt;
  const { total, metrics, sdgs, pillars, year } = publicationsYear1;
  // Na primeira vez em que o painel aparece: o total e as porcentagens
  // contam, os anéis se desenham e os ODS entram em sequência.
  const ref = useRef(null);
  const reveal = useScrollReveal(ref, { amount: 0.2 });
  return (
    <section ref={ref} className="pubs-summary" aria-labelledby="pubs-summary-title" data-reveal={reveal}>
      <header className="pubs-summary__head">
        <div>
          <span className="pubs-summary__eyebrow">{t.eyebrow}</span>
          <h2 id="pubs-summary-title" className="pubs-summary__title">{t.title}</h2>
          <p className="pubs-summary__sub">{t.subtitle}</p>
        </div>
        <div className="pubs-total" aria-label={`${total} ${t.publications} (${year})`}>
          <span className="pubs-total__num"><CountUp value={total} /></span>
          <span className="pubs-total__lbl">{t.publications}</span>
        </div>
      </header>

      <ul className="pubs-metrics">
        {metrics.map((m, index) => {
          const pct = Math.round((m.count / total) * 100);
          const txt = m[language] || m.pt;
          return (
            <li key={m.id} className="pubs-metric" style={{ '--metric': m.color, '--i': index }}>
              <div className="pubs-metric__viz">
                <Ring pct={pct} color={m.color} />
                <span className="pubs-metric__pct"><span><CountUp value={pct} duration={1.2} delay={0.2 + index * 0.12} /><small>%</small></span></span>
              </div>
              <span className="pubs-metric__count">
                <i className={`bi ${m.icon}`} aria-hidden="true" /> {m.count} {t.of} {total}
              </span>
              <h3 className="pubs-metric__title">{txt.title}</h3>
              <p className="pubs-metric__desc">{txt.desc}</p>
              {txt.insight && <p className="pubs-metric__insight">{txt.insight}</p>}
              {txt.goal && (
                <span className="pubs-metric__goal"><i className="bi bi-star-fill" aria-hidden="true" /> {txt.goal}</span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="pubs-sdgs">
        <span className="pubs-sdgs__lbl">{t.sdgs}</span>
        <ul>
          {sdgs.map((s, index) => (
            <li key={s.id} style={{ '--i': index }}>
              <img src={sdgMap[s.id]} alt="" width="40" height="40" loading="lazy" />
              <span><strong>ODS {s.id}</strong> {s[language] || s.pt}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="pubs-pillars">
        {(pillars[language] || pillars.pt).map((p, i) => (
          <span key={p} className="pubs-pillars__item">{i > 0 && <span className="pubs-pillars__dot" aria-hidden="true">·</span>}{p}</span>
        ))}
      </p>
    </section>
  );
};

// Análise completa, recolhida por padrão: os números já estão no infográfico;
// quem quiser a leitura estratégica abre aqui, em uma linha por tópico.
export const PublicationsAnalysis = ({ language }) => {
  const a = publicationsAnalysis[language] || publicationsAnalysis.pt;
  return (
    <details className="pubs-more">
      <summary>
        <span>{a.toggle}</span>
        <i className="bi bi-chevron-down" aria-hidden="true" />
      </summary>
      <div className="pubs-more__body">
        <p className="pubs-more__intro">{a.intro}</p>
        <ol className="pubs-topics">
          {a.topics.map((topic, i) => (
            <li key={topic.title} style={{ '--metric': (publicationsYear1.metrics[i] || {}).color || '#467F25' }}>
              <span className="pubs-topics__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{topic.title}</h3>
                <p>{topic.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
};
