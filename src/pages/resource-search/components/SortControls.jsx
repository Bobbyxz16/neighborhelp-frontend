import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import Select from '../../../components/ui/ui-components/Select';
import Button from '../../../components/ui/ui-components/Button';

const SortControls = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultsCount,
  isLoading
}) => {
  const sortOptions = [
    { value: 'averageRating', label: 'Rating (Highest)' },
    { value: 'updatedAt', label: 'Recently Updated' },
    { value: 'title', label: 'Name (A-Z)' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border rounded-lg p-4">
      {/* Results Count */}
      <div className="flex items-center space-x-2">
        <Icon name="Search" size={16} color="var(--color-muted-foreground)" />
        <span className="text-sm text-muted-foreground">
          {isLoading ? (
            'Searching...'
          ) : (
            `${resultsCount?.toLocaleString() || 0} resources found`
          )}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Sort Dropdown */}
        <div className="min-w-[180px]">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by..."
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            iconName="Grid3X3"
            iconSize={16}
            className="px-3"
          />
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            iconName="List"
            iconSize={16}
            className="px-3"
          />
          
        </div>
      </div>
    </div>
  );
};

export default SortControls;