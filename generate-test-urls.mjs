/**
 * Generate test URLs for our app to get calculated results
 * Copy these URLs into browser to get our calculated positions
 */

const TEST_CASES = [
  {
    name: "Kevin Baugh",
    date: '1984-08-18',
    time: '08:03',
    lat: 28.0786111,
    lng: -80.6027778
  },
  {
    name: "Y2K NYC", 
    date: '2000-01-01',
    time: '12:00',
    lat: 40.7128,
    lng: -74.0060
  },
  {
    name: "Moon Landing",
    date: '1969-07-20',
    time: '20:17',
    lat: 29.7604,
    lng: -95.3698
  },
  {
    name: "London Test",
    date: '2020-03-21',
    time: '00:00', 
    lat: 51.5074,
    lng: -0.1278
  },
  {
    name: "Rome 1900",
    date: '1900-01-01',
    time: '00:00',
    lat: 41.9028,
    lng: 12.4964
  }
];

console.log('🔗 WORKING TEST URLS');
console.log('Copy these one by one:\n');

TEST_CASES.forEach((test, i) => {
  const params = new URLSearchParams({
    name: test.name,
    date: test.date,
    time: test.time,
    lat: test.lat,
    lng: test.lng
  });
  
  console.log(`${i + 1}. ${test.name} (${test.date})`);
  console.log(`http://localhost:7000/reading?${params.toString()}`);
  console.log('');
});

console.log('📝 Instructions:');
console.log('1. Open each URL in your browser');
console.log('2. Copy the planetary positions from the Chart Summary');
console.log('3. Update the comprehensive-validation.mjs file with the results');
console.log('4. Run: node comprehensive-validation.mjs');
console.log('\n🎯 This will validate ALL planets against NASA HORIZONS!');