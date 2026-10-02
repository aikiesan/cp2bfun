import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import CountUp from './CountUp';
import { AxisChips, labsAtTrl, trlPhases, shortAcronym } from './LabInfrastructure';
import './TrlMatcher.css';

// "Qual é o seu desafio?" — a jornada problema → eixo → solução → parceiro de
// /solucoes, feita só com o que a página já mostra: quem visita escolhe o
// nível de maturidade (TRL) da sua demanda e vê quais laboratórios centrais
// atuam nele (responsável e eixos), quantos serviços do catálogo o cobrem e o
// caminho até o contato.
//
// Nada aqui é afirmado à parte: laboratórios, faixas e nomes de fase vêm de
// LabInfrastructure (as mesmas contas da régua), e a contagem de serviços vem
// da página (countServices), a mesma regra do filtro do catálogo. Quando
// nenhum laboratório cobre o nível, o painel diz isso sem rodeios.
//
// Textos em labels (objeto da página Solucoes.jsx, em PT e EN).

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const TrlMatcher = ({ language, labels, countServices, onShowServices }) => {
  const [level, setLevel] = useState(null);
  const reduceMotion = useReducedMotion();
  const phases = trlPhases(language);
  const phase = level ? phases.find((p) => level >= p.from && level <= p.to) : null;
  const labs = level ? labsAtTrl(level) : [];
  const nServices = level ? countServices(level) : 0;

  // Troca de resultado: o painel anterior sai e o novo entra com um
  // deslocamento curto. Com movimento reduzido, só a opacidade muda.
  const swap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
      transition: { duration: 0.3, ease: EASE_OUT_EXPO },
    };
  const rise = (i) => (reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2, delay: i * 0.05 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: 0.08 + i * 0.07, ease: EASE_OUT_EXPO } });

  return (
    <section className="trl-match" id="qual-seu-desafio" aria-labelledby="trl-match-title">
      <header className="lab-head lab-head--left">
        <span className="eyebrow">{labels.eyebrow}</span>
        <h2 id="trl-match-title">{labels.title}</h2>
        <p>{labels.subtitle}</p>
      </header>

      <div className="trl-match__box">
        <span className="trl-match__kicker" id="trl-match-pick">{labels.pickerLabel}</span>
        {/* Nove botões, agrupados nas mesmas três fases da régua. */}
        <div className="trl-match__picker" role="group" aria-labelledby="trl-match-pick">
          {phases.map((p) => (
            <div key={p.name} className="trl-match__phase">
              <span className="trl-match__phase-head" aria-hidden="true">
                <span className="trl-match__phase-range">TRL {p.from}–{p.to}</span>
                <span className="trl-match__phase-name">{p.name}</span>
              </span>
              <span className="trl-match__levels">
                {Array.from({ length: p.to - p.from + 1 }, (_, k) => p.from + k).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`trl-match__level${n === level ? ' is-active' : ''}`}
                    aria-pressed={n === level}
                    aria-label={`TRL ${n}: ${p.name}`}
                    onClick={() => setLevel(n)}
                  >
                    {n}
                  </button>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* O leitor de tela ouve só um resumo curto a cada troca de nível
            ("TRL 4 · Validação e escalonamento: 3 laboratórios, 15
            serviços"); o painel detalhado, com cards e botões, fica fora da
            região viva e é lido quando a pessoa chega nele. */}
        <p className="visually-hidden trl-match__live" aria-live="polite">
          {level ? labels.liveSummary(level, phase.name, labs.length, nServices) : ''}
        </p>

        <div className="trl-match__result">
          <AnimatePresence mode="wait" initial={false}>
            {level ? (
              <motion.div key={level} className="trl-match__panel" {...swap}>
                <p className="trl-match__summary">
                  <span className="trl-match__badge">TRL {level}</span>
                  <span>{phase.name}</span>
                </p>

                <div className="trl-match__cols">
                  <div>
                    <h3 className="trl-match__kicker">{labels.labsTitle}</h3>
                    {labs.length > 0 ? (
                      <ul className="trl-match__labs">
                        {labs.map((lab, i) => (
                          <motion.li key={lab.slug} className="trl-match__lab" {...rise(i)}>
                            <span className="trl-match__lab-top">
                              <span className="trl-match__lab-acr">{shortAcronym(lab.acronym)}</span>
                              {lab.trl.focus === level && <span className="trl-match__focus">{labels.focusHere}</span>}
                            </span>
                            <span className="trl-match__lab-meta">
                              {lab.institution} · TRL {lab.trl.min}–{lab.trl.max} · {labels.focus} TRL {lab.trl.focus}
                            </span>
                            <dl className="trl-match__facts">
                              <div><dt>{labels.lead}</dt><dd>{lab.lead}</dd></div>
                              <div><dt>{labels.axes}</dt><dd><AxisChips lab={lab} language={language} labels={labels} /></dd></div>
                            </dl>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="trl-match__empty">{labels.noLabs}</p>
                    )}
                  </div>

                  <div className="trl-match__services">
                    <h3 className="trl-match__kicker">{labels.servicesTitle}</h3>
                    {nServices > 0 ? (
                      <>
                        {/* O número conta a partir de zero só para quem vê; o
                            leitor de tela recebe o valor uma vez, sem ouvir
                            cada passo da contagem. */}
                        <p className="trl-match__count">
                          <span className="trl-match__num" aria-hidden="true">
                            <CountUp key={level} value={nServices} duration={0.8} />
                          </span>
                          <span className="visually-hidden">{nServices} </span>
                          <span>{labels.servicesCover(nServices)}</span>
                        </p>
                        <button type="button" className="trl-match__show" onClick={() => onShowServices(level)}>
                          {labels.showServices(nServices)} <i className="bi bi-arrow-down-short" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <p className="trl-match__empty">{labels.noServices}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.p key="hint" className="trl-match__hint" {...swap}>
                {labels.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="trl-match__contact">
          <p>{labels.contactLead}</p>
          <Link to="/contato" className="trl-match__cta">
            {labels.contact} <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrlMatcher;
