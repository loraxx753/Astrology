import colors from 'ansi-colors';
import { DateTime } from 'luxon';
import tzLookup from 'tz-lookup';
import { getAscendantAndMC, convertToZodiac } from './src/lib/services/calculate/astrology';

// Import swisseph (Swiss Ephemeris)
import swisseph from 'swisseph';

// Test cases for validation

const horizonsPositions = [
  {
    name: 'Sun',
    ra: 147.96774,
    dec: 12.95223,
    longitude: 145.70836277521835,
    latitude: 0.0006762709962969943,
    dateStr: '1984-Aug-18 12:03',
    northNodeLongitude: undefined,
    southNodeLongitude: undefined
  },
  {
    name: 'Moon',
    ra: 39.06745,
    dec: 13.32911,
    longitude: 40.897015207492586,
    latitude: -1.8591398622296227,
    dateStr: '1984-Aug-18 12:03',
    northNodeLongitude: undefined,
    southNodeLongitude: undefined
  },
  {
    name: 'Mercury',
    ra: 162.41038,
    dec: 2.66449,
    longitude: 162.76212324092126,
    latitude: -4.441208990173144,
    dateStr: '1984-Aug-18 12:03',
    northNodeLongitude: undefined,
    southNodeLongitude: undefined
  },
  {
    name: 'Venus',
    ra: 165.00669,
    dec: 7.92305,
    longitude: 163.14135577899515,
    latitude: 1.4057974539453746,
    dateStr: '1984-Aug-18 12:03',
    northNodeLongitude: undefined,
    southNodeLongitude: undefined
  },
  {
    name: 'Mars',
    ra: 237.65422,
    dec: -22.53832,
    longitude: 240.35761296329645,
    latitude: -2.3642806176187885,
    dateStr: '1984-Aug-18 12:03',
    northNodeLongitude: undefined,
    southNodeLongitude: undefined
  },
  {
    name: 'Jupiter',
    ra: 273.63388,
    dec: -23.4492,
    longitude: 273.33341656072,
    latitude: -0.04996143109806761,
    dateStr: '1984-Aug-18 12:03',
    northNodeLongitude: undefined,
    southNodeLongitude: undefined
  },
  {
    name: 'Saturn',
    ra: 219.04433,
    dec: -12.92024,
    longitude: 220.749121245315,
    latitude: 2.241026095830242,
    dateStr: '1984-Aug-18 12:03',
    northNodeLongitude: undefined,
    southNodeLongitude: undefined
  }
]

const referenceData = [
  {
    name: "Kevin Baugh Test Case",
    date: "1984-08-18",
    time: "08:03:00",
    latitude: 28.078611,
    longitude: -80.602778,
    bodies: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
  }
];

