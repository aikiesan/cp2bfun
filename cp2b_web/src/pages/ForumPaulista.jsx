import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import './ForumPaulista.css';

// Memória do I Fórum Paulista. Segue os tokens e componentes do resto do site
// (eyebrow, btn-hero, cores da marca): as fotos são o momento da página, e o
// resto fica quieto em volta delas.

const gallery = Array.from({ length: 30 }, (_, index) => ({
  src: `/assets/forum-paulista/forum-2026-${String(index + 1).padStart(2, '0')}.webp`,
  index,
}));

const ptAlt = [
  'Estrutura externa preparada para receber os participantes', 'Participantes diante do painel do CP2b', 'Mesa de abertura institucional', 'Auditório do Fórum durante a abertura', 'Painel institucional diante do público', 'Visão geral do público no auditório', 'Painelistas em diálogo no palco', 'Registro de painelistas após uma sessão', 'Apresentação acompanhada pelo público', 'Participantes diante da identidade visual do CP2b', 'Encontro e conversas no gramado', 'Momento de convivência na área externa', 'Grupo de participantes no painel do CP2b', 'Participante diante do painel do CP2b', 'Retrato de participante no evento', 'Registro espontâneo na área externa', 'Duas participantes diante do painel do CP2b', 'Painel temático no auditório', 'Encerramento no palco', 'Momento de encerramento com o mascote do CP2b', 'Espaço do CP2b preparado para a inauguração', 'Visita aos espaços do CP2b', 'Mesa da cerimônia de inauguração', 'Assinatura durante a cerimônia institucional', 'Descerramento das placas inaugurais', 'Público acompanhando o descerramento das placas', 'Autoridades junto às placas inaugurais', 'Estudantes durante a visita aos espaços do CP2b', 'Participantes reunidos na área externa do CP2b', 'Equipe reunida ao final da programação',
];

const enAlt = [
  'Outdoor structure set up to welcome attendees', 'Attendees in front of the CP2b panel', 'Institutional opening table', 'The Forum auditorium during the opening', 'Institutional panel facing the audience', 'Overview of the audience in the auditorium', 'Panelists in conversation on stage', 'Panelists after a session', 'A presentation followed by the audience', 'Attendees in front of the CP2b visual identity', 'Meetings and conversations on the lawn', 'Time together in the outdoor area', 'A group of attendees at the CP2b panel', 'An attendee at the CP2b panel', 'Portrait of an attendee at the event', 'An informal moment in the outdoor area', 'Two attendees at the CP2b panel', 'Thematic panel in the auditorium', 'Closing on stage', 'Closing moment with the CP2b mascot', 'CP2b space prepared for the opening', 'Visit to the CP2b spaces', 'Table at the opening ceremony', 'Signing during the institutional ceremony', 'Unveiling of the opening plaques', 'Audience watching the plaques being unveiled', 'Officials beside the opening plaques', 'Students during the visit to the CP2b spaces', 'Attendees gathered in the CP2b outdoor area', 'The team together at the end of the programme',
];

// Datas no formato das placas e crachás, em fonte mono: o único detalhe
// próprio desta página. Iguais nos dois idiomas.
const FORUM_DATE = '28.05.2026';
const OPENING_DATE = '29.05.2026';

