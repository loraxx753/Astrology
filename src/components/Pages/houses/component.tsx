import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { Badge } from '@/components/ThirdParty/ShadCn/Badge';
import { Home, Users, MessageCircle, Heart, Crown, Briefcase, Shield, Plane, Trophy, Sparkles, Fish } from 'lucide-react';
import HouseWheelVisualization from '@/components/Visualizations/HouseWheel';

const astrologicalHouses = [
  {
    number: 1,
    name: "First House",
    title: "House of Self",
    path: "/houses/first",
    icon: Crown,
    theme: "Identity & Appearance",
    keywords: ["Self", "Identity", "Appearance", "First Impressions"],
    description: "Your personality, physical appearance, and how others perceive you at first glance.",
    gradient: "from-red-500 to-orange-500"
  },
  {
    number: 2,
    name: "Second House", 
    title: "House of Values",
    path: "/houses/second",
    icon: Trophy,
    theme: "Money & Possessions",
    keywords: ["Money", "Values", "Possessions", "Self-Worth"],
    description: "Your relationship with money, material possessions, and personal values.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    number: 3,
    name: "Third House",
    title: "House of Communication", 
    path: "/houses/third",
    icon: MessageCircle,
    theme: "Communication & Learning",
    keywords: ["Communication", "Siblings", "Learning", "Short Trips"],
    description: "How you communicate, your relationship with siblings, and everyday learning.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    number: 4,
    name: "Fourth House",
    title: "House of Home",
    path: "/houses/fourth", 
    icon: Home,
    theme: "Home & Family",
    keywords: ["Home", "Family", "Roots", "Emotions"],
    description: "Your home life, family relationships, and emotional foundation.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    number: 5,
    name: "Fifth House",
    title: "House of Pleasure",
    path: "/houses/fifth",
    icon: Heart,
    theme: "Creativity & Romance", 
    keywords: ["Creativity", "Romance", "Children", "Fun"],
    description: "Creative expression, romance, children, and what brings you joy.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    number: 6,
    name: "Sixth House",
    title: "House of Health",
    path: "/houses/sixth",
    icon: Shield,
    theme: "Health & Service",
    keywords: ["Health", "Work", "Service", "Daily Routine"],
    description: "Your health, daily work routine, and service to others.",
    gradient: "from-teal-500 to-green-500"
  },
  {
    number: 7,
    name: "Seventh House", 
    title: "House of Partnerships",
    path: "/houses/seventh",
    icon: Users,
    theme: "Relationships & Marriage",
    keywords: ["Marriage", "Partnerships", "Open Enemies", "Cooperation"],
    description: "Marriage, business partnerships, and how you relate to others one-on-one.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    number: 8,
    name: "Eighth House",
    title: "House of Transformation", 
    path: "/houses/eighth",
    icon: Sparkles,
    theme: "Death & Rebirth",
    keywords: ["Transformation", "Shared Resources", "Death", "Occult"],
    description: "Transformation, shared resources, inheritance, and deep psychological changes.",
    gradient: "from-gray-700 to-gray-900"
  },
  {
    number: 9,
    name: "Ninth House",
    title: "House of Philosophy",
    path: "/houses/ninth", 
    icon: Plane,
    theme: "Higher Learning & Travel",
    keywords: ["Philosophy", "Religion", "Higher Education", "Foreign Travel"],
    description: "Higher education, philosophy, religion, and long-distance travel.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    number: 10,
    name: "Tenth House",
    title: "House of Career", 
    path: "/houses/tenth",
    icon: Briefcase,
    theme: "Career & Reputation",
    keywords: ["Career", "Reputation", "Authority", "Public Image"],
    description: "Your career, public reputation, and relationship with authority.",
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    number: 11,
    name: "Eleventh House",
    title: "House of Friends",
    path: "/houses/eleventh",
    icon: Users,
    theme: "Friends & Goals", 
    keywords: ["Friends", "Groups", "Hopes", "Dreams"],
    description: "Friendships, group associations, hopes, and long-term goals.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    number: 12,
    name: "Twelfth House",
    title: "House of Subconscious",
    path: "/houses/twelfth",
    icon: Fish,
    theme: "Spirituality & Karma",
    keywords: ["Subconscious", "Karma", "Spirituality", "Hidden Enemies"],
    description: "The subconscious mind, karma, spirituality, and hidden aspects of life.",
    gradient: "from-purple-600 to-indigo-600"
  }
];

const HousesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Astrological Houses
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            The 12 houses represent different areas of life experience. Each house governs specific themes and shows where planetary energies manifest in your daily life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {astrologicalHouses.map((house) => {
            const IconComponent = house.icon;
            return (
              <Card 
                key={house.number}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${house.gradient}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {house.number}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg group-hover:text-purple-200 transition-colors">
                    {house.title}
                  </CardTitle>
                  <CardDescription className="text-purple-200 font-medium">
                    {house.theme}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-100 text-sm mb-3 leading-relaxed">
                    {house.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {house.keywords.map((keyword, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-xs border-purple-300 text-purple-200 bg-purple-900/30"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Interactive House Wheel */}
        <div className="mt-16">
          <HouseWheelVisualization />
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Understanding the Houses</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-100 space-y-4">
              <p>
                The astrological houses are based on the Earth's 24-hour rotation and represent different areas of life experience. 
                Unlike signs which are based on the sun's yearly journey, houses are calculated from your exact birth time and location.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Angular Houses (1, 4, 7, 10)</h3>
                  <p className="text-sm">The most powerful houses representing major life themes and personal development.</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Succedent Houses (2, 5, 8, 11)</h3>
                  <p className="text-sm">Houses of stability and resources, showing how you maintain and build upon what you have.</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Cadent Houses (3, 6, 9, 12)</h3>
                  <p className="text-sm">Houses of learning and adaptation, representing areas of growth and change.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HousesPage;