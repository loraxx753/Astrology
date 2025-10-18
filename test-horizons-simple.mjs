// Simple test to understand HORIZONS API format
const testUrl = 'https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=299&MAKE_EPHEM=YES&EPHEM_TYPE=OBSERVER&CENTER=@399&START_TIME=1984-08-18&STOP_TIME=1984-08-19&STEP_SIZE=1d&QUANTITIES=31&CSV_FORMAT=YES&OBJ_DATA=NO';

fetch(testUrl)
  .then(response => response.text())
  .then(data => {
    console.log('HORIZONS Response:');
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });