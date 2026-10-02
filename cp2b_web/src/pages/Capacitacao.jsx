import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo, researchAxes } from '../data/content';
import { capacitacaoContent, courseTemplate, proposalsEmail } from '../data/capacitacao';
import { axisTheme } from '../utils/axisTheme';
import { cleanName, isVacancy } from '../utils/personName';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import Avatar from '../components/Avatar';
import './Capacitacao.css';

// Cursos e Capacitação (Eixo 6): o curso-modelo oficial, a chamada para
// propostas com o template para download e a estrutura que o template pede.
const Capacitacao = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const t = capacitacaoContent[language] || capacitacaoContent.pt;
  const seo = pageSeo.capacitacao[language] || pageSeo.capacitacao.pt;
  // Coordenação lida do mesmo cadastro de /eixos, para não divergir dele, e
  // mostrada como lá: sem títulos acadêmicos e sem vaga em aberto.
  const axis6 = (researchAxes[language] || researchAxes.pt).find((a) => a.id === '6');
  const coordinators = (axis6?.coordinators || []).filter((p) => !isVacancy(p.name));
  const theme = axisTheme(6);
  const mailto = `mailto:${proposalsEmail}?subject=${encodeURIComponent(t.propose.download.mailSubject)}`;

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />

      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        photo={{ src: '/assets/fotos/capacitacao-auditorio.webp', width: 700, height: 500 }}
        className="page-hero--overlap"
      >
        <div className="cap-hero__actions">
          <a className="cap-btn cap-btn--lime" href="#propor-curso">
            <i className="bi bi-pencil-square" aria-hidden="true" />
            {t.hero.proposeCta}
          </a>
          <a className="cap-hero__link" href="#curso-modelo">
            {t.hero.modelCta}
            <i className="bi bi-arrow-down" aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Container className="cap pb-4 pb-md-5" style={{ '--cap-axis': theme.color }}>
          {/* Curso-modelo: o exemplo oficial da seção 13 do template, em painel
              sobre o hero (no celular, seção comum). */}
          <article id="curso-modelo" className="cap-course" aria-labelledby="cap-course-title">
            <header className="cap-course__head">
              <div className="cap-course__top">
                <span className="cap-course__icon" aria-hidden="true">
                  <i className={`bi ${theme.icon}`} />
                </span>
                <span className="cap-chip cap-chip--axis">{t.model.badge}</span>
                <span className="cap-chip cap-chip--hours">
                  <i className="bi bi-clock" aria-hidden="true" />
                  {t.model.hours}
                </span>
              </div>
              <h2 id="cap-course-title" className="cap-course__title">{t.model.title}</h2>
              <p className="cap-course__intro">{t.model.intro}</p>
              {/* Carga horária em destaque a partir do tablet; no celular ela
                  vai no chip acima, para o título ter a largura toda. */}
              <div className="cap-course__hours" aria-hidden="true">
                <span className="cap-course__hours-num">{t.model.hoursValue}</span>
                <span className="cap-course__hours-unit">{t.model.hoursUnit}</span>
              </div>
            </header>

            <div className="cap-course__body">
              <dl className="cap-facts">
                <div className="cap-fact">
                  <dt>{t.model.objectiveLabel}</dt>
                  <dd>{t.model.objective}</dd>
                </div>
                <div className="cap-fact">
                  <dt>{t.model.outcomesLabel}</dt>
                  <dd>{t.model.outcomes}</dd>
                </div>
                <div className="cap-fact">
                  <dt>{t.model.audienceLabel}</dt>
                  <dd>
                    <ul className="cap-tags">
                      {t.model.audience.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="cap-fact">
                  <dt>{t.model.hoursLabel}</dt>
                  <dd>{t.model.hours}</dd>
                </div>
              </dl>

              <div className="cap-modules">
                <h3 className="cap-modules__title">{t.model.modulesTitle}</h3>
                <ol className="cap-modules__list">
                  {t.model.modules.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ol>
                <p className="cap-modules__note">{t.model.modulesNote}</p>
              </div>
            </div>

            <footer className="cap-course__foot">
              <p className="cap-course__demo">
                <i className="bi bi-info-circle" aria-hidden="true" />
                {t.model.demoNote}
              </p>
              <Link to="/newsletter" className="arrow-link">
                {t.model.newsletterCta} <i className="bi bi-arrow-right" aria-hidden="true" />
              </Link>
            </footer>
          </article>

          {/* Chamada para propostas: formatos aceitos, passo a passo e o
              template para download. */}
          <section id="propor-curso" className="cap-section" aria-labelledby="cap-propose-title">
            <div className="cap-section__head">
              <span className="mono-label text-success d-block mb-1">{t.propose.tag}</span>
              <h2 id="cap-propose-title" className="fw-bold fs-2 mb-2">{t.propose.title}</h2>
              <p className="text-muted mb-0">{t.propose.lead}</p>
            </div>

            <div className="cap-propose">
              <div className="cap-propose__main">
                <ul className="cap-formats">
                  {t.propose.formats.map((f) => (
                    <li key={f.title} className="cap-format">
                      <span className="cap-format__icon" aria-hidden="true">
                        <i className={`bi ${f.icon}`} />
                      </span>
                      <span className="cap-format__body">
                        <strong className="cap-format__title">{f.title}</strong>
                        <span className="cap-format__text">{f.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="cap-subtitle">{t.propose.stepsTitle}</h3>
                <ol className="cap-steps">
                  {t.propose.steps.map((s, i) => (
                    <li key={s.title} className="cap-step">
                      <span className="cap-step__num" aria-hidden="true">{i + 1}</span>
                      <div className="cap-step__body">
                        <strong className="cap-step__title">{s.title}</strong>
                        <p className="cap-step__text">
                          {s.text}
                          {/* O último passo termina no endereço da chamada. */}
                          {i === t.propose.steps.length - 1 && (
                            <>
                              {' '}
                              <a href={mailto} className="cap-email">{proposalsEmail}</a>.
                            </>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <aside className="cap-download" aria-labelledby="cap-download-title">
                <span className="cap-download__file" aria-hidden="true">
                  <i className="bi bi-file-earmark-word" />
                </span>
                <span className="cap-download__kicker">{t.propose.download.kicker}</span>
                <h3 id="cap-download-title" className="cap-download__title">{t.propose.download.title}</h3>
                <ul id="cap-download-meta" className="cap-download__meta">
                  {t.propose.download.meta.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                {t.propose.download.languageNote && (
                  <p className="cap-download__note">{t.propose.download.languageNote}</p>
                )}
                <a
                  className="cap-btn cap-btn--primary cap-download__button"
                  href={courseTemplate.href}
                  download={courseTemplate.fileName}
                  aria-describedby="cap-download-meta"
                >
                  <i className="bi bi-download" aria-hidden="true" />
                  {t.propose.download.button}
                </a>
                <a className="cap-download__mail" href={mailto}>
                  <i className="bi bi-envelope" aria-hidden="true" />
                  {t.propose.download.mail}
                </a>
              </aside>
            </div>
          </section>

          {/* As seções do template, para o proponente saber de antemão o que
              vai precisar responder. */}
          <section id="estrutura" className="cap-section" aria-labelledby="cap-outline-title">
            <div className="cap-section__head">
              <span className="mono-label text-success d-block mb-1">{t.outline.tag}</span>
              <h2 id="cap-outline-title" className="fw-bold fs-2 mb-2">{t.outline.title}</h2>
              <p className="text-muted mb-0">{t.outline.lead}</p>
            </div>

            <ol className="cap-outline">
              {t.outline.sections.map((s, i) => (
                <li key={s.title} className="cap-outline__item">
                  <span className="cap-outline__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="cap-outline__body">
                    <h3 className="cap-outline__title">{s.title}</h3>
                    <p className="cap-outline__text">{s.text}</p>
                    {s.anchor && (
                      <a href={s.anchor} className="arrow-link small">
                        {t.outline.exampleLink} <i className="bi bi-arrow-up" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Coordenação do Eixo 6 e contato. */}
          <section className="cap-contact" aria-labelledby="cap-contact-title">
            {coordinators.length > 0 && (
              <div className="cap-contact__coord">
                <span className="cap-contact__kicker">{t.contact.coordTitle}</span>
                <ul className="cap-contact__people">
                  {coordinators.map((p) => (
                    <li key={p.name}>
                      {/* O nome vem logo ao lado: a foto é decorativa (alt vazio). */}
                      <Avatar photo={p.photo} name={cleanName(p.name)} alt="" axisId="6" size={48} />
                      <span>{cleanName(p.name)}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/eixos?eixo=6#explorar-eixos" className="cap-contact__axis">
                  {t.contact.axisLink} <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            )}
            <div className="cap-contact__cta">
              <h2 id="cap-contact-title" className="cap-contact__title">{t.contact.title}</h2>
              <p className="cap-contact__lead">{t.contact.lead}</p>
              <a className="cap-btn cap-btn--lime" href={mailto}>
                <i className="bi bi-envelope" aria-hidden="true" />
                {t.contact.button}
              </a>
              <span className="cap-contact__email">{proposalsEmail}</span>
            </div>
          </section>
        </Container>
      </motion.div>
    </>
  );
};

export default Capacitacao;
