import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/ui-components/Header';
import SearchBar from './components/SearchBar';
import SearchFilters from './components/SearchFilters';
import SortControls from './components/SortControls';
import ResourceCard from './components/ResourceCard';
import MapView from './components/MapView';
import EmptyState from './components/EmptyState';
import { API_BASE_URL, API_ENDPOINTS, PAGINATION, DEFAULT_CATEGORIES } from '../../utils/constants';
import defaultResources from '../../utils/defaultResources';

const ResourceSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    categoryIds: [],
    locationRadius: '10'
  });
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // View state
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedResource, setSelectedResource] = useState(null);
  const [savedOnly, setSavedOnly] = useState(false);

  // Data state
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES.map(category => ({
    id: category,
    name: category
  })));
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPostalCode, setSelectedPostalCode] = useState('');
  const [totalResources, setTotalResources] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // User state (from auth context - replace with your actual auth)
  const [user, setUser] = useState(null);

  // Ref for search input
  const searchInputRef = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Watch URL for saved-only mode
  // Watch URL for saved-only mode and search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const saved = params.get('saved') === 'true';
    const query = params.get('search');

    setSavedOnly(saved);
    if (query) {
      setSearchQuery(query);
    }

    // Reset but trigger search if we have a query or saved mode
    setResources([]);
    setTotalResources(0);
    setHasSearched(!!(saved || query));
    setCurrentPage(0);
  }, [location.search]);

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      // If no token, don't try to load user-specific data
      if (!token) {
        console.log('No access token found, loading public resources only');
        loadResources(); // Load public resources
        return;
      }

      // Load user profile
      const userResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.ME}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          // Token is invalid or expired
          console.log('Session expired, redirecting to login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login', { state: { from: location.pathname } });
          return;
        }
        throw new Error('Failed to load user data');
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Load categories from backend
      const categoriesResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES.BASE}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let backendCategories = [];
      if (categoriesResponse.ok) {
        backendCategories = await categoriesResponse.json();
      }

      // Build unified category list from DEFAULT_CATEGORIES, backend categories and defaultResources
      const categoryNameSet = new Set();

      // 1) Default categories (constants)
      DEFAULT_CATEGORIES?.forEach((name) => {
        if (name) categoryNameSet.add(name);
      });

      // 2) Backend categories (objects with .name)
      backendCategories?.forEach((cat) => {
        if (cat?.name) categoryNameSet.add(cat.name);
      });

      // 3) Categories present in defaultResources
      defaultResources?.forEach((resource) => {
        if (resource?.categoryName) categoryNameSet.add(resource.categoryName);
      });

      const combinedCategories = Array.from(categoryNameSet).map(name => ({
        id: name,
        name
      }));

      setCategories(combinedCategories);

      // Load cities
      const citiesResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOCATIONS.CITIES}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (citiesResponse.ok) {
        const citiesData = await citiesResponse.json();
        setCities(citiesData);
      }

      // Load resources after all initial data is loaded
      loadResources();
    } catch (error) {
      console.error('Failed to load initial data:', error);
      // Still try to load public resources even if other data fails
      loadResources();
    }
  };

  // Update the loadResources function to handle public access
  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Fetch backend resources
      let backendResources = [];
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESOURCES.BASE}`);
        if (response.ok) {
          const data = await response.json();
          // specific check for Spring Data REST / HATEOAS or standard page/content structure
          backendResources = data.content || data || [];
        }
      } catch (err) {
        console.error('Failed to fetch backend resources, using defaults only:', err);
      }

      // Merge default and backend resources
      let filtered = [...defaultResources, ...backendResources];

      // 1. Filter by Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(resource =>
          (resource.title && resource.title.toLowerCase().includes(query)) ||
          (resource.description && resource.description.toLowerCase().includes(query)) ||
          (resource.categoryName && resource.categoryName.toLowerCase().includes(query))
        );
      }

      // 2. Filter by Location (City/Zip/Province)
      if (selectedCity) {
        const locationTerm = selectedCity.toLowerCase().trim();
        filtered = filtered.filter(resource =>
          (resource.city && resource.city.toLowerCase() === locationTerm) ||
          (resource.postalCode && resource.postalCode.toLowerCase().includes(locationTerm)) ||
          (resource.province && resource.province.toLowerCase() === locationTerm)
        );
      }

      if (filters.categoryIds && filters.categoryIds.length > 0) {
        filtered = filtered.filter(resource =>
          resource.categoryName && filters.categoryIds.includes(resource.categoryName)
        );
      }

      // 4. Randomize order (shuffle)
      filtered.sort(() => Math.random() - 0.5);

      // 5. Pagination
      const totalElements = filtered.length;
      const start = currentPage * PAGINATION.DEFAULT_SIZE;
      const end = start + PAGINATION.DEFAULT_SIZE;
      const paginatedResources = filtered.slice(start, end);

      setResources(paginatedResources);
      setTotalResources(totalElements);
      setHasSearched(true);

    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage, sortBy, sortDirection, savedOnly, navigate, location.pathname, selectedCity, filters]);
  useEffect(() => {
    // Always reload resources whenever dependencies (search, filters, city, etc.) change
    loadResources();
  }, [loadResources, savedOnly]);

  const handleSearch = async (query, location) => {
    setSearchQuery(query);
    if (location) {
      setSelectedCity(location);
    }
    setHasSearched(true);
    setCurrentPage(0);
  };

  const handleLocationDetect = async (detectedLocation) => {
    try {
      // In a real app, you'd use reverse geocoding to get city from coordinates
      // For now, we'll just set the location
      setSelectedCity(detectedLocation);
    } catch (error) {
      console.error('Failed to process location:', error);
    }
  };

  const handleSaveResource = async (resourceSlug, isSaved) => {
    try {
      const token = localStorage.getItem('accessToken');

      // Make API call to save/unsave the resource per API constants
      const endpoint = isSaved
        ? `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.SAVE(resourceSlug)}`
        : `${API_BASE_URL}${API_ENDPOINTS.RESOURCES.UNSAVE(resourceSlug)}`;
      const method = isSaved ? 'POST' : 'DELETE';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save/unsave resource');
      }

      // Update local state after successful API call
      setResources((prev) =>
        prev?.map((resource) =>
          resource?.slug === resourceSlug
            ? { ...resource, isSaved }
            : resource
        )
      );
    } catch (error) {
      console.error('Failed to save/unsave resource:', error);
    }
  };

  const handleShareResource = (resource) => {
    const url = `${window.location.origin}/resources/${resource.slug}`;

    if (navigator.share) {
      navigator.share({
        title: resource.name,
        text: resource.description,
        url: url
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleContactResource = (resource) => {
    navigate(`/resources/${resource.slug}`);
  };

  const handleClearFilters = () => {
    setFilters({
      categoryIds: [],
      locationRadius: '10'
    });
    setSearchQuery('');
    setSelectedCity('');
    setSelectedPostalCode('');
    setCurrentPage(0);
    setHasSearched(false);
    setResources([]);
  };

  const handleNewSearch = (suggestion = '') => {
    if (suggestion) {
      setSearchQuery(suggestion);
      handleSearch(suggestion, selectedCity);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSearching = () => {
    setHasSearched(true);
    setCurrentPage(0);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSortChange = (newSortBy) => {
    // Toggle direction if same sort field
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderResourceGrid = () => {
    if (viewMode === 'map') {
      return (
        <MapView
          resources={resources}
          onResourceSelect={setSelectedResource}
          selectedResource={selectedResource}
        />
      );
    }

    if (resources?.length === 0) {
      return (
        <EmptyState
          hasSearched={hasSearched}
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
          onNewSearch={handleNewSearch}
          onStartSearching={handleStartSearching}
          searchInputRef={searchInputRef}
        />
      );
    }

    const gridClass = viewMode === 'list'
      ? 'space-y-4'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    return (
      <div className={gridClass}>
        {resources?.map((resource) => (
          <ResourceCard
            key={resource?.id}
            resource={resource}
            onSave={handleSaveResource}
            onShare={handleShareResource}
            onContact={handleContactResource}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {savedOnly ? 'Saved Resources' : 'Find Community Resources'}
            </h1>
            <p className="text-muted-foreground">
              Discover local aid services, support organizations, and community resources in your area.
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <SearchBar
              ref={searchInputRef}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              onLocationDetect={handleLocationDetect}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                isExpanded={isFiltersExpanded}
                onToggleExpanded={() => setIsFiltersExpanded(!isFiltersExpanded)}
                categories={categories}
                cities={cities}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedPostalCode={selectedPostalCode}
                onPostalCodeChange={setSelectedPostalCode}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Sort Controls */}
              <div className="mb-6">
                <SortControls
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  resultsCount={totalResources}
                  isLoading={isLoading}
                />
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">Searching for resources...</span>
                  </div>
                </div>
              )}

              {/* Results */}
              {!isLoading && renderResourceGrid()}

              {/* Pagination */}
              {!isLoading && totalResources > 0 && resources.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-muted-foreground">
                      Page {currentPage + 1} of {Math.ceil(totalResources / PAGINATION.DEFAULT_SIZE)}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={(currentPage + 1) * PAGINATION.DEFAULT_SIZE >= totalResources}
                      className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourceSearch;