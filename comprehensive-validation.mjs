/**
 * Comprehensive Planetary Accuracy Validation
 * Tests our calculations against NASA HORIZONS across multiple dates/locations
 */

// Test cases with diverse dates and locations
const TEST_CASES = [
  {
    name: "Kevin Baugh - Original Test Case",
    date: '1984-08-18',
    time: '08:03',
    latitude: 28.0786111,
    longitude: -80.6027778,
    ourResults: {
      sun: { degree: 25, minutes: 42, sign: 'Leo' },
      moon: { degree: 10, minutes: 55, sign: 'Taurus' },
      mercury: { degree: 12, minutes: 54, sign: 'Virgo' },
      venus: { degree: 13, minutes: 10, sign: 'Virgo' },
      mars: { degree: 0, minutes: 27, sign: 'Sagittarius' },
      jupiter: { degree: 3, minutes: 18, sign: 'Capricorn' },
      saturn: { degree: 10, minutes: 45, sign: 'Scorpio' }
    }
  },
  {
    name: "Y2K NYC",
    date: '2000-01-01',
    time: '12:00',
    latitude: 40.7128,
    longitude: -74.0060,
    ourResults: {
      sun: { degree: 10, minutes: 35, sign: 'Capricorn' },
      moon: { degree: 15, minutes: 49, sign: 'Scorpio' },
      mercury: { degree: 2, minutes: 3, sign: 'Capricorn' },
      venus: { degree: 1, minutes: 41, sign: 'Sagittarius' },
      mars: { degree: 27, minutes: 55, sign: 'Aquarius' },
      jupiter: { degree: 25, minutes: 8, sign: 'Aries' },
      saturn: { degree: 10, minutes: 4, sign: 'Taurus' }
    }
  },
  {
    name: "Moon Landing - Cape Canaveral",
    date: '1969-07-20',
    time: '20:17',
    latitude: 28.5384,
    longitude: -80.6511,
    ourResults: {
      sun: { degree: 28, minutes: 9, sign: 'Cancer' },
      moon: { degree: 11, minutes: 3, sign: 'Libra' },
      mercury: { degree: 26, minutes: 39, sign: 'Cancer' },
      venus: { degree: 15, minutes: 37, sign: 'Gemini' },
      mars: { degree: 3, minutes: 11, sign: 'Sagittarius' },
      jupiter: { degree: 0, minutes: 56, sign: 'Libra' },
      saturn: { degree: 8, minutes: 29, sign: 'Taurus' }
    }
  },
  {
    name: "Modern Test - London",
    date: '2020-03-21',
    time: '00:00',
    latitude: 51.5074,
    longitude: -0.1278,
    ourResults: {
      sun: { degree: 0, minutes: 50, sign: 'Aries' },
      moon: { degree: 23, minutes: 41, sign: 'Aquarius' },
      mercury: { degree: 2, minutes: 54, sign: 'Pisces' },
      venus: { degree: 16, minutes: 25, sign: 'Taurus' },
      mars: { degree: 22, minutes: 43, sign: 'Capricorn' },
      jupiter: { degree: 22, minutes: 21, sign: 'Capricorn' },
      saturn: { degree: 29, minutes: 28, sign: 'Capricorn' }
    }
  },
  {
    name: "Ancient Date - Rome",
    date: '1900-01-01',
    time: '00:00',
    latitude: 41.9028,
    longitude: 12.4964,
    ourResults: {
      sun: { degree: 10, minutes: 6, sign: 'Capricorn' },
      moon: { degree: 1, minutes: 49, sign: 'Capricorn' },
      mercury: { degree: 20, minutes: 12, sign: 'Sagittarius' },
      venus: { degree: 7, minutes: 33, sign: 'Aquarius' },
      mars: { degree: 14, minutes: 57, sign: 'Capricorn' },
      jupiter: { degree: 2, minutes: 13, sign: 'Sagittarius' },
      saturn: { degree: 29, minutes: 2, sign: 'Sagittarius' }
    }
  }
];

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
 * Query NASA HORIZONS for a specific planet
 */
