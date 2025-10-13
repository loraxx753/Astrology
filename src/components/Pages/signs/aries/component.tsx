import { PageComponentType } from '@/lib/types'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import { Badge } from "@/components/ThirdParty/ShadCn/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ThirdParty/ShadCn/Card";
import { Separator } from "@/components/ThirdParty/ShadCn/Separator";
import { StarIcon, Flame, Zap } from "lucide-react";
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';

const AriesTraits = {
  positive: [
    "Courageous", "Determined", "Confident", "Enthusiastic", 
    "Optimistic", "Honest", "Passionate", "Independent"
  ],
  negative: [
    "Impatient", "Moody", "Short-tempered", "Impulsive", 
    "Aggressive", "Selfish", "Competitive", "Stubborn"
  ]
};

const AriesDetails = {
  element: "Fire",
  quality: "Cardinal",
  rulingPlanet: "Mars", 
  symbol: "Ram",
  dates: "March 21 - April 19",
  colors: ["Red", "Orange", "Scarlet"],
  luckyNumbers: [1, 8, 17, 26],
  compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"]
};

export const AriesPage: PageComponentType = () => {
  // Set the fire element background for Aries
  usePageBackground(pageBackgrounds.fire);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection.SimpleCentered>
        <div className="container relative py-24 lg:py-32">
          <div className="flex flex-col items-center text-center space-y-8 bg-white/90 backdrop-blur-md rounded-2xl p-8 mx-4 sm:mx-6 lg:mx-auto max-w-4xl border border-white/20">
            <div className="relative">
              <Zap className="w-24 h-24 text-red-500 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <StarIcon className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {AriesDetails.dates}
              </Badge>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Aries ♈
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                The Ram - Ruled by Mars, Aries are pioneering leaders who charge ahead with 
                courage and determination. They are the first sign of the zodiac and natural initiators.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Flame className="w-4 h-4" />
                {AriesDetails.element} Sign
              </Badge>
              <Badge variant="outline">
                {AriesDetails.quality} Quality
              </Badge>
              <Badge variant="outline">
                Ruled by {AriesDetails.rulingPlanet}
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
                Aries' natural strengths and admirable qualities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {AriesTraits.positive.map((trait, index) => (
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
                Challenges Aries may face and areas to work on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {AriesTraits.negative.map((trait, index) => (
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
                <Flame className="w-6 h-6 text-red-500" />
                <span className="text-2xl font-semibold">{AriesDetails.element}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Passionate, energetic, and dynamic
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{AriesDetails.quality}</span>
              <p className="text-sm text-muted-foreground mt-2">
                Leadership, initiative, and new beginnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ruling Planet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-red-500" />
                <span className="text-2xl font-semibold">{AriesDetails.rulingPlanet}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Action, energy, and courage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Symbol</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{AriesDetails.symbol} ♈</span>
              <p className="text-sm text-muted-foreground mt-2">
                Courage, determination, and leadership
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
                  {AriesDetails.colors.map((color, index) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lucky Numbers</h4>
                <div className="flex gap-2">
                  {AriesDetails.luckyNumbers.map((number, index) => (
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
                  {AriesDetails.compatibility.map((sign, index) => (
                    <Badge key={index} variant="secondary" className="justify-center">
                      {sign}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These signs tend to harmonize well with Aries' energy and complement their personality.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">Ready to explore your full chart?</h3>
          <p className="text-muted-foreground">
            Aries is just one piece of your astrological puzzle. Discover how all the planets and signs work together in your birth chart.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
            Get Your Full Chart Reading
          </Button>
        </div>
      </div>
    </div>
  );
};

AriesPage.path = "/signs/aries";