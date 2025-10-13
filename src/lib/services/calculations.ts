// Julian Day Number calculation (fundamental to astronomical calculations)
export function calculateJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // Convert time to decimal hours
  const decimalHours = hour + minute / 60 + second / 3600;
  
  // Julian Day calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
             Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add decimal hours (convert to days)
  return jd + (decimalHours - 12) / 24;
}

// Calculate centuries since J2000.0 epoch
export function calculateCenturiesSinceJ2000(julianDay: number): number {
  const J2000 = 2451545.0; // Julian Day for January 1, 2000, 12:00 TT
  return (julianDay - J2000) / 36525;
}

// Sun's mean longitude (geometric mean longitude referred to the mean equinox of the date)
export function calculateSunMeanLongitude(T: number): number {
  // L0 in degrees (Meeus, Astronomical Algorithms, 2nd Edition, Chapter 25)
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  
  // Normalize to 0-360 degrees
  return ((L0 % 360) + 360) % 360;
}

// Sun's mean anomaly
export function calculateSunMeanAnomaly(T: number): number {
  // M in degrees
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  
  // Normalize to 0-360 degrees
  return ((M % 360) + 360) % 360;
}

// Earth's orbital eccentricity
export function calculateEccentricity(T: number): number {
  return 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
}

// Sun's equation of center (difference between true and mean anomaly)
export function calculateSunEquationOfCenter(M: number, T: number): number {
  const Mrad = M * Math.PI / 180; // Convert to radians
  
  // C in degrees (series expansion)
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  
  return C;
}

// Sun's true longitude
export function calculateSunTrueLongitude(L0: number, C: number): number {
  const trueLongitude = L0 + C;
  return ((trueLongitude % 360) + 360) % 360;
}

