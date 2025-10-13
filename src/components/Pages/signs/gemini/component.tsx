import { PageComponentType } from '@/lib/types'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import { Badge } from "@/components/ThirdParty/ShadCn/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ThirdParty/ShadCn/Card";
import { Separator } from "@/components/ThirdParty/ShadCn/Separator";
import { StarIcon, Wind, MessageCircle } from "lucide-react";
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';

const GeminiTraits = {
  positive: [
    "Adaptable", "Versatile", "Communicative", "Witty", 
    "Intellectual", "Eloquent", "Youthful", "Lively"
  ],
  negative: [
    "Nervous", "Inconsistent", "Indecisive", "Superficial", 
    "Restless", "Devious", "Cunning", "Impulsive"
  ]
};

const GeminiDetails = {
  element: "Air",
  quality: "Mutable",
  rulingPlanet: "Mercury", 
  symbol: "Twins",
  dates: "May 21 - June 20",
  colors: ["Yellow", "Silver", "Blue"],
  luckyNumbers: [5, 7, 14, 23],
  compatibility: ["Libra", "Aquarius", "Aries", "Leo"]
};

export const GeminiPage: PageComponentType = () => {
  // Set the air element background for Gemini
  usePageBackground(pageBackgrounds.air);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection.SimpleCentered>
        <div className="container relative py-24 lg:py-32">
          <div className="flex flex-col items-center text-center space-y-8 bg-white/90 backdrop-blur-md rounded-2xl p-8 mx-4 sm:mx-6 lg:mx-auto max-w-4xl border border-white/20">
            <div className="relative">
              <MessageCircle className="w-24 h-24 text-blue-500 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <StarIcon className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {GeminiDetails.dates}
              </Badge>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
                Gemini ♊
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                The Twins - Ruled by Mercury, Geminis are quick-witted communicators who 
                thrive on variety and intellectual stimulation. They adapt easily to any situation.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Wind className="w-4 h-4" />
                {GeminiDetails.element} Sign
              </Badge>
              <Badge variant="outline">
                {GeminiDetails.quality} Quality
              </Badge>
              <Badge variant="outline">
                Ruled by {GeminiDetails.rulingPlanet}
              </Badge>
            </div>
          </div>
        </div>
      </HeroSection.SimpleCentered>

      {/* Content Section */}
      <div className="container py-16 space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Personality Traits */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <StarIcon className="w-5 h-5" />
                Positive Traits
              </CardTitle>
              <CardDescription>
                Gemini's natural strengths and admirable qualities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {GeminiTraits.positive.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 justify-center">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <StarIcon className="w-5 h-5" />
                Areas for Growth
              </CardTitle>
              <CardDescription>
                Challenges Gemini may face and areas to work on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {GeminiTraits.negative.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 justify-center">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Astrological Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Element</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Wind className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-semibold">{GeminiDetails.element}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Intellectual, communicative, and social
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{GeminiDetails.quality}</span>
              <p className="text-sm text-muted-foreground mt-2">
                Adaptable, flexible, and changeable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ruling Planet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-purple-500" />
                <span className="text-2xl font-semibold">{GeminiDetails.rulingPlanet}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Communication and intellect
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Symbol</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{GeminiDetails.symbol} ♊</span>
              <p className="text-sm text-muted-foreground mt-2">
                Duality, versatility, and connection
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Lucky Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Colors</h4>
                <div className="flex gap-2">
                  {GeminiDetails.colors.map((color, index) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lucky Numbers</h4>
                <div className="flex gap-2">
                  {GeminiDetails.luckyNumbers.map((number, index) => (
                    <Badge key={index} variant="outline">{number}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-2">Most Compatible Signs</h4>
                <div className="grid grid-cols-2 gap-2">
                  {GeminiDetails.compatibility.map((sign, index) => (
                    <Badge key={index} variant="secondary" className="justify-center">
                      {sign}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These signs tend to harmonize well with Gemini's energy and complement their personality.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">Ready to explore your full chart?</h3>
          <p className="text-muted-foreground">
            Gemini is just one piece of your astrological puzzle. Discover how all the planets and signs work together in your birth chart.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            Get Your Full Chart Reading
          </Button>
        </div>
      </div>
    </div>
  );
};

GeminiPage.path = "/signs/gemini";