const content = {
  pt: {
    eyebrow: 'Memória do evento',
    title: 'I Fórum Paulista de Biogás e Bioprodutos',
    lead: 'Um dia de ciência, diálogo e novos contatos para fazer avançar o biogás e os bioprodutos no Estado de São Paulo.',
    location: 'Centro de Convenções da Unicamp, Campinas',
    photosButton: 'Ver as fotos do evento',
    statsLabel: 'Números do evento',
    stats: [
      { value: '140', label: 'pessoas presentes', note: 'na lista de presença final' },
      { value: '60+', label: 'instituições conectadas', note: 'entre academia, mercado e poder público' },
      { value: '3', label: 'painéis de diálogo', note: 'sobre os caminhos do setor' },
    ],
    storyTag: 'O encontro',
    storyTitle: 'Pesquisa, mercado e poder público na mesma sala',
    storyP1: 'O I Fórum Paulista de Biogás e Bioprodutos reuniu pesquisadores, estudantes, profissionais, empresas e representantes do poder público para conversar sobre os caminhos do setor — da pesquisa e do financiamento à regulação, ao mercado e à inovação.',
    storyP2: 'Mais do que uma programação de palestras, foi um dia de encontros: ideias compartilhadas no auditório, conversas no gramado, novos contatos e uma rede mais forte em torno da transição para uma economia circular e de baixo carbono.',
    verifiedNote: 'Total de participantes conforme a lista de presença final do evento.',
    storyCaption: 'Unicamp',
    bridgeTag: 'Do Fórum à inauguração',
    bridgeTitle: 'Dois dias que marcaram a história do CP2b',
    bridgeText: 'No dia seguinte ao Fórum, 29 de maio, a programação continuou com a inauguração dos espaços do CP2b: visita às instalações, cerimônia institucional e descerramento das placas.',
    forumLabel: 'Fórum',
    openingLabel: 'Inauguração',
    galleryTag: 'Álbum do evento',
    galleryTitle: '30 fotos do Fórum e da inauguração',
    galleryLead: 'Uma seleção entre mais de 150 registros. Clique em uma foto para ampliar.',
    showAll: 'Ver as 30 fotos',
    showLess: 'Mostrar a seleção',
    previous: 'Foto anterior',
    next: 'Próxima foto',
    close: 'Fechar',
    photoOf: (current) => `Foto ${current} de 30`,
    alt: ptAlt,
    thanksTag: 'Agradecimentos',
    thanksTitle: 'Obrigado a quem construiu a primeira edição',
    thanksText: 'Agradecemos a cada participante, painelista, pesquisador, estudante, parceiro, patrocinador e integrante da equipe que deu vida à primeira edição.',
    sponsors: 'Patrocínio e apoio',
    closing: 'A primeira edição terminou. A rede que ela aproximou continua crescendo.',
    closingStrong: 'Até a próxima edição',
  },
  en: {
    eyebrow: 'Event record',
    title: '1st São Paulo Forum on Biogas and Bioproducts',
    lead: 'A day of science, dialogue and new connections to advance biogas and bioproducts in São Paulo State.',
    location: 'Unicamp Convention Center, Campinas',
    photosButton: 'See the event photos',
    statsLabel: 'The event in numbers',
    stats: [
      { value: '140', label: 'people attended', note: 'according to the final attendance list' },
      { value: '60+', label: 'institutions connected', note: 'across academia, industry and government' },
      { value: '3', label: 'discussion panels', note: 'on pathways for the sector' },
    ],
    storyTag: 'The gathering',
    storyTitle: 'Research, industry and government in one room',
    storyP1: 'The 1st São Paulo Forum on Biogas and Bioproducts brought together researchers, students, professionals, companies and public-sector representatives to discuss the sector’s future — from research and funding to regulation, markets and innovation.',
    storyP2: 'More than a programme of talks, it was a day of encounters: ideas shared in the auditorium, conversations on the lawn, new contacts and a stronger network around the transition to a circular, low-carbon economy.',
    verifiedNote: 'Attendance total according to the event’s final attendance list.',
    storyCaption: 'Unicamp',
    bridgeTag: 'From the Forum to the opening',
    bridgeTitle: 'Two days that became part of CP2b’s history',
    bridgeText: 'On May 29, the day after the Forum, the programme continued with the opening of CP2b’s facilities: a visit to the spaces, an institutional ceremony and the unveiling of the plaques.',
    forumLabel: 'Forum',
    openingLabel: 'Opening',
    galleryTag: 'Event album',
    galleryTitle: '30 photos from the Forum and the opening',
    galleryLead: 'A selection from more than 150 photographs. Select a photo to enlarge it.',
    showAll: 'View all 30 photos',
    showLess: 'Show the selection',
    previous: 'Previous photo',
    next: 'Next photo',
    close: 'Close',
    photoOf: (current) => `Photo ${current} of 30`,
    alt: enAlt,
    thanksTag: 'Thanks',
    thanksTitle: 'Thank you to everyone who built the first edition',
    thanksText: 'Our thanks to every attendee, panelist, researcher, student, partner, sponsor and team member who brought the first edition to life.',
    sponsors: 'Sponsors and supporters',
    closing: 'The first edition has ended. The network it brought together keeps growing.',
    closingStrong: 'Until the next edition',
  },
};

// Uma curva e uma entrada curta, como no resto do site.
const EASE = [0.4, 0, 0.2, 1];
const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.4, ease: EASE },
};

