import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pageSeo, metaninhoHq } from '../data/content';
import SeoHead from '../components/SeoHead';
import PageHero from '../components/PageHero';
import FlipBook from '../components/FlipBook';
import Metaninho from '../components/Metaninho';
import './MetaninhoHQ.css';

const LABELS = {
  pt: {
    tag: 'HISTÓRIA EM QUADRINHOS',
    title: 'Metaninho no Intercocen',
    subtitle: 'O Metaninho é uma molécula de metano. Nesta HQ ele conta de onde vem, por que preocupa o planeta e como pode virar energia.',
    readTitle: 'Leia online',
    reader: {
      prev: 'Página anterior',
      next: 'Próxima página',
      first: 'Ir para a capa',
      last: 'Ir para a contracapa',
      fullscreen: 'Ler em tela cheia',
      exitFullscreen: 'Sair da tela cheia',
      slider: 'Escolher página',
      hint: 'Clique na página, deslize o dedo ou use as setas do teclado para virar.',
    },
    printTitle: 'Imprima o seu mini-gibi',
    printIntro: 'A versão para imprimir já vem montada: são 4 folhas A4 que, dobradas, viram um gibi de 16 páginas.',
    printSteps: [
      'Baixe o PDF e imprima em papel A4, frente e verso, virando pela borda curta.',
      'Junte as 4 folhas na ordem do PDF, com a folha da capa por fora.',
      'Dobre a pilha ao meio e grampeie (ou costure) na dobra.',
    ],
    download: 'Baixar PDF para imprimir',
    downloadMeta: 'PDF · 4 folhas A4 · 5 MB',
    transcriptTitle: 'Texto da HQ',
    transcriptIntro: 'Os balões, página por página.',
  },
  en: {
    tag: 'COMIC',
    title: 'Metaninho no Intercocen',
    subtitle: 'Metaninho is a methane molecule. In this comic he explains where he comes from, why he worries the planet and how he can become energy.',
    readTitle: 'Read online',
    reader: {
      prev: 'Previous page',
      next: 'Next page',
      first: 'Go to the cover',
      last: 'Go to the back cover',
      fullscreen: 'Read full screen',
      exitFullscreen: 'Exit full screen',
      slider: 'Choose a page',
      hint: 'Click the page, swipe, or use the arrow keys to turn it.',
    },
    printTitle: 'Print your own mini comic',
    printIntro: 'The print version comes ready to assemble: 4 A4 sheets that fold into a 16-page comic book.',
    printSteps: [
      'Download the PDF and print it on A4 paper, double-sided, flipping on the short edge.',
      'Stack the 4 sheets in the same order as the PDF, with the cover sheet on the outside.',
      'Fold the stack in half and staple (or stitch) along the fold.',
    ],
    download: 'Download PDF to print',
    downloadMeta: 'PDF · 4 A4 sheets · 5 MB',
    transcriptTitle: 'Comic text',
    // A HQ só existe em português: em inglês, a transcrição é tradução.
    transcriptIntro: 'The comic is in Portuguese. Here is an English translation of the speech bubbles, page by page.',
  },
};

const MetaninhoHQ = () => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const lang = LABELS[language] ? language : 'pt';
  const t = LABELS[lang];
  const seo = pageSeo.metaninho[lang];

  const pages = metaninhoHq.pages.map((p) => ({ src: p.src, alt: p.alt[lang], label: p.label[lang] }));
  // Capa, verso e contracapa não têm texto a transcrever; ficam as páginas
  // da história e o expediente.
  const transcript = metaninhoHq.pages.filter((p) => p.src && /\d|Expediente/.test(p.label.pt));

  return (
    <>
      <SeoHead title={seo.title} description={seo.description} path={pathname} language={language} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHero eyebrow={t.tag} title={t.title} subtitle={t.subtitle} />

        <Container className="py-4 py-md-5">
          <section aria-labelledby="hq-ler">
            <h2 id="hq-ler" className="visually-hidden">{t.readTitle}</h2>
            <FlipBook
              pages={pages}
              pageSize={metaninhoHq.pageSize}
              labels={t.reader}
              pageLabel={(p) => p.label}
            />
          </section>

          <Row className="g-4 mt-4 mt-md-5 align-items-start">
            <Col lg={7}>
              <section className="hq-print" aria-labelledby="hq-imprimir">
                <div className="hq-print__mascot" aria-hidden="true">
                  <Metaninho pose="feliz" size={120} />
                </div>
                <h2 id="hq-imprimir" className="h4 fw-bold mb-2">{t.printTitle}</h2>
                <p className="text-muted mb-3">{t.printIntro}</p>
                <ol className="hq-print__steps">
                  {t.printSteps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <a href={metaninhoHq.downloadPdf} className="btn btn-success" download>
                  <i className="bi bi-download me-2" aria-hidden="true"></i>
                  {t.download}
                </a>
                <span className="hq-print__meta">{t.downloadMeta}</span>
              </section>
            </Col>
            <Col lg={5}>
              <details className="hq-transcript">
                <summary>
                  <span className="h5 fw-bold mb-0">{t.transcriptTitle}</span>
                  <i className="bi bi-chevron-down" aria-hidden="true"></i>
                </summary>
                <p className="text-muted small mt-2">{t.transcriptIntro}</p>
                <dl className="mb-0">
                  {transcript.map((p) => (
                    <div key={p.src} className="hq-transcript__item">
                      <dt>{p.label[lang]}</dt>
                      <dd>{p.alt[lang]}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
};

export default MetaninhoHQ;
