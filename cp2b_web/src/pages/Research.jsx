import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { researchAxes } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchAxes } from '../services/api';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import AxisExplorer from '../components/AxisExplorer';
import AxisConstellation from '../components/AxisConstellation';
import { axisDetails } from '../data/generated/axisDetails';

const transformApiAxes = (apiAxes, lang) =>
  apiAxes.map((row) => {
    const coordinators = [];
    if (row.coordinator) {
      coordinators.push({ name: row.coordinator, role: 'Coord.', photo: row.coordinator_image || null });
    }
    if (row.sub_coordinator) {
      coordinators.push({ name: row.sub_coordinator, role: 'Adj.', photo: row.sub_coordinator_image || null });
    }
    return {
      id: String(row.axis_number),
      title: lang === 'pt' ? row.title_pt : (row.title_en || row.title_pt),
      coordinators,
      content: lang === 'pt' ? row.content_pt : (row.content_en || row.content_pt),
      sdgs: row.sdgs || [],
      // O backend ainda não expõe `details` (migration 025) — quando expuser,
      // preferir row.details aqui e cair para o axisDetails estático abaixo.
      details: row.details || null,
    };
  });

const Research = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const seo = pageSeo.research[language] || pageSeo.research.pt;
  const [apiAxes, setApiAxes] = useState(null);

  // Links como /eixos?eixo=3#explorar-eixos (das fichas de laboratório)
  // abrem direto no detalhamento. Adiado um quadro: o ScrollToTop do App
  // roda depois deste efeito e levaria a página de volta ao topo.
  const { hash } = useLocation();
  useEffect(() => {
    if (hash !== '#explorar-eixos') return undefined;
    const id = requestAnimationFrame(() => {
      const el = document.getElementById('explorar-eixos');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [hash]);

  useEffect(() => {
    fetchAxes().then((data) => {
      if (data && data.length > 0) setApiAxes(data);
    });
  }, []);

  const axes = apiAxes ? transformApiAxes(apiAxes, language) : researchAxes[language];

  const labels = {
    pt: {
      details: 'Conheça os Eixos',
      axis: 'EIXO',
      sdgs: 'ODS Relacionados:',
      activities: 'Atividades Desenvolvidas',
      mindmapHint: 'Escopo, competências, projetos e infraestrutura de cada eixo.',
      detailsEyebrow: 'Detalhamento',
      sdgsTitle: 'ODS relacionados',
      axesNav: 'Eixos temáticos',
      readMore: 'Ler mais',
      readLess: 'Ler menos',
      showAll: 'Ver todos os',
      showLess: 'Mostrar menos',
      allAxes: 'Todos os eixos',
      noDetails: 'Detalhamento em preparação para este eixo.',
      overview: {
        eyebrow: 'Estrutura Temática',
        title: 'Eixos de Atuação do CP2b',
        subtitle: 'Integração científica e tecnológica para a valorização de resíduos e o desenvolvimento sustentável.',
        axis: 'EIXO',
        coordination: 'Coordenação',
        methane: 'metano',
        vacancy: 'Vaga temporariamente em aberto',
        hubCaption: 'Centro Paulista de Estudos em Biogás e Bioprodutos',
        details: 'Ver detalhes',
        hint: 'Clique em um eixo para ver escopo, competências e projetos.',
      },
    },
    en: {
      details: 'Discover the Axes',
      axis: 'AXIS',
      sdgs: 'Related SDGs:',
      activities: 'Activities',
      mindmapHint: 'Scope, competencies, projects and infrastructure for each axis.',
      detailsEyebrow: 'In detail',
      sdgsTitle: 'Related SDGs',
      axesNav: 'Thematic axes',
      readMore: 'Read more',
      readLess: 'Read less',
      showAll: 'See all',
      showLess: 'Show less',
      allAxes: 'All axes',
      noDetails: 'Detailed breakdown in preparation for this axis.',
      overview: {
        eyebrow: 'Thematic Structure',
        title: 'CP2b Thematic Axes',
        subtitle: 'Scientific and technological integration for waste valorization and sustainable development.',
        axis: 'AXIS',
        coordination: 'Coordination',
        methane: 'methane',
        vacancy: 'Position temporarily open',
        hubCaption: 'São Paulo Center for Biogas and Bioproducts Studies',
        details: 'See details',
        hint: 'Click an axis to see its scope, competencies and projects.',
      },
    }
  }[language];

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    {/* O cabeçalho da página é o da figura dos eixos: antes ele se repetia
        no topo do infográfico, empurrando os eixos para baixo. */}
    <PageHero
      eyebrow={labels.overview.eyebrow}
      title={labels.overview.title}
      subtitle={labels.overview.subtitle}
      className="page-hero--overlap"
    />
    <Container className="pb-4 pb-md-5">

      {/* Primeira coisa da página: a figura integrativa dos oito eixos, com
          coordenação e vice. Ela sobe sobre o hero e cada card leva ao mapa
          mental logo abaixo, já com o eixo aberto. */}
      <AxisConstellation axes={axes} labels={labels.overview} targetId="explorar-eixos" />

      <section id="explorar-eixos" className="research-explore" aria-labelledby="explorar-eixos-title">
        <header className="research-explore__head">
          <span className="eyebrow">{labels.detailsEyebrow}</span>
          <h2 id="explorar-eixos-title">{labels.details}</h2>
          <p>{labels.mindmapHint}</p>
        </header>
        <AxisExplorer
          axes={axes}
          detailsById={axisDetails}
          language={language}
          labels={labels}
        />
      </section>
    </Container>
    </motion.div>
    </>
  );
};

export default Research;
