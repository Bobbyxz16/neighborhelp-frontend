// src/utils/constants.js

/**
 * NeighborlyUnion Application Constants
 * Central location for all configuration values, API endpoints, and application constants
 */

// ==================== API CONFIGURATION ====================

/**
 * Base API URL - reads from environment variable
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.neighborlyunion.com/api';
console.log('API_BASE_URL config:', {
    env: import.meta.env.VITE_API_BASE_URL,
    final: API_BASE_URL
});

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY_EMAIL: '/auth/verify',
        RESEND_CODE: '/auth/resend',
        REFRESH_TOKEN: '/auth/refresh-token',
        FORGOT_PASSWORD: '/auth/forgot-password',
        VERIFY_RESET_CODE: '/auth/verify-reset-code',
        RESET_PASSWORD: '/auth/reset-password',
        CHECK_VERIFICATION: '/auth/check-verification-status',
    },

    // Users
    USERS: {
        ME: '/users/me',
        CREATE: '/users',
        LIST: '/users',
        DELETE: (identifier) => `/users/${identifier}`,
        UPDATE_ROLE: (identifier) => `/users/${identifier}/role`,
        UPDATE_STATUS: (identifier) => `/users/${identifier}/status`,
        BY_ID: (identifier) => `/users/${identifier}`,
        STATISTICS: (identifier) => `/users/${identifier}/statistics`,
    },

    // Resources
    RESOURCES: {
        BASE: '/resources',
        BY_ID: (id) => `/resources/${id}`,
        BY_SLUG: (slug) => `/resources/${slug}`,
        UPLOADS: '/resources/uploads',
        MY_RESOURCES: '/resources/my-resources',
        USER_RESOURCES: (userId) => `/resources/user/${userId}`,
        SAVED: '/resources/saved',
        SAVE: (resourceName) => `/resources/${resourceName}/save`,
        UNSAVE: (resourceName) => `/resources/${resourceName}/save`, // Same endpoint, different method
        IS_SAVED: (resourceName) => `/resources/${resourceName}/is-saved`,
        PENDING: '/resources/pending',
        ADMIN_OVERVIEW: '/resources/admin/status-overview',
        ACTIVATE: (slug) => `/resources/${slug}/activate`,
        DEACTIVATE: (slug) => `/resources/${slug}/deactivate`,
        APPROVE: (slug) => `/resources/${slug}/approve`,
        REJECT: (slug) => `/resources/${slug}/reject`,
        UPDATE_STATUS: (slug) => `/resources/${slug}/status`,
        DELETE_PERMANENT: (slug) => `/resources/${slug}/permanent`,
    },

    // Categories
    CATEGORIES: {
        BASE: '/categories',
        BY_ID: (id) => `/categories/${id}`,
        SEARCH: '/categories/search',
        RESOURCE_COUNT: (id) => `/categories/${id}/resources/count`,
    },

    // Locations
    LOCATIONS: {
        CITIES: '/locations/cities',
        POSTAL_CODES: '/locations/postal-codes',
        SEARCH_CITIES: '/locations/search/cities',
        SEARCH_POSTAL_CODES: '/locations/search/postal-codes',
        CITY_POSTAL_CODES: (city) => `/locations/cities/${city}/postal-codes`,
        STATISTICS: '/locations/statistics',
    },

    // Messages
    MESSAGES: {
        SEND: '/messages',
        INBOX: '/messages/inbox',
        SENT: '/messages/sent',
        UNREAD: '/messages/unread',
        UNREAD_COUNT: '/messages/unread/count',
        MARK_READ: (id) => `/messages/${id}/read`,
        DELETE: (id) => `/messages/${id}`,
        USERS: '/messages/users',
    },

    // Ratings
    RATINGS: {
        BY_RESOURCE: (resourceName) => `/resources/${resourceName}/ratings`,
        CREATE: (resourceName) => `/resources/${resourceName}/ratings`,
        SUMMARY: (resourceName) => `/resources/${resourceName}/ratings/summary`,
        DELETE_MY_RATING: (resourceName) => `/resources/${resourceName}/ratings`,
        MARK_HELPFUL: (ratingId) => `/ratings/${ratingId}/helpful`,
    },


    REPORTS: {
        BASE: '/reports',
        BY_ID: (id) => `/reports/${id}`,
        RESOLVE: (id) => `/reports/${id}/resolve`,
        ESCALATE: (id) => `/reports/${id}/escalate`,
        CREATE: '/reports',
    },


    // Analytics
    ANALYTICS: {
        OVERVIEW: '/analytics/overview',
        USAGE: '/analytics/usage',
        GEOGRAPHIC: '/analytics/geographic',
        RESOURCES: '/analytics/resources',
        TRENDS: '/analytics/trends',
    },

    // OAuth
    OAUTH: {
        GOOGLE: '/oauth2/authorization/google'
    },

    // Moderation
    MODERATION: {
        METRICS_DAILY: '/moderation/metrics/daily',
        METRICS_WEEKLY: '/moderation/metrics/weekly',
        METRICS_MONTHLY: '/moderation/metrics/monthly',
    },
};

// ==================== APPLICATION SETTINGS ====================

/**
        * Application metadata
 */
