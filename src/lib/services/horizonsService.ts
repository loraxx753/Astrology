import { raDecToEclipticOfDate, jdTTfromUTC, jdUTC } from '../utils';

// Alias for birth chart usage
export async function getHorizonsBirthChartPositions(
  datetime: string,
  latitude: number,
  longitude: number,
  bodies: string[]
): Promise<HorizonsPlanetPosition[]> {
  return await fetchHorizonsPositions({
    datetime,
    location: { lat: latitude, lon: longitude },
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
  distance?: number;  // AU or km, as returned
  ra: number;        // degrees, apparent RA
  dec: number;       // degrees, apparent Dec
  dateStr: string;   // timestamp string from HORIZONS
}

export interface HorizonsRequestOptions {
  datetime: string; // ISO string
  location: { lat: number; lon: number };
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
    // Request RA/Dec and range data
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='${id}'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${startStr}'&STOP_TIME='${stopStr}'&STEP_SIZE='1 m'&QUANTITIES='1,2'&ANG_FORMAT='DEG'&CSV_FORMAT='YES'`;
    let resp, json;
    try {
      resp = await fetch(url);
      json = await resp.json();
    } catch (err) {
      console.error(`[HORIZONS] Fetch error for ${body}:`, err);
      continue;
    }

    const block = json.result.match(/\$\$SOE([\s\S]*?)\$\$EOE/);
    if (!block) throw new Error("No data section");

    const lines = block[1].trim().split('\n').filter(Boolean);
    for (const line of lines) {
      // Example line:
      // 2000-Jan-01 18:00, , ,    38.76084,   12.61588,     38.76021,    12.61436,
      const cols = line.split(',').map((s:string) => s.trim());

      const dateStr = cols[0];               // "2000-Jan-01 18:00"
      const raICRF  = parseFloat(cols[3]);   // not used for charts
      const decICRF = parseFloat(cols[4]);   // not used for charts
      const raApp   = parseFloat(cols[5]);   // <-- use this
      const decApp  = parseFloat(cols[6]);   // <-- use this


      const jdInUTC = jdUTC(new Date(dateStr));
      const jdTT = jdTTfromUTC(jdInUTC, 69); // approx. delta T
      // Convert apparent RA/Dec (deg, equator/equinox of date) -> ecliptic-of-date:
      const { lon, lat } = raDecToEclipticOfDate(raApp, decApp, jdTT);
      results.push({ name: body, ra: raApp, dec: decApp, longitude: lon, latitude: lat, dateStr });
    }


    // // Log the raw response for debugging
    // if (!text.includes('$$SOE')) {
    //   console.error(`[HORIZONS] No $$SOE found for ${body}. Raw response:`);
    //   console.error(text);
    //   continue;
    // }
    // const match = text.match(/\$\$SOE([\s\S]*?)\$\$EOE/);
    // if (match) {
    //   const lines = match[1].trim().split('\n');
    //   if (lines.length) {
    //     const fields = lines[0].trim().split(/\s+/);
    //     console.log(`[HORIZONS] Split fields for ${body}:`, fields);
    //     // With QUANTITIES='31,32,20', columns are:
    //     // 0: date, 1: time, 2: ecl. longitude (deg), 3: ecl. latitude (deg), 4: range (AU)
    //     const longitude = parseFloat(fields[3]);
    //     const latitude = parseFloat(fields[4]);
    //     const distance = parseFloat(fields[8]);
    //     results.push({
    //       name: body,
    //       longitude,
    //       latitude,
    //       distance,
    //     });
    //   } else {
    //     console.error(`[HORIZONS] No data lines found for ${body}.`);
    //   }
    // } else {
    //   console.error(`[HORIZONS] Could not parse $$SOE/$$EOE block for ${body}.`);
    // }
  }
  return results;
}