// Set date and timezone for each test case
for (const testCase of referenceData) {

  testCase.timezone = tzLookup(testCase.latitude, testCase.longitude);
  // Local time as Luxon DateTime objectt5 3f
  testCase.localDateTime = DateTime.fromFormat(`${testCase.date} ${testCase.time}`, 'yyyy-MM-dd HH:mm:ss', { zone: testCase.timezone });
  // UTC JS Date for Swiss Ephemeris
  testCase.utcDateTime = testCase.localDateTime.toUTC().toJSDate();
}


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


  for (const testCase of referenceData) {
    console.log(`\n📊 Testing: ${testCase.name}`);
    console.log(`Date (input): ${testCase.date} ${testCase.time} (${testCase?.timezone})`);
    console.log(`Location: ${testCase.latitude}°, ${testCase.longitude}°\n`);

    // Use localDateTime for HORIZONS request
    // const localString = testCase.localDateTime.toFormat('yyyy-MM-dd HH:mm:ss');
    // console.log('HORIZONS request datetime (local for observer):', localString);
      const { ascendant, midheaven } = getAscendantAndMC(testCase.date, testCase.time, testCase.latitude, testCase.longitude);

      console.log({
        ascendant,
        midheaven
      })
      const  { sign, degree, minutes, seconds } = convertToZodiac(ascendant)
      const  { sign: mcSign, degree: mcDegree, minutes: mcMinutes, seconds: mcSeconds } = convertToZodiac(midheaven);
      console.log(`Ascendant: ${sign} ${degree}°${minutes}'${seconds}"`);
      console.log(`Midheaven: ${mcSign} ${mcDegree}°${mcMinutes}'${mcSeconds}"\n`);


    // Color maps for elements and planets
    const signData = [
      { name: 'Aries', unicode: '♈', element: 'fire' },
      { name: 'Taurus', unicode: '♉', element: 'earth' },
      { name: 'Gemini', unicode: '♊', element: 'air' },
      { name: 'Cancer', unicode: '♋', element: 'water' },
      { name: 'Leo', unicode: '♌', element: 'fire' },
      { name: 'Virgo', unicode: '♍', element: 'earth' },
      { name: 'Libra', unicode: '♎', element: 'air' },
      { name: 'Scorpio', unicode: '♏', element: 'water' },
      { name: 'Sagittarius', unicode: '♐', element: 'fire' },
      { name: 'Capricorn', unicode: '♑', element: 'earth' },
      { name: 'Aquarius', unicode: '♒', element: 'air' },
      { name: 'Pisces', unicode: '♓', element: 'water' }
    ];

    const elementColors = {
      fire: colors.red.bold,
      earth: colors.green.bold,
      air: colors.cyan.bold,
      water: colors.blue.bold
    };

    const planetData = {
      Sun: { unicode: '☉', color: colors.yellow.bold },
      Moon: { unicode: '☽', color: colors.white.bold },
      Mercury: { unicode: '☿', color: colors.gray.bold },
      Venus: { unicode: '♀', color: colors.green.bold },
      Mars: { unicode: '♂', color: colors.red.bold },
      Jupiter: { unicode: '♃', color: colors.blue.bold },
      Saturn: { unicode: '♄', color: colors.magenta.bold }
    };

    for (const planet of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']) {
      const horizonsPlanet = horizonsPositions.find(p => p.name.toLowerCase() === planet.toLowerCase());
      let sweLongitude = null;
      try {
        sweLongitude = await getSwissephLongitude(jd, PLANET_MAP[planet.toLowerCase()]);
      } catch (err) {
        sweLongitude = null;
      }
      const horizonsLongitude = horizonsPlanet ? horizonsPlanet.longitude : null;
      // Use HORIZONS longitude for display if available, else Swiss Ephemeris
      const displayLongitude = typeof horizonsLongitude === 'number' ? horizonsLongitude : sweLongitude;
      let diffMinutes = null;
      if (typeof horizonsLongitude === 'number' && typeof sweLongitude === 'number' && !isNaN(horizonsLongitude) && !isNaN(sweLongitude)) {
        let diff = Math.abs(horizonsLongitude - sweLongitude);
        diff = Math.min(diff, 360 - diff); // handle wrap-around
        diffMinutes = (diff * 60).toFixed(1);
      }
      // Get zodiac info
      const zodiac = typeof displayLongitude === 'number' ? convertToZodiac(displayLongitude) : null;
      const signIdx = zodiac ? signData.findIndex(s => s.name === zodiac.sign) : -1;
      const sign = signIdx >= 0 ? signData[signIdx] : null;
      const signColor = sign ? elementColors[sign.element] : colors.white.bold;
      const planetInfo = planetData[planet];
      // Output
      if (planetInfo && zodiac && sign) {
        console.log(planetInfo.color(`${planetInfo.unicode} ${planet}`));
        console.log(planetInfo.color('============================='));
        console.log(colors.bold(`${zodiac.degree}° ${zodiac.minutes}' ${zodiac.seconds}"`));
        console.log(`Ruled by the sign ${signColor(`${sign.unicode} ${sign.name}`)}`);
        if (diffMinutes !== null) {
          const diffVal = parseFloat(diffMinutes);
          if (diffVal <= 1.0) {
            console.log(`${colors.green('✅')} ${colors.green.bold('Exact match!')}`);
          } else {
            console.log(`${colors.red('❌')} off by ${diffMinutes} arcmin`);
          }
        }
        console.log('');
      } else {
        // Fallback to table row if data missing
        const row = `| ${planet.padEnd(8)} | ${horizonsLongitude !== null ? horizonsLongitude.toFixed(8).padEnd(17) : 'ERR'.padEnd(17)} | ${sweLongitude !== null ? sweLongitude.toFixed(8).padEnd(24) : 'ERR'.padEnd(24)} | ${diffMinutes !== null ? diffMinutes.padEnd(19) : 'ERR'.padEnd(19)} |`;
        console.log(row);
      }
    }
  }
}

// Run the test
runAccuracyTest().catch(console.error);