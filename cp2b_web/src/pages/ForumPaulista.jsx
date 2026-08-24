import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import './ForumPaulista.css';

const gallery = Array.from({ length: 30 }, (_, index) => ({
  src: `/assets/forum-paulista/forum-2026-${String(index + 1).padStart(2, '0')}.webp`,
  index,
}));

const ptAlt = [
  'Estrutura externa preparada para receber os participantes', 'Participantes diante do painel do CP2b', 'Mesa de abertura institucional', 'Auditório do Fórum durante a abertura', 'Painel institucional diante do público', 'Visão geral do público no auditório', 'Painelistas em diálogo no palco', 'Registro de painelistas após uma sessão', 'Apresentação acompanhada pelo público', 'Participantes diante da identidade visual do CP2b', 'Encontro e conversas no gramado', 'Momento de convivência na área externa', 'Grupo de participantes no painel do CP2b', 'Participante diante do painel do CP2b', 'Retrato de participante no evento', 'Registro espontâneo na área externa', 'Duas participantes diante do painel do CP2b', 'Painel temático no auditório', 'Encerramento no palco', 'Momento de encerramento com o mascote do CP2b', 'Espaço do CP2b preparado para a inauguração', 'Visita aos espaços do CP2b', 'Mesa da cerimônia de inauguração', 'Assinatura durante a cerimônia institucional', 'Descerramento das placas inaugurais', 'Público acompanhando o descerramento das placas', 'Autoridades junto às placas inaugurais', 'Estudantes durante a visita aos espaços do CP2b', 'Participantes reunidos na área externa do CP2b', 'Equipe reunida ao final da programação',
];

