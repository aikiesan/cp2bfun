import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const PageStatusContext = createContext();

export const PageStatusProvider = ({ children }) => {
  // Map of page_key → is_enabled (boolean)
  // Default: empty map — isPageEnabled returns true when key is unknown (fail-open)
  const [statusMap, setStatusMap] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadPageStatuses = async () => {
      try {
        const { data } = await api.get('/page-settings');
        const map = {};
        data.forEach(page => {
          map[page.page_key] = page.is_enabled;
        });
        setStatusMap(map);
      } catch {
        // Fail-open: if API is unreachable, all pages are enabled
      } finally {
        setLoaded(true);
      }
    };

    loadPageStatuses();
  }, []);

  const isPageEnabled = (pageKey) => {
    // If not yet loaded or key not found, default to enabled
    if (!loaded || !(pageKey in statusMap)) return true;
    return statusMap[pageKey];
  };

  const refreshStatuses = async () => {
    try {
      const { data } = await api.get('/page-settings');
      const map = {};
      data.forEach(page => {
        map[page.page_key] = page.is_enabled;
      });
      setStatusMap(map);
    } catch {
      // silently fail
    }
  };

  return (
    <PageStatusContext.Provider value={{ isPageEnabled, refreshStatuses, loaded }}>
      {children}
    </PageStatusContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePageStatus = () => {
  const context = useContext(PageStatusContext);
  if (!context) {
    throw new Error('usePageStatus must be used within a PageStatusProvider');
  }
  return context;
};
