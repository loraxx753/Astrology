import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ChartFormData, chartFormSchema } from '@/lib/schemas/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { StarIcon } from 'lucide-react';
import { PageComponentType } from '@/lib/types';
import useCelestialPositions from '@/lib/hooks/useCelestialPositions';
import { useReverseGeocode } from '@/lib/hooks/useReverseGeocode';
import { useLatLongFromLocation } from '@/lib/hooks/useLatLongFromLocation';


import { toDMS } from '@/lib/services/calculate/astrology';
import { DateTime } from 'luxon';
import ChartQRCode from './ChartQRCode';

function parseQuery(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function queryToChartFormData(query: Record<string, string>): ChartFormData | null {
  const data: Partial<ChartFormData> = {};
  data.pageFormData = {
    name: query.name,
    gender: (query.gender === "" || query.gender === "male" || query.gender === "female" || query.gender === "other" || query.gender === "prefer-not-to-say") ? query.gender : undefined,
    date: query.date,
    time: query.time,
    timeKnown: query.time !== undefined && query.time !== '', // Add this line
    houseSystem: (['placidus', 'koch', 'equal', 'whole-sign', 'campanus', 'regiomontanus'].includes(query.houseSystem)
      ? query.houseSystem
      : 'placidus') as ChartFormData['pageFormData']['houseSystem'],
    notes: query.notes || undefined,
    location: {
      city: query.city || '',
      country: query.country || '',
      region: query.region || undefined,
      latitude: query.lat ? parseFloat(query.lat) : undefined,
      longitude: query.long ? parseFloat(query.long) : undefined,
      knowsCoordinates: query.lat && query.long ? true : false,
      timezone: query.timezone || undefined,
    },
  };
  try {
    return chartFormSchema.parse(data);
  } catch {
    return null;
  }
}

// Only use planet symbols (no planet emojis)
const bodySymbols: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  Ceres: '⚳',
  Pallas: '⚴',
  Juno: '⚵',
  Vesta: '⚶',
  Chiron: '⚷',
  NorthNode: '☊', // True Node (ascending)
  SouthNode: '☋', // Descending Node
  PartOfFortune: '⊗', // Pars Fortunae
  Ascendant: '↑', // No official, up arrow
  Descendant: '↓', // No official, down arrow
  Midheaven: '⟰', // No official, double up arrow
  ImumCoeli: '⟱', // No official, double down arrow
};
const signEmojis: Record<string, string> = {
  Aries: '♈️', Taurus: '♉️', Gemini: '♊️', Cancer: '♋️', Leo: '♌️', Virgo: '♍️',
  Libra: '♎️', Scorpio: '♏️', Sagittarius: '♐️', Capricorn: '♑️', Aquarius: '♒️', Pisces: '♓️',
};

