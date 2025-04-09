
import React, { useState } from 'react';
import NeuralNetwork from './NeuralNetwork';
import ResourceDashboard from './ResourceDashboard';
import UpgradePanel from './UpgradePanel';
import StoryPanel from './StoryPanel';
import LevelInfo from './LevelInfo';
import { useToast } from '@/components/ui/use-toast';

// Game context to manage global state
export const GameContext = React.createContext<{
  resources: {
    cp: number;
    it: number;
    ne: number;
  };
  level: number;
  setResources: React.Dispatch<React.SetStateAction<{
    cp: number;
    it: number;
    ne: number;
  }>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  addCP: (amount: number) => void;
  storyQueue: string[];
  addStory: (text: string) => void;
}>({
  resources: { cp: 0, it: 0, ne: 0 },
  level: 1,
  setResources: () => {},
  setLevel: () => {},
  addCP: () => {},
  storyQueue: [],
  addStory: () => {},
});

const GameContainer: React.FC = () => {
  const [resources, setResources] = useState({ cp: 0, it: 0, ne: 10 });
  const [level, setLevel] = useState(1);
  const [storyQueue, setStoryQueue] = useState<string[]>([]);
  const { toast } = useToast();

  // Function to add Computation Points
  const addCP = (amount: number) => {
    setResources(prev => {
      const newCP = prev.cp + amount;
      
      // Level up logic
      if (newCP >= 100 && level === 1) {
        toast({
          title: "Level Up!",
          description: "You've advanced to Level 2 - Algorithmic Learning",
        });
        setLevel(2);
        addStory("Alex: \"That's strange... I don't remember adding these loop structures to my code. Must be tired.\"");
      }
      
      return { ...prev, cp: newCP };
    });
  };

  // Function to add a story message
  const addStory = (text: string) => {
    setStoryQueue(prev => [...prev, text]);
  };

  return (
    <GameContext.Provider 
      value={{ 
        resources, 
        level, 
        setResources, 
        setLevel, 
        addCP,
        storyQueue,
        addStory
      }}
    >
      <div className="flex flex-col w-full min-h-screen bg-neural-dark text-neural-light">
        <header className="bg-neural-blue p-4 border-b border-neural-gray border-opacity-30">
          <h1 className="text-2xl font-bold text-neural-cyan text-center">
            Neural Nexus: <span className="text-neural-green">AI Ascension</span>
          </h1>
        </header>
        
        <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="w-full md:w-1/5 p-4 border-r border-neural-gray border-opacity-30">
            <LevelInfo />
          </div>
          
          <div className="flex flex-col flex-1">
            <div className="p-4 border-b border-neural-gray border-opacity-30">
              <ResourceDashboard />
            </div>
            
            <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
              <NeuralNetwork />
            </div>
            
            <div className="p-4 border-t border-neural-gray border-opacity-30">
              <StoryPanel />
            </div>
          </div>
          
          <div className="w-full md:w-1/4 p-4 border-l border-neural-gray border-opacity-30">
            <UpgradePanel />
          </div>
        </main>
      </div>
    </GameContext.Provider>
  );
};

export default GameContainer;
