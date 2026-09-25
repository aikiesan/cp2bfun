import { topWords, topExpressions, wordCloudSource } from '../data/wordCloud';
import './WordCloud.css';

// Nuvem de palavras do CP2b: as palavras mais frequentes em tamanho
// proporcional à contagem, e as expressões compostas como barras — comparar
// comprimento é mais preciso que comparar tamanho de fonte. HTML puro (sem
// biblioteca): leve, legível por leitor de tela e com a contagem no hover/foco.
const LABELS = {
  pt: {
    eyebrow: 'Vocabulário',
    title: 'Do que fala o CP2b',
    words: 'Palavras mais frequentes',
    expressions: 'Expressões mais frequentes',
    occurrences: 'ocorrências',
  },
  en: {
    eyebrow: 'Vocabulary',
    title: 'What CP2b talks about',
    words: 'Most frequent words',
    expressions: 'Most frequent expressions',
    occurrences: 'occurrences',
  },
};

// Tamanho pela raiz da contagem (a área do texto cresce com a frequência),
// entre 0.85rem e 2.7rem.
const MIN_REM = 0.85;
const MAX_REM = 2.7;
const counts = topWords.map((w) => w.n);
const lo = Math.sqrt(Math.min(...counts));
const hi = Math.sqrt(Math.max(...counts));
const sizeOf = (n) => MIN_REM + ((Math.sqrt(n) - lo) / (hi - lo)) * (MAX_REM - MIN_REM);

// Três tons da marca por faixa de frequência.
const toneOf = (rank) => (rank < 6 ? 'is-top' : rank < 18 ? 'is-mid' : 'is-low');

// Do centro para fora: a mais frequente no meio, as seguintes alternando
// esquerda/direita — o formato de nuvem sem precisar de posicionamento absoluto.
const centerOut = (list) => list.reduce((acc, item, i) => (i % 2 ? [item, ...acc] : [...acc, item]), []);

const WordCloud = ({ language }) => {
  const t = LABELS[language] || LABELS.pt;
  const ranked = topWords.map((w, rank) => ({ ...w, rank }));
  const maxExpr = Math.max(...topExpressions.map((e) => e.n));
  return (
    <section className="wcloud" aria-labelledby="wcloud-title">
      <header className="wcloud__head">
        <span className="eyebrow">{t.eyebrow}</span>
        <h2 id="wcloud-title">{t.title}</h2>
        <p>{wordCloudSource[language] || wordCloudSource.pt}</p>
      </header>

      <div className="wcloud__body">
        <div className="wcloud__cloud-wrap">
          <h3 className="wcloud__label">{t.words}</h3>
          <ul className="wcloud__cloud">
            {centerOut(ranked).map((w) => {
              const term = w[language] || w.pt;
              return (
                <li
                  key={w.pt}
                  className={`wcloud__word ${toneOf(w.rank)}`}
                  style={{ '--size': sizeOf(w.n).toFixed(2) }}
                  tabIndex={0}
                  data-count={w.n}
                  title={`${term}: ${w.n} ${t.occurrences}`}
                >
                  {term}
                  <span className="visually-hidden">, {w.n} {t.occurrences}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="wcloud__expr-wrap">
          <h3 className="wcloud__label">{t.expressions}</h3>
          <ol className="wcloud__expr">
            {topExpressions.map((e) => (
              <li key={e.pt}>
                <span className="wcloud__expr-term">{e[language] || e.pt}</span>
                <span className="wcloud__expr-bar" aria-hidden="true">
                  <span style={{ width: `${(e.n / maxExpr) * 100}%` }} />
                </span>
                <span className="wcloud__expr-n">
                  {e.n}<span className="visually-hidden"> {t.occurrences}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default WordCloud;