const ChartPage: PageComponentType = () => {
  const location = useLocation();
  const query = useMemo(() => parseQuery(location.search), [location.search]);
  const chartData = useMemo(() => queryToChartFormData(query), [query]);
  const hasCityRegionCountry = useMemo(() => Boolean(query.city && query.country), [query.city, query.country]);
  
  const shouldFetchLatLong = query.lat === undefined && query.long === undefined && hasCityRegionCountry;
  // const { latLong, loading: latLongLoading, error: latLongError } = useLatLongFromLocation(
  const { latLong } = useLatLongFromLocation(
    shouldFetchLatLong ? query.city : undefined,
    shouldFetchLatLong ? query.country : undefined,
    shouldFetchLatLong ? query.region : undefined
  );
  
  const effectiveLat = query.lat ?? latLong?.latitude;
  const effectiveLong = query.long ?? latLong?.longitude;
  
  // Prepare celestial input for API
  const lat = effectiveLat ? parseFloat(effectiveLat) : undefined;
  const long = effectiveLong ? parseFloat(effectiveLong) : undefined;
  const date = query.date || '';
  const time = query.time || '';
  const hasCelestialInput = date && time && lat !== undefined && long !== undefined;
  const celestialInput = hasCelestialInput ? {
    date,
    time,
    latitude: lat as number,
    longitude: long as number,
  } : undefined;

  const { reading, loading: celestialLoading, error: celestialError } = useCelestialPositions(celestialInput);
  const planetaryPositions = reading?.positions;
  // const { location: reverseLocation, loading: reverseLoading, error: reverseError } = useReverseGeocode(lat, long);
  const { location: reverseLocation } = useReverseGeocode(lat, long);

  if (!chartData) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <StarIcon className="w-5 h-5" /> Invalid Chart Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not parse chart data from URL. Please check your link or try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // const { name, date: birthDate, time: birthTime, location: loc, houseSystem, notes } = chartData.pageFormData;
  const { name, date: birthDate, time: birthTime } = chartData.pageFormData;

  return (
    <div className="min-h-screen" style={{ width: '100vw' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ margin: '0 auto' }}>
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <StarIcon className="w-16 h-16 text-purple-500 animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              {name}
            </h1>
            {birthDate && (
              <div className="text-2xl text-gray-700 mb-1">
                {DateTime.fromISO(birthDate).toLocaleString(DateTime.DATE_FULL)}
                <span className="text-gray-500"> {DateTime.fromFormat(birthTime, 'HH:mm').toLocaleString(DateTime.TIME_SIMPLE)}</span>
              </div>
            )}
            {(reverseLocation || (query.city && query.country)) && (
              <div className="text-xl text-gray-700 mb-1">
                {reverseLocation
                  ? `${reverseLocation.city ? reverseLocation.city + ', ' : ''}${reverseLocation.state ? reverseLocation.state + ', ' : ''}${reverseLocation.country}`
                  : `${query.city}${query.region ? ', ' + query.region : ''}, ${query.country}`}
              </div>
            )}
            {effectiveLat !== undefined && effectiveLong !== undefined && (
              <div className="text-md text-gray-500 mb-2">
                {toDMS(effectiveLat as unknown as number, 'lat')} {toDMS(effectiveLong as unknown as number, 'long')}
              </div>
            )}
          </div>
          {/* 2x2 Grid for all 4 cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Planetary Positions */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-800">Planetary Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {celestialLoading && <p className="text-sm text-purple-700">Loading planetary positions...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading positions.</p>}
                {!celestialLoading && !celestialError && reading && reading.positions.length > 0 && (
                  <ul className="text-sm text-purple-700 space-y-1">
                    {reading.positions.map((planet) => {
                      const planetSymbol = bodySymbols[planet.name] || '';
                      const signEmoji = signEmojis[planet.sign.sign] || '';
                      return (
                        <li key={planet.name} className="flex items-center gap-2">
                          <span className="text-lg" title={planet.name}>{planetSymbol}</span>
                          <strong >{planet.name}:</strong>
                          <span className="text-lg" title={planet.sign.sign}>{signEmoji}</span> <span className="text-sm text-gray-500 ml-1 ">{planet.sign.sign}</span> {planet.sign.degree}° {planet.sign.minutes}' {planet.sign.seconds}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {!celestialLoading && !celestialError && (!planetaryPositions || planetaryPositions.length === 0) && (
                  <p className="text-sm text-purple-700">Initializing planetary positions...</p>
                )}
                {!celestialLoading && celestialError && (!planetaryPositions || planetaryPositions.length === 0) && (
                  <p className="text-sm text-purple-700">No planetary data available.</p>
                )}

              </CardContent>
            </Card>
            {/* House Placements */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-800">House Placements</CardTitle>
              </CardHeader>
              <CardContent>
                {celestialLoading && <p className="text-sm text-indigo-700">Loading house cusps...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading houses.</p>}
                {!celestialLoading && !celestialError && reading && reading.houses && (
                  <ul className="text-sm text-indigo-700 space-y-1">
                    {Object.entries(reading.houses.cusps).map(([houseNum, cusp]) => (
                      <li key={houseNum} className="flex items-center gap-2">
                        <span className="text-lg font-bold">{houseNum}</span>
                        <span>
                          <span className="text-lg" title={cusp.sign}>{signEmojis[cusp.sign] || ''}</span> <span className="text-sm text-gray-500 ml-1 ">{cusp.sign}</span> {cusp.degree}° {cusp.minutes}' {cusp.seconds}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {!celestialLoading && !celestialError && (!reading || !reading.houses) && (
                  <p className="text-sm text-indigo-700">Initializing house data...</p>
                )}
                {!celestialLoading && celestialError && (!reading || !reading.houses) && (
                  <p className="text-sm text-indigo-700">No house data available.</p>
                )}
              </CardContent>
            </Card>
            {/* Aspect Patterns */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-800">Aspect Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                {celestialLoading && <p className="text-sm text-blue-700">Loading aspects...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading aspects.</p>}
                {!celestialLoading && !celestialError && reading && reading.aspects && reading.aspects.length > 0 && (
                  <ul className="text-sm text-blue-700 space-y-1">
                    {reading.aspects.map((aspect, idx) => {
                      const symbolA = bodySymbols[aspect.planetA] || '';
                      const symbolB = bodySymbols[aspect.planetB] || '';
                      const orb = aspect.orb;
                      const orbStr = `${orb.degree}°${orb.minutes.toString().padStart(2, '0')}'${orb.seconds.toString().padStart(2, '0')}`;
                      return (
                        <li key={idx} className="flex items-center gap-2">
                          <strong >{aspect.planetA}</strong>
                          <span className="text-lg" title={aspect.planetA}>{symbolA}</span>
                          <span className="text-xs text-gray-500" title={aspect.aspect}>{aspect.index}</span>
                          <span className="font-semibold text-blue-800 ">{aspect.aspect}</span>
                          
                          <span className="text-lg" title={aspect.planetB}>{symbolB}</span>
                          <strong >{aspect.planetB}</strong>
                          <span className="text-xs text-gray-500">(orb: {orbStr})</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {!celestialLoading && !celestialError && (!reading || !reading.aspects || reading.aspects.length === 0) && (
                  <p className="text-sm text-blue-700">Initializing aspect data...</p>
                )}
                {!celestialLoading && celestialError && (!reading || !reading.aspects || reading.aspects.length === 0) && (
                  <p className="text-sm text-blue-700">No aspect data available.</p>
                )}
              </CardContent>
            </Card>
            {/* Angles */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-800">Angles</CardTitle>
              </CardHeader>
              <CardContent>
                {celestialLoading && <p className="text-sm text-purple-700">Loading angles...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading angles.</p>}
                {!celestialLoading && !celestialError && reading && reading.angles && (
                  <ul className="text-sm text-purple-700 space-y-1">
                    {reading.angles.ascendant && <li className="flex items-center gap-2">
                      <span className="text-lg" title='Ascendant'>{bodySymbols['Ascendant']}</span>
                      <strong >Ascendant:</strong>
                      <span className="text-lg" title={reading.angles.ascendant.sign}>{signEmojis[reading.angles.ascendant.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{reading.angles.ascendant.sign}</span> {reading.angles.ascendant.degree}° {reading.angles.ascendant.minutes}' {reading.angles.ascendant.seconds}
                    </li>}
                    {reading.angles.descendant && <li className="flex items-center gap-2">
                      <span className="text-lg" title='Descendant'>{bodySymbols['Descendant']}</span>
                      <strong >Descendant:</strong>
                      <span className="text-lg" title={reading.angles.descendant.sign}>{signEmojis[reading.angles.descendant.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{reading.angles.descendant.sign}</span> {reading.angles.descendant.degree}° {reading.angles.descendant.minutes}' {reading.angles.descendant.seconds}
                    </li>}
                    {reading.angles.midheaven && <li className="flex items-center gap-2">
                      <span className="text-lg" title='Midheaven'>{bodySymbols['Midheaven']}</span>
                      <strong >Midheaven (MC):</strong>
                      <span className="text-lg" title={reading.angles.midheaven.sign}>{signEmojis[reading.angles.midheaven.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{reading.angles.midheaven.sign}</span> {reading.angles.midheaven.degree}° {reading.angles.midheaven.minutes}' {reading.angles.midheaven.seconds}
                    </li>}
                    {reading.angles.imumCoeli && <li className="flex items-center gap-2">
                      <span className="text-lg" title='Imum Coeli'>{bodySymbols['ImumCoeli']}</span>
                      <strong >Imum Coeli (IC):</strong>
                      <span className="text-lg" title={reading.angles.imumCoeli.sign}>{signEmojis[reading.angles.imumCoeli.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{reading.angles.imumCoeli.sign}</span> {reading.angles.imumCoeli.degree}° {reading.angles.imumCoeli.minutes}' {reading.angles.imumCoeli.seconds}
                    </li>}
                  </ul>
                )}
                {!celestialLoading && !celestialError && (!reading || !reading.angles) && (
                  <p className="text-sm text-purple-700">Initializing angle data...</p>
                )}
                {!celestialLoading && celestialError && (!reading || !reading.angles) && (
                  <p className="text-sm text-purple-700">No angle data available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        {/* QR Code for sharing this chart */}
        <ChartQRCode url={window.location.origin + window.location.pathname + location.search} />
        </div>
      </div>
    </div>
  );
};

ChartPage.path = '/chart';

export default ChartPage;
