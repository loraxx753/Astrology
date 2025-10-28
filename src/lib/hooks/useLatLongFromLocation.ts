import { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

const LAT_LONG_FROM_LOCATION = gql`
  query LatLongFromLocation($city: String!, $country: String!, $region: String) {
    latLongFromLocation(city: $city, country: $country, region: $region) {
      latitude
      longitude
      formattedAddress
      confidence
    }
  }
`;

export function useLatLongFromLocation(city?: string, country?: string, region?: string) {
  const [fetchLatLong, { data, loading, error, called }] = useLazyQuery(LAT_LONG_FROM_LOCATION);

  useEffect(() => {
    if (city && country) {
      fetchLatLong({ variables: { city, country, region } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, country, region]);

  return {
    latLong: data?.latLongFromLocation,
    loading,
    error,
    called,
  };
}
