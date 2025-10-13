import { PageComponentType } from '@/lib/types'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import { Badge } from "@/components/ThirdParty/ShadCn/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ThirdParty/ShadCn/Card";
import { Separator } from "@/components/ThirdParty/ShadCn/Separator";
import { StarIcon, Mountain, Heart } from "lucide-react";
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';

const TaurusTraits = {
  positive: [
    "Reliable", "Patient", "Practical", "Devoted", 
    "Responsible", "Stable", "Loyal", "Determined"
  ],
  negative: [
    "Stubborn", "Possessive", "Uncompromising", "Materialistic", 
    "Lazy", "Self-indulgent", "Jealous", "Resentful"
  ]
};

const TaurusDetails = {
  element: "Earth",
  quality: "Fixed",
  rulingPlanet: "Venus", 
  symbol: "Bull",
  dates: "April 20 - May 20",
  colors: ["Green", "Pink", "Brown"],
  luckyNumbers: [2, 6, 9, 12],
  compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"]
};

export const TaurusPage: PageComponentType = () => {
  // Set the earth element background for Taurus
  usePageBackground(pageBackgrounds.earth);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection.SimpleCentered>
        <div className="container relative py-24 lg:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <Heart className="w-24 h-24 text-green-500 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <StarIcon className="w-8 h-8 text-pink-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {TaurusDetails.dates}
              </Badge>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Taurus ♉
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                The Bull - Ruled by Venus, Taurus individuals are grounded, reliable, and appreciate 
                the finer things in life. They value stability, comfort, and lasting beauty.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Mountain className="w-4 h-4" />
                {TaurusDetails.element} Sign
              </Badge>
              <Badge variant="outline">
                {TaurusDetails.quality} Quality
              </Badge>
              <Badge variant="outline">
                Ruled by {TaurusDetails.rulingPlanet}
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
                Taurus' natural strengths and admirable qualities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {TaurusTraits.positive.map((trait, index) => (
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
                Challenges Taurus may face and areas to work on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {TaurusTraits.negative.map((trait, index) => (
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
                <Mountain className="w-6 h-6 text-green-500" />
                <span className="text-2xl font-semibold">{TaurusDetails.element}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Grounded, practical, and stable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{TaurusDetails.quality}</span>
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
                <Heart className="w-6 h-6 text-pink-500" />
                <span className="text-2xl font-semibold">{TaurusDetails.rulingPlanet}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Love, beauty, and pleasure
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Symbol</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{TaurusDetails.symbol} ♉</span>
              <p className="text-sm text-muted-foreground mt-2">
                Strength, determination, and stubbornness
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
                  {TaurusDetails.colors.map((color, index) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lucky Numbers</h4>
                <div className="flex gap-2">
                  {TaurusDetails.luckyNumbers.map((number, index) => (
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
                  {TaurusDetails.compatibility.map((sign, index) => (
                    <Badge key={index} variant="secondary" className="justify-center">
                      {sign}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These signs tend to harmonize well with Taurus' energy and complement their personality.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">Ready to explore your full chart?</h3>
          <p className="text-muted-foreground">
            Taurus is just one piece of your astrological puzzle. Discover how all the planets and signs work together in your birth chart.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
            Get Your Full Chart Reading
          </Button>
        </div>
      </div>
    </div>
  );
};

TaurusPage.path = "/signs/taurus";