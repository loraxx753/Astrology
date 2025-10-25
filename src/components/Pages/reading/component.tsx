import React, { useState, useEffect } from 'react';
import tzLookup from 'tz-lookup';
import { BirthChartData } from '@/lib/schemas/birthChart';
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';
import BirthChartForm from '@/components/Forms/BirthChartForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { StarIcon, SparklesIcon } from 'lucide-react';
import { PageComponentType } from '@/lib/types';
import { CalculationDetails } from '@/components/Visualizations/CalculationDetails';
import { getSunPositionSteps, calculateSunPosition, getMoonPositionSteps, calculateMoonPosition, calculateAllPlanetPositions, getHouseSystemSteps, calculateHouseSystem } from '@/lib/services/calculations';
import { useCelestialPositions } from '@/lib/hooks/useCelestialPositions';

export interface CelestialBodyPosition {
  name: string;
  ra: number;
  dec: number;
  longitude: number;
  latitude: number;
  dateStr: string;
}

const ReadingPage: PageComponentType = () => {
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Set cosmic background for the reading page
  usePageBackground(pageBackgrounds.cosmic);

  // Parse URL parameters and auto-generate chart if provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if we have the minimum required parameters for a chart
    const name = urlParams.get('name');
    const birthDate = urlParams.get('date');
    const birthTime = urlParams.get('time');
    const latitude = urlParams.get('lat');
    const longitude = urlParams.get('lng');
    
    if (name && birthDate && birthTime && latitude && longitude) {
      const chartDataFromUrl: BirthChartData = {
        name: decodeURIComponent(name),
        gender: (urlParams.get('gender') as 'male' | 'female' | 'other' | 'prefer-not-to-say') || undefined,
        birthDate: birthDate,
        birthTime: birthTime,
        timeKnown: urlParams.get('timeKnown') !== 'false', // Default to true
        birthLocation: {
          city: urlParams.get('city') || '',
          country: urlParams.get('country') || '',
          state: urlParams.get('state') || undefined,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timezone: urlParams.get('timezone') || 'UTC'
        },
        houseSystem: (urlParams.get('houseSystem') as 'placidus' | 'koch' | 'equal' | 'whole-sign' | 'campanus' | 'regiomontanus') || 'placidus',
        orbPreferences: {
          conjunction: parseInt(urlParams.get('orbConjunction') || '8'),
          opposition: parseInt(urlParams.get('orbOpposition') || '8'),
          trine: parseInt(urlParams.get('orbTrine') || '8'),
          square: parseInt(urlParams.get('orbSquare') || '8'),
          sextile: parseInt(urlParams.get('orbSextile') || '6'),
          quincunx: parseInt(urlParams.get('orbQuincunx') || '3'),
        },
        notes: urlParams.get('notes') || undefined
      };
      
      console.log('📊 Auto-generating chart from URL parameters:', chartDataFromUrl);
      handleFormSubmit(chartDataFromUrl);
    }
  }, []);

  // Helper function to create timezone-aware UTC datetime for astronomical calculations
  const createBirthDateTime = (birthDate: string, birthTime: string, lat: number, lng: number): Date => {
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);

    // Use tz-lookup to get the IANA timezone name from coordinates
    const tz = tzLookup(lat, lng);

    // Create a Date object in local time
    const localDate = new Date(year, month - 1, day, hours, minutes);

    // Get the UTC offset in minutes for the local time in the found timezone
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false
    });
    // Format the local date in the target timezone
    const parts = dtf.formatToParts(localDate);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value;
    const utcYear = Number(getPart('year'));
    const utcMonth = Number(getPart('month')) - 1;
    const utcDay = Number(getPart('day'));
    const utcHour = Number(getPart('hour'));
    const utcMinute = Number(getPart('minute'));

    // Construct a UTC date from the timezone-adjusted parts
    return new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHour, utcMinute));
  };

  const handleFormSubmit = async (data: BirthChartData) => {
    setIsCalculating(true);
    
    try {
      // Store the form data
      setChartData(data);
      
      // Here we would normally:
      // 1. Calculate planetary positions using astronomical libraries
      // 2. Determine house cusps based on birth time and location
      // 3. Calculate aspects between planets
      // 4. Generate interpretations based on the data
      
      // For now, we'll just simulate a calculation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Birth Chart Calculation Complete:', data);
    } catch (error) {
      console.error('Error calculating birth chart:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Extract planetary positions input from URL params
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const birthDate = urlParams.get('date') || '';
  const birthTime = urlParams.get('time') || '';
  const latitude = urlParams.get('lat') ? parseFloat(urlParams.get('lat')!) : undefined;
  const longitude = urlParams.get('lng') ? parseFloat(urlParams.get('lng')!) : undefined;
  // Default to 7 classical planets if not provided
  const bodies = urlParams.getAll('bodies').length > 0 ? urlParams.getAll('bodies') : ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

  const hasCelestialInput = birthDate && birthTime && latitude !== undefined && longitude !== undefined;
  const celestialInput = hasCelestialInput ? {
    date: birthDate,
    time: birthTime,
    latitude: latitude as number,
    longitude: longitude as number,
    bodies,
  } : undefined;

  const { positions: celestialPositions, loading: celestialLoading, error: celestialError } = useCelestialPositions(celestialInput);

  // Helper: decimal degrees to zodiac sign/deg/min
  function getZodiacFromLongitude(longitude: number) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    let d = longitude % 360;
    if (d < 0) d += 360;
    const signIndex = Math.floor(d / 30);
    const sign = signs[signIndex];
    const degree = Math.floor(d % 30);
    const minutes = Math.floor((d % 1) * 60);
    const seconds = Math.round((((d % 1) * 60) % 1) * 60);
    return { degree, minutes, seconds, sign };
  }

  return (
    <div className="min-h-screen" style={{ width: '100vw' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ margin: '0 auto' }}>
        
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <StarIcon className="w-16 h-16 text-purple-500 animate-pulse" />
                <SparklesIcon className="w-8 h-8 text-indigo-500 absolute -top-1 -right-1" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
              Birth Chart Reading
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover your cosmic blueprint. Enter your birth details to generate a comprehensive 
              astrological chart that reveals your personality traits, life purpose, and celestial influences.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-800">Planetary Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">
                  Precise locations of planets at your birth moment
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-800">House Placements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-700">
                  Life areas influenced by each planetary energy
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-800">Aspect Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  Relationships between planets and their meanings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Section */}
        {!chartData ? (
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Enter Your Birth Information
              </h2>
              <p className="text-gray-600">
                All fields marked with * are required for accurate calculations. 
                Your data is processed locally and not stored on our servers.
              </p>
            </div>
            
            <BirthChartForm 
              onSubmit={handleFormSubmit} 
              isLoading={isCalculating}
            />
          </div>
        ) : (
          /* Results Section - Real calculations */
          <div className="space-y-8">
            {/* Chart Header */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                🎉 Birth Chart for {chartData.name}
              </h2>
              <p className="text-gray-600 mb-2">
                Born: {chartData.birthDate} at {chartData.birthTime}
              </p>
              <p className="text-gray-600 mb-6">
                Location: {chartData.birthLocation.city}, {chartData.birthLocation.country}
              </p>
              
              <button
                onClick={() => setChartData(null)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors"
              >
                Create Another Chart
              </button>
            </div>

            {/* Quick Summary Section */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">📋</span>
                  Chart Summary
                </h2>
                <p className="text-gray-600 mt-2">
                  Quick overview of all calculated planetary positions at the moment of birth.
                </p>
              </div>

              {(() => {
                // Ensure we have valid coordinates before calculations
                const { latitude, longitude } = chartData.birthLocation;
                if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                  return (
                    <div className="text-center p-8 text-red-600">
                      <p className="text-lg font-semibold mb-2">⚠️ Missing Location Data</p>
                      <p>Valid coordinates are required for astronomical calculations.</p>
                      <p className="text-sm mt-2">Please provide either city/country or latitude/longitude coordinates.</p>
                    </div>
                  );
                }

                // Use API data for summary
                if (celestialPositions && celestialPositions.length > 0) {
                  return (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {celestialPositions.map((planet: CelestialBodyPosition) => {
                        const zodiac = getZodiacFromLongitude(planet.longitude);
                        return (
                          <div key={planet.name} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">🪐</span>
                              <h3 className="font-bold text-purple-800">{planet.name}</h3>
                            </div>
                            <p className="text-purple-700 font-mono text-sm">
                              {zodiac.degree}° {zodiac.minutes}' {zodiac.sign}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // Fallback to local calculations if no API data
                const birthDateTime = createBirthDateTime(
                  chartData.birthDate, 
                  chartData.birthTime, 
                  latitude, 
                  longitude
                );
                const sunPosition = calculateSunPosition(birthDateTime);
                const moonPosition = calculateMoonPosition(birthDateTime);
                const allPlanetPositions = calculateAllPlanetPositions();
                const houseSystem = calculateHouseSystem(
                  birthDateTime, 
                  latitude, 
                  longitude, 
                  chartData.houseSystem
                );
                // Helper function to format angles
                const formatAngle = (longitude: number) => {
                  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                  const signIndex = Math.floor(longitude / 30);
                  const degree = Math.floor(longitude % 30);
                  const minutes = Math.floor(((longitude % 30) - degree) * 60);
                  return { degree, minutes, sign: signs[signIndex] };
                };
                const ascendant = formatAngle(houseSystem.ascendant);
                const midheaven = formatAngle(houseSystem.midheaven);
                return (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Sun */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">☀️</span>
                        <h3 className="font-bold text-yellow-800">Sun</h3>
                      </div>
                      <p className="text-yellow-700 font-mono text-sm">
                        {sunPosition.zodiacPosition.degree}° {sunPosition.zodiacPosition.minutes}' {sunPosition.zodiacPosition.sign}
                      </p>
                    </div>
                    {/* Moon */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🌙</span>
                        <h3 className="font-bold text-blue-800">Moon</h3>
                      </div>
                      <p className="text-blue-700 font-mono text-sm">
                        {moonPosition.zodiacPosition.degree}° {moonPosition.zodiacPosition.minutes}' {moonPosition.zodiacPosition.sign}
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        {moonPosition.phase.phaseName} ({moonPosition.phase.illumination.toFixed(0)}%)
                      </p>
                    </div>
                    {/* Ascendant */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⬆️</span>
                        <h3 className="font-bold text-emerald-800">Ascendant</h3>
                      </div>
                      <p className="text-emerald-700 font-mono text-sm">
                        {ascendant.degree}° {ascendant.minutes}' {ascendant.sign}
                      </p>
                      <p className="text-emerald-600 text-xs mt-1">
                        Rising Sign
                      </p>
                    </div>
                    {/* Planets */}
                    {Object.entries(allPlanetPositions).map(([planetKey, position]) => (
                      position && position?.elements ? (
                        <div key={planetKey} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{position?.elements.emoji}</span>
                            <h3 className="font-bold text-purple-800">{position?.elements.name}</h3>
                          </div>
                          <p className="text-purple-700 font-mono text-sm">
                            {position?.zodiacPosition.degree}° {position?.zodiacPosition.minutes}' {position?.zodiacPosition.sign}
                          </p>
                        </div>
                      ) : null
                    ))}
                    {/* Midheaven */}
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⬆️</span>
                        <h3 className="font-bold text-violet-800">Midheaven</h3>
                      </div>
                      <p className="text-violet-700 font-mono text-sm">
                        {midheaven.degree}° {midheaven.minutes}' {midheaven.sign}
                      </p>
                      <p className="text-violet-600 text-xs mt-1">
                        Career Point
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Luminaries Section (Sun & Moon) */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">☀️🌙</span>
                  The Luminaries
                </h2>
                <p className="text-gray-600 mt-2">
                  The Sun and Moon are the most important celestial bodies in astrology, representing your core identity and emotional nature.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Sun Position Calculation */}
                {(() => {
                  const { latitude, longitude } = chartData.birthLocation;
                  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                    return <div className="text-center p-4 text-red-600">Missing coordinates for Sun calculation</div>;
                  }

                  const birthDateTime = createBirthDateTime(
                    chartData.birthDate, 
                    chartData.birthTime, 
                    latitude, 
                    longitude
                  );
                  
                  const sunPosition = calculateSunPosition(birthDateTime);
                  const sunSteps = getSunPositionSteps(birthDateTime);
                  const summary = `Sun in ${sunPosition.zodiacPosition.degree}° ${sunPosition.zodiacPosition.minutes}' ${sunPosition.zodiacPosition.seconds}" ${sunPosition.zodiacPosition.sign}`;
                  
                  return (
                    <CalculationDetails
                      title="☀️ Sun Position Calculation"
                      summary={summary}
                      steps={sunSteps}
                    />
                  );
                })()}

                {/* Moon Position Calculation */}
                {(() => {
                  const { latitude, longitude } = chartData.birthLocation;
                  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                    return <div className="text-center p-4 text-red-600">Missing coordinates for Moon calculation</div>;
                  }

                  const birthDateTime = createBirthDateTime(
                    chartData.birthDate, 
                    chartData.birthTime, 
                    latitude, 
                    longitude
                  );
                  
                  const moonPosition = calculateMoonPosition(birthDateTime);
                  const moonSteps = getMoonPositionSteps(birthDateTime);
                  const summary = `Moon in ${moonPosition.zodiacPosition.degree}° ${moonPosition.zodiacPosition.minutes}' ${moonPosition.zodiacPosition.seconds}" ${moonPosition.zodiacPosition.sign} - ${moonPosition.phase.phaseName} (${moonPosition.phase.illumination.toFixed(1)}% illuminated)`;
                  
                  return (
                    <CalculationDetails
                      title="🌙 Moon Position & Phase Calculation"
                      summary={summary}
                      steps={moonSteps}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Planetary Positions Section */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">🪐</span>
                  Planetary Positions (from API)
                </h2>
                <p className="text-gray-600 mt-2">
                  The five visible planets and their precise positions using the backend API.
                </p>
              </div>
              <div className="space-y-6">
                {celestialLoading && <div>Loading planetary positions...</div>}
                {celestialError && <div className="text-red-600">Error loading planetary positions.</div>}
                {celestialPositions && celestialPositions.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {celestialPositions.map((planet: CelestialBodyPosition) => {
                      const zodiac = getZodiacFromLongitude(planet.longitude);
                      return (
                        <div key={planet.name} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🪐</span>
                            <h3 className="font-bold text-purple-800">{planet.name}</h3>
                          </div>
                          <p className="text-purple-700 font-mono text-sm">
                            RA: {planet.ra.toFixed(4)} | Dec: {planet.dec.toFixed(4)}
                          </p>
                          <p className="text-purple-700 font-mono text-sm">
                            Longitude: {planet.longitude.toFixed(4)} | Latitude: {planet.latitude.toFixed(4)}
                          </p>
                          <p className="text-purple-700 font-mono text-sm">
                            {zodiac.degree}° {zodiac.minutes}' {zodiac.seconds}" {zodiac.sign}
                          </p>
                          <p className="text-purple-600 text-xs mt-1">
                            Date: {planet.dateStr}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Houses & Angles Section */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">🏠</span>
                  Houses & Angles
                </h2>
                <p className="text-gray-600 mt-2">
                  The 12 astrological houses and the four angles (Ascendant, Descendant, Midheaven, Imum Coeli) based on birth time and location.
                </p>
              </div>

              <div className="space-y-6">
                {(() => {
                  const { latitude, longitude } = chartData.birthLocation;
                  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                    return <div className="text-center p-4 text-red-600">Missing coordinates for house system calculation</div>;
                  }

                  const birthDateTime = createBirthDateTime(
                    chartData.birthDate, 
                    chartData.birthTime, 
                    latitude, 
                    longitude
                  );
                  
                  const houseSystem = calculateHouseSystem(
                    birthDateTime, 
                    latitude, 
                    longitude, 
                    chartData.houseSystem
                  );
                  const houseSteps = getHouseSystemSteps(
                    birthDateTime,
                    latitude,
                    longitude,
                    chartData.houseSystem
                  );

                  // Summary of angles
                  const ascendantZodiac = (() => {
                    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                    const signIndex = Math.floor(houseSystem.ascendant / 30);
                    const degree = Math.floor(houseSystem.ascendant % 30);
                    const minutes = Math.floor(((houseSystem.ascendant % 30) - degree) * 60);
                    return `${degree}° ${minutes}' ${signs[signIndex]}`;
                  })();

                  const midheavenZodiac = (() => {
                    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
                    const signIndex = Math.floor(houseSystem.midheaven / 30);
                    const degree = Math.floor(houseSystem.midheaven % 30);
                    const minutes = Math.floor(((houseSystem.midheaven % 30) - degree) * 60);
                    return `${degree}° ${minutes}' ${signs[signIndex]}`;
                  })();

                  const summary = `Ascendant: ${ascendantZodiac} | Midheaven: ${midheavenZodiac} | System: ${chartData.houseSystem}`;

                  return (
                    <CalculationDetails
                      title={`🏠 ${chartData.houseSystem.charAt(0).toUpperCase() + chartData.houseSystem.slice(1)} House System Calculation`}
                      summary={summary}
                      steps={houseSteps}
                    />
                  );
                })()}

                {/* House Summary Grid */}
                {(() => {
                  const { latitude, longitude } = chartData.birthLocation;
                  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                    return <div className="text-center p-4 text-red-600">Missing coordinates for house grid calculation</div>;
                  }

                  const birthDateTime = createBirthDateTime(
                    chartData.birthDate, 
                    chartData.birthTime, 
                    latitude, 
                    longitude
                  );
                  
                  const houseSystem = calculateHouseSystem(
                    birthDateTime, 
                    latitude, 
                    longitude, 
                    chartData.houseSystem
                  );

                  const houseNames = [
                    'Self & Identity', 'Values & Possessions', 'Communication', 'Home & Family',
                    'Creativity & Romance', 'Health & Service', 'Partnerships', 'Transformation',
                    'Philosophy & Travel', 'Career & Reputation', 'Friends & Hopes', 'Subconscious & Karma'
                  ];

                  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

                  return (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">House Cusps Summary</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(houseSystem.cusps).map(([house, longitude]) => {
                          const signIndex = Math.floor(longitude / 30);
                          const degree = Math.floor(longitude % 30);
                          const minutes = Math.floor(((longitude % 30) - degree) * 60);
                          const houseNum = parseInt(house);
                          
                          return (
                            <div key={house} className={`p-3 rounded-lg border ${
                              houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10 
                                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' 
                                : 'bg-white border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-gray-800">
                                  House {house}
                                  {(houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10) && 
                                    <span className="text-amber-600 ml-1">⭐</span>
                                  }
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                  {degree}° {minutes}' {signs[signIndex]}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                {houseNames[houseNum - 1]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <span className="text-amber-600">⭐</span>
                          Angular houses (most powerful): 1st (Ascendant), 4th (IC), 7th (Descendant), 10th (Midheaven)
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Future Development Section */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Development Progress
                </h2>
                <p className="text-gray-600 mt-2">
                  Track the implementation of advanced astrological calculations and features.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Completed Features */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Completed Calculations
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-1">☀️🌙 Luminaries</h4>
                      <ul className="text-sm text-green-600 space-y-1 ml-4">
                        <li>• Sun position with astronomical algorithms</li>
                        <li>• Moon position and phase calculations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-1">🪐 Planets</h4>
                      <ul className="text-sm text-green-600 space-y-1 ml-4">
                        <li>• Mercury through Saturn orbital mechanics</li>
                        <li>• Kepler equation solving and true anomaly</li>
                        <li>• Heliocentric coordinate calculations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Coming Features */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Coming Next
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-1">🏠 Houses & Angles</h4>
                      <ul className="text-sm text-blue-600 space-y-1 ml-4">
                        <li>• {chartData.houseSystem} house system calculations</li>
                        <li>• Ascendant (Rising Sign) determination</li>
                        <li>• Midheaven and house cusps</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-1">⭐ Aspects & Analysis</h4>
                      <ul className="text-sm text-blue-600 space-y-1 ml-4">
                        <li>• Angular relationships between planets</li>
                        <li>• Aspect pattern recognition</li>
                        <li>• Orb calculations and strength</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-1">📊 Visualization & AI</h4>
                      <ul className="text-sm text-blue-600 space-y-1 ml-4">
                        <li>• Interactive chart wheel</li>
                        <li>• Retrograde motion detection</li>
                        <li>• AI-powered interpretations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Footer */}
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8 mt-8">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">🔮 About Birth Chart Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-amber-700 leading-relaxed">
                A birth chart (natal chart) is a snapshot of the sky at the exact moment and location of your birth. 
                It maps the positions of planets, signs, and houses to reveal insights about your personality, 
                relationships, career potential, and life path. Each element works together to create your unique cosmic fingerprint.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

ReadingPage.path = "/reading";

export default ReadingPage;