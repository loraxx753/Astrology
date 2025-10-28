import React, { useState } from 'react';

export interface LocationInputProps {
  onResolved: (coords: { latitude: number; longitude: number }) => void;
  label?: string;
  initialLocation?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ onResolved, label = 'Location (city, country or lat/long)'}) => {
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [error, setError] = useState('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (manualLat && manualLng) {
      onResolved({ latitude: parseFloat(manualLat), longitude: parseFloat(manualLng) });
      return;
    } else {
      setError('Please enter both latitude and longitude.');
    }
  };

  return (
    <form onSubmit={handleResolve} className="space-y-2">
      <label className="block font-semibold">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={manualLat}
          onChange={e => setManualLat(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Latitude"
        />
        <input
          type="number"
          value={manualLng}
          onChange={e => setManualLng(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Longitude"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Resolve Location
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default LocationInput;
