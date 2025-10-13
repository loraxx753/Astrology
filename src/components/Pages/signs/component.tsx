import React from 'react';
import { PageComponentType } from '@/lib/types'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import { Badge } from "@/components/ThirdParty/ShadCn/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ThirdParty/ShadCn/Card";
import { StarIcon, Flame, Mountain, Wind, Droplets } from "lucide-react";
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';

const zodiacSigns = [
  {
    name: "Aries",
    symbol: "♈",
    emoji: "♈",
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    elementEmoji: "🔥",
    icon: <Flame className="w-8 h-8" style={{color: '#dc2626'}} />,
    gradient: "bg-gradient-to-br from-[#dc2626] to-[#b91c1c]",
    description: "Courageous, determined, and confident pioneers who lead with passion.",
    path: "/signs/aries"
  },
  {
    name: "Taurus",
    symbol: "♉", 
    emoji: "♉",
    dates: "Apr 20 - May 20",
    element: "Earth",
    elementEmoji: "🌍",
    icon: <Mountain className="w-8 h-8" style={{color: '#059669'}} />,
    gradient: "bg-gradient-to-br from-[#059669] to-[#047857]",
    description: "Reliable, practical, and devoted individuals who value stability.",
    path: "/signs/taurus"
  },
  {
    name: "Gemini",
    symbol: "♊",
    emoji: "♊",
    dates: "May 21 - Jun 20", 
    element: "Air",
    elementEmoji: "💨",
    icon: <Wind className="w-8 h-8" style={{color: '#06b6d4'}} />,
    gradient: "bg-gradient-to-br from-[#06b6d4] to-[#0891b2]",
    description: "Adaptable, versatile, and communicative souls who love variety.",
    path: "/signs/gemini"
  },
  {
    name: "Cancer",
    symbol: "♋",
    emoji: "♋",
    dates: "Jun 21 - Jul 22",
    element: "Water", 
    elementEmoji: "💧",
    icon: <Droplets className="w-8 h-8" style={{color: '#2563eb'}} />,
    gradient: "bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]",
    description: "Intuitive, emotional, and protective nurturers with deep empathy.",
    path: "/signs/cancer"
  },
  {
    name: "Leo",
    symbol: "♌",
    emoji: "♌",
    dates: "Jul 23 - Aug 22",
    element: "Fire",
    elementEmoji: "🔥",
    icon: <Flame className="w-8 h-8" style={{color: '#ef4444'}} />,
    gradient: "bg-gradient-to-br from-[#ef4444] to-[#dc2626]", 
    description: "Generous, warm-hearted, and creative leaders who radiate confidence.",
    path: "/signs/leo"
  },
  {
    name: "Virgo",
    symbol: "♍",
    emoji: "♍",
    dates: "Aug 23 - Sep 22",
    element: "Earth",
    elementEmoji: "🌍",
    icon: <Mountain className="w-8 h-8" style={{color: '#22c55e'}} />,
    gradient: "bg-gradient-to-br from-[#22c55e] to-[#16a34a]",
    description: "Loyal, analytical, and practical perfectionists who serve others.",
    path: "/signs/virgo"
  },
  {
    name: "Libra", 
    symbol: "♎",
    emoji: "♎",
    dates: "Sep 23 - Oct 22",
    element: "Air",
    elementEmoji: "💨",
    icon: <Wind className="w-8 h-8" style={{color: '#22d3ee'}} />,
    gradient: "bg-gradient-to-br from-[#22d3ee] to-[#06b6d4]",
    description: "Cooperative, diplomatic, and gracious seekers of harmony and balance.",
    path: "/signs/libra"
  },
  {
    name: "Scorpio",
    symbol: "♏", 
    emoji: "♏",
    dates: "Oct 23 - Nov 21",
    element: "Water",
    elementEmoji: "💧",
    icon: <Droplets className="w-8 h-8" style={{color: '#1d4ed8'}} />,
    gradient: "bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a]",
    description: "Resourceful, brave, and passionate individuals with magnetic intensity.",
    path: "/signs/scorpio"
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    emoji: "♐",
    dates: "Nov 22 - Dec 21", 
    element: "Fire",
    elementEmoji: "🔥",
    icon: <Flame className="w-8 h-8" style={{color: '#f97316'}} />,
    gradient: "bg-gradient-to-br from-[#f97316] to-[#ea580c]",
    description: "Generous, idealistic, and adventurous philosophers and explorers.",
    path: "/signs/sagittarius"
  },
  {
    name: "Capricorn",
    symbol: "♑",
    emoji: "♑",
    dates: "Dec 22 - Jan 19",
    element: "Earth", 
    elementEmoji: "🌍",
    icon: <Mountain className="w-8 h-8" style={{color: '#059669'}} />,
    gradient: "bg-gradient-to-br from-[#059669] to-[#047857]",
    description: "Responsible, disciplined, and ambitious achievers with great patience.",
    path: "/signs/capricorn"
  },
  {
    name: "Aquarius",
    symbol: "♒",
    emoji: "♒",
    dates: "Jan 20 - Feb 18",
    element: "Air",
    elementEmoji: "💨",
    icon: <Wind className="w-8 h-8" style={{color: '#14b8a6'}} />,
    gradient: "bg-gradient-to-br from-[#14b8a6] to-[#0d9488]", 
    description: "Progressive, original, and independent humanitarians who think differently.",
    path: "/signs/aquarius"
  },
  {
    name: "Pisces",
    symbol: "♓",
    emoji: "♓",
    dates: "Feb 19 - Mar 20",
    element: "Water",
    elementEmoji: "💧",
    icon: <Droplets className="w-8 h-8" style={{color: '#1e3a8a'}} />,
    gradient: "bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]",
    description: "Compassionate, artistic, and intuitive dreamers with deep wisdom.",
    path: "/signs/pisces"
  }
];

export const SignsPage: PageComponentType = () => {
  // Set the page background using the custom hook
  usePageBackground(pageBackgrounds.zodiac);

  return (
    <div className="min-h-screen" style={{ width: '100vw' }}>
      {/* Hero Section */}
      <HeroSection.SimpleCentered>
        <div className="container relative py-24 lg:py-32" style={{ margin: '0 auto' }}>
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <StarIcon className="w-24 h-24 text-purple-500 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                12 Zodiac Signs
              </Badge>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Zodiac Signs
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Discover the unique characteristics, traits, and cosmic influences of each zodiac sign. 
                Find your sign and explore what the stars reveal about your personality.
              </p>
            </div>
          </div>
        </div>
      </HeroSection.SimpleCentered>

      {/* Signs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ margin: '0 auto' }}>
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {zodiacSigns.map((sign) => (
            <a key={sign.name} href={sign.path} className="block">
              <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    {sign.icon}
                  </div>
                  <CardTitle className={`text-2xl bg-gradient-to-r ${sign.gradient} bg-clip-text text-transparent flex items-center justify-center gap-2 group-hover:scale-105 transition-transform`}>
                    {sign.name} 
                    <span className="text-3xl">{sign.emoji}</span>
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="mb-2">
                      {sign.dates}
                    </Badge>
                    <br />
                    <Badge variant="secondary" className="mt-2 flex items-center justify-center gap-1 w-fit mx-auto">
                      <span>{sign.elementEmoji}</span>
                      {sign.element} Sign
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {sign.description}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-4">
          <h3 className="text-2xl font-semibold">Ready for a deeper dive?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your sun sign is just the beginning. Discover how your moon sign, rising sign, 
            and planetary placements create your unique astrological fingerprint.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
            Get Your Full Birth Chart
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

SignsPage.path = "/signs";