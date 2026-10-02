import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SeoHead from '../components/SeoHead';
import MetaninhoAmigo from '../components/MetaninhoAmigo';

// O que o Metaninho diz na 404 quando alguém clica nele (easter egg).
const NOT_FOUND_LINES = {
  pt: ['Essa página virou gás!', 'Procurei até no biodigestor e não achei…', 'Volta pro início que eu te encontro lá!'],
  en: ['This page turned into gas!', 'I looked even inside the digester. Nothing…', "Head back home, I'll meet you there!"],
};

const NotFound = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      title: '404',
      message: 'Página não encontrada',
      description: 'A página que você procura não existe ou foi movida.',
      backHome: 'Voltar ao Início',
    },
    en: {
      title: '404',
      message: 'Page not found',
      description: 'The page you are looking for does not exist or has been moved.',
      backHome: 'Back to Home',
    },
  }[language];

  return (
    <>
      {/* The SPA answers unknown URLs with HTTP 200, so Google read this page as a
          "soft 404". noindex is the signal that keeps it out of the index. */}
      <SeoHead
        title={labels.message}
        description={labels.description}
        language={language}
        noIndex
      />
    <Container className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <MetaninhoAmigo pose="surpreso" size={180} lines={NOT_FOUND_LINES} bubble="right" className="mb-2" />
      <h1 className="display-1 fw-bold text-muted">{labels.title}</h1>
      <h2 className="mb-3">{labels.message}</h2>
      <p className="text-muted mb-4">{labels.description}</p>
      <Link to="/" className="btn btn-primary px-4 py-2">
        {labels.backHome}
      </Link>
    </Container>
    </>
  );
};

export default NotFound;
