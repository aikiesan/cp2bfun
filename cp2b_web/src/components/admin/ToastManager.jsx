import { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((variant, message, options = {}) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      variant,
      message,
      autohide: options.autohide !== false,
      delay: options.delay || 5000,
      ...options
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove if autohide is true
    if (newToast.autohide) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.delay);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, options) => {
    showToast('success', message, options);
  }, [showToast]);

  const error = useCallback((message, options) => {
    showToast('danger', message, options);
  }, [showToast]);

  const warning = useCallback((message, options) => {
    showToast('warning', message, options);
  }, [showToast]);

  const info = useCallback((message, options) => {
    showToast('primary', message, options);
  }, [showToast]);

  const value = {
    showToast,
    success,
    error,
    warning,
    info
  };

  // Icon mapping
  const iconMap = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    primary: 'bi-info-circle-fill'
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            show={true}
            autohide={toast.autohide}
            delay={toast.delay}
            bg={toast.variant}
          >
            <Toast.Header>
              <i className={`bi ${iconMap[toast.variant]} me-2`}></i>
              <strong className="me-auto">
                {toast.title || (
                  toast.variant === 'success' ? 'Sucesso' :
                  toast.variant === 'danger' ? 'Erro' :
                  toast.variant === 'warning' ? 'Aviso' : 'Informação'
                )}
              </strong>
            </Toast.Header>
            <Toast.Body className={toast.variant === 'danger' || toast.variant === 'dark' ? 'text-white' : ''}>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ToastProvider;
