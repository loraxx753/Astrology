import React, { useState } from 'react';
import { BirthChartData } from '@/lib/schemas/birthChart';
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';
import BirthChartForm from '@/components/Forms/BirthChartForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { StarIcon, SparklesIcon } from 'lucide-react';
import { PageComponentType } from '@/lib/types';
import { CalculationDetails } from '@/components/Visualizations/CalculationDetails';
import { getSunPositionSteps, calculateSunPosition } from '@/lib/services/calculations';

const ReadingPage: PageComponentType = () => {
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Set cosmic background for the reading page
  usePageBackground(pageBackgrounds.cosmic);

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
                Born: {new Date(chartData.birthDate).toLocaleDateString()} at {chartData.birthTime}
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

            {/* Sun Position Calculation */}
            {(() => {
              const birthDateTime = new Date(`${chartData.birthDate}T${chartData.birthTime}`);
              const sunPosition = calculateSunPosition(birthDateTime);
              const sunSteps = getSunPositionSteps(birthDateTime);
              const summary = `Sun in ${sunPosition.zodiacPosition.degree}° ${sunPosition.zodiacPosition.minutes}' ${sunPosition.zodiacPosition.seconds}" ${sunPosition.zodiacPosition.sign}`;
              
              return (
                <CalculationDetails
                  title="Sun Position Calculation"
                  summary={summary}
                  steps={sunSteps}
                />
              );
            })()}

            {/* Future Calculations Placeholder */}
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Coming Next</h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• 🌙 Moon position and phase calculations</li>
                  <li>• 🪐 Planetary positions (Mercury, Venus, Mars, Jupiter, Saturn)</li>
                  <li>• 🏠 House system calculations (using {chartData.houseSystem})</li>
                  <li>• ⭐ Aspect pattern analysis between celestial bodies</li>
                  <li>• 📊 Interactive chart wheel visualization</li>
                  <li>• 📖 AI-powered astrological interpretations</li>
                </ul>
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