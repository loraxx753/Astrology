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