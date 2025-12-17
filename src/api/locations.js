import { api } from './auth';

// ==================== LOCATION API ====================

export const locationsApi = {
  /**
   * GET /api/locations/cities
   * Get all unique cities from resources
   * Public endpoint with caching
   * Returns cities sorted alphabetically
   */
  async getAllCities() {
    return await api.request('/locations/cities');
  },

  /**
   * GET /api/locations/postal-codes
   * Get all unique postal codes from resources
   * Public endpoint with caching
   * Returns postal codes sorted numerically
   */
  async getAllPostalCodes() {
    return await api.request('/locations/postal-codes');
  },

  /**
   * GET /api/locations/search/cities
   * Search cities by name (partial match, case-insensitive)
   * Query param: name - search term
   * Public endpoint
   */
  async searchCities(name) {
    return await api.request(`/locations/search/cities?name=${encodeURIComponent(name)}`);
  },

  /**
   * GET /api/locations/cities/{city}/postal-codes
   * Get all postal codes for a specific city
   * Public endpoint
   */
  async getPostalCodesForCity(city) {
    return await api.request(`/locations/cities/${encodeURIComponent(city)}/postal-codes`);
  },

  /**
   * GET /api/locations/search/postal-codes
   * Search postal codes (partial match)
   * Query param: code - search term
   * Public endpoint
   */
  async searchPostalCodes(code) {
    return await api.request(`/locations/search/postal-codes?code=${encodeURIComponent(code)}`);
  },

  /**
   * GET /api/locations/statistics
   * Get location statistics
   * Public endpoint
   * Returns total unique cities and postal codes
   */
  async getLocationStatistics() {
    return await api.request('/locations/statistics');
  },
};

// ==================== LOCATION UTILITIES ====================

/**
 * Helper function to format city name for display
 */
export const formatCityName = (city) => {
  if (!city) return '';
  
  // Convertir a formato título (primera letra mayúscula, resto minúsculas)
  return city
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Helper function to format postal code for display
 */
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  
  // Limpiar y formatear código postal
  const cleanCode = postalCode.toString().replace(/\s+/g, '').trim();
  
  // Para códigos postales españoles (5 dígitos)
  if (cleanCode.length === 5 && /^\d+$/.test(cleanCode)) {
    return cleanCode;
  }
  
  return cleanCode;
};

/**
 * Helper function to validate city name
 */
export const validateCity = (city) => {
  if (!city?.trim()) {
    return 'City name is required';
  }
  
  if (city.trim().length < 2) {
    return 'City name must be at least 2 characters long';
  }
  
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/.test(city)) {
    return 'City name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  return null;
};

/**
 * Helper function to validate postal code
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode?.trim()) {
    return 'Postal code is required';
  }
  
  const cleanCode = postalCode.toString().replace(/\s+/g, '').trim();
  
  if (cleanCode.length < 4) {
    return 'Postal code must be at least 4 characters long';
  }
  
  if (!/^[a-zA-Z0-9\-\s]+$/.test(postalCode)) {
    return 'Postal code can only contain letters, numbers, hyphens, and spaces';
  }
  
  return null;
};

/**
 * Helper function to group cities by first letter for alphabetical sections
 */
export const groupCitiesAlphabetically = (cities) => {
  const grouped = {};
  
  cities.forEach(city => {
    const firstLetter = city.name.charAt(0).toUpperCase();
    
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    
    grouped[firstLetter].push({
      ...city,
      formattedName: formatCityName(city.name)
    });
  });
  
  // Ordenar las letras alfabéticamente
  return Object.keys(grouped)
    .sort()
    .map(letter => ({
      letter,
      cities: grouped[letter].sort((a, b) => a.formattedName.localeCompare(b.formattedName))
    }));
};

/**
 * Helper function to create city options for select dropdowns
 */
