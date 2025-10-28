import { gql } from '@apollo/client'

export const PLANETARY_POSITIONS_QUERY = gql`
query getPlanetaryPositions($date: String!, $time: String!, $latitude: Float!, $longitude: Float!, $bodies: [String!]!) {
  planetaryPositions(date: $date, time: $time, latitude: $latitude, longitude: $longitude, bodies: $bodies) {
    name
    longitude
    latitude
    ra
    dec
    dateStr
    northNodeLongitude
    southNodeLongitude
  }
}
`;