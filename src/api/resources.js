import { api } from './auth';

// ==================== RESOURCE TYPES ====================

export const ResourceStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED'
};

export const CostType = {
  FREE: 'FREE',
  DONATION: 'DONATION',
  FEE: 'FEE'
};

// ==================== RESOURCE API ====================

export const resourcesApi = {
  /**
   * GET /api/resources
   * Search and filter resources
   * Public endpoint - no auth required
   */
  async searchResources(params = {}) {
    const queryParams = new URLSearchParams();
    
    // Agregar parámetros de búsqueda
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.city) queryParams.append('city', params.city);
    if (params.postalCode) queryParams.append('postalCode', params.postalCode);
    if (params.cost) queryParams.append('cost', params.cost);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    return await api.request(`/resources${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * POST /api/resources
   * Create new resource
   * Auth required - USER, ORGANIZATION, ADMIN
   */
  async createResource(resourceData) {
    return await api.request('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    });
  },

  /**
   * GET /api/resources/{resourceName}
   * Get resource by name (slug)
   * Public endpoint - Increments view count automatically
   */
  async getResourceBySlug(resourceName) {
    return await api.request(`/resources/${resourceName}`);
  },

  /**
   * PUT /api/resources/{resourceName}
   * Update resource
   * Auth required - Owner or ADMIN
   */
  async updateResource(resourceName, updateData) {
    return await api.request(`/resources/${resourceName}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * DELETE /api/resources/{resourceName}/permanent
   * PERMANENTLY DELETE resource (completely remove from database)
   * Auth required - Owner or ADMIN
   */
  async permanentlyDeleteResource(resourceName) {
    return await api.request(`/resources/${resourceName}/permanent`, {
      method: 'DELETE',
    });
  },

  /**
   * PATCH /api/resources/{resourceName}/deactivate
   * DEACTIVATE resource (set status to INACTIVE - hide from public)
   * Auth required - Owner or ADMIN
   */
  async deactivateResource(resourceName) {
    return await api.request(`/resources/${resourceName}/deactivate`, {
      method: 'PATCH',
    });
  },

  /**
   * PATCH /api/resources/{resourceName}/activate
   * ACTIVATE resource (set status to ACTIVE - make visible to public)
   * Auth required - Owner or ADMIN
   */
  async activateResource(resourceName) {
    return await api.request(`/resources/${resourceName}/activate`, {
      method: 'PATCH',
    });
  },

  /**
   * PATCH /api/resources/{resourceName}/status
   * Change resource status
   * Auth required - Owner or ADMIN
   * Status: ACTIVE, INACTIVE, PENDING, REJECTED
   */
  async updateResourceStatus(resourceName, status) {
    return await api.request(`/resources/${resourceName}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * GET /api/resources/user/{userId}
   * Get all public resources by a user
   * Public endpoint
   */
  async getUserResources(userId, params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    return await api.request(`/resources/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * GET /api/resources/my-resources
   * Get current user's resources (all statuses)
   * Auth required
   */
  async getMyResources(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    return await api.request(`/resources/my-resources${queryString ? `?${queryString}` : ''}`);
  },

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * GET /api/resources/admin/status-overview
   * Get comprehensive status overview for all resources
   * Auth required - ADMIN, MODERATOR
   */
  async getResourcesStatusOverview(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.username) queryParams.append('username', params.username);
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const queryString = queryParams.toString();
    return await api.request(`/resources/admin/status-overview${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * GET /api/resources/pending
   * Get pending resources for moderation
   * Auth required - ADMIN, MODERATOR
   */
  async getPendingResources(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const queryString = queryParams.toString();
    return await api.request(`/resources/pending${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * PATCH /api/resources/{resourceName}/approve
   * Approve pending resource
   * Auth required - ADMIN, MODERATOR
   */
  async approveResource(resourceName) {
    return await api.request(`/resources/${resourceName}/approve`, {
      method: 'PATCH',
    });
  },

  /**
   * PATCH /api/resources/{resourceName}/reject
   * Reject pending resource
   * Auth required - ADMIN, MODERATOR
   */
  async rejectResource(resourceName, reason = '') {
    return await api.request(`/resources/${resourceName}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
};

// ==================== RESOURCE UTILITIES ====================

/**
 * Helper function to format resource data for forms
 */
export const formatResourceForForm = (resource) => {
  return {
    title: resource?.title || '',
    description: resource?.description || '',
    categoryId: resource?.category?.id || '',
    costType: resource?.costType || CostType.FREE,
    price: resource?.price || 0,
    address: resource?.address || '',
    city: resource?.city || '',
    postalCode: resource?.postalCode || '',
    contactPhone: resource?.contactPhone || '',
    contactEmail: resource?.contactEmail || '',
    website: resource?.website || '',
    images: resource?.images || [],
    tags: resource?.tags || [],
  };
};

/**
 * Helper function to validate resource data before submission
 */
export const validateResourceData = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.categoryId) {
    errors.categoryId = 'Category is required';
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required';
  }

  if (data.costType === CostType.FEE && (!data.price || data.price <= 0)) {
    errors.price = 'Price is required for fee-based resources';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Helper function to get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    [ResourceStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [ResourceStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
    [ResourceStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ResourceStatus.REJECTED]: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Helper function to get cost type display text
 */
export const getCostDisplay = (costType, price = 0) => {
  const types = {
    [CostType.FREE]: 'Free',
    [CostType.DONATION]: 'Donation',
    [CostType.FEE]: `$${price}`,
  };
  return types[costType] || 'Free';
};

export default resourcesApi;