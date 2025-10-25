import { useQuery, gql } from '@apollo/client';

export const PLANETARY_POSITIONS_QUERY = gql`
  query PlanetaryPositions($date: String!, $time: String!, $latitude: Float!, $longitude: Float!, $bodies: [String!]!) {
    planetaryPositions(date: $date, time: $time, latitude: $latitude, longitude: $longitude, bodies: $bodies) {
      name
      ra
      dec
      longitude
      latitude
      dateStr
    }
  }
`;

export interface CelestialPositionInput {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  bodies: string[];
}

export function useCelestialPositions(input?: CelestialPositionInput) {
  const shouldSkip = !input || !input.date || !input.time || input.latitude === undefined || input.longitude === undefined || !input.bodies?.length;
  const { data, loading, error } = useQuery(PLANETARY_POSITIONS_QUERY, {
    variables: input as CelestialPositionInput,
    skip: shouldSkip,
  });

  return {
    positions: data?.planetaryPositions ?? [],
    loading,
    error,
  };
}
