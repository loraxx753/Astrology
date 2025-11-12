import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';
import NatalChartForm from '@/components/Forms/NatalChartForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { StarIcon, SparklesIcon } from 'lucide-react';
import { PageComponentType } from '@/lib/types';

const ReadingPage: PageComponentType = () => {
  const navigate = useNavigate();
  usePageBackground(pageBackgrounds.cosmic);

  interface FormSubmitData {
    pageFormData: Record<string, unknown>;
    [key: string]: unknown;
  }

  const handleFormSubmit = (data: FormSubmitData) => {
    const pf = data.pageFormData || {};
    const params: Record<string, string> = {};
    // Basic fields
    if (pf.name) params.name = String(pf.name);
    if (pf.gender) params.gender = String(pf.gender);
    if (pf.date) params.date = String(pf.date);
    if (pf.time) params.time = String(pf.time);
    if (pf.houseSystem) params.houseSystem = String(pf.houseSystem);
    if (pf.notes) params.notes = String(pf.notes);
    // Location
    if (pf.location) {
      const loc = pf.location as Record<string, unknown>;
      if (loc.knowsCoordinates) {
        if (loc.latitude !== undefined && loc.longitude !== undefined && loc.latitude !== '' && loc.longitude !== '') {
          params.lat = String(loc.latitude);
          params.long = String(loc.longitude);
        }
      } else {
        if (loc.city) params.city = String(loc.city);
        if (loc.state) params.region = String(loc.state);
        if (loc.country) params.country = String(loc.country);
      }
    }
    // Do NOT include timeKnown or orbPreferences as an object
    const search = new URLSearchParams(params).toString();
    navigate(`/chart?${search}`);
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
          <NatalChartForm 
            onSubmit={handleFormSubmit} 
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;

ReadingPage.path = '/reading';