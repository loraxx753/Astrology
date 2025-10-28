import { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

const LOCATION_FROM_LATLONG = gql`
  query LocationFromLatLong($latitude: Float!, $longitude: Float!) {
    locationFromLatLong(latitude: $latitude, longitude: $longitude) {
      city
      state
      country
    }
  }
`;

interface LocationResult {
  city?: string;
  state?: string;
  country?: string;
}

export function useReverseGeocode(lat?: number, long?: number) {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [fetchLocation, { data, loading, error, called }] = useLazyQuery(LOCATION_FROM_LATLONG);

  useEffect(() => {
    if (typeof lat === 'number' && typeof long === 'number') {
      fetchLocation({ variables: { latitude: lat, longitude: long } });
    }
  }, [lat, long]); // Remove fetchLocation from deps to avoid infinite loop

  useEffect(() => {
    if (data && data.locationFromLatLong) {
      setLocation(data.locationFromLatLong);
    }
  }, [data]);

  return { location, loading, error, called };
}
