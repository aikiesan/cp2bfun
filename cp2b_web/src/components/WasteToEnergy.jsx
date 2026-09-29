import { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './WasteToEnergy.css';

/**
 * "Do resíduo à energia": the biogas chain in five steps, told as the page
 * scrolls, on /eixos between the axis figure and the axis details. On wide
 * screens a stage stays pinned beside the steps and follows whichever one is
 * crossing the middle of the viewport: its illustration, its number, and a
 * pipe that fills node by node. On narrow screens the stage is dropped and
 * each step carries its own illustration.
 *
 * The steps list is the content; the stage is a picture of it and is hidden
 * from assistive technology. Each axis chip opens that axis in the details
 * below (Research.jsx reads ?eixo=, scrolls to the hash and moves the focus
 * to the axis tab), replacing the history entry rather than adding one.
 *
 * Motion (none of it loops): the heading and the stage arrive once, the first
 * time they scroll into view (useScrollReveal, so under reduced motion or
 * without layout nothing is ever held hidden); after that every change of
 * step is a CSS transition, which the global prefers-reduced-motion rule
 * turns into a plain swap.
 */

const pad = (n) => String(n).padStart(2, '0');

const defaultAxisHref = (id) => `/eixos?eixo=${id}#explorar-eixos`;

const WasteToEnergy = ({ copy, axisNames, axisHref = defaultAxisHref }) => {
  const { steps } = copy;
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);
  const headRef = useRef(null);
  const stageRef = useRef(null);
  const headReveal = useScrollReveal(headRef);
  const stageReveal = useScrollReveal(stageRef, { amount: 0.4 });

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return undefined;

    // A thin band across the middle of the viewport: whichever step is
    // crossing it is the current one.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;

  return (
    <section className="w2e" aria-labelledby="w2e-title">
      <Container>
        <div ref={headRef} className="w2e-head" data-reveal={headReveal}>
          <span className="eyebrow eyebrow--light">{copy.eyebrow}</span>
          <h2 id="w2e-title" className="w2e-title">{copy.title}</h2>
          <p className="w2e-subtitle">{copy.subtitle}</p>
        </div>

        <div className="w2e-grid">
          <div ref={stageRef} className="w2e-stage" aria-hidden="true" data-reveal={stageReveal}>
            <div className="w2e-stage-card">
              {steps.map((step, i) => (
                <img
                  key={step.key}
                  src={step.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`w2e-stage-art${i === active ? ' is-active' : ''}`}
                />
              ))}
              {/* Keyed by the step, so the number slides in afresh each time. */}
              <span key={active} className="w2e-stage-num">
                {pad(active + 1)}
              </span>
              <span className="w2e-stage-kicker">{steps[active].kicker}</span>
            </div>

            <div
              className="w2e-rail"
              style={{ '--w2e-progress': progress, '--w2e-steps': steps.length }}
            >
              <span className="w2e-rail-track">
                <span className="w2e-rail-fill" />
              </span>
              <ol className="w2e-rail-nodes">
                {steps.map((step, i) => (
                  <li key={step.key} className={i <= active ? 'is-reached' : undefined} style={{ '--i': i }}>
                    <span className="w2e-rail-dot" />
                    <span className="w2e-rail-label">{step.kicker}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ol className="w2e-steps">
            {steps.map((step, i) => (
              <li
                key={step.key}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-index={i}
                className={`w2e-step${i === active ? ' is-active' : ''}`}
                // Tabbing through the chips brings the stage along, not only
                // scrolling.
                onFocus={() => setActive(i)}
              >
                <img className="w2e-step-art" src={step.image} alt="" loading="lazy" decoding="async" />
                <div className="w2e-step-body">
                  <span className="w2e-step-num">
                    {pad(i + 1)} <span aria-hidden="true">·</span> {step.kicker}
                  </span>
                  <h3 className="w2e-step-title">{step.title}</h3>
                  <p className="w2e-step-text">{step.text}</p>
                  {/* replace, como a figura dos eixos e as abas do
                      detalhamento: trocar de eixo nesta página não empilha
                      histórico, e o Voltar sai de /eixos de uma vez. */}
                  <ul className="w2e-step-axes">
                    {step.axes.map((id) => (
                      <li key={id}>
                        <Link to={axisHref(id)} replace className="w2e-axis-chip">
                          <span className="w2e-axis-chip-num">
                            {copy.axisLabel} {id}
                          </span>{' '}
                          {axisNames[id]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
};

export default WasteToEnergy;
