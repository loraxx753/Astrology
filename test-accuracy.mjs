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
    date: new Date('1984-08-18T12:03:00.000Z'),
    latitude: 28.078611,
    longitude: -80.602778
  },
  // {
  //   name: "Modern Test Case",
  //   date: new Date('2000-01-01T12:00:00.000Z'),
  //   latitude: 40.7128,
  //   longitude: -74.0060
  // }
];


// function parseCalculatedPosition(zodiacPos) {
//   const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
//     'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
//   const signIndex = signs.indexOf(zodiacPos.sign);
//   return signIndex * 30 + zodiacPos.degree + zodiacPos.minutes / 60 + (zodiacPos.seconds || 0) / 3600;
// }

// function calculateError(calculated, expected) {
//   const diff = Math.abs(calculated - expected);
//   // Handle wrap-around at 0°/360°
//   return Math.min(diff, 360 - diff);
// }


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

function getLocalTimeForLongitude(date, longitude) {
  // Convert UTC date to local time for given longitude
  // Each 15° longitude = 1 hour offset
  const offsetHours = Math.round(longitude / 15);
  const localDate = new Date(date);
  localDate.setUTCHours(localDate.getUTCHours() + offsetHours);
  return localDate;
}

async function runAccuracyTest() {
  console.log('🎯 Astronomical Accuracy Validation Test (vs Swiss Ephemeris)\n');

  for (const testCase of referenceData) {
    console.log(`\n📊 Testing: ${testCase.name}`);
    console.log(`Date (input): ${testCase.date.toISOString()}`);
    console.log(`Location: ${testCase.latitude}°, ${testCase.longitude}°\n`);

    // Convert UTC to local time for observer longitude
    const localDate = getLocalTimeForLongitude(testCase.date, testCase.longitude);
    const localISOString = localDate.toISOString().slice(0, 19).replace('T', ' ');
    console.log('HORIZONS request datetime (local for observer):', localISOString);

    // Request all planets from HORIZONS using local time
    const horizonsPositions = await getHorizonsBirthChartPositions(
      localISOString,
      testCase.latitude,
      testCase.longitude,
      ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
    );

    // Calculate Julian Day for Swiss Ephemeris (UTC)
    const jd = getJulianDay(testCase.date);

    // Prepare table header
    console.log('\n| Planet   | HORIZONS Longitude | Swiss Ephemeris Longitude | Difference (arcmin) |');
    console.log('|----------|-------------------|--------------------------|---------------------|');
    // Collect and display table rows
    for (const planet of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
      const horizonsPlanet = horizonsPositions.find(p => p.name.toLowerCase() === planet.toLowerCase());
      let sweLongitude = null;
      try {
        sweLongitude = await getSwissephLongitude(jd, PLANET_MAP[planet.toLowerCase()]);
      } catch (err) {
        sweLongitude = null;
      }
      const horizonsLongitude = horizonsPlanet ? horizonsPlanet.longitude : null;
      let diffMinutes = null;
      if (typeof horizonsLongitude === 'number' && typeof sweLongitude === 'number' && !isNaN(horizonsLongitude) && !isNaN(sweLongitude)) {
        let diff = Math.abs(horizonsLongitude - sweLongitude);
        diff = Math.min(diff, 360 - diff); // handle wrap-around
        diffMinutes = (diff * 60).toFixed(1);
      }
      const row = `| ${planet.padEnd(8)} | ${horizonsLongitude !== null ? horizonsLongitude.toFixed(8).padEnd(17) : 'ERR'.padEnd(17)} | ${sweLongitude !== null ? sweLongitude.toFixed(8).padEnd(24) : 'ERR'.padEnd(24)} | ${diffMinutes !== null ? diffMinutes.padEnd(19) : 'ERR'.padEnd(19)} |`;
      console.log(row);
    }
  }
}

// Run the test
runAccuracyTest().catch(console.error);