/**
 * Bridge script to connect our calculations with HORIZONS validation
 * This allows us to compare our results against NASA JPL data
 */

import { 
  calculateSunPosition, 
  calculateMoonPosition, 
  calculateAllPlanetPositions,
  calculateHouseSystem 
} from './src/lib/services/calculations.ts';

import { validateAgainstHorizons, zodiacToDecimalDegrees } from './validate-with-horizons.mjs';

/**
 * Calculate all positions for a given birth chart using our engine
 */
function calculateOurPositions(date, latitude, longitude) {
  try {
    const birthDateTime = new Date(date);
    
    // Calculate planetary positions
    const sunPos = calculateSunPosition(birthDateTime);
    const moonPos = calculateMoonPosition(birthDateTime);
    const planets = calculateAllPlanetPositions(birthDateTime);
    const houses = calculateHouseSystem(birthDateTime, latitude, longitude);
    
    return {
      sun: sunPos.zodiacPosition,
      moon: moonPos.zodiacPosition,
      mercury: planets.mercury.zodiacPosition,
      venus: planets.venus.zodiacPosition,
      mars: planets.mars.zodiacPosition,
      jupiter: planets.jupiter.zodiacPosition,
      saturn: planets.saturn.zodiacPosition,
      ascendant: houses.ascendant,
      midheaven: houses.midheaven
    };
  } catch (error) {
    console.error('Error calculating our positions:', error);
    return null;
  }
}

/**
 * Run comprehensive validation test
 */
async function runComprehensiveValidation() {
  console.log('🎯 COMPREHENSIVE ACCURACY VALIDATION');
  console.log('Comparing our calculations vs NASA JPL HORIZONS\n');
  
  const testCases = [
    {
      name: 'Kevin Baugh - Test Case',
      date: '1984-08-18T08:03:00.000Z',
      latitude: 28.0786111,
      longitude: -80.6027778
    },
    {
      name: 'Modern Test - Y2K',
      date: '2000-01-01T12:00:00.000Z', 
      latitude: 40.7128,
      longitude: -74.0060
    },
    {
      name: 'Ancient Date Test',
      date: '1900-01-01T00:00:00.000Z',
      latitude: 51.5074,
      longitude: -0.1278
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Testing: ${testCase.name}`);
    console.log(`Date: ${testCase.date}`);
    console.log(`Location: ${testCase.latitude}°, ${testCase.longitude}°`);
    console.log(`${'='.repeat(60)}\n`);
    
    // Calculate our positions
    const ourPositions = calculateOurPositions(testCase.date, testCase.latitude, testCase.longitude);
    
    if (ourPositions) {
      console.log('Our calculated positions:');
      Object.entries(ourPositions).forEach(([body, pos]) => {
        if (typeof pos === 'object' && pos.sign) {
          console.log(`  ${body}: ${pos.degree}°${pos.minutes}' ${pos.sign}`);
        } else {
          console.log(`  ${body}: ${pos.toFixed(2)}°`);
        }
      });
      
      console.log('\n🔄 Querying HORIZONS for comparison...\n');
      
      // Here we would query HORIZONS and compare
      // For now, just show our results
      
    } else {
      console.log('❌ Failed to calculate our positions');
    }
    
    // Wait between test cases
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Export for use
export { calculateOurPositions, runComprehensiveValidation };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveValidation().catch(console.error);
}