import 'katex/dist/katex.min.css';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
// @ts-expect-error - KaTeX types might not be perfect
import { InlineMath } from 'react-katex';
import { CalculationStep } from '../../lib/services/calculations';

interface CalculationStepDisplayProps {
  step: CalculationStep;
  level?: number;
}

const CalculationStepDisplay: React.FC<CalculationStepDisplayProps> = ({ 
  step, 
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasSubSteps = step.subSteps && step.subSteps.length > 0;

  const toggleExpanded = () => {
    if (hasSubSteps) {
      setIsExpanded(!isExpanded);
    }
  };

  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div 
      className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm"
      style={{ marginLeft: paddingLeft }}
    >
      <div
        className={`p-4 ${hasSubSteps ? 'cursor-pointer hover:bg-white/5' : ''} transition-colors`}
        onClick={toggleExpanded}
      >
        <div className="flex items-start gap-3">
          {hasSubSteps && (
            <button className="flex-shrink-0 mt-1">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-white/70" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/70" />
              )}
            </button>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">
                {step.title}
              </h3>
              <div className="text-right">
                <div className="text-xl font-mono text-cyan-300">
                  {step.result}
                  {step.unit && (
                    <span className="text-sm text-white/70 ml-1">
                      {step.unit}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-white/80 text-sm mb-3 leading-relaxed">
              {step.description}
            </p>
            
            <div className="space-y-2">
              <div className="bg-black/20 p-3 rounded border border-white/10">
                <div className="text-xs text-white/60 mb-1">Formula:</div>
                <div className="text-white font-mono">
                  <InlineMath math={step.formula} />
                </div>
              </div>
              
              <div className="bg-black/20 p-3 rounded border border-white/10">
                <div className="text-xs text-white/60 mb-1">Calculation:</div>
                <div className="text-white/90 font-mono text-sm">
                  {step.calculation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {hasSubSteps && isExpanded && (
        <div className="border-t border-white/10">
          <div className="p-2 space-y-2">
            {step.subSteps!.map((subStep, index) => (
              <CalculationStepDisplay
                key={subStep.id || index}
                step={subStep}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface CalculationDetailsProps {
  steps: CalculationStep[];
  title: string;
  summary?: string;
}

export const CalculationDetails: React.FC<CalculationDetailsProps> = ({ 
  steps, 
  title, 
  summary 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-white/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            {showDetails ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                Show Calculation Steps
              </>
            )}
          </button>
        </div>

        {summary && (
          <div className="mb-6 p-4 bg-black/30 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">Result Summary</h3>
            <div className="text-white/90">{summary}</div>
          </div>
        )}

        {showDetails && (
          <div className="space-y-4">
            <div className="text-white/80 text-sm mb-4 leading-relaxed">
              This calculation uses precise astronomical algorithms to determine the Sun's position 
              in the zodiac. Each step shows the mathematical formulas and intermediate results.
            </div>
            
            {steps.map((step, index) => (
              <CalculationStepDisplay
                key={step.id || index}
                step={step}
                level={0}
              />
            ))}
            
            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <h4 className="text-white font-semibold mb-2">About These Calculations</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                These calculations are based on algorithms from "Astronomical Algorithms" by Jean Meeus, 
                which are accurate for dates between 1800-2200 CE. The Julian Day Number system provides 
                a continuous count of days that simplifies astronomical calculations across different calendar systems.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};