const content = {
  pt: {
    badge: '1ª EDIÇÃO · 28 DE MAIO DE 2026',
    title: 'Este foi o nosso Fórum. E foi incrível.',
    lead: 'Um encontro feito de ciência, diálogo e conexões para impulsionar o biogás e os bioprodutos no Estado de São Paulo.',
    location: 'Centro de Convenções da Unicamp · Campinas, SP', photosButton: 'Rever os melhores momentos', nextEdition: 'Até o ano que vem!',
    stats: [
      { value: '140', label: 'pessoas presentes', note: 'na lista de presença final' },
      { value: '60+', label: 'instituições conectadas', note: 'entre academia, mercado e poder público' },
      { value: '3', label: 'painéis de diálogo', note: 'sobre os caminhos do setor' },
    ],
    storyTag: 'UMA MEMÓRIA EM MOVIMENTO', storyTitle: 'Quando diferentes vozes se encontram, novas possibilidades aparecem',
    storyP1: 'O I Fórum Paulista de Biogás e Bioprodutos reuniu pesquisadores, estudantes, profissionais, empresas e representantes do poder público para conversar sobre os caminhos do setor — da pesquisa e do financiamento à regulação, ao mercado e à inovação.',
    storyP2: 'Mais do que uma programação de palestras, vivemos um dia de encontros: ideias compartilhadas no auditório, conversas no gramado, novos contatos e o fortalecimento de uma rede comprometida com a transição para uma economia circular e de baixo carbono.',
    verifiedNote: 'Total de participantes conforme a lista de presença final do evento.',
    momentsTag: 'O QUE VIVEMOS', momentsTitle: 'Um evento contado em quatro momentos',
    moments: [
      { icon: 'bi-people', number: '01', title: 'Encontro', text: 'A comunidade do biogás e dos bioprodutos ocupou a Unicamp para trocar experiências e construir novas conexões.' },
      { icon: 'bi-chat-square-text', number: '02', title: 'Diálogo', text: 'Os painéis aproximaram academia, indústria e poder público em conversas francas sobre desafios e oportunidades.' },
      { icon: 'bi-file-earmark-text', number: '03', title: 'Conhecimento', text: 'Pôsteres, pesquisas e debates mostraram a diversidade de soluções que já estão sendo desenvolvidas.' },
      { icon: 'bi-diagram-3', number: '04', title: 'Parcerias', text: 'A formalização da parceria entre Unicamp, CNPEM e Equinor marcou um novo capítulo de cooperação.' },
    ],
    bridgeTag: 'DO FÓRUM À INAUGURAÇÃO', bridgeTitle: 'Dois dias que marcaram a história do CP2b',
    bridgeText: 'No dia seguinte ao Fórum, 29 de maio, a programação continuou com a inauguração dos espaços do CP2b. Foi o encerramento perfeito para uma semana dedicada a transformar colaboração em capacidade real de pesquisa, inovação e impacto.',
    forumLabel: '28 MAI · FÓRUM', openingLabel: '29 MAI · INAUGURAÇÃO',
    programTag: 'A JORNADA', programTitle: 'Os assuntos que moveram o dia',
    program: [
      { time: 'Manhã', title: 'Abertura e alianças institucionais', text: 'Boas-vindas, visão de futuro e formalização de parcerias estratégicas para o CP2b.' },
      { time: 'Meio-dia', title: 'Ciência, pôsteres e convivência', text: 'Apresentação dos eixos do Centro, pesquisas em destaque e brunch no gramado.' },
      { time: 'Tarde', title: 'Financiamento e integração', text: 'Diálogos sobre recursos para P&D e sobre a aproximação entre academia e indústria.' },
      { time: 'Encerramento', title: 'Mercado e políticas públicas', text: 'Debates sobre regulação, políticas e o ecossistema necessário ao avanço do biogás e do biometano.' },
    ],
    galleryTag: 'ÁLBUM DO EVENTO', galleryTitle: '30 lembranças de dois dias especiais', galleryLead: 'Uma seleção leve e cuidadosa entre mais de 150 registros. Clique em qualquer imagem para ampliar.',
    showAll: 'Ver as 30 fotos', showLess: 'Mostrar seleção', previous: 'Foto anterior', next: 'Próxima foto', close: 'Fechar', photoOf: (current) => `Foto ${current} de 30`, alt: ptAlt,
    thanksTag: 'NOSSO MUITO OBRIGADO', thanksTitle: 'Este encontro só aconteceu porque muita gente construiu junto',
    thanksText: 'Agradecemos a cada participante, painelista, pesquisador, estudante, parceiro, patrocinador e integrante da equipe que deu vida à primeira edição.', sponsors: 'Patrocínio e apoio',
    closing: 'A primeira edição terminou. A rede que ela aproximou continua crescendo.', closingStrong: 'Até a próxima edição!',
  },
  en: {
    badge: '1ST EDITION · MAY 28, 2026', title: 'This was our Forum. And it was remarkable.',
    lead: 'A gathering shaped by science, dialogue and connections to advance biogas and bioproducts in São Paulo State.',
    location: 'Unicamp Convention Center · Campinas, SP', photosButton: 'Relive the best moments', nextEdition: 'See you next year!',
    stats: [
      { value: '140', label: 'people attended', note: 'according to the final attendance list' },
      { value: '60+', label: 'institutions connected', note: 'across academia, industry and government' },
      { value: '3', label: 'discussion panels', note: 'on pathways for the sector' },
    ],
    storyTag: 'A LIVING MEMORY', storyTitle: 'When different voices meet, new possibilities emerge',
    storyP1: 'The 1st São Paulo Forum on Biogas and Bioproducts brought together researchers, students, professionals, companies and public-sector representatives to discuss the sector’s future — from research and funding to regulation, markets and innovation.',
    storyP2: 'More than a programme of talks, it was a day of encounters: ideas shared in the auditorium, conversations on the lawn, new contacts and a stronger network committed to a circular, low-carbon economy.',
    verifiedNote: 'Attendance total according to the event’s final attendance list.',
    momentsTag: 'WHAT WE EXPERIENCED', momentsTitle: 'The event in four moments',
    moments: [
      { icon: 'bi-people', number: '01', title: 'Meeting', text: 'The biogas and bioproducts community came to Unicamp to share experience and build new connections.' },
      { icon: 'bi-chat-square-text', number: '02', title: 'Dialogue', text: 'Panels brought academia, industry and government together for candid conversations about challenges and opportunities.' },
      { icon: 'bi-file-earmark-text', number: '03', title: 'Knowledge', text: 'Posters, research and debates revealed the breadth of solutions already under development.' },
      { icon: 'bi-diagram-3', number: '04', title: 'Partnerships', text: 'The formal partnership between Unicamp, CNPEM and Equinor marked a new chapter in cooperation.' },
    ],
    bridgeTag: 'FROM THE FORUM TO THE OPENING', bridgeTitle: 'Two days that became part of CP2b’s history',
    bridgeText: 'On May 29, the day after the Forum, the programme continued with the opening of CP2b’s facilities — a fitting close to a week devoted to turning collaboration into research, innovation and impact.',
    forumLabel: 'MAY 28 · FORUM', openingLabel: 'MAY 29 · OPENING', programTag: 'THE JOURNEY', programTitle: 'The topics that moved the day',
    program: [
      { time: 'Morning', title: 'Opening and institutional alliances', text: 'A welcome, a shared vision of the future and strategic partnerships for CP2b.' },
      { time: 'Midday', title: 'Science, posters and connection', text: 'An introduction to the Center’s research axes, featured work and brunch on the lawn.' },
      { time: 'Afternoon', title: 'Funding and integration', text: 'Conversations about R&D resources and stronger links between academia and industry.' },
      { time: 'Closing', title: 'Markets and public policy', text: 'Debates on regulation, policy and the ecosystem needed to advance biogas and biomethane.' },
    ],
    galleryTag: 'EVENT ALBUM', galleryTitle: '30 memories from two special days', galleryLead: 'A lightweight, carefully curated selection from more than 150 photographs. Select any image to enlarge it.',
    showAll: 'View all 30 photos', showLess: 'Show highlights', previous: 'Previous photo', next: 'Next photo', close: 'Close', photoOf: (current) => `Photo ${current} of 30`,
    alt: Array.from({ length: 30 }, (_, index) => `Photographic record ${index + 1} of the 2026 São Paulo Forum on Biogas and Bioproducts`),
    thanksTag: 'THANK YOU', thanksTitle: 'This gathering happened because many people built it together',
    thanksText: 'Our thanks to every attendee, panelist, researcher, student, partner, sponsor and team member who brought the first edition to life.', sponsors: 'Sponsors and supporters',
    closing: 'The first edition has ended. The network it brought together keeps growing.', closingStrong: 'See you at the next edition!',
  },
};

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.18 }, transition: { duration: 0.5 } };

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
        <img className="forum-hero__image" src={gallery[3].src} alt="" /><div className="forum-hero__veil" />
        <div className="forum-shell forum-hero__content"><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <span className="forum-kicker forum-kicker--light">{t.badge}</span><h1 id="forum-title">{t.title}</h1><p className="forum-hero__lead">{t.lead}</p>
          <div className="forum-hero__meta"><i className="bi bi-geo-alt" aria-hidden="true" /> {t.location}</div>
          <div className="forum-hero__actions"><a className="forum-button forum-button--primary" href="#fotos"><i className="bi bi-images" aria-hidden="true" />{t.photosButton}</a><span className="forum-hero__promise">{t.nextEdition}</span></div>
        </motion.div></div>
        <a className="forum-scroll-cue" href="#memoria" aria-label={t.storyTag}><span /></a>
      </section>

      <section className="forum-stats" aria-label="Números do evento"><div className="forum-shell forum-stats__grid">{t.stats.map((stat) => (
        <div className="forum-stat" key={stat.label}><strong>{stat.value}</strong><div><span>{stat.label}</span><small>{stat.note}</small></div></div>
      ))}</div></section>

      <section id="memoria" className="forum-section forum-story"><div className="forum-shell forum-story__grid">
        <motion.div {...reveal}><span className="forum-kicker">{t.storyTag}</span><h2>{t.storyTitle}</h2><p>{t.storyP1}</p><p>{t.storyP2}</p><small className="forum-data-note"><i className="bi bi-info-circle" aria-hidden="true" />{t.verifiedNote}</small></motion.div>
        <motion.figure className="forum-story__photo" {...reveal}><img src={gallery[10].src} alt={t.alt[10]} loading="lazy" decoding="async" /><figcaption>28.05.2026 · Unicamp</figcaption></motion.figure>
      </div></section>

      <section className="forum-section forum-moments"><div className="forum-shell">
        <motion.header className="forum-section-head" {...reveal}><span className="forum-kicker">{t.momentsTag}</span><h2>{t.momentsTitle}</h2></motion.header>
        <div className="forum-moments__grid">{t.moments.map((moment, index) => (
          <motion.article className="forum-moment" key={moment.number} {...reveal} transition={{ duration: 0.45, delay: index * 0.05 }}><div className="forum-moment__top"><i className={`bi ${moment.icon}`} aria-hidden="true" /><span>{moment.number}</span></div><h3>{moment.title}</h3><p>{moment.text}</p></motion.article>
        ))}</div>
      </div></section>

      <section className="forum-section forum-bridge"><div className="forum-shell forum-bridge__grid">
        <motion.div className="forum-bridge__copy" {...reveal}><span className="forum-kicker forum-kicker--light">{t.bridgeTag}</span><h2>{t.bridgeTitle}</h2><p>{t.bridgeText}</p></motion.div>
        <div className="forum-bridge__photos"><motion.figure {...reveal}><img src={gallery[8].src} alt={t.alt[8]} loading="lazy" decoding="async" /><figcaption>{t.forumLabel}</figcaption></motion.figure><motion.figure {...reveal}><img src={gallery[24].src} alt={t.alt[24]} loading="lazy" decoding="async" /><figcaption>{t.openingLabel}</figcaption></motion.figure></div>
      </div></section>

      <section className="forum-section forum-program"><div className="forum-shell forum-program__layout">
        <motion.header {...reveal}><span className="forum-kicker">{t.programTag}</span><h2>{t.programTitle}</h2></motion.header>
        <div className="forum-program__list">{t.program.map((item, index) => (
          <motion.article className="forum-program__item" key={item.time} {...reveal}><span className="forum-program__number">0{index + 1}</span><div><small>{item.time}</small><h3>{item.title}</h3><p>{item.text}</p></div></motion.article>
        ))}</div>
      </div></section>

      <section id="fotos" className="forum-section forum-gallery-section"><div className="forum-shell">
        <motion.header className="forum-section-head forum-section-head--center" {...reveal}><span className="forum-kicker">{t.galleryTag}</span><h2>{t.galleryTitle}</h2><p>{t.galleryLead}</p></motion.header>
        <div className="forum-gallery">{visibleGallery.map((photo, visibleIndex) => (
          <motion.button className={`forum-gallery__item forum-gallery__item--${visibleIndex % 7}`} type="button" key={photo.src} onClick={() => setActivePhoto(photo.index)} aria-label={`${t.photoOf(photo.index + 1)}: ${t.alt[photo.index]}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35 }}><img src={photo.src} alt={t.alt[photo.index]} loading="lazy" decoding="async" /><span><i className="bi bi-arrows-fullscreen" aria-hidden="true" />{t.photoOf(photo.index + 1)}</span></motion.button>
        ))}</div>
        <div className="forum-gallery__controls"><button className="forum-button forum-button--outline" type="button" onClick={() => setShowAll((current) => !current)} aria-expanded={showAll}><i className={`bi ${showAll ? 'bi-grid-3x3-gap' : 'bi-images'}`} aria-hidden="true" />{showAll ? t.showLess : t.showAll}</button></div>
      </div></section>

      <section className="forum-section forum-thanks"><div className="forum-shell"><motion.div className="forum-thanks__card" {...reveal}>
        <div><span className="forum-kicker">{t.thanksTag}</span><h2>{t.thanksTitle}</h2><p>{t.thanksText}</p></div><div className="forum-thanks__logos"><span>{t.sponsors}</span><img src="/assets/apoio-patrocinio.png" alt={t.sponsors} loading="lazy" /></div>
      </motion.div></div></section>
      <section className="forum-closing"><div className="forum-shell"><p>{t.closing}</p><strong>{t.closingStrong}</strong></div></section>

      {activePhoto !== null && <div className="forum-lightbox" role="dialog" aria-modal="true" aria-label={t.photoOf(activePhoto + 1)} onClick={() => setActivePhoto(null)}>
        <button className="forum-lightbox__close" type="button" aria-label={t.close} onClick={() => setActivePhoto(null)}><i className="bi bi-x-lg" /></button>
        <button className="forum-lightbox__nav forum-lightbox__nav--previous" type="button" aria-label={t.previous} onClick={(event) => { event.stopPropagation(); setActivePhoto((activePhoto + gallery.length - 1) % gallery.length); }}><i className="bi bi-chevron-left" /></button>
        <figure onClick={(event) => event.stopPropagation()}><img src={gallery[activePhoto].src} alt={t.alt[activePhoto]} /><figcaption>{t.photoOf(activePhoto + 1)} · {t.alt[activePhoto]}</figcaption></figure>
        <button className="forum-lightbox__nav forum-lightbox__nav--next" type="button" aria-label={t.next} onClick={(event) => { event.stopPropagation(); setActivePhoto((activePhoto + 1) % gallery.length); }}><i className="bi bi-chevron-right" /></button>
      </div>}
    </main>
  );
};

export default ForumPaulista;
