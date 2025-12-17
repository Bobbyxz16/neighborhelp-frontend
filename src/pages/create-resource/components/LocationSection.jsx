import React, { useState } from 'react';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import Button from '../../../components/ui/ui-components/Button';
import Icon from '../../../components/ui/AppIcon';

const LocationSection = ({ formData, onChange, errors }) => {
  const [showMap, setShowMap] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState('');

  const regionOptions = [
    { value: 'London', label: 'London' },
    { value: 'South East', label: 'South East' },
    { value: 'South West', label: 'South West' },
    { value: 'East of England', label: 'East of England' },
    { value: 'West Midlands', label: 'West Midlands' },
    { value: 'East Midlands', label: 'East Midlands' },
    { value: 'Yorkshire and the Humber', label: 'Yorkshire and the Humber' },
    { value: 'North East', label: 'North East' },
    { value: 'North West', label: 'North West' },
    { value: 'Scotland', label: 'Scotland' },
    { value: 'Wales', label: 'Wales' },
    { value: 'Northern Ireland', label: 'Northern Ireland' }
  ];

  const serviceAreaOptions = [
    { value: '1', label: '1 mile radius' },
    { value: '5', label: '5 mile radius' },
    { value: '10', label: '10 mile radius' },
    { value: '25', label: '25 mile radius' },
    { value: 'borough', label: 'Borough-wide' },
    { value: 'district', label: 'District-wide' },
    { value: 'county', label: 'County-wide' },
    { value: 'uk', label: 'UK-wide' },
    { value: 'online', label: 'Online/Virtual' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleUseCurrentLocation = () => {
    setLocating(true);
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (!window.isSecureContext && !isLocalhost) {
      console.error('Geolocation requires a secure context (HTTPS).');
      setLocateMsg('Geolocation requires HTTPS (or localhost).');
      setLocating(false);
      return;
    }
    try {
      if (!navigator.geolocation) {
        setLocating(false);
        return;
      }

      const request = () => {
        setLocateMsg('');
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          setShowMap(true);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1${import.meta.env.VITE_APP_CONTACT_EMAIL ? `&email=${encodeURIComponent(import.meta.env.VITE_APP_CONTACT_EMAIL)}` : ''}`);
            if (!res.ok) {
              throw new Error(`Reverse geocoding failed with status ${res.status}`);
            }
            const data = await res.json();
            const addr = data?.address || {};
            const street = [addr.road, addr.house_number].filter(Boolean).join(' ').trim() || addr.residential || '';
            const city = addr.city || addr.town || addr.village || addr.hamlet || '';
            const province = addr.state || addr.county || '';
            const postalCode = addr.postcode || '';
            if (street) onChange('street', street);
            if (city) onChange('city', city);
            if (province) onChange('province', province);
            if (postalCode) onChange('postalCode', postalCode);
            if (addr.country) onChange('country', addr.country);
          } catch (err) {
            console.error('Reverse geocoding failed:', err);
            setLocateMsg(`Reverse geocoding failed: ${err?.message || 'Unexpected error'}`);
          } finally {
            setLocating(false);
          }
        }, (err) => {
          console.error('Geolocation error:', err);
          if (err?.code === 1) setLocateMsg('Location permission denied. Please enable it in your browser settings.');
          else if (err?.code === 2) setLocateMsg('Location unavailable. Try again near a window or check your connection.');
          else if (err?.code === 3) setLocateMsg('Location request timed out. Please try again.');
          else setLocateMsg('Unable to get your location.');
          setLocating(false);
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
      };

      if (navigator.permissions?.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((status) => {
          if (status.state === 'denied') {
            console.error('Geolocation permission denied by the user.');
            setLocateMsg('Location permission is denied. Enable it in browser settings and try again.');
            setLocating(false);
            return;
          }
          request();
        }).catch(() => {
          request();
        });
      } else {
        request();
      }
    } catch (err) {
      console.error('Geolocation failed:', err);
      setLocating(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Location & Service Area</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Specify where your service is located and the area you serve
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Street Address"
            type="text"
            placeholder="123 Main Street"
            value={formData?.street}
            onChange={(e) => handleInputChange('street', e?.target?.value)}
            error={errors?.street}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Town/City"
              type="text"
              placeholder="Town or City"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              error={errors?.city}
              required
            />

            <Select
              label="Region"
              placeholder="Select region"
              options={regionOptions}
              value={formData?.province}
              onChange={(value) => handleInputChange('province', value)}
              error={errors?.province}
              required
              searchable
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Postcode"
              type="text"
              placeholder="SW1A 1AA"
              value={formData?.postalCode}
              onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
              error={errors?.postalCode}
              required
            />

            <Select
              label="Service Area"
              placeholder="Select coverage area"
              options={serviceAreaOptions}
              value={formData?.serviceArea}
              onChange={(value) => handleInputChange('serviceArea', value)}
              error={errors?.serviceArea}
              required
            />
          </div>

          <Input
            label="Venue/Building Name (Optional)"
            type="text"
            placeholder="Community Center, Church Hall, etc."
            value={formData?.venueName}
            onChange={(e) => handleInputChange('venueName', e?.target?.value)}
            description="Helps people find the exact location"
          />

          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                iconName="Navigation"
                iconPosition="left"
                onClick={handleUseCurrentLocation}
                disabled={locating}
              >
                {locating ? 'Locating...' : 'Use Current Location'}
              </Button>
            </div>
            {locateMsg && <p className="text-sm text-red-600">{locateMsg}</p>}
          </div>
        </div>

        <div className="space-y-4">
          {(showMap && coords.lat && coords.lng) && (
            <div className="bg-muted rounded-lg overflow-hidden border border-border">
              <div className="h-64 w-full">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Service Location"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=14&output=embed`}
                  className="border-0"
                />
              </div>
              <div className="p-3 bg-card border-t border-border">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  <span className="text-success">Address verified successfully</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-medium text-accent-foreground mb-2 flex items-center">
              <Icon name="Info" size={16} className="mr-2" />
              Location Guidelines
            </h3>
            <ul className="text-sm text-accent-foreground space-y-1">
              <li>• Provide accurate address for better discoverability</li>
              <li>• Service area helps users understand coverage</li>
              <li>• Venue name assists with navigation</li>
              <li>• Consider accessibility when choosing location</li>
            </ul>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Additional Location Notes
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              placeholder="Parking information, accessibility details, entrance instructions, etc."
              value={formData?.locationNotes}
              onChange={(e) => handleInputChange('locationNotes', e?.target?.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;