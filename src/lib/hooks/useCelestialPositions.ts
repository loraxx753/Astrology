import { useQuery } from '@apollo/client';
import { convertToZodiac } from '../services/calculate/astrology';
import { formatOrb } from '../services/calculations';
import { PLANETARY_POSITIONS_QUERY, HOUSES_QUERY } from '../queries/GET';

const aspectGlyphs: Record<string, string> = {
  Conjunction: '☌',
  Opposition: '☍',
  Trine: '△',
  Square: '□',
  Sextile: '⚹',
  Quincunx: '⚻',
  Semisextile: '⚺',
  Semisquare: '∠',
  Sesquiquadrate: '⚼',
  Quintile: 'Q',
  Biquintile: 'BQ',
  Septile: '7',
  Novile: '9',
  Decile: '10',
  Undecile: '11',
};

const aspectNames = [
  'Conjunction',    // 1/1
  'Opposition',     // 1/2
  'Trine',          // 1/3
  'Square',         // 1/4
  'Quintile',       // 1/5
  'Sextile',        // 1/6
  'Septile',        // 1/7
  'Octile',         // 1/8 (Semisquare)
  'Novile',         // 1/9
  'Decile',         // 1/10
  'Undecile',       // 1/11
];

const aspectOrbs = [8, 8, 6, 6, 1.5, 4, 1, 2, 1, 1, 1];

const ASPECTS = aspectNames.map((name, i) => {
  const angle = i === 0 ? 0 : 360 / (i + 1);
  const orb = aspectOrbs[i];
  return {
    name,
    angle,
    orb,
    glyph: aspectGlyphs[name] || '',
  };
});

interface AspectResult {
  planetA: string;
  planetB: string;
  aspect: string;
  glyph: string;
  index: number;
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
      ASPECTS.forEach((aspect, index) => {
        const delta = Math.min(diff, 360 - diff);
        if (Math.abs(delta - aspect.angle) <= aspect.orb) {
          aspects.push({
            planetA: a.name,
            planetB: b.name,
            aspect: aspect.name,
            glyph: aspect.glyph,
            index: index+1,
            orb: formatOrb(Math.abs(delta - aspect.angle)),
          });
        }
      });
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
  city?: string;
  region?: string;
  country?: string;
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
    glyph: string;
    index: number;
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
  const { data: houseData, loading: houseLoading, error: houseError } = useQuery(HOUSES_QUERY, {
    variables: input as Partial<ChartReadingInput>,
    skip: !input,
  });

  if (positions && !loading && !error && houseData && !houseLoading && !houseError) {
    // Calculate houses and angles (default to placidus, or allow system override via input if desired)
    reading.angles = {
      ascendant: convertToZodiac(houseData.housePositions.ascendant),
      midheaven: convertToZodiac(houseData.housePositions.mc),
      descendant: convertToZodiac((houseData.housePositions.ascendant + 180) % 360),
      imumCoeli: convertToZodiac((houseData.housePositions.mc + 180) % 360),
    };
    reading.houses = {
      cusps: houseData?.housePositions.house
        .map((value: number) => convertToZodiac(value))
        .reduce((acc: HouseCusps, sign: ZodiacSign, index: number) => {
          acc[index + 1] = sign;
          return acc;
        }, {}),
      system: 'Placidus',
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
        sign: convertToZodiac(planet.longitude),
      };

      if(planet.name == 'Moon') {
        if(planet.northNodeLongitude !== undefined) {
          reading.northNode = convertToZodiac(planet.northNodeLongitude);
        }
        if(planet.southNodeLongitude !== undefined) {
          reading.southNode = convertToZodiac(planet.southNodeLongitude);
        }
      }
      reading.positions.push(result);
    });
  }
  return { reading, loading, error };
}