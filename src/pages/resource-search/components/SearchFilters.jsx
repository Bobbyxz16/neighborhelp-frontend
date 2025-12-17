import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';
import Select from '../../../components/ui/ui-components/Select';
import Button from '../../../components/ui/ui-components/Button';

const SearchFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isExpanded,
  onToggleExpanded,
  categories,
  cities,
  selectedCity,
  onCityChange
}) => {

  const locationOptions = [
    { value: '1', label: 'Within 1 mile' },
    { value: '5', label: 'Within 5 miles' },
    { value: '10', label: 'Within 10 miles' },
    { value: '25', label: 'Within 25 miles' },
    { value: '50', label: 'Within 50 miles' }
  ];

  const handleCategoryChange = (categoryName, checked) => {
    const updatedCategoryIds = checked
      ? [...(filters?.categoryIds || []), categoryName]
      : (filters?.categoryIds || [])?.filter(name => name !== categoryName);

    onFiltersChange({ ...filters, categoryIds: updatedCategoryIds });
  };

  const handleLocationChange = (value) => {
    onFiltersChange({ ...filters, locationRadius: value });
  };

  const activeFiltersCount = filters?.categoryIds?.length || 0;

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} color="var(--color-foreground)" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            iconSize={16}
            className="md:hidden"
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 space-y-6">
          {/* Location Radius */}
          <div>
            <Select
              label="Search Radius"
              options={locationOptions}
              value={filters?.locationRadius}
              onChange={handleLocationChange}
              placeholder="Select distance"
            />
          </div>

          {/* City Selection */}
          {cities && cities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.city} value={city.city}>
                    {city.city} ({city.resourceCount})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Categories
            </label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {categories?.length > 0 ? (
                categories.map((category) => (
                  <div key={category?.id || category?.name} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters?.categoryIds?.includes(category?.name)}
                      onChange={(e) => handleCategoryChange(category?.name, e?.target?.checked)}
                    />
                    <span className="text-sm text-foreground">{category?.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No categories available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;