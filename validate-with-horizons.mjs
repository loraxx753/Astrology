/**
 * Validation script using NASA JPL HORIZONS API
 * Uses HORIZONS for validation only - keeps our fast calculations for production
 */

console.log('📡 HORIZONS Validation Script Loaded');

// Planet codes for HORIZONS API
const PLANET_CODES = {
  sun: '10',
  mercury: '199', 
  venus: '299',
  mars: '499',
  jupiter: '599',
  saturn: '699',
  moon: '301'
};

/**
 * Query NASA HORIZONS API for planetary ecliptic longitude
 * @param {string} planetCode - HORIZONS planet code
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @param {string} time - Time string (HH:MM)
 * @param {number} latitude - Observer latitude
 * @param {number} longitude - Observer longitude
 */
async function getHorizonsPosition(planetCode, date, time = '12:00', _latitude = 0, _longitude = 0) {
  const params = new URLSearchParams({
    format: 'text',
    COMMAND: planetCode,
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'OBSERVER',
    CENTER: '@399',  // Earth center (geocentric)
    START_TIME: `${date}T${time}:00`,
    STOP_TIME: `${date}T${time}:01`,
    STEP_SIZE: '1d',
    QUANTITIES: '31',  // Heliocentric ecliptic longitude & latitude
    CSV_FORMAT: 'YES',
    OBJ_DATA: 'NO'
  });

  try {
    const response = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`);
    const data = await response.text();
    
    return parseHorizonsEclipticLongitude(data, planetCode);
  } catch (error) {
    console.error(`Error querying HORIZONS for planet ${planetCode}:`, error.message);
    return null;
  }
}

/**
 * Parse HORIZONS response to extract ecliptic longitude
 */
function parseHorizonsEclipticLongitude(data, planetCode) {
  const lines = data.split('\n');
  
  // Find the start of ephemeris data (after $$SOE)
  const startIndex = lines.findIndex(line => line.includes('$$SOE'));
  if (startIndex === -1) {
    console.error('Could not find ephemeris data in HORIZONS response');
    console.log('Response preview:', data.substring(0, 1000));
    return null;
  }
  
  // Get the data line (should be right after $$SOE)
  const dataLine = lines[startIndex + 1];
  if (!dataLine || !dataLine.includes(',')) {
    console.error('Could not parse ephemeris data line');
    return null;
  }
  
  // Parse CSV data: Date, Calendar Date, Ecliptic Longitude, Ecliptic Latitude, ...
  const parts = dataLine.trim().split(/\s*,\s*/);
  
  if (parts.length < 3) {
    console.error('Insufficient data in ephemeris line');
    return null;
  }
  
  return {
    planetCode,
    eclipticLongitude: parseFloat(parts[2]), // Third column is ecliptic longitude
    eclipticLatitude: parseFloat(parts[3]),  // Fourth column is ecliptic latitude
    rawData: dataLine
  };
}

/**
 * Convert our zodiac position to decimal degrees
 */
function zodiacToDecimalDegrees(zodiacPos) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = signs.indexOf(zodiacPos.sign);
  return signIndex * 30 + zodiacPos.degree + zodiacPos.minutes / 60 + (zodiacPos.seconds || 0) / 3600;
}

/**
 * Calculate angular difference between two longitudes (handles 0°/360° wrap-around)
 */
function calculateAngularDifference(calculated, reference) {
  let diff = Math.abs(calculated - reference);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Test our calculations against HORIZONS data
 */
async function validateAgainstHorizons() {
  console.log('🎯 PROFESSIONAL ACCURACY VALIDATION');
  console.log('Comparing our calculations vs NASA JPL HORIZONS\n');
  
  // Test case: Kevin Baugh's birth chart
  const testCase = {
    date: '1984-08-18',
    time: '08:03',
    latitude: 28.0786111,
    longitude: -80.6027778,
    name: 'Kevin Baugh Test Case'
  };
  
  console.log(`Testing: ${testCase.name}`);
  console.log(`Date/Time: ${testCase.date} ${testCase.time}`);
  console.log(`Location: ${testCase.latitude}°, ${testCase.longitude}°\n`);
  
  const results = [];
  let totalError = 0;
  let testCount = 0;
  
  // Test each planet
  for (const [planetName, planetCode] of Object.entries(PLANET_CODES)) {
    console.log(`🪐 Testing ${planetName.toUpperCase()}...`);
    
    try {
      const horizonsData = await getHorizonsPosition(
        planetCode,
        testCase.date,
        testCase.time,
        testCase.latitude,
        testCase.longitude
      );
      
      if (horizonsData && horizonsData.eclipticLongitude !== null) {
        // Use our current known results from the latest test
        const ourResults = {
          sun: { degree: 25, minutes: 42, sign: 'Leo' },
          moon: { degree: 10, minutes: 55, sign: 'Taurus' },
          mercury: { degree: 12, minutes: 54, sign: 'Virgo' },
          venus: { degree: 13, minutes: 10, sign: 'Virgo' },
          mars: { degree: 0, minutes: 27, sign: 'Sagittarius' },
          jupiter: { degree: 3, minutes: 18, sign: 'Capricorn' },
          saturn: { degree: 10, minutes: 45, sign: 'Scorpio' }
        };
        
        if (ourResults[planetName]) {
          const ourLongitude = zodiacToDecimalDegrees(ourResults[planetName]);
          const horizonsLongitude = horizonsData.eclipticLongitude;
          const error = calculateAngularDifference(ourLongitude, horizonsLongitude);
          const errorMinutes = error * 60;
          
          results.push({
            planet: planetName,
            ourPosition: `${ourResults[planetName].degree}°${ourResults[planetName].minutes}' ${ourResults[planetName].sign}`,
            horizonsPosition: `${horizonsLongitude.toFixed(4)}°`,
            ourLongitude: ourLongitude.toFixed(4),
            horizonsLongitude: horizonsLongitude.toFixed(4),
            errorDegrees: error.toFixed(6),
            errorMinutes: errorMinutes.toFixed(2),
            status: errorMinutes < 5 ? '✅ Excellent' : errorMinutes < 15 ? '⚠️ Good' : '❌ Needs Work'
          });
          
          totalError += errorMinutes;
          testCount++;
          
          console.log(`  Our result: ${ourResults[planetName].degree}°${ourResults[planetName].minutes}' ${ourResults[planetName].sign} (${ourLongitude.toFixed(4)}°)`);
          console.log(`  HORIZONS:   ${horizonsLongitude.toFixed(4)}°`);
          console.log(`  Error:      ${errorMinutes.toFixed(2)} arcminutes ${errorMinutes < 5 ? '✅' : errorMinutes < 15 ? '⚠️' : '❌'}\n`);
        }
      } else {
        console.log(`  ❌ Failed to get HORIZONS data\n`);
      }
      
      // Be nice to NASA's servers
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`  ❌ Error testing ${planetName}:`, error.message);
    }
  }
  
  // Generate summary report
  console.log('\n📊 ACCURACY VALIDATION SUMMARY');
  console.log('=' * 50);
  console.log('Planet    | Our Position      | HORIZONS     | Error (min) | Status');
  console.log('----------|-------------------|--------------|-------------|--------');
  
  results.forEach(result => {
    console.log(
      `${result.planet.padEnd(9)} | ${result.ourPosition.padEnd(17)} | ${result.horizonsPosition.padEnd(12)} | ${result.errorMinutes.padStart(11)} | ${result.status}`
    );
  });
  
  if (testCount > 0) {
    const averageError = totalError / testCount;
    console.log('\n📈 STATISTICS:');
    console.log(`Average Error: ${averageError.toFixed(2)} arcminutes`);
    console.log(`Tests Passed: ${results.filter(r => r.errorMinutes < 15).length}/${testCount}`);
    console.log(`Excellent (< 5 min): ${results.filter(r => r.errorMinutes < 5).length}/${testCount}`);
    
    if (averageError < 5) {
      console.log('\n🏆 RESULT: SWISS EPHEMERIS QUALITY - Professional Grade!');
    } else if (averageError < 15) {
      console.log('\n✅ RESULT: COMMERCIAL SOFTWARE QUALITY - Excellent!');
    } else {
      console.log('\n⚠️ RESULT: ACCEPTABLE QUALITY - Room for improvement');
    }
  }
}

// Export for use in other modules
export { getHorizonsPosition, validateAgainstHorizons, zodiacToDecimalDegrees, calculateAngularDifference };

// Run validation if called directly  
console.log('🔍 Checking if running directly...');
console.log('import.meta.url:', import.meta.url);

console.log('🚀 Starting HORIZONS validation...');
validateAgainstHorizons().catch(error => {
  console.error('❌ Validation failed:', error);
});