// Convert ecliptic longitude to zodiac sign and degree
export function eclipticToZodiac(longitude: number): { sign: string; degree: number; minutes: number; seconds: number } {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  // Normalize longitude to 0-360
  const normalizedLong = ((longitude % 360) + 360) % 360;
  
  // Each sign is 30 degrees
  const signIndex = Math.floor(normalizedLong / 30);
  const degreeInSign = normalizedLong % 30;
  
  // Convert decimal degrees to degrees, minutes, seconds
  const degrees = Math.floor(degreeInSign);
  const minutesDecimal = (degreeInSign - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.floor((minutesDecimal - minutes) * 60);
  
  return {
    sign: signs[signIndex],
    degree: degrees,
    minutes: minutes,
    seconds: seconds
  };
}

// Calculate Sun position for given date and coordinates
export function calculateSunPosition(
  date: Date,
  _latitude?: number, // Marked as unused with underscore prefix
  _longitude?: number // Marked as unused with underscore prefix
): {
  julianDay: number;
  centuriesFromJ2000: number;
  meanLongitude: number;
  meanAnomaly: number;
  eccentricity: number;
  equationOfCenter: number;
  trueLongitude: number;
  zodiacPosition: {
    sign: string;
    degree: number;
    minutes: number;
    seconds: number;
  };
} {
  const jd = calculateJulianDay(date);
  const T = calculateCenturiesSinceJ2000(jd);
  const L0 = calculateSunMeanLongitude(T);
  const M = calculateSunMeanAnomaly(T);
  const e = calculateEccentricity(T);
  const C = calculateSunEquationOfCenter(M, T);
  const trueLong = calculateSunTrueLongitude(L0, C);
  const zodiac = eclipticToZodiac(trueLong);

  return {
    julianDay: jd,
    centuriesFromJ2000: T,
    meanLongitude: L0,
    meanAnomaly: M,
    eccentricity: e,
    equationOfCenter: C,
    trueLongitude: trueLong,
    zodiacPosition: zodiac
  };
}

// Moon's mean longitude
export function calculateMoonMeanLongitude(T: number): number {
  // L' in degrees (Meeus, Chapter 47)
  const L_prime = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  
  // Normalize to 0-360 degrees
  return ((L_prime % 360) + 360) % 360;
}

// Moon's mean elongation from the Sun
export function calculateMoonMeanElongation(T: number): number {
  // D in degrees
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;
  
  // Normalize to 0-360 degrees
  return ((D % 360) + 360) % 360;
}

// Sun's mean anomaly (for Moon calculations)
export function calculateSunMeanAnomalyForMoon(T: number): number {
  // M in degrees
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000;
  
  // Normalize to 0-360 degrees
  return ((M % 360) + 360) % 360;
}

// Moon's mean anomaly
export function calculateMoonMeanAnomaly(T: number): number {
  // M' in degrees
  const M_prime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000;
  
  // Normalize to 0-360 degrees
  return ((M_prime % 360) + 360) % 360;
}

// Moon's argument of latitude
export function calculateMoonArgumentOfLatitude(T: number): number {
  // F in degrees
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000;
  
  // Normalize to 0-360 degrees
  return ((F % 360) + 360) % 360;
}

// Calculate Moon's longitude correction (simplified main terms)
export function calculateMoonLongitudeCorrection(D: number, M: number, M_prime: number, F: number, _T: number): number {
  // Convert to radians for trigonometric functions
  const Drad = D * Math.PI / 180;
  const Mrad = M * Math.PI / 180;
  const M_prime_rad = M_prime * Math.PI / 180;
  const Frad = F * Math.PI / 180;
  
  // Main periodic terms (Meeus Table 47.A - simplified version with largest terms)
  let correction = 0;
  
  // Most significant terms (there are 60+ terms in the full theory)
  correction += 6.288774 * Math.sin(M_prime_rad);
  correction += 1.274027 * Math.sin(2 * Drad - M_prime_rad);
  correction += 0.658314 * Math.sin(2 * Drad);
  correction += 0.213618 * Math.sin(2 * M_prime_rad);
  correction -= 0.185116 * Math.sin(Mrad);
  correction -= 0.114332 * Math.sin(2 * Frad);
  correction += 0.058793 * Math.sin(2 * (Drad - M_prime_rad));
  correction += 0.057066 * Math.sin(2 * Drad - Mrad - M_prime_rad);
  correction += 0.053322 * Math.sin(2 * Drad + M_prime_rad);
  correction += 0.045758 * Math.sin(2 * Drad - Mrad);
  correction -= 0.040923 * Math.sin(Mrad - M_prime_rad);
  correction -= 0.034720 * Math.sin(Drad);
  correction -= 0.030383 * Math.sin(Mrad + M_prime_rad);
  correction += 0.015327 * Math.sin(2 * (Drad - Frad));
  correction -= 0.012528 * Math.sin(2 * Frad + M_prime_rad);
  
  return correction;
}

// Calculate Moon's true longitude
export function calculateMoonTrueLongitude(L_prime: number, correction: number): number {
  const trueLongitude = L_prime + correction;
  return ((trueLongitude % 360) + 360) % 360;
}

// Calculate Moon's phase (0 = New Moon, 0.5 = Full Moon)
export function calculateMoonPhase(moonLongitude: number, sunLongitude: number): {
  phase: number;
  phaseName: string;
  phaseDescription: string;
  illumination: number;
} {
  // Calculate the elongation (angular separation)
  let elongation = moonLongitude - sunLongitude;
  if (elongation < 0) elongation += 360;
  if (elongation > 180) elongation -= 360;
  
  // Phase as a fraction (0 = New, 0.5 = Full)
  const phase = (1 - Math.cos(elongation * Math.PI / 180)) / 2;
  
  // Illumination percentage
  const illumination = phase * 100;
  
  // Determine phase name
  let phaseName: string;
  let phaseDescription: string;
  
  const absElongation = Math.abs(elongation);
  
  if (absElongation < 7.5) {
    phaseName = "New Moon";
    phaseDescription = "Moon is between Earth and Sun, invisible from Earth";
  } else if (absElongation < 82.5) {
    phaseName = elongation > 0 ? "Waxing Crescent" : "Waning Crescent";
    phaseDescription = elongation > 0 ? "Moon is growing larger each night" : "Moon is shrinking each night";
  } else if (absElongation < 97.5) {
    phaseName = elongation > 0 ? "First Quarter" : "Last Quarter";
    phaseDescription = elongation > 0 ? "Right half of Moon is illuminated" : "Left half of Moon is illuminated";
  } else if (absElongation < 172.5) {
    phaseName = elongation > 0 ? "Waxing Gibbous" : "Waning Gibbous";
    phaseDescription = elongation > 0 ? "Moon is almost full, still growing" : "Moon is past full, shrinking";
  } else {
    phaseName = "Full Moon";
    phaseDescription = "Earth is between Moon and Sun, Moon is fully illuminated";
  }
  
  return {
    phase,
    phaseName,
    phaseDescription,
    illumination
  };
}

// Calculate Moon position for given date
export function calculateMoonPosition(
  date: Date,
  _latitude?: number,
  _longitude?: number
): {
  julianDay: number;
  centuriesFromJ2000: number;
  meanLongitude: number;
  meanElongation: number;
  sunMeanAnomaly: number;
  moonMeanAnomaly: number;
  argumentOfLatitude: number;
  longitudeCorrection: number;
  trueLongitude: number;
  zodiacPosition: {
    sign: string;
    degree: number;
    minutes: number;
    seconds: number;
  };
  phase: {
    phase: number;
    phaseName: string;
    phaseDescription: string;
    illumination: number;
  };
} {
  const jd = calculateJulianDay(date);
  const T = calculateCenturiesSinceJ2000(jd);
  
  // Calculate fundamental arguments
  const L_prime = calculateMoonMeanLongitude(T);
  const D = calculateMoonMeanElongation(T);
  const M = calculateSunMeanAnomalyForMoon(T);
  const M_prime = calculateMoonMeanAnomaly(T);
  const F = calculateMoonArgumentOfLatitude(T);
  
  // Calculate corrections
  const correction = calculateMoonLongitudeCorrection(D, M, M_prime, F, T);
  const trueLong = calculateMoonTrueLongitude(L_prime, correction);
  const zodiac = eclipticToZodiac(trueLong);
  
  // Calculate Sun position for phase calculation
  const sunPos = calculateSunPosition(date);
  const phase = calculateMoonPhase(trueLong, sunPos.trueLongitude);
  
  return {
    julianDay: jd,
    centuriesFromJ2000: T,
    meanLongitude: L_prime,
    meanElongation: D,
    sunMeanAnomaly: M,
    moonMeanAnomaly: M_prime,
    argumentOfLatitude: F,
    longitudeCorrection: correction,
    trueLongitude: trueLong,
    zodiacPosition: zodiac,
    phase
  };
}

// Planetary orbital elements (simplified Kepler elements for J2000.0)
interface PlanetaryElements {
  name: string;
  symbol: string;
  emoji: string;
  // Mean elements for J2000.0
  a: number;        // Semi-major axis (AU)
  e: number;        // Eccentricity
  I: number;        // Inclination (degrees)
  L: number;        // Mean longitude (degrees)
  longPeri: number; // Longitude of perihelion (degrees)
  longNode: number; // Longitude of ascending node (degrees)
  // Rates of change per century
  aDot: number;
  eDot: number;
  IDot: number;
  LDot: number;
  longPeriDot: number;
  longNodeDot: number;
}

const PLANETARY_ELEMENTS: Record<string, PlanetaryElements> = {
  earth: {
    name: 'Earth',
    symbol: '🜨',
    emoji: '🌍',
    a: 1.00000261,      e: 0.01671123,      I: -0.00001531,
    L: 100.46457166,    longPeri: 102.93768193,   longNode: 0.0,
    aDot: 0.00000562,   eDot: -0.00004392,  IDot: -0.01294668,
    LDot: 35999.37244981, longPeriDot: 0.32327364, longNodeDot: 0.0
  },
  mercury: {
    name: 'Mercury',
    symbol: '☿',
    emoji: '☿️',
    a: 0.38709927,      e: 0.20563593,      I: 7.00497902,
    L: 252.25032350,    longPeri: 77.45779628,    longNode: 48.33076593,
    aDot: 0.00000037,   eDot: 0.00001906,   IDot: -0.00594749,
    LDot: 149472.67411175, longPeriDot: 0.16047689, longNodeDot: -0.12534081
  },
  venus: {
    name: 'Venus',
    symbol: '♀',
    emoji: '♀️',
    a: 0.72333566,      e: 0.00677672,      I: 3.39467605,
    L: 181.97909950,    longPeri: 131.60246718,   longNode: 76.67984255,
    aDot: 0.00000390,   eDot: -0.00004107,  IDot: -0.00078890,
    LDot: 58517.81538729, longPeriDot: 0.00268329, longNodeDot: -0.27769418
  },
  mars: {
    name: 'Mars',
    symbol: '♂',
    emoji: '♂️',
    a: 1.52371034,      e: 0.09339410,      I: 1.84969142,
    L: -4.55343205,     longPeri: -23.94362959,   longNode: 49.55953891,
    aDot: 0.00001847,   eDot: 0.00007882,   IDot: -0.00813131,
    LDot: 19140.30268499, longPeriDot: 0.44441088, longNodeDot: -0.29257343
  },
  jupiter: {
    name: 'Jupiter',
    symbol: '♃',
    emoji: '♃️',
    a: 5.20288700,      e: 0.04838624,      I: 1.30439695,
    L: 34.39644051,     longPeri: 14.72847983,    longNode: 100.47390909,
    aDot: -0.00011607,  eDot: -0.00013253,  IDot: -0.00183714,
    LDot: 3034.74612775, longPeriDot: 0.21252668, longNodeDot: 0.20469106
  },
  saturn: {
    name: 'Saturn',
    symbol: '♄',
    emoji: '♄️',
    a: 9.53667594,      e: 0.05386179,      I: 2.48599187,
    L: 49.95424423,     longPeri: 92.59887831,    longNode: 113.66242448,
    aDot: -0.00125060,  eDot: -0.00050991,  IDot: 0.00193609,
    LDot: 1222.49362201, longPeriDot: -0.41897216, longNodeDot: -0.28867794
  }
};

// Calculate planetary orbital elements for given time
function calculatePlanetaryElements(planet: PlanetaryElements, T: number): PlanetaryElements {
  return {
    ...planet,
    a: planet.a + planet.aDot * T,
    e: planet.e + planet.eDot * T,
    I: planet.I + planet.IDot * T,
    L: planet.L + planet.LDot * T,
    longPeri: planet.longPeri + planet.longPeriDot * T,
    longNode: planet.longNode + planet.longNodeDot * T
  };
}

// Calculate mean anomaly for planet
function calculatePlanetaryMeanAnomaly(elements: PlanetaryElements): number {
  const M = elements.L - elements.longPeri;
  return ((M % 360) + 360) % 360;
}

// Solve Kepler's equation (simplified iterative method)
function solveKeplerEquation(M: number, e: number): number {
  const Mrad = M * Math.PI / 180;
  let E = Mrad; // Initial guess
  
  // Newton-Raphson iteration (simplified for small eccentricities)
  for (let i = 0; i < 10; i++) {
    const deltaE = (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));
    E -= deltaE;
    if (Math.abs(deltaE) < 1e-10) break;
  }
  
  return E * 180 / Math.PI; // Convert back to degrees
}

