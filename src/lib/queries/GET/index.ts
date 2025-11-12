import { gql } from '@apollo/client'

export const PLANETARY_POSITIONS_QUERY = gql`
query getPlanetaryPositions($date: String!, $time: String!, $latitude: Float!, $longitude: Float!) {
  planetaryPositions(date: $date, time: $time, latitude: $latitude, longitude: $longitude) {
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

export const HOUSES_QUERY = gql`query HousePositions($date: String!, $time: String!, $latitude: Float!, $longitude: Float!) {
  housePositions(date: $date, time: $time, latitude: $latitude, longitude: $longitude) {
    house
    ascendant
    mc
    armc
    vertex
    equatorialAscendant
    kochCoAscendant
    munkaseyCoAscendant
    munkaseyPolarAscendant
  }
}
`;