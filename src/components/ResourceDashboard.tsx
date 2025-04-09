
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
    <div className="bg-black p-4 flex flex-row space-x-8">
      <div className="resource-counter">
        <Calculator className="w-5 h-5 text-white" />
        <span className="text-white font-mono">{resources.cp.toFixed(0)}</span>
        <span className="text-xs text-gray-400 font-mono">CP</span>
        {cpPerSecond > 0 && (
          <span className="text-xs text-green-400 font-mono ml-1">
            (+{cpPerSecond.toFixed(1)}/s)
          </span>
        )}
      </div>
      
      <div className="resource-counter">
        <Brain className="w-5 h-5 text-white" />
        <span className="text-white font-mono">{resources.it}</span>
        <span className="text-xs text-gray-400 font-mono">IT</span>
      </div>
      
      <div className="resource-counter">
        <Zap className="w-5 h-5 text-white" />
        <span className="text-white font-mono">{resources.ne}</span>
        <span className="text-xs text-gray-400 font-mono">NE</span>
      </div>
    </div>
  );
};

export default ResourceDashboard;
