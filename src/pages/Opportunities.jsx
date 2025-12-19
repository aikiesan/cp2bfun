import React from 'react';
import { Container } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { menuLabels } from '../data/content';

const Opportunities = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];

  return (
    <Container className="py-5">
      <h1 className="display-4 fw-bold mb-4">{t.opportunities}</h1>
      <p className="lead text-muted">
        {language === 'pt' 
          ? 'Confira as vagas abertas e oportunidades de pesquisa no CP2B.' 
          : 'Check out open positions and research opportunities at CP2B.'}
      </p>
      <div className="bg-light p-5 rounded-4 text-center mt-5">
         <p className="mb-0">{language === 'pt' ? 'Nenhuma oportunidade no momento.' : 'No opportunities at the moment.'}</p>
      </div>
    </Container>
  );
};

export default Opportunities;