// Calculate true anomaly from eccentric anomaly
function calculateTrueAnomaly(E: number, e: number): number {
  const Erad = E * Math.PI / 180;
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(Erad / 2),
    Math.sqrt(1 - e) * Math.cos(Erad / 2)
  );
  return ((nu * 180 / Math.PI) % 360 + 360) % 360;
}

// Calculate heliocentric longitude
function calculateHeliocentricLongitude(elements: PlanetaryElements, nu: number): number {
  const longitude = nu + elements.longPeri;
  return ((longitude % 360) + 360) % 360;
}

// Calculate heliocentric rectangular coordinates
function calculateHeliocentricRectangular(
  elements: PlanetaryElements, 
  nu: number
): { x: number; y: number; z: number } {
  const E = solveKeplerEquation(calculatePlanetaryMeanAnomaly(elements), elements.e);
  const Erad = E * Math.PI / 180;
  const nuRad = nu * Math.PI / 180;
  const IRadad = elements.I * Math.PI / 180;
  const longPeriRad = elements.longPeri * Math.PI / 180;
  const longNodeRad = elements.longNode * Math.PI / 180;
  
  // Distance from Sun
  const r = elements.a * (1 - elements.e * Math.cos(Erad));
  
  // Position in orbital plane
  const xOrb = r * Math.cos(nuRad);
  const yOrb = r * Math.sin(nuRad);
  
  // Rotate to ecliptic plane
  const cosI = Math.cos(IRadad);
  const sinI = Math.sin(IRadad);
  const cosNode = Math.cos(longNodeRad);
  const sinNode = Math.sin(longNodeRad);
  const cosPeri = Math.cos(longPeriRad - longNodeRad);
  const sinPeri = Math.sin(longPeriRad - longNodeRad);
  
  const x = (cosNode * cosPeri - sinNode * sinPeri * cosI) * xOrb + 
            (-cosNode * sinPeri - sinNode * cosPeri * cosI) * yOrb;
  const y = (sinNode * cosPeri + cosNode * sinPeri * cosI) * xOrb + 
            (-sinNode * sinPeri + cosNode * cosPeri * cosI) * yOrb;
  const z = sinI * sinPeri * xOrb + sinI * cosPeri * yOrb;
  
  return { x, y, z };
}

// Convert geocentric rectangular to longitude
function rectangularToLongitude(x: number, y: number): number {
  const longitude = Math.atan2(y, x) * 180 / Math.PI;
  return ((longitude % 360) + 360) % 360;
}

// Calculate single planet position
export function calculatePlanetPosition(
  planetKey: keyof typeof PLANETARY_ELEMENTS,
  date: Date
): {
  julianDay: number;
  centuriesFromJ2000: number;
  elements: PlanetaryElements;
  meanAnomaly: number;
  eccentricAnomaly: number;
  trueAnomaly: number;
  heliocentricLongitude: number;
  geocentricLongitude: number;
  zodiacPosition: {
    sign: string;
    degree: number;
    minutes: number;
    seconds: number;
  };
} {
  const jd = calculateJulianDay(date);
  const T = calculateCenturiesSinceJ2000(jd);
  
  // Calculate planet position
  const baseElements = PLANETARY_ELEMENTS[planetKey];
  const elements = calculatePlanetaryElements(baseElements, T);
  
  const M = calculatePlanetaryMeanAnomaly(elements);
  const E = solveKeplerEquation(M, elements.e);
  const nu = calculateTrueAnomaly(E, elements.e);
  const helioLong = calculateHeliocentricLongitude(elements, nu);
  
  // Calculate Earth position for geocentric correction
  const earthElements = calculatePlanetaryElements(PLANETARY_ELEMENTS.earth, T);
  const earthM = calculatePlanetaryMeanAnomaly(earthElements);
  const earthE = solveKeplerEquation(earthM, earthElements.e);
  const earthNu = calculateTrueAnomaly(earthE, earthElements.e);
  
  // Get heliocentric rectangular coordinates
  const planetCoords = calculateHeliocentricRectangular(elements, nu);
  const earthCoords = calculateHeliocentricRectangular(earthElements, earthNu);
  
  // Calculate geocentric rectangular coordinates (planet as seen from Earth)
  const geocentricX = planetCoords.x - earthCoords.x;
  const geocentricY = planetCoords.y - earthCoords.y;
  
  // Convert to geocentric longitude
  const geocentricLong = rectangularToLongitude(geocentricX, geocentricY);
  
  const zodiac = eclipticToZodiac(geocentricLong);
  
  return {
    julianDay: jd,
    centuriesFromJ2000: T,
    elements,
    meanAnomaly: M,
    eccentricAnomaly: E,
    trueAnomaly: nu,
    heliocentricLongitude: helioLong,
    geocentricLongitude: geocentricLong,
    zodiacPosition: zodiac
  };
}

