import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { newsItems, researchAxes, teamMembers } from '../data/content';

const SearchModal = ({ show, onHide }) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const labels = {
    pt: {
      placeholder: 'Buscar no CP2B...',
      noResults: 'Nenhum resultado encontrado',
      hint: 'Pressione ESC para fechar',
      news: 'Notícias',
      research: 'Pesquisa',
      team: 'Equipe',
      pages: 'Páginas'
    },
    en: {
      placeholder: 'Search CP2B...',
      noResults: 'No results found',
      hint: 'Press ESC to close',
      news: 'News',
      research: 'Research',
      team: 'Team',
      pages: 'Pages'
    }
  }[language];

  // Static pages for search
  const staticPages = [
    { title: language === 'pt' ? 'Sobre o CP2B' : 'About CP2B', path: '/sobre', category: 'pages' },
    { title: language === 'pt' ? 'Equipe' : 'Team', path: '/equipe', category: 'pages' },
    { title: language === 'pt' ? 'Pesquisa' : 'Research', path: '/pesquisa', category: 'pages' },
    { title: language === 'pt' ? 'Notícias' : 'News', path: '/noticias', category: 'pages' },
    { title: language === 'pt' ? 'Publicações' : 'Publications', path: '/publicacoes', category: 'pages' },
    { title: language === 'pt' ? 'Contato' : 'Contact', path: '/contato', category: 'pages' },
    { title: language === 'pt' ? 'Oportunidades' : 'Opportunities', path: '/oportunidades', category: 'pages' },
    { title: language === 'pt' ? 'Projetos' : 'Projects', path: '/projetos', category: 'pages' },
    { title: 'FAQ', path: '/faq', category: 'pages' }
  ];

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const searchResults = [];

    // Search news
    const news = newsItems[language] || [];
    news.forEach(item => {
      if (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      ) {
        searchResults.push({
          title: item.title,
          description: item.description.substring(0, 100) + '...',
          path: item.link,
          category: 'news'
        });
      }
    });

    // Search research axes
    const axes = researchAxes[language] || [];
    axes.forEach(axis => {
      if (
        axis.title.toLowerCase().includes(searchTerm) ||
        axis.content.toLowerCase().includes(searchTerm) ||
        axis.coordinator.toLowerCase().includes(searchTerm)
      ) {
        searchResults.push({
          title: axis.title,
          description: axis.coordinator,
          path: '/pesquisa',
          category: 'research'
        });
      }
    });

    // Search team members
    teamMembers.forEach(group => {
      group.members.forEach(member => {
        if (
          member.name.toLowerCase().includes(searchTerm) ||
          member.role.toLowerCase().includes(searchTerm) ||
          (member.institution && member.institution.toLowerCase().includes(searchTerm))
        ) {
          searchResults.push({
            title: member.name,
            description: member.role + (member.institution ? ` - ${member.institution}` : ''),
            path: '/equipe',
            category: 'team'
          });
        }
      });
    });

    // Search static pages
    staticPages.forEach(page => {
      if (page.title.toLowerCase().includes(searchTerm)) {
        searchResults.push({
          title: page.title,
          description: '',
          path: page.path,
          category: 'pages'
        });
      }
    });

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [query, language]);

  // Focus input when modal opens
  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [show]);

  // Clear on close
  useEffect(() => {
    if (!show) {
      setQuery('');
      setResults([]);
    }
  }, [show]);

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'news': return labels.news;
      case 'research': return labels.research;
      case 'team': return labels.team;
      case 'pages': return labels.pages;
      default: return '';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'news': return 'var(--cp2b-orange)';
      case 'research': return 'var(--cp2b-green)';
      case 'team': return 'var(--cp2b-petrol)';
      case 'pages': return 'var(--cp2b-forest)';
      default: return 'var(--cp2b-text-light)';
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="search-modal"
      backdrop="static"
    >
      <Modal.Body className="p-0">
        {/* Search Input */}
        <div
          className="d-flex align-items-center gap-3 p-4 border-bottom"
          style={{ background: 'var(--cp2b-bg)' }}
        >
          <FaSearch className="text-muted" size={20} />
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder={labels.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent fs-5 flex-grow-1 shadow-none"
            style={{ outline: 'none' }}
            autoFocus
          />
          <button
            onClick={onHide}
            className="btn btn-link p-0 text-muted"
            aria-label="Close search"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {query.trim() && results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-5"
              >
                <p className="text-muted mb-0">{labels.noResults}</p>
              </motion.div>
            ) : (
              <ListGroup variant="flush">
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.path}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ListGroup.Item
                      as={Link}
                      to={result.path}
                      onClick={onHide}
                      className="d-flex align-items-start gap-3 py-3 px-4 border-0 text-decoration-none"
                      style={{ transition: 'background 0.2s' }}
                      action
                    >
                      <span
                        className="badge rounded-pill mt-1"
                        style={{
                          background: `${getCategoryColor(result.category)}20`,
                          color: getCategoryColor(result.category),
                          fontSize: '0.65rem',
                          fontWeight: 600
                        }}
                      >
                        {getCategoryLabel(result.category)}
                      </span>
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="mb-1 fw-semibold text-dark text-truncate">
                          {result.title}
                        </h6>
                        {result.description && (
                          <p className="mb-0 small text-muted text-truncate">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <FaArrowRight className="text-muted mt-1" size={12} />
                    </ListGroup.Item>
                  </motion.div>
                ))}
              </ListGroup>
            )}
          </AnimatePresence>
        </div>

        {/* Footer hint */}
        <div
          className="text-center py-2 border-top"
          style={{ background: 'var(--cp2b-bg)' }}
        >
          <small className="text-muted">{labels.hint}</small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