export const createCityOptions = (cities) => {
  return cities
    .map(city => ({
      value: city.name,
      label: formatCityName(city.name),
      resourceCount: city.resourceCount || 0
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Helper function to create postal code options for select dropdowns
 */
export const createPostalCodeOptions = (postalCodes) => {
  return postalCodes
    .map(postalCode => ({
      value: postalCode.code,
      label: formatPostalCode(postalCode.code),
      city: postalCode.city,
      resourceCount: postalCode.resourceCount || 0
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Helper function to filter cities by search term
 */
export const filterCities = (cities, searchTerm) => {
  if (!searchTerm) return cities;
  
  const term = searchTerm.toLowerCase();
  return cities.filter(city => 
    city.name.toLowerCase().includes(term) ||
    formatCityName(city.name).toLowerCase().includes(term)
  );
};

/**
 * Helper function to filter postal codes by search term
 */
export const filterPostalCodes = (postalCodes, searchTerm) => {
  if (!searchTerm) return postalCodes;
  
  const term = searchTerm.toLowerCase();
  return postalCodes.filter(postalCode => 
    postalCode.code.toLowerCase().includes(term) ||
    (postalCode.city && postalCode.city.toLowerCase().includes(term))
  );
};

/**
 * Helper function to get popular cities (most resources)
 */
export const getPopularCities = (cities, limit = 10) => {
  return cities
    .filter(city => city.resourceCount > 0)
    .sort((a, b) => b.resourceCount - a.resourceCount)
    .slice(0, limit);
};

/**
 * Helper function to get nearby cities based on postal code proximity
 * (Esta es una simulación - en una app real usarías una API de geolocalización)
 */
export const getNearbyCities = (currentPostalCode, allCities, allPostalCodes) => {
  // En una implementación real, esto usaría coordenadas GPS
  // Por ahora, simulamos devolver ciudades de la misma provincia/región
  
  const currentPostal = allPostalCodes.find(pc => pc.code === currentPostalCode);
  if (!currentPostal) return [];
  
  // Simular ciudades cercanas basadas en el prefijo del código postal
  const postalPrefix = currentPostalCode.substring(0, 2);
  
  return allCities.filter(city =>
    allPostalCodes.some(pc =>
      pc.city === city.name &&
      pc.code.startsWith(postalPrefix)
    )
  );
};

// ==================== LOCATION CACHE MANAGEMENT ====================

let citiesCache = null;
let postalCodesCache = null;
let statisticsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

/**
 * Get cities with caching on the frontend
 */
export const getCachedCities = async () => {
  const now = Date.now();
  
  if (citiesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return citiesCache;
  }

  try {
    citiesCache = await locationsApi.getAllCities();
    cacheTimestamp = now;
    return citiesCache;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

/**
 * Get postal codes with caching on the frontend
 */
export const getCachedPostalCodes = async () => {
  const now = Date.now();
  
  if (postalCodesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return postalCodesCache;
  }

  try {
    postalCodesCache = await locationsApi.getAllPostalCodes();
    cacheTimestamp = now;
    return postalCodesCache;
  } catch (error) {
    console.error('Error fetching postal codes:', error);
    throw error;
  }
};

/**
 * Get statistics with caching on the frontend
 */
export const getCachedStatistics = async () => {
  const now = Date.now();
  
  if (statisticsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return statisticsCache;
  }

  try {
    statisticsCache = await locationsApi.getLocationStatistics();
    cacheTimestamp = now;
    return statisticsCache;
  } catch (error) {
    console.error('Error fetching location statistics:', error);
    throw error;
  }
};

/**
 * Clear location cache (useful after mutations or when data might be stale)
 */
export const clearLocationCache = () => {
  citiesCache = null;
  postalCodesCache = null;
  statisticsCache = null;
  cacheTimestamp = null;
};

// ==================== GEO LOCATION UTILITIES ====================

/**
 * Get user's current location using browser geolocation API
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distancia en km
};

export default locationsApi;