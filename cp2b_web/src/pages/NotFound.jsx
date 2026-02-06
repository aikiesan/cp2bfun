import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();

  const labels = {
    pt: {
      title: '404',
      message: 'Pagina nao encontrada',
      description: 'A pagina que voce procura nao existe ou foi movida.',
      backHome: 'Voltar ao Inicio',
    },
    en: {
      title: '404',
      message: 'Page not found',
      description: 'The page you are looking for does not exist or has been moved.',
      backHome: 'Back to Home',
    },
  }[language];

  return (
    <Container className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 className="display-1 fw-bold text-muted">{labels.title}</h1>
      <h2 className="mb-3">{labels.message}</h2>
      <p className="text-muted mb-4">{labels.description}</p>
      <Link to="/" className="btn btn-primary px-4 py-2">
        {labels.backHome}
      </Link>
    </Container>
  );
};

export default NotFound;
