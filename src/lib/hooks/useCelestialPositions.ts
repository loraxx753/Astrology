import { useQuery } from '@apollo/client';
import { getZodiacFromLongitude } from '../services/calculate/astrology';
import { formatOrb } from '../services/calculations';
import { calculateHouseSystem } from '../services/calculations';
import { PLANETARY_POSITIONS_QUERY } from '../queries/GET';

const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8 },
  { name: 'Opposition', angle: 180, orb: 8 },
  { name: 'Trine', angle: 120, orb: 6 },
  { name: 'Square', angle: 90, orb: 6 },
  { name: 'Sextile', angle: 60, orb: 4 },
  { name: 'Quincunx', angle: 150, orb: 3 }, // Inconjunct
  { name: 'Semisextile', angle: 30, orb: 2 },
  { name: 'Semisquare', angle: 45, orb: 2 },
  { name: 'Sesquiquadrate', angle: 135, orb: 2 },
  { name: 'Quintile', angle: 72, orb: 1.5 },
  { name: 'Biquintile', angle: 144, orb: 1.5 },
  { name: 'Septile', angle: 51.43, orb: 1 },
  { name: 'Novile', angle: 40, orb: 1 },
  { name: 'Decile', angle: 36, orb: 1 },
  { name: 'Undecile', angle: 32.73, orb: 1 },
];

interface AspectResult {
  planetA: string;
  planetB: string;
  aspect: string;
  orb: {
    degree: number;
    minutes: number;
    seconds: number;
    float: number;
  };
}

function getAspects(positions: Planet[]): AspectResult[] {
  const aspects: AspectResult[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i];
      const b = positions[j];
      const diff = Math.abs(((a.longitude - b.longitude + 360) % 360));
      for (const aspect of ASPECTS) {
        const delta = Math.min(diff, 360 - diff);
        if (Math.abs(delta - aspect.angle) <= aspect.orb) {
          aspects.push({
            planetA: a.name,
            planetB: b.name,
            aspect: aspect.name,
            orb: formatOrb(Math.abs(delta - aspect.angle)),
          });
        }
      }
    }
  }
  // Sort aspects by the order in ASPECTS array
  aspects.sort((a, b) => {
    const aIdx = ASPECTS.findIndex(x => x.name === a.aspect);
    const bIdx = ASPECTS.findIndex(x => x.name === b.aspect);
    return aIdx - bIdx;
  });
  return aspects;
}

export interface ChartReadingInput {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  bodies: string[];
}

type ZodiacSign = {
  degree: number;
  minutes: number;
  seconds: number;
  sign: string;
};

type Planet = { 
  name: string;
  longitude: number;
  latitude: number;
  ra: number;
  dec: number;
  dateStr: string;
  sign: ZodiacSign;
  northNodeLongitude?: number;
  southNodeLongitude?: number;
};

type HouseCusps = { [key: number]: ZodiacSign };

type Reading = {
  positions: Planet[];
  aspects?: Array<{
    planetA: string;
    planetB: string;
    aspect: string;
    orb: {
      degree: number;
      minutes: number;
      seconds: number;
      float: number;
    }
  }>;
  angles?: {
    ascendant: ZodiacSign;
    midheaven: ZodiacSign;
    descendant: ZodiacSign;
    imumCoeli: ZodiacSign;
  };
  northNode?: ZodiacSign;
  southNode?: ZodiacSign;
  houses?: {
    cusps: HouseCusps;
    system: string;
  };
};

export default function (input?: ChartReadingInput) {
  const reading: Reading = {
    positions: [],
  };
  const { data:positions, loading, error } = useQuery(PLANETARY_POSITIONS_QUERY, {
    variables: input as ChartReadingInput,
    skip: !input,
  });

  if (positions && !loading && !error) {
    // Calculate houses and angles (default to placidus, or allow system override via input if desired)
    const dateObj = new Date(`${input!.date}T${input!.time.length === 5 ? input!.time + ':00' : input!.time}Z`);
    const houseResult = calculateHouseSystem(dateObj, input!.latitude, input!.longitude, 'placidus');
    reading.angles = {
      ascendant: getZodiacFromLongitude(houseResult.ascendant),
      midheaven: getZodiacFromLongitude(houseResult.midheaven),
      descendant: getZodiacFromLongitude(houseResult.descendant),
      imumCoeli: getZodiacFromLongitude(houseResult.imumCoeli),
    };
    reading.houses = {
      cusps: Object.entries(houseResult.cusps)
        .map(([key, value]) => ({ [key]: getZodiacFromLongitude(value) }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      system: houseResult.system,
    };
    reading.aspects = getAspects(positions.planetaryPositions);

    positions?.planetaryPositions.forEach((planet: Planet) => {
      const result: Planet = {
        name: planet.name,
        longitude: planet.longitude || 0,
        latitude: planet.latitude || 0,
        ra: planet.sign?.minutes || 0,
        dec: planet.sign?.seconds || 0,
        dateStr: new Date().toISOString(),
        sign: getZodiacFromLongitude(planet.longitude),
      };

      if(planet.name == 'Moon') {
        if(planet.northNodeLongitude !== undefined) {
          reading.northNode = getZodiacFromLongitude(planet.northNodeLongitude);
        }
        if(planet.southNodeLongitude !== undefined) {
          reading.southNode = getZodiacFromLongitude(planet.southNodeLongitude);
        }
      }
      reading.positions.push(result);
    });
  }
  return { reading, loading, error };
}