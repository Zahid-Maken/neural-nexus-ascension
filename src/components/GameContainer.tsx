
import React, { useState } from 'react';
import NeuralNetwork from './NeuralNetwork';
import ResourceDashboard from './ResourceDashboard';
import UpgradePanel from './UpgradePanel';
import StoryPanel from './StoryPanel';
import LevelInfo from './LevelInfo';
import { Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const [resources, setResources] = useState({ cp: 10, it: 0, ne: 10 });
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
      <div className="flex flex-col w-full min-h-screen bg-black text-white">
        {/* Resource Dashboard at the top */}
        <ResourceDashboard />
        
        <main className="flex flex-1 overflow-hidden">
          {/* Level Info on the left */}
          <div className="w-1/4 max-w-xs p-4 bg-gray-900">
            <LevelInfo />

            {/* Upgrade button at bottom of sidebar */}
            <div className="mt-4">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center space-x-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md w-full">
                    <Settings className="w-5 h-5" />
                    <span>Upgrades</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-md bg-gray-900 border-gray-700 p-0">
                  <UpgradePanel />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="flex flex-col flex-1">
            {/* Neural Network takes most of the space */}
            <div className="flex-1 p-4 flex items-center justify-center">
              <NeuralNetwork />
            </div>
            
            {/* Story Panel at the bottom */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <StoryPanel />
            </div>
          </div>
        </main>
      </div>
    </GameContext.Provider>
  );
};

export default GameContainer;
