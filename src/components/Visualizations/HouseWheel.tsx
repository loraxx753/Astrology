import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { Badge } from '@/components/ThirdParty/ShadCn/Badge';

const houseData = [
  { number: 1, name: "Self", theme: "Identity & Appearance", type: "Angular", angle: 0, description: "Your personality, how others see you" },
  { number: 2, name: "Values", theme: "Money & Possessions", type: "Succedent", angle: 30, description: "Material resources, self-worth" },
  { number: 3, name: "Communication", theme: "Learning & Siblings", type: "Cadent", angle: 60, description: "How you communicate and learn" },
  { number: 4, name: "Home", theme: "Family & Roots", type: "Angular", angle: 90, description: "Family, home, emotional foundation" },
  { number: 5, name: "Pleasure", theme: "Creativity & Romance", type: "Succedent", angle: 120, description: "Creative expression, children, fun" },
  { number: 6, name: "Health", theme: "Work & Service", type: "Cadent", angle: 150, description: "Daily work, health, service to others" },
  { number: 7, name: "Partnerships", theme: "Marriage & Others", type: "Angular", angle: 180, description: "Marriage, partnerships, open enemies" },
  { number: 8, name: "Transformation", theme: "Death & Rebirth", type: "Succedent", angle: 210, description: "Transformation, shared resources" },
  { number: 9, name: "Philosophy", theme: "Higher Learning", type: "Cadent", angle: 240, description: "Higher education, philosophy, travel" },
  { number: 10, name: "Career", theme: "Reputation & Authority", type: "Angular", angle: 270, description: "Career, public image, authority" },
  { number: 11, name: "Friends", theme: "Groups & Dreams", type: "Succedent", angle: 300, description: "Friends, groups, hopes and dreams" },
  { number: 12, name: "Subconscious", theme: "Spirituality & Karma", type: "Cadent", angle: 330, description: "Subconscious, karma, hidden enemies" }
];

const typeColors = {
  "Angular": "#ef4444",    // Red - Cardinal/Angular houses
  "Succedent": "#10b981",  // Green - Fixed houses  
  "Cadent": "#3b82f6"      // Blue - Mutable houses
};

const HouseWheelVisualization: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const createHousePath = (angle: number) => {
    const startAngle = (angle - 15) * (Math.PI / 180);
    const endAngle = (angle + 15) * (Math.PI / 180);
    const outerRadius = 200;
    const innerRadius = 80;

    const x1 = Math.cos(startAngle) * innerRadius;
    const y1 = Math.sin(startAngle) * innerRadius;
    const x2 = Math.cos(startAngle) * outerRadius;
    const y2 = Math.sin(startAngle) * outerRadius;
    const x3 = Math.cos(endAngle) * outerRadius;
    const y3 = Math.sin(endAngle) * outerRadius;
    const x4 = Math.cos(endAngle) * innerRadius;
    const y4 = Math.sin(endAngle) * innerRadius;

    return `M ${x1},${y1} L ${x2},${y2} A ${outerRadius},${outerRadius} 0 0,1 ${x3},${y3} L ${x4},${y4} A ${innerRadius},${innerRadius} 0 0,0 ${x1},${y1} Z`;
  };

  const getTextPosition = (angle: number, radius: number) => {
    const radian = angle * (Math.PI / 180);
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-center text-2xl">Astrological Houses Wheel</CardTitle>
          <p className="text-purple-200 text-center">Click on any house segment to learn more</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Legend */}
            <div className="space-y-3 order-2 lg:order-1">
              <h3 className="text-white font-semibold mb-4">House Types</h3>
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-white text-sm font-medium">{type}</span>
                </div>
              ))}
            </div>

            {/* SVG Wheel */}
            <div className="order-1 lg:order-2">
              <svg width="520" height="520" viewBox="-260 -260 520 520" className="drop-shadow-lg">
                {/* Background circle */}
                <circle cx="0" cy="0" r="240" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                
                {/* House segments */}
                {houseData.map((house) => {
                  const isSelected = selectedHouse === house.number;
                  const color = typeColors[house.type as keyof typeof typeColors];
                  
                  return (
                    <g key={house.number}>
                      <path
                        d={createHousePath(house.angle)}
                        fill={color}
                        stroke="white"
                        strokeWidth="2"
                        opacity={isSelected ? 0.9 : 0.7}
                        className="cursor-pointer hover:opacity-90 transition-all duration-200"
                        onClick={() => setSelectedHouse(house.number)}
                        style={{
                          filter: isSelected ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none',
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: '0 0'
                        }}
                      />
                      
                      {/* House number */}
                      <text
                        x={getTextPosition(house.angle, 130).x}
                        y={getTextPosition(house.angle, 130).y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="18"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {house.number}
                      </text>
                      
                      {/* House name */}
                      <text
                        x={getTextPosition(house.angle, 235).x}
                        y={getTextPosition(house.angle, 235).y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="500"
                        className="pointer-events-none"
                      >
                        {house.name}
                      </text>
                    </g>
                  );
                })}
                
                {/* Center circle */}
                <circle cx="0" cy="0" r="70" fill="rgba(255,255,255,0.95)" stroke="#e5e7eb" strokeWidth="2"/>
                <text x="0" y="-10" textAnchor="middle" fill="#1f2937" fontSize="20" fontWeight="bold">
                  Astrological
                </text>
                <text x="0" y="15" textAnchor="middle" fill="#1f2937" fontSize="20" fontWeight="bold">
                  Houses
                </text>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected house details */}
      {selectedHouse && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                House {selectedHouse}: {houseData[selectedHouse - 1].name}
              </CardTitle>
              <Badge 
                style={{ backgroundColor: typeColors[houseData[selectedHouse - 1].type as keyof typeof typeColors] }}
                className="text-white"
              >
                {houseData[selectedHouse - 1].type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-purple-200 font-semibold mb-2">Theme</h4>
              <p className="text-white">{houseData[selectedHouse - 1].theme}</p>
            </div>
            <div>
              <h4 className="text-purple-200 font-semibold mb-2">Description</h4>
              <p className="text-purple-100">{houseData[selectedHouse - 1].description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* House type explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-red-500"></div>
              Angular Houses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-100 text-sm mb-2">Houses 1, 4, 7, 10</p>
            <p className="text-purple-200 text-sm">
              The most powerful houses representing major life themes and personal development. These are action-oriented areas of life.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-green-500"></div>
              Succedent Houses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-100 text-sm mb-2">Houses 2, 5, 8, 11</p>
            <p className="text-purple-200 text-sm">
              Houses of stability and resources, showing how you maintain and build upon what you have established.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-blue-500"></div>
              Cadent Houses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-100 text-sm mb-2">Houses 3, 6, 9, 12</p>
            <p className="text-purple-200 text-sm">
              Houses of learning and adaptation, representing areas of growth, change, and intellectual development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HouseWheelVisualization;