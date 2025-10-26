import React, { useState } from 'react';
import { geocodeLocation } from '@/lib/services/geocoding';

export interface LocationInputProps {
  onResolved: (coords: { latitude: number; longitude: number }) => void;
  label?: string;
  initialLocation?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ onResolved, label = 'Location (city, country or lat/long)', initialLocation = '' }) => {
  const [location, setLocation] = useState(initialLocation);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (location) {
      try {
        const result = await geocodeLocation({ query: location });
        if (result && result.latitude && result.longitude) {
          onResolved({ latitude: result.latitude, longitude: result.longitude });
          setIsLoading(false);
          return;
        } else {
          setError('Could not resolve location.');
        }
      } catch (err) {
        setError('Could not resolve location.');
      }
    } else if (manualLat && manualLng) {
      onResolved({ latitude: parseFloat(manualLat), longitude: parseFloat(manualLng) });
      setIsLoading(false);
      return;
    } else {
      setError('Please enter a location or latitude/longitude.');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleResolve} className="space-y-2">
      <label className="block font-semibold">{label}</label>
      <input
        type="text"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="border p-2 rounded w-full"
        placeholder="e.g. Paris, France or 48.8566,2.3522"
      />
      <div className="flex gap-2">
        <input
          type="number"
          value={manualLat}
          onChange={e => setManualLat(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Latitude (optional)"
        />
        <input
          type="number"
          value={manualLng}
          onChange={e => setManualLng(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Longitude (optional)"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isLoading}>
        {isLoading ? 'Resolving...' : 'Resolve Location'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default LocationInput;
