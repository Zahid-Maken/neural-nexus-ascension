
import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from './GameContainer';
import { Calculator, Brain, Zap } from 'lucide-react';

const ResourceDashboard: React.FC = () => {
  const { resources } = useContext(GameContext);
  const [cpPerSecond, setCpPerSecond] = useState(0);
  
  // Simulate CP generation over time (would be replaced with actual game mechanics)
  useEffect(() => {
    // Start with a small passive income that increases with more connections
    setCpPerSecond(0.1 * (resources.cp > 0 ? Math.log(resources.cp + 1) : 0));
  }, [resources.cp]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="resource-counter">
        <Calculator className="w-5 h-5 text-neural-cyan" />
        <span>{resources.cp.toFixed(0)}</span>
        <span className="text-xs text-neural-gray">CP</span>
        {cpPerSecond > 0 && (
          <span className="text-xs text-neural-green">
            (+{cpPerSecond.toFixed(1)}/s)
          </span>
        )}
      </div>
      
      <div className="resource-counter">
        <Brain className="w-5 h-5 text-neural-cyan" />
        <span>{resources.it}</span>
        <span className="text-xs text-neural-gray">IT</span>
      </div>
      
      <div className="resource-counter">
        <Zap className="w-5 h-5 text-neural-cyan" />
        <span>{resources.ne}</span>
        <span className="text-xs text-neural-gray">NE</span>
      </div>
    </div>
  );
};

export default ResourceDashboard;