// Calculate all planetary positions
export function calculateAllPlanetPositions(date: Date): Record<string, ReturnType<typeof calculatePlanetPosition>> {
  const planets: (keyof typeof PLANETARY_ELEMENTS)[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  
  const positions: Record<string, ReturnType<typeof calculatePlanetPosition>> = {};
  
  for (const planet of planets) {
    positions[planet] = calculatePlanetPosition(planet, date);
  }
  
  return positions;
}

// Generate calculation steps for a specific planet
export function getPlanetPositionSteps(
  planetKey: keyof typeof PLANETARY_ELEMENTS,
  date: Date
): CalculationStep[] {
  const planetPos = calculatePlanetPosition(planetKey, date);
  const planet = planetPos.elements;
  
  return [
    {
      id: `${planetKey}-orbital-elements`,
      title: 'Calculate Updated Orbital Elements',
      description: `Update ${planet.name}'s orbital elements for the current epoch using rates of change from J2000.0.`,
      formula: 'a = a_0 + \\dot{a} \\cdot T, \\quad e = e_0 + \\dot{e} \\cdot T, \\quad etc.',
      calculation: `Apply century-based corrections to base orbital elements`,
      result: 'Updated',
      subSteps: [
        {
          id: `${planetKey}-semi-major-axis`,
          title: 'Semi-major Axis (a)',
          description: 'Average distance from the Sun in Astronomical Units.',
          formula: `a = ${PLANETARY_ELEMENTS[planetKey].a.toFixed(8)} + ${PLANETARY_ELEMENTS[planetKey].aDot.toFixed(8)} \\cdot T`,
          calculation: `${PLANETARY_ELEMENTS[planetKey].a.toFixed(8)} + ${PLANETARY_ELEMENTS[planetKey].aDot.toFixed(8)} × ${planetPos.centuriesFromJ2000.toFixed(8)}`,
          result: planetPos.elements.a.toFixed(8),
          unit: 'AU'
        },
        {
          id: `${planetKey}-eccentricity`,
          title: 'Eccentricity (e)',
          description: 'Shape of the orbital ellipse (0 = circular, approaching 1 = very elliptical).',
          formula: `e = ${PLANETARY_ELEMENTS[planetKey].e.toFixed(8)} + ${PLANETARY_ELEMENTS[planetKey].eDot.toFixed(8)} \\cdot T`,
          calculation: `${PLANETARY_ELEMENTS[planetKey].e.toFixed(8)} + ${PLANETARY_ELEMENTS[planetKey].eDot.toFixed(8)} × ${planetPos.centuriesFromJ2000.toFixed(8)}`,
          result: planetPos.elements.e.toFixed(8)
        },
        {
          id: `${planetKey}-mean-longitude`,
          title: 'Mean Longitude (L)',
          description: 'The longitude the planet would have if it moved in a perfect circle at constant speed.',
          formula: `L = ${PLANETARY_ELEMENTS[planetKey].L.toFixed(2)}° + ${PLANETARY_ELEMENTS[planetKey].LDot.toFixed(2)}° \\cdot T`,
          calculation: `${PLANETARY_ELEMENTS[planetKey].L.toFixed(2)}° + ${PLANETARY_ELEMENTS[planetKey].LDot.toFixed(2)}° × ${planetPos.centuriesFromJ2000.toFixed(8)}`,
          result: planetPos.elements.L.toFixed(6),
          unit: 'degrees'
        }
      ]
    },
    {
      id: `${planetKey}-mean-anomaly`,
      title: 'Calculate Mean Anomaly',
      description: `The angle ${planet.name} would have traveled in its orbit if it moved at constant speed.`,
      formula: 'M = L - \\varpi',
      calculation: `${planetPos.elements.L.toFixed(6)}° - ${planetPos.elements.longPeri.toFixed(6)}°`,
      result: planetPos.meanAnomaly.toFixed(6),
      unit: 'degrees'
    },
    {
      id: `${planetKey}-kepler-equation`,
      title: 'Solve Kepler\'s Equation',
      description: 'Account for the elliptical nature of the orbit by solving Kepler\'s equation iteratively.',
      formula: 'E - e \\sin E = M',
      calculation: `Newton-Raphson iteration with e = ${planetPos.elements.e.toFixed(6)}`,
      result: planetPos.eccentricAnomaly.toFixed(6),
      unit: 'degrees',
      subSteps: [
        {
          id: `${planetKey}-kepler-iteration`,
          title: 'Iterative Solution',
          description: 'Use Newton-Raphson method to find eccentric anomaly E.',
          formula: 'E_{n+1} = E_n - \\frac{E_n - e \\sin E_n - M}{1 - e \\cos E_n}',
          calculation: 'Converged after multiple iterations',
          result: 'Converged'
        }
      ]
    },
    {
      id: `${planetKey}-true-anomaly`,
      title: 'Calculate True Anomaly',
      description: `The actual angle ${planet.name} has traveled in its elliptical orbit from perihelion.`,
      formula: '\\nu = 2 \\arctan\\left(\\sqrt{\\frac{1+e}{1-e}} \\tan\\frac{E}{2}\\right)',
      calculation: `Using eccentric anomaly E = ${planetPos.eccentricAnomaly.toFixed(6)}° and e = ${planetPos.elements.e.toFixed(6)}`,
      result: planetPos.trueAnomaly.toFixed(6),
      unit: 'degrees'
    },
    {
      id: `${planetKey}-heliocentric-longitude`,
      title: 'Calculate Heliocentric Longitude',
      description: `${planet.name}'s longitude as seen from the Sun in the ecliptic coordinate system.`,
      formula: '\\lambda_{helio} = \\nu + \\varpi',
      calculation: `${planetPos.trueAnomaly.toFixed(6)}° + ${planetPos.elements.longPeri.toFixed(6)}°`,
      result: planetPos.heliocentricLongitude.toFixed(6),
      unit: 'degrees'
    },
    {
      id: `${planetKey}-geocentric-correction`,
      title: 'Apply Geocentric Correction',
      description: `Convert from heliocentric (Sun-centered) to geocentric (Earth-centered) coordinates for astrological use.`,
      formula: '\\vec{r}_{geo} = \\vec{r}_{planet} - \\vec{r}_{Earth}',
      calculation: `Calculate Earth's position and subtract from ${planet.name}'s position to get view from Earth`,
      result: planetPos.geocentricLongitude.toFixed(6),
      unit: 'degrees',
      subSteps: [
        {
          id: `${planetKey}-earth-position`,
          title: 'Calculate Earth Position',
          description: 'Determine Earth\'s heliocentric coordinates at the same time.',
          formula: 'L_E = L_{E0} + \\dot{L}_E \\cdot T',
          calculation: 'Using Earth orbital elements with same time T',
          result: 'Earth coordinates calculated'
        },
        {
          id: `${planetKey}-rectangular-conversion`,
          title: 'Convert to Rectangular Coordinates',
          description: 'Transform both planet and Earth positions to 3D rectangular coordinates.',
          formula: 'x = r \\cos(\\nu), y = r \\sin(\\nu)',
          calculation: 'Convert orbital elements to (x,y,z) coordinates',
          result: 'Rectangular coordinates obtained'
        },
        {
          id: `${planetKey}-geocentric-vector`,
          title: 'Calculate Geocentric Vector',
          description: 'Subtract Earth\'s position vector from planet\'s position vector.',
          formula: '\\vec{r}_{geo} = \\vec{r}_{planet} - \\vec{r}_{Earth}',
          calculation: 'Planet vector - Earth vector = Geocentric view',
          result: `Geocentric longitude: ${planetPos.geocentricLongitude.toFixed(6)}°`
        }
      ]
    },
    {
      id: `${planetKey}-zodiac-position`,
      title: 'Convert to Zodiac Position',
      description: 'Convert the geocentric longitude to zodiac sign and degree.',
      formula: '\\text{Sign} = \\lfloor\\frac{\\lambda_{geo}}{30°}\\rfloor, \\text{Degree} = \\lambda_{geo} \\bmod 30°',
      calculation: `Geocentric longitude ${planetPos.geocentricLongitude.toFixed(6)}° in zodiac wheel`,
      result: `${planetPos.zodiacPosition.degree}° ${planetPos.zodiacPosition.minutes}' ${planetPos.zodiacPosition.seconds}" ${planetPos.zodiacPosition.sign}`
    }
  ];
}

// Generate calculation steps for all planets
export function getAllPlanetPositionSteps(date: Date): Record<string, CalculationStep[]> {
  const planets: (keyof typeof PLANETARY_ELEMENTS)[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  
  const allSteps: Record<string, CalculationStep[]> = {};
  
  for (const planet of planets) {
    allSteps[planet] = getPlanetPositionSteps(planet, date);
  }
  
  return allSteps;
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
  localSiderealTime: number;
  obliquityOfEcliptic: number;
  system: string;
}

// Calculate obliquity of the ecliptic (Earth's axial tilt)
export function calculateObliquityOfEcliptic(T: number): number {
  // IAU 1980 formula for obliquity
  const eps0 = 23.439291111; // Mean obliquity at J2000.0 in degrees
  const dEps = -46.8150 * T - 0.00059 * T * T + 0.001813 * T * T * T;
  
  return eps0 + dEps / 3600; // Convert arcseconds to degrees
}

// Calculate Greenwich Mean Sidereal Time
export function calculateGreenwichMeanSiderealTime(julianDay: number): number {
  // More accurate GMST formula from Meeus "Astronomical Algorithms"
  const JD0 = Math.floor(julianDay - 0.5) + 0.5; // Julian Day at 0h UT
  const T0 = (JD0 - 2451545.0) / 36525;
  const H = (julianDay - JD0) * 24; // Hours from 0h UT
  
  // GMST at 0h UT (in hours) + correction for elapsed hours
  let gmst = 6.697374558 + 2400.051336 * T0 + 0.000025862 * T0 * T0 + H * 1.0027379093;
  
  // Normalize to 0-24 hours
  gmst = ((gmst % 24) + 24) % 24;
  
  // Convert to degrees
  return gmst * 15;
}

// Calculate Local Sidereal Time
export function calculateLocalSiderealTime(julianDay: number, longitude: number): number {
  const gmst = calculateGreenwichMeanSiderealTime(julianDay);
  const lst = gmst + longitude;
  
  // Normalize to 0-360 degrees
  return ((lst % 360) + 360) % 360;
}

// Calculate Ascendant (Rising Sign)
export function calculateAscendant(lst: number, latitude: number, obliquity: number): number {
  const lstRad = lst * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // Calculate ascendant using spherical astronomy formula
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  
  let ascendant = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360 degrees
  ascendant = ((ascendant % 360) + 360) % 360;
  
  return ascendant;
}

// Calculate Midheaven (Medium Coeli)
export function calculateMidheaven(lst: number, obliquity: number): number {
  const lstRad = lst * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // MC is where the meridian intersects the ecliptic
  const y = Math.sin(lstRad);
  const x = Math.cos(lstRad) * Math.cos(oblRad);
  
  let mc = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360 degrees
  mc = ((mc % 360) + 360) % 360;
  
  return mc;
}

// Placidus House System
export function calculatePlacidusHouses(
  ascendant: number,
  midheaven: number,
  latitude: number,
  obliquity: number,
  lst: number
): HouseCusps {
  const cusps: HouseCusps = {};
  
  // Angular houses (exact)
  cusps[1] = ascendant;
  cusps[4] = (midheaven + 180) % 360; // IC (Imum Coeli)
  cusps[7] = (ascendant + 180) % 360; // Descendant
  cusps[10] = midheaven; // MC (Medium Coeli)
  
  // Calculate intermediate cusps using Placidus method
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // Houses 2, 3, 11, 12 (complex trigonometric calculations)
  // Simplified Placidus approximation for intermediate houses
  for (let house = 2; house <= 3; house++) {
    const fraction = (house - 1) / 3;
    cusps[house] = ascendant + fraction * ((midheaven - ascendant + 360) % 360);
    cusps[house] = ((cusps[house] % 360) + 360) % 360;
  }
  
  for (let house = 11; house <= 12; house++) {
    const fraction = (house - 10) / 3;
    cusps[house] = midheaven + fraction * ((ascendant - midheaven + 360) % 360);
    cusps[house] = ((cusps[house] % 360) + 360) % 360;
  }
  
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
  latitude: number,
  obliquity: number
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
export function calculateHouseSystem(
  date: Date,
  latitude: number,
  longitude: number,
  system: string = 'placidus'
): HouseSystemResult {
  const jd = calculateJulianDay(date);
  const T = calculateCenturiesSinceJ2000(jd);
  
  const obliquity = calculateObliquityOfEcliptic(T);
  const lst = calculateLocalSiderealTime(jd, longitude);
  const ascendant = calculateAscendant(lst, latitude, obliquity);
  const midheaven = calculateMidheaven(lst, obliquity);
  
  let cusps: HouseCusps;
  
  switch (system.toLowerCase()) {
    case 'equal':
      cusps = calculateEqualHouses(ascendant);
      break;
    case 'whole-sign':
    case 'whole sign':
      cusps = calculateWholeSignHouses(ascendant);
      break;
    case 'koch':
      cusps = calculateKochHouses(ascendant, midheaven, latitude, obliquity);
      break;
    case 'placidus':
    default:
      cusps = calculatePlacidusHouses(ascendant, midheaven, latitude, obliquity, lst);
      break;
  }
  
  return {
    ascendant,
    midheaven,
    descendant: (ascendant + 180) % 360,
    imumCoeli: (midheaven + 180) % 360,
    cusps,
    localSiderealTime: lst,
    obliquityOfEcliptic: obliquity,
    system
  };
}

// Generate calculation steps for house system
export function getHouseSystemSteps(
  date: Date,
  latitude: number,
  longitude: number,
  system: string = 'placidus'
): CalculationStep[] {
  const houseResult = calculateHouseSystem(date, latitude, longitude, system);
  const jd = calculateJulianDay(date);
  const T = calculateCenturiesSinceJ2000(jd);
  
  // Get zodiac positions for the angles
  const ascendantZodiac = eclipticToZodiac(houseResult.ascendant);
  const midheavenZodiac = eclipticToZodiac(houseResult.midheaven);
  
  return [
    {
      id: 'house-julian-day',
      title: 'Calculate Julian Day Number',
      description: 'Convert birth date and time to Julian Day for astronomical calculations.',
      formula: 'JD = \\text{Julian Day Formula}',
      calculation: `For ${date.toISOString().split('T')[0]} at ${date.toTimeString().split(' ')[0]}`,
      result: jd.toFixed(6),
      unit: 'days'
    },
    {
      id: 'obliquity-ecliptic',
      title: 'Calculate Obliquity of Ecliptic',
      description: 'Earth\'s axial tilt relative to its orbital plane, needed for coordinate transformations.',
      formula: '\\varepsilon = 23°.439291 - 46\\arcsec.8150 \\cdot T - 0\\arcsec.00059 \\cdot T^2 + 0\\arcsec.001813 \\cdot T^3',
      calculation: `IAU 1980 formula with T = ${T.toFixed(8)} centuries`,
      result: houseResult.obliquityOfEcliptic.toFixed(6),
      unit: 'degrees'
    },
    {
      id: 'greenwich-sidereal-time',
      title: 'Calculate Greenwich Mean Sidereal Time',
      description: 'Earth\'s rotation angle relative to distant stars at Greenwich meridian.',
      formula: 'GMST = 6\\text{h}.697374558 + 0\\text{h}.06570982441908 \\cdot (JD - 2451545) + 0\\text{h}.000026 \\cdot T^2',
      calculation: `Earth rotation calculation for JD ${jd.toFixed(2)}`,
      result: (calculateGreenwichMeanSiderealTime(jd) / 15).toFixed(6),
      unit: 'hours'
    },
    {
      id: 'local-sidereal-time',
      title: 'Calculate Local Sidereal Time',
      description: 'Sidereal time at the birth location, accounting for longitude.',
      formula: 'LST = GMST + \\text{longitude}',
      calculation: `${(calculateGreenwichMeanSiderealTime(jd) / 15).toFixed(2)}h + ${longitude.toFixed(6)}°/15`,
      result: (houseResult.localSiderealTime / 15).toFixed(6),
      unit: 'hours',
      subSteps: [
        {
          id: 'lst-degrees',
          title: 'Convert to Degrees',
          description: 'Express local sidereal time in degrees for angular calculations.',
          formula: 'LST_{degrees} = LST_{hours} \\times 15°/\\text{hour}',
          calculation: `${(houseResult.localSiderealTime / 15).toFixed(6)} × 15`,
          result: houseResult.localSiderealTime.toFixed(6),
          unit: 'degrees'
        }
      ]
    },
    {
      id: 'ascendant-calculation',
      title: 'Calculate Ascendant (Rising Sign)',
      description: 'The zodiacal degree rising on the eastern horizon at birth time and location.',
      formula: '\\text{Asc} = \\arctan2(-\\cos(LST), \\sin(LST)\\cos(\\varepsilon) + \\tan(\\phi)\\sin(\\varepsilon))',
      calculation: `Spherical astronomy with LST = ${houseResult.localSiderealTime.toFixed(2)}°, φ = ${latitude.toFixed(2)}°`,
      result: houseResult.ascendant.toFixed(6),
      unit: 'degrees',
      subSteps: [
        {
          id: 'ascendant-zodiac',
          title: 'Ascendant Zodiac Position',
          description: 'Convert ascendant longitude to zodiac sign and degree.',
          formula: '\\text{Sign conversion from ecliptic longitude}',
          calculation: `${houseResult.ascendant.toFixed(6)}° ecliptic longitude`,
          result: `${ascendantZodiac.degree}° ${ascendantZodiac.minutes}' ${ascendantZodiac.seconds}" ${ascendantZodiac.sign}`
        }
      ]
    },
    {
      id: 'midheaven-calculation',
      title: 'Calculate Midheaven (Medium Coeli)',
      description: 'The zodiacal degree at the highest point of the ecliptic at birth time.',
      formula: '\\text{MC} = \\arctan2(\\sin(LST), \\cos(LST)\\cos(\\varepsilon))',
      calculation: `Meridian intersection with ecliptic using LST = ${houseResult.localSiderealTime.toFixed(2)}°`,
      result: houseResult.midheaven.toFixed(6),
      unit: 'degrees',
      subSteps: [
        {
          id: 'midheaven-zodiac',
          title: 'Midheaven Zodiac Position',
          description: 'Convert midheaven longitude to zodiac sign and degree.',
          formula: '\\text{Sign conversion from ecliptic longitude}',
          calculation: `${houseResult.midheaven.toFixed(6)}° ecliptic longitude`,
          result: `${midheavenZodiac.degree}° ${midheavenZodiac.minutes}' ${midheavenZodiac.seconds}" ${midheavenZodiac.sign}`
        }
      ]
    },
    {
      id: 'house-cusps-calculation',
      title: `Calculate ${system.charAt(0).toUpperCase() + system.slice(1)} House Cusps`,
      description: `Generate all 12 house cusps using the ${system} house system method.`,
      formula: system === 'equal' ? '\\text{Cusp}_n = \\text{Asc} + (n-1) \\times 30°' : 
               system === 'whole-sign' ? '\\text{Cusp}_n = \\text{Sign}_{Asc} + (n-1) \\times 30°' :
               '\\text{Complex trigonometric interpolation}',
      calculation: `${system.charAt(0).toUpperCase() + system.slice(1)} house division algorithm`,
      result: 'All 12 cusps calculated',
      subSteps: Object.entries(houseResult.cusps).map(([house, longitude]) => {
        const zodiacPos = eclipticToZodiac(longitude);
        const houseNames = {
          1: 'Ascendant/Self', 2: 'Values/Possessions', 3: 'Communication', 4: 'Home/Family',
          5: 'Creativity/Children', 6: 'Health/Service', 7: 'Partnerships', 8: 'Transformation',
          9: 'Philosophy/Travel', 10: 'Career/Reputation', 11: 'Friends/Hopes', 12: 'Subconscious'
        };
        
        return {
          id: `house-${house}-cusp`,
          title: `House ${house} - ${houseNames[parseInt(house) as keyof typeof houseNames]}`,
          description: `${parseInt(house) === 1 ? 'Ascendant: ' : parseInt(house) === 10 ? 'Midheaven: ' : ''}Cusp of the ${house}${house.endsWith('1') ? 'st' : house.endsWith('2') ? 'nd' : house.endsWith('3') ? 'rd' : 'th'} house`,
          formula: `\\text{House ${house}} = ${longitude.toFixed(6)}°`,
          calculation: `${system} method calculation`,
          result: `${zodiacPos.degree}° ${zodiacPos.minutes}' ${zodiacPos.seconds}" ${zodiacPos.sign}`
        };
      })
    }
  ];
}

// Detailed step-by-step calculation breakdown
export interface CalculationStep {
  id: string;
  title: string;
  description: string;
  formula: string;
  calculation: string;
  result: number | string;
  unit?: string;
  subSteps?: CalculationStep[];
}

export function getMoonPositionSteps(
  date: Date,
  _latitude?: number,
  _longitude?: number
): CalculationStep[] {
  const moonPos = calculateMoonPosition(date);
  
  return [
    {
      id: 'moon-julian-day',
      title: 'Calculate Julian Day Number',
      description: 'Convert the given date and time to Julian Day Number for lunar calculations.',
      formula: 'JD = \\text{Julian Day Formula}',
      calculation: `For ${date.toISOString().split('T')[0]} at ${date.toTimeString().split(' ')[0]} UTC`,
      result: moonPos.julianDay.toFixed(6),
      unit: 'days'
    },
    {
      id: 'moon-centuries-j2000',
      title: 'Calculate Centuries Since J2000.0',
      description: 'Calculate time parameter T for lunar theory calculations.',
      formula: 'T = \\frac{JD - 2451545.0}{36525}',
      calculation: `(${moonPos.julianDay.toFixed(6)} - 2451545.0) / 36525`,
      result: moonPos.centuriesFromJ2000.toFixed(8),
      unit: 'centuries'
    },
    {
      id: 'moon-mean-longitude',
      title: 'Calculate Moon\'s Mean Longitude',
      description: 'The Moon\'s mean longitude in its orbit, accounting for its rapid motion.',
      formula: 'L\' = 218°.3164477 + 481267°.88123421 \\cdot T - 0°.0015786 \\cdot T^2 + \\frac{T^3}{538841} - \\frac{T^4}{65194000}',
      calculation: `Complex polynomial expansion with T = ${moonPos.centuriesFromJ2000.toFixed(8)}`,
      result: moonPos.meanLongitude.toFixed(6),
      unit: 'degrees'
    },
    {
      id: 'moon-fundamental-arguments',
      title: 'Calculate Fundamental Arguments',
      description: 'The five fundamental arguments needed for lunar position theory.',
      formula: 'D, M, M\', F = \\text{Delaunay arguments}',
      calculation: 'Mean elongation, Sun\'s anomaly, Moon\'s anomaly, argument of latitude',
      result: 'Calculated',
      subSteps: [
        {
          id: 'moon-elongation',
          title: 'Mean Elongation (D)',
          description: 'Angular distance between Moon and Sun as seen from Earth\'s center.',
          formula: 'D = 297°.8501921 + 445267°.1114034 \\cdot T - 0°.0018819 \\cdot T^2 + \\frac{T^3}{545868} - \\frac{T^4}{113065000}',
          calculation: `Polynomial with T = ${moonPos.centuriesFromJ2000.toFixed(8)}`,
          result: moonPos.meanElongation.toFixed(6),
          unit: 'degrees'
        },
        {
          id: 'sun-anomaly-moon',
          title: 'Sun\'s Mean Anomaly (M)',
          description: 'Sun\'s position in its elliptical orbit for lunar calculations.',
          formula: 'M = 357°.5291092 + 35999°.0502909 \\cdot T - 0°.0001536 \\cdot T^2 + \\frac{T^3}{24490000}',
          calculation: `Sun's orbital position with T = ${moonPos.centuriesFromJ2000.toFixed(8)}`,
          result: moonPos.sunMeanAnomaly.toFixed(6),
          unit: 'degrees'
        },
        {
          id: 'moon-anomaly',
          title: 'Moon\'s Mean Anomaly (M\')',
          description: 'Moon\'s position in its elliptical orbit around Earth.',
          formula: 'M\' = 134°.9633964 + 477198°.8675055 \\cdot T + 0°.0087414 \\cdot T^2 + \\frac{T^3}{69699} - \\frac{T^4}{14712000}',
          calculation: `Moon's orbital anomaly with T = ${moonPos.centuriesFromJ2000.toFixed(8)}`,
          result: moonPos.moonMeanAnomaly.toFixed(6),
          unit: 'degrees'
        },
        {
          id: 'argument-latitude',
          title: 'Argument of Latitude (F)',
          description: 'Moon\'s argument of latitude relative to its ascending node.',
          formula: 'F = 93°.2720950 + 483202°.0175233 \\cdot T - 0°.0036539 \\cdot T^2 - \\frac{T^3}{3526000} + \\frac{T^4}{863310000}',
          calculation: `Latitude argument with T = ${moonPos.centuriesFromJ2000.toFixed(8)}`,
          result: moonPos.argumentOfLatitude.toFixed(6),
          unit: 'degrees'
        }
      ]
    },
    {
      id: 'moon-longitude-correction',
      title: 'Apply Periodic Corrections',
      description: 'The Moon\'s orbit is highly perturbed. Apply the main periodic terms from lunar theory.',
      formula: '\\Delta L = \\sum A_i \\sin(\\text{argument}_i)',
      calculation: 'Sum of 15+ main periodic terms from Meeus lunar theory',
      result: moonPos.longitudeCorrection.toFixed(6),
      unit: 'degrees',
      subSteps: [
        {
          id: 'main-terms',
          title: 'Main Periodic Terms',
          description: 'The largest amplitude terms in the lunar longitude series.',
          formula: '6°.289 \\sin M\' + 1°.274 \\sin(2D - M\') + 0°.658 \\sin 2D + ...',
          calculation: 'Trigonometric series with fundamental arguments',
          result: 'Major perturbations applied'
        }
      ]
    },
    {
      id: 'moon-true-longitude',
      title: 'Calculate Moon\'s True Longitude',
      description: 'Add the periodic corrections to the mean longitude.',
      formula: '\\lambda_{Moon} = L\' + \\Delta L',
      calculation: `${moonPos.meanLongitude.toFixed(6)}° + ${moonPos.longitudeCorrection.toFixed(6)}°`,
      result: moonPos.trueLongitude.toFixed(6),
      unit: 'degrees'
    },
    {
      id: 'moon-zodiac-position',
      title: 'Convert to Zodiac Position',
      description: 'Convert ecliptic longitude to zodiac sign and degree.',
      formula: '\\text{Sign} = \\lfloor\\frac{\\lambda_{Moon}}{30°}\\rfloor, \\text{Degree} = \\lambda_{Moon} \\bmod 30°',
      calculation: `Longitude ${moonPos.trueLongitude.toFixed(6)}° in zodiac wheel`,
      result: `${moonPos.zodiacPosition.degree}° ${moonPos.zodiacPosition.minutes}' ${moonPos.zodiacPosition.seconds}" ${moonPos.zodiacPosition.sign}`
    },
    {
      id: 'moon-phase',
      title: 'Calculate Moon Phase',
      description: 'Determine the Moon\'s phase based on its angular separation from the Sun.',
      formula: '\\text{Phase} = \\frac{1 - \\cos(\\lambda_{Moon} - \\lambda_{Sun})}{2}',
      calculation: `Angular separation and illumination calculation`,
      result: moonPos.phase.phaseName,
      subSteps: [
        {
          id: 'phase-angle',
          title: 'Phase Angle',
          description: 'Angular separation between Moon and Sun as seen from Earth.',
          formula: '\\text{Elongation} = \\lambda_{Moon} - \\lambda_{Sun}',
          calculation: `${moonPos.trueLongitude.toFixed(2)}° - Sun longitude`,
          result: 'Calculated'
        },
        {
          id: 'illumination',
          title: 'Illumination Percentage',
          description: 'Percentage of the Moon\'s visible surface that is illuminated.',
          formula: '\\text{Illumination} = \\text{Phase} \\times 100\\%',
          calculation: 'Based on phase angle geometry',
          result: `${moonPos.phase.illumination.toFixed(1)}%`,
          unit: 'illuminated'
        },
        {
          id: 'phase-name',
          title: 'Phase Description',
          description: moonPos.phase.phaseDescription,
          formula: '\\text{Classification based on elongation angle}',
          calculation: 'Phase name from astronomical definitions',
          result: moonPos.phase.phaseName
        }
      ]
    }
  ];
}

export function getSunPositionSteps(
  date: Date,
  _latitude?: number,
  _longitude?: number
): CalculationStep[] {
  const sunPos = calculateSunPosition(date);
  
  return [
    {
      id: 'julian-day',
      title: 'Calculate Julian Day Number',
      description: 'Convert the given date and time to Julian Day Number (JD), which is the number of days since January 1, 4713 BCE in the proleptic Julian calendar.',
      formula: 'JD = \\text{Julian Day Formula}',
      calculation: `For ${date.toISOString().split('T')[0]} at ${date.toTimeString().split(' ')[0]} UTC`,
      result: sunPos.julianDay.toFixed(6),
      unit: 'days',
      subSteps: [
        {
          id: 'jd-year-month-day',
          title: 'Extract Date Components',
          description: 'Break down the input date into year, month, and day components.',
          formula: 'Y = \\text{year}, M = \\text{month}, D = \\text{day}',
          calculation: `Y = ${date.getFullYear()}, M = ${date.getMonth() + 1}, D = ${date.getDate()}`,
          result: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        },
        {
          id: 'jd-time-decimal',
          title: 'Convert Time to Decimal Hours',
          description: 'Convert hours, minutes, and seconds to decimal hours for precise calculation.',
          formula: 'h_{decimal} = h + \\frac{m}{60} + \\frac{s}{3600}',
          calculation: `${date.getHours()} + ${date.getMinutes()}/60 + ${date.getSeconds()}/3600`,
          result: (date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600).toFixed(6),
          unit: 'hours'
        },
        {
          id: 'jd-algorithm',
          title: 'Apply Julian Day Algorithm',
          description: 'Use the standard algorithm to calculate the Julian Day Number.',
          formula: 'JD = D + \\lfloor\\frac{153m + 2}{5}\\rfloor + 365y + \\lfloor\\frac{y}{4}\\rfloor - \\lfloor\\frac{y}{100}\\rfloor + \\lfloor\\frac{y}{400}\\rfloor - 32045',
          calculation: 'Applied Julian Day algorithm with date corrections',
          result: Math.floor(sunPos.julianDay).toString(),
          unit: 'integer days'
        }
      ]
    },
    {
      id: 'centuries-j2000',
      title: 'Calculate Centuries Since J2000.0',
      description: 'Calculate the number of centuries elapsed since the J2000.0 epoch (January 1, 2000, 12:00 TT).',
      formula: 'T = \\frac{JD - 2451545.0}{36525}',
      calculation: `(${sunPos.julianDay.toFixed(6)} - 2451545.0) / 36525`,
      result: sunPos.centuriesFromJ2000.toFixed(8),
      unit: 'centuries'
    },
    {
      id: 'mean-longitude',
      title: 'Calculate Sun\'s Mean Longitude',
      description: 'The mean longitude is the longitude the Sun would have if it moved in a perfect circle at constant speed.',
      formula: 'L_0 = 280°.46646 + 36000°.76983 \\cdot T + 0°.0003032 \\cdot T^2',
      calculation: `280.46646 + 36000.76983 × ${sunPos.centuriesFromJ2000.toFixed(8)} + 0.0003032 × (${sunPos.centuriesFromJ2000.toFixed(8)})²`,
      result: sunPos.meanLongitude.toFixed(6),
      unit: 'degrees'
    },
    {
      id: 'mean-anomaly',
      title: 'Calculate Sun\'s Mean Anomaly',
      description: 'The mean anomaly is the angle between the Sun\'s position and its perigee as if the orbit were circular.',
      formula: 'M = 357°.52911 + 35999°.05029 \\cdot T - 0°.0001537 \\cdot T^2',
      calculation: `357.52911 + 35999.05029 × ${sunPos.centuriesFromJ2000.toFixed(8)} - 0.0001537 × (${sunPos.centuriesFromJ2000.toFixed(8)})²`,
      result: sunPos.meanAnomaly.toFixed(6),
      unit: 'degrees'
    },
    {
      id: 'equation-of-center',
      title: 'Calculate Equation of Center',
      description: 'The equation of center corrects for the elliptical nature of Earth\'s orbit around the Sun.',
      formula: 'C = (1°.914602 - 0°.004817 \\cdot T) \\sin M + (0°.019993 - 0°.000101 \\cdot T) \\sin 2M + 0°.000289 \\sin 3M',
      calculation: `Trigonometric series expansion using M = ${sunPos.meanAnomaly.toFixed(6)}°`,
      result: sunPos.equationOfCenter.toFixed(6),
      unit: 'degrees'
    },
    {
      id: 'true-longitude',
      title: 'Calculate Sun\'s True Longitude',
      description: 'The true longitude combines the mean longitude with the equation of center correction.',
      formula: '\\lambda = L_0 + C',
      calculation: `${sunPos.meanLongitude.toFixed(6)}° + ${sunPos.equationOfCenter.toFixed(6)}°`,
      result: sunPos.trueLongitude.toFixed(6),
      unit: 'degrees'
    },
    {
      id: 'zodiac-position',
      title: 'Convert to Zodiac Position',
      description: 'Convert the ecliptic longitude to zodiac sign and degree within that sign.',
      formula: '\\text{Sign} = \\lfloor\\frac{\\lambda}{30°}\\rfloor, \\text{Degree} = \\lambda \\bmod 30°',
      calculation: `Longitude ${sunPos.trueLongitude.toFixed(6)}° converts to zodiac position`,
      result: `${sunPos.zodiacPosition.degree}° ${sunPos.zodiacPosition.minutes}' ${sunPos.zodiacPosition.seconds}" ${sunPos.zodiacPosition.sign}`,
      subSteps: [
        {
          id: 'zodiac-sign',
          title: 'Determine Zodiac Sign',
          description: 'Each zodiac sign occupies exactly 30° of the ecliptic.',
          formula: '\\text{Sign Index} = \\lfloor\\frac{\\lambda}{30°}\\rfloor',
          calculation: `⌊${sunPos.trueLongitude.toFixed(6)} / 30⌋ = ${Math.floor(sunPos.trueLongitude / 30)}`,
          result: sunPos.zodiacPosition.sign
        },
        {
          id: 'zodiac-degree',
          title: 'Calculate Degree Within Sign',
          description: 'Find the position within the 30° span of the zodiac sign.',
          formula: '\\text{Degree in Sign} = \\lambda \\bmod 30°',
          calculation: `${sunPos.trueLongitude.toFixed(6)} mod 30 = ${(sunPos.trueLongitude % 30).toFixed(6)}`,
          result: `${sunPos.zodiacPosition.degree}° ${sunPos.zodiacPosition.minutes}' ${sunPos.zodiacPosition.seconds}"`,
          unit: 'degrees, minutes, seconds'
        }
      ]
    }
  ];
}