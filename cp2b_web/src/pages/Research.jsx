import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { researchAxes, wasteToEnergyFlow } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchAxes } from '../services/api';
import { useLocation } from 'react-router-dom';
import { pageSeo } from '../data/content';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import AxisExplorer from '../components/AxisExplorer';
import AxisConstellation from '../components/AxisConstellation';
import WasteToEnergy from '../components/WasteToEnergy';
import { stripAxisPrefix } from '../utils/teamGroups';
import { axisDetails } from '../data/generated/axisDetails';

const transformApiAxes = (apiAxes, lang) =>
  apiAxes.map((row) => {
    const coordinators = [];
    if (row.coordinator) {
      coordinators.push({ name: row.coordinator, role: 'Coord.', photo: row.coordinator_image || null });
    }
    // 'Coord.' nos dois: o ANEXO 11 (migration 039) extinguiu o cargo de
    // Coordenador Adjunto, e `sub_coordinator` guarda o segundo coordenador em
    // pé de igualdade — o nome da coluna é só herança do esquema.
    if (row.sub_coordinator) {
      coordinators.push({ name: row.sub_coordinator, role: 'Coord.', photo: row.sub_coordinator_image || null });
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

  // Links como /eixos?eixo=3#explorar-eixos (das fichas de laboratório e
  // dos chips da cadeia do biogás, nesta mesma página) abrem direto no
  // detalhamento. Adiado um quadro: o ScrollToTop do App roda depois deste
  // efeito e levaria a página de volta ao topo. A chave da navegação entra
  // nas dependências porque, de um chip para outro, o hash não muda: sem
  // ela o segundo clique trocaria o eixo sem rolar até ele.
  //
  // O foco vai junto, para a aba do eixo aberto: o <Link> impede a navegação
  // de fragmento do navegador, e sem isso o foco ficaria no chip, lá na faixa
  // escura (o próximo Tab levaria a página de volta para cima). A aba, e não
  // o título da seção, porque o leitor de tela anuncia nela o que abriu
  // ("Eixo 4: …, guia, selecionada, 4 de 8"); o título diria só "Conheça os
  // Eixos". Dali o Tab segue para o painel e as setas trocam de eixo.
  // preventScroll: a rolagem acabou de ser feita, até o topo da seção.
  const { hash, key: locationKey } = useLocation();
  useEffect(() => {
    if (hash !== '#explorar-eixos') return undefined;
    const id = requestAnimationFrame(() => {
      const el = document.getElementById('explorar-eixos');
      if (!el) return;
      if (el.scrollIntoView) el.scrollIntoView({ block: 'start' });
      const tab = el.querySelector('.axx-tab.is-active');
      if (tab) tab.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [hash, locationKey]);

  useEffect(() => {
    fetchAxes().then((data) => {
      if (data && data.length > 0) setApiAxes(data);
    });
  }, []);

  const axes = apiAxes ? transformApiAxes(apiAxes, language) : researchAxes[language];
  // Os chips da cadeia do biogás levam o nome de cada eixo sem o prefixo
  // "Eixo N – ", que o chip já mostra à parte.
  const axisNames = Object.fromEntries(axes.map((axis) => [axis.id, stripAxisPrefix(axis.title)]));
  const flow = wasteToEnergyFlow[language] || wasteToEnergyFlow.pt;

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
      photo={{ src: '/assets/fotos/eixos-pesquisadores.webp', width: 700, height: 500 }}
      className="page-hero--overlap"
    />
    <Container>
      {/* Primeira coisa da página: a figura integrativa dos oito eixos, com
          coordenação e vice. Ela sobe sobre o hero e cada card leva ao mapa
          mental logo abaixo, já com o eixo aberto. */}
      <AxisConstellation axes={axes} labels={labels.overview} targetId="explorar-eixos" />
    </Container>

    {/* Faixa escura de largura total, fora do Container: a cadeia do biogás
        em cinco etapas, e os eixos que trabalham em cada uma. Cada chip abre
        o eixo no detalhamento logo abaixo. */}
    <WasteToEnergy copy={flow} axisNames={axisNames} />

    <Container className="pb-4 pb-md-5">
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
