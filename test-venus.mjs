// Test Venus calculation for Feb 16, 1991 6:10 AM Austin TX
import { calculatePlanetPosition } from './src/lib/services/calculations.ts';

// Test date - February 16, 1991 6:10 AM
const testDate = new Date('1991-02-16T06:10:00-06:00'); // CST timezone

console.log('Testing Venus position for:', testDate.toISOString());
console.log('Expected: ~22° Pisces');
console.log('Current calculation gives: ~28° Aries');
console.log('');

try {
  const venus = calculatePlanetPosition('venus', testDate);
  
  console.log('=== VENUS CALCULATION RESULTS ===');
  console.log(`Julian Day: ${venus.julianDay}`);
  console.log(`Centuries from J2000: ${venus.centuriesFromJ2000}`);
  console.log('');
  
  console.log('Orbital Elements:');
  console.log(`  Semi-major axis (a): ${venus.elements.a.toFixed(6)} AU`);
  console.log(`  Eccentricity (e): ${venus.elements.e.toFixed(6)}`);
  console.log(`  Inclination (I): ${venus.elements.I.toFixed(6)}°`);
  console.log(`  Mean longitude (L): ${venus.elements.L.toFixed(6)}°`);
  console.log(`  Longitude of perihelion: ${venus.elements.longPeri.toFixed(6)}°`);
  console.log('');
  
  console.log('Calculated Values:');
  console.log(`  Mean Anomaly: ${venus.meanAnomaly.toFixed(6)}°`);
  console.log(`  Eccentric Anomaly: ${venus.eccentricAnomaly.toFixed(6)}°`);
  console.log(`  True Anomaly: ${venus.trueAnomaly.toFixed(6)}°`);
  console.log(`  Heliocentric Longitude: ${venus.heliocentricLongitude.toFixed(6)}°`);
  console.log('');
  
  console.log('Zodiac Position:');
  console.log(`  ${venus.zodiacPosition.degree}° ${venus.zodiacPosition.minutes}' ${venus.zodiacPosition.seconds}" ${venus.zodiacPosition.sign}`);
  console.log('');
  
  console.log('=== ISSUE ANALYSIS ===');
  console.log('Problem: This is HELIOCENTRIC longitude (as seen from Sun)');
  console.log('Need: GEOCENTRIC longitude (as seen from Earth)');
  console.log('Solution: Need to calculate Earth position and subtract to get geocentric view');
  
} catch (error) {
  console.error('Error:', error.message);
}