const ForumPaulista = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.forum[language] || pageSeo.forum.pt;
  const t = content[language] || content.pt;
  const [showAll, setShowAll] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const visibleGallery = showAll ? gallery : gallery.slice(0, 12);

  useEffect(() => {
    if (activePhoto === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActivePhoto(null);
      if (event.key === 'ArrowLeft') setActivePhoto((current) => (current + gallery.length - 1) % gallery.length);
      if (event.key === 'ArrowRight') setActivePhoto((current) => (current + 1) % gallery.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKeyDown); };
  }, [activePhoto]);

  return (
    <main className="forum-memoir">
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />

      <section className="forum-hero" aria-labelledby="forum-title">
        <img className="forum-hero__image" src={gallery[3].src} alt="" />
        <div className="forum-hero__veil" />
        <div className="forum-shell forum-hero__content">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <span className="eyebrow eyebrow--light">{t.eyebrow}</span>
            <h1 id="forum-title">{t.title}</h1>
            <p className="forum-hero__meta">
              <time className="forum-date" dateTime="2026-05-28">{FORUM_DATE}</time>
              <span aria-hidden="true">·</span>
              <span>{t.location}</span>
            </p>
            <p className="forum-hero__lead">{t.lead}</p>
            <a className="btn-hero btn-hero--primary" href="#fotos">
              {t.photosButton} <i className="bi bi-arrow-down" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Os patrocinadores logo depois da abertura: o agradecimento vem antes
          do relato do dia. */}
      <section className="forum-section forum-thanks-section" aria-labelledby="forum-thanks-title">
        <div className="forum-shell forum-thanks">
          <motion.div {...reveal}>
            <span className="eyebrow">{t.thanksTag}</span>
            <h2 id="forum-thanks-title">{t.thanksTitle}</h2>
            <p>{t.thanksText}</p>
          </motion.div>
          <figure className="forum-thanks__logos">
            <img src="/assets/apoio-patrocinio.png" alt={t.sponsors} loading="lazy" />
            <figcaption>{t.sponsors}</figcaption>
          </figure>
        </div>
      </section>

      <section className="forum-stats" aria-label={t.statsLabel}>
        <dl className="forum-shell forum-stats__grid">
          {t.stats.map((stat) => (
            <div className="forum-stat" key={stat.label}>
              <dt className="forum-stat__label">{stat.label}</dt>
              <dd className="forum-stat__value">{stat.value}</dd>
              <dd className="forum-stat__note">{stat.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="memoria" className="forum-section">
        <div className="forum-shell forum-story">
          <motion.div {...reveal}>
            <span className="eyebrow">{t.storyTag}</span>
            <h2>{t.storyTitle}</h2>
            <p>{t.storyP1}</p>
            <p>{t.storyP2}</p>
            <p className="forum-data-note">{t.verifiedNote}</p>
          </motion.div>
          <motion.figure className="forum-photo forum-story__photo" {...reveal}>
            <img src={gallery[10].src} alt={t.alt[10]} loading="lazy" decoding="async" />
            <figcaption><time className="forum-date" dateTime="2026-05-28">{FORUM_DATE}</time> · {t.storyCaption}</figcaption>
          </motion.figure>
        </div>
      </section>

      <section className="forum-section forum-bridge">
        <div className="forum-shell forum-bridge__grid">
          <motion.div {...reveal}>
            <span className="eyebrow eyebrow--light">{t.bridgeTag}</span>
            <h2>{t.bridgeTitle}</h2>
            <p>{t.bridgeText}</p>
          </motion.div>
          <motion.div className="forum-bridge__photos" {...reveal}>
            <figure className="forum-photo">
              <img src={gallery[8].src} alt={t.alt[8]} loading="lazy" decoding="async" />
              <figcaption><time className="forum-date" dateTime="2026-05-28">{FORUM_DATE}</time> · {t.forumLabel}</figcaption>
            </figure>
            <figure className="forum-photo">
              <img src={gallery[24].src} alt={t.alt[24]} loading="lazy" decoding="async" />
              <figcaption><time className="forum-date" dateTime="2026-05-29">{OPENING_DATE}</time> · {t.openingLabel}</figcaption>
            </figure>
          </motion.div>
        </div>
      </section>

      <section id="fotos" className="forum-section forum-gallery-section">
        <div className="forum-shell">
          <header className="forum-section-head">
            <span className="eyebrow">{t.galleryTag}</span>
            <h2>{t.galleryTitle}</h2>
            <p>{t.galleryLead}</p>
          </header>
          <div className="forum-gallery">
            {visibleGallery.map((photo, visibleIndex) => (
              <button
                className={`forum-gallery__item forum-gallery__item--${visibleIndex % 7}`}
                type="button"
                key={photo.src}
                onClick={() => setActivePhoto(photo.index)}
                aria-label={`${t.photoOf(photo.index + 1)}: ${t.alt[photo.index]}`}
              >
                <img src={photo.src} alt={t.alt[photo.index]} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <div className="forum-gallery__controls">
            <button className="forum-button" type="button" onClick={() => setShowAll((current) => !current)} aria-expanded={showAll}>
              {showAll ? t.showLess : t.showAll}
            </button>
          </div>
        </div>
      </section>

      <section className="forum-closing">
        <div className="forum-shell">
          <p>{t.closing}</p>
          <p className="forum-closing__strong">{t.closingStrong}</p>
        </div>
      </section>

      {activePhoto !== null && (
        <div className="forum-lightbox" role="dialog" aria-modal="true" aria-label={t.photoOf(activePhoto + 1)} onClick={() => setActivePhoto(null)}>
          <button className="forum-lightbox__close" type="button" aria-label={t.close} onClick={() => setActivePhoto(null)}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
          <button
            className="forum-lightbox__nav forum-lightbox__nav--previous"
            type="button"
            aria-label={t.previous}
            onClick={(event) => { event.stopPropagation(); setActivePhoto((activePhoto + gallery.length - 1) % gallery.length); }}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={gallery[activePhoto].src} alt={t.alt[activePhoto]} />
            <figcaption>{t.photoOf(activePhoto + 1)} · {t.alt[activePhoto]}</figcaption>
          </figure>
          <button
            className="forum-lightbox__nav forum-lightbox__nav--next"
            type="button"
            aria-label={t.next}
            onClick={(event) => { event.stopPropagation(); setActivePhoto((activePhoto + 1) % gallery.length); }}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>
      )}
    </main>
  );
};

export default ForumPaulista;
