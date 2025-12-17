import React, { useRef } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';

const EmptyState = ({
  hasSearched,
  searchQuery,
  onClearFilters,
  onNewSearch,
  onStartSearching,
  searchInputRef
}) => {
  const suggestions = [
    'Food assistance',
    'Healthcare',
    'Job training',
    'Housing help',
    'Legal aid',
    'Mental health'
  ];

  const handleGoToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus the search input after scrolling
    setTimeout(() => {
      if (searchInputRef?.current) {
        searchInputRef.current.focus();
      }
    }, 500);
  };

  if (!hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Find Community Resources
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Search for local aid services, support organizations, and community resources in your area.
          Use the search bar above to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            onClick={onStartSearching}
            iconName="Search"
            iconPosition="left"
            iconSize={16}
          >
            Start Searching
          </Button>
          <Button
            variant="outline"
            onClick={handleGoToSearch}
            iconName="ArrowUp"
            iconPosition="left"
            iconSize={16}
          >
            Go to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="SearchX" size={32} color="var(--color-muted-foreground)" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Resources Found
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {searchQuery ? (
          `We couldn't find any resources matching "${searchQuery}". Try adjusting your search terms or filters.`
        ) : (
          'No resources match your current filters. Try broadening your search criteria.'
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="default"
          onClick={onClearFilters}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
        >
          Clear All Filters
        </Button>
        <Button
          variant="outline"
          onClick={onNewSearch}
          iconName="Search"
          iconPosition="left"
          iconSize={16}
        >
          New Search
        </Button>
      </div>

      {/* Search Suggestions */}
      <div className="mt-8 p-4 bg-muted rounded-lg max-w-md mx-auto">
        <h4 className="font-medium text-foreground mb-3">Try searching for:</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions?.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onNewSearch(suggestion)}
              className="px-3 py-1 bg-card hover:bg-accent text-muted-foreground hover:text-accent-foreground text-sm rounded-md transition-smooth border border-border"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;