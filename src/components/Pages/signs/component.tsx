import { PageComponentType } from '@/lib/types'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import { Badge } from "@/components/ThirdParty/ShadCn/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ThirdParty/ShadCn/Card";
import { StarIcon, Flame, Mountain, Wind, Droplets } from "lucide-react";

const zodiacSigns = [
  {
    name: "Aries",
    symbol: "♈",
    emoji: "♈",
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    elementEmoji: "🔥",
    icon: <Flame className="w-8 h-8 text-red-500" />,
    gradient: "from-red-500 to-orange-500",
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
    icon: <Mountain className="w-8 h-8 text-green-500" />,
    gradient: "from-green-500 to-teal-500",
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
    icon: <Wind className="w-8 h-8 text-blue-500" />,
    gradient: "from-blue-500 to-purple-500",
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
    icon: <Droplets className="w-8 h-8 text-cyan-500" />,
    gradient: "from-cyan-500 to-blue-500",
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
    icon: <Flame className="w-8 h-8 text-yellow-500" />,
    gradient: "from-yellow-500 to-orange-500", 
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
    icon: <Mountain className="w-8 h-8 text-emerald-500" />,
    gradient: "from-emerald-500 to-green-500",
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
    icon: <Wind className="w-8 h-8 text-pink-500" />,
    gradient: "from-pink-500 to-rose-500",
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
    icon: <Droplets className="w-8 h-8 text-red-600" />,
    gradient: "from-red-600 to-purple-600",
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
    icon: <Flame className="w-8 h-8 text-orange-500" />,
    gradient: "from-orange-500 to-red-500",
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
    icon: <Mountain className="w-8 h-8 text-gray-600" />,
    gradient: "from-gray-600 to-slate-600",
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
    icon: <Wind className="w-8 h-8 text-indigo-500" />,
    gradient: "from-indigo-500 to-blue-500", 
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
    icon: <Droplets className="w-8 h-8 text-purple-500" />,
    gradient: "from-purple-500 to-indigo-500",
    description: "Compassionate, artistic, and intuitive dreamers with deep wisdom.",
    path: "/signs/pisces"
  }
];

export const SignsPage: PageComponentType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <HeroSection.SimpleCentered>
        <div className="container relative py-24 lg:py-32">
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
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {zodiacSigns.map((sign) => (
            <Card key={sign.name} className="hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {sign.icon}
                </div>
                <CardTitle className={`text-2xl bg-gradient-to-r ${sign.gradient} bg-clip-text text-transparent flex items-center justify-center gap-2`}>
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
                <p className="text-sm text-muted-foreground mb-4">
                  {sign.description}
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className={`w-full group-hover:bg-gradient-to-r group-hover:${sign.gradient} group-hover:text-white group-hover:border-transparent transition-all duration-300`}
                >
                  <a href={sign.path}>
                    Learn More
                  </a>
                </Button>
              </CardContent>
            </Card>
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
  );
};

SignsPage.path = "/signs";