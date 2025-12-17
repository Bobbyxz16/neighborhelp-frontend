import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // In apiService.js
async request(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  // Ensure the token is properly formatted
  const authHeader = token ? { 
    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
  } : {};

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
    ...options,
  };

  // Rest of the method remains the same
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

  // Resources API
  async getResources(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        if (Array.isArray(params[key])) {
          params[key].forEach(item => queryParams.append(key, item));
        } else {
          queryParams.append(key, params[key]);
        }
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.RESOURCES.BASE}?${queryString}`
      : API_ENDPOINTS.RESOURCES.BASE;

    return this.request(endpoint);
  }

  async getResourceBySlug(slug) {
    return this.request(API_ENDPOINTS.RESOURCES.BY_SLUG(slug));
  }

  // Cities/Locations API
  async getCities() {
    return this.request(API_ENDPOINTS.LOCATIONS.CITIES);
  }

  async searchCities(query) {
    return this.request(`${API_ENDPOINTS.LOCATIONS.SEARCH_CITIES}?query=${encodeURIComponent(query)}`);
  }

  // Save/Unsave resources
  async saveResource(resourceId) {
    // Note: You might need to create this endpoint in your API
    return this.request(`/users/me/saved-resources/${resourceId}`, {
      method: 'POST',
    });
  }

  async unsaveResource(resourceId) {
    // Note: You might need to create this endpoint in your API
    return this.request(`/users/me/saved-resources/${resourceId}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories() {
    return this.request(API_ENDPOINTS.CATEGORIES.BASE);
  }
}

export default new ApiService();