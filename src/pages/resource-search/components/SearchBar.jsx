import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';
import Input from '../../../components/ui/ui-components/Input';
import Button from '../../../components/ui/ui-components/Button';

const SearchBar = forwardRef(({ searchQuery, onSearchChange, onSearch, onLocationDetect }, ref) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleLocationDetect = async () => {
    setIsDetectingLocation(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Use OpenStreetMap Nominatim API for reverse geocoding
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );

              if (response.ok) {
                const data = await response.json();
                const address = data.address;
                // Prioritize city, then town, village, etc.
                const city = address.city || address.town || address.village || address.hamlet || address.suburb || address.county;

                if (city) {
                  setLocation(city);
                  onLocationDetect(city);
                } else {
                  // Fallback to coordinates if no city found
                  const detectedLocation = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
                  setLocation(detectedLocation);
                  onLocationDetect(detectedLocation);
                }
              } else {
                throw new Error('Geocoding failed');
              }
            } catch (error) {
              console.error('Reverse geocoding failed:', error);
              // Fallback to coordinates
              const { latitude, longitude } = position.coords;
              const detectedLocation = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
              setLocation(detectedLocation);
              onLocationDetect(detectedLocation);
            } finally {
              setIsDetectingLocation(false);
            }
          },
          (error) => {
            console.error('Location detection failed:', error);
            alert('Unable to detect location. Please enter manually.');
            setIsDetectingLocation(false);
          }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
        setIsDetectingLocation(false);
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    // If no search query or location, refresh the page to show all resources
    if (!searchQuery?.trim() && !location?.trim()) {
      navigate('/resources');
      window.location.reload();
    } else {
      onSearch(searchQuery, location);
    }
  };

  

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Input
            ref={ref}
            type="search"
            placeholder="Search for resources, services, or organizations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pr-12"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
          </div>
        </div>

        {/* Location Input */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Enter your location or zip code"
              value={location}
              onChange={(e) => setLocation(e?.target?.value)}
              className="pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Icon name="MapPin" size={20} color="var(--color-muted-foreground)" />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleLocationDetect}
            loading={isDetectingLocation}
            iconName="Crosshair"
            iconSize={16}
            className="px-4"
            disabled={isDetectingLocation}
          />
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          iconName="Search"
          iconPosition="left"
          iconSize={18}
        >
          Find Resources
        </Button>
      </form>

    
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;