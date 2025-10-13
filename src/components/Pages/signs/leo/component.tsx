import { PageComponentType } from '@/lib/types'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import { Badge } from "@/components/ThirdParty/ShadCn/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ThirdParty/ShadCn/Card";
import { Separator } from "@/components/ThirdParty/ShadCn/Separator";
import { StarIcon, SunIcon, Flame } from "lucide-react";

const LeoTraits = {
  positive: [
    "Generous", "Warm-hearted", "Creative", "Enthusiastic", 
    "Broad-minded", "Expansive", "Faithful", "Loving"
  ],
  negative: [
    "Pompous", "Patronizing", "Bossy", "Interfering", 
    "Dogmatic", "Intolerant", "Pretentious", "Vain"
  ]
};

const LeoDetails = {
  element: "Fire",
  quality: "Fixed",
  rulingPlanet: "Sun", 
  symbol: "Lion",
  dates: "July 23 - August 22",
  colors: ["Gold", "Orange", "Yellow"],
  luckyNumbers: [1, 3, 10, 19],
  compatibility: ["Aries", "Gemini", "Libra", "Sagittarius"]
};

export const LeoPage: PageComponentType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Hero Section */}
      <HeroSection.SimpleCentered>
        <div className="container relative py-24 lg:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <SunIcon className="w-24 h-24 text-yellow-500 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <StarIcon className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {LeoDetails.dates}
              </Badge>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Leo ♌
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                The Lion - Ruled by the Sun, Leos are natural-born leaders who radiate confidence, 
                creativity, and warmth. They light up any room with their magnetic personality.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Flame className="w-4 h-4" />
                {LeoDetails.element} Sign
              </Badge>
              <Badge variant="outline">
                {LeoDetails.quality} Quality
              </Badge>
              <Badge variant="outline">
                Ruled by {LeoDetails.rulingPlanet}
              </Badge>
            </div>
          </div>
        </div>
      </HeroSection.SimpleCentered>

      {/* Content Section */}
      <div className="container py-16 space-y-16">
        {/* Personality Traits */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <StarIcon className="w-5 h-5" />
                Positive Traits
              </CardTitle>
              <CardDescription>
                Leo's natural strengths and admirable qualities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {LeoTraits.positive.map((trait, index) => (
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
                Challenges Leo may face and areas to work on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {LeoTraits.negative.map((trait, index) => (
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
                <span className="text-2xl font-semibold">{LeoDetails.element}</span>
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
              <span className="text-2xl font-semibold">{LeoDetails.quality}</span>
              <p className="text-sm text-muted-foreground mt-2">
                Determined, stable, and persistent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ruling Planet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <SunIcon className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl font-semibold">{LeoDetails.rulingPlanet}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Core self, vitality, and ego
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Symbol</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{LeoDetails.symbol} ♌</span>
              <p className="text-sm text-muted-foreground mt-2">
                Courage, strength, and leadership
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
                  {LeoDetails.colors.map((color, index) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lucky Numbers</h4>
                <div className="flex gap-2">
                  {LeoDetails.luckyNumbers.map((number, index) => (
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
                  {LeoDetails.compatibility.map((sign, index) => (
                    <Badge key={index} variant="secondary" className="justify-center">
                      {sign}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These signs tend to harmonize well with Leo's energy and complement their personality.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">Ready to explore your full chart?</h3>
          <p className="text-muted-foreground">
            Leo is just one piece of your astrological puzzle. Discover how all the planets and signs work together in your birth chart.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
            Get Your Full Chart Reading
          </Button>
        </div>
      </div>
    </div>
  );
};

LeoPage.path = "/signs/leo";