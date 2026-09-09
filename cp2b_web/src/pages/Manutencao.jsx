import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SeoHead from '../components/SeoHead';

const content = {
  pt: {
    title: 'Página em Manutenção',
    subtitle: 'Estamos trabalhando para melhorar esta página.',
    body: 'Em breve ela estará disponível novamente. Obrigado pela sua paciência!',
    back: 'Voltar para a Página Inicial',
  },
  en: {
    title: 'Page Under Maintenance',
    subtitle: 'We are working to improve this page.',
    body: 'It will be available again soon. Thank you for your patience!',
    back: 'Back to Home',
  },
};

const Manutencao = () => {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <>
      {/* GuardedRoute sends every disabled page here, so this thin page is what a
          crawler sees for those routes. noindex keeps it out of the index and
          stops it counting as a soft 404. */}
      <SeoHead title={t.title} description={t.subtitle} language={language} noIndex />
    <Container className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="mb-4">
        <i className="bi bi-tools" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
      </div>
      <h1 className="fw-bold mb-3">{t.title}</h1>
      <p className="text-muted fs-5 mb-2">{t.subtitle}</p>
      <p className="text-muted mb-5">{t.body}</p>
      <div>
        <Link to="/" className="btn btn-success px-4">
          <i className="bi bi-house-door me-2"></i>
          {t.back}
        </Link>
      </div>
    </Container>
    </>
  );
};

export default Manutencao;