export const APP_CONFIG = {
    NAME: 'NeighborlyUnion',
    VERSION: '1.0.0',
    DESCRIPTION: 'Community Resource Platform',
    AUTHOR: 'NeighborlyUnion Team',
    SUPPORT_EMAIL: 'hello@neighborlyunion.com',
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 50,
    DEFAULT_SORT: 'createdAt',
    DEFAULT_DIRECTION: 'desc',
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100, 200],
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
};

// ==================== USER & ROLES ====================

/**
 * User types
 */
export const USER_TYPES = {
    INDIVIDUAL: 'INDIVIDUAL',
    ORGANIZATION: 'ORGANIZATION',
};

/**
 * User type labels
 */
export const USER_TYPE_LABELS = {
    [USER_TYPES.INDIVIDUAL]: 'Individual',
    [USER_TYPES.ORGANIZATION]: 'Organization',
};

/**
 * User roles
 */
export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    MODERATOR: 'MODERATOR',
};

// ==================== RESOURCE CONFIGURATION ====================

/**
 * Resource statuses
 */
export const RESOURCE_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
    REJECTED: 'REJECTED',
};

/**
 * Resource status labels and colors
 */
export const RESOURCE_STATUS_CONFIG = {
    [RESOURCE_STATUS.ACTIVE]: {
        label: 'Active',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        description: 'Resource is live and visible to users',
    },
    [RESOURCE_STATUS.INACTIVE]: {
        label: 'Inactive',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        description: 'Resource is hidden from public view',
    },
    [RESOURCE_STATUS.PENDING]: {
        label: 'Pending',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        description: 'Awaiting approval from moderators',
    },
    [RESOURCE_STATUS.REJECTED]: {
        label: 'Rejected',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        description: 'Resource was rejected by moderators',
    },
};

/**
 * Resource cost options
 */
export const RESOURCE_COST = {
    FREE: 'FREE',
    LOW_COST: 'LOW_COST',
    AFFORDABLE: 'AFFORDABLE',
};

/**
 * Resource cost labels
 */
export const RESOURCE_COST_LABELS = {
    [RESOURCE_COST.FREE]: 'Free',
    [RESOURCE_COST.LOW_COST]: 'Low Cost',
    [RESOURCE_COST.AFFORDABLE]: 'Affordable',
};

/**
 * Default categories (fallback if API fails)
 */
export const DEFAULT_CATEGORIES = [
    'Food', 'Housing', 'Education', 'Healthcare', 'Employment',
    'Legal', 'Transportation', 'Clothing', 'Mental Health',
    'Childcare', 'Senior Services', 'Animal Welfare',
    'Environment', 'Arts & Culture', 'Sports', 'Disability',
    'Refugee Support', 'Veteran Services', 'Addiction Recovery',
];

// ==================== FILE UPLOAD ====================

/**
 * File upload configuration
 */
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

/**
 * Image upload configuration for resources
 */
export const IMAGE_UPLOAD = {
    MAX_FILES: 5,
    MAX_SIZE_MB: 5,
    ACCEPTED_FORMATS: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/gif': ['.gif'],
        'image/webp': ['.webp'],
    },
};

// ==================== VALIDATION ====================

/**
 * Validation rules
 */
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    ORGANIZATION_NAME_MIN_LENGTH: 2,
    ORGANIZATION_NAME_MAX_LENGTH: 100,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
    POSTAL_CODE_REGEX: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
};

// ==================== UI CONSTANTS ====================

/**
 * Toast notification durations (in milliseconds)
 */
export const TOAST_DURATION = {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
};

/**
 * Debounce delays (in milliseconds)
 */
export const DEBOUNCE_DELAY = {
    SEARCH: 300,
    INPUT: 500,
    RESIZE: 200,
};

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
};

// ==================== FEATURE FLAGS ====================

/**
 * Feature flags for enabling/disabling features
 */
export const FEATURES = {
    ENABLE_RATINGS: true,
    ENABLE_MESSAGING: true,
    ENABLE_ANALYTICS: true,
    ENABLE_MODERATION: true,
    ENABLE_NOTIFICATIONS: true,
};

// ==================== ERROR MESSAGES ====================

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

// ==================== SUCCESS MESSAGES ====================

/**
 * Common success messages
 */
export const SUCCESS_MESSAGES = {
    RESOURCE_CREATED: 'Resource created successfully!',
    RESOURCE_UPDATED: 'Resource updated successfully!',
    RESOURCE_DELETED: 'Resource deleted successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    MESSAGE_SENT: 'Message sent successfully!',
    RATING_SUBMITTED: 'Rating submitted successfully!',
};

// ==================== DATE/TIME ====================

/**
 * Date format strings
 */
export const DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY h:mm A',
    ISO: 'YYYY-MM-DD',
    TIME: 'h:mm A',
};

/**
 * Get relative time string from timestamp
 * @param {number} timestamp - The timestamp in milliseconds
 * @returns {string} Relative time string (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    return `${years} year${years !== 1 ? 's' : ''} ago`;
};

// ==================== MAP CONFIGURATION ====================

/**
 * Default map center (Toronto, Canada)
 */
export const DEFAULT_MAP_CENTER = {
    lat: 43.6532,
    lng: -79.3832,
};

/**
 * Default map zoom level
 */
export const DEFAULT_MAP_ZOOM = 11;