import { useState, useEffect } from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { projectsItems } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import { fetchProjectArticle, fetchProjects } from '../services/api';
import ArticleLayout from '../components/ArticleLayout';

const ProjectsDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const labels = {
    pt: {
      notFound: 'Projeto não encontrado',
      backBtn: 'Voltar para Projetos',
      back: 'Voltar',
      share: 'Compartilhar',
    },
    en: {
      notFound: 'Project not found',
      backBtn: 'Back to Projects',
      back: 'Back',
      share: 'Share',
    },
  }[language];

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);

      // Try to fetch from API first
      const apiData = await fetchProjectArticle(slug);

      if (apiData) {
        setArticle({
          title: language === 'pt' ? apiData.title_pt : (apiData.title_en || apiData.title_pt),
          description: language === 'pt' ? apiData.description_pt : (apiData.description_en || apiData.description_pt),
          content: language === 'pt' ? apiData.content_pt : (apiData.content_en || apiData.content_pt),
          image: apiData.image,
          badge: apiData.badge,
          badgeColor: apiData.badge_color,
          date: apiData.date_display,
        });

        // Fetch related projects (exclude current slug)
        // Note: fetchProjects() returns [] on failure (not null)
        const allProjects = await fetchProjects();
        if (Array.isArray(allProjects) && allProjects.length > 0) {
          setRelatedPosts(
            allProjects
              .filter((item) => item.slug !== slug)
              .slice(0, 3)
              .map((item) => ({
                id: item.id,
                title: language === 'pt' ? item.title_pt : (item.title_en || item.title_pt),
                description: language === 'pt' ? item.description_pt : (item.description_en || item.description_pt),
                image: item.image,
                badge: item.badge,
                badgeColor: item.badge_color,
                date: item.date_display,
                link: `/projetos/${item.slug}`,
              }))
          );
        }
      } else {
        // Fallback to static content
        const projects = projectsItems[language];
        const staticArticle = projects.find((item) => item.link.endsWith(slug));
        if (staticArticle) {
          setArticle({
            ...staticArticle,
            content: null, // Static doesn't have full content
          });
        }
      }

      setLoading(false);
    };

    loadArticle();
  }, [slug, language]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-5 text-center">
        <h2>{labels.notFound}</h2>
        <Button as={Link} to="/projetos" variant="primary" className="mt-3">
          {labels.backBtn}
        </Button>
      </Container>
    );
  }

  return (
    <ArticleLayout
      article={article}
      relatedPosts={relatedPosts}
      backLink="/projetos"
      backLabel={labels.back}
      shareLabel={labels.share}
      language={language}
    />
  );
};

export default ProjectsDetail;
