import { getHorizonsBirthChartPositions } from './src/lib/services/horizonsService';

import {
  calculateSunPosition,
  calculateMoonPosition,
  calculateAllPlanetPositions,
  calculateHouseSystem
} from './src/lib/services/calculations.ts';

// Import swisseph (Swiss Ephemeris)
import swisseph from 'swisseph';

// Test cases for validation
const referenceData = [
  {
    name: "Kevin Baugh Test Case",
    date: new Date('1984-08-18T08:03:00.000Z'),
    latitude: 28.0786111,
    longitude: -80.6027778
  },
  {
    name: "Modern Test Case",
    date: new Date('2000-01-01T12:00:00.000Z'),
    latitude: 40.7128,
    longitude: -74.0060
  }
];


function parseCalculatedPosition(zodiacPos) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = signs.indexOf(zodiacPos.sign);
  return signIndex * 30 + zodiacPos.degree + zodiacPos.minutes / 60 + (zodiacPos.seconds || 0) / 3600;
}

function calculateError(calculated, expected) {
  const diff = Math.abs(calculated - expected);
  // Handle wrap-around at 0°/360°
  return Math.min(diff, 360 - diff);
}


// Map planet names to Swiss Ephemeris constants
const PLANET_MAP = {
  sun: swisseph.SE_SUN,
  moon: swisseph.SE_MOON,
  mercury: swisseph.SE_MERCURY,
  venus: swisseph.SE_VENUS,
  mars: swisseph.SE_MARS,
  jupiter: swisseph.SE_JUPITER,
  saturn: swisseph.SE_SATURN
};

// Helper: get Julian Day in UT
function getJulianDay(date) {
  // swisseph expects Julian Day in UT
  // date: JS Date object (UTC)
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
  return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
}

// Helper: decimal degrees to zodiac sign/deg/min
function decimalToZodiac(deg) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  let d = deg % 360;
  if (d < 0) d += 360;
  const signIndex = Math.floor(d / 30);
  const sign = signs[signIndex];
  const degree = Math.floor(d % 30);
  const minutes = Math.floor((d % 1) * 60);
  const seconds = Math.round((((d % 1) * 60) % 1) * 60);
  return { degree, minutes, seconds, sign };
}

async function getSwissephLongitude(jd, planet) {
  return new Promise((resolve, reject) => {
    swisseph.swe_calc_ut(jd, planet, swisseph.SEFLG_SWIEPH, (res) => {
      if (res.error) {
        reject(res.error);
      } else {
        resolve(res.longitude);
      }
    });
  });
}

async function runAccuracyTest() {
  console.log('🎯 Astronomical Accuracy Validation Test (vs Swiss Ephemeris)\n');

  // Set path to ephemeris data (optional, but recommended for accuracy)
  // swisseph.swe_set_ephe_path('./ephe'); // Uncomment and set if you have ephemeris files

  for (const testCase of referenceData) {
    console.log(`\n📊 Testing: ${testCase.name}`);
    console.log(`Date: ${testCase.date.toISOString()}`);
    console.log(`Location: ${testCase.latitude}°, ${testCase.longitude}°\n`);

    try {

      // Always use HORIZONS planetary positions for chart calculations
      const horizonsPositions = await getHorizonsBirthChartPositions(
        testCase.date.toISOString().slice(0, 19),
        testCase.latitude,
        testCase.longitude,
        0,
        ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
      );

      // Convert HORIZONS positions to zodiac format for chart use
      const horizonsZodiacMap = {};
      for (const p of horizonsPositions) {
        if (typeof p.longitude === 'number' && !isNaN(p.longitude)) {
          horizonsZodiacMap[p.name.toLowerCase()] = decimalToZodiac(p.longitude);
        }
      }

      // For reference: calculate our engine's positions (not used for chart, just for comparison)
      const sunPos = calculateSunPosition(testCase.date);
      const moonPos = calculateMoonPosition(testCase.date);
      const planets = calculateAllPlanetPositions(testCase.date);

      // Calculate Julian Day
      const jd = getJulianDay(testCase.date);

      // Query Swiss Ephemeris for each planet
      const bodies = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
      const results = [];

      for (const body of bodies) {
        // Use HORIZONS as the authoritative chart input
        const horizonsZodiac = horizonsZodiacMap[body];
        let horizonsDisplay = 'ERR';
        let horizonsDecimal = null;
        if (horizonsZodiac) {
          horizonsDisplay = `${horizonsZodiac.degree}°${horizonsZodiac.minutes}' ${horizonsZodiac.sign}`;
          horizonsDecimal = horizonsPositions.find(p => p.name.toLowerCase() === body)?.longitude;
        }

        // For validation: Swiss Ephemeris
        let sweDecimal = null;
        let sweZodiac = null;
        try {
          sweDecimal = await getSwissephLongitude(jd, PLANET_MAP[body]);
          sweZodiac = decimalToZodiac(sweDecimal);
        } catch (err) {
          sweZodiac = null;
        }

        // Calculate difference in arcminutes (if both are available)
        let diffMinutes = null;
        if (typeof horizonsDecimal === 'number' && typeof sweDecimal === 'number' && !isNaN(horizonsDecimal) && !isNaN(sweDecimal)) {
          let diff = Math.abs(horizonsDecimal - sweDecimal);
          diff = Math.min(diff, 360 - diff); // handle wrap-around
          diffMinutes = (diff * 60).toFixed(1);
        }

        results.push({
          body: body.charAt(0).toUpperCase() + body.slice(1),
          horizons: horizonsDisplay,
          swe: sweZodiac ? `${sweZodiac.degree}°${sweZodiac.minutes}' ${sweZodiac.sign}` : 'ERR',
          diffMinutes: diffMinutes !== null ? diffMinutes : 'ERR',
        });
      }

      // Display results
      console.log('Results:');
      console.log('Body      | HORIZONS        | Swiss Ephemeris | Diff (min)');
      console.log('----------|-----------------|-----------------|------------');

      results.forEach(result => {
        console.log(
          `${result.body.padEnd(9)} | ${result.horizons.padEnd(15)} | ${result.swe.padEnd(15)} | ${result.diffMinutes.toString().padStart(10)}`
        );
      });

    } catch (error) {
      console.error(`❌ Error testing ${testCase.name}:`, error.message);
    }
  }
}

// Run the test
runAccuracyTest().catch(console.error);