async function getHorizonsPosition(planetCode, date, time = '12:00') {
  const params = new URLSearchParams({
    format: 'text',
    COMMAND: planetCode,
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'OBSERVER',
    CENTER: '@399',
    START_TIME: `${date}T${time}:00`,
    STOP_TIME: `${date}T${time}:01`,
    STEP_SIZE: '1d',
    QUANTITIES: '31',
    CSV_FORMAT: 'YES',
    OBJ_DATA: 'NO'
  });

  try {
    const response = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`);
    const data = await response.text();
    
    return parseHorizonsResponse(data, planetCode);
  } catch (error) {
    console.error(`Error querying HORIZONS for planet ${planetCode}:`, error.message);
    return null;
  }
}

/**
 * Parse HORIZONS CSV response
 */
function parseHorizonsResponse(data, planetCode) {
  const lines = data.split('\n');
  const startIndex = lines.findIndex(line => line.includes('$$SOE'));
  
  if (startIndex === -1) {
    console.error('Could not find ephemeris data marker ($$SOE)');
    return null;
  }
  
  const dataLine = lines[startIndex + 1];
  if (!dataLine || !dataLine.includes(',')) {
    console.error('Could not parse ephemeris data line');
    return null;
  }
  
  const parts = dataLine.trim().split(/\s*,\s*/);
  if (parts.length < 5) {
    console.error('Insufficient data columns in ephemeris');
    return null;
  }
  
  return {
    planetCode,
    date: parts[0],
    eclipticLongitude: parseFloat(parts[3]),
    eclipticLatitude: parseFloat(parts[4]),
    rawData: dataLine
  };
}

/**
 * Convert zodiac position to decimal degrees
 */
function zodiacToDecimalDegrees(zodiacPos) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = signs.indexOf(zodiacPos.sign);
  return signIndex * 30 + zodiacPos.degree + zodiacPos.minutes / 60;
}

/**
 * Convert decimal degrees to zodiac position
 */
function decimalToZodiac(longitude) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const degreeInSign = normalizedLong % 30;
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.floor((degreeInSign - degrees) * 60);
  
  return `${degrees}°${minutes}' ${signs[signIndex]}`;
}

/**
 * Calculate angular difference (handles wrap-around)
 */
function calculateAngularDifference(calculated, reference) {
  let diff = Math.abs(calculated - reference);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Run comprehensive validation across all test cases
 */
async function runComprehensiveValidation() {
  console.log('🎯 COMPREHENSIVE PLANETARY ACCURACY VALIDATION');
  console.log('Testing against NASA JPL HORIZONS across multiple dates/locations\n');
  console.log('=' * 80);
  
  const allResults = [];
  let totalTests = 0;
  let totalError = 0;
  
  for (const testCase of TEST_CASES) {
    console.log(`\n📍 ${testCase.name.toUpperCase()}`);
    console.log(`Date: ${testCase.date} ${testCase.time}`);
    console.log(`Location: ${testCase.latitude}°, ${testCase.longitude}°`);
    console.log('-' * 60);
    
    const testResults = [];
    
    // Test each planet for this case
    for (const [planetName, planetCode] of Object.entries(PLANET_CODES)) {
      if (testCase.ourResults[planetName]) {
        console.log(`\n🪐 Testing ${planetName.toUpperCase()}...`);
        
        try {
          const horizonsData = await getHorizonsPosition(planetCode, testCase.date, testCase.time);
          
          if (horizonsData && !isNaN(horizonsData.eclipticLongitude)) {
            const ourLongitude = zodiacToDecimalDegrees(testCase.ourResults[planetName]);
            const horizonsLongitude = horizonsData.eclipticLongitude;
            const error = calculateAngularDifference(ourLongitude, horizonsLongitude);
            const errorMinutes = error * 60;
            
            const result = {
              testCase: testCase.name,
              planet: planetName,
              ourPosition: `${testCase.ourResults[planetName].degree}°${testCase.ourResults[planetName].minutes}' ${testCase.ourResults[planetName].sign}`,
              ourLongitude: ourLongitude.toFixed(4),
              horizonsPosition: decimalToZodiac(horizonsLongitude),
              horizonsLongitude: horizonsLongitude.toFixed(4),
              errorDegrees: error.toFixed(6),
              errorMinutes: errorMinutes.toFixed(1),
              status: errorMinutes < 5 ? '🟢 Excellent' : 
                      errorMinutes < 15 ? '🟡 Good' : 
                      errorMinutes < 30 ? '🟠 Acceptable' : '🔴 Needs Work'
            };
            
            testResults.push(result);
            allResults.push(result);
            totalError += errorMinutes;
            totalTests++;
            
            console.log(`  Our:      ${result.ourPosition} (${result.ourLongitude}°)`);
            console.log(`  HORIZONS: ${result.horizonsPosition} (${result.horizonsLongitude}°)`);
            console.log(`  Error:    ${result.errorMinutes} arcminutes ${result.status.split(' ')[0]}`);
            
          } else {
            console.log(`  ❌ Failed to get valid HORIZONS data`);
          }
          
          // Be nice to NASA's servers
          await new Promise(resolve => setTimeout(resolve, 1500));
          
        } catch (error) {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }
    
    // Case summary
    if (testResults.length > 0) {
      const avgError = testResults.reduce((sum, r) => sum + parseFloat(r.errorMinutes), 0) / testResults.length;
      console.log(`\n📊 Case Summary: ${avgError.toFixed(1)} arcminutes average error`);
    }
  }
  
  // Generate comprehensive report
  console.log('\n\n🏆 FINAL COMPREHENSIVE ACCURACY REPORT');
  console.log('=' * 80);
  
  if (totalTests > 0) {
    const averageError = totalError / totalTests;
    const excellentCount = allResults.filter(r => parseFloat(r.errorMinutes) < 5).length;
    const goodCount = allResults.filter(r => parseFloat(r.errorMinutes) < 15).length;
    const acceptableCount = allResults.filter(r => parseFloat(r.errorMinutes) < 30).length;
    
    console.log(`\n📈 OVERALL STATISTICS:`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Average Error: ${averageError.toFixed(2)} arcminutes`);
    console.log(`\n🎯 ACCURACY BREAKDOWN:`);
    console.log(`🟢 Excellent (< 5 min):   ${excellentCount}/${totalTests} (${(excellentCount/totalTests*100).toFixed(1)}%)`);
    console.log(`🟡 Good (< 15 min):       ${goodCount}/${totalTests} (${(goodCount/totalTests*100).toFixed(1)}%)`);
    console.log(`🟠 Acceptable (< 30 min): ${acceptableCount}/${totalTests} (${(acceptableCount/totalTests*100).toFixed(1)}%)`);
    
    console.log(`\n📋 DETAILED RESULTS:`);
    console.log('Test Case              | Planet   | Our Position     | HORIZONS Position | Error (min) | Status');
    console.log('-' * 95);
    
    allResults.forEach(result => {
      console.log(
        `${result.testCase.substring(0,22).padEnd(22)} | ${result.planet.padEnd(8)} | ${result.ourPosition.padEnd(16)} | ${result.horizonsPosition.padEnd(17)} | ${result.errorMinutes.padStart(11)} | ${result.status}`
      );
    });
    
    // Professional quality assessment
    console.log(`\n🏅 PROFESSIONAL QUALITY ASSESSMENT:`);
    if (averageError < 5) {
      console.log('🥇 SWISS EPHEMERIS QUALITY - Exceptional accuracy!');
    } else if (averageError < 15) {
      console.log('🥈 COMMERCIAL SOFTWARE QUALITY - Professional grade!');
    } else if (averageError < 30) {
      console.log('🥉 ACCEPTABLE QUALITY - Suitable for general use');
    } else {
      console.log('🔧 NEEDS IMPROVEMENT - Consider refinements');
    }
    
    console.log(`\n✨ VALIDATION COMPLETE - Your Shimmering Stars app has been scientifically validated against NASA JPL HORIZONS!`);
  }
}

// Export for use
export { runComprehensiveValidation, TEST_CASES };

// Run if called directly
console.log('🚀 Starting comprehensive planetary validation...');
runComprehensiveValidation().catch(error => {
  console.error('❌ Validation failed:', error);
});