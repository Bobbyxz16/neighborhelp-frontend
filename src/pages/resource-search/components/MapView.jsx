import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';

const MapView = ({ resources, selectedResource }) => {
  // Default coordinates (can be dynamic based on user location)
  const [centerLat, setCenterLat] = React.useState(40.7128);
  const [centerLng, setCenterLng] = React.useState(-74.0060);

  React.useEffect(() => {
    // Fallback to user location if no resources
    if (!resources || resources.length === 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCenterLat(pos.coords.latitude);
            setCenterLng(pos.coords.longitude);
          },
          () => {
            // Use default if location access denied
          }
        );
      }
    }
  }, [resources]);

  // Generate address string for a resource
  const getResourceAddress = (resource) => {
    return resource?.street
      ? `${resource.street}${resource.city ? `, ${resource.city}` : ''}${resource.postalCode ? ` ${resource.postalCode}` : ''}`
      : resource?.fullAddress || resource?.city || '';
  };

  // Generate markers for all resources
  const generateMapUrl = () => {
    // If we have resources with addresses, create a map with markers
    if (resources && resources.length > 0) {
      const validResources = resources.filter(r => {
        const address = getResourceAddress(r);
        return address && address.trim().length > 0;
      });
      
      if (validResources.length > 0) {
        // For multiple locations, use the first resource address as center
        const firstAddress = getResourceAddress(validResources[0]);
        const encodedAddress = encodeURIComponent(firstAddress);
        
        // Create markers string for all locations
        const markers = validResources
          .map(r => {
            const address = getResourceAddress(r);
            return encodeURIComponent(address);
          })
          .join('|');
        
        // Use Google Maps URL with markers
        return `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
      }
    }
    
    return `https://www.google.com/maps?q=${centerLat},${centerLng}&z=12&output=embed`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 overflow-hidden">
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Map" size={20} color="var(--color-foreground)" />
          <h3 className="font-semibold text-foreground">Resource Locations</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {resources?.length || 0} locations
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="Maximize2"
            iconSize={14}
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 lg:h-[500px]">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Resource Locations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={generateMapUrl()}
          className="border-0"
        />

        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            variant="secondary"
            size="sm"
            iconName="Plus"
            iconSize={16}
            className="shadow-elevation-2"
          />
          <Button
            variant="secondary"
            size="sm"
            iconName="Minus"
            iconSize={16}
            className="shadow-elevation-2"
          />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <h4 className="text-sm font-medium text-foreground mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-xs text-muted-foreground">Limited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-xs text-muted-foreground">Emergency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Resource Info */}
      {selectedResource && (
        <div className="p-4 border-t border-border bg-accent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                {selectedResource?.providerName || selectedResource?.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedResource?.location || selectedResource?.city}
              </p>
              <div className="flex items-center space-x-4">
                {selectedResource?.distance && (
                  <span className="text-xs text-muted-foreground">
                    {selectedResource?.distance} miles away
                  </span>
                )}
                {selectedResource?.rating && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} color="var(--color-warning)" className="fill-current" />
                    <span className="text-xs text-muted-foreground">
                      {selectedResource?.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              iconName="Phone"
              iconPosition="left"
              iconSize={14}
            >
              Contact
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;