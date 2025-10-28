import { calculateObliquityOfEcliptic, getLocalSiderealTime, getUTCFromLocal, calculateJulianDay } from "../calculations";

export function getZodiacFromLongitude(longitude: number) {
  const names = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  let d = longitude % 360;
  if (d < 0) d += 360;
  const signIndex = Math.floor(d / 30);
  const sign = names[signIndex];
  const degree = Math.floor(d % 30);
  const minutes = Math.floor((d % 1) * 60);
  const seconds = Math.round((((d % 1) * 60) % 1) * 60);
  return { degree, minutes, seconds, sign };
}

export function getAscendantAndMC(dateStr: string, timeStr: string, latitude: number, longitude: number) {
    const utcDate = getUTCFromLocal(dateStr, timeStr, latitude, longitude);
    const julianDay = calculateJulianDay(new Date(utcDate.toISO() || ''));

    // Assume you have these values:
    const lst = getLocalSiderealTime(utcDate, longitude);
    const T = (julianDay - 2_451_545.0) / 36_525; // centuries since J2000
    const obliquity = calculateObliquityOfEcliptic(T); // in degrees


    // Convert LST from hours to degrees for the formulas
    const lstDegrees = lst * 15;

    // Calculate Ascendant (rising sign)
    const lstRad = lstDegrees * Math.PI / 180;
    const latRad = latitude * Math.PI / 180;
    const oblRad = obliquity * Math.PI / 180;

    const y = -Math.cos(lstRad);
    const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

    let ascendant = Math.atan2(y, x) * 180 / Math.PI;
    ascendant += 180; // correct quadrant
    ascendant = ((ascendant % 360) + 360) % 360; // normalize

    // Calculate Midheaven (MC)
    const yMC = Math.sin(lstRad);
    const xMC = Math.cos(lstRad) * Math.cos(oblRad);

    let midheaven = Math.atan2(yMC, xMC) * 180 / Math.PI;
    midheaven = ((midheaven % 360) + 360) % 360; // normalize

    const descendant = (ascendant + 180) % 360;
    const imumCoelis = (midheaven + 180) % 360;

    return { ascendant: convertToZodiac(ascendant), midheaven: convertToZodiac(midheaven), descendant: convertToZodiac(descendant), imumCoeli: convertToZodiac(imumCoelis) };
}


export const convertToZodiac = (degrees: number) => {
    const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const d = ((degrees % 360) + 360) % 360;
    const signIndex = Math.floor(d / 30);
    const sign = signs[signIndex];
    const degree = Math.floor(d % 30);
    const minutes = Math.floor((d % 1) * 60);
    const seconds = Math.round((((d % 1) * 60) - minutes) * 60);
    return { sign, degree, minutes, seconds };
}