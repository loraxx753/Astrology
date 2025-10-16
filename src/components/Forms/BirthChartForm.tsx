import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  birthChartSchema, 
  BirthChartData, 
  defaultBirthChartValues, 
  commonTimezones,
  houseSystemDescriptions
} from '@/lib/schemas/birthChart';
import { 
  geocodeLocation, 
  createDebouncedGeocoder, 
  reverseGeocode,
  createDebouncedReverseGeocoder,
  getTimezoneFromCoordinates,
  popularLocations,
  GeocodeRequest,
  PopularLocation
} from '@/lib/services/geocoding';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { Button } from '@/components/ThirdParty/ShadCn/Button';
import { Badge } from '@/components/ThirdParty/ShadCn/Badge';
import { StarIcon, MapPinIcon, ClockIcon, UserIcon, SearchIcon, LoaderIcon } from 'lucide-react';

interface BirthChartFormProps {
  onSubmit: (data: BirthChartData) => void;
  isLoading?: boolean;
}

const BirthChartForm: React.FC<BirthChartFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<BirthChartData>({
    resolver: zodResolver(birthChartSchema),
    defaultValues: defaultBirthChartValues,
    mode: 'onChange'
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [lastGeocodedLocation, setLastGeocodedLocation] = useState<string>('');
  const [lastReverseGeocodedCoords, setLastReverseGeocodedCoords] = useState<string>('');

  const timeKnown = watch('timeKnown');
  const houseSystem = watch('houseSystem');
  const city = watch('birthLocation.city');
  const country = watch('birthLocation.country');
  const state = watch('birthLocation.state');
  const latitude = watch('birthLocation.latitude');
  const longitude = watch('birthLocation.longitude');

  // Handle timeKnown checkbox - set default time when unchecked
  useEffect(() => {
    if (!timeKnown) {
      setValue('birthTime', '12:00', { shouldValidate: true });
    }
  }, [timeKnown, setValue]);



  // Create debounced geocoder and reverse geocoder
  const debouncedGeocoder = useCallback(
    () => createDebouncedGeocoder(1500), // Wait 1.5 seconds after user stops typing
    []
  );

  const debouncedReverseGeocoder = useCallback(
    () => createDebouncedReverseGeocoder(1500), // Wait 1.5 seconds after user stops typing
    []
  );

  // Auto-geocode when city/country changes
  useEffect(() => {
    const performGeocoding = async () => {
      if (!city?.trim() || !country?.trim()) {
        return;
      }

      const locationString = `${city}, ${state || ''}, ${country}`.replace(/,\s*,/, ',');
      
      // Don't geocode if this is the same location we just processed
      if (locationString === lastGeocodedLocation) {
        return;
      }

      setIsGeocoding(true);
      setGeocodeError(null);

      try {
        const geocoder = debouncedGeocoder();
        const result = await geocoder({
          city: city.trim(),
          country: country.trim(),
          state: state?.trim(),
        });

        // Update coordinates and timezone
        setValue('birthLocation.latitude', result.latitude, { shouldValidate: true });
        setValue('birthLocation.longitude', result.longitude, { shouldValidate: true });
        
        // Auto-suggest timezone based on coordinates
        const suggestedTimezone = getTimezoneFromCoordinates(result.latitude, result.longitude);
        if (!watch('birthLocation.timezone')) {
          setValue('birthLocation.timezone', suggestedTimezone);
        }

        setLastGeocodedLocation(locationString);
        console.log('Geocoding successful:', result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to find location';
        setGeocodeError(errorMessage);
        console.warn('Geocoding failed:', error);
      } finally {
        setIsGeocoding(false);
      }
    };

    performGeocoding();
  }, [city, country, state, setValue, debouncedGeocoder, lastGeocodedLocation, watch]);

  // Reverse geocode when coordinates are manually entered
  useEffect(() => {
    const performReverseGeocoding = async () => {
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return;
      }

      // Check if coordinates are valid
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return;
      }

      const coordsString = `${latitude},${longitude}`;
      
      // Don't reverse geocode if these are the same coordinates we just processed
      if (coordsString === lastReverseGeocodedCoords) {
        return;
      }

      setIsReverseGeocoding(true);
      // Clear any existing geocoding errors since we have valid coordinates
      setGeocodeError(null);

      try {
        const reverseGeocoder = debouncedReverseGeocoder();
        const result = await reverseGeocoder(latitude, longitude);

        // Only update location fields if they're empty or if coordinates take precedence
        const currentCity = watch('birthLocation.city');
        const currentCountry = watch('birthLocation.country');
        
        if (!currentCity && result.city) {
          setValue('birthLocation.city', result.city, { shouldValidate: true });
        }
        if (!currentCountry && result.country) {
          setValue('birthLocation.country', result.country, { shouldValidate: true });
        }
        if (result.state) {
          setValue('birthLocation.state', result.state, { shouldValidate: true });
        }

        // Update timezone based on coordinates
        const timezone = getTimezoneFromCoordinates(latitude, longitude);
        setValue('birthLocation.timezone', timezone, { shouldValidate: true });

        setLastReverseGeocodedCoords(coordsString);
        console.log('Reverse geocoding successful:', result);
      } catch (error) {
        // Suppress reverse geocoding errors - coordinates are still valid
        // Just update timezone based on coordinates and continue
        const timezone = getTimezoneFromCoordinates(latitude, longitude);
        setValue('birthLocation.timezone', timezone, { shouldValidate: true });
        
        setLastReverseGeocodedCoords(coordsString);
        console.warn('Reverse geocoding failed, but coordinates are still valid:', error);
      } finally {
        setIsReverseGeocoding(false);
      }
    };

    performReverseGeocoding();
  }, [latitude, longitude, setValue, debouncedReverseGeocoder, lastReverseGeocodedCoords, watch, setIsReverseGeocoding, setGeocodeError]);

  const handleQuickLocation = (location: PopularLocation) => {
    setValue('birthLocation.city', location.city);
    setValue('birthLocation.country', location.country);
    if (location.state) {
      setValue('birthLocation.state', location.state);
    }
    setValue('birthLocation.latitude', location.lat, { shouldValidate: true });
    setValue('birthLocation.longitude', location.lng, { shouldValidate: true });
    
    const timezone = getTimezoneFromCoordinates(location.lat, location.lng);
    setValue('birthLocation.timezone', timezone);
  };

  const handleFormSubmit = (data: BirthChartData) => {
    console.log('Birth Chart Data:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <UserIcon className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Basic details for your astrological reading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender (Optional)
              </label>
              <select
                {...register('gender')}
                id="gender"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Birth Date & Time Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <ClockIcon className="w-5 h-5" />
            Birth Date & Time
          </CardTitle>
          <CardDescription>
            Precise timing is crucial for accurate astrological calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Birth Date */}
            <div className="space-y-2">
              <label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                Birth Date *
              </label>
              <input
                {...register('birthDate')}
                type="date"
                id="birthDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.birthDate && (
                <p className="text-sm text-red-600">{errors.birthDate.message}</p>
              )}
            </div>

            {/* Birth Time */}
            <div className="space-y-2">
              <label htmlFor="birthTime" className="text-sm font-medium text-gray-700">
                Birth Time *
              </label>
              <input
                {...register('birthTime')}
                type="time"
                id="birthTime"
                disabled={!timeKnown}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.birthTime && (
                <p className="text-sm text-red-600">{errors.birthTime.message}</p>
              )}
            </div>
          </div>

          {/* Time Known Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              {...register('timeKnown')}
              type="checkbox"
              id="timeKnown"
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="timeKnown" className="text-sm text-gray-700">
              I know my exact birth time
            </label>
          </div>

          {!timeKnown && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Without an exact birth time, we'll use 12:00 PM (noon) as default. 
                This will affect the accuracy of house placements and the Ascendant/Midheaven calculations.
              </p>
            </div>
          )}

          {/* Timezone - Critical for interpreting birth time correctly */}
          <div className="space-y-2">
            <label htmlFor="birthTimezone" className="text-sm font-medium text-gray-700">
              Birth Time Timezone *
            </label>
            <select
              {...register('birthLocation.timezone')}
              id="birthTimezone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select timezone</option>
              {commonTimezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.birthLocation?.timezone && (
              <p className="text-sm text-red-600">{errors.birthLocation.timezone.message}</p>
            )}
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Important:</strong> This timezone determines how your birth time is interpreted. 
                If you were born in Florida, use Eastern Time even if you enter coordinates manually.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <MapPinIcon className="w-5 h-5" />
            Birth Location
          </CardTitle>
          <CardDescription>
            Geographic coordinates for accurate planetary house calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                {...register('birthLocation.city')}
                type="text"
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., New York"
              />
              {errors.birthLocation?.city && (
                <p className="text-sm text-red-600">{errors.birthLocation.city.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                {...register('birthLocation.country')}
                type="text"
                id="country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., United States"
              />
              {errors.birthLocation?.country && (
                <p className="text-sm text-red-600">{errors.birthLocation.country.message}</p>
              )}
            </div>

            {/* State/Province */}
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-gray-700">
                State/Province
              </label>
              <input
                {...register('birthLocation.state')}
                type="text"
                id="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., New York"
              />
            </div>

          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                Latitude * <span className="text-xs text-gray-500">(-90 to 90)</span>
              </label>
              <input
                {...register('birthLocation.latitude', { valueAsNumber: true })}
                type="number"
                step="any"
                id="latitude"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 40.7128"
              />
              {errors.birthLocation?.latitude && (
                <p className="text-sm text-red-600">{errors.birthLocation.latitude.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                Longitude * <span className="text-xs text-gray-500">(-180 to 180)</span>
              </label>
              <input
                {...register('birthLocation.longitude', { valueAsNumber: true })}
                type="number"
                step="any"
                id="longitude"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., -74.0060"
              />
              {errors.birthLocation?.longitude && (
                <p className="text-sm text-red-600">{errors.birthLocation.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Geocoding Status */}
          {isGeocoding && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <LoaderIcon className="w-4 h-4 animate-spin text-blue-600" />
              <p className="text-sm text-blue-800">
                Looking up coordinates for your location...
              </p>
            </div>
          )}

          {geocodeError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Geocoding Error:</strong> {geocodeError}
                <br />
                <span className="text-red-600">Please enter coordinates manually or try a different city name.</span>
              </p>
            </div>
          )}

          {!isGeocoding && !geocodeError && city && country && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <SearchIcon className="w-4 h-4 inline mr-1" />
                <strong>Coordinates auto-populated</strong> for {city}, {country}
              </p>
            </div>
          )}

          {/* Popular Locations Quick Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Quick Select Popular Cities
            </label>
            <div className="flex flex-wrap gap-2">
              {popularLocations.slice(0, 4).map((location) => (
                <Button
                  key={`${location.city}-${location.country}`}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLocation(location)}
                  className="text-xs"
                >
                  {location.city}, {location.country}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Automatic Coordinates:</strong> We'll automatically look up latitude/longitude based on your city and country. 
              You can manually adjust them if needed for more precision.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chart Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <StarIcon className="w-5 h-5" />
            Chart Calculation Preferences
          </CardTitle>
          <CardDescription>
            Advanced settings for astrological calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* House System */}
          <div className="space-y-2">
            <label htmlFor="houseSystem" className="text-sm font-medium text-gray-700">
              House System
            </label>
            <select
              {...register('houseSystem')}
              id="houseSystem"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.entries(houseSystemDescriptions).map(([system]) => (
                <option key={system} value={system}>
                  {system.charAt(0).toUpperCase() + system.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            
            {houseSystem && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>{houseSystem.charAt(0).toUpperCase() + houseSystem.slice(1).replace('-', ' ')}:</strong> {' '}
                  {houseSystemDescriptions[houseSystem as keyof typeof houseSystemDescriptions]}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Any additional context or questions about your birth chart..."
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-gray-600">
              <Badge variant="outline" className="mr-2">
                {isValid ? '✓' : '✗'}
              </Badge>
              Form validation: {isValid ? 'Complete' : 'Incomplete'}
            </div>
            
            <Button
              type="submit"
              size="lg"
              disabled={!isValid || isLoading}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <StarIcon className="w-4 h-4 mr-2" />
                  Generate Birth Chart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default BirthChartForm;