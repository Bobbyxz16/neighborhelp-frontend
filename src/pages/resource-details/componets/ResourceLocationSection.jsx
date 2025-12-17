import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';

const ResourceLocationSection = ({ resource }) => {
  const [showFullMap, setShowFullMap] = useState(false);

  // Construct full address from flat fields
  const fullAddress = resource?.fullAddress || [
    resource?.street,
    resource?.city,
    resource?.province,
    resource?.postalCode,
    resource?.country
  ].filter(Boolean).join(', ');

  // Display address with better formatting
  const displayAddress = resource?.street
    ? `${resource.street}${resource.city ? `, ${resource.city}` : ''}${resource.postalCode ? ` ${resource.postalCode}` : ''}`
    : resource?.fullAddress || resource?.city || 'Address not available';

  const handleGetDirections = () => {
    const address = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleViewOnMap = () => {
    const address = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Check if we have any location data to display
  const hasLocationData = fullAddress || resource?.serviceArea || resource?.accessibility || resource?.transportation;

  if (!hasLocationData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Location & Access</h3>
        <div className="text-center py-8">
          <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No location information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">Location & Access</h3>

      {/* Address Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          {/* Address */}
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center">
              <Icon name="MapPin" size={16} className="mr-2 text-primary" />
              Address
            </h4>
            <div className="text-muted-foreground">
              <p>{displayAddress}</p>
              {resource?.province && <p className="text-sm mt-1">{resource.province}</p>}
              {resource?.country && resource.country !== 'España' && (
                <p className="text-sm">{resource.country}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetDirections}
                iconName="Navigation"
                iconPosition="left"
              >
                Get Directions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewOnMap}
                iconName="Map"
                iconPosition="left"
              >
                View on Map
              </Button>
            </div>
          </div>

          {/* Service Area */}
          {resource?.serviceArea && (
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icon name="Globe" size={16} className="mr-2 text-primary" />
                Service Area
              </h4>
              <p className="text-muted-foreground">{resource.serviceArea}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Accessibility */}
          {resource?.accessibility && (
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icon name="Accessibility" size={16} className="mr-2 text-primary" />
                Accessibility
              </h4>
              <p className="text-muted-foreground">{resource.accessibility}</p>
            </div>
          )}

         

          {/* Transportation */}
          {resource?.transportation && (
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icon name="Bus" size={16} className="mr-2 text-primary" />
                Transportation
              </h4>
              <p className="text-muted-foreground">{resource.transportation}</p>
            </div>
          )}

          {/* Parking */}
          {resource?.parking && (
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icon name="Car" size={16} className="mr-2 text-primary" />
                Parking
              </h4>
              <p className="text-muted-foreground">{resource.parking}</p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map */}
      {fullAddress && (
        <div className="bg-muted rounded-lg overflow-hidden border border-border">
          <div
            className={`relative transition-all duration-300 ${showFullMap ? 'h-96' : 'h-48'}`}
          >
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={`Map of ${resource?.title}`}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=14&output=embed`}
              className="border-0"
            />

            {/* Expand/Collapse Control Overlay */}
            <div className="absolute bottom-4 right-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFullMap(!showFullMap)}
                iconName={showFullMap ? "Minimize2" : "Maximize2"}
                className="shadow-lg bg-background/90 text-black hover:bg-background backdrop-blur-sm"
              >
                {showFullMap ? 'Minimize Map' : 'Expand Map'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLocationSection;