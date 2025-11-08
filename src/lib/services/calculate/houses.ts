import { degToRad, radToDeg } from '../../utils';
import { PLANETARY_ELEMENTS } from '../../data/constants';
import PlanetaryElements from '../../types/PlanetaryElements';
import { getAscendantAndMC } from './astrology';
import { calculateDeclination, calculateLongitude } from '../calculations';
let angles: { ascendant: number; midheaven: number; descendant: number; imumCoeli: number, obliquity: number, lstDegrees: number };

// Calculate single planet position
export function calculatePlanetPosition(
  planetKey: keyof typeof PLANETARY_ELEMENTS
): {
  julianDay: number;
  centuriesFromJ2000: number;
  elements: PlanetaryElements;
  meanAnomaly: number;
  eccentricAnomaly: number;
  trueAnomaly: number;
  heliocentricLongitude: number;
  geocentricLongitude: number;
  zodiacPosition: { sign: string; degree: number; minutes: number; seconds: number };
} {
  // Deprecated: All planetary position calculations are now sourced from HORIZONS. This function is retained for reference only.
  return {
    julianDay: 0,
    centuriesFromJ2000: 0,
    elements: PLANETARY_ELEMENTS[planetKey],
    meanAnomaly: 0,
    eccentricAnomaly: 0,
    trueAnomaly: 0,
    heliocentricLongitude: 0,
    geocentricLongitude: 0,
    zodiacPosition: { sign: '', degree: 0, minutes: 0, seconds: 0 }
  };
}

// House system calculations
interface HouseCusps {
  [key: number]: number; // House number -> Longitude in degrees
}

interface HouseSystemResult {
  ascendant: number;
  midheaven: number;
  descendant: number;
  imumCoeli: number;
  cusps: HouseCusps;
  system: string;
}


// function calculateAngularCusps() {
//     const { ascendant, midheaven, descendant, imumCoeli } = angles;
  
//   // Placeholder for angular house calculations if needed
// }

function calculateIntermediateCusp(lstDeg: number, latitude: number, obliquity: number, fraction: number): number {
    let longitude = lstDeg; // Initial guess for longitude
    let declination;
    let obliqueAscension;
    const latRad = degToRad(latitude); 
    // const oblRad = degToRad(obliquity);

    // Iteration loop (adjust the number of iterations as needed for precision)
    for (let i = 0; i < 5; i++) {
        declination = calculateDeclination(longitude, obliquity);
        const decRad = degToRad(declination);
        
        // Calculate the specific Oblique Ascension for this fraction
        obliqueAscension = lstDeg + fraction * radToDeg(Math.asin(Math.tan(decRad) * Math.tan(latRad)));

        // Convert back to longitude for the next iteration's guess
        longitude = calculateLongitude(obliqueAscension, obliquity);
    }
    return longitude;
}


// Placidus House System
export function calculatePlacidusHouses(
  latitude: number
): HouseCusps {
  const cusps: HouseCusps = {};

  const { ascendant, midheaven, descendant, imumCoeli } = angles;


  // Angular houses (exact)
  cusps[1] = ascendant;
  cusps[4] = imumCoeli; // IC (Imum Coeli)
  cusps[7] = descendant;
  cusps[10] = midheaven; // MC (Medium Coeli)

  // Calculate intermediate cusps using Placidus method
  // latRad and oblRad removed (no longer used)

  const { lstDegrees, obliquity } = angles;

  cusps[11] = calculateIntermediateCusp(lstDegrees, latitude, obliquity, 1/3);
  cusps[12] = calculateIntermediateCusp(lstDegrees, latitude, obliquity, 2/3);
  cusps[2] = calculateIntermediateCusp(lstDegrees + 180, latitude, obliquity, 1/3); // Uses IC time arc
  cusps[3] = calculateIntermediateCusp(lstDegrees + 180, latitude, obliquity, 2/3); // Uses IC time arc
  
  // Houses 5, 6, 8, 9 (opposite cusps)
  cusps[5] = (cusps[11] + 180) % 360;
  cusps[6] = (cusps[12] + 180) % 360;
  cusps[8] = (cusps[2] + 180) % 360;
  cusps[9] = (cusps[3] + 180) % 360;
  
  return cusps;
}

// Equal House System
export function calculateEqualHouses(ascendant: number): HouseCusps {
  const cusps: HouseCusps = {};
  
  for (let house = 1; house <= 12; house++) {
    cusps[house] = (ascendant + (house - 1) * 30) % 360;
  }
  
  return cusps;
}

// Whole Sign House System
export function calculateWholeSignHouses(ascendant: number): HouseCusps {
  const cusps: HouseCusps = {};
  const ascendantSign = Math.floor(ascendant / 30) * 30; // Start of sign containing ascendant
  
  for (let house = 1; house <= 12; house++) {
    cusps[house] = (ascendantSign + (house - 1) * 30) % 360;
  }
  
  return cusps;
}

// Koch House System (simplified)
export function calculateKochHouses(
  ascendant: number,
  midheaven: number,
  // latitude and obliquity parameters removed (no longer used)
): HouseCusps {
  const cusps: HouseCusps = {};
  
  // Angular houses
  cusps[1] = ascendant;
  cusps[4] = (midheaven + 180) % 360;
  cusps[7] = (ascendant + 180) % 360;
  cusps[10] = midheaven;
  
  // Koch method uses a different calculation for intermediate cusps
  // Simplified version - in practice this requires complex spherical trigonometry
  const quadrantSize = ((midheaven - ascendant + 360) % 360) / 3;
  
  cusps[2] = (ascendant + quadrantSize) % 360;
  cusps[3] = (ascendant + 2 * quadrantSize) % 360;
  cusps[11] = (midheaven + quadrantSize) % 360;
  cusps[12] = (midheaven + 2 * quadrantSize) % 360;
  
  // Opposite cusps
  cusps[5] = (cusps[11] + 180) % 360;
  cusps[6] = (cusps[12] + 180) % 360;
  cusps[8] = (cusps[2] + 180) % 360;
  cusps[9] = (cusps[3] + 180) % 360;
  
  return cusps;
}

// Main house calculation function
export function calculateHouseSystem({
  date,
  time,
  latitude,
  longitude,
  system = 'placidus'
}: {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  system?: string;
}): HouseSystemResult {
  
  let cusps: HouseCusps;

  const { ascendant, midheaven, descendant, imumCoeli, obliquity, lstDegrees } = getAscendantAndMC(date, time, latitude, longitude);
  angles = { ascendant, midheaven, descendant, imumCoeli, obliquity, lstDegrees };
  switch (system.toLowerCase()) {
    case 'equal':
      cusps = calculateEqualHouses(ascendant);
      break;
    case 'whole-sign':
    case 'whole sign':
      cusps = calculateWholeSignHouses(ascendant);
      break;
    case 'koch':
      cusps = calculateKochHouses(ascendant, midheaven);
      break;
    case 'placidus':
    default:
      cusps = calculatePlacidusHouses(latitude);
      break;
  }
  
  return {
    ascendant,
    midheaven,
    descendant: (ascendant + 180) % 360,
    imumCoeli: (midheaven + 180) % 360,
    cusps,
    system
  };
}
