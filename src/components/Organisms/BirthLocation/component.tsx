// Re-export the styled birth location section from NatalChartForm for reuse

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { popularLocations } from '@/lib/services/geocoding';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { Button } from '@/components/ThirdParty/ShadCn/Button';
import { MapPinIcon } from 'lucide-react';


interface BirthLocationSectionProps {
  prefix?: string; // e.g. 'pageFormData.location'
}

const LocationSection: React.FC<BirthLocationSectionProps> = ({ prefix = 'location' }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  // TypeScript workaround for dynamic field names in react-hook-form's watch
  const knowsCoordinates = watch(`${prefix}.knowsCoordinates`);
  
  const handleQuickLocation = (location: typeof popularLocations[number]) => {
    setValue(`${prefix}.city`, location.city);
    setValue(`${prefix}.country`, location.country);
    if (location.region) setValue(`${prefix}.region`, location.region);
  };

  // Helper for error access
  const getError = (field: string) => {
    const fieldError = errors?.[prefix]?.[field as keyof typeof errors[typeof prefix]];
    if (fieldError && typeof fieldError === 'object' && 'message' in fieldError) {
      return (fieldError as { message?: string }).message;
    }
    return undefined;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <MapPinIcon className="w-5 h-5" />
          Location
        </CardTitle>
        <CardDescription>Geographic coordinates for accurate planetary house calculations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">City *</label>
            <input {...register(`${prefix}.city`)} type="text" id="city" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., New York" />
            {getError('city') && <p className="text-sm text-red-600">{getError('city')}</p>}
          </div>
          {/* Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</label>
            <input {...register(`${prefix}.country`)} type="text" id="country" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., United States" defaultValue="United States" />
            {getError('country') && <p className="text-sm text-red-600">{getError('country')}</p>}
          </div>
          {/* Region/Province */}
          <div className="space-y-2">
            <label htmlFor="region" className="text-sm font-medium text-gray-700">Region/Province</label>
            <input {...register(`${prefix}.region`)} type="text" id="region" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., New York" />
          </div>
        </div>
        {/* I know the exact Latitude/Longitude checkbox */}
        <div className="flex items-center space-x-2 mt-2">
          <input type="checkbox" id="knowsCoordinates" {...register(`${prefix}.knowsCoordinates`)} />
          <label htmlFor="knowsCoordinates" className="text-sm text-gray-700">I know the exact Latitude/Longitude</label>
        </div>
        {/* Latitude/Longitude fields, only if knowsCoordinates is checked */}
        {knowsCoordinates && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <label htmlFor="latitude" className="text-sm font-medium text-gray-700">Latitude *</label>
              <input {...register(`${prefix}.latitude`, { valueAsNumber: true })} type="number" step="any" id="latitude" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., 40.7128" />
              {getError('latitude') && <p className="text-sm text-red-600">{getError('latitude')}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="longitude" className="text-sm font-medium text-gray-700">Longitude *</label>
              <input {...register(`${prefix}.longitude`, { valueAsNumber: true })} type="number" step="any" id="longitude" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., -74.0060" />
              {getError('longitude') && <p className="text-sm text-red-600">{getError('longitude')}</p>}
            </div>
          </div>
        )}
        {/* Popular Locations Quick Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quick Select Popular Cities</label>
          <div className="flex flex-wrap gap-2">
            {popularLocations.slice(0, 4).map((location) => (
              <Button key={`${location.city}-${location.country}`} type="button" variant="outline" size="sm" onClick={() => handleQuickLocation(location)} className="text-xs">{location.city}, {location.country}</Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
