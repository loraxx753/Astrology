// Alias for birth chart usage
export async function getHorizonsBirthChartPositions(
  datetime: string,
  latitude: number,
  longitude: number,
  elevation: number = 0,
  bodies: string[]
): Promise<HorizonsPlanetPosition[]> {
  return await fetchHorizonsPositions({
    datetime,
    location: { lat: latitude, lon: longitude, elev: elevation },
    bodies,
  });
}
// horizonsService.ts
// Fetches planetary positions from NASA HORIZONS and returns them for astrological calculations.
// This is a basic scaffold. You can expand error handling, caching, and support for more bodies as needed.


export interface HorizonsPlanetPosition {
  name: string;
  longitude: number; // degrees
  latitude: number;  // degrees
  distance: number;  // AU or km, as returned
}

export interface HorizonsRequestOptions {
  datetime: string; // ISO string
  location: { lat: number; lon: number; elev?: number };
  bodies: string[]; // e.g., ['Mercury', 'Venus', 'Mars']
}

// Map planet names to HORIZONS IDs
const HORIZONS_IDS: Record<string, string> = {
  Mercury: '199',
  Venus: '299',
  Earth: '399',
  Mars: '499',
  Jupiter: '599',
  Saturn: '699',
  Uranus: '799',
  Neptune: '899',
  Pluto: '999',
  Sun: '10',
  Moon: '301',
};

export async function fetchHorizonsPositions(options: HorizonsRequestOptions): Promise<HorizonsPlanetPosition[]> {
  const results: HorizonsPlanetPosition[] = [];
  for (const body of options.bodies) {
    const id = HORIZONS_IDS[body];
    if (!id) continue;
    // Calculate STOP_TIME as 1 minute after START_TIME
    const start = new Date(options.datetime);
    const stop = new Date(start.getTime() + 60 * 1000); // +1 minute
    const startStr = start.toISOString().replace(/\.\d{3}Z$/, '').replace('T', ' ');
    const stopStr = stop.toISOString().replace(/\.\d{3}Z$/, '').replace('T', ' ');
    // Request ecliptic longitude (31), latitude (32), and range (20)
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='${id}'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='coord@399'&SITE_COORD='${options.location.lon},${options.location.lat},${options.location.elev||0}'&START_TIME='${startStr}'&STOP_TIME='${stopStr}'&STEP_SIZE='1 m'&QUANTITIES='31,32,20'`;
    let resp, text;
    try {
      resp = await fetch(url);
      text = await resp.text();
    } catch (err) {
      console.error(`[HORIZONS] Fetch error for ${body}:`, err);
      continue;
    }
    // Log the raw response for debugging
    if (!text.includes('$$SOE')) {
      console.error(`[HORIZONS] No $$SOE found for ${body}. Raw response:`);
      console.error(text);
      continue;
    }
    const match = text.match(/\$\$SOE([\s\S]*?)\$\$EOE/);
    if (match) {
      const lines = match[1].trim().split('\n');
      if (lines.length) {
        const fields = lines[0].trim().split(/\s+/);
        console.log(`[HORIZONS] Split fields for ${body}:`, fields);
        // With QUANTITIES='31,32,20', columns are:
        // 0: date, 1: time, 2: ecl. longitude (deg), 3: ecl. latitude (deg), 4: range (AU)
        const longitude = parseFloat(fields[3]);
        const latitude = parseFloat(fields[4]);
        const distance = parseFloat(fields[8]);
        results.push({
          name: body,
          longitude,
          latitude,
          distance,
        });
      } else {
        console.error(`[HORIZONS] No data lines found for ${body}.`);
      }
    } else {
      console.error(`[HORIZONS] Could not parse $$SOE/$$EOE block for ${body}.`);
    }
  }
  return results;
}
