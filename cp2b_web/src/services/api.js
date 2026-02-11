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
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching news:', error);
    }
    return null;
  }
};

export const fetchNewsArticle = async (slug) => {
  try {
    const response = await api.get(`/news/${slug}`);
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching news article:', error);
    }
    return null;
  }
};

export const fetchFeaturedNews = async () => {
  try {
    const response = await api.get('/news/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return { A: null, B: null, C: null };
  }
};

export const updateFeaturedNews = async (positionA, positionB, positionC) => {
  try {
    const response = await api.put('/news/featured', {
      positionA,
      positionB,
      positionC
    });
    return response.data;
  } catch (error) {
    console.error('Error updating featured news:', error);
    throw error;
  }
};

export const fetchTeam = async () => {
  try {
    const response = await api.get('/team/grouped');
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching team:', error);
    }
    return null;
  }
};

export const fetchAxes = async () => {
  try {
    const response = await api.get('/axes');
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching axes:', error);
    }
    return null;
  }
};

export const fetchPageContent = async (page) => {
  try {
    const response = await api.get(`/content/${page}`);
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running - using fallback content
    // Only log unexpected server errors (500+), not network failures or 404s
    if (error.response?.status && error.response.status >= 500) {
      console.error(`Error fetching ${page} content:`, error);
    }
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

// Partners API functions
export const fetchPartners = async () => {
  try {
    const response = await api.get('/partners');
    return response.data;
  } catch (error) {
    console.error('Error fetching partners:', error);
    return null;
  }
};

export const fetchPartnersGrouped = async () => {
  try {
    const response = await api.get('/partners/grouped');
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching grouped partners:', error);
    }
    return { host: [], public: [], research: [], companies: [] };
  }
};

export const fetchPartner = async (id) => {
  try {
    const response = await api.get(`/partners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching partner:', error);
    return null;
  }
};

export const createPartner = async (data) => {
  const response = await api.post('/partners', data);
  return response.data;
};

export const updatePartner = async (id, data) => {
  const response = await api.put(`/partners/${id}`, data);
  return response.data;
};

export const deletePartner = async (id) => {
  const response = await api.delete(`/partners/${id}`);
  return response.data;
};

// Publications API functions
export const fetchPublications = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.year) queryParams.append('year', filters.year);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.axis) queryParams.append('axis', filters.axis);
    if (filters.search) queryParams.append('search', filters.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/publications?${queryString}` : '/publications';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching publications:', error);
    return null;
  }
};

export const fetchPublication = async (id) => {
  try {
    const response = await api.get(`/publications/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching publication:', error);
    return null;
  }
};

export const fetchFeaturedPublications = async () => {
  try {
    const response = await api.get('/publications/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured publications:', error);
    return [];
  }
};

export const fetchPublicationsByYear = async () => {
  try {
    const response = await api.get('/publications/by-year');
    return response.data;
  } catch (error) {
    console.error('Error fetching publications by year:', error);
    return {};
  }
};

export const createPublication = async (data) => {
  const response = await api.post('/publications', data);
  return response.data;
};

export const updatePublication = async (id, data) => {
  const response = await api.put(`/publications/${id}`, data);
  return response.data;
};

export const deletePublication = async (id) => {
  const response = await api.delete(`/publications/${id}`);
  return response.data;
};

// Events API functions
export const fetchEvents = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return null;
  }
};

export const fetchEvent = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const fetchUpcomingEvents = async () => {
  try {
    const response = await api.get('/events/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

export const fetchFeaturedEvents = async () => {
  try {
    const response = await api.get('/events/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
};

export const createEvent = async (data) => {
  const response = await api.post('/events', data);
  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await api.put(`/events/${id}`, data);
  return response.data;
};

export const updateEventParticipants = async (id, current_participants) => {
  const response = await api.put(`/events/${id}/participants`, { current_participants });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

// Projects API functions (duplicate of news API)
export const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching projects:', error);
    }
    return [];
  }
};

export const fetchProjectArticle = async (slug) => {
  try {
    const response = await api.get(`/projects/${slug}`);
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching project:', error);
    }
    return null;
  }
};

export const fetchFeaturedProjects = async () => {
  try {
    const response = await api.get('/projects/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return { A: null, B: null, C: null };
  }
};

export const createProject = async (data) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const updateProject = async (slug, data) => {
  const response = await api.put(`/projects/${slug}`, data);
  return response.data;
};

export const deleteProject = async (slug) => {
  const response = await api.delete(`/projects/${slug}`);
  return response.data;
};

// Unified Featured Content API (news + projects)
export const fetchFeaturedContent = async () => {
  try {
    const response = await api.get('/featured');
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running - using fallback content
    // Only log unexpected server errors (not network/404 errors)
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching featured content:', error);
    }
    return { A: null, B: null, C: null };
  }
};

export const updateFeaturedContent = async (positionA, positionB, positionC) => {
  try {
    const response = await api.put('/featured', {
      positionA, // { type: 'news', slug: '...' } or { type: 'project', slug: '...' }
      positionB,
      positionC
    });
    return response.data;
  } catch (error) {
    console.error('Error updating featured content:', error);
    throw error;
  }
};

// ============================================
// Featured Videos API
// ============================================

/**
 * Fetch featured videos (positions A, B, C)
 * Returns object with A, B, C keys
 */
export const fetchFeaturedVideos = async () => {
  try {
    const response = await api.get('/videos/featured');
    return response.data;
  } catch (error) {
    // Suppress expected errors when API is not running
    if (error.response?.status && error.response.status >= 500) {
      console.error('Error fetching featured videos:', error);
    }
    return { A: null, B: null, C: null };
  }
};

/**
 * Fetch all videos (admin)
 */
export const fetchVideos = async () => {
  try {
    const response = await api.get('/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

/**
 * Fetch single video by ID
 */
export const fetchVideo = async (id) => {
  try {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

/**
 * Create new video
 */
export const createVideo = async (videoData) => {
  try {
    const response = await api.post('/videos', videoData);
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

/**
 * Update existing video
 */
export const updateVideo = async (id, videoData) => {
  try {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

/**
 * Delete video
 */
export const deleteVideo = async (id) => {
  try {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};
