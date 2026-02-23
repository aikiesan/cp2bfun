import { Component } from 'react';
import { Container } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const language = (() => {
        try { return localStorage.getItem('cp2b-language') || 'pt'; } catch { return 'pt'; }
      })();

      const labels = {
        pt: {
          title: 'Algo deu errado',
          message: 'Ocorreu um erro inesperado nesta página.',
          reload: 'Recarregar',
        },
        en: {
          title: 'Something went wrong',
          message: 'An unexpected error occurred on this page.',
          reload: 'Reload',
        },
      }[language] || {
        title: 'Algo deu errado',
        message: 'Ocorreu um erro inesperado nesta página.',
        reload: 'Recarregar',
      };

      return (
        <Container className="py-5 text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
          <h2 className="fw-bold mt-3 mb-2">{labels.title}</h2>
          <p className="text-muted mb-4">{labels.message}</p>
          <button
            className="btn btn-dark px-4"
            onClick={() => window.location.reload()}
          >
            {labels.reload}
          </button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
