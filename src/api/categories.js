import { api } from './auth';

// ==================== CATEGORY API ====================

export const categoriesApi = {
  /**
   * GET /api/categories
   * List all categories
   * Public endpoint with caching for better performance
   * Returns all categories sorted by name
   */
  async getAllCategories() {
    return await api.request('/categories');
  },

  /**
   * GET /api/categories/{id}
   * Get single category by ID
   * Public endpoint
   */
  async getCategoryById(id) {
    return await api.request(`/categories/${id}`);
  },

  /**
   * GET /api/categories/search
   * Search categories by name
   * Query param: name - partial match (case-insensitive)
   * Public endpoint
   */
  async searchCategories(name) {
    return await api.request(`/categories/search?name=${encodeURIComponent(name)}`);
  },

  /**
   * POST /api/categories
   * Create new category
   * Auth required - ADMIN only
   * Clears cache after creation
   */
  async createCategory(categoryData) {
    return await api.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * PUT /api/categories/{id}
   * Update existing category
   * Auth required - ADMIN only
   * Clears cache after update
   */
  async updateCategory(id, updateData) {
    return await api.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * DELETE /api/categories/{id}
   * Delete category
   * Auth required - ADMIN only
   * Cannot delete if category has resources
   * Clears cache after deletion
   */
  async deleteCategory(id) {
    return await api.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * GET /api/categories/{id}/resources/count
   * Get count of resources in a category
   * Public endpoint
   */
  async getResourceCount(id) {
    return await api.request(`/categories/${id}/resources/count`);
  },
};

// ==================== CATEGORY UTILITIES ====================

/**
 * Helper function to organize categories by parent (for hierarchical display)
 */
export const organizeCategoriesHierarchically = (categories) => {
  const categoryMap = new Map();
  const rootCategories = [];

  // Primero, crear un mapa de todas las categorías
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Luego, organizar en jerarquía
  categories.forEach(category => {
    const categoryNode = categoryMap.get(category.id);
    
    if (category.parentId && categoryMap.has(category.parentId)) {
      // Es una subcategoría, agregar al padre
      categoryMap.get(category.parentId).children.push(categoryNode);
    } else {
      // Es una categoría raíz
      rootCategories.push(categoryNode);
    }
  });

  return rootCategories;
};

/**
 * Helper function to flatten categories for select dropdowns
 */
export const flattenCategoriesForSelect = (categories, prefix = '') => {
  const flattened = [];

  categories.forEach(category => {
    flattened.push({
      value: category.id,
      label: prefix + category.name,
      description: category.description,
      icon: category.icon,
    });

    // Recursivamente agregar subcategorías
    if (category.children && category.children.length > 0) {
      const childCategories = flattenCategoriesForSelect(category.children, prefix + '-- ');
      flattened.push(...childCategories);
    }
  });

  return flattened;
};

/**
 * Helper function to find category by ID (including in nested structure)
 */
export const findCategoryById = (categories, id) => {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    
    if (category.children && category.children.length > 0) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  
  return null;
};

/**
 * Helper function to get category path (breadcrumb)
 */
export const getCategoryPath = (categories, categoryId) => {
  const path = [];
  
  const findPath = (currentCategories, targetId) => {
    for (const category of currentCategories) {
      if (category.id === targetId) {
        path.unshift(category);
        return true;
      }
      
      if (category.children && category.children.length > 0) {
        if (findPath(category.children, targetId)) {
          path.unshift(category);
          return true;
        }
      }
    }
    return false;
  };

  findPath(categories, categoryId);
  return path;
};

/**
 * Helper function to validate category data
 */
export const validateCategoryData = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Category name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters long';
  }

  if (!data.description?.trim()) {
    errors.description = 'Category description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Category description must be at least 10 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
  

/**
 * Helper function to get category color based on ID or name
 */
export const getCategoryColor = (category) => {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200',
  ];

  // Generar un índice basado en el ID o nombre de la categoría
  const index = category?.id ? category.id % colors.length : 
                category?.name?.charCodeAt(0) % colors.length || 0;
  
  return colors[index];
};

// ==================== CATEGORY CACHE MANAGEMENT ====================

let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Get categories with caching on the frontend
 */
export const getCachedCategories = async () => {
  const now = Date.now();
  
  if (categoriesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return categoriesCache;
  }

  try {
    categoriesCache = await categoriesApi.getAllCategories();
    cacheTimestamp = now;
    return categoriesCache;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Clear categories cache (useful after mutations)
 */
export const clearCategoriesCache = () => {
  categoriesCache = null;
  cacheTimestamp = null;
};

export default categoriesApi;