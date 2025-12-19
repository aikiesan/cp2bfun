import React from 'react';
import { Container } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { menuLabels } from '../data/content';

const Publications = () => {
  const { language } = useLanguage();
  const t = menuLabels[language];

  return (
    <Container className="py-5">
      <h1 className="display-4 fw-bold mb-4">{t.publications}</h1>
      <p className="lead text-muted">
        {language === 'pt' 
          ? 'Artigos, livros e capítulos produzidos pelos nossos pesquisadores.' 
          : 'Articles, books, and chapters produced by our researchers.'}
      </p>
      <div className="bg-light p-5 rounded-4 text-center mt-5">
         <p className="mb-0">{language === 'pt' ? 'Em breve.' : 'Coming soon.'}</p>
      </div>
    </Container>
  );
};

export default Publications;