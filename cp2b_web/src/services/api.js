const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      const err = new Error(error.error || 'Request failed');
      err.response = { status: response.status, data: error };
      throw err;
    }

    return { data: await response.json() };
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: data });
  }

  put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: data });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient(API_URL);

export default api;

// Utility functions for common data fetching patterns
export const fetchNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
};

export const fetchNewsArticle = async (slug) => {
  try {
    const response = await api.get(`/news/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
};

export const fetchTeam = async () => {
  try {
    const response = await api.get('/team/grouped');
    return response.data;
  } catch (error) {
    console.error('Error fetching team:', error);
    return null;
  }
};

export const fetchAxes = async () => {
  try {
    const response = await api.get('/axes');
    return response.data;
  } catch (error) {
    console.error('Error fetching axes:', error);
    return null;
  }
};

export const fetchPageContent = async (page) => {
  try {
    const response = await api.get(`/content/${page}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${page} content:`, error);
    return null;
  }
};

export const submitContactForm = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const fetchMessages = async () => {
  try {
    const response = await api.get('/contact');
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return null;